import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, Col, Collapse, Row, ButtonGroup, Label, ListGroup, ListGroupItem, Badge, FormGroup } from 'reactstrap';
import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import TtTroubleAdd from "./TtTroubleAdd";
import TtTroubleEdit from "./TtTroubleEdit";
import { CustomSelectLocal, SettingTable, SearchBar, CustomReactTableSearch, CustomAutocomplete,
        CustomMultiSelectLocal, CustomInputFilter, CustomSelect, CustomDateTimeRangePicker, MoreButtonTable } from '../../../containers/Utils';
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { convertDateToDDMMYYYYHHMISS, colors, validSubmitForm, confirmAlertDelete, invalidSubmitForm } from "../../../containers/Utils/Utils";
import moment from 'moment';
import TtTroubleChatPopup from './TtTroubleChatPopup';
import TtTroubleInfoCallPopup from './TtTroubleInfoCallPopup';
import SlidingPanel from '../../../containers/Utils/CustomReactSlidingSidePanel';
import { Pie } from 'react-chartjs-2';

class TtTroubleList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchTtTrouble = this.searchTtTrouble.bind(this);
        this.search = this.search.bind(this);
        this.openPage = this.openPage.bind(this);
        this.closePage = this.closePage.bind(this);
        this.clearSearchConditions = this.clearSearchConditions.bind(this);
        this.onExport = this.onExport.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleChangeColumnsTable = this.handleChangeColumnsTable.bind(this);

        this.state = {
            openPanel: false,
            collapseFormSearch: false,
            isSearchClicked: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            isOpenInfoCallPopup: false,
            //Object Search
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
            //select
            selectValuePtType: [],
            selectValueVendor: {},
            selectValueImpact: {},
            selectValueSubCategory: {},
            selectValueState: [],
            selectValuePriority: {},
            selectValueInsertSource: {},
            selectValueRelatedTicket: {},
            selectValueAlarmGroup: {},
            selectValueWarnLevel: {},
            selectValueResPerson: {},
            selectValueLocation: {},
            selectValueHelp: {},
            selectValueUnit: { value: JSON.parse(localStorage.user).deptId },
            isCheckedUnit: false,
            createTimeFrom: moment().subtract(1, 'month'),
            createTimeTo: moment().set({hour:23,minute:59,second:59,millisecond:0}),
            isUnit: "isResponsibleUnit",
            isFisrtSearch: true,
            isPtTypeChange: false,
            countByState: [],
            //combo list
            ptTypeList: [],
            ptSubCatList : [],
            ttStateList : [],
            ttPriorityList : [],
            vendorList : [],
            ttImpactList: [],
            insertSourceList: [],
            warnLevelList: [],
            alarmGroupList: []
        };
    }

    componentDidMount() {
        this.getListCatItem();
    }

    componentDidUpdate(prevProps, prevState) {
        // đối với node mạng categoryId = 7
        // đối với nhóm group categoryId = 101
        if (this.state.isPtTypeChange) {
            if (this.state.selectValuePtType.length > 0) {
                this.props.actions.getListCatItemByListParent(7, this.state.selectValuePtType.map(item => item.value).join(",")).then((response) => {
                    this.setState({
                        ptSubCatList: response.payload.data || []
                    });
                });
                this.props.actions.getListCatItemByListParent(101, this.state.selectValuePtType.map(item => item.value).join(",")).then((response) => {
                    this.setState({
                        alarmGroupList: response.payload.data || []
                    });
                });
            } else {
                this.setState({
                    ptSubCatList: [],
                    alarmGroupList: []
                });
            }
            this.setState({
                isPtTypeChange: false
            });
        }
    }

    getListCatItem = () => {
        let arrCatItem = [];
        arrCatItem.push("PT_TYPE");//mang su co
        arrCatItem.push("TT_STATE");//trang thai
        arrCatItem.push("TT_PRIORITY");//muc uu tien
        arrCatItem.push("VENDOR");//vendor
        arrCatItem.push("TT_IMPACT");//muc anh huong
        arrCatItem.push("INSERT_SOURCE");//nguon tao
        arrCatItem.push("WARN_LEVEL");//muc su co

        const data = JSON.stringify(arrCatItem).replace("[", "%5B").replace("]", "%5D");

        this.props.actions.getListCatItemDTO(data).then((response) => {
            let ptTypeList = [];
            let ttStateList = [];
            let ttPriorityList = [];
            let vendorList = [];
            let ttImpactList = [];
            let insertSourceList = [];
            let warnLevelList = [];
            for (const item of response.payload.data) {
                switch(item.categoryCode) {
                    case "PT_TYPE":
                        ptTypeList.push(item);
                        break;
                    case "TT_STATE":
                        ttStateList.push(item);
                        break;
                    case "TT_PRIORITY":
                        ttPriorityList.push(item);
                        break;
                    case "VENDOR":
                        vendorList.push(item);
                        break;
                    case "TT_IMPACT":
                        ttImpactList.push(item);
                        break;
                    case "INSERT_SOURCE":
                        insertSourceList.push(item);
                        break;
                    case "WARN_LEVEL":
                        warnLevelList.push(item);
                        break;
                    default:
                        break;
                }
            }
            this.setState({
                ptTypeList,
                ttStateList,
                ttPriorityList,
                vendorList,
                ttImpactList,
                insertSourceList,
                warnLevelList
            });
        });
    }

    buildTableColumns() {
        return [
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.action"),
                id: "action",
                sortable: false,
                fixed: "left",
                width: 100,
                accessor: d => {
                    //so sánh d.unitMove === user.deptId thì set màu xanh
                    let html = <div></div>;
                    const time = (d.timeUsed && d.timeProcess) ? (d.timeUsed / d.timeProcess) * 100 : 0;
                    let color = "";
                    let status = "";
                    if (time <= 75) {
                        color = "";
                        status = "inDueDate";
                    } else if (time <= 100) {
                        color = "#dea700";
                        status = "commingSoon";
                    } else {
                        color = "#ff0000";
                        status = "outOfDate";
                    }
                    html = <div className="text-center">
                        <span title={this.props.t("ttTrouble:ttTrouble.label." + status)}>
                            <span className="span-icon-table icon mr-1" style={color === "" ? {} : { color: color }}><i className={color === "" ? "fa fa-flag-o" : "fa fa-flag"}></i></span>
                        </span>
                        <span title={this.props.t("ttTrouble:ttTrouble.button.processing")}>
                            <Button type="button" size="sm" className="btn-info icon mr-1" onClick={() => this.openPage("EDIT", d)}><i className="fa fa-gear"></i></Button>
                        </span>
                        <MoreButtonTable targetId={d.troubleId + ""}>
                            <span title={this.props.t("ttTrouble:ttTrouble.button.clone")}>
                                <Button type="button" size="sm" className="btn-warning icon mr-1" onClick={() => this.openPage("CLONE", d)}><i className="fa fa-copy"></i></Button>
                            </span>
                            <span title={this.props.t("common:common.button.delete")} className={d.createUserId === JSON.parse(localStorage.user).userID ? "" : "class-hidden"}>
                                <Button type="button" size="sm" className="btn-danger icon mr-1" onClick={() => this.confirmDelete(d)}><i className="fa fa-trash-o"></i></Button>
                            </span>
                            <span title={this.props.t("ttTrouble:ttTrouble.button.chatGroup")}>
                                <Button type="button" size="sm" className="btn-success icon mr-1" onClick={() => this.openPopupChat(d)}><i className="fa fa-commenting"></i></Button>
                            </span>
                            <span title={this.props.t("ttTrouble:ttTrouble.button.phone")} className={d.insertSource === "NOC" ? "" : "class-hidden"}>
                                <Button type="button" size="sm" className="btn-secondary icon mr-1" onClick={() => this.callIPCC(d)}><i className="fa fa-phone"></i></Button>
                            </span>
                            <span title={this.props.t("ttTrouble:ttTrouble.button.infoCall")} className={d.insertSource === "NOC" ? "" : "class-hidden"}>
                                <Button type="button" size="sm" className="btn-secondary icon" onClick={() => this.openInfoCallPopup(d)}><i className="fa fa-list-ul"></i></Button>
                            </span>
                        </MoreButtonTable>
                        <span className={d.unitMove === JSON.parse(localStorage.user).deptId ? "triangle-top-right" : "class-hidden"}></span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.domain"),
                id: "typeName",
                width: 200,
                accessor: d => {
                    return d.typeName ? <span title={d.typeName}>{d.typeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.troubleCode"),
                id: "troubleCode",
                width: 200,
                accessor: d => {
                    return d.troubleCode ? <span title={d.troubleCode}>{d.troubleCode}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="troubleCode" value={this.state.objectSearch.troubleCode}
                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.troubleCode")} />
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.troubleName"),
                id: "troubleName",
                width: 200,
                accessor: d => {
                    return d.troubleName ? <span title={d.troubleName}>{d.troubleName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="troubleName" value={this.state.objectSearch.troubleName}
                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.troubleName")} />
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.state"),
                id: "stateName",
                width: 250,
                accessor: d => {
                    return d.stateName ? <span title={d.stateName}>{d.stateName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomMultiSelectLocal
                        name={"lstState"}
                        label={""}
                        isRequired={false}
                        options={this.state.ttStateList}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={(d) => this.setState({ selectValueState: d })}
                        selectValue={this.state.selectValueState}
                        isOnlyInputSelect={true}
                        isDisabled={this.state.isUnit === "isResponsibleUnit"}
                    />
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.priority"),
                width: 200,
                id: "priorityName",
                accessor: d => {
                    return d.priorityName ? <span title={d.priorityName}>{d.priorityName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"priorityId"}
                        label={""}
                        isRequired={false}
                        options={this.state.ttPriorityList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={(d) => this.setState({ selectValuePriority: d })}
                        selectValue={this.state.selectValuePriority}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.createTime"),
                id: "createdTime",
                width: 250,
                accessor: d => {
                    return d.createdTime ? <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"createdTimeFrom"}
                        label={""}
                        isRequired={true}
                        startDate={this.state.createTimeFrom}
                        endDate={this.state.createTimeTo}
                        handleApply={this.handleApplyCreateTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.remainTime"),
                id: "remainTime",
                width: 150,
                accessor: d => {
                    return d.remainTime ? <span title={d.remainTime}>{d.remainTime}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="remainTime" value={this.state.objectSearch.remainTime}
                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.remainTime")} />
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.clearTime"),
                id: "clearTime",
                width: 250,
                accessor: d => {
                    return d.clearTime ? <span title={convertDateToDDMMYYYYHHMISS(d.clearTime)}>{convertDateToDDMMYYYYHHMISS(d.clearTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.lastUpdateTime"),
                id: "lastUpdateTime",
                width: 250,
                accessor: d => {
                    return d.lastUpdateTime ? <span title={convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}>{convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            //start
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.description"),
                id: "description",
                width: 250,
                accessor: d => {
                    return d.description ? <span title={d.description}>{d.description}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.subCategoryId"),
                id: "subCategoryId",
                width: 250,
                accessor: d => {
                    return d.subCategoryId ? <span title={d.subCategoryId}>{d.subCategoryId}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                //chua co
                Header: this.props.t("ttTrouble:ttTrouble.label.impactName"),
                id: "impactName",
                width: 250,
                accessor: d => {
                    return d.impactName ? <span title={d.impactName}>{d.impactName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.affectedNode"),
                id: "affectedNode",
                width: 250,
                accessor: d => {
                    return d.affectedNode ? <span title={d.affectedNode}>{d.affectedNode}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.affectedService"),
                id: "affectedService",
                width: 250,
                accessor: d => {
                    return d.affectedService ? <span title={d.affectedService}>{d.affectedService}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.location"),
                id: "location",
                width: 250,
                accessor: d => {
                    return d.location ? <span title={d.location}>{d.location}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.waitToReceiveTime"),
                id: "waitToReceiveTime",
                width: 250,
                accessor: d => {
                    return d.assignTime ? <span title={convertDateToDDMMYYYYHHMISS(d.assignTime)}>{convertDateToDDMMYYYYHHMISS(d.assignTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.startTime"),
                id: "beginTroubleTime",
                width: 250,
                accessor: d => {
                    return d.beginTroubleTime ? <span title={convertDateToDDMMYYYYHHMISS(d.beginTroubleTime)}>{convertDateToDDMMYYYYHHMISS(d.beginTroubleTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.endTime"),
                id: "endTroubleTime",
                width: 250,
                accessor: d => {
                    return d.endTroubleTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endTroubleTime)}>{convertDateToDDMMYYYYHHMISS(d.endTroubleTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.createUser"),
                id: "createUserName",
                width: 250,
                accessor: d => {
                    return d.createUserName ? <span title={d.createUserName}>{d.createUserName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.createUnitName"),
                id: "createUnitName",
                width: 250,
                accessor: d => {
                    return d.createUnitName ? <span title={d.createUnitName}>{d.createUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.insertSource"),
                id: "insertSource",
                width: 250,
                accessor: d => {
                    return d.insertSource ? <span title={d.insertSource}>{d.insertSource}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.relatedPt"),
                id: "relatedPt",
                width: 250,
                accessor: d => {
                    return d.relatedPt ? <span title={d.relatedPt}>{d.relatedPt}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.vendor"),
                id: "vendorName",
                width: 250,
                accessor: d => {
                    return d.vendorName ? <span title={d.vendorName}>{d.vendorName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.relatedKedb"),
                id: "relatedKedb",
                width: 250,
                accessor: d => {
                    return d.relatedKedb ? <span title={d.relatedKedb}>{d.relatedKedb}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.receiveUnitName"),
                id: "receiveUnitName",
                width: 250,
                accessor: d => {
                    return d.receiveUnitName ? <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.receiveUserNameList"),
                id: "receiveUserName",
                width: 250,
                accessor: d => {
                    return d.receiveUserName ? <span title={d.receiveUserName}>{d.receiveUserName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.rootCause"),
                id: "rootCause",
                width: 250,
                accessor: d => {
                    return d.rootCause ? <span title={d.rootCause}>{d.rootCause}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.workArround"),
                id: "workArround",
                width: 250,
                accessor: d => {
                    return d.workArround ? <span title={d.workArround}>{d.workArround}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.solutionType"),
                id: "solutionTypeName",
                width: 250,
                accessor: d => {
                    return d.solutionTypeName ? <span title={d.solutionTypeName}>{d.solutionTypeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.workLog"),
                id: "workLog",
                width: 250,
                accessor: d => {
                    return d.workLog ? <span title={d.workLog}>{d.workLog}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            // {
            //     Header: this.props.t("ttTrouble:ttTrouble.label.rejectedCodeName"),
            //     id: "rejectedCodeName",
            //     width: 250,
            //     accessor: d => {
            //         return d.problemName ? <span title={d.problemName}>{d.problemName}</span>
            //         : <span>&nbsp;</span>
            //     },
            //     Filter: ({ filter, onChange }) => (
            //         <div style={{ height: '2.7em' }}></div>
            //     )
            // },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.riskGroup"),
                id: "riskName",
                width: 250,
                accessor: d => {
                    return d.riskName ? <span title={d.riskName}>{d.riskName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.supportUnit"),
                id: "supportUnitName",
                width: 250,
                accessor: d => {
                    return d.supportUnitName ? <span title={d.supportUnitName}>{d.supportUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.queueTime"),
                id: "queueTime",
                width: 250,
                accessor: d => {
                    return d.queueTime ? <span title={convertDateToDDMMYYYYHHMISS(d.queueTime)}>{convertDateToDDMMYYYYHHMISS(d.queueTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.closeTime"),
                id: "closedTime",
                width: 250,
                accessor: d => {
                    return d.closedTime ? <span title={convertDateToDDMMYYYYHHMISS(d.closedTime)}>{convertDateToDDMMYYYYHHMISS(d.closedTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.riskGroupId"),
                id: "risk",
                width: 250,
                accessor: d => {
                    return d.risk ? <span title={d.risk}>{d.risk}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.timeUsed"),
                id: "timeUsed",
                width: 250,
                accessor: d => {
                    return d.timeUsed ? <span title={d.timeUsed}>{d.timeUsed}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                //xem xet
                Header: this.props.t("ttTrouble:ttTrouble.label.openDefferedTime"),
                id: "assignTimeTemp",
                width: 250,
                accessor: d => {
                    return d.assignTimeTemp ? <span title={convertDateToDDMMYYYYHHMISS(d.assignTimeTemp)}>{convertDateToDDMMYYYYHHMISS(d.assignTimeTemp)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                //xem xet
                Header: this.props.t("ttTrouble:ttTrouble.label.reasonGroup"),
                id: "reasonName",
                width: 250,
                accessor: d => {
                    return d.reasonName ? <span title={d.reasonName}>{d.reasonName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.createLateStr"),
                id: "createLateStr",
                width: 250,
                accessor: d => {
                    return d.createLateStr ? <span title={d.createLateStr}>{d.createLateStr}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.affectTime"),
                id: "affectTime",
                width: 250,
                accessor: d => {
                    const endTroubleTime = d.endTroubleTime ? new Date(d.endTroubleTime) : 0;
                    const beginTroubleTime = d.beginTroubleTime ? new Date(d.beginTroubleTime) : 0;
                    const text = ((endTroubleTime - beginTroubleTime) / (1000 * 60 * 60)).toFixed(0);
                    return <span title={text}>{text}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.fixTime"),
                id: "fixTime",
                width: 250,
                accessor: d => {
                    return d.fixTime ? <span title={d.fixTime}>{d.fixTime}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.isOverdueFixTime"),
                id: "isOverdueFixTime",
                width: 250,
                accessor: d => {
                    const remainTime = d.remainTime ? d.remainTime : 0;
                    const text = remainTime >= 0 ? this.props.t("ttTrouble:ttTrouble.label.inDueDate")
                    : this.props.t("ttTrouble:ttTrouble.label.outOfDate");
                    return <span title={text}>{text}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.isOverdueCloseTime"),
                id: "isOverdueCloseTime",
                width: 250,
                accessor: d => {
                    return d.isOverdueCloseTime ? <span title={d.isOverdueCloseTime}>{d.isOverdueCloseTime}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.subCategory"),
                id: "subCategoryName",
                width: 250,
                accessor: d => {
                    return d.subCategoryName ? <span title={d.subCategoryName}>{d.subCategoryName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.impactId"),
                id: "impactId",
                width: 250,
                accessor: d => {
                    return d.impactId ? <span title={d.impactId}>{d.impactId}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.solutionTypeId"),
                id: "solutionType",
                width: 250,
                accessor: d => {
                    return d.solutionType ? <span title={d.solutionType}>{d.solutionType}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.vendorId"),
                id: "vendorId",
                width: 250,
                accessor: d => {
                    return d.vendorId ? <span title={d.vendorId}>{d.vendorId}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.rejectedCodeName"),
                id: "rejectedCodeName",
                width: 250,
                accessor: d => {
                    return d.rejectedCodeName ? <span title={d.rejectedCodeName}>{d.rejectedCodeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.networkLevel"),
                id: "networkLevel",
                width: 250,
                accessor: d => {
                    return d.networkLevel ? <span title={d.networkLevel}>{d.networkLevel}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.lineCutCode"),
                id: "lineCutCode",
                width: 250,
                accessor: d => {
                    return d.lineCutCode ? <span title={d.lineCutCode}>{d.lineCutCode}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.codeSnippetOff"),
                id: "codeSnippetOff",
                width: 250,
                accessor: d => {
                    return d.codeSnippetOff ? <span title={d.codeSnippetOff}>{d.codeSnippetOff}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.cableType"),
                id: "cableTypeName",
                width: 250,
                accessor: d => {
                    return d.cableTypeName ? <span title={d.cableTypeName}>{d.cableTypeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.closuresReplace"),
                id: "closuresReplace",
                width: 250,
                accessor: d => {
                    return d.closuresReplace ? <span title={d.closuresReplace}>{d.closuresReplace}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.whereWrong"),
                id: "whereWrong",
                width: 250,
                accessor: d => {
                    return d.whereWrong ? <span title={d.whereWrong}>{d.whereWrong}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.asessmentData"),
                id: "asessmentData",
                width: 250,
                accessor: d => {
                    return d.asessmentData ? <span title={d.asessmentData}>{d.asessmentData}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.closeTtTime"),
                id: "closeTtTime",
                width: 250,
                accessor: d => {
                    return d.closeTtTime ? <span title={d.closeTtTime}>{d.closeTtTime}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.reason"),
                id: "transReasonEffectiveContent",
                width: 250,
                accessor: d => {
                    return d.transReasonEffectiveContent ? <span title={d.transReasonEffectiveContent}>{d.transReasonEffectiveContent}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            // {
            //     Header: this.props.t("ttTrouble:ttTrouble.label.autoClose"),
            //     id: "autoCloseName",
            //     width: 250,
            //     accessor: d => {
            //         return d.autoCloseName ? <span title={d.autoCloseName}>{d.autoCloseName}</span>
            //         : <span>&nbsp;</span>
            //     },
            //     Filter: ({ filter, onChange }) => (
            //         <div style={{ height: '2.7em' }}></div>
            //     )
            // },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.woCode"),
                id: "woCode",
                width: 250,
                accessor: d => {
                    return d.woCode ? <span title={d.woCode}>{d.woCode}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.transmissionNetworkType"),
                id: "transNetworkTypeName",
                width: 250,
                accessor: d => {
                    return d.transNetworkTypeName ? <span title={d.transNetworkTypeName}>{d.transNetworkTypeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.reasonType"),
                id: "transReasonEffectiveName",
                width: 250,
                accessor: d => {
                    return d.transReasonEffectiveName ? <span title={d.transReasonEffectiveName}>{d.transReasonEffectiveName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.clearUserId"),
                id: "clearUserId",
                width: 250,
                accessor: d => {
                    return d.clearUserId ? <span title={d.clearUserId}>{d.clearUserId}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.clearUserName"),
                id: "clearUserName",
                width: 250,
                accessor: d => {
                    return d.clearUserName ? <span title={d.clearUserName}>{d.clearUserName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.relatedTroubleCode"),
                id: "relatedTroubleCodes",
                width: 250,
                accessor: d => {
                    return d.relatedTroubleCodes ? <span title={d.relatedTroubleCodes}>{d.relatedTroubleCodes}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                //chua co
                Header: this.props.t("ttTrouble:ttTrouble.label.select"),
                id: "select",
                width: 250,
                accessor: d => {
                    return d.problemName ? <span title={d.problemName}>{d.problemName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.incidentGroup"),
                id: "alarmGroupName",
                width: 250,
                accessor: d => {
                    return d.alarmGroupName ? <span title={d.alarmGroupName}>{d.alarmGroupName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.autoClose"),
                id: "autoClose",
                width: 250,
                accessor: d => {
                    const text = d.autoClose === 1 ? this.props.t("ttTrouble:ttTrouble.label.closeAuto")
                    : this.props.t("ttTrouble:ttTrouble.label.closeByHand");
                    return <span title={text}>{text}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.relatedTt"),
                id: "relatedTt",
                width: 250,
                accessor: d => {
                    return d.relatedTt ? <span title={d.relatedTt}>{d.relatedTt}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.dateMove"),
                id: "dateMove",
                width: 250,
                accessor: d => {
                    return d.dateMove ? <span title={convertDateToDDMMYYYYHHMISS(d.dateMove)}>{convertDateToDDMMYYYYHHMISS(d.dateMove)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.unitMoveName"),
                id: "unitMoveName",
                width: 250,
                accessor: d => {
                    return d.unitMoveName ? <span title={d.unitMoveName}>{d.unitMoveName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.stationVip"),
                id: "isStationVip",
                width: 250,
                accessor: d => {
                    const text = d.isStationVip === 1 ? this.props.t("ttTrouble:ttTrouble.label.vipStation")
                    : this.props.t("ttTrouble:ttTrouble.label.normalStation");
                    return <span title={text}>{text}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.numberOfHelp"),
                id: "numHelp",
                width: 250,
                accessor: d => {
                    return d.numHelp ? <span title={d.numHelp}>{d.numHelp}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.informationTicket"),
                id: "infoTicket",
                width: 250,
                accessor: d => {
                    return d.infoTicket ? <span title={d.infoTicket}>{d.infoTicket}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.catchingTime"),
                id: "catchingTime",
                width: 250,
                accessor: d => {
                    return d.catchingTime ? <span title={convertDateToDDMMYYYYHHMISS(d.catchingTime)}>{convertDateToDDMMYYYYHHMISS(d.catchingTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.relateCr"),
                id: "relatedCr",
                width: 250,
                accessor: d => {
                    return d.relatedCr ? <span title={d.relatedCr}>{d.relatedCr}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("ttTrouble:ttTrouble.label.incidentSeverity"),
                id: "warnLevelName",
                width: 250,
                accessor: d => {
                    return d.warnLevelName ? <span title={d.warnLevelName}>{d.warnLevelName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
        ];
    }

    //start handle combo
    handleChangeSelectValuePtType = (d) => {
        this.setState({
            selectValuePtType: d,
            selectValueAlarmGroup: {},
            selectValueSubCategory: {},
            isPtTypeChange: true
        });
    }

    handleApplyCreateTime = (event, picker) => {
        this.setState({
            createTimeFrom: picker.startDate,
            createTimeTo: picker.endDate,
        }, () => {
            if (this.state.createTimeFrom && this.state.createTimeTo) {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.createdTimeFrom = this.state.createTimeFrom ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFrom.toDate()) : null;
                objectSearch.createdTimeTo = this.state.createTimeTo ? convertDateToDDMMYYYYHHMISS(this.state.createTimeTo.toDate()) : null;
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchTtTrouble();
                });
            }
        });
    }
    //end handle combo

    toggleFormSearch() {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
    }

    setDataToObject(objectSearch) {
        objectSearch.lstState = this.state.selectValueState.map(item => item.value);
        objectSearch.createdTimeFrom = this.state.createTimeFrom ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFrom.toDate()) : null;
        objectSearch.createdTimeTo = this.state.createTimeTo ? convertDateToDDMMYYYYHHMISS(this.state.createTimeTo.toDate()) : null;
        objectSearch.vendorId = this.state.selectValueVendor.value;
        objectSearch.locationId = this.state.selectValueLocation.value;
        objectSearch.impactId = this.state.selectValueImpact.value;
        objectSearch.priorityId = this.state.selectValuePriority.value;
        objectSearch.lstType = this.state.selectValuePtType.map(item => item.value);
        objectSearch.alarmGroupId = this.state.selectValueAlarmGroup.value;
        objectSearch.subCategoryId = this.state.selectValueSubCategory.value;
        objectSearch.isTickHelp = this.state.selectValueHelp.value;
        objectSearch.relatedTt = this.state.selectValueRelatedTicket.value;
        objectSearch.insertSource = this.state.selectValueInsertSource.subValue;
        objectSearch.warnLevel = this.state.selectValueWarnLevel.value;

        if (this.state.isUnit === "isCreateUnit") {
            objectSearch.searchSubUnitCreate = this.state.isCheckedUnit ? "1" : "0";
            objectSearch.createUnitId = this.state.selectValueUnit ? this.state.selectValueUnit.value : "";
            objectSearch.createUserId = this.state.selectValueResPerson.value;
            delete objectSearch.receiveUserId;
            delete objectSearch.receiveUnitId;
            delete objectSearch.searchSubUnitReceive;
            delete objectSearch.responeseUnitId;
        } else if (this.state.isUnit === "isReceiveUnit") {
            objectSearch.searchSubUnitReceive = this.state.isCheckedUnit ? "1" : "0";
            objectSearch.receiveUnitId = this.state.selectValueUnit ? this.state.selectValueUnit.value : "";
            objectSearch.receiveUserId = this.state.selectValueResPerson.value;
            delete objectSearch.createUnitId;
            delete objectSearch.createUserId;
            delete objectSearch.responeseUnitId;
            delete objectSearch.searchSubUnitCreate;
        } else {
            objectSearch.searchSubUnitReceive = this.state.isCheckedUnit ? "1" : "0";
            objectSearch.responeseUnitId = this.state.selectValueUnit ? this.state.selectValueUnit.value : "";
            objectSearch.receiveUserId = this.state.selectValueResPerson.value;
            delete objectSearch.createUnitId;
            delete objectSearch.createUserId;
            delete objectSearch.receiveUnitId;
            delete objectSearch.searchSubUnitCreate;
        }
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
        if (this.state.isFisrtSearch) {
            this.setDataToObject(objectSearch);
        }

        this.setState({
            loading: true,
            objectSearch
        }, () => {
            this.searchTtTrouble();
        });
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
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.sendMessage"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.sendMessage"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.sendMessage"));
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
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getListChat"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getListChat"));
            });
        }
    }

    handleKeyDownForm = event => {
        if(event.key === 'Enter'){
            this.setState({
                isSearchClicked: false
            });
        }
    }

    search(event, values) {
        if (this.state.isFisrtSearch) {
            this.setState({
                isFisrtSearch: false
            });
        }
        validSubmitForm(event, values, "idFormAddOrEdit");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setDataToObject(objectSearch);
        
        this.setState({
            btnSearchLoading: this.state.isSearchClicked,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchTtTrouble();
        });
    }

    callIPCC = (object) => {
        this.props.actions.callIPCC(object).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.callIPCC"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
             } else {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.callIPCC"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.callIPCC"));
            }
        });
    }

    countByState() {
        this.props.actions.countByState(this.state.objectSearch).then((response) => {
            let countByState = [];
            let i = 0;
            for (const object of response.payload.data) {
                let stateObject = null;
                for (const state of this.state.ttStateList) {
                    if (state.itemId === object.itemId) {
                        stateObject = state;
                        break;
                    }
                }
                if (stateObject && object) {
                    countByState.push({
                        name: stateObject.itemName,
                        value: object.itemValue,
                        color: colors[i]
                    });
                    if(colors.length > i) {
                        i++;
                    } else {
                        i = 0;
                    }
                }
            }
            this.setState({
                countByState
            });
        });
    }

    searchTtTrouble() {
        this.props.actions.searchTtTrouble(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            }, () => {
                this.countByState();
            });
            if(this.state.isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.search"));
        });
    }

    openPage(name, object) {
        if (name === "ADD") {
            this.setState({
                addModal: true,
                editModal: false,
                modalName: name,
                selectedData: {},
            });
        } else if (name === "EDIT") {
            this.props.actions.getDetailTtTrouble(object.troubleId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.props.actions.getConfigProperty("").then((res) => {
                        this.setState({
                            addModal: false,
                            editModal: true,
                            modalName: name,
                            selectedData: response.payload.data,
                            mapConfigProperty: res.payload.data || {}
                        });
                    }).catch((response) => {
                        toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getDetail"));
                    });
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getDetail"));
            });
        } else if (name === "CLONE") {
            this.props.actions.getDetailTtTrouble(object.troubleId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        addModal: true,
                        editModal: false,
                        modalName: name,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getDetail"));
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
                        this.searchTtTrouble();
                    });
                }
            });
        } else if (name === "EDIT") {
            this.setState({
                editModal: false,
                moduleName: null
            }, () => {
                if (isChange) {
                    this.searchTtTrouble();
                }
            });
        }
    }

    openInfoCallPopup = (object) => {
        this.setState({
            isOpenInfoCallPopup: true,
            selectedData: object
        });
    }

    closeInfoCallPopup = () => {
        this.setState({
            isOpenInfoCallPopup: false,
            selectedData: {}
        });
    }

    clearSearchConditions() {
        this.setState({
            selectValuePtType: [],
            selectValueVendor: {},
            selectValueImpact: {},
            selectValueSubCategory: {},
            selectValueState: [],
            selectValuePriority: {},
            selectValueInsertSource: {},
            selectValueRelatedTicket: {},
            selectValueAlarmGroup: {},
            selectValueWarnLevel: {},
            selectValueResPerson: {},
            selectValueLocation: {},
            selectValueHelp: {},
            selectValueUnit: { value: JSON.parse(localStorage.user).deptId },
            isCheckedUnit: false,
            createTimeFrom: moment().subtract(1, 'month'),
            createTimeTo: moment().set({hour:23,minute:59,second:59,millisecond:0}),
            isUnit: "isResponsibleUnit"
        }, () => {
            // this.myFormRef.reset();
            try {
                this.myFormRef._inputs.searchAll.value = "";
                document.getElementById("searchAll").value = "";
                document.getElementById("input-filter-troubleCode").value = "";
                document.getElementById("input-filter-troubleName").value = "";
                document.getElementById("input-filter-remainTime").value = "";
            } catch (error) {
                
            }
        });
    }

    handleChangeColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    confirmDelete(object) {
        confirmAlertDelete(this.props.t("ttTrouble:ttTrouble.message.confirmDelete", { troubleCode: object.troubleCode }),
        () => {
            this.props.actions.deleteTtTrouble(object.troubleId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchTtTrouble();
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.delete"));
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.delete"));
            });
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("tt", "TROUBLES", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    setOpenPanel() {
        this.setState({
            openPanel: !this.state.openPanel
        });
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchTt");
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        //list item
        const { vendorList, ttImpactList, ptSubCatList, warnLevelList, alarmGroupList } = this.state;
        const objectSearch = {};
        const pieStateLabels = [], pieStateData = [], pieStateColor = [];
        for (const state of this.state.countByState) {
            pieStateLabels.push(state.name);
            pieStateData.push(state.value);
            pieStateColor.push(state.color);
        }
        return (
            <CustomCSSTransition
                isVisible={this.state.addModal || this.state.editModal}
                content={
                    this.state.addModal ?
                    <TtTroubleAdd
                        closePage={this.closePage}
                        parentState={this.state} /> :
                    <TtTroubleEdit
                        closePage={this.closePage}
                        parentState={this.state} />
            }>
                <div>
                    <AvForm id= "idFormSearchTt" onKeyDown={this.handleKeyDownForm} onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch} ref={el => this.myFormRef = el}>
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
                                                        <FormGroup>
                                                            <div>
                                                                <Label style={{ fontWeight: '500' }}>{t("ttTrouble:ttTrouble.label.searchBy")}</Label>
                                                            </div>
                                                            <ButtonGroup>
                                                                <Button color="outline-info" onClick={() => this.setState({ isUnit: "isCreateUnit", selectValueState: [{value: '1'}, {value: '4'}, {value: '6'}, {value: '9'}] })} active={this.state.isUnit === "isCreateUnit"}>
                                                                    {t("ttTrouble:ttTrouble.label.createUnit")}
                                                                </Button>
                                                                <Button color="outline-info" onClick={() => this.setState({ isUnit: "isReceiveUnit", selectValueState: [{value: '3'}, {value: '7'}, {value: '6'}, {value: '5'}, {value: '8'}] })} active={this.state.isUnit === "isReceiveUnit"}>
                                                                    {t("ttTrouble:ttTrouble.label.receiveUnit")}
                                                                </Button>
                                                                <Button color="outline-info" onClick={() => this.setState({ isUnit: "isResponsibleUnit", selectValueState: [] })} active={this.state.isUnit === "isResponsibleUnit"}>
                                                                    {t("ttTrouble:ttTrouble.label.responsibleUnit")}
                                                                </Button>
                                                            </ButtonGroup>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAutocomplete 
                                                            name={"unitId"}
                                                            label={t("ttTrouble:ttTrouble.label.unit")}
                                                            placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.unit")}
                                                            isRequired={false}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueUnit: d, selectValueResPerson: {} })}
                                                            selectValue={this.state.selectValueUnit}
                                                            moduleName={"UNIT"} 
                                                            isOnlyInputSelect={false}
                                                            isHasCheckbox={true}
                                                            nameCheckbox={"checkProcessUnit"}
                                                            isCheckedCheckbox={this.state.isCheckedUnit}
                                                            handleOnChangeCheckbox={() => this.setState({ isCheckedUnit: !this.state.isCheckedUnit })}
                                                            titleCheckbox={this.props.t("ttTrouble:ttTrouble.label.checkSubUnit")}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelect
                                                            name={this.state.isUnit === "isCreateUnit" ? "createUserId" : "receiveUserId"}
                                                            label={this.state.isUnit === "isCreateUnit" ? t("ttTrouble:ttTrouble.label.creator") : t("ttTrouble:ttTrouble.label.responsiblePerson")}
                                                            isRequired={false}
                                                            moduleName={"USERS"}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueResPerson: d })}
                                                            selectValue={this.state.selectValueResPerson}
                                                            parentValue={(this.state.selectValueUnit && this.state.selectValueUnit.value) ? this.state.selectValueUnit.value : ""}
                                                            isHasChildren={(this.state.selectValueUnit && this.state.selectValueUnit.value) ? this.state.isCheckedUnit : true}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomMultiSelectLocal
                                                            name={"lstType"}
                                                            label={t("ttTrouble:ttTrouble.label.domain")}
                                                            isRequired={false}
                                                            options={this.state.ptTypeList}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={this.handleChangeSelectValuePtType}
                                                            selectValue={this.state.selectValuePtType}
                                                            isOnlyInputSelect={false}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"alarmGroupId"}
                                                            label={t("ttTrouble:ttTrouble.label.incidentGroup")}
                                                            isRequired={false}
                                                            options={alarmGroupList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueAlarmGroup: d })}
                                                            selectValue={this.state.selectValueAlarmGroup}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"impactId"}
                                                            label={t("ttTrouble:ttTrouble.label.impact")}
                                                            isRequired={false}
                                                            options={ttImpactList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueImpact: d })}
                                                            selectValue={this.state.selectValueImpact}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"subCategoryId"}
                                                            label={t("ttTrouble:ttTrouble.label.subCategory")}
                                                            isRequired={false}
                                                            options={ptSubCatList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueSubCategory: d })}
                                                            selectValue={this.state.selectValueSubCategory}
                                                        />
                                                    </Col>
                                                    {/* <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"notFinishBefore"}
                                                            label={t("ttTrouble:ttTrouble.label.existTroubleBeforeDate")}
                                                            isRequired={false}
                                                            selected={this.state.notFinishBefore}
                                                            handleOnChange={(d) => this.setState({ notFinishBefore: d })}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                        />
                                                    </Col> */}
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"isTickHelp"}
                                                            label={t("ttTrouble:ttTrouble.label.help")}
                                                            isRequired={false}
                                                            options={[
                                                                { itemId: 1, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.help.isTickHelpAll") },
                                                                { itemId: 2, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.help.isTickHelpNot") },
                                                                { itemId: 3, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.help.isTickHelp") }
                                                            ]}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueHelp: d })}
                                                            selectValue={this.state.selectValueHelp}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAutocomplete 
                                                            name={"locationId"}
                                                            label={t("ttTrouble:ttTrouble.label.location")}
                                                            placeholder={t("ttTrouble:ttTrouble.placeholder.location")}
                                                            isRequired={false}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={(d) => this.setState({selectValueLocation: d})}
                                                            selectValue={this.state.selectValueLocation}
                                                            moduleName={"REGION"} 
                                                            isHasCheckbox={false}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"insertSource"}
                                                            label={t("ttTrouble:ttTrouble.label.insertSource")}
                                                            isRequired={false}
                                                            options={this.state.insertSourceList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueInsertSource: d })}
                                                            selectValue={this.state.selectValueInsertSource}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"vendorId"}
                                                            label={t("ttTrouble:ttTrouble.label.vendor")}
                                                            isRequired={false}
                                                            options={vendorList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueVendor: d })}
                                                            selectValue={this.state.selectValueVendor}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"relatedTt"}
                                                            label={t("ttTrouble:ttTrouble.label.relatedTicket")}
                                                            isRequired={false}
                                                            options={[
                                                                { itemId: 1, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.related.child") },
                                                                { itemId: 2, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.related.father") },
                                                                { itemId: 3, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.related.not") }
                                                            ]}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueRelatedTicket: d })}
                                                            selectValue={this.state.selectValueRelatedTicket}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"warnLevel"}
                                                            label={t("ttTrouble:ttTrouble.label.incidentSeverity")}
                                                            isRequired={false}
                                                            options={warnLevelList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueWarnLevel: d })}
                                                            selectValue={this.state.selectValueWarnLevel}
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
                                                title={t("ttTrouble:ttTrouble.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ttTrouble:ttTrouble.button.add")}
                                                    onClick={() => this.openPage("ADD")}><i className="fa fa-plus"></i>
                                                </Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-2"
                                                    title={t("ttTrouble:ttTrouble.button.export")}
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    onClick={() => this.onExport()}>
                                                    <i className="fa fa-download"></i>
                                                </LaddaButton>
                                                <Button color="link" className="p-0 card-header-action btn-setting mr-2 btn-custom" onClick={() => this.setOpenPanel()} title={t("common:common.title.info")}>
                                                    <i className="icon-pie-chart"></i>
                                                </Button>
                                                <SettingTable
                                                    columns={columns}
                                                    onChange={this.handleChangeColumnsTable}
                                                    moduleName={"TT_TROUBLE_LIST"}
                                                />
                                            </div>
                                        </CardHeader>
                                        <SlidingPanel
                                            type={'right'}
                                            isOpen={this.state.openPanel}
                                            size={20}
                                            backdropClicked={() => this.setOpenPanel()}
                                        >
                                            <ListGroup className="list-group-accent" tag={'div'}>
                                                <div className="pt-1 pb-1" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e4e7ea' }}>
                                                    <Pie
                                                        data={{
                                                            labels: pieStateLabels,
                                                            datasets: [
                                                                {
                                                                    data: pieStateData,
                                                                    backgroundColor: pieStateColor,
                                                                    hoverBackgroundColor: pieStateColor
                                                                }
                                                            ],
                                                        }}
                                                        options={{
                                                            legend: {
                                                                display: false
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {this.state.countByState.map((state, idx) => {
                                                        return <ListGroupItem key={idx} action tag="a" href="javascript:void(0)" className={"list-group-item-divider"} style={{ borderLeft: '4px solid ' + state.color }}>
                                                                    <Row className="pt-2 pb-2">
                                                                        <span style={{ marginLeft: '6px' }} title={state.name}>{state.name}</span>
                                                                        <Badge style={{ position: 'absolute', right: '10px', marginTop: '2px', color: '#23282c', backgroundColor: state.color, fontSize: '12px' }} >{state.value}</Badge>
                                                                    </Row>
                                                                </ListGroupItem>
                                                    },
                                                )}
                                            </ListGroup>
                                        </SlidingPanel>
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
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </AvForm>
                    <TtTroubleInfoCallPopup
                        parentState={this.state}
                        closePopup={this.closeInfoCallPopup} />
                    <TtTroubleChatPopup
                        parentState={this.state}
                        closePopup={this.closePopupChat} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleList));