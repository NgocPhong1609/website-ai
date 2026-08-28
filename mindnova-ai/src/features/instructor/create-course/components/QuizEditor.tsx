"use client";

import { useState } from "react";
import type { DraftQuizData, DraftQuestion, DraftAnswer } from "../types";

interface QuizEditorProps {
 value?: DraftQuizData;
 onChange: (value: DraftQuizData) => void;
}

export function QuizEditor({ value, onChange }: QuizEditorProps) {
 // Initialize default structure if empty
 const [data, setData] = useState<DraftQuizData>(
 value || {
 title: "Bài kiểm tra",
 time_limit_minutes: 15,
 passing_score: 80,
 questions: [
 {
 id: Math.random().toString(36).slice(2, 9),
 content: "",
 answers: [
 { id: Math.random().toString(36).slice(2, 9), content: "", is_correct: true },
 { id: Math.random().toString(36).slice(2, 9), content: "", is_correct: false },
 ],
 },
 ],
 }
 );

 const updateData = (updates: Partial<DraftQuizData>) => {
 const newData = { ...data, ...updates };
 setData(newData);
 onChange(newData);
 };

 const addQuestion = () => {
 const newQuestion: DraftQuestion = {
 id: Math.random().toString(36).slice(2, 9),
 content: "",
 answers: [
 { id: Math.random().toString(36).slice(2, 9), content: "", is_correct: true },
 { id: Math.random().toString(36).slice(2, 9), content: "", is_correct: false },
 ],
 };
 updateData({ questions: [...data.questions, newQuestion] });
 };

 const removeQuestion = (index: number) => {
 const newQuestions = [...data.questions];
 newQuestions.splice(index, 1);
 updateData({ questions: newQuestions });
 };

 const updateQuestion = (index: number, updates: Partial<DraftQuestion>) => {
 const newQuestions = [...data.questions];
 newQuestions[index] = { ...newQuestions[index], ...updates };
 updateData({ questions: newQuestions });
 };

 const addAnswer = (qIndex: number) => {
 const q = data.questions[qIndex];
 if (q.answers.length >= 4) return;
 const newAnswers = [
 ...q.answers,
 { id: Math.random().toString(36).slice(2, 9), content: "", is_correct: false },
 ];
 updateQuestion(qIndex, { answers: newAnswers });
 };

 const removeAnswer = (qIndex: number, aIndex: number) => {
 const q = data.questions[qIndex];
 if (q.answers.length <= 2) return; // Min 2 answers
 const newAnswers = [...q.answers];
 const removed = newAnswers.splice(aIndex, 1)[0];
 
 // If we removed the correct answer, make the first one correct
 if (removed.is_correct && newAnswers.length > 0) {
 newAnswers[0].is_correct = true;
 }
 updateQuestion(qIndex, { answers: newAnswers });
 };

 const updateAnswer = (qIndex: number, aIndex: number, updates: Partial<DraftAnswer>) => {
 const q = data.questions[qIndex];
 const newAnswers = [...q.answers];
 newAnswers[aIndex] = { ...newAnswers[aIndex], ...updates };
 updateQuestion(qIndex, { answers: newAnswers });
 };

 const setCorrectAnswer = (qIndex: number, aIndex: number) => {
 const q = data.questions[qIndex];
 const newAnswers = q.answers.map((a, i) => ({
 ...a,
 is_correct: i === aIndex,
 }));
 updateQuestion(qIndex, { answers: newAnswers });
 };

 return (
 <div className="flex flex-col gap-8">
 {/* Quiz Settings */}
 <div className="flex gap-4 p-4 rounded-xl border border-[#E8E2D9] bg-[#FAFAFE]">
 <div className="flex flex-col gap-1.5 flex-1">
 <label className="text-[13px] font-semibold text-[#464554]">Thời gian làm bài (phút)</label>
 <input
 type="number"
 min="0"
 value={data.time_limit_minutes}
 onChange={(e) => updateData({ time_limit_minutes: parseInt(e.target.value) || 0 })}
 className="w-full px-3 py-2 rounded-lg text-sm border border-[#DDDDF0] focus:border-[#E8E2D9] focus:ring-2 focus:ring-[#C0392B]/20 outline-none transition-all"
 />
 </div>
 <div className="flex flex-col gap-1.5 flex-1">
 <label className="text-[13px] font-semibold text-[#464554]">Điểm cần đạt (%)</label>
 <input
 type="number"
 min="0"
 max="100"
 value={data.passing_score}
 onChange={(e) => updateData({ passing_score: parseInt(e.target.value) || 0 })}
 className="w-full px-3 py-2 rounded-lg text-sm border border-[#DDDDF0] focus:border-[#E8E2D9] focus:ring-2 focus:ring-[#C0392B]/20 outline-none transition-all"
 />
 </div>
 </div>

 {/* Questions List */}
 <div className="flex flex-col gap-6">
 {data.questions.map((q, qIndex) => (
 <div key={q.id} className="flex flex-col gap-4 p-5 rounded-2xl border border-[#E8E2D9] bg-white shadow-sm relative">
 
 {/* Delete Question Button */}
 {data.questions.length > 1 && (
 <button
 type="button"
 onClick={() => removeQuestion(qIndex)}
 className="absolute top-4 right-4 p-1.5 text-[#8A8478] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
 title="Xóa câu hỏi"
 >
 <></>
 </button>
 )}

 <div className="flex flex-col gap-1.5 pr-10">
 <label className="text-[13px] font-semibold text-[#2C3039]">Câu hỏi {qIndex + 1}</label>
 <textarea
 value={q.content}
 onChange={(e) => updateQuestion(qIndex, { content: e.target.value })}
 placeholder="Nhập nội dung câu hỏi..."
 className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#E8E2D9] focus:border-[#E8E2D9] focus:ring-2 focus:ring-[#C0392B]/20 outline-none transition-all min-h-[80px] resize-y"
 />
 </div>

 <div className="flex flex-col gap-3">
 <label className="text-[12px] font-semibold text-[#8A8478] uppercase tracking-wider">Đáp án</label>
 <div className="flex flex-col gap-2">
 {q.answers.map((a, aIndex) => (
 <div key={a.id} className="flex items-center gap-3">
 <div 
 className="shrink-0 flex items-center justify-center cursor-pointer"
 onClick={() => setCorrectAnswer(qIndex, aIndex)}
 >
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${a.is_correct ? 'border-[#4CAF50] bg-[#4CAF50]' : 'border-[#DDDDF0] hover:border-[#E8E2D9]'}`}>
 {a.is_correct && (
 <></>
 )}
 </div>
 </div>
 <input
 type="text"
 value={a.content}
 onChange={(e) => updateAnswer(qIndex, aIndex, { content: e.target.value })}
 placeholder={`Đáp án ${aIndex + 1}...`}
 className={`flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 transition-all ${a.is_correct ? 'border-[#4CAF50]/40 focus:border-[#4CAF50] focus:ring-[#4CAF50]/20 bg-[#F4FDF5]' : 'border-[#E8E2D9] focus:border-[#E8E2D9] focus:ring-[#C0392B]/20'}`}
 />
 <button
 type="button"
 onClick={() => removeAnswer(qIndex, aIndex)}
 disabled={q.answers.length <= 2}
 className="p-2 text-[#C0C0D4] hover:text-red-500 disabled:opacity-30 disabled:hover:text-[#C0C0D4] transition-colors"
 >
 <></>
 </button>
 </div>
 ))}
 </div>
 
 {q.answers.length < 4 && (
 <button
 type="button"
 onClick={() => addAnswer(qIndex)}
 className="self-start text-[13px] font-semibold text-[#C0392B] hover:text-[#C0392B] hover:underline"
 >
 + Thêm đáp án
 </button>
 )}
 </div>
 </div>
 ))}

 <button
 type="button"
 onClick={addQuestion}
 className="py-4 border-2 border-dashed border-[#DDDDF0] rounded-2xl text-[#8A8478] font-semibold text-sm hover:border-[#E8E2D9] hover:text-[#C0392B] hover:bg-[#FAF7F2] transition-all"
 >
 + Thêm câu hỏi
 </button>

 </div>
 </div>
 );
}
