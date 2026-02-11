
import React, { useState, useEffect } from 'react';
import { Case, Hearing, Comment, FinancialEntry } from '../types';
import { getCaseInsights } from '../services/geminiService';
import { ICONS } from '../constants';

interface CaseDetailProps {
  caseItem: Case;
  onUpdate: (updated: Case) => void;
  onAddPayment: (caseId: string, payment: FinancialEntry) => void;
  onBack: () => void;
}

const CaseDetail: React.FC<CaseDetailProps> = ({ caseItem, onUpdate, onAddPayment, onBack }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'hearings' | 'financials' | 'comments'>('info');
  const [aiInsight, setAiInsight] = useState<string>('Analyzing case data...');
  const [newComment, setNewComment] = useState('');
  
  // Payment Form State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: 'Professional Fees'
  });

  useEffect(() => {
    const fetchInsights = async () => {
      const insight = await getCaseInsights(caseItem);
      setAiInsight(insight);
    };
    fetchInsights();
  }, [caseItem]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      text: newComment,
      timestamp: new Date().toLocaleString(),
      isAdvocate: false
    };
    onUpdate({ ...caseItem, comments: [...caseItem.comments, comment] });
    setNewComment('');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: FinancialEntry = {
      id: Date.now().toString(),
      amount: paymentData.amount,
      date: paymentData.date,
      description: paymentData.description,
      type: 'Payment'
    };
    onAddPayment(caseItem.id, entry);
    setShowPaymentForm(false);
    setPaymentData({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: 'Professional Fees'
    });
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-4 font-medium transition-colors border-b-2 ${
        activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Case List
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{caseItem.type}</span>
              <span className="text-slate-400 text-sm">{caseItem.caseNumber}</span>
            </div>
            <h2 className="text-3xl font-bold">{caseItem.title}</h2>
            <p className="text-slate-400 mt-2 flex items-center">
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
               {caseItem.court}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-slate-400 text-xs uppercase font-bold">Primary Advocate</p>
              <p className="text-xl font-bold">{caseItem.advocateName}</p>
            </div>
            <button className="px-6 py-2 bg-blue-600 rounded-full font-bold text-sm hover:bg-blue-500 transition-colors">
              Request Update
            </button>
          </div>
        </div>

        {/* AI Insight Bar */}
        <div className="px-8 py-4 bg-blue-50 border-b border-blue-100 flex items-start space-x-4">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-600 uppercase">AI Strategy Insight</p>
            <p className="text-sm text-blue-900 mt-1">{aiInsight}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <TabButton id="info" label="Overview" />
          <TabButton id="hearings" label="Hearings History" />
          <TabButton id="financials" label="Accountant & Fees" />
          <TabButton id="comments" label="Advocate Comments" />
        </div>

        <div className="p-8">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-slate-800 border-l-4 border-blue-600 pl-4 mb-4">Case Status & Details</h4>
                  <dl className="grid grid-cols-2 gap-y-4">
                    <dt className="text-slate-500 text-sm">Next Hearing Date</dt>
                    <dd className="text-slate-900 font-bold">{new Date(caseItem.nextHearingDate).toLocaleDateString()}</dd>
                    <dt className="text-slate-500 text-sm">Course of Action</dt>
                    <dd className="text-slate-900 font-bold">{caseItem.courseOfAction}</dd>
                    <dt className="text-slate-500 text-sm">Current Status</dt>
                    <dd className="text-slate-900 font-bold">{caseItem.status}</dd>
                  </dl>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 border-l-4 border-blue-600 pl-4 mb-4">Financial Overview</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Fees Paid</p>
                      <p className="text-xl font-black text-emerald-600">₹{caseItem.feesPaid.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Balance</p>
                      <p className="text-xl font-black text-rose-500">₹{(caseItem.totalFees - caseItem.feesPaid).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                 <h4 className="font-bold text-slate-800 border-l-4 border-blue-600 pl-4 mb-4">Upcoming Reminders</h4>
                 <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center space-x-4">
                    <ICONS.Alert className="text-amber-600 w-8 h-8" />
                    <div>
                      <p className="font-bold text-amber-900">Check filing status</p>
                      <p className="text-sm text-amber-700">Advocate needs to file response before {caseItem.nextHearingDate}</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'hearings' && (
            <div className="space-y-4">
              {caseItem.hearings.length === 0 ? (
                <p className="text-slate-500 italic">No hearing history recorded yet.</p>
              ) : (
                caseItem.hearings.map(hearing => (
                  <div key={hearing.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{new Date(hearing.date).toLocaleDateString()}</span>
                        <span className="text-xs text-slate-500">• {hearing.court}</span>
                      </div>
                      <p className="text-sm font-semibold text-blue-700">{hearing.purpose}</p>
                      <p className="text-slate-600 text-sm mt-2">{hearing.summary}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Appeared By</p>
                      <p className="text-sm font-bold text-slate-800">{hearing.appearingPerson}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'financials' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="text-lg font-bold text-slate-800">Fee Summary</h4>
                   <button 
                    onClick={() => setShowPaymentForm(true)}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                     <span>Add Payment</span>
                   </button>
                </div>

                {showPaymentForm && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 mb-6">
                    <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Amount (₹)</label>
                        <input 
                          type="number" 
                          required 
                          className="w-full p-3 rounded-xl border border-slate-200"
                          value={paymentData.amount}
                          onChange={e => setPaymentData({...paymentData, amount: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Payment Date</label>
                        <input 
                          type="date" 
                          required 
                          className="w-full p-3 rounded-xl border border-slate-200"
                          value={paymentData.date}
                          onChange={e => setPaymentData({...paymentData, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Description</label>
                        <input 
                          type="text" 
                          className="w-full p-3 rounded-xl border border-slate-200"
                          value={paymentData.description}
                          onChange={e => setPaymentData({...paymentData, description: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-3 flex justify-end space-x-3 mt-2">
                        <button type="button" onClick={() => setShowPaymentForm(false)} className="text-xs font-bold text-slate-400 px-4">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl">Confirm Payment</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                      <p className="text-slate-500 text-sm">Total Fee Agreed</p>
                      <p className="text-2xl font-bold text-slate-900">₹{caseItem.totalFees.toLocaleString()}</p>
                   </div>
                   <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <p className="text-emerald-700 text-sm">Paid to Date</p>
                      <p className="text-2xl font-bold text-emerald-900">₹{caseItem.feesPaid.toLocaleString()}</p>
                   </div>
                   <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                      <p className="text-rose-700 text-sm">Remaining</p>
                      <p className="text-2xl font-bold text-rose-900">₹{(caseItem.totalFees - caseItem.feesPaid).toLocaleString()}</p>
                   </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {caseItem.financials.map(f => (
                        <tr key={f.id}>
                          <td className="px-6 py-4 text-sm">{new Date(f.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm font-medium">{f.description}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${f.type === 'Payment' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                              {f.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-right">₹{f.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="flex space-x-4">
                <input 
                  type="text" 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a question or add a comment..." 
                  className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                  onClick={handleAddComment}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
                >
                  Post
                </button>
              </div>
              <div className="space-y-4">
                {caseItem.comments.slice().reverse().map(comment => (
                  <div key={comment.id} className={`p-5 rounded-3xl border ${comment.isAdvocate ? 'bg-blue-50 border-blue-100 ml-12' : 'bg-white border-slate-100 mr-12'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{comment.author} {comment.isAdvocate && '(Advocate)'}</span>
                      <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
