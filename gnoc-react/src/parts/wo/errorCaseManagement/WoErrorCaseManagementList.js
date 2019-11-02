import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as WoErrorCaseManagementActions from './WoErrorCaseManagementActions';
import WoErrorCaseManagementAddEdit from "./WoErrorCaseManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class WoErrorCaseManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoErrorCaseManagement = this.searchWoErrorCaseManagement.bind(this);
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
            selectValueService: {},
            selectValueInfraType: {},
            serviceList: [],
        };
    }
    componentWillMount() {
        this.props.actions.getItemMaster("WO_TECHNOLOGY_CODE", "itemId", "itemName", "1", "3")
    }
    componentDidMount() {
        this.props.actions.getItemServiceMaster("serviceId", "serviceName", 1, 8).then((response) => {
            let listService = response.payload.data.data.map(i => ({ itemId: i.serviceId, itemName: i.serviceName }))
            this.setState({
                serviceList: listService,
            })
        })
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woErrorCaseManagement:woErrorCaseManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.id)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.caseName)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.id)}>
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
                Header: <Trans i18nKey="woErrorCaseManagement:woErrorCaseManagement.label.caseErrorName" />,
                id: "caseName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.caseName}>{d.caseName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="caseName" placeholder={this.props.t("woErrorCaseManagement:woErrorCaseManagement.placeholder.caseErrorName")}
                        value={this.state.objectSearch.caseName} />
                )
            },
            {
                Header: <Trans i18nKey="woErrorCaseManagement:woErrorCaseManagement.label.service" />,
                id: "serviceName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.serviceName}>{d.serviceName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"serviceName"}
                        label={""}
                        isRequired={false}
                        options={this.state.serviceList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeService}
                        selectValue={this.state.selectValueService}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woErrorCaseManagement:woErrorCaseManagement.label.technology" />,
                id: "infraTypeName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.infraTypeName}>{d.infraTypeName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"infraTypeName"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.woTechnologyCode && this.props.response.common.woTechnologyCode.payload) ? this.props.response.common.woTechnologyCode.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeInfraType}
                        selectValue={this.state.selectValueInfraType}
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
            this.searchWoErrorCaseManagement();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.searchAll = values.searchAll.trim() || "";
        objectSearch.caseName = values.caseName.trim() || "";
        objectSearch.infraTypeID = (this.state.selectValueInfraType && this.state.selectValueInfraType.subValue) ? parseInt(this.state.selectValueInfraType.subValue) : "";
        objectSearch.serviceID = this.state.selectValueService.value || "";
        objectSearch.page = 1;
        delete objectSearch['custom-input-infraTypeName'];
        delete objectSearch['custom-input-serviceName'];
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoErrorCaseManagement(true);
        });
    }

    searchWoErrorCaseManagement(isSearchClicked = false) {
        this.props.actions.searchWoErrorCaseManagement(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.search"));
        });
    }

    openAddOrEditPage(value, woErrorCaseManagementId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailWoErrorCaseManagement(woErrorCaseManagementId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.id === null) {
                        response.payload.data.id = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.getDetail"));
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
                    this.searchWoErrorCaseManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchWoErrorCaseManagement();
            }
        });
    }

    confirmDelete(woErrorCaseManagementId, woErrorCaseManagementCode) {
        confirmAlertDelete(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.confirmDelete", { woErrorCaseManagementCode: woErrorCaseManagementCode }),
            () => {
                this.props.actions.deleteWoErrorCaseManagement(woErrorCaseManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchWoErrorCaseManagement();
                        toastr.success(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("woErrorCaseManagement:woErrorCaseManagement.message.error.delete"));
                });
            });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("wo_cat", "CFG_SUPPORT_CASE", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeService = (option) => {
        this.setState({ selectValueService: option });
    }

    handleItemSelectChangeInfraType = (option) => {
        this.setState({ selectValueInfraType: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <WoErrorCaseManagementAddEdit
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
                                                    title={t("woErrorCaseManagement:woErrorCaseManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woErrorCaseManagement:woErrorCaseManagement.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("woErrorCaseManagement:woErrorCaseManagement.button.export")}
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
    const { woErrorCaseManagement, common } = state;
    return {
        response: { woErrorCaseManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoErrorCaseManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoErrorCaseManagementList));