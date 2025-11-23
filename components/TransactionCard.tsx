
import React, { useState } from 'react';
import { TransactionData } from '../types';
import { sendTransaction } from '../services/web3Service';
import { ArrowRight, Check, AlertCircle, Loader2, Wallet } from 'lucide-react';

interface Props {
  data: TransactionData;
}

const TransactionCard: React.FC<Props> = ({ data }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleConfirm = async () => {
    setStatus('sending');
    setErrorMessage('');
    
    try {
        const result = await sendTransaction(data.toAddress, data.amount.toString());
        if (result && result.hash) {
            setTxHash(result.hash);
            setStatus('success');
        } else {
            setStatus('error');
            setErrorMessage("Transaction rejected or failed.");
        }
    } catch (error: any) {
        console.error("Tx Error", error);
        setStatus('error');
        // Clean up error message for UI
        setErrorMessage(error.reason || error.message || "User rejected transaction");
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1e1f20] rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-blue-400" />
        </div>
        <div>
            <h3 className="font-bold text-white text-sm">Transaction Preview</h3>
            <p className="text-xs text-blue-300">{data.network}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        
        {/* Main Action Display */}
        <div className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-white/5">
            <div className="flex flex-col">
                <span className="text-gray-400 text-xs uppercase font-medium">Send / Swap</span>
                <span className="text-xl font-bold text-white">{data.amount} {data.token}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div className="flex flex-col text-right">
                <span className="text-gray-400 text-xs uppercase font-medium">To</span>
                <span className="text-sm font-mono text-blue-400 truncate w-24" title={data.toAddress}>
                    {data.toAddress.slice(0, 6)}...{data.toAddress.slice(-4)}
                </span>
            </div>
        </div>

        {/* Details List */}
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-white font-medium bg-white/5 px-2 py-0.5 rounded text-xs">{data.type}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Est. Gas Fee</span>
                <span className="text-gray-300">~{data.estimatedGas} ETH</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Summary</span>
                <span className="text-gray-300 text-right max-w-[200px] truncate">{data.summary}</span>
            </div>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start gap-2 text-green-400 text-xs break-all">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold block">Transaction Sent!</span>
                    Tx Hash: {txHash}
                </div>
            </div>
        )}

        {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold block">Failed</span>
                    {errorMessage}
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
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-95'
                }
                disabled:opacity-70 disabled:pointer-events-none
            `}
        >
            {status === 'sending' ? (
                <>
                   <Loader2 className="w-4 h-4 animate-spin" /> Confirming in Wallet...
                </>
            ) : status === 'success' ? (
                <>
                   <Check className="w-4 h-4" /> Transaction Submitted
                </>
            ) : (
                "Confirm Transaction"
            )}
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;
