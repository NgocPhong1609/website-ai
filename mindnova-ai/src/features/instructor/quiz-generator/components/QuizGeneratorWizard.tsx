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
      <div className="bg-white rounded-3xl p-6 border border-[#EAEAF4] shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center text-xl font-bold shadow-md">
              🪄
            </div>
            <div>
              <h1 className="text-lg font-black text-[#1A1A2E]">AI Quiz Generator Co-Creator</h1>
              <p className="text-xs text-gray-500 font-semibold">Tạo bài kiểm tra trắc nghiệm &amp; tự luận bằng AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-black">
            <span className="text-[#4F46E5]">Bước {step}</span>
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
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
                      : isDone
                      ? "bg-emerald-500"
                      : "bg-gray-200"
                  }`}
                />
                <span
                  className={`text-[10px] font-extrabold truncate ${
                    isActive ? "text-[#4F46E5]" : isDone ? "text-emerald-600" : "text-gray-400"
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
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span>⚠️ {error}</span>
          <button type="button" onClick={clearError} className="text-red-500 hover:text-red-800 font-extrabold cursor-pointer">
            ✕
          </button>
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
