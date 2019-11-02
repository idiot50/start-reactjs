import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityRolesManagementActions from './UtilityRolesManagementActions';
import UtilityRolesManagementAddEdit from "./UtilityRolesManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityRolesManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityRolesManagement = this.searchUtilityRolesManagement.bind(this);
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
            selectValueOdGroupTypeId: {},
            selectValueStatus: {}
        };
    }

    componentDidMount() {
        //this.props.actions.getItemMaster("OD_GROUP_TYPE", "itemId", "itemName", "1", "3");
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityRolesManagement:utilityRolesManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.cmreId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.cmreId, d.cmreCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.cmreId)}>
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
                Header: <Trans i18nKey="utilityRolesManagement:utilityRolesManagement.label.roleCode" />,
                id: "cmreCode",
                accessor: d => {
                    return <span title={d.cmreCode}>{d.cmreCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="cmreCode" placeholder={this.props.t("utilityRolesManagement:utilityRolesManagement.placeholder.roleCode")}
                        value={this.state.objectSearch.cmreCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityRolesManagement:utilityRolesManagement.label.roleName" />,
                id: "cmreName",
                accessor: d => {
                    return <span title={d.cmreName}>{d.cmreName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="cmreName" placeholder={this.props.t("utilityRolesManagement:utilityRolesManagement.placeholder.roleName")}
                        value={this.state.objectSearch.cmreName} />
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
            this.searchUtilityRolesManagement();
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
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityRolesManagement(true);
        });
    }

    searchUtilityRolesManagement(isSearchClicked = false) {
        this.props.actions.searchUtilityRolesManagement(this.state.objectSearch).then((response) => {
            console.log(response);
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
            toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityRolesManagementId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityRolesManagement(utilityRolesManagementId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.cmreId === null) {
                        response.payload.data.cmreId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.getDetail"));
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
                    this.searchUtilityRolesManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityRolesManagement();
            }
        });
    }
    confirmDelete(utilityRolesManagementId, cmreCode) {
        confirmAlertDelete(this.props.t("utilityRolesManagement:utilityRolesManagement.message.confirmDelete", { cmreCode: cmreCode }),
            () => {
                this.props.actions.deleteUtilityRolesManagement(utilityRolesManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityRolesManagement();
                        toastr.success(this.props.t("utilityRolesManagement:utilityRolesManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.delete"));
                });
            }
        );
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityRolesManagementAddEdit
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
                                                    title={t("utilityRolesManagement:utilityRolesManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityRolesManagement:utilityRolesManagement.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
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
    const { utilityRolesManagement, common } = state;
    return {
        response: { utilityRolesManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityRolesManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityRolesManagementList));