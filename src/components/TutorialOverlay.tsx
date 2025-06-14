// src/components/TutorialOverlay.tsx
import React, { useEffect, useState } from 'react';

export interface TutorialStep {
  id: number;
  description: string;
  target: string | null; // the DOM id of the slider or element to highlight
}

interface Props {
  step: TutorialStep;
  onNext: () => void;
}

export default function TutorialOverlay({ step, onNext }: Props) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!step.target) return;

    // Find the element by its id (e.g., "peep-slider")
    const el = document.getElementById(step.target);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // Position the tutorial box above the element
    setPosition({
      top: rect.top + window.scrollY - 40,         // 40px above
      left: rect.left + window.scrollX + rect.width / 2 - 100, // centered horizontally
    });
  }, [step]);

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: 200,
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '8px',
        borderRadius: '6px',
        zIndex: 9999,
      }}
    >
      <p className="mb-2">{step.description}</p>
      <button
        onClick={onNext}
        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
      >
        {step.id === 4 ? 'Finish Tutorial' : 'Next'}
      </button>
    </div>
  );
}
