// src/data/learningPaths.ts

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
  // NEW: Patient demographics for pediatric scenarios
  patientType?: string;
  patientWeight?: number;
  patientAge?: number;
  learningObjectives?: string[];
  quiz?: {
    question: string;
    correctAnswer: string;
    choices?: string[];    // ← now included in every quiz
    hint?: string;
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
        description: 'Understand normal respiratory patterns and waveforms in a healthy adult',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 35,
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
          question: 'What is the normal tidal volume range for an adult patient?',
          correctAnswer: '400-500 mL',
          hint: 'Think about 6-8 mL/kg of ideal body weight',
          choices: [
            '200-300 mL',
            '400-500 mL',     // ← correct
            '600-700 mL',
            '800-900 mL',
          ],
        },
      },
      {
        id: 'peep-basics',
        name: 'Understanding PEEP',
        description: 'Learn how PEEP affects lung recruitment and oxygenation in a stable adult',
        patientType: 'adult',
        patientWeight: 75,
        patientAge: 42,
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
        },
      },
      {
        id: 'pip-exploration',
        name: 'Peak Inspiratory Pressure',
        description: 'Explore how PIP affects tidal volume delivery in a healthy adult',
        patientType: 'adult',
        patientWeight: 68,
        patientAge: 28,
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
          question: 'What is a typical safe upper limit for peak inspiratory pressure?',
          correctAnswer: '30 cmH₂O',
          hint: 'Above this value, we risk barotrauma',
          choices: [
            '20 cmH₂O',
            '30 cmH₂O',   // ← correct
            '40 cmH₂O',
            '50 cmH₂O',
          ],
        },
      },
      {
        id: 'ie-ratio-basics',
        name: 'I:E Ratio Fundamentals',
        description: 'Learn how inspiratory to expiratory ratio affects ventilation timing',
        patientType: 'adult',
        patientWeight: 80,
        patientAge: 55,
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
          question: 'What is the characteristic flow pattern in COPD?',
          correctAnswer: 'prolonged expiration',
          hint: 'Look at how long it takes for expiratory flow to return to baseline',
          choices: [
            'rapid inspiration',
            'prolonged expiration', // ← correct
            'square wave flow',
            'double triggering',
          ],
        },
      },
      {
        id: 'copd-management',
        name: 'Managing COPD Ventilation',
        description: 'Optimize ventilator settings for a COPD exacerbation patient',
        patientType: 'adult',
        patientWeight: 78,
        patientAge: 58,
        initialParams: {
          peep: 5,
          pip: 30,
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
        assessment: {
          targetTV: 400,
          targetPlateauMax: 30,
          hint: 'Lower the respiratory rate and adjust I:E ratio to allow complete exhalation',
        },
      },
      {
        id: 'ards-recognition',
        name: 'ARDS Waveform Patterns',
        description: 'Identify acute respiratory distress syndrome in a 45-year-old ICU patient',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 45,
        initialParams: {
          peep: 5,
          pip: 35,
          rr: 16,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Recognize reduced lung compliance',
          'Identify high pressure requirements',
          'Understand the need for lung protective ventilation',
        ],
        quiz: {
          question: 'What is the hallmark of ARDS on ventilator waveforms?',
          correctAnswer: 'decreased compliance',
          hint: 'Look at how much pressure is needed to deliver a normal tidal volume',
          choices: [
            'increased compliance',
            'decreased compliance', // ← correct
            'prolonged expiration',
            'absent flow',
          ],
        },
      },
      {
        id: 'ards-protective',
        name: 'Lung Protective Ventilation',
        description: 'Apply ARDSnet protocol for a 70kg patient with severe ARDS',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 52,
        initialParams: {
          peep: 8,
          pip: 40,
          rr: 20,
          ieRatio: 1,
          riseTime: 0.3,
          mode: 'volume',
        },
        pathology: 'ards',
        learningObjectives: [
          'Set appropriate tidal volumes (6 mL/kg)',
          'Maintain plateau pressure < 30 cmH₂O',
          'Use adequate PEEP for recruitment',
        ],
        assessment: {
          targetTV: 350,
          targetPlateauMax: 30,
          hint: 'Reduce tidal volume to 6 mL/kg and increase PEEP for recruitment',
        },
      },
      {
        id: 'asthma-crisis',
        name: 'Acute Asthma Exacerbation',
        description: 'Manage severe bronchospasm in a 32-year-old with status asthmaticus',
        patientType: 'adult',
        patientWeight: 65,
        patientAge: 32,
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
        description: 'Identify sudden changes indicating pneumothorax in a trauma patient',
        patientType: 'adult',
        patientWeight: 85,
        patientAge: 29,
        initialParams: {
          peep: 5,
          pip: 30,
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
        },
      },
      {
        id: 'pressure-control-basics',
        name: 'Pressure Control Ventilation',
        description: 'Master pressure-targeted ventilation in a stable 75kg patient',
        patientType: 'adult',
        patientWeight: 75,
        patientAge: 48,
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
        },
      },
      {
        id: 'pressure-support-weaning',
        name: 'Pressure Support Ventilation',
        description: 'Use PSV for weaning assessment in a recovering 68kg patient',
        patientType: 'adult',
        patientWeight: 68,
        patientAge: 61,
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
          targetTV: 400,
          targetPlateauMax: 20,
          hint: 'Adjust pressure support level to achieve adequate tidal volume',
        },
      },
      {
        id: 'weaning-failure-recognition',
        name: 'Identifying Weaning Failure',
        description: 'Recognize signs of respiratory distress during weaning trial',
        patientType: 'adult',
        patientWeight: 72,
        patientAge: 67,
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
          correctAnswer: '105',
          hint: 'Rapid Shallow Breathing Index = RR / TV (in L)',
          choices: [
            '80',
            '95',
            '105', // ← correct
            '120',
          ],
        },
      },
      {
        id: 'auto-peep-management',
        name: 'Auto-PEEP Detection and Management',
        description: 'Identify and correct intrinsic PEEP in a COPD patient',
        patientType: 'adult',
        patientWeight: 76,
        patientAge: 71,
        initialParams: {
          peep: 5,
          pip: 30,
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
        assessment: {
          targetTV: 400,
          targetPlateauMax: 28,
          hint: 'Reduce respiratory rate and increase expiratory time to eliminate auto-PEEP',
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
        description: 'Optimize ventilation during prone positioning for severe ARDS',
        patientType: 'adult',
        patientWeight: 82,
        patientAge: 39,
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
          'Understand prone positioning benefits',
          'Adjust settings for position changes',
          'Monitor for complications',
        ],
        assessment: {
          targetTV: 350,
          targetPlateauMax: 28,
          hint: 'Use higher PEEP and pressure control mode for better distribution',
        },
      },
      {
        id: 'vili-prevention',
        name: 'Preventing Ventilator-Induced Lung Injury',
        description: 'Balance oxygenation needs with lung protection in severe ARDS',
        patientType: 'adult',
        patientWeight: 70,
        patientAge: 44,
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
          'Calculate driving pressure',
          'Optimize PEEP using compliance',
          'Apply permissive hypercapnia when needed',
        ],
        quiz: {
          question: 'What is the maximum recommended driving pressure?',
          correctAnswer: '15',
          hint: 'Driving pressure = Plateau pressure - PEEP',
          choices: [
            '10',
            '15', // ← correct
            '20',
            '25',
          ],
        },
      },
      {
        id: 'dyssynchrony-management',
        name: 'Patient-Ventilator Dyssynchrony',
        description: 'Identify and correct all types of dyssynchrony in an agitated patient',
        patientType: 'adult',
        patientWeight: 73,
        patientAge: 56,
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
        },
      },
      {
        id: 'rescue-strategies',
        name: 'Rescue Oxygenation Strategies',
        description: 'Apply advanced techniques for refractory hypoxemia in COVID ARDS',
        patientType: 'adult',
        patientWeight: 78,
        patientAge: 51,
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
        assessment: {
          targetTV: 300,
          targetPlateauMax: 30,
          hint: 'Use inverse ratio (increase I:E > 1) and high PEEP strategy',
        },
      },
      {
        id: 'multi-organ-failure',
        name: 'Ventilation in Multi-Organ Failure',
        description: 'Balance respiratory support with other organ systems in septic shock',
        patientType: 'adult',
        patientWeight: 69,
        patientAge: 63,
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
          'Consider hemodynamic effects of ventilation',
          'Adjust for renal replacement therapy',
          'Manage increased intracranial pressure concerns',
        ],
        quiz: {
          question: 'How does high PEEP affect cardiac output?',
          correctAnswer: 'decreases',
          hint: 'Increased intrathoracic pressure reduces venous return',
          choices: [
            'increases',
            'decreases',  // ← correct
            'stays the same',
            'becomes unpredictable',
          ],
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
          'Calculate weight-based tidal volumes (6-8 mL/kg)',
          'Understand age-appropriate respiratory rates',
          'Learn pediatric pressure limits',
        ],
        quiz: {
          question: 'For a 25kg child, what is the appropriate tidal volume range?',
          choices: ['100-125 mL', '150-200 mL', '200-250 mL', '300-350 mL'],
          correctAnswer: '150-200 mL',
          hint: 'Pediatric tidal volume is typically 6-8 mL/kg'
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
          hint: 'Asthma causes airway obstruction, making expiration difficult'
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
        ],
        assessment: {
          targetTV: 36, // 6 mL/kg for 6kg
          targetPlateauMax: 20,
          hint: 'Target 6 mL/kg with gentle pressures for infant lungs'
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
          hint: 'Neonates have much higher respiratory rates than older children'
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
          hint: 'Use gentle ventilation: 4-6 mL/kg and peak pressure <25 cmH₂O'
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
          hint: 'Premature lungs are extremely fragile and prone to barotrauma'
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
          targetTV: 3.25, // 5 mL/kg for 0.65kg 
          targetPlateauMax: 20,
          hint: 'Extreme gentleness required: <5 mL/kg and peak pressure <20 cmH₂O'
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
          hint: 'Air trapping requires time for complete exhalation'
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
          hint: 'Lung protective strategy: 6 mL/kg and plateau <30 cmH₂O'
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
          hint: 'Moderate PEEP levels balance recruitment with hemodynamic stability'
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
          hint: 'Permissive hypercapnia acceptable - avoid barotrauma at all costs'
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
          hint: 'CDH lungs are hypoplastic and extremely vulnerable to injury'
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
          hint: 'Alkalosis can help reduce the elevated pulmonary pressures in PPHN'
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
          hint: 'Balance recruitment with avoiding air trapping - watch for auto-PEEP'
        }
      }
    ],
  },
];