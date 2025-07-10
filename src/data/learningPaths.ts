// src/data/learningPaths.ts

// Helper function to calculate IBW using ARDSnet formula
const calculateIBW = (heightCm: number, gender: 'male' | 'female'): number => {
  const heightInches = heightCm / 2.54;
  if (gender === 'male') {
    return Math.max(50, 50 + 2.3 * (heightInches - 60));
  } else {
    return Math.max(45.5, 45.5 + 2.3 * (heightInches - 60));
  }
};

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  initialParams: {
    peep: number;
    pip: number;
    rr: number;
    ieRatio: number;
    riseTime: number;
    mode: 'volume' | 'pressure' | 'support';
  };
  pathology: string;
  // Patient demographics for all scenarios
  patientType?: string;
  patientWeight?: number;
  patientAge?: number;
  patientHeight?: number; // cm - needed for IBW calculation
  patientGender?: 'male' | 'female'; // needed for IBW calculation
  learningObjectives?: string[];
  quiz?: {
    question: string;
    correctAnswer: string;
    choices?: string[];    // ← now included in every quiz
    hint?: string;
    reference?: string;    // ← Clinical reference for validation
  };
  assessment?: {
    targetTV: number;
    targetPlateauMax: number;
    hint?: string;
  };
}

export interface LearningPath {
  key: string; // Made more flexible to allow pediatric paths
  level: string;
  description: string;
  scenarios: Scenario[];
}

export const LEARNING_PATHS: LearningPath[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ADULT VENTILATION PATHS (YOUR EXISTING CONTENT - NOW WITH PATIENT DEMOGRAPHICS)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'beginner',
    level: 'Beginner - Fundamentals',
    description: 'Learn basic ventilator waveforms and parameters',
    scenarios: [
      {
        id: 'normal-breathing',
        name: 'Normal Spontaneous Breathing',
        description: 'Understand normal respiratory patterns and waveforms in a healthy 35-year-old male',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 35,
        patientHeight: 175, // cm
        patientGender: 'male',
        initialParams: {
          peep: 5,
          pip: 20,
          rr: 14,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'normal',
        learningObjectives: [
          'Identify normal pressure, flow, and volume waveforms',
          'Understand the relationship between pressure and volume',
          'Recognize normal tidal volumes and respiratory rates',
        ],
        quiz: {
          question: 'What is the recommended tidal volume range per kg IBW (Ideal Body Weight) for lung-protective ventilation in adults?',
          correctAnswer: '4-8 mL/kg IBW',
          hint: 'CRITICAL: ARDSnet protocol uses IBW (calculated from height and gender), NOT actual body weight. Using actual weight can lead to dangerously high tidal volumes in obese patients.',
          choices: [
            '2-4 mL/kg IBW',
            '4-8 mL/kg IBW',     // ← correct (ARDSnet protocol)
            '8-10 mL/kg IBW',
            '10-12 mL/kg actual weight',
          ],
          reference: 'ARDSnet Trial (NEJM 2000;342(18):1301-8) & 2024 ATS Clinical Practice Guidelines for ARDS (Am J Respir Crit Care Med 2024;209(1):24-36)',
        },
      },
      {
        id: 'peep-basics',
        name: 'Understanding PEEP',
        description: 'Learn how PEEP affects lung recruitment and oxygenation in a 42-year-old female',
        patientType: 'adult',
        patientWeight: 75,
        patientAge: 42,
        patientHeight: 165, // cm
        patientGender: 'female',
        initialParams: {
          peep: 0,
          pip: 25,
          rr: 12,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'normal',
        learningObjectives: [
          'Understand the purpose of PEEP',
          'See how PEEP affects the baseline pressure',
          'Learn typical PEEP ranges',
        ],
        quiz: {
          question: 'What does PEEP stand for?',
          correctAnswer: 'positive end-expiratory pressure',
          hint: 'It maintains pressure in the lungs at the end of expiration',
          choices: [
            'peak end-expiratory pressure',
            'positive end-expiratory pressure', // ← correct
            'positive end-expiratory perfusion',
            'peak end-expiratory perfusion',
          ],
          reference: 'AARC Clinical Practice Guidelines (regularly updated)',
        },
      },
      {
        id: 'pip-exploration',
        name: 'Peak Inspiratory Pressure',
        description: 'Explore how PIP affects tidal volume delivery in a healthy 28-year-old female',
        patientType: 'adult',
        patientWeight: 68,
        patientAge: 28,
        patientHeight: 160, // cm
        patientGender: 'female',
        initialParams: {
          peep: 5,
          pip: 15,
          rr: 12,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'normal',
        learningObjectives: [
          'Understand the relationship between PIP and tidal volume',
          'Learn safe PIP limits',
          'Recognize pressure alarm situations',
        ],
        quiz: {
          question: 'What is the maximum recommended driving pressure to prevent lung injury?',
          correctAnswer: '15 cmH₂O',
          hint: 'Driving pressure = Plateau pressure - PEEP. Evidence shows >15 increases mortality',
          choices: [
            '10 cmH₂O',
            '15 cmH₂O',   // ← correct (2024 evidence)
            '20 cmH₂O',
            '25 cmH₂O',
          ],
          reference: 'Amato et al. NEJM 2015;372(8):747-55 (Driving pressure)',
        },
      },
      {
        id: 'ie-ratio-basics',
        name: 'I:E Ratio Fundamentals',
        description: 'Learn how inspiratory to expiratory ratio affects ventilation timing in a 55-year-old male',
        patientType: 'adult',
        patientWeight: 80,
        patientAge: 55,
        patientHeight: 180, // cm
        patientGender: 'male',
        initialParams: {
          peep: 5,
          pip: 25,
          rr: 12,
          ieRatio: 0.5,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'normal',
        learningObjectives: [
          'Understand normal I:E ratios',
          'See how I:E ratio affects flow patterns',
          'Learn when to adjust I:E ratio',
        ],
        quiz: {
          question: 'What is the normal I:E ratio for most patients?',
          correctAnswer: '1:2',
          hint: 'Expiration is usually twice as long as inspiration',
          choices: [
            '1:1',
            '1:2',     // ← correct
            '1:3',
            '2:1',
          ],
          reference: 'Tobin MJ. Principles and Practice of Mechanical Ventilation, 3rd Edition. McGraw-Hill 2013',
        },
      },
    ],
  },
  {
    key: 'intermediate',
    level: 'Intermediate - Common Pathologies',
    description: 'Recognize and manage common respiratory conditions',
    scenarios: [
      {
        id: 'copd-recognition',
        name: 'COPD Pattern Recognition',
        description: 'Learn to identify obstructive lung disease patterns in a 65-year-old male',
        patientType: 'adult',
        patientWeight: 72,
        patientAge: 65,
        patientHeight: 170, // cm
        patientGender: 'male',
        initialParams: {
          peep: 5,
          pip: 30,
          rr: 12,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'copd',
        learningObjectives: [
          'Recognize prolonged expiratory phase',
          'Identify flow limitation patterns',
          'Understand auto-PEEP risk',
        ],
        quiz: {
          question: 'What is the typical expiratory time constant in COPD?',
          correctAnswer: '1.07 seconds',
          hint: 'COPD has prolonged time constants due to airway obstruction',
          choices: [
            '0.46 seconds',
            '0.60 seconds',
            '1.07 seconds', // ← correct (2024 data)
            '1.50 seconds',
          ],
          reference: 'BMC Pulmonary Medicine (2023-2024)',
        },
      },
      {
        id: 'copd-management',
        name: 'Managing COPD Ventilation',
        description: 'Optimize ventilator settings for a 58-year-old female COPD exacerbation patient',
        patientType: 'adult',
        patientWeight: 78,
        patientAge: 58,
        patientHeight: 168, // cm
        patientGender: 'female',
        initialParams: {
          peep: 5,
          pip: 20, // Reduced to keep driving pressure <15
          rr: 10,
          ieRatio: 0.5,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'copd',
        learningObjectives: [
          'Adjust respiratory rate to allow complete exhalation',
          'Modify I:E ratio for COPD',
          'Prevent auto-PEEP development',
        ],
        quiz: {
          question: 'For a 78kg female (168cm height) COPD patient, what weight should be used for tidal volume calculation?',
          correctAnswer: 'IBW: 59.6kg',
          hint: 'COPD patients still require lung-protective ventilation using IBW, not actual weight, especially important in obese patients.',
          choices: [
            'Actual weight: 78kg',
            'IBW: 59.6kg',     // ← correct
            'Average: 68.8kg',
            'Adjusted weight: 70kg',
          ],
          reference: 'ARDSnet Protocol & 2024 ATS Clinical Practice Guidelines',
        },
        assessment: {
          targetTV: 358, // 6 mL/kg IBW for 168cm female (IBW=59.6kg)
          targetPlateauMax: 30,
          hint: 'Lower RR to allow complete exhalation (3 time constants). COPD time constant is 1.07s. IMPORTANT: Use IBW (59.6kg) not actual weight (78kg) for tidal volume calculation.',
        },
      },
      {
        id: 'ibw-calculation-importance',
        name: 'IBW Calculation and Clinical Importance',
        description: 'Master IBW calculation and understand why it\'s critical for lung-protective ventilation in a 90kg obese female',
        patientType: 'adult',
        patientWeight: 90,
        patientAge: 52,
        patientHeight: 165, // cm
        patientGender: 'female',
        initialParams: {
          peep: 5,
          pip: 25,
          rr: 14,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'normal',
        learningObjectives: [
          'Calculate IBW using the ARDSnet formula for males and females',
          'Understand why IBW is used instead of actual weight for ventilation',
          'Recognize the clinical consequences of using wrong weight type',
          'Learn when to use actual weight vs IBW in different populations',
          'Apply IBW calculations to prevent volutrauma in obese patients',
        ],
        quiz: {
          question: 'For this 90kg female patient (165cm height), what is her IBW and why must we use it instead of actual weight for tidal volume calculation?',
          correctAnswer: 'IBW = 57.1kg; prevents volutrauma by avoiding oversized tidal volumes',
          hint: 'CRITICAL CONCEPT: IBW correlates with lung size (based on height/gender), not body fat. Using actual weight (90kg) would deliver dangerous tidal volumes (540-720mL vs safe 342mL). Formula: Female IBW = 45.5 + 2.3 × (height in inches - 60).',
          choices: [
            'IBW = 90kg; actual weight is always used for accuracy',
            'IBW = 77.5kg; average of actual and calculated weights',
            'IBW = 57.1kg; prevents volutrauma by avoiding oversized tidal volumes',     // ← correct
            'IBW = 65kg; rounded up for safety margin',
          ],
          reference: 'ARDSnet Trial (NEJM 2000;342(18):1301-8): IBW formula specifically developed to prevent ventilator-induced lung injury. 2024 ATS Clinical Practice Guidelines for ARDS (Am J Respir Crit Care Med 2024;209(1):24-36)',
        },
        assessment: {
          targetTV: 342, // 6 mL/kg IBW for 165cm female (IBW=57.1kg)
          targetPlateauMax: 30,
          hint: 'Calculate IBW: Female 165cm = 65 inches. IBW = 45.5 + 2.3 × (65-60) = 57.1kg. Target tidal volume = 6 mL/kg IBW = 342mL. Using actual weight (90kg) would give 540mL - dangerously high!',
        },
      },
      {
        id: 'ards-recognition',
        name: 'ARDS Waveform Patterns',
        description: 'Identify acute respiratory distress syndrome in a 45-year-old male ICU patient',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 45,
        patientHeight: 172, // cm
        patientGender: 'male',
        initialParams: {
          peep: 8,
          pip: 28, // Reduced to keep driving pressure reasonable
          rr: 16,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Recognize reduced lung compliance (35-45 mL/cmH₂O)',
          'Identify high pressure requirements',
          'Understand the need for lung protective ventilation',
          'Monitor driving pressure to prevent VILI',
        ],
        quiz: {
          question: 'For this 70kg male patient (172cm height) with ARDS, what weight should be used for lung-protective tidal volume calculation?',
          correctAnswer: 'IBW: 67.7kg',
          hint: 'CRITICAL: ARDS patients require lung-protective ventilation using IBW (calculated from height and gender), NOT actual weight. Using actual weight can lead to volutrauma.',
          choices: [
            'Actual weight: 70kg',
            'IBW: 67.7kg',     // ← correct
            'Average: 68.9kg',
            'Adjusted weight: 65kg',
          ],
          reference: 'ARDSnet Trial (NEJM 2000;342(18):1301-8) & 2024 ATS Clinical Practice Guidelines for ARDS (Am J Respir Crit Care Med 2024;209(1):24-36)',
        },
        assessment: {
          targetTV: 406, // 6 mL/kg IBW for 172cm male (IBW=67.7kg)
          targetPlateauMax: 30,
          hint: 'Identify ARDS patterns: low compliance, high pressure needs. CRITICAL: Use IBW (67.7kg) NOT actual weight (70kg) for tidal volume. Target 6 mL/kg IBW with driving pressure <15 cmH₂O.',
        },
      },
      {
        id: 'ards-protective',
        name: 'Lung Protective Ventilation',
        description: 'Apply ARDSnet protocol for a 52-year-old female patient with severe ARDS',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 52,
        patientHeight: 163, // cm
        patientGender: 'female',
        initialParams: {
          peep: 10,
          pip: 25, // Reduced to demonstrate lung-protective ventilation
          rr: 20,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Set appropriate tidal volumes (6 mL/kg IBW)',
          'Maintain plateau pressure < 30 cmH₂O',
          'Use adequate PEEP for recruitment',
          'Calculate and monitor driving pressure <15 cmH₂O',
        ],
        quiz: {
          question: 'What is the fundamental principle of ARDSnet lung-protective ventilation regarding tidal volume calculation?',
          correctAnswer: 'Use 6 mL/kg IBW, not actual weight',
          hint: 'ARDSnet protocol specifically uses IBW (based on height and gender) to prevent overdistension, especially critical in obese patients where actual weight would lead to dangerous volumes.',
          choices: [
            'Use 8-10 mL/kg actual weight',
            'Use 6 mL/kg IBW, not actual weight',     // ← correct
            'Use 4-6 mL/kg adjusted weight',
            'Use 10-12 mL/kg lean body mass',
          ],
          reference: 'ARDSnet Trial (NEJM 2000;342(18):1301-8) & 2024 ATS Clinical Practice Guidelines for ARDS',
        },
        assessment: {
          targetTV: 331, // 6 mL/kg IBW for 163cm female (IBW=55.1kg)
          targetPlateauMax: 30,
          hint: 'Target 6 mL/kg IBW (Ideal Body Weight = 55.1kg) NOT actual weight (70kg). Keep plateau <30 cmH₂O and driving pressure <15 cmH₂O.',
        },
      },
      {
        id: 'asthma-crisis',
        name: 'Acute Asthma Exacerbation',
        description: 'Manage severe bronchospasm in a 32-year-old male with status asthmaticus',
        patientType: 'adult',
        patientWeight: 65,
        patientAge: 32,
        patientHeight: 178, // cm
        patientGender: 'male',
        initialParams: {
          peep: 0,
          pip: 35,
          rr: 14,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'asthma',
        learningObjectives: [
          'Recognize severe airflow obstruction',
          'Identify dynamic hyperinflation risk',
          'Apply permissive hypercapnia strategy',
        ],
        quiz: {
          question: 'What is the primary goal in ventilating severe asthma?',
          correctAnswer: 'prevent air trapping',
          hint: 'Focus on allowing complete exhalation between breaths',
          choices: [
            'maximize tidal volume',
            'prevent air trapping', // ← correct
            'increase RR',
            'decrease PEEP',
          ],
          reference: 'AARC Clinical Practice Guidelines (various, regularly updated)',
        },
      },
    ],
  },
  {
    key: 'advanced',
    level: 'Advanced - Complex Scenarios',
    description: 'Handle challenging clinical situations and mode selection',
    scenarios: [
      {
        id: 'pneumothorax-detection',
        name: 'Pneumothorax Recognition',
        description: 'Identify sudden changes indicating pneumothorax in a 29-year-old female trauma patient',
        patientType: 'adult',
        patientWeight: 85,
        patientAge: 29,
        patientHeight: 175, // cm
        patientGender: 'female',
        initialParams: {
          peep: 5,
          pip: 20, // Reduced for safe driving pressure initially
          rr: 12,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'pneumothorax',
        learningObjectives: [
          'Recognize sudden compliance changes',
          'Identify asymmetric lung expansion',
          'Understand emergency response needs',
        ],
        quiz: {
          question: 'What happens to peak pressures when a pneumothorax develops?',
          correctAnswer: 'increase',
          hint: 'The affected lung collapses, reducing overall compliance',
          choices: [
            'decrease',
            'increase', // ← correct
            'stay the same',
            'become erratic',
          ],
          reference: 'StatPearls: Pulmonary Compliance (2024)',
        },
      },
      {
        id: 'pressure-control-basics',
        name: 'Pressure Control Ventilation',
        description: 'Master pressure-targeted ventilation in a stable 48-year-old male patient',
        patientType: 'adult',
        patientWeight: 75,
        patientAge: 48,
        patientHeight: 174, // cm
        patientGender: 'male',
        initialParams: {
          peep: 5,
          pip: 25,
          rr: 14,
          ieRatio: 1,
          riseTime: 0.1,
          mode: 'pressure',
        },
        pathology: 'normal',
        learningObjectives: [
          'Understand pressure vs volume targeting',
          'Recognize decelerating flow patterns',
          'Learn when to use pressure control',
        ],
        quiz: {
          question: 'What is the characteristic flow pattern in pressure control?',
          correctAnswer: 'decelerating',
          hint: 'Flow starts high and decreases as the lungs fill',
          choices: [
            'square wave',
            'decelerating', // ← correct
            'triangular',
            'sinusoidal',
          ],
          reference: 'Tobin MJ. Principles and Practice of Mechanical Ventilation, 3rd Edition. McGraw-Hill 2013; AARC Clinical Practice Guidelines (various, regularly updated)',
        },
      },
      {
        id: 'pressure-support-weaning',
        name: 'Pressure Support Ventilation',
        description: 'Use PSV for weaning assessment in a recovering 61-year-old female patient',
        patientType: 'adult',
        patientWeight: 68,
        patientAge: 61,
        patientHeight: 162, // cm
        patientGender: 'female',
        initialParams: {
          peep: 5,
          pip: 15,
          rr: 16,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'support',
        },
        pathology: 'normal',
        learningObjectives: [
          'Understand patient-triggered ventilation',
          'Assess weaning readiness',
          'Recognize patient-ventilator synchrony',
        ],
        assessment: {
          targetTV: 325, // 6 mL/kg IBW for 162cm female (IBW=54.2kg)
          targetPlateauMax: 20,
          hint: 'Adjust pressure support level to achieve adequate IBW-based tidal volume (6 mL/kg IBW = 325mL). Use IBW (54.2kg) NOT actual weight (68kg).',
        },
      },
      {
        id: 'weaning-failure-recognition',
        name: 'Identifying Weaning Failure',
        description: 'Recognize signs of respiratory distress during weaning trial in a 67-year-old male',
        patientType: 'adult',
        patientWeight: 72,
        patientAge: 67,
        patientHeight: 168, // cm
        patientGender: 'male',
        initialParams: {
          peep: 5,
          pip: 12,
          rr: 24,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'support',
        },
        pathology: 'weaning_failure',
        learningObjectives: [
          'Identify rapid shallow breathing',
          'Recognize increased work of breathing',
          'Know when to abort weaning trial',
        ],
        quiz: {
          question: 'What is the RSBI threshold suggesting weaning failure?',
          correctAnswer: '>105',
          hint: 'Rapid Shallow Breathing Index = RR / TV (in L). Higher values predict failure',
          choices: [
            '>80',
            '>95',
            '>105', // ← correct
            '>120',
          ],
          reference: 'AARC Clinical Practice Guidelines (various, regularly updated)',
        },
      },
      {
        id: 'auto-peep-management',
        name: 'Auto-PEEP Detection and Management',
        description: 'Identify and correct intrinsic PEEP in a 71-year-old female COPD patient',
        patientType: 'adult',
        patientWeight: 76,
        patientAge: 71,
        patientHeight: 158, // cm
        patientGender: 'female',
        initialParams: {
          peep: 5,
          pip: 20, // Reduced to prevent excessive driving pressure
          rr: 20,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'copd',
        learningObjectives: [
          'Detect incomplete exhalation',
          'Measure intrinsic PEEP',
          'Apply corrective strategies',
        ],
        quiz: {
          question: 'Why is IBW used instead of actual weight for tidal volume calculations in adult ventilation?',
          correctAnswer: 'IBW correlates with lung size, not body fat',
          hint: 'Lung size correlates with height and sex (IBW factors), not total body weight. Using actual weight in obese patients leads to lung injury.',
          choices: [
            'IBW is easier to calculate',
            'IBW correlates with lung size, not body fat',  // ← correct
            'Actual weight includes muscle mass',
            'IBW reduces medication dosing errors',
          ],
          reference: 'ARDSnet Trial (NEJM 2000) & Physiological basis of lung-protective ventilation',
        },
        assessment: {
          targetTV: 304, // 6 mL/kg IBW for 158cm female (IBW=50.6kg)
          targetPlateauMax: 28,
          hint: 'Reduce RR to allow 3 time constants for expiration. COPD TC = 1.07s, need 3.2s exp time. Use IBW (50.6kg) NOT actual weight (76kg) for tidal volume.',
        },
      },
    ],
  },
  {
    key: 'expert',
    level: 'Expert - Critical Decision Making',
    description: 'Master complex ventilator management and troubleshooting',
    scenarios: [
      {
        id: 'ards-proning',
        name: 'ARDS with Prone Positioning',
        description: 'Optimize ventilation during prone positioning for severe ARDS in a 39-year-old male',
        patientType: 'adult',
        patientWeight: 82,
        patientAge: 39,
        patientHeight: 182, // cm
        patientGender: 'male',
        initialParams: {
          peep: 12,
          pip: 32,
          rr: 22,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'pressure',
        },
        pathology: 'ards',
        learningObjectives: [
          'Understand prone positioning benefits for severe ARDS',
          'Adjust ventilator settings for position changes',
          'Monitor for prone positioning complications',
          'Maintain lung-protective ventilation during proning',
        ],
        quiz: {
          question: 'For this 82kg male patient (182cm height) with severe ARDS undergoing prone positioning, what is the appropriate tidal volume target?',
          correctAnswer: '461 mL (6 mL/kg IBW)',
          hint: 'Even during prone positioning for severe ARDS, lung-protective ventilation with IBW-based tidal volumes remains essential. IBW for 182cm male = 76.8kg.',
          choices: [
            '492 mL (6 mL/kg actual weight)',
            '461 mL (6 mL/kg IBW)',     // ← correct
            '410 mL (5 mL/kg IBW)',
            '574 mL (7 mL/kg actual weight)',
          ],
          reference: '2024 ATS Clinical Practice Guidelines for ARDS & PROSEVA Study (NEJM 2013)',
        },
        assessment: {
          targetTV: 461, // 6 mL/kg IBW for 182cm male (IBW=76.8kg)
          targetPlateauMax: 28,
          hint: 'Use higher PEEP (12-16) and pressure control. Keep driving pressure <15 cmH₂O. CRITICAL: Use IBW (76.8kg) NOT actual weight (82kg) for lung protection.',
        },
      },
      {
        id: 'vili-prevention',
        name: 'Preventing Ventilator-Induced Lung Injury',
        description: 'Balance oxygenation needs with lung protection in a 44-year-old female with severe ARDS',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 44,
        patientHeight: 164, // cm
        patientGender: 'female',
        initialParams: {
          peep: 10,
          pip: 35,
          rr: 24,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Calculate and monitor driving pressure (Plateau - PEEP)',
          'Use IBW-based tidal volumes to prevent volutrauma',
          'Optimize PEEP using compliance curves',
          'Apply permissive hypercapnia when needed',
          'Balance oxygenation goals with lung protection',
        ],
        quiz: {
          question: 'For this 70kg female patient (164cm height) with severe ARDS, what is the critical foundation of VILI prevention?',
          correctAnswer: 'Use 6 mL/kg IBW (336 mL) with driving pressure <15 cmH₂O',
          hint: 'VILI prevention requires strict adherence to IBW-based tidal volumes. For 164cm female, IBW = 56.0kg. Combined with driving pressure limits, this prevents both volutrauma and barotrauma.',
          choices: [
            'Use 8 mL/kg actual weight (560 mL)',
            'Use 6 mL/kg IBW (336 mL) with driving pressure <15 cmH₂O',     // ← correct
            'Use 4 mL/kg actual weight (280 mL)',
            'Use 10 mL/kg IBW (560 mL) with high PEEP',
          ],
          reference: 'Amato et al. NEJM 2015;372(8):747-55 (Driving pressure) & 2024 ATS Clinical Practice Guidelines for ARDS',
        },
        assessment: {
          targetTV: 336, // 6 mL/kg IBW for 164cm female (IBW=56.0kg)
          targetPlateauMax: 25, // Lower target for VILI prevention
          hint: 'VILI prevention strategy: Use IBW (56.0kg) NOT actual weight (70kg). Target 6 mL/kg IBW = 336mL. Keep driving pressure <15 cmH₂O by optimizing PEEP and limiting plateau pressure.',
        },
      },
      {
        id: 'dyssynchrony-management',
        name: 'Patient-Ventilator Dyssynchrony',
        description: 'Identify and correct all types of dyssynchrony in an agitated 56-year-old male patient',
        patientType: 'adult',
        patientWeight: 73,
        patientAge: 56,
        patientHeight: 176, // cm
        patientGender: 'male',
        initialParams: {
          peep: 5,
          pip: 28,
          rr: 16,
          ieRatio: 1,
          riseTime: 0.5,
          mode: 'volume',
        },
        pathology: 'normal',
        learningObjectives: [
          'Recognize trigger dyssynchrony',
          'Identify flow dyssynchrony',
          'Correct cycle dyssynchrony',
        ],
        quiz: {
          question: 'What causes double triggering?',
          correctAnswer: 'short inspiratory time',
          hint: "The patient's neural inspiration outlasts the ventilator breath",
          choices: [
            'long expiratory time',
            'short inspiratory time', // ← correct
            'high PEEP',
            'low tidal volume',
          ],
          reference: 'AARC Clinical Practice Guidelines (various, regularly updated)',
        },
      },
      {
        id: 'rescue-strategies',
        name: 'Rescue Oxygenation Strategies',
        description: 'Apply advanced techniques for refractory hypoxemia in a 51-year-old female with COVID ARDS',
        patientType: 'adult',
        patientWeight: 78,
        patientAge: 51,
        patientHeight: 166, // cm
        patientGender: 'female',
        initialParams: {
          peep: 16,
          pip: 35,
          rr: 28,
          ieRatio: 1.5,
          riseTime: 0.3,
          mode: 'pressure',
        },
        pathology: 'ards',
        learningObjectives: [
          'Use inverse ratio ventilation',
          'Apply recruitment maneuvers',
          'Know when to consider ECMO',
        ],
        quiz: {
          question: 'What is the key difference between adult and pediatric tidal volume calculations?',
          correctAnswer: 'Adults use IBW, pediatrics use actual weight',
          hint: 'Critical distinction: Adults use IBW (based on height/gender) while pediatric patients use actual body weight for tidal volume calculations.',
          choices: [
            'Adults use actual weight, pediatrics use IBW',
            'Adults use IBW, pediatrics use actual weight',  // ← correct
            'Both use IBW for consistency',
            'Both use actual weight for simplicity',
          ],
          reference: 'ARDSnet Protocol (Adults) & Pediatric Critical Care Guidelines (2023-2024)',
        },
        assessment: {
          targetTV: 347, // 6 mL/kg IBW for 166cm female (IBW=57.8kg)
          targetPlateauMax: 30,
          hint: 'Use inverse ratio (I:E 1.5:1) and high PEEP (14-18). Accept permissive hypercapnia. ESSENTIAL: Use IBW (57.8kg) NOT actual weight (78kg).',
        },
      },
      {
        id: 'multi-organ-failure',
        name: 'Ventilation in Multi-Organ Failure',
        description: 'Balance respiratory support with other organ systems in a 63-year-old male with septic shock',
        patientType: 'adult',
        patientWeight: 69,
        patientAge: 63,
        patientHeight: 171, // cm
        patientGender: 'male',
        initialParams: {
          peep: 8,
          pip: 26,
          rr: 18,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'pressure',
        },
        pathology: 'ards',
        learningObjectives: [
          'Consider hemodynamic effects of lung-protective ventilation',
          'Balance ARDS management with multi-organ failure',
          'Adjust ventilation for renal replacement therapy',
          'Manage ventilation with increased intracranial pressure concerns',
          'Maintain IBW-based lung protection in complex patients',
        ],
        quiz: {
          question: 'In this 69kg male patient (171cm height) with ARDS and multi-organ failure, what ventilation approach balances lung protection with hemodynamic stability?',
          correctAnswer: '6 mL/kg IBW (401 mL) with moderate PEEP',
          hint: 'Even in multi-organ failure, lung-protective ventilation remains critical. Use IBW (66.8kg for 171cm male) but consider lower PEEP to minimize cardiovascular compromise.',
          choices: [
            '8 mL/kg actual weight (552 mL) with high PEEP',
            '6 mL/kg IBW (401 mL) with moderate PEEP',  // ← correct
            '4 mL/kg actual weight (276 mL)',
            '10 mL/kg IBW (668 mL) with low PEEP',
          ],
          reference: 'AARC Clinical Practice Guidelines & 2024 ATS Clinical Practice Guidelines for ARDS',
        },
        assessment: {
          targetTV: 401, // 6 mL/kg IBW for 171cm male (IBW=66.8kg)
          targetPlateauMax: 28,
          hint: 'Multi-organ failure requires balancing act: Use IBW (66.8kg) NOT actual weight (69kg) for lung protection, but optimize PEEP/FiO₂ to minimize hemodynamic compromise.',
        },
      },
      {
        id: 'ibw-emergency-calculations',
        name: 'Emergency IBW Calculations and Critical Decision Making',
        description: 'Rapidly calculate IBW and make critical ventilation decisions in a 95kg obese female trauma patient',
        patientType: 'adult',
        patientWeight: 95,
        patientAge: 38,
        patientHeight: 160, // cm - shorter height makes IBW vs actual weight difference more dramatic
        patientGender: 'female',
        initialParams: {
          peep: 10,
          pip: 35, // High initial settings to demonstrate need for adjustment
          rr: 20,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Rapidly calculate IBW in emergency situations using both metric and imperial formulas',
          'Recognize life-threatening consequences of weight calculation errors',
          'Apply IBW principles when patient demographics are uncertain',
          'Adjust ventilator settings immediately based on IBW calculations',
          'Understand population differences in IBW application (adults vs pediatrics vs elderly)',
        ],
        quiz: {
          question: 'Emergency scenario: This 95kg female trauma patient (160cm) needs immediate lung-protective ventilation. What are the critical IBW calculations and immediate actions needed?',
          correctAnswer: 'IBW=52.9kg; immediately reduce TV to 317mL; current 570mL TV is lethal',
          hint: 'EMERGENCY CALCULATION: 160cm = 63 inches. Female IBW = 45.5 + 2.3 × (63-60) = 52.9kg. Current setting likely delivers 570mL (6mL/kg actual weight) which will cause immediate barotrauma. Must immediately reduce to 317mL (6mL/kg IBW). Every minute of delay increases mortality.',
          choices: [
            'Use actual weight 95kg; trauma patients need higher volumes for shock',
            'Calculate average of 95kg and IBW for safety compromise',
            'IBW=52.9kg; immediately reduce TV to 317mL; current 570mL TV is lethal',     // ← correct
            'Wait for precise height measurement before making changes',
          ],
          reference: 'ARDSnet Trial: Early implementation of IBW-based ventilation reduces mortality. Emergency Medicine Guidelines: Immediate lung protection in trauma (Trauma Surgery & Acute Care 2023)',
        },
        assessment: {
          targetTV: 317, // 6 mL/kg IBW for 160cm female (IBW=52.9kg)
          targetPlateauMax: 28,
          hint: 'EMERGENCY IBW: 160cm female = 52.9kg IBW. Target 6mL/kg IBW = 317mL immediately. Reduce PIP to achieve safe driving pressure <15 cmH₂O. Using actual weight (95kg) would deliver 570mL causing pneumothorax and death.',
        },
      },
      {
        id: 'compliance-monitoring',
        name: 'Dynamic Compliance Monitoring',
        description: 'Learn to interpret real-time compliance changes in a 47-year-old female with evolving ARDS',
        patientType: 'adult',
        patientWeight: 75,
        patientAge: 47,
        patientHeight: 167, // cm
        patientGender: 'female',
        initialParams: {
          peep: 10,
          pip: 30,
          rr: 20,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Differentiate static vs dynamic compliance',
          'Recognize compliance changes indicating recruitment/derecruitment',
          'Use compliance trends to guide PEEP titration',
          'Correlate driving pressure with compliance',
        ],
        quiz: {
          question: 'For this 75kg female patient (167cm height) with evolving ARDS, what is the appropriate IBW-based tidal volume target?',
          correctAnswer: '352 mL (6 mL/kg IBW)',
          hint: 'Compliance monitoring requires maintaining lung-protective ventilation. For 167cm female, IBW = 58.7kg. Use 6 mL/kg IBW regardless of compliance changes.',
          choices: [
            '450 mL (6 mL/kg actual weight)',
            '352 mL (6 mL/kg IBW)',     // ← correct
            '300 mL (5 mL/kg IBW)',
            '525 mL (7 mL/kg actual weight)',
          ],
          reference: 'StatPearls: Pulmonary Compliance (2024) & ARDSnet Protocol',
        },
        assessment: {
          targetTV: 352, // 6 mL/kg IBW for 167cm female (IBW=58.7kg)
          targetPlateauMax: 28,
          hint: 'Adjust PEEP and PIP to optimize compliance while keeping driving pressure <15 cmH₂O. IMPORTANT: Use IBW (58.7kg) NOT actual weight (75kg) for tidal volume.',
        },
      },
      {
        id: 'ibw-clinical-scenarios',
        name: 'IBW in Complex Clinical Scenarios',
        description: 'Apply IBW calculations across different patient populations and clinical conditions in a 120kg morbidly obese male',
        patientType: 'adult',
        patientWeight: 120, // Morbidly obese patient
        patientAge: 45,
        patientHeight: 170, // cm
        patientGender: 'male',
        initialParams: {
          peep: 8,
          pip: 30,
          rr: 16,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Apply IBW calculations in obese patients with ARDS',
          'Understand the difference between adult and pediatric weight usage',
          'Calculate driving pressure using IBW-based tidal volumes',
          'Recognize when IBW vs actual weight usage becomes life-threatening',
          'Master the ARDSnet IBW formula for both genders',
        ],
        quiz: {
          question: 'This 120kg male patient (170cm) has ARDS. Compare the tidal volumes if using actual weight vs IBW, and explain the clinical consequences.',
          correctAnswer: 'IBW=65.2kg gives 391mL; actual weight gives 720mL causing severe volutrauma',
          hint: 'LIFE-THREATENING DIFFERENCE: Actual weight (120kg) × 6mL/kg = 720mL tidal volume vs IBW (65.2kg) × 6mL/kg = 391mL. The 720mL would cause massive volutrauma, pneumothorax, and death. IBW formula: Male = 50 + 2.3 × (inches - 60).',
          choices: [
            'Both weights give similar results, either can be used safely',
            'Actual weight gives larger volumes but this improves oxygenation',
            'IBW=65.2kg gives 391mL; actual weight gives 720mL causing severe volutrauma',     // ← correct
            'Use average of both weights to balance safety and adequacy',
          ],
          reference: 'ARDSnet Trial mortality reduction specifically attributed to IBW-based lung protection. Brower RG et al. NEJM 2000;342(18):1301-8. Meta-analysis: Fan E et al. JAMA 2017;318(14):1346-55',
        },
        assessment: {
          targetTV: 391, // 6 mL/kg IBW for 170cm male (IBW=65.2kg)
          targetPlateauMax: 30,
          hint: 'IBW calculation: Male 170cm = 66.9 inches. IBW = 50 + 2.3 × (66.9-60) = 65.2kg. Target = 6 mL/kg IBW = 391mL. Driving pressure must be <15 cmH₂O. Using actual weight (120kg) would deliver lethal 720mL tidal volumes.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PEDIATRIC & NEONATAL VENTILATION PATHS (NEW CONTENT)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'pediatric-basic',
    level: 'Pediatric Basics',
    description: 'Introduction to weight-based pediatric ventilation',
    scenarios: [
      {
        id: 'school-age-basic',
        name: 'School Age Child - Normal Lungs',
        description: 'Learn weight-based ventilation for a 25kg school-age child',
        pathology: 'normal',
        patientType: 'schoolAge',
        patientWeight: 25,
        patientAge: 8,
        initialParams: {
          peep: 5,
          pip: 20,
          rr: 20,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        learningObjectives: [
          'Calculate weight-based tidal volumes (4-6 mL/kg per 2024 guidelines)',
          'Understand age-appropriate respiratory rates',
          'Learn pediatric pressure limits and compliance values',
          'Monitor driving pressure in pediatric patients',
        ],
        quiz: {
          question: 'For a 25kg child, what is the appropriate tidal volume range per current guidelines?',
          choices: ['75-100 mL', '100-150 mL', '150-175 mL', '200-250 mL'],
          correctAnswer: '100-150 mL',
          hint: 'PEDIATRIC patients use ACTUAL BODY WEIGHT (25kg), unlike adults who use IBW. Pediatric guidelines: 4-6 mL/kg actual weight.',
          reference: 'Pediatric Critical Care Medicine (2023-2024) & American Academy of Pediatrics Guidelines (2023-2024)'
        }
      },
      {
        id: 'toddler-asthma',
        name: 'Toddler with Asthma Exacerbation',
        description: 'Manage high airway resistance in a 12kg toddler',
        pathology: 'asthma',
        patientType: 'toddler',
        patientWeight: 12,
        patientAge: 2,
        initialParams: {
          peep: 4,
          pip: 22,
          rr: 25,
          ieRatio: 0.5, // Longer expiratory time for asthma
          riseTime: 0.3,
          mode: 'volume',
        },
        learningObjectives: [
          'Apply longer expiratory times for air trapping',
          'Use appropriate pediatric pressure limits',
          'Understand permissive hypercapnia in children',
        ],
        quiz: {
          question: 'Why do we use a lower I:E ratio (longer expiration) in pediatric asthma?',
          choices: [
            'To increase minute ventilation',
            'To prevent auto-PEEP from air trapping', 
            'To improve CO₂ elimination',
            'To reduce work of breathing'
          ],
          correctAnswer: 'To prevent auto-PEEP from air trapping',
          hint: 'Asthma causes airway obstruction, making expiration difficult',
          reference: 'Pediatric Critical Care Medicine (2023-2024) & AARC Clinical Practice Guidelines (various, regularly updated)'
        }
      },
      {
        id: 'infant-normal',
        name: 'Infant - Normal Ventilation',
        description: 'Master ventilation for a 6kg infant',
        pathology: 'normal',
        patientType: 'infant',
        patientWeight: 6,
        patientAge: 0.5, // 6 months
        initialParams: {
          peep: 4,
          pip: 18,
          rr: 30,
          ieRatio: 0.8,
          riseTime: 0.3,
          mode: 'pressure',
        },
        learningObjectives: [
          'Use pressure control for infants',
          'Understand higher respiratory rates in infants',
          'Learn gentle ventilation principles',
          'Monitor compliance in small patients',
        ],
        assessment: {
          targetTV: 30, // 5 mL/kg for 6kg (mid-range of 4-6 mL/kg)
          targetPlateauMax: 20,
          hint: 'Target 4-6 mL/kg ACTUAL WEIGHT (6kg) with gentle pressures. Keep driving pressure <10 cmH₂O for infants. NOTE: Pediatrics use actual weight, not IBW.'
        }
      }
    ],
  },
  {
    key: 'neonatal',
    level: 'Neonatal Intensive Care',
    description: 'Specialized ventilation for newborns and premature infants',
    scenarios: [
      {
        id: 'term-neonate',
        name: 'Term Neonate - Birth Transition',
        description: 'Ventilate a healthy 3.2kg term newborn during transition',
        pathology: 'normal',
        patientType: 'neonate',
        patientWeight: 3.2,
        patientAge: 0.01, // 3 days old
        initialParams: {
          peep: 5,
          pip: 18,
          rr: 40,
          ieRatio: 0.4, // Shorter inspiration for neonates
          riseTime: 0.2,
          mode: 'pressure', // Pressure control common in NICU
        },
        learningObjectives: [
          'Use pressure control in neonates',
          'Understand neonatal respiratory physiology',
          'Learn gentle ventilation principles',
        ],
        quiz: {
          question: 'What respiratory rate range is appropriate for a term neonate?',
          choices: ['12-20 bpm', '20-30 bpm', '30-60 bpm', '60-80 bpm'],
          correctAnswer: '30-60 bpm',
          hint: 'Neonates have much higher respiratory rates than older children',
          reference: '2023 AHA/AAP Neonatal Resuscitation Guidelines (Circulation 2024;149(2):e1-e51)'
        }
      },
      {
        id: 'preemie-rds',
        name: 'Premature Infant - Respiratory Distress Syndrome',
        description: 'Manage a 1.2kg premature infant with RDS and poor compliance',
        pathology: 'ards', // Similar to RDS with poor compliance
        patientType: 'neonate',
        patientWeight: 1.2,
        patientAge: 0.005, // 2 days old
        initialParams: {
          peep: 6,
          pip: 20,
          rr: 50,
          ieRatio: 0.3,
          riseTime: 0.2,
          mode: 'pressure',
        },
        learningObjectives: [
          'Understand RDS pathophysiology',
          'Apply surfactant therapy considerations',
          'Use ultra-gentle ventilation',
        ],
        assessment: {
          targetTV: 6, // 5 mL/kg for 1.2kg = 6mL
          targetPlateauMax: 25,
          hint: 'Use ultra-gentle ventilation: 4-5 mL/kg ACTUAL WEIGHT (1.2kg). Monitor compliance closely (very low in RDS). Pediatrics use actual weight.'
        },
        quiz: {
          question: 'In premature infants with RDS, what is the primary concern with ventilation?',
          choices: [
            'Achieving high minute ventilation',
            'Preventing ventilator-induced lung injury',
            'Maintaining high oxygen levels',
            'Reducing sedation needs'
          ],
          correctAnswer: 'Preventing ventilator-induced lung injury',
          hint: 'Premature lungs are extremely fragile and prone to barotrauma',
          reference: 'American Academy of Pediatrics Guidelines (2023-2024)'
        }
      },
      {
        id: 'micro-preemie',
        name: 'Micro-Premature Infant - Extreme Prematurity', 
        description: 'Ultra-gentle ventilation for a 650g micro-preemie',
        pathology: 'ards',
        patientType: 'neonate',
        patientWeight: 0.65,
        patientAge: 0.003, // 1 day old
        initialParams: {
          peep: 4,
          pip: 16,
          rr: 60,
          ieRatio: 0.25, // Very short inspiration
          riseTime: 0.1,
          mode: 'pressure',
        },
        learningObjectives: [
          'Master extreme gentle ventilation',
          'Understand developmental lung physiology',
          'Learn to balance minimal settings with adequate gas exchange',
        ],
        assessment: {
          targetTV: 3, // 4.5 mL/kg for 0.65kg 
          targetPlateauMax: 20,
          hint: 'Extreme gentleness: 4-5 mL/kg ACTUAL WEIGHT (0.65kg) max. Driving pressure <8 cmH₂O. Accept permissive hypercapnia. Neonates use actual weight.'
        }
      }
    ],
  },
  {
    key: 'pediatric-advanced',
    level: 'Advanced Pediatric',
    description: 'Complex pediatric pathologies and special situations',
    scenarios: [
      {
        id: 'infant-bronchiolitis',
        name: 'Infant with Severe Bronchiolitis',
        description: 'Manage a 6kg infant with RSV bronchiolitis and air trapping',
        pathology: 'asthma', // Similar airway resistance pattern
        patientType: 'infant',
        patientWeight: 6,
        patientAge: 0.5, // 6 months
        initialParams: {
          peep: 3, // Lower PEEP to prevent further air trapping
          pip: 20,
          rr: 35,
          ieRatio: 0.3, // Long expiratory time
          riseTime: 0.3,
          mode: 'pressure',
        },
        learningObjectives: [
          'Manage viral lower respiratory tract infection',
          'Prevent dynamic hyperinflation in infants',
          'Balance ventilation with natural recovery',
        ],
        quiz: {
          question: 'In bronchiolitis with air trapping, what ventilator strategy is most appropriate?',
          choices: [
            'High PEEP and fast respiratory rate',
            'Low PEEP and longer expiratory time',
            'High tidal volumes for recruitment',
            'Pressure support mode only'
          ],
          correctAnswer: 'Low PEEP and longer expiratory time',
          hint: 'Air trapping requires time for complete exhalation',
          reference: 'Pediatric Critical Care Medicine (2023-2024)'
        }
      },
      {
        id: 'adolescent-trauma',
        name: 'Adolescent Trauma - Pulmonary Contusion',
        description: 'Ventilate a 50kg adolescent with chest trauma and contusion',
        pathology: 'ards',
        patientType: 'adolescent',
        patientWeight: 50,
        patientAge: 15,
        initialParams: {
          peep: 8,
          pip: 25,
          rr: 18,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        learningObjectives: [
          'Apply adult principles to large adolescents',
          'Manage trauma-related lung injury',
          'Consider developmental differences in recovery',
        ],
        assessment: {
          targetTV: 300, // 6 mL/kg for 50kg
          targetPlateauMax: 30,
          hint: 'Large adolescent: Use adult ARDS strategy with IBW calculation (6 mL/kg IBW). For 50kg adolescent at this size, actual weight approximates IBW. Plateau <30, driving pressure <15 cmH₂O.'
        }
      },
      {
        id: 'preschool-pneumonia',
        name: 'Preschooler with Pneumonia and ARDS',
        description: 'Manage severe pneumonia in an 18kg preschooler',
        pathology: 'ards',
        patientType: 'preschool',
        patientWeight: 18,
        patientAge: 4,
        initialParams: {
          peep: 8,
          pip: 24,
          rr: 25,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        learningObjectives: [
          'Manage pediatric ARDS',
          'Balance lung protection with growth needs',
          'Understand pediatric inflammatory responses',
        ],
        quiz: {
          question: 'What PEEP level helps optimize oxygenation in pediatric ARDS while minimizing cardiovascular effects?',
          choices: ['2-4 cmH₂O', '5-8 cmH₂O', '10-15 cmH₂O', '15-20 cmH₂O'],
          correctAnswer: '5-8 cmH₂O',
          hint: 'Moderate PEEP levels balance recruitment with hemodynamic stability',
          reference: 'Pediatric Critical Care Medicine (2023-2024)'
        }
      }
    ],
  },
  {
    key: 'neonatal-advanced',
    level: 'Advanced Neonatal',
    description: 'Complex neonatal conditions and special ventilation modes',
    scenarios: [
      {
        id: 'neonate-cdh',
        name: 'Congenital Diaphragmatic Hernia',
        description: 'Gentle ventilation for a 2.8kg neonate with CDH and pulmonary hypoplasia',
        pathology: 'ards',
        patientType: 'neonate',
        patientWeight: 2.8,
        patientAge: 0.008, // 3 days old
        initialParams: {
          peep: 3, // Low PEEP to avoid barotrauma
          pip: 18,
          rr: 45,
          ieRatio: 0.4,
          riseTime: 0.2,
          mode: 'pressure',
        },
        learningObjectives: [
          'Understand pulmonary hypoplasia physiology',
          'Apply permissive hypercapnia strategies',
          'Avoid barotrauma in fragile lungs',
        ],
        assessment: {
          targetTV: 14, // 5 mL/kg for 2.8kg - very gentle
          targetPlateauMax: 22,
          hint: 'Permissive hypercapnia essential. Use 5 mL/kg ACTUAL WEIGHT (2.8kg). Keep driving pressure <10 cmH₂O. Low compliance expected in CDH.'
        },
        quiz: {
          question: 'In CDH, what is the primary ventilation strategy?',
          choices: [
            'High pressure recruitment maneuvers',
            'Gentle ventilation with permissive hypercapnia', 
            'High PEEP for alveolar recruitment',
            'Hyperventilation to reduce pulmonary pressure'
          ],
          correctAnswer: 'Gentle ventilation with permissive hypercapnia',
          hint: 'CDH lungs are hypoplastic and extremely vulnerable to injury',
          reference: 'American Academy of Pediatrics Guidelines (2023-2024)'
        }
      },
      {
        id: 'neonate-pphn',
        name: 'Persistent Pulmonary Hypertension of Newborn',
        description: 'Optimize ventilation for a 3.5kg term infant with PPHN',
        pathology: 'normal', // Normal compliance but circulation issues
        patientType: 'neonate',
        patientWeight: 3.5,
        patientAge: 0.01,
        initialParams: {
          peep: 5,
          pip: 20,
          rr: 50, // Higher rate for alkalosis strategy
          ieRatio: 0.5,
          riseTime: 0.2,
          mode: 'pressure',
        },
        learningObjectives: [
          'Understand pulmonary vascular physiology',
          'Balance ventilation for pH management',
          'Coordinate with pulmonary vasodilator therapy',
        ],
        quiz: {
          question: 'In PPHN, why might we use mild hyperventilation initially?',
          choices: [
            'To improve oxygenation',
            'To create alkalosis and reduce pulmonary vascular resistance',
            'To prevent CO₂ retention',
            'To increase cardiac output'
          ],
          correctAnswer: 'To create alkalosis and reduce pulmonary vascular resistance',
          hint: 'Alkalosis can help reduce the elevated pulmonary pressures in PPHN',
          reference: 'American Academy of Pediatrics Guidelines (2023-2024)'
        }
      },
      {
        id: 'neonate-meconium',
        name: 'Meconium Aspiration Syndrome',
        description: 'Manage a 3.8kg term neonate with severe meconium aspiration',
        pathology: 'asthma', // Air trapping and resistance pattern
        patientType: 'neonate',
        patientWeight: 3.8,
        patientAge: 0.005,
        initialParams: {
          peep: 4, // Moderate PEEP for recruitment
          pip: 22,
          rr: 45,
          ieRatio: 0.3, // Longer expiration for air trapping
          riseTime: 0.3,
          mode: 'pressure',
        },
        learningObjectives: [
          'Manage chemical pneumonitis',
          'Balance recruitment with air trapping prevention',
          'Understand surfactant dysfunction',
        ],
        assessment: {
          targetTV: 19, // 5 mL/kg for 3.8kg
          targetPlateauMax: 25,
          hint: 'Monitor time constants - MAS causes prolonged expiration. Use 5 mL/kg ACTUAL WEIGHT (3.8kg). Allow 3 TCs for complete emptying.'
        }
      }
    ],
  },
];