// src/components/Board.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Board as BoardType, Cell as CellType } from '../utils/minesweeper';
import Cell from './Cell';

interface BoardProps {
  board: BoardType;
  onCellPress: (row: number, col: number) => void;
  onCellLongPress: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onCellPress, onCellLongPress }) => {
  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              cell={cell}
              onPress={() => onCellPress(rowIndex, colIndex)}
              onLongPress={() => onCellLongPress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;
