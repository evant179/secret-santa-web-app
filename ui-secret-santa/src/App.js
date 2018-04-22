import React, { Component } from 'react';
import './App.css';
import logo from './assets/yoshi-cat.jpg'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Coming Soon!</h1>
        </header>
        <img src={logo} className="App-logo main-logo" alt="logo" />
      </div>
    );
  }
}

export default App;
