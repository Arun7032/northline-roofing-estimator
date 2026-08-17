import mongoose from 'mongoose';

const ApiLogSchema = new mongoose.Schema({
  method: String,
  path: String,
  status: Number,
  duration_ms: Number,
  ip: String,
  user_agent: String,
  actor: String,
  created_at: { type: Date, default: Date.now }
});

export const ApiLog = mongoose.model('ApiLog', ApiLogSchema);
