import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityCrCabUsersActions from './UtilityCrCabUsersActions';
import UtilityCrCabUsersAddEdit from "./UtilityCrCabUsersAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomAutocomplete, CustomSelect } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class OdCategoryList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityCrCabUsers = this.searchUtilityCrCabUsers.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
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
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectValueSegmentName: {},
            selectValueExecuteUnitName: {},
            selectValueCabUnitName: {},
            selectValueUserFullName: {},
            selectValueCreationUnitName: {},
            //list
            listImpact: []
        };
    }

    componentDidMount() {
        this.props.actions.getListImpactSegmentCBB().then((response) => {
            const listImpact = response.payload.data && response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr }))
            this.setState({
                listImpact,
            });
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.search"));
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityCrCabUsers:utilityCrCabUsers.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.crCabUsersId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.crCabUsersId, d.crCabUsersId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.crCabUsersId)}>
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
                Header: <Trans i18nKey="utilityCrCabUsers:utilityCrCabUsers.label.impactArr" />,
                id: "segmentName",
                width: 250,
                accessor: d => {
                    return <span title={d.segmentName}>{d.segmentName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"segmentName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listImpact}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectSegmentName}
                        selectValue={this.state.selectValueSegmentName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrCabUsers:utilityCrCabUsers.label.unitImpl" />,
                id: "executeUnitName",
                width: 250,
                accessor: d => {
                    return <span title={d.executeUnitName}>{d.executeUnitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"executeUnitName"}
                        label={""}
                        placeholder={this.props.t("utilityCrCabUsers:utilityCrCabUsers.placeholder.unitImpl")}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleOnChangeExecuteUnitName}
                        selectValue={this.state.selectValueExecuteUnitName}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrCabUsers:utilityCrCabUsers.label.CABUnit" />,
                id: "cabUnitName",
                width: 250,
                accessor: d => {
                    return <span title={d.cabUnitName}>{d.cabUnitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"cabUnitName"}
                        label={""}
                        placeholder={this.props.t("utilityCrCabUsers:utilityCrCabUsers.placeholder.CABUnit")}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleOnChangeCabUnitName}
                        selectValue={this.state.selectValueCabUnitName}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrCabUsers:utilityCrCabUsers.label.CABEmpl" />,
                id: "userFullName",
                width: 250,
                accessor: d => {
                    return <span title={d.userFullName}>{d.userFullName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"userFullName"}
                        label={''}
                        isRequired={false}
                        moduleName={"USERS"}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectUserFullName}
                        selectValue={this.state.selectValueUserFullName}
                        parentValue={(this.state.selectValueCabUnitName && this.state.selectValueCabUnitName.value) ? this.state.selectValueCabUnitName.value : ""}
                        isOnlyInputSelect={true}
                        isHasChildren={false}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrCabUsers:utilityCrCabUsers.label.createdUnit" />,
                id: "creationUnitName",
                width: 250,
                accessor: d => {
                    return <span title={d.creationUnitName}>{d.creationUnitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"creationUnitName"}
                        label={""}
                        placeholder={this.props.t("utilityCrCabUsers:utilityCrCabUsers.placeholder.createdUnit")}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleOnChangeCreationUnitName}
                        selectValue={this.state.selectValueCreationUnitName}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
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
            this.searchUtilityCrCabUsers();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        objectSearch.impactSegmentId = this.state.selectValueSegmentName ? this.state.selectValueSegmentName.value : null 
        objectSearch.cabUnitId = this.state.selectValueCabUnitName ? this.state.selectValueCabUnitName.value : null
        objectSearch.executeUnitId = this.state.selectValueExecuteUnitName ? this.state.selectValueExecuteUnitName.value : null
        objectSearch.userID = this.state.selectValueUserFullName ? this.state.selectValueUserFullName.value : null
        objectSearch.creationUnitId = this.state.selectValueCreationUnitName ? this.state.selectValueCreationUnitName.value : null
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityCrCabUsers(true);
        });
    }

    searchUtilityCrCabUsers(isSearchClicked = false) {
        this.props.actions.searchUtilityCrCabUsers(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityCrCabUsersId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityCrCabUsers(utilityCrCabUsersId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.odGroupTypeId === null) {
                        response.payload.data.odGroupTypeId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.getDetail"));
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
                    this.searchUtilityCrCabUsers();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityCrCabUsers();
            }
        });
    }

    confirmDelete(utilityCrCabUsersId, utilityCrCabUsersCode) {
        confirmAlertDelete(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.confirmDelete", { utilityCrCabUsersCode: utilityCrCabUsersCode }),
            () => {
                this.props.actions.deleteUtilityCrCabUsers(utilityCrCabUsersId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityCrCabUsers();
                        toastr.success(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityCrCabUsers:utilityCrCabUsers.message.error.delete"));
                });
            }
        );
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "cr_cat",
            moduleName: "CR_CABUSERS"
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
            delete obj['custom-input-cabUnitName'];
            delete obj['custom-input-creationUnitName'];
            delete obj['custom-input-executeUnitName'];
            delete obj['custom-input-segmentName'];
            delete obj['custom-input-userFullName'];
            this.props.actions.onExportFile("cr_cat", "CR_CABUSERS", obj).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }


    handleOnChangeCreationUnitName = (option) => {
        this.setState({ selectValueCreationUnitName: option })
    }

    handleItemSelectUserFullName = (option) => {
        this.setState({ selectValueUserFullName: option })
    }

    handleOnChangeCabUnitName = (option) => {
        if(!option){
            this.setState({ selectValueUserFullName : {}})
        }
        this.setState({ selectValueCabUnitName: option, selectValueUserFullName : {} })
    }

    handleOnChangeExecuteUnitName = (option) => {
        this.setState({ selectValueExecuteUnitName: option })
    }

    handleItemSelectSegmentName = (option) => {
        this.setState({ selectValueSegmentName: option })
    }


    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityCrCabUsersAddEdit
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
                                                    title={t("utilityCrCabUsers:utilityCrCabUsers.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityCrCabUsers:utilityCrCabUsers.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityCrCabUsers:utilityCrCabUsers.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityCrCabUsers:utilityCrCabUsers.button.export")}
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
                        reloadGridData={this.searchUtilityCrCabUsers}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityCrCabUsers, common } = state;
    return {
        response: { utilityCrCabUsers, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrCabUsersActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdCategoryList));