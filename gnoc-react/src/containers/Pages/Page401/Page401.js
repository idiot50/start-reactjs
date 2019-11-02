import React, { Component } from 'react';
import { Button, Col, Container, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Auth actions
import * as authActions from '../../../actions/authActions';
import { translate, Trans } from 'react-i18next';

class Page401 extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onSignOut() {
    this.props.actions.onLogoutVsa();
  }

  render() {
    return (
      localStorage.getItem('is_authenticated') === "true" ?
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">401</h1>
                <h4 className="pt-3"><Trans i18nKey="common:common.page.401.title"/></h4>
                <p className="text-muted float-left"><Trans i18nKey="common:common.page.401.message"/></p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="4">
              <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-sign-out"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon addonType="append">
                  <Button color="info" onClick={() => this.onSignOut()}><Trans i18nKey="common:common.page.401.signOut"/></Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
      :
      <div className="animated fadeIn text-center" style={{paddingTop: '40vh'}}>
        <div className="sk-three-bounce">
          <div className="sk-child sk-bounce1"></div>
          <div className="sk-child sk-bounce2"></div>
          <div className="sk-child sk-bounce3"></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
      response: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(authActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Page401));
