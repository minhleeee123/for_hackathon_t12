
import React from 'react';
import { CryptoData } from '../types';
import PriceChart from './charts/PriceChart';
import TokenomicsChart from './charts/TokenomicsChart';
import SentimentChart from './charts/SentimentChart';
import LongShortChart from './charts/LongShortChart';
import ProjectScoreChart from './charts/ProjectScoreChart';
import { Sparkles } from 'lucide-react';

interface Props {
  data: CryptoData;
}

const CryptoDashboard: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full mt-4 space-y-6 animate-fade-in">
      
      {/* Header Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">{data.coinName} Analysis</h2>
          <span className="ml-auto text-xl font-bold text-white">${data.currentPrice.toLocaleString()}</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Top Row: Price & Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Replaced AreaChart with TradingView Widget, passing Symbol */}
          <PriceChart symbol={data.symbol || "BTC"} />
        </div>
        <div className="md:col-span-1">
          <SentimentChart score={data.sentimentScore} />
        </div>
      </div>

      {/* Middle Row: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TokenomicsChart data={data.tokenomics} />
        <ProjectScoreChart data={data.projectScores} />
        <LongShortChart data={data.longShortRatio} />
      </div>
    </div>
  );
};

export default CryptoDashboard;
