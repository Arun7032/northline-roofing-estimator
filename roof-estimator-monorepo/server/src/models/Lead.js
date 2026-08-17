import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true }
  },
  answers: { type: mongoose.Schema.Types.Mixed, required: true },
  config_version: { type: Number, required: true },
  estimate_low: { type: Number, required: true },
  estimate_high: { type: Number, required: true },
  estimate_currency: { type: String, required: true },
  submitted_at: { type: Date, default: Date.now }
}, { timestamps: true });

export const Lead = mongoose.model('Lead', LeadSchema);
