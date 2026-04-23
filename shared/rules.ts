import { Board, Piece, PieceColor, PieceType } from './types';

export function isWithinBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
export function isEmpty(board: Board, row: number, col: number): boolean {
  return board[row][col] === null;
}

export function isEnemy(piece: Piece, board: Board, row: number, col: number): boolean {
  const target = board[row][col];
  return target !== null && target.color !== piece.color;
}

export function isValidMove(board: Board, piece: Piece, fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
  if (!isWithinBounds(toRow, toCol)) return false;
  if (fromRow === toRow && fromCol === toCol) return false;
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) return false;

  switch (piece.type) {
    case PieceType.PAWN:
      return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, board);
    case PieceType.KNIGHT:
      return isValidKnightMove(fromRow, fromCol, toRow, toCol);
    case PieceType.ROOK:
      return isValidRookMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.BISHOP:
      return isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.QUEEN:
      return isValidQueenMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.KING:
      return isValidKingMove(fromRow, fromCol, toRow, toCol);
    default:
      return false;
  }
}

function isValidPawnMove(piece: Piece, fromRow: number, fromCol: number, toRow: number, toCol: number, board: Board): boolean {
  const direction = piece.color === PieceColor.WHITE ? -1 : 1;
  const startingRow = piece.color === PieceColor.WHITE ? 6 : 1;

  const rowDiff = toRow - fromRow;
  const colDiff = Math.abs(toCol - fromCol);

  if (colDiff === 0 && rowDiff === direction) {
    return isEmpty(board, toRow, toCol);
  }
  if (colDiff === 0 && rowDiff === 2 * direction && fromRow === startingRow) {
    const intermediateRow = fromRow + direction;
    return isEmpty(board, intermediateRow, fromCol) && isEmpty(board, toRow, toCol);
  }

  if (colDiff === 1 && rowDiff === direction) {
    return isEnemy(piece, board, toRow, toCol);
  }

  return false;
}

function isPathClear(fromRow: number, fromCol: number, toRow: number, toCol: number, board: Board): boolean {
  const rowStep = Math.sign(toRow - fromRow);
  const colStep = Math.sign(toCol - fromCol);
  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol] !== null) {
      return false;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }
  return true;
}

function isValidKnightMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isStraightMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
  return fromRow === toRow || fromCol === toCol;
}

function isDiagonalMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
  return Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol);
}

function isValidRookMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: Board): boolean {
  if (!isStraightMove(fromRow, fromCol, toRow, toCol)) return false;
  return isPathClear(fromRow, fromCol, toRow, toCol, board);
}

function isValidBishopMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: Board): boolean {
  if (!isDiagonalMove(fromRow, fromCol, toRow, toCol)) return false;
  return isPathClear(fromRow, fromCol, toRow, toCol, board);
}

function isValidQueenMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: Board): boolean {
  const isValidGeometry = isStraightMove(fromRow, fromCol, toRow, toCol) || isDiagonalMove(fromRow, fromCol, toRow, toCol);
  if (!isValidGeometry) return false;
  return isPathClear(fromRow, fromCol, toRow, toCol, board);
}

function isValidKingMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return rowDiff <= 1 && colDiff <= 1;
}


// --- UI Helpers ---
export function calculateValidMoves(board: Board, piece: Piece, fromRow: number, fromCol: number) {
  const moves: { row: number; col: number }[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(board, piece, fromRow, fromCol, r, c)) {
        moves.push({ row: r, col: c });
      }
    }
  }

  return moves;
}
