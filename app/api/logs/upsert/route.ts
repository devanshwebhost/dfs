import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { TiffinLog } from '@/models/Tiffin';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { customerId, date, mealType, quantity } = await req.json();

    // findOneAndUpdate ke saath 'upsert: true' lagane se:
    // Agar entry nahi hai, toh nayi ban jayegi. Agar hai, toh update ho jayegi.
    const updatedLog = await TiffinLog.findOneAndUpdate(
      { customerId, date, mealType },
      { quantity, status: quantity > 0 ? 'confirmed' : 'cancelled' },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedLog);
  } catch (error: any) {
    console.error("Upsert Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}