import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as OdConfigBusinessActions from './OdConfigBusinessActions';
import * as odTypeActions from './../category/OdTypeActions';
import OdConfigBusinessAddEdit from "./OdConfigBusinessAddEdit";
import { CustomReactTableSearch, CustomSelect, CustomSelectLocal, SettingTableLocal, SearchBar } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class OdConfigBusinessList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchOdConfigBusiness = this.searchOdConfigBusiness.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.handleItemSelectChangeOdType = this.handleItemSelectChangeOdType.bind(this);
        this.handleItemSelectChangeOdNewStatus = this.handleItemSelectChangeOdNewStatus.bind(this);
        this.handleItemSelectChangeOdOldStatus = this.handleItemSelectChangeOdOldStatus.bind(this);
        this.handleItemSelectChangeOdPriority = this.handleItemSelectChangeOdPriority.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);

        this.state = {
            collapseFormInfo: true,
            btnSearchLoading: false,
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
            statusListSelect: [
                { itemId: 1, itemName: props.t("odConfigBusiness:odConfigBusiness.dropdown.status.yes") },
                { itemId: 0, itemName: props.t("odConfigBusiness:odConfigBusiness.dropdown.status.no") },
            ],
            lstStatus: [],
            selectValueOdType: {},
            selectValueOdOldStatus: {},
            selectValueOdNewStatus: {},
            selectValueIsDefault: {},
            selectValueOdPriority: {}
        };
    }
    
    componentDidMount() {
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("OD_STATUS", "itemId", "itemName", "1", "3").then((response) => {
            let lstStatus = response.payload.data.data.map(item => {
                return {
                    itemId: item.itemValue,
                    itemName: item.itemName,
                    itemCode: item.itemCode
                }
            });
            this.setState({
                lstStatus
            });
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.action" />,
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
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.odConfigBusinessCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.id)}>
                            <Button type="button" size="sm" className="btn-warning icon"><i className="fa fa-copy"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.odTypeName" />,
                id: "odTypeName",
                width: 300,
                accessor: d => {
                    return d.odTypeName ? <span title={d.odTypeName}>{d.odTypeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"odTypeId"}
                        label={""}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdType}
                        selectValue={this.state.selectValueOdType}
                        moduleName={"GNOC_OD_TYPE"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.odPriorityName" />,
                id: "odPriorityName",
                width: 150,
                accessor: d => <span title={d.odPriorityName}>{d.odPriorityName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"odPriority"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.odPriority && this.props.response.common.odPriority.payload) ? this.props.response.common.odPriority.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdPriority}
                        selectValue={this.state.selectValueOdPriority}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.oldStatusName" />,
                id: "oldStatusName",
                width: 150,
                accessor: d => <span title={d.oldStatusName}>{d.oldStatusName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"oldStatus"}
                        label={""}
                        isRequired={false}
                        options={this.state.lstStatus}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdOldStatus}
                        selectValue={this.state.selectValueOdOldStatus}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.newStatusName" />,
                id: "newStatusName",
                width: 150,
                accessor: d => <span title={d.newStatusName}>{d.newStatusName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"newStatus"}
                        label={""}
                        isRequired={false}
                        options={this.state.lstStatus}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdNewStatus}
                        selectValue={this.state.selectValueOdNewStatus}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.isDefaultName" />,
                id: "isDefaultName",
                minWidth: 200,
                accessor: d => <span title={d.isDefaultName}>{d.isDefaultName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"isDefault"}
                        label={""}
                        isRequired={false}
                        options={this.state.statusListSelect}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={(d) => this.setState({ selectValueIsDefault: d })}
                        selectValue={this.state.selectValueIsDefault}
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
            this.searchOdConfigBusiness();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        let obj = values;
        obj.odTypeId = this.state.selectValueOdType.value;
        obj.odPriority = this.state.selectValueOdPriority.value;
        obj.oldStatus = this.state.selectValueOdOldStatus.value;
        obj.newStatus = this.state.selectValueOdNewStatus.value;
        obj.isDefault = this.state.selectValueIsDefault.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchOdConfigBusiness(true);
        });
    }

    searchOdConfigBusiness(isSearchClicked = false) {
        this.props.actions.searchOdConfigBusiness(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.search"));
        });
    }

    openAddOrEditPage(value, id) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value,
                selectedData: {}
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailOdConfigBusiness(id).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.getDetail"));
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
                    this.searchOdConfigBusiness();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchOdConfigBusiness();
            }
        });
    }

    confirmDelete(odConfigBusinessId, odConfigBusinessCode) {
        confirmAlertDelete(this.props.t("odConfigBusiness:odConfigBusiness.message.confirmDelete", { odConfigBusinessCode: odConfigBusinessCode }),
        () => {
            this.props.actions.deleteOdConfigBusiness(odConfigBusinessId).then((response) => {
                if (response.payload && response.payload.data.key === "SUCCESS") {
                    this.searchOdConfigBusiness();
                    toastr.success(this.props.t("odConfigBusiness:odConfigBusiness.message.success.delete"));
                } else {
                    toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.delete"));
            });
        });
    }

    handleItemSelectChangeOdType(option) {
        this.setState({selectValueOdType: option});
    }

    handleItemSelectChangeOdNewStatus(option) {
        this.setState({selectValueOdNewStatus: option});
    }

    handleItemSelectChangeOdOldStatus(option) {
        this.setState({selectValueOdOldStatus: option});
    }

    handleItemSelectChangeOdPriority(option) {
        this.setState({selectValueOdPriority: option});
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = this.state.objectSearch;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <OdConfigBusinessAddEdit
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
                                                title={t("odConfigBusiness:odConfigBusiness.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                        title={t("odConfigBusiness:odConfigBusiness.button.add")}
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
    const { odConfigBusiness, common, odType } = state;
    return {
        response: { odConfigBusiness, common, odType }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdConfigBusinessActions, commonActions, odTypeActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdConfigBusinessList));