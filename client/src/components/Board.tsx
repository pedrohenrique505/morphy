// Board.tsx — 8x8 board with drag-and-drop piece movement.
// State lives here so the board re-renders when a piece moves.

import { useState } from 'react';
import type { Board as BoardType, Piece, Move } from '@shared/types';
import { PieceColor, PieceType } from '@shared/types';
import { INITIAL_BOARD, movePiece } from '@shared/board';
import { isValidMove, calculateValidMoves, isCheck, isLegalMove } from '@shared/rules';

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

  // Promotion state
  const [promotionRequest, setPromotionRequest] = useState<{
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
    piece: Piece;
  } | null>(null);

  // Check and Checkmate state
  const [checkStatus, setCheckStatus] = useState<PieceColor | null>(null);
  const [gameOver, setGameOver] = useState<{ winner: PieceColor | 'DRAW'; type: 'CHECKMATE' | 'STALEMATE' } | null>(null);

  // --- Game Status Check ---
  function updateGameStatus(currentBoard: BoardType, nextTurn: PieceColor, currentHistory: Move[]) {
    // 1. Check if the next player is in check
    const inCheck = isCheck(currentBoard, nextTurn, currentHistory);
    setCheckStatus(inCheck ? nextTurn : null);

    // 2. Check if the next player has any legal moves
    let hasLegalMoves = false;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece && piece.color === nextTurn) {
          const moves = calculateValidMoves(currentBoard, piece, r, c, currentHistory);
          if (moves.length > 0) {
            hasLegalMoves = true;
            break;
          }
        }
      }
      if (hasLegalMoves) break;
    }

    // 3. If no legal moves, it's either checkmate or stalemate
    if (!hasLegalMoves) {
      if (inCheck) {
        setGameOver({
          winner: nextTurn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE,
          type: 'CHECKMATE',
        });
      } else {
        setGameOver({ winner: 'DRAW', type: 'STALEMATE' });
      }
    }
  }

  // --- Move Execution ---
  function executeMove(fromRow: number, fromCol: number, toRow: number, toCol: number, piece: Piece, promotionType?: PieceType) {
    const move: Move = {
      fromRow,
      fromCol,
      toRow,
      toCol,
      piece,
    };
    const nextBoard = movePiece(board, fromRow, fromCol, toRow, toCol, promotionType);
    const nextHistory = [...history, move];
    const nextTurn = turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

    setBoard(nextBoard);
    setHistory(nextHistory);
    setTurn(nextTurn);
    
    // Check for check/checkmate for the NEXT player
    updateGameStatus(nextBoard, nextTurn, nextHistory);
  }

  // --- Tap-to-Move Logic ---
  function handleSquareClick(row: number, col: number) {
    if (gameOver) return; // Disable moves if game is over

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

      if (selectedPiece && isLegalMove(board, selectedPiece, selectedSquare.row, selectedSquare.col, row, col, history)) {
        const isPromotion = selectedPiece.type === PieceType.PAWN && (row === 0 || row === 7);
        
        if (isPromotion) {
          setPromotionRequest({ fromRow: selectedSquare.row, fromCol: selectedSquare.col, toRow: row, toCol: col, piece: selectedPiece });
        } else {
          executeMove(selectedSquare.row, selectedSquare.col, row, col, selectedPiece);
        }
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
    if (gameOver) return;
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
    if (gameOver || !selectedSquare) return;

    const { row: fromRow, col: fromCol } = selectedSquare;
    const piece = board[fromRow][fromCol];

    if (fromRow === toRow && fromCol === toCol) {
      setDragOverSquare(null);
      return;
    }

    if (piece && isLegalMove(board, piece, fromRow, fromCol, toRow, toCol, history)) {
      const isPromotion = piece.type === PieceType.PAWN && (toRow === 0 || toRow === 7);
      
      if (isPromotion) {
        setPromotionRequest({ fromRow, fromCol, toRow, toCol, piece });
      } else {
        executeMove(fromRow, fromCol, toRow, toCol, piece);
      }
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
    <div className="flex flex-col items-center gap-4 relative">
      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-md">
          <div className="bg-white border-4 border-black p-8 rounded-lg shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in duration-300">
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: 'var(--font-family-ui)' }}>
              {gameOver.type}
            </h2>
            <div className="text-xl font-bold text-gray-600">
              {gameOver.winner === 'DRAW' ? "It's a draw!" : `Winner: ${gameOver.winner}`}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Promotion Modal Overlay */}
      {promotionRequest && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-lg backdrop-blur-sm">
          <div className="bg-white border-2 border-black p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-family-ui)' }}>
              Promote to:
            </h3>
            <div className="flex gap-4">
              {[PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT].map((type) => {
                const img = PIECE_IMAGES[turn][type];
                return (
                  <button
                    key={type}
                    onClick={() => {
                      executeMove(
                        promotionRequest.fromRow,
                        promotionRequest.fromCol,
                        promotionRequest.toRow,
                        promotionRequest.toCol,
                        promotionRequest.piece,
                        type
                      );
                      setPromotionRequest(null);
                    }}
                    className="p-2 border-2 border-transparent hover:border-black rounded-md transition-all hover:scale-110 active:scale-95 bg-gray-50"
                  >
                    <img src={img} alt={type} className="w-16 h-16" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

            // Check if this is a king in check
            const isKingInCheck = 
              square?.type === PieceType.KING && 
              square?.color === checkStatus;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="flex items-center justify-center relative cursor-pointer"
                style={{
                  backgroundColor: isKingInCheck
                    ? 'var(--color-accent-red)' // High contrast red for check
                    : light
                    ? 'var(--color-square-light)'
                    : 'var(--color-square-dark)',
                  boxShadow: isDragTarget
                    ? 'inset 0 0 0 3px var(--color-accent-green)'
                    : 'none',
                  opacity: isSelected ? 0.6 : 1, 
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