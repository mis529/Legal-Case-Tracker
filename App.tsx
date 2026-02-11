
import React, { useState, useMemo } from 'react';
import { Case, ViewState, CaseStatus, CaseType, CaseDirection, CourtType, Advocate, FinancialEntry } from './types';
import { ICONS } from './constants';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CaseList from './components/CaseList';
import CaseDetail from './components/CaseDetail';
import CaseForm from './components/CaseForm';
import Financials from './components/Financials';
import AdvocateManager from './components/AdvocateManager';
import AdvocateForm from './components/AdvocateForm';

const MOCK_ADVOCATES: Advocate[] = [
  { id: 'adv1', name: 'Adv. Rajesh Kumar', specialization: 'Civil Litigation' },
  { id: 'adv2', name: 'Adv. Meera S.', specialization: 'Taxation' }
];

const MOCK_CASES: Case[] = [
  {
    id: '1',
    caseNumber: 'CS/1204/2023',
    title: 'Acme Corp vs Global Logistics',
    status: CaseStatus.ACTIVE,
    direction: CaseDirection.PLAINTIFF,
    type: CaseType.RECOVERY_SUIT,
    courtType: CourtType.DISTRICT,
    court: 'District Court, Delhi',
    advocateName: 'Adv. Rajesh Kumar',
    nextHearingDate: '2024-06-15',
    courseOfAction: 'Filing of Replication',
    totalFees: 50000,
    feesPaid: 25000,
    hearings: [
      { id: 'h1', date: '2024-03-10', court: 'Room 201', appearingPerson: 'Adv. Rajesh', purpose: 'Summons Return', summary: 'Defendant appeared, sought time for WS.' }
    ],
    financials: [
      { id: 'f1', amount: 25000, date: '2024-05-15', description: 'Retainer Fee', type: 'Payment' }
    ],
    comments: [
      { id: 'c1', author: 'Adv. Rajesh', text: 'Defendant is likely to challenge jurisdiction.', timestamp: '2024-03-11', isAdvocate: true }
    ]
  },
  {
    id: '2',
    caseNumber: 'GST/APPEAL/45/2024',
    title: 'Sunshine Exports vs Commissioner of GST',
    status: CaseStatus.PENDING,
    direction: CaseDirection.DEFENDANT,
    type: CaseType.GST_DEPT,
    courtType: CourtType.TRIBUNAL,
    court: 'GST Appellate Tribunal',
    department: 'GST Dept',
    advocateName: 'Adv. Meera S.',
    nextHearingDate: '2024-05-20',
    courseOfAction: 'Oral Arguments',
    totalFees: 80000,
    feesPaid: 80000,
    hearings: [],
    financials: [
      { id: 'f2', amount: 80000, date: '2024-02-10', description: 'Full Case Fee', type: 'Payment' }
    ],
    comments: []
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [cases, setCases] = useState<Case[]>(MOCK_CASES);
  const [advocates, setAdvocates] = useState<Advocate[]>(MOCK_ADVOCATES);
  const [caseTypes, setCaseTypes] = useState<string[]>(Object.values(CaseType));
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const selectedCase = useMemo(() => 
    cases.find(c => c.id === selectedCaseId), 
    [cases, selectedCaseId]
  );

  const handleAddCase = (newCase: Case) => {
    setCases([...cases, newCase]);
    setCurrentView('caseList');
    if (!caseTypes.includes(newCase.type)) {
      setCaseTypes([...caseTypes, newCase.type]);
    }
  };

  const handleUpdateCase = (updatedCase: Case) => {
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleAddAdvocate = (newAdv: Advocate) => {
    setAdvocates([...advocates, newAdv]);
    setCurrentView('advocates');
  };

  const handleAddPayment = (caseId: string, payment: FinancialEntry) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          feesPaid: c.feesPaid + payment.amount,
          financials: [...c.financials, payment]
        };
      }
      return c;
    }));
  };

  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (currentView === 'landing') {
    return <LandingPage onLaunch={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col p-6 space-y-8 hidden md:flex">
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center space-x-3 px-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">Legal Case Tracker</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem view="dashboard" icon={ICONS.Dashboard} label="Dashboard" />
          <SidebarItem view="caseList" icon={ICONS.Cases} label="My Cases" />
          <SidebarItem view="advocates" icon={() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} label="Advocates" />
          <SidebarItem view="financials" icon={ICONS.Fees} label="Accountant" />
        </nav>

        <button
          onClick={() => setCurrentView('addCase')}
          className="flex items-center justify-center space-x-2 w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ICONS.Plus className="w-5 h-5" />
          <span>New Case</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 glass-panel px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              {currentView === 'caseDetail' ? 'Case Details' : currentView.toUpperCase()}
            </h2>
            <p className="text-slate-900 font-semibold">
              {currentView === 'dashboard' && 'Portfolio Overview'}
              {currentView === 'caseList' && 'Litigation Repository'}
              {currentView === 'caseDetail' && selectedCase?.caseNumber}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
               <ICONS.Alert className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden ring-2 ring-blue-100">
              <img src={`https://ui-avatars.com/api/?name=User&background=0284c7&color=fff`} alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {currentView === 'dashboard' && (
            <Dashboard 
              cases={cases} 
              onViewCase={(id) => { setSelectedCaseId(id); setCurrentView('caseDetail'); }} 
            />
          )}
          {currentView === 'caseList' && (
            <CaseList 
              cases={cases} 
              onSelectCase={(id) => { setSelectedCaseId(id); setCurrentView('caseDetail'); }} 
            />
          )}
          {currentView === 'caseDetail' && selectedCase && (
            <CaseDetail 
              caseItem={selectedCase} 
              onUpdate={handleUpdateCase}
              onAddPayment={handleAddPayment}
              onBack={() => setCurrentView('caseList')}
            />
          )}
          {currentView === 'advocates' && (
            <AdvocateManager 
              cases={cases} 
              onSelectCase={(id) => { setSelectedCaseId(id); setCurrentView('caseDetail'); }}
              onAddAdvocate={() => setCurrentView('addAdvocate')}
              onAddPayment={handleAddPayment}
            />
          )}
          {currentView === 'addAdvocate' && (
            <AdvocateForm 
              onSubmit={handleAddAdvocate}
              onCancel={() => setCurrentView('advocates')}
            />
          )}
          {currentView === 'financials' && <Financials cases={cases} />}
          {currentView === 'addCase' && (
            <CaseForm 
              onSubmit={handleAddCase} 
              onCancel={() => setCurrentView('caseList')} 
              availableAdvocates={advocates}
              availableTypes={caseTypes}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
