import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Board from '../components/Board';
import GameOverModal from '../components/GameOverModal';
import VictoryModal from '../components/VictoryModal';
import { useMinesweeper } from '../hooks/useMinesweeper';

const GameScreen: React.FC = () => {
  const {
    board,
    gameOver,
    gameWon,
    mode,
    timeElapsed,
    minesRemaining,
    handleCellPress,
    resetGame,
    setMode,
  } = useMinesweeper(10, 10, 10);

  return (
    <View style={styles.container}>
      <GameOverModal visible={gameOver} onClose={resetGame} />
      <VictoryModal visible={gameWon} onClose={resetGame} />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => console.log("Back button pressed")}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Minesweeper</Text>
          <Text style={styles.timer}>{formatTime(timeElapsed)}</Text>
        </View>
      </View>
      <View style={styles.boardContainer}>
        <Board board={board} onCellPress={handleCellPress} onCellLongPress={handleCellPress} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={[styles.minesRemaining, { color: '#8bd4ff' }]}>Mines remaining: {minesRemaining}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'flag' && styles.activeMode, styles.leftButton]}
            onPress={() => setMode('flag')}
          >
            <Text style={[styles.buttonText, mode === 'flag' && styles.activeButtonText]}>🚩</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'reveal' && styles.activeMode, styles.rightButton]}
            onPress={() => setMode('reveal')}
          >
            <Text style={[styles.buttonText, mode === 'reveal' && styles.activeButtonText]}>💣</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
  timer: {
    fontSize: 20,
    color: '#fff',
  },
  backButton: {
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#8bd4ff',
  },
  boardContainer: {
    marginTop: -0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%', 
    marginTop: 10,
  },
  modeButton: {
    padding: 10,
    backgroundColor: '#bbb',
    borderRadius: 5,
    width: '48%', // Adjusted width for the buttons
  },
  leftButton: {
    marginRight: '2%', // Adjusted margin for the left button
  },
  rightButton: {
    marginLeft: '2%', // Adjusted margin for the right button
  },
  activeMode: {
    backgroundColor: '#8bd4ff',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#fff',
  },
  minesRemaining: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default GameScreen;
