
import React, { useState } from 'react';
import { Advocate } from '../types';

interface AdvocateFormProps {
  onSubmit: (adv: Advocate) => void;
  onCancel: () => void;
}

const AdvocateForm: React.FC<AdvocateFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString()
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Register Advocate</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <input 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              placeholder="Adv. John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Specialization</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="e.g., Civil, Criminal, Tax"
              value={formData.specialization}
              onChange={e => setFormData({...formData, specialization: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Info (Email/Phone)</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="example@law.com"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="text-xs font-black text-slate-400 uppercase tracking-widest px-4"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 uppercase tracking-widest text-xs"
            >
              Save Advocate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvocateForm;
