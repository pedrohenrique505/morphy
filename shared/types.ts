// shared/types.ts

// Basic types for Minimalist Chess

export type PieceColor = 'white' | 'black';
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type BoardState = (Piece | null)[][]; // 8x8 array

export interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  piece: Piece;
}

export interface GameState {
  board: BoardState;
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  moveHistory: Move[];
}
