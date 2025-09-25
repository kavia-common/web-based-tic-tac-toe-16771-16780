import React, { useMemo, useState } from 'react';
import './index.css';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App
 * This is the entrypoint component that renders the Ocean Professional themed Tic Tac Toe game.
 * It provides:
 * - Centered layout and responsive design
 * - Game board, status panel, controls and move history (time-travel)
 * - Smooth transitions, rounded corners, and accent highlights
 */
function App() {
  return (
    <div className="app-shell">
      <main className="card app-grid" role="main" aria-label="Tic Tac Toe Game">
        <Header />
        <Game />
        <Footer />
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Header
 * Renders the brand header and top-level controls like reset-all and theme-like button (play again from new).
 */
function Header() {
  return (
    <div className="header" role="banner">
      <div className="brand" aria-label="Brand">
        <div className="brand-badge" aria-hidden="true">◎</div>
        <div>
          <div className="title">Tic Tac Toe</div>
          <div className="subtitle">Ocean Professional</div>
        </div>
      </div>
      <div className="controls" role="group" aria-label="General Controls">
        <a className="btn btn-ghost" href="https://react.dev/learn" target="_blank" rel="noreferrer">
          Learn React
        </a>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Game
 * Handles the core Tic Tac Toe functionality: state, board, status, controls, and move history.
 */
function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const current = history[step];

  const winnerInfo = useMemo(() => calculateWinner(current), [current]);
  const isDraw = useMemo(
    () => !winnerInfo && current.every(Boolean),
    [winnerInfo, current]
  );

  const statusText = winnerInfo
    ? `Winner: ${winnerInfo.player}`
    : isDraw
    ? 'Draw'
    : `Next: ${xIsNext ? 'X' : 'O'}`;

  // PUBLIC_INTERFACE
  // handleClick
  // Handles placing a mark at an index if game not finished and cell empty.
  const handleClick = (i) => {
    if (winnerInfo || current[i]) return;
    const next = current.slice();
    next[i] = xIsNext ? 'X' : 'O';

    const newHistory = [...history.slice(0, step + 1), next];
    setHistory(newHistory);
    setStep(newHistory.length - 1);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  // jumpTo
  // Time-travel to a specific move step.
  const jumpTo = (moveIndex) => {
    setStep(moveIndex);
    setXIsNext(moveIndex % 2 === 0);
  };

  // PUBLIC_INTERFACE
  // reset
  // Starts a brand new game and clears history.
  const reset = () => {
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setXIsNext(true);
  };

  return (
    <section className="game-wrap" aria-label="Game Panel">
      <div className="panel">
        <div className="status" role="status" aria-live="polite">
          <div className="label">Game Status</div>
          <div className="badge">
            <span>Ocean</span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <circle cx="5" cy="5" r="4" fill="#2563EB" />
            </svg>
          </div>
          <div className="value" style={{ gridColumn: '1 / -1' }}>{statusText}</div>
        </div>

        <Board
          squares={current}
          onPlay={handleClick}
          winningLine={winnerInfo?.line ?? []}
        />

        <div className="controls" role="group" aria-label="Game Controls">
          <button className="btn btn-primary" onClick={reset} aria-label="Reset game">
            ↺ Reset
          </button>
          <button
            className="btn btn-amber"
            onClick={() => jumpTo(0)}
            aria-label="Jump to game start"
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.6 : 1 }}
          >
            ⏮ Start
          </button>
        </div>

        <div className="meta">
          <strong>Move History</strong>
          <div className="history" role="list" aria-label="Move history">
            {history.map((_, move) => {
              const isCurrent = move === step;
              return (
                <div key={move} className="move-item" role="listitem" aria-current={isCurrent ? 'true' : undefined}>
                  <span>Move {move === 0 ? 'Start' : `#${move}`}</span>
                  <button
                    className="btn btn-ghost"
                    onClick={() => jumpTo(move)}
                    aria-label={`Jump to move ${move}`}
                    disabled={isCurrent}
                    style={{ opacity: isCurrent ? 0.6 : 1 }}
                  >
                    {isCurrent ? 'Current' : 'Go'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board
 * Renders the 3x3 grid and highlights winning cells.
 */
function Board({ squares, onPlay, winningLine }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((val, idx) => {
        const isWinnerCell = winningLine.includes(idx);
        return (
          <Square
            key={idx}
            value={val}
            isWinner={isWinnerCell}
            onClick={() => onPlay(idx)}
            position={idx}
          />
        );
      })}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Square
 * A single cell in the board with visual states and smooth transitions.
 */
function Square({ value, onClick, isWinner, position }) {
  const aria = value ? `Cell ${position + 1} contains ${value}` : `Cell ${position + 1} empty`;
  return (
    <button
      className={`cell ${value ? value.toLowerCase() : ''} ${isWinner ? 'winner' : ''}`}
      onClick={onClick}
      aria-label={aria}
      role="gridcell"
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * calculateWinner
 * Determines if a player has won and returns the winner and the winning line.
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (const line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { player: squares[a], line };
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Footer
 * Small footer hint.
 */
function Footer() {
  return (
    <p className="footer-note">
      Built with React • Accents: <strong style={{ color: '#2563EB' }}>Blue</strong> & <strong style={{ color: '#F59E0B' }}>Amber</strong>
    </p>
  );
}

export default App;
