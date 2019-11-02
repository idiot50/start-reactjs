import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomAvField, CustomSticky, CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import { convertDateToDDMMYYYYHHMISS, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtTroubleEditWorkLogTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            isAddedWorklog: false,
            tabIndex: null,
            isValidSubmitForm: false
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createUser" />,
                id: "createUserName",
                width: 150,
                accessor: d => <span title={d.createUserName}>{d.createUserName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createUnit" />,
                id: "createUnitName",
                width: 150,
                accessor: d => <span title={d.createUnitName}>{d.createUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createdTime",
                width: 150,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.worklog" />,
                id: "worklog",
                minWidth: 400,
                accessor: d => <span title={d.worklog}>{d.worklog}</span>
            }
        ];
    }

    onFetchData = (state, instance) => {
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

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getWorklogByTroubleId();
        });
    }

    getWorklogByTroubleId = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.troubleId = this.state.selectedData.troubleId;
        this.props.actions.getWorklogByTroubleId(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data || [],
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getWorklog"));
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        // invalidSubmitForm(event, errors, values, "idFormAddOrEditWorklogTab");
        this.setState({
            isValidSubmitForm: false
        }, () => {
            // this.props.onChangeChildTab(this.state.tabIndex, this.state, errors);
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.setState({
            isValidSubmitForm: true
        }, () => {
            // const state = Object.assign({}, this.state);
            // state.dataInfoTab = values;
            // this.props.onChangeChildTab(this.state.tabIndex, state);
        });
        if (values.worklog === "") {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.actionProcess"));
            return;
        }
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const ttTrouble = Object.assign({}, values);
            let content = "";
            if (this.props.parentState.objectInfoTab.selectValuePriority) {
                if (this.props.parentState.objectInfoTab.selectValuePriority.value !== this.state.selectedData.priorityId) {
                    const priorityOld = this.props.parentState.objectInfoTab.ttPriorityList.find(item => item.itemId === this.state.selectedData.priorityId) || {};
                    content = priorityOld.itemName + " -> " + this.props.parentState.objectInfoTab.selectValuePriority.label
                        + ". " + this.props.t("ttTrouble:ttTrouble.message.reasonChange") + ": " + ttTrouble.worklog.trim();
                } else {
                    content = JSON.parse(localStorage.user).userName + " " + convertDateToDDMMYYYYHHMISS(new Date()) +
                    " (GMT +7) : " + ttTrouble.worklog.trim();
                    ttTrouble.worklog = content;
                }
            } else {
                content = JSON.parse(localStorage.user).userName + " " + convertDateToDDMMYYYYHHMISS(new Date()) +
                " (GMT +7) : " + ttTrouble.worklog.trim();
                ttTrouble.worklog = content;
            }
            ttTrouble.worklog = content;
            ttTrouble.troubleId = this.state.selectedData.troubleId;
            ttTrouble.createdTime = new Date();
            this.insertTroubleWorklog(ttTrouble);
        });
    }

    insertTroubleWorklog = (ttTrouble) => {
        this.props.actions.insertTroubleWorklog(ttTrouble).then((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                if (response.payload.data.key === "SUCCESS") {
                    this.myForm.reset();
                    if (this.props.parentState.isReqWorklog) {
                        this.setState({
                            isAddedWorklog: true
                        }, () => {
                            this.props.onChangeChildTab(1, this.state);
                        });
                    }
                    this.getWorklogByTroubleId();
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.addWorklog"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.addWorklog"));
                }
            });
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.addWorklog"));
                }
            });
        });
    }

    getStateChildTab(callback) {
        callback(this.state);
    }

    onSubmitForm(tabIndex) {
        this.setState({
            tabIndex
        }, () => {
            this.myForm.submit();
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        let objectAddOrEdit = this.state.selectedData;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditWorklogTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Card>
                        <CardHeader>
                            {t("ttTrouble:ttTrouble.title.workLog")}
                            <div className="card-header-actions card-header-actions-button-table">
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnAddOrEditLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-save"></i> {t("common:common.button.save")}
                                </LaddaButton>{' '}
                                {/* <Button type="button" color="secondary" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button> */}
                            </div>
                        </CardHeader>
                        <CardBody>
                            <CustomAvField name="worklog" type="textarea" rows="5" label={t("ttTrouble:ttTrouble.label.actionProcess")}
                            placeholder={t("ttTrouble:ttTrouble.placeholder.description")} maxLength="2000" />
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i>{t("ttTrouble:ttTrouble.title.worklogList")}
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

TtTroubleEditWorkLogTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditWorkLogTab));