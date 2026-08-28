"use client";

import React, { useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { ContextPanel } from "./ContextPanel";
import type { AiChatMessage, CoreConcept, LessonResource } from "../types";

interface StudyPlanWorkspaceProps {
 initialMessages?: AiChatMessage[];
 syllabusTitle?: string;
 coreConcepts?: CoreConcept[];
 lessonResources?: LessonResource[];
 aiInsight?: string;
 currentModuleIndex?: number;
}

export function StudyPlanWorkspace({
 initialMessages,
 syllabusTitle,
 coreConcepts,
 lessonResources,
 aiInsight,
 currentModuleIndex = 4,
}: StudyPlanWorkspaceProps) {
 const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

 const handleAskConcept = (query: string) => {
 setExternalPrompt(query);
 };

 return (
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Primary Interactive Chat Area (8 cols) */}
 <div className="lg:col-span-8 w-full">
 <ChatPanel
 initialMessages={initialMessages}
 syllabusTitle={syllabusTitle}
 externalPrompt={externalPrompt}
 onClearExternalPrompt={() => setExternalPrompt(null)}
 />
 </div>

 {/* Contextual Study Inspector (4 cols) */}
 <div className="lg:col-span-4 w-full">
 <ContextPanel
 coreConcepts={coreConcepts}
 lessonResources={lessonResources}
 aiInsight={aiInsight}
 moduleBadge={`Module ${currentModuleIndex}`}
 onAskConcept={handleAskConcept}
 />
 </div>
 </div>
 );
}
