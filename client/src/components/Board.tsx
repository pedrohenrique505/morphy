// Board.tsx — 8x8 board with drag-and-drop piece movement.
// State lives here so the board re-renders when a piece moves.

import { useState } from 'react';
import type { Board as BoardType, Piece, Move } from '@shared/types';
import { PieceColor, PieceType } from '@shared/types';
import { INITIAL_BOARD, movePiece } from '@shared/board';
import { isValidMove, calculateValidMoves } from '@shared/rules';

// --- SVG imports ---
import wp from '../assets/pieces/wp.svg';
import wn from '../assets/pieces/wn.svg';
import wb from '../assets/pieces/wb.svg';
import wr from '../assets/pieces/wr.svg';
import wq from '../assets/pieces/wq.svg';
import wk from '../assets/pieces/wk.svg';
import bp from '../assets/pieces/bp.svg';
import bn from '../assets/pieces/bn.svg';
import bb from '../assets/pieces/bb.svg';
import br from '../assets/pieces/br.svg';
import bq from '../assets/pieces/bq.svg';
import bk from '../assets/pieces/bk.svg';

// Nested lookup: PIECE_IMAGES[color][type] → svg url
const PIECE_IMAGES: Record<PieceColor, Record<PieceType, string>> = {
  [PieceColor.WHITE]: {
    [PieceType.PAWN]: wp,   [PieceType.KNIGHT]: wn,
    [PieceType.BISHOP]: wb, [PieceType.ROOK]: wr,
    [PieceType.QUEEN]: wq,  [PieceType.KING]: wk,
  },
  [PieceColor.BLACK]: {
    [PieceType.PAWN]: bp,   [PieceType.KNIGHT]: bn,
    [PieceType.BISHOP]: bb, [PieceType.ROOK]: br,
    [PieceType.QUEEN]: bq,  [PieceType.KING]: bk,
  },
};

function getPieceImage(piece: Piece | null): string | null {
  if (!piece) return null;
  return PIECE_IMAGES[piece.color][piece.type];
}

// Light square when (row + col) is even — the classic chess rule.
function isLightSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 0;
}

// --- Types used only inside this file ---

// Stores which square the drag started from.
interface DragSource {
  row: number;
  col: number;
}

export default function Board() {
  // The board matrix is the single source of truth for what's on the board.
  const [board, setBoard] = useState<BoardType>(INITIAL_BOARD);

  // Turn management: White always moves first
  const [turn, setTurn] = useState<PieceColor>(PieceColor.WHITE);

  // History of moves - needed for special moves like Castling and En Passant
  const [history, setHistory] = useState<Move[]>([]);

  // Tracks valid moves for the currently dragged piece to display visual feedback
  const [validMoves, setValidMoves] = useState<{row: number, col: number}[]>([]);

  // Unified selection state for both tap-to-move and drag-and-drop
  const [selectedSquare, setSelectedSquare] = useState<{row: number, col: number} | null>(null);

  // dragOverSquare tracks which square the cursor is hovering over during a drag.
  const [dragOverSquare, setDragOverSquare] = useState<{row: number, col: number} | null>(null);

  // --- Tap-to-Move Logic ---
  function handleSquareClick(row: number, col: number) {
    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        cleanupSelection();
        return;
      }

      const clickedPiece = board[row][col];
      const selectedPiece = board[selectedSquare.row][selectedSquare.col];

      if (clickedPiece && clickedPiece.color === turn) {
        setSelectedSquare({ row, col });
        setValidMoves(calculateValidMoves(board, clickedPiece, row, col, history));
        return;
      }

      if (selectedPiece && isValidMove(board, selectedPiece, selectedSquare.row, selectedSquare.col, row, col, history)) {
        const move: Move = {
          fromRow: selectedSquare.row,
          fromCol: selectedSquare.col,
          toRow: row,
          toCol: col,
          piece: selectedPiece,
        };
        setBoard(movePiece(board, selectedSquare.row, selectedSquare.col, row, col));
        setHistory([...history, move]);
        setTurn(turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE);
      }
      
      cleanupSelection();
    } else {
      const piece = board[row][col];
      if (piece && piece.color === turn) {
        setSelectedSquare({ row, col });
        setValidMoves(calculateValidMoves(board, piece, row, col, history));
      }
    }
  }

  // --- Drag-and-Drop Logic ---
  function handleDragStart(row: number, col: number) {
    const piece = board[row][col];
    if (!piece || piece.color !== turn) return; 

    setSelectedSquare({ row, col });
    setValidMoves(calculateValidMoves(board, piece, row, col, history));
  }

  function handleDragOver(e: React.DragEvent, row: number, col: number) {
    e.preventDefault(); 
    setDragOverSquare({ row, col });
  }

  function handleDrop(toRow: number, toCol: number) {
    if (!selectedSquare) return;

    const { row: fromRow, col: fromCol } = selectedSquare;
    const piece = board[fromRow][fromCol];

    if (fromRow === toRow && fromCol === toCol) {
      setDragOverSquare(null);
      return;
    }

    if (piece && isValidMove(board, piece, fromRow, fromCol, toRow, toCol, history)) {
      const move: Move = {
        fromRow,
        fromCol,
        toRow,
        toCol,
        piece,
      };
      setBoard(movePiece(board, fromRow, fromCol, toRow, toCol));
      setHistory([...history, move]);
      setTurn(turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE);
    }

    cleanupSelection();
  }

  function handleDragLeave() {
    setDragOverSquare(null);
  }

  // Helper to reset all interaction states
  function cleanupSelection() {
    setSelectedSquare(null);
    setDragOverSquare(null);
    setValidMoves([]);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Turn Indicator */}
      <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-family-ui)' }}>
        Turn: {turn}
      </div>

      <div
        id="chessboard"
        className="grid grid-cols-8 grid-rows-8 border-2 border-black aspect-square"
        style={{ width: '480px' }}
        onDragLeave={handleDragLeave}
      >
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const light = isLightSquare(rowIndex, colIndex);
            const image = getPieceImage(square);

            // Visual feedback: dim the selected/dragged square
            const isSelected =
              selectedSquare?.row === rowIndex &&
              selectedSquare?.col === colIndex;

            // Highlight the drop target
            const isDragTarget =
              dragOverSquare?.row === rowIndex &&
              dragOverSquare?.col === colIndex;

            // Check if this square is a valid move for the currently selected piece
            const isValidDestination = validMoves.some(
              m => m.row === rowIndex && m.col === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="flex items-center justify-center relative cursor-pointer"
                style={{
                  backgroundColor: light
                    ? 'var(--color-square-light)'
                    : 'var(--color-square-dark)',
                  boxShadow: isDragTarget
                    ? 'inset 0 0 0 3px var(--color-accent-green)'
                    : 'none',
                  opacity: isSelected ? 0.6 : 1, // Changed to 0.6 to look better for tap selection
                }}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                onDrop={() => handleDrop(rowIndex, colIndex)}
              >
                {/* Render the piece if it exists */}
                {image && (
                  <img
                    src={image}
                    alt={square ? `${square.color} ${square.type}` : ''}
                    className="w-[85%] h-[85%] object-contain select-none cursor-grab active:cursor-grabbing"
                    draggable={square?.color === turn} // Only allow dragging if it's the player's turn
                    onDragStart={(e) => {
                      if (square?.color !== turn) {
                        e.preventDefault(); 
                      } else {
                        handleDragStart(rowIndex, colIndex);
                      }
                    }}
                  />
                )}

                {/* Render the minimalist dot for valid moves */}
                {isValidDestination && (
                  <div
                    className="absolute w-4 h-4 rounded-full pointer-events-none"
                    style={{
                      backgroundColor: 'var(--color-accent-green)',
                      opacity: 0.4,
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}