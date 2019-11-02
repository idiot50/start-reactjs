import { AvForm } from 'availity-reactstrap-validation';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomInputFilter, CustomReactTableSearch, SearchBar, SettingTableLocal } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import * as commonActions from './../../../actions/commonActions';
import * as UtilityScopesManagementActions from './UtilityScopesManagementActions';
import UtilityScopesManagementAddEdit from "./UtilityScopesManagementAddEdit";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";


class UtilityScopesManagementList extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.onExport = this.onExport.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityScopesManagement = this.searchUtilityScopesManagement.bind(this);

        this.state = {
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
            isAddOrEdit: null
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityScopesManagement:utilityScopesManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.cmseId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.cmseId, d.cmseCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.cmseId)}>
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
                Header: <Trans i18nKey="utilityScopesManagement:utilityScopesManagement.label.rangeCode" />,
                id: "cmseCode",
                sortable: true,
                width: 300,
                accessor: d => {
                    return <span title={d.cmseCode}>{d.cmseCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="cmseCode"
                        value={this.state.objectSearch.cmseCode} placeholder={this.props.t("utilityScopesManagement:utilityScopesManagement.placeholder.rangeCode")} />
                )
            },
            {
                Header: <Trans i18nKey="utilityScopesManagement:utilityScopesManagement.label.rangeName" />,
                id: "cmseName",
                sortable: true,
                width: 300,
                accessor: d => {
                    return <span title={d.cmseName}>{d.cmseName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="cmseName"
                        value={this.state.objectSearch.cmseName} placeholder={this.props.t("utilityScopesManagement:utilityScopesManagement.placeholder.rangeName")} />
                )
            },
            {
                Header: <Trans i18nKey="utilityScopesManagement:utilityScopesManagement.label.description" />,
                id: "description",
                accessor: d => {
                    return <span title={d.description}>{d.description}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="description"
                    value={this.state.objectSearch.description} placeholder={this.props.t("utilityScopesManagement:utilityScopesManagement.placeholder.description")} />
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
            this.searchUtilityScopesManagement();
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
        objectSearch.cmseCode = objectSearch.cmseCode ? objectSearch.cmseCode.trim() : "";
        objectSearch.description = objectSearch.description ? objectSearch.description.trim() : "";
        objectSearch.cmseName = objectSearch.cmseName ? objectSearch.cmseName.trim() : "";
        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityScopesManagement();
        });
    }

    searchUtilityScopesManagement() {
        this.props.actions.searchUtilityScopesManagement(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityScopesManagementId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityScopesManagement(utilityScopesManagementId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.getDetail"));
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
                    this.searchUtilityScopesManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityScopesManagement();
            }
        });
    }

    confirmDelete(utilityScopesManagementId, utilityScopesManagementCode) {
        confirmAlertDelete(this.props.t("utilityScopesManagement:utilityScopesManagement.message.confirmDelete", { utilityScopesManagementCode: utilityScopesManagementCode }),
            () => {
                this.props.actions.deleteUtilityScopesManagement(utilityScopesManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityScopesManagement();
                        toastr.success(this.props.t("utilityScopesManagement:utilityScopesManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.delete"));
                });
            }
        );
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr_cat", "CR_MANAGERSCOPE", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityScopesManagementAddEdit
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
                                                    title={t("utilityScopesManagement:utilityScopesManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityScopesManagement:utilityScopesManagement.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityScopesManagement:utilityScopesManagement.button.export")}
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
                                            />
                                        </CardBody>
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
    const { utilityScopesManagement, common } = state;
    return {
        response: { utilityScopesManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityScopesManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityScopesManagementList));