import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer, TiffinLog } from '@/models/Tiffin';

export async function GET() {
  try {
    await connectDB();
    // Aaj ka mahina nikalo (e.g., "2026-04")
    const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);

    const customers = await Customer.find({ isActive: true });
    // Is mahine ke saare logs le aao
    const logs = await TiffinLog.find({ date: { $regex: `^${currentMonth}` } });

    const bills = customers.map(c => {
      // Is customer ke logs filter karo
      const cLogs = logs.filter(l => l.customerId?.toString() === c._id.toString());
      // Total tiffins count karo
      const totalTiffins = cLogs.reduce((sum, log) => sum + log.quantity, 0);
      const totalAmount = totalTiffins * c.price;
      // Check karo kya isne is mahine ka paisa de diya
      const isPaid = c.paidMonths?.includes(currentMonth) || false;

      return {
        id: c._id,
        name: c.name,
        phone: c.phone,
        price: c.price,
        totalTiffins,
        totalAmount,
        isPaid
      };
    });

    return NextResponse.json({ currentMonth, bills });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}