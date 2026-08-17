export default function QuestionField({ question, value, onChange }) {
  if (!question?.active) return null;
  return <div className="field-block">
    <label>{question.label}{question.unit ? ` (${question.unit})` : ''}</label>
    {question.type === 'number' && <input type="number" min={question.min} max={question.max} value={value ?? ''} onChange={e => onChange(question.key, e.target.value === '' ? '' : Number(e.target.value))} required={question.required} />}
    {question.type === 'select' && <div className="option-grid">{question.options.map(option => <button type="button" key={option.value} className={`option ${value === option.value ? 'selected' : ''}`} onClick={() => onChange(question.key, option.value)}><span>{option.label}</span><span className="radio">{value === option.value ? '●' : '○'}</span></button>)}</div>}
    {question.type === 'number' && <small>Allowed range: {question.min}–{question.max}</small>}
  </div>;
}
