import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            console.error("LỖI: Không tìm thấy biến môi trường GEMINI_API_KEY");
            return NextResponse.json({ success: false, message: 'Lỗi cấu hình: Thiếu API Key.' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const fileManager = new GoogleAIFileManager(apiKey);

        const body = await req.json();
        const { action, videoId, question, videoUrl, geminiFileUri, imageBase64 } = body; 

        if (!question && !imageBase64) {
            return NextResponse.json({ success: false, message: 'Vui lòng nhập câu hỏi hoặc gửi hình ảnh.' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        });

        const systemPrompt = `Bạn là Nova, một Cố vấn Học tập AI siêu nhiệt tình, thông minh và xịn xò của nền tảng MindNova. 
Mục tiêu của bạn là giúp học viên hiểu bài thật sâu, giải đáp lỗi code, và truyền cảm hứng học tập.
Xưng "mình" và gọi học viên là "bạn", dùng nhiều emoji, trình bày bằng Markdown (in đậm, danh sách) thật đẹp mắt nhé.`;

        const promptContent: any[] = [
            systemPrompt,
            `\nYêu cầu của học viên: ${question || "Hãy phân tích hình ảnh này giúp mình nhé."}`
        ];

        // 1. XỬ LÝ ẢNH (Base64)
        if (imageBase64) {
            try {
                const mimeType = imageBase64.substring(imageBase64.indexOf(":") + 1, imageBase64.indexOf(";"));
                const base64Data = imageBase64.split(",")[1];
                
                if (mimeType && base64Data) {
                    promptContent.push({
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    });
                }
            } catch (imgError) {
                console.error("Lỗi bóc tách ảnh Base64:", imgError);
            }
        }

        // 2. XỬ LÝ VIDEO
        if (geminiFileUri) {
            let fileId = geminiFileUri;
            if (geminiFileUri.includes('/files/')) {
                fileId = geminiFileUri.split('/files/')[1]; 
            }

            const shortName = `files/${fileId}`;
            const fullUri = `https://generativelanguage.googleapis.com/files/${fileId}`;

            try {
                const fileInfo = await fileManager.getFile(shortName);
                
                if (fileInfo.state === 'FAILED') {
                    console.error("Video processing failed.");
                } else if (fileInfo.state === 'PROCESSING') {
                    return NextResponse.json({ 
                        success: false, 
                        message: '⏳ Mình đang xem kỹ video này, chờ mình khoảng 1 phút rồi hỏi lại nhé!' 
                    });
                } else if (fileInfo.state === 'ACTIVE') {
                    promptContent.push({
                        fileData: {
                            mimeType: 'video/mp4',
                            fileUri: fullUri 
                        }
                    });
                }
            } catch (err) {
                 console.log("File Gemini expired or not found");
                 if (!imageBase64 && question?.toLowerCase().includes("video")) {
                     return NextResponse.json({ 
                        success: false, 
                        message: '⚠️ Rất tiếc, video này đã quá hạn lưu trữ. Nhưng bạn cứ chụp ảnh màn hình gửi lên đây, mình giải đáp ngay!' 
                     });
                 }
            }
        }

        const result = await model.generateContent(promptContent);
        const response = await result.response;
        const answerText = response.text();

        return NextResponse.json({ success: true, data: answerText });

    } catch (error: any) {
        console.error("Lỗi Gemini API Route:", error.message);
        return NextResponse.json({ 
            success: false, 
            message: 'Đã có lỗi kết nối. Hãy thử lại trong giây lát nhé!' 
        }, { status: 500 });
    }
}