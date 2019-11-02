import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as OdConfigScheduleCreateActions from './OdConfigScheduleCreateActions';
import OdConfigScheduleCreateAddEdit from "./OdConfigScheduleCreateAddEdit";
import { CustomReactTableSearch, CustomSelect, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { validSubmitForm, confirmAlertDelete } from '../../../containers/Utils/Utils';

class OdConfigScheduleCreateList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchOdConfigScheduleCreate = this.searchOdConfigScheduleCreate.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);
        this.handleItemSelectChangeOdType = this.handleItemSelectChangeOdType.bind(this);
        this.handleItemSelectChangeOdSchedule = this.handleItemSelectChangeOdSchedule.bind(this);
        this.handleItemSelectChangeOdPriority = this.handleItemSelectChangeOdPriority.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);

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
            selectValueOdType: {},
            selectValueOdSchedule: {},
            selectValueOdPriority: {},
            //Import modal
            importModal: false,
            client: null,
            moduleName: null
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("OD_SCHEDULE", "itemId", "itemName", "1", "3");
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("od_cat", "OD_CONFIG_SCHEDULE_CREATE", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }
    
    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.id)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.odName)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.id)}>
                            <Button type="button" size="sm" className="btn-warning icon"><i className="fa fa-copy"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.odName" />,
                id: "odName",
                width: 250,
                accessor: d => <span title={d.odName}>{d.odName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="odName" placeholder={this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.placeholder.odName")}
                    value={this.state.objectSearch.odName} />
                )
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.odDescription" />,
                id: "odDescription",
                width: 300,
                accessor: d => {
                    return d.odDescription ? <span title={d.odDescription}>{d.odDescription}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="odDescription" placeholder={this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.placeholder.workDescription")}
                    value={this.state.objectSearch.odDescription} />
                )
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.odPriorityName" />,
                id: "odPriorityName",
                width: 150,
                accessor: d => <span title={d.odPriorityName}>{d.odPriorityName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"odPriority"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.odPriority && this.props.response.common.odPriority.payload) ? this.props.response.common.odPriority.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdPriority}
                        selectValue={this.state.selectValueOdPriority}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.odTypeName" />,
                id: "odTypeName",
                width: 250,
                accessor: d => <span title={d.odTypeName}>{d.odTypeName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"odTypeId"}
                        label={""}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdType}
                        selectValue={this.state.selectValueOdType}
                        moduleName={"GNOC_OD_TYPE"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.schedule" />,
                id: "schedule",
                minWidth: 200,
                accessor: d => {
                    const value = d.schedule === 1 ? this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.dropdown.schedule.week") :
                    d.schedule === 2 ? this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.dropdown.schedule.month") :
                    d.schedule === 3 ? this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.dropdown.schedule.quarter") : '';
                    return <span title={value}>{value}</span>
                },
                Filter: ({ filter, onChange }) => {
                    let listOdSchedule = (this.props.response.common.odSchedule && this.props.response.common.odSchedule.payload) ? this.props.response.common.odSchedule.payload.data.data : [];
                    for(const obj of listOdSchedule) {
                        obj.itemId = Number.parseInt(obj.itemValue, 10);
                    }
                    return (<CustomSelectLocal
                        name={"schedule"}
                        label={""}
                        isRequired={false}
                        options={listOdSchedule}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdSchedule}
                        selectValue={this.state.selectValueOdSchedule}
                        isOnlyInputSelect={true}
                    />)
                }
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
            this.searchOdConfigScheduleCreate();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        validSubmitForm(event, values, "idFormSearch");
        let obj = values;
        obj.odTypeId = this.state.selectValueOdType.value;
        obj.odPriority = this.state.selectValueOdPriority.value;
        obj.schedule = this.state.selectValueOdSchedule.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchOdConfigScheduleCreate(true);
        });
    }

    searchOdConfigScheduleCreate(isSearchClicked = false) {
        this.props.actions.searchOdConfigScheduleCreate(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.search"));
        });
    }

    openAddOrEditPage(value, id) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value,
                selectedData: {},
                listReceiveUnit: [],
                files: []
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.findOdConfigScheduleCreateById(id).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data,
                        listReceiveUnit: response.payload.data.receiveUnitDTOList,
                        files: value === "EDIT" ? response.payload.data.odFileDTOList : []
                    });
                } else {
                    toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.getDetail"));
            });
        }
    }

    closeAddOrEditPage(isAddOrEdit) {
        this.setState({
            isAddOrEditVisible: false,
            isAddOrEdit: null
        }, () => {
            if (isAddOrEdit === "ADD" || isAddOrEdit === "COPY") {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchOdConfigScheduleCreate();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchOdConfigScheduleCreate();
            }
        });
    }

    confirmDelete(id, name) {
        confirmAlertDelete(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.confirmDelete", { name: name }),
        () => {
            this.props.actions.deleteOdConfigScheduleCreate(id).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchOdConfigScheduleCreate();
                    toastr.success(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.success.delete"));
                } else {
                    toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.delete"));
            });
        });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "od_cat",
            moduleName: "OD_CONFIG_SCHEDULE_CREATE"
        });
    }

    closeImportModal() {
        this.setState({
            importModal: false,
            client: null,
            moduleName: null
        });
    }

    handleItemSelectChangeOdType(option) {
        this.setState({selectValueOdType: option});
    }

    handleItemSelectChangeOdSchedule(option) {
        this.setState({selectValueOdSchedule: option});
    }

    handleItemSelectChangeOdPriority(option) {
        this.setState({selectValueOdPriority: option});
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <OdConfigScheduleCreateAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <div className="animated fadeIn">
                        <AvForm id="idFormSearch" onSubmit={this.search} model={objectSearch}>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                title={t("odConfigScheduleCreate:odConfigScheduleCreate.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                title={t("odType:odType.button.add")}
                                                onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                title={t("odType:odType.button.import")}
                                                onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("odType:odType.button.export")}
                                                    onClick={() => this.onExport()}>
                                                    <i className="fa fa-download"></i>
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
                    </div>
                    <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchOdConfigScheduleCreate}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { odConfigScheduleCreate, common } = state;
    return {
        response: { odConfigScheduleCreate, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdConfigScheduleCreateActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdConfigScheduleCreateList));