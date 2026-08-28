"use client";

import React from "react";
import { useAiQuizWizard } from "../hooks/useAiQuizWizard";
import { Step1SourceInput } from "./Step1SourceInput";
import { Step2ConfigForm } from "./Step2ConfigForm";
import { Step3GeneratingState } from "./Step3GeneratingState";
import { Step4ReviewEditor } from "./Step4ReviewEditor";
import { Step5SaveAndAttachModal } from "./Step5SaveAndAttachModal";

export function QuizGeneratorWizard() {
 const {
 step,
 setStep,
 config,
 updateConfig,
 questions,
 isGenerating,
 isSaving,
 error,
 errorInfo,
 clearError,
 savedQuiz,
 handleGenerate,
 updateQuestion,
 approveQuestion,
 deleteQuestion,
 regenerateSingleQuestion,
 handleSaveQuiz,
 } = useAiQuizWizard();

 return (
 <div className="max-w-5xl mx-auto flex flex-col gap-6 p-4 md:p-8">
 {/* Wizard Header Progress Bar */}
 <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-sm flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-[#C0392B] text-white flex items-center justify-center text-xl font-bold shadow-md">
 🪄
 </div>
 <div>
 <h1 className="text-lg font-black text-[#2C3039]">AI Quiz Generator Co-Creator</h1>
 <p className="text-xs text-[#8A8478] font-semibold">Tạo bài kiểm tra trắc nghiệm &amp; tự luận bằng AI</p>
 </div>
 </div>

 <div className="flex items-center gap-2 font-mono text-xs font-black">
 <span className="text-[#C0392B]">Bước {step}</span>
 <span className="text-gray-300">/</span>
 <span className="text-gray-400">5</span>
 </div>
 </div>

 {/* Stepper Navigation Indicator */}
 <div className="grid grid-cols-5 gap-2 pt-2">
 {[
 { num: 1, name: "Nguồn dữ liệu" },
 { num: 2, name: "Cấu hình" },
 { num: 3, name: "AI Generate" },
 { num: 4, name: "Review & Sửa" },
 { num: 5, name: "Lưu & Gắn" },
 ].map((s) => {
 const isActive = step === s.num;
 const isDone = step > s.num;

 return (
 <div key={s.num} className="flex flex-col gap-1">
 <div
 className={`h-1.5 rounded-full transition-all duration-300 ${
 isActive
 ? "bg-[#C0392B]"
 : isDone
 ? "-[#2C3039]"
 : "bg-gray-200"
 }`}
 />
 <span
 className={`text-[10px] font-extrabold truncate ${
 isActive ? "text-[#C0392B]" : isDone ? "-[#2C3039]" : "text-gray-400"
 }`}
 >
 {s.num}. {s.name}
 </span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Error Alert Banner */}
 {error && (
 <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex flex-col gap-2 shadow-xs animate-fadeIn">
 <div className="flex items-start justify-between gap-3">
 <div className="flex items-start gap-2">
 <span className="text-base">️</span>
 <div className="flex flex-col gap-1">
 <span className="font-extrabold text-rose-900">Không thể tạo đề kiểm tra</span>
 <span className="text-gray-700 font-medium">{error}</span>
 {errorInfo?.errorCode && (
 <div className="mt-1.5 flex items-center gap-2 flex-wrap">
 <span className="px-2.5 py-0.5 rounded-md bg-rose-100 border border-rose-200 text-rose-800 font-mono text-[11px] font-black">
 Mã lỗi: {errorInfo.errorCode}
 </span>
 <button
 type="button"
 onClick={() => {
 clearError();
 handleGenerate();
 }}
 disabled={isGenerating}
 className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-extrabold shadow-2xs transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
 >
 <span> Thử lại</span>
 </button>
 </div>
 )}
 </div>
 </div>
 <button type="button" onClick={clearError} className="text-rose-400 hover:text-rose-700 font-black cursor-pointer text-sm">
 
 </button>
 </div>
 </div>
 )}

 {/* Step Render Switch */}
 {step === 1 && (
 <Step1SourceInput
 config={config}
 onChangeConfig={updateConfig}
 onNext={() => setStep(2)}
 />
 )}

 {step === 2 && (
 <Step2ConfigForm
 config={config}
 onChangeConfig={updateConfig}
 onBack={() => setStep(1)}
 onGenerate={handleGenerate}
 isGenerating={isGenerating}
 />
 )}

 {step === 3 && isGenerating && (
 <Step3GeneratingState />
 )}

 {step === 4 && (
 <Step4ReviewEditor
 questions={questions}
 onUpdateQuestion={updateQuestion}
 onApproveQuestion={approveQuestion}
 onDeleteQuestion={deleteQuestion}
 onRegenerateQuestion={regenerateSingleQuestion}
 onRegenerateAll={handleGenerate}
 onSave={handleSaveQuiz}
 onBack={() => setStep(2)}
 isSaving={isSaving}
 />
 )}

 {step === 5 && savedQuiz && (
 <Step5SaveAndAttachModal
 quiz={savedQuiz}
 onClose={() => setStep(4)}
 />
 )}
 </div>
 );
}
