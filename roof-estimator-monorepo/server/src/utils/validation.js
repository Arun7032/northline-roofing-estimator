export function validateSubmission(config, answers) {
  const errors = [];
  for (const q of config.questions.filter(item => item.active)) {
    const value = answers[q.key];
    if (q.required && (value === undefined || value === null || value === '')) {
      errors.push(`${q.label} is required.`);
      continue;
    }
    if (q.type === 'number') {
      const n = Number(value);
      if (!Number.isFinite(n)) errors.push(`${q.label} must be a valid number.`);
      if (q.min !== undefined && n < q.min) errors.push(`${q.label} must be at least ${q.min}.`);
      if (q.max !== undefined && n > q.max) errors.push(`${q.label} must be at most ${q.max}.`);
    }
    if (q.type === 'select' && !(q.options || []).some(o => o.value === value)) {
      errors.push(`Invalid selection for ${q.label}.`);
    }
  }
  return errors;
}
