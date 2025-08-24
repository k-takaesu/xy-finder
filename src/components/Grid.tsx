'use client';

import { useState, useEffect } from 'react';

interface GridProps {
  onCellClick: (x: number, y: number) => void;
  onGameWon: () => void;
  attempts: number;
  bestScore: number;
  isGameWon: boolean;
  onRestart: () => void;
}

export default function Grid({ onCellClick, onGameWon, attempts, bestScore, isGameWon, onRestart }: GridProps) {
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const [clickedCells, setClickedCells] = useState<Set<string>>(new Set());
  const [lastHint, setLastHint] = useState<string>('');
  const [correctCell, setCorrectCell] = useState<string | null>(null);

  // ゲーム開始時にランダムなターゲット座標を生成（初回のみ）
  useEffect(() => {
    if (targetX === 0 && targetY === 0) {
      const newTargetX = Math.floor(Math.random() * 10) + 1;
      const newTargetY = Math.floor(Math.random() * 10) + 1;
      setTargetX(newTargetX);
      setTargetY(newTargetY);
    }
  }, []);

  // Restart時にリセット
  useEffect(() => {
    if (!isGameWon) {
      setClickedCells(new Set());
      setLastHint('');
      setCorrectCell(null);
    }
  }, [isGameWon]);

  const handleCellClick = (x: number, y: number) => {
    if (isGameWon) return;
    
    const cellKey = `${x},${y}`;
    if (clickedCells.has(cellKey)) return;
    
    setClickedCells(prev => new Set([...prev, cellKey]));
    
    // マンハッタン距離を計算
    const distance = Math.abs(x - targetX) + Math.abs(y - targetY);
    
    let hint = '';
    if (distance === 0) {
      hint = '🎉 正解！';
      setCorrectCell(cellKey); // 正解セルを記録
      onGameWon();
    } else if (distance <= 2) {
      hint = '🔥 激ちか！';
    } else if (distance <= 4) {
      hint = '📏 ちかい';
    } else if (distance <= 6) {
      hint = '📐 ふつう';
    } else {
      hint = '🌌 とおい';
    }
    
    setLastHint(hint);
    onCellClick(x, y);
  };

  const getCellColor = (x: number, y: number) => {
    const cellKey = `${x},${y}`;
    if (!clickedCells.has(cellKey)) {
      return 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600';
    }
    
    // 正解セルかどうかを記録された値で判定
    if (correctCell === cellKey) {
      return 'bg-green-500 text-white';
    }
    
    // その他のセルは距離で判定
    const distance = Math.abs(x - targetX) + Math.abs(y - targetY);
    if (distance <= 2) {
      return 'bg-red-400 text-white';
    } else if (distance <= 4) {
      return 'bg-orange-400 text-white';
    } else if (distance <= 6) {
      return 'bg-yellow-400 text-black';
    } else {
      return 'bg-blue-400 text-white';
    }
  };

  const getCellContent = (x: number, y: number) => {
    const cellKey = `${x},${y}`;
    if (!clickedCells.has(cellKey)) {
      return { text: '', icon: null };
    }
    
    // 正解セルかどうかを記録された値で判定
    if (correctCell === cellKey) {
      return { text: '', icon: '⭐' }; // 正解アイコン
    } else {
      return { text: `${x},${y}`, icon: null };
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🎯 座標あてゲーム</h1>
        <div className="flex gap-4 justify-center items-center mb-4">
          <div className="text-lg">
            試行回数: <span className="font-bold text-blue-600">{attempts}</span>
          </div>
          <div className="text-lg">
            ベストスコア: <span className="font-bold text-green-600">{bestScore}</span>
          </div>
        </div>
        {lastHint && (
          <div className="text-xl font-bold mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {lastHint}
          </div>
        )}
      </div>

      <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
        {Array.from({ length: 10 }, (_, y) => 
          Array.from({ length: 10 }, (_, x) => {
            const cellX = x + 1;
            const cellY = y + 1;
            const cellKey = `${cellX},${cellY}`;
            const isClicked = clickedCells.has(cellKey);
            const cellContent = getCellContent(cellX, cellY);
            
            return (
              <button
                key={`${cellX}-${cellY}`}
                onClick={() => handleCellClick(cellX, cellY)}
                disabled={isClicked || isGameWon}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14
                  border border-gray-300 dark:border-gray-600
                  rounded-lg font-bold text-sm
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${getCellColor(cellX, cellY)}
                  ${isClicked ? 'cursor-default' : 'cursor-pointer'}
                `}
                aria-label={`座標 (${cellX}, ${cellY}) をクリック`}
                aria-pressed={isClicked}
              >
                {cellContent.icon && <div className="text-lg">{cellContent.icon}</div>}
                {cellContent.text && !cellContent.icon && <div>{cellContent.text}</div>}
              </button>
            );
          })
        )}
      </div>

      {isGameWon && (
        <div className="text-center mt-6">
          <div className="text-2xl font-bold text-green-600 mb-4">
            🎉 おめでとう！
          </div>
          <button
            onClick={onRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            aria-label="新しいゲームを開始"
          >
            🔄 Restart
          </button>
        </div>
      )}
    </div>
  );
}
