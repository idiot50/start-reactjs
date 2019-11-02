import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityImpactSegmentActions from './UtilityImpactSegmentActions';
import UtilityImpactSegmentAddEdit from "./UtilityImpactSegmentAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityImpactSegmentList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityImpactSegment = this.searchUtilityImpactSegment.bind(this);
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
            listAppliedSystem: [
                { itemId: 2, itemName: props.t("utilityImpactSegment:utilityImpactSegment.label.applyforCR") },
                { itemId: 1, itemName: props.t("utilityImpactSegment:utilityImpactSegment.label.applyforMR") }
            ],
            selectValueAppliedSystem: {}
        };
    }

    componentDidMount() {
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityImpactSegment:utilityImpactSegment.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.impactSegmentId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.impactSegmentId, d.impactSegmentCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.impactSegmentId)}>
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
                Header: <Trans i18nKey="utilityImpactSegment:utilityImpactSegment.label.impactSegmentCode" />,
                id: "impactSegmentCode",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.impactSegmentCode}>{d.impactSegmentCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="impactSegmentCode" placeholder={this.props.t("utilityImpactSegment:utilityImpactSegment.placeholder.impactSegmentCode")}
                        value={this.state.objectSearch.impactSegmentCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityImpactSegment:utilityImpactSegment.label.impactSegmentName" />,
                id: "impactSegmentName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.impactSegmentName}>{d.impactSegmentName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="impactSegmentName" placeholder={this.props.t("utilityImpactSegment:utilityImpactSegment.placeholder.impactSegmentName")}
                        value={this.state.objectSearch.impactSegmentName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityImpactSegment:utilityImpactSegment.label.appliedSystem" />,
                id: "appliedSystem",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.appliedSystemName}>{d.appliedSystemName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"appliedSystemName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listAppliedSystem}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeAppliedSystem}
                        selectValue={this.state.selectValueAppliedSystem}
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
            this.searchUtilityImpactSegment();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.impactSegmentCode = values.impactSegmentCode.trim();
        objectSearch.searchAll = values.searchAll.trim();
        objectSearch.appliedSystem = this.state.selectValueAppliedSystem.value;
        objectSearch.appliedSystemName = this.state.selectValueAppliedSystem.label;
        objectSearch.page = 1;
        delete objectSearch['custom-input-appliedSystemName'];
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityImpactSegment(true);
        });
    }

    searchUtilityImpactSegment(isSearchClicked = false) {
        this.props.actions.searchUtilityImpactSegment(this.state.objectSearch).then((response) => {
            let list =
                response.payload.data.data ? response.payload.data.data.map(i => ({ ...i, appliedSystemName: i.appliedSystem === 2 ? this.props.t("utilityImpactSegment:utilityImpactSegment.label.applyforCR") : this.props.t("utilityImpactSegment:utilityImpactSegment.label.applyforMR") })) : [];
            this.setState({
                data: list,
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
            toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityImpactSegmentId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityImpactSegment(utilityImpactSegmentId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.impactSegmentId === null) {
                        response.payload.data.impactSegmentId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.getDetail"));
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
                    this.searchUtilityImpactSegment();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityImpactSegment();
            }
        });
    }

    confirmDelete(utilityImpactSegmentId, utilityImpactSegmentCode) {
        confirmAlertDelete(this.props.t("utilityImpactSegment:utilityImpactSegment.message.confirmDelete", { utilityImpactSegmentCode: utilityImpactSegmentCode }),
            () => {
                this.props.actions.deleteUtilityImpactSegment(utilityImpactSegmentId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityImpactSegment();
                        toastr.success(this.props.t("utilityImpactSegment:utilityImpactSegment.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.delete"));
                });
            }
        );
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr_cat","IMPACT_SEGMENT", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
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
                    <UtilityImpactSegmentAddEdit
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
                                                    title={t("utilityImpactSegment:utilityImpactSegment.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityImpactSegment:utilityImpactSegment.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityImpactSegment:utilityImpactSegment.button.export")}
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
    const { utilityImpactSegment, common } = state;
    return {
        response: { utilityImpactSegment, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityImpactSegmentActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityImpactSegmentList));