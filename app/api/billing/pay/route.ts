import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer } from '@/models/Tiffin';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { customerId, month } = await req.json();

    // Customer ke paidMonths list me ye mahina daal do
    await Customer.findByIdAndUpdate(customerId, {
      $addToSet: { paidMonths: month } 
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}