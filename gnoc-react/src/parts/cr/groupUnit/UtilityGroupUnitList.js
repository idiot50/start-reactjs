import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityGroupUnitActions from './UtilityGroupUnitActions';
import UtilityGroupUnitAddEdit from "./UtilityGroupUnitAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityGroupUnitList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityGroupUnit = this.searchUtilityGroupUnit.bind(this);
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
            selectValueOdGroupTypeId: {},
            selectValueStatus: {}
        };
    }

    componentDidMount() {
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityGroupUnit:utilityGroupUnit.label.action" />,
                id: "action",
                width: 120,
                sortable: false,
                fixed: "left",
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.groupUnitId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.groupUnitId, d.groupUnitCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.groupUnitId)}>
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
                Header: <Trans i18nKey="utilityGroupUnit:utilityGroupUnit.label.utilityGroupUnitCode" />,
                id: "groupUnitCode",
                accessor: d => {
                    return <span title={d.groupUnitCode}>{d.groupUnitCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="groupUnitCode" placeholder={this.props.t("utilityGroupUnit:utilityGroupUnit.placeholder.utilityGroupUnitCode")}
                        value={this.state.objectSearch.groupUnitCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityGroupUnit:utilityGroupUnit.label.utilityGroupUnitName" />,
                id: "groupUnitName",
                accessor: d => {
                    return <span title={d.groupUnitName}>{d.groupUnitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="groupUnitName" placeholder={this.props.t("utilityGroupUnit:utilityGroupUnit.placeholder.utilityGroupUnitName")}
                        value={this.state.objectSearch.groupUnitName} />
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
            this.searchUtilityGroupUnit();
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
            this.searchUtilityGroupUnit(true);
        });
    }

    searchUtilityGroupUnit(isSearchClicked = false) {
        this.props.actions.searchUtilityGroupUnit(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityGroupUnitId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityGroupUnit(utilityGroupUnitId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.groupUnitId === null) {
                        response.payload.data.groupUnitId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.getDetail"));
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
                    this.searchUtilityGroupUnit();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityGroupUnit();
            }
        });
    }

    confirmDelete(groupUnitId, groupUnitCode) {
        confirmAlertDelete(this.props.t("utilityGroupUnit:utilityGroupUnit.message.confirmDelete", { utilityGroupUnitCode: groupUnitCode }),
            () => {
                this.props.actions.deleteUtilityGroupUnit(groupUnitId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityGroupUnit();
                        toastr.success(this.props.t("utilityGroupUnit:utilityGroupUnit.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.delete"));
                });
            }
        );
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr_cat","GROUP_UNIT", this.state.objectSearch).then((response) => {
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
                    <UtilityGroupUnitAddEdit
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
                                                    title={t("utilityGroupUnit:utilityGroupUnit.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityGroupUnit:utilityGroupUnit.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityGroupUnit:utilityGroupUnit.button.export")}
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
    const { utilityGroupUnit, common } = state;
    return {
        response: { utilityGroupUnit, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityGroupUnitActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityGroupUnitList));