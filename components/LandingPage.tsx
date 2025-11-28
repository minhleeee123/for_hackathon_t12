
import React, { useState } from 'react';
import { ArrowRight, Bot, BarChart3, Zap, Shield, Sparkles, PieChart, Layers, CheckCircle2, ChevronDown, ChevronUp, Terminal, Cpu, Globe, Wallet, Activity, ScanLine, Maximize, Search } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-blue-500/30 relative">
      
      {/* 1. FIXED Background Gradients (Top of viewport) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-3000" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* 2. SCROLLING Background Ambience (Bridges the gaps down the page) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Bridge: How It Works -> Deep Dive */}
         <div className="absolute top-[1000px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-900/5 rounded-full blur-[100px]" />
         
         {/* Bridge: Deep Dive internal */}
         <div className="absolute top-[1800px] right-[-20%] w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[100px]" />
         <div className="absolute top-[2600px] left-[-20%] w-[800px] h-[800px] bg-green-900/5 rounded-full blur-[100px]" />

         {/* Bridge: Deep Dive -> Grid Features */}
         <div className="absolute top-[3500px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-cyan-900/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        
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

      </main>

      {/* Workflow Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to master the market with AI assistance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />

                <WorkflowStep 
                    step="01" 
                    title="Connect & Ask" 
                    desc="Link your wallet or simply ask natural language questions about any token."
                    icon={<Terminal className="w-6 h-6 text-blue-400" />} 
                />
                <WorkflowStep 
                    step="02" 
                    title="AI Analysis" 
                    desc="Gemini processes real-time data, news, and chart patterns to generate insights."
                    icon={<Cpu className="w-6 h-6 text-purple-400" />} 
                />
                <WorkflowStep 
                    step="03" 
                    title="Execute" 
                    desc="Review the strategy and execute swaps or trades directly from the chat interface."
                    icon={<Zap className="w-6 h-6 text-orange-400" />} 
                />
            </div>
        </div>
      </section>

      {/* Deep Dive Features - Split Layouts with Connector Line */}
      <section className="py-24 relative z-10">
        
        {/* Vertical Connecting Line (Timeline Style) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/10 to-transparent hidden md:block" />

        <div className="max-w-7xl mx-auto px-6 space-y-32">
            
            {/* Feature 1: Vision - REALISTIC CHART */}
            <div className="flex flex-col md:flex-row items-center gap-12 relative">
                <div className="flex-1 space-y-6 md:text-right md:pr-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase md:ml-auto">
                        Multimodal AI
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">See the Market like a Pro</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Don't just look at numbers. Upload screenshots of charts, and our Vision Agent will identify support/resistance lines, candlestick patterns, and potential breakout zones automatically.
                    </p>
                    <ul className="space-y-3 pt-4 flex flex-col md:items-end">
                        <CheckItem text="Pattern Recognition (Head & Shoulders, Flags)" />
                        <CheckItem text="Auto-Support/Resistance Levels" />
                        <CheckItem text="Actionable Trading Setups" />
                    </ul>
                </div>
                
                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-purple-500 z-20 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />

                <div className="flex-1 w-full relative group md:pl-12">
                    <div className="absolute inset-0 bg-purple-600/20 blur-[80px] rounded-full group-hover:bg-purple-600/30 transition-all duration-700" />
                    <div className="relative bg-[#131314] rounded-2xl border border-white/10 p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="aspect-[4/3] bg-[#0d0e10] rounded-lg overflow-hidden relative flex flex-col border border-white/5">
                            
                            {/* Pro Grid Background */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                            {/* Chart Header */}
                            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#0d0e10]/80 backdrop-blur-sm z-10 relative">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <div className="flex flex-col">
                                         <span className="text-xs font-bold text-gray-200">BTC/USDT</span>
                                         <span className="text-[9px] text-gray-500 font-mono">BINANCE</span>
                                    </div>
                                    <div className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400">1H</div>
                                </div>
                                <div className="flex gap-3">
                                    <ScanLine className="w-3.5 h-3.5 text-purple-400" />
                                    <Maximize className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="flex-1 relative w-full h-full overflow-hidden px-4 pt-4 pb-12">
                                
                                {/* SVG Moving Averages */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" preserveAspectRatio="none">
                                    {/* MA 50 (Blue) */}
                                    <path d="M0 250 C 50 240, 100 220, 150 200 C 200 180, 250 160, 300 170 C 350 180, 400 200, 450 150 C 500 100, 550 50, 600 40" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                    {/* MA 20 (Yellow) */}
                                    <path d="M0 220 C 60 200, 120 180, 180 150 C 240 120, 300 140, 360 120 C 420 100, 480 80, 600 20" stroke="#eab308" strokeWidth="2" fill="none" />
                                </svg>

                                {/* Realistic Candles Container */}
                                <div className="flex items-end justify-between h-full w-full relative z-10 px-2">
                                    
                                    {/* Series of Candles */}
                                    {/* C1: Green */}
                                    <div className="flex flex-col items-center w-3 h-[40%] mb-12">
                                        <div className="w-[1px] h-full bg-green-500/50"></div>
                                        <div className="w-full h-[60%] bg-green-500 absolute bottom-[20%] rounded-[1px]"></div>
                                    </div>
                                    
                                    {/* C2: Red */}
                                    <div className="flex flex-col items-center w-3 h-[35%] mb-16">
                                        <div className="w-[1px] h-full bg-red-500/50"></div>
                                        <div className="w-full h-[40%] bg-red-500 absolute bottom-[30%] rounded-[1px]"></div>
                                    </div>

                                    {/* C3: Green */}
                                    <div className="flex flex-col items-center w-3 h-[50%] mb-10">
                                        <div className="w-[1px] h-full bg-green-500/50"></div>
                                        <div className="w-full h-[70%] bg-green-500 absolute bottom-[15%] rounded-[1px]"></div>
                                    </div>

                                    {/* C4: Green Big */}
                                    <div className="flex flex-col items-center w-3 h-[60%] mb-14">
                                        <div className="w-[1px] h-full bg-green-500/50"></div>
                                        <div className="w-full h-[80%] bg-green-500 absolute bottom-[10%] rounded-[1px]"></div>
                                    </div>

                                    {/* C5: Red Dip */}
                                    <div className="flex flex-col items-center w-3 h-[30%] mb-24">
                                        <div className="w-[1px] h-full bg-red-500/50"></div>
                                        <div className="w-full h-[50%] bg-red-500 absolute bottom-[25%] rounded-[1px]"></div>
                                    </div>

                                     {/* C6: Green Recovery */}
                                    <div className="flex flex-col items-center w-3 h-[45%] mb-20">
                                        <div className="w-[1px] h-full bg-green-500/50"></div>
                                        <div className="w-full h-[60%] bg-green-500 absolute bottom-[20%] rounded-[1px]"></div>
                                    </div>

                                    {/* C7: The Flag Pole (Huge Green) */}
                                    <div className="flex flex-col items-center w-3 h-[75%] mb-8 relative group">
                                         <div className="absolute -top-4 text-[9px] text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">Vol</div>
                                        <div className="w-[1px] h-full bg-green-500/50"></div>
                                        <div className="w-full h-[85%] bg-green-500 absolute bottom-[5%] rounded-[1px] shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                                    </div>

                                    {/* C8: Consolidation (Red) */}
                                    <div className="flex flex-col items-center w-3 h-[20%] mb-[160px]">
                                        <div className="w-[1px] h-full bg-red-500/50"></div>
                                        <div className="w-full h-[60%] bg-red-500 absolute bottom-[20%] rounded-[1px]"></div>
                                    </div>

                                    {/* C9: Consolidation (Red) */}
                                    <div className="flex flex-col items-center w-3 h-[18%] mb-[155px]">
                                        <div className="w-[1px] h-full bg-red-500/50"></div>
                                        <div className="w-full h-[50%] bg-red-500 absolute bottom-[25%] rounded-[1px]"></div>
                                    </div>

                                     {/* C10: The Breakout (Green) */}
                                    <div className="flex flex-col items-center w-3 h-[50%] mb-[140px] relative">
                                        <div className="w-[1px] h-full bg-green-500/50"></div>
                                        <div className="w-full h-[80%] bg-green-500 absolute bottom-[10%] rounded-[1px] shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                        {/* Target Bubble */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                                            TP: $69k
                                        </div>
                                    </div>
                                </div>

                                {/* AI Overlay Lines */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Resistance Trend Line */}
                                    <div className="absolute top-[25%] right-[10%] w-[25%] h-[1px] bg-purple-500 border-t border-dashed border-purple-400 rotate-[5deg] origin-left shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                                    <span className="absolute top-[21%] right-[12%] text-[9px] text-purple-300 font-mono bg-[#0d0e10] px-1">Resistance</span>

                                    {/* Support Trend Line */}
                                    <div className="absolute top-[35%] right-[10%] w-[25%] h-[1px] bg-purple-500 border-t border-dashed border-purple-400 rotate-[5deg] origin-left shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                                    <span className="absolute top-[40%] right-[25%] text-[9px] text-purple-300 font-mono bg-[#0d0e10] px-1">Support</span>
                                </div>
                            </div>
                            
                            {/* Scanning Overlay */}
                             <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-purple-500/10 to-transparent h-[10%] w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none border-b border-purple-500/30"></div>

                            {/* Bottom Analysis Panel */}
                            <div className="absolute bottom-4 left-4 right-4 bg-[#131314]/95 backdrop-blur-md border border-purple-500/30 p-2.5 rounded-lg flex items-center gap-3 shadow-2xl z-20">
                                <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-xs font-bold text-white truncate">Bull Flag Breakout</span>
                                        <span className="text-[10px] text-green-400 font-mono bg-green-900/30 px-1 rounded ml-2">85%</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 truncate">Entry: $67,200 • Stop: $66,800</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Feature 2: Web3 Transaction */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 relative">
                <div className="flex-1 space-y-6 md:pl-12">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase">
                        Web3 Native
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">Chat-to-Chain Execution</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Why leave the interface? Draft transactions using natural language. "Swap 1 ETH to USDT" is all it takes to generate a transaction payload ready for your signature.
                    </p>
                     <ul className="space-y-3 pt-4">
                        <CheckItem text="Natural Language Intent Parsing" />
                        <CheckItem text="Gas Estimation & Simulation" />
                        <CheckItem text="Supports Ethereum, BSC, Polygon" />
                    </ul>
                </div>

                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-orange-500 z-20 shadow-[0_0_20px_rgba(249,115,22,0.5)]" />

                <div className="flex-1 w-full relative group md:text-right md:pr-12">
                     <div className="absolute inset-0 bg-orange-600/20 blur-[80px] rounded-full group-hover:bg-orange-600/30 transition-all duration-700" />
                    <div className="relative bg-[#131314] rounded-2xl border border-white/10 p-6 shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500 max-w-md mx-auto md:mr-0">
                        {/* Abstract Transaction Card */}
                        <div className="space-y-4 text-left">
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>Swap</span>
                                <span className="text-white font-bold">Ethereum Mainnet</span>
                            </div>
                            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-white/5 flex justify-between items-center">
                                <span className="text-2xl font-bold">1.0</span>
                                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">ETH</span>
                            </div>
                             <div className="flex justify-center">
                                <ArrowRight className="w-5 h-5 text-gray-500 rotate-90" />
                            </div>
                             <div className="p-4 bg-[#0a0a0a] rounded-lg border border-white/5 flex justify-between items-center">
                                <span className="text-2xl font-bold text-gray-500">3,240.50</span>
                                <span className="bg-green-600 px-2 py-1 rounded text-xs font-bold">USDT</span>
                            </div>
                            <div className="w-full py-3 bg-blue-600 rounded-lg text-center font-bold text-sm">
                                Confirm Transaction
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature 3: Portfolio Guard */}
            <div className="flex flex-col md:flex-row items-center gap-12 relative">
                <div className="flex-1 space-y-6 md:text-right md:pr-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase md:ml-auto">
                        Portfolio Guard
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">Smart Portfolio Tracking</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Connect your wallet for instant analysis. The agent evaluates your diversification, checks for risky assets, and suggests rebalancing strategies to protect your gains.
                    </p>
                    <ul className="space-y-3 pt-4 flex flex-col md:items-end">
                        <CheckItem text="Real-time PNL Tracking" />
                        <CheckItem text="Risk Exposure Assessment" />
                        <CheckItem text="Multi-Chain Wallet Support" />
                    </ul>
                </div>

                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-green-500 z-20 shadow-[0_0_20px_rgba(34,197,94,0.5)]" />

                <div className="flex-1 w-full relative group md:pl-12">
                    <div className="absolute inset-0 bg-green-600/20 blur-[80px] rounded-full group-hover:bg-green-600/30 transition-all duration-700" />
                    <div className="relative bg-[#131314] rounded-2xl border border-white/10 p-6 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto md:ml-0">
                        {/* Abstract Wallet Card */}
                        <div className="space-y-6 text-left">
                             <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Total Balance</div>
                                    <div className="text-xl font-bold text-white">$42,593.00</div>
                                </div>
                             </div>
                             <div className="space-y-4">
                                {/* Asset 1 */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">Bitcoin</span>
                                        <span className="text-white font-medium">$28,000</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[65%] bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                {/* Asset 2 */}
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">Ethereum</span>
                                        <span className="text-white font-medium">$12,400</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[30%] bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature 4: Deep Analysis */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 relative">
                <div className="flex-1 space-y-6 md:pl-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase">
                        Deep Data
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">Institutional-Grade Analysis</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Go deeper than just price. Our agents aggregate sentiment scores, Long/Short ratios, and on-chain metrics to generate comprehensive reports for any coin.
                    </p>
                    <ul className="space-y-3 pt-4">
                        <CheckItem text="Fear & Greed Index Integration" />
                        <CheckItem text="Exchange Long/Short Ratios" />
                        <CheckItem text="Project Scoring Radar" />
                    </ul>
                </div>

                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-cyan-500 z-20 shadow-[0_0_20px_rgba(6,182,212,0.5)]" />

                <div className="flex-1 w-full relative group md:text-right md:pr-12">
                    <div className="absolute inset-0 bg-cyan-600/20 blur-[80px] rounded-full group-hover:bg-cyan-600/30 transition-all duration-700" />
                    <div className="relative bg-[#131314] rounded-2xl border border-white/10 p-4 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto md:mr-0">
                        {/* Abstract Dashboard */}
                        <div className="grid grid-cols-2 gap-4 text-left">
                             {/* Sentiment Widget */}
                             <div className="col-span-1 bg-[#0a0a0a] rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center gap-2">
                                <span className="text-[10px] text-gray-500 uppercase">Sentiment</span>
                                <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-cyan-400 border-r-cyan-400 rotate-45 flex items-center justify-center">
                                    <span className="text-lg font-bold text-white -rotate-45">72</span>
                                </div>
                                <span className="text-xs text-cyan-400">Greed</span>
                             </div>
                             {/* L/S Widget */}
                             <div className="col-span-1 bg-[#0a0a0a] rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                                <span className="text-[10px] text-gray-500 uppercase mb-2">Long/Short</span>
                                <div className="flex items-end gap-1 h-12">
                                    <div className="w-2 bg-green-500 h-[80%] rounded-t-sm"></div>
                                    <div className="w-2 bg-red-500 h-[40%] rounded-t-sm"></div>
                                    <div className="w-2 bg-green-500 h-[60%] rounded-t-sm"></div>
                                    <div className="w-2 bg-red-500 h-[30%] rounded-t-sm"></div>
                                    <div className="w-2 bg-green-500 h-[90%] rounded-t-sm"></div>
                                </div>
                             </div>
                             {/* Wide Widget */}
                             <div className="col-span-2 bg-[#0a0a0a] rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <Activity className="w-5 h-5 text-cyan-400" />
                                     <div>
                                         <div className="text-xs text-gray-400">Project Score</div>
                                         <div className="text-sm font-bold text-white">A+ (92/100)</div>
                                     </div>
                                 </div>
                                 <div className="h-8 w-24 bg-gradient-to-r from-cyan-900/20 to-cyan-500/20 rounded-md border border-cyan-500/30 flex items-center justify-center">
                                     <span className="text-xs text-cyan-400 font-bold">Strong Buy</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* Grid Features */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
        </div>
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

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-24 relative z-10">
         <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
         <div className="space-y-4">
            <FAQItem 
                q="Is my private key safe?" 
                a="Absolutely. We never ask for your private key. All transactions are constructed by the AI but must be signed by your own wallet (MetaMask)." 
            />
            <FAQItem 
                q="Which chains do you support?" 
                a="Currently we support Ethereum Mainnet, Binance Smart Chain, Polygon, and Sepolia Testnet for transactions. Analysis covers all coins on CoinGecko." 
            />
            <FAQItem 
                q="Is the AI analysis financial advice?" 
                a="No. CryptoInsight AI provides data-driven insights and technical analysis patterns, but all trading decisions are your own responsibility." 
            />
         </div>
      </section>

      {/* Bottom CTA - Gradient Background for Seamless Footer Transition */}
      <section className="py-32 relative overflow-hidden z-10">
         {/* Gradient Background */}
         <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent pointer-events-none" />
         
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to upgrade your trading?</h2>
            <p className="text-xl text-gray-400 mb-10">Join thousands of traders using AI to navigate the market.</p>
            <button 
                onClick={onStart}
                className="px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl"
            >
                Get Started for Free
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative border-t border-white/5 z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-gray-300">CryptoInsight AI</span>
            </div>
            <div className="text-gray-500 text-sm">
                &copy; 2024 CryptoInsight AI. Powered by Google Gemini.
            </div>
            <div className="flex gap-6 text-gray-500">
                <Globe className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Terminal className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-Components ---

const WorkflowStep = ({ step, title, desc, icon }: { step: string, title: string, desc: string, icon: React.ReactNode }) => (
    <div className="relative z-10 flex flex-col items-center text-center group">
        <div className="w-16 h-16 rounded-2xl bg-[#131314] border border-white/10 flex items-center justify-center mb-6 group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] transition-all duration-300">
            {icon}
        </div>
        <div className="text-xs font-bold text-blue-500 mb-2">STEP {step}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{desc}</p>
    </div>
);

const CheckItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
        <span className="text-gray-300">{text}</span>
    </div>
);

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

const FAQItem = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-xl bg-[#131314] overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-medium text-white">{q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 bg-[#0a0a0a]">
                    {a}
                </div>
            )}
        </div>
    );
};

export default LandingPage;
