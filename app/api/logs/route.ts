import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { TiffinLog } from '@/models/Tiffin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const queryDate = dateParam || new Date().toISOString().split('T')[0];

    await connectDB();
    const logs = await TiffinLog.find({ date: queryDate }).populate('customerId');
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}