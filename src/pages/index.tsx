// src/pages/index.tsx - MOBILE OPTIMIZED VERSION WITH PEDIATRIC SUPPORT

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { LEARNING_PATHS } from '../data/learningPaths';
import TutorialOverlay, { TutorialStep } from '../components/TutorialOverlay';

// Properly type the Plot component
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any;

// ─── INTERFACES ────────────────────────────────────────────────────────────
interface Scenario {
  id: string;
  name: string;
  description: string;
  pathology: string;
  patientType?: string;
  patientWeight?: number;
  patientAge?: number;
  initialParams: {
    peep: number;
    pip: number;
    rr: number;
    ieRatio: number;
    riseTime: number;
    mode: string;
  };
  quiz?: {
    question: string;
    choices: string[];
    correctAnswer: string;
    hint: string;
  };
  assessment?: {
    targetTV: number;
    targetPlateauMax: number;
    hint: string;
  };
}

export default function Home() {
  // ─── 0. THEME STATE ────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState<boolean>(true);

  // ─── 1. VENTILATOR PARAMETERS ──────────────────────────────────────────────
  const [peep, setPeep] = useState<number>(5);
  const [pip, setPip] = useState<number>(30);
  const [rr, setRR] = useState<number>(12);
  const [ieRatio, setIERatio] = useState<number>(1);
  const [riseTime, setRiseTime] = useState<number>(0.3);
  const [mode, setMode] = useState<string>('volume');
  const [condition, setCondition] = useState<string>('normal');

  // ─── 1b. CAPNOGRAPHY PARAMETERS ────────────────────────────────────────────
  const [etco2Max, setEtco2Max] = useState<number>(40);

  // ─── 1c. PATIENT DEMOGRAPHICS ──────────────────────────────────────────────
  const [patientType, setPatientType] = useState<string>('adult');
  const [patientWeight, setPatientWeight] = useState<number>(70); // kg
  const [patientAge, setPatientAge] = useState<number>(30); // years

  // ─── 2. HIGH/LOW PRESSURE ALARM THRESHOLDS ─────────────────────────────────
  const [highPressLimit, setHighPressLimit] = useState<number>(35);
  const [lowPressLimit, setLowPressLimit] = useState<number>(5);

  // ─── 3. ANIMATION STATE ────────────────────────────────────────────────────
  const [phase, setPhase] = useState<number>(0);
  const [breathStep, setBreathStep] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(true);

  // ─── 4. ANNOTATIONS & ALARM LOG ─────────────────────────────────────────────
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [alarmLog, setAlarmLog] = useState<any[]>([]);
  const prevAutoPEEP = useRef<boolean>(false);
  const prevHighPress = useRef<boolean>(false);
  const prevLowPress = useRef<boolean>(false);

  // ─── 5. LEARNING PATH STATE ────────────────────────────────────────────────
  const [currentLevelKey, setCurrentLevelKey] = useState<string>('beginner');
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  // ─── 6. MOBILE UI STATE ────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<string>('controls');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // ─── 7. KONAMI CODE EASTER EGG ─────────────────────────────────────────────
  // Classic cheat code: ↑↑↓↓←→←→BA - Unlocks all scenarios for development/testing
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [konamiUnlocked, setKonamiUnlocked] = useState<boolean>(false);
  const [showKonamiMessage, setShowKonamiMessage] = useState<boolean>(false);
  
  // ─── 8. MEDICAL DISCLAIMER STATE ───────────────────────────────────────────
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  
  const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  // ─── PEDIATRIC CATEGORIES ──────────────────────────────────────────────────
  const PEDIATRIC_CATEGORIES = {
    neonate: { label: 'Neonate (0-28 days)', weightRange: [0.5, 4], ageRange: [0, 0.08], tvPerKg: [4, 6] },
    infant: { label: 'Infant (1-12 months)', weightRange: [3, 12], ageRange: [0.08, 1], tvPerKg: [5, 7] },
    toddler: { label: 'Toddler (1-3 years)', weightRange: [10, 15], ageRange: [1, 3], tvPerKg: [6, 8] },
    preschool: { label: 'Preschool (3-6 years)', weightRange: [14, 20], ageRange: [3, 6], tvPerKg: [6, 8] },
    schoolAge: { label: 'School Age (6-12 years)', weightRange: [20, 40], ageRange: [6, 12], tvPerKg: [6, 8] },
    adolescent: { label: 'Adolescent (12-18 years)', weightRange: [40, 70], ageRange: [12, 18], tvPerKg: [6, 8] },
    adult: { label: 'Adult (18+ years)', weightRange: [50, 120], ageRange: [18, 100], tvPerKg: [6, 8] }
  };

  // ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

  // Get recommended parameter ranges based on patient type
  const getParameterRanges = (patientType: string, weight: number) => {
    const category = PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES];
    
    if (patientType === 'adult') {
      return {
        peepRange: [3, 20],
        pipRange: [15, 50],
        rrRange: [8, 30],
        tvRange: [400, 800],
        ieRange: [0.2, 3.0]
      };
    }
    
    // Pediatric ranges
    const tvTarget = weight * category.tvPerKg[1]; // Use upper range for calculation
    return {
      peepRange: [3, 12],
      pipRange: [12, 30],
      rrRange: patientType === 'neonate' ? [30, 60] : 
               patientType === 'infant' ? [20, 40] :
               patientType === 'toddler' ? [20, 30] : [15, 25],
      tvRange: [Math.round(weight * category.tvPerKg[0]), Math.round(weight * category.tvPerKg[1])],
      ieRange: [0.3, 2.0]
    };
  };

  // Calculate weight-based tidal volume for pediatrics
  const calculateTidalVolume = (pip: number, peep: number, patientType: string, weight: number) => {
    if (patientType === 'adult') {
      // Keep your existing adult calculation
      return Math.round(((pip - peep) * 18) / 10) * 10;
    } else {
      // Pediatric calculation based on weight
      const category = PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES];
      const baseTV = weight * 6; // 6 mL/kg as baseline
      const pressureAdjustment = (pip - peep) * 0.5; // Smaller adjustment factor for peds
      const calculatedTV = Math.round((baseTV + pressureAdjustment) / 5) * 5; // Round to nearest 5mL
      
      // Ensure it stays within safe ranges
      const minTV = weight * category.tvPerKg[0];
      const maxTV = weight * category.tvPerKg[1];
      return Math.max(minTV, Math.min(maxTV, calculatedTV));
    }
  };

  // Get age-appropriate respiratory rate
  const getRecommendedRR = (patientType: string) => {
    switch (patientType) {
      case 'neonate': return 40;
      case 'infant': return 30;
      case 'toddler': return 25;
      case 'preschool': return 22;
      case 'schoolAge': return 20;
      case 'adolescent': return 16;
      default: return 12;
    }
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ─── KONAMI CODE LISTENER ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
        return;
      }

      setKonamiSequence(prev => {
        const newSequence = [...prev, event.code];
        
        // Keep only the last 10 key presses (length of Konami code)
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }
        
        // Check if the sequence matches the Konami code
        if (newSequence.length === KONAMI_CODE.length) {
          const matches = KONAMI_CODE.every((code, index) => code === newSequence[index]);
          
          if (matches && !konamiUnlocked) {
            setKonamiUnlocked(true);
            setShowKonamiMessage(true);
            
            // Get all scenario IDs from all learning paths
            const allScenarioIds: string[] = [];
            LEARNING_PATHS.forEach(path => {
              path.scenarios.forEach(scenario => {
                allScenarioIds.push(scenario.id);
              });
            });
            
            // Unlock all scenarios
            setCompletedScenarios(allScenarioIds);
            
            // Hide the message after specified time (currently 3 seconds)
            // CUSTOMIZE DURATION HERE: Change 3000 to any milliseconds value
            setTimeout(() => setShowKonamiMessage(false), 5000); // 5 seconds
            
            // Clear the sequence
            return [];
          }
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiUnlocked]);

  // Load Konami unlock status from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const konamiStatus = localStorage.getItem('lungIQ-konami');
      if (konamiStatus === 'unlocked') {
        setKonamiUnlocked(true);
        // Get all scenario IDs and unlock them
        const allScenarioIds: string[] = [];
        LEARNING_PATHS.forEach(path => {
          path.scenarios.forEach(scenario => {
            allScenarioIds.push(scenario.id);
          });
        });
        setCompletedScenarios(allScenarioIds);
      }
    }
  }, []);

  // Save Konami unlock status to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && konamiUnlocked) {
      localStorage.setItem('lungIQ-konami', 'unlocked');
    }
  }, [konamiUnlocked]);

  // Only read from localStorage on the client:
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('lungIQ-level');
      const savedCompleted = localStorage.getItem('lungIQ-completed');
      const disclaimerStatus = localStorage.getItem('lungIQ-disclaimer-accepted');

      if (savedLevel) {
        setCurrentLevelKey(savedLevel);
      }
      if (savedCompleted) {
        try {
          setCompletedScenarios(JSON.parse(savedCompleted));
        } catch {
          setCompletedScenarios([]);
        }
      }
      if (disclaimerStatus === 'true') {
        setDisclaimerAccepted(true);
      }
    }
  }, []);

  // Write changes back to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lungIQ-level', currentLevelKey);
    }
  }, [currentLevelKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lungIQ-completed', JSON.stringify(completedScenarios));
    }
  }, [completedScenarios]);

  const currentLevel = LEARNING_PATHS.find((lp) => lp.key === currentLevelKey)!;
  const availableScenarios = currentLevel.scenarios;

  // ─── RESET PROGRESS BUTTON ─────────────────────────────────────────────────
  const resetProgressButton = (
    <button
      onClick={() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lungIQ-level');
          localStorage.removeItem('lungIQ-completed');
          localStorage.removeItem('lungIQ-konami');
          localStorage.removeItem('lungIQ-disclaimer-accepted');
        }
        setCurrentLevelKey('beginner');
        setCompletedScenarios([]);
        setKonamiUnlocked(false);
        setShowKonamiMessage(false);
        setDisclaimerAccepted(false);
      }}
      className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 text-sm md:text-base"
    >
      Reset All Progress
    </button>
  );

  // ─── TUTORIAL STATE ────────────────────────────────────────────────────────
  const [tutorialActive, setTutorialActive] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  const TUTORIAL_STEPS: TutorialStep[] = [
    {
      id: 1,
      description: "Welcome! Let's learn the basics of PEEP and PIP sliders.",
      target: 'peep-slider',
    },
    {
      id: 2,
      description: "This is the PIP slider. Notice how raising PIP changes peak pressure.",
      target: 'pip-slider',
    },
    {
      id: 3,
      description: "Now raise I:E ratio to 2:1 and observe how inspiration lengthens.",
      target: 'ie-slider',
    },
    {
      id: 4,
      description: "Excellent! Tutorial complete.",
      target: null,
    },
  ];

  // ─── QUIZ & ASSESSMENT STATE ───────────────────────────────────────────────
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);

  // ─── WAVEFORM GENERATION (keeping your existing functions) ─────────────────
  const generateClinicalWaveform = (
    type: 'pressure' | 'flow' | 'volume',
    rr: number,
    peep: number,
    pip: number,
    ieRatio: number,
    phase = 0,
    condition = 'normal',
    riseTime = 0.3,
    mode = 'volume',
    breathStep = 0
  ) => {
    const breathLength = 100;
    const cycle = Array.from({ length: breathLength }, (_, i) => i);
    const inspTime = breathLength * (ieRatio / (1 + ieRatio));
    let y: number[];

    let resistanceFactor = 1;
    let complianceFactor = 1;
    switch (condition) {
      case 'ards':
        complianceFactor = 0.4;
        break;
      case 'copd':
        resistanceFactor = 2;
        break;
      case 'asthma':
        resistanceFactor = 3;
        break;
      case 'pneumothorax':
        complianceFactor = 0.3;
        break;
    }
    if (condition === 'weaning_failure' && breathStep >= 30) rr = 28;

    switch (type) {
      case 'pressure': {
        const riseTimeSteps = inspTime * riseTime;
        y = cycle.map((i) => {
          if (mode === 'pressure' || mode === 'support') {
            if (i < riseTimeSteps) {
              return peep + ((pip - peep) * (i / riseTimeSteps));
            }
            if (i < inspTime) {
              return pip;
            }
            return peep;
          }
          return peep + (pip - peep) * (i < inspTime ? i / inspTime : 0);
        });
        break;
      }
      case 'flow': {
        const triggered = Math.random() < 0.1 && mode === 'support';
        const flowRate = pip * 0.8 * complianceFactor;
        y = cycle.map((i) => {
          if (triggered && i < inspTime / 2) return flowRate / 2;
          if (i < inspTime) return flowRate;
          const expPhase = (i - inspTime) / (breathLength - inspTime);
          const decay = -flowRate * Math.exp(-3 * expPhase * resistanceFactor);
          return Math.abs(decay) < 0.5 ? 0 : decay;
        });
        break;
      }
      case 'volume': {
        const flowData = generateClinicalWaveform(
          'flow',
          rr,
          peep,
          pip,
          ieRatio,
          phase,
          condition,
          riseTime,
          mode,
          breathStep
        );
        let cumVolume = 0;
        const deltaT = (60 / rr) / breathLength;
        y = flowData.y.map((flowValue) => {
          cumVolume += flowValue * deltaT * 1000;
          return cumVolume;
        });
        break;
      }
      default:
        y = cycle.map((i) => Math.sin(i / 10));
    }
    return {
      x: cycle,
      y: y.map((_, i) => y[(i + phase) % y.length]),
    };
  };

  const generateCapnographyWaveform = (
    rr: number,
    ieRatio: number,
    etco2Max: number,
    phase = 0
  ): { x: number[]; y: number[] } => {
    const breathLength = 100;
    const cycle = Array.from({ length: breathLength }, (_, i) => i);
    const inspTime = breathLength * (ieRatio / (1 + ieRatio));
    const expTime = breathLength - inspTime;

    const riseTimeExp = expTime * 0.15;
    const plateauTimeExp = expTime * 0.7;
    const fallTimeExp = expTime - riseTimeExp - plateauTimeExp;

    const raw: number[] = cycle.map((i) => {
      if (i < inspTime) {
        return 0;
      }
      const expIndex = i - inspTime;
      if (expIndex < riseTimeExp) {
        return etco2Max * (expIndex / riseTimeExp);
      }
      if (expIndex < riseTimeExp + plateauTimeExp) {
        return etco2Max;
      }
      if (expIndex < riseTimeExp + plateauTimeExp + fallTimeExp) {
        return (
          etco2Max *
          (1 - (expIndex - riseTimeExp - plateauTimeExp) / fallTimeExp)
        );
      }
      return 0;
    });

    const yShifted = raw.map((_, i) => raw[(i + phase) % raw.length]);
    return { x: cycle, y: yShifted };
  };

  // ─── MEMOIZE WAVEFORMS ─────────────────────────────────────────────────────
  const pressure = useMemo(
    () =>
      generateClinicalWaveform(
        'pressure',
        rr,
        peep,
        pip,
        ieRatio,
        phase,
        condition,
        riseTime,
        mode,
        breathStep
      ),
    [rr, peep, pip, ieRatio, phase, condition, riseTime, mode, breathStep]
  );

  const flow = useMemo(
    () =>
      generateClinicalWaveform(
        'flow',
        rr,
        peep,
        pip,
        ieRatio,
        phase,
        condition,
        riseTime,
        mode,
        breathStep
      ),
    [rr, peep, pip, ieRatio, phase, condition, riseTime, mode, breathStep]
  );

  const volume = useMemo(
    () =>
      generateClinicalWaveform(
        'volume',
        rr,
        peep,
        pip,
        ieRatio,
        phase,
        condition,
        riseTime,
        mode,
        breathStep
      ),
    [rr, peep, pip, ieRatio, phase, condition, riseTime, mode, breathStep]
  );

  const capnography = useMemo(
    () => generateCapnographyWaveform(rr, ieRatio, etco2Max, phase),
    [rr, ieRatio, etco2Max, phase]
  );

  // ─── DERIVED METRICS ───────────────────────────────────────────────────────
  const tidalVolume = calculateTidalVolume(pip, peep, patientType, patientWeight);
  const minuteVent = ((tidalVolume * rr) / 1000).toFixed(2);
  const plateau = pip - 2;

  // Get current parameter ranges
  const parameterRanges = getParameterRanges(patientType, patientWeight);

  // ─── AUTO-PEEP DETECTION & ANIMATION ──────────────────────────────────────
  const endFlowSegment = flow.y.slice(-5);
  const autoPEEP = endFlowSegment.every((v) => v > 2);

  useEffect(() => {
    const interval = setInterval(() => {
      if (running) {
        setPhase((prev) => (prev + 1) % 100);
        setBreathStep((prev) => (prev + 1) % 1000000);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [running]);

  // ─── ALARM EFFECTS (keeping existing logic) ───────────────────────────────
  useEffect(() => {
    if (autoPEEP && !prevAutoPEEP.current) {
      setAlarmLog((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          alarm: 'Auto-PEEP suspected: Expiratory flow not returning to zero',
          severity: 'warning',
        },
      ]);
    }
    prevAutoPEEP.current = autoPEEP;
  }, [autoPEEP]);

  // ─── HIGH PRESSURE ALARM LOOP ──────────────────────────────────────────────
  useEffect(() => {
    const currentPressure = Math.max(...pressure.y);
    const highPressAlarm = currentPressure > highPressLimit;
    
    if (highPressAlarm && !prevHighPress.current) {
      setAlarmLog((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          alarm: `High Pressure Alarm: ${currentPressure.toFixed(1)} cmH₂O (Limit: ${highPressLimit})`,
          severity: 'critical',
        },
      ]);
    }
    prevHighPress.current = highPressAlarm;
  }, [pressure.y, highPressLimit]);

  // ─── LOW PRESSURE ALARM LOOP ───────────────────────────────────────────────
  useEffect(() => {
    const currentPressure = Math.min(...pressure.y);
    const lowPressAlarm = currentPressure < lowPressLimit;
    
    if (lowPressAlarm && !prevLowPress.current) {
      setAlarmLog((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          alarm: `Low Pressure Alarm: ${currentPressure.toFixed(1)} cmH₂O (Limit: ${lowPressLimit})`,
          severity: 'critical',
        },
      ]);
    }
    prevLowPress.current = lowPressAlarm;
  }, [pressure.y, lowPressLimit]);

  // ─── MOBILE-OPTIMIZED PLOTLY LAYOUT ───────────────────────────────────────
  const mobileOptimizedLayout = (
    title: string,
    yTitle?: string,
    options: any = {}
  ) => ({
    title: {
      text: title,
      font: { size: isMobile ? 14 : 16 }
    },
    height: isMobile ? 200 : 250,
    margin: { 
      t: isMobile ? 30 : 40, 
      l: isMobile ? 40 : 50, 
      r: isMobile ? 10 : 20, 
      b: isMobile ? 30 : 40 
    },
    paper_bgcolor: isDark ? '#0f172a' : '#ffffff',
    plot_bgcolor: isDark ? '#0f172a' : '#f8f8f8',
    font: { 
      color: isDark ? '#fff' : '#000',
      size: isMobile ? 10 : 12
    },
    yaxis: { 
      title: yTitle,
      titlefont: { size: isMobile ? 10 : 12 }
    },
    xaxis: {
      ...options.xaxis,
      titlefont: { size: isMobile ? 10 : 12 }
    },
    showlegend: false,
    hovermode: 'closest',
    autosize: true,
    // Mobile-specific touch optimizations
    dragmode: isMobile ? 'pan' : 'zoom',
    scrollZoom: !isMobile,
  });

  // ─── PLOT DATA HELPER ──────────────────────────────────────────────────────
  const createPlotData = (x: number[], y: number[], color: string, width = 2) => [{
    x,
    y,
    type: 'scatter' as const,
    mode: 'lines' as const,
    line: { color, width }
  }];

  const plotConfig = {
    displayModeBar: !isMobile,
    responsive: true,
    ...(isMobile && { touchBehavior: 'auto' }),
  };

  // ─── MOBILE SECTION NAVIGATION ────────────────────────────────────────────
  const sections = [
    { id: 'controls', label: 'Controls', icon: '⚙️' },
    { id: 'waveforms', label: 'Waveforms', icon: '📊' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'alarms', label: 'Alarms', icon: '🚨' },
  ];

  // ─── UTILITY FUNCTIONS (keeping existing logic) ───────────────────────────
  function loadScenario(scenario: Scenario) {
    // Load ventilator parameters
    setPeep(scenario.initialParams.peep);
    setPip(scenario.initialParams.pip);
    setRR(scenario.initialParams.rr);
    setIERatio(scenario.initialParams.ieRatio);
    setRiseTime(scenario.initialParams.riseTime);
    setMode(scenario.initialParams.mode);
    setCondition(scenario.pathology);

    // Load patient demographics if specified
    if (scenario.patientType) {
      setPatientType(scenario.patientType);
    }
    if (scenario.patientWeight) {
      setPatientWeight(scenario.patientWeight);
    }
    if (scenario.patientAge) {
      setPatientAge(scenario.patientAge);
    }

    // Clear previous session data
    setAlarmLog([]);
    setAnnotations([]);
    setQuizAnswer('');
    setSelectedChoice('');
    setScore(0);
    setAttempts(0);
    setCurrentQuiz(null);
    setCurrentAssessment(null);

    if (scenario.quiz) {
      setCurrentQuiz({
        question: scenario.quiz.question,
        correctAnswer: scenario.quiz.correctAnswer.toLowerCase(),
        choices: scenario.quiz.choices,
        answered: false,
        isCorrect: null,
        scenarioId: scenario.id,
        hint: scenario.quiz.hint,
      });
    }

    if (scenario.assessment) {
      setCurrentAssessment({
        targetTV: scenario.assessment.targetTV,
        targetPlateauMax: scenario.assessment.targetPlateauMax,
        passed: null,
        scenarioId: scenario.id,
        hint: scenario.assessment.hint,
      });
    }
  }

  const handleExportSession = () => {
    const sessionData = {
      parameters: { peep, pip, rr, ieRatio, riseTime, mode, condition, etco2Max },
      patient: { patientType, patientWeight, patientAge },
      thresholds: { highPressLimit, lowPressLimit },
      quiz: currentQuiz,
      assessment: currentAssessment,
      alarms: alarmLog,
      annotations,
      progress: {
        currentLevel: currentLevelKey,
        completedScenarios,
        konamiUnlocked, // Include developer mode status
      },
      disclaimer: {
        notice: "This data is from an educational simulator and should not be used for clinical decisions",
        timestamp: new Date().toISOString(),
        educational_use_only: true
      },
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lungiq-session-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── DISCLAIMER ACCEPTANCE HANDLER ─────────────────────────────────────────
  const handleDisclaimerAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lungIQ-disclaimer-accepted', 'true');
    }
    setDisclaimerAccepted(true);
  };

  // ─── STYLING CLASSES ──────────────────────────────────────────────────────
  const bgColorClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const sectionBg = isDark ? 'bg-[#0f172a]' : 'bg-[#e2e8f0]';
  const labelText = isDark ? 'text-white' : 'text-black';
  const valueText = isDark ? 'text-green-300' : 'text-green-700';
  const inputBg = isDark
    ? 'bg-gray-800 text-white border-gray-600'
    : 'bg-white text-black border-gray-300';

  return (
    <div className={`${bgColorClass} w-full min-h-screen`}>
      {/* ─── MOBILE NAVIGATION BAR ──────────────────────────────────────────── */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-600 z-50">
          <div className="flex justify-around py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center py-2 px-3 rounded ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-xs mt-1">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT WITH MOBILE PADDING ──────────────────────────────── */}
      <div className={`${isMobile ? 'pb-20' : ''} p-2 md:p-4`}>
        
        {/* ─── TOP BAR ─────────────────────────────────────────────────────── */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h1 className={`text-lg md:text-2xl font-bold ${labelText} text-center sm:text-left`}>
            Lung IQ: Clinical Waveform Simulator
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDark((d) => !d)}
              className={`px-3 py-2 rounded text-sm ${
                isDark ? 'bg-gray-300 text-black' : 'bg-gray-800 text-white'
              }`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleExportSession}
              className="px-3 py-2 rounded bg-blue-500 text-white text-sm"
            >
              📁 Export
            </button>
          </div>
        </div>

        {/* ─── CONTROLS SECTION ───────────────────────────────────────────── */}
        {(!isMobile || activeSection === 'controls') && (
          <div className="w-full mb-6">
            <h2 className={`text-lg font-semibold mb-4 ${labelText} ${isMobile ? 'text-center' : ''}`}>
              Ventilator Controls
            </h2>
            
            {/* ─── PATIENT DEMOGRAPHICS SECTION ─────────────────────────────── */}
            <div className={`p-4 ${sectionBg} rounded mb-6`}>
              <h3 className={`font-semibold mb-3 ${labelText}`}>Patient Demographics</h3>
              
              <div className={`space-y-4 ${isMobile ? '' : 'grid grid-cols-1 md:grid-cols-3 gap-4'}`}>
                
                {/* Patient Type Selection */}
                <div>
                  <label className={`block ${labelText} font-medium mb-2`}>Patient Type:</label>
                  <select
                    className={`w-full px-3 py-3 rounded border ${inputBg} ${isMobile ? 'text-lg' : ''}`}
                    value={patientType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setPatientType(newType);
                      
                      // Auto-set typical weight and age for selected category
                      const category = PEDIATRIC_CATEGORIES[newType as keyof typeof PEDIATRIC_CATEGORIES];
                      const avgWeight = (category.weightRange[0] + category.weightRange[1]) / 2;
                      const avgAge = (category.ageRange[0] + category.ageRange[1]) / 2;
                      
                      setPatientWeight(Math.round(avgWeight));
                      setPatientAge(Math.round(avgAge * 10) / 10);
                      
                      // Auto-adjust ventilator settings for patient type
                      setRR(getRecommendedRR(newType));
                      
                      // Adjust PEEP and PIP to reasonable ranges
                      const ranges = getParameterRanges(newType, avgWeight);
                      if (peep > ranges.peepRange[1]) setPeep(ranges.peepRange[1]);
                      if (pip > ranges.pipRange[1]) setPip(ranges.pipRange[1]);
                      if (peep < ranges.peepRange[0]) setPeep(ranges.peepRange[0]);
                      if (pip < ranges.pipRange[0]) setPip(ranges.pipRange[0]);
                    }}
                  >
                    {Object.entries(PEDIATRIC_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>{category.label}</option>
                    ))}
                  </select>
                </div>

                {/* Weight Input */}
                <div>
                  <label className={`block ${labelText} font-medium mb-2`}>
                    Weight: <span className={`${valueText} font-semibold`}>{patientWeight} kg</span>
                  </label>
                  <input
                    type="range"
                    min={PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES].weightRange[0]}
                    max={PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES].weightRange[1]}
                    step="0.5"
                    value={patientWeight}
                    onChange={(e) => setPatientWeight(Number(e.target.value))}
                    className={`w-full h-8 ${isMobile ? 'h-12' : ''} appearance-none bg-gray-300 rounded-lg cursor-pointer`}
                  />
                </div>

                {/* Age Input */}
                <div>
                  <label className={`block ${labelText} font-medium mb-2`}>
                    Age: <span className={`${valueText} font-semibold`}>
                      {patientType === 'neonate' ? `${Math.round(patientAge * 365)} days` : 
                       patientAge < 2 ? `${Math.round(patientAge * 12)} months` : 
                       `${Math.round(patientAge)} years`}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES].ageRange[0]}
                    max={PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES].ageRange[1]}
                    step={patientType === 'neonate' ? 0.01 : patientType === 'infant' ? 0.1 : 1}
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className={`w-full h-8 ${isMobile ? 'h-12' : ''} appearance-none bg-gray-300 rounded-lg cursor-pointer`}
                  />
                </div>
              </div>

              {/* Parameter Recommendations */}
              {patientType !== 'adult' && (
                <div className={`mt-4 p-3 ${isDark ? 'bg-blue-900' : 'bg-blue-100'} rounded`}>
                  <h4 className={`font-semibold ${labelText} mb-2`}>Recommended Ranges for {patientWeight}kg {PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES].label}:</h4>
                  <div className={`text-sm ${labelText} space-y-1`}>
                    <div>• Tidal Volume: {parameterRanges.tvRange[0]}-{parameterRanges.tvRange[1]} mL ({PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES].tvPerKg[0]}-{PEDIATRIC_CATEGORIES[patientType as keyof typeof PEDIATRIC_CATEGORIES].tvPerKg[1]} mL/kg)</div>
                    <div>• PEEP: {parameterRanges.peepRange[0]}-{parameterRanges.peepRange[1]} cmH₂O</div>
                    <div>• PIP: {parameterRanges.pipRange[0]}-{parameterRanges.pipRange[1]} cmH₂O</div>
                    <div>• Respiratory Rate: {parameterRanges.rrRange[0]}-{parameterRanges.rrRange[1]} bpm</div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile-optimized sliders */}
            <div className={`space-y-4 ${isMobile ? 'px-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              
              {/* PEEP Slider */}
              <div className="space-y-2" id="peep-slider">
                <div className="flex justify-between items-center">
                  <span className={`${labelText} font-medium`}>PEEP:</span>
                  <span className={`${valueText} font-semibold text-lg`}>{peep} cmH₂O</span>
                </div>
                <input
                  type="range"
                  min={parameterRanges.peepRange[0]}
                  max={parameterRanges.peepRange[1]}
                  value={peep}
                  onChange={(e) => setPeep(Number(e.target.value))}
                  className={`w-full h-8 ${isMobile ? 'h-12' : ''} appearance-none bg-gray-300 rounded-lg cursor-pointer`}
                />
              </div>

              {/* PIP Slider */}
              <div className="space-y-2" id="pip-slider">
                <div className="flex justify-between items-center">
                  <span className={`${labelText} font-medium`}>PIP:</span>
                  <span className={`${valueText} font-semibold text-lg`}>{pip} cmH₂O</span>
                </div>
                <input
                  type="range"
                  min={parameterRanges.pipRange[0]}
                  max={parameterRanges.pipRange[1]}
                  value={pip}
                  onChange={(e) => setPip(Number(e.target.value))}
                  className={`w-full h-8 ${isMobile ? 'h-12' : ''} appearance-none bg-gray-300 rounded-lg cursor-pointer`}
                />
              </div>

              {/* RR Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${labelText} font-medium`}>Respiratory Rate:</span>
                  <span className={`${valueText} font-semibold text-lg`}>{rr} bpm</span>
                </div>
                <input
                  type="range"
                  min={parameterRanges.rrRange[0]}
                  max={parameterRanges.rrRange[1]}
                  value={rr}
                  onChange={(e) => setRR(Number(e.target.value))}
                  className={`w-full h-8 ${isMobile ? 'h-12' : ''} appearance-none bg-gray-300 rounded-lg cursor-pointer`}
                />
              </div>

              {/* I:E Ratio Slider */}
              <div className="space-y-2" id="ie-slider">
                <div className="flex justify-between items-center">
                  <span className={`${labelText} font-medium`}>I:E Ratio:</span>
                  <span className={`${valueText} font-semibold text-lg`}>{ieRatio}:1</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.1"
                  value={ieRatio}
                  onChange={(e) => setIERatio(Number(e.target.value))}
                  className={`w-full h-8 ${isMobile ? 'h-12' : ''} appearance-none bg-gray-300 rounded-lg cursor-pointer`}
                />
              </div>

              {/* EtCO₂ Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${labelText} font-medium`}>EtCO₂ Max:</span>
                  <span className={`${valueText} font-semibold text-lg`}>{etco2Max} mmHg</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={etco2Max}
                  onChange={(e) => setEtco2Max(Number(e.target.value))}
                  className={`w-full h-8 ${isMobile ? 'h-12' : ''} appearance-none bg-gray-300 rounded-lg cursor-pointer`}
                />
              </div>
            </div>

            {/* Dropdowns and controls */}
            <div className={`mt-6 space-y-4 ${isMobile ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
              <div>
                <label className={`block ${labelText} font-medium mb-2`}>Pathology:</label>
                <select
                  className={`w-full px-3 py-3 rounded border ${inputBg} ${isMobile ? 'text-lg' : ''}`}
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="ards">ARDS</option>
                  <option value="copd">COPD</option>
                  <option value="asthma">Asthma</option>
                  <option value="pneumothorax">Pneumothorax</option>
                  <option value="weaning_failure">Weaning Failure</option>
                </select>
              </div>

              <div>
                <label className={`block ${labelText} font-medium mb-2`}>Vent Mode:</label>
                <select
                  className={`w-full px-3 py-3 rounded border ${inputBg} ${isMobile ? 'text-lg' : ''}`}
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="volume">Volume Control</option>
                  <option value="pressure">Pressure Control</option>
                  <option value="support">Pressure Support</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setRunning((r) => !r)}
                  className={`w-full px-4 py-3 rounded font-semibold ${isMobile ? 'text-lg' : ''} ${
                    running
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-black'
                  }`}
                >
                  {running ? '⏸️ Pause' : '▶️ Play'}
                </button>
              </div>
            </div>

            {/* Metrics Display */}
            <div className={`mt-6 p-4 ${sectionBg} rounded`}>
              <h3 className={`font-semibold mb-3 ${labelText}`}>Current Metrics</h3>
              <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-2 md:grid-cols-4 gap-4'} text-sm`}>
                <div>
                  <span className={`${labelText}`}>Tidal Volume: </span>
                  <span className={`${valueText} font-semibold`}>
                    {tidalVolume} mL 
                    {patientType !== 'adult' && ` (${(tidalVolume / patientWeight).toFixed(1)} mL/kg)`}
                  </span>
                </div>
                <div>
                  <span className={`${labelText}`}>Minute Vent: </span>
                  <span className={`${valueText} font-semibold`}>{minuteVent} L/min</span>
                </div>
                <div>
                  <span className={`${labelText}`}>Plateau: </span>
                  <span className={`${valueText} font-semibold`}>{plateau} cmH₂O</span>
                </div>
                {patientType === 'adult' && (
                  <div>
                    <span className={`${labelText}`}>IBW TV Target: </span>
                    <span className={`${valueText} font-semibold`}>
                      {Math.round(patientWeight * 6)}-{Math.round(patientWeight * 8)} mL
                    </span>
                  </div>
                )}
              </div>
              {autoPEEP && (
                <div className="mt-3 p-2 bg-red-600 text-white rounded text-sm">
                  ⚠️ Auto-PEEP suspected: Expiratory flow not returning to zero
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── WAVEFORMS SECTION ──────────────────────────────────────────── */}
        {(!isMobile || activeSection === 'waveforms') && (
          <div className="w-full mb-6">
            <h2 className={`text-lg font-semibold mb-4 ${labelText} ${isMobile ? 'text-center' : ''}`}>
              Ventilator Waveforms
            </h2>
            
            <div className="space-y-6">
              {/* Pressure Waveform */}
              <div className={`${sectionBg} rounded p-2`}>
                <Plot
                  data={createPlotData(pressure.x, pressure.y, isDark ? 'red' : 'darkred', isMobile ? 3 : 2)}
                  layout={mobileOptimizedLayout('Pressure (cmH₂O)', 'cmH₂O')}
                  useResizeHandler={true}
                  style={{ width: '100%' }}
                  config={plotConfig}
                />
              </div>

              {/* Flow Waveform */}
              <div className={`${sectionBg} rounded p-2`}>
                <Plot
                  data={createPlotData(flow.x, flow.y, isDark ? 'yellow' : 'goldenrod', isMobile ? 3 : 2)}
                  layout={mobileOptimizedLayout('Flow (L/min)', 'L/min')}
                  useResizeHandler={true}
                  style={{ width: '100%' }}
                  config={plotConfig}
                />
              </div>

              {/* Volume Waveform */}
              <div className={`${sectionBg} rounded p-2`}>
                <Plot
                  data={createPlotData(volume.x, volume.y, isDark ? 'cyan' : 'teal', isMobile ? 3 : 2)}
                  layout={mobileOptimizedLayout('Volume (mL)', 'mL')}
                  useResizeHandler={true}
                  style={{ width: '100%' }}
                  config={plotConfig}
                />
              </div>

              {/* Capnography */}
              <div className={`${sectionBg} rounded p-2`}>
                <Plot
                  data={createPlotData(capnography.x, capnography.y, isDark ? 'white' : 'black', isMobile ? 3 : 2)}
                  layout={mobileOptimizedLayout('Capnography (mmHg)', 'mmHg')}
                  useResizeHandler={true}
                  style={{ width: '100%' }}
                  config={plotConfig}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── LEARNING SECTION ───────────────────────────────────────────── */}
        {(!isMobile || activeSection === 'learning') && (
          <div className="w-full mb-6">
            <div className={`p-4 ${sectionBg} rounded`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${labelText}`}>Learning Path</h2>
                {konamiUnlocked && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-xs">
                    <span>🎮</span>
                    <span>Developer Mode</span>
                  </div>
                )}
              </div>

              <div className={`${isMobile ? 'space-y-2' : 'flex flex-wrap gap-2'} mb-4`}>
                {LEARNING_PATHS.map((lp) => {
                  const isFirst = lp.key === 'beginner';
                  const prevIndex = LEARNING_PATHS.findIndex((x) => x.key === lp.key) - 1;
                  const prevLevel = LEARNING_PATHS[prevIndex];
                  const unlocked = konamiUnlocked || isFirst || (prevLevel && prevLevel.scenarios.every((s) => completedScenarios.includes(s.id)));

                  return (
                    <button
                      key={lp.key}
                      onClick={() => {
                        if (unlocked) setCurrentLevelKey(lp.key);
                      }}
                      className={`${isMobile ? 'w-full' : ''} px-4 py-3 rounded font-medium ${isMobile ? 'text-base' : 'text-sm'} ${
                        lp.key === currentLevelKey ? 'bg-blue-600' : 'bg-gray-700'
                      } ${unlocked ? '' : 'opacity-50 cursor-not-allowed'} text-white relative`}
                    >
                      {lp.level} {!unlocked && ' 🔒'}
                      {konamiUnlocked && lp.key === currentLevelKey && (
                        <span className="absolute -top-1 -right-1 text-xs">🎮</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <h3 className={`font-semibold mb-3 ${labelText}`}>Available Scenarios</h3>
              <div className="space-y-2">
                {availableScenarios.map((scenario) => {
                  const done = completedScenarios.includes(scenario.id);
                  return (
                    <div key={scenario.id} className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`${labelText} font-semibold ${isMobile ? 'text-sm' : ''}`}>
                              {scenario.name}
                            </span>
                            {done && <span className="text-green-400 text-sm">✅</span>}
                          </div>
                          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            {scenario.description}
                          </p>
                          {scenario.patientType && (
                            <div className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'} flex gap-3`}>
                              <span>👤 {PEDIATRIC_CATEGORIES[scenario.patientType as keyof typeof PEDIATRIC_CATEGORIES].label}</span>
                              {scenario.patientWeight && <span>⚖️ {scenario.patientWeight}kg</span>}
                              <span>🔬 {scenario.pathology}</span>
                            </div>
                          )}
                        </div>
                        {!done && (
                          <button
                            onClick={() => loadScenario(scenario)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm ml-3 shrink-0"
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`mt-4 ${isMobile ? 'space-y-2' : 'flex gap-2'}`}>
                <button
                  onClick={() => {
                    setTutorialActive(true);
                    setTutorialStep(1);
                  }}
                  className={`${isMobile ? 'w-full' : ''} px-4 py-2 bg-green-500 text-white rounded`}
                >
                  📚 Start Tutorial
                </button>
                {resetProgressButton}
              </div>

              {/* ─── QUIZ SECTION ──────────────────────────────────────────── */}
              {currentQuiz && (
                <div className={`mt-6 p-4 ${isDark ? 'bg-blue-900' : 'bg-blue-100'} rounded`}>
                  <h3 className={`font-semibold mb-3 ${labelText}`}>📝 Knowledge Check</h3>
                  <p className={`${labelText} mb-3`}>{currentQuiz.question}</p>
                  
                  <div className="space-y-2 mb-4">
                    {currentQuiz.choices.map((choice: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChoice(choice)}
                        className={`w-full text-left p-3 rounded border ${
                          selectedChoice === choice
                            ? 'bg-blue-600 text-white border-blue-600'
                            : `${inputBg} border-gray-300`
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}. {choice}
                      </button>
                    ))}
                  </div>

                  {selectedChoice && !currentQuiz.answered && (
                    <button
                      onClick={() => {
                        const isCorrect = selectedChoice.toLowerCase() === currentQuiz.correctAnswer;
                        setCurrentQuiz({ ...currentQuiz, answered: true, isCorrect });
                        setAttempts(prev => prev + 1);
                        if (isCorrect) {
                          setScore(prev => prev + 1);
                          // Mark scenario as completed
                          if (!completedScenarios.includes(currentQuiz.scenarioId)) {
                            setCompletedScenarios(prev => [...prev, currentQuiz.scenarioId]);
                          }
                        }
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Submit Answer
                    </button>
                  )}

                  {currentQuiz.answered && (
                    <div className={`mt-3 p-3 rounded ${
                      currentQuiz.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {currentQuiz.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                      <div className="mt-2 text-sm">
                        <strong>Hint:</strong> {currentQuiz.hint}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── ASSESSMENT SECTION ────────────────────────────────────── */}
              {currentAssessment && (
                <div className={`mt-6 p-4 ${isDark ? 'bg-purple-900' : 'bg-purple-100'} rounded`}>
                  <h3 className={`font-semibold mb-3 ${labelText}`}>🎯 Clinical Assessment</h3>
                  <p className={`${labelText} mb-3`}>
                    Adjust ventilator settings to achieve target parameters:
                  </p>
                  
                  <div className={`space-y-2 text-sm ${labelText}`}>
                    <div className="flex justify-between">
                      <span>Target Tidal Volume:</span>
                      <span className={`font-semibold ${
                        Math.abs(tidalVolume - currentAssessment.targetTV) <= 10 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {currentAssessment.targetTV} mL (Current: {tidalVolume} mL)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Plateau Pressure:</span>
                      <span className={`font-semibold ${
                        plateau <= currentAssessment.targetPlateauMax ? 'text-green-400' : 'text-red-400'
                      }`}>
                        &lt;{currentAssessment.targetPlateauMax} cmH₂O (Current: {plateau} cmH₂O)
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <strong>Hint:</strong> {currentAssessment.hint}
                  </div>

                  {Math.abs(tidalVolume - currentAssessment.targetTV) <= 10 && 
                   plateau <= currentAssessment.targetPlateauMax && (
                    <div className="mt-3 p-2 bg-green-600 text-white rounded text-sm">
                      🎉 Assessment Passed! Excellent ventilator management.
                      {(() => {
                        if (!completedScenarios.includes(currentAssessment.scenarioId)) {
                          setCompletedScenarios(prev => [...prev, currentAssessment.scenarioId]);
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── ALARMS SECTION ─────────────────────────────────────────────── */}
        {(!isMobile || activeSection === 'alarms') && (
          <div className="w-full mb-6">
            <div className={`p-4 ${sectionBg} rounded`}>
              <h2 className={`text-lg font-semibold mb-4 ${labelText}`}>Alarm Management</h2>
              
              {/* Alarm Thresholds */}
              <div className={`space-y-4 ${isMobile ? '' : 'grid grid-cols-2 gap-4'} mb-6`}>
                <div>
                  <label className={`block ${labelText} font-medium mb-2`}>High Pressure Alarm:</label>
                  <input
                    type="number"
                    min="0"
                    value={highPressLimit}
                    onChange={(e) => setHighPressLimit(Number(e.target.value))}
                    className={`w-full px-3 py-3 rounded border ${inputBg} ${isMobile ? 'text-lg' : ''}`}
                  />
                </div>
                <div>
                  <label className={`block ${labelText} font-medium mb-2`}>Low Pressure Alarm:</label>
                  <input
                    type="number"
                    min="0"
                    value={lowPressLimit}
                    onChange={(e) => setLowPressLimit(Number(e.target.value))}
                    className={`w-full px-3 py-3 rounded border ${inputBg} ${isMobile ? 'text-lg' : ''}`}
                  />
                </div>
              </div>

              {/* Alarm History */}
              <h3 className={`font-semibold mb-3 ${labelText}`}>Alarm History</h3>
              <div className={`max-h-60 overflow-y-auto space-y-2`}>
                {alarmLog.length === 0 ? (
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No alarms triggered</p>
                ) : (
                  alarmLog.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-sm ${
                        log.severity === 'critical'
                          ? 'bg-red-600 text-white'
                          : log.severity === 'warning'
                          ? 'bg-yellow-600 text-black'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="font-semibold">{log.time}</div>
                      <div>{log.alarm}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MEDICAL DISCLAIMER MODAL ──────────────────────────────────────── */}
      {!disclaimerAccepted && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">⚠️</div>
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                  IMPORTANT MEDICAL DISCLAIMER
                </h2>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border-l-4 border-red-500">
                  <p className="font-semibold text-red-800 dark:text-red-200">
                    FOR EDUCATIONAL PURPOSES ONLY
                  </p>
                  <p className="text-red-700 dark:text-red-300 mt-1">
                    This simulator is NOT intended for clinical decision making or patient care.
                  </p>
                </div>

                <div>
                  <h3 className={`font-semibold mb-2 ${labelText}`}>Educational Use Only</h3>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Designed for learning ventilator principles and waveform interpretation</li>
                    <li>Simplified models that may not reflect real patient complexity</li>
                    <li>Requires supervision by qualified medical instructors</li>
                    <li>Not a substitute for proper medical training or certification</li>
                  </ul>
                </div>

                <div>
                  <h3 className={`font-semibold mb-2 ${labelText}`}>Limitations & Warnings</h3>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>Real patient physiology is more complex than any simulation</li>
                    <li>Parameter calculations are approximations for educational purposes</li>
                    <li>Clinical scenarios are generalized examples</li>
                    <li>Always follow institutional protocols and medical supervision</li>
                    <li>Never use for actual patient care or clinical decisions</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <p className="text-blue-800 dark:text-blue-200 text-xs">
                    <strong>Target Audience:</strong> Healthcare students, professionals, and educators with appropriate medical knowledge. 
                    Must be 18+ years old. Not suitable for general public use without proper medical context.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                  <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                    <strong>No Warranty:</strong> This software is provided "AS IS" without any warranties. 
                    Users assume all responsibility for appropriate use and interpretation.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDisclaimerAccept}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                >
                  I Understand and Accept These Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── KONAMI CODE SUCCESS MESSAGE ───────────────────────────────────── */}
      {showKonamiMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg shadow-lg transform animate-pulse">
            <div className="text-center">
              {/* CUSTOMIZE THIS MESSAGE SECTION */}
              <div className="text-2xl mb-2">🎮 KONAMI CODE ACTIVATED! 🎮</div>
              <div className="text-sm">All scenarios unlocked • Developer mode enabled by Nick Amsler</div>
              <div className="text-xs mt-1 opacity-75">🕹️Classic gaming never dies🕹️</div>
              {/* END CUSTOMIZABLE SECTION */}
            </div>
          </div>
        </div>
      )}

      {/* ─── TUTORIAL OVERLAY ──────────────────────────────────────────────── */}
      {tutorialActive && tutorialStep > 0 && tutorialStep <= TUTORIAL_STEPS.length && (
        <TutorialOverlay
          step={TUTORIAL_STEPS[tutorialStep - 1]}
          onNext={() => {
            if (tutorialStep < TUTORIAL_STEPS.length) {
              setTutorialStep((s) => s + 1);
            } else {
              setTutorialActive(false);
              setTutorialStep(0);
            }
          }}
        />
      )}
    </div>
  );
}