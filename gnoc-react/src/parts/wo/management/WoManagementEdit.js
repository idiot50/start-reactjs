import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { Card, Col } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import WoManagementEditInfoTab from './WoManagementEditInfoTab';
import WoManagementEditFileTab from './WoManagementEditFileTab';
import WoManagementEditHistoryTab from './WoManagementEditHistoryTab';
import WoManagementEditCdListTab from './WoManagementEditCdListTab';
import WoManagementEditChecklistTab from './WoManagementEditChecklistTab';
import WoManagementEditCrTab from './WoManagementEditCrTab';
import WoManagementEditWorklogTab from './WoManagementEditWorklogTab';
import WoManagementEditWorkChildTab from './WoManagementEditWorkChildTab';

class WoManagementEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //Tabs
            tabIndex: 0,
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            mapConfigProperty: props.parentState.mapConfigProperty,
            cdList: props.parentState.selectedData.listCd,
            statusList: props.parentState.statusList,
        };
    }
    
    componentDidMount() {
        
    }

    onChangeTab = (tabIndex) => {
        this.setState({
            tabIndex
        });
    }

    render() {
        const { t } = this.props;
        return (
            <Card>
                <Col xs="12" >
                    <Tabs style={{ paddingTop: '15px' }} selectedIndex={this.state.tabIndex} onSelect={this.onChangeTab}>
                        <TabList>
                            <Tab>{t("woManagement:woManagement.title.woInfo")}</Tab>
                            <Tab>{t("woManagement:woManagement.title.fileAttach")}</Tab>
                            <Tab>{t("woManagement:woManagement.title.history")}</Tab>
                            <Tab>{t("woManagement:woManagement.title.cdList")}</Tab>
                            <Tab>{t("woManagement:woManagement.title.checklistInfo")}</Tab>
                            <Tab>{t("woManagement:woManagement.title.cr")}</Tab>
                            <Tab>{t("woManagement:woManagement.title.worklog")}</Tab>
                            <Tab>{t("woManagement:woManagement.title.listChildWo")}</Tab>
                        </TabList>
                        <TabPanel>
                            <WoManagementEditInfoTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <WoManagementEditFileTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <WoManagementEditHistoryTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <WoManagementEditCdListTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <WoManagementEditChecklistTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <WoManagementEditCrTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <WoManagementEditWorklogTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <WoManagementEditWorkChildTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                    </Tabs>
                </Col>
            </Card>
        );
    }
}

WoManagementEdit.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};


function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEdit));