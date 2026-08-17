import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from './db.js';
import { Config } from '../models/Config.js';

// The supplied assignment references Version 3 seed data but does not include its full table.
// These baseline values keep the application executable and are intentionally editable in the Owner Panel.
const seed = {
  config_version: 3,
  active: true,
  business: { name: 'Northline Roofing & Exteriors', region: 'United States', currency: 'USD' },
  contact_fields: [
    { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Jane Smith' },
    { key: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '(555) 123-4567' },
    { key: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'jane@example.com' }
  ],
  questions: [
    { key: 'roof_area', label: 'What is the approximate roof area?', type: 'number', unit: 'sq ft', required: true, min: 500, max: 10000, active: true, order: 1, options: [] },
    { key: 'material', label: 'Which roofing material are you considering?', type: 'select', required: true, active: true, order: 2, options: [
      { value: 'asphalt_3tab', label: '3-Tab Asphalt Shingle', rate_per_sqft: 4.25 },
      { value: 'architectural', label: 'Architectural Shingle', rate_per_sqft: 5.75 },
      { value: 'metal', label: 'Metal Roofing', rate_per_sqft: 8.50 }
    ] },
    { key: 'pitch', label: 'What is the roof pitch?', type: 'select', required: true, active: true, order: 3, options: [
      { value: 'low', label: 'Low / Walkable', multiplier: 1.00 },
      { value: 'standard', label: 'Standard', multiplier: 1.12 },
      { value: 'steep', label: 'Steep', multiplier: 1.28 }
    ] },
    { key: 'layers', label: 'How many existing roof layers need removal?', type: 'select', required: true, active: true, order: 4, options: [
      { value: 'none', label: 'No tear-off', tear_off_per_sqft: 0 },
      { value: 'one', label: '1 existing layer', tear_off_per_sqft: 1.10 },
      { value: 'two', label: '2 existing layers', tear_off_per_sqft: 1.75 }
    ] },
    { key: 'stories', label: 'How many stories is the home?', type: 'select', required: true, active: true, order: 5, options: [
      { value: 'one', label: '1 story', multiplier: 1.00 },
      { value: 'two', label: '2 stories', multiplier: 1.08 },
      { value: 'three', label: '3+ stories', multiplier: 1.18 }
    ] }
  ],
  modifiers: { waste_factor: 0.10, permit_flat_fee: 350, range_spread_pct: 12 }
};

await connectDatabase();
await Config.updateMany({}, { $set: { active: false } });
await Config.findOneAndReplace({ config_version: 3 }, seed, { upsert: true, returnDocument: 'after' });
await Config.updateMany({ config_version: { $ne: 3 } }, { $set: { active: false } });
console.log('Seeded active configuration Version 3');
await mongoose.disconnect();
