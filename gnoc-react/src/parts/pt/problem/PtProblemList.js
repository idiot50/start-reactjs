import { AvForm } from 'availity-reactstrap-validation';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomSelect, CustomSelectLocal, SettingTable, SearchBar, CustomReactTableSearch, CustomDateTimeRangePicker, CustomAutocomplete, CustomMultiSelectLocal, CustomInputFilter, CustomAvField } from '../../../containers/Utils';
import * as commonActions from './../../../actions/commonActions';
import * as PtProblemActions from './PtProblemActions';
import PtProblemAdd from "./PtProblemAdd";
import PtProblemDetail from './PtProblemDetail';
import PtProblemEdit from "./PtProblemEdit";
import PtProblemListConfigFieldPopup from "./PtProblemListConfigFieldPopup";
import PTProblemChatPopup from './PTProblemChatPopup';
import { convertDateToDDMMYYYYHHMISS, validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";
import moment from 'moment';
import { CustomCSSTransition } from '../../../containers/Utils/CustomCSSTransition';


class PtProblemList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchPtProblem = this.searchPtProblem.bind(this);
        this.search = this.search.bind(this);
        this.openPage = this.openPage.bind(this);
        this.closePage = this.closePage.bind(this);
        this.clearSearchConditions = this.clearSearchConditions.bind(this);
        this.onExport = this.onExport.bind(this);
        //combobox
        this.handleItemSelectChangeProblemState = this.handleItemSelectChangeProblemState.bind(this);
        this.handleItemSelectChangeOdPriorityId = this.handleItemSelectChangeOdPriorityId.bind(this);
        // this.handleItemSelectChangeCity = this.handleItemSelectChangeCity.bind(this);
        // this.handleItemSelectChangeNation =this.handleItemSelectChangeNation.bind(this);
        this.selectValueSubCategoryId = this.selectValueSubCategoryId.bind(this);
        this.handleItemSelectChangeSoftGroup = this.handleItemSelectChangeSoftGroup.bind(this);
        this.handleItemSelectChangeTechDomain = this.handleItemSelectChangeTechDomain.bind(this);
        this.handleItemSelectChangeCategorization = this.handleItemSelectChangeCategorization.bind(this);
        this.handelItemSelectChangeCreateUnitId = this.handelItemSelectChangeCreateUnitId.bind(this);
        // this.handleItemSelectChangeZone = this.handleItemSelectChangeZone.bind(this);
        //end combobox
        this.handleChangeColumnsTable = this.handleChangeColumnsTable.bind(this);
        this.handleApplyCreateTime = this.handleApplyCreateTime.bind(this);

        this.state = {
            collapseFormSearch: false,
            collapseFormInfo: true,
            isSearchClicked: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            isOpenConfigFieldPopup: false,
            //Object Search
            isFirstSearchTable: true,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            modalName: null,
            //AddPage
            addModal: false,
            //EditPage
            editModal: false,
            //DetailPage
            detailModal: false,
            //select value combobox
            selectValueProblemState: [],
            selectValuePriorityId: {},
            selectValuePmGroup: {},
            selectValueTypeId: {},
            // selectValueNation: {},
            selectValueLocation: {},
            selectValueCategorization: {},
            selectValueSubCategoryId: {},
            // selectValueZone: {},
            // selectValueCity: {},
            selectValueCreateUnitId: {},
            selectValueReceiveUnitId: {},
            isCheckedCreateUnitSub: false,
            isCheckedReceiveUnitSub: false,
            selectValueRcaType: null,
            //end select value combobox
            createTimeFromSearch: moment().subtract(1, 'year'),
            createTimeToSearch: moment().set({hour:23,minute:59,second:59,millisecond:0}),
            nodeTypeList: [],
            objConfigSearch: {},
            valueProblemCode: "",
            valueProblemName: "",
            stateListDefault: [],
            userCurrent: null,
            roleList: [],
            isGetSubCategory: false
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("PT_PRIORITY", "itemId", "itemName", "1", "3");// mức độ ưu tiên
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");// mảng kỹ thuật
        this.props.actions.getItemMaster("PT_CATE", "itemId", "itemName", "1", "3");// phân loại ticket
        this.props.actions.getItemMaster("PT_STATE", "itemId", "itemName", "1", "3").then((response) => {
            const stateArr = ["PT_OPEN", "PT_UNASSIGNED", "PT_WA_FOUND", "PT_SL_FOUND", "PT_DIAGNOSED",
                "PT_WA_IMPL", "PT_SL_IMPL", "PT_WORKARROUND_PROPOSAL", "PT_SOLUTION_PROPOSAL",
                "PT_ROOT_CAUSE_PROPOSAL", "PT_ABNORMALLY_CLOSED", "PT_OPEN_2", "PT_CLEAR_INCOMPLETED",
                "PT_DEFERRED", "PT_QUEUED", "PT_REQ_DEFERRED"];
            let stateListDefault = [];
            for (const state of response.payload.data.data) {
                if (stateArr.includes(state.itemCode)) {
                    stateListDefault.push({ value: state.itemId, label: state.itemName });
                }
            }
            this.setState({
                stateListDefault
            }, () => {
                this.getConfigSearch();
            });
        }).catch((error) => {
            this.getConfigSearch();
        });
    }

    componentDidUpdate() {
        if (this.state.isGetSubCategory) {
            if (this.state.selectValueTypeId.value) {
                this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
                    let nodeTypeList = [];
                    for (const obj of response.payload.data.data) {
                        if (obj.parentItemId + "" === this.state.selectValueTypeId.value + "") {
                            nodeTypeList.push(obj);
                        }
                    }
                    this.setState({
                        nodeTypeList,
                        isGetSubCategory: false
                    });
                });
            }
        }
    }

    buildTableColumns() {
        return [
            {
                Header: this.props.t("ptProblem:ptProblem.label.action"),
                id: "action",
                sortable: false,
                fixed: "left",
                width: 150,
                accessor: d => {
                    let html = <div></div>;
                    let color = d.color === "white" ? "black" : d.color === "red" ? "#ff0000" : d.color === "yellow" ? "#dea700" : "";
                    let title = d.color === "white" ? "inDueDate" : d.color === "red" ? "outOfDate" : d.color === "yellow" ? "commingSoon" : "";
                    html = <div className="text-center">
                        <span title={this.props.t("ptProblem:ptProblem.label." + title)}>
                            <span className="span-icon-table icon mr-1" style={d.color === "white" ? {} : { color: color }}><i className={d.color === "white" ? "fa fa-flag-o" : "fa fa-flag"}></i></span>
                        </span>
                        <span title={this.props.t("common:common.button.update")}>
                            <Button type="button" size="sm" className="btn-info icon mr-1" onClick={() => this.openPage("EDIT", d)}><i className="fa fa-gear"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.title.detail")}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1" onClick={() => this.openPage("DETAIL", d)}><i className="fa fa-info-circle"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.title.chat")}>
                            <Button type="button" size="sm" className="btn-success icon" onClick={() => this.openPopupChat(d)}><i className="fa fa-commenting"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.problemState"),
                width: 200,
                id: "problemState",
                accessor: d => {
                    return d.statusStr ? <span title={d.statusStr}>{d.statusStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomMultiSelectLocal
                        name={"problemState"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : []}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeProblemState}
                        selectValue={this.state.selectValueProblemState}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.problemCode"),
                id: "problemCode",
                width: 200,
                accessor: d => {
                    return d.problemCode ? <span title={d.problemCode}>{d.problemCode}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="problemCode" value={this.state.valueProblemCode}
                        placeholder={this.props.t("ptProblem:ptProblem.placeholder.problemCode")} />
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.problemName"),
                id: "problemName",
                width: 200,
                accessor: d => {
                    return d.problemName ? <span title={d.problemName}>{d.problemName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="problemName" value={this.state.valueProblemName}
                        placeholder={this.props.t("ptProblem:ptProblem.placeholder.problemName")} />
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.estimateTime"),
                id: "esRcaTime",
                width: 150,
                accessor: d => {
                    return d.esRcaTime ? <span title={convertDateToDDMMYYYYHHMISS(d.esRcaTime)}>{convertDateToDDMMYYYYHHMISS(d.esRcaTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.createdTime"),
                id: "createdTime",
                width: 250,
                accessor: d => {
                    return d.createdTime ? <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"createdTime"}
                        label={""}
                        isRequired={true}
                        endDate={this.state.createTimeToSearch}
                        startDate={this.state.createTimeFromSearch}
                        handleApply={this.handleApplyCreateTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.handleUnit"),
                id: "receiveUnitIdStr",
                width: 200,
                accessor: d => {
                    return d.receiveUnitIdStr ? <span title={d.receiveUnitIdStr}>{d.receiveUnitIdStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"receiveUnitId"}
                        label={""}
                        placeholder={this.props.t("ptProblem:ptProblem.placeholder.processUnit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handelItemSelectChangeReceiveUnitId}
                        selectValue={this.state.selectValueReceiveUnitId}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasCheckbox={true}
                        nameCheckbox={"checkProcessUnit"}
                        isCheckedCheckbox={this.state.isCheckedReceiveUnitSub}
                        handleOnChangeCheckbox={this.handleOnChangeCheckboxProcessUnit}
                        titleCheckbox={this.props.t("ptProblem:ptProblem.label.checkSubUnit")}
                    />
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.rootReason"),
                id: "rca",
                width: 200,
                accessor: d => {
                    return d.rca ? <span title={d.rca.replace(/<\/?[^>]+(>|$)/g, "")}>{d.rca.replace(/<\/?[^>]+(>|$)/g, "")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.problemId"),
                id: "problemId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.problemId ? <span title={d.problemId}>{d.problemId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.description"),
                id: "description",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.description ? <span title={d.description.replace(/<\/?[^>]+(>|$)/g, "")}>{d.description.replace(/<\/?[^>]+(>|$)/g, "")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.techDomainId"),
                id: "typeId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.typeId ? <span title={d.typeId}>{d.typeId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.nodeTypeId"),
                id: "subCategoryId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.subCategoryId ? <span title={d.subCategoryId}>{d.subCategoryId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.notes"),
                id: "notes",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.notes ? <span title={d.notes}>{d.notes}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.priorityId"),
                id: "priorityId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.priorityId ? <span title={d.priorityId}>{d.priorityId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.impactId"),
                id: "impactId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.impactId ? <span title={d.impactId}>{d.impactId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.urgency"),
                id: "urgencyIdStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.urgencyIdStr ? <span title={d.urgencyIdStr}>{d.urgencyIdStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.access"),
                id: "accessIdStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.accessIdStr ? <span title={d.accessIdStr}>{d.accessIdStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.affectedNode"),
                id: "affectedNode",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.affectedNode ? <span title={d.affectedNode}>{d.affectedNode}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.vendor"),
                id: "vendor",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.vendor ? <span title={d.vendor}>{d.vendor}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.affectedService"),
                id: "affectedService",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.affectedService ? <span title={d.affectedService}>{d.affectedService}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.section"),
                id: "location",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.location ? <span title={d.location}>{d.location}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.sectionId"),
                id: "locationId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.locationId ? <span title={d.locationId}>{d.locationId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.lastUpdateTime"),
                id: "lastUpdateTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.lastUpdateTime ? <span title={convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}>{convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.assignedTime"),
                id: "assignedTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.assignedTime ? <span title={convertDateToDDMMYYYYHHMISS(d.assignedTime)}>{convertDateToDDMMYYYYHHMISS(d.assignedTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.tempSolutionTime"),
                id: "esWaTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.esWaTime ? <span title={convertDateToDDMMYYYYHHMISS(d.esWaTime)}>{convertDateToDDMMYYYYHHMISS(d.esWaTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.completeSolutionTime"),
                id: "esSlTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.esSlTime ? <span title={convertDateToDDMMYYYYHHMISS(d.esSlTime)}>{convertDateToDDMMYYYYHHMISS(d.esSlTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.startTime"),
                id: "startedTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.startedTime ? <span title={convertDateToDDMMYYYYHHMISS(d.startedTime)}>{convertDateToDDMMYYYYHHMISS(d.startedTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.endTime"),
                id: "endedTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.endedTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endedTime)}>{convertDateToDDMMYYYYHHMISS(d.endedTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.createUser"),
                id: "createUserId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.createUserId ? <span title={d.createUserId}>{d.createUserId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.createUnit"),
                id: "createUnitId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.createUnitId ? <span title={d.createUnitId}>{d.createUnitId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.createdUser"),
                id: "createUserName",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.createUserName ? <span title={d.createUserName}>{d.createUserName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.createdUnit"),
                id: "createUnitName",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.createUnitName ? <span title={d.createUnitName}>{d.createUnitName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.createUserPhone"),
                id: "createUserPhone",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.createUserPhone ? <span title={d.createUserPhone}>{d.createUserPhone}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.pauseTime"),
                id: "deferredTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.deferredTime ? <span title={convertDateToDDMMYYYYHHMISS(d.deferredTime)}>{convertDateToDDMMYYYYHHMISS(d.deferredTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.insertSource"),
                id: "insertSource",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.insertSource ? <span title={d.insertSource}>{d.insertSource}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.isSendMessage"),
                id: "isSendMessage",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.isSendMessage ? <span title={d.isSendMessage}>{d.isSendMessage}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.relatedTt"),
                id: "relatedTt",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.relatedTt ? <span title={d.relatedTt}>{d.relatedTt}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.relatedPt"),
                id: "relatedPt",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.relatedPt ? <span title={d.relatedPt}>{d.relatedPt}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.relatedKedb"),
                id: "relatedKedb",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.relatedKedb ? <span title={d.relatedKedb}>{d.relatedKedb}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.techDomain"),
                id: "typeIdStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.typeIdStr ? <span title={d.typeIdStr}>{d.typeIdStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.rcaFoundTime"),
                id: "rcaFoundTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.rcaFoundTime ? <span title={convertDateToDDMMYYYYHHMISS(d.rcaFoundTime)}>{convertDateToDDMMYYYYHHMISS(d.rcaFoundTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.waFoundTime"),
                id: "waFoundTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.waFoundTime ? <span title={convertDateToDDMMYYYYHHMISS(d.waFoundTime)}>{convertDateToDDMMYYYYHHMISS(d.waFoundTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.slFoundTime"),
                id: "slFoundTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.slFoundTime ? <span title={convertDateToDDMMYYYYHHMISS(d.slFoundTime)}>{convertDateToDDMMYYYYHHMISS(d.slFoundTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.closedTime"),
                id: "closedTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.closedTime ? <span title={convertDateToDDMMYYYYHHMISS(d.closedTime)}>{convertDateToDDMMYYYYHHMISS(d.closedTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.wa"),
                id: "wa",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.wa ? <span title={d.wa.replace(/<\/?[^>]+(>|$)/g, "")}>{d.wa.replace(/<\/?[^>]+(>|$)/g, "")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.solution"),
                id: "solution",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.solution ? <span title={d.solution.replace(/<\/?[^>]+(>|$)/g, "")}>{d.solution.replace(/<\/?[^>]+(>|$)/g, "")}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.solutionTypeId"),
                id: "solutionType",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.solutionType ? <span title={d.solutionType}>{d.solutionType}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.receiveUserId"),
                id: "receiveUserId",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.receiveUserId ? <span title={d.receiveUserId}>{d.receiveUserId}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.timeUsed"),
                id: "timeUsed",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.timeUsed ? <span title={d.timeUsed}>{d.timeUsed}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.workLog"),
                id: "worklog",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.worklog ? <span title={d.worklog}>{d.worklog}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.influenceScope"),
                id: "influenceScope",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.influenceScope ? <span title={d.influenceScope}>{d.influenceScope}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.delayTime"),
                id: "delayTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.delayTime ? <span title={convertDateToDDMMYYYYHHMISS(d.delayTime)}>{convertDateToDDMMYYYYHHMISS(d.delayTime)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.rcaType"),
                id: "rcaType",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.rcaType ? <span title={d.rcaType}>{d.rcaType}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.categorizationId"),
                id: "categorization",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.categorization ? <span title={d.categorization}>{d.categorization}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.process"),
                id: "process",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.process ? <span title={d.process}>{d.process}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.techDomain"),
                id: "typeCode",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.typeCode ? <span title={d.typeCode}>{d.typeCode}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.nodeType"),
                id: "subCategoryIdStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.subCategoryIdStr ? <span title={d.subCategoryIdStr}>{d.subCategoryIdStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.impact"),
                id: "impactIdStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.impactIdStr ? <span title={d.impactIdStr}>{d.impactIdStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.receiveUserName"),
                id: "receiveUserIdStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.receiveUserIdStr ? <span title={d.receiveUserIdStr}>{d.receiveUserIdStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.priority"),
                id: "priorityStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.priorityStr ? <span title={d.priorityStr}>{d.priorityStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.ptRelatedTypeId"),
                id: "ptRelatedType",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.ptRelatedType ? <span title={d.ptRelatedType}>{d.ptRelatedType}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.pmGroup"),
                id: "pmGroupName",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.pmGroupName ? <span title={d.pmGroupName}>{d.pmGroupName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.rcaType"),
                id: "rcaType",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.rcaType ? <span title={d.rcaType}>{d.rcaType}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.ptRelatedType"),
                id: "ptRelatedType",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.ptRelatedTypeStr ? <span title={d.ptRelatedTypeStr}>{d.ptRelatedTypeStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.categorization"),
                id: "categorizationStr",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.categorizationStr ? <span title={d.categorizationStr}>{d.categorizationStr}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.outOfDate"),
                id: "isOutOfDate",
                className: "text-center",
                width: 100,
                accessor: d => {
                    return d.isOutOfDate ? <span title={d.isOutOfDate}>{d.isOutOfDate}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.assignedTime"),
                id: "assignTimeTemp",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.assignTimeTemp ? <span title={convertDateToDDMMYYYYHHMISS(d.assignTimeTemp)}>{convertDateToDDMMYYYYHHMISS(d.assignTimeTemp)}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.pmUserName"),
                id: "pmUserName",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.pmUserName ? <span title={d.pmUserName}>{d.pmUserName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.solutionType"),
                id: "solutionTypeName",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.solutionTypeName ? <span title={d.solutionTypeName}>{d.solutionTypeName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.softVersion"),
                id: "softwareVersion",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.softwareVersion ? <span title={d.softwareVersion}>{d.softwareVersion}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.hardVersion"),
                id: "hardwareVersion",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.hardwareVersion ? <span title={d.hardwareVersion}>{d.hardwareVersion}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.ptDuplicate"),
                id: "ptDuplicate",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.ptDuplicate ? <span title={d.ptDuplicate}>{d.ptDuplicate}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ptProblem:ptProblem.label.reasonOverdue"),
                id: "reasonOverdue",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.reasonOverdue ? <span title={d.reasonOverdue}>{d.reasonOverdue}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
        ];
    }

    deleteSearchConfig = () => {
        if (this.state.objConfigSearch) {
            this.props.actions.deleteListSearchConfigUser({ funcKey: "searchPTNew" }).then((response) => {
                toastr.success(this.props.t("common:common.message.success.resetDefaultSearchConfigUser"));
                this.getConfigSearch();
                this.setState({
                    valueProblemCode: "",
                    valueProblemName: "",
                    objConfigSearch: this.buildSearchConfigDefault()
                });
            }).catch((error) => {
                toastr.error(this.props.t("common:common.message.error.resetDefaultSearchConfigUser"));
            });
        }
    }

    getConfigSearch = () => {
        this.props.actions.getListSearchConfigUser({ funcKey: "searchPTNew" }).then((response) => {
            let objConfigSearch = {};
            if (response.payload.data.length > 0) {
                for (const obj of response.payload.data) {
                    objConfigSearch[obj.fieldName] = { id: obj.searchConfigUserId, value: obj.fieldValue };
                }
            } else {
                objConfigSearch = this.buildSearchConfigDefault();
            }
            const stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
            let stateListDefault = [];
            for (const state of stateList) {
                const stateIdList = objConfigSearch.problemState.value;
                if (stateIdList.includes(state.itemId)) {
                    stateListDefault.push({ value: state.itemId, label: state.itemName });
                }
            }
            this.setState({
                objConfigSearch,
                selectValueProblemState: stateListDefault || [],
                selectValuePriorityId: objConfigSearch.priority.value ? JSON.parse(objConfigSearch.priority.value) : {},
                selectValuePmGroup: objConfigSearch.pmGroup.value ? JSON.parse(objConfigSearch.pmGroup.value) : {},
                selectValueCreateUnitId: objConfigSearch.createUnit.value ? JSON.parse(objConfigSearch.createUnit.value) : {},
                selectValueReceiveUnitId: objConfigSearch.receiveUnit.value ? JSON.parse(objConfigSearch.receiveUnit.value) : {},
                isCheckedReceiveUnitSub: objConfigSearch.receiveUnitSub.value === "true" ? true : false,
                isCheckedCreateUnitSub: objConfigSearch.createUnitSub.value === "true" ? true : false,
                selectValueCategorization: objConfigSearch.categorization.value ? JSON.parse(objConfigSearch.categorization.value) : {},
                selectValueSubCategoryId: objConfigSearch.subCategory.value ? JSON.parse(objConfigSearch.subCategory.value) : {},
                selectValueTypeId: objConfigSearch.typeId.value ? JSON.parse(objConfigSearch.typeId.value) : {},
                selectValueLocation: objConfigSearch.location.value ? JSON.parse(objConfigSearch.location.value) : {},
                createTimeFromSearch: objConfigSearch.fromDate.value ? moment(objConfigSearch.fromDate.value) : null,
                createTimeToSearch: objConfigSearch.toDate.value ? moment(objConfigSearch.toDate.value) : null,
                valueProblemCode: (objConfigSearch.problemCode && objConfigSearch.problemCode.value) ? objConfigSearch.problemCode.value : "",
                valueProblemName: (objConfigSearch.problemName && objConfigSearch.problemName.value) ? objConfigSearch.problemName.value : "",
                isGetSubCategory: true
            }, () => {
                let values = {
                    page: 1,
                    pageSize: 10
                }
                const objectSearch = Object.assign({}, this.state.objectSearch, values);
                objectSearch.problemCode = objConfigSearch.problemCode ? objConfigSearch.problemCode.value : "";
                objectSearch.problemName = objConfigSearch.problemName ? objConfigSearch.problemName.value : "";
                objectSearch.pmUserName = objConfigSearch.pmUserName ? objConfigSearch.pmUserName.value : "";
                objectSearch.affectedNode = objConfigSearch.affectedNode ? objConfigSearch.affectedNode.value : "";
                objectSearch.priorityId = this.state.selectValuePriorityId ? this.state.selectValuePriorityId.value : null;
                objectSearch.typeId = this.state.selectValueTypeId ? this.state.selectValueTypeId.value : null;
                objectSearch.pmGroup = this.state.selectValuePmGroup ? this.state.selectValuePmGroup.value : null;
                objectSearch.pmGroupName = this.state.selectValuePmGroup ? this.state.selectValuePmGroup.label : null;
                objectSearch.categorization = this.state.selectValueCategorization ? this.state.selectValueCategorization.value : null;
                objectSearch.locationId = this.state.selectValueLocation ? this.state.selectValueLocation.value : null;
                objectSearch.subCategoryId = this.state.selectValueSubCategoryId ? this.state.selectValueSubCategoryId.value : null;
                objectSearch.receiveUnitId = this.state.selectValueReceiveUnitId ? this.state.selectValueReceiveUnitId.value : null;
                objectSearch.createUnitId = this.state.selectValueCreateUnitId ? this.state.selectValueCreateUnitId.value : null;
                objectSearch.problemState = this.state.selectValueProblemState.map(item => item.value).join(',');
                objectSearch.fromDate = this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null;
                objectSearch.toDate = this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null;
                objectSearch.isCreateUnitId = this.state.isCheckedCreateUnitSub;
                objectSearch.isReceiveUnitId = this.state.isCheckedReceiveUnitSub;
                this.setState({
                    loading: true,
                    objectSearch,
                    isFirstSearchTable: false
                }, () => {
                    this.searchPtProblem();
                });
            });
        }).catch((error) => {
            const objConfigSearch = this.buildSearchConfigDefault();
            let values = {
                page: 1,
                pageSize: 10
            }
            const objectSearch = Object.assign({}, this.state.objectSearch, values);
            objectSearch.problemState = objConfigSearch.problemState.value;
            objectSearch.fromDate = convertDateToDDMMYYYYHHMISS(moment(objConfigSearch.fromDate.value).toDate());
            objectSearch.toDate = convertDateToDDMMYYYYHHMISS(moment(objConfigSearch.toDate.value).toDate());
            objectSearch.isCreateUnitId = false;
            objectSearch.isReceiveUnitId = false;
            this.setState({
                loading: true,
                objectSearch,
                isFirstSearchTable: false
            }, () => {
                this.searchPtProblem();
            });
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
            objectSearch
        }, () => {
            this.searchPtProblem();
        });
    }

    handleKeyDownForm = event => {
        if (event.key === 'Enter') {
            this.setState({
                isSearchClicked: false
            });
        }
    }

    search(event, values) {
        if (this.state.createTimeFromSearch.toDate() > new Date()) {
            toastr.warning(this.props.t("ptProblem:ptProblem.message.required.createTimeFrom"));
            return;
        }
        validSubmitForm(event, values, "idFormSearch");
        values.priorityId = this.state.selectValuePriorityId ? this.state.selectValuePriorityId.value : null;
        values.typeId = this.state.selectValueTypeId ? this.state.selectValueTypeId.value : null;
        values.pmGroup = this.state.selectValuePmGroup ? this.state.selectValuePmGroup.value : null;
        values.categorization = this.state.selectValueCategorization ? this.state.selectValueCategorization.value : null;
        values.locationId = this.state.selectValueLocation ? this.state.selectValueLocation.value : null;
        values.subCategoryId = this.state.selectValueSubCategoryId ? this.state.selectValueSubCategoryId.value : null;
        values.receiveUnitId = this.state.selectValueReceiveUnitId ? this.state.selectValueReceiveUnitId.value : null;
        values.createUnitId = this.state.selectValueCreateUnitId ? this.state.selectValueCreateUnitId.value : null;
        values.problemState = this.state.selectValueProblemState.map(item => item.value).join(',');
        values.fromDate = this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null;
        values.toDate = this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null;
        values.isCreateUnitId = this.state.isCheckedCreateUnitSub;
        values.isReceiveUnitId = this.state.isCheckedReceiveUnitSub;
        values.keyword = values.searchAll;
        values.page = 1;
        delete values.searchAll;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        this.setState({
            btnSearchLoading: this.state.isSearchClicked,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchPtProblem();
        });
    }

    searchPtProblem() {
        if (!this.state.isFirstSearchTable) {
            if (this.state.objectSearch.fromDate && this.state.objectSearch.toDate) {
                this.props.actions.searchPtProblem(this.state.objectSearch).then((response) => {
                    this.setState({
                        data: response.payload.data.data ? response.payload.data.data : [],
                        pages: response.payload.data.pages,
                        loading: false
                    });
                    if (this.state.isSearchClicked) {
                        this.setState({ btnSearchLoading: false });
                    }
                }).catch((response) => {
                    this.setState({
                        btnSearchLoading: false,
                        loading: false
                    });
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.search"));
                });
            } else {
                this.setState({
                    btnSearchLoading: false,
                    loading: false
                });
            }
        }
    }

    closeConfigFieldPopup = () => {
        this.setState({
            isOpenConfigFieldPopup: false,
        });
    }

    openConfigFieldPopup = () => {
        this.setState({
            isOpenConfigFieldPopup: true,
        });
    }

    openPage(name, object) {
        if (name === "ADD") {
            this.setState({
                addModal: true,
                editModal: false,
                detailModal: false,
                modalName: name,
                selectedData: {},
            });
        } else if (name === "EDIT") {
            this.props.actions.getDetailPtProblem(object.problemId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        addModal: false,
                        editModal: true,
                        detailModal: false,
                        modalName: name,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.getDetail"));
            });
        } else if (name === "DETAIL") {
            this.props.actions.getDetailPtProblem(object.problemId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        addModal: false,
                        editModal: false,
                        detailModal: true,
                        modalName: name,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.getDetail"));
            });
        }
    }

    closePage(name, isChange) {
        if (name === "ADD") {
            this.setState({
                addModal: false,
                moduleName: null
            }, () => {
                if (isChange) {
                    const objectSearch = Object.assign({}, this.state.objectSearch);
                    objectSearch.page = 1;
                    this.setState({
                        objectSearch
                    },() => {
                        this.customReactTableSearch.resetPage();
                        this.searchPtProblem();
                    });
                }
            });
        } else if (name === "EDIT") {
            this.setState({
                editModal: false,
                moduleName: null
            }, () => {
                if (isChange) {
                    this.searchPtProblem();
                }
            });
        } else if (name === "DETAIL") {
            this.setState({
                detailModal: false,
                moduleName: null
            });
        }
    }

    closePopupChat = (object) => {
        this.setState({
            isOpenPopup: false,
        });
    }

    openPopupChat = (object) => {
        if (object.isChat === 1) {
            this.props.actions.sendChatListUsers(object).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    toastr.success(this.props.t("ptProblem:ptProblem.message.success.sendMessage"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.sendMessage"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.sendMessage"));
            });
        } else {
            this.props.actions.getListChatUsers(object).then((response) => {
                if (response.payload && response.payload.data) {
                    object.listChatUsers = response.payload.data;
                    this.setState({
                        isOpenPopup: true,
                        selectedData: object
                    });
                } else {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.getListChat"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.getListChat"));
            });
        }
    }

    //combobox
    handleItemSelectChangeOdPriorityId(option) {
        this.setState({ selectValuePriorityId: option });
    }

    handleItemSelectChangeProblemState(option) {
        this.setState({ selectValueProblemState: option });
    }

    handleItemSelectChangeSoftGroup(option) {
        this.setState({ selectValuePmGroup: option })
    }

    handleItemSelectChangeTechDomain(option) {
        this.setState({ selectValueTypeId: option });
        if (option.value) {
            this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
                let nodeTypeList = [];
                for (const obj of response.payload.data.data) {
                    if (obj.parentItemId === option.value) {
                        nodeTypeList.push(obj);
                    }
                }
                this.setState({
                    nodeTypeList
                });
            });
        } else {
            this.setState({
                nodeTypeList: [],
                selectValueSubCategoryId: {}
            });
        }
    }

    // handleItemSelectChangeNation(option){
    //     this.setState({selectValueNation:option})
    // }

    handleItemSelectChangeCategorization(option) {
        this.setState({ selectValueCategorization: option })
    }
    selectValueSubCategoryId(option) {
        this.setState({ selectValueSubCategoryId: option })
    }
    // handleItemSelectChangeZone(option){
    //     this.setState({selectValueZone:option})
    // }
    // handleItemSelectChangeCity(option){
    //     this.setState({selectValueCity:option})
    // }

    handelItemSelectChangeCreateUnitId(option) {
        this.setState({ selectValueCreateUnitId: option })
    }
    handleOnChangeCheckboxCreateUnit = () => {
        this.setState({ isCheckedCreateUnitSub: !this.state.isCheckedCreateUnitSub })
    }
    handelItemSelectChangeReceiveUnitId = option => {
        this.setState({ selectValueReceiveUnitId: option })
    }
    handleOnChangeCheckboxProcessUnit = () => {
        this.setState({ isCheckedReceiveUnitSub: !this.state.isCheckedReceiveUnitSub })
    }
    clearSearchConditions() {
        this.setState({
            selectValuePmGroup: {},
            selectValueTypeId: {},
            // selectValueNation: {},
            selectValueCategorization: {},
            selectValueSubCategoryId: {},
            // selectValueZone: {},
            // selectValueCity: {},
            selectValuePriorityId: {},
            selectValueLocation: {},
            selectValueProblemState: this.state.stateListDefault,
            selectValueCreateUnitId: {},
            selectValueReceiveUnitId: {},
            createTimeFromSearch: moment().subtract(1, 'year'),
            createTimeToSearch: moment(),
            isCheckedCreateUnitSub: false,
            isCheckedReceiveUnitSub: false,
            valueProblemCode: "",
            valueProblemName: ""
        }, () => {
            // this.myFormRef.reset();
            try {
                this.myFormRef._inputs.searchAll.value = "";
                document.getElementById("searchAll").value = "";
                this.myFormRef._inputs.pmUserName.value = "";
                document.getElementById("pmUserName").value = "";
                this.myFormRef._inputs.affectedNode.value = "";
                document.getElementById("affectedNode").value = "";
                document.getElementById("input-filter-problemCode").value = "";
                document.getElementById("input-filter-problemName").value = "";
            } catch (error) {

            }
        });
    }

    handleChangeColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    handleApplyCreateTime(event, picker) {
        this.setState({
            createTimeFromSearch: picker.startDate,
            createTimeToSearch: picker.endDate,
        }, () => {
            if (this.state.createTimeFromSearch && this.state.createTimeToSearch) {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.createdTimeFrom = this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null;
                objectSearch.createdTimeTo = this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null;
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchPtProblem();
                });
            }
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("pt", "PT_PROBLEMS_PROCESS", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    buildSearchConfigDefault = () => {
        return {
            affectedNode: { value: "" },
            categorization: { value: JSON.stringify({}) },
            pmGroup: { value: JSON.stringify({}) },
            problemState: { value: this.state.stateListDefault.map(item => item.value).join(",") },
            problemName: { value: "" },
            problemCode: { value: "" },
            fromDate: { value: moment().subtract(1, 'year').toDate() },
            toDate: { value: moment().set({hour:23,minute:59,second:59,millisecond:0}).toDate() },
            priority: { value: JSON.stringify({}) },
            pmUsername: { value: "" },
            typeId: { value: JSON.stringify({}) },
            location: { value: JSON.stringify({}) },
            createUnit: { value: JSON.stringify({}) },
            receiveUnit: { value: JSON.stringify({}) },
            createUnitSub: { value: "false" },
            receiveUnitSub: { value: "false" },
            subCategory: { value: JSON.stringify({}) }
        }
    }

    saveConfigSearch = () => {
        let funcKey = "searchPTNew";
        let objInsertConfig = [
            {
                fieldName: "affectedNode",
                fieldValue: this.state.objectSearch.affectedNode,
            },
            {
                fieldName: "categorization",
                fieldValue: JSON.stringify(this.state.selectValueCategorization),
            },
            {
                fieldName: "pmGroup",
                fieldValue: JSON.stringify(this.state.selectValuePmGroup),
            },
            {
                fieldName: "problemState",
                fieldValue: this.state.selectValueProblemState.map(item => item.value).join(","),
            },
            {
                fieldName: "problemName",
                fieldValue: this.state.objectSearch.problemName,
            },
            {
                fieldName: "problemCode",
                fieldValue: this.state.objectSearch.problemCode,
            },
            {
                fieldName: "fromDate",
                fieldValue: this.state.createTimeFromSearch ? this.state.createTimeFromSearch.toDate() : null,
            },
            {
                fieldName: "toDate",
                fieldValue: this.state.createTimeToSearch ? this.state.createTimeToSearch.toDate() : null,
            },
            {
                fieldName: "priority",
                fieldValue: JSON.stringify(this.state.selectValuePriorityId),
            },
            {
                fieldName: "pmUsername",
                fieldValue: this.state.objectSearch.pmUserName,
            },
            {
                fieldName: "typeId",
                fieldValue: JSON.stringify(this.state.selectValueTypeId),
            },
            {
                fieldName: "location",
                fieldValue: this.state.selectValueLocation ? JSON.stringify({value: this.state.selectValueLocation.value, label: this.state.selectValueLocation.label}) : "{}",
            },
            {
                fieldName: "createUnit",
                fieldValue: this.state.selectValueCreateUnitId ? JSON.stringify({ value: this.state.selectValueCreateUnitId.value, label: this.state.selectValueCreateUnitId.label }) : "{}",
            },
            {
                fieldName: "receiveUnit",
                fieldValue: this.state.selectValueReceiveUnitId ? JSON.stringify({ value: this.state.selectValueReceiveUnitId.value, label: this.state.selectValueReceiveUnitId.label }) : "{}",
            },
            {
                fieldName: "createUnitSub",
                fieldValue: this.state.isCheckedCreateUnitSub,
            },
            {
                fieldName: "receiveUnitSub",
                fieldValue: this.state.isCheckedReceiveUnitSub,
            },
            {
                fieldName: "subCategory",
                fieldValue: JSON.stringify(this.state.selectValueSubCategoryId),
            },
        ];
        this.props.actions.insertOrUpdateListSearchConfigUser({ searchConfigUserDTOS: objInsertConfig, funcKey: funcKey }).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("ptProblem:ptProblem.message.success.saveSearchConfig"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.saveSearchConfig"));
            }
        }).catch((error) => {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.saveSearchConfig"));
        });
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearch");
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading, objConfigSearch } = this.state;
        let objectSearch = {};
        let pmUserName = (objConfigSearch.pmUsername && objConfigSearch.pmUsername.value) ? objConfigSearch.pmUsername.value : "";
        let affectedNode = (objConfigSearch.affectedNode && objConfigSearch.affectedNode.value) ? objConfigSearch.affectedNode.value : "";
        let priorityList = (response.common.ptPriority && response.common.ptPriority.payload) ? response.common.ptPriority.payload.data.data : [];
        let techDomainList = (response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : [];
        let ticketTypeList = (response.common.ptCate && response.common.ptCate.payload) ? response.common.ptCate.payload.data.data : [];
        return (
            <CustomCSSTransition
                isVisible={this.state.addModal || this.state.editModal || this.state.detailModal}
                content={
                    this.state.addModal ?
                    <PtProblemAdd
                        closePage={this.closePage}
                        parentState={this.state}
                        reloadPage={this.getConfigSearch} /> :
                    this.state.editModal ?
                    <PtProblemEdit
                        closePage={this.closePage}
                        parentState={this.state} /> :
                    <PtProblemDetail
                        closePage={this.closePage}
                        parentState={this.state} />
            }>
                <div>
                    <AvForm id="idFormSearch" onKeyDown={this.handleKeyDownForm} onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch} ref={el => this.myFormRef = el}>
                        {/* <editor-fold desc="Search form"> */}
                        <div className="animated fadeIn">
                            <Row>
                                <Col xs="12">
                                    <Card>
                                        <CardHeader>
                                            <i className="fa fa-search"></i>{t("common:common.title.advancedSearch")}
                                            <div className="card-header-actions">
                                                {/* <Button type="button" color="link" className="card-header-action btn-setting"><i className="icon-settings"></i></Button> */}
                                                <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormSearch" onClick={this.toggleFormSearch}><i className={this.state.collapseFormSearch ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                            </div>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.collapseFormSearch} id="collapseFormSearch">
                                            <CardBody>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="pmUserName" label={t("ptProblem:ptProblem.label.softAccount")}
                                                            placeholder={t("ptProblem:ptProblem.placeholder.softAccount")} value={pmUserName || this.state.objectSearch.pmUserName} />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"priorityId"}
                                                            label={t("ptProblem:ptProblem.label.priority")}
                                                            isRequired={false}
                                                            options={priorityList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeOdPriorityId}
                                                            selectValue={this.state.selectValuePriorityId}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelect
                                                            name={"pmGroup"}
                                                            label={t("ptProblem:ptProblem.label.softGroup")}
                                                            isRequired={false}
                                                            closeMenuOnSelect={true}
                                                            moduleName={"ROLE"}
                                                            handleItemSelectChange={this.handleItemSelectChangeSoftGroup}
                                                            selectValue={this.state.selectValuePmGroup}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"typeId"}
                                                            label={t("ptProblem:ptProblem.label.techDomain")}
                                                            isRequired={false}
                                                            options={techDomainList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeTechDomain}
                                                            selectValue={this.state.selectValueTypeId}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"subCategoryId"}
                                                            label={t("ptProblem:ptProblem.label.nodeType")}
                                                            isRequired={false}
                                                            options={this.state.nodeTypeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.selectValueSubCategoryId}
                                                            selectValue={this.state.selectValueSubCategoryId}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="affectedNode" label={t("ptProblem:ptProblem.label.node")}
                                                            placeholder={t("ptProblem:ptProblem.placeholder.node")} value={affectedNode} />
                                                    </Col>
                                                </Row>
                                                {/* <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelect
                                                            name={"nation"}
                                                            label={t("ptProblem:ptProblem.label.nation")}
                                                            isRequired={false}
                                                            moduleName={"REGION_COUNTRY"}
                                                            parentValue={""}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeNation}
                                                            selectValue={this.state.selectValueNation}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelect
                                                            name={"zone"}
                                                            label={t("ptProblem:ptProblem.label.zone")}
                                                            isRequired={false}
                                                            moduleName={"REGION_AREA"}
                                                            parentValue={this.state.selectValueNation.value}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeZone}
                                                            selectValue={this.state.selectValueZone}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelect
                                                            name={"city"}
                                                            label={t("ptProblem:ptProblem.label.city")}
                                                            isRequired={false}
                                                            moduleName={"REGION_PROVINCE"}
                                                            parentValue={this.state.selectValueZone.value}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeCity}
                                                            selectValue={this.state.selectValueCity}
                                                        />
                                                    </Col>
                                                </Row> */}
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomAutocomplete
                                                            name={"locationId"}
                                                            label={t("ptProblem:ptProblem.label.section")}
                                                            placeholder={t("ptProblem:ptProblem.placeholder.section")}
                                                            isRequired={false}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueLocation: d })}
                                                            selectValue={this.state.selectValueLocation}
                                                            moduleName={"REGION"}
                                                            isHasCheckbox={false}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"categorization"}
                                                            label={t("ptProblem:ptProblem.label.ticketType")}
                                                            isRequired={false}
                                                            options={ticketTypeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeCategorization}
                                                            selectValue={this.state.selectValueCategorization}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAutocomplete
                                                            name={"createUnitId"}
                                                            label={t("ptProblem:ptProblem.label.createdUnit")}
                                                            placeholder={t("ptProblem:ptProblem.placeholder.createdUnit")}
                                                            isRequired={false}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={this.handelItemSelectChangeCreateUnitId}
                                                            selectValue={this.state.selectValueCreateUnitId}
                                                            moduleName={"UNIT"}
                                                            isHasCheckbox={true}
                                                            nameCheckbox={"checkCreatedUnit"}
                                                            isCheckedCheckbox={this.state.isCheckedCreateUnitSub}
                                                            handleOnChangeCheckbox={this.handleOnChangeCheckboxCreateUnit}
                                                            titleCheckbox={this.props.t("ptProblem:ptProblem.label.checkSubUnit")}
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
                                                    title={t("ptProblem:ptProblem.placeholder.searchAll")} />
                                            </div>
                                            {/* <i className="fa fa-align-justify"></i>{t('common:common.table.totalRecord', { number: (data.length > 0 ? data[0].totalRow : 0) })} */}
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ptProblem:ptProblem.button.add")}
                                                    onClick={() => this.openPage("ADD")}><i className="fa fa-plus"></i>
                                                </Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-2"
                                                    title={t("ptProblem:ptProblem.button.export")}
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    onClick={() => this.onExport()}>
                                                    <i className="fa fa-download"></i>
                                                </LaddaButton>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2" title={t("ptProblem:ptProblem.button.save")}
                                                    onClick={this.saveConfigSearch}><i className="fa fa-save"></i>
                                                </Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-2"
                                                    title={t("ptProblem:ptProblem.button.restore")}
                                                    data-style={ZOOM_OUT}
                                                    onClick={this.deleteSearchConfig}>
                                                    <i className="fa fa-refresh"></i>
                                                </LaddaButton>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ptProblem:ptProblem.title.viewConfigField")}
                                                    onClick={this.openConfigFieldPopup}><i className="fa fa-eye"></i>
                                                </Button>
                                                <SettingTable
                                                    columns={columns}
                                                    onChange={this.handleChangeColumnsTable}
                                                    moduleName={"PT_PROBLEM_LIST"}
                                                />
                                                {/* <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormInfo" onClick={this.toggleFormInfo}><i className={this.state.collapseFormInfo ? "icon-arrow-up" : "icon-arrow-down"}></i></Button> */}
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
                        </div>
                    </AvForm>
                    <PtProblemListConfigFieldPopup
                        closePopup={this.closeConfigFieldPopup}
                        parentState={this.state} /> 
                    <PTProblemChatPopup
                        parentState={this.state}
                        closePopup={this.closePopupChat}
                    />
                    {/* </editor-fold> */}
                </div>
                </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemList));