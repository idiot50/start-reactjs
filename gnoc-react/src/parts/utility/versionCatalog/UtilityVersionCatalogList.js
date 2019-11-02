import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as KedbManagementActions from '../../kedb/management/KedbManagementActions';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityVersionCatalogActions from './UtilityVersionCatalogActions';
import UtilityVersionCatalogAddEdit from "./UtilityVersionCatalogAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityVersionCatalogList extends Component {
    constructor(props) {
        super(props);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityVersionCatalog = this.searchUtilityVersionCatalog.bind(this);
        this.search = this.search.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);
        this.state = {
            collapseFormSearch: true,
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
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectValueVendor: {},
            selectValueTypeId: {},
            selectValueSubTypeId: {},
            typeList: []
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("VENDOR", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityVersionCatalog:utilityVersionCatalog.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.deviceTypeVersionId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.deviceTypeVersionId)}>
                            <Button type="button" size="sm" className="btn-warning icon"><i className="fa fa-copy"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityVersionCatalog:utilityVersionCatalog.label.vendor" />,
                id: "vendorIdStr",
                width: 250,
                accessor: d => {
                    return <span title={d.vendorIdStr}>{d.vendorIdStr}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"vendorIdStr"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.vendor && this.props.response.common.vendor.payload) ? this.props.response.common.vendor.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeVendor}
                        selectValue={this.state.selectValueVendor}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityVersionCatalog:utilityVersionCatalog.label.domain" />,
                id: "subTypeIdStr",
                width: 250,
                accessor: d => {
                    return <span title={d.subTypeIdStr}>{d.subTypeIdStr}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"subTypeId"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeSubTypeId}
                        selectValue={this.state.selectValueSubTypeId}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityVersionCatalog:utilityVersionCatalog.label.subCategory" />,
                id: "typeIdStr",
                width: 250,
                accessor: d => {
                    return <span title={d.typeIdStr}>{d.typeIdStr}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"typeId"}
                        label={""}
                        isRequired={false}
                        options={this.state.typeList ? this.state.typeList : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeTypeId}
                        selectValue={this.state.selectValueTypeId}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityVersionCatalog:utilityVersionCatalog.label.versionSoftware" />,
                id: "softwareVersion",
                width: 250,
                accessor: d => {
                    return <span title={d.softwareVersion}>{d.softwareVersion}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="softwareVersion" placeholder={this.props.t("utilityVersionCatalog:utilityVersionCatalog.placeholder.versionSoftware")} />
                )
            },
            {
                Header: <Trans i18nKey="utilityVersionCatalog:utilityVersionCatalog.label.versionHardware" />,
                id: "hardwareVersion",
                minWidth: 200,
                accessor: d => {
                    return <span title={d.hardwareVersion}>{d.hardwareVersion}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="hardwareVersion" placeholder={this.props.t("utilityVersionCatalog:utilityVersionCatalog.placeholder.versionHardware")} />
                )
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
            sortName: sortName,
            sortType: sortType
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchUtilityVersionCatalog();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.typeId = this.state.selectValueTypeId.value;
        objectSearch.vendorId = this.state.selectValueVendor.value;
        objectSearch.subTypeId = this.state.selectValueSubTypeId.value;
        objectSearch.softwareVersion = values.softwareVersion.length !== 0 ? values.softwareVersion.trim() : "";
        objectSearch.hardwareVersion = values.hardwareVersion.length !== 0 ? values.hardwareVersion.trim() : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityVersionCatalog(true);
        });
    }

    searchUtilityVersionCatalog(isSearchClicked = false) {
        this.props.actions.searchUtilityVersionCatalog(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data,
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
            toastr.error(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityVersionCatalogId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityVersionCatalog(utilityVersionCatalogId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data === null) {
                        response.payload.data = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.error.getDetail"));
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
                    this.searchUtilityVersionCatalog();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityVersionCatalog();
            }
        });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "stream",
            moduleName: "DEVICE_TYPE_VERSION"
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
            this.props.actions.onExportFile("stream", "DEVICE_TYPE_VERSION", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleKeyDownForm = event => {
        if (event.key === 'Enter') {
            this.setState({
                isSearchClicked: false
            });
        }
    }

    toggleFormSearch = () => {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
    }

    handleItemSelectChangeVendor = (option) => {
        this.setState({ selectValueVendor: option });
    }

    handleItemSelectChangeSubTypeId = (option) => {
        this.setState({ selectValueSubTypeId: option })
        if (option && option.value) {
            this.props.actions.getListItemByCategoryAndParent("PT_SUB_CATEGORY", option.value).then((response) => {
                this.setState({
                    typeList: response.payload.data
                });
            });
        } else {
            this.setState({
                typeList: [],
                selectValueTypeId: {}
            });
        }
    }

    handleItemSelectChangeTypeId = (option) => {
        this.setState({ selectValueTypeId: option })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityVersionCatalogAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <AvForm onKeyDown={this.handleKeyDownForm} onSubmit={this.search} model={objectSearch} ref={el => this.myFormRef = el}>
                        {/* edit-form-datatable */}
                        <div className="animated fadeIn">
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")} title={t("utilityVersionCatalog:utilityVersionCatalog.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityVersionCatalog:utilityVersionCatalog.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityVersionCatalog:utilityVersionCatalog.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityVersionCatalog:utilityVersionCatalog.button.export")}
                                                    onClick={() => this.onExport()}><i className="fa fa-download"></i>
                                                </LaddaButton>
                                                <SettingTableLocal
                                                    columns={columns}
                                                    onChange={this.handleChangeLocalColumnsTable}
                                                />
                                            </div>
                                        </CardHeader>
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
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        {/* end-edit-datatable */}
                    </AvForm>
                </div>
                <ImportModal
                    closeImportModal={this.closeImportModal}
                    reloadGridData={this.searchUtilityVersionCatalog}
                    stateImportModal={this.state} />
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityVersionCatalog, common } = state;
    return {
        response: { utilityVersionCatalog, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityVersionCatalogActions, commonActions, KedbManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityVersionCatalogList));