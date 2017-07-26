import React, { Component } from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import { r_saveCode } from 'actions/codeEditorActions';

import { DEFAULT_CODE } from 'constants/codeEditor';


import 'brace/theme/kuroir';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import './CodeEditor.css';

class CodeEditor extends Component {
  render() {
    return (
      <div className="CodeEditor">
        <AceEditor
          mode="javascript"
          theme="kuroir"
          fontSize={20}
          width={1000 + 'px'}
          height={1000 + 'px'}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
          value={DEFAULT_CODE}
        />
      </div>
    )
  }
}

const mapStateToProps = appState => ({});
const mapDispatchToProps = {
  saveCode: r_saveCode
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);