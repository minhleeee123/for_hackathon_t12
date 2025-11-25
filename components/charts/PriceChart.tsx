
import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

interface PriceChartProps {
  symbol: string; // e.g. "BTC", "SOL"
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
  const containerId = useRef(`tv-widget-${Math.random().toString(36).substring(7)}`);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to get formatted symbol (e.g. BINANCE:BTCUSDT)
  const getTVSymbol = (sym: string) => {
    // Basic mapping, can be expanded. Defaulting to Binance USDT pairs which are standard.
    return `BINANCE:${sym.toUpperCase()}USDT`;
  };

  const loadWidget = (containerId: string, isFull: boolean) => {
    if (document.getElementById(containerId) && window.TradingView) {
      new window.TradingView.widget({
        "autosize": true,
        "symbol": getTVSymbol(symbol),
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1", // Candle
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(19, 19, 20, 1)",
        "gridColor": "rgba(50, 50, 50, 0.5)",
        "hide_top_toolbar": !isFull,
        "hide_legend": !isFull,
        "save_image": false,
        "container_id": containerId,
        "toolbar_bg": "#1e1f20",
        "withdateranges": isFull,
        "hide_side_toolbar": !isFull,
        "allow_symbol_change": isFull,
      });
    }
  };

  // Effect for the small chart
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => loadWidget(containerId.current, false);
    document.head.appendChild(script);
    
    return () => {
        // Cleanup not strictly necessary for script, but good practice if needed
    };
  }, [symbol]);

  // Effect for the modal chart
  useEffect(() => {
    if (isModalOpen && window.TradingView) {
        // Wait a tick for the modal DOM to exist
        setTimeout(() => {
            loadWidget("tv-modal-container", true);
        }, 100);
    }
  }, [isModalOpen, symbol]);

  return (
    <>
        {/* Main Dashboard Widget */}
        <div className="w-full h-[250px] bg-gemini-surface rounded-xl p-1 border border-white/10 relative group overflow-hidden">
            <div id={containerId.current} className="w-full h-full rounded-lg" />
            
            {/* Overlay to intercept clicks */}
            <div 
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer z-10 flex items-center justify-center group"
                title="Click to open advanced chart"
            >
                <div className="bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 backdrop-blur-sm">
                    <Maximize2 className="w-5 h-5 text-white" />
                </div>
            </div>
            
            <h3 className="absolute top-2 left-3 text-xs font-bold text-gray-500 pointer-events-none z-20 opacity-50">
                TradingView
            </h3>
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-[#131314] w-full max-w-6xl h-[80vh] rounded-2xl border border-white/10 relative flex flex-col shadow-2xl">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1e1f20] rounded-t-2xl">
                        <div className="flex items-center gap-2">
                             <h2 className="text-white font-bold text-lg">{symbol} / USDT</h2>
                             <span className="text-gray-500 text-sm">Advanced Chart</span>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 w-full h-full bg-[#131314] p-1">
                        <div id="tv-modal-container" className="w-full h-full rounded-b-xl" />
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default PriceChart;
