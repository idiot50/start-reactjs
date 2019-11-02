import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityDepartmentsScopeManagementActions from './UtilityDepartmentsScopeManagementActions';
import UtilityDepartmentsScopeManagementAddEdit from "./UtilityDepartmentsScopeManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, CustomMultiSelectLocal, SearchBar, CustomAutocomplete, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityDepartmentsScopeManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchUtilityDepartmentsScopeManagement = this.searchUtilityDepartmentsScopeManagement.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
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
            listCmseCode: [],
            listCmseName: [],
            listImpactSegment: [],
            listDevice: [],
            piorListDevice: [],
            selectValueCmseCode: {},
            selectValueCmseName: {},
            selectValueUnitCode: {},
            selectValueUnitName: {},
            selectValueImpactSegment: {},
            selectValueDeviceType: {}
        };
    }

    componentDidMount() {
        this.props.actions.getListDeviceTypeByImpactSegmentCBB(0).then((response) => {
            this.setState({
                listDevice: response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : [],
                piorListDevice: response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : []
            })
        })
        this.props.actions.getListManagerScopeCBB().then((response) => {
            const listCmseCode = response.payload.data ? response.payload.data.map(i => ({ itemId: i.cmseCode, itemName: i.cmseCode })) : []
            const listCmseName = response.payload.data ? response.payload.data.map(i => ({ itemId: i.cmseName, itemName: i.cmseName })) : []
            this.props.actions.getListImpactSegmentCBB().then((response) => {
                this.setState({
                    listImpactSegment: response.payload.data ? response.payload.data.map(i => ({ itemId: i.impactSegmentId, itemName: i.impactSegmentName })) : []
                })
            })
            this.setState({
                listCmseCode,
                listCmseName
            })
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.cmnoseId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.cmnoseId, d.cmseCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.cmnoseId)}>
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
                Header: <Trans i18nKey="utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.cmseCode" />,
                id: "cmseCode",
                minWidth: 200,
                accessor: d => {
                    return <span title={d.cmseCode}>{d.cmseCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"cmseCode"}
                        label={""}
                        isRequired={false}
                        options={this.state.listCmseCode}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCmseCode}
                        selectValue={this.state.selectValueCmseCode}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.cmseName" />,
                id: "cmseName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.cmseName}>{d.cmseName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"cmseName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listCmseName}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCmseName}
                        selectValue={this.state.selectValueCmseName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.unitCode" />,
                id: "unitCode",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.unitCode}>{d.unitCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitName"}
                        label={""}
                        placeholder={this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.placeholder.unit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeUnitCode}
                        selectValue={this.state.selectValueUnitCode}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.unitName" />,
                id: "unitName",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitName"}
                        label={""}
                        placeholder={this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.placeholder.unit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeUnitName}
                        selectValue={this.state.selectValueUnitName}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.group" />,
                id: "crTypeId",
                minWidth: 250,
                accessor: d => {
                    return <span title={d.crTypeName}>{d.crTypeName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"impactSegmentName"}
                        options={this.state.listImpactSegment}
                        isRequired={false}
                        label={""}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleChangeImpactSegment}
                        selectValue={this.state.selectValueImpactSegment}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.deviceType" />,
                id: "deviceType",
                sortable: false,
                minWidth: 250,
                accessor: d => {
                    return <span title={d.deviceTypeName}>{d.deviceTypeName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"lstCrUnitsScopeDeviceTypeDTO"}
                        options={this.state.listDevice}
                        isRequired={false}
                        label={""}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeDeviceType}
                        selectValue={this.state.selectValueDeviceType}
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
            this.searchUtilityDepartmentsScopeManagement();
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.cmseCode = (this.state.selectValueCmseCode && this.state.selectValueCmseCode.value) ? this.state.selectValueCmseCode.label : "";
        objectSearch.cmseName = (this.state.selectValueCmseName && this.state.selectValueCmseName.value) ? this.state.selectValueCmseName.label : "";
        objectSearch.unitCode = (this.state.selectValueUnitCode && this.state.selectValueUnitCode.label) ? this.state.selectValueUnitCode.label.split(/[()]/)[1].trim() : "";
        objectSearch.unitName = (this.state.selectValueUnitName && this.state.selectValueUnitName.label) ? this.state.selectValueUnitName.label.split(/[()]/)[0].trim() : "";
        objectSearch.crTypeId = this.state.selectValueImpactSegment.value || "";
        objectSearch.deviceType = this.state.selectValueDeviceType.value || "";
        objectSearch.page = 1;
        delete objectSearch['custom-input-cmseCode'];
        delete objectSearch['custom-input-cmseName'];
        delete objectSearch['custom-input-impactSegmentName'];
        delete objectSearch['custom-input-lstCrUnitsScopeDeviceTypeDTO'];
        delete objectSearch['custom-input-unitName']
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityDepartmentsScopeManagement(true);
        });
    }

    searchUtilityDepartmentsScopeManagement(isSearchClicked = false) {
        this.props.actions.searchUtilityDepartmentsScopeManagement(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityDepartmentsScopeManagementId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityDepartmentsScopeManagement(utilityDepartmentsScopeManagementId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.cmnoseId === null) {
                        response.payload.data.cmnoseId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.getDetail"));
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
                    this.searchUtilityDepartmentsScopeManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityDepartmentsScopeManagement();
            }
        });
    }
    confirmDelete(utilityDepartmentsScopeManagementId, utilityDepartmentsScopeManagementCode) {
        confirmAlertDelete(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.confirmDelete", { utilityDepartmentsScopeManagementCode: utilityDepartmentsScopeManagementCode }),
            () => {
                this.props.actions.deleteUtilityDepartmentsScopeManagement(utilityDepartmentsScopeManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityDepartmentsScopeManagement();
                        toastr.success(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.delete"));
                });
            }
        );
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("cr_cat", "CR_MANAGER_UNITS_OF_SCOPE", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeCmseCode = (option) => {
        this.setState({
            selectValueCmseCode: option
        })
    }

    handleItemSelectChangeCmseName = (option) => {
        this.setState({
            selectValueCmseName: option
        })
    }

    handleItemSelectChangeUnitCode = (value) => {
        this.setState({
            selectValueUnitCode: value
        })
    }

    handleItemSelectChangeUnitName = (value) => {
        this.setState({
            selectValueUnitName: value
        })
    }

    handleChangeImpactSegment = (option) => {
        this.setState({
            selectValueImpactSegment: option
        })
        if (option && option.value) {
            if (option.value !== this.state.selectValueImpactSegment.value) {
                this.props.actions.getListDeviceTypeByImpactSegmentCBB(option.value).then((response) => {
                    this.setState({
                        listDevice: response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : [],
                        selectValueDeviceType: {}
                    })
                })
            }
        } else {
            this.setState({
                listDevice: this.state.piorListDevice
            })
        }
    }

    handleItemSelectChangeDeviceType = (option) => {
        this.setState({
            selectValueDeviceType: option
        })
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }



    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityDepartmentsScopeManagementAddEdit
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
                                                    title={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.button.export")}
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
    const { utilityDepartmentsScopeManagement, common } = state;
    return {
        response: { utilityDepartmentsScopeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityDepartmentsScopeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityDepartmentsScopeManagementList));