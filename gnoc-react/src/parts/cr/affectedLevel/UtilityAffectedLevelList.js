import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityAffectedLevelActions from './UtilityAffectedLevelActions';
import UtilityAffectedLevelAddEdit from "./UtilityAffectedLevelAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { validSubmitForm, confirmAlertDelete } from "../../../containers/Utils/Utils";


class UtilityAffectedLevelList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityAffectedLevel = this.searchUtilityAffectedLevel.bind(this);
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
            listApproveLevel: [
                { itemId: 0, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.no") },
                { itemId: 1, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.yes") }
            ],
            listAppliedSystem: [
                { itemId: 1, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.applyforCR") },
                { itemId: 2, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.applyforMR") }
            ],
            selectValueAffectedLevel: {},
            selectValueAppliedSystem: {}
        };
    }

    componentDidMount() {
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityAffectedLevel:utilityAffectedLevel.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.affectedLevelId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.affectedLevelId, d.affectedLevelCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.affectedLevelId)}>
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
                Header: <Trans i18nKey="utilityAffectedLevel:utilityAffectedLevel.label.affectedLevelCode" />,
                id: "affectedLevelCode",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.affectedLevelCode}>{d.affectedLevelCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="affectedLevelCode" placeholder={this.props.t("utilityAffectedLevel:utilityAffectedLevel.placeholder.affectedLevelCode")}
                        value={this.state.objectSearch.affectedLevelCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityAffectedLevel:utilityAffectedLevel.label.affectedLevelName" />,
                id: "affectedLevelName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.affectedLevelName}>{d.affectedLevelName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="affectedLevelName" placeholder={this.props.t("utilityAffectedLevel:utilityAffectedLevel.placeholder.affectedLevelName")}
                        value={this.state.objectSearch.affectedLevelName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityAffectedLevel:utilityAffectedLevel.label.affectedLevel" />,
                id: "twoApproveLevel",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.twoApproveLevelName}>{d.twoApproveLevelName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"twoApproveLevel"}
                        label={""}
                        isRequired={false}
                        options={this.state.listApproveLevel}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeAffectedLevel}
                        selectValue={this.state.selectValueAffectedLevel}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityAffectedLevel:utilityAffectedLevel.label.appliedSystem" />,
                id: "appliedSystem",
                minWidth: 300,
                accessor: d => {
                    return <span title={d.appliedSystemName}>{d.appliedSystemName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"appliedSystem"}
                        label={""}
                        isRequired={false}
                        options={this.state.listAppliedSystem}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeAppliedSystem}
                        selectValue={this.state.selectValueAppliedSystem}
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
            this.searchUtilityAffectedLevel();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        validSubmitForm(event, values, "idFormSearch");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.twoApproveLevel = this.state.selectValueAffectedLevel.value;
        objectSearch.appliedSystem = this.state.selectValueAppliedSystem.value || "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityAffectedLevel(true);
        });
    }

    searchUtilityAffectedLevel(isSearchClicked = false) {
        this.props.actions.searchUtilityAffectedLevel(this.state.objectSearch).then((response) => {
            for (const item of response.payload.data.data) {
                if (item.appliedSystem === 1) {
                    item.appliedSystemName = this.props.t("utilityAffectedLevel:utilityAffectedLevel.label.applyforCR")
                } else {
                    item.appliedSystemName = this.props.t("utilityAffectedLevel:utilityAffectedLevel.label.applyforMR")
                }
                if (item.twoApproveLevel === 0) {
                    item.twoApproveLevelName = this.props.t("utilityAffectedLevel:utilityAffectedLevel.label.no")
                } else {
                    item.twoApproveLevelName = this.props.t("utilityAffectedLevel:utilityAffectedLevel.label.yes")
                }
            }
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
            toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityAffectedLevelId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityAffectedLevel(utilityAffectedLevelId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.affectedLevelId === null) {
                        response.payload.data.affectedLevelId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.getDetail"));
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
                    this.searchUtilityAffectedLevel();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityAffectedLevel();
            }
        });
    }

    confirmDelete(utilityAffectedLevelId, utilityAffectedLevelCode) {
        confirmAlertDelete(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.confirmDelete", { utilityAffectedLevelCode: utilityAffectedLevelCode }),
            () => {
                this.props.actions.deleteUtilityAffectedLevel(utilityAffectedLevelId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityAffectedLevel();
                        toastr.success(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.delete"));
                });
            }
        );
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr_cat","AFFECTED_LEVEL", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeAffectedLevel = (option) => {
        this.setState({ selectValueAffectedLevel: option });
    }

    handleItemSelectChangeAppliedSystem = (option) => {
        this.setState({ selectValueAppliedSystem: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityAffectedLevelAddEdit
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
                                                    title={t("utilityAffectedLevel:utilityAffectedLevel.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityAffectedLevel:utilityAffectedLevel.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityAffectedLevel:utilityAffectedLevel.button.export")}
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
    const { utilityAffectedLevel, common } = state;
    return {
        response: { utilityAffectedLevel, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityAffectedLevelActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityAffectedLevelList));