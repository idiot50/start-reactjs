import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as odTypeActions from './../category/OdTypeActions';
import * as commonActions from './../../../actions/commonActions';
import * as OdWorkflowActions from './OdWorkflowActions';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import TheSignModal from "../../../containers/Utils/TheSignModal";
import { Dropzone, downloadFileLocal, convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import { CustomAvField, CustomSticky, CustomSelect, CustomSelectLocal, CustomDatePicker, CustomReactTableLocal, CustomAutocomplete } from '../../../containers/Utils';
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

class OdWorkflowDetail extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAdditionalInfo = this.toggleFormAdditionalInfo.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
        this.handleChangeCreateTime = this.handleChangeCreateTime.bind(this);
        this.handleChangeEndPendingTime = this.handleChangeEndPendingTime.bind(this);
        this.openTheSignModal = this.openTheSignModal.bind(this);
        this.closeTheSignModal = this.closeTheSignModal.bind(this);
        this.onTheSignResult = this.onTheSignResult.bind(this);
        this.handleStatusSelectChange = this.handleStatusSelectChange.bind(this);
        this.handleItemSelectChangeOdPriorityId = this.handleItemSelectChangeOdPriorityId.bind(this);
        this.handleItemSelectChangeOdType = this.handleItemSelectChangeOdType.bind(this);
        
        this.handleOnChangeReceiveUnit = this.handleOnChangeReceiveUnit.bind(this);
        this.handleOnChangeReceiveUser = this.handleOnChangeReceiveUser.bind(this);
        this.handleOnChangeCreatePersonId = this.handleOnChangeCreatePersonId.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAdditionalInfo: true,
            //AddOrEditModal
            detailModal: props.parentState.detailModal,
            isDetail: props.parentState.isDetail,
            selectedData: props.parentState.selectedData,
            //table
            linkCode: {
                columns: this.buildTableLinkCodeColumns()
            },
            actionHistory: {
                columns: this.buildTableActionHistoryColumns()
            },
            files: [],
            filesCurrent: [],
            filesShow: [],
            columnCheck: [],
            startTime: null,
            endTime: null,
            createTime: null,
            endPendingTime: null,
            solutionCompleteTime: null,
            selectValueStatus: {},
            selectValueOdPriorityId: {},
            selectValueOdType: {},
            selectValueReceiveUnit: {},
            selectValueReceiveUser: {},
            selectValueCreatePersonId: {},
            selectValueClearCode: {},
            selectValueCloseCode: {},
            selectValueReasonGroup: {},
            selectValueSolutionGroup: {},
            listStatusNext: [],
            //The Sign modal
            theSignModal: false,
            moduleName: null,
            theSignResult: false,
            //Fields
            fields: this.buildColumnCheck(),
            isTheSign: false
        };
    }

    componentDidMount() {
        if (this.state.isDetail === "EDIT") {
            this.setState({
                selectValueReceiveUnit: {value: this.state.selectedData.receiveUnitId, label: this.state.selectedData.receiveUnitName},
                selectValueReceiveUser: {value: this.state.selectedData.receiveUserId, label: this.state.selectedData.receiveUserName},
                selectValueCreatePersonId: {value: this.state.selectedData.createPersonId, label: this.state.selectedData.createPersonName},
                selectValueClearCode: {value: this.state.selectedData.clearCodeId},
                selectValueCloseCode: {value: this.state.selectedData.closeCodeId},
                selectValueOdPriorityId: { value: this.state.selectedData.priorityId },
                selectValueOdType: { value: this.state.selectedData.odTypeId },
                selectValueReasonGroup: { value: this.state.selectedData.reasonGroup },
                selectValueSolutionGroup: { value: this.state.selectedData.solutionGroup },
                filesCurrent: this.state.selectedData.lstFileEntities,
                filesShow: this.state.selectedData.lstFileEntities,
                startTime: new Date(this.state.selectedData.startTime),
                endTime: new Date(this.state.selectedData.endTime),
                createTime: new Date(this.state.selectedData.createTime),
                endPendingTime: this.state.selectedData.endPendingTime ? new Date(this.state.selectedData.endPendingTime) : null,
                solutionCompleteTime: this.state.selectedData.solutionCompleteTime ? new Date(this.state.selectedData.solutionCompleteTime) : null,
            });
        }
        this.props.actions.getListColumnCheck(this.state.selectedData.oldStatus, this.state.selectedData.oldStatus, this.state.selectedData.priorityId, this.state.selectedData.oldStatus, this.state.selectedData.odTypeId)
        .then((response) => {
            let data = [];
            try {
                data = [...response.payload.data];
            } catch (error) {
                this.setState({
                    fields: this.buildColumnCheck()
                });
            }
            let buildColumnCheck = Object.assign({}, this.buildColumnCheck());
            for (const d of data) {
                const field = buildColumnCheck["field" + d.columnName];
                if (field) {
                    buildColumnCheck["field" + d.columnName]["isRequired"] = d.isRequired ? d.isRequired : false;
                    buildColumnCheck["field" + d.columnName]["isVisible"] = d.isVisible ? d.isVisible : false;
                    buildColumnCheck["field" + d.columnName]["editable"] = d.editable ? d.editable : false;
                    buildColumnCheck["field" + d.columnName]["message"] = d.message ? d.message : "";
                }
            }
            this.setState({
                columnCheck: data,
                fields: buildColumnCheck
            });
        });
        this.props.actions.getItemMaster("OD_CLEAR_CODE", "itemId", "itemName", "1", "3");// mã clear
        this.props.actions.getItemMaster("OD_CLOSE_CODE", "itemId", "itemName", "1", "3");// mã đóng
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3");// mức độ ưu tiên
        this.props.actions.getItemMaster("OD_STATUS", "itemId", "itemName", "1", "3").then((response) => {
            let objOdStatusSelected = {};
            for (const obj of response.payload.data.data) {
                if ((this.state.selectedData.oldStatus + "") === (obj.itemValue + "")) {
                    objOdStatusSelected = obj;
                }
            }
            this.props.actions.getListStatusNext(this.state.selectedData.odId, JSON.parse(localStorage.user).userName).then((response) => {
                let listStatusNext = [];
                let isHas = false;
                for (const obj of response.payload.data.data) {
                    if (obj.itemValue === objOdStatusSelected.itemValue) {
                        isHas = true;
                    }
                    obj.itemId = Number.parseInt(obj.itemValue,10);
                    listStatusNext.push(obj);
                }
                if (!isHas) {
                    objOdStatusSelected.itemId = Number.parseInt(objOdStatusSelected.itemValue,10);
                    listStatusNext.unshift(objOdStatusSelected);
                }
                this.setState({
                    listStatusNext: listStatusNext,
                    selectValueStatus: { value: objOdStatusSelected.itemValue }
                });
            }).catch((error) => {
            });
        }).catch((error) => {
        });
        this.props.actions.getItemMaster("OD_REASON_GROUP", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("OD_SOLUTION_GROUP", "itemId", "itemName", "1", "3");
        
    }

    componentWillUnmount() {
        this.setState({
            isDetail: null
        });
    }

    buildColumnCheck() {
        return {
            fieldodName: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldsolutionDetail: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldreceiveUnitId: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldpriorityId: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldodTypeId: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldendPendingTime: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldsolutionGroupTime: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldstartTime: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldendTime: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldcloseCodeId: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fielddescription: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldsolutionGroup: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldclearCodeId: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldreasonDetail: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldfileAttach: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldreasonGroup: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldsignResult: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldcomment: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldreceiveUserId: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
            fieldplanCode: {
                isRequired: false, isVisible: false, editable: false, message: ""
            },
        }
    }

    buildTableActionHistoryColumns() {
        return [
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.oldStatus" />,
                id: "oldStatusName",
                width: 150,
                accessor: d => {
                    return d.oldStatusName ? <span title={d.oldStatusName}>{d.oldStatusName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.newStatus" />,
                id: "newStatusName",
                width: 150,
                accessor: d => <span title={d.newStatusName}>{d.newStatusName}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.employee" />,
                id: "userName",
                width: 150,
                accessor: d => <span title={d.userName}>{d.userName}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.updateTime" />,
                id: "updateTime",
                className: "text-center",
                width: 150,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.updateTime)}>{convertDateToDDMMYYYYHHMISS(d.updateTime)}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.content" />,
                id: "content",
                minWidth: 300,
                accessor: d => {
                    return d.content ? <span title={d.content}>{d.content}</span>
                    : <span>&nbsp;</span>
                }
            }
        ];
    }

    buildTableLinkCodeColumns() {
        return [
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.systemName" />,
                id: "system",
                width: 100,
                accessor: d => <span title={d.system}>{d.system}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.linkCode" />,
                id: "systemCode",
                width: 200,
                accessor: d => <span title={d.systemCode}>{d.systemCode}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.status" />,
                id: "status",
                width: 150,
                accessor: d => <span title={d.status}>{d.status}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createdTime" />,
                id: "createTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.createTime ? <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.endTimeRequest" />,
                id: "endTime",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.endTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endTime)}>{convertDateToDDMMYYYYHHMISS(d.endTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.content" />,
                id: "content",
                width: 200,
                accessor: d => <span title={d.content}>{d.content}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createPerson" />,
                id: "createPersonName",
                width: 150,
                accessor: d => <span title={d.createPersonName}>{d.createPersonName}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.receiveUnit" />,
                id: "receiveUnitName",
                minWidth: 200,
                accessor: d => <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
            }
        ];
    }

    handleOnChangeReceiveUnit(option) {
        this.setState({ selectValueReceiveUnit: option });
    }

    handleOnChangeReceiveUser(option) {
        this.setState({ selectValueReceiveUser: option });
    }

    handleOnChangeCreatePersonId(option) {
        this.setState({ selectValueCreatePersonId: option });
    }

    handleItemSelectChangeOdType(option) {
        let priority = {...this.state.selectValueOdPriorityId};
        if(option.value) {
            this.props.actions.getDetailOdType(option.value).then((response) => {
                for(const obj of response.payload.data.odTypeDetailDTOS) {
                    if(obj.priorityId === Number.parseInt(priority.value, 10)) {
                        priority.processTime = obj.processTime;
                        break;
                    }
                }
                if(this.state.startTime && priority.value) {
                    let d = new Date(this.state.startTime);
                    this.setState({
                        selectValueOdType: option,
                        selectValueOdPriorityId: priority,
                        endTime: new Date(d.getTime() + priority.processTime*60*60*1000),
                    });
                } else {
                    this.setState({
                        selectValueOdType: option,
                        selectValueOdPriorityId: priority
                    });
                }
            });
        } else {
            priority.processTime = null;
            this.setState({
                selectValueOdType: option,
                selectValueOdPriorityId: priority
            });
        }
    }

    handleItemSelectChangeOdPriorityId(option) {
        if(!option.value) {
            this.setState({ selectValueOdPriorityId: option });
            return;
        }
        if(this.state.selectValueOdType.value) {
            this.props.actions.getDetailOdType(this.state.selectValueOdType.value).then((response) => {
                for(const obj of response.payload.data.odTypeDetailDTOS) {
                    if(obj.priorityId === option.value) {
                        option.processTime = obj.processTime;
                        break;
                    }
                }
                if(this.state.startTime) {
                    let d = new Date(this.state.startTime);
                    this.setState({
                        selectValueOdPriorityId: option,
                        endTime: new Date(d.getTime() + option.processTime*60*60*1000),
                    });
                } else {
                    this.setState({ selectValueOdPriorityId: option });
                }
            });
        } else {
            this.setState({ selectValueOdPriorityId: option });
        }
    }

    handleStatusSelectChange(option) {
        if (option.value + "" !==  this.state.selectedData.oldStatus + "") {
            this.setState({
                isTheSign: true
            });
        } else {
            this.setState({
                isTheSign: false
            });
        }
        this.props.actions.getListColumnCheck(this.state.selectedData.oldStatus, option.value, this.state.selectedData.priorityId, this.state.selectedData.odTypeId)
        .then((response) => {
            let data = [];
            try {
                data = [...response.payload.data];
            } catch (error) {
                this.setState({
                    fields: this.buildColumnCheck()
                });
            }
            let buildColumnCheck = Object.assign({}, this.buildColumnCheck());
            for (const d of data) {
                const field = buildColumnCheck["field" + d.columnName];
                if (field) {
                    buildColumnCheck["field" + d.columnName]["isRequired"] = d.isRequired ? d.isRequired : false;
                    buildColumnCheck["field" + d.columnName]["isVisible"] = d.isVisible ? d.isVisible : false;
                    buildColumnCheck["field" + d.columnName]["editable"] = d.editable ? d.editable : false;
                    buildColumnCheck["field" + d.columnName]["message"] = d.message ? d.message : "";
                }
            }
            this.setState({
                columnCheck: data,
                fields: buildColumnCheck,
                selectValueStatus: option
            });
        }).catch((exception) => {
            this.setState({ selectValueStatus: option });
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if(this.state.startTime <= new Date()) {
                toastr.warning(this.props.t("odWorkflow:odWorkflow.message.error.startTime"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            if(this.state.startTime >= this.state.endTime) {
                toastr.warning(this.props.t("odWorkflow:odWorkflow.message.error.endTime"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            if(this.state.fields.fieldfileAttach.isRequired) {
                if(this.state.filesShow.length <= 0) {
                    toastr.warning(this.props.t("odWorkflow:odWorkflow.message.filesRequired"));
                    this.setState({
                        btnAddOrEditLoading: false
                    });
                    return;
                }
            }
            const odWorkflow = values;
            odWorkflow.odName = odWorkflow.odName.trim();
            odWorkflow.odCode = odWorkflow.odCode.trim();
            odWorkflow.description = odWorkflow.description.trim();
            odWorkflow.comment = odWorkflow.comment.trim();
            odWorkflow.planCode = odWorkflow.planCode.trim();
            odWorkflow.vofficeTransCode = odWorkflow.vofficeTransCode.trim();
            odWorkflow.reasonDetail = odWorkflow.reasonDetail.trim();
            odWorkflow.solutionDetail = odWorkflow.solutionDetail.trim();
            odWorkflow.oldStatus = this.state.selectedData.oldStatus;
            odWorkflow.odId = this.state.selectedData.odId;
            odWorkflow.odTypeId = this.state.selectValueOdType.value;
            odWorkflow.priorityId = this.state.selectValueOdPriorityId.value;
            odWorkflow.createTime = convertDateToDDMMYYYYHHMISS(this.state.createTime);
            odWorkflow.startTime = convertDateToDDMMYYYYHHMISS(this.state.startTime);
            odWorkflow.endTime = convertDateToDDMMYYYYHHMISS(this.state.endTime);
            odWorkflow.endPendingTime = convertDateToDDMMYYYYHHMISS(this.state.endPendingTime);
            odWorkflow.solutionCompleteTime = convertDateToDDMMYYYYHHMISS(this.state.solutionCompleteTime);
            odWorkflow.lstFileEntities = this.state.filesCurrent;
            odWorkflow.closeCodeId = this.state.selectValueCloseCode.value;
            odWorkflow.clearCodeId = this.state.selectValueClearCode.value;
            odWorkflow.reasonGroup = this.state.selectValueReasonGroup.value;
            odWorkflow.solutionGroup = this.state.selectValueSolutionGroup.value;
            odWorkflow.status = this.state.selectValueStatus.value;
            odWorkflow.receiveUnitId = this.state.selectValueReceiveUnit ? this.state.selectValueReceiveUnit.value : this.state.selectedData.receiveUnitId;
            odWorkflow.receiveUserId = this.state.selectValueReceiveUser ? this.state.selectValueReceiveUser.value : this.state.selectedData.receiveUserId;
            odWorkflow.createPersonId = this.state.selectValueCreatePersonId ? this.state.selectValueCreatePersonId.value : this.state.selectedData.createPersonId;
            if (this.state.isDetail === "EDIT") {
                this.props.actions.editOdWorkflow(this.state.files, odWorkflow, JSON.parse(localStorage.user).userName).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isDetail);
                            toastr.success(this.props.t("odWorkflow:odWorkflow.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.edit"));
                        }
                        toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.edit"));
                    });
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAdditionalInfo() {
        this.setState({ collapseFormAdditionalInfo: !this.state.collapseFormAdditionalInfo });
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.fileName === item.name)) {
                const arr = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rar', 'zip', '7z', 'jpg', 'gif', 'png', 'bmp', 'sql']
                if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if (item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({
                            files: [...this.state.files, item],
                            filesShow: [...this.state.filesShow, item],
                        });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFile(item) {
        let files = [...this.state.files];
        if (files.indexOf(item) > -1) {
            files.splice(files.indexOf(item), 1);
        }
        let filesCurrent = [...this.state.filesCurrent];
        if (filesCurrent.indexOf(item) > -1) {
            filesCurrent.splice(filesCurrent.indexOf(item), 1);
        }
        let filesShow = [...this.state.filesShow];
        if (filesShow.indexOf(item) > -1) {
            filesShow.splice(filesShow.indexOf(item), 1);
        }
        this.setState({
            files,
            filesCurrent,
            filesShow
        });
    }

    downloadFile(item) {
        this.props.actions.onDownloadFileById("od_cat", item.odFileId).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

    handleChangeStartTime(startTime) {
        if(!startTime) {
            this.setState({ startTime });
            return;
        }
        const buildColumnCheck = {...this.state.fields};
        buildColumnCheck.fieldendTime.editable = false;
        if(this.state.selectValueOdPriorityId.processTime) {
            let d = new Date(startTime);
            this.setState({
                endTime: new Date(d.getTime() + this.state.selectValueOdPriorityId.processTime*60*60*1000),
                startTime,
                fields: buildColumnCheck
            });
        } else {
            if((JSON.stringify(this.state.selectValueOdType) !== '{}' && this.state.selectValueOdType.value != null) &&
            (JSON.stringify(this.state.selectValueOdPriorityId) !== '{}' && this.state.selectValueOdPriorityId.value != null)) {
                this.props.actions.getDetailOdType(this.state.selectValueOdType.value).then((response) => {
                    for(const obj of response.payload.data.odTypeDetailDTOS) {
                        if(obj.priorityId === this.state.selectValueOdPriorityId.value) {
                            let d = new Date(startTime);
                            this.setState({
                                endTime: new Date(d.getTime() + obj.processTime*60*60*1000),
                                startTime,
                                fields: buildColumnCheck
                            });
                            break;
                        }
                    }
                });
            } else {
                this.setState({ startTime });
            }
        }
    }

    handleChangeEndTime(endTime) {
        this.setState({ endTime });
    }

    handleChangeCreateTime(createTime) {
        this.setState({ createTime });
    }

    handleChangeEndPendingTime(endPendingTime) {
        this.setState({ endPendingTime });
    }

    openTheSignModal() {
        this.setState({
            theSignModal: true,
            client: 'od',
            moduleName: "OD_WORKFLOW"
        });
    }

    onTheSignResult(result) {
        this.setState({
            theSignResult: result
        });
    }

    closeTheSignModal() {
        this.setState({
            theSignModal: false,
            client: null,
        });
    }

    render() {
        const { t, response } = this.props;
        const { linkCode, actionHistory, filesShow } = this.state;
        let objectAddOrEdit = this.state.selectedData;
        let closeCodeList = (response.common.odCloseCode && response.common.odCloseCode.payload) ? response.common.odCloseCode.payload.data.data : [];
        let clearCodeList = (response.common.odClearCode && response.common.odClearCode.payload) ? response.common.odClearCode.payload.data.data : [];
        let reasonGroup = (response.common.odReasonGroup && response.common.odReasonGroup.payload) ? response.common.odReasonGroup.payload.data.data : [];
        let solutionGroup = (response.common.odSolutionGroup && response.common.odSolutionGroup.payload) ? response.common.odSolutionGroup.payload.data.data : [];
        let priorityList = (response.common.odPriority && response.common.odPriority.payload) ? response.common.odPriority.payload.data.data : [];
        objectAddOrEdit.description = objectAddOrEdit.description ? objectAddOrEdit.description : '';
        objectAddOrEdit.closeCodeId = objectAddOrEdit.closeCodeId ? objectAddOrEdit.closeCodeId : '';
        objectAddOrEdit.clearCodeId = objectAddOrEdit.clearCodeId ? objectAddOrEdit.clearCodeId : '';
        objectAddOrEdit.planCode = objectAddOrEdit.planCode ? objectAddOrEdit.planCode : '';
        objectAddOrEdit.vofficeTransCode = objectAddOrEdit.vofficeTransCode ? objectAddOrEdit.vofficeTransCode : '';
        objectAddOrEdit.vofficeTransCode = this.state.theSignResult ? 'Success' : objectAddOrEdit.vofficeTransCode;
        objectAddOrEdit.comment = objectAddOrEdit.comment ? objectAddOrEdit.comment : '';
        objectAddOrEdit.status = objectAddOrEdit.status ? objectAddOrEdit.status : '';
        objectAddOrEdit.receiveUserId = objectAddOrEdit.receiveUserId ? objectAddOrEdit.receiveUserId : '';
        objectAddOrEdit.reasonDetail = objectAddOrEdit.reasonDetail ? objectAddOrEdit.reasonDetail : '';
        objectAddOrEdit.solutionDetail = objectAddOrEdit.solutionDetail ? objectAddOrEdit.solutionDetail : '';
        objectAddOrEdit.reasonGroup = objectAddOrEdit.reasonGroup ? objectAddOrEdit.reasonGroup : '';
        objectAddOrEdit.solutionGroup = objectAddOrEdit.solutionGroup ? objectAddOrEdit.solutionGroup : '';
        objectAddOrEdit.endPendingTime = objectAddOrEdit.endPendingTime ? objectAddOrEdit.endPendingTime : '';
        objectAddOrEdit.solutionCompleteTime = objectAddOrEdit.solutionCompleteTime ? objectAddOrEdit.solutionCompleteTime : '';
        return (
            <div>
                <div className="animated fadeIn">
                    <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CustomSticky>
                                        <CardHeader>
                                            <i className="fa fa-align-justify"></i> {t("odWorkflow:odWorkflow.title.odWorkflowEdit")}
                                            <div className="card-header-actions card-header-actions-button">
                                                <LaddaButton type="submit"
                                                    className="btn btn-primary btn-md mr-1"
                                                    loading={this.state.btnAddOrEditLoading}
                                                    data-style={ZOOM_OUT}>
                                                    <i className="fa fa-save"></i> {t("odWorkflow:odWorkflow.button.save")}
                                                </LaddaButton>{' '}
                                                <Button className={!this.state.isTheSign ? "class-hidden" : "mr-1"}
                                                type="button" color="primary" onClick={() => this.openTheSignModal()}><i className="fa fa-sign-in"></i> {t("odWorkflow:odWorkflow.button.theSign")}</Button>
                                                <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                            </div>
                                        </CardHeader>
                                    </CustomSticky>
                                        <CardBody>
                                            <Row>
                                                <Col xs="12" md="8">
                                                    <CustomAvField name="odName" label={t("odWorkflow:odWorkflow.label.woContent")}
                                                    placeholder={t("odWorkflow:odWorkflow.placeholder.woContent")}
                                                    readOnly={!this.state.fields.fieldodName.editable} required={this.state.fields.fieldodName.isRequired}
                                                    validate={{ required: { value: true, errorMessage: this.state.fields.fieldodName.message ? this.state.fields.fieldodName.message : t("odWorkflow:odWorkflow.message.odNameRequired") } }} />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomDatePicker
                                                        name={"createTime"}
                                                        label={t("odWorkflow:odWorkflow.label.createdTime")}
                                                        isRequired={false}
                                                        selected={this.state.createTime}
                                                        timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                        handleOnChange={this.handleChangeCreateTime}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        readOnly={true}
                                                        showTimeSelect={true}
                                                        timeFormat="HH:mm:ss"
                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                        // placeholder={t("odWorkflow:odWorkflow.placeholder.createdTime")}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomAvField name="odCode" label={t("odWorkflow:odWorkflow.label.woCode")}
                                                    readOnly={true} />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomSelectLocal
                                                        autoFocus={true}
                                                        name={"status"}
                                                        label={t("odWorkflow:odWorkflow.label.status")}
                                                        isRequired={true}
                                                        messageRequire={t("odWorkflow:odWorkflow.message.statusRequired")}
                                                        options={this.state.listStatusNext}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleStatusSelectChange}
                                                        selectValue={this.state.selectValueStatus}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomSelectLocal
                                                        name={"priorityId"}
                                                        label={t("odWorkflow:odWorkflow.label.priority")}
                                                        isRequired={this.state.fields.fieldpriorityId.isRequired === 1 ? true : false}
                                                        messageRequire={this.state.fields.fieldpriorityId.message ? this.state.fields.fieldpriorityId.message : t("odWorkflow:odWorkflow.message.priorityRequired")}
                                                        options={priorityList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeOdPriorityId}
                                                        selectValue={this.state.selectValueOdPriorityId}
                                                        isDisabled={!this.state.fields.fieldpriorityId.editable}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomSelect
                                                        name={"odTypeId"}
                                                        label={t("odWorkflow:odWorkflow.label.woType")}
                                                        isRequired={this.state.fields.fieldodTypeId.isRequired === 1 ? true : false}
                                                        messageRequire={this.state.fields.fieldodTypeId.message ? this.state.fields.fieldodTypeId.message : t("odWorkflow:odWorkflow.message.woTypeRequired")}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeOdType}
                                                        selectValue={this.state.selectValueOdType}
                                                        moduleName={"GNOC_OD_TYPE"}
                                                        isDisabled={!this.state.fields.fieldodTypeId.editable}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomAutocomplete
                                                        name={"receiveUnitId"}
                                                        label={t("odWorkflow:odWorkflow.label.receiveUnit")}
                                                        placeholder={t("odWorkflow:odWorkflow.placeholder.receiveUnit")}
                                                        isRequired={false}
                                                        closeMenuOnSelect={false}
                                                        handleItemSelectChange={this.handleOnChangeReceiveUnit}
                                                        selectValue={this.state.selectValueReceiveUnit}
                                                        moduleName={"UNIT"}
                                                        isDisabled={!this.state.fields.fieldreceiveUnitId.editable}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomAutocomplete
                                                        name={"receiveUserId"}
                                                        label={t("odWorkflow:odWorkflow.label.implementer")}
                                                        placeholder={t("odWorkflow:odWorkflow.placeholder.implementer")}
                                                        isRequired={this.state.fields.fieldreceiveUserId.isRequired === 1 ? true : false}
                                                        messageRequire={this.state.fields.fieldreceiveUserId.message ? this.state.fields.fieldreceiveUserId.message : t("odWorkflow:odWorkflow.message.receiveUserRequired")}
                                                        closeMenuOnSelect={false}
                                                        handleItemSelectChange={this.handleOnChangeReceiveUser}
                                                        selectValue={this.state.selectValueReceiveUser}
                                                        moduleName={"USERS"}
                                                        isDisabled={!this.state.fields.fieldreceiveUserId.editable}
                                                        isHasChildren={true}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomDatePicker
                                                        name={"startTime"}
                                                        label={t("odWorkflow:odWorkflow.label.startTime")}
                                                        isRequired={this.state.fields.fieldstartTime.isRequired === 1 ? true : false}
                                                        messageRequire={this.state.fields.fieldstartTime.message ? this.state.fields.fieldstartTime.message : t("odWorkflow:odWorkflow.message.startTimeRequired")}
                                                        selected={this.state.startTime}
                                                        timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                        handleOnChange={this.handleChangeStartTime}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        readOnly={!this.state.fields.fieldstartTime.editable}
                                                        showTimeSelect={true}
                                                        timeFormat="HH:mm:ss"
                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                        // placeholder={t("odWorkflow:odWorkflow.placeholder.startTime")}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomDatePicker
                                                        name={"endTime"}
                                                        label={t("odWorkflow:odWorkflow.label.endTime")}
                                                        isRequired={this.state.fields.fieldendTime.isRequired === 1 ? true : false}
                                                        messageRequire={this.state.fields.fieldendTime.message ? this.state.fields.fieldendTime.message : t("odWorkflow:odWorkflow.message.endTimeRequired")}
                                                        selected={this.state.endTime}
                                                        timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                        handleOnChange={this.handleChangeEndTime}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        readOnly={!this.state.fields.fieldendTime.editable}
                                                        showTimeSelect={true}
                                                        timeFormat="HH:mm:ss"
                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                        // placeholder={t("odWorkflow:odWorkflow.placeholder.endTime")}
                                                    />
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <CustomAutocomplete
                                                        name={"createPersonId"}
                                                        label={t("odWorkflow:odWorkflow.label.creator")}
                                                        placeholder={t("odWorkflow:odWorkflow.placeholder.creator")}
                                                        isRequired={false}
                                                        closeMenuOnSelect={false}
                                                        handleItemSelectChange={this.handleOnChangeCreatePersonId}
                                                        selectValue={this.state.selectValueCreatePersonId}
                                                        moduleName={"USERS"}
                                                        isDisabled={true}
                                                        isHasChildren={true}
                                                    />
                                                </Col>
                                                <Col xs="12" md="12">
                                                    <CustomAvField type="textarea" rows="3" name="description" label={t("odWorkflow:odWorkflow.label.woDescription")}
                                                    placeholder={t("odWorkflow:odWorkflow.placeholder.woDescription")}
                                                    readOnly={!this.state.fields.fielddescription.editable} required={this.state.fields.fielddescription.isRequired}
                                                    validate={{ required: { value: true, errorMessage: this.state.fields.fielddescription.message ? this.state.fields.fielddescription.message : t("odWorkflow:odWorkflow.message.descriptionRequired") } }} />
                                                </Col>
                                                <Col xs="12" md="12">
                                                    <CustomAvField type="textarea" rows="3" name="comment" label={t("odWorkflow:odWorkflow.label.note")}
                                                    placeholder={t("odWorkflow:odWorkflow.placeholder.note")}
                                                    readOnly={!this.state.fields.fieldcomment.editable} required={this.state.fields.fieldcomment.isRequired}
                                                    validate={{ required: { value: true, errorMessage: this.state.fields.fieldcomment.message ? this.state.fields.fieldcomment.message : t("odWorkflow:odWorkflow.message.commentRequired") } }} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" md="12">
                                                    <Card>
                                                        <CardHeader>
                                                            <i className="fa fa-align-justify"></i> {t("odWorkflow:odWorkflow.title.odWorkflowInfoExtra")}
                                                            <div className="card-header-actions">
                                                                <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormDetail" onClick={this.toggleFormAdditionalInfo}><i className={this.state.collapseFormAdditionalInfo ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                                            </div>
                                                        </CardHeader>
                                                        <Collapse isOpen={this.state.collapseFormAdditionalInfo} id="collapseFormAdditionalInfo">
                                                        <CardBody>
                                                            <Row>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldendPendingTime.isVisible ? "class-hidden" : ""}>
                                                                    <CustomDatePicker
                                                                        name={"endPendingTime"}
                                                                        label={t("odWorkflow:odWorkflow.label.endPendingTime")}
                                                                        isRequired={this.state.fields.fieldendPendingTime.isRequired === 1 ? true : false}
                                                                        messageRequire={this.state.fields.fieldendPendingTime.message ? this.state.fields.fieldendPendingTime.message : t("odWorkflow:odWorkflow.message.endPendingTimeRequired")}
                                                                        selected={this.state.endPendingTime}
                                                                        timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                                        handleOnChange={this.handleChangeEndPendingTime}
                                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                        readOnly={!this.state.fields.fieldendPendingTime.editable}
                                                                        showTimeSelect={true}
                                                                        timeFormat="HH:mm:ss"
                                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                                        // placeholder={t("odWorkflow:odWorkflow.placeholder.endPendingTime")}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldplanCode.isVisible ? "class-hidden" : ""}>
                                                                    <CustomAvField name="planCode" label={t("odWorkflow:odWorkflow.label.planCode")}
                                                                    readOnly={!this.state.fields.fieldplanCode.editable} required={this.state.fields.fieldplanCode.isRequired}
                                                                    placeholder={t("odWorkflow:odWorkflow.placeholder.planCode")}
                                                                    validate={{ required: { value: true, errorMessage: this.state.fields.fieldplanCode.message ? this.state.fields.fieldplanCode.isRequired : t("odWorkflow:odWorkflow.message.woSystemCodeRequired") } }} />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldcloseCodeId.isVisible ? "class-hidden" : ""}>
                                                                    <CustomSelectLocal
                                                                        name={"closeCodeId"}
                                                                        label={t("odWorkflow:odWorkflow.label.closeCode")}
                                                                        isRequired={this.state.fields.fieldcloseCodeId.isRequired === 1 ? true : false}
                                                                        messageRequire={this.state.fields.fieldcloseCodeId.message ? this.state.fields.fieldcloseCodeId.message : t("odWorkflow:odWorkflow.message.closeCodeRequired")}
                                                                        options={closeCodeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(option) => this.setState({ selectValueCloseCode: option })}
                                                                        selectValue={this.state.selectValueCloseCode}
                                                                        isDisabled={!this.state.fields.fieldcloseCodeId.editable}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldclearCodeId.isVisible ? "class-hidden" : ""}>
                                                                    <CustomSelectLocal
                                                                        name={"clearCodeId"}
                                                                        label={t("odWorkflow:odWorkflow.label.clearCode")}
                                                                        isRequired={this.state.fields.fieldclearCodeId.isRequired === 1 ? true : false}
                                                                        messageRequire={this.state.fields.fieldclearCodeId.message ? this.state.fields.fieldclearCodeId.message : t("odWorkflow:odWorkflow.message.clearCodeRequired")}
                                                                        options={clearCodeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(option) => this.setState({ selectValueClearCode: option })}
                                                                        selectValue={this.state.selectValueClearCode}
                                                                        isDisabled={!this.state.fields.fieldclearCodeId.editable}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldsignResult.isVisible ? "class-hidden" : ""}>
                                                                    <CustomAvField name="vofficeTransCode" label={t("odWorkflow:odWorkflow.label.theSignResult")}
                                                                    placeholder={t("odWorkflow:odWorkflow.placeholder.theSignResult")}
                                                                    readOnly={!this.state.fields.fieldsignResult.editable} required={this.state.fields.fieldsignResult.isRequired}
                                                                    validate={{ required: { value: true, errorMessage: this.state.fields.fieldsignResult.message ? this.state.fields.fieldsignResult.message : t("odWorkflow:odWorkflow.message.signResultRequired") } }} />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldsolutionGroup.isVisible ? "class-hidden" : ""}>
                                                                    <CustomSelectLocal
                                                                        name={"solutionGroup"}
                                                                        label={t("odWorkflow:odWorkflow.label.solutionGroup")}
                                                                        isRequired={this.state.fields.fieldsolutionGroup.isRequired === 1 ? true : false}
                                                                        messageRequire={this.state.fields.fieldsolutionGroup.message ? this.state.fields.fieldsolutionGroup.message : t("odWorkflow:odWorkflow.message.solutionGroupRequired")}
                                                                        options={solutionGroup}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(option) => this.setState({ selectValueSolutionGroup: option })}
                                                                        selectValue={this.state.selectValueSolutionGroup}
                                                                        isDisabled={!this.state.fields.fieldsolutionGroup.editable}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldreasonGroup.isVisible ? "class-hidden" : ""}>
                                                                    <CustomSelectLocal
                                                                        name={"reasonGroup"}
                                                                        label={t("odWorkflow:odWorkflow.label.reasonGroup")}
                                                                        isRequired={this.state.fields.fieldreasonGroup.isRequired === 1 ? true : false}
                                                                        messageRequire={this.state.fields.fieldreasonGroup.message ? this.state.fields.fieldreasonGroup.message : t("odWorkflow:odWorkflow.message.reasonGroupRequired")}
                                                                        options={reasonGroup}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(option) => this.setState({ selectValueReasonGroup: option })}
                                                                        selectValue={this.state.selectValueReasonGroup}
                                                                        isDisabled={!this.state.fields.fieldreasonGroup.editable}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldreasonDetail.isVisible ? "class-hidden" : ""}>
                                                                    <CustomAvField name="reasonDetail" label={t("odWorkflow:odWorkflow.label.reasonDetail")}
                                                                    placeholder={t("odWorkflow:odWorkflow.placeholder.reasonDetail")}
                                                                    readOnly={!this.state.fields.fieldreasonDetail.editable} required={this.state.fields.fieldreasonDetail.isRequired}
                                                                    validate={{ required: { value: true, errorMessage: this.state.fields.fieldreasonDetail.message ? this.state.fields.fieldreasonDetail.message : t("odWorkflow:odWorkflow.message.reasonDetailRequired") } }} />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldsolutionDetail.isVisible ? "class-hidden" : ""}>
                                                                    <CustomAvField name="solutionDetail" label={t("odWorkflow:odWorkflow.label.solutionDetail")}
                                                                    placeholder={t("odWorkflow:odWorkflow.placeholder.solutionDetail")}
                                                                    readOnly={!this.state.fields.fieldsolutionDetail.editable} required={this.state.fields.fieldsolutionDetail.isRequired}
                                                                    validate={{ required: { value: true, errorMessage: this.state.fields.fieldsolutionDetail.message ? this.state.fields.fieldsolutionDetail.message : t("odWorkflow:odWorkflow.message.solutionDetailRequired") } }} />
                                                                </Col>
                                                                <Col xs="12" md="4" className={!this.state.fields.fieldsolutionGroupTime.isVisible ? "class-hidden" : ""}>
                                                                    <CustomDatePicker
                                                                        name={"solutionCompleteTime"}
                                                                        label={t("odWorkflow:odWorkflow.label.solutionCompletionTime")}
                                                                        isRequired={this.state.fields.fieldsolutionGroupTime.isRequired === 1 ? true : false}
                                                                        messageRequire={this.state.fields.fieldsolutionGroupTime.message ? this.state.fields.fieldsolutionGroupTime.message : t("odWorkflow:odWorkflow.message.solutionGroupTimeRequired")}
                                                                        selected={this.state.solutionCompleteTime}
                                                                        timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                                        handleOnChange={(d) => this.setState({ solutionCompleteTime: d })}
                                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                        readOnly={!this.state.fields.fieldsolutionGroupTime.editable}
                                                                        showTimeSelect={true}
                                                                        timeFormat="HH:mm:ss"
                                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                                        // placeholder={t("odWorkflow:odWorkflow.placeholder.solutionCompletionTime")}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Collapse>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Tabs>
                                            <TabList>
                                                <Tab>{t("odWorkflow:odWorkflow.label.actionHistory")}</Tab>
                                                <Tab>{t("odWorkflow:odWorkflow.label.attachedFiles")}{this.state.fields.fieldfileAttach.isRequired ? <span className="text-danger">{" (*)"}</span> : ''}</Tab>
                                                <Tab>{t("odWorkflow:odWorkflow.label.linkCode")}</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <div className="animated fadeIn">
                                                    <CustomReactTableLocal
                                                        columns={actionHistory.columns}
                                                        data={this.state.selectedData.odHistoryDTO}
                                                        loading={false}
                                                        defaultPageSize={10}
                                                    />
                                                </div>
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="animated fadeIn">
                                                    <Col xs="12" sm="12" className={!this.state.fields.fieldfileAttach.isVisible || !this.state.fields.fieldfileAttach.editable ? "class-hidden" : ""}>
                                                        <Dropzone onDrop={this.handleDrop} className="pb-2" allowGlobalDrops={false} />
                                                    </Col>
                                                    <Col xs="12" sm="12">
                                                        <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                            <ListGroup>
                                                                {filesShow.map((item, index) => (
                                                                    <ListGroupItem key={'item-' + index} style={{height: '2.5em'}} className="d-flex align-items-center">
                                                                        {this.state.fields.fieldfileAttach.editable ?
                                                                        <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                                        : ''}
                                                                        {item.odFileId ? <Button color="link" onClick={() => this.downloadFile(item)}>{item.fileName}</Button>
                                                                        : <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>}
                                                                    </ListGroupItem>
                                                                ))}
                                                            </ListGroup>
                                                        </div>
                                                    </Col>
                                                </div>
                                            </TabPanel>
                                            <TabPanel>
                                                <div className="animated fadeIn">
                                                    <CustomReactTableLocal
                                                        columns={linkCode.columns}
                                                        data={this.state.selectedData.lstOdRelation}
                                                        loading={false}
                                                        defaultPageSize={5}
                                                    />
                                                </div>
                                            </TabPanel>
                                        </Tabs>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </AvForm>
                </div>
                <div className="animated fadeIn">
                </div>
                <TheSignModal
                    closeTheSignModal={this.closeTheSignModal}
                    theSignResult={this.onTheSignResult}
                    stateTheSignModal={this.state} />
            </div>
        );
    }
}

OdWorkflowDetail.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { odWorkflow, common, odType } = state;
    return {
        response: { odWorkflow, common, odType }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdWorkflowActions, commonActions, odTypeActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdWorkflowDetail));