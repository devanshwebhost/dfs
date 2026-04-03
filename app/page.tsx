"use client";
import React, { useState, useEffect } from 'react';
import { Users, UtensilsCrossed, LayoutDashboard, UserSquare2, ClipboardCheck, ReceiptIndianRupee, Lock, Play, TrendingUp, CheckCircle, Trash2, History, X, Calendar as CalendarIcon, Download, Menu } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// HELPER: PROFESSIONAL PDF GENERATOR 
// ==========================================
const generateProfessionalPDF = (selectedCustomer: any, historyRaw: any[], pdfStart: string, pdfEnd: string) => {
  if (!pdfStart || !pdfEnd) return alert("Kripya Start aur End Date select karein!");
  
  const filteredLogs = historyRaw.filter((l: any) => l.date >= pdfStart && l.date <= pdfEnd);
  if (filteredLogs.length === 0) return alert("Is date range me koi tiffin data nahi hai!");

  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(34, 197, 94); 
  doc.setFont("helvetica", "bold");
  doc.text("DFS Billing PDF", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Durga Food Service 2021 - 2026", 14, 26);
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text(`Customer Name: ${selectedCustomer.name}`, 14, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`Phone No: ${selectedCustomer.phone}`, 14, 46);
  doc.text(`Billing Period: ${pdfStart} to ${pdfEnd}`, 14, 52);

  const groupedByDate: any = {};
  let grandTotalTiffins = 0;

  filteredLogs.forEach((log: any) => {
    if (!groupedByDate[log.date]) groupedByDate[log.date] = { lunch: 0, dinner: 0 };
    if (log.mealType === 'lunch') groupedByDate[log.date].lunch += log.quantity;
    if (log.mealType === 'dinner') groupedByDate[log.date].dinner += log.quantity;
    grandTotalTiffins += log.quantity;
  });

  const tableData = Object.keys(groupedByDate).sort().map(date => {
    const l = groupedByDate[date].lunch;
    const d = groupedByDate[date].dinner;
    return [date, l > 0 ? l : '-', d > 0 ? d : '-', l + d]; 
  });

  autoTable(doc, {
    startY: 60,
    head: [['Date', 'Lunch Qty', 'Dinner Qty', 'Daily Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], halign: 'center' },
    columnStyles: { 
      0: { halign: 'center', fontStyle: 'bold' },
      1: { halign: 'center' }, 
      2: { halign: 'center' }, 
      3: { halign: 'center', fontStyle: 'bold', textColor: [34, 197, 94] } 
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  const pricePerTiffin = selectedCustomer.price || 70;
  const totalAmount = grandTotalTiffins * pricePerTiffin;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text(`Total Tiffins Delivered: ${grandTotalTiffins}`, 14, finalY);
  doc.text(`Rate per Tiffin: Rs. ${pricePerTiffin}/-`, 14, finalY + 7);
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`GRAND TOTAL: Rs. ${totalAmount}/-`, 14, finalY + 17);

  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94);
  doc.text("DFS VERIFIED", 143, finalY + 5);
  
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing us! Have a good meal", 125, finalY + 15);

  doc.save(`DFS_Bill_${selectedCustomer.name}_${pdfStart}.pdf`);
};

export default function TiffinManager() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUnlock = () => {
    if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) setIsUnlocked(true);
    else alert("Wrong Password! Check .env.local");
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 sm:p-6 text-black">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-gray-300 w-full max-w-sm text-center">
          <Lock className="mx-auto mb-4 text-green-700" size={32} />
          <h1 className="text-2xl sm:text-3xl font-black mb-6 text-black">DFS Login</h1>
          <input 
            type="password" placeholder="Enter Password" 
            className="w-full border-2 border-gray-400 bg-gray-50 text-black p-3 sm:p-4 rounded-xl mb-4 text-center outline-none focus:border-green-600 font-bold placeholder-gray-600"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          />
          <button onClick={handleUnlock} className="w-full bg-green-600 hover:bg-green-700 text-white p-3 sm:p-4 rounded-xl font-bold text-lg">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden text-black">
      
      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* RESPONSIVE SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r-2 border-gray-300 p-4 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-10 mt-4 px-2">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="text-green-700" size={28} />
            <h1 className="text-2xl font-black text-black">DFS Tiffins</h1>
          </div>
          <button className="lg:hidden p-1 rounded-md hover:bg-gray-200" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <SidebarItem icon={<LayoutDashboard/>} label="Dashboard" tabName="dashboard" activeTab={activeTab} setActiveTab={(t:any) => {setActiveTab(t); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<UserSquare2/>} label="Customers" tabName="customers" activeTab={activeTab} setActiveTab={(t:any) => {setActiveTab(t); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<ClipboardCheck/>} label="Review" tabName="review" activeTab={activeTab} setActiveTab={(t:any) => {setActiveTab(t); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<ReceiptIndianRupee/>} label="Billing" tabName="billing" activeTab={activeTab} setActiveTab={(t:any) => {setActiveTab(t); setIsSidebarOpen(false);}} />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto pb-20 lg:pb-6 flex flex-col">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b-2 border-gray-200 sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <Menu size={24} />
          </button>
          <h1 className="text-lg sm:text-xl font-black text-black tracking-tight">DFS Manager</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex-1">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'review' && <ReviewTab />}
          {activeTab === 'billing' && <BillingTab />}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV (Hidden on large screens) */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white border-t-2 border-gray-300 flex justify-around p-2 sm:p-3 z-20 shadow-[0_-10px_15px_rgba(0,0,0,0.1)] pb-safe">
        <BottomNavItem icon={<LayoutDashboard/>} label="Home" tabName="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem icon={<UserSquare2/>} label="Clients" tabName="customers" activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem icon={<ClipboardCheck/>} label="Review" tabName="review" activeTab={activeTab} setActiveTab={setActiveTab} />
        <BottomNavItem icon={<ReceiptIndianRupee/>} label="Bills" tabName="billing" activeTab={activeTab} setActiveTab={setActiveTab} />
      </nav>
    </div>
  );
}

// ==========================================
// 1. DASHBOARD TAB
// ==========================================
function DashboardTab() {
  const [stats, setStats] = useState({ activeCustomers: 0, todayTotal: 0, todayLunch: 0, todayDinner: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (!data.error) setStats(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchStats(); }, []);

  const generate = async (type: 'lunch' | 'dinner') => {
    setGenerating(true);
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch('/api/cron', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ mealType: type, targetDate: todayStr }),
      });
      if (res.ok) { alert(`${type.toUpperCase()} Generated for Today!`); fetchStats(); } 
      else alert(`Error: Shayad aaj ka ${type} pehle hi generate ho chuka hai!`);
    } catch (e) { alert("Network Error"); }
    setGenerating(false);
  };

  if (loading) return <div className="text-center font-black text-xl text-gray-500 mt-20 flex items-center justify-center h-40">Loading Stats...</div>;

  return (
    <div className="animate-in fade-in duration-200">
      <h2 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 hidden lg:block text-black">Dashboard Overview</h2>
      
      <div className="bg-green-700 p-5 sm:p-8 rounded-2xl sm:rounded-3xl text-white mb-6 shadow-lg border-2 border-green-800 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-green-100 font-bold mb-1 sm:mb-2 text-sm sm:text-base">Expected Kamai (This Month)</p>
          <div className="flex justify-between items-end">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none">
              ₹{stats.monthlyRevenue.toLocaleString('en-IN')}
            </h2>
            <TrendingUp size={48} className="text-white opacity-90 hidden sm:block" />
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
        <StatBox icon={<Users className="text-green-700"/>} value={stats.activeCustomers} label="Active Clients" />
        <StatBox icon={<UtensilsCrossed className="text-green-700"/>} value={stats.todayTotal} label="Today's Tiffins" />
        <StatBox value={stats.todayLunch} label="Lunch Gen." isSmall />
        <StatBox value={stats.todayDinner} label="Dinner Pend." isSmall />
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-gray-200 shadow-sm">
        <p className="text-gray-500 font-black text-xs sm:text-sm uppercase mb-4 tracking-wider">Quick Actions</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button onClick={() => generate('lunch')} disabled={generating} className="flex-1 bg-gray-100 hover:bg-green-600 hover:text-white border-2 border-gray-200 flex items-center justify-center gap-2 py-4 rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base disabled:opacity-50">
            <Play size={18}/> {generating ? "Wait..." : "Gen. Lunch"}
          </button>
          <button onClick={() => generate('dinner')} disabled={generating} className="flex-1 bg-gray-100 hover:bg-green-600 hover:text-white border-2 border-gray-200 flex items-center justify-center gap-2 py-4 rounded-xl sm:rounded-2xl font-bold transition-all text-sm sm:text-base disabled:opacity-50">
            <Play size={18}/> {generating ? "Wait..." : "Gen. Dinner"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CUSTOMERS TAB
// ==========================================
function CustomersTab() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultLunch, setDefaultLunch] = useState(1);
  const [defaultDinner, setDefaultDinner] = useState(1);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [historyRaw, setHistoryRaw] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any>({});
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pdfStart, setPdfStart] = useState('');
  const [pdfEnd, setPdfEnd] = useState('');

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { fetchCustomers(); }, []);

  const addCustomer = async (e: any) => {
    e.preventDefault();
    if(!name || !phone) return alert("Name aur Phone number zaroori hai!");
    const res = await fetch('/api/customers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, defaultLunch, defaultDinner, price: 70 })
    });
    if (res.ok) { setName(''); setPhone(''); fetchCustomers(); alert("Customer Added!"); }
  };

  const deleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure? Ye hamesha ke liye delete ho jayega!")) return;
    await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    fetchCustomers();
  };

  const openHistory = async (customer: any) => {
    setSelectedCustomer(customer);
    setHistoryLoading(true);
    const res = await fetch(`/api/logs/customer/${customer._id}`);
    const data = await res.json();
    
    const logsArray = Array.isArray(data) ? data : [];
    setHistoryRaw(logsArray); 

    const grouped = logsArray.reduce((acc: any, log: any) => {
      const dateObj = new Date(log.date);
      const monthYear = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(log);
      return acc;
    }, {});
    
    setHistoryData(grouped);
    setHistoryLoading(false);
  };

  return (
    <div className="animate-in fade-in duration-200">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 text-black">Manage Customers</h2>
      
      <form onSubmit={addCustomer} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border-2 border-gray-200 mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Full Name" className="border-2 border-gray-300 bg-gray-50 text-black p-3 rounded-xl flex-1 font-bold outline-none focus:border-green-500 transition-colors" />
          <input value={phone} onChange={e=>setPhone(e.target.value)} type="number" placeholder="Phone Number" className="border-2 border-gray-300 bg-gray-50 text-black p-3 rounded-xl flex-1 font-bold outline-none focus:border-green-500 transition-colors" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center bg-gray-50 p-3 sm:p-4 rounded-xl border-2 border-gray-200">
          <span className="font-bold text-sm text-gray-600 uppercase tracking-wide">Daily Plan:</span>
          <div className="flex flex-1 gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm pointer-events-none">L:</span>
              <input type="number" value={defaultLunch} onChange={e=>setDefaultLunch(Number(e.target.value))} min="0" className="border-2 border-gray-300 w-full p-2 pl-8 rounded-lg font-black text-left outline-none focus:border-green-500" />
            </div>
            <div className="flex-1 relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm pointer-events-none">D:</span>
              <input type="number" value={defaultDinner} onChange={e=>setDefaultDinner(Number(e.target.value))} min="0" className="border-2 border-gray-300 w-full p-2 pl-8 rounded-lg font-black text-left outline-none focus:border-green-500" />
            </div>
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-black py-3 sm:py-2 px-6 rounded-xl shadow-sm w-full sm:w-auto transition-colors mt-2 sm:mt-0">Add Client</button>
        </div>
      </form>

      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden mb-8">
        {loading ? <p className="p-8 text-center font-bold text-gray-500">Loading clients...</p> : 
          customers.length === 0 ? <p className="p-8 text-center font-bold text-gray-500">No customers yet. Add one above.</p> :
          <div className="divide-y-2 divide-gray-100">
            {customers.map((c: any) => (
              <div key={c._id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 hover:bg-gray-50 transition-colors">
                <div className="w-full sm:w-auto">
                  <p className="font-black text-black text-lg sm:text-xl leading-tight">{c.name}</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1">📞 {c.phone} <span className="mx-1 text-gray-300">|</span> L: {c.defaultLunch} <span className="text-gray-300 mx-1">•</span> D: {c.defaultDinner}</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button onClick={() => openHistory(c)} className="flex-1 sm:flex-none p-2 sm:p-3 bg-blue-50 text-blue-700 rounded-xl border-2 border-blue-200 hover:bg-blue-100 transition-colors flex justify-center items-center gap-2">
                    <History size={18} strokeWidth={2.5} /> <span className="sm:hidden font-bold text-sm">History</span>
                  </button>
                  <button onClick={() => deleteCustomer(c._id)} className="p-2 sm:p-3 bg-red-50 text-red-600 rounded-xl border-2 border-red-200 hover:bg-red-100 transition-colors">
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* MODAL POPUP */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-lg border-t-4 sm:border-4 border-gray-300 h-[85vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden"></div>

            <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-4">
              <div>
                <h3 className="font-black text-xl sm:text-2xl line-clamp-1">{selectedCustomer.name}'s History</h3>
                <p className="text-xs font-bold text-gray-500 mt-1">Tiffin Logs & Reports</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"><X size={20} strokeWidth={3} /></button>
            </div>

            <div className="bg-green-50 p-3 sm:p-4 rounded-xl border-2 border-green-200 mb-5 flex-shrink-0">
              <p className="text-xs font-black text-green-800 uppercase mb-2 tracking-wide">Download Official PDF Bill</p>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <div className="flex-1 relative">
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 uppercase pointer-events-none">From</span>
                  <input type="date" value={pdfStart} onChange={e=>setPdfStart(e.target.value)} className="w-full p-2 pl-12 rounded-lg border-2 border-green-300 font-bold text-sm outline-none bg-white focus:border-green-500" />
                </div>
                <div className="flex-1 relative">
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 uppercase pointer-events-none">To</span>
                  <input type="date" value={pdfEnd} onChange={e=>setPdfEnd(e.target.value)} className="w-full p-2 pl-8 rounded-lg border-2 border-green-300 font-bold text-sm outline-none bg-white focus:border-green-500" />
                </div>
              </div>
              <button 
                onClick={() => generateProfessionalPDF(selectedCustomer, historyRaw, pdfStart, pdfEnd)} 
                className="w-full bg-green-600 text-white font-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 shadow-sm border-2 border-green-700 transition-colors"
              >
                <Download size={18} strokeWidth={2.5}/> Export Bill
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 pb-4">
              {historyLoading ? <p className="text-center font-bold text-gray-400 my-10">Loading records...</p> :
                Object.keys(historyData).length === 0 ? <p className="text-center font-bold text-gray-400 my-10">No entries found for this customer.</p> :
                Object.keys(historyData).map((month) => (
                  <div key={month} className="mb-6">
                    <h4 className="font-black text-sm text-gray-600 uppercase tracking-widest bg-gray-100 py-1.5 px-3 rounded-lg inline-block mb-3 border-2 border-gray-200">{month}</h4>
                    <div className="space-y-2">
                      {historyData[month].map((log: any) => (
                        <div key={log._id} className="bg-white p-3 rounded-xl border-2 border-gray-100 flex justify-between items-center shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-10 rounded-full ${log.mealType === 'lunch' ? 'bg-orange-400' : 'bg-indigo-500'}`}></div>
                            <div>
                              <p className="font-black text-sm sm:text-base">{log.date}</p>
                              <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{log.mealType}</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-1.5 rounded-lg border-2 border-gray-200 font-black text-lg sm:text-xl text-black min-w-[3rem] text-center">
                            {log.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. REVIEW TAB 
// ==========================================
function ReviewTab() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [historyRaw, setHistoryRaw] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any>({});
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pdfStart, setPdfStart] = useState('');
  const [pdfEnd, setPdfEnd] = useState('');

  const fetchData = async (targetDate: string) => {
    setLoading(true);
    try {
      const [custRes, logsRes] = await Promise.all([ fetch('/api/customers'), fetch(`/api/logs?date=${targetDate}`) ]);
      const customersData = await custRes.json();
      const logsData = await logsRes.json();
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (e) { console.error("Error fetching data"); }
    setLoading(false);
  };
  useEffect(() => { fetchData(date); }, [date]);

  const handleUpdate = async (customerId: string, mealType: 'lunch'|'dinner', currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 0) return;
    setLogs((prev: any) => {
      const existingIndex = prev.findIndex((l: any) => l.customerId?._id === customerId && l.mealType === mealType);
      if (existingIndex >= 0) {
        const newLogs = [...prev];
        newLogs[existingIndex].quantity = newQty;
        return newLogs;
      } else {
        return [...prev, { customerId: { _id: customerId }, date, mealType, quantity: newQty }];
      }
    });
    await fetch('/api/logs/upsert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId, date, mealType, quantity: newQty }) });
  };

  const openHistory = async (customer: any) => {
    setSelectedCustomer(customer);
    setHistoryLoading(true);
    const res = await fetch(`/api/logs/customer/${customer._id}`);
    const data = await res.json();
    
    const logsArray = Array.isArray(data) ? data : [];
    setHistoryRaw(logsArray); 

    const grouped = logsArray.reduce((acc: any, log: any) => {
      const dateObj = new Date(log.date);
      const monthYear = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(log);
      return acc;
    }, {});
    
    setHistoryData(grouped);
    setHistoryLoading(false);
  };

  return (
    <div className="animate-in fade-in duration-200">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 text-black">Daily Tiffin Review</h2>
      
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border-2 border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between sticky top-0 z-10 gap-3 sm:gap-0">
        <label className="font-black text-sm sm:text-base lg:text-lg flex items-center gap-2 text-gray-600 uppercase tracking-wider">
          <CalendarIcon size={20} className="text-green-600"/> Review Date
        </label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="font-black bg-gray-50 p-2.5 sm:p-3 rounded-xl border-2 border-gray-300 outline-none focus:border-green-500 text-black w-full sm:w-auto cursor-pointer" 
        />
      </div>
      
      {loading ? <p className="font-bold text-center mt-10 text-gray-500">Loading records...</p> : 
        customers.length === 0 ? <p className="text-center font-bold mt-10 text-gray-500">No active clients found.</p> :
        <div className="space-y-4">
          {customers.map((customer: any) => {
            const lunchLog = logs.find((l: any) => l.customerId?._id === customer._id && l.mealType === 'lunch');
            const dinnerLog = logs.find((l: any) => l.customerId?._id === customer._id && l.mealType === 'dinner');
            const lunchQty = lunchLog ? lunchLog.quantity : 0;
            const dinnerQty = dinnerLog ? dinnerLog.quantity : 0;

            return (
              <div key={customer._id} className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-4 hover:border-gray-300 transition-colors">
                
                <div className="flex justify-between items-start lg:items-center w-full lg:w-1/3">
                  <div>
                    <p className="font-black text-black text-lg sm:text-xl line-clamp-1">{customer.name}</p>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">Plan: L:{customer.defaultLunch} • D:{customer.defaultDinner}</p>
                  </div>
                  <button onClick={() => openHistory(customer)} className="p-2 bg-gray-50 text-gray-600 rounded-lg border-2 border-gray-200 lg:hidden hover:bg-gray-100 transition-colors">
                    <History size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  {/* Lunch Control */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 bg-orange-50/50 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border-2 border-orange-100/50 sm:border-none">
                    <span className="font-black text-[11px] sm:text-xs text-orange-600 uppercase tracking-widest w-14 sm:w-auto">Lunch</span>
                    <div className="flex items-center gap-1 sm:gap-2 bg-white p-1 rounded-full border-2 border-gray-200 shadow-sm">
                      <button onClick={() => handleUpdate(customer._id, 'lunch', lunchQty, -1)} className="bg-gray-50 w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-lg sm:text-xl text-gray-600 hover:bg-gray-200 hover:text-black transition-colors flex items-center justify-center">-</button>
                      <span className={`font-black text-lg sm:text-2xl w-6 sm:w-8 text-center ${lunchQty > 0 ? 'text-orange-600' : 'text-gray-300'}`}>{lunchQty}</span>
                      <button onClick={() => handleUpdate(customer._id, 'lunch', lunchQty, 1)} className="bg-orange-500 w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-lg sm:text-xl text-white border border-orange-600 hover:bg-orange-600 transition-colors flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div className="hidden sm:block w-0.5 h-10 bg-gray-200 mx-2"></div>

                  {/* Dinner Control */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 bg-indigo-50/50 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border-2 border-indigo-100/50 sm:border-none">
                    <span className="font-black text-[11px] sm:text-xs text-indigo-600 uppercase tracking-widest w-14 sm:w-auto">Dinner</span>
                    <div className="flex items-center gap-1 sm:gap-2 bg-white p-1 rounded-full border-2 border-gray-200 shadow-sm">
                      <button onClick={() => handleUpdate(customer._id, 'dinner', dinnerQty, -1)} className="bg-gray-50 w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-lg sm:text-xl text-gray-600 hover:bg-gray-200 hover:text-black transition-colors flex items-center justify-center">-</button>
                      <span className={`font-black text-lg sm:text-2xl w-6 sm:w-8 text-center ${dinnerQty > 0 ? 'text-indigo-600' : 'text-gray-300'}`}>{dinnerQty}</span>
                      <button onClick={() => handleUpdate(customer._id, 'dinner', dinnerQty, 1)} className="bg-indigo-500 w-8 h-8 sm:w-10 sm:h-10 rounded-full font-black text-lg sm:text-xl text-white border border-indigo-600 hover:bg-indigo-600 transition-colors flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>

                <button onClick={() => openHistory(customer)} className="hidden lg:flex p-3 bg-gray-50 text-gray-600 rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-colors items-center justify-center">
                  <History size={20} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      }

      {/* SAME MODAL FOR REVIEW TAB */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-lg border-t-4 sm:border-4 border-gray-300 h-[85vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden"></div>
            <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 pb-4">
              <div>
                <h3 className="font-black text-xl sm:text-2xl line-clamp-1">{selectedCustomer.name}'s History</h3>
                <p className="text-xs font-bold text-gray-500 mt-1">Tiffin Logs & Reports</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"><X size={20} strokeWidth={3} /></button>
            </div>

            <div className="bg-green-50 p-3 sm:p-4 rounded-xl border-2 border-green-200 mb-5 flex-shrink-0">
              <p className="text-xs font-black text-green-800 uppercase mb-2 tracking-wide">Download Official PDF Bill</p>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <div className="flex-1 relative">
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 uppercase pointer-events-none">From</span>
                  <input type="date" value={pdfStart} onChange={e=>setPdfStart(e.target.value)} className="w-full p-2 pl-12 rounded-lg border-2 border-green-300 font-bold text-sm outline-none bg-white focus:border-green-500" />
                </div>
                <div className="flex-1 relative">
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 uppercase pointer-events-none">To</span>
                  <input type="date" value={pdfEnd} onChange={e=>setPdfEnd(e.target.value)} className="w-full p-2 pl-8 rounded-lg border-2 border-green-300 font-bold text-sm outline-none bg-white focus:border-green-500" />
                </div>
              </div>
              <button 
                onClick={() => generateProfessionalPDF(selectedCustomer, historyRaw, pdfStart, pdfEnd)} 
                className="w-full bg-green-600 text-white font-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 shadow-sm border-2 border-green-700 transition-colors"
              >
                <Download size={18} strokeWidth={2.5}/> Export Bill
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 pb-4">
              {historyLoading ? <p className="text-center font-bold text-gray-400 my-10">Loading records...</p> : 
                Object.keys(historyData).length === 0 ? <p className="text-center font-bold text-gray-400 my-10">No entries found for this customer.</p> : 
                Object.keys(historyData).map((month) => (
                  <div key={month} className="mb-6">
                    <h4 className="font-black text-sm text-gray-600 uppercase tracking-widest bg-gray-100 py-1.5 px-3 rounded-lg inline-block mb-3 border-2 border-gray-200">{month}</h4>
                    <div className="space-y-2">
                      {historyData[month].map((log: any) => (
                        <div key={log._id} className="bg-white p-3 rounded-xl border-2 border-gray-100 flex justify-between items-center shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-10 rounded-full ${log.mealType === 'lunch' ? 'bg-orange-400' : 'bg-indigo-500'}`}></div>
                            <div>
                              <p className="font-black text-sm sm:text-base">{log.date}</p>
                              <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{log.mealType}</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-1.5 rounded-lg border-2 border-gray-200 font-black text-lg sm:text-xl text-black min-w-[3rem] text-center">
                            {log.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. BILLING TAB
// ==========================================
function BillingTab() {
  const [bills, setBills] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/billing');
      const data = await res.json();
      if (data.bills) { setBills(data.bills); setCurrentMonth(data.currentMonth); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchBills(); }, []);

  const markAsPaid = async (customerId: string) => {
    if(!window.confirm("Mark as PAID?")) return;
    setBills((prev: any) => prev.map((b: any) => b.id === customerId ? { ...b, isPaid: true } : b));
    await fetch('/api/billing/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId, month: currentMonth }) });
  };

  const sendWhatsApp = (bill: any) => {
    const text = `Hello ${bill.name},\n\nAapka *${currentMonth}* ka tiffin bill generate ho gaya hai.\n\nTotal Tiffins: *${bill.totalTiffins}*\nAmount Due: *Rs. ${bill.totalAmount}/-*\n\nKripya payment kar dein. 🙏\n\n- Durga Food Service`;
    window.open(`https://wa.me/91${bill.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl sm:text-3xl font-black text-black">Monthly Billing</h2>
        <div className="bg-white px-4 py-2 rounded-xl border-2 border-gray-200 shadow-sm">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mr-2">Cycle</span>
          <span className="font-black text-gray-800">{currentMonth}</span>
        </div>
      </div>
      
      {loading ? <p className="text-center font-bold text-gray-400 mt-10">Calculating Bills...</p> : 
        bills.length === 0 ? <p className="text-center font-bold text-gray-400 mt-10">No bills for this month yet.</p> :
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bills.map((bill: any) => (
            bill.isPaid ? (
              <div key={bill.id} className="bg-gray-50 p-5 rounded-2xl sm:rounded-3xl border-2 border-gray-200 shadow-sm opacity-70 transition-all hover:opacity-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-xl text-gray-500 line-through decoration-2">{bill.name}</p>
                    <p className="text-gray-400 font-bold text-sm mt-1">{bill.totalTiffins} Tiffins <span className="mx-1">•</span> Rs. {bill.price}/ea</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-black text-xl text-green-600 flex items-center gap-1.5 justify-end bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                      <CheckCircle size={18} strokeWidth={3}/> PAID
                    </h3>
                    <p className="text-sm font-black text-gray-400 mt-2 line-through">Rs. {bill.totalAmount}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={bill.id} className="bg-white p-5 rounded-2xl sm:rounded-3xl border-2 border-gray-200 shadow-md flex flex-col justify-between hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-black text-2xl text-black">{bill.name}</p>
                    <p className="text-gray-500 font-bold text-sm mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded-md border border-gray-200">
                      {bill.totalTiffins} Tiffins <span className="mx-1 text-gray-300">|</span> Rate: ₹{bill.price}
                    </p>
                  </div>
                  <h3 className="font-black text-3xl text-black bg-green-100 px-4 py-2 rounded-xl border-2 border-green-300 shadow-sm">
                    <span className="text-green-700 text-xl mr-1">₹</span>{bill.totalAmount}
                  </h3>
                </div>
                <div className="flex gap-3 mt-auto">
                  <button onClick={() => sendWhatsApp(bill)} className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-black shadow-sm border-2 border-[#1DA853] transition-colors flex justify-center items-center gap-2">
                     WhatsApp
                  </button>
                  <button onClick={() => markAsPaid(bill.id)} className="flex-1 bg-gray-50 hover:bg-green-50 hover:text-green-700 hover:border-green-300 text-gray-600 border-2 border-gray-200 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-black transition-all flex justify-center items-center gap-2 group">
                    <CheckCircle className="text-gray-400 group-hover:text-green-500 transition-colors" size={18} strokeWidth={2.5}/> Mark Paid
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      }
    </div>
  );
}

// ==========================================
// HELPER UI COMPONENTS
// ==========================================
function StatBox({ icon, value, label, isSmall }: any) {
  return (
    <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center hover:border-gray-300 transition-colors">
      {icon && <div className="mb-2 sm:mb-3 bg-green-50 p-2 sm:p-3 rounded-xl border border-green-100">{icon}</div>}
      <span className={`font-black text-black ${isSmall ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'}`}>{value}</span>
      <span className="text-gray-500 text-[10px] sm:text-xs font-bold mt-1 sm:mt-2 text-center uppercase tracking-wider">{label}</span>
    </div>
  );
}

function SidebarItem({ icon, label, tabName, activeTab, setActiveTab }: any) {
  const isActive = activeTab === tabName;
  return (
    <button 
      onClick={() => setActiveTab(tabName)} 
      className={`flex items-center gap-3 p-3 lg:p-4 rounded-xl font-black text-base lg:text-lg transition-all border-2 w-full text-left
        ${isActive ? 'bg-green-50 text-green-700 border-green-400 shadow-sm' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900'}`}
    >
      {React.cloneElement(icon, { className: isActive ? 'text-green-600' : 'text-gray-400', strokeWidth: isActive ? 2.5 : 2 })}
      {label}
    </button>
  );
}

function BottomNavItem({ icon, label, tabName, activeTab, setActiveTab }: any) {
  const isActive = activeTab === tabName;
  return (
    <button 
      onClick={() => setActiveTab(tabName)} 
      className={`flex flex-col items-center justify-center gap-1 transition-all p-2 rounded-xl flex-1
        ${isActive ? 'text-green-700 bg-green-50/80 shadow-sm transform -translate-y-1' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
    >
      {React.cloneElement(icon, { 
        size: isActive ? 24 : 22, 
        strokeWidth: isActive ? 2.5 : 2,
        className: isActive ? 'text-green-600' : 'text-gray-400'
      })}
      <span className={`text-[10px] uppercase tracking-wide ${isActive ? 'font-black' : 'font-bold'}`}>{label}</span>
    </button>
  );
}