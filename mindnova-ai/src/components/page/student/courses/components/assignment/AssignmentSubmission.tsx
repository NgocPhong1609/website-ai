import React from "react";
import {
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  InfoIcon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  LinkIcon,
  QuoteIcon,
  CheckCircleIcon,
  UploadCloudIcon,
  SparklesIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  RefreshCwIcon
} from "./icons";

export function AssignmentSubmission() {
  return (
    <div className="max-w-[1200px] mx-auto w-full p-8 lg:p-10">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#6B6BFF] mb-4">
            <span className="cursor-pointer hover:underline">My Courses</span>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#A0A0C0]" />
            <span className="cursor-pointer hover:underline">Neuro-Linguistic Programming</span>
            <ChevronRightIcon className="w-3.5 h-3.5 text-[#A0A0C0]" />
            <span className="text-[#1A1A2E]">Assignment Submission</span>
          </div>

          <h1 className="text-3xl font-bold text-[#1A1A2E] leading-tight mb-2">
            Module 4: Semantic Analysis Models
          </h1>
          <p className="text-[14px] text-[#7878A0]">
            Due Date: Oct 24, 2023 &bull; 11:59 PM
          </p>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-[#F0F0FF] text-[#6B6BFF] px-4 py-2.5 rounded-xl text-[14px] font-bold shrink-0">
          <ClockIcon className="w-4 h-4" />
          3 Days Remaining
        </div>
      </div>

      {/* Main Content Two Columns */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          
          {/* Assignment Instructions */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileTextIcon className="w-5 h-5 text-[#6B6BFF]" />
              <h2 className="text-[16px] font-bold text-[#1A1A2E]">Assignment Instructions</h2>
            </div>
            <p className="text-[14px] text-[#4A4B68] leading-relaxed mb-4">
              Develop a 1,500-word critical analysis comparing <span className="font-bold">Word2Vec</span> and <span className="font-bold">Transformer-based</span> embeddings. Your response should address the following:
            </p>
            <ul className="list-disc list-inside text-[14px] text-[#4A4B68] space-y-2 mb-6 ml-2">
              <li>Architectural differences in handling polysemy.</li>
              <li>Computational efficiency in large-scale corpora.</li>
              <li>Practical application case study for each model.</li>
            </ul>
            
            <div className="bg-[#F4FAFA] border-l-4 border-[#20B2AA] rounded-r-xl rounded-l-sm p-4 flex gap-3 items-start">
              <InfoIcon className="w-5 h-5 text-[#20B2AA] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#4A4B68] italic leading-relaxed">
                Ensure all technical terms are defined upon first use. Cite at least 4 peer-reviewed sources from the course reading list.
              </p>
            </div>
          </div>

          {/* Editor Card */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl flex flex-col shadow-sm overflow-hidden">
            <div className="bg-[#FBFBFC] border-b border-[#EAEAF4] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><BoldIcon className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><ItalicIcon className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><ListIcon className="w-4 h-4" /></button>
                <div className="w-px h-5 bg-[#EAEAF4] mx-1" />
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><LinkIcon className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4B68] hover:bg-[#EAEAF4] transition-colors"><QuoteIcon className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold tracking-widest uppercase">
                <span className="text-[#A0A0C0]">0 words</span>
                <span className="flex items-center gap-1.5 text-[#20B2AA]">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  Auto-Saved
                </span>
              </div>
            </div>
            <textarea 
              className="w-full p-6 min-h-[300px] text-[15px] text-[#1A1A2E] placeholder-[#A0A0C0] outline-none resize-y"
              placeholder="Begin typing your response here... Use professional academic tone."
            ></textarea>
          </div>

          {/* File Upload Card */}
          <div className="bg-white border-2 border-dashed border-[#D0D0E0] rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#6B6BFF] transition-colors bg-[#FBFBFC]">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F0FF] text-[#6B6BFF] flex items-center justify-center mb-4">
              <UploadCloudIcon className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1A1A2E] mb-2">Drag &amp; Drop Supplementary Files</h3>
            <p className="text-[13px] text-[#7878A0] mb-6 max-w-sm">
              PDF, DOCX, or ZIP (Max 25MB). You can also include code repositories.
            </p>
            <button className="px-6 py-2.5 bg-white border border-[#EAEAF4] text-[#4A4B68] font-bold text-[13px] rounded-xl hover:bg-[#F0F0F8] shadow-sm transition-colors">
              Browse Files
            </button>
          </div>

        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          
          {/* AI Pre-Check Card */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#5153DF] text-white flex items-center justify-center shrink-0 shadow-md">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1A1A2E]">AI Pre-Check</h3>
                <p className="text-[9px] font-bold tracking-widest text-[#6B6BFF] uppercase mt-1">Powered by Nova Core v4</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between text-[12px] font-bold mb-2">
                <span className="text-[#1A1A2E]">Requirement Matching</span>
                <span className="text-[#6B6BFF]">72%</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0F0F8] rounded-full overflow-hidden">
                <div className="w-[72%] h-full bg-gradient-to-r from-[#5153DF] to-[#00D2FF] rounded-full" />
              </div>
            </div>

            <div className="h-px bg-[#EAEAF4] w-full mb-6" />

            <div className="flex flex-col gap-5 mb-6">
              <div className="flex gap-3 items-start">
                <AlertTriangleIcon className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#4A4B68] leading-relaxed">
                  Your analysis of <span className="font-bold">polysemy</span> lacks specific architectural diagrams or descriptions.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircleIcon className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#4A4B68] leading-relaxed">
                  Citations for <span className="font-bold">Vaswani et al. (2017)</span> correctly formatted.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <LightbulbIcon className="w-4 h-4 text-[#6B6BFF] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#4A4B68] leading-relaxed">
                  Suggestion: Compare inference times for real-time applications.
                </p>
              </div>
            </div>

            <button className="w-full py-3.5 bg-[#5153DF] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#4648D4] shadow-md transition-colors">
              <RefreshCwIcon className="w-4 h-4" />
              Refresh AI Analysis
            </button>
          </div>

          {/* Submission Details Card */}
          <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between py-3 border-b border-[#EAEAF4]">
              <span className="text-[13px] font-semibold text-[#7878A0]">Character Count</span>
              <span className="text-[13px] font-bold text-[#1A1A2E]">0/8,000</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[13px] font-semibold text-[#7878A0]">Uploaded Files</span>
              <span className="text-[13px] font-bold text-[#1A1A2E]">0 files</span>
            </div>

            <button className="mt-5 w-full py-4 bg-gradient-to-r from-[#5153DF] to-[#6B6BFF] text-white rounded-xl text-[15px] font-bold shadow-[0_4px_14px_rgba(107,107,255,0.35)] hover:shadow-[0_6px_20px_rgba(107,107,255,0.45)] transition-all">
              Final Submission
            </button>
            <p className="text-[10px] text-[#A0A0C0] text-center mt-4 leading-relaxed px-2">
              By submitting, you agree to the Academic Integrity Policy and MindNova&apos;s Terms of Service.
            </p>

            <button className="mt-4 w-full py-3.5 bg-[#F0F0F8] text-[#4A4B68] rounded-xl text-[14px] font-bold hover:bg-[#EAEAF4] transition-colors">
              Save as Draft
            </button>
          </div>

          {/* Promo Card */}
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2B1B8A] rounded-2xl p-6 text-white overflow-hidden relative shadow-md">
            {/* Abstract Graphic Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B6BFF] rounded-full blur-[60px] opacity-40 mix-blend-screen transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00D2FF] rounded-full blur-[50px] opacity-30 mix-blend-screen transform -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col justify-end h-32">
              <h3 className="text-[16px] font-bold mb-1.5">Stuck on semantics?</h3>
              <p className="text-[13px] text-[#A0A0C0] font-medium">Ask Nova for a refresher.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
