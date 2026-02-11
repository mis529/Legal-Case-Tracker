
import React from 'react';
import { Case, CaseStatus } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  cases: Case[];
  onViewCase: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cases, onViewCase }) => {
  const activeCases = cases.filter(c => c.status === CaseStatus.ACTIVE).length;
  const totalFeesPaid = cases.reduce((acc, c) => acc + c.feesPaid, 0);
  const totalDue = cases.reduce((acc, c) => acc + (c.totalFees - c.feesPaid), 0);
  
  const upcomingHearings = cases
    .filter(c => c.nextHearingDate)
    .sort((a, b) => new Date(a.nextHearingDate).getTime() - new Date(b.nextHearingDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Active Cases</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{activeCases}</h3>
          <div className="flex items-center text-emerald-500 text-sm mt-2">
            <span>+2 this month</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Upcoming Hearings</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{upcomingHearings.length}</h3>
          <p className="text-slate-400 text-sm mt-2">Next 14 days</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Fees Collected</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">₹{(totalFeesPaid/1000).toFixed(1)}k</h3>
          <p className="text-slate-400 text-sm mt-2">Total across all matters</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Pending Dues</p>
          <h3 className="text-3xl font-bold text-rose-500 mt-2">₹{(totalDue/1000).toFixed(1)}k</h3>
          <p className="text-slate-400 text-sm mt-2">To be invoiced</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Hearings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-slate-800">Upcoming Hearings Schedule</h4>
            <button className="text-blue-600 text-sm font-medium hover:underline">View Calendar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Case Title</th>
                  <th className="px-6 py-4">Court / Room</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingHearings.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onViewCase(c.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{new Date(c.nextHearingDate).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">10:30 AM</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{c.title}</div>
                      <div className="text-xs text-slate-500">{c.caseNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{c.court}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-slate-400 hover:text-blue-600">
                        <ICONS.ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notifications / Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h4 className="font-bold text-slate-800 mb-6">Action Items</h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <ICONS.Alert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Remind Adv. Rajesh</p>
                <p className="text-xs text-amber-700 mt-1">Hearing tomorrow for Acme Corp. Verify replication filing.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <ICONS.Fees className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Pending Payment</p>
                <p className="text-xs text-blue-700 mt-1">Acme Corp has an outstanding balance of ₹25,000.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <ICONS.Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">New Document</p>
                <p className="text-xs text-slate-700 mt-1">Adv. Meera uploaded GST Tribunal Order copy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
