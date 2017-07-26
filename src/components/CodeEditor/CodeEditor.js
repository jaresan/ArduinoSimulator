import React, { Component } from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import CodeEditorToolbar from './CodeEditorToolbar';

import { r_saveCode } from 'actions/codeEditorActions';
import { s_runSimulator, s_pauseSimulator, s_stopSimulator } from 'actions/simulatorActions';
import { DEFAULT_CODE } from 'constants/codeEditor';


import 'brace/theme/kuroir';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import './CodeEditor.css';

class CodeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: DEFAULT_CODE
    }
  }

  onCodeChange(newValue) {
    this.setState({
      code: newValue
    });
  }

  onSaveCode() {
    this.props.saveCode(this.state.code);
  }

  onRunSimulation() {
    this.onSaveCode();
    this.props.runSimulator();
  }

  onPauseSimulation() {
    this.props.pauseSimulator();
  }

  onStopSimulation() {
    this.props.stopSimulator();
  }

  render() {
    return (
      <div className="CodeEditor">
        <AceEditor
          mode="javascript"
          theme="kuroir"
          ref="AceEditor"
          fontSize={20}
          width={1000 + 'px'}
          height={1000 + 'px'}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          onChange={(newValue) => this.onCodeChange(newValue)}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
          value={this.state.code}
        />
        <CodeEditorToolbar
          onSave={() => this.onSaveCode()}
          onRunSimulation={() => this.onRunSimulation()}
          onPauseSimulation={() => this.onPauseSimulation()}
          onStopSimulation={() => this.onStopSimulation()}
        />
      </div>
    )
  }
}

const mapStateToProps = appState => ({});
const mapDispatchToProps = {
  saveCode: r_saveCode,
  runSimulator: s_runSimulator,
  stopSimulator: s_stopSimulator,
  pauseSimulator: s_pauseSimulator
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);