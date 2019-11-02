import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as ptProblemActions from './PtProblemActions';
import * as ptConfigActions from '../config/PtConfigActions';
import * as KedbManagementActions from '../../kedb/management/KedbManagementActions';
import { CustomAvField, CustomSticky, CustomInputPopup, CustomFroalaEditor, CustomAutocomplete , CustomSelect, CustomSelectLocal, CustomDatePicker, CustomRcTreeSelect } from '../../../containers/Utils';
import { convertModelFroalaEditor } from "../../../containers/Utils/Utils";
import PtProblemEditInfoTabRelatedPtPopup from "./PtProblemEditInfoTabRelatedPtPopup";
import PtProblemEditInfoTabRelatedTtPopup from "./PtProblemEditInfoTabRelatedTtPopup";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class PtProblemEditInfoTab extends Component {
    constructor(props) {
        super(props);

        this.toggleFormDetailAdvance = this.toggleFormDetailAdvance.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.handleModelChangeDescription = this.handleModelChangeDescription.bind(this);
        this.handleModelChangeRca = this.handleModelChangeRca.bind(this);
        this.handleModelChangeWa = this.handleModelChangeWa.bind(this);
        this.handleModelChangeSolution = this.handleModelChangeSolution.bind(this);

        this.handleChangeCreatedTime = this.handleChangeCreatedTime.bind(this);
        this.handleItemSelectChangePriority = this.handleItemSelectChangePriority.bind(this);
        this.handleItemSelectChangeLocation = this.handleItemSelectChangeLocation.bind(this);
        this.handleItemSelectChangeReceiveUserId = this.handleItemSelectChangeReceiveUserId.bind(this);
        this.handleItemSelectChangeTypeId = this.handleItemSelectChangeTypeId.bind(this);
        this.handleItemSelectChangeVendor = this.handleItemSelectChangeVendor.bind(this);
        this.handleItemSelectChangeProblemState = this.handleItemSelectChangeProblemState.bind(this);
        this.handleItemSelectChangeSubCategoryId = this.handleItemSelectChangeSubCategoryId.bind(this);
        this.handleItemSelectChangePtRelatedType = this.handleItemSelectChangePtRelatedType.bind(this);
        this.handleItemSelectChangeCategorization = this.handleItemSelectChangeCategorization.bind(this);
        this.handleItemSelectChangeCloseCode = this.handleItemSelectChangeCloseCode.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            ptProblem: props.parentState.selectedData,
            isOpenPopupRelatedPtSearch: false,
            isOpenPopupRelatedTtSearch: false,
            isOpenPopupAddEdit: false,
            isAddOrEdit: null,
            btnAddOrEditLoading: false,
            //Select
            selectValuePriorityId: {},
            selectValuePmGroup: {},
            selectValueTypeId: {},
            // selectValueNation: {},
            selectValueLocation: {},
            selectValueCategorization: {},
            selectValueSubCategoryId: {},
            // selectValueZone: {},
            // selectValueCity: {},
            selectValueReceiveUserId: {},
            selectValueVendor: {},
            selectValueProblemState: {},
            selectValueReceiveUnitId: {},
            selectValueSolutionType: {},
            selectValueCloseCode: {},
            selectValuePtRelatedType: {},
            selectValueSoftwareVersion: {value: null},
            selectValueHardwareVersion: {value: null},
            createdTime: null,
            deferredTime: null,
            esRcaTime: null,
            esSlTime: null,
            esWaTime: null,
            selectValueRcaType: null,
            //Text editor
            modelDescription: null,
            modelRca: null,
            modelWa: null,
            modelSolution: null,
            //combobox list
            nodeTypeList: [],
            listStatusNext: [],
            softwareList: [],
            hardwareList: [],
            vendorList: [],
            fieldsRequired: this.buildFieldsRequired(),
            fieldsReadOnly: {
                esRcaTime: false,
                esSlTime: false,
                esWaTime: false,
                ptRelatedType: false,
                priority: false,
                type: false,
                deferredTime: true,
                receiveUnit: true,
                receiveUser: true
            },
            valuePt: "",
            valueTt: "",
            loopVersion: true,
            isPm: false,
            roleList: [],
            kedb: {}
        };
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    componentDidMount(){
        this.props.actions.getDetailPtProblem(this.state.selectedData.problemId).then((response) => {
            if (response.payload && response.payload.data) {
                this.setState({
                    selectedData: response.payload.data,
                    ptProblem: response.payload.data
                });
            } else {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.getDetail"));
            }
        });
        this.props.actions.getListRolePmByUser().then((response) => {
            if (response.payload && response.payload.data) {
                this.setState({
                    roleList: response.payload.data
                }, () => {
                    this.checkDisableField();
                });
                let roleList = [];
                for (const role of response.payload.data) {
                    roleList.push(role.roleId + "");
                }
                if (roleList.includes(this.state.selectedData.pmGroup + "")) {
                    this.setState({
                        isPm: true
                    }, () => {
                        this.getDisabledSave();
                    });
                } else {
                    this.getDisabledSave();
                }
            }
        });
        this.props.actions.getListKedb({page: 1, pageSize: 1, kedbCode: this.state.selectedData.relatedKedb}).then((response) => {
            this.setState({
                kedb: response.payload.data.data[0]
            });
        });
        //get combobox
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_CATE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_PRIORITY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("VENDOR", "itemId", "itemName", "1", "3").then((response) => {
            this.getDeviceType();
        });
        this.props.actions.getItemMaster("PT_CLOSE_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_SOLUTION_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_RELATED_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_STATE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("KEDB_STATE", "itemId", "itemName", "1", "3");
        this.getListStatusNext();
        this.setState({
            createdTime: this.state.selectedData.createdTime ? new Date(this.state.selectedData.createdTime) : null,
            deferredTime: this.state.selectedData.deferredTime ? new Date(this.state.selectedData.deferredTime) : null,
            modelDescription: this.state.selectedData.description,
            selectValueTypeId: this.state.selectedData.typeId ? { value: this.state.selectedData.typeId } : {},
            selectValueSubCategoryId: this.state.selectedData.subCategoryId ? { value: this.state.selectedData.subCategoryId } : {},
            selectValueCategorization: this.state.selectedData.categorization ? { value: this.state.selectedData.categorization } : {},
            selectValuePriorityId: this.state.selectedData.priorityId ? { value: this.state.selectedData.priorityId } : {},
            selectValueVendor: this.state.selectedData.vendor ? { value: this.state.selectedData.vendor } : {},
            selectValueProblemState: this.state.selectedData.problemState ? { value: this.state.selectedData.problemState } : {},
            selectValuePmGroup: this.state.selectedData.pmGroup ? { value: this.state.selectedData.pmGroup } : {},
            selectValueLocation: this.state.selectedData.locationId ? { value: this.state.selectedData.locationId, label: this.state.selectedData.location } : {},
            selectValueReceiveUnitId: this.state.selectedData.receiveUnitId ? { value: this.state.selectedData.receiveUnitId } : {},
            selectValueReceiveUserId: this.state.selectedData.receiveUserId ? { value: this.state.selectedData.receiveUserId } : {},
            selectValueSolutionType: this.state.selectedData.solutionType ? { value: this.state.selectedData.solutionType } : {},
            selectValueCloseCode: this.state.selectedData.closeCode ? { value: this.state.selectedData.closeCode } : {},
            selectValuePtRelatedType: this.state.selectedData.ptRelatedType ? { value: this.state.selectedData.ptRelatedType } : {},
            selectValueSoftwareVersion: this.state.selectedData.softwareVersion ? { value: this.state.selectedData.softwareVersion } : {},
            selectValueHardwareVersion: this.state.selectedData.hardwareVersion ? { value: this.state.selectedData.hardwareVersion } : {},
            selectValueRcaType: this.state.selectedData.rcaType ? { value: this.state.selectedData.rcaType } : null,
            valuePt: this.state.selectedData.relatedPt ? this.state.selectedData.relatedPt : "",
            valueTt: this.state.selectedData.relatedTt ? this.state.selectedData.relatedTt: "",
            modelRca: this.state.selectedData.rca ? this.state.selectedData.rca :  this.props.t("ptProblem:ptProblem.textEditorGuilde.reason"),
            modelWa: this.state.selectedData.wa ? this.state.selectedData.wa : this.props.t("ptProblem:ptProblem.textEditorGuilde.solutionTemp"),
            modelSolution: this.state.selectedData.solution ? this.state.selectedData.solution : this.props.t("ptProblem:ptProblem.textEditorGuilde.solution")
        });
        const arrState = ["PT_OPEN", "PT_OPEN_2", "PT_REJECTED", "PT_CLOSED", "PT_CANCELED"];
        const stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
        const state = stateList.find(item => item.itemId + "" === this.state.selectedData.problemState) || {};
        if (!arrState.includes(state.itemCode)) {
            this.setState({
                esRcaTime: this.state.selectedData.esRcaTime ? new Date(this.state.selectedData.esRcaTime) : null,
                esSlTime: this.state.selectedData.esSlTime ? new Date(this.state.selectedData.esSlTime) : null,
                esWaTime: this.state.selectedData.esWaTime ? new Date(this.state.selectedData.esWaTime) : null
            });
        }
        if(this.state.selectedData.typeId) {
            this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
                let nodeTypeList = [];
                for (const obj of response.payload.data.data) {
                    if(obj.parentItemId === this.state.selectedData.typeId) {
                        nodeTypeList.push(obj);
                    }
                }
                this.setState({
                    nodeTypeList
                });
            });
        }
        let stateList1 = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
        let itemCode = "";
        for (const obj of stateList1) {
            if(obj.itemId + "" === this.state.selectedData.problemState + "") {
                itemCode = obj.itemCode;
                break;
            }
        }
        const arrId = ['PT_OPEN', 'PT_OPEN_2', 'PT_REJECTED', 'PT_CLOSED', 'PT_CANCELED'];
        let fieldsRequired = this.buildFieldsRequired();
        if (!arrId.includes(itemCode)) {
            fieldsRequired.receiveUnit = true;
            fieldsRequired.esRcaTime = true;
            fieldsRequired.esWaTime = true;
            fieldsRequired.esSlTime = true;
        }
        if (itemCode === 'PT_UNASSIGNED') {
            fieldsRequired.receiveUser = true;
        }
        if(itemCode === 'PT_REQ_DEFERRED' || itemCode === 'PT_DEFERRED') {
            fieldsRequired.deferredTime = true;
        }
        if(itemCode === 'PT_ROOT_CAUSE_PROPOSAL') {
            fieldsRequired.softwareVersion = true;
            fieldsRequired.hardwareVersion = true;
            fieldsRequired.rca = true;
            fieldsRequired.rcaType = true;
        }
        if (itemCode === 'PT_OPEN' || itemCode === 'PT_OPEN_2') {
            fieldsRequired.receiveUnit = false;
        }
        if(itemCode === 'PT_DIAGNOSED') {
            fieldsRequired.rca = true;
            fieldsRequired.rcaType = true;
        }
        if(itemCode === 'PT_WORKARROUND_PROPOSAL' || itemCode === 'PT_WA_FOUND') {
            fieldsRequired.solutionType = true;
            fieldsRequired.wa = true;
        }
        if(itemCode === 'PT_SOLUTION_PROPOSAL' || itemCode === 'PT_SL_FOUND') {
            fieldsRequired.solutionType = true;
            fieldsRequired.solution = true;
        }
        if(itemCode === 'PT_CLOSED') {
            fieldsRequired.closeCode = true;
        }
        let ptCateList = (this.props.response.common.ptCate && this.props.response.common.ptCate.payload) ? this.props.response.common.ptCate.payload.data.data : [];
        let categorizationCode = "";
        for (const ptCate of ptCateList) {
            if (ptCate.itemId + "" === this.state.selectedData.categorization + "") {
                categorizationCode = ptCate.itemCode;
                break;
            }
        }
        if (categorizationCode.toLowerCase() === "Reactive".toLowerCase()) {
            fieldsRequired.tt = true;
        } else {
            fieldsRequired.tt = false;
        }
        let ptRelatedTypeList = (this.props.response.common.ptRelatedType && this.props.response.common.ptRelatedType.payload) ? this.props.response.common.ptRelatedType.payload.data.data : [];
        let relateTypeCode = "";
        for (const obj of ptRelatedTypeList) {
            if(obj.itemId === this.state.selectedData.ptRelatedType) {
                relateTypeCode = obj.itemCode;
                break;
            }
        }
        if(relateTypeCode === 'PT_CHILDREN' || relateTypeCode === 'PT_SECONDARY' || relateTypeCode === 'PT_DUPLICATED') {
            fieldsRequired.pt = true;
        } else {
            fieldsRequired.pt = false;
        }
        if(this.state.selectedData.esRcaTime != null && this.state.selectedData.esSlTime != null && this.state.selectedData.esWaTime != null) {
            if(new Date() > new Date(this.state.selectedData.esRcaTime) ||
            new Date() > new Date(this.state.selectedData.esSlTime) ||
            new Date() > new Date(this.state.selectedData.esWaTime)) {
                fieldsRequired.reasonOverdue = true;
            }
        }
        if (this.state.selectedData.ptRelatedType) {
            fieldsRequired.ptRelatedType = true;
        }
        this.setState({
            fieldsRequired
        });
    }

    componentDidUpdate() {
        if (this.state.loopVersion) {
            if (this.state.selectValueVendor.value || this.state.selectValueSubCategoryId.value) {
                this.getDeviceType();
                this.setState({
                    loopVersion: false
                });
            } else {
                this.setState({
                    loopVersion: false,
                    softwareList: [],
                    hardwareList: []
                });
            }
        }
    }

    checkDisableField = () => {
        let stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
        let itemCode = "";
        for (const obj of stateList) {
            if(obj.itemId + "" === this.state.selectedData.problemState + "") {
                itemCode = obj.itemCode;
                break;
            }
        }
        const fieldsReadOnly = Object.assign({}, this.state.fieldsReadOnly);
        if(itemCode === 'PT_REQ_DEFERRED' || itemCode === 'PT_DEFERRED') {
            fieldsReadOnly.deferredTime= false;
        } else {
            fieldsReadOnly.deferredTime= true;
        }
        if (((itemCode === 'PT_UNASSIGNED' || itemCode === 'PT_QUEUED')
        && JSON.parse(localStorage.user).userID === this.state.selectedData.pmId)
        || itemCode === 'PT_OPEN' || itemCode === 'PT_OPEN_2') {
            fieldsReadOnly.receiveUnit = false;
            fieldsReadOnly.receiveUser = false;
        } else {
            fieldsReadOnly.receiveUnit = true;
            fieldsReadOnly.receiveUser = true;
        }
        if (itemCode !== "PT_OPEN") {
            fieldsReadOnly.priority = true;
            fieldsReadOnly.type = true;
            if (this.state.roleList.length > 0 && (itemCode === "PT_OPEN_2" || itemCode === "PT_UNASSIGNED" || itemCode === "PT_QUEUED")) {
                fieldsReadOnly.priority = false;
            }
        } else {
            fieldsReadOnly.priority = false;
            fieldsReadOnly.type = false;
        }
        if (this.state.selectedData.closeCode + "" === "49") {
            fieldsReadOnly.ptRelatedType = true;
        } else {
            fieldsReadOnly.ptRelatedType = false;
        }
        this.setState({
            fieldsReadOnly
        });
    }
    
    getDeviceType = () => {
        let softwareList = [];
        let hardwareList = [];
        let vendorList = (this.props.response.common.vendor && this.props.response.common.vendor.payload) ? this.props.response.common.vendor.payload.data.data : [];
        let vendorId = null;
        for (const obj of vendorList) {
            if(obj.itemCode === this.state.selectValueVendor.value) {
                vendorId = obj.itemId;
                break;
            }
        }
        let objectVersion = {
            vendorId: vendorId,
            typeId : this.state.selectValueSubCategoryId.value
        }
        this.props.actions.getListDeviceTypeVersion(objectVersion).then((response) => {
            for (const obj of response.payload.data) {
                if(!softwareList.find((e) => e.itemId === obj.softwareVersion)) {
                    softwareList.push({ itemId: obj.softwareVersion, itemName: obj.softwareVersion });
                }
                if(!hardwareList.find((e) => e.itemId === obj.hardwareVersion)) {
                    hardwareList.push({ itemId: obj.hardwareVersion, itemName: obj.hardwareVersion });
                }
            }
            this.setState({
                softwareList,
                hardwareList,
            });
        })
    }

    buildFieldsRequired() {
        return {
            receiveUnit: false,
            receiveUser: false,
            esRcaTime: false,
            esWaTime: false,
            esSlTime: false,
            deferredTime: false,
            softwareVersion: false,
            hardwareVersion: false,
            rca: false,
            rcaType: false,
            solutionType: false,
            wa: false,
            solution: false,
            closeCode: false,
            reasonOverdue: false,
            pt: false,
            tt: false,
            ptRelatedType: false
        }
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.modelDescription.length > 4000) {
                this.setState({
                    btnAddOrEditLoading: false
                });
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.descriptionMaxLength"));
                return;
            }
            if (this.state.modelRca.length > 4000) {
                this.setState({
                    btnAddOrEditLoading: false
                });
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.rcaMaxLength"));
                return;
            }
            if (this.state.modelWa.length > 4000) {
                this.setState({
                    btnAddOrEditLoading: false
                });
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.waMaxLength"));
                return;
            }
            if (this.state.modelSolution.length > 4000) {
                this.setState({
                    btnAddOrEditLoading: false
                });
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.solutionMaxLength"));
                return;
            }
            if (this.state.fieldsRequired.esRcaTime && this.state.fieldsRequired.esWaTime && this.state.fieldsRequired.esSlTime) {
                if (this.state.esRcaTime < new Date()) {
                    toastr.warning(this.props.t("ptProblem:ptProblem.message.error.currentDate"));
                    this.setState({
                        btnAddOrEditLoading: false
                    });
                    return;
                }
                if (this.state.esRcaTime > this.state.esWaTime) {
                    toastr.warning(this.props.t("ptProblem:ptProblem.message.error.esWaTime"));
                    this.setState({
                        btnAddOrEditLoading: false
                    });
                    return;
                }
                if (this.state.esWaTime > this.state.esSlTime) {
                    toastr.warning(this.props.t("ptProblem:ptProblem.message.error.esSlTime"));
                    this.setState({
                        btnAddOrEditLoading: false
                    });
                    return;
                }
            }
            const stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
            let stateName = "";
            let stateCode = "";
            let stateCodeOld = "";
            let assignTime = null;
            let assignTimeTemp = null;
            for (const state of stateList) {
                if (state.itemId + "" === this.state.selectValueProblemState.value + "") {
                    stateName = state.itemName;
                    stateCode = state.itemCode;
                }
                if (state.itemId + "" === this.state.selectedData.problemState + "") {
                    stateCodeOld = state.itemCode;
                }
            }
            if ((stateCodeOld === "PT_OPEN" || stateCodeOld === "PT_OPEN_2") && stateCode === "PT_UNASSIGNED") {
                assignTime = new Date();
                assignTimeTemp = new Date();
            }
            if (stateCodeOld === "PT_UNASSIGNED" && stateCode === "PT_QUEUED") {
                assignTime = null;
                assignTimeTemp = new Date();
            }
            if (stateCodeOld === "PT_DEFERRED" && stateCode === "PT_QUEUED") {
                assignTime = null;
                assignTimeTemp = new Date();
            }
            if (stateCodeOld === "PT_WA_FOUND" && stateCode === "PT_DIAGNOSED") {
                assignTime = null;
                assignTimeTemp = new Date();
            }
            const ptProblem = Object.assign({}, this.state.selectedData, values);
            ptProblem.problemName = ptProblem.problemName.trim();
            ptProblem.relatedPt = this.state.valuePt;
            ptProblem.relatedTt = this.state.valueTt;
            ptProblem.categorization = this.state.selectValueCategorization ? this.state.selectValueCategorization.value : null;
            ptProblem.description = convertModelFroalaEditor(this.state.modelDescription);
            ptProblem.locationId = this.state.selectValueLocation ? this.state.selectValueLocation.value : null;
            ptProblem.location = this.state.selectValueLocation ? this.state.selectValueLocation.label : null;
            ptProblem.pmGroup = this.state.selectValuePmGroup ? this.state.selectValuePmGroup.value : null;
            ptProblem.priorityId = this.state.selectValuePriorityId ? this.state.selectValuePriorityId.value : null;
            ptProblem.problemState = this.state.selectValueProblemState ? this.state.selectValueProblemState.value : null;
            ptProblem.rca = convertModelFroalaEditor(this.state.modelRca);
            ptProblem.receiveUnitId = this.state.selectValueReceiveUnitId ? this.state.selectValueReceiveUnitId.value : null;
            ptProblem.solution = convertModelFroalaEditor(this.state.modelSolution);
            ptProblem.subCategoryId = this.state.selectValueSubCategoryId ? this.state.selectValueSubCategoryId.value : null;
            ptProblem.typeId = this.state.selectValueTypeId ? this.state.selectValueTypeId.value : null;
            ptProblem.vendor = this.state.selectValueVendor ? this.state.selectValueVendor.value : null;
            ptProblem.ptRelatedType = this.state.selectValuePtRelatedType ? this.state.selectValuePtRelatedType.value : null;
            ptProblem.wa = convertModelFroalaEditor(this.state.modelWa);

            ptProblem.receiveUserId = this.state.selectValueReceiveUserId ? this.state.selectValueReceiveUserId.value : null;
            ptProblem.receiveUnitId = this.state.selectValueReceiveUnitId ? this.state.selectValueReceiveUnitId.value : null;
            ptProblem.hardwareVersion = this.state.selectValueHardwareVersion ? this.state.selectValueHardwareVersion.value : null;
            ptProblem.softwareVersion = this.state.selectValueSoftwareVersion ? this.state.selectValueSoftwareVersion.value : null;
            ptProblem.solutionType = this.state.selectValueSolutionType ? this.state.selectValueSolutionType.value : null;
            ptProblem.rcaType = this.state.selectValueRcaType ? this.state.selectValueRcaType.value : null;
            ptProblem.closeCode = this.state.selectValueCloseCode ? this.state.selectValueCloseCode.value : null;
            ptProblem.createdTime = this.state.createdTime;
            ptProblem.deferredTime = this.state.deferredTime;
            ptProblem.esRcaTime = this.state.esRcaTime;
            ptProblem.esSlTime = this.state.esSlTime;
            ptProblem.esWaTime = this.state.esWaTime;
            ptProblem.assignTime = assignTime;
            ptProblem.assignTimeTemp = assignTimeTemp;
            ptProblem.problemsDTOOld = this.state.selectedData;
            ptProblem.stateName = stateName;
            ptProblem.stateCode = stateCode;
            ptProblem.reasonOverdue = ptProblem.reasonOverdue ? ptProblem.reasonOverdue.trim() : "";
            if (this.props.parentState.objectKedbTab && this.props.parentState.objectKedbTab.data) {
                if (this.props.parentState.objectKedbTab.data.length > 0) {
                    ptProblem.relatedKedb = this.props.parentState.objectKedbTab.data[0].kedbCode;
                }
            }

            if (stateCode === "PT_CLOSED") {
                const kedbStateList = (this.props.response.common.kedbState && this.props.response.common.kedbState.payload) ? this.props.response.common.kedbState.payload.data.data : [];
                let kedbStateId = "";
                for (const kedbState of kedbStateList) {
                    if (kedbState.itemCode === "KEDB_CLOSED") {
                        kedbStateId = kedbState.itemId;
                        break;
                    }
                }
                if (this.props.parentState.objectKedbTab && this.props.parentState.objectKedbTab.data) {
                    if (this.props.parentState.objectKedbTab.data.length > 0) {
                        this.props.actions.getListKedb({page: 1, pageSize: 1, kedbCode: this.props.parentState.objectKedbTab.data[0].kedbCode}).then((response) => {
                            const kedb = response.payload.data.data[0];
                            if (kedb.kedbState !== kedbStateId) {
                                toastr.warning(this.props.t("ptProblem:ptProblem.message.kedbClose"));
                                this.setState({
                                    btnAddOrEditLoading: false
                                });
                                return;
                            } else {
                                this.updatePtProblem(ptProblem);
                            }
                        });
                    } else {
                        toastr.warning(this.props.t("ptProblem:ptProblem.message.kedbClose"));
                        this.setState({
                            btnAddOrEditLoading: false
                        });
                    }
                } else if (this.state.selectedData.relatedKedb) {
                    this.props.actions.getListKedb({page: 1, pageSize: 1, kedbCode: this.state.selectedData.relatedKedb}).then((response) => {
                        const kedb = response.payload.data.data[0];
                        if (kedb.kedbState !== kedbStateId) {
                            toastr.warning(this.props.t("ptProblem:ptProblem.message.kedbClose"));
                            this.setState({
                                btnAddOrEditLoading: false
                            });
                            return;
                        } else {
                            this.updatePtProblem(ptProblem);
                        }
                    });
                } else {
                    this.updatePtProblem(ptProblem);
                }
            } else {
                this.updatePtProblem(ptProblem);
            }
        });
    }

    updatePtProblem = (ptProblem) => {
        this.props.actions.editPtProblem(ptProblem).then((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                if (response.payload.data.key === "SUCCESS") {
                    this.props.closePage("EDIT", true);
                    toastr.success(this.props.t("ptProblem:ptProblem.message.success.updateIssueInfo"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.updateIssueInfo"));
                }
            });
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.updateIssueInfo"));
                }
            });
        });
    }

    getDisabledSave = () => {
        const stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
        const state = stateList.find(item => item.itemId + "" === this.state.selectedData.problemState) || {};
        const stateCode = state.itemCode;
        const userCurrent = JSON.parse(localStorage.user);
        let isReceiveUser = false;
        let isCreatedUser = false;
        let isDisabled = true;
        if (this.state.selectedData.createUserId === userCurrent.userID) isCreatedUser = true;
        if (this.state.selectedData.receiveUserId === userCurrent.userID) isReceiveUser = true;
        if (stateCode === "PT_OPEN" || stateCode === "PT_REJECTED") {
            if (this.state.isPm || isCreatedUser) {
                isDisabled = false;
            } else {
                isDisabled = true;
            }
        } else if (stateCode === "PT_UNASSIGNED" || stateCode === "PT_QUEUED" ||
                stateCode === "PT_DIAGNOSED" || stateCode === "PT_WA_IMPL") {
            if (this.state.isPm || isReceiveUser) {
                isDisabled = false;
            } else {
                isDisabled = true;
            }
        } else if (stateCode === "PT_OPEN_2" || stateCode === "PT_REQ_DEFERRED" ||
                stateCode === "PT_ROOT_CAUSE_PROPOSAL"  || stateCode === "PT_SL_IMPL" ||
                stateCode === "PT_SOLUTION_PROPOSAL" || stateCode === "PT_WORKARROUND_PROPOSAL" ||
                stateCode === "PT_CANCELED" || stateCode === "PT_DEFERRED" || stateCode === "PT_ABNORMALLY_CLOSED" ||
                stateCode === "PT_SL_FOUND" || stateCode === "PT_CLOSED" || stateCode === "PT_WA_FOUND") {
            if (this.state.isPm) {
                isDisabled = false;
            } else {
                isDisabled = true;
            }
        }
        this.setState({
            isDisabledSave: isDisabled
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormDetailAdvance() {
        this.setState({ collapseFormDetailAdvance: !this.state.collapseFormDetailAdvance });
    }

    handleItemSelectChangeProblemState(option) {
        let stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
        let itemCode = "";
        let itemCodeCurrent = "";
        for (const obj of stateList) {
            if(obj.itemId === option.value) itemCode = obj.itemCode;
            if(obj.itemId + "" === this.state.selectedData.problemState + "") itemCodeCurrent = obj.itemCode;
        }
        const arrId = ['PT_OPEN', 'PT_OPEN_2', 'PT_REJECTED', 'PT_CLOSED', 'PT_CANCELED'];
        let fieldsRequired = this.buildFieldsRequired();
        let ptCateList = (this.props.response.common.ptCate && this.props.response.common.ptCate.payload) ? this.props.response.common.ptCate.payload.data.data : [];
        let categorizationCode = "";
        for (const ptCate of ptCateList) {
            if (ptCate.itemId + "" === this.state.selectValueCategorization.value + "") {
                categorizationCode = ptCate.itemCode;
                break;
            }
        }
        if (categorizationCode.toLowerCase() === "Reactive".toLowerCase()) {
            fieldsRequired.tt = true;
        }
        let ptRelatedTypeList = (this.props.response.common.ptRelatedType && this.props.response.common.ptRelatedType.payload) ? this.props.response.common.ptRelatedType.payload.data.data : [];
        let itemCodeptRelated = "";
        for (const obj of ptRelatedTypeList) {
            if(obj.itemId === this.state.selectValuePtRelatedType.value) {
                itemCodeptRelated = obj.itemCode;
                break;
            }
        }
        if(itemCodeptRelated === 'PT_CHILDREN' || itemCodeptRelated === 'PT_SECONDARY' || itemCodeptRelated === 'PT_DUPLICATED') {
            fieldsRequired.pt = true;
        }
        if (!arrId.includes(itemCode)) {
            fieldsRequired.receiveUnit = true;
            fieldsRequired.esRcaTime = true;
            fieldsRequired.esWaTime = true;
            fieldsRequired.esSlTime = true;
        }
        // if(itemCode !== 'PT_OPEN') {
        //     this.setState({
        //         fieldsReadOnly: {
        //             ...this.state.fieldsReadOnly,
        //             type: true,
        //             priority: true
        //         }
        //     });
        // } else {
        //     this.setState({
        //         fieldsReadOnly: {
        //             ...this.state.fieldsReadOnly,
        //             type: false,
        //             priority: false
        //         }
        //     });
        // }
        if(itemCode === 'PT_UNASSIGNED' && (itemCodeCurrent === 'PT_OPEN' || itemCodeCurrent === 'PT_OPEN_2')) {
            if (this.state.selectValueTypeId.value) {
                if (this.state.selectValuePriorityId.value && this.state.selectValueLocation.value) {
                    let priorityList = (this.props.response.common.ptPriority && this.props.response.common.ptPriority.payload) ? this.props.response.common.ptPriority.payload.data.data : [];
                    let typeCodeList = (this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : [];
                    let priorityCode = "";
                    let typeCode = "";
                    for (const priority of priorityList) {
                        if (priority.itemId + "" === this.state.selectValuePriorityId.value + "") {
                            priorityCode = priority.itemCode;
                        }
                    }
                    for (const type of typeCodeList) {
                        if (type.itemId + "" === this.state.selectValueTypeId.value + "") {
                            typeCode = type.itemCode;
                        }
                    }
                    this.props.actions.getCfgProblemTimeProcess({typeCode: typeCode, priorityCode: priorityCode,
                        createDatePT: this.state.selectedData.createdTime, locationId: this.state.selectValueLocation.value}).then((response) => {
                        let configTime = response.payload.data;
                        if (configTime) {
                            let rcaFoundTime = new Date(configTime.rcaFoundTime);
                            let waFoundTime = new Date(configTime.waFoundTime);
                            let slFoundTime = new Date(configTime.slFoundTime);
                            const date = new Date();
                            if (date > rcaFoundTime || date > waFoundTime || date > slFoundTime) {
                                let fieldsRequired = {...this.state.fieldsRequired};
                                fieldsRequired.reasonOverdue = true;
                                this.setState({
                                    fieldsRequired
                                });
                            }
                            this.setState({
                                esRcaTime: rcaFoundTime,
                                esWaTime: waFoundTime,
                                esSlTime: slFoundTime
                            });
                        } else {
                            this.setState({
                                esRcaTime: null,
                                esWaTime: null,
                                esSlTime: null
                            });
                            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getConfigTimeNotFound"));
                        }
                    }).catch((response) => {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.getConfigTime"));
                    });
                } else {
                    toastr.warning(this.props.t("ptProblem:ptProblem.message.required.priority"));
                }
            } else {
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.techDomain"));
            }
            fieldsRequired.receiveUser = true;
        }
        if(itemCode === 'PT_REQ_DEFERRED' || itemCode === 'PT_DEFERRED') {
            fieldsRequired.deferredTime = true;
            this.setState({
                fieldsReadOnly: {
                    ...this.state.fieldsReadOnly,
                    deferredTime: false
                }
            });
        } else {
            this.setState({
                fieldsReadOnly: {
                    ...this.state.fieldsReadOnly,
                    deferredTime: true
                }
            });
        }
        if(itemCode === 'PT_ROOT_CAUSE_PROPOSAL') {
            fieldsRequired.softwareVersion = true;
            fieldsRequired.hardwareVersion = true;
            fieldsRequired.rca = true;
            fieldsRequired.rcaType = true;
        }
        if(itemCode === 'PT_DIAGNOSED') {
            fieldsRequired.rca = true;
            fieldsRequired.rcaType = true;
            if (this.props.parentState.objectKedbTab && this.props.parentState.objectKedbTab.data) {
                if (this.props.parentState.objectKedbTab.data.length < 1) {
                    toastr.warning(this.props.t("ptProblem:ptProblem.message.required.kedb"));
                    this.props.setTabIndex(8);
                }
            } else if (!this.state.selectedData.relatedKedb) {
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.kedb"));
                this.props.setTabIndex(8);
            }
        }
        if(itemCode === 'PT_WORKARROUND_PROPOSAL' || itemCode === 'PT_WA_FOUND') {
            fieldsRequired.solutionType = true;
            fieldsRequired.wa = true;
        }
        if(itemCode === 'PT_SOLUTION_PROPOSAL' || itemCode === 'PT_SL_FOUND') {
            fieldsRequired.solutionType = true;
            fieldsRequired.solution = true;
        }
        if(itemCode === 'PT_CLOSED' || itemCode === 'PT_REJECTED') {
            // if (!this.state.isPm) {
            fieldsRequired.closeCode = true;
            // }
        }
        this.setState({
            fieldsRequired,
            selectValueProblemState : option
        });
    }

    handleItemSelectChangeLocation(option) {
        this.setState({selectValueLocation : option});
        let priorityList = (this.props.response.common.ptPriority && this.props.response.common.ptPriority.payload) ? this.props.response.common.ptPriority.payload.data.data : [];
        let typeCodeList = (this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : [];
        let priorityCode = "";
        let typeCode = "";
        for (const priority of priorityList) {
            if (priority.itemId + "" === this.state.selectValuePriorityId.value + "") {
                priorityCode = priority.itemCode;
            }
        }
        for (const type of typeCodeList) {
            if (type.itemId + "" === this.state.selectValueTypeId.value + "") {
                typeCode = type.itemCode;
            }
        }
        if (this.state.selectValueTypeId.value && this.state.selectValuePriorityId.value && option) {
            this.props.actions.getCfgProblemTimeProcess({typeCode: typeCode, priorityCode: priorityCode,
                createDatePT: this.state.selectedData.createdTime, locationId: option.value}).then((response) => {
                let configTime = response.payload.data;
                if (configTime) {
                    let rcaFoundTime = new Date(configTime.rcaFoundTime);
                    let waFoundTime = new Date(configTime.waFoundTime);
                    let slFoundTime = new Date(configTime.slFoundTime);
                    const date = new Date(new Date().setDate(new Date().getDate() + 1));
                    const dateNow = new Date();
                    if (dateNow > rcaFoundTime || dateNow > waFoundTime || dateNow > slFoundTime) {
                        let fieldsRequired = {...this.state.fieldsRequired};
                        fieldsRequired.reasonOverdue = true;
                        this.setState({
                            fieldsRequired
                        });
                    }
                    if (rcaFoundTime > date) {
                        this.setState({
                            esRcaTime: rcaFoundTime,
                            esWaTime: waFoundTime,
                            esSlTime: slFoundTime,
                        });
                    } else {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.changeStatusOutOfDate"));
                    }
                } else {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.contactAdmin"));
                    this.setState({
                        esRcaTime: null,
                        esWaTime: null,
                        esSlTime: null
                    });
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.getConfigTime"));
            });
        }
    }

    handleItemSelectChangeReceiveUserId(option) {
        if(!this.state.selectValueReceiveUnitId){
            this.setState({
                selectValueReceiveUserId: option,
                selectValueReceiveUnitId: {value: option.parentValue, label: option.parentLabel}
            });
        } else {
            this.setState({selectValueReceiveUserId : option});
        }
    } 

    handleModelChangeDescription(model) {
        this.setState({ modelDescription: model });
    }

    handleModelChangeRca(model) {
        this.setState({ modelRca: model });
    }

    handleModelChangeWa(model) {
        this.setState({ modelWa: model });
    }

    handleModelChangeSolution(model) {
        this.setState({ modelSolution: model });
    }

    handleChangeCreatedTime(date) {
        this.setState({ createdTime: date });
    }

    handleItemSelectChangePtRelatedType(option) {
        this.setState({ selectValuePtRelatedType: option });
        let ptRelatedTypeList = (this.props.response.common.ptRelatedType && this.props.response.common.ptRelatedType.payload) ? this.props.response.common.ptRelatedType.payload.data.data : [];
        let itemCode = "";
        for (const obj of ptRelatedTypeList) {
            if(obj.itemId === option.value) {
                itemCode = obj.itemCode;
                break;
            }
        }
        if(itemCode === 'PT_CHILDREN' || itemCode === 'PT_SECONDARY' || itemCode === 'PT_DUPLICATED') {
            this.setState({
                fieldsRequired: {...this.state.fieldsRequired, pt: true}
            });
            if(this.state.valuePt === "") {
                this.openPopupRelatedPtSearch();
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.pt"));
            }
        } else {
            this.setState({
                fieldsRequired: {...this.state.fieldsRequired, pt: false}
            });
        }
    }

    handleItemSelectChangeTypeId(option){
        this.setState({
            selectValueSubCategoryId: {value: null},
            selectValueHardwareVersion: {value: null},
            selectValueSoftwareVersion: {value: null},
            selectValueTypeId: option,
        });
        if(option.value) {
            this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
                let nodeTypeList = [];
                for (const obj of response.payload.data.data) {
                    if(obj.parentItemId === option.value) {
                        nodeTypeList.push(obj);
                    }
                }
                this.setState({
                    nodeTypeList
                });
            });
        } else {
            this.setState({
                nodeTypeList: []
            });
        }
        if (this.state.selectValuePriorityId.value && this.state.selectValueProblemState.value && this.state.selectValueLocation.value) {
            let stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
            let itemCode = "";
            let itemCodeCurrent = "";
            for (const obj of stateList) {
                if(obj.itemId + "" === this.state.selectValueProblemState.value + "") {
                    itemCode = obj.itemCode;
                }
                if(obj.itemId + "" === this.state.selectedData.problemState + "") itemCodeCurrent = obj.itemCode;
            }
            if (itemCode === 'PT_UNASSIGNED' && (itemCodeCurrent === 'PT_OPEN' || itemCodeCurrent === 'PT_OPEN_2')) {
                let priorityList = (this.props.response.common.ptPriority && this.props.response.common.ptPriority.payload) ? this.props.response.common.ptPriority.payload.data.data : [];
                let typeCodeList = (this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : [];
                let priorityCode = "";
                let typeCode = "";
                for (const priority of priorityList) {
                    if (priority.itemId + "" === this.state.selectValuePriorityId.value + "") {
                        priorityCode = priority.itemCode;
                    }
                }
                for (const type of typeCodeList) {
                    if (type.itemId + "" === option.value + "") {
                        typeCode = type.itemCode;
                    }
                }
                this.props.actions.getCfgProblemTimeProcess({typeCode: typeCode, priorityCode: priorityCode,
                    createDatePT: this.state.selectedData.createdTime, locationId: this.state.selectValueLocation.value}).then((response) => {
                    let configTime = response.payload.data;
                    if (configTime) {
                        let rcaFoundTime = new Date(configTime.rcaFoundTime);
                        let waFoundTime = new Date(configTime.waFoundTime);
                        let slFoundTime = new Date(configTime.slFoundTime);
                        const date = new Date(new Date().setDate(new Date().getDate() + 1));
                        const dateNow = new Date();
                        if (dateNow > rcaFoundTime || dateNow > waFoundTime || dateNow > slFoundTime) {
                            let fieldsRequired = {...this.state.fieldsRequired};
                            fieldsRequired.reasonOverdue = true;
                            this.setState({
                                fieldsRequired
                            });
                        }
                        if (rcaFoundTime > date) {
                            this.setState({
                                esRcaTime: rcaFoundTime,
                                esWaTime: waFoundTime,
                                esSlTime: slFoundTime,
                            });
                        } else {
                            toastr.error(this.props.t("ptProblem:ptProblem.message.error.changeStatusOutOfDate"));
                        }
                    } else {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.contactAdmin"));
                        this.setState({
                            esRcaTime: null,
                            esWaTime: null,
                            esSlTime: null
                        });
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("ptProblem:ptProblem.message.error.getConfigTime"));
                });
            } else {
                if (itemCode === 'PT_UNASSIGNED' || itemCode === 'PT_QUEUED' || itemCode === 'PT_OPEN' || itemCode === 'PT_OPEN_2') {
                    this.setState({
                        esRcaTime: null,
                        esWaTime: null,
                        esSlTime: null,
                    });
                }
            }
        }
    }

    openPopupRelatedPtSearch = () => {
        this.setState({
            isOpenPopupRelatedPtSearch: true,
        });
    }

    closePopupRelatedPtSearch = () => {
        this.setState({
            isOpenPopupRelatedPtSearch: false,
        });
    }

    setValuePt = (value) => {
        this.setState({
            valuePt: value,
            fieldsReadOnly: {...this.state.fieldsReadOnly, ptRelatedType: true},
            fieldsRequired: {...this.state.fieldsRequired, ptRelatedType: true},
            selectValuePtRelatedType: {value: 245}
        });
    }

    openPopupRelatedTtSearch = () => {
        this.setState({
            isOpenPopupRelatedTtSearch: true,
        });
    }

    closePopupRelatedTtSearch = () => {
        this.setState({
            isOpenPopupRelatedTtSearch: false,
        });
    }

    setValueTt = (value) => {
        this.setState({ valueTt: value });
    }

    handleItemSelectChangeSubCategoryId(option) {
        this.setState({
            selectValueSubCategoryId: option,
            selectValueHardwareVersion: {value: null},
            selectValueSoftwareVersion: {value: null},
            loopVersion: true
        });
    }
    
    //combobox
    handleItemSelectChangePriority(option) {
        this.setState({ selectValuePriorityId: option });
        if (this.state.selectValueProblemState.value) {
            let stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
            let itemCode = "";
            for (const obj of stateList) {
                if(obj.itemId + "" === this.state.selectValueProblemState.value + "") {
                    itemCode = obj.itemCode;
                    break;
                }
            }
            if (itemCode === 'PT_UNASSIGNED' || itemCode === 'PT_QUEUED' || itemCode === 'PT_OPEN' || itemCode === 'PT_OPEN_2') {
                if (this.state.selectValueTypeId.value && this.state.selectValueLocation.value) {
                    let priorityList = (this.props.response.common.ptPriority && this.props.response.common.ptPriority.payload) ? this.props.response.common.ptPriority.payload.data.data : [];
                    let typeCodeList = (this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : [];
                    let priorityCode = "";
                    let typeCode = "";
                    for (const priority of priorityList) {
                        if (priority.itemId + "" === option.value + "") {
                            priorityCode = priority.itemCode;
                        }
                    }
                    for (const type of typeCodeList) {
                        if (type.itemId + "" === this.state.selectValueTypeId.value + "") {
                            typeCode = type.itemCode;
                        }
                    }
                    this.props.actions.getCfgProblemTimeProcess({typeCode: typeCode, priorityCode: priorityCode,
                        createDatePT: this.state.selectedData.createdTime, locationId: this.state.selectValueLocation.value}).then((response) => {
                        let configTime = response.payload.data;
                        if (configTime) {
                            let rcaFoundTime = new Date(configTime.rcaFoundTime);
                            let waFoundTime = new Date(configTime.waFoundTime);
                            let slFoundTime = new Date(configTime.slFoundTime);
                            const date = new Date(new Date().setDate(new Date().getDate() + 1));
                            const dateNow = new Date();
                            if (dateNow > rcaFoundTime || dateNow > waFoundTime || dateNow > slFoundTime) {
                                let fieldsRequired = {...this.state.fieldsRequired};
                                fieldsRequired.reasonOverdue = true;
                                this.setState({
                                    fieldsRequired
                                });
                            }
                            if (rcaFoundTime > date) {
                                this.setState({
                                    esRcaTime: rcaFoundTime,
                                    esWaTime: waFoundTime,
                                    esSlTime: slFoundTime,
                                });
                            } else {
                                toastr.error(this.props.t("ptProblem:ptProblem.message.error.changeStatusOutOfDate"));
                            }
                        } else {
                            toastr.error(this.props.t("ptProblem:ptProblem.message.error.contactAdmin"));
                            this.setState({
                                esRcaTime: null,
                                esWaTime: null,
                                esSlTime: null
                            });
                        }
                    }).catch((response) => {
                        toastr.error(this.props.t("ptProblem:ptProblem.message.error.getConfigTime"));
                    });
                } else {
                    toastr.warning(this.props.t("ptProblem:ptProblem.message.required.techDomain"));
                }
            }
        } else {
            toastr.warning(this.props.t("ptProblem:ptProblem.message.required.status"));
        }
    }

    handleItemSelectChangeCategorization(option) {
        this.setState({
            selectValueCategorization: option
        });
        let ptCateList = (this.props.response.common.ptCate && this.props.response.common.ptCate.payload) ? this.props.response.common.ptCate.payload.data.data : [];
        let categorizationCode = "";
        for (const ptCate of ptCateList) {
            if (ptCate.itemId + "" === option.value + "") {
                categorizationCode = ptCate.itemCode;
                break;
            }
        }
        if (categorizationCode.toLowerCase() === "Reactive".toLowerCase()) {
            this.setState({
                fieldsRequired: {...this.state.fieldsRequired, tt: true}
            });
            if(this.state.valueTt === "") {
                this.openPopupRelatedTtSearch();
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.tt"));
            }
        } else {
            this.setState({
                fieldsRequired: {...this.state.fieldsRequired, tt: false}
            });
        }
    }

    handleItemSelectChangeCloseCode(option) {
        this.setState({
            selectValueCloseCode: option
        });
        let ptCloseCodeList = (this.props.response.common.ptCloseType && this.props.response.common.ptCloseType.payload) ? this.props.response.common.ptCloseType.payload.data.data : [];
        let closeCode = "";
        for (const closeType of ptCloseCodeList) {
            if (closeType.itemId + "" === option.value + "") {
                closeCode = closeType.itemCode;
                break;
            }
        }
        let ptRelatedTypeList = (this.props.response.common.ptRelatedType && this.props.response.common.ptRelatedType.payload) ? this.props.response.common.ptRelatedType.payload.data.data : [];
        let ptRelatedTypeId = "";
        let ptRelatedTypeName = "";
        for (const ptRelated of ptRelatedTypeList) {
            if (ptRelated.itemCode === "PT_DUPLICATED") {
                ptRelatedTypeId = ptRelated.itemId;
                ptRelatedTypeName = ptRelated.itemName;
                break;
            }
        }
        if (closeCode.toLowerCase() === "PrM_CC_DUPLICATED".toLowerCase()) {
            this.setState({
                fieldsRequired: {...this.state.fieldsRequired, pt: true},
                fieldsReadOnly: {...this.state.fieldsReadOnly, ptRelatedType: true},
                selectValuePtRelatedType: {value: ptRelatedTypeId, label: ptRelatedTypeName}
            });
            if(this.state.valuePt === "") {
                this.openPopupRelatedPtSearch();
                toastr.warning(this.props.t("ptProblem:ptProblem.message.required.pt"));
            }
        } else {
            this.setState({
                fieldsRequired: {...this.state.fieldsRequired, pt: false},
                fieldsReadOnly: {...this.state.fieldsReadOnly, ptRelatedType: false},
                selectValuePtRelatedType: {}
            });
        }
    }

    getListStatusNext() {
        this.props.actions.getItemMaster("PT_STATE", "itemId", "itemName", "1", "3").then((response) => {
            let objStatusSelected = {};
            for (const obj of response.payload.data.data) {
                if ((this.state.selectedData.problemState + "") === (obj.itemId + "")) {
                    objStatusSelected = obj;
                }
            }
            const problemState = this.state.selectedData.problemState;
            const pmGroup = this.state.selectedData.pmGroup;
            const createUnitId = this.state.selectedData.createUnitId;
            const createUserId = this.state.selectedData.createUserId;
            const receiveUnitId = this.state.selectedData.receiveUnitId;
            const receiveUserId = this.state.selectedData.receiveUserId;
            const obj = {page: '1', pageSize: '1000', problemState: problemState, pmGroup: pmGroup, createUnitId: createUnitId, receiveUnitId: receiveUnitId, createUserId: createUserId, receiveUserId: receiveUserId};
            this.props.actions.getTransitionStatus(obj).then((response) => {
                let listStatusNext = [];
                let isHas = false;
                for (const obj of response.payload.data.data) {
                    if (obj.itemId === objStatusSelected.itemId) {
                        isHas = true;
                    }
                    listStatusNext.push(obj);
                }
                if (!isHas) {
                    listStatusNext.unshift(objStatusSelected);
                }
                this.setState({
                    listStatusNext,
                    selectValueStatus: { value: objStatusSelected.itemId }
                });
            }).catch((error) => {
            });
        }).catch((error) => {
        });
    }

    handleItemSelectChangeVendor(option) {
        this.setState({
            selectValueVendor: option,
            selectValueHardwareVersion: {value: null},
            selectValueSoftwareVersion: {value: null},
            loopVersion: true
        });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = this.state.selectedData;
        let priorityList = (response.common.ptPriority && response.common.ptPriority.payload) ? response.common.ptPriority.payload.data.data : [];
        let ptTypeList = (response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : [];
        let vendorList = [];
        let ptCloseTypeList = (response.common.ptCloseType && response.common.ptCloseType.payload) ? response.common.ptCloseType.payload.data.data : [];
        let ptSolutionTypeList = (response.common.ptSolutionType && response.common.ptSolutionType.payload) ? response.common.ptSolutionType.payload.data.data : [];
        let ptRelatedTypeList = (response.common.ptRelatedType && response.common.ptRelatedType.payload) ? response.common.ptRelatedType.payload.data.data : [];
        for (const vendor of (response.common.vendor && response.common.vendor.payload) ? response.common.vendor.payload.data.data : []) {
            vendorList.push({itemId: vendor.itemCode, itemName: vendor.itemName});
        }
        let ticketTypeList = (response.common.ptCate && response.common.ptCate.payload) ? response.common.ptCate.payload.data.data : [];
        objectAddOrEdit.categorization = this.state.selectedData.categorization ? this.state.selectedData.categorization : "";
        objectAddOrEdit.relatedTt = this.state.selectedData.relatedTt ? this.state.selectedData.relatedTt : "";
        objectAddOrEdit.hardwareVersion = this.state.selectedData.hardwareVersion ? this.state.selectedData.hardwareVersion : "";
        objectAddOrEdit.softwareVersion = this.state.selectedData.softwareVersion ? this.state.selectedData.softwareVersion : "";
        objectAddOrEdit.createUserName = this.state.selectedData.createUserName ? this.state.selectedData.createUserName : "";
        objectAddOrEdit.receiveUserId = this.state.selectedData.receiveUserId ? this.state.selectedData.receiveUserId : "";
        objectAddOrEdit.pmUserName = this.state.selectedData.pmUserName ? this.state.selectedData.pmUserName : "";
        objectAddOrEdit.rcaType = this.state.selectedData.rcaType ? this.state.selectedData.rcaType : "";
        objectAddOrEdit.solutionType = this.state.selectedData.solutionType ? this.state.selectedData.solutionType : "";
        objectAddOrEdit.closeCode = this.state.selectedData.closeCode ? this.state.selectedData.closeCode : "";
        objectAddOrEdit.esRcaTime = this.state.selectedData.esRcaTime ? this.state.selectedData.esRcaTime : "";
        objectAddOrEdit.esWaTime = this.state.selectedData.esWaTime ? this.state.selectedData.esWaTime : "";
        objectAddOrEdit.esSlTime = this.state.selectedData.esSlTime ? this.state.selectedData.esSlTime : "";
        objectAddOrEdit.createUnitName = this.state.selectedData.createUnitName ? this.state.selectedData.createUnitName : "";
        objectAddOrEdit.receiveUnitId = this.state.selectedData.receiveUnitId ? this.state.selectedData.receiveUnitId : "";
        objectAddOrEdit.pmGroup = this.state.selectedData.pmGroup ? this.state.selectedData.pmGroup : "";
        objectAddOrEdit.ptRelatedType = this.state.selectedData.ptRelatedType ? this.state.selectedData.ptRelatedType : "";
        objectAddOrEdit.relatedPt = this.state.selectedData.relatedPt ? this.state.selectedData.relatedPt : "";
        objectAddOrEdit.relatedKedb = this.state.selectedData.relatedKedb ? this.state.selectedData.relatedKedb : "";
        objectAddOrEdit.rca = this.state.selectedData.rca ? this.state.selectedData.rca : "";
        objectAddOrEdit.wa = this.state.selectedData.wa ? this.state.selectedData.wa : "";
        objectAddOrEdit.solution = this.state.selectedData.solution ? this.state.selectedData.solution : "";
        objectAddOrEdit.workLog = this.state.selectedData.workLog ? this.state.selectedData.workLog : "";
        objectAddOrEdit.reasonOverdue = this.state.selectedData.reasonOverdue ? this.state.selectedData.reasonOverdue : "";
        objectAddOrEdit.affectedNode = this.state.selectedData.affectedNode ? this.state.selectedData.affectedNode : "";
        objectAddOrEdit.contactInfo = this.state.selectedData.contactInfo ? this.state.selectedData.contactInfo : "";
        objectAddOrEdit.deferredTime = this.state.selectedData.deferredTime ? this.state.selectedData.deferredTime : "";
        objectAddOrEdit.createUserPhone = this.state.selectedData.createUserPhone ? this.state.selectedData.createUserPhone : "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Card>
                        <CustomSticky level={1}>
                            <CardHeader>
                                <i className="fa fa-plus-justify"></i>{t("ptProblem:ptProblem.title.infoTab")}
                                <div className="card-header-actions card-header-actions-button">
                                    <LaddaButton type="submit"
                                        className="btn btn-primary btn-md mr-1"
                                        loading={this.state.btnAddOrEditLoading}
                                        data-style={ZOOM_OUT}
                                        disabled={this.state.isDisabledSave}>
                                        <i className="fa fa-save"></i> {t("common:common.button.save")}
                                    </LaddaButton>{' '}
                                    <Button type="button" color="secondary" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                </div>
                            </CardHeader>
                        </CustomSticky>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="12">
                                    <CustomAvField name="problemName" label={t("ptProblem:ptProblem.label.problemName")}
                                    placeholder={t("ptProblem:ptProblem.placeholder.problemName")} required maxLength="500"
                                    autoFocus validate={{ required: { value: true, errorMessage: t("ptProblem:ptProblem.message.required.problemName") } }} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"typeId"}
                                        label={t("ptProblem:ptProblem.label.techDomain")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.techDomain")}
                                        options={ptTypeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeTypeId}
                                        selectValue={this.state.selectValueTypeId}
                                        isDisabled={this.state.fieldsReadOnly.type}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="problemCode" label={t("ptProblem:ptProblem.label.problemCode")}
                                    placeholder={t("ptProblem:ptProblem.placeholder.problemCode")} maxLength="128" readOnly={true} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomDatePicker
                                        name={"createdTime"}
                                        label={t("ptProblem:ptProblem.label.createdDate")}
                                        isRequired={false}
                                        readOnly={true}
                                        selected={this.state.createdTime}
                                        handleOnChange={this.handleChangeCreatedTime}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"subCategoryId"}
                                        label={t("ptProblem:ptProblem.label.nodeType")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.nodeType")}                                        
                                        options={this.state.nodeTypeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeSubCategoryId}
                                        selectValue={this.state.selectValueSubCategoryId}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"problemState"}
                                        label={t("ptProblem:ptProblem.label.problemState")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.status")}
                                        options={this.state.listStatusNext}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeProblemState}
                                        selectValue={this.state.selectValueProblemState}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"priorityId"}
                                        label={t("ptProblem:ptProblem.label.priority")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.priority")}
                                        options={priorityList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangePriority}
                                        selectValue={this.state.selectValuePriorityId}
                                        isDisabled={this.state.fieldsReadOnly.priority}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"vendor"}
                                        label={t("ptProblem:ptProblem.label.vendor")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.vendor")}
                                        options={vendorList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeVendor}
                                        selectValue={this.state.selectValueVendor}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"categorization"}
                                        label={t("ptProblem:ptProblem.label.ticketType")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.ticketType")}
                                        options={ticketTypeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeCategorization}
                                        selectValue={this.state.selectValueCategorization}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAutocomplete
                                        name={"receiveUserId"}
                                        label={t("ptProblem:ptProblem.label.handlePerson")}
                                        placeholder={t("ptProblem:ptProblem.placeholder.handlePerson")}
                                        isRequired={this.state.fieldsRequired.receiveUser}
                                        messageRequire={t("ptProblem:ptProblem.message.required.handlePerson")}
                                        closeMenuOnSelect={false}
                                        isDisabled={this.state.fieldsReadOnly.receiveUser}
                                        handleItemSelectChange={this.handleItemSelectChangeReceiveUserId}
                                        selectValue={this.state.selectValueReceiveUserId}
                                        moduleName={"USERS"}
                                        parentValue={(this.state.selectValueReceiveUnitId && this.state.selectValueReceiveUnitId.value) ? this.state.selectValueReceiveUnitId.value + "" : ""}
                                        isHasChildren={true}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"hardwareVersion"}
                                        label={t("ptProblem:ptProblem.label.hardVersion")}
                                        isRequired={this.state.fieldsRequired.hardwareVersion}
                                        messageRequire={t("ptProblem:ptProblem.message.required.hardVersion")}
                                        options={this.state.hardwareList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueHardwareVersion: d })}
                                        selectValue={this.state.selectValueHardwareVersion}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAutocomplete 
                                        name={"locationId"}
                                        label={t("ptProblem:ptProblem.label.section")}
                                        placeholder={t("ptProblem:ptProblem.placeholder.section")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.section")}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeLocation}
                                        selectValue={this.state.selectValueLocation}
                                        moduleName={"REGION"} 
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="pmUserName" label={t("ptProblem:ptProblem.label.inchargePerson")} maxLength="100"
                                    placeholder={t("ptProblem:ptProblem.placeholder.inchargePerson")} disabled={true} />
                                </Col>
                            </Row>
                            <Row>
                                {/* <Col xs="12" sm="4">
                                    <CustomDatePicker
                                        name={"createdTime"}
                                        label={t("ptProblem:ptProblem.label.createdDate")}
                                        isRequired={false}
                                        readOnly={true}
                                        selected={this.state.createdTime}
                                        handleOnChange={this.handleChangeCreatedTime}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                    />
                                </Col> */}
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"softwareVersion"}
                                        label={t("ptProblem:ptProblem.label.softVersion")}
                                        isRequired={this.state.fieldsRequired.softwareVersion}
                                        messageRequire={t("ptProblem:ptProblem.message.required.softVersion")}
                                        options={this.state.softwareList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueSoftwareVersion: d })}
                                        selectValue={this.state.selectValueSoftwareVersion}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomInputPopup
                                        name={"relatedTt"}
                                        label={t("ptProblem:ptProblem.label.relateIssue")}
                                        placeholder={t("ptProblem:ptProblem.placeholder.doubleClick")}
                                        value={this.state.valueTt}
                                        handleRemove={() => this.setState({ valueTt: "" })}
                                        handleDoubleClick={this.openPopupRelatedTtSearch}
                                        isRequired={this.state.fieldsRequired.tt}
                                        messageRequire={this.props.t("ptProblem:ptProblem.message.required.tt")}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="createUserName" label={t("ptProblem:ptProblem.label.createdPerson")}
                                    placeholder={t("ptProblem:ptProblem.placeholder.createdPerson")} readOnly={true} />
                                </Col>
                            </Row>
                            {/* <editor-fold desc="Advance search"> */}
                            <Row>
                                <Col xs="12" sm="12">
                                    <Card>
                                        <CardHeader>
                                            <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormDetail" onClick={this.toggleFormDetailAdvance} style={{ color: '#24292d', textDecoration: 'none' }}>
                                                <i className={this.state.collapseFormDetailAdvance ? "icon-arrow-up mr-2" : "icon-arrow-down mr-2"}></i>{t("common:common.title.advanceInfo")}
                                            </Button>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.collapseFormDetailAdvance} id="collapseFormDetail">
                                            <CardBody>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"esRcaTime"}
                                                            label={t("ptProblem:ptProblem.label.rcaTime")}
                                                            isRequired={this.state.fieldsRequired.esRcaTime}
                                                            messageRequire={t("ptProblem:ptProblem.message.required.rcaTime")}
                                                            selected={this.state.esRcaTime}
                                                            handleOnChange={(d) => this.setState({esRcaTime: d})}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            // readOnly={this.state.fieldsReadOnly.esRcaTime}
                                                            readOnly={true}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAutocomplete 
                                                            name={"receiveUnitId"}
                                                            label={t("ptProblem:ptProblem.label.handleUnit")}
                                                            placeholder={t("ptProblem:ptProblem.placeholder.handleUnit")}
                                                            isRequired={this.state.fieldsRequired.receiveUnit}
                                                            messageRequire={t("ptProblem:ptProblem.message.required.handleUnit")}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueReceiveUnitId : d, selectValueReceiveUserId: {} })}
                                                            selectValue={this.state.selectValueReceiveUnitId}
                                                            moduleName={"UNIT"} 
                                                            isDisabled={this.state.fieldsReadOnly.receiveUnit}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="createUnitName" label={t("ptProblem:ptProblem.label.ticketCreatedUnit")}
                                                        placeholder={t("ptProblem:ptProblem.placeholder.ticketCreatedUnit")} readOnly={true} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"esWaTime"}
                                                            label={t("ptProblem:ptProblem.label.tempSolutionTime")}
                                                            isRequired={this.state.fieldsRequired.esWaTime}
                                                            messageRequire={t("ptProblem:ptProblem.message.required.tempSolutionTime")}
                                                            selected={this.state.esWaTime}
                                                            handleOnChange={(d) => this.setState({esWaTime: d})}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            // readOnly={this.state.fieldsReadOnly.esWaTime}
                                                            readOnly={true}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"ptRelatedType"}
                                                            label={t("ptProblem:ptProblem.label.relateProblemType")}
                                                            isRequired={this.state.fieldsRequired.ptRelatedType}
                                                            messageRequire={t("ptProblem:ptProblem.message.required.relateProblemType")}
                                                            isDisabled={this.state.fieldsReadOnly.ptRelatedType}
                                                            options={ptRelatedTypeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangePtRelatedType}
                                                            selectValue={this.state.selectValuePtRelatedType}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomInputPopup
                                                            name={"relatedPt"}
                                                            label={t("ptProblem:ptProblem.label.relateProblem")}
                                                            placeholder={t("ptProblem:ptProblem.placeholder.doubleClick")}
                                                            value={this.state.valuePt}
                                                            handleRemove={() => this.setState({ valuePt: "" })}
                                                            handleDoubleClick={this.openPopupRelatedPtSearch}
                                                            isRequired={this.state.fieldsRequired.pt}
                                                            messageRequire={this.props.t("ptProblem:ptProblem.message.required.pt")}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"esSlTime"}
                                                            label={t("ptProblem:ptProblem.label.completeSolutionTime")}
                                                            isRequired={this.state.fieldsRequired.esSlTime}
                                                            messageRequire={t("ptProblem:ptProblem.message.required.completeSolutionTime")}
                                                            selected={this.state.esSlTime}
                                                            handleOnChange={(d) => this.setState({esSlTime: d})}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            // readOnly={this.state.fieldsReadOnly.esSlTime}
                                                            readOnly={true}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="contactInfo" label={t("ptProblem:ptProblem.label.contactPerson")}
                                                        placeholder={t("ptProblem:ptProblem.placeholder.contactPerson")} maxLength="250" />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelect
                                                            name={"pmGroup"}
                                                            label={t("ptProblem:ptProblem.label.softGroup")}
                                                            isRequired={false}
                                                            moduleName={"ROLE"}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={(d) => this.setState({ selectValuePmGroup: d })}
                                                            selectValue={this.state.selectValuePmGroup}
                                                            isDisabled={true}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomDatePicker
                                                            name={"deferredTime"}
                                                            label={t("ptProblem:ptProblem.label.pauseTime")}
                                                            isRequired={this.state.fieldsRequired.deferredTime}
                                                            messageRequire={t("ptProblem:ptProblem.message.required.pauseTime")}
                                                            selected={this.state.deferredTime}
                                                            handleOnChange={(d) => this.setState({deferredTime: d})}
                                                            dateFormat="dd/MM/yyyy HH:mm:ss"
                                                            showTimeSelect={true}
                                                            timeFormat="HH:mm:ss"
                                                            placeholder="dd/MM/yyyy HH:mm:ss"
                                                            readOnly={this.state.fieldsReadOnly.deferredTime}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="createUserPhone" label={t("ptProblem:ptProblem.label.phone")}
                                                        readOnly={true} />
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Collapse>
                                    </Card>
                                </Col>
                            </Row>
                            {/* </editor-fold> */}
                            <Row>
                                <Col xs="12" md="12" className={this.state.fieldsRequired.reasonOverdue ? "" : "class-hidden"}>
                                    <CustomAvField type="textarea" name="reasonOverdue" rows="3" label={t("ptProblem:ptProblem.label.delayReason")}
                                    placeholder={t("ptProblem:ptProblem.placeholder.delayReason")}
                                    required={this.state.fieldsRequired.reasonOverdue} maxLength="1500"
                                    validate={{ required: { value: true, errorMessage: t("ptProblem:ptProblem.message.required.delayReason") } }} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" md="12">
                                    <CustomFroalaEditor
                                        name="description"
                                        label={t("ptProblem:ptProblem.label.description")}
                                        isRequired={true}
                                        messageRequire={t("ptProblem:ptProblem.message.required.description")}
                                        model={this.state.modelDescription}
                                        handleModelChange={this.handleModelChangeDescription}
                                        placeholder={""}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" md="4">
                                    <CustomRcTreeSelect
                                        name={"rcaType"}
                                        label={t("ptProblem:ptProblem.label.reasonGroup")}
                                        isRequired={this.state.fieldsRequired.rcaType}
                                        messageRequire={t("ptProblem:ptProblem.message.required.reasonGroup")}
                                        moduleName={"PT_RCA_TYPE"}
                                        handleChange={(value) => this.setState({ selectValueRcaType: value })}
                                        selectValue={this.state.selectValueRcaType}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" md="12">
                                    <CustomFroalaEditor
                                        name="rca"
                                        label={t("ptProblem:ptProblem.label.rootReason")}
                                        isRequired={this.state.fieldsRequired.rca}
                                        messageRequire={t("ptProblem:ptProblem.message.required.rootReason")}
                                        model={this.state.modelRca}
                                        handleModelChange={this.handleModelChangeRca}
                                        placeholder={""}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" md="4">
                                    <CustomSelectLocal
                                        name={"solutionType"}
                                        label={t("ptProblem:ptProblem.label.solutionType")}
                                        isRequired={this.state.fieldsRequired.solutionType}
                                        messageRequire={t("ptProblem:ptProblem.message.required.solutionType")}
                                        options={ptSolutionTypeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueSolutionType: d })}
                                        selectValue={this.state.selectValueSolutionType}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" md="12">
                                    <CustomFroalaEditor
                                        name="wa"
                                        label={t("ptProblem:ptProblem.label.tempSolution")}
                                        isRequired={this.state.fieldsRequired.wa}
                                        messageRequire={t("ptProblem:ptProblem.message.required.tempSolution")}
                                        model={this.state.modelWa}
                                        handleModelChange={this.handleModelChangeWa}
                                        placeholder={""}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" md="4">
                                    <CustomSelectLocal
                                        name={"closeCode"}
                                        label={t("ptProblem:ptProblem.label.closeCode")}
                                        isRequired={this.state.fieldsRequired.closeCode}
                                        messageRequire={t("ptProblem:ptProblem.message.required.closeCode")}
                                        options={ptCloseTypeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleItemSelectChangeCloseCode}
                                        selectValue={this.state.selectValueCloseCode}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" md="12">
                                    <CustomFroalaEditor
                                        name="solution"
                                        label={t("ptProblem:ptProblem.label.completeSolution")}
                                        isRequired={this.state.fieldsRequired.solution}
                                        messageRequire={t("ptProblem:ptProblem.message.required.completeSolution")}
                                        model={this.state.modelSolution}
                                        handleModelChange={this.handleModelChangeSolution}
                                        placeholder={""}/>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </AvForm>
                <PtProblemEditInfoTabRelatedPtPopup
                    parentState={this.state}
                    closePopup={this.closePopupRelatedPtSearch}
                    setValuePt={this.setValuePt} />
                <PtProblemEditInfoTabRelatedTtPopup
                    parentState={this.state}
                    closePopup={this.closePopupRelatedTtSearch}
                    setValueTt={this.setValueTt} />
            </div>
        );
    }
}

PtProblemEditInfoTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    setTabIndex: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ptProblemActions, ptConfigActions, KedbManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditInfoTab));