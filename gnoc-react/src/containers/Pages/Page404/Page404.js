import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { translate, Trans } from 'react-i18next';

class Page404 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  onChange(value) {
    this.setState({
      value
    });
  }

  onSearch() {
    window.location = "https://www.google.com/search?q="+ this.state.value +"&ie=UTF-8";
  }

  render() {
    const { t } = this.props;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">404</h1>
                <h4 className="pt-3"><Trans i18nKey="common:common.page.404.title"/></h4>
                <p className="text-muted float-left"><Trans i18nKey="common:common.page.404.message"/> <a href="/"><Trans i18nKey="common:common.page.404.goBackHome"/></a></p>
              </div>
              <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input size="16" type="text" placeholder={t('common:common.page.404.inputSearchPlaceholder')} 
                  onChange={(e) => this.onChange(e.target.value)}/>
                <InputGroupAddon addonType="append">
                  <Button color="info" onClick={() => this.onSearch()}><Trans i18nKey="common:common.page.404.buttonSearch"/></Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default translate()(Page404);
