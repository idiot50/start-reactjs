import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as TtConfigReceiveUnitActions from './TtConfigReceiveUnitActions';
import TtConfigReceiveUnitAddEdit from "./TtConfigReceiveUnitAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomAutocomplete, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class ttConfigReceiveUnit extends Component {
    constructor(props) {
        super(props);

        // this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchTtConfigReceiveUnit = this.searchTtConfigReceiveUnit.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);
        this.handleItemSelectChangeTypeName = this.handleItemSelectChangeTypeName.bind(this);
        this.handleItemSelectChangeUnit = this.handleItemSelectChangeUnit.bind(this);

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
            unitTypeListSelect: [
                { itemId: 1, itemName: props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.dropdown.unitType.CTCT") },
                { itemId: 2, itemName: props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.dropdown.unitType.TKTU") }
            ],
            selectValueTypeName: {},
            selectValueUnit: {},
            selectValueUnitType: {}
        };
    }

    componentDidMount() {
        this.props.actions.getListCatItem();
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttConfigReceiveUnit:ttConfigReceiveUnit.label.action" />,
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
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.typeName)}>
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
                Header: <Trans i18nKey="ttConfigReceiveUnit:ttConfigReceiveUnit.label.typeName" />,
                id: "typeName",
                width: 400,
                accessor: d => {
                    return <span title={d.typeName}>{d.typeName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"typeName"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.ttConfigReceiveUnit.ptType && this.props.response.ttConfigReceiveUnit.ptType.payload) ? this.props.response.ttConfigReceiveUnit.ptType.payload.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeTypeName}
                        selectValue={this.state.selectValueTypeName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigReceiveUnit:ttConfigReceiveUnit.label.locationName" />,
                id: "locationName",
                width: 250,
                accessor: d => {
                    return <span title={d.locationName}>{d.locationName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="locationName" 
                        //placeholder={this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.placeholder.locationName")}
                        value={this.state.objectSearch.locationName} />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigReceiveUnit:ttConfigReceiveUnit.label.unitName" />,
                id: "unitName",
                width: 250,
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitName"}
                        label={""}
                        placeholder={this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.placeholder.unitName")}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeUnit}
                        selectValue={this.state.selectValueUnit}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasCheckbox={false}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigReceiveUnit:ttConfigReceiveUnit.label.unitType" />,
                id: "typeUnit",
                minWidth: 200,
                accessor: d => {
                    let typeUnitName;
                    if (d.typeUnit === -1) {
                        typeUnitName = "";
                    } else if (d.typeUnit === 1) {
                        typeUnitName = this.props.t(("ttConfigReceiveUnit:ttConfigReceiveUnit.dropdown.unitType.CTCT"));
                    } else {
                        typeUnitName = this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.dropdown.unitType.TKTU")
                    }
                    return <span title={d.typeUnit}>{typeUnitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"typeUnit"}
                        label={""}
                        isRequired={false}
                        options={this.state.unitTypeListSelect}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeUnitType}
                        selectValue={this.state.selectValueUnitType}
                        isOnlyInputSelect={true}
                    />
                )
            },
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
            this.searchTtConfigReceiveUnit();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.searchAll = values.searchAll ? values.searchAll : "";
        values.typeId = this.state.selectValueTypeName ? this.state.selectValueTypeName.value : null;
        values.unitId = this.state.selectValueUnit ? this.state.selectValueUnit.value : null;
        values.typeUnit = this.state.selectValueUnitType ? this.state.selectValueUnitType.value : null;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchTtConfigReceiveUnit(true);
        });
    }

    searchTtConfigReceiveUnit(isSearchClicked = false) {
        this.props.actions.searchTtConfigReceiveUnit(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.search"));
        });
    }

    openAddOrEditPage(value, ttConfigReceiveUnitId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailTtConfigReceiveUnit(ttConfigReceiveUnitId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.getDetail"));
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
                    this.searchTtConfigReceiveUnit();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchTtConfigReceiveUnit();
            }
        });
    }

    confirmDelete(ttConfigReceiveUnitId, ttConfigReceiveUnitCode) {
        confirmAlertDelete(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.confirmDelete", { ttConfigReceiveUnitCode: ttConfigReceiveUnitCode }),
        () => {
            this.props.actions.deleteTtConfigReceiveUnit(ttConfigReceiveUnitId).then((response) => {
                if (response.payload.statusText === "OK") {
                    this.searchTtConfigReceiveUnit();
                    toastr.success(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.success.delete"));
                } else {
                    toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttConfigReceiveUnit:ttConfigReceiveUnit.message.error.delete"));
            });
        });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "od_cat",
            moduleName: "TT_CONFIGRECEIVEUNIT"
        });
    }

    closeImportModal() {
        this.setState({
            importModal: false,
            client: null,
            moduleName: null
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("od_cat", "TT_CONFIGRECEIVEUNIT", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeUnitType = (option) => {
        this.setState({ selectValueUnitType: option });
    }

    handleItemSelectChangeTypeName(option) {
        this.setState({ selectValueTypeName: option });
    }

    handleItemSelectChangeUnit(option) {
        this.setState({ selectValueUnit: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <TtConfigReceiveUnitAddEdit
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
                                                    title={t("ttConfigReceiveUnit:ttConfigReceiveUnit.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ttConfigReceiveUnit:ttConfigReceiveUnit.button.add")}
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
                    <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchTtConfigReceiveUnit}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { ttConfigReceiveUnit, common } = state;
    return {
        response: { ttConfigReceiveUnit, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtConfigReceiveUnitActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ttConfigReceiveUnit));