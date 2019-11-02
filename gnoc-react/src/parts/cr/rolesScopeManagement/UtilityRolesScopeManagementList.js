import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityRolesScopeManagementActions from './UtilityRolesScopeManagementActions';
import UtilityRolesScopeManagementAddEdit from "./UtilityRolesScopeManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityRolesScopeManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityRolesScopeManagement = this.searchUtilityRolesScopeManagement.bind(this);
        this.search = this.search.bind(this);
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
            //Selection
            selectValueCmseCode: {},
            selectValueCmseName: {},
            selectValueCmreCode: {},
            selectValueCmreName: {},
            //Combobox
            listCmreCode: [],
            listCmreName: [],
            listCmseCode: [],
            listCmseName: []
        };
    }

    componentDidMount() {
        this.props.actions.getListManagerScopeCBB().then((response) => {
            const listCmseCode = response.payload.data ? response.payload.data.map(i => ({ itemId: i.cmseCode, itemName: i.cmseCode })) : []
            const listCmseName = response.payload.data ? response.payload.data.map(i => ({ itemId: i.cmseName, itemName: i.cmseName })) : []
            this.setState({
                listCmseCode,
                listCmseName
            })
        });
        this.props.actions.getListCrManagerRolesCBB().then((response) => {
            const listCmreCode = response.payload.data ? response.payload.data.map(i => ({ itemId: i.cmreCode, itemName: i.cmreCode })) : []
            const listCmreName = response.payload.data ? response.payload.data.map(i => ({ itemId: i.cmreName, itemName: i.cmreName })) : []
            this.setState({
                listCmreCode,
                listCmreName
            })
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityRolesScopeManagement:utilityRolesScopeManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.cmsorsId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.cmsorsId, d.cmsorsName)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.cmsorsId)}>
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
                Header: <Trans i18nKey="utilityRolesScopeManagement:utilityRolesScopeManagement.label.cmseCode" />,
                id: "cmseCode",
                minWidth: 300,
                accessor: d => {
                    return <span title={d.cmseCode}>{d.cmseCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"cmseCode"}
                        isRequired={false}
                        label={""}
                        options={this.state.listCmseCode}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCmseCode}
                        selectValue={this.state.selectValueCmseCode}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityRolesScopeManagement:utilityRolesScopeManagement.label.cmseName" />,
                id: "cmseName",
                minWidth: 300,
                accessor: d => {
                    return <span title={d.cmseName}>{d.cmseName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"cmseName"}
                        isRequired={false}
                        label={""}
                        options={this.state.listCmseName}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCmseName}
                        selectValue={this.state.selectValueCmseName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityRolesScopeManagement:utilityRolesScopeManagement.label.cmreCode" />,
                id: "cmreCode",
                minWidth: 300,
                accessor: d => {
                    return <span title={d.cmreCode}>{d.cmreCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"cmreCode"}
                        isRequired={false}
                        label={""}
                        options={this.state.listCmreCode}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCmreCode}
                        selectValue={this.state.selectValueCmreCode}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityRolesScopeManagement:utilityRolesScopeManagement.label.cmreName" />,
                id: "cmreName",
                minWidth: 300,
                accessor: d => {
                    return <span title={d.cmreName}>{d.cmreName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"cmreName"}
                        isRequired={false}
                        label={""}
                        options={this.state.listCmreName}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCmreName}
                        selectValue={this.state.selectValueCmreName}
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
            this.searchUtilityRolesScopeManagement();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.cmseCode = this.state.selectValueCmseCode.value || "";
        objectSearch.cmseName = this.state.selectValueCmseName.value || "";
        objectSearch.cmreName = this.state.selectValueCmreName.value || "";
        objectSearch.cmreCode = this.state.selectValueCmreCode.value || "";
        objectSearch.page = 1;
        delete objectSearch['custom-input-cmseCode'];
        delete objectSearch['custom-input-cmseName'];
        delete objectSearch['custom-input-cmreCode'];
        delete objectSearch['custom-input-cmreName'];
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityRolesScopeManagement(true);
        });
    }

    searchUtilityRolesScopeManagement(isSearchClicked = false) {
        this.props.actions.searchUtilityRolesScopeManagement(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityRolesScopeManagementId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityRolesScopeManagement(utilityRolesScopeManagementId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.cmsorsId === null) {
                        response.payload.data.cmsorsId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.getDetail"));
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
                    this.searchUtilityRolesScopeManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityRolesScopeManagement();
            }
        });
    }

    confirmDelete = (utilityRolesScopeManagementId, utilityRolesScopeManagementCode) => {
        confirmAlertDelete(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.confirmDelete", { utilityRolesScopeManagementCode: utilityRolesScopeManagementCode }),
            () => {
                this.props.actions.deleteUtilityRolesScopeManagement(utilityRolesScopeManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityRolesScopeManagement();
                        toastr.success(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.delete"));
                });
            }
        );
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr_cat","CR_MANAGER_SCOPES_OF_ROLES", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeCmseCode = (option) => {
        this.setState({
            selectValueCmseCode: option
        })
    }

    handleItemSelectChangeCmseName = (option) => {
        this.setState({
            selectValueCmseName: option
        })
    }

    handleItemSelectChangeCmreCode = (option) => {
        this.setState({
            selectValueCmreCode: option
        })
    }

    handleItemSelectChangeCmreName = (option) => {
        this.setState({
            selectValueCmreName: option
        })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityRolesScopeManagementAddEdit
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
                                                    title={t("utilityRolesScopeManagement:utilityRolesScopeManagement.placeholder.searchAll")}
                                                    value={objectSearch.searchAll} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityRolesScopeManagement:utilityRolesScopeManagement.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityRolesScopeManagement:utilityRolesScopeManagement.button.export")}
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
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityRolesScopeManagement, common } = state;
    return {
        response: { utilityRolesScopeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityRolesScopeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityRolesScopeManagementList));