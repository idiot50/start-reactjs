import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { Card, CardHeader, Col } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../../actions/commonActions';
import * as PtProblemActions from './PtProblemActions';
import PtProblemEditCrTab from "./PtProblemEditCrTab";
import PtProblemEditFileTab from "./PtProblemEditFileTab";
import PtProblemEditHistoryTab from "./PtProblemEditHistoryTab";
import PtProblemEditInfoTab from "./PtProblemEditInfoTab";
import PtProblemEditKedbTab from "./PtProblemEditKedbTab";
import PtProblemEditNodeTab from "./PtProblemEditNodeTab";
import PtProblemEditProcessTab from "./PtProblemEditProcessTab";
import PtProblemEditPtTab from "./PtProblemEditPtTab";
import PtProblemEditWoTab from "./PtProblemEditWoTab";
import PtProblemEditTtTab from "./PtProblemEditTtTab";

class PtProblemEdit extends Component {
    constructor(props) {
        super(props);

        this.setTabIndex = this.setTabIndex.bind(this);
        this.handleOnChangeChildTab = this.handleOnChangeChildTab.bind(this);

        this.state = {
            //Tabs
            tabIndex: 0,
            selectedData: props.parentState.selectedData,
            objectKedbTab: {}
        };
    }

    setTabIndex(index) {
        this.setState({
            tabIndex: index
        });
    }

    handleOnChangeChildTab(state) {
        switch (this.state.tabIndex) {
            case 8:
                this.setState({
                    objectKedbTab: state
                });
                break;
            default:
                break;
        }
    }

    render() {
        const { t } = this.props;
        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i>{t("ptProblem:ptProblem.title.update")}
                </CardHeader>
                <Col xs="12" >
                    <Tabs style={{ paddingTop: '15px' }} selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                        <TabList>
                            <Tab>{t("ptProblem:ptProblem.title.infoTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.processTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.fileTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.nodeTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.crTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.woTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.ptTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.ttTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.kedbTab")}</Tab>
                            <Tab>{t("ptProblem:ptProblem.title.historyTab")}</Tab>
                        </TabList>
                        <TabPanel>
                            <PtProblemEditInfoTab
                                closePage={this.props.closePage}
                                parentState={this.state}
                                setTabIndex={this.setTabIndex} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditProcessTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditFileTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditNodeTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditCrTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditWoTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditPtTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditTtTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <PtProblemEditKedbTab
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab} />
                        </TabPanel>
                        <TabPanel>
                            <PtProblemEditHistoryTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                    </Tabs>
                </Col>
            </Card>
        );
    }
}

PtProblemEdit.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};


function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEdit));