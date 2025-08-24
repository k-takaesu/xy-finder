'use client';

import { useState, useEffect } from 'react';
import Grid from '../components/Grid';

export default function Home() {
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isGameWon, setIsGameWon] = useState(false);

  // localStorageからベストスコアを読み込み
  useEffect(() => {
    const savedBestScore = localStorage.getItem('xy-finder-best-score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);

  const handleCellClick = (x: number, y: number) => {
    if (isGameWon) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    // 正解判定（Gridコンポーネント内で判定されるため、ここでは試行回数のみ管理）
  };

  const handleGameWon = () => {
    setIsGameWon(true);
    
    // ベストスコアの更新
    if (bestScore === null || attempts < bestScore) {
      const newBestScore = attempts;
      setBestScore(newBestScore);
      localStorage.setItem('xy-finder-best-score', newBestScore.toString());
    }
  };

  const handleRestart = () => {
    setAttempts(0);
    setIsGameWon(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Grid
          onCellClick={handleCellClick}
          onGameWon={handleGameWon}
          attempts={attempts}
          bestScore={bestScore || 0}
          isGameWon={isGameWon}
          onRestart={handleRestart}
        />
        
        {/* ゲーム説明 */}
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <h2 className="text-xl font-bold mb-4">🎮 遊び方</h2>
          <div className="max-w-md mx-auto space-y-2 text-sm">
            <p>• 10×10のグリッドから隠された座標を見つけよう！</p>
            <p>• マスをクリックすると距離に応じたヒントが表示されます</p>
            <p>• 試行回数を少なくしてクリアを目指そう！</p>
          </div>
        </div>
      </div>
    </div>
  );
}
