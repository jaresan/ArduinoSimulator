import React, { Component } from 'react';
import Simulator from 'components/Simulator/Simulator';
import CodeEditor from 'components/CodeEditor/CodeEditor';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<Routes />*/}
        <Simulator
          width={1000}
        />
        <CodeEditor/>
      </div>
    );
  }
}

export default App;