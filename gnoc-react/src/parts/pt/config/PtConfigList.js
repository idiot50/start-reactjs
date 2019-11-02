import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import moment from 'moment';

import * as commonActions from './../../../actions/commonActions';
import * as PtConfigActions from './PtConfigActions';
import PtConfigAddEdit from "./PtConfigAddEdit";
import { CustomReactTableSearch, SettingTableLocal, SearchBar, CustomMultiSelectLocal, CustomDateTimeRangePicker, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { convertDateToDDMMYYYYHHMISS, validSubmitForm, confirmAlertDelete } from "../../../containers/Utils/Utils";

class OdCategoryList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchPtConfig = this.searchPtConfig.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.onExport = this.onExport.bind(this);
        this.handleItemSelectChangeTypeCode = this.handleItemSelectChangeTypeCode.bind(this);
        this.handleItemSelectChangePriorityCode = this.handleItemSelectChangePriorityCode.bind(this);
        this.handleApplyLastTimeUpdate = this.handleApplyLastTimeUpdate.bind(this);

        this.state = {
            collapseFormSearch: true,
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
            moduleName: null,
            //Select
            selectValuePriorityCode: [],
            selectValueTypeCode: [],
            lastTimeUpdateFrom: null,
            lastTimeUpdateTo: null,
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_PRIORITY", "itemId", "itemName", "1", "3");
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.id)}>
                            <Button size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.cfgCode)}>
                            <Button size="sm" className="btn-danger icon"><i className="fa fa-trash-o"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.configCode" />,
                id: "cfgCode",
                width: 250,
                accessor: d => {
                    return <span title={d.cfgCode}>{d.cfgCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="cfgCode" placeholder={this.props.t("ptConfig:ptConfig.placeholder.configCode")}
                    value={this.state.objectSearch.cfgCode} />
                )
            },
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.technicalDepartment" />,
                id: "typeName",
                width: 300,
                accessor: d => {
                    return <span title={d.typeName}>{d.typeName}</span>
                },
                Filter: ({ filter, onChange }) => {
                    let typeCodeList = (this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : [];
                    for (const typeCode of typeCodeList) {
                        typeCode.itemId = typeCode.itemCode;
                    }
                    return (
                        <CustomMultiSelectLocal
                            name={"typeCode"}
                            label={""}
                            isRequired={false}
                            options={typeCodeList}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={this.handleItemSelectChangeTypeCode}
                            selectValue={this.state.selectValueTypeCode}
                            isOnlyInputSelect={true}
                        />
                    );
                }
            },
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.priority" />,
                id: "priorityName",
                width: 150,
                accessor: d => {
                    return <span title={d.priorityName}>{d.priorityName}</span>
                },
                Filter: ({ filter, onChange }) => {
                    let priorityList = (this.props.response.common.ptPriority && this.props.response.common.ptPriority.payload) ? this.props.response.common.ptPriority.payload.data.data : [];
                    for (const priority of priorityList) {
                        priority.itemId = priority.itemCode;
                    }
                    return (                 
                        <CustomMultiSelectLocal
                            name={"priorityCode"}
                            label={""}
                            isRequired={false}
                            options={priorityList}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={this.handleItemSelectChangePriorityCode}
                            selectValue={this.state.selectValuePriorityCode}
                            isOnlyInputSelect={true}
                        />
                    )
                }
            },
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.estimatedTimeFindRca" />,
                id: "rcaFoundTime",
                className: "text-center",
                width: 250,
                accessor: d => {
                    return <span title={d.rcaFoundTime}>{d.rcaFoundTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="rcaFoundTime" placeholder={this.props.t("ptConfig:ptConfig.placeholder.estimatedTimeFindRca")} />
                )
            },
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.estimatedTimeFindTemporarySolution" />,
                id: "waFoundTime",
                className: "text-center",
                width: 300,
                accessor: d => {
                    return <span title={d.waFoundTime}>{d.waFoundTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="waFoundTime" placeholder={this.props.t("ptConfig:ptConfig.placeholder.estimatedTimeFindTemporarySolution")} />
                )
            },
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.estimatedTimeFindRadicalSolution" />,
                id: "slFoundTime",
                className: "text-center",
                width: 300,
                accessor: d => {
                    return <span title={d.slFoundTime}>{d.slFoundTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="slFoundTime" placeholder={this.props.t("ptConfig:ptConfig.placeholder.estimatedTimeFindRadicalSolution")} />
                )
            },
            {
                Header: <Trans i18nKey="ptConfig:ptConfig.label.latestUpdateTime" />,
                id: "lastUpdateTime",
                className: "text-center",
                minWidth: 250,
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}>{convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"lastUpdateTime"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.lastTimeUpdateFrom}
                        endDate={this.state.lastTimeUpdateTo}
                        handleApply={this.handleApplyLastTimeUpdate}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
        ];
    }

    handleApplyLastTimeUpdate(event, picker) {
        this.setState({
            lastTimeUpdateFrom: picker.startDate,
            lastTimeUpdateTo: picker.endDate,
        });
    }

    toggleFormSearch() {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
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
            this.searchPtConfig();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        validSubmitForm(event, values, "idFormSearch");
        values.lstPriorityId = this.state.selectValuePriorityCode.length > 0 ? this.state.selectValuePriorityCode.map(function(item) { return item['value'] + ""; }) : null;
        values.lstTypeId = this.state.selectValueTypeCode.length > 0 ? this.state.selectValueTypeCode.map(function(item) { return item['value'] + ""; }) : null;
        if (this.state.lastTimeUpdateFrom && this.state.lastTimeUpdateTo) {
            values.lastUpdateTimeFrom = convertDateToDDMMYYYYHHMISS(this.state.lastTimeUpdateFrom.toDate());
            values.lastUpdateTimeTo = convertDateToDDMMYYYYHHMISS(this.state.lastTimeUpdateTo.toDate());
        }
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchPtConfig(true);
        });
    }

    searchPtConfig(isSearchClicked = false) {
        this.props.actions.searchPtConfig(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ptConfig:ptConfig.message.error.search"));
        });
    }

    openAddOrEditPage(value, ptConfigId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT") {
            this.props.actions.getDetailPtConfig(ptConfigId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("ptConfig:ptConfig.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptConfig:ptConfig.message.error.getDetail"));
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
                },() => {
                    this.customReactTableSearch.resetPage();
                    this.searchPtConfig();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchPtConfig();
            }
        });
    }

    confirmDelete(ptConfigCode) {
        confirmAlertDelete(this.props.t("ptConfig:ptConfig.message.confirmDelete", { name: ptConfigCode }),
        () => {
            this.props.actions.deletePtConfig([{cfgCode: ptConfigCode}]).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchPtConfig();
                    toastr.success(this.props.t("ptConfig:ptConfig.message.success.delete"));
                } else {
                    toastr.error(this.props.t("ptConfig:ptConfig.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptConfig:ptConfig.message.error.delete"));
            });
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("pt_cat", "PT_CFG_TIME_PROCESS", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangePriorityCode(option) {
        this.setState({ selectValuePriorityCode: option });
    }

    handleItemSelectChangeTypeCode(option) {
        this.setState({ selectValueTypeCode: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = this.state.objectSearch;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <PtConfigAddEdit
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
                                                title={t("ptConfig:ptConfig.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2" title={t("odType:odType.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md mr-1 custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("odType:odType.button.export")}
                                                    onClick={() => this.onExport()}>
                                                    <i className="fa fa-download"></i>
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
    const { ptConfig, common } = state;
    return {
        response: { ptConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdCategoryList));