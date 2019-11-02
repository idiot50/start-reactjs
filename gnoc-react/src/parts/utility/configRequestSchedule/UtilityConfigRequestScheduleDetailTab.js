import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigRequestScheduleActions from './UtilityConfigRequestScheduleActions';
import { CustomReactTableLocal } from "../../../containers/Utils";
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';



class UtilityConfigRequestScheduleDetailTab extends Component {
    constructor(props) {
        super(props);
        //tab
        this.setTabIndex = this.setTabIndex.bind(this);
        this.handleOnChangeChildTab = this.handleOnChangeChildTab.bind(this);
        this.exportCrBeforeScheduling = this.exportCrBeforeScheduling.bind(this);
        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.state = {
            collapseFormInfo: true,
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            btnExportLoading: false,
            loading: false,
            //AddOrEditModal
            isDetail: props.parentState.isDetail,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            listOfCRColumns: this.buildListOfCRColumns(),
            listOfEmployeeColumns: this.buildListOfEmployeeColumns(),
            //Select
            selectEmployeeList: [],
            selectCRBeforeList: [],
            objectSearch: {}

        };
    }

    setTabIndex(index) {
        this.setState({
            tabIndex: index
        });
    }

    handleOnChangeChildTab(state) {
        switch (this.state.tabIndex) {
            case 4:
                this.setState({
                    objectTab: state
                });
                break;
            default:
                break;
        }
    }
    componentWillMount() {
        const listCRBefore = Object.assign({}, this.state.selectedData);
        listCRBefore.scheduleEmployeeDTOS = [];
        listCRBefore.scheduleCRFormDTOS = [];
        listCRBefore.pdfDay = this.state.selectedData.startDate;
        this.setState({
            loading: true
        }, () => {
            this.props.actions.getCRBefore(listCRBefore).then((response) => {
                const listEmp = (response.payload.data.scheduleEmployeeDTOS) ? response.payload.data.scheduleEmployeeDTOS : [];
                const listCr = (response.payload.data.scheduleCRFormDTOS) ? response.payload.data.scheduleCRFormDTOS : [];
                console.log(listCr)
                this.setState({ 
                    selectCRBeforeList: listCr, 
                    selectEmployeeList: listEmp, 
                    loading: false
                })
            });
        });
    }

    componentWillUnmount() {
        this.setState({
            isDetail: null
        });
    }

    buildListOfCRColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.codeCR" />,
                id: "codeCR",
                accessor: d => {
                    return d.codeCR ? <span title={d.codeCR}>{d.codeCR}</span> : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.array" />,
                id: "array",
                accessor: d => {
                    return d.array ? <span title={d.array}>{d.array}</span> : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.arrayChild" />,
                id: "arrayChild",
                accessor: d => {
                    return d.arrayChild ? <span title={d.arrayChild}>{d.arrayChild}</span> : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.startDate" />,
                id: "startDate",
                accessor: d => {
                    return (d.startDate) ? <span title={convertDateToDDMMYYYYHHMISS(d.startDate)}>{convertDateToDDMMYYYYHHMISS(d.startDate).slice(0, 10)}</span> : ""
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.endDate" />,
                id: "endDate",
                accessor: d => {
                    return (d.endDate) ? <span title={convertDateToDDMMYYYYHHMISS(d.endDate)}>{convertDateToDDMMYYYYHHMISS(d.endDate).slice(0, 10)}</span> : ""
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.forbiddenDate" />,
                id: "forbiddenDate",
                accessor: d => {
                    return (d.forbiddenDate) ? <span title={convertDateToDDMMYYYYHHMISS(d.forbiddenDate)}>{convertDateToDDMMYYYYHHMISS(d.forbiddenDate).slice(0, 10)}</span> : ""
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.nodeImpactList" />,
                id: "nodeImpactList",
                accessor: d => {
                    return d.nodeImpactList ? <span title={d.nodeImpactList}>{d.nodeImpactList}</span> : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.serviceImpactList" />,
                accessor: "affectServiceList",
                id: d => {
                    return d.affectServiceList ? <span title={d.affectServiceList}>{d.affectServiceList}</span> : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.levelOfdiffcult" />,
                id: "crLevel",
                accessor: d => {
                    return d.crLevelName ? <span title={d.crLevelName}>{d.crLevelName}</span> : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.implementationTime" />,
                id: "executionTime",
                accessor: d => {
                    return d.executionTime ? <span title={d.executionTime}>{d.executionTime}</span> : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.prioritize" />,
                id: "crPrioritize",
                accessor: d => {
                    return d.crPrioritizeName ? <span title={d.crPrioritizeName}>{d.crPrioritizeName}</span> : <span>&nbsp;</span>
                },
            }
        ];
    }

    buildListOfEmployeeColumns() {
        return [

            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.employee" />,
                id: "nameDisplay",
                accessor: d => {
                    return d.nameDisplay ? <span title={d.nameDisplay}>{d.nameDisplay}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.arrayChild" />,
                id: "arrayChildName",
                accessor: d => {
                    return d.arrayChildName ? <span title={d.arrayChildName}>{d.arrayChildName}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.level" />,
                id: "empLevel",
                width: 120,
                accessor: d => {
                    return d.empLevel ? <span title={d.empLevel}>{d.empLevel}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.workingDay" />,
                id: "workingDay",
                width: 500,
                accessor: d => {
                    return d.workingDay ? <span title={d.workingDay}>{d.workingDay}</span> : <span>&nbsp;</span>
                }
            },
        ];

    }
    toggleFormInfo() {
        this.setState({ collapseFormInfo: !this.state.collapseFormInfo });
    }

    onChangeRowProcessTime(newValue, object) {
        //Set into data
        const data = [...this.state.data];
        for (const obj of data) {
            if (obj.itemId === object.itemId) {
                obj.processTime = newValue;
                break;
            }
        }
        this.setState({
            data
        });
    }

    onChangeRow(newValue, object, fieldName) {
        const selectCRBeforeList = [...this.state.selectCRBeforeList];
        for (const obj of selectCRBeforeList) {
            if (obj.id === object.id) {
                obj[fieldName] = newValue;
                break;
            }
        }
        this.setState({
            selectCRBeforeList
        });
    }
    onChangeCheckbox(newValue, object) {
        const selectCRBeforeList = [...this.state.selectCRBeforeList];
        for (const obj of selectCRBeforeList) {
            if (obj.id === object.id) {
                if (newValue) {
                    obj.fixedDay = 1
                } else {
                    obj.fixedDay = 0
                }
                break;
            }
        }
        this.setState({
            selectCRBeforeList
        });
    }
    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    exportCrBeforeScheduling() {
        const objectExport = Object.assign({}, this.state.selectedData);
        objectExport.scheduleEmployeeDTOS = [];
        objectExport.scheduleCRFormDTOS = [];
        objectExport.pdfDay = this.state.selectedData.startDate;
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("stream", "EXPORT_SCHEDULE_CR_BEFORE", objectExport).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }
    render() {
        const { selectEmployeeList, selectCRBeforeList } = this.state;
        const { t } = this.props;
        const { pages, loading } = this.state;
        let objectDetail = this.state.isDetail === "DETAIL" ? this.state.selectedData : {};
        const { listOfCRColumns, listOfEmployeeColumns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormDetail" model={objectDetail}>
                    <Row>
                        <Col xs="12">
                            <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">

                                <Row>
                                    <Col xs="12" sm="12">
                                        <Card>
                                            <CardBody>
                                                <Row >
                                                    <Col xs="12" sm="12">
                                                        <Card>
                                                            <CardHeader>
                                                                <i className="fa fa-align-justify"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.listOfEmployee")}
                                                            </CardHeader>
                                                            <CustomReactTableLocal
                                                                columns={listOfEmployeeColumns}
                                                                data={selectEmployeeList}
                                                                loading={loading}
                                                                defaultPageSize={5}
                                                                showPagination={true}
                                                                isContainsAvField={true}
                                                            />
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row >
                                                    <Col xs="12" sm="12">
                                                        <LaddaButton type="button"
                                                            title={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.show")}
                                                            style={{ marginBottom: '10px' }}
                                                            color="primary"
                                                            className="btn btn-primary btn-md mr-1"
                                                            loading={this.state.btnExportLoading}
                                                            onClick={() => this.exportCrBeforeScheduling()}
                                                            data-style={ZOOM_OUT}
                                                        >
                                                            <i className="fa fa-plus"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.exportCRBefore")}
                                                        </LaddaButton>{' '}
                                                        <Card>
                                                            <CardHeader>
                                                                <i className="fa fa-align-justify"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.listOfCR")}
                                                            </CardHeader>
                                                            <CustomReactTableLocal
                                                                columns={listOfCRColumns}
                                                                data={selectCRBeforeList}
                                                                pages={pages}
                                                                loading={loading}
                                                                onFetchData={this.onFetchData}
                                                                defaultPageSize={10}
                                                            />
                                                        </Card>

                                                    </Col>
                                                </Row>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Collapse>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

UtilityConfigRequestScheduleDetailTab.propTypes = {
    // closeDetailPage: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigRequestScheduleDetailTab));