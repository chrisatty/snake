import React from 'react';
import './App.css';
import SnakeGame from './SnakeGame';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        SNAKE
        <SnakeGame />
      </header>
    </div>
  );
}

export default App;
