import React, { Component } from 'react';
import { connect } from 'react-redux';

class CodeEditorToolbar extends Component {
  render() {
    return (
      <div>
        <button
          onClick={() => this.props.onSave()}>
          Save
        </button>
        <button
          onClick={() => this.props.onRunRobot()}>
          Run Robot
        </button>
      </div>
    );
  }
}

export default CodeEditorToolbar;