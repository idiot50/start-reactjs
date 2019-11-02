import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { validSubmitForm, invalidSubmitForm, convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import { CustomSticky, CustomReactStepperHorizontal, CustomAvField, CustomAppSwitch, CustomReactTable, SettingTableLocal } from '../../../containers/Utils';

class WoManagementEditWorklogTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            isAddOrEdit: null,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns()
        };
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woWorklogContent" />,
                id: "woWorklogContent",
                accessor: d => {
                    return d.woWorklogContent ? <span title={d.woWorklogContent}>{d.woWorklogContent}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.usernameWorklog" />,
                id: "username",
                accessor: d => <span title={d.username}>{d.username}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woSystem" />,
                id: "woSystem",
                accessor: d => <span title={d.woSystem}>{d.woSystem}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woSystemId" />,
                id: "woSystemId",
                accessor: d => {
                    return d.woSystemId ? <span title={d.woSystemId}>{d.woSystemId}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.updateTimeWorklog" />,
                id: "updateTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.updateTime)}>{convertDateToDDMMYYYYHHMISS(d.updateTime)}</span>
            }
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
            sortName: sortName ? sortName : null,
            sortType: sortType ? sortType : null
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.woId = this.state.selectedData.woId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListWorklogByWoId();
        });
    }

    getListWorklogByWoId() {
        this.props.actions.getListWorklogByWoId(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("woManagement:woManagement.message.error.getWorklog"));
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        if (values.woWorklogContent === "") {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.worklog"));
            return;
        }
        validSubmitForm(event, values, "idFormAddOrEditWorklogTab");
        const woManagement = Object.assign({}, this.state.selectedData, values);
        woManagement.woWorklogContent = woManagement.woWorklogContent ? woManagement.woWorklogContent.trim() : "";
        this.props.actions.insertWoWorklog(woManagement).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.getListWorklogByWoId();
                toastr.success(this.props.t("woManagement:woManagement.message.success.addWorklog"));
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.addWorklog"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("woManagement:woManagement.message.error.addWorklog"));
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEditWorklogTab");
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectAddOrEdit = {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditWorklogTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Card>
                        <CustomSticky level={1}>
                            <CardHeader>
                                <i className="fa fa-plus-justify"></i>{t("woManagement:woManagement.title.worklog")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    <Button type="submit" color="primary" className="mr-1">
                                        <i className="fa fa-plus-circle"></i> {t("woManagement:woManagement.button.add")}
                                    </Button>
                                    <Button type="button" color="secondary" onClick={() => this.props.closePage('PROCESS')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                </div>
                            </CardHeader>
                        </CustomSticky>
                        <CardBody>
                            <CustomAvField type="textarea" rows="3" name="woWorklogContent" label={t("woManagement:woManagement.label.worklog")}
                                placeholder={t("woManagement:woManagement.placeholder.worklog")} maxLength="2000" />
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i>{t("woManagement:woManagement.title.worklog")}
                            <div className="card-header-actions card-header-actions-button-table">
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
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
                </AvForm>
            </div>
        );
    }
}

WoManagementEditWorklogTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditWorklogTab));