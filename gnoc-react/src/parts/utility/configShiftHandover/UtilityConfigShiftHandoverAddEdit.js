import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigShiftHandoverActions from './UtilityConfigShiftHandoverActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomDatePicker, CustomAutocomplete } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, Dropzone } from '../../../containers/Utils/Utils';

class UtilityConfigShiftHandoverAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleOnChangeValueShiftTime = this.handleOnChangeValueShiftTime.bind(this);
        this.handleItemSelectShift = this.handleItemSelectShift.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);
        this.handleDataCheckboxWorkShift = this.handleDataCheckboxWorkShift.bind(this);
        this.handleDataCheckboxCR = this.handleDataCheckboxCR.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.typingShiftUser = 0;
        this.typingShiftWork = 0;
        this.typingShiftCr = 0;
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            kpiList: props.parentState.kpiList,
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            userShiftList: [],
            shiftHandOvertUser: {
                loading: true,
                columns: this.buildTableShiftHandOverUserColumns()
            },
            workShiftList: [],
            workShift: {
                loading: true,
                columns: this.buildTableWorkShiftColumns()
            },
            receiveTicketList: [],
            receiveTicket: {
                loading: true,
                columns: this.buildTableReceiveTicketColumns()
            },
            crList: [],
            crTable: {
                loading: true,
                columns: this.buildTableCrColumns()
            },
            //Select
            statusList: [
                { itemId: 0, itemName: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.waitingShift") },
                { itemId: 1, itemName: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.handOverShift") },
            ],
            shiftListSelect: [],
            selectValueStatus: {},
            selectValueShift: {},
            disable: false,
            selectValueShiftTime: null,
            files: [],
            dataChecked: [],
            dataCheckedWorkShift: [],
            dataCheckedCR: [],
            selectValueHandOverShiftUser: {},
            selectValueTakeShiftUser: {},
            disabledForAll: false,
            delCrList: [],
            delUserList: [],
            delWorkList: [],
            status : 0
        };
    }


    componentDidMount() {
        this.props.actions.getItemMaster("GNOC_SHIFT", "itemId", "itemName", "1", "3");
        this.onAddReceiveTicket();
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY' || this.state.isAddOrEdit === 'DETAIL') {

            let tempWorkList = this.state.selectedData.shiftWorkDTOList.map((item, index) => ({
                ...item,
                workId: 'EDIT' + index,
                startTime: item.startTime ? new Date(item.startTime) : null,
                deadline: item.deadLine ? new Date(item.deadLine) : null,
                isDeleteShiftWork: false
            }));
            let tempUserList = this.state.selectedData.shiftStaftDTOList.map((item, index) => ({
                ...item,
                tempId: 'EDIT' + index,
                assignUser: { value: item.assignUserId },
                receiverUser: { value: item.receiveUserId },
                isDeleteShiftStaft: false
            }));
            let tempCrList = this.state.selectedData.shiftCrDTOList.map((item, index) => ({
                ...item,
                crId: 'EDIT' + index,
                isDeleteShiftCr: false
            }))
            this.setState({
                status : this.state.selectedData.status,
                disable: true,
                selectValueShift: this.state.selectedData.shiftId ? { value: this.state.selectedData.shiftId } : "",
                selectValueShiftTime: this.state.selectedData.createdTime ? new Date(this.state.selectedData.createdTime) : new Date(),
                files: this.state.selectedData.commonFileDTOList || [],
                userShiftList: tempUserList,
                workShiftList: tempWorkList,
                crList: tempCrList,
            })
            if (this.state.isAddOrEdit === 'DETAIL') {
                this.setState({
                    disabledForAll: true
                })
            }
        }
    }
    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            disable: false,
            disabledForAll: false,
        });
    }

    onAddReceiveTicket() {
        const data = [...this.state.receiveTicketList]
        const kpiList = this.state.kpiList
        for (let i = 0; i < kpiList.length; i++) {
            if (i < 2)
                data.push({
                    ticketId: i,
                    kpiName: kpiList[i].itemName,
                    disabled: false,
                    emergency: 0,
                    serious: 0,
                    medium: 0,
                    total: 0
                })
            else {
                data.push({
                    ticketId: i,
                    kpiName: kpiList[i].itemName,
                    disabled: true
                })
            }
        }
        let tempItList = [];
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY" || this.state.isAddOrEdit === "DETAIL") {
            const itDTO = this.state.selectedData.shiftItDTOList;
            tempItList = data.map((item, index) => ({
                ...item,
                ticketId: index,
                emergency: (itDTO[index] && itDTO[index].emergency) || "0",
                serious: (itDTO[index] && itDTO[index].serious) || "0",
                medium: (itDTO[index] && itDTO[index].medium) || "0",
                total: (((itDTO[index] && itDTO[index].emergency) || 0) + ((itDTO[index] && itDTO[index].serious) || 0) + ((itDTO[index] && itDTO[index].medium) || 0)) || "0"
            }));
        }
        this.setState({
            receiveTicketList: this.state.isAddOrEdit === "ADD" ? data : tempItList
        })
    }

    buildTableShiftHandOverUserColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.shiftUser" />,
                accessor: "assignUserId",
                Cell: ({ original }) => {
                    return (
                        <CustomAutocomplete
                            name={"assignUserId-" + original.tempId}
                            label={""}
                            placeholder={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.shiftUser")}
                            isRequired={true}
                            messageRequire={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.shiftUser")}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={(value) => this.handleItemSelectChangeHandOverShiftUser(value, original, 'assignUserId')}
                            selectValue={original.assignUser}
                            moduleName={"USERS"}
                            isOnlyInputSelect={true}
                            isHasChildren={true}
                            isDisabled={this.state.disabledForAll}
                        />
                    );
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.employeeShift" />,
                accessor: "receiveUserId",
                Cell: ({ original }) => {
                    return (
                        <CustomAutocomplete
                            name={"receiveUserId-" + original.tempId}
                            label={""}
                            placeholder={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.employeeShift")}
                            isRequired={true}
                            messageRequire={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.requiredEmployeeShift")}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={(value) => this.handleItemSelectChangeHandOverShiftUser(value, original, 'receiveUserId')}
                            selectValue={original.receiverUser}
                            moduleName={"USERS"}
                            isOnlyInputSelect={true}
                            isHasChildren={true}
                            isDisabled={this.state.disabledForAll}
                        />
                    );
                }
            }
            // {
            //     Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.manipulation" />,
            //     accessor: "manipulation",
            //     Cell: ({ original }) => {
            //         return <CustomAvField type="text" name={"custom-input-manipulation-" + original.tempId} value={(original && original.manipulation) ? original.manipulation : ""}
            //             isinputonly="true" onChange={(e) => this.onChangeRowUserShift(e.target.value, original)} required
            //             validate={{
            //                 required: { value: true, errorMessage: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.manipulation") }
            //             }} />;
            //     }
            // },
        ];
    }

    buildTableWorkShiftColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.workName" />,
                accessor: "workName",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-workName-" + original.workId} value={(original && original.workName) ? original.workName : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'workName')} required
                        disabled={this.state.disabledForAll}
                        validate={{
                            required: { value: true, errorMessage: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.workName") }
                        }} />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.startTime" />,
                accessor: "startTime",
                Cell: ({ original }) => {
                    return <CustomDatePicker
                        name={"startTime" + original.workId}
                        label={""}
                        isRequired={false}
                        messageRequire={""}
                        placeholder={""}
                        dateFormat="dd/MM/yyyy HH:mm:ss"
                        showTimeSelect={true}
                        timeFormat="hh:mm:ss"
                        selected={original.startTime}
                        handleOnChange={(value) => this.onChangeRowWorkShift(value, original, 'startTime')}
                        readOnly={this.state.disabledForAll}
                    />;
                }
            }
            , {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.deadline" />,
                accessor: "deadline",
                Cell: ({ original }) => {
                    return <CustomDatePicker
                        name={"deadline" + original.workId}
                        label={""}
                        isRequired={false}
                        messageRequire={""}
                        placeholder={""}
                        dateFormat="dd/MM/yyyy HH:mm:ss"
                        showTimeSelect={true}
                        timeFormat="hh:mm:ss"
                        selected={original.deadline}
                        handleOnChange={(value) => this.onChangeRowWorkShift(value, original, 'deadline')}
                        readOnly={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.owner" />,
                accessor: "owner",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-owner-" + original.workId} value={(original && original.owner) ? original.owner : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'owner')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.handle" />,
                accessor: "handle",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-handle-" + original.workId} value={(original && original.handle) ? original.handle : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'handle')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.importantLevel" />,
                accessor: "importantLevel",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-importantLevel-" + original.workId} value={(original && original.importantLevel) ? original.importantLevel : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'importantLevel')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.result" />,
                accessor: "result",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-result-" + original.workId} value={(original && original.result) ? original.result : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'result')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.nextWork" />,
                accessor: "nextWork",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-nextWork-" + original.workId} value={(original && original.nextWork) ? original.nextWork : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'nextWork')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.process" />,
                accessor: "process",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-process-" + original.workId} value={(original && original.process) ? original.process : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'process')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.contact" />,
                accessor: "contact",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-contact-" + original.workId} value={(original && original.contact) ? original.contact : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'contact')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.option" />,
                accessor: "opinion",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-opinion-" + original.workId} value={(original && original.opinion) ? original.opinion : ""}
                        onChange={(e) => this.onChangeRowWorkShift(e.target.value, original, 'opinion')}
                        disabled={this.state.disabledForAll}
                    />;
                }
            },
        ];
    }

    buildTableReceiveTicketColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.kpi" />,
                accessor: "kpiName",
                minWidth: 200,
                Cell: ({ original }) => {
                    return <span title={original.kpiName}>{original.kpiName}</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.emergency" />,
                accessor: "emergency",
                minWidth: 50,
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-emergency-" + original.ticketId} value={(original && original.emergency) ? original.emergency : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowTicket(e.target.value, original, 'emergency')} disabled={original.disabled || this.state.disabledForAll}
                        validate={{
                            pattern: { value: "^[0-9]{1,10}([.][0-9]{1,2})?$", errorMessage: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.numberType") }
                        }} />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.serious" />,
                accessor: "serious",
                minWidth: 50,
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-serious-" + original.ticketId} value={(original && original.serious) ? original.serious : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowTicket(e.target.value, original, 'serious')} disabled={original.disabled || this.state.disabledForAll}
                        validate={{
                            pattern: { value: "^[0-9]{1,10}([.][0-9]{1,2})?$", errorMessage: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.numberType") }
                        }}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.medium" />,
                accessor: "medium",
                minWidth: 50,
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-medium-" + original.ticketId} value={(original && original.medium) ? original.medium : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowTicket(e.target.value, original, 'medium')} disabled={original.disabled || this.state.disabledForAll}
                        validate={{
                            pattern: { value: "^[0-9]{1,10}([.][0-9]{1,2})?$", errorMessage: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.numberType") }
                        }}
                    />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.total" />,
                accessor: "total",
                minWidth: 50,
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-total-" + original.ticketId} value={(original && original.total) ? original.total : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowTicket(e.target.value, original, 'total')} disabled />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.note" />,
                accessor: "note",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-note-" + original.ticketId} value={(original && original.note) ? original.note : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowTicket(e.target.value, original, 'note')} disabled={this.state.disabledForAll} />;
                }
            },
        ];
    }

    buildTableCrColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.crNumber" />,
                accessor: "crNumber",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-crNumber-" + original.crId} value={(original && original.crNumber) ? original.crNumber : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowCr(e.target.value, original, 'crNumber')} required
                        validate={{
                            required: { value: true, errorMessage: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.crNumber") },
                        }}
                        disabled={this.state.disabledForAll} />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.crName" />,
                accessor: "crName",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-crName-" + original.crId} value={(original && original.crName) ? original.crName : ""}
                        isinputonly="true" onChange={(e) => this.onChangeRowCr(e.target.value, original, 'crName')} required
                        validate={{
                            required: { value: true, errorMessage: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.crName") },
                        }}
                        disabled={this.state.disabledForAll} />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.userAction" />,
                accessor: "userCheckName",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-userCheckName-" + original.crId} value={(original && original.userCheckName) ? original.userCheckName : ""}
                        onChange={(e) => this.onChangeRowCr(e.target.value, original, 'userCheckName')}
                        disabled={this.state.disabledForAll} />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.result" />,
                accessor: "result",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-result-" + original.crId} value={(original && original.result) ? original.result : ""}
                        onChange={(e) => this.onChangeRowCr(e.target.value, original, 'status')}
                        disabled={this.state.disabledForAll} />;
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.note" />,
                accessor: "note",
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"custom-input-note-" + original.crId} value={(original && original.note) ? original.note : ""}
                        onChange={(e) => this.onChangeRowCr(e.target.value, original, 'note')}
                        disabled={this.state.disabledForAll} />;
                }
            },
        ];
    }

    onChangeRowUserShift(newValue, object) {
        if (this.typingShiftUser) {
            clearTimeout(this.typingShiftWork)
        }
        this.typingShiftUser = setTimeout(() => {
            const userShiftList = [...this.state.userShiftList];
            for (const obj of userShiftList) {
                if (obj.tempId === object.tempId) {
                    obj.manipulation = newValue;
                    break;
                }
            }
            this.setState({
                userShiftList
            });
        }, 300)
    }

    onChangeRowWorkShift(newValue, object, fieldName) {
        if (this.typingShiftWork) {
            clearTimeout(this.typingShiftWork)
        }
        this.typingShiftWork = setTimeout(() => {
            const workShiftList = [...this.state.workShiftList];
            for (const obj of workShiftList) {
                if (obj.workId === object.workId) {
                    obj[fieldName] = newValue;
                    break;
                }
            }
            this.setState({
                workShiftList
            });
        }, 300)
    }

    onChangeRowTicket(newValue, object, fieldName) {
        const rc = [...this.state.receiveTicketList];
        const convert = this.convert
        for (let i = 0; i < rc.length; i++) {
            if (rc[i].ticketId === object.ticketId) {
                if (fieldName === 'emergency') {
                    rc[i].total = (convert(newValue) + convert(rc[i].serious) + convert(rc[i].medium)) || "0";
                } else if (fieldName === 'serious') {
                    rc[i].total = (convert(newValue) + convert(rc[i].emergency) + convert(rc[i].medium)) || "0";
                } else if (fieldName === 'medium') {
                    rc[i].total = (convert(newValue) + convert(rc[i].emergency) + convert(rc[i].serious)) || "0";
                }
                rc[i][fieldName] = newValue;
                if (object.ticketId === 0) {
                    rc[3][fieldName] = convert(convert(rc[0][fieldName]) + convert(rc[2][fieldName])) || "0";
                    rc[9][fieldName] = convert(convert(rc[3][fieldName]) + convert(rc[4][fieldName])) || "0";
                    rc[10][fieldName] = Math.floor(convert(convert(rc[7][fieldName]) / convert(rc[3][fieldName]))) || "0";
                    rc[3].total = convert(rc[3].emergency) + convert(rc[3].serious) + convert(rc[3].medium) || "0";
                    rc[9].total = convert(rc[9].emergency) + convert(rc[9].serious) + convert(rc[9].medium) || "0";
                    rc[10].total = convert(rc[10].emergency) + convert(rc[10].serious) + convert(rc[10].medium) || "0";
                }
                break;
            }
        }
        console.log(rc)
        this.setState({
            receiveTicketList: rc
        });
    }

    convert(value) {
        return parseFloat(value) || 0;
    }

    onChangeRowCr(newValue, object, fieldName) {
        if (this.typingShiftCr) {
            clearTimeout(this.typingShiftCr)
        }
        this.typingShiftCr = setTimeout(() => {
            const crList = [...this.state.crList];
            for (const obj of crList) {
                if (obj.crId === object.crId) {
                    obj[fieldName] = newValue;
                    break;
                }
            }
            this.setState({
                crList
            });
        }, 300)
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityConfigShiftHandover = Object.assign({}, values);
            utilityConfigShiftHandover.userName = values.userName ? values.userName.trim() : "";
            utilityConfigShiftHandover.userId = JSON.parse(localStorage.getItem("user")).userID;
            utilityConfigShiftHandover.unitName = values.unitName ? values.unitName.trim() : "";
            utilityConfigShiftHandover.unitId = JSON.parse(localStorage.getItem("user")).deptId;
            utilityConfigShiftHandover.createdTime = this.state.selectValueShiftTime ? this.state.selectValueShiftTime : new Date();
            utilityConfigShiftHandover.lastUpdateTime = new Date();
            utilityConfigShiftHandover.shiftId = this.state.selectValueShift ? parseInt(this.state.selectValueShift.value) : "";
            utilityConfigShiftHandover.shiftName = this.state.selectValueShift ? this.state.selectValueShift.label : "";
            utilityConfigShiftHandover.shiftStaftDTOList = this.state.userShiftList.concat(this.state.delUserList);
            utilityConfigShiftHandover.shiftWorkDTOList = this.state.workShiftList.concat(this.state.delWorkList);
            utilityConfigShiftHandover.shiftItDTOList = this.state.receiveTicketList;
            utilityConfigShiftHandover.shiftCrDTOList = this.state.crList.concat(this.state.delCrList);
            utilityConfigShiftHandover.status = this.state.status;
            console.log(utilityConfigShiftHandover)
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityConfigShiftHandover(this.state.files, utilityConfigShiftHandover).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityConfigShiftHandover.id = this.state.selectedData.id;
                utilityConfigShiftHandover.shiftHandoverFileDTO = this.state.selectedData.shiftHandoverFileDTO || [];
                this.props.actions.editUtilityConfigShiftHandover(this.state.files, utilityConfigShiftHandover).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.error.edit"));
                        }
                    });
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked: data
        });
    }

    handleDataCheckboxWorkShift(data) {
        this.setState({
            dataCheckedWorkShift: data
        })
    }

    handleDataCheckboxCR(data) {
        this.setState({
            dataCheckedCR: data
        })
    }

    handleOnChangeValueShiftTime(option) {
        this.setState({
            selectValueShiftTime: option
        })
    }

    handleItemSelectShift(option) {
        this.setState({
            selectValueShift: option
        })
        if (option && option.subValue) {
            let obj = {};
            obj.unitId = JSON.parse(localStorage.getItem("user")).deptId;
            obj.createdTime = this.state.selectValueShiftTime ? this.state.selectValueShiftTime : new Date();
            obj.shiftValue = option.subValue
            this.props.actions.countTicketByShift(obj).then((response) => {
                let tempList = response.payload.data.map((item, index) => (
                    {
                        ...item,
                        ticketId: index,
                        disabled: index < 2 ? false : true,
                        emergency: item.emergency ? item.emergency + "" : "0",
                        serious: item.serious ? item.serious + "" : "0",
                        medium: item.medium ? item.medium + "" : "0",
                        total: item.total ? item.total + "" : "0"
                    }
                ));
                this.setState({
                    receiveTicketList: tempList || []
                })
            })
        }
    }

    handleItemSelectChangeHandOverShiftUser(option, object, fieldName) {
        const userShiftList = [...this.state.userShiftList];
        for (const obj of userShiftList) {
            if (obj.tempId === object.tempId) {
                if (fieldName === 'assignUserId') {
                    obj.assignUser = option
                } else if (fieldName === 'receiveUserId') {
                    obj.receiverUser = option
                }
                obj[fieldName] = option && option.value;
                break;
            }
        }
        this.setState({
            userShiftList
        });
    }

    handleItemSelectChangeHandleEmployeeShift(option) {
        this.setState({
            selectValueEmployeeShift: option
        })
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            const arr = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rar', 'zip', '7z', 'jpg', 'gif', 'png', 'bmp', 'sql']
            if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                if (item.size <= 40894464) {
                    if (!this.state.files.some(el => el.path === item.path)) {
                        this.setState({ files: [...this.state.files, item] });
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileSize"));
                }
            } else {
                toastr.error(this.props.t("common:common.message.error.fileFormat"));
            }
        });
    }

    removeFile(item) {
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    addShiftUser() {
        const objAdd = {};
        let tempId = this.state.userShiftList.length;
        for (const obj of this.state.userShiftList) {
            if(tempId === obj.tempId) {
                tempId ++;
            }
        }
        objAdd.tempId = tempId;
        objAdd.assignUser = null
        objAdd.receiverUser = null
        objAdd.isDeleteShiftStaft = false
        this.setState({
            userShiftList: [...this.state.userShiftList, objAdd]
        });
    }

    removeShiftUser(dataChecked) {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.userShiftList];
        let delUserList = []
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.tempId !== element.tempId);
            if (typeof element.tempId !== "number") {
                element.isDeleteShiftStaft = true
                delUserList.push(element)
            }
        });
        this.setState({
            userShiftList: listTemp,
            dataChecked: [],
            delUserList
        });
    }

    addWorkShift() {
        const objAdd = {};
        let workId = this.state.workShiftList.length;
        for (const obj of this.state.workShiftList) {
            if(workId === obj.workId) {
                workId ++;
            }
        }
        objAdd.workId = workId;
        objAdd.isDeleteShiftWork = false;
        this.setState({
            workShiftList: [...this.state.workShiftList, objAdd]
        });
    }

    removeWorkShift(dataCheckedWorkShift) {
        if (dataCheckedWorkShift.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.workShiftList];
        let delWorkList = [];
        dataCheckedWorkShift.forEach(element => {
            listTemp = listTemp.filter(el => el.workId !== element.workId);
            if (typeof element.workId !== "number") {
                element.isDeleteShiftWork = true
                delWorkList.push(element)
            }
        });
        this.setState({
            workShiftList: listTemp,
            dataCheckedWorkShift: [],
            delWorkList
        });
    }

    addCR() {
        const objAdd = {};
        let crId = this.state.crList.length;
        for (const obj of this.state.crList) {
            if(crId === obj.crId) {
                crId ++;
            }
        }
        objAdd.crId = crId;
        objAdd.isDeleteShiftCr = false;
        this.setState({
            crList: [...this.state.crList, objAdd]
        });
    }

    removeCR(dataCheckedCR) {
        if (dataCheckedCR.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.crList];
        let delCrList = []
        dataCheckedCR.forEach(element => {
            listTemp = listTemp.filter(el => el.crId !== element.crId);
            if (typeof element.crId !== "number") {
                element.isDeleteShiftCr = true
                delCrList.push(element)
            }
        });
        this.setState({
            crList: listTemp,
            dataCheckedCR: [],
            delCrList
        });
    }

    downloadFileByPath(data) {
        this.props.actions.onDownloadFileByPath('stream', data).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

    onDownloadWorkOrCrList(name) {
        let path = "";
        if (name === "work") {
            path = "EXPORT_SHIFT_HANDOVER_WORK_LIST"
        }
        if (name === "cr") {
            path = "EXPORT_SHIFT_HANDOVER_CR_LIST"
        }
        this.props.actions.onExportFile("stream", path, { shiftHandoverId: this.state.selectedData.id }).then((response) => {
            this.setState({ btnExportLoading: false });
            toastr.success(this.props.t("common:common.message.success.export"));
        }).catch((response) => {
            this.setState({ btnExportLoading: false });
            toastr.error(this.props.t("common:common.message.error.export"));
        });
    }


    render() {
        const { t } = this.props;
        const { disable, files, shiftHandOvertUser, userShiftList, workShift, workShiftList, receiveTicket, receiveTicketList, disabledForAll, isAddOrEdit } = this.state;
        const { crList, crTable, dataChecked, dataCheckedWorkShift, dataCheckedCR } = this.state;
        const shiftList = (this.props.response.common.gnocShift && this.props.response.common.gnocShift.payload) ? this.props.response.common.gnocShift.payload.data.data : []
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let temp = JSON.parse(localStorage.getItem("user"))
        objectAddOrEdit.userName = temp.userName;
        objectAddOrEdit.unitName = temp.deptName;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(isAddOrEdit === "ADD" || isAddOrEdit === "COPY") ? "fa fa-plus-circle"
                                            : "fa fa-edit"}></i>{(isAddOrEdit === "ADD" || isAddOrEdit === "COPY") ? t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.utilityConfigShiftHandoverAdd")
                                                : isAddOrEdit === "EDIT" ? t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.utilityConfigShiftHandoverEdit")
                                                    : isAddOrEdit === "DETAIL" ? t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.utilityConfigShiftHandoverDetail")
                                                        : ''}
                                        < div className="card-header-actions card-header-actions-button">
                                            {isAddOrEdit !== "DETAIL" ?
                                                <LaddaButton type="submit"
                                                    className="btn btn-primary btn-md mr-1"
                                                    loading={this.state.btnAddOrEditLoading}
                                                    data-style={ZOOM_OUT}>
                                                    <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                                                </LaddaButton>
                                                : null}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>

                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{(isAddOrEdit === "ADD" || isAddOrEdit === "COPY") ? t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.insertConfig")
                                                            : isAddOrEdit === "EDIT" ? t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.editConfig")
                                                                : isAddOrEdit === "DETAIL" ? t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.detailConfig") : ""}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="3">
                                                                <CustomAvField name="userName" label={t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.shiftUser")} placeholder={t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.shiftUser")} required
                                                                    autoFocus maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.requiredODcode") } }} disabled />
                                                            </Col>
                                                            <Col xs="12" sm="3">
                                                                <CustomAvField name="unitName" label={t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.shiftUnit")} placeholder={t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.shiftUnit")} required
                                                                    autoFocus maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.requiredODcode") } }} disabled />
                                                            </Col>
                                                            <Col xs="12" sm="3">
                                                                <CustomDatePicker
                                                                    name={"shiftTime"}
                                                                    label={t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.shiftTime")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.shiftTime")}
                                                                    placeholder={t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.shiftTime")}
                                                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                    showTimeSelect={true}
                                                                    timeFormat="hh:mm:ss"
                                                                    selected={this.state.selectValueShiftTime}
                                                                    handleOnChange={this.handleOnChangeValueShiftTime}
                                                                    readOnly={this.state.disabledForAll}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="3">
                                                                <CustomSelectLocal
                                                                    name={"shift"}
                                                                    label={t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.shift")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.required.shift")}
                                                                    options={shiftList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectShift}
                                                                    selectValue={this.state.selectValueShift}
                                                                    isDisabled={disable}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="12">
                                                                {isAddOrEdit !== "DETAIL" ? <Dropzone onDrop={this.handleDrop} className="pb-2" /> : <span></span>}
                                                            </Col>
                                                            <Col xs="12" sm="12">
                                                                <div className="mt-2">
                                                                    <ListGroup>
                                                                        {files.map(item => (
                                                                            <ListGroupItem key={item.path} style={{ height: '2.5em' }} className="d-flex align-items-center">
                                                                                <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle" hidden={disabledForAll}></i> </span>
                                                                                <Button color="link" onClick={() => this.downloadFileByPath({ filePath: item.path })}>{item.fileName || item.name}</Button>
                                                                            </ListGroupItem>
                                                                        ))}
                                                                    </ListGroup>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <div style={{ float: 'left' }}>
                                                            <span style={{ position: 'absolute' }} className="mt-1">
                                                                {t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.shiftUser")}
                                                            </span>
                                                        </div>
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.addShiftUser()} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.add")} hidden={disabledForAll}><i className="fa fa-plus"></i></Button>
                                                            <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.removeShiftUser(dataChecked)} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.remove")} hidden={disabledForAll}><i className="fa fa-close"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomReactTableLocal
                                                                    columns={shiftHandOvertUser.columns}
                                                                    data={userShiftList}
                                                                    loading={false}
                                                                    defaultPageSize={5}
                                                                    showPagination={true}
                                                                    isContainsAvField={true}
                                                                    isCheckbox={true}
                                                                    propsCheckbox={["tempId"]}
                                                                    handleDataCheckbox={this.handleDataCheckbox}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <Row>
                                                    <Col xs="12" sm="12">
                                                        <Card>
                                                            <CardHeader>
                                                                <div style={{ float: 'left' }}>
                                                                    <span style={{ position: 'absolute' }} className="mt-1">
                                                                        {t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.workShift")}
                                                                    </span>
                                                                </div>
                                                                <div className="card-header-actions card-header-search-actions-button">
                                                                    <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.addWorkShift()} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.add")} hidden={disabledForAll}><i className="fa fa-plus"></i></Button>
                                                                    <Button type="button" className="custom-btn btn-pill mr-2" color="secondary" onClick={() => this.removeWorkShift(dataCheckedWorkShift)} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.remove")} hidden={disabledForAll}><i className="fa fa-close"></i></Button>
                                                                    {(isAddOrEdit === "EDIT" || isAddOrEdit === "COPY" || isAddOrEdit === "DETAIL") ?
                                                                        <Button type="button" className="custom-btn btn-pill" color="success" onClick={() => this.onDownloadWorkOrCrList('work')} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.download")}><i className="fa fa-download"></i></Button>
                                                                        : null}
                                                                </div>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col xs="12" sm="12">
                                                                        <CustomReactTableLocal
                                                                            columns={workShift.columns}
                                                                            data={workShiftList}
                                                                            loading={false}
                                                                            defaultPageSize={6}
                                                                            showPagination={true}
                                                                            isContainsAvField={true}
                                                                            isCheckbox={true}
                                                                            propsCheckbox={["workId"]}
                                                                            handleDataCheckbox={this.handleDataCheckboxWorkShift}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                        <Card>
                                                            <CardHeader>
                                                                {t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.receiveTicket")}
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col xs="12" sm="12">
                                                                        <CustomReactTableLocal
                                                                            columns={receiveTicket.columns}
                                                                            data={receiveTicketList}
                                                                            loading={false}
                                                                            defaultPageSize={11}
                                                                            showPagination={true}
                                                                            isContainsAvField={true}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                        <Card>
                                                            <CardHeader>
                                                                <div style={{ float: 'left' }}>
                                                                    <span style={{ position: 'absolute' }} className="mt-1">
                                                                        {t("utilityConfigShiftHandover:utilityConfigShiftHandover.title.cr")}
                                                                    </span>
                                                                </div>
                                                                <div className="card-header-actions card-header-search-actions-button">
                                                                    <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.addCR()} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.add")} hidden={disabledForAll}><i className="fa fa-plus"></i></Button>
                                                                    <Button type="button" className="custom-btn btn-pill mr-2" color="secondary" onClick={() => this.removeCR(dataCheckedCR)} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.remove")} hidden={disabledForAll}><i className="fa fa-close"></i></Button>
                                                                    {(isAddOrEdit === "EDIT" || isAddOrEdit === "COPY" || isAddOrEdit === "DETAIL") ?
                                                                        <Button type="button" className="custom-btn btn-pill" color="success" onClick={() => this.onDownloadWorkOrCrList('cr')} title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.download")}><i className="fa fa-download"></i></Button>
                                                                        : null}
                                                                </div>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <Row>
                                                                    <Col xs="12" sm="12">
                                                                        <CustomReactTableLocal
                                                                            columns={crTable.columns}
                                                                            data={crList}
                                                                            loading={false}
                                                                            defaultPageSize={6}
                                                                            showPagination={true}
                                                                            isContainsAvField={true}
                                                                            isCheckbox={true}
                                                                            propsCheckbox={["crId"]}
                                                                            handleDataCheckbox={this.handleDataCheckboxCR}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div >
        );
    }
}

UtilityConfigShiftHandoverAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigShiftHandover, common } = state;
    return {
        response: { utilityConfigShiftHandover, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigShiftHandoverActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigShiftHandoverAddEdit));