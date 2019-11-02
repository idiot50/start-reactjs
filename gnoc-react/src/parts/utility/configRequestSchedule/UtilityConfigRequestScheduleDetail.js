import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigRequestScheduleActions from './UtilityConfigRequestScheduleActions';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import UtilityConfigRequestScheduleGeneralDetailTab from './UtilityConfigRequestScheduleGeneralDetailTab';
import UtilityConfigRequestScheduleDetailTab from './UtilityConfigRequestScheduleDetailTab';
import UtilityConfigRequestScheduleResultTab from './UtilityConfigRequestScheduleResultTab';
import "react-tabs/style/react-tabs.css";
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
class UtilityConfigRequestScheduleDetail extends Component {
    constructor(props) {
        super(props);
        //tab
        this.setTabIndex = this.setTabIndex.bind(this);
        this.handleOnChangeChildTab = this.handleOnChangeChildTab.bind(this);
        this.state = {
            isDetail: props.parentState.isDetail,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            selectValueOdGroupTypeId: {},
            //tab
            tabIndex: 0,
            objectResultTab: {}
        };
    }

    setTabIndex(index) {
        this.setState({
            tabIndex: index
        });
    }

    componentWillMount() {
    }

    handleOnChangeChildTab(index, state) {
        switch (index) {
            case 2:
                this.setState({
                    objectResultTab: state
                });
                break;
            default:
                break;
        }
    }

    componentWillUnmount() {
        this.setState({
            isDetail: null
        });
    }

    exportCRAfter() {
        const crAfterList = [];
        for (const obj of this.state.objectResultTab.selectCRAfterList) {
            let crList = {
                idCr: obj.idCr,
                startDate: obj.startDate,
                endDate: obj.endDate,
                forbiddenDate: obj.forbiddenDate,
                isFixedDay: obj.isFixedDay
            };
            crAfterList.push(crList);
        }
        const objectExport ={};
        objectExport.idSchedule = this.state.selectedData.idSchedule;
        objectExport.crAfterList = crAfterList;
        objectExport.scheduleEmployeeDTOS = [];
        objectExport.scheduleCRFormDTOS = [];
        objectExport.pdfDay = this.state.selectedData.startDate;
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("stream", "EXPORT_SCHEDULE_CR_AFTER", objectExport).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }
    render() {
        const { t } = this.props;
        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.title.detail")}
                </CardHeader>
                <Col xs="12" >
                    <Tabs style={{ paddingTop: '15px' }} selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                        <TabList>
                            <Tab>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.title.infoTab")}</Tab>
                            <Tab>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.title.schedulingDetails")}</Tab>
                            <Tab>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.title.result")}</Tab>
                            <div className="card-header-actions card-header-actions-button">
                            {
                            (this.state.tabIndex + "" === "2")?
                                <span>
                                <LaddaButton type="button"
                                    title={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.exportCrAfter")}
                                    color="primary"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnExportLoading}
                                    onClick={() => this.exportCRAfter()}
                                    data-style={ZOOM_OUT}
                                ><i className="fa fa-plus"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.exportCrAfter")}</LaddaButton>
                                <Button type="button" color="primary" className="btn btn-primary btn-md mr-1"
                                    title={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.approveCr")}
                                    onClick={() => this.approveCR()}><i className="fa fa-plus"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.approveCr")}</Button>
                                </span>:''
                            }
                            <Button type="button" color="secondary" onClick={this.props.closeDetailPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>    
                            </div>
                        </TabList>
                        <TabPanel>
                            <UtilityConfigRequestScheduleGeneralDetailTab
                                closePage={this.props.closeDetailPage}
                                parentState={this.state}
                                setTabIndex={this.setTabIndex} />
                        </TabPanel>
                        <TabPanel>
                            <UtilityConfigRequestScheduleDetailTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <UtilityConfigRequestScheduleResultTab
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab} />
                        </TabPanel>
                       
                    </Tabs>
                </Col>
            </Card>
        );
    }
}

UtilityConfigRequestScheduleDetail.propTypes = {
    closeDetailPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigRequestSchedule, common } = state;
    return {
        response: { utilityConfigRequestSchedule, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigRequestScheduleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigRequestScheduleDetail));