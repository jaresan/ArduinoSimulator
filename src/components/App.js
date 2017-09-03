import React, { Component } from 'react';
import Simulator from 'components/Simulator/Simulator';
import RobotIDE from 'components/RobotIDE/RobotIDE';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<Routes />*/}
        <Simulator/>
        <RobotIDE/>
      </div>
    );
  }
}

export default App;