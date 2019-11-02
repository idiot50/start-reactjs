import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityDepartmentsRolesManagementActions from './UtilityDepartmentsRolesManagementActions';
import UtilityDepartmentsRolesManagementAddEdit from "./UtilityDepartmentsRolesManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAutocomplete } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityDepartmentsRolesManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityDepartmentsRolesManagement = this.searchUtilityDepartmentsRolesManagement.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);

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
            selectValueParentName: {},
            selectValueUnitName: {},
            selectValueCmreName: {},
            //list
            crList: []
        };
    }

    componentDidMount() {
        this.props.actions.getListCrName({}).then((response) => {
            const listCr = response.payload ? response.payload.data.map(e => ({ itemName: e.cmreName, itemId: e.cmreId })) : [];
            this.setState({
                crList: listCr
            });
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.cmroutId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.cmroutId, d.cmroutId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.cmroutId)}>
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
                Header: <Trans i18nKey="utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.label.roleName" />,
                id: "cmreName",
                accessor: d => {
                    return <span title={d.cmreName}>{d.cmreName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"cmreName"}
                        label={""}
                        isRequired={false}
                        options={this.state.crList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCmreName}
                        selectValue={this.state.selectValueCmreName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.label.unitName" />,
                id: "unitName",
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitName"}
                        label={""}
                        placeholder={this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.placeholder.unitName")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeUnitName}
                        selectValue={this.state.selectValueUnitName}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.label.parentUnit" />,
                id: "parentName",
                accessor: d => {
                    return d.parentName ? <span title={d.parentName}>{d.parentName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"parentName"}
                        label={""}
                        placeholder={this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.placeholder.parentUnit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeParentName}
                        selectValue={this.state.selectValueParentName}
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
            this.searchUtilityDepartmentsRolesManagement();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.unitId = this.state.selectValueUnitName ? this.state.selectValueUnitName.value : null;
        values.parentUnitId = this.state.selectValueParentName ? this.state.selectValueParentName.value : null;
        values.cmreId = this.state.selectValueCmreName ? this.state.selectValueCmreName.value : null;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityDepartmentsRolesManagement(true);
        });
    }

    searchUtilityDepartmentsRolesManagement(isSearchClicked = false) {
        this.props.actions.searchUtilityDepartmentsRolesManagement(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityDepartmentsRolesManagementId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityDepartmentsRolesManagement(utilityDepartmentsRolesManagementId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.cmroutId === null) {
                        response.payload.data.cmroutId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.getDetail"));
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
                    this.searchUtilityDepartmentsRolesManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityDepartmentsRolesManagement();
            }
        });
    }

    confirmDelete(utilityDepartmentsRolesManagementId, utilityDepartmentsRolesManagementCode) {
        confirmAlertDelete(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.confirmDelete", { utilityDepartmentsRolesManagementCode: utilityDepartmentsRolesManagementCode }),
            () => {
                this.props.actions.deleteUtilityDepartmentsRolesManagement(utilityDepartmentsRolesManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityDepartmentsRolesManagement();
                        toastr.success(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.delete"));
                });
            }
        );
    }

    handleOnChangeUnitName = (option) => {
        this.setState({ selectValueUnitName: option });
    }

    handleOnChangeParentName = (option) => {
        this.setState({ selectValueParentName: option });
    }
    handleItemSelectChangeCmreName = (option) => {
        this.setState({ selectValueCmreName: option })
    }

    render() {
        console.log(this.props.response);
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityDepartmentsRolesManagementAddEdit
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
                                                    title={t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i>
                                                </Button>
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
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityDepartmentsRolesManagement, common } = state;
    return {
        response: { utilityDepartmentsRolesManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityDepartmentsRolesManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityDepartmentsRolesManagementList));