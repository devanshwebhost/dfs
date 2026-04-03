import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer, TiffinLog } from '@/models/Tiffin';

// NEXT.JS FIX: Ye line Next.js ko order deti hai ki data kabhi cache (save) mat karna, hamesha fresh lana.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // TIMEZONE FIX: India (IST) ka exact time aur date nikalna (+5:30 hours)
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const today = new Date(new Date().getTime() + istOffset);
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    const currentMonthPrefix = todayStr.substring(0, 7); // "YYYY-MM"

    // 1. Total Active Customers
    const activeCustomers = await Customer.countDocuments({ isActive: true });

    // 2. Aaj ke Lunch aur Dinner calculate karna
    // const todaysLogs = await TiffinLog.find({ date: todayStr });
    // let todayLunch = 0;
    // let todayDinner = 0;
    
    // todaysLogs.forEach(log => {
    //   // String/Number mismatch se bachne ke liye Number() me convert kiya hai
    //   if (log.mealType === 'lunch') todayLunch += Number(log.quantity) || 0;
    //   if (log.mealType === 'dinner') todayDinner += Number(log.quantity) || 0;
    // });
    // Is mahine aur aaj ke Active data ka total count
const todaysLogs = await TiffinLog.find({ date: todayStr }).populate('customerId');

let todayLunch = 0;
let todayDinner = 0;

todaysLogs.forEach(log => {
  // Check: Sirf tab count karo agar Customer abhi bhi database mein exist karta hai aur Active hai
  if (log.customerId && log.customerId.isActive) {
    if (log.mealType === 'lunch') todayLunch += Number(log.quantity) || 0;
    if (log.mealType === 'dinner') todayDinner += Number(log.quantity) || 0;
  }
});

    // 3. Is Mahine ki Expected Kamai Calculate karna
    const monthLogs = await TiffinLog.find({ date: { $regex: `^${currentMonthPrefix}` } }).populate('customerId');
    let monthlyRevenue = 0;
    
    monthLogs.forEach(log => {
      if (log.customerId && log.customerId.price) {
        monthlyRevenue += (Number(log.quantity) || 0) * Number(log.customerId.price);
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