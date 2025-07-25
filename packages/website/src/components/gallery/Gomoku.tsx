import React, { useState } from 'react';

const Gomoku = () => {
  const [board, setBoard] = useState(Array(15).fill(null).map(() => Array(15).fill(null)));
  const [isBlack, setIsBlack] = useState(true);

  const handleClick = (x: number, y: number) => {
    if (board[x][y]) return; // 已有棋子，不可落子
    const newBoard = board.map(row => [...row]);
    newBoard[x][y] = isBlack ? '⚫' : '⚪';
    setBoard(newBoard);
    setIsBlack(!isBlack);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>{isBlack ? '黑方回合' : '白方回合'}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 30px)' }}>
        {board.map((row, x) => (
          row.map((cell, y) => (
            <div 
              key={`${x}-${y}`}
              onClick={() => handleClick(x, y)}
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid #999',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0d9b5'
              }}
            >
              {cell}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

export default Gomoku;