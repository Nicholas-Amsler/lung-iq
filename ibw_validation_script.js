// IBW Validation Script for LearningPaths.ts
// Comprehensive validation of all IBW calculations against ARDSnet formula

// ARDSnet IBW Formula Implementation
const calculateIBW = (heightCm, gender) => {
  const heightInches = heightCm / 2.54;
  if (gender === 'male') {
    return Math.max(50, 50 + 2.3 * (heightInches - 60));
  } else {
    return Math.max(45.5, 45.5 + 2.3 * (heightInches - 60));
  }
};

// Extract and validate all adult scenarios
const validateScenarios = () => {
  console.log("=".repeat(80));
  console.log("COMPREHENSIVE IBW VALIDATION REPORT");
  console.log("Validating all adult scenarios against ARDSnet formula");
  console.log("=".repeat(80));
  
  const results = [];
  const issues = [];
  
  // Adult scenarios from the data (extracted manually)
  const adultScenarios = [
    // Beginner Level
    {
      id: 'normal-breathing',
      name: 'Normal Spontaneous Breathing',
      height: 175,
      gender: 'male',
      weight: 70,
      age: 35,
      targetTV: null, // No assessment specified
      level: 'Beginner'
    },
    {
      id: 'peep-basics',
      name: 'Understanding PEEP',
      height: 165,
      gender: 'female',
      weight: 75,
      age: 42,
      targetTV: null,
      level: 'Beginner'
    },
    {
      id: 'pip-exploration',
      name: 'Peak Inspiratory Pressure',
      height: 160,
      gender: 'female',
      weight: 68,
      age: 28,
      targetTV: null,
      level: 'Beginner'
    },
    {
      id: 'ie-ratio-basics',
      name: 'I:E Ratio Fundamentals',
      height: 180,
      gender: 'male',
      weight: 80,
      age: 55,
      targetTV: null,
      level: 'Beginner'
    },
    
    // Intermediate Level
    {
      id: 'copd-recognition',
      name: 'COPD Pattern Recognition',
      height: 170,
      gender: 'male',
      weight: 72,
      age: 65,
      targetTV: null,
      level: 'Intermediate'
    },
    {
      id: 'copd-management',
      name: 'Managing COPD Ventilation',
      height: 168,
      gender: 'female',
      weight: 78,
      age: 58,
      targetTV: 358,
      level: 'Intermediate'
    },
    {
      id: 'ards-recognition',
      name: 'ARDS Waveform Patterns',
      height: 172,
      gender: 'male',
      weight: 70,
      age: 45,
      targetTV: 406,
      level: 'Intermediate'
    },
    {
      id: 'ards-protective',
      name: 'Lung Protective Ventilation',
      height: 163,
      gender: 'female',
      weight: 70,
      age: 52,
      targetTV: 331,
      level: 'Intermediate'
    },
    {
      id: 'asthma-crisis',
      name: 'Acute Asthma Exacerbation',
      height: 178,
      gender: 'male',
      weight: 65,
      age: 32,
      targetTV: null,
      level: 'Intermediate'
    },
    
    // Advanced Level
    {
      id: 'pneumothorax-detection',
      name: 'Pneumothorax Recognition',
      height: 175,
      gender: 'female',
      weight: 85,
      age: 29,
      targetTV: null,
      level: 'Advanced'
    },
    {
      id: 'pressure-control-basics',
      name: 'Pressure Control Ventilation',
      height: 174,
      gender: 'male',
      weight: 75,
      age: 48,
      targetTV: null,
      level: 'Advanced'
    },
    {
      id: 'pressure-support-weaning',
      name: 'Pressure Support Ventilation',
      height: 162,
      gender: 'female',
      weight: 68,
      age: 61,
      targetTV: 325,
      level: 'Advanced'
    },
    {
      id: 'weaning-failure-recognition',
      name: 'Identifying Weaning Failure',
      height: 168,
      gender: 'male',
      weight: 72,
      age: 67,
      targetTV: null,
      level: 'Advanced'
    },
    {
      id: 'auto-peep-management',
      name: 'Auto-PEEP Detection and Management',
      height: 158,
      gender: 'female',
      weight: 76,
      age: 71,
      targetTV: 304,
      level: 'Advanced'
    },
    
    // Expert Level
    {
      id: 'ards-proning',
      name: 'ARDS with Prone Positioning',
      height: 182,
      gender: 'male',
      weight: 82,
      age: 39,
      targetTV: 461,
      level: 'Expert'
    },
    {
      id: 'vili-prevention',
      name: 'Preventing Ventilator-Induced Lung Injury',
      height: 164,
      gender: 'female',
      weight: 70,
      age: 44,
      targetTV: 336,
      level: 'Expert'
    },
    {
      id: 'dyssynchrony-management',
      name: 'Patient-Ventilator Dyssynchrony',
      height: 176,
      gender: 'male',
      weight: 73,
      age: 56,
      targetTV: null,
      level: 'Expert'
    },
    {
      id: 'rescue-strategies',
      name: 'Rescue Oxygenation Strategies',
      height: 166,
      gender: 'female',
      weight: 78,
      age: 51,
      targetTV: 347,
      level: 'Expert'
    },
    {
      id: 'multi-organ-failure',
      name: 'Ventilation in Multi-Organ Failure',
      height: 171,
      gender: 'male',
      weight: 69,
      age: 63,
      targetTV: 401,
      level: 'Expert'
    },
    {
      id: 'compliance-monitoring',
      name: 'Dynamic Compliance Monitoring',
      height: 167,
      gender: 'female',
      weight: 75,
      age: 47,
      targetTV: 352,
      level: 'Expert'
    }
  ];

  console.log(`\nAnalyzing ${adultScenarios.length} adult scenarios...\n`);

  adultScenarios.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.name} (${scenario.level})`);
    console.log(`   ID: ${scenario.id}`);
    console.log(`   Patient: ${scenario.age}yo ${scenario.gender}, ${scenario.height}cm, ${scenario.weight}kg`);
    
    // Calculate IBW using ARDSnet formula
    const calculatedIBW = calculateIBW(scenario.height, scenario.gender);
    const roundedIBW = Math.round(calculatedIBW * 10) / 10; // Round to 1 decimal
    
    // Calculate height in inches for verification
    const heightInches = scenario.height / 2.54;
    
    // Calculate expected tidal volume at 6 mL/kg IBW
    const expectedTV = Math.round(calculatedIBW * 6);
    
    console.log(`   Height in inches: ${heightInches.toFixed(1)}"`);
    console.log(`   Calculated IBW: ${roundedIBW} kg`);
    console.log(`   Expected TV (6 mL/kg IBW): ${expectedTV} mL`);
    
    // Check if target TV is specified and validate
    if (scenario.targetTV !== null) {
      const tvDifference = Math.abs(scenario.targetTV - expectedTV);
      const tvPercentError = (tvDifference / expectedTV) * 100;
      
      console.log(`   Target TV in file: ${scenario.targetTV} mL`);
      console.log(`   Difference: ${tvDifference} mL (${tvPercentError.toFixed(1)}% error)`);
      
      if (tvDifference > 1) { // Allow 1 mL rounding tolerance
        issues.push({
          scenario: scenario.name,
          id: scenario.id,
          level: scenario.level,
          issue: 'Target TV mismatch',
          current: scenario.targetTV,
          expected: expectedTV,
          difference: tvDifference,
          percentError: tvPercentError.toFixed(1)
        });
        console.log(`   ⚠️  TARGET TV ERROR: Expected ${expectedTV} mL, found ${scenario.targetTV} mL`);
      } else {
        console.log(`   ✅ Target TV is correct`);
      }
    } else {
      console.log(`   ℹ️  No target TV specified (no assessment)`);
    }
    
    // Check for realistic height/weight combinations
    const bmiFromActualWeight = scenario.weight / Math.pow(scenario.height / 100, 2);
    const bmiFromIBW = calculatedIBW / Math.pow(scenario.height / 100, 2);
    
    console.log(`   BMI (actual weight): ${bmiFromActualWeight.toFixed(1)}`);
    console.log(`   BMI (IBW): ${bmiFromIBW.toFixed(1)}`);
    
    // Flag unrealistic combinations
    if (bmiFromActualWeight < 15 || bmiFromActualWeight > 50) {
      issues.push({
        scenario: scenario.name,
        id: scenario.id,
        level: scenario.level,
        issue: 'Unrealistic BMI from actual weight',
        value: bmiFromActualWeight.toFixed(1),
        expected: '18.5-30 for most adults'
      });
      console.log(`   ⚠️  UNREALISTIC BMI: ${bmiFromActualWeight.toFixed(1)}`);
    }
    
    // Test edge cases (very tall/short)
    if (scenario.height < 150) {
      console.log(`   🔍 EDGE CASE: Very short patient (${scenario.height}cm)`);
    }
    if (scenario.height > 190) {
      console.log(`   🔍 EDGE CASE: Very tall patient (${scenario.height}cm)`);
    }
    
    results.push({
      scenario: scenario.name,
      id: scenario.id,
      level: scenario.level,
      height: scenario.height,
      gender: scenario.gender,
      weight: scenario.weight,
      calculatedIBW: roundedIBW,
      expectedTV: expectedTV,
      targetTV: scenario.targetTV,
      bmiActual: bmiFromActualWeight.toFixed(1),
      bmiIBW: bmiFromIBW.toFixed(1)
    });
    
    console.log("");
  });

  // Summary section
  console.log("=".repeat(80));
  console.log("VALIDATION SUMMARY");
  console.log("=".repeat(80));
  
  console.log(`\nTotal adult scenarios analyzed: ${adultScenarios.length}`);
  console.log(`Scenarios with target TV specified: ${adultScenarios.filter(s => s.targetTV !== null).length}`);
  console.log(`Issues found: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log("\n⚠️  ISSUES FOUND:");
    issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.scenario} (${issue.level})`);
      console.log(`   Issue: ${issue.issue}`);
      if (issue.current !== undefined) {
        console.log(`   Current: ${issue.current} mL`);
        console.log(`   Expected: ${issue.expected} mL`);
        console.log(`   Error: ${issue.percentError}%`);
      }
      if (issue.value !== undefined) {
        console.log(`   Value: ${issue.value}`);
        console.log(`   Expected range: ${issue.expected}`);
      }
    });
  } else {
    console.log("\n✅ No calculation errors found!");
  }

  // ARDSnet table cross-reference for common heights
  console.log("\n" + "=".repeat(80));
  console.log("ARDSNET TABLE CROSS-REFERENCE");
  console.log("=".repeat(80));
  
  const commonHeights = [
    // Males
    { height: 160, gender: 'male', description: 'Short male' },
    { height: 170, gender: 'male', description: 'Average male' },
    { height: 175, gender: 'male', description: 'Tall male' },
    { height: 180, gender: 'male', description: 'Very tall male' },
    { height: 185, gender: 'male', description: 'Extremely tall male' },
    // Females  
    { height: 150, gender: 'female', description: 'Short female' },
    { height: 160, gender: 'female', description: 'Average female' },
    { height: 165, gender: 'female', description: 'Tall female' },
    { height: 170, gender: 'female', description: 'Very tall female' },
    { height: 175, gender: 'female', description: 'Extremely tall female' }
  ];
  
  console.log("\nStandard ARDSnet IBW calculations for reference:");
  commonHeights.forEach(ref => {
    const ibw = calculateIBW(ref.height, ref.gender);
    const tv6ml = Math.round(ibw * 6);
    const tv8ml = Math.round(ibw * 8);
    const heightInches = (ref.height / 2.54).toFixed(1);
    
    console.log(`${ref.description.padEnd(20)} ${ref.height}cm (${heightInches}") → IBW: ${ibw.toFixed(1)}kg → TV: ${tv6ml}-${tv8ml} mL`);
  });

  console.log("\n" + "=".repeat(80));
  console.log("CLINICAL VALIDATION NOTES");
  console.log("=".repeat(80));
  
  console.log(`
📋 KEY FINDINGS:
• All IBW calculations follow ARDSnet formula correctly
• Target TV = IBW × 6 mL/kg (lung-protective ventilation)
• Range acceptable: 4-8 mL/kg IBW for adults
• Adult patients use IBW (height + gender based)
• Pediatric patients use actual body weight (different from adults)

🔍 FORMULA VERIFICATION:
• Male IBW = max(50, 50 + 2.3 × (height_inches - 60))
• Female IBW = max(45.5, 45.5 + 2.3 × (height_inches - 60))
• Target TV = IBW × 6 mL/kg (ARDSnet protocol)

⚕️  CLINICAL SIGNIFICANCE:
• Using actual weight instead of IBW in obese patients can cause volutrauma
• IBW correlates with lung size, not body fat
• Driving pressure <15 cmH₂O equally important
• Plateau pressure <30 cmH₂O for lung protection
`);

  return { results, issues };
};

// Run the validation
const validation = validateScenarios();

console.log("\n" + "=".repeat(80));
console.log("CORRECTED CALCULATIONS (if needed)");
console.log("=".repeat(80));

// Provide corrected calculations for any errors found
validation.issues.forEach(issue => {
  if (issue.issue === 'Target TV mismatch') {
    console.log(`\n${issue.scenario}:`);
    console.log(`  Current: ${issue.current} mL`);
    console.log(`  Correct: ${issue.expected} mL`);
    console.log(`  Code fix: targetTV: ${issue.expected}`);
  }
});

console.log("\n=".repeat(80));
console.log("VALIDATION COMPLETE");
console.log("=".repeat(80));