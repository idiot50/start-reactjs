import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as WoCdGroupManagementActions from '../cdGroupManagement/WoCdGroupManagementActions';
import WoManagementAdd from "./WoManagementAdd";
import { convertDateToDDMMYYYYHHMISS, invalidSubmitForm, validSubmitForm, confirmAlertDelete } from "../../../containers/Utils/Utils";
import moment from 'moment';
import { CustomAvField, CustomDateTimeRangePicker, CustomReactTableSearch, CustomSelect, CustomSelectLocal, CustomMultiSelect, CustomMultiSelectLocal, CustomDatePicker, SettingTableLocal, SearchBar, CustomAutocomplete, CustomInputFilter, CustomAppSwitch, ImportModal, SettingTable, MoreButtonTable, CustomInputPopup } from '../../../containers/Utils';
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import WoManagementEdit from './WoManagementEdit';
import WoManagementExportFileTestServicePopup from './WoManagementExportFileTestServicePopup';
import WoManagementInfoCallPopup from './WoManagementInfoCallPopup';
import WoManagementAddCdGroupPopup from './WoManagementAddCdGroupPopup';
import WoManagementCompleteWoSPMPopup from './WoManagementCompleteWoSPMPopup';

class WoManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormSearch = this.toggleFormSearch.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.openPage = this.openPage.bind(this);
        this.closePage = this.closePage.bind(this);
        this.searchWoManagement = this.searchWoManagement.bind(this);
        this.handleKeyDownForm = this.handleKeyDownForm.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.onExport = this.onExport.bind(this);

        this.state = {
            collapseFormSearch: false,
            isSearchClicked: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            isOpenCdGroupPopup: false,
            isOpenWoSpmPopup: false,
            //Object Search
            isFirstSearchTable: true,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            //AddOrEditPage
            isFirstSearch: true,
            modalName: null,
            //page
            addEditModal: false,
            processModal: false,
            //wo
            statusList: [],
            actionList: [],
            woCategorysList: [],
            priorityList: [],
            cdGroup: [],
            isCheckedUnit: false,
            woNeedsSupport: false,
            dataChecked: [],
            isOpenExportFileTestServicePopup: false,
            isOpenInfoCallPopup: false,
            objConfigSearch: {},
            //select
            selectValueWoType: {},
            selectValueStatus: [],
            selectValueAction: {},
            selectValuePriority: {},
            selectValueReceiveUnit: {},
            selectValueSystem: {},
            selectValueWoTypeGroup: {},
            selectValueResult: {},
            selectValueWoCategorys: [],
            isCheckedReceiveUnit: false,
            createTimeFrom: moment().subtract(15, 'days'),
            createTimeTo: moment().add(1, 'days'),
            completeTimeFrom: null,
            completeTimeTo: null,
            endTimeFrom: null,
            endTimeTo: null,
            startTimeFrom: null,
            startTimeTo: null,
            mapConfigProperty: [],
            isGetPriority: false
        };
    }

    async componentDidMount() {
        this.getListWoType();
        this.props.actions.getItemMaster("WO_SYSTEM_ARRAY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("WO_GROUP_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("WO_RESULT_STATUS", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("WO_CD_GROUP_TYPE", "itemId", "itemName", "1", "3");
        try {
            const mapConfigProperty = await this.props.actions.getConfigProperty("").then((response) => {
                return response.payload.data;
            }).catch((response) => {
                return [];
            });
            this.setState({
                statusList: this.buildCboStatus(),
                actionList: this.buildCboAction(),
                woCategorysList: this.buildWoCategorys(),
                selectValueWoCategorys: [1,2,3].map(item => {return {value: item}}),
                mapConfigProperty
            }, () => {
                this.getConfigSearch();
            });
        } catch (error) {
            this.setState({
                statusList: this.buildCboStatus(),
                actionList: this.buildCboAction(),
                woCategorysList: this.buildWoCategorys(),
                selectValueWoCategorys: [1,2,3].map(item => {return {value: item}})
            }, () => {
                this.getConfigSearch();
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectValueWoType.value !== this.state.selectValueWoType.value) {
            this.setState({
                priorityList: []
            });
        }
        if (this.state.isGetPriority) {
            this.props.actions.getPriorityByWoTypeId(this.state.selectValueWoType.value ? this.state.selectValueWoType.value : "").then(response => {
                this.setState({
                    priorityList: response.payload.data.map(item => {return {itemId: item.priorityId, itemName: item.priorityName}})
                });
            });
            this.setState({
                isGetPriority: false
            });
        }
    }

    buildCboAction() {
        return [
            {itemId: "EXPORT_FILE_TEST_SERVICE", itemName: this.props.t("woManagement:woManagement.dropdown.action.exportFileTestService")},
            {itemId: "COMPLETE_WO_SPM", itemName: this.props.t("woManagement:woManagement.dropdown.action.completeWoSPM")},
            {itemId: "DELETE_WO", itemName: this.props.t("woManagement:woManagement.dropdown.action.delete")}
        ];
    }

    buildWoCategorys() {
        return [
            {itemId: 1, itemName: this.props.t("woManagement:woManagement.dropdown.workOrderCategories.woCreateByUser")},
            {itemId: 2, itemName: this.props.t("woManagement:woManagement.dropdown.workOrderCategories.woNeedCoordination")},
            {itemId: 3, itemName: this.props.t("woManagement:woManagement.dropdown.workOrderCategories.woNeedPerform")},
        ];
    }

    buildCboStatus() {
        return [
            {itemId: 0, itemName: this.props.t("woManagement:woManagement.label.unassigned")},
            {itemId: 1, itemName: this.props.t("woManagement:woManagement.label.assigned")},
            {itemId: 2, itemName: this.props.t("woManagement:woManagement.label.ftReject")},
            {itemId: 3, itemName: this.props.t("woManagement:woManagement.label.dispatch")},
            {itemId: 4, itemName: this.props.t("woManagement:woManagement.label.accept")},
            {itemId: 5, itemName: this.props.t("woManagement:woManagement.label.inprocess")},
            {itemId: 6, itemName: this.props.t("woManagement:woManagement.label.closeFT")},
            {itemId: 7, itemName: this.props.t("woManagement:woManagement.label.draft")},
            {itemId: 8, itemName: this.props.t("woManagement:woManagement.label.closeCD")},
            {itemId: 9, itemName: this.props.t("woManagement:woManagement.label.pending")},
            {itemId: 10, itemName: this.props.t("woManagement:woManagement.label.cdReject")},
        ];
    }

    checkExistProperty(value, key) {
        if (this.state.mapConfigProperty) {
            try {
                const arrProperty = this.state.mapConfigProperty[key].split(",");
                return arrProperty.includes(value + "");
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    checkCdRject = (object) => {
        let result = false;
        if (object.status === 2) {
            if (object.ftId === null || object.ftId === "") {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }

    checkUserIsCd(userName, cdId, listCdByGroup) {
        let checkUserCD = false;
        if (listCdByGroup !== null && listCdByGroup.length > 0) {
            for (const eCdInGroup of listCdByGroup) {
                if (eCdInGroup.username === userName) {
                    checkUserCD = true;
                    break;
                }
            }
        }
        return checkUserCD;
    }

    buildTableColumns() {
        return [
            {
                Header: this.props.t("woManagement:woManagement.label.action"),
                id: "action",
                sortable: false,
                fixed: "left",
                width: 180,
                accessor: d => {
                    let html = <div></div>;
                    let disabled = false;
                    if (!(JSON.parse(localStorage.user).userName === d.createPersonName && ((d.status === 0 || this.checkCdRject(d)) || d.status === 7))) {
                        disabled = true;
                    }
                    if (this.checkExistProperty(d.woTypeId, "WO.TYPE.CHECK.QLTS") && (d.status === 1 || d.status === 3)) {
                        if (this.checkUserIsCd(JSON.parse(localStorage.user).userName, d.cdId, d.listCd)) {
                            disabled = false;
                        }
                    }
                    let color = "";
                    if (d.status === 8) {
                        color = "#39b2d5";
                    } else if (d.status === 2) {
                        color = "#8c8c8c";
                    }
                    if (d.status === 8) {
                        if (new Date(d.finishTime).getTime() > new Date(d.endTime).getTime()) {
                            color = "#ff0000";
                        }
                    } else {
                        if (new Date().getTime() > new Date(d.endTime).getTime()) {
                            color = "#ff0000";
                        }
                    }
                    if (d.timeOver !== null && d.timeOver !== undefined) {
                        const timeOverdue = new Date(d.endTime).getTime() - d.timeOver*60*60*1000;
                        if (new Date().getTime() >= timeOverdue && new Date().getTime() <= new Date(d.endTime).getTime()) {
                            color = "#f78625";
                        }
                    }
                    html = <div className="text-center">
                        <span>
                            <span className="span-icon-table icon mr-1" style={color === "" ? {} : { color: color }}><i className={color === "" ? "fa fa-flag-o" : "fa fa-flag"}></i></span>
                        </span>
                        <span title={this.props.t("common:common.button.edit")}>
                            <Button type="button" size="sm" className="btn-info icon mr-1" disabled={disabled} onClick={() => this.openPage("EDIT", d)}><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.processingWork")}>
                            <Button type="button" size="sm" className="btn-info icon mr-1" onClick={() => this.openPage("PROCESS", d)}><i className="fa fa-gear"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openPage("COPY", d)}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1"><i className="fa fa-copy"></i></Button>
                        </span>
                        <MoreButtonTable targetId={d.woId + ""}>
                            <span title={this.props.t("woManagement:woManagement.button.phone")}>
                                <Button type="button" size="sm" className="btn-secondary icon mr-1" onClick={() => this.callIPCC(d)}><i className="fa fa-phone"></i></Button>
                            </span>
                            <span title={this.props.t("woManagement:woManagement.button.infoCall")}>
                                <Button type="button" size="sm" className="btn-secondary icon" onClick={() => this.openInfoCallPopup(d)}><i className="fa fa-list-ul"></i></Button>
                            </span>
                        </MoreButtonTable>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"action"}
                        label={""}
                        isRequired={false}
                        options={this.state.actionList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleChangeAction}
                        selectValue={this.state.selectValueAction}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.woStatus"),
                id: "statusName",
                minWidth: 250,
                accessor: d => <span title={d.statusName}>{d.statusName}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomMultiSelectLocal
                        name={"statusSearchWeb"}
                        label={""}
                        isRequired={false}
                        options={this.state.statusList}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={(d) => this.setState({ selectValueStatus: d })}
                        selectValue={this.state.selectValueStatus}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.woName"),
                id: "woContent",
                minWidth: 200,
                accessor: d => {
                    return d.woContent ? <span title={d.woContent}>{d.woContent}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    let woContent = (this.state.objConfigSearch.woContent && this.state.objConfigSearch.woContent.value) ? this.state.objConfigSearch.woContent.value : "";
                    return (
                        <CustomInputFilter name="woContent" value={woContent} />
                    );
                }
            },
            {
                Header: this.props.t("woManagement:woManagement.label.woCode"),
                id: "woCode",
                minWidth: 200,
                accessor: d => {
                    return d.woCode ? <span title={d.woCode}>{d.woCode}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    let woCode = (this.state.objConfigSearch.woCode && this.state.objConfigSearch.woCode.value) ? this.state.objConfigSearch.woCode.value : "";
                    return (
                        <CustomInputFilter name="woCode" value={woCode} />
                    );
                }
            },
            {
                Header: this.props.t("woManagement:woManagement.label.woType"),
                id: "woTypeName",
                minWidth: 200,
                accessor: d => {
                    return d.woTypeName ? <span title={d.woTypeName}>{d.woTypeName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    const { response } = this.props;
                    const woTypeList = (response.woManagement.getListWoTypeDTO && response.woManagement.getListWoTypeDTO.payload) ? response.woManagement.getListWoTypeDTO.payload.data : [];
                    return (
                    <CustomSelectLocal
                        name={"woTypeId"}
                        label={""}
                        isRequired={false}
                        messageRequire={this.props.t("woManagement:woManagement.message.required.woType")}
                        options={woTypeList.map(item => {return {itemId: item.woTypeId, itemName: item.woTypeName, itemCode: item.woTypeCode}})}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={(d) => this.setState({ selectValueWoType: d, isGetPriority: true })}
                        selectValue={this.state.selectValueWoType}
                        isOnlyInputSelect={true}
                    />
                    // <CustomSelect
                    //     name={"woTypeId"}
                    //     label={""}
                    //     isRequired={false}
                    //     moduleName={"GNOC_WO_TYPE"}
                    //     closeMenuOnSelect={true}
                    //     handleItemSelectChange={(d) => this.setState({ selectValueWoType: d, isGetPriority: true })}
                    //     selectValue={this.state.selectValueWoType}
                    //     isOnlyInputSelect={true}
                    //     parentValue={(this.state.selectValueWoTypeGroup && this.state.selectValueWoTypeGroup.value) ? this.state.selectValueWoTypeGroup.value : ""}
                    // />
                );
            }
            },
            {
                Header: this.props.t("woManagement:woManagement.label.priority"),
                id: "priorityName",
                minWidth: 200,
                accessor: d => {
                    return d.priorityName ? <span title={d.priorityName}>{d.priorityName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"priorityId"}
                        label={""}
                        isRequired={false}
                        options={this.state.priorityList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={(d) => this.setState({ selectValuePriority: d })}
                        selectValue={this.state.selectValuePriority}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.createTime"),
                id: "createDate",
                minWidth: 200,
                accessor: d => {
                    return d.createDate ? <span title={convertDateToDDMMYYYYHHMISS(d.createDate)}>{convertDateToDDMMYYYYHHMISS(d.createDate)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"createDate"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.createTimeFrom}
                        endDate={this.state.createTimeTo}
                        handleApply={this.handleApplyCreateTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.remainTime"),
                id: "remainTime",
                minWidth: 200,
                accessor: d => {
                    return d.remainTime ? <span title={d.remainTime}>{d.remainTime}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.createUnitName"),
                id: "createUnitName",
                minWidth: 200,
                accessor: d => {
                    return d.createUnitName ? <span title={d.createUnitName}>{d.createUnitName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete 
                        name={"createUnitId"}
                        label={""}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={(d) => this.setState({ selectValueCreateUnit: d })}
                        selectValue={this.state.selectValueCreateUnit}
                        moduleName={"UNIT"} 
                        isOnlyInputSelect={true}
                        isHasCheckbox={false}
                    />
                )
            },
            //chưa biết
            // {
            //     Header: this.props.t("woManagement:woManagement.label.callRatio"),
            //     id: "callRatio",
            //     minWidth: 200,
            //     accessor: d => {
            //         return d.callRatio ? <span title={d.callRatio}>{d.callRatio}</span>
            //         : <span>&nbsp;</span>
            //     },
            //     Filter: ({ filter, onChange }) => (
            //         <div style={{height: '2.7em'}}></div>
            //     )
            // },
            {
                Header: this.props.t("woManagement:woManagement.label.subscribers"),
                id: "accountIsdn",
                minWidth: 200,
                accessor: d => {
                    return d.accountIsdn ? <span title={d.accountIsdn}>{d.accountIsdn}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    let accountIsdn = (this.state.objConfigSearch.accountIsdn && this.state.objConfigSearch.accountIsdn.value) ? this.state.objConfigSearch.accountIsdn.value : "";
                    return (
                        <CustomInputFilter name="accountIsdn" value={accountIsdn} />
                    );
                }
            },
            {
                Header: this.props.t("woManagement:woManagement.label.woParent"),
                id: "parentName",
                minWidth: 200,
                accessor: d => {
                    return d.parentName ? <span title={d.parentName}>{d.parentName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    let parentName = (this.state.objConfigSearch.parentName && this.state.objConfigSearch.parentName.value) ? this.state.objConfigSearch.parentName.value : "";
                    return (
                        <CustomInputFilter name="parentName" value={parentName} />
                    );
                }
            },
            {
                Header: this.props.t("woManagement:woManagement.label.woSystem"),
                id: "woSystem",
                minWidth: 200,
                accessor: d => {
                    return d.woSystem ? <span title={d.woSystem}>{d.woSystem}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.systemCode"),
                id: "woSystemId",
                minWidth: 200,
                accessor: d => {
                    return d.woSystemId ? <span title={d.woSystemId}>{d.woSystemId}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    let woSystemId = (this.state.objConfigSearch.woSystemId && this.state.objConfigSearch.woSystemId.value) ? this.state.objConfigSearch.woSystemId.value : "";
                    return (
                        <CustomInputFilter name="woSystemId" value={woSystemId} />
                    );
                }
            },
            {
                Header: this.props.t("woManagement:woManagement.label.createPersonName"),
                id: "createPersonName",
                minWidth: 200,
                accessor: d => {
                    return d.createPersonName ? <span title={d.createPersonName}>{d.createPersonName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.cdGroup"),
                id: "cdName",
                minWidth: 200,
                accessor: d => {
                    return d.cdName ? <span title={d.cdName}>{d.cdName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.ftName"),
                id: "ftName",
                minWidth: 200,
                accessor: d => {
                    return d.ftName ? <span title={d.ftName}>{d.ftName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => {
                    let ftName = (this.state.objConfigSearch.ftName && this.state.objConfigSearch.ftName.value) ? this.state.objConfigSearch.ftName.value : "";
                    return (
                        <CustomInputFilter name="ftName" value={ftName} />
                    );
                }
            },
            {
                Header: this.props.t("woManagement:woManagement.label.woStatusId"),
                id: "status",
                minWidth: 200,
                accessor: d => {
                    return d.status ? <span title={d.status}>{d.status}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.priorityId"),
                id: "priorityId",
                minWidth: 200,
                accessor: d => {
                    return d.priorityId ? <span title={d.priorityId}>{d.priorityId}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.startTime"),
                id: "startTime",
                minWidth: 200,
                accessor: d => {
                    return d.startTime ? <span title={convertDateToDDMMYYYYHHMISS(d.startTime)}>{convertDateToDDMMYYYYHHMISS(d.startTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.endTime"),
                id: "endTime",
                minWidth: 200,
                accessor: d => {
                    return d.endTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endTime)}>{convertDateToDDMMYYYYHHMISS(d.endTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.closedTime"),
                id: "finishTime",
                minWidth: 200,
                accessor: d => {
                    return d.finishTime ? <span title={convertDateToDDMMYYYYHHMISS(d.finishTime)}>{convertDateToDDMMYYYYHHMISS(d.finishTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.resultName"),
                id: "resultName",
                minWidth: 200,
                accessor: d => {
                    return d.resultName ? <span title={d.resultName}>{d.resultName}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.comments"),
                id: "comments",
                minWidth: 200,
                accessor: d => {
                    return d.comments ? <span title={d.comments}>{d.comments}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.worklog"),
                id: "woWorklogContent",
                minWidth: 200,
                accessor: d => {
                    return d.woWorklogContent ? <span title={d.woWorklogContent}>{d.woWorklogContent}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.ftCompletedTime"),
                id: "completedTime",
                minWidth: 200,
                accessor: d => {
                    return d.completedTime ? <span title={convertDateToDDMMYYYYHHMISS(d.completedTime)}>{convertDateToDDMMYYYYHHMISS(d.completedTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.ftAcceptedTime"),
                id: "ftAcceptedTime",
                minWidth: 200,
                accessor: d => {
                    return d.ftAcceptedTime ? <span title={convertDateToDDMMYYYYHHMISS(d.ftAcceptedTime)}>{convertDateToDDMMYYYYHHMISS(d.ftAcceptedTime)}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.description"),
                id: "woDescription",
                minWidth: 200,
                accessor: d => {
                    return d.woDescription ? <span title={d.woDescription}>{d.woDescription}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: this.props.t("woManagement:woManagement.label.stationCode"),
                id: "stationCode",
                minWidth: 200,
                accessor: d => {
                    return d.stationCode ? <span title={d.stationCode}>{d.stationCode}</span>
                    : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            }
        ];
    }

    toggleFormSearch() {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
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
            this.searchWoManagement();
        });
    }

    handleKeyDownForm(event) {
        if(event.key === 'Enter'){
            this.setState({
                isSearchClicked: false
            });
        }
    }

    setDataToObject(object) {
        object.woCode = object.woCode ? object.woCode.trim() : "";
        object.woContent = object.woContent ? object.woContent.trim() : "";
        object.planCode = object.planCode ? object.planCode.trim() : "";
        object.statusSearchWeb = this.state.selectValueStatus.length > 0 ? this.state.selectValueStatus.map(item => item.value).join(",") : "-1";
        object.startTimeFrom = this.state.createTimeFrom ? this.state.createTimeFrom.toDate() : null;
        object.startTimeTo = this.state.createTimeTo ? this.state.createTimeTo.toDate() : null;
        object.isCreated = this.state.selectValueWoCategorys.some(item => item.value === 1);
        object.isCd = this.state.selectValueWoCategorys.some(item => item.value === 2);
        object.isFt = this.state.selectValueWoCategorys.some(item => item.value === 3);
        object.woSystem = this.state.selectValueSystem.value || null;
        object.woSystemId = object.woSystemId ? object.woSystemId.trim() : "";
        object.createPersonName = object.createPersonName ? object.createPersonName.trim() : "";
        object.ftName = object.ftName ? object.ftName.trim() : "";
        object.parentName = object.parentName ? object.parentName.trim() : "";
        object.accountIsdn = object.accountIsdn ? object.accountIsdn.trim() : "";
        object.woTypeGroupId = this.state.selectValueWoTypeGroup.label === "OTHER" ? "-1" : this.state.selectValueWoTypeGroup.value;
        object.woTypeId = this.state.selectValueWoType.value || null;
        object.result = this.state.selectValueResult.value || null;
        object.priorityId = this.state.selectValuePriority.value || null;
        object.startDateFrom = this.state.startTimeFrom || null;
        object.startDateTo = this.state.startTimeTo || null;
        object.endTimeFrom = this.state.endTimeFrom || null;
        object.endTimeTo = this.state.endTimeTo || null;
        object.completeTimeFrom = this.state.completeTimeFrom || null;
        object.completeTimeTo = this.state.completeTimeTo || null;
        object.createUnitId = this.state.selectValueCreateUnit ? this.state.selectValueCreateUnit.value : null;
        object.processUnitId = this.state.selectValueReceiveUnit ? this.state.selectValueReceiveUnit.value : null;
        object.isContainChildUnit = this.state.isCheckedReceiveUnit;
        object.isNeedSupport = this.state.woNeedsSupport;
        object.userId = JSON.parse(localStorage.user).userID;
        object.cdIdList = this.state.cdGroup.map(item => item.woGroupId);
    }

    search(event, values) {
        if (this.state.startTimeFrom > this.state.startTimeTo) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.startTimeFrom"));
            return;
        }
        if (this.state.endTimeFrom > this.state.endTimeTo) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.endTimeFrom"));
            return;
        }
        if (this.state.completeTimeFrom > this.state.completeTimeTo) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.completeTimeFrom"));
            return;
        }
        if (Math.floor((this.state.createTimeTo.toDate() - this.state.createTimeFrom.toDate())/1000) > 90*24*60*60) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.searchDateNotOver", {day: 90}));
            return;
        }
        validSubmitForm(event, values, "idFormSearch");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        this.setDataToObject(objectSearch);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: this.state.isSearchClicked,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoManagement();
        });
    }

    searchWoManagement() {
        if (!this.state.isFirstSearchTable) {
            if (this.state.objectSearch.startTimeFrom && this.state.objectSearch.startTimeTo) {
                this.props.actions.searchWoManagement(this.state.objectSearch).then((response) => {
                    this.setState({
                        data: response.payload.data.data ? response.payload.data.data : [],
                        pages: response.payload.data.pages,
                        isSearchClicked: true,
                        btnSearchLoading: false,
                        loading: false
                    }, () => {
                        this.customReactTableSearch.clearChecked();
                    });
                }).catch((response) => {
                    this.setState({
                        isSearchClicked: true,
                        btnSearchLoading: false,
                        loading: false
                    });
                    toastr.error(this.props.t("woManagement:woManagement.message.error.search"));
                });
            } else {
                this.setState({
                    isSearchClicked: true,
                    btnSearchLoading: false,
                    loading: false
                });
            }
        }
    }

    confirmDelete(woManagementId, woManagementCode) {
        confirmAlertDelete(this.props.t("woManagement:woManagement.message.confirmDelete", { woManagementCode: woManagementCode }),
        () => {
            this.props.actions.deleteWoManagement(woManagementId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchWoManagement();
                    toastr.success(this.props.t("woManagement:woManagement.message.success.delete"));
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woManagement:woManagement.message.error.delete"));
            });
        });
    }

    clearSearchConditions = () => {
        this.setState({
            selectValueWoCategorys: [1,2,3].map(item => {return {value: item}}),
            selectValueSystem: {},
            selectValueStatus: [],
            selectValueCreateUnit: {},
            selectValueReceiveUnit: {},
            selectValueAction: {},
            selectValuePriority: {},
            selectValueResult: {},
            selectValueWoType: {},
            selectValueWoTypeGroup: {},
            woNeedsSupport: false,
            createTimeFrom: moment().subtract(15, 'days'),
            createTimeTo: moment().add(1, 'days'),
            startTimeFrom: null,
            startTimeTo: null,
            endTimeFrom: null,
            endTimeTo: null,
            completeTimeFrom: null,
            completeTimeTo: null,
            cdGroup: []
        }, () => {
            this.myFormRef.reset();
            try {
                document.getElementById("input-filter-woContent").value = "";
                document.getElementById("input-filter-woCode").value = "";
                document.getElementById("input-filter-accountIsdn").value = "";
                document.getElementById("input-filter-parentName").value = "";
                document.getElementById("input-filter-woSystemId").value = "";
                document.getElementById("input-filter-ftName").value = "";
            } catch (error) {
                
            }
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("wo", "WO", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    openPage(name, object) {
        if (name === "ADD") {
            this.setState({
                addEditModal: true,
                processModal: false,
                modalName: name,
                selectedData: {},
            });
        } else if (name === "EDIT") {
            this.props.actions.getDetailWoManagement(object.woId).then((response) => {
                if (response.payload && response.payload.data) {
                        this.setState({
                            processModal: false,
                            addEditModal: true,
                            modalName: name,
                            selectedData: response.payload.data,
                        });
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woManagement:woManagement.message.error.getDetail"));
            });
        } else if (name === "COPY") {
            this.props.actions.getDetailWoManagement(object.woId).then((response) => {
                if (response.payload && response.payload.data) {
                        this.setState({
                            processModal: false,
                            addEditModal: true,
                            modalName: name,
                            selectedData: response.payload.data,
                        });
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woManagement:woManagement.message.error.getDetail"));
            });
        } else if (name === "PROCESS") {
            this.props.actions.getDetailWoManagement(object.woId).then((response) => {
                if (response.payload && response.payload.data) {
                        this.setState({
                            processModal: true,
                            addEditModal: false,
                            modalName: name,
                            selectedData: response.payload.data,
                        });
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woManagement:woManagement.message.error.getDetail"));
            });
        }
    }

    closePage(name, isChange) {
        if (name === "ADD" || name === "EDIT") {
            this.setState({
                addEditModal: false,
                moduleName: null
            }, () => {
                if (isChange) {
                    if (name === "ADD" || name === "COPY") {
                        const objectSearch = Object.assign({}, this.state.objectSearch);
                        objectSearch.page = 1;
                        this.setState({
                            objectSearch
                        },() => {
                            this.customReactTableSearch.resetPage();
                            this.searchWoManagement();
                        });
                    } else {
                        this.searchWoManagement();
                    }
                }
            });
        } else if (name === "PROCESS") {
            this.setState({
                processModal: false,
                moduleName: null
            }, () => {
                if (isChange) {
                    this.searchWoManagement();
                }
            });
        }
    }

    openImportModal = () => {
        this.setState({
            importModal: true,
            client: "wo",
            moduleName: "WO"
        });
    }

    closeImportModal = () => {
        this.setState({
            importModal: false,
            client: null,
            moduleName: null
        });
    }

    openExportFileTestServicePopup = () => {
        this.setState({
            isOpenExportFileTestServicePopup: true
        });
    }

    closeExportFileTestServicePopup = () => {
        this.setState({
            isOpenExportFileTestServicePopup: false
        });
    }

    openCompleteWoSpmPopup = () => {
        let firstWo = null;
        let isOk = true;
        const lstWoDTOSearchWebs = [];
        let errorNoti = "";
        const user = JSON.parse(localStorage.user);

        const lstService = [];
        const lstInfra = [];
        const lstStation = [];

        // validate loai cong viec
        for (const item of this.state.dataChecked) {
            if (item.woSystem === "SPM") {
                // quyen FT
                if (user.userID !== item.ftId) {
                    errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.woNotOfFt");
                    isOk = false;
                    break;
                }
                // cung tram
                if (item.stationCode !== null) {
                    if (lstStation.length === 0) {
                        lstStation.push(item.stationCode);
                    } else if (!lstStation.includes(item.stationCode)) {
                        errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.station");
                        isOk = false;
                        break;
                    }
                } else {
                    errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.stationIsNotNull");
                    isOk = false;
                    break;
                }
                // cung dich vu 
                if (item.ccServiceId !== null) {
                    if (lstService.length === 0) {
                        lstService.push(item.ccServiceId);
                    } else if (!lstService.includes(item.ccServiceId)) {
                        errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.services");
                        isOk = false;
                        break;
                    }
                } else {
                    errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.ccServiceIsNotNull");
                    isOk = false;
                    break;
                }
                // cung ha tang
                if (item.infraType !== null) {
                    if (lstInfra.length === 0) {
                        lstInfra.push(item.infraType);
                    } else if (!lstInfra.includes(item.infraType)) {
                        errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.infra");
                        isOk = false;
                        break;
                    }
                } else {
                    errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.infraIsNotNull");
                    isOk = false;
                    break;
                }
                // chua qua han
                const remainTime = item.remainTime;
                if (remainTime !== null && remainTime < 0) {
                    errorNoti = item.woCode + " " + this.props.t("woManagement:woManagement.message.error.overdue");
                    isOk = false;
                    break;
                }

                if (item.status === 5) {
                    if (firstWo === null) {
                        firstWo = item;
                    }
                    lstWoDTOSearchWebs.push(item);
                } else {
                    errorNoti += item.woCode + " " + this.props.t("woManagement:woManagement.message.error.wrongStatus")
                            + ";\n";
                    isOk = false;
                    break;
                }
            } else {
                errorNoti += item.woCode + " " + this.props.t("woManagement:woManagement.message.error.wrongSystem")
                        + ";\n";
                isOk = false;
                break;
            }
        }
        if (!isOk) {
            toastr.warning(errorNoti);
            return;
        }
        // if (firstWo === null) {
        //     toastr.warning(this.props.t("woManagement:woManagement.message.required.chooseOne"));
        //     return;
        // }
        this.props.actions.getListWoDetailDTO({woId: this.state.dataChecked[0].woId}).then((response) => {
            this.setState({
                isOpenWoSpmPopup: true,
                lstWoSpm: this.state.dataChecked,
                lstDetail: response.payload.data
            });
        }).catch((response) => {
            console.error(response);
        });
    }

    closeCompleteWoSpmPopup = () => {
        this.setState({
            isOpenWoSpmPopup: false
        });
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

    //start handle select
    handleApplyCreateTime = (event, picker) => {
        this.setState({
            createTimeFrom: picker.startDate,
            createTimeTo: picker.endDate,
        });
    }

    handleChangeAction = (option) => {
        switch (option.value) {
            case "EXPORT_FILE_TEST_SERVICE":
                this.openExportFileTestServicePopup();
                break;
            case "COMPLETE_WO_SPM":
                if (this.state.dataChecked.length < 1) {
                    toastr.warning(this.props.t("woManagement:woManagement.message.required.chooseOne"));
                } else {
                    this.openCompleteWoSpmPopup();
                }
                break;
            case "DELETE_WO":
                if (this.state.dataChecked.length < 1) {
                    toastr.warning(this.props.t("woManagement:woManagement.message.required.chooseOne"));
                } else {
                    this.deleteListWo();
                }
                break;
            default:
                break;
        }
    }
    //end handle select

    deleteListWo = () => {
        for (const object of this.state.dataChecked) {
            if (object.createPersonName === JSON.parse(localStorage.user).userName) {
                // if (!(object.status === 0 || (object.status === 3 && object.parentId !== null)
                //     || (object.status === 2 && object.parentId !== null) || object.status === 7)) {
                if (object.status !== 0) {
                    toastr.error(object.woCode + ": " + this.props.t("woManagement:woManagement.message.error.deleteNotCdAccept"));
                    return;
                }
            //     if (eSelectecIds.getStatus().equals(Constants.WO_STATUS.UNASSIGNED)) {
            //         // WO la unassigned va chua tung duoc tiep nhan
            //         WoHistoryDTO searchReject = new WoHistoryDTO();
            //         searchReject.setNewStatus(Constants.WO_STATUS.REJECT);
            //         searchReject.setWoId(eSelectecIds.getWoId());
            //         List<WoHistoryDTO> listHistoryReject = WoHistoryServiceImpl.getInstance()//
            //                 .getListWoHistoryDTO(searchReject, 0, Integer.MAX_VALUE, "", "woHistoryId");
            //         if (listHistoryReject != null && !listHistoryReject.isEmpty()) {
            //             toastr.error(this.props.t("woManagement:woManagement.message.error.deleteNotCdAccept"));
            //             return;
            //         }
            //     }
    
                // khong cho xoa WO KTTS
                if (this.checkExistProperty(object.woTypeId, "WO.TYPE.CHECK.QLTS")) {
                    toastr.error(object.woCode + ": " + this.props.t("woManagement:woManagement.message.error.deleteWoKTTS"));
                    return;
                }
            } else {
                toastr.error(object.woCode + ": " +this.props.t("woManagement:woManagement.message.error.deleteRole"));
                return;
            }
        }
        confirmAlertDelete(this.props.t("woManagement:woManagement.message.confirmDelete"),
        () => {
            this.props.actions.deleteWoManagement(this.state.dataChecked).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.customReactTableSearch.clearChecked();
                    this.searchWoManagement();
                    toastr.success(this.props.t("woManagement:woManagement.message.success.delete"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.delete"));
                }
            }).catch((response) => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.delete"));
                }
            });
        });
    }

    callIPCC = (object) => {
        this.props.actions.callIPCC(Object.assign(object, {userCall: JSON.parse(localStorage.user).userName})).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("woManagement:woManagement.message.success.callIPCC"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
             } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.callIPCC"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("woManagement:woManagement.message.error.callIPCC"));
            }
        });
    }

    getConfigSearch = () => {
        this.props.actions.getListSearchConfigUser({ funcKey: "searchWO" }).then((response) => {
            let objConfigSearch = {};
            if (response.payload.data.length > 0) {
                for (const obj of response.payload.data) {
                    objConfigSearch[obj.fieldName] = { id: obj.searchConfigUserId, value: obj.fieldValue };
                }
            } else {
                objConfigSearch = this.buildSearchConfigDefault();
            }
            this.setState({
                objConfigSearch,
                selectValueStatus: this.state.statusList.filter(item => (objConfigSearch.status.value ? objConfigSearch.status.value.split(",") : []).includes(item.itemId + "")).map(item => {return {value: item.itemId}}) || [],
                selectValueCreateUnit: objConfigSearch.createUnit.value ? JSON.parse(objConfigSearch.createUnit.value) : {},
                completeTimeFrom: objConfigSearch.completeTimeFrom.value ? new Date(objConfigSearch.completeTimeFrom.value) : null,
                completeTimeTo: objConfigSearch.completeTimeTo.value ? new Date(objConfigSearch.completeTimeTo.value) : null,
                startTimeFrom: objConfigSearch.startTimeFrom.value ? new Date(objConfigSearch.startTimeFrom.value) : null,
                startTimeTo: objConfigSearch.startTimeTo.value ? new Date(objConfigSearch.startTimeTo.value) : null,
                endTimeFrom: objConfigSearch.endTimeFrom.value ? new Date(objConfigSearch.endTimeFrom.value) : null,
                endTimeTo: objConfigSearch.endTimeTo.value ? new Date(objConfigSearch.endTimeTo.value) : null,
                createTimeFrom: objConfigSearch.createTimeFrom.value ? moment(objConfigSearch.createTimeFrom.value) : null,
                createTimeTo: objConfigSearch.createTimeTo.value ? moment(objConfigSearch.createTimeTo.value) : null,
                selectValueSystem: objConfigSearch.system.value ? JSON.parse(objConfigSearch.system.value) : {},
                selectValueWoTypeGroup: objConfigSearch.woTypeGroup.value ? JSON.parse(objConfigSearch.woTypeGroup.value) : {},
                selectValueResult: objConfigSearch.result.value ? JSON.parse(objConfigSearch.result.value) : {},
                selectValueReceiveUnit: objConfigSearch.processUnit.value ? JSON.parse(objConfigSearch.processUnit.value) : {},
                selectValueWoCategorys: this.state.woCategorysList.filter(item => (objConfigSearch.woCategorys.value ? objConfigSearch.woCategorys.value.split(",") : []).includes(item.itemId + "")).map(item => {return {value: item.itemId}}) || [],
                selectValueWoType: objConfigSearch.woType.value ? JSON.parse(objConfigSearch.woType.value) : {},
                selectValuePriority: objConfigSearch.priority.value ? JSON.parse(objConfigSearch.priority.value) : {},
                selectValueCreateUnit: objConfigSearch.createUnit.value ? JSON.parse(objConfigSearch.createUnit.value) : {},
                cdGroup: objConfigSearch.cdGroup.value ? objConfigSearch.cdGroup.value.split(";").map(item => JSON.parse(item)) : [],
                isGetPriority: true
            }, () => {
                let values = {
                    page: 1
                }
                const objectSearch = Object.assign({}, this.state.objectSearch, values);
                this.setDataToObject(objectSearch);
                objectSearch.woCode = objConfigSearch.woCode ? objConfigSearch.woCode.value : "";
                objectSearch.woContent = objConfigSearch.woContent ? objConfigSearch.woContent.value : "";
                objectSearch.planCode = objConfigSearch.planCode ? objConfigSearch.planCode.value : "";
                objectSearch.woSystemId = objConfigSearch.woSystemId ? objConfigSearch.woSystemId.value : "";
                objectSearch.createPersonName = objConfigSearch.createPersonName ? objConfigSearch.createPersonName.value : "";
                objectSearch.ftName = objConfigSearch.ftName ? objConfigSearch.ftName.value : "";
                objectSearch.parentName = objectSearch.parentName ? objConfigSearch.parentName.value : "";
                objectSearch.accountIsdn = objConfigSearch.accountIsdn ? objConfigSearch.accountIsdn.value : "";
                this.setState({
                    loading: true,
                    objectSearch,
                    isFirstSearchTable: false
                }, () => {
                    this.searchWoManagement();
                });
            });
        }).catch((error) => {
            const objConfigSearch = this.buildSearchConfigDefault();
            let values = {
                page: 1
            }
            const objectSearch = Object.assign({}, this.state.objectSearch, values);
            this.setDataToObject(objectSearch);
            this.setState({
                loading: true,
                objectSearch,
                isFirstSearchTable: false
            }, () => {
                this.searchWoManagement();
            });
        });
    }

    buildSearchConfigDefault = () => {
        return {
            woCategorys: { value: [1,2,3].map(item => item).join(",") },
            planCode: { value: "" },
            system: { value: JSON.stringify({}) },
            woTypeGroup: { value: JSON.stringify({}) },
            woType: { value: JSON.stringify({}) },
            result: { value: JSON.stringify({}) },
            createPersonName: { value: "" },
            startTimeFrom: { value: null },
            startTimeTo: { value: null },
            processUnit: { value: JSON.stringify({}) },
            endTimeFrom: { value: null },
            endTimeTo: { value: null },
            cdGroup: { value: "" },
            completeTimeFrom: { value: null },
            completeTimeTo: { value: null },
            isNeedSupport: { value: "false" },
            status: { value: "" },
            woContent: { value: "" },
            woCode: { value: "" },
            priority: { value: JSON.stringify({}) },
            createTimeFrom: { value: moment().subtract(15, 'days') },
            createTimeTo: { value: moment().add(1, 'days') },
            createUnit: { value: JSON.stringify({}) },
            accountIsdn: { value: "" },
            parentName: { value: "" },
            woSystemId: { value: "" },
            ftName: { value: "" }
        }
    }

    saveConfigSearch = () => {
        let funcKey = "searchWO";
        let objInsertConfig = [
            {
                fieldName: "woCategorys",
                fieldValue: this.state.selectValueWoCategorys.map(item => item.value).join(",")
            },
            {
                fieldName: "planCode",
                fieldValue: this.state.objectSearch.planCode
            },
            {
                fieldName: "system",
                fieldValue: JSON.stringify(this.state.selectValueSystem)
            },
            {
                fieldName: "woTypeGroup",
                fieldValue: JSON.stringify(this.state.selectValueWoTypeGroup)
            },
            {
                fieldName: "result",
                fieldValue: JSON.stringify(this.state.selectValueResult)
            },
            {
                fieldName: "createPersonName",
                fieldValue: this.state.objectSearch.createPersonName
            },
            {
                fieldName: "startTimeFrom",
                fieldValue: this.state.startTimeFrom
            },
            {
                fieldName: "startTimeTo",
                fieldValue: this.state.startTimeTo
            },
            {
                fieldName: "processUnit",
                fieldValue: this.state.selectValueReceiveUnit ? JSON.stringify({ value: this.state.selectValueReceiveUnit.value, label: this.state.selectValueReceiveUnit.label }) : "{}"
            },
            {
                fieldName: "endTimeFrom",
                fieldValue: this.state.endTimeFrom
            },
            {
                fieldName: "endTimeTo",
                fieldValue: this.state.endTimeTo
            },
            {
                fieldName: "cdGroup",
                fieldValue: this.state.cdGroup.map(item => {return JSON.stringify({woGroupId: item.woGroupId, woGroupCode: item.woGroupCode})}).join(";")
            },
            {
                fieldName: "completeTimeFrom",
                fieldValue: this.state.completeTimeFrom
            },
            {
                fieldName: "completeTimeTo",
                fieldValue: this.state.completeTimeTo
            },
            {
                fieldName: "isNeedSupport",
                fieldValue: this.state.woNeedsSupport,
            },
            {
                fieldName: "status",
                fieldValue: this.state.selectValueStatus.map(item => item.value).join(",")
            },
            {
                fieldName: "woContent",
                fieldValue: this.state.objectSearch.woContent,
            },
            {
                fieldName: "woCode",
                fieldValue: this.state.objectSearch.woCode,
            },
            {
                fieldName: "woType",
                fieldValue: JSON.stringify(this.state.selectValueWoType)
            },
            {
                fieldName: "priority",
                fieldValue: JSON.stringify(this.state.selectValuePriority)
            },
            {
                fieldName: "createTimeFrom",
                fieldValue: this.state.createTimeFrom ? this.state.createTimeFrom.toDate() : null
            },
            {
                fieldName: "createTimeTo",
                fieldValue: this.state.createTimeTo ? this.state.createTimeTo.toDate() : null
            },
            {
                fieldName: "createUnit",
                fieldValue: this.state.selectValueCreateUnit ? JSON.stringify({ value: this.state.selectValueCreateUnit.value, label: this.state.selectValueCreateUnit.label }) : "{}"
            },
            {
                fieldName: "accountIsdn",
                fieldValue: this.state.objectSearch.accountIsdn,
            },
            {
                fieldName: "parentName",
                fieldValue: this.state.objectSearch.parentName,
            },
            {
                fieldName: "woSystemId",
                fieldValue: this.state.objectSearch.woSystemId,
            },
            {
                fieldName: "ftName",
                fieldValue: this.state.objectSearch.ftName,
            },
        ];
        this.props.actions.insertOrUpdateListSearchConfigUser({ searchConfigUserDTOS: objInsertConfig, funcKey: funcKey }).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("woManagement:woManagement.message.success.saveSearchConfig"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.saveSearchConfig"));
            }
        }).catch((error) => {
            toastr.error(this.props.t("woManagement:woManagement.message.error.saveSearchConfig"));
        });
    }

    deleteSearchConfig = () => {
        if (this.state.objConfigSearch) {
            this.props.actions.deleteListSearchConfigUser({ funcKey: "searchWO" }).then((response) => {
                toastr.success(this.props.t("common:common.message.success.resetDefaultSearchConfigUser"));
                this.getConfigSearch();
                this.setState({
                    objConfigSearch: this.buildSearchConfigDefault()
                });
            }).catch((error) => {
                toastr.error(this.props.t("common:common.message.error.resetDefaultSearchConfigUser"));
            });
        }
    }
    
    openCdGroupPopup = () => {
        this.setState({
            isOpenCdGroupPopup: true
        });
    }

    closeCdGroupPopup = () => {
        this.setState({
            isOpenCdGroupPopup: false
        });
    }

    setValueCdGroup = (cdGroup) => {
        this.setState({
            cdGroup
        });
    }

    handleItemSelectChangeWoTypeGroup = (d) => {
        this.setState({
            selectValueWoTypeGroup: d,
            selectValueWoType: {}
        }, () => {
            this.getListWoType();
        });
    }

    getListWoType = () => {
        const data = {};
        if (this.state.selectValueWoTypeGroup.value) {
            data.woGroupType = this.state.selectValueWoTypeGroup.value;
            if (this.state.selectValueWoTypeGroup.code === "OTHER") {
                data.woGroupType = -1;
            }
        }
        // if (this.state.cdGroupList && this.state.cdGroupList.length > 0) {
        //     data.lstCdGroup = this.state.cdGroupList.map(item => item.woGroupId);
        // }
        this.props.actions.getListWoTypeDTO(data);
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading } = this.state;
        const woSystemArray = (this.props.response.common.woSystemArray && this.props.response.common.woSystemArray.payload) ? this.props.response.common.woSystemArray.payload.data.data : [];
        const woGroupType = (this.props.response.common.woGroupType && this.props.response.common.woGroupType.payload) ? this.props.response.common.woGroupType.payload.data.data : [];
        const woResultStatus = (this.props.response.common.woResultStatus && this.props.response.common.woResultStatus.payload) ? this.props.response.common.woResultStatus.payload.data.data : [];
        const objectSearch = {};
        for (const woSystem of woSystemArray) {
            woSystem.itemId = woSystem.itemCode;
        }
        return (
            <CustomCSSTransition
                isVisible={this.state.addEditModal || this.state.processModal}
                content={
                    this.state.addEditModal ?
                    <WoManagementAdd
                        closePage={this.closePage}
                        parentState={this.state} /> :
                    <WoManagementEdit
                        closePage={this.closePage}
                        parentState={this.state} />
                }>
                <div>
                    <AvForm id="idFormSearch" onKeyDown={this.handleKeyDownForm} onValidSubmit={this.search} model={objectSearch} ref={el => this.myFormRef = el}>
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
                                                        <CustomMultiSelectLocal
                                                            name={"woCategories"}
                                                            label={t("woManagement:woManagement.label.workOrderCategories")}
                                                            isRequired={false}
                                                            options={this.state.woCategorysList}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueWoCategorys: d })}
                                                            selectValue={this.state.selectValueWoCategorys}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="planCode" label={t("woManagement:woManagement.label.planCode")} placeholder={t("woManagement:woManagement.placeholder.planCode")} />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"woSystem"}
                                                            label={t("woManagement:woManagement.label.system")}
                                                            isRequired={false}
                                                            options={woSystemArray}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueSystem: d })}
                                                            selectValue={this.state.selectValueSystem}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"woTypeGroup"}
                                                            label={t("woManagement:woManagement.label.woTypeGroup")}
                                                            isRequired={false}
                                                            options={woGroupType}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeWoTypeGroup}
                                                            selectValue={this.state.selectValueWoTypeGroup}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"result"}
                                                            label={t("woManagement:woManagement.label.result")}
                                                            isRequired={false}
                                                            options={woResultStatus.map(item => {return {itemId: item.itemValue, itemName: item.itemName}}).filter(item => item.itemId + "" !== "1")}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueResult: d })}
                                                            selectValue={this.state.selectValueResult}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="createPersonName" label={t("woManagement:woManagement.label.createPerson")} placeholder={t("woManagement:woManagement.placeholder.createPerson")} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"startTimeFrom"}
                                                            label={t("woManagement:woManagement.label.startTimeFrom")}
                                                            isRequired={false}
                                                            selected={this.state.startTimeFrom}
                                                            handleOnChange={(d) => this.setState({ startTimeFrom: d })}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"startTimeTo"}
                                                            label={t("woManagement:woManagement.label.startTimeTo")}
                                                            isRequired={false}
                                                            selected={this.state.startTimeTo}
                                                            handleOnChange={(d) => this.setState({ startTimeTo: d })}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAutocomplete 
                                                            name={"processUnitId"}
                                                            label={t("woManagement:woManagement.label.receiveUnit")}
                                                            placeholder={this.props.t("woManagement:woManagement.placeholder.receiveUnit")}
                                                            isRequired={false}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueReceiveUnit: d })}
                                                            selectValue={this.state.selectValueReceiveUnit}
                                                            moduleName={"UNIT"} 
                                                            isOnlyInputSelect={false}
                                                            isHasCheckbox={true}
                                                            nameCheckbox={"checkReceiveUnit"}
                                                            isCheckedCheckbox={this.state.isCheckedReceiveUnit}
                                                            handleOnChangeCheckbox={() => this.setState({ isCheckedReceiveUnit: !this.state.isCheckedReceiveUnit })}
                                                            titleCheckbox={this.props.t("woManagement:woManagement.label.allChildSelected")}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"endTimeFrom"}
                                                            label={t("woManagement:woManagement.label.endTimeFrom")}
                                                            isRequired={false}
                                                            selected={this.state.endTimeFrom}
                                                            handleOnChange={(d) => this.setState({ endTimeFrom: d })}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"endTimeTo"}
                                                            label={t("woManagement:woManagement.label.endTimeTo")}
                                                            isRequired={false}
                                                            selected={this.state.endTimeTo}
                                                            handleOnChange={(d) => this.setState({ endTimeTo: d })}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomInputPopup
                                                            name={"cdGroup"}
                                                            label={t("woManagement:woManagement.label.cdGroup")}
                                                            placeholder={t("woManagement:woManagement.placeholder.doubleClick")}
                                                            value={this.state.cdGroup.map(item => item.woGroupCode).join(",") || ""}
                                                            handleRemove={() => this.setState({ cdGroup: [] })}
                                                            handleDoubleClick={this.openCdGroupPopup}
                                                            isRequired={false}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"completeTimeFrom"}
                                                            label={t("woManagement:woManagement.label.completeTimeFrom")}
                                                            isRequired={false}
                                                            selected={this.state.completeTimeFrom}
                                                            handleOnChange={(d) => this.setState({ completeTimeFrom: d })}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"completeTimeTo"}
                                                            label={t("woManagement:woManagement.label.completeTimeTo")}
                                                            isRequired={false}
                                                            selected={this.state.completeTimeTo}
                                                            handleOnChange={(d) => this.setState({ completeTimeTo: d })}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAppSwitch
                                                            name={"woNeedsSupport"}
                                                            label={t("woManagement:woManagement.label.woNeedsSupport")}
                                                            checked={this.state.woNeedsSupport}
                                                            handleChange={(checked) => this.setState({ woNeedsSupport: checked })}
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
                                                title={t("woManagement:woManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woManagement:woManagement.button.add")}
                                                    onClick={() => this.openPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woManagement:woManagement.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-2"
                                                    title={t("woManagement:woManagement.button.export")}
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    onClick={() => this.onExport()}>
                                                    <i className="fa fa-download"></i>
                                                </LaddaButton>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2" title={t("woManagement:woManagement.button.saveConfig")}
                                                    onClick={this.saveConfigSearch}><i className="fa fa-save"></i>
                                                </Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2" title={t("woManagement:woManagement.button.restore")}
                                                    onClick={this.deleteSearchConfig}><i className="fa fa-refresh"></i>
                                                </Button>
                                                <SettingTable
                                                    columns={columns}
                                                    onChange={(columns) => this.setState({ columns })}
                                                    moduleName="WO_MANAGEMENT"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <CustomReactTableSearch
                                                onRef={ref => (this.customReactTableSearch = ref)}
                                                columns={columns}
                                                data={data}
                                                pages={pages}
                                                loading={loading}
                                                onFetchData={this.onFetchData}
                                                defaultPageSize={10}
                                                isCheckbox={true}
                                                propsCheckbox={[]}
                                                handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        {/* </editor-fold> */}
                    </AvForm>
                    <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchWoManagement}
                        stateImportModal={this.state} />
                    <WoManagementExportFileTestServicePopup
                        parentState={this.state}
                        closePopup={this.closeExportFileTestServicePopup} />
                    <WoManagementCompleteWoSPMPopup
                        parentState={this.state}
                        closePopup={this.closeCompleteWoSpmPopup}
                        reloadDataGrid={this.searchWoManagement} />
                    <WoManagementInfoCallPopup
                        parentState={this.state}
                        closePopup={this.closeInfoCallPopup} />
                    <WoManagementAddCdGroupPopup
                        parentState={this.state}
                        closePopup={this.closeCdGroupPopup}
                        setValue={this.setValueCdGroup}
                        isChooseOnly={false} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions, WoCdGroupManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementList));