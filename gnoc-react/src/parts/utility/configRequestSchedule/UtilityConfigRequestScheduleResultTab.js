import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigRequestScheduleActions from './UtilityConfigRequestScheduleActions';
import { CustomReactTableLocal, CustomAvField, CustomDatePicker } from "../../../containers/Utils";
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';



class UtilityConfigRequestScheduleResultTab extends Component {
    constructor(props) {
        super(props);
        //tab
        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.typing = 0;
        // this.onFetchData = this.onFetchData.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isDetail: props.parentState.isDetail,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            loading: true,
            listOfScheduledCR: this.buildListOfScheduledCR(),
            listOfUnscheduledCR: this.buildListOfUnscheduledCR(),
            //Select
            selectCRAfterList: [],
            selectCRBeforeList: [],
            objectSearch: {}


        };
    }

    componentWillMount() {
        const listCRAfter = Object.assign({}, this.state.selectedData);
        listCRAfter.scheduleEmployeeDTOS = [];
        listCRAfter.scheduleCRFormDTOS = [];
        listCRAfter.pdfDay = this.state.selectedData.startDate;
        this.props.actions.searchCRAfter(listCRAfter).then((response) => {
            const listCr = response.payload.data || [];
            this.setState({
                selectCRAfterList: listCr,
                loading: false
            },()=>{
                this.props.onChangeChildTab(2, this.state);
            });
        });

        this.props.actions.searchCRAfterFail(listCRAfter).then((response) => {
            const listCr = response.payload.data || [];
            this.setState({
                selectCRBeforeList: listCr,
                loading: false
            });
        });
    }

    componentWillUnmount() {
        this.setState({
            isDetail: null
        });
    }

    buildListOfUnscheduledCR() {
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
                    return d.crLevel ? <span title={d.crLevel}>{d.crLevel}</span> : <span>&nbsp;</span>
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
                    return d.crPrioritize ? <span title={d.crPrioritize}>{d.crPrioritize}</span> : <span>&nbsp;</span>
                },
            }
        ];
    }

    buildListOfScheduledCR() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.fixedDay" />,
                id: "isFixedDay",
                minWidth: 150,
                className: 'text-center',
                Cell: ({ original }) => {
                    return (
                        <span>
                            <input
                                type="checkbox"
                                value={original.isFixedDay || false}
                                onClick={(e) => this.onChangeCheckbox(e.target.checked, original)}
                                name={"input-checkbox" + original.idCr} checked={original.isFixedDay} />
                        </span>
                    )
                }

            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.codeCR" />,
                id: "codeCR",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.codeCR ? <span title={original.codeCR}>{original.codeCR}</span> : <span>&nbsp;</span>
                }

            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.array" />,
                id: "array",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.array ? <span title={original.array}>{original.array}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.arrayChild" />,
                id: "arrayChild",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.arrayChild ? <span title={original.arrayChild}>{original.arrayChild}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.startDate" />,
                id: "startDate",
                minWidth: 150,
                Cell: ({ original }) => {
                    return (
                        <CustomDatePicker
                            readOnly={!original.isFixedDay}
                            name={"input-StartDate" + original.idCr}
                            label={""}
                            isRequired={original.isFixedDay ? true : false}
                            handleOnChange={(e) => this.onChangeRow(e, original, 'startDate')}
                            dateFormat="dd-MM-yyyy"
                            showTimeSelect={false}
                            selected={(original && original.startDate) ? new Date(original.startDate) : ""}
                            placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.createFrom")}
                            isOnlyInputSelect={true}
                        />
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.endDate" />,
                id: "endDate",
                minWidth: 150,
                Cell: ({ original }) => {
                    return (
                        <CustomDatePicker
                            readOnly={!original.isFixedDay}
                            name={"input-EndDate" + original.idCr}
                            label={""}
                            isRequired={false}
                            handleOnChange={(e) => this.onChangeRow(e, original, 'endDate')}
                            dateFormat="dd-MM-yyyy"
                            showTimeSelect={false}
                            selected={(original && original.endDate) ? new Date(original.endDate) : ""}
                            placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.createTo")}
                            isOnlyInputSelect={true}
                        />
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.forbiddenDate" />,
                id: "forbiddenDate",
                minWidth: 150,
                Cell: ({ original }) => {
                    return (
                        (original.isFixedDay) ?
                            <CustomAvField name={"input-ForbiddenDate" + original.idCr} value={original.forbiddenDate}
                                placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.forbiddenDate")}
                                onChange={(e) => this.onChangeRow(e.target.value, original, 'forbiddenDate')}
                                maxLength="500"
                                validate={{
                                    pattern: { value: '^(([0-9]{2})-([0-9]{2})-([0-9]{4})+(;*))+$', errorMessage: this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.wrongFormatForbiddenDate") },
                                    required: { value: true, errorMessage: this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredForbiddenDate") }
                                }}
                            />
                            : null
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.nodeImpactList" />,
                id: "nodeImpactList",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.nodeImpactList ? <span title={original.nodeImpactList}>{original.nodeImpactList}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.serviceImpactList" />,
                id: "affectServiceList",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.affectServiceList ? <span title={original.affectServiceList}>{original.affectServiceList}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.levelOfdiffcult" />,
                id: "crLevel",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.crLevel ? <span title={original.crLevel}>{original.crLevel}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.implementationTime" />,
                id: "implementationTime",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.implementationTime ? <span title={original.implementationTime}>{original.implementationTime}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.prioritize" />,
                id: "prioritize",
                minWidth: 150,
                Cell: ({ original }) => {
                    return original.prioritize ? <span title={original.prioritize}>{original.prioritize}</span> : <span>&nbsp;</span>
                }
            }
        ];
    }

    onChangeCheckbox(newValue, object) {
        const selectCRAfterList = [...this.state.selectCRAfterList];
        for (const obj of selectCRAfterList) {
            if (obj.idCr === object.idCr) {
                if (newValue) {
                    obj.isFixedDay = 1
                } else {
                    obj.isFixedDay = 0
                }
                break;
            }
        }
        this.setState({
            selectCRAfterList
        }, () => {
            this.props.onChangeChildTab(2, this.state);
        });
    }

    onChangeRow(newValue, object, fieldName) {
        if (this.typing) {
            clearTimeout(this.typing)
        }
        this.typing = setTimeout(() => {
            const selectCRAfterList = [...this.state.selectCRAfterList];
            for (const obj of selectCRAfterList) {
                if (obj.idCr === object.idCr) {
                    obj[fieldName] = newValue;
                    break;
                }
            }
            this.setState({
                selectCRAfterList
            }, () => {
                this.props.onChangeChildTab(2, this.state);
            });
        }, 100);
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    render() {

        const { t } = this.props;
        const { loading } = this.state;
        let objectDetail = this.state.isDetail === "DETAIL" ? this.state.selectedData : {};
        const { listOfScheduledCR, listOfUnscheduledCR, selectCRBeforeList, selectCRAfterList } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormDetail" model={objectDetail} onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} ref={(ref) => this.myForm = ref}>
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
                                                                <i className="fa fa-align-justify"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.listOfScheduledCR")}
                                                            </CardHeader>
                                                            <CustomReactTableLocal
                                                                columns={listOfScheduledCR}
                                                                data={selectCRAfterList}
                                                                loading={loading}
                                                                defaultPageSize={10}
                                                                showPagination={true}
                                                                isContainsAvField={true}
                                                            />
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row >
                                                    <Col xs="12" sm="12">

                                                        <Card>
                                                            <CardHeader>
                                                                <i className="fa fa-align-justify"></i>{t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.listOfUnscheduledCR")}
                                                            </CardHeader>
                                                            <CustomReactTableLocal
                                                                columns={listOfUnscheduledCR}
                                                                data={selectCRBeforeList}
                                                                loading={loading}
                                                                defaultPageSize={5}
                                                                showPagination={true}
                                                                isContainsAvField={true}
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

UtilityConfigRequestScheduleResultTab.propTypes = {
    // closeDetailPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigRequestScheduleResultTab));