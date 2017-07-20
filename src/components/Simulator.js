import React, { Component } from 'react';
import Canvas from './Canvas';
import { connect } from 'react-redux';
import Actions from 'actions';

class Simulator extends Component {

  //
  // componentWillLoad() {
  //
  // }
  //
  // componentDidLoad() {
  //
  // }


  getVideo() {
    // FIXME: Implement
  }

  preAnimate() {

  }

  animate() {

  }

  loop() {

  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            console.log(this.props.lol);
            this.props.actionerino(1, 2);
            this.props.actionerino2(2, 1, 3);
          }}
        >Click me!</button>
        <Canvas/>
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  lol: appState
});

export default connect(mapStateToProps, {
  actionerino: Actions.Robot.changePosition,
  actionerino2: Actions.World.changePosition
})(Simulator);