import React, { Component } from 'react';
import Simulator from 'components/Simulator/Simulator';
import RobotIDE from 'components/RobotIDE/RobotIDE';
import Tracks from 'assets/images.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: Tracks.track
    };
  }
  setTrack(track) {
    this.setState({track})
  }

  render() {
    return (
      <div className="App">
        {/*<Routes />*/}
        <Simulator track={this.state.track}/>
        <RobotIDE/>
        <div style={{position: 'absolute', bottom: 0}}>
          {Object.values(Tracks).map(data => <img style={{width: 128, height: 128}} src={data[0]} onClick={() => this.setTrack(data)}/>)}
        </div>
      </div>
    );
  }
}

export default App;
