import React from 'react';
import './Score.sass';

type ScoreProps = {
    highScore: number;
    user: string;
    score: number;
  };

  const Score = ({ highScore, user, score }: ScoreProps) => {
    return (
      <div className="container-score-board">
        <p className="text-bold align-center">Score to Beat: {highScore}</p>
        <div className="game-score-board">
          <span>
            Current Player: <span className="text-bold wrap-item">{user}</span>
          </span>
          <span>
            Score: <span className="text-bold">{score}</span>
          </span>
        </div>
      </div>
    );
  };

  export default Score;