import { Config } from '../models/Config.js';

export async function getPublicConfig(req, res) {
  const config = await Config.findOne({ active: true }).sort({ config_version: -1 }).lean();
  if (!config) return res.status(503).json({ error: 'Estimator configuration is unavailable' });
  const questions = config.questions.filter(q => q.active).sort((a, b) => a.order - b.order);
  res.json({ config_version: config.config_version, business: config.business, contact_fields: config.contact_fields, questions });
}

export async function getAdminConfig(req, res) {
  const config = await Config.findOne({ active: true }).sort({ config_version: -1 }).lean();
  if (!config) return res.status(503).json({ error: 'Configuration unavailable' });
  res.json(config);
}

export async function updateConfig(req, res) {
  const current = await Config.findOne({ active: true }).sort({ config_version: -1 });
  if (!current) return res.status(503).json({ error: 'Configuration unavailable' });
  const nextVersion = current.config_version + 1;
  const payload = req.body;
  if (!payload.business || !Array.isArray(payload.questions) || !Array.isArray(payload.contact_fields)) {
    return res.status(400).json({ error: 'Invalid configuration payload' });
  }
  const next = new Config({
    config_version: nextVersion,
    active: true,
    business: payload.business,
    contact_fields: payload.contact_fields,
    questions: payload.questions,
    modifiers: payload.modifiers
  });
  await next.validate();
  current.active = false;
  await current.save();
  await next.save();
  res.json({ message: 'Configuration saved', config_version: nextVersion });
}
