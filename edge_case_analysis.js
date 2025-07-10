// Edge Case Analysis for IBW Calculations
// Testing extreme heights and validating against clinical ARDSnet tables

const calculateIBW = (heightCm, gender) => {
  const heightInches = heightCm / 2.54;
  if (gender === 'male') {
    return Math.max(50, 50 + 2.3 * (heightInches - 60));
  } else {
    return Math.max(45.5, 45.5 + 2.3 * (heightInches - 60));
  }
};

console.log("=".repeat(80));
console.log("EDGE CASE ANALYSIS FOR IBW CALCULATIONS");
console.log("=".repeat(80));

console.log("\n1. TESTING EXTREME SHORT PATIENTS");
console.log("-".repeat(50));

const shortPatients = [
  { height: 140, gender: 'female', description: 'Extremely short female (dwarfism)' },
  { height: 145, gender: 'female', description: 'Very short female' },
  { height: 150, gender: 'male', description: 'Extremely short male (dwarfism)' },
  { height: 155, gender: 'male', description: 'Very short male' }
];

shortPatients.forEach(patient => {
  const ibw = calculateIBW(patient.height, patient.gender);
  const heightInches = patient.height / 2.54;
  const tv6ml = Math.round(ibw * 6);
  const tv4ml = Math.round(ibw * 4);
  const tv8ml = Math.round(ibw * 8);
  
  console.log(`${patient.description}:`);
  console.log(`  Height: ${patient.height}cm (${heightInches.toFixed(1)}")`);
  console.log(`  IBW: ${ibw.toFixed(1)} kg`);
  console.log(`  TV range: ${tv4ml}-${tv8ml} mL (target: ${tv6ml} mL)`);
  
  // Check if minimum weight threshold is applied
  const expectedMinimum = patient.gender === 'male' ? 50 : 45.5;
  if (ibw === expectedMinimum) {
    console.log(`  ✅ Minimum weight threshold (${expectedMinimum} kg) correctly applied`);
  }
  console.log("");
});

console.log("\n2. TESTING EXTREME TALL PATIENTS");
console.log("-".repeat(50));

const tallPatients = [
  { height: 190, gender: 'male', description: 'Very tall male' },
  { height: 200, gender: 'male', description: 'Extremely tall male (basketball player)' },
  { height: 210, gender: 'male', description: 'Giant male (medical gigantism)' },
  { height: 180, gender: 'female', description: 'Very tall female' },
  { height: 190, gender: 'female', description: 'Extremely tall female (basketball player)' },
  { height: 200, gender: 'female', description: 'Giant female (medical gigantism)' }
];

tallPatients.forEach(patient => {
  const ibw = calculateIBW(patient.height, patient.gender);
  const heightInches = patient.height / 2.54;
  const tv6ml = Math.round(ibw * 6);
  const tv4ml = Math.round(ibw * 4);
  const tv8ml = Math.round(ibw * 8);
  
  console.log(`${patient.description}:`);
  console.log(`  Height: ${patient.height}cm (${heightInches.toFixed(1)}")`);
  console.log(`  IBW: ${ibw.toFixed(1)} kg`);
  console.log(`  TV range: ${tv4ml}-${tv8ml} mL (target: ${tv6ml} mL)`);
  console.log("");
});

console.log("\n3. CLINICAL ARDSNET TABLE VERIFICATION");
console.log("-".repeat(50));

// Cross-reference with published ARDSnet tables (approximate values)
const ardsnetReference = [
  // Males (cm to IBW)
  { height: 152, gender: 'male', publishedIBW: 50.0 },
  { height: 157, gender: 'male', publishedIBW: 54.3 },
  { height: 163, gender: 'male', publishedIBW: 59.5 },
  { height: 168, gender: 'male', publishedIBW: 64.1 },
  { height: 173, gender: 'male', publishedIBW: 68.6 },
  { height: 178, gender: 'male', publishedIBW: 73.2 },
  { height: 183, gender: 'male', publishedIBW: 77.7 },
  { height: 188, gender: 'male', publishedIBW: 82.3 },
  
  // Females (cm to IBW)
  { height: 152, gender: 'female', publishedIBW: 45.5 },
  { height: 157, gender: 'female', publishedIBW: 49.7 },
  { height: 163, gender: 'female', publishedIBW: 55.1 },
  { height: 168, gender: 'female', publishedIBW: 59.6 },
  { height: 173, gender: 'female', publishedIBW: 64.1 },
  { height: 178, gender: 'female', publishedIBW: 68.6 },
  { height: 183, gender: 'female', publishedIBW: 73.2 }
];

console.log("Comparing calculated IBW with published ARDSnet values:");
console.log("");

let maxError = 0;
ardsnetReference.forEach(ref => {
  const calculated = calculateIBW(ref.height, ref.gender);
  const difference = Math.abs(calculated - ref.publishedIBW);
  const percentError = (difference / ref.publishedIBW) * 100;
  
  maxError = Math.max(maxError, percentError);
  
  console.log(`${ref.gender.charAt(0).toUpperCase() + ref.gender.slice(1)} ${ref.height}cm:`);
  console.log(`  Published IBW: ${ref.publishedIBW} kg`);
  console.log(`  Calculated IBW: ${calculated.toFixed(1)} kg`);
  console.log(`  Difference: ${difference.toFixed(1)} kg (${percentError.toFixed(1)}% error)`);
  
  if (percentError > 1.0) {
    console.log(`  ⚠️  Error exceeds 1%`);
  } else {
    console.log(`  ✅ Within acceptable range`);
  }
  console.log("");
});

console.log(`Maximum error found: ${maxError.toFixed(2)}%`);

console.log("\n4. TESTING BOUNDARY CONDITIONS");
console.log("-".repeat(50));

// Test the exact boundary where minimum weight kicks in
const boundaryTests = [
  { description: 'Male at 60 inches (152.4cm) - boundary height', height: 152.4, gender: 'male' },
  { description: 'Female at 60 inches (152.4cm) - boundary height', height: 152.4, gender: 'female' },
  { description: 'Male just below boundary', height: 151, gender: 'male' },
  { description: 'Female just below boundary', height: 151, gender: 'female' },
  { description: 'Male just above boundary', height: 154, gender: 'male' },
  { description: 'Female just above boundary', height: 154, gender: 'female' }
];

boundaryTests.forEach(test => {
  const ibw = calculateIBW(test.height, test.gender);
  const heightInches = test.height / 2.54;
  const formulaResult = test.gender === 'male' ? 
    50 + 2.3 * (heightInches - 60) : 
    45.5 + 2.3 * (heightInches - 60);
  const minimum = test.gender === 'male' ? 50 : 45.5;
  
  console.log(`${test.description}:`);
  console.log(`  Height: ${test.height}cm (${heightInches.toFixed(1)}")`);
  console.log(`  Formula result: ${formulaResult.toFixed(1)} kg`);
  console.log(`  Final IBW: ${ibw.toFixed(1)} kg`);
  console.log(`  Minimum applied: ${ibw === minimum ? 'Yes' : 'No'}`);
  console.log("");
});

console.log("\n5. REALISTIC HEIGHT/WEIGHT COMBINATIONS ANALYSIS");
console.log("-".repeat(50));

// Analyze the scenarios from learningPaths.ts for realistic combinations
const scenarios = [
  { name: 'Normal male', height: 175, actualWeight: 70, gender: 'male' },
  { name: 'Overweight female', height: 165, actualWeight: 75, gender: 'female' },
  { name: 'Obese female trauma patient', height: 175, actualWeight: 85, gender: 'female' },
  { name: 'Elderly thin female', height: 158, actualWeight: 76, gender: 'female' },
  { name: 'Large male with ARDS', height: 182, actualWeight: 82, gender: 'male' }
];

scenarios.forEach(scenario => {
  const ibw = calculateIBW(scenario.height, scenario.gender);
  const bmiActual = scenario.actualWeight / Math.pow(scenario.height / 100, 2);
  const bmiIBW = ibw / Math.pow(scenario.height / 100, 2);
  const weightDifference = scenario.actualWeight - ibw;
  const percentDifference = (weightDifference / ibw) * 100;
  
  console.log(`${scenario.name}:`);
  console.log(`  Actual weight: ${scenario.actualWeight} kg`);
  console.log(`  IBW: ${ibw.toFixed(1)} kg`);
  console.log(`  Weight difference: ${weightDifference.toFixed(1)} kg (${percentDifference.toFixed(1)}%)`);
  console.log(`  BMI (actual): ${bmiActual.toFixed(1)}`);
  console.log(`  BMI (IBW): ${bmiIBW.toFixed(1)}`);
  
  // Clinical significance analysis
  const tvActual = Math.round(scenario.actualWeight * 6);
  const tvIBW = Math.round(ibw * 6);
  const tvDifference = tvActual - tvIBW;
  
  console.log(`  TV if using actual weight: ${tvActual} mL`);
  console.log(`  TV using IBW (correct): ${tvIBW} mL`);
  console.log(`  TV difference: ${tvDifference} mL`);
  
  if (Math.abs(tvDifference) > 50) {
    console.log(`  ⚠️  SIGNIFICANT DIFFERENCE: Using actual weight would cause ${tvDifference > 0 ? 'over' : 'under'}ventilation`);
  } else {
    console.log(`  ✅ Minimal clinical impact`);
  }
  console.log("");
});

console.log("\n6. FORMULA VERIFICATION AT KEY POINTS");
console.log("-".repeat(50));

// Manually verify the formula at key points
const keyPoints = [
  { height: 152.4, gender: 'male', expectedIBW: 50.0, note: '60 inches exactly - minimum threshold' },
  { height: 157.5, gender: 'male', expectedIBW: 54.65, note: '62 inches - above threshold' },
  { height: 152.4, gender: 'female', expectedIBW: 45.5, note: '60 inches exactly - minimum threshold' },
  { height: 157.5, gender: 'female', expectedIBW: 50.15, note: '62 inches - above threshold' }
];

keyPoints.forEach(point => {
  const calculated = calculateIBW(point.height, point.gender);
  const heightInches = point.height / 2.54;
  const manualCalc = point.gender === 'male' ? 
    Math.max(50, 50 + 2.3 * (heightInches - 60)) :
    Math.max(45.5, 45.5 + 2.3 * (heightInches - 60));
  
  console.log(`${point.note}:`);
  console.log(`  Height: ${point.height}cm (${heightInches.toFixed(1)}")`);
  console.log(`  Expected: ${point.expectedIBW} kg`);
  console.log(`  Manual calculation: ${manualCalc.toFixed(2)} kg`);
  console.log(`  Function result: ${calculated.toFixed(2)} kg`);
  console.log(`  Match: ${Math.abs(calculated - manualCalc) < 0.01 ? 'Yes' : 'No'}`);
  console.log("");
});

console.log("=".repeat(80));
console.log("EDGE CASE ANALYSIS COMPLETE");
console.log("=".repeat(80));