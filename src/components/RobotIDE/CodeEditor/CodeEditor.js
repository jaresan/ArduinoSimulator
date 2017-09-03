import React, { Component } from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import { AutoSizer } from 'react-virtualized';

import CodeEditorToolbar from './CodeEditorToolbar';

import { r_saveCode } from 'actions/codeEditorActions';
import { s_executeCode } from 'actions/simulatorActions';
import { DEFAULT_CODE } from 'constants/codeEditor';
import { getCode } from 'selectors/codeEditorSelectors';
import { downloadTextAsFile } from 'utils';


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
      code: props.code || DEFAULT_CODE
    };
  }

  componentWillUnmount() {
    this.onSaveCode();
  }

  onCodeChange(newValue) {
    this.setState({
      code: newValue
    });
  }

  onDownloadCode() {
    this.onSaveCode();
    downloadTextAsFile('arduino_code.js', this.state.code);
  }

  onSaveCode() {
    // FIXME: Somehow use cookie to save the code on the server and present it on reload
    this.props.saveCode(this.state.code);
  }

  onExecuteCode() {
    this.onSaveCode();
    this.props.executeCode();
  }

  onPauseSimulation() {
    this.props.pauseSimulator();
  }

  onStopSimulation() {
    this.props.stopSimulator();
  }

  render() {
    // FIXME: Make autosizer use <List/> where one row is editor and the other is toolbar
    return (
      <div className="CodeEditor">
        <AutoSizer>
          {({width, height}) => {
            return (
              <div>
                <AceEditor
                  key={`${width},${height}`}
                  mode="javascript"
                  theme="kuroir"
                  ref="AceEditor"
                  fontSize={14}
                  width={width + 'px'}
                  height={height - 30 + 'px'}
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
                  editorProps={{$blockScrolling: Infinity}}
                />
                <CodeEditorToolbar
                  onDownload={() => this.onDownloadCode()}
                  onExecuteCode={() => this.onExecuteCode()}
                />
              </div>
            )
          }}
        </AutoSizer>
      </div>
    )
  }
}

const mapStateToProps = appState => ({
  code: getCode(appState)
});
const mapDispatchToProps = {
  saveCode: r_saveCode,
  executeCode: s_executeCode
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);