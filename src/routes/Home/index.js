import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import * as actionCreators from './actions';

import View from './View';

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
