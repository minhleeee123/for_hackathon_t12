
import React from 'react';
import { ArrowRight, Bot, BarChart3, Zap, Shield, Sparkles, PieChart, Layers } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-blue-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-3000" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CryptoInsight <span className="text-blue-400">AI</span></span>
        </div>
        <button 
            onClick={onStart}
            className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-gray-300 hover:text-white"
        >
            Launch App
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Bot className="w-3 h-3" />
            Powered by Gemini 2.5 Flash
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            Intelligent Analytics for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-300% animate-gradient">
                Decentralized Future
            </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Experience the next generation of crypto trading. Chat with AI to analyze charts, 
            detect market sentiment, check portfolio health, and execute Web3 transactions instantly.
        </p>

        {/* CTA Button */}
        <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-10 duration-1000 flex items-center gap-2"
        >
            Start Analyzing Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            
            {/* Button Glow */}
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
        </button>

        {/* Floating UI Mockup (Optional Visual) */}
        <div className="mt-20 relative w-full max-w-5xl aspect-[16/9] bg-[#131314] rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-300 group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
            {/* Abstract UI Representation */}
            <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                 <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-gray-300 text-sm">
                    "Analyze BTC support levels and draft a swap to USDT"
                 </span>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                 </div>
            </div>
        </div>

      </main>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 bg-[#050505]/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
                icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
                title="Market Intelligence"
                desc="Real-time price action, tokenomics, and sentiment analysis powered by live data sources."
            />
            <FeatureCard 
                icon={<Bot className="w-6 h-6 text-purple-400" />}
                title="Vision Agent"
                desc="Upload or capture chart screenshots. The AI identifies patterns and support/resistance lines."
            />
             <FeatureCard 
                icon={<Zap className="w-6 h-6 text-orange-400" />}
                title="Web3 Actions"
                desc="Draft transactions via chat. Send tokens and swap assets on EVM chains seamlessly."
            />
             <FeatureCard 
                icon={<Shield className="w-6 h-6 text-green-400" />}
                title="Portfolio Health"
                desc="Connect your wallet for instant risk assessment and rebalancing suggestions."
            />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2024 CryptoInsight AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="p-6 rounded-2xl bg-[#131314] border border-white/5 hover:border-blue-500/30 hover:bg-[#1a1b1e] transition-all group">
        <div className="w-12 h-12 rounded-lg bg-[#1e1f20] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
            {desc}
        </p>
    </div>
);

export default LandingPage;
