// shared/board.ts
// The starting position of a standard chess game.

import { Board, Piece, PieceColor, PieceType } from './types';

// Helper to create a piece — saves us from writing { color: ..., type: ... } 32 times.
function piece(color: PieceColor, type: PieceType): Piece {
  return { color, type };
}

// Shorthand aliases for readability.
const W = PieceColor.WHITE;
const B = PieceColor.BLACK;
const { ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN } = PieceType;

// The board is laid out exactly like you'd see it from Black's perspective looking down:
//   Row 0 = Black's back rank (rank 8)
//   Row 7 = White's back rank (rank 1)
//
// This means board[0][0] is a8 (black rook) and board[7][4] is e1 (white king).

export const INITIAL_BOARD: Board = [
  // Row 0 — Black's major pieces (rank 8)
  [piece(B, ROOK), piece(B, KNIGHT), piece(B, BISHOP), piece(B, QUEEN), piece(B, KING), piece(B, BISHOP), piece(B, KNIGHT), piece(B, ROOK)],
  // Row 1 — Black pawns (rank 7)
  [piece(B, PAWN), piece(B, PAWN), piece(B, PAWN), piece(B, PAWN), piece(B, PAWN), piece(B, PAWN), piece(B, PAWN), piece(B, PAWN)],
  // Rows 2-5 — Empty squares
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  // Row 6 — White pawns (rank 2)
  [piece(W, PAWN), piece(W, PAWN), piece(W, PAWN), piece(W, PAWN), piece(W, PAWN), piece(W, PAWN), piece(W, PAWN), piece(W, PAWN)],
  // Row 7 — White's major pieces (rank 1)
  [piece(W, ROOK), piece(W, KNIGHT), piece(W, BISHOP), piece(W, QUEEN), piece(W, KING), piece(W, BISHOP), piece(W, KNIGHT), piece(W, ROOK)],
];

// movePiece — returns a NEW board with the piece relocated.
//
// Why a new board instead of mutating the existing one?
// React only triggers a re-render when it sees a NEW reference.
// If we mutate the array in place, React compares the old and new
// references and finds them identical — so the screen never updates.
// Creating a new matrix guarantees React will re-render correctly.
//
// Note: Phase 2 allows any move. Chess rules (legal move validation)
// will be layered on in a later phase.
export function movePiece(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  promotionType: PieceType = PieceType.QUEEN
): Board {
  const piece = board[fromRow][fromCol];
  if (!piece) return board;

  // Create a new board matrix (deep copy)
  let newBoard = board.map((row) => [...row]);

  // Handle Castling
  if (piece.type === PieceType.KING && Math.abs(toCol - fromCol) === 2) {
    const isKingside = toCol > fromCol;
    const rookFromCol = isKingside ? 7 : 0;
    const rookToCol = isKingside ? 5 : 3;
    const rook = newBoard[fromRow][rookFromCol];

    // Move the Rook
    newBoard[fromRow][rookToCol] = rook;
    newBoard[fromRow][rookFromCol] = null;
  }

  // Handle En Passant
  if (piece.type === PieceType.PAWN && fromCol !== toCol && newBoard[toRow][toCol] === null) {
    newBoard[fromRow][toCol] = null;
  }

  // Handle Promotion
  const isPromotion = 
    piece.type === PieceType.PAWN && 
    (toRow === 0 || toRow === 7);

  // Standard Move execution
  newBoard[toRow][toCol] = isPromotion ? { ...piece, type: promotionType } : piece;
  newBoard[fromRow][fromCol] = null;

  return newBoard;
}

