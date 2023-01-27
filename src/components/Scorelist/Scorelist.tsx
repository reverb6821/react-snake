import React from "react";
import { IUser } from '../../interface/IUser';
import './Scorelist.sass'

type ScorelistProps = {
    users: IUser[];
  };

  const Scorelist = ({ users }: ScorelistProps) => {
    const sorted = [...users]
      .sort((a, b) => (a.score < b.score ? 1 : -1))
      .slice(0, 10);
  
    return (
      <div className="card score-list">
        <h2>Top 10</h2>
        <div className="list-item container-list-title">
          <span className="list-title">Rank</span>
          <span className="list-title">Name</span>
          <span className="list-title">Score</span>
        </div>
        {users.length > 0 ? (
          sorted.map((user, index) => (
            <div className="list-item" key={user.score + index + user.name}>
              <span>{index + 1}.</span>
              <span className="wrap-item">{user.name}</span>
              <span>{user.score}</span>
            </div>
          ))
        ) : (
          <p>No scores yet!</p>
        )}
      </div>
    );
  };
  
  export default Scorelist;