import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { TiffinLog } from '@/models/Tiffin';

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    
    // Next.js 15 Fix
    const params = await context.params;
    const customerId = params.id;
    
    const logs = await TiffinLog.find({ customerId }).sort({ date: -1 });
    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("History Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}