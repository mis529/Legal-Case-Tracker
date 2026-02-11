
import React from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">L</div>
            <span className="text-xl font-black tracking-tight">Legal Case Tracker</span>
          </div>
          <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">Solution</a>
            <button onClick={onLaunch} className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              Launch Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 animate-bounce">
            Smart Litigation Management
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Control your legal matters <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">with precision.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The all-in-one platform for tracking case statuses, advocate fees, court dates, and strategic insights—designed for the modern legal professional.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={onLaunch}
              className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all text-lg"
            >
              Get Started for Free
            </button>
            <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 font-black rounded-2xl hover:bg-slate-50 transition-all text-lg">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="px-6 mb-32">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] p-4 shadow-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
            alt="Legal Management Interface" 
            className="rounded-[2.5rem] w-full object-cover opacity-90 group-hover:scale-[1.01] transition-transform duration-700"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6">Built for Serious Litigation</h2>
            <p className="text-slate-500 font-medium">Streamline every aspect of your case lifecycle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Case Tracking', desc: 'Real-time monitoring of recovery suits, check bounce cases, and departmental appeals.', icon: '⚖️' },
              { title: 'Financial Accountant', desc: 'Detailed fee management for advocates with monthly logs and balance tracking.', icon: '💰' },
              { title: 'Smart Reminders', desc: 'Automated alerts for next hearing dates and procedural deadlines.', icon: '⏰' },
              { title: 'Advocate Portal', desc: 'Direct collaboration where counsels can leave strategy notes and status updates.', icon: '👔' },
              { title: 'Procedural Clarity', desc: 'Define next course of action for every matter to ensure no case stays stagnant.', icon: '🛤️' },
              { title: 'AI Insights', desc: 'Powered by Gemini to suggest logical legal strategies based on case data.', icon: '✨' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group hover:-translate-y-2">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="text-xl font-black mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to modernize your legal practice?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Join hundreds of firms using Legal Case Tracker to stay ahead of their litigation schedule.</p>
          <button 
            onClick={onLaunch}
            className="px-12 py-6 bg-white text-slate-900 font-black rounded-3xl shadow-2xl hover:bg-blue-50 transition-all text-xl"
          >
            Launch Legal Case Tracker
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>
            <span className="font-bold">Legal Case Tracker</span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            © 2024 Legal Case Tracker. All rights reserved.
          </div>
          <div className="flex space-x-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
