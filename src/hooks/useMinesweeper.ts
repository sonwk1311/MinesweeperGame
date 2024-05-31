//hooks/useMinesweeper.ts
import { useState, useEffect } from 'react';
import { createBoard, Board as BoardType, countFlaggedCells } from '../utils/minesweeper';

export const useMinesweeper = (rows: number, cols: number, mines: number) => {
  const [board, setBoard] = useState<BoardType>(createBoard(rows, cols, mines));
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mode, setMode] = useState<'flag' | 'reveal'>('reveal');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [minesRemaining, setMinesRemaining] = useState<number>(mines);

  useEffect(() => {
    if (startTime !== null && !gameOver && !gameWon) {
      const intervalId = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime, gameOver, gameWon]);

  const checkWinCondition = (board: BoardType) => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        if (!board[row][col].isMine && !board[row][col].isOpen) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellPress = (row: number, col: number) => {
    if (gameOver || gameWon) return;
    if (!startTime) {
      setStartTime(Date.now());
      let newBoard = [...board];
      while (newBoard[row][col].isMine) {
        newBoard = createBoard(rows, cols, mines);
      }
      setBoard(newBoard);
    }

    const newBoard = [...board];
    const cell = newBoard[row][col];
    if (mode === 'flag') {
      cell.isFlagged = !cell.isFlagged;
      setMinesRemaining(mines - countFlaggedCells(board));
    } else {
      if (cell.isFlagged) return;
      if (cell.isMine) {
        setGameOver(true);
        revealMines(newBoard);
      } else {
        openCell(newBoard, row, col);
        if (checkWinCondition(newBoard)) {
          setGameWon(true);
        }
      }
    }
    setBoard(newBoard);
  };

  const openCell = (board: BoardType, row: number, col: number) => {
    const cell = board[row][col];
    if (cell.isOpen) return;
    cell.isOpen = true;
    if (cell.adjacentMines === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
      ];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
          openCell(board, newRow, newCol);
        }
      }
    }
  };

  const revealMines = (board: BoardType) => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        if (board[row][col].isMine) {
          board[row][col].isOpen = true;
        }
      }
    }
  };

  const resetGame = () => {
    setBoard(createBoard(rows, cols, mines));
    setGameOver(false);
    setGameWon(false);
    setStartTime(null);
    setTimeElapsed(0);
    setMinesRemaining(mines);
  };

  return {
    board,
    gameOver,
    gameWon,
    mode,
    timeElapsed,
    minesRemaining,
    handleCellPress,
    resetGame,
    setMode,
  };
};
