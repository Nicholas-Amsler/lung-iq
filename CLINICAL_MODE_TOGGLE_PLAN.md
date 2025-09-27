# Clinical Mode Toggle Implementation Plan
## Preserving Learning Paths While Adding Clinical Accuracy

### Overview
Implement a "Clinical Mode" toggle that switches between:
- **Educational Mode** (Default/Current): User controls PIP, sees resulting TV
- **Clinical Mode** (New): User controls TV, sees resulting PIP (volume control only)

---

## 1. TOGGLE IMPLEMENTATION

### Location & Storage
```typescript
// Add to existing state (around line 85)
const [clinicalMode, setClinicalMode] = useState(false);

// Persist in localStorage
useEffect(() => {
  const saved = localStorage.getItem('clinicalMode');
  if (saved) setClinicalMode(saved === 'true');
}, []);

useEffect(() => {
  localStorage.setItem('clinicalMode', clinicalMode.toString());
}, [clinicalMode]);
```

### UI Toggle Location Options
1. **Settings Menu** (Recommended)
   - Add settings icon near dark mode toggle
   - Include explanation tooltip
   
2. **Mode Selection Area**
   - Near ventilation mode selector
   - Only visible in volume control mode

---

## 2. LEARNING PATH COMPATIBILITY

### Key Principle: Learning paths work in BOTH modes

#### Educational Mode (PIP Control)
- **No changes needed** - Current behavior preserved
- All scenarios work exactly as designed
- Assessments remain accurate

#### Clinical Mode (TV Control)
- **Automatic conversion** of scenario parameters
- When scenario loads with PIP value → Calculate equivalent TV
- Maintain same clinical outcomes

### Scenario Parameter Handling
```typescript
// When loading a scenario
const loadScenario = (scenario) => {
  if (scenario.initialParams.mode === 'volume' && clinicalMode) {
    // Convert PIP-based scenario to TV-based
    const equivalentTV = calculateTidalVolume(
      scenario.initialParams.pip,
      scenario.initialParams.peep,
      scenario.patientType || 'adult',
      scenario.patientWeight || 70,
      scenario.pathology
    );
    
    // Set TV as primary control
    setTargetTV(equivalentTV);
    // PIP will be calculated from TV
  } else {
    // Normal PIP-based loading
    setPip(scenario.initialParams.pip);
  }
};
```

---

## 3. CRITICAL SCENARIOS TO TEST

### High Priority (Volume Control Specific)
1. **"PIP Exploration"** (Beginner)
   - Challenge: Entire scenario about adjusting PIP
   - Solution: In clinical mode, becomes "TV Exploration"
   - Learning objectives remain valid

2. **"ARDS Protective Ventilation"** (Intermediate)
   - Current: PIP 28, expecting TV ~406 mL
   - Clinical Mode: Set TV 406, see PIP result
   - Maintains lung-protective education

3. **"Weaning Readiness"** (Advanced)
   - Assessments based on TV targets
   - Both modes achieve same TV goals
   - Different paths, same outcome

### Mode-Specific Behavior
```typescript
// Volume Control Mode Only
if (mode === 'volume') {
  if (clinicalMode) {
    // User controls TV, calculate PIP
    showControl = <TVSlider value={targetTV} onChange={handleTVChange} />
    displayValue = <PIPDisplay value={calculatedPIP} warnings={pressureWarnings} />
  } else {
    // Current behavior - User controls PIP
    showControl = <PIPSlider value={pip} onChange={setPip} />
    displayValue = <TVDisplay value={tidalVolume} />
  }
}
// Pressure Control - Always PIP control (no change)
```

---

## 4. ASSESSMENT COMPATIBILITY

### Key Innovation: Dynamic Assessment Targets
```typescript
const getAssessmentTarget = (scenario, clinicalMode) => {
  if (scenario.assessment?.targetTV) {
    if (clinicalMode && scenario.initialParams.mode === 'volume') {
      // In clinical mode, the target is what user should set
      return {
        type: 'tidal_volume',
        value: scenario.assessment.targetTV,
        tolerance: 10, // +/- 10 mL
        message: `Set tidal volume to approximately ${scenario.assessment.targetTV} mL`
      };
    } else {
      // Educational mode - achieve TV through PIP adjustment
      return {
        type: 'tidal_volume_result',
        value: scenario.assessment.targetTV,
        tolerance: 10,
        message: `Adjust PIP to achieve tidal volume of ${scenario.assessment.targetTV} mL`
      };
    }
  }
};
```

### Quiz Compatibility
- Questions remain valid in both modes
- Hints can be dynamic based on mode
- Example: "In clinical mode, you would set the tidal volume directly"

---

## 5. UI/UX CHANGES

### Control Panel Updates
```typescript
// Conditional rendering based on mode and clinical toggle
<div className="parameter-control">
  <label>
    {mode === 'volume' && clinicalMode 
      ? 'Tidal Volume (mL)' 
      : 'PIP (cmH₂O)'}
  </label>
  
  {mode === 'volume' && clinicalMode ? (
    <TVControl 
      value={targetTV}
      min={minSafeTV}
      max={maxSafeTV}
      onChange={handleTVChange}
    />
  ) : (
    <PIPControl 
      value={pip}
      min={parameterRanges.pipRange[0]}
      max={parameterRanges.pipRange[1]}
      onChange={setPip}
    />
  )}
</div>

// Display panel shows calculated value
<div className="calculated-display">
  {mode === 'volume' && clinicalMode && (
    <div className="pip-result">
      <span>Resulting PIP: {calculatedPIP} cmH₂O</span>
      {calculatedPIP > 35 && (
        <span className="warning">⚠️ High pressure!</span>
      )}
    </div>
  )}
</div>
```

### Visual Indicators
1. **Mode Badge**: Clear indicator when in clinical mode
2. **Educational Tooltips**: Explain the difference
3. **Transition Animations**: Smooth switch between modes

---

## 6. IMPLEMENTATION STEPS

### Phase 1: Core Toggle (2-3 hours)
- [ ] Add clinical mode state
- [ ] Create toggle UI component
- [ ] Implement localStorage persistence
- [ ] Add to settings menu

### Phase 2: Calculation Logic (3-4 hours)
- [ ] Create `calculateRequiredPIP()` function
- [ ] Add TV control state management
- [ ] Implement bidirectional calculations
- [ ] Add safety validations

### Phase 3: UI Integration (2-3 hours)
- [ ] Conditional control rendering
- [ ] Update display panels
- [ ] Add warnings and indicators
- [ ] Mobile responsive design

### Phase 4: Scenario Compatibility (4-5 hours)
- [ ] Implement scenario parameter conversion
- [ ] Update assessment logic
- [ ] Test all volume control scenarios
- [ ] Verify quiz compatibility

### Phase 5: Testing & Polish (2-3 hours)
- [ ] Test all learning paths in both modes
- [ ] Verify assessments work correctly
- [ ] Add help documentation
- [ ] User testing

**Total: 13-18 hours**

---

## 7. TESTING CHECKLIST

### For Each Volume Control Scenario:
- [ ] Loads correctly in both modes
- [ ] Achieves intended TV in both modes
- [ ] Assessments pass in both modes
- [ ] Quiz questions make sense
- [ ] No broken functionality

### Edge Cases:
- [ ] Mode switching mid-scenario
- [ ] Extreme values (very low/high TV)
- [ ] Different patient types
- [ ] Various pathologies

---

## 8. BENEFITS OF THIS APPROACH

1. **Zero Breaking Changes**: All existing functionality preserved
2. **Educational Flexibility**: Users can learn both approaches
3. **Clinical Accuracy**: Provides real-world interface option
4. **Progressive Enhancement**: Can be refined based on feedback
5. **A/B Testing**: Can compare user success in both modes

---

## 9. FUTURE ENHANCEMENTS

Once stable, consider:
1. **Mode Preference by User Type**: Students vs practitioners
2. **Scenario-Specific Modes**: Some scenarios better in clinical mode
3. **Advanced Clinical Features**: Plateau pressure targeting, etc.
4. **Analytics**: Track which mode helps learning outcomes

---

## 10. SUCCESS CRITERIA

The implementation is successful when:
1. ✓ All scenarios work in both modes
2. ✓ No assessments are broken
3. ✓ Users can switch modes without confusion
4. ✓ Learning objectives are met regardless of mode
5. ✓ Clinical mode provides more realistic experience
6. ✓ Educational mode remains beginner-friendly

---

This approach ensures that your learning paths remain intact while adding valuable clinical accuracy for users who want a more realistic ventilator experience.