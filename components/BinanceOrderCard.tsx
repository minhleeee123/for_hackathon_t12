import React, { useState } from 'react';
import { BinanceOrder } from '../types';
import { executeBinanceOrder } from '../services/binanceService';
import { ArrowRight, Check, AlertCircle, Loader2, Gauge } from 'lucide-react';

interface Props {
  order: BinanceOrder;
}

const BinanceOrderCard: React.FC<Props> = ({ order }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [resultMsg, setResultMsg] = useState<string>('');

  const handleConfirm = async () => {
    setStatus('sending');
    setResultMsg('');
    
    const result = await executeBinanceOrder(order);
    if (result.success) {
        setStatus('success');
        setResultMsg(result.msg);
    } else {
        setStatus('error');
        setResultMsg(result.msg);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1e1f20] rounded-xl border border-yellow-500/20 overflow-hidden shadow-2xl mt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 p-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-yellow-400" />
        </div>
        <div>
            <h3 className="font-bold text-white text-sm">Binance Agent</h3>
            <p className="text-xs text-yellow-300">Testnet • {order.market}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        
        {/* Main Action Display */}
        <div className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-white/5">
            <div className="flex flex-col">
                <span className={`text-xs uppercase font-medium ${order.side === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {order.side === 'BUY' ? 'Long / Buy' : 'Short / Sell'}
                </span>
                <span className="text-xl font-bold text-white">{order.quantity} {order.symbol.replace('USDT', '')}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div className="flex flex-col text-right">
                <span className="text-gray-400 text-xs uppercase font-medium">Leverage</span>
                <span className="text-sm font-mono text-yellow-400">
                    {order.market === 'FUTURES' ? `${order.leverage}x` : '1x'}
                </span>
            </div>
        </div>

        {/* Details List */}
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-400">Pair</span>
                <span className="text-white font-medium">{order.symbol}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-gray-300">{order.type}</span>
            </div>
            {order.type === 'LIMIT' && (
                <div className="flex justify-between">
                    <span className="text-gray-400">Limit Price</span>
                    <span className="text-gray-300">${order.price}</span>
                </div>
            )}
            <div className="flex justify-between">
                <span className="text-gray-400">Strategy</span>
                <span className="text-gray-300 text-right max-w-[200px] truncate">{order.summary}</span>
            </div>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2 text-green-400 text-xs">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold block">Order Executed!</span>
                    {resultMsg}
                </div>
            </div>
        )}

        {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold block">Binance API Error</span>
                    {resultMsg}
                </div>
            </div>
        )}

        {/* Action Button */}
        <button
            onClick={handleConfirm}
            disabled={status === 'sending' || status === 'success'}
            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                ${status === 'success' 
                    ? 'bg-green-600/20 text-green-400 cursor-default' 
                    : 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-900/20 active:scale-95'
                }
                disabled:opacity-70 disabled:pointer-events-none
            `}
        >
            {status === 'sending' ? (
                <>
                   <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                </>
            ) : status === 'success' ? (
                <>
                   <Check className="w-4 h-4" /> Success
                </>
            ) : (
                "Place Order on Testnet"
            )}
        </button>
      </div>
    </div>
  );
};

export default BinanceOrderCard;