import mongoose, { Schema, model, models } from 'mongoose';

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  defaultLunch: { type: Number, default: 1 },
  defaultDinner: { type: Number, default: 1 },
  price: { type: Number, default: 70 },
  isActive: { type: Boolean, default: true },
  paidMonths: { type: [String], default: [] } // <-- YE NAYI LINE ADD KARNI HAI
});

const LogSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  date: String, // YYYY-MM-DD
  mealType: { type: String, enum: ['lunch', 'dinner'] },
  quantity: Number,
  status: { type: String, default: 'confirmed' } // confirmed, cancelled, extra
});

export const Customer = models.Customer || model('Customer', CustomerSchema);
export const TiffinLog = models.TiffinLog || model('TiffinLog', LogSchema);