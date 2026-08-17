import { Config } from '../models/Config.js';
import { Lead } from '../models/Lead.js';
import { calculateEstimate } from '../services/calculator.js';
import { validateSubmission } from '../utils/validation.js';

export async function createEstimate(req, res) {
  const { name, phone, email, answers } = req.body || {};
  if (!name || !phone || !email || !answers || typeof answers !== 'object') return res.status(400).json({ error: 'Name, phone, email and answers are required.' });
  const config = await Config.findOne({ active: true }).sort({ config_version: -1 });
  if (!config) return res.status(503).json({ error: 'Estimator configuration is unavailable' });
  const errors = validateSubmission(config, answers);
  if (errors.length) return res.status(422).json({ error: 'Please correct the form.', details: errors });
  let result;
  try { result = calculateEstimate(config, answers); } catch (error) { return res.status(422).json({ error: error.message }); }
  const lead = await Lead.create({
    customer: { name, phone, email },
    answers,
    config_version: config.config_version,
    estimate_low: result.estimate_low,
    estimate_high: result.estimate_high,
    estimate_currency: config.business.currency
  });
  res.status(201).json({ lead_id: lead._id, config_version: config.config_version, ...result, currency: config.business.currency });
}
