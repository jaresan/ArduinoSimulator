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
            console.log('clicked madafaka');
            this.props.actionerino(this.props.lol);
          }}
        >{this.props.wtf ? 1 : 0}</button>
        <Canvas/>
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  lol: appState
});

console.log(Actions);
export default connect(mapStateToProps, {actionerino: Actions.Robot.changePosition})(Simulator);