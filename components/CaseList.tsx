
import React, { useState } from 'react';
import { Case, CaseType, CaseStatus, CaseDirection, CourtType } from '../types';

interface CaseListProps {
  cases: Case[];
  onSelectCase: (id: string) => void;
}

// Fixed: Define props interface and use React.FC to ensure compatibility with React's internal props like 'key'
interface CaseCardProps {
  c: Case;
  onSelectCase: (id: string) => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ c, onSelectCase }) => (
  <div 
    onClick={() => onSelectCase(c.id)}
    className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
  >
    <div className={`h-2 w-full ${c.direction.includes('By Me') ? 'bg-blue-600' : 'bg-rose-600'}`} />
    
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          c.status === CaseStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {c.status}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.courtType}</span>
      </div>
      
      <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[3.5rem] leading-snug">{c.title}</h4>
      <p className="text-xs font-black text-blue-600 mt-1 uppercase tracking-wider">{c.caseNumber}</p>
      
      <div className="mt-6 space-y-3 pt-4 border-t border-slate-50">
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full mr-3 ${c.direction.includes('By Me') ? 'bg-blue-600' : 'bg-rose-600'}`} />
          <span className={c.direction.includes('By Me') ? 'text-blue-600' : 'text-rose-600'}>{c.direction}</span>
        </div>
        <div className="flex items-center text-xs text-slate-500 font-medium">
          <svg className="w-4 h-4 mr-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          {c.court}
        </div>
        {c.department && (
          <div className="flex items-center text-xs text-slate-500 font-medium">
            <svg className="w-4 h-4 mr-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {c.department}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">
            {c.advocateName.charAt(0)}
          </div>
          <span className="text-xs font-bold text-slate-700">{c.advocateName}</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Balance</p>
          <p className={`text-xs font-black ${c.totalFees - c.feesPaid > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            ₹{(c.totalFees - c.feesPaid).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const CaseList: React.FC<CaseListProps> = ({ cases, onSelectCase }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterDirection, setFilterDirection] = useState<string>('All');
  const [filterCourt, setFilterCourt] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'department'>('grid');

  const filteredCases = cases.filter(c => {
    const matchesType = filterType === 'All' || c.type === filterType;
    const matchesDirection = filterDirection === 'All' || c.direction === filterDirection;
    const matchesCourt = filterCourt === 'All' || c.courtType === filterCourt;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.department && c.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesDirection && matchesSearch && matchesCourt;
  });

  const casesByDept = filteredCases.reduce((acc, c) => {
    const dept = c.department || 'General/Litigation';
    acc[dept] = acc[dept] || [];
    acc[dept].push(c);
    return acc;
  }, {} as Record<string, Case[]>);

  return (
    <div className="space-y-6">
      {/* Advanced Filter Control Center */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Title, Case #, or Dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
            />
            <svg className="w-5 h-5 absolute left-4 top-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex gap-2">
            <select 
              value={filterDirection} 
              onChange={e => setFilterDirection(e.target.value)}
              className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="All">All Directions</option>
              {Object.values(CaseDirection).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="bg-slate-100 p-1 rounded-2xl flex">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button 
                onClick={() => setViewMode('department')} 
                className={`p-3 rounded-xl transition-all ${viewMode === 'department' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {['All', ...Object.values(CaseType)].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border-2 ${
                filterType === type 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCases.map(c => <CaseCard key={c.id} c={c} onSelectCase={onSelectCase} />)}
          {filteredCases.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900">No matching matters</h3>
              <p className="text-slate-500 mt-2 font-medium">Try broadening your search or resetting filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Explicitly cast entries to handle unknown type errors during iteration */}
          {(Object.entries(casesByDept) as [string, Case[]][]).map(([dept, deptCases]) => (
            <div key={dept} className="space-y-6">
              <div className="flex items-center space-x-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{dept}</h3>
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-400">{deptCases.length} Matters</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {deptCases.map(c => <CaseCard key={c.id} c={c} onSelectCase={onSelectCase} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseList;
