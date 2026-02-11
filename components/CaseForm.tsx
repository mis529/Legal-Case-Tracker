
import React, { useState } from 'react';
import { Case, CaseStatus, CaseDirection, CourtType, Advocate } from '../types';

interface CaseFormProps {
  onSubmit: (newCase: Case) => void;
  onCancel: () => void;
  availableAdvocates: Advocate[];
  availableTypes: string[];
}

const CaseForm: React.FC<CaseFormProps> = ({ onSubmit, onCancel, availableAdvocates, availableTypes }) => {
  const [formData, setFormData] = useState({
    title: '',
    caseNumber: '',
    court: '',
    department: '',
    type: availableTypes[0] || 'Recovery Suit',
    customType: '',
    direction: CaseDirection.PLAINTIFF,
    courtType: CourtType.DISTRICT,
    advocateName: availableAdvocates[0]?.name || '',
    nextHearingDate: '',
    courseOfAction: '',
    totalFees: 0
  });

  const [isAddingCustomType, setIsAddingCustomType] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = isAddingCustomType ? formData.customType : formData.type;
    const newCase: Case = {
      ...formData,
      type: finalType,
      id: Date.now().toString(),
      status: CaseStatus.ACTIVE,
      feesPaid: 0,
      hearings: [],
      financials: [],
      comments: []
    };
    onSubmit(newCase);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-200">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Matter Registration</h2>
        <p className="text-slate-500 mb-8 font-medium">Classify your case direction and jurisdiction details.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Parties/Title</label>
            <input 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="e.g., Acme vs. Global Ltd"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Directionality</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600"
              value={formData.direction}
              onChange={e => setFormData({...formData, direction: e.target.value as CaseDirection})}
            >
              {Object.values(CaseDirection).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Case Category</label>
              <button 
                type="button"
                onClick={() => setIsAddingCustomType(!isAddingCustomType)}
                className="text-[10px] font-black text-blue-600 uppercase hover:underline"
              >
                {isAddingCustomType ? 'Select from list' : '+ Add New Type'}
              </button>
            </div>
            {isAddingCustomType ? (
              <input 
                required
                className="w-full p-4 bg-blue-50 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                placeholder="Enter custom case type..."
                value={formData.customType}
                onChange={e => setFormData({...formData, customType: e.target.value})}
              />
            ) : (
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Jurisdiction Type</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={formData.courtType}
              onChange={e => setFormData({...formData, courtType: e.target.value as CourtType})}
            >
              {Object.values(CourtType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Department (Optional)</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="e.g., GST Dept, Customs"
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Case Number</label>
            <input 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="e.g., CS/500/2024"
              value={formData.caseNumber}
              onChange={e => setFormData({...formData, caseNumber: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Appointed Advocate</label>
            <select 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={formData.advocateName}
              onChange={e => setFormData({...formData, advocateName: e.target.value})}
            >
              {availableAdvocates.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
              {availableAdvocates.length === 0 && <option value="">No advocates registered</option>}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Next Hearing Date</label>
            <input 
              required
              type="date"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={formData.nextHearingDate}
              onChange={e => setFormData({...formData, nextHearingDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Professional Fee Agreed (₹)</label>
            <input 
              type="number"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
              placeholder="0.00"
              value={formData.totalFees}
              onChange={e => setFormData({...formData, totalFees: Number(e.target.value)})}
            />
          </div>

          <div className="col-span-full space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Next Course of Action</label>
            <textarea 
              rows={3}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="Explain the strategy or next legal step..."
              value={formData.courseOfAction}
              onChange={e => setFormData({...formData, courseOfAction: e.target.value})}
            />
          </div>

          <div className="col-span-full flex items-center justify-end space-x-6 mt-10">
            <button 
              type="button" 
              onClick={onCancel}
              className="font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest text-xs"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              className="px-10 py-4 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
            >
              Create Matter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;
