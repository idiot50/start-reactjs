import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as WoConfigMapUnitGnocNimsActions from './WoConfigMapUnitGnocNimsActions';
import WoConfigMapUnitGnocNimsAddEdit from "./WoConfigMapUnitGnocNimsAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class WoConfigMapUnitGnocNimsList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoConfigMapUnitGnocNims = this.searchWoConfigMapUnitGnocNims.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.handleItemSelectChangeBusinessName = this.handleItemSelectChangeBusinessName.bind(this);
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
            selectBusinessName:{},
            businessNameList:[]
        };
    }

    componentDidMount() {
        // this.props.actions.getListBusinessName("CFG_MAP_GNOC_NIMS_BUSINESS",null);
        this.props.actions.getItemMaster("CFG_MAP_GNOC_NIMS_BUSINESS", "itemId", "itemName", "1", "3").then((response) => {
            let businessNameList = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(i=>{ return {itemId:i.itemId,itemName:i.itemName}}) : []
            this.setState({
                businessNameList
            })
        }).catch((response) => {
            toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.search"));
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.label.action"/>,
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
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id)}>
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
                Header: <Trans i18nKey="woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.label.NIMSCode"/>,
                id: "unitNimsCode",
                accessor: d => {
                    return <span title={d.unitNimsCode}>{d.unitNimsCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="unitNimsCode" placeholder={this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.placeholder.NIMSCode")}
                    value={this.state.objectSearch.unitNimsCode} />
                )
            },
            {
                Header: <Trans i18nKey="woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.label.GNOCCode"/>,
                id: "unitGnocCode",
                accessor: d => {
                    return <span title={d.unitGnocCode}>{d.unitGnocCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="unitGnocCode" placeholder={this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.placeholder.GNOCCode")}
                    value={this.state.objectSearch.unitGnocCode} />
                )
            },
            {
                Header: <Trans i18nKey="woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.label.businessName"/>,
                id: "businessName",
                accessor: d => {
                    return d.businessName ? <span title={d.businessName}>{d.businessName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"businessCode"}
                        label={""}
                        isRequired={false}
                        options={this.state.businessNameList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeBusinessName}
                        selectValue={this.state.selectBusinessName}
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
            this.searchWoConfigMapUnitGnocNims();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.businessCode = this.state.selectBusinessName.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoConfigMapUnitGnocNims(true);
        });
    }

    searchWoConfigMapUnitGnocNims(isSearchClicked = false) {
        this.props.actions.searchWoConfigMapUnitGnocNims(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.search"));
        });
    }

    openAddOrEditPage(value, woConfigMapUnitGnocNimsId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailWoConfigMapUnitGnocNims(woConfigMapUnitGnocNimsId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.odGroupTypeId === null) {
                        response.payload.data.odGroupTypeId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.getDetail"));
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
                    this.searchWoConfigMapUnitGnocNims();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchWoConfigMapUnitGnocNims();
            }
        });
    }

    confirmDelete(woConfigMapUnitGnocNimsId, woConfigMapUnitGnocNimsCode) {
        confirmAlertDelete(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.confirmDelete", { woConfigMapUnitGnocNimsCode: woConfigMapUnitGnocNimsCode }),
        () => {
            this.props.actions.deleteWoConfigMapUnitGnocNims(woConfigMapUnitGnocNimsId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchWoConfigMapUnitGnocNims();
                    toastr.success(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.success.delete"));
                } else {
                    toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.delete"));
            });
        });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "wo_cat",
            moduleName: "WO_CFG_MAP_UNIT_GNOC_NIMS"
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
            const obj = this.state.objectSearch
            console.log(obj)
            delete obj['custom-input-businessCode'];
            this.props.actions.onExportFile("wo_cat", "WO_CFG_MAP_UNIT_GNOC_NIMS", obj).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeBusinessName(option){
        this.setState({selectBusinessName: option});
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <WoConfigMapUnitGnocNimsAddEdit
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
                                                title={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("odType:odType.button.export")}
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
                    <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchWoConfigMapUnitGnocNims}
                        stateImportModal={this.state}/>
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { woConfigMapUnitGnocNims, common } = state;
    return {
        response: { woConfigMapUnitGnocNims, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoConfigMapUnitGnocNimsActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoConfigMapUnitGnocNimsList));