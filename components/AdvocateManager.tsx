
import React, { useState, useMemo } from 'react';
import { Case, FinancialEntry } from '../types';

interface AdvocateManagerProps {
  cases: Case[];
  onSelectCase: (id: string) => void;
  onAddAdvocate: () => void;
  onAddPayment: (caseId: string, payment: FinancialEntry) => void;
}

const AdvocateManager: React.FC<AdvocateManagerProps> = ({ cases, onSelectCase, onAddAdvocate, onAddPayment }) => {
  const [selectedAdvocate, setSelectedAdvocate] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    caseId: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: 'Professional Fees'
  });

  const advocateData = useMemo(() => {
    const map = new Map<string, {
      name: string;
      activeCases: number;
      totalFees: number;
      feesPaid: number;
      monthlyFees: number;
      monthlyBreakdown: Record<string, number>;
      cases: Case[];
    }>();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    cases.forEach(c => {
      const entry = map.get(c.advocateName) || {
        name: c.advocateName,
        activeCases: 0,
        totalFees: 0,
        feesPaid: 0,
        monthlyFees: 0,
        monthlyBreakdown: {},
        cases: []
      };

      entry.activeCases += 1;
      entry.totalFees += c.totalFees;
      entry.feesPaid += c.feesPaid;
      entry.cases.push(c);

      c.financials.forEach(f => {
        const fDate = new Date(f.date);
        const monthYear = fDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        if (f.type === 'Payment') {
          entry.monthlyBreakdown[monthYear] = (entry.monthlyBreakdown[monthYear] || 0) + f.amount;
          
          if (fDate.getMonth() === currentMonth && fDate.getFullYear() === currentYear) {
            entry.monthlyFees += f.amount;
          }
        }
      });

      map.set(c.advocateName, entry);
    });

    return Array.from(map.values());
  }, [cases]);

  const selectedAdv = selectedAdvocate ? advocateData.find(a => a.name === selectedAdvocate) : null;

  const groupedCases = useMemo(() => {
    if (!selectedAdv) return {};
    return selectedAdv.cases.reduce((acc, c) => {
      acc[c.type] = acc[c.type] || [];
      acc[c.type].push(c);
      return acc;
    }, {} as Record<string, Case[]>);
  }, [selectedAdv]);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.caseId) return;

    const payment: FinancialEntry = {
      id: Date.now().toString(),
      amount: paymentForm.amount,
      date: paymentForm.date,
      description: paymentForm.description,
      type: 'Payment'
    };

    onAddPayment(paymentForm.caseId, payment);
    setShowPaymentModal(false);
    setPaymentForm({
      caseId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: 'Professional Fees'
    });
  };

  return (
    <div className="space-y-8">
      {!selectedAdvocate ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">Professional Roster</h2>
            <button 
              onClick={onAddAdvocate}
              className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-100 flex items-center space-x-2 text-sm uppercase tracking-widest"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              <span>Add Advocate</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advocateData.map(adv => (
              <div 
                key={adv.name}
                onClick={() => setSelectedAdvocate(adv.name)}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {adv.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{adv.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{adv.activeCases} Active Cases</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Current Month Paid</span>
                    <span className="font-bold text-slate-900">₹{adv.monthlyFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Lifetime Paid</span>
                    <span className="font-bold text-blue-600">₹{adv.feesPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 relative">
          {/* Payment Modal Overlay */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider">Log Payment to {selectedAdv?.name}</h3>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Select Matter/Case</label>
                    <select 
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      value={paymentForm.caseId}
                      onChange={e => setPaymentForm({...paymentForm, caseId: e.target.value})}
                    >
                      <option value="">-- Choose Case --</option>
                      {selectedAdv?.cases.map(c => (
                        <option key={c.id} value={c.id}>{c.caseNumber} - {c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Amount (₹)</label>
                      <input 
                        type="number" required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        value={paymentForm.amount}
                        onChange={e => setPaymentForm({...paymentForm, amount: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Date</label>
                      <input 
                        type="date" required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        value={paymentForm.date}
                        onChange={e => setPaymentForm({...paymentForm, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Notes</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="e.g., Final installment"
                      value={paymentForm.description}
                      onChange={e => setPaymentForm({...paymentForm, description: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 uppercase tracking-widest text-xs">Confirm</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedAdvocate(null)} className="flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Advocate Roster
            </button>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-3 bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-100 flex items-center space-x-2 text-sm uppercase tracking-widest"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Record Payment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile & Detailed Fee Structure */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-lg shadow-blue-100">
                    {selectedAdv?.name.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedAdv?.name}</h2>
                  <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Legal Counsel</p>
                </div>

                <div className="space-y-6">
                  <div className="p-5 bg-blue-50 rounded-3xl">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Lifetime Fees Paid</p>
                    <p className="text-3xl font-black text-blue-700 mt-1">₹{selectedAdv?.feesPaid.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Monthly Accountant Log</h4>
                    <div className="space-y-3">
                      {(Object.entries(selectedAdv?.monthlyBreakdown || {}) as [string, number][]).sort((a,b) => b[0].localeCompare(a[0])).map(([month, amount]) => (
                        <div key={month} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <span className="text-sm font-medium text-slate-600">{month}</span>
                          <span className="text-sm font-bold text-slate-900">₹{amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grouped Case List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Matters Handled by {selectedAdv?.name.split(' ').pop()}
                </h3>
                
                {(Object.entries(groupedCases) as [string, Case[]][]).length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium italic">No matters currently assigned.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {(Object.entries(groupedCases) as [string, Case[]][]).map(([type, list]) => (
                      <div key={type} className="space-y-4">
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">{type}</span>
                          <div className="flex-1 border-t border-slate-100 ml-4"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {list.map(c => (
                            <div 
                              key={c.id} 
                              onClick={() => onSelectCase(c.id)}
                              className="group p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                            >
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black text-white ${c.direction.includes('By Me') ? 'bg-blue-600' : 'bg-rose-500'}`}>
                                    {c.direction.includes('By Me') ? 'PLAINTIFF' : 'DEFENDANT'}
                                  </span>
                                  <span className="text-xs font-bold text-slate-400">{c.caseNumber}</span>
                                </div>
                                <h5 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{c.title}</h5>
                                <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">{c.court}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-slate-900">₹{c.totalFees.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Case Value</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvocateManager;
