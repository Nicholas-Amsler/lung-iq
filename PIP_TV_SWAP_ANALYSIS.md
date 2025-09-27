# PIP/Tidal Volume Control Swap Analysis
## LungIQ Ventilator Simulator

### Executive Summary
This document analyzes the proposed change to swap PIP (Peak Inspiratory Pressure) and Tidal Volume controls in volume control mode to better match real-world clinical ventilator operation.

---

## 1. CURRENT SYSTEM BEHAVIOR

### Volume Control Mode
- **User adjusts**: PIP (Peak Inspiratory Pressure) via slider
- **System calculates**: Tidal Volume using TV = Compliance × (PIP - PEEP)
- **Display**: Shows resulting tidal volume

### Pressure Control Mode
- **User adjusts**: PIP (correct for this mode)
- **System calculates**: Tidal Volume based on compliance
- **Display**: Shows resulting tidal volume

### Current Calculation Flow
```
User Input (PIP) → Calculate Driving Pressure → Apply Compliance → Safety Limits → Display TV
```

---

## 2. PROPOSED CHANGE

### Volume Control Mode (NEW)
- **User adjusts**: Tidal Volume via slider
- **System calculates**: Required PIP using PIP = (TV / Compliance) + PEEP
- **Display**: Shows resulting PIP with safety warnings

### Pressure Control Mode (NO CHANGE)
- Remains as is (user controls PIP)

### New Calculation Flow (Volume Control Only)
```
User Input (TV) → Apply Safety Limits → Calculate Required Compliance → Calculate PIP → Display/Warnings
```

---

## 3. IMPACT ANALYSIS

### 3.1 Code Changes Required

#### A. UI/Control Changes
- **Location**: `/src/pages/index.tsx` lines ~1180-1200
- **Change**: Replace PIP slider with TV slider in volume control mode
- **Complexity**: MEDIUM - Need conditional rendering based on mode

#### B. Calculation Function Changes
- **Current**: `calculateTidalVolume(pip, peep, patientType, weight, condition)`
- **New Need**: `calculateRequiredPIP(targetTV, peep, patientType, weight, condition)`
- **Location**: New function needed around line 225
- **Complexity**: HIGH - Must handle inverse calculation with safety checks

#### C. State Management
- **Current States**: `pip`, `peep`, `rr`, etc.
- **New State Needed**: `targetTidalVolume` or modify existing flow
- **Complexity**: HIGH - Affects multiple components and calculations

#### D. Waveform Generation
- **Function**: `generateClinicalWaveform()` (line ~408)
- **Impact**: May need to accept TV as input for volume mode
- **Complexity**: MEDIUM - Conditional logic based on mode

### 3.2 Learning Path Impact

#### Scenarios Using Volume Control Mode
1. **Normal Spontaneous Breathing** (beginner)
   - Initial PIP: 20 → Need target TV calculation
   - Impact: LOW - Educational value improved

2. **PEEP Basics** (beginner)
   - Initial PIP: 25 → Convert to TV target
   - Impact: LOW - Better demonstrates PEEP effect

3. **PIP Exploration** (beginner)
   - Initial PIP: 30 → Major rework needed
   - Impact: HIGH - Entire scenario about PIP adjustment

4. **ARDS Recognition** (intermediate)
   - Uses volume control with specific PIP
   - Impact: MEDIUM - Need TV-based approach

5. **Multiple other scenarios**...

#### Assessment Impact
- **10+ scenarios** have `targetTV` assessments
- These expect specific TV values from PIP settings
- **Risk**: Assessments may break if PIP-TV relationship changes

#### Quiz Impact
- Several quizzes reference tidal volume calculations
- Questions about "setting appropriate tidal volumes"
- **Benefit**: More clinically accurate after change

### 3.3 Safety Considerations

#### New Safety Checks Needed
1. **High Pressure Alarms**
   - Display when calculated PIP > 35 cmH₂O
   - Visual/audio warnings for dangerous pressures

2. **Plateau Pressure Monitoring**
   - Calculate and display plateau (PIP - flow resistance)
   - Warn when plateau > 30 cmH₂O

3. **Driving Pressure Alerts**
   - Show when driving pressure > 15 cmH₂O
   - Critical for ARDS scenarios

4. **Mode Confusion Prevention**
   - Clear labeling of control differences
   - Educational tooltips explaining mode behavior

---

## 4. IMPLEMENTATION RISKS

### High Risk Areas
1. **Breaking Existing Scenarios**: ~20 scenarios may need PIP recalculation
2. **Assessment Logic**: Target values may no longer match
3. **State Management Complexity**: Bidirectional calculations needed
4. **Mode Switching**: Ensuring smooth transitions between modes

### Medium Risk Areas
1. **User Confusion**: Existing users expecting PIP control
2. **Tutorial Updates**: Current overlay may reference old behavior
3. **Mobile Interface**: Limited space for new warnings/displays

### Low Risk Areas
1. **Pressure Control Mode**: Remains unchanged
2. **Basic calculations**: Compliance formulas stay same
3. **Visual waveforms**: Shape generation unchanged

---

## 5. IMPLEMENTATION STRATEGY

### Phase 1: Foundation (Non-Breaking)
1. Create `calculateRequiredPIP()` function
2. Add `targetTidalVolume` state variable
3. Create TV range calculation functions
4. Build safety check functions

### Phase 2: UI Implementation
1. Add mode-conditional rendering for controls
2. Create TV slider component with safety ranges
3. Add PIP display with warning states
4. Implement smooth mode switching

### Phase 3: Scenario Migration
1. Calculate appropriate TV targets for each scenario
2. Update initial parameters to use TV instead of PIP
3. Verify assessments still work correctly
4. Update quiz questions/hints as needed

### Phase 4: Testing & Validation
1. Test all learning paths thoroughly
2. Verify clinical accuracy of calculations
3. Ensure mobile responsiveness
4. Validate safety warnings trigger appropriately

---

## 6. SPECIFIC CODE SECTIONS AFFECTED

### Primary Changes
```typescript
// 1. New calculation function needed
const calculateRequiredPIP = (targetTV, peep, patientType, weight, condition) => {
  const compliance = getCompliance(condition, patientType, weight);
  const requiredDrivingPressure = targetTV / compliance;
  const calculatedPIP = Math.round(requiredDrivingPressure + peep);
  
  // Safety limits
  const maxPIP = patientType === 'adult' ? 40 : 30;
  return Math.min(calculatedPIP, maxPIP);
};

// 2. UI Control modification (lines ~1180-1200)
{mode === 'volume' ? (
  // Tidal Volume Slider
  <Slider value={targetTV} onChange={handleTVChange} />
) : (
  // PIP Slider (existing)
  <Slider value={pip} onChange={setPip} />
)}

// 3. State synchronization
useEffect(() => {
  if (mode === 'volume') {
    const newPIP = calculateRequiredPIP(targetTV, peep, patientType, patientWeight, condition);
    setPip(newPIP);
  }
}, [targetTV, peep, mode, patientType, patientWeight, condition]);
```

### Learning Path Updates Needed
- Convert all volume mode scenarios from PIP-based to TV-based
- Recalculate initial parameters
- Update assessment logic
- Revise relevant quiz questions

---

## 7. RECOMMENDATIONS

### Should We Proceed?
**YES, but with careful planning**

### Why Proceed:
1. **Clinical Accuracy**: Matches real ventilator operation
2. **Educational Value**: Teaches proper clinical thinking
3. **Safety Focus**: Emphasizes TV limits over pressure limits
4. **Industry Standard**: Aligns with modern ventilator interfaces

### Implementation Approach:
1. **Feature Flag**: Implement behind a toggle initially
2. **Gradual Rollout**: Test with subset of scenarios first
3. **User Communication**: Clear changelog and tutorial updates
4. **Backwards Compatibility**: Maintain old calculations for verification

### Timeline Estimate:
- **Phase 1**: 2-3 hours (foundation)
- **Phase 2**: 3-4 hours (UI implementation)
- **Phase 3**: 4-6 hours (scenario migration)
- **Phase 4**: 2-3 hours (testing)
- **Total**: 11-16 hours of careful implementation

---

## 8. ALTERNATIVE APPROACH

If full implementation is too risky, consider:

### "Clinical Mode" Toggle
- Add a settings toggle: "Clinical Mode"
- When enabled: TV control for volume mode
- When disabled: Current PIP control
- Benefits: Non-breaking, educational comparison
- Allows gradual user transition

This would preserve all existing functionality while adding the clinical accuracy as an option.