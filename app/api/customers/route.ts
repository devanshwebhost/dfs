import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer } from '@/models/Tiffin';

export async function GET() {
  try {
    await connectDB();
    const customers = await Customer.find({}).sort({ name: 1 });
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error("🔴 GET ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("1. Connecting to Database...");
    await connectDB();
    
    console.log("2. Database Connected! Reading Body...");
    const body = await req.json();
    
    console.log("3. Creating Customer in DB...", body);
    const newCustomer = await Customer.create(body);
    
    console.log("4. Customer Created Successfully!");
    return NextResponse.json(newCustomer);
  } catch (error: any) {
    console.error("🔴 POST ERROR DETAILS:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}