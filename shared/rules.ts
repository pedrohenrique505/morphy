import { Board, Move, Piece, PieceColor, PieceType } from './types';

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

export function isValidMove(
  board: Board,
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  history: Move[] = []
): boolean {
  if (!isWithinBounds(toRow, toCol)) return false;
  if (fromRow === toRow && fromCol === toCol) return false;
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) return false;

  switch (piece.type) {
    case PieceType.PAWN:
      return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, board, history);
    case PieceType.KNIGHT:
      return isValidKnightMove(fromRow, fromCol, toRow, toCol);
    case PieceType.ROOK:
      return isValidRookMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.BISHOP:
      return isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.QUEEN:
      return isValidQueenMove(fromRow, fromCol, toRow, toCol, board);
    case PieceType.KING:
      return isValidKingMove(piece, fromRow, fromCol, toRow, toCol, board, history);
    default:
      return false;
  }
}

function isValidPawnMove(
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: Board,
  history: Move[]
): boolean {
  const direction = piece.color === PieceColor.WHITE ? -1 : 1;
  const startingRow = piece.color === PieceColor.WHITE ? 6 : 1;

  const rowDiff = toRow - fromRow;
  const colDiff = Math.abs(toCol - fromCol);

  // Normal move
  if (colDiff === 0 && rowDiff === direction) {
    return isEmpty(board, toRow, toCol);
  }
  // Initial double move
  if (colDiff === 0 && rowDiff === 2 * direction && fromRow === startingRow) {
    const intermediateRow = fromRow + direction;
    return isEmpty(board, intermediateRow, fromCol) && isEmpty(board, toRow, toCol);
  }

  // Capture
  if (colDiff === 1 && rowDiff === direction) {
    // Standard capture
    if (isEnemy(piece, board, toRow, toCol)) return true;

    // En Passant
    return isValidEnPassant(piece, fromRow, fromCol, toRow, toCol, board, history);
  }

  return false;
}

function isValidEnPassant(
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: Board,
  history: Move[]
): boolean {
  if (history.length === 0) return false;
  const lastMove = history[history.length - 1];

  // Last move must be a pawn move
  if (lastMove.piece.type !== PieceType.PAWN) return false;

  // Last move must have been a double step
  const isDoubleStep = Math.abs(lastMove.toRow - lastMove.fromRow) === 2;
  if (!isDoubleStep) return false;

  // The pawn must be on the same row as our pawn
  if (lastMove.toRow !== fromRow) return false;

  // The pawn must be in the column we are moving to
  if (lastMove.toCol !== toCol) return false;

  return true;
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

function isValidKingMove(
  piece: Piece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  board: Board,
  history: Move[]
): boolean {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Standard move
  if (rowDiff <= 1 && colDiff <= 1) return true;

  // Castling
  if (rowDiff === 0 && colDiff === 2) {
    // King must be on its starting square
    const startingRow = piece.color === PieceColor.WHITE ? 7 : 0;
    if (fromRow !== startingRow || fromCol !== 4) return false;

    // King must not have moved
    const kingMoved = history.some(
      (m) => m.piece.type === PieceType.KING && m.piece.color === piece.color
    );
    if (kingMoved) return false;

    // Rook check
    const isKingside = toCol === 6;
    const rookCol = isKingside ? 7 : 0;
    const rookSquare = board[fromRow][rookCol];

    if (!rookSquare || rookSquare.type !== PieceType.ROOK || rookSquare.color !== piece.color) {
      return false;
    }

    // Rook must not have moved
    const rookMoved = history.some(
      (m) =>
        m.piece.type === PieceType.ROOK &&
        m.piece.color === piece.color &&
        m.fromRow === fromRow &&
        m.fromCol === rookCol
    );
    if (rookMoved) return false;

    // Path must be clear
    return isPathClear(fromRow, fromCol, fromRow, rookCol, board);
  }

  return false;
}

// --- UI Helpers ---
export function calculateValidMoves(
  board: Board,
  piece: Piece,
  fromRow: number,
  fromCol: number,
  history: Move[] = []
) {
  const moves: { row: number; col: number }[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(board, piece, fromRow, fromCol, r, c, history)) {
        moves.push({ row: r, col: c });
      }
    }
  }

  return moves;
}
