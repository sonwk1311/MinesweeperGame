import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import Board from '../components/Board';
import { createBoard, Board as BoardType, countFlaggedCells } from '../utils/minesweeper';

const GameScreen: React.FC = () => {
  const [board, setBoard] = useState<BoardType>(createBoard(10, 10, 10));
  const [gameOver, setGameOver] = useState(false);
  const [mode, setMode] = useState<'flag' | 'reveal'>('flag');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [minesRemaining, setMinesRemaining] = useState<number>(10);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (startTime !== null && !gameOver) {
      const intervalId = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startTime, gameOver]);

  useEffect(() => {
    if (gameOver) {
      setModalVisible(true);
    }
  }, [gameOver]);

  const handleCellPress = (row: number, col: number) => {
    if (gameOver) return;

    if (!startTime) {
      setStartTime(Date.now());
      const newBoard = [...board];
      while (newBoard[row][col].isMine) {
        setBoard(createBoard(10, 10, 10));
      }
    }

    const newBoard = [...board];
    const cell = newBoard[row][col];

    if (mode === 'flag') {
      cell.isFlagged = !cell.isFlagged;
      setMinesRemaining(10 - countFlaggedCells(board));
    } else {
      if (cell.isFlagged) {
        return; // Không làm gì nếu ô đã được đánh dấu cờ và đang ở chế độ mở ô
      }
      if (cell.isMine) {
        setGameOver(true);
        revealMines(newBoard);
      } else {
        openCell(newBoard, row, col);
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
        [0, -1],         [0, 1],
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
    setBoard(createBoard(10, 10, 10));
    setGameOver(false);
    setStartTime(null);
    setTimeElapsed(0);
    setMinesRemaining(10);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Game Over!</Text>
            <Button title="Reset Game" onPress={resetGame} color="#8bd4ff" />
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.backButton} onPress={() => console.log("Back button pressed")}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.timer}>{formatTime(timeElapsed)}</Text>
      <Text style={[styles.title, { color: 'white' }]}>Minesweeper</Text>
      <Board board={board} onCellPress={handleCellPress} onCellLongPress={handleCellPress} />
      <View style={[styles.buttonRow, { marginTop: 50 }]}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'flag' && styles.activeMode]}
          onPress={() => setMode('flag')}
        >
          <Text style={[styles.buttonText, mode === 'flag' && styles.activeButtonText]}>🚩</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'reveal' && styles.activeMode]}
          onPress={() => setMode('reveal')}
        >
          <Text style={[styles.buttonText, mode === 'reveal' && styles.activeButtonText]}>💣</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.minesRemaining, { color: '#8bd4ff', marginTop: 50 }]}>Mines remaining: {minesRemaining}</Text>
    </View>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000', // Nền đen
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    marginBottom: 10,
    color: '#fff', // Chữ trắng
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 20,
    color: '#8bd4ff',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modeButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#bbb',
    borderRadius: 5,
  },
  activeMode: {
    backgroundColor: '#8bd4ff', // Màu nền khi nút được chọn
  },
  buttonText: {
    fontSize: 18,
  },
  activeButtonText: {
    color: '#fff', // Màu chữ khi nút được chọn
  },
  minesRemaining: {
    fontSize: 16,
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  }
});

export default GameScreen;

