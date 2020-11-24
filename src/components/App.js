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
        <RobotIDE onTrackSelect={data => this.setTrack(data)}/>
      </div>
    );
  }
}

export default App;
