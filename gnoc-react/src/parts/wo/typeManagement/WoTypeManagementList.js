import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as WoTypeManagementActions from './WoTypeManagementActions';
import WoTypeManagementAddEdit from "./WoTypeManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import WoTypeManagementConfigPriority from './WoTypeManagementConfigPriority';
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class WoTypeManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoTypeManagement = this.searchWoTypeManagement.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openPage = this.openPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.closeConfigPage = this.closeConfigPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
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
            isConfig: false,
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectValueWoGroupName: {},
            selectValueStatus: {},
            listWoGroupType: [],
            selectValueIsCreated: {},
            selectValueIsAllowPause: {},
            selectValueAllowManualCreate: {},
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("WO_PRIORITY_CODE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("WO_GROUP_TYPE", "itemId", "itemName", "1", "3").then((res) => {
            this.setState({
                listWoGroupType: (res.payload && res.payload.data) ? res.payload.data.data : []
            })
        })
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 180,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openPage("EDIT", d.woTypeId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.woTypeId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openPage("COPY", d.woTypeId)}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1"><i className="fa fa-copy"></i></Button>
                        </span>
                        <span title={this.props.t("woTypeManagement:woTypeManagement.button.require")} onClick={() => this.openPage("PRIORITY", d.woTypeId)}>
                            <Button type="button" size="sm" className="btn-success icon"><i className="fa fa-bar-chart"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.woTypeCode" />,
                id: "woTypeCode",
                minWidth: 250,
                accessor: d => {
                    return d.woTypeCode ? <span title={d.woTypeCode}>{d.woTypeCode}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="woTypeCode" placeholder={this.props.t("woTypeManagement:woTypeManagement.placeholder.woTypeCode")}
                        value={this.state.objectSearch.woTypeCode} />
                )
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.woGroupName" />,
                id: "woGroupTypeName",
                minWidth: 250,
                accessor: d => {
                    return d.woGroupTypeName ? <span title={d.woGroupTypeName}>{d.woGroupTypeName}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"woGroupTypeName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listWoGroupType}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeWoGroupName}
                        selectValue={this.state.selectValueWoGroupName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.woTypeName" />,
                id: "woTypeName",
                minWidth: 250,
                accessor: d => {
                    return d.woTypeName ? <span title={d.woTypeName}>{d.woTypeName}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="woTypeName" placeholder={this.props.t("woTypeManagement:woTypeManagement.placeholder.woTypeName")}
                        value={this.state.objectSearch.woTypeName} />
                )
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.status" />,
                id: "isEnable",
                minWidth: 200,
                accessor: d => {
                    return (d.isEnable !== null) ? <span title={d.isEnable}>{d.isEnable === 1 ? this.props.t("woTypeManagement:woTypeManagement.dropdown.status.active") : this.props.t("woTypeManagement:woTypeManagement.dropdown.status.inActive")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"isEnable"}
                        label={""}
                        isRequired={false}
                        options={[
                            { itemId: 1, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.status.active") },
                            { itemId: 0, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.status.inActive") }
                        ]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeStatus}
                        selectValue={this.state.selectValueStatus}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.allowManualCreate" />,
                id: "enableCreate",
                minWidth: 200,
                accessor: d => {
                    return d.enableCreate !== null ? <span title={d.enableCreate}>{d.enableCreate === 1 ? this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.allow") : this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.notAllow")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"enableCreate"}
                        label={""}
                        isRequired={false}
                        options={[
                            { itemId: 1, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.allow") },
                            { itemId: 0, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.notAllow") }
                        ]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeAllowManualCreate}
                        selectValue={this.state.selectValueAllowManualCreate}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.isAllowPause" />,
                id: "allowPending",
                minWidth: 200,
                accessor: d => {
                    return d.allowPending !== null ? <span title={d.allowPending}>{d.allowPending === 1 ? this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.allow") : this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.notAllow")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"allowPending"}
                        label={""}
                        isRequired={false}
                        options={[
                            { itemId: 1, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.allow") },
                            { itemId: 0, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.notAllow") }
                        ]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeIsAllowPause}
                        selectValue={this.state.selectValueIsAllowPause}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.isCreated" />,
                id: "createFromOtherSys",
                minWidth: 200,
                accessor: d => {
                    return d.createFromOtherSys !== null ? <span title={d.createFromOtherSys}>{d.createFromOtherSys === 1 ? this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.allow") : this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.notAllow")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"createFromOtherSys"}
                        label={""}
                        isRequired={false}
                        options={[
                            { itemId: 1, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.allow") },
                            { itemId: 0, itemName: this.props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.notAllow") }
                        ]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeIsCreated}
                        selectValue={this.state.selectValueIsCreated}
                        isOnlyInputSelect={true}
                    />
                )
            }

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
            this.searchWoTypeManagement();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.woGroupType = this.state.selectValueWoGroupName.value;
        objectSearch.isEnable = this.state.selectValueStatus.value;
        objectSearch.enableCreate = this.state.selectValueAllowManualCreate.value;
        objectSearch.allowPending = this.state.selectValueIsAllowPause.value;
        objectSearch.createFromOtherSys = this.state.selectValueIsCreated.value;
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoTypeManagement(true);
        });
    }

    searchWoTypeManagement(isSearchClicked = false) {
        this.props.actions.searchWoTypeManagement(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.search"));
        });
    }

    openPage(value, woTypeId) {
        if (value === "PRIORITY") {
            this.props.actions.getDetailWoTypeManagement(woTypeId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.woTypeId === null) {
                        response.payload.data.woTypeId = "";
                    }
                    this.setState({
                        isConfig: true,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.getDetail"));
            });
        } else if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailWoTypeManagement(woTypeId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.woTypeId === null) {
                        response.payload.data.woTypeId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.getDetail"));
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
                    this.searchWoTypeManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchWoTypeManagement();
            }
        });
    }

    closeConfigPage() {
        this.setState({
            isConfig: false
        })
    }

    confirmDelete(woTypeManagementId, woTypeManagementCode) {
        confirmAlertDelete(this.props.t("woTypeManagement:woTypeManagement.message.confirmDelete", { woTypeManagementCode: woTypeManagementCode }),
            () => {
                this.props.actions.deleteWoTypeManagement(woTypeManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchWoTypeManagement();
                        toastr.success(this.props.t("woTypeManagement:woTypeManagement.message.success.delete"));
                    } else if (response.payload.data.key === "DELETE_REQUIRE_EXIST") {
                        toastr.warning(this.props.t("woTypeManagement:woTypeManagement.message.error.deleteRequired"));
                    } else {
                        toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.delete"));
                });
            });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "wo_cat",
            moduleName: "WO_TYPE"
        });
    }

    closeImportModal() {
        this.setState({
            importModal: false,
            client: null,
            moduleName: null
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            const obj = this.state.objectSearch
            delete obj['custom-input-woGroupTypeName'];
            delete obj['custom-input-allowPending'];
            delete obj['custom-input-createFromOtherSys'];
            delete obj['custom-input-enableCreate'];
            delete obj['custom-input-isEnable'];
            this.props.actions.onExportFile("wo_cat", "WO_TYPE", obj).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeWoGroupName = (option) => {
        this.setState({ selectValueWoGroupName: option });
    }

    handleItemSelectChangeStatus = (option) => {
        this.setState({ selectValueStatus: option });
    }

    handleItemSelectChangeIsAllowPause = (option) => {
        this.setState({ selectValueIsAllowPause: option });
    }

    handleItemSelectChangeAllowManualCreate = (option) => {
        this.setState({ selectValueAllowManualCreate: option });
    }
    handleItemSelectChangeIsCreated = (option) => {
        this.setState({ selectValueIsCreated: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible || this.state.isConfig}
                content={this.state.isConfig ?
                    <WoTypeManagementConfigPriority
                        closeConfigPage={this.closeConfigPage}
                        parentState={this.state} /> :
                    <WoTypeManagementAddEdit
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
                                                    title={t("woTypeManagement:woTypeManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woTypeManagement:woTypeManagement.button.add")}
                                                    onClick={() => this.openPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woTypeManagement:woTypeManagement.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("woTypeManagement:woTypeManagement.button.export")}
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
                    </div>
                    <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchWoTypeManagement}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { woTypeManagement, common } = state;
    return {
        response: { woTypeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoTypeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoTypeManagementList));