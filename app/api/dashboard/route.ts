import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer, TiffinLog } from '@/models/Tiffin';

export async function GET() {
  try {
    await connectDB();
    
    // Aaj ki date aur Is mahine ka format (e.g., "2026-04")
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonthPrefix = todayStr.substring(0, 7); 

    // 1. Total Active Customers
    const activeCustomers = await Customer.countDocuments({ isActive: true });

    // 2. Aaj ke Lunch aur Dinner calculate karna
    const todaysLogs = await TiffinLog.find({ date: todayStr });
    let todayLunch = 0;
    let todayDinner = 0;
    
    todaysLogs.forEach(log => {
      if (log.mealType === 'lunch') todayLunch += log.quantity;
      if (log.mealType === 'dinner') todayDinner += log.quantity;
    });

    // 3. Is Mahine ki Expected Kamai Calculate karna
    const monthLogs = await TiffinLog.find({ date: { $regex: `^${currentMonthPrefix}` } }).populate('customerId');
    let monthlyRevenue = 0;
    
    monthLogs.forEach(log => {
      if (log.customerId && log.customerId.price) {
        // Tiffin Quantity * Customer ki specific price
        monthlyRevenue += (log.quantity * log.customerId.price);
      }
    });

    return NextResponse.json({
      activeCustomers,
      todayTotal: todayLunch + todayDinner,
      todayLunch,
      todayDinner,
      monthlyRevenue
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}