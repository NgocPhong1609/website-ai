"use client";

import React from "react";
import { useManualQuizWizard } from "../hooks/useManualQuizWizard";
import { ManualConfigForm } from "./ManualConfigForm";
import { ManualQuizEditor } from "./ManualQuizEditor";
import { Step5SaveAndAttachModal } from "./Step5SaveAndAttachModal";

interface QuizManualWizardProps {
  onSuccessComplete?: (savedQuiz?: any) => void;
  initialCourseId?: number;
  initialModuleId?: number;
  initialAfterLessonId?: number;
  embeddedMode?: boolean;
}

export function QuizManualWizard({
  onSuccessComplete,
  initialCourseId,
  initialModuleId,
  initialAfterLessonId,
  embeddedMode = false,
}: QuizManualWizardProps = {}) {
  const {
    step,
    setStep,
    config,
    updateConfig,
    questions,
    isSaving,
    error,
    clearError,
    savedQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    handleSaveQuiz,
  } = useManualQuizWizard({
    initialCourseId,
    initialModuleId,
    initialAfterLessonId,
    embeddedMode,
    onSuccessComplete,
  });

  return (
    <div className={`max-w-5xl mx-auto flex flex-col gap-6 ${embeddedMode ? "p-2" : "p-4 md:p-8"}`}>
      {/* Wizard Header Progress Bar */}
      {!embeddedMode && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                📝
              </div>
              <div>
                <h1 className="text-lg font-black text-[#2C3039]">Manual Quiz Creator</h1>
                <p className="text-xs text-[#8A8478] font-semibold">Tự biên soạn câu hỏi trắc nghiệm &amp; tự luận</p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-black">
              <span className="text-indigo-600">Bước {step}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400">3</span>
            </div>
          </div>

          {/* Stepper Navigation Indicator */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { num: 1, name: "Cấu hình" },
              { num: 2, name: "Biên soạn câu hỏi" },
              { num: 3, name: "Lưu & Gắn" },
            ].map((s) => {
              const isActive = step === s.num;
              const isDone = step > s.num;

              return (
                <div key={s.num} className="flex flex-col gap-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-600"
                        : isDone
                        ? "-[#2C3039]"
                        : "bg-gray-200"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-extrabold truncate ${
                      isActive ? "text-indigo-600" : isDone ? "-[#2C3039]" : "text-gray-400"
                    }`}
                  >
                    {s.num}. {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex flex-col gap-2 shadow-xs animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <div className="flex flex-col gap-1">
                <span className="font-extrabold text-rose-900">Không thể thực hiện tác vụ</span>
                <span className="text-gray-700 font-medium">{error}</span>
              </div>
            </div>
            <button type="button" onClick={clearError} className="text-rose-400 hover:text-rose-700 font-black cursor-pointer text-sm">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Step Render Switch */}
      {step === 1 && (
        <ManualConfigForm
          config={config}
          onChangeConfig={updateConfig}
          onNext={() => setStep(2)}
          embeddedMode={embeddedMode}
        />
      )}

      {step === 2 && (
        <ManualQuizEditor
          questions={questions}
          onAddQuestion={addQuestion}
          onUpdateQuestion={updateQuestion}
          onDeleteQuestion={deleteQuestion}
          onSave={handleSaveQuiz}
          onBack={() => setStep(1)}
          isSaving={isSaving}
        />
      )}

      {!embeddedMode && step === 3 && savedQuiz && (
        <Step5SaveAndAttachModal
          quiz={savedQuiz}
          onClose={() => setStep(2)}
          onSuccessComplete={onSuccessComplete}
        />
      )}
    </div>
  );
}
