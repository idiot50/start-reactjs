import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span><a href="http://10.240.203.2:8180/spqtnv/gnoc/front-end-gnoc-developer.git">VIETTEL</a> &copy; 2018 creativeLabs.</span>
        {/* <span className="ml-auto">Powered by <a href="http://10.240.203.2:8180/spqtnv/gnoc/front-end-gnoc-developer.git">VTNET-VIETTEL</a></span> */}
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
