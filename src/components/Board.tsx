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
    flexDirection: 'row', // Sắp xếp các dòng theo chiều ngang
    flexWrap: 'wrap', // Cho phép các dòng được quấn xuống nếu không thể hiển thị hết trên một dòng
    justifyContent: 'center', // Canh giữa các dòng
    alignItems: 'center', // Canh giữa các ô trong mỗi dòng
  },
  row: {
    flexDirection: 'row', // Sắp xếp các ô theo chiều ngang
  },
});

export default Board;
