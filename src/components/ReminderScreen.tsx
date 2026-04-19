import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bell, Box, CheckCircle2, CalendarIcon, X, Zap, Wifi, Clock, ShieldCheck, ChevronRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { BottomSheet } from './BottomSheet';
import { mockAccounts } from '../data/mockData';
import { Account, AccountType, AccountCategory } from '../types';

function getOrdinalSuffix(i: number) {
  var j = i % 10,
      k = i % 100;
  if (j === 1 && k !== 11) {
      return "st";
  }
  if (j === 2 && k !== 12) {
      return "nd";
  }
  if (j === 3 && k !== 13) {
      return "rd";
  }
  return "th";
}

function getNextOccurrence(day: number) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); 
  const currentYear = today.getFullYear();
  
  let targetMonth = currentMonth;
  let targetYear = currentYear;

  if (day <= currentDay) {
    targetMonth++;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear++;
    }
  }

  const targetDate = new Date(targetYear, targetMonth, day);
  const monthName = targetDate.toLocaleString('default', { month: 'short' });
  return `${day}${getOrdinalSuffix(day)} ${monthName}`;
}

function getAccountIconSVG(type: AccountType) {
  if (type === 'Credit Card') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    );
  }
  if (type === 'Personal Loan' || type === 'Business Loan' || type === 'Home Loan') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </svg>
    );
  }
  if (type === 'Electricity') return <Zap className="h-[18px] w-[18px]" strokeWidth={2} />;
  if (type === 'Internet') return <Wifi className="h-[18px] w-[18px]" strokeWidth={2} />;
  if (type === 'Water/Gas') return <Box className="h-[18px] w-[18px]" strokeWidth={2} />;
  return <Box className="h-[18px] w-[18px]" strokeWidth={2} />;
}

function formatAmount(val: number) {
  if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + 'L';
  return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CATEGORIES = ['All', 'Cards', 'Loans', 'Utilities'];

const BANNERS = [
  // Banner 1: Build Credit Health
  () => (
    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[24px] p-5 flex items-center relative overflow-hidden text-white shadow-[0_4px_16px_rgba(124,58,237,0.25)] border border-white/10">
      <div className="relative z-10 w-[60%]">
        <h2 className="text-[17px] font-bold leading-[1.2] mb-1.5 drop-shadow-sm">Build Credit Health</h2>
        <p className="text-white/90 text-[12px] font-medium leading-[1.3] max-w-[95%]">Timely payments on your loans and cards help build a strong credit history.</p>
      </div>
      <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-[140px] h-[140px] flex items-center justify-center pointer-events-none">
         <svg viewBox="0 0 100 100" className="w-[110px] h-[110px] drop-shadow-xl" preserveAspectRatio="xMidYMid meet" fill="none">
           {/* Upward Graph */}
           <path d="M 20 80 L 80 80 L 80 20 L 55 20 L 55 45 L 35 45 L 35 60 L 20 60 Z" fill="url(#violet-grad)" opacity="0.6"/>
           <defs>
             <linearGradient id="violet-grad" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#FFF" stopOpacity="0.4" />
               <stop offset="100%" stopColor="#FFF" stopOpacity="0.0" />
             </linearGradient>
           </defs>
           <path d="M 20 70 L 35 50 L 55 55 L 80 20" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
           {/* Star/Coin element */}
           <circle cx="80" cy="20" r="10" fill="#FEF08A" stroke="#EAB308" strokeWidth="2"/>
           <path d="M 80 14 L 82 18 L 86 18 L 83 21 L 84 25 L 80 23 L 76 25 L 77 21 L 74 18 L 78 18 Z" fill="#CA8A04"/>
         </svg>
      </div>
    </div>
  ),
  // Banner 2: Manual Check / Custom Setup
  () => (
    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[24px] p-5 flex items-center relative overflow-hidden text-white shadow-[0_4px_16px_rgba(16,185,129,0.2)] border border-emerald-400/20">
      <div className="relative z-10 w-[60%]">
        <h2 className="text-[17px] font-bold leading-[1.2] mb-1.5 drop-shadow-sm">Control Your Alerts</h2>
        <p className="text-emerald-50 text-[12px] font-medium leading-[1.3] max-w-[95%]">Pick the exact date you want to be softly notified for each of your bills.</p>
      </div>
      <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[130px] h-[130px] flex items-center justify-center pointer-events-none">
         <div className="absolute inset-0 bg-white/10 blur-[20px] rounded-full scale-75" />
         <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] drop-shadow-lg relative z-10" preserveAspectRatio="xMidYMid meet" fill="none">
           {/* Calendar Outline */}
           <rect x="25" y="25" width="50" height="50" rx="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="3"/>
           <path d="M 25 40 L 75 40" stroke="#FFFFFF" strokeWidth="3"/>
           <path d="M 35 20 L 35 30 M 65 20 L 65 30" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
           {/* Date marker */}
           <circle cx="50" cy="58" r="8" fill="#FCD34D"/>
         </svg>
      </div>
    </div>
  ),
  // Banner 3: Utility Tracking
  () => (
    <div className="w-full h-full bg-[#12121A] border border-gray-800 rounded-[24px] p-5 flex items-center relative overflow-hidden text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      <div className="relative z-10 w-[60%]">
        <h2 className="text-[17px] font-bold leading-[1.2] mb-1.5 text-blue-400">Track Everything</h2>
        <p className="text-gray-400 text-[12px] font-medium leading-[1.3] max-w-[95%]">Keep an eye on multiple loans, cards, and utility bills in one clear dashboard.</p>
      </div>
      <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[130px] h-[130px] flex items-center justify-center pointer-events-none">
         <div className="absolute inset-0 bg-blue-600/10 blur-[30px] rounded-full scale-90" />
         <svg viewBox="0 0 100 100" className="w-[105px] h-[105px] drop-shadow-xl relative z-10" preserveAspectRatio="xMidYMid meet" fill="none">
           <rect x="20" y="30" width="40" height="15" rx="4" fill="#3B82F6" opacity="0.3"/>
           <rect x="20" y="55" width="50" height="15" rx="4" fill="#3B82F6" opacity="0.6"/>
           <rect x="20" y="80" width="30" height="15" rx="4" fill="#60A5FA"/>
           
           <circle cx="80" cy="50" r="15" fill="#1D4ED8" opacity="0.5"/>
           <circle cx="80" cy="50" r="10" fill="#3B82F6"/>
         </svg>
      </div>
    </div>
  ),
  // Banner 4: BBPS Concept
  () => (
    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-[24px] p-5 flex items-center relative overflow-hidden text-white shadow-[0_4px_16px_rgba(245,158,11,0.25)] border border-amber-400/20">
      <div className="relative z-10 w-[60%]">
        <h2 className="text-[17px] font-bold leading-[1.2] mb-1.5 drop-shadow-sm">Fast & Secure Pay</h2>
        <p className="text-amber-50 text-[12px] font-medium leading-[1.3] max-w-[95%]">Settle your credit card & loan EMIs instantly through BBPS integration.</p>
      </div>
      <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[130px] h-[130px] flex items-center justify-center pointer-events-none">
         <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] drop-shadow-lg relative z-10" preserveAspectRatio="xMidYMid meet" fill="none">
           <path d="M 50 15 L 80 25 V 50 C 80 70 65 85 50 95 C 35 85 20 70 20 50 V 25 Z" fill="#FDE68A" opacity="0.3"/>
           <path d="M 50 22 L 72 30 V 50 C 72 65 60 78 50 85 C 40 78 28 65 28 50 V 30 Z" fill="#FCD34D"/>
           <path d="M 42 55 L 48 61 L 62 47" stroke="#D97706" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
           <circle cx="25" cy="30" r="3" fill="#FFF" opacity="0.8"/>
           <circle cx="75" cy="70" r="4" fill="#FFF" opacity="0.8"/>
         </svg>
      </div>
    </div>
  ),
  // Banner 5: CTA specific behavior
  () => (
    <div className="w-full h-full bg-gradient-to-br from-[#FF3366] to-[#C90033] rounded-[24px] p-5 relative overflow-hidden text-white shadow-[0_4px_16px_rgba(255,51,102,0.25)] border border-white/10 flex flex-col justify-center cursor-pointer active:scale-[0.98] transition-transform">
      <div className="relative z-10 w-[65%]">
        <h2 className="text-[17px] font-bold leading-[1.2] mb-1.5 drop-shadow-sm">Check Credit Report</h2>
        <p className="text-white/90 text-[12px] font-medium leading-[1.3] mb-2.5 max-w-[95%]">Get a detailed analysis from top credit bureaus effortlessly.</p>
        <div className="inline-flex items-center justify-center bg-white text-[#C90033] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
          View Report <ChevronRight className="w-3 h-3 ml-0.5" strokeWidth={3} />
        </div>
      </div>
      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[140px] h-[140px] flex items-center justify-center pointer-events-none">
         <div className="absolute inset-0 bg-white/20 blur-[25px] rounded-full scale-75" />
         <svg viewBox="0 0 100 100" className="w-[115px] h-[115px] drop-shadow-xl relative z-10" preserveAspectRatio="xMidYMid meet" fill="none">
           <rect x="35" y="20" width="40" height="60" rx="4" fill="#FFF" transform="rotate(12 55 50)"/>
           <rect x="42" y="30" width="25" height="4" rx="2" fill="#FDA4AF" transform="rotate(12 55 50)"/>
           <rect x="45" y="40" width="20" height="4" rx="2" fill="#E2E8F0" transform="rotate(12 55 50)"/>
           <rect x="42" y="48" width="22" height="4" rx="2" fill="#E2E8F0" transform="rotate(12 55 50)"/>
           
           <circle cx="68" cy="65" r="14" fill="#FF3366" stroke="#FFF" strokeWidth="3" />
           <circle cx="68" cy="65" r="5" fill="#FFF" />
         </svg>
      </div>
    </div>
  )
];

const REPEATED_BANNERS = Array(20).fill(BANNERS).flat();

export default function ReminderScreen() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [tempSelectedDay, setTempSelectedDay] = useState<number | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        if (!el.firstElementChild) return;
        
        // Exact pixel width of item + gap (12px = gap-3)
        const itemWidth = el.firstElementChild.clientWidth;
        const step = itemWidth + 12;

        el.scrollBy({ left: step, behavior: 'smooth' });

        // Loop detection hack for the illusion of 'infinite'
        if (el.scrollLeft > el.scrollWidth * 0.5) {
           setTimeout(() => {
             // Reset back invisibly to the exact equivalent set earlier in the array
             const remainder = el.scrollLeft % (step * BANNERS.length);
             el.scrollTo({ left: (step * BANNERS.length) + remainder, behavior: 'instant' as any });
           }, 500); // Wait for the 'smooth' scroll to finish snapping completely before moving it underneath
        }
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const filteredAccounts = accounts
    .filter(acc => activeCategory === 'All' || acc.category === activeCategory)
    .sort((a, b) => {
      // Sort by enabled status: true comes before false
      if (a.isReminderEnabled === b.isReminderEnabled) return 0;
      return a.isReminderEnabled ? -1 : 1;
    });

  const handleToggle = (account: Account) => {
    if (!account.isReminderEnabled) {
      setSelectedAccount(account);
      setTempSelectedDay(account.reminderDay || 30);
      setIsSheetOpen(true);
    } else {
      setAccounts(prev => prev.map(a => 
        a.id === account.id ? { ...a, isReminderEnabled: false, reminderDay: null } : a
      ));
    }
  };

  const handleSetReminder = () => {
    if (!selectedAccount || tempSelectedDay === null) return;
    
    setAccounts(prev => prev.map(a => 
      a.id === selectedAccount.id 
        ? { ...a, isReminderEnabled: true, reminderDay: tempSelectedDay } 
        : a
    ));
    
    setIsSheetOpen(false);
    setTimeout(() => {
      setIsSuccessOpen(true);
    }, 400); 
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col font-sans bg-[#F9F9FA] overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-10 bg-[#F9F9FA] px-4 pt-5 pb-3">
        <div className="flex items-center mb-6 gap-2">
          <button className="rounded-full p-2 text-gray-800 hover:bg-gray-200 active:scale-95 transition -ml-2">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Set Reminders</h1>
        </div>

        {/* Categories Tab */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 text-[15px]">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "whitespace-nowrap rounded-[20px] px-5 py-2 font-semibold transition-all",
                activeCategory === category
                  ? "bg-[#1839FF] text-white shadow-[0_4px_12px_rgba(24,57,255,0.25)]"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-0 pb-24 pt-2">
        
        {/* Tracker Context Banners (Infinite Horizontal Scroll) */}
        <div className="mb-6 w-full">
          <div 
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0"
          >
            {REPEATED_BANNERS.map((BannerUI, idx) => (
              <div key={idx} className="w-[88%] min-w-[88%] shrink-0 snap-center h-[134px]">
                <BannerUI />
              </div>
            ))}
          </div>
        </div>

        {/* Account List */}
        <div className="space-y-4 px-4">
          <AnimatePresence mode="popLayout">
            {filteredAccounts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="empty-state"
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-bold text-[16px]">No {activeCategory} found</h3>
                <p className="text-gray-500 text-[13px] mt-1 font-medium">You don't have any accounts synced in this category yet.</p>
              </motion.div>
            ) : (
              filteredAccounts.map(account => {
                const maskedIdentifier = account.last4Digits 
                  ? `XXXX XXXX ${account.last4Digits}` 
                  : (account.fullAccountNumber ? `XXXX XXXX ${account.fullAccountNumber.slice(-4)}` : 'XXXX XXXX XXXX');

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={account.id} 
                    className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_20px_rgb(0,0,0,0.03)] border border-gray-100"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4 mb-3">
                        <div 
                          className={cn("flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transition-colors",
                            (!account.logoUrl || imageError[account.id]) ? "text-white" : "bg-white border border-gray-100/50"
                          )}
                          style={(!account.logoUrl || imageError[account.id]) ? { backgroundColor: account.colorHex } : undefined}
                        >
                          {account.logoUrl && !imageError[account.id] ? (
                            <img 
                              src={account.logoUrl} 
                              alt={account.bankName} 
                              className="w-full h-full object-contain p-[9px]" 
                              onError={() => setImageError(prev => ({...prev, [account.id]: true}))}
                              referrerPolicy="no-referrer"
                            />
                          ) : getAccountIconSVG(account.type)}
                        </div>
                        
                        <div className="flex-1 mt-0.5">
                          <h3 className="font-bold text-gray-900 text-[16px] tracking-tight">{account.bankName}</h3>
                          <p className="font-mono text-[13px] font-semibold text-gray-400 mt-0.5 tracking-wider">
                            {account.type.toUpperCase()} • {maskedIdentifier}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-3">
                        <div>
                          {account.isReminderEnabled ? (
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#32A852]">
                                  <Clock className="w-4 h-4" /> Reminder Active 
                                </div>
                                <p className="text-gray-500 text-[12px] font-semibold mt-0.5">
                                  Next alert on <span className="text-gray-800">{getNextOccurrence(account.reminderDay!)}</span>
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-500">
                                  Reminder Setup
                                </div>
                                <p className="text-gray-400 text-[12px] font-medium mt-0.5 flex items-center">
                                  Enable to get notified
                                </p>
                              </div>
                            )}
                        </div>
                        
                        <button
                            onClick={() => handleToggle(account)}
                            className={cn(
                              "relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                              account.isReminderEnabled ? 'bg-[#1839FF]' : 'bg-gray-200'
                            )}
                          >
                            <span className="sr-only">Toggle reminder</span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out",
                                account.isReminderEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              )}
                            />
                          </button>
                      </div>
                    </div>

                    {/* Last Paid Footer */}
                    {account.lastPaymentDate && account.lastPaymentAmount && (
                      <div className="bg-emerald-50/50 px-5 py-3 flex text-[13px] font-semibold text-emerald-800 gap-2 items-center border-t border-emerald-100/60 rounded-b-[24px]">
                        <div className="bg-emerald-100/80 p-[3px] rounded-full flex items-center justify-center">
                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span>Last paid <span className="font-bold text-emerald-900">{formatAmount(account.lastPaymentAmount)}</span> on {account.lastPaymentDate}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Set Reminder Bottom Sheet */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        {selectedAccount && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-2">
            <h2 className="mb-1 text-center text-[20px] font-bold text-gray-900 mt-2 tracking-tight">Set Reminder</h2>
            <p className="text-center text-gray-500 text-[14px] font-medium mb-4">Select a day of the month to be notified.</p>
            
            {/* Selected Account Info */}
            <div className="mb-4 rounded-[16px] bg-[#F8F9FA] p-3 border border-gray-100 flex items-center gap-4">
              <div 
                className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] font-bold shadow-[0_4px_10px_rgba(0,0,0,0.05)] overflow-hidden transition-colors",
                  (!selectedAccount.logoUrl || imageError[selectedAccount.id]) ? "text-white text-[10px]" : "bg-white border border-gray-100"
                )}
                style={(!selectedAccount.logoUrl || imageError[selectedAccount.id]) ? { backgroundColor: selectedAccount.colorHex } : undefined}
              >
                {selectedAccount.logoUrl && !imageError[selectedAccount.id] ? (
                  <img 
                    src={selectedAccount.logoUrl} 
                    alt={selectedAccount.bankName} 
                    className="w-full h-full object-contain p-[5px]" 
                    referrerPolicy="no-referrer"
                  />
                ) : getAccountIconSVG(selectedAccount.type)}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{selectedAccount.bankName}</h3>
                <p className="font-mono text-[12px] font-semibold text-gray-500 mt-0.5 tracking-wider">
                  A/C: {selectedAccount.last4Digits ? `XXXX XXXX ${selectedAccount.last4Digits}` : (selectedAccount.fullAccountNumber ? `XXXX XXXX ${selectedAccount.fullAccountNumber.slice(-4)}` : 'XXXX XXXX XXXX')}
                </p>
              </div>
            </div>

            {/* Smart Tip depending on category */}
            <div className="bg-[#F4F6FF] border border-[#1839FF]/10 rounded-[14px] p-3 mb-4 flex gap-3 shadow-sm items-start">
                <div className="bg-[#1839FF]/10 text-[#1839FF] rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                   <Lightbulb className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                   <h4 className="font-bold text-[#1839FF] text-[13px]">Setup Advice</h4>
                   <p className="text-[12px] font-medium text-gray-600 leading-[1.3] mt-0.5">
                     {selectedAccount.category === 'Loans' 
                       ? "EMIs are usually auto-deducted directly from your bank. Set this to 2 days before to ensure clear funds."
                       : selectedAccount.category === 'Utilities'
                         ? "Utilities have rigid cut-offs. We recommend paying at least 3 days in advance."
                         : "Set it 4-10 days before your actual due date to allow time for bank clearance without hurting your score."}
                   </p>
                </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div>
                 <h4 className="font-bold text-gray-900 text-[15px]">Select Alert Date</h4>
                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">Every month on this date</p>
              </div>
            </div>

            <div className="mb-4 rounded-[16px] border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] pb-4 pt-4 px-3">
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 justify-items-center">
                {[...Array(30)].map((_, i) => {
                  const day = i + 1;
                  const isSelected = tempSelectedDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setTempSelectedDay(day)}
                      className={cn(
                        "flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full text-[13px] transition-all",
                        isSelected 
                          ? "bg-[#1839FF] text-white font-bold shadow-[0_4px_12px_rgba(24,57,255,0.3)] scale-110" 
                          : "text-gray-700 font-medium bg-gray-50/50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-5 text-center">
               <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-[13px] font-semibold text-gray-600 border border-gray-200/60">
                 <CalendarIcon className="w-4 h-4 text-gray-400" />
                 Next alert on <span className="text-gray-900 font-bold">{tempSelectedDay ? getNextOccurrence(tempSelectedDay) : '--'}</span>
               </span>
            </div>

            <button
              onClick={handleSetReminder}
              className="w-full rounded-[16px] bg-[#1839FF] py-4 text-[16px] font-bold tracking-wide text-white transition-all active:scale-[0.98] hover:bg-[#0022E0] shadow-[0_8px_20px_rgba(24,57,255,0.25)] flex items-center justify-center gap-2"
            >
              Set Reminder
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Success Sheet */}
      <BottomSheet isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)}>
         <div className="flex flex-col items-center justify-center px-4 py-8 text-center animate-in fade-in zoom-in-95 duration-300 min-h-[350px]">
            <div className="mb-6 relative">
               <div className="absolute inset-0 bg-[#E8FFF0] blur-xl rounded-full scale-150 opacity-70"></div>
               <div className="relative bg-[#32A852] w-[80px] h-[80px] rounded-[24px] rotate-3 shadow-[0_10px_30px_rgba(50,168,82,0.3)] flex items-center justify-center">
                  <CheckCircle2 className="text-white w-10 h-10 rotate-[-3deg]" strokeWidth={2.5} />
               </div>
            </div>
            
            <h2 className="mb-2 text-[24px] font-bold text-gray-900 max-w-[280px] leading-[1.2] mt-4">
              Tracker Activated Successfully!
            </h2>
            <p className="text-gray-500 font-medium mt-1">You will be notified before the due date.</p>
            
            <button
              onClick={() => setIsSuccessOpen(false)}
              className="mt-10 w-full rounded-[16px] bg-[#1839FF] py-4 text-[16px] font-bold tracking-wide text-white transition-all active:scale-[0.98] shadow-[0_8px_20px_rgba(24,57,255,0.25)]"
            >
              Continue to Dashboard
            </button>
         </div>
      </BottomSheet>

    </div>
  );
}
