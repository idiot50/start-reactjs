import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityGroupDepartmentConfigActions from './UtilityGroupDepartmentConfigActions';
import UtilityGroupDepartmentConfigAddEdit from "./UtilityGroupDepartmentConfigAddEdit";
import { CustomReactTableSearch, SettingTableLocal, SearchBar, CustomSelect, CustomAutocomplete } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityGroupDepartmentConfigList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityGroupDepartmentConfig = this.searchUtilityGroupDepartmentConfig.bind(this);
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
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectValueUnitCode: {},
            selectValueUnitName: {},
            selectValueGroupUnitCode: {},
            selectValueGroupUnitName: {}
        };
    }

    componentDidMount() {
        
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.groupUnitDetailId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.groupUnitDetailId, d.utilityGroupDepartmentConfigCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.groupUnitDetailId)}>
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
                Header: <Trans i18nKey="utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.label.groupUnitCode" />,
                id: "groupUnitCode",
                width: 350,
                accessor: d => {
                    return <span title={d.groupUnitCode}>{d.groupUnitCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"groupUnitCode"}
                        label={""}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeGroupUnitCode}
                        selectValue={this.state.selectValueGroupUnitCode}
                        moduleName={"GNOC_CR_GROUP_UNIT_CODE"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.label.groupUnitName" />,
                id: "groupUnitName",
                width: 350,
                accessor: d => {
                    return <span title={d.groupUnitName}>{d.groupUnitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"groupUnitName"}
                        label={""}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeGroupUnitName}
                        selectValue={this.state.selectValueGroupUnitName}
                        moduleName={"GNOC_CR_GROUP_UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.label.unitCode" />,
                id: "unitCode",
                width: 350,
                accessor: d => {
                    return <span title={d.unitCode}>{d.unitCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitCode"}
                        label={""}
                        placeholder={this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.placeholder.unitCode")}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeReceiveUnitCode}
                        selectValue={this.state.selectValueUnitCode}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.label.unitName" />,
                id: "status",
                minWidth: 200,
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitName"}
                        label={""}
                        isRequired={false}
                        placeholder={this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.placeholder.unitName")}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeReceiveUnitName}
                        selectValue={this.state.selectValueUnitName}
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
            this.searchUtilityGroupDepartmentConfig();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.groupUnitCode = (this.state.selectValueGroupUnitCode && this.state.selectValueGroupUnitCode.value) ? this.state.selectValueGroupUnitCode.label : null;
        objectSearch.groupUnitName = (this.state.selectValueGroupUnitName && this.state.selectValueGroupUnitName.value) ? this.state.selectValueGroupUnitName.label : null;
        objectSearch.unitCode = (this.state.selectValueUnitCode && this.state.selectValueUnitCode.label) ? this.state.selectValueUnitCode.label.split(/[()]/)[1].trim() : "";
        objectSearch.unitName = (this.state.selectValueUnitName && this.state.selectValueUnitName.label) ? this.state.selectValueUnitName.label.split(/[()]/)[0].trim() : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityGroupDepartmentConfig(true);
        });
    }

    searchUtilityGroupDepartmentConfig(isSearchClicked = false) {
        this.props.actions.searchUtilityGroupDepartmentConfig(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityGroupDepartmentConfigId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityGroupDepartmentConfig(utilityGroupDepartmentConfigId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.groupUnitDetailId === null) {
                        response.payload.data.groupUnitDetailId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.getDetail"));
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
                    this.searchUtilityGroupDepartmentConfig();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityGroupDepartmentConfig();
            }
        });
    }

    confirmDelete(utilityGroupDepartmentConfigId, utilityGroupDepartmentConfigCode) {
        confirmAlertDelete(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.confirmDelete", { utilityGroupDepartmentConfigCode: utilityGroupDepartmentConfigCode }),
            () => {
                this.props.actions.deleteUtilityGroupDepartmentConfig(utilityGroupDepartmentConfigId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityGroupDepartmentConfig();
                        toastr.success(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.delete"));
                });
            }
        );
    }


    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            const obj = this.state.objectSearch
            delete obj['custom-input-groupUnitCode'];
            delete obj['custom-input-groupUnitName'];
            delete obj['custom-input-unitCode'];
            delete obj['custom-input-unitName'];
            this.props.actions.onExportFile("cr_cat", "GROUP_UNIT_DETAIL", obj).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeReceiveUnitCode = (option) => {
        this.setState({ selectValueUnitCode: option });
    }

    handleItemSelectChangeReceiveUnitName = (option) => {
        this.setState({ selectValueUnitName: option });
    }

    handleItemSelectChangeGroupUnitName = (option) => {
        this.setState({ selectValueGroupUnitName: option });
    }
    handleItemSelectChangeGroupUnitCode = (option) => {
        this.setState({ selectValueGroupUnitCode: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityGroupDepartmentConfigAddEdit
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
                                                    title={t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.button.export")}
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
    const { utilityGroupDepartmentConfig, common } = state;
    return {
        response: { utilityGroupDepartmentConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityGroupDepartmentConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityGroupDepartmentConfigList));