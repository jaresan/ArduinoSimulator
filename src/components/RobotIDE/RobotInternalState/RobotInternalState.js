import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { AutoSizer } from 'react-virtualized';

import 'brace/theme/kuroir';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import '../CodeEditor/CodeEditor.css';

class RobotInternalState extends Component {
  render() {
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
                  height={height + 'px'}
                  showPrintMargin={true}
                  showGutter={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                  readOnly
                  value={JSON.stringify(this.props.robotState, null, 2)}
                  editorProps={{$blockScrolling: Infinity}}
                />
              </div>
            )
          }}
        </AutoSizer>
      </div>
    );
  }
}

export default RobotInternalState;
