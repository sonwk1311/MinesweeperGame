// src/components/Cell.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Cell as CellType } from '../utils/minesweeper';

interface CellProps {
  cell: CellType;
  onPress: () => void;
  onLongPress: () => void;
}

const Cell: React.FC<CellProps> = ({ cell, onPress, onLongPress }) => {
  let content = null;

  if (cell.isOpen) {
    if (cell.isMine) {
      content = '💣';
    } else if (cell.adjacentMines > 0) {
      content = cell.adjacentMines;
    }
  } else if (cell.isFlagged) {
    content = '🚩';
  }

  return (
    <TouchableOpacity style={[styles.cell, cell.isOpen && styles.cellOpen]} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.cellText}>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbb',
    margin: 1,
  },
  cellOpen: {
    backgroundColor: '#ddd',
  },
  cellText: {
    fontSize: 18,
  },
});

export default Cell;
