import { Lead } from '../models/Lead.js';

export async function getLeads(req, res) {
  const leads = await Lead.find().sort({ submitted_at: -1 }).limit(500).lean();
  res.json(leads);
}
