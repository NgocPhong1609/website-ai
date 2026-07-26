"use client";

import { useState, useCallback } from "react";
import type { IAIFlashcard } from "@/src/types/student";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

interface UseAIFlashcardsReturn {
  flashcards: IAIFlashcard[];
  currentIndex: number;
  isFlipped: boolean;
  showExplanation: boolean;
  selectedOption: number | null;
  isGenerating: boolean;
  schemaValidated: boolean;
  generateFlashcards: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleOptionSelect: (idx: number) => void;
}

const MOCK_TRANSCRIPT_CARDS: IAIFlashcard[] = [
  {
    id: "fc-1",
    question: "What is quantum superposition?",
    options: [
      "The ability to spin in multiple directions",
      "The ability of a quantum system to be in multiple states simultaneously",
      "A fast method of data encryption",
      "The collapsing of a quantum wave function",
    ],
    correctAnswer: 1,
    explanation:
      "Superposition allows a quantum bit (qubit) to exist as a 0, 1, or both simultaneously until it is measured.",
  },
  {
    id: "fc-2",
    question: "Which term describes particles that remain connected regardless of distance?",
    options: ["Quantum entanglement", "Quantum tunneling", "Superposition", "Decoherence"],
    correctAnswer: 0,
    explanation:
      "Entanglement is a phenomenon where entangled particles remain connected such that the state of one instantly influences the other.",
  },
];

// ─── Custom Hook ──────────────────────────────────────────────────────────────

export function useAIFlashcards(): UseAIFlashcardsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<IAIFlashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [schemaValidated, setSchemaValidated] = useState(false);

  const generateFlashcards = useCallback(() => {
    setIsGenerating(true);
    setFlashcards([]);
    setIsFlipped(false);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentIndex(0);
    setSchemaValidated(false);

    console.info("[Backend Simulation] Injecting Lesson Transcript into prompt...");
    console.info("[Backend Simulation] Enforcing strict JSON return schema validation...");

    setTimeout(() => {
      // Perform automated schema integrity validation check
      const isValid = MOCK_TRANSCRIPT_CARDS.every(
        (card) =>
          typeof card.id === "string" &&
          typeof card.question === "string" &&
          Array.isArray(card.options) &&
          typeof card.correctAnswer === "number" &&
          typeof card.explanation === "string"
      );

      if (isValid) {
        console.info("[Schema Verification] ✓ JSON matches IAIFlashcard schema contract.");
        setSchemaValidated(true);
      }

      setFlashcards(MOCK_TRANSCRIPT_CARDS);
      setIsGenerating(false);
    }, 1500);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowExplanation(false);
      setSelectedOption(null);
    }
  }, [currentIndex, flashcards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setShowExplanation(false);
      setSelectedOption(null);
    }
  }, [currentIndex]);

  const handleOptionSelect = useCallback(
    (idx: number) => {
      if (selectedOption !== null) return; // Prevent changing answer
      setSelectedOption(idx);
      setIsFlipped(true);
      setTimeout(() => setShowExplanation(true), 400);
    },
    [selectedOption]
  );

  return {
    flashcards,
    currentIndex,
    isFlipped,
    showExplanation,
    selectedOption,
    isGenerating,
    schemaValidated,
    generateFlashcards,
    handleNext,
    handlePrev,
    handleOptionSelect,
  };
}
