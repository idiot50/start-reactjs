import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as OdWorkflowActions from './OdWorkflowActions';
import OdWorkflowAddEdit from "./OdWorkflowAddEdit";
import OdWorkflowDetail from './OdWorkflowDetail';
import { convertDateToDDMMYYYYHHMISS, validSubmitForm, confirmAlertDelete, invalidSubmitForm } from "../../../containers/Utils/Utils";
import moment from 'moment';
import { CustomAvField, CustomDateTimeRangePicker, CustomReactTableSearch, CustomSelect, CustomSelectLocal, CustomMultiSelect, CustomMultiSelectLocal, CustomDatePicker, SettingTableLocal, SearchBar, CustomAutocomplete, CustomInputFilter } from '../../../containers/Utils';
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";

class OdWorkflowList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchOdWorkflow = this.searchOdWorkflow.bind(this);
        this.handleKeyDownForm = this.handleKeyDownForm.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.openDetailPage = this.openDetailPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.closeDetailPage = this.closeDetailPage.bind(this);
        this.clearSearchConditions = this.clearSearchConditions.bind(this);
        this.childCreateUnitChange = this.childCreateUnitChange.bind(this);
        this.childReceiveUnitChange = this.childReceiveUnitChange.bind(this);
        this.onExport = this.onExport.bind(this);
        //combobox
        this.handleItemSelectChangeOdType = this.handleItemSelectChangeOdType.bind(this);
        this.handleItemSelectChangeWoCategory = this.handleItemSelectChangeWoCategory.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);
        this.handleItemSelectChangeOdGroupTypeId = this.handleItemSelectChangeOdGroupTypeId.bind(this);
        this.handleItemSelectChangeOdPriorityId = this.handleItemSelectChangeOdPriorityId.bind(this);
        this.handleItemSelectChangeClearCode = this.handleItemSelectChangeClearCode.bind(this);
        this.handleItemSelectChangeCloseCode = this.handleItemSelectChangeCloseCode.bind(this);
        this.handleItemSelectChangeInsertSource = this.handleItemSelectChangeInsertSource.bind(this);

        this.handleOnChangeReceiveUser = this.handleOnChangeReceiveUser.bind(this);
        this.handleOnChangeCreatedUnit = this.handleOnChangeCreatedUnit.bind(this);
        this.handleOnChangeReceiveUnit = this.handleOnChangeReceiveUnit.bind(this);
        this.handleOnChangeCreatePerson = this.handleOnChangeCreatePerson.bind(this);
        //end combobox
        this.handleChangeStartTimeFrom = this.handleChangeStartTimeFrom.bind(this);
        this.handleChangeStartTimeTo = this.handleChangeStartTimeTo.bind(this);
        this.handleChangeEndTimeFrom = this.handleChangeEndTimeFrom.bind(this);
        this.handleChangeEndTimeTo = this.handleChangeEndTimeTo.bind(this);

        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.handleApplyCreateTime = this.handleApplyCreateTime.bind(this);

        this.state = {
            collapseFormSearch: false,
            collapseFormSearchAdvance: false,
            collapseFormInfo: true,
            isSearchClicked: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            selectValueWoCategory: [],
            selectValueStatus: [],
            childCreateUnit: false,
            childReceiveUnit: false,
            //Object Search
            objectSearch: { offset: "0" },
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            //AddOrEditPage
            isAddOrEditVisible: '',
            isAddOrEdit: null,
            //AddOrEditPage
            detailModal: false,
            isDetail: null,
            // comboboxes
            woCategories: [
                { itemId: "isCreated", itemName: props.t("odWorkflow:odWorkflow.dropdown.woCategory.createdByUser") },
                { itemId: "isReceiveUser", itemName: props.t("odWorkflow:odWorkflow.dropdown.woCategory.todoWo") },
                { itemId: "isReceiveUnit", itemName: props.t("odWorkflow:odWorkflow.dropdown.woCategory.unitWo") }
            ],
            lstStatus: [],
            //select value combobox
            selectValueOdType: {},
            selectValueOdGroupTypeId: {},
            selectValueOdPriorityId: {},
            selectValueClearCode: {},
            selectValueCloseCode: {},
            selectValueInsertSource: {},
            selectValueReceiveUnit: {},
            selectValueCreatedUnit: {},
            selectValueReceiveUser: {},
            selectValueCreatePerson: {},
            //end select value combobox
            startTimeFrom: null,
            startTimeTo: null,
            endTimeFrom: null,
            endTimeTo: null,
            createTimeFromSearch: moment().add(1, 'days').subtract(1, 'months'),
            createTimeToSearch: moment().add(1, 'days'),
            maxDate: 90,
            minDate: 30,
            parentValueOdType: "",
            isFirstSearch: true
        };
    }

    componentDidMount() {
        this.setState({
            selectValueWoCategory: [{value: 'isCreated'}, {value: 'isReceiveUser'}, {value: 'isReceiveUnit'}],
            selectValueStatus: [{value: '1'}, {value: '2'}, {value: '4'}]
        });
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
        this.props.actions.getItemMaster("OD_INSERT_SOURCE", "itemId", "itemName", "1", "3");// hệ thống, mảng triển khai
        this.props.actions.getItemMaster("OD_GROUP_TYPE", "itemId", "itemName", "1", "3");// nhóm loại công việc
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3");// mức độ ưu tiên
        this.props.actions.getItemMaster("OD_CLEAR_CODE", "itemId", "itemName", "1", "3");// mã clear
        this.props.actions.getItemMaster("OD_CLOSE_CODE", "itemId", "itemName", "1", "3");// mã đóng
        this.props.actions.getConfigPropertyOd("OD.DAYS.SEARCH").then((response) => {
            let odDaysSearch = {...response.payload.data}
            let arr = odDaysSearch.description.split(",");
            this.setState({
                maxDate: Number.parseInt(arr[0],10),
                minDate: Number.parseInt(arr[1],10)
            });
        }).catch((error) => {
            this.setState({
                maxDate: 90,
                minDate: 30
            });
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.action"/>,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 100,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.processingWork")} onClick={() => this.openDetailPage("EDIT", d.odId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-gear"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d)}>
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
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.status"/>,
                width: 200,
                id: "statusName",
                accessor: d => <span title={d.statusName}>{d.statusName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomMultiSelectLocal
                        name={"status"}
                        label={""}
                        isRequired={false}
                        options={this.state.lstStatus}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeStatus}
                        selectValue={this.state.selectValueStatus}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.woContent"/>,
                id: "odName",
                width: 200,
                accessor: d => <span title={d.odName}>{d.odName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="odName" label={this.props.t("odWorkflow:odWorkflow.label.woContent")} placeholder={this.props.t("odWorkflow:odWorkflow.placeholder.woContent")}
                    value={this.state.objectSearch.odName} />
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.woCode"/>,
                id: "odCode",
                width: 200,
                accessor: d => <span title={d.odCode}>{d.odCode}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="odCode" label={this.props.t("odWorkflow:odWorkflow.label.woCode")} placeholder={this.props.t("odWorkflow:odWorkflow.placeholder.woCode")}
                    value={this.state.objectSearch.odCode} />
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.woType"/>,
                id: "odTypeName",
                width: 200,
                accessor: d => <span title={d.odTypeName}>{d.odTypeName}</span>,
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
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.priority"/>,
                id: "priorityName",
                width: 150,
                accessor: d => <span title={d.priorityName}>{d.priorityName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"priorityId"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.odPriority && this.props.response.common.odPriority.payload) ? this.props.response.common.odPriority.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeOdPriorityId}
                        selectValue={this.state.selectValueOdPriorityId}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createdTime"/>,
                id: "createTime",
                width: 250,
                className: "text-center",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"createTime"}
                        label={""}
                        isRequired={true}
                        startDate={this.state.createTimeFromSearch}
                        endDate={this.state.createTimeToSearch}
                        handleApply={this.handleApplyCreateTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.remainTime"/>,
                id: "remainTime",
                className: "text-center",
                width: 150,
                accessor: d => <span title={d.remainTime}>{d.remainTime}</span>,
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createdUnit"/>,
                id: "createUnitName",
                width: 200,
                accessor: d => <span title={d.createUnitName}>{d.createUnitName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"createUnitId"}
                        label={""}
                        placeholder={this.props.t("odWorkflow:odWorkflow.placeholder.createdUnit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeCreatedUnit}
                        selectValue={this.state.selectValueCreatedUnit}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasCheckbox={true}
                        nameCheckbox={"childCreateUnit"}
                        isCheckedCheckbox={this.state.childCreateUnit}
                        handleOnChangeCheckbox={this.childCreateUnitChange}
                        titleCheckbox={this.props.t("odWorkflow:odWorkflow.message.checkCreatedUnit")}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.handleUnit"/>,
                id: "receiveUnitName",
                width: 200,
                accessor: d => {
                    return d.receiveUnitName ? <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"receiveUnitId"}
                        label={""}
                        placeholder={this.props.t("odWorkflow:odWorkflow.placeholder.receiveUnit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeReceiveUnit}
                        selectValue={this.state.selectValueReceiveUnit}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasCheckbox={true}
                        nameCheckbox={"childReceiveUnit"}
                        isCheckedCheckbox={this.state.childReceiveUnit}
                        handleOnChangeCheckbox={this.childReceiveUnitChange}
                        titleCheckbox={this.props.t("odWorkflow:odWorkflow.message.checkCreatedUnit")}
                    />
                )
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.receiveUser"/>,
                id: "receiveUserName",
                minWidth: 200,
                accessor: d => {
                    return d.receiveUserName ? <span title={d.receiveUserName}>{d.receiveUserName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"receiveUserId"}
                        label={""}
                        placeholder={this.props.t("odWorkflow:odWorkflow.placeholder.implementer")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeReceiveUser}
                        selectValue={this.state.selectValueReceiveUser}
                        moduleName={"USERS"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                    />
                )
            },
        ];
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
        if (this.state.isFirstSearch) {
            objectSearch.createTimeFrom = this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null;
            objectSearch.createTimeTo = this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null;
            objectSearch.status = this.state.selectValueStatus.map(item => item.value).join(',');
            objectSearch.isCreated = this.state.selectValueWoCategory.filter(item => item.value === 'isCreated').length === 1 ? true : false;
            objectSearch.isReceiveUser = this.state.selectValueWoCategory.filter(item => item.value === 'isReceiveUser').length === 1 ? true : false;
            objectSearch.isReceiveUnit = this.state.selectValueWoCategory.filter(item => item.value === 'isReceiveUnit').length === 1 ? true : false;
        }

        this.setState({
            loading: true,
            objectSearch
        }, () => {
            this.searchOdWorkflow();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    handleKeyDownForm(event) {
        if(event.key === 'Enter'){
            this.setState({
                isSearchClicked: false
            });
        }
    }

    search(event, values) {
        if(this.state.createTimeToSearch.toDate() - this.state.createTimeFromSearch.toDate() < this.state.minDate*24*60*60*1000) {
            toastr.warning(this.props.t("odWorkflow:odWorkflow.message.error.minTime", { days: this.state.minDate }));
            this.setState({
                btnSearchLoading: false
            });
            return;
        }
        if(this.state.createTimeToSearch.toDate() - this.state.createTimeFromSearch.toDate() > this.state.maxDate*24*60*60*1000) {
            toastr.warning(this.props.t("odWorkflow:odWorkflow.message.error.maxTime", { days: this.state.maxDate }));
            this.setState({
                btnSearchLoading: false
            });
            return;
        }
        if(this.state.startTimeFrom && this.state.startTimeTo) {
            if(this.state.startTimeFrom > this.state.startTimeTo) {
                toastr.warning(this.props.t("odWorkflow:odWorkflow.message.error.startTimeTo"));
                this.setState({
                    btnSearchLoading: false
                });
                return;
            }
        }
        if(this.state.endTimeFrom && this.state.endTimeTo) {
            if(this.state.endTimeFrom > this.state.endTimeTo) {
                toastr.warning(this.props.t("odWorkflow:odWorkflow.message.error.endTimeTo"));
                this.setState({
                    btnSearchLoading: false
                });
                return;
            }
        }
        if (this.state.isFirstSearch) {
            this.setState({
                isFirstSearch: false
            });
        }
        validSubmitForm(event, values, "idFormSearch");
        const objectSearch = {
            ...this.state.objectSearch,
            ...values,
            createPersonId: this.state.selectValueCreatePerson ? this.state.selectValueCreatePerson.value : null,
            childCreateUnit: this.state.childCreateUnit,
            receiveUnitId: this.state.selectValueReceiveUnit ? this.state.selectValueReceiveUnit.value : null,
            receiveUserId: this.state.selectValueReceiveUser ? this.state.selectValueReceiveUser.value : null,
            createUnitId: this.state.selectValueCreatedUnit ? this.state.selectValueCreatedUnit.value : null,
            childReceiveUnit: this.state.childReceiveUnit,
            odTypeId: this.state.selectValueOdType.value,
            insertSource: this.state.selectValueInsertSource.value != null ? this.state.selectValueInsertSource.label : '',
            clearCodeId: this.state.selectValueClearCode.value,
            closeCodeId: this.state.selectValueCloseCode.value,
            priorityId: this.state.selectValueOdPriorityId.value,
            odGroupTypeId: this.state.selectValueOdGroupTypeId.value,
            createTimeFrom: this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null,
            createTimeTo: this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null,
            startTimeFrom: convertDateToDDMMYYYYHHMISS(this.state.startTimeFrom),
            startTimeTo: convertDateToDDMMYYYYHHMISS(this.state.startTimeTo),
            endTimeFrom: convertDateToDDMMYYYYHHMISS(this.state.endTimeFrom),
            endTimeTo: convertDateToDDMMYYYYHHMISS(this.state.endTimeTo),
            status: this.state.selectValueStatus.map(item => item.value).join(','),
            isCreated: this.state.selectValueWoCategory.filter(item => item.value === 'isCreated').length === 1 ? true : false,
            isReceiveUser: this.state.selectValueWoCategory.filter(item => item.value === 'isReceiveUser').length === 1 ? true : false,
            isReceiveUnit: this.state.selectValueWoCategory.filter(item => item.value === 'isReceiveUnit').length === 1 ? true : false
        };
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: this.state.isSearchClicked,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchOdWorkflow();
        });
    }

    searchOdWorkflow() {
        this.props.actions.searchOdWorkflow(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                isSearchClicked: true,
                btnSearchLoading: false,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                isSearchClicked: true,
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.search"));
        });
    }

    openAddOrEditPage(value, object) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: 'ADD',
                detailModal: false,
                isAddOrEdit: value,
                selectedData: {},
            });
        } else if (value === "COPY") {
            this.setState({
                isAddOrEditVisible: 'ADD',
                detailModal: false,
                isAddOrEdit: value,
                selectedData: object,
            });
        }
    }

    openDetailPage(value, odId) {
        if (value === "EDIT") {
            this.props.actions.getDetailOdWorkflow(odId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: 'EDIT',
                        detailModal: true,
                        isDetail: value,
                        selectedData: response.payload.data,
                    });
                } else {
                    toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.getDetail"));
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
                    this.searchOdWorkflow();
                });
            }
        });
    }

    closeDetailPage(isDetail) {
        this.setState({
            isAddOrEditVisible: '',
            detailModal: false,
            isDetail: null
        }, () => {
            if (isDetail === "EDIT") {
                this.searchOdWorkflow();
            }
        });
    }

    confirmDelete(odWorkflowId, odWorkflowCode) {
        confirmAlertDelete(this.props.t("odWorkflow:odWorkflow.message.confirmDelete", { odWorkflowCode: odWorkflowCode }),
        () => {
            this.props.actions.deleteOdWorkflow(odWorkflowId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchOdWorkflow();
                    toastr.success(this.props.t("odWorkflow:odWorkflow.message.success.delete"));
                } else {
                    toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.delete"));
            });
        });
    }

    handleApplyCreateTime(event, picker) {
        this.setState({
            createTimeFromSearch: picker.startDate,
            createTimeToSearch: picker.endDate,
        });
    }

    //combobox
    handleItemSelectChangeOdPriorityId(option) {
        this.setState({ selectValueOdPriorityId: option });
    }

    handleItemSelectChangeOdGroupTypeId(option) {
        this.setState({
            selectValueOdGroupTypeId: option,
            parentValueOdType: option.value
        });
    }

    handleItemSelectChangeWoCategory(option) {
        this.setState({ selectValueWoCategory: option });
    }

    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }

    handleItemSelectChangeOdType(option) {
        this.setState({ selectValueOdType: option });
    }

    handleItemSelectChangeClearCode(option) {
        this.setState({ selectValueClearCode: option });
    }

    handleItemSelectChangeCloseCode(option) {
        this.setState({ selectValueCloseCode: option });
    }

    handleItemSelectChangeInsertSource(option) {
        this.setState({ selectValueInsertSource: option });
    }
    //end combobox

    handleChangeStartTimeFrom(date) {
        this.setState({ startTimeFrom: date });
    }

    handleChangeStartTimeTo(date) {
        this.setState({ startTimeTo: date });
    }

    handleChangeEndTimeFrom(date) {
        this.setState({ endTimeFrom: date });
    }

    handleChangeEndTimeTo(date) {
        this.setState({ endTimeTo: date });
    }

    handleOnChangeCreatePerson(option) {
        this.setState({ selectValueCreatePerson: option });
    }

    handleOnChangeReceiveUser(option) {
        this.setState({ selectValueReceiveUser: option });
    }

    handleOnChangeReceiveUnit(option) {
        this.setState({ selectValueReceiveUnit: option });
    }

    handleOnChangeCreatedUnit(option) {
        this.setState({ selectValueCreatedUnit: option });
    }

    clearSearchConditions() {
        this.setState({
            selectValueWoCategory: [{value: 'isCreated'}, {value: 'isReceiveUser'}, {value: 'isReceiveUnit'}],
            selectValueStatus: [{value: '1'}, {value: '2'}, {value: '4'}],
            childCreateUnit: false,
            childReceiveUnit: false,
            selectValueOdType: {},
            selectValueOdGroupTypeId: {},
            selectValueOdPriorityId: {},
            selectValueClearCode: {},
            selectValueCloseCode: {},
            selectValueInsertSource: {},
            selectValueReceiveUnit: {},
            selectValueCreatedUnit: {},
            selectValueReceiveUser: {},
            selectValueCreatePerson: {},
            createTimeFromSearch: moment().subtract(1, 'month'),
            createTimeToSearch: moment().add(1, 'days'),
            startTimeFrom: null,
            startTimeTo: null,
            endTimeFrom: null,
            endTimeTo: null
        }, () => {
            try {
                this.myFormRef._inputs.otherSystemCode.value = "";
                document.getElementById("otherSystemCode").value = "";
                document.getElementById("input-filter-odCode").value = "";
                document.getElementById("input-filter-odName").value = "";
            } catch (error) {
                console.error(error);
            }
        });
    }

    childReceiveUnitChange() {
        this.setState({ childReceiveUnit: !this.state.childReceiveUnit });
    }

    childCreateUnitChange() {
        this.setState({ childCreateUnit: !this.state.childCreateUnit });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("od", "OD_WORKFLOW", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearch");
    }
    
    render() {
        const { t, response } = this.props;
        let odSegmentList = (response.common.odInsertSource && response.common.odInsertSource.payload) ? response.common.odInsertSource.payload.data.data : [];
        let odTypeGroupList = (response.common.odGroupType && response.common.odGroupType.payload) ? response.common.odGroupType.payload.data.data : [];
        let closeCodeList = (response.common.odCloseCode && response.common.odCloseCode.payload) ? response.common.odCloseCode.payload.data.data : [];
        let clearCodeList = (response.common.odClearCode && response.common.odClearCode.payload) ? response.common.odClearCode.payload.data.data : [];
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible === 'ADD' || this.state.isAddOrEditVisible === 'EDIT'}
                content={
                    this.state.isAddOrEditVisible === 'EDIT' ?
                    <OdWorkflowDetail
                        closeAddOrEditPage={this.closeDetailPage}
                        parentState={this.state} /> :
                    <OdWorkflowAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <AvForm id="idFormSearch" onKeyDown={this.handleKeyDownForm} onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch} ref={el => this.myFormRef = el}>
                        <div className="animated fadeIn">
                            <Row>
                                <Col xs="12">
                                    <Card>
                                        <CardHeader>
                                            <i className="fa fa-search"></i>{t("common:common.title.advancedSearch")}
                                            <div className="card-header-actions">
                                                <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormSearch" onClick={this.toggleFormSearch}><i className={this.state.collapseFormSearch ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                            </div>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.collapseFormSearch} id="collapseFormSearch">
                                            <CardBody>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"insertSource"}
                                                            label={t("odWorkflow:odWorkflow.label.woSegmentSystem")}
                                                            isRequired={false}
                                                            options={odSegmentList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeInsertSource}
                                                            selectValue={this.state.selectValueInsertSource}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="otherSystemCode" label={t("odWorkflow:odWorkflow.label.systemCode")} placeholder={t("odWorkflow:odWorkflow.placeholder.systemCode")}
                                                        value={this.state.objectSearch.otherSystemCode} />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAutocomplete
                                                            name={"createPersonId"}
                                                            label={t("odWorkflow:odWorkflow.label.creator")}
                                                            placeholder={t("odWorkflow:odWorkflow.placeholder.creator")}
                                                            isRequired={false}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={this.handleOnChangeCreatePerson}
                                                            selectValue={this.state.selectValueCreatePerson}
                                                            moduleName={"USERS"}
                                                            isHasChildren={true}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"clearCodeId"}
                                                            label={t("odWorkflow:odWorkflow.label.clearCode")}
                                                            isRequired={false}
                                                            options={clearCodeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeClearCode}
                                                            selectValue={this.state.selectValueClearCode}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"closeCodeId"}
                                                            label={t("odWorkflow:odWorkflow.label.closeCode")}
                                                            isRequired={false}
                                                            options={closeCodeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeCloseCode}
                                                            selectValue={this.state.selectValueCloseCode}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomMultiSelectLocal
                                                            name={"createUnitId"}
                                                            label={t("odWorkflow:odWorkflow.label.woCategory")}
                                                            isRequired={false}
                                                            options={this.state.woCategories}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={this.handleItemSelectChangeWoCategory}
                                                            selectValue={this.state.selectValueWoCategory}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"startTimeFrom"}
                                                            label={t("odWorkflow:odWorkflow.label.implementTimeFrom")}
                                                            isRequired={false}
                                                            selected={this.state.startTimeFrom}
                                                            timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                            handleOnChange={this.handleChangeStartTimeFrom}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            // placeholder={t("odWorkflow:odWorkflow.placeholder.implementTimeFrom")}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"startTimeTo"}
                                                            label={t("odWorkflow:odWorkflow.label.implementTimeTo")}
                                                            isRequired={false}
                                                            selected={this.state.startTimeTo}
                                                            timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                            handleOnChange={this.handleChangeStartTimeTo}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            // placeholder={t("odWorkflow:odWorkflow.placeholder.implementTimeTo")}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"odGroupTypeId"}
                                                            label={t("odWorkflow:odWorkflow.label.woTypeGroup")}
                                                            isRequired={false}
                                                            options={odTypeGroupList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeOdGroupTypeId}
                                                            selectValue={this.state.selectValueOdGroupTypeId}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"endTimeFrom"}
                                                            label={t("odWorkflow:odWorkflow.label.finishTimeFrom")}
                                                            isRequired={false}
                                                            selected={this.state.endTimeFrom}
                                                            timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                            handleOnChange={this.handleChangeEndTimeFrom}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            // placeholder={t("odWorkflow:odWorkflow.placeholder.finishTimeFrom")}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"endTimeTo"}
                                                            label={t("odWorkflow:odWorkflow.label.finishTimeTo")}
                                                            isRequired={false}
                                                            selected={this.state.endTimeTo}
                                                            timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                            handleOnChange={this.handleChangeEndTimeTo}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            // placeholder={t("odWorkflow:odWorkflow.placeholder.finishTimeTo")}
                                                        />
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                            <CardFooter className="text-center">
                                                <LaddaButton type="submit"
                                                    className="btn btn-primary btn-md mr-1"
                                                    loading={this.state.btnSearchLoading}
                                                    data-style={ZOOM_OUT}>
                                                    <i className="fa fa-search"></i> {t("common:common.title.search")}
                                                </LaddaButton>
                                                <Button type="button" size="md" color="secondary" className="mr-1" onClick={this.clearSearchConditions}><i className="fa fa-refresh"></i> {t("common:common.button.clear")}</Button>
                                            </CardFooter>
                                        </Collapse>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        {/* </editor-fold> */}

                        {/* <editor-fold desc="Datatable"> */}
                        <div className="animated fadeIn">
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                title={t("odWorkflow:odWorkflow.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("odType:odType.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    title={t("odWorkflow:odWorkflow.button.export")}
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
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
                                                    isCheckbox={false}
                                                />
                                            </CardBody>
                                        </Collapse>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        {/* </editor-fold> */}
                    </AvForm>
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { odWorkflow, common } = state;
    return {
        response: { odWorkflow, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdWorkflowActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdWorkflowList));