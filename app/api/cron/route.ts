import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer, TiffinLog } from '@/models/Tiffin';

export async function POST(req: Request) {
  try {
    const { mealType, targetDate } = await req.json();
    // Agar date aayi hai toh wo use karo, warna aaj ki date
    const dateToUse = targetDate || new Date().toISOString().split('T')[0];

    await connectDB();
    const exists = await TiffinLog.findOne({ date: dateToUse, mealType });
    if (exists) return NextResponse.json({ error: `Already generated for ${dateToUse}` }, { status: 400 });

    const customers = await Customer.find({ isActive: true });
    const logs = customers.map(c => ({
      customerId: c._id,
      date: dateToUse,
      mealType: mealType,
      // Ab ye customer ke default settings ke hisaab se quantity uthayega
      quantity: mealType === 'lunch' ? c.defaultLunch : c.defaultDinner
    }));

    await TiffinLog.insertMany(logs);
    return NextResponse.json({ success: true, date: dateToUse });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}