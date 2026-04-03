import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer } from '@/models/Tiffin';

export async function DELETE(req: Request, context: any) {
  try {
    await connectDB();
    
    // Naye Next.js me params ko await karna zaroori hota hai
    const params = await context.params;
    const customerId = params.id;

    console.log("1. Trying to delete customer with ID:", customerId);

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID missing from URL" }, { status: 400 });
    }

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    
    if (!deletedCustomer) {
      console.log("2. Customer not found in DB!");
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    console.log("3. Customer Deleted Successfully!");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔴 DELETE ERROR DETAILS:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}