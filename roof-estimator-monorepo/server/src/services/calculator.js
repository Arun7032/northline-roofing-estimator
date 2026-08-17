export function calculateEstimate(config, answers) {
  const questions = config.questions || [];
  const modifiers = config.modifiers || {};
  const roofArea = Number(answers.roof_area);
  const getSelectedOption = (key) => {
    const q = questions.find(item => item.key === key);
    if (!q) return null;
    return (q.options || []).find(opt => opt.value === answers[key]) || null;
  };
  const materialOpt = getSelectedOption('material');
  const pitchOpt = getSelectedOption('pitch');
  const layersOpt = getSelectedOption('layers');
  const storiesOpt = getSelectedOption('stories');
  if (!materialOpt || !pitchOpt || !layersOpt || !storiesOpt) throw new Error('Required estimator selections are incomplete');

  const ratePerSqft = Number(materialOpt.rate_per_sqft || 0);
  const pitchMult = Number(pitchOpt.multiplier || 1);
  const tearOffPerSqft = Number(layersOpt.tear_off_per_sqft || 0);
  const storiesMult = Number(storiesOpt.multiplier || 1);
  const wasteFactor = Number(modifiers.waste_factor ?? 0.10);
  const permitFee = Number(modifiers.permit_flat_fee ?? 350);
  const spreadPct = Number(modifiers.range_spread_pct ?? 12) / 100;

  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffPerSqft;
  const adjustedSubtotal = (baseMaterialCost + tearOffCost) * pitchMult * storiesMult;
  const midpoint = adjustedSubtotal + permitFee;
  return {
    estimate_low: Math.round(midpoint * (1 - spreadPct)),
    estimate_high: Math.round(midpoint * (1 + spreadPct)),
    estimate_mid: Math.round(midpoint)
  };
}
