import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import { CustomReactTable, SettingTableLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import * as PtProblemActions from "./PtProblemActions";
import { convertDateToDDMMYYYYHHMISS, validSubmitForm } from "../../../containers/Utils/Utils";

class PtProblemEditProcessTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);

        this.state = {
            objectSearch: {},
            btnAddOrEditLoading: false,
            //AddOrEditModal
            modalName: props.parentState.modalName,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.executePerson" />,
                id: "createUserName",
                accessor: d => <span title={d.createUserName}>{d.createUserName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.executeUnit" />,
                id: "createUnitName",
                accessor: d => <span title={d.createUnitName}>{d.createUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.handleNote" />,
                id: "worklog",
                accessor: d => <span title={d.worklog}>{d.worklog}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdDate" />,
                id: "createdTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
            },
        ];
    }

    onFetchData(state, instance) {
        let sortName = null;
        let sortType = null;
        if (state.sorted.length > 0) {
            if (state.sorted[0].id !== null && state.sorted[0].id !== undefined) {
                sortName = state.sorted[0].id;
                sortType = state.sorted[0].desc ? "desc" : "asc";
            }
        }

        let values = {
            page: state.page + 1,
            pageSize: state.pageSize,
            sortName: sortName,
            sortType: sortType
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.problemId = this.state.selectedData.problemId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListProblemWorklog();
        });
    }

    getListProblemWorklog(isSearchClicked = false) {
        this.props.actions.getListProblemWorklog(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getWorkLog"));
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEditProcessTab");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (values.worklog.trim() === "") {
                this.setState({
                    btnAddOrEditLoading: false
                });
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.workLog"));
                return;
            }
            const workLog = values;
            workLog.worklog = workLog.worklog.trim();
            workLog.createUserId = this.state.selectedData.createUserId;
            workLog.createUserName = this.state.selectedData.createUserName;
            workLog.createUnitId = this.state.selectedData.createUnitId;
            workLog.createUnitName = this.state.selectedData.createUnitName;
            workLog.problemId = this.state.selectedData.problemId;
            workLog.createdTime = new Date();
            this.props.actions.insertProblemWorklog(workLog).then((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    this.getListProblemWorklog();
                    if (response.payload.data.key === "SUCCESS") {
                        this.myFormRef.reset();
                        toastr.success(this.props.t("ptProblem:ptProblem.message.success.addWorkLog"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.addWorkLog"));
                    }
                });
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    try {
                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                    } catch (error) {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.addWorkLog"));
                    }
                });
            });
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        let objectProcess = {};
        return (
            <div>
                <div className="animated fadeIn">
                    <AvForm id="idFormAddOrEditProcessTab" onValidSubmit={this.handleValidSubmitAddOrEdit} model={objectProcess} ref={el => this.myFormRef = el}>
                        <Card>
                            <CustomSticky level={1}>
                                <CardHeader>
                                    <i className="fa fa-plus-justify"></i>{t("ptProblem:ptProblem.label.handleNote")}
                                    <div className="card-header-actions card-header-actions-button">
                                        <LaddaButton type="submit"
                                            className="btn btn-primary btn-md mr-2"
                                            loading={this.state.btnAddOrEditLoading}
                                            data-style={ZOOM_OUT}>
                                            <i className="fa fa-save"></i> {t("ptProblem:ptProblem.button.saveProcess")}
                                        </LaddaButton>
                                        <Button type="button" color="secondary" onClick={(e) => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                    </div>
                                </CardHeader>
                            </CustomSticky>
                            <CardBody>
                                <CustomAvField name="worklog" type="textarea" rows="3" maxLength="4000" />
                            </CardBody>
                        </Card>
                    </AvForm>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-align-justify"></i>{t('ptProblem:ptProblem.title.issueList')}
                                    <div className="card-header-actions">
                                        <SettingTableLocal
                                            columns={columns}
                                            onChange={this.handleChangeLocalColumnsTable}
                                        />
                                    </div>
                                </CardHeader>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

PtProblemEditProcessTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditProcessTab));