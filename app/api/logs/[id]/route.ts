import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { TiffinLog } from '@/models/Tiffin';

export async function PATCH(req: Request, context: any) {
  try {
    await connectDB();
    
    // Next.js 15 Fix: params ko pehle await karna padta hai
    const params = await context.params;
    const logId = params.id;

    const { quantity } = await req.json();
    
    // Database me quantity update kar rahe hain
    const updated = await TiffinLog.findByIdAndUpdate(
      logId, 
      { quantity }, 
      { new: true }
    );
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update Error:", error.message);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}