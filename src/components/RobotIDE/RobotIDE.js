import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { getInternalState } from 'selectors/robotSelectors';

import CodeEditor from './CodeEditor/CodeEditor';
import RobotInternalState from './RobotInternalState/RobotInternalState';
import 'react-tabs/style/react-tabs.css';
import './RobotIDE.css';

class RobotIDE extends Component {
  render() {
    return (
      <div className="RobotIDE">
        <Tabs>
          <TabList>
            <Tab>Code Editor</Tab>
            <Tab>Robot memory</Tab>
          </TabList>

          <TabPanel>
            <CodeEditor/>
          </TabPanel>
          <TabPanel>
            <RobotInternalState robotState={this.props.robotState}/>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = appState => ({
  robotState: getInternalState(appState)
});

export default connect(mapStateToProps, {})(RobotIDE);