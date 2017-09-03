import React, { Component } from 'react';
import { connect } from 'react-redux';

class CodeEditorToolbar extends Component {
  render() {
    return (
      <div className="CodeEditorToolbar">
        <button
          onClick={() => this.props.onDownload()}>
          Download
        </button>
        <button
          onClick={() => this.props.onExecuteCode()}>
          Execute
        </button>
      </div>
    );
  }
}

export default CodeEditorToolbar;