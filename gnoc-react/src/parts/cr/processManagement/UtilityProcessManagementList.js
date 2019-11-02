import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityProcessManagementActions from './UtilityProcessManagementActions';
import UtilityProcessManagementAddEdit from "./UtilityProcessManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelect, CustomSelectLocal, SearchBar, CustomInputFilter, CustomRcTree } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { validSubmitForm, confirmAlertDelete } from "../../../containers/Utils/Utils";
import SplitterLayout from "react-splitter-layout";
import '../../../scss/react-splitter-layout/index.css';

class UtilityProcessManagementList extends Component {
    constructor(props) {
        super(props);

        this.handleSelectTree = this.handleSelectTree.bind(this);
        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchUtilityProcessManagement = this.searchUtilityProcessManagement.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);
        //combobox
        this.handleItemSelectChangeCrTypeId = this.handleItemSelectChangeCrTypeId.bind(this);
        this.handleItemSelectChangeRiskLevel = this.handleItemSelectChangeRiskLevel.bind(this);
        this.handleItemSelectChangeImpactSegmentId = this.handleItemSelectChangeImpactSegmentId.bind(this);
        this.handleItemSelectChangeDeviceTypeId = this.handleItemSelectChangeDeviceTypeId.bind(this);
        //end combobox

        this.state = {
            collapseFormSearch: false,
            collapseFormSearchAdvance: false,
            collapseFormInfo: true,
            isSearchClicked: true,
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
            //select value combobox
            selectValueCrTypeId: {},
            selectValueRiskLevel: {},
            selectValueImpactSegmentId: {},
            selectValueDeviceTypeId: {},
            
            crTypeListSelect: [],
            riskLevelListSelect: [],
            parentId:{},
            dataParent:[]
            //end select value combobox
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("CR_TYPE", "itemId", "itemName", "1", "3").then((response) => {
            let crTypeListSelect = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(e =>{return {itemId:e.itemValue,itemName:e.itemName}}) : []
            this.setState({
                crTypeListSelect
            })
        });
        this.props.actions.getItemMaster("RISK_PRIORITY", "itemId", "itemName", "1", "3").then((response) => {
            let riskLevelListSelect = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(e =>{return {itemId:e.itemValue,itemName:e.itemName}}) : []
            this.setState({
                riskLevelListSelect
            })
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.crProcessId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.crProcessId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.crProcessCode" />,
                id: "crProcessCode",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.crProcessCode}>{d.crProcessCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="crProcessCode" placeholder={this.props.t("utilityProcessManagement:utilityProcessManagement.placeholder.crProcessCode")}
                        value={this.state.objectSearch.crProcessCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.crProcessName" />,
                id: "crProcessName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.crProcessName}>{d.crProcessName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="crProcessName" placeholder={this.props.t("utilityProcessManagement:utilityProcessManagement.placeholder.crProcessName")}
                        value={this.state.objectSearch.crProcessName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.crType" />,
                id: "crTypeName",
                minWidth: 250,
                accessor: d => {
                    return d.crTypeName ? <span title={d.crTypeName}>{d.crTypeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"crTypeId"}
                        label={""}
                        isRequired={false}
                        options={this.state.crTypeListSelect}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCrTypeId}
                        selectValue={this.state.selectValueCrTypeId}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.riskLevel" />,
                id: "riskLevelName",
                minWidth: 250,
                accessor: d => {
                    return d.riskLevelName ? <span title={d.riskLevelName}>{d.riskLevelName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"riskLevel"}
                        label={""}
                        isRequired={false}
                        options={this.state.riskLevelListSelect}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeRiskLevel}
                        selectValue={this.state.selectValueRiskLevel}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.impactSegment" />,
                id: "impactSegmentName",
                minWidth: 250,
                accessor: d => {
                    return d.impactSegmentName ? <span title={d.impactSegmentName}>{d.impactSegmentName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"impactSegmentId"}
                        label={''}
                        isRequired={false}
                        moduleName={"GNOC_CR_IMPACT_SEGMENT"}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeImpactSegmentId}
                        selectValue={this.state.selectValueImpactSegmentId}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityProcessManagement:utilityProcessManagement.label.deviceType" />,
                id: "deviceTypeName",
                minWidth: 250,
                accessor: d => {
                    return d.deviceTypeName ? <span title={d.deviceTypeName}>{d.deviceTypeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"deviceTypeId"}
                        label={''}
                        isRequired={false}
                        moduleName={"GNOC_CR_DEVICE_TYPES"}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeDeviceTypeId}
                        selectValue={this.state.selectValueDeviceTypeId}
                        isOnlyInputSelect={true}
                    />
                )
            }
        ];
    }

    toggleFormSearch() {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
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
            objectSearch
        }, () => {
            this.searchUtilityProcessManagement();
        });
    }

    search(event, errors, values) {
        validSubmitForm(event, values, "idFormSearch");
        const objectSearch = {
            ...this.state.objectSearch,
            ...values,
            crTypeId: this.state.selectValueCrTypeId ? this.state.selectValueCrTypeId.value : null,
            riskLevel: this.state.selectValueRiskLevel ? this.state.selectValueRiskLevel.value : null,
            impactSegmentId: this.state.selectValueImpactSegmentId ? this.state.selectValueImpactSegmentId.value : null,
            deviceTypeId: this.state.selectValueDeviceTypeId ? this.state.selectValueDeviceTypeId.value : null
        };
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: this.state.isSearchClicked,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityProcessManagement();
        });
    }

    searchUtilityProcessManagement() {
        this.props.actions.searchUtilityProcessManagement(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                isSearchClicked: true,
                btnSearchLoading: false,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                isSearchClicked: true,
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.search"));
        });
    }

    handleSelectTree(d) {
        const objectSearch = this.state.objectSearch;
        objectSearch.parentId = d.value;
        objectSearch.page = 1;
        this.setState({
            objectSearch: objectSearch,
            parentId: {value:d.value,label:d.title}
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityProcessManagement();
        });
    }

    openAddOrEditPage(value, crProcessId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getCrProcessDetail(crProcessId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.crProcessId === null) {
                        response.payload.data.crProcessId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.getDetail"));
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
                    this.customRcTree.reloadTree();
                    this.searchUtilityProcessManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.customRcTree.reloadTree();
                this.searchUtilityProcessManagement();
            }
        });
    }

    confirmDelete(crProcessId) {
        confirmAlertDelete(this.props.t("utilityProcessManagement:utilityProcessManagement.message.confirmDelete", { UtilityProcessManagementCode: crProcessId }),
            () => {
                this.props.actions.deleteUtilityProcessManagement(crProcessId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.customRcTree.reloadTree();
                        this.searchUtilityProcessManagement();
                        toastr.success(this.props.t("utilityProcessManagement:utilityProcessManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.delete"));
                });
            }
        );
    }

    //combobox
    handleItemSelectChangeCrTypeId(option) {
        this.setState({ selectValueCrTypeId: option });
    }

    handleItemSelectChangeRiskLevel(option) {
        this.setState({ selectValueRiskLevel: option });
    }

    handleItemSelectChangeImpactSegmentId(option) {
        this.setState({ selectValueImpactSegmentId: option });
    }

    handleItemSelectChangeDeviceTypeId(option) {
        this.setState({ selectValueDeviceTypeId: option });
    }
    //end combobox

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr_cat", "CR_PROCESS_MANAGER", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "cr_cat",
            moduleName: "CR_PROCESS_MANAGER"
        });
    }

    closeImportModal() {
        this.setState({
            importModal: false,
            client: null,
            moduleName: null
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityProcessManagementAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div style={{ position: "relative", height: "100vh" }}>
                    <SplitterLayout percentage={true} primaryMinSize={20} secondaryMinSize={40} secondaryInitialSize={70}>
                        <div>
                            <div className="animated fadeIn">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-list"></i>{t("utilityProcessManagement:utilityProcessManagement.title.utilityProcessManagementInfo")}
                                    </CardHeader>
                                    <CustomRcTree
                                        onRef={ref => (this.customRcTree = ref)}
                                        moduleName="CR_PROCESS"
                                        handleSelect={this.handleSelectTree}
                                        height="500px"
                                    />
                                </Card>
                            </div>
                        </div>
                        <div>
                            <AvForm id="idFormSearch" onSubmit={this.search} model={objectSearch}>
                                {/* <editor-fold desc="Datatable"> */}
                                <div className="animated fadeIn">
                                    <Row>
                                        <Col>
                                            <Card>
                                                <CardHeader>
                                                    <div className="card-header-search-actions">
                                                        <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                            title={t("utilityProcessManagement:utilityProcessManagement.placeholder.searchAll")} />
                                                    </div>
                                                    <div className="card-header-actions card-header-search-actions-button">
                                                        <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                            title={t("utilityProcessManagement:utilityProcessManagement.button.add")}
                                                            onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                        <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                            title={t("utilityProcessManagement:utilityProcessManagement.button.import")}
                                                            onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                        <LaddaButton type="button"
                                                            className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                            title={t("utilityProcessManagement:utilityProcessManagement.button.export")}
                                                            loading={this.state.btnExportLoading}
                                                            data-style={ZOOM_OUT}
                                                            onClick={() => this.onExport()}>
                                                            <i className="fa fa-download"></i>
                                                        </LaddaButton>
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
                                </div>
                                {/* </editor-fold> */}
                            </AvForm>
                        </div>
                    </SplitterLayout>
                </div>
                <ImportModal
                    closeImportModal={this.closeImportModal}
                    reloadGridData={this.searchUtilityProcessManagement}
                    stateImportModal={this.state} />
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityProcessManagement, common } = state;
    return {
        response: { utilityProcessManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityProcessManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityProcessManagementList));