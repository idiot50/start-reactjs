import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as WoMaterialsConfigActions from './WoMaterialsConfigActions';
import WoMaterialsConfigAddEdit from "./WoMaterialsConfigAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomAutocomplete } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class WoMaterialsConfigList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoMaterialsConfig = this.searchWoMaterialsConfig.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
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
            client: 'wo_cat',
            moduleName: 'WO_MATERIAL_THRES',
            //Select
            actionList: [],
            serviceList: [],
            pureServiceList: [],
            selectValueInfraType: {},
            selectValueAction: {},
            selectValueService: {},
            selectValueMaterialId: {}
        };
    }

    componentWillMount() {
        this.props.actions.getItemMaster("WO_TECHNOLOGY_CODE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster('WO_ACTION_GROUP', "itemId", "itemName", "1", "3").then((response) => {
            this.setState({
                actionList: response.payload.data && response.payload ? response.payload.data.data : []
            })
        })
        this.props.actions.getItemServiceMaster("serviceId", "serviceName", 1, 8).then((response) => {
            let listService = response.payload.data.data.map(i => ({ itemId: i.serviceId, itemName: i.serviceName }))
            this.setState({
                serviceList: listService,
                pureServiceList: listService
            })
        })
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.function" />,
                id: "function",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.materialThresId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.materialThresId, d.materialGroupCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.materialThresId)}>
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
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.tech" />,
                id: "technology",
                width: 250,
                accessor: d => {
                    return <span title={d.technology}>{d.technology}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"technology"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.woTechnologyCode && this.props.response.common.woTechnologyCode.payload) ? this.props.response.common.woTechnologyCode.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeInfraType}
                        selectValue={this.state.selectValueInfraType}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.service" />,
                id: "serviceName",
                width: 250,
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
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.action" />,
                id: "actionName",
                width: 250,
                accessor: d => {
                    return <span title={d.actionName}>{d.actionName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"actionName"}
                        label={""}
                        isRequired={false}
                        options={this.state.actionList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeAction}
                        selectValue={this.state.selectValueAction}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.material" />,
                id: "materialName",
                width: 200,
                accessor: d => {
                    return <span title={d.materialName}>{d.materialName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"materialId"}
                        label={""}
                        placeholder={this.props.t("woMaterialsConfig:woMaterialsConfig.placeholder.material")}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeMaterialId}
                        selectValue={this.state.selectValueMaterialId}
                        moduleName={"GNOC_WO_MATERIAL"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.technical" />,
                id: "techThres",
                width: 200,
                className: "text-right",
                accessor: d => {
                    return <span title={d.techThres}>{d.techThres}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.alarm" />,
                id: "warningThres",
                width: 200,
                className: "text-right",
                accessor: d => {
                    return <span title={d.warningThres}>{d.warningThres}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.free" />,
                id: "freeThres",
                width: 200,
                className: "text-right",
                accessor: d => {
                    return <span title={d.freeThres}>{d.freeThres}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.techNIMS" />,
                id: "techDistanctThresStr",
                width: 200,
                className: "text-right",
                accessor: d => {
                    return <span title={d.techDistanctThresStr}>{d.techDistanctThresStr}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.alarmNIMS" />,
                id: "warningDistanctThresStr",
                width: 200,
                className: "text-right",
                accessor: d => {
                    return <span title={d.warningDistanctThresStr}>{d.warningDistanctThresStr}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMaterialsConfig:woMaterialsConfig.label.freeNIMS" />,
                id: "freeDistanctThresStr",
                width: 200,
                className: "text-right",
                accessor: d => {
                    return <span title={d.freeDistanctThresStr}>{d.freeDistanctThresStr}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
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
            this.searchWoMaterialsConfig();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.infraType = (this.state.selectValueInfraType && this.state.selectValueInfraType.subValue) ? parseInt(this.state.selectValueInfraType.subValue) : "";
        objectSearch.serviceId = this.state.selectValueService.value || "";
        objectSearch.actionId = this.state.selectValueAction.value || "";
        objectSearch.materialId = this.state.selectValueMaterialId ? this.state.selectValueMaterialId.value : ""
        objectSearch.page = 1;
        delete objectSearch['custom-input-actionName'];
        delete objectSearch['custom-input-materialId'];
        delete objectSearch['custom-input-serviceName'];
        delete objectSearch['custom-input-technology'];
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoMaterialsConfig(true);
        });
    }

    searchWoMaterialsConfig(isSearchClicked = false) {
        this.props.actions.searchWoMaterialsConfig(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.search"));
        });
    }

    openAddOrEditPage(value, woMaterialsConfigId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailWoMaterialsConfig(woMaterialsConfigId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.materialThresId === null) {
                        response.payload.data.materialThresId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.getDetail"));
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
                    this.searchWoMaterialsConfig();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchWoMaterialsConfig();
            }
        });
    }

    confirmDelete(woMaterialsConfigId, woMaterialsConfigCode) {
        confirmAlertDelete(this.props.t("woMaterialsConfig:woMaterialsConfig.message.confirmDelete", { woMaterialsConfigCode: woMaterialsConfigCode }),
            () => {
                this.props.actions.deleteWoMaterialsConfig(woMaterialsConfigId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchWoMaterialsConfig();
                        toastr.success(this.props.t("woMaterialsConfig:woMaterialsConfig.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.delete"));
                });
            });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "wo_cat",
            moduleName: "WO_MATERIAL_THRES"
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
            this.props.actions.onExportFile("wo_cat", "WO_MATERIAL_THRES", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeInfraType = (option) => {
        this.setState({
            selectValueInfraType: option
        })
    }

    handleItemSelectChangeService = (option) => {
        this.setState({
            selectValueService: option
        })
    }

    handleItemSelectChangeAction = (option) => {
        this.setState({
            selectValueAction: option
        })
    }

    handleItemSelectChangeMaterialId = (option) => {
        this.setState({
            selectValueMaterialId: option
        })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <WoMaterialsConfigAddEdit
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
                                                    title={t("woMaterialsConfig:woMaterialsConfig.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woMaterialsConfig:woMaterialsConfig.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woMaterialsConfig:woMaterialsConfig.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("woMaterialsConfig:woMaterialsConfig.button.export")}
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
                        reloadGridData={this.searchWoMaterialsConfig}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { woMaterialsConfig, common } = state;
    return {
        response: { woMaterialsConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoMaterialsConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoMaterialsConfigList));