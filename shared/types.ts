// shared/types.ts
// Core types for the chess engine. Shared between client and server.

// --- Piece & Color ---

// Why enums instead of string unions?
// Enums give us auto-complete AND a runtime value we can use in switch statements.
// String unions only exist at compile time — enums exist at runtime too.

export enum PieceColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export enum PieceType {
  PAWN = 'PAWN',
  KNIGHT = 'KNIGHT',
  BISHOP = 'BISHOP',
  ROOK = 'ROOK',
  QUEEN = 'QUEEN',
  KING = 'KING',
}

// A piece is simply a color + a type. Nothing more.
export interface Piece {
  color: PieceColor;
  type: PieceType;
}

// --- Board ---

// Why an 8x8 matrix instead of a flat 64-item array?
//
// With a matrix, accessing a square is board[row][col].
// This maps directly to how we think about chess:
//   "The piece on row 0, column 4" → board[0][4] → the black king.
//
// A flat array would require index math (row * 8 + col) every time,
// which is harder to read and easier to mess up.
// The matrix trades a tiny bit of memory for a LOT of clarity.

// Each cell is either a Piece or null (empty square).
export type Square = Piece | null;

// The board is 8 rows, each containing 8 squares.
export type Board = Square[][];

// --- Move ---

export interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  piece: Piece;
}

// --- Game State ---

export interface GameState {
  board: Board;
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  moveHistory: Move[];
}
