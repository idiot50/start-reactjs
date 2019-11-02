import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

import UtilityConfigRequestScheduleDetail from './UtilityConfigRequestScheduleDetail'
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigRequestScheduleActions from './UtilityConfigRequestScheduleActions';
import UtilityConfigRequestScheduleAddEdit from "./UtilityConfigRequestScheduleAddEdit";
import { CustomReactTableSearch, CustomDateTimeRangePicker, CustomSelectLocal, SettingTableLocal, SearchBar, CustomAutocomplete } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityConfigRequestScheduleList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityConfigRequestSchedule = this.searchUtilityConfigRequestSchedule.bind(this);
        this.search = this.search.bind(this);
        this.confirmCancel = this.confirmCancel.bind(this);
        this.openPage = this.openPage.bind(this);
        this.closePage = this.closePage.bind(this);
        this.handleOnChangeUnit = this.handleOnChangeUnit.bind(this);
        this.handleItemSelectChangeType = this.handleItemSelectChangeType.bind(this);
        this.handleOnChangeUpdatedTime = this.handleOnChangeUpdatedTime.bind(this);
        this.handleOnChangeStartDate = this.handleOnChangeStartDate.bind(this);
        this.handleOnChangeEndDate = this.handleOnChangeEndDate.bind(this);

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
            isDetailVisible: false,
            isAddOrEdit: null,
            isDetail: null,
            client: null,
            moduleName: null,
            //Select
            selectStatus: {},
            selectCreatedDate: null,
            selectEndDate: null,
            selectStartDate: null,
            selectUnit: {},
            selectType: {},
            selectTypeList: [
                { itemId: 0, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.month") },
                { itemId: 1, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.week") },
                { itemId: 2, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.day") }
            ],
            selectStatusList: [
                { itemId: 0, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.onSchedule") },
                { itemId: 1, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.scheduled") },
                { itemId: 2, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.cancel") }
            ],
            disabled: false,
            startDateFrom: null,
            startDateTo : null,
            createdDateFrom : null,
            createdDateTo : null,
            endDateFrom : null,
            endDateTo : null,
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 180,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.title.detail")}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1" onClick={() => this.openPage("DETAIL", d.idSchedule)}><i className="fa fa-info-circle"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.edit")} >
                            <Button
                                disabled={(d.status === 0 || d.status === 1) ? true : false} 
                                onClick={() => this.openPage("EDIT", d.idSchedule)} type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openPage("COPY", d.idSchedule)}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1"><i className="fa fa-copy"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.cancel")} >
                            <Button
                                disabled={(d.status === 0) ? false : true}
                                onClick={() => this.confirmCancel(d)} type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-ban"></i></Button>
                        </span>

                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.5em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.unit" />,
                id: "unitName",
                width: 250,
                accessor: d => {
                    return d.unitName ? <span title={d.unitName}>{d.unitName}</span>  : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitId"}
                        label={""}
                        placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.unit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeUnit}
                        selectValue={this.state.selectUnit}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.type" />,
                id: "type",
                width: 110,
                accessor: d => {
                    const value = d.type + "" === "0" ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.month") : (d.type == 1 ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.week") : this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.day"));
                    return value ? <span title={value}>{value}</span>  : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"type"}
                        label={""}
                        isRequired={false}
                        options={this.state.selectTypeList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeType}
                        selectValue={this.state.selectType}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.detail" />,
                id: "detail",
                width: 250,
                accessor: d => {
                    const detailWeek = (d.week) ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.detailWeek", { week: (d.week) ? d.week : {}, year: (d.year) ? d.year : {} }) : "";
                    const detailMonth = (d.month) ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.detailMonth", { month: (d.month) ? d.month : {}, year: (d.year) ? d.year : {} }) : "";
                    const detailDay = (d.startDate) ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.day") + convertDateToDDMMYYYYHHMISS(d.startDate).slice(0, 10) : "";
                    return <span>
                        {
                            d.type + "" === "0" ? detailMonth : (d.type + "" === "1" ? detailWeek : detailDay)
                        }
                    </span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.5em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.createFrom" />,
                id: "startDate",
                width: 200,
                accessor: d => {
                    return d.startDate ? <span title={(d.startDate) ? convertDateToDDMMYYYYHHMISS(d.startDate).slice(0, 10) : []}>{(d.startDate) ? convertDateToDDMMYYYYHHMISS(d.startDate).slice(0, 10) : []}</span>  : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"startDate"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.startDateFrom}
                        endDate={this.state.startDateTo}
                        handleApply={this.handleOnChangeStartDate}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.createTo" />,
                id: "endDate",
                width: 200,
                accessor: d => {
                    return d.endDate ? <span title={(d.endDate) ? convertDateToDDMMYYYYHHMISS(d.endDate).slice(0, 10) : []}>{(d.endDate) ? convertDateToDDMMYYYYHHMISS(d.endDate).slice(0, 10) : []}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"endDate"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.endDateFrom}
                        endDate={this.state.endDateTo}
                        handleApply={this.handleOnChangeEndDate}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.status" />,
                id: "status",
                width: 150,
                accessor: d => {
                    const value = d.status === 0 ? (this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.onSchedule")) : (d.status === 1 ? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.scheduled") : this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.cancel"));
                    return value ? <span title={value}>{value}</span> : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"status"}
                        label={""}
                        isRequired={false}
                        options={this.state.selectStatusList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeStatus}
                        selectValue={this.state.selectStatus}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.updatedUser" />,
                id: "createdUser",
                accessor: d => {
                    return d.createdUser ? <span title={d.createdUser}>{d.createdUser}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.updatedDate" />,
                id: "createdDate",
                width: 150,
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.createdDate)}>{convertDateToDDMMYYYYHHMISS(d.createdDate)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"createdDate"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.createdDateFrom}
                        endDate={this.state.createdDateTo}
                        handleApply={this.handleOnChangeUpdatedTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
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
            this.searchUtilityConfigRequestSchedule();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.unitId = (this.state.selectUnit) ? this.state.selectUnit.value : null;
        values.type = this.state.selectType.value;
        values.status = this.state.selectStatus.value;
        values.createdDateFrom = (this.state.createdDateFrom) ? this.state.createdDateFrom.toDate() : null;
        values.createdDateTo = (this.state.createdDateTo) ? this.state.createdDateTo.toDate() : null;
        values.startDateFrom = (this.state.startDateFrom) ? this.state.startDateFrom.toDate() : null;
        values.startDateTo = (this.state.startDateTo) ? this.state.startDateTo.toDate() : null;
        values.endDateFrom = (this.state.endDateFrom) ? this.state.endDateFrom.toDate() : null;
        values.endDateTo = (this.state.endDateTo) ? this.state.endDateTo.toDate() : null;

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigRequestSchedule(true);
        });
    }

    searchUtilityConfigRequestSchedule(isSearchClicked = false) {
        this.props.actions.searchUtilityConfigRequestSchedule(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.search"));
        });
    }

    openPage(value, idSchedule) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY" || value === "DETAIL") {
            this.props.actions.getDetailUtilityConfigRequestSchedule(idSchedule).then((response) => {
                if (response.payload && response.payload.data) {
                    if (value === "EDIT" || value === "COPY") {
                        this.setState({
                            isAddOrEditVisible: true,
                            isAddOrEdit: value,
                            selectedData: response.payload.data
                        });
                    } else {
                        this.setState({
                            isDetailVisible: true,
                            isDetail: value,
                            selectedData: response.payload.data
                        });
                    }
                } else {
                    toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.getDetail"));
            });
        }
    }

    closePage(isAddOrEditOrDetail) {
        this.setState({
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            isDetailVisible: false,
            isDetail: null
        }, () => {
            if (isAddOrEditOrDetail === "ADD" || isAddOrEditOrDetail === "COPY") {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchUtilityConfigRequestSchedule();
                });
            } else if (isAddOrEditOrDetail === "EDIT" || isAddOrEditOrDetail === "DETAIL") {
                this.searchUtilityConfigRequestSchedule();
            }
        });
    }

    confirmCancel(d) {
        console.log(d)
        confirmAlertDelete(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.confirmCancel"),
            () => {
                this.props.actions.cancelSchedule(d).then((response) => {
                    console.log(response)
                    if (response.payload.data.key === "SUCCESS") {
                        toastr.success(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.success.cancel"));
                        this.customReactTableSearch.resetPage();
                    } else {
                        toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.cancel"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.error.cancel"));
                });
            }
        );
    }

    handleOnChangeUpdatedTime(event, picker) {
        this.setState({
            createdDateFrom: picker.startDate,
            createdDateTo: picker.endDate,
        });
    }

    handleOnChangeStartDate(event, picker) {
        this.setState({
            startDateFrom: picker.startDate,
            startDateTo: picker.endDate,
        });
    }

    handleOnChangeEndDate(event, picker) {
        this.setState({
            endDateFrom: picker.startDate,
            endDateTo: picker.endDate,
        });
    }

    handleItemSelectChangeType(option) {
        this.setState({ selectType: option });

    }

    handleOnChangeUnit(value) {
        this.setState({ selectUnit: value });
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible || this.state.isDetailVisible}
                content={
                    this.state.isDetailVisible ?
                        <UtilityConfigRequestScheduleDetail
                            closeDetailPage={this.closePage}
                            parentState={this.state}
                        /> :
                        <UtilityConfigRequestScheduleAddEdit
                            closeAddOrEditPage={this.closePage}
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
                                                    title={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.button.add")}
                                                    onClick={() => this.openPage("ADD")}><i className="fa fa-plus"></i></Button>
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
    const { utilityConfigRequestSchedule, common } = state;
    return {
        response: { utilityConfigRequestSchedule, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigRequestScheduleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigRequestScheduleList));