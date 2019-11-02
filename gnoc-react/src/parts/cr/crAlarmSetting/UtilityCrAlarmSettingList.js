import { AvForm } from 'availity-reactstrap-validation';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomInputFilter, CustomReactTableSearch, CustomSelectLocal, ImportModal, SearchBar, SettingTableLocal, CustomInputPopup } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import * as commonActions from './../../../actions/commonActions';
import * as UtilityCrAlarmSettingActions from './UtilityCrAlarmSettingActions';
import UtilityCrAlarmSettingAddEdit from "./UtilityCrAlarmSettingAddEdit";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";
import UtilityCrAlarmSettingPopupVendor from "./UtilityCrAlarmSettingPopupVendor";
import UtilityCrAlarmSettingPopupModule from "./UtilityCrAlarmSettingPopupModule";
import UtilityCrAlarmSettingPopupCrProcess from './UtilityCrAlarmSettingPopupCrProcess';

class UtilityCrAlarmSettingList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityCrAlarmSetting = this.searchUtilityCrAlarmSetting.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.onExport = this.onExport.bind(this);

        this.state = {
            collapseFormInfo: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            //Object Search
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            //AddOrEditPage
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            //Select
            selectValueProcess: {}

        };
    }

    componentDidMount() {
        this.props.actions.getNationMap().then((response) => {
            this.setState({
                nationList: response.payload.data ? Object.keys(response.payload.data).map((i) => ({ itemId: i, itemName: i })) : []
            })
        })
        this.props.actions.checkRole().then((response) => {
            this.setState({
                isSubAdmin: response.payload.data
            })
        })
        this.props.actions.getListImpactSegmentCBB().then((response) => {
            const impactSegmentList = response.payload.data ? response.payload.data.map(i => ({ itemId: i.impactSegmentId, itemName: i.impactSegmentName })) : []
            this.setState({
                impactSegmentList
            })
        })
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.casId, d.crProcessId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1" disabled={this.state.isSubAdmin}><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.casId, d.casId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1" disabled={this.state.isSubAdmin}><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.casId, d.crProcessId)}>
                            <Button type="button" size="sm" className="btn-warning icon" disabled={this.state.isSubAdmin}><i className="fa fa-copy"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.CRProcessName" />,
                id: "crProcessName",
                width: 250,
                accessor: d => {
                    return d.crProcessName ? <span title={d.crProcessName}>{d.crProcessName}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputPopup
                        name={"crProcessName"}
                        label={''}
                        placeholder={this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.doubleClick")}
                        value={this.state.selectValueProcess.label || ""}
                        handleDoubleClick={this.openPopupCrProcess}
                        isOnlyInputSelect={true}
                        handleRemove={() => {}} 
                        isRequired={false}
                        isDisabledDelete={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.faultName" />,
                id: "faultName",
                width: 250,
                accessor: d => {
                    return d.faultName ? <span title={d.faultName}>{d.faultName}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="faultName" placeholder={this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.faultName")}
                        value={this.state.objectSearch.faultName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.vendorCode" />,
                id: "vendorCode",
                width: 200,
                accessor: d => {
                    return d.vendorCode ?
                        <span title={d.vendorCode} style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupVendor(d)}>
                            {d.vendorCode}
                        </span>
                        : <span style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupVendor(d)}>
                            {this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.updateVendor")}
                        </span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="vendorCode" placeholder={this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.vendorCode")}
                        value={this.state.objectSearch.vendorCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.moduleCode" />,
                id: "moduleCode",
                width: 200,
                accessor: d => {
                    return d.moduleCode ?
                        <span title={d.moduleCode} style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupModule()}>
                            {d.moduleCode}
                        </span>
                        : <span style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupModule()}>
                            {this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.updateModule")}
                        </span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="moduleCode" placeholder={this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.moduleCode")}
                        value={this.state.objectSearch.moduleCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.createUser" />,
                id: "createUser",
                width: 200,
                accessor: d => {
                    return d.createdUser ? <span title={d.createdUser}>{d.createdUser}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="createdUser" placeholder={this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.createUser")}
                        value={this.state.objectSearch.createdUser} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.keyword" />,
                id: "keyword",
                width: 200,
                accessor: d => {
                    return d.keyword ? <span title={d.keyword}>{d.keyword}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.NOCDevice" />,
                id: "NOCDevice",
                width: 200,
                accessor: d => {
                    return d.deviceTypeCode ? <span title={d.deviceTypeCode}>{d.deviceTypeCode}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.faultGroupName" />,
                id: "faultGroupName",
                width: 200,
                accessor: d => {
                    return d.faultGroupName ? <span title={d.faultGroupName}>{d.faultGroupName}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
        ];
    }

    toggleFormInfo() {
        this.setState({ collapseFormInfo: !this.state.collapseFormInfo });
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

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchUtilityCrAlarmSetting();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.crProcessId = this.state.selectValueProcess ? this.state.selectValueProcess.value : null
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityCrAlarmSetting(true);
        });
    }

    searchUtilityCrAlarmSetting(isSearchClicked = false) {
        this.props.actions.searchUtilityCrAlarmSetting(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.search"));
        });
    }

    openAddOrEditPage(value, casId, crProcessId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value,
                selectedData: {}
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityCrAlarmSetting({ casId: casId, crProcessId: crProcessId }).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.getDetail"));
            });
        }
    }

    closeAddOrEditPage(isAddOrEdit) {
        this.setState({
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            selectedData: {}
        }, () => {
            if (isAddOrEdit === "ADD" || isAddOrEdit === "COPY") {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchUtilityCrAlarmSetting();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityCrAlarmSetting();
            }
        });
    }

    confirmDelete(casId, faultName) {
        confirmAlertDelete(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.confirmDelete", { faultName: faultName }),
            () => {
                this.props.actions.deleteUtilityCrAlarmSetting(casId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityCrAlarmSetting();
                        toastr.success(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.delete"));
                });
            }
        );
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            const obj = this.state.objectSearch
            delete obj['createUser'];
            delete obj['custom-input-crProcessName']
            this.props.actions.onExportFile("cr_cat", "CR_ALARM_SETTTING", obj).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    closePopupVendor = () => {
        this.setState({
            isOpenPopupVendor: false,
        });
        this.searchUtilityCrAlarmSetting();
    }

    openPopupVendor = (d) => {
        let objectSearch = {
            crAlarmSettingId: d.casId,
            faultId: d.faultId
        }
        this.props.actions.getDetailUtilityCrAlarmSettingByCasId(objectSearch).then((response) => {
            if (response.payload && response.payload.data) {
                this.setState({
                    isOpenPopupVendor: true,
                    selectedData: response.payload.data
                });
            } else {
                toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchVendor"));
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchVendor"));
        });
    }

    closePopupModule = () => {
        this.setState({
            isOpenPopupModule: false,
        });
        this.searchUtilityCrAlarmSetting();
    }

    openPopupModule = (d) => {
        let objectSearch = {
            // crAlarmSettingId: d.casId,
            // faultId: d.faultId
        }
        this.props.actions.getDetailUtilityCrAlarmSettingByCasId(objectSearch).then((response) => {
            if (response.payload && response.payload.data) {
                this.setState({
                    isOpenPopupModule: true,
                    selectedData: response.payload.data
                });
            } else {
                toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchModule"));
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchModule"));
        });
    }

    closePopupCrProcess = () => {
        this.setState({
            isOpenPopupCrProcess: false,
        });
    }

    openPopupCrProcess = () => {
        this.setState({
            isOpenPopupCrProcess: true
        });
    }
    
    setValueProcessCrPopup = (state) => {
        this.setState({ selectValueProcess: state.selectValueProcess})
    }



    render() {
        console.log(this.state.isSubAdmin);
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityCrAlarmSettingAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <div className="animated fadeIn">
                        <AvForm onSubmit={this.search} model={objectSearch}>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                    title={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")} disabled={this.state.isSubAdmin}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.export")}
                                                    onClick={() => this.onExport()}><i className="fa fa-download"></i>
                                                </LaddaButton>
                                                <SettingTableLocal
                                                    columns={columns}
                                                    onChange={this.handleChangeLocalColumnsTable}
                                                />
                                            </div>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.collapseFormInfo} id="collapseFormInfo">
                                            <CardBody>
                                                <CustomReactTableSearch
                                                    onRef={ref => (this.customReactTableSearch = ref)}
                                                    columns={columns}
                                                    data={data}
                                                    pages={pages}
                                                    loading={loading}
                                                    onFetchData={this.onFetchData}
                                                    defaultPageSize={10}
                                                    isCheckbox={false}
                                                />
                                            </CardBody>
                                        </Collapse>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                        <UtilityCrAlarmSettingPopupVendor
                            parentState={this.state}
                            closePopup={this.closePopupVendor}
                        />
                        <UtilityCrAlarmSettingPopupModule
                            parentState={this.state}
                            closePopup={this.closePopupModule}
                        />
                        <UtilityCrAlarmSettingPopupCrProcess
                            parentState={this.state}
                            closePopup={this.closePopupCrProcess}
                            setValue={this.setValueProcessCrPopup}
                        />
                    </div>
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityCrAlarmSetting, common } = state;
    return {
        response: { utilityCrAlarmSetting, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrAlarmSettingActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrAlarmSettingList));