import React, { Component } from 'react';
import { connect } from 'react-redux';

class CodeEditorToolbar extends Component {
  render() {
    return (
      <div className="CodeEditorToolbar">
        <button
          onClick={() => this.props.onSave()}>
          Save
        </button>
        <button
          onClick={() => this.props.onRunSimulation()}>
          Run simulation
        </button>
        <button
          onClick={() => this.props.onPauseSimulation()}>
          Pause simulation
        </button>
        <button
          onClick={() => this.props.onStopSimulation()}>
          Stop simulation
        </button>
      </div>
    );
  }
}

export default CodeEditorToolbar;