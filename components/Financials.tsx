
import React, { useMemo } from 'react';
import { Case } from '../types';

interface FinancialsProps {
  cases: Case[];
}

const Financials: React.FC<FinancialsProps> = ({ cases }) => {
  const totalInvoiced = cases.reduce((acc, c) => acc + c.totalFees, 0);
  const totalCollected = cases.reduce((acc, c) => acc + c.feesPaid, 0);
  const totalOutstanding = totalInvoiced - totalCollected;

  // Monthly Accountant Logic
  const monthlyLedger = useMemo(() => {
    const months: Record<string, { total: number, payments: any[] }> = {};
    
    cases.forEach(c => {
      c.financials.forEach(f => {
        if (f.type === 'Payment') {
          const date = new Date(f.date);
          const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!months[key]) months[key] = { total: 0, payments: [] };
          months[key].total += f.amount;
          months[key].payments.push({ ...f, advocate: c.advocateName, caseTitle: c.title });
        }
      });
    });

    return Object.entries(months).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [cases]);

  return (
    <div className="space-y-8">
      {/* Primary Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Fee Commitments</p>
          <h3 className="text-4xl font-black text-slate-900 mt-2">₹{totalInvoiced.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-2">Total across {cases.length} matters</p>
        </div>
        
        <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-white">
             <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">Total Fees Paid</p>
          <h3 className="text-4xl font-black text-white mt-2">₹{totalCollected.toLocaleString()}</h3>
          <p className="text-xs text-blue-200 mt-2">Life-to-date distribution</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
             <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-rose-500 text-sm font-bold uppercase tracking-widest">Outstanding Payables</p>
          <h3 className="text-4xl font-black text-rose-600 mt-2">₹{totalOutstanding.toLocaleString()}</h3>
          <p className="text-xs text-rose-400 mt-2">Pending advocate clearances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Ledger Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center">
              <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Monthly Cashflow Accountant
            </h4>
            
            <div className="space-y-8">
              {monthlyLedger.map(([month, data]) => (
                <div key={month} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900">{month}</h5>
                    <span className="text-sm font-black text-blue-600">Total: ₹{data.total.toLocaleString()}</span>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-100">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Advocate</th>
                          <th className="px-6 py-4">Matter</th>
                          <th className="px-6 py-4 text-right">Disbursement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.payments.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{p.advocate}</td>
                            <td className="px-6 py-4 text-slate-500 line-clamp-1">{p.caseTitle}</td>
                            <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{p.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {monthlyLedger.length === 0 && <p className="text-center text-slate-400 py-12 italic">No payment history recorded.</p>}
            </div>
          </div>
        </div>

        {/* Advocate Distribution Pie/List */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h4 className="text-xl font-black text-slate-900 mb-6">Distribution by Counsel</h4>
            <div className="space-y-6">
              {cases.reduce((acc, c) => {
                const existing = acc.find(a => a.name === c.advocateName);
                if (existing) existing.total += c.feesPaid;
                else acc.push({ name: c.advocateName, total: c.feesPaid });
                return acc;
              }, [] as { name: string, total: number }[]).sort((a,b) => b.total - a.total).map((adv, idx) => (
                <div key={adv.name} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${['bg-blue-600', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][idx % 4]}`}>
                    {adv.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{adv.name}</p>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-1">
                      <div className="h-full bg-slate-300 rounded-full" style={{ width: `${(adv.total / totalCollected) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">₹{adv.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
