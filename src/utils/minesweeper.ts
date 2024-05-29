export interface Cell {
    isMine: boolean;
    isOpen: boolean;
    isFlagged: boolean;
    adjacentMines: number;
  }
  
  export type Board = Cell[][];
  
  export const createBoard = (rows: number, cols: number, mines: number): Board => {
    let board: Board = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isOpen: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );
  
    // Plant mines
    let plantedMines = 0;
    while (plantedMines < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        plantedMines++;
      }
    }
  
    // Calculate adjacent mines
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
  
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isMine) continue;
        let minesCount = 0;
        for (const [dr, dc] of directions) {
          const newRow = r + dr;
          const newCol = c + dc;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].isMine) {
            minesCount++;
          }
        }
        board[r][c].adjacentMines = minesCount;
      }
    }
  
    return board;
    
  };
  export const countFlaggedCells = (board: Board): number => {
    let count = 0;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        if (board[row][col].isFlagged) {
          count++;
        }
      }
    }
    return count;
  };