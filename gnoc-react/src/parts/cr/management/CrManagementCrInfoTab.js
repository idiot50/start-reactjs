import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader, CardBody, Row, Col, Collapse, Label } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { buildDataCbo } from './CrManagementUtils';
import { CustomAvField, CustomSelectLocal, CustomAutocomplete, CustomMultiSelectLocal, CustomInputPopup, CustomDatePicker, CustomAppSwitch } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import CrManagementCrInfoTabProcessPopup from './CrManagementCrInfoTabProcessPopup';
import CrManagementInfoTabSourceCrPopup from './CrManagementInfoTabSourceCrPopup';
import CrManagementInfoTabCrRelatedPopup from './CrManagementInfoTabCrRelatedPopup';
import CrManagementInfoTabUserCabPopup from './CrManagementInfoTabUserCabPopup';
import CrManagementCrInfoTabViewUserPopup from './CrManagementCrInfoTabViewUserPopup';

class CrManagementCrInfoTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        
        this.state = {
            collapseAffected: true,
            isOpenPopupProcessCr: false,
            isOpenSourceCrPopup: false,
            isOpenCrRelatedPopup: false,
            isOpenUserCabPopup: false,
            isOpenViewUserPopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnAddOrEditLoading: false,
            dataInfoTab: {},
            createdDate: new Date(),
            //Select
            selectValueNation: {},
            selectValueResponsibleUnit: {},
            selectValueResponsible: {},
            crProcess: "",
            selectValueCrWork: [],
            selectValueImpactType: {},
            earliestStartTime: null,
            latestStartTime: null,
            selectValueChildDomain: {},
            disturbanceStartTime: null,
            disturbanceEndTime: null,
            selectValueAffectedLevel: {},
            selectValueAffectedService: [],
            selectValueRelatedCr: {},
            sourceCreateCr: [],
            selectValueOrginatorUnit: {},
            isAffected: "yes",
            isValidSubmitForm: false,
            fieldsProperty: this.buildDefaultFields(),
            actionRight: props.parentState.selectedData.actionRight,
            selectValueCrType: {},
            selectValueProcess: {},
            selectValuePriority: {},
            selectValueSubcategory: {},
            selectValueDeviceType: {},
            selectValueImpactSegment: {},
            selectValueRisk: {},
            tracingCRCB: false,
            isLoadMop: false,
            lstCbbAction: [],
            selectValueActionGroup: {},
            createdBySys: "",
            chooseCrRelated: {},
            selectValueReasonType: {},
            listReasonType: [],
            lstAppDept: [],
            checkCrAuto: false,
            selectValueReturnCode: {},
            selectValueUserConsider: {},
            selectValueUnitConsider: {},
            selectValueUserCab: {},
            lstReturnCodeAll: [],
            lstCbbReturnView: [],
            userCab: {},
            forwardDuty: "",
            selectValueCircle: {},
            circleList: [],
            listUserConsider: [],
            nationList: [],
            isConfirmAction: false
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.selectedData) {
            this.setState({ selectedData: newProps.parentState.selectedData || {} });
        }
    }

    componentDidMount() {
        this.initConStructor(this.state.modalName, this.state.selectedData);
        this.props.actions.getListLocationByLevelCBB(1, "").then(response => {
            this.setState({
                nationList: response.payload.data || []
            });
        });
        this.props.actions.getListAffectedServiceCBB("");
        this.props.actions.getListImpactAffectCBB();
        this.props.actions.getListDutyTypeCBB({});
        this.setDefaultValue();
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    buildDefaultFields() {
        return {
            crName: {
                required: false, disable: false, visible: true
            },
            crType: {
                required: false, disable: false, visible: true
            },
            subCategory: {
                required: false, disable: false, visible: true
            },
            risk: {
                required: false, disable: false, visible: true
            },
            impactSegment: {
                required: false, disable: false, visible: true
            },
            deviceType: {
                required: false, disable: false, visible: true
            },
            priority: {
                required: false, disable: false, visible: true
            },
            earliestStartTime: {
                required: false, disable: false, visible: true
            },
            latestStartTime: {
                required: false, disable: false, visible: true
            },
            crProcess: {
                required: false, disable: false, visible: true
            },
            changeResponsibleUnit: {
                required: false, disable: false, visible: true
            },
            impact: {
                required: false, disable: false, visible: true
            },
            country: {
                required: false, disable: false, visible: true
            },
            totalAffectedCustomersTF: {
                required: false, disable: false, visible: true
            },
            totalAffectedMinutesTF: {
                required: false, disable: false, visible: true
            },
            affectedService: {
                required: false, disable: false, visible: true
            },
            disturbanceStartTime: {
                required: false, disable: false, visible: true
            },
            disturbanceEndTime: {
                required: false, disable: false, visible: true
            },
            description: {
                required: false, disable: false, visible: true
            },
            notesDetail: {
                required: false, disable: false, visible: true
            },
            changeOrginator: {
                required: false, disable: false, visible: true
            },
            changeOrginatorUnit: {
                required: false, disable: false, visible: true
            },
            isServiceAffecting: {
                required: false, disable: false, visible: true
            },
            childImpactSegment: {
                required: false, disable: false, visible: true
            },
            dutyType: {
                required: false, disable: false, visible: true
            },
            crRelated: {
                required: false, disable: false, visible: true
            },
            pickerCR: {
                required: false, disable: false, visible: true
            },
            tracingCR: {
                required: false, disable: false, visible: true
            },
            reasonType: {
                required: false, disable: false, visible: true
            },
            checkCrAuto: {
                required: false, disable: false, visible: false
            },
            returnCode: {
                required: false, disable: false, visible: true
            },
            unitAppraisal: {
                required: false, disable: false, visible: false
            },
            userAppraisal: {
                required: false, disable: false, visible: false
            },
            actionGroup: {
                required: false, disable: false, visible: true
            },
            createdBySys: {
                required: false, disable: false, visible: false
            },
            isAffected: {
                required: false, disable: false, visible: true
            },
            circleAdditionalInfo: {
                required: false, disable: false, visible: true
            },
            changeResponsible: {
                required: false, disable: false, visible: true
            },
            noteAction: {
                required: false, disable: false, visible: true
            },
            loadDt: {
                required: false, disable: false, visible: false
            },
            parentCr: {
                required: false, disable: false, visible: false
            },
            forwardDuty: {
                required: false, disable: false, visible: false
            },
            lstFailedWo: {
                required: false, disable: false, visible: false
            },
            userCab: {
                required: false, disable: false, visible: false
            },
            viewUser: {
                required: false, disable: false, visible: false
            },
            considerUnit: {
                required: false, disable: false, visible: false
            },
            considerUser: {
                required: false, disable: false, visible: false
            },
            isConfirmAction: {
                required: false, disable: false, visible: false
            },
        }
    }

    setReadOnlyForm = (require, fieldsProperty) => {
        // const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        fieldsProperty.crName.disable = require;
        fieldsProperty.crType.disable = require;
        fieldsProperty.subCategory.disable = require;
        fieldsProperty.risk.disable = require;
        fieldsProperty.impactSegment.disable = require;
        fieldsProperty.deviceType.disable = require;
        fieldsProperty.priority.disable = require;
        fieldsProperty.earliestStartTime.disable = require;
        fieldsProperty.latestStartTime.disable = require;
        fieldsProperty.crProcess.disable = require;
        fieldsProperty.changeResponsibleUnit.disable = require;
        fieldsProperty.impact.disable = require;
        fieldsProperty.country.disable = require;
        fieldsProperty.totalAffectedCustomersTF.disable = require;
        fieldsProperty.totalAffectedMinutesTF.disable = require;
        fieldsProperty.affectedService.disable = require;
        fieldsProperty.disturbanceStartTime.disable = require;
        fieldsProperty.disturbanceEndTime.disable = require;
        fieldsProperty.description.disable = require;
        fieldsProperty.notesDetail.disable = require;
        fieldsProperty.changeOrginator.disable = require;
        fieldsProperty.changeOrginatorUnit.disable = require;
        fieldsProperty.isServiceAffecting.disable = require;
        fieldsProperty.tracingCR.disable = require;
        //truongnt add new
        fieldsProperty.isAffected.disable = require;
        if (this.state.selectedData.state && this.state.selectedData.state !== "4") {
            if (!["ADD", "CLONE"].includes(this.state.modalName)) {
                fieldsProperty.changeResponsible.disable = true;
            } else {
                fieldsProperty.changeResponsible.disable = false;
            }
        } else {
            fieldsProperty.changeResponsible.disable = false;
        }

        //show hide relate
        const crTypeStr = this.state.selectValueCrType.value ? this.state.selectValueCrType.value : (this.state.selectedData.crType || "");
        this.showHideRelate(crTypeStr, this.state.actionRight, fieldsProperty);
        
        // this.setState({
        //     fieldsProperty
        // });
        // return fieldsProperty;
    }

    setRequire = (require, fieldsProperty) => {
        // const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        fieldsProperty.crName.required = require;
        fieldsProperty.crType.required = require;
        fieldsProperty.subCategory.required = require;
        fieldsProperty.risk.required = require;
        fieldsProperty.impactSegment.required = require;
        fieldsProperty.childImpactSegment.required = require;
        fieldsProperty.deviceType.required = require;
        fieldsProperty.priority.required = require;
        fieldsProperty.earliestStartTime.required = require;
        fieldsProperty.latestStartTime.required = require;
        fieldsProperty.crProcess.required = require;
        fieldsProperty.impact.required = require;
        fieldsProperty.country.required = require;
        fieldsProperty.totalAffectedCustomersTF.required = false;
        fieldsProperty.totalAffectedMinutesTF.required = false;
        fieldsProperty.dutyType.required = require;
        fieldsProperty.affectedService.required = require;
        fieldsProperty.disturbanceStartTime.required = require;
        fieldsProperty.disturbanceEndTime.required = require;
        fieldsProperty.crRelated.required = require;
        fieldsProperty.pickerCR.required = require;
        fieldsProperty.description.required = require;
        // truongnt add new
        fieldsProperty.changeResponsibleUnit.required = require;
        // this.setState({
        //     fieldsProperty
        // });
        // return fieldsProperty;
    }

    showHideRelate = (crType, sActionRight, fieldsProperty) => {
        const Constants = buildDataCbo("ACTION_RIGHT");
        // const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        if (Constants.CAN_EDIT === sActionRight || Constants.CAN_VERIFY === sActionRight || Constants.CAN_SCHEDULE === sActionRight) {
            if (crType === "0" || crType === "1") {
                fieldsProperty.crRelated.disable = false;
                fieldsProperty.pickerCR.disable = false;
                //Neu la cr cap 1 thi khong cho QLTD sua
                if (this.state.selectedData && this.state.selectedData.isPrimaryCr !== null && Constants.CAN_EDIT !== sActionRight) {
                    fieldsProperty.crRelated.disable = true;
                    fieldsProperty.pickerCR.disable = true;
                }
            } else {
                fieldsProperty.crRelated.disable = true;
                this.setState({
                    selectValueRelatedCr: {value: "0"}
                });
                this.changeRelated();
            }
        } else {
            fieldsProperty.crRelated.disable = true;
            fieldsProperty.pickerCR.disable = true;
        }
        // this.setState({
        //     fieldsProperty
        // });
    }

    changeRelated = () => {
        const Constants = buildDataCbo("ACTION_RIGHT");
        const valueStr = this.state.selectValueRelatedCr.value + "";
        const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        if (valueStr === "2" || valueStr === "3") {
            fieldsProperty.pickerCR.visible = true;
            this.setState({
                chooseCrRelated: {}
            });
        } else {
            fieldsProperty.pickerCR.visible = false;
        }
        if (valueStr === "3" && (this.state.modalName === "ADD" || this.state.modalName === "CLONE"
                || ((!this.state.selectedData.crNumber || this.state.selectedData.isLoadMop !== "2")
                && this.state.modalName === "EDIT"
                && Constants.CAN_VERIFY === this.state.actionRight))) {
            fieldsProperty.loadDt.visible = true;
        } else {
            fieldsProperty.loadDt.visible = false;
        }
        this.setState({
            fieldsProperty
        });
        this.loadAppDept();
    }

    loadAppDept = () => {
        const Constants = buildDataCbo("ACTION_RIGHT");
        const form = {
            page: 1,
            pageSize: 2,
            crId: this.state.selectedData.crId,
            creatorId: JSON.parse(localStorage.user).userID,
            crProcessId: this.state.selectValueProcess.value || ""
        };
        if (Constants.CAN_EDIT === this.state.actionRight) {
            this.props.actions.getListCrApprovalDepartmentDTO(Object.assign(form, {sortType: "IS_EDIT"})).then(response => {
                this.setState({
                    lstAppDept: response.payload.data.data || []
                }, () => {
                    const value = this.state.selectValueRisk.value;
                    if (value) {
                        this.showApproveDept(value);
                    }
                });
            });
        } else {
            this.props.actions.getListCrApprovalDepartmentDTO(Object.assign(form, {sortType: "IS_VIEW"})).then(response => {
                this.setState({
                    lstAppDept: response.payload.data.data || []
                }, () => {
                    const value = this.state.selectValueRisk.value;
                    if (value) {
                        this.showApproveDept(value);
                    }
                });
            });
        }
    }

    showApproveDept(impactAffectTwoLevel) {
        const lst = [];
        const { lstAppDept } = this.state;
        const related = this.state.selectValueRelatedCr.value || "";
        const crType = this.state.selectValueCrType.value || "";
        const crProcessTypeId = this.state.selectValueProcess.value || "";
        if (impactAffectTwoLevel === null || related === "3" || crType === "1") {
            this.setState({
                listApprovalDepartment: lst
            }, () => {
                this.props.setStateToParentState(0, this.state);
            });
        }
        if (lstAppDept !== null) {
            if (impactAffectTwoLevel.trim() === "4") {
                if (lstAppDept.length > 0) {
                    lst.push(lstAppDept[0]);
                }
                this.setState({
                    listApprovalDepartment: lst
                }, () => {
                    this.props.setStateToParentState(0, this.state);
                });
            } else {
                if (crProcessTypeId !== null && crProcessTypeId !== "") {
                    this.props.actions.findCrProcessById(crProcessTypeId).then(response => {
                        const process = response.payload.data || null;
                        if (process == null || process.approvalLever === null || process.approvalLever === "0") {
                            if (impactAffectTwoLevel.trim() === "1" || impactAffectTwoLevel.trim() === "2" || impactAffectTwoLevel.trim() === "3") {
                                lst.push(...lstAppDept);
                            }
                        } else {
                            if (process.approvalLever === "1") {
                                if (lstAppDept.length > 0) {
                                    lst.push(lstAppDept[0]);
                                }
                            } else if (process.approvalLever === "2") {
                                lst.push(...lstAppDept);
                            }
                        }
                        this.setState({
                            listApprovalDepartment: lst
                        }, () => {
                            this.props.setStateToParentState(0, this.state);
                        });
                    });
                }
            }
        }
    }

    initGUI = (fieldsProperty) => {
        this.props.onChangeVisibleButton(null, null, false, false, null, null);
        // const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        const Constants = buildDataCbo("ACTION_RIGHT");
        const actionRight = this.state.selectedData.actionRight;
        fieldsProperty.pickerCR.visible = false;
        fieldsProperty.reasonType.visible = false;
        fieldsProperty.checkCrAuto.visible = false;
        fieldsProperty.returnCode.visible = false;
        fieldsProperty.crType.disable = true;
        fieldsProperty.unitAppraisal.visible = false;
        fieldsProperty.priority.disable = true;
        fieldsProperty.disturbanceStartTime.disable = true;
        fieldsProperty.disturbanceEndTime.disable = true;
        fieldsProperty.disturbanceEndTime.disable = true;
        fieldsProperty.disturbanceEndTime.disable = true;
        fieldsProperty.circleAdditionalInfo.disable = false;
        fieldsProperty.changeResponsibleUnit.disable = true;
        fieldsProperty.userAppraisal.visible = false;
        fieldsProperty.userCab.visible = false;
        fieldsProperty.viewUser.visible = false;
        // truongnt add new
        if (this.state.modalName !== "ADD") {
            if (Constants.CAN_SCHEDULE !== actionRight
                    && Constants.CAN_SCHEDULE_EMR !== actionRight
                    && Constants.CAN_SCHEDULE_PREAPPROVE !== actionRight) {
                fieldsProperty.changeResponsible.disable = true;
            }
            if (this.state.modalName === "CLONE") {
                fieldsProperty.isConfirmAction.visible = true;
            }
            if (this.state.selectedData.considerUnitName === null
                    || this.state.selectedData.considerUnitName.trim() === "") {
                fieldsProperty.considerUnit.visible = false;
                fieldsProperty.considerUser.visible = false;
            } else {
                fieldsProperty.considerUnit.visible = true;
                fieldsProperty.considerUser.visible = true;
            }
        } else {
            fieldsProperty.isConfirmAction.visible = true;
        }
    }

    enableButtonGrid = (enable) => {
        if (this.state.modalName !== "VIEW") {
            this.props.onChangeVisibleButton(enable, null, null, null, null, null);
        } else {
            this.props.onChangeVisibleButton(false, null, null, null, null, null);
        }
        this.props.showToolbarGrid("attachment", {all: enable});
        this.props.showToolbarGrid("networkNode", {all: enable});
        this.props.showToolbarGrid("networkNodeAffected", {all: enable});
        this.props.showToolbarGrid("workOrder", {all: enable});
        this.props.showToolbarGrid("worklog", {all: true});

        if (!enable) {
            this.props.showToolbarGrid("networkNode", {all: true, add: false, delete: false, export: true, import: false});
            this.props.showToolbarGrid("networkNodeAffected", {all: true, add: false, delete: false, export: true, import: false});
        }
        this.props.showToolbarGrid("alarm", {add: enable, delete: enable, export: true, loadAlarm: enable});
        this.props.showToolbarGrid("module", {add: enable, delete: enable});
        this.props.showToolbarGrid("vendor", {add: enable, delete: enable});
        this.props.showToolbarGrid("lane", {add: enable});
        this.props.showToolbarGrid("cable", {add: enable});
    }

    initConStructor = (actionType, form1) => {
        const Constants = buildDataCbo("ACTION_RIGHT");
        const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        const form = form1;
        this.initGUI(fieldsProperty);
        this.setRequire(true, fieldsProperty);
        this.enableButtonGrid(true);
        this.showControlAction(true, fieldsProperty);
//         setUpLstFailedWoclickedAction();
        this.setReadOnlyForm(true, fieldsProperty);
        if (actionType === "EDIT") {
            this.setReadOnlyForm(true, fieldsProperty);
            if (form.actionRight === null || Constants.LOOKUP_ONLY === form.actionRight.trim() || !Object.keys(Constants).map(key => Constants[key]).includes(form.actionRight.trim())) {
                this.enableButtonGrid(false);
                this.setRequire(false, fieldsProperty);
                this.showControlAction(false, fieldsProperty);
                this.setReadOnlyForm(true, fieldsProperty);
                fieldsProperty.parentCr.visible = false;
            } else if (Constants.CAN_EDIT === form.actionRight.trim()) {
                this.props.onChangeVisibleButton(null, null, null, null, null, true);
                if (this.state.selectedData.state === "0") {
                    this.props.onChangeVisibleButton(null, true, null, null, null, null);
                    fieldsProperty.parentCr.visible = true;
                    fieldsProperty.createdBySys.visible = false;
                }
                if (this.state.selectedData.state === "8") {
                    fieldsProperty.parentCr.visible = true;
                    fieldsProperty.createdBySys.visible = false;
                }
                if (this.state.selectedData.state === "1") {
                    fieldsProperty.parentCr.visible = true;
                    fieldsProperty.createdBySys.visible = false;
                }
            }
            this.props.onChangeVisibleButton(null, null, null, true, null, null);
        } else if (actionType === "ADD") {
                form.actionRight = Constants.CAN_EDIT;
                this.showControlAction(false, fieldsProperty);
                this.loadAppDept();
                this.props.onChangeVisibleButton(null, true, null, null, null, null);
                this.setReadOnlyForm(false, fieldsProperty);
                fieldsProperty.parentCr.visible = true;
        } else if (actionType === "VIEW") {
            this.enableButtonGrid(false);
            this.setRequire(false, fieldsProperty);
            this.showControlAction(false, fieldsProperty);
            this.setReadOnlyForm(true, fieldsProperty);
            fieldsProperty.parentCr.visible = false;
            this.props.onChangeVisibleButton(null, null, null, true, null, null);
        } else if (actionType === "CLONE") {
            this.props.onChangeVisibleButton(null, true, null, null, null, null);
            this.setReadOnlyForm(false, fieldsProperty);
            this.setState({
                selectedData: Object.assign(this.state.selectedData, {isLoadMop: ""})
            });
            this.showControlAction(false, fieldsProperty);
            fieldsProperty.parentCr.visible = true;
        }
        if (actionType !== "VIEW") {
            this.genProcessControl(form.actionRight, fieldsProperty);
        }

        if (actionType !== "ADD") {
            if (actionType === "EDIT") {
                // if (Constants.CAN_EDIT !== form.actionRight.trim()) {
                    this.loadCreateBySys(fieldsProperty);
                // }
            } else {
                this.loadCreateBySys(fieldsProperty);
            }
        }
        this.setState({
            fieldsProperty
        });
    }

    showControlAction = (bl, fieldsProperty) => {
        // const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        fieldsProperty.actionGroup.visible = bl;
        fieldsProperty.noteAction.visible = bl;
        // fieldsProperty.forwardDuty.visible = bl;
        // this.setState({
        //     fieldsProperty
        // });
        // cRDetail.getCssNotesSave().setVisible(bl);
        // cRDetail.getCssAction().setVisible(bl); // action group, ban giao ca truc
        // if (bl) {
        //     cRDetail.getVerActionControlGroup().setHeight("-1px");
        //     cRDetail.getClevel2Layout2().setStyleName("layout-warpping-2-col-level2-2-process");
        //     cRDetail.getVerticalLayout_5().setMargin(new MarginInfo(true, true, false, true));
        // } else {
        //     cRDetail.getVerActionControlGroup().setHeight("10px");
        //     cRDetail.getClevel2Layout2().setStyleName("layout-warpping-2-col-level2-2-create");
        //     cRDetail.getVerticalLayout_5().setMargin(new MarginInfo(false, true, false, true));
        // }
        // cRDetail.getVerActionControlGroup().setVisible(bl);
    }

    genProcessControl = (actionRight, fieldsProperty) => {
        this.setState({
            actionRight
        });
        const Constants = buildDataCbo("ACTION_RIGHT");
        const actionCode = buildDataCbo("ACTION_CODE");
        const lstCbbAction = [];

        if (actionRight !== null && Object.keys(Constants).map(key => Constants[key]).includes(actionRight)) {
            let endDate = null;
            let startDate = null;
            if (this.state.selectedData.crNumber) {
                startDate = new Date(this.state.selectedData.earliestStartTime);
                endDate = new Date(this.state.selectedData.latestStartTime);
            }
            if (Constants.CAN_APPROVE === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.APPROVE);
                }
                lstCbbAction.push(actionCode.REJECT);
                this.enableButtonGrid(false);
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
                this.props.showToolbarGrid("worklog", {all: true});
            } else if (Constants.CAN_APPROVE_STANDARD === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.APPROVE);
                }
                lstCbbAction.push(actionCode.INCOMPLETE_APPROVE_STD);
                this.enableButtonGrid(false);
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
                this.props.showToolbarGrid("worklog", {all: true});
            } else if (Constants.CAN_CONSIDER === actionRight) {
                lstCbbAction.push(actionCode.APPRAISE);
                lstCbbAction.push(actionCode.CLOSE_BY_APPRAISER);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_APPRAISER);
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_APPRAISER);
                lstCbbAction.push(actionCode.ASSIGN_TO_EMPLOYEE_APPRAISAL);
                this.enableButtonGrid(true);
            } else if (Constants.CAN_CONSIDER_NO_ASSIGNEE === actionRight) {
                lstCbbAction.push(actionCode.APPRAISE);
                lstCbbAction.push(actionCode.CLOSE_BY_APPRAISER);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_APPRAISER);
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_APPRAISER);
                this.enableButtonGrid(true);
            } else if (Constants.CAN_CONSIDER_NO_APPRAISE === actionRight) {
                lstCbbAction.push(actionCode.CLOSE_BY_APPRAISER);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_APPRAISER);
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_APPRAISER);
                lstCbbAction.push(actionCode.ASSIGN_TO_EMPLOYEE_APPRAISAL);
            } else if (Constants.CAN_EDIT === actionRight) {
                this.showControlAction(false, fieldsProperty);
                // truongnt add new
                if (this.state.modalName !== "VIEW") {
                    this.setReadOnlyForm(false, fieldsProperty);
                }
                this.enableButtonGrid(true);
            } else if (Constants.CAN_RECEIVE === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ACCEPT);
                    lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                }
                lstCbbAction.push(actionCode.RETURN_TO_APPRAISER_BY_IMPL);
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_IMPL);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_NO_ACCEPT === actionRight) {
                lstCbbAction.push(actionCode.RETURN_TO_APPRAISER_BY_IMPL);
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_IMPL);
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                }
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_NO_ASSIGNEE === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ACCEPT);
                }
                lstCbbAction.push(actionCode.RETURN_TO_APPRAISER_BY_IMPL);
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_IMPL);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_EMR === actionRight) {
                lstCbbAction.push(actionCode.ACCEPT);
                lstCbbAction.push(actionCode.CLOSE_EXCUTE_EMERGENCY);
                lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_EMR_NO_ACCEPT === actionRight) {
                lstCbbAction.push(actionCode.CLOSE_EXCUTE_EMERGENCY);
                lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_EMR_NO_ASSIGNEE === actionRight) {
                lstCbbAction.push(actionCode.ACCEPT);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_PREAPPROVE === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ACCEPT);
                    lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                }
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_IMPL);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_PREAPPROVE_NO_ACCEPT === actionRight) {
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_IMPL);
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                }
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_PREAPPROVE_NO_ASSIGNEE === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ACCEPT);
                }
                lstCbbAction.push(actionCode.RETURN_TO_MANAGER_BY_IMPL);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_STANDARD === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ACCEPT);
                    lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                }
                lstCbbAction.push(actionCode.UPDATE_CR_WHEN_RECEIVE_STD);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_WHEN_EXCUTE_STD);
                this.enableButtonGrid(true);
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_STANDARD_NO_ACCEPT === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                }
                lstCbbAction.push(actionCode.UPDATE_CR_WHEN_RECEIVE_STD);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_WHEN_EXCUTE_STD);
                this.enableButtonGrid(true);
                this.props.onChangeVisibleButton(true, null, null, null, null);
            } else if (Constants.CAN_RECEIVE_STANDARD_NO_ASSIGNEE === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    lstCbbAction.push(actionCode.ACCEPT);
                }
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_RESOLVE === actionRight) {
                lstCbbAction.push(actionCode.RESOLVE);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
                fieldsProperty.forwardDuty.visible = true;
                this.initActionAssign();
            } else if (Constants.CAN_ONLY_REASSIGN === actionRight) {
                if (endDate !== null && endDate > new Date()) {
                    if (startDate !== null && startDate > new Date()) {
                        lstCbbAction.push(actionCode.ASSIGN_EXC_TO_EMPLOYEE);
                    }
                }
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("attachment", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_SCHEDULE === actionRight) {
                lstCbbAction.push(actionCode.SCHEDULE);
                if (this.state.selectedData.crType !== "1") {//Neu khong phai cr khan thi ko co buoc nay
                    lstCbbAction.push(actionCode.RETURN_TO_APPRAISE_BY_MANAGER_SCH);
                    if (this.state.selectedData.risk !== "4" && this.state.selectedData.impactSegment !== "121") {
                        lstCbbAction.push(actionCode.RETURN_TO_CAB_WHEN_SCHEDULE);
                    }
                }
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_MANAGER_SCH);
                lstCbbAction.push(actionCode.CLOSE_BY_MANAGER_SCH);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, true, null, null, null);
            } else if (Constants.CAN_SCHEDULE_EMR === actionRight) {
                lstCbbAction.push(actionCode.SCHEDULE);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_MANAGER_SCH);
                lstCbbAction.push(actionCode.CLOSE_BY_MANAGER_SCH);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, true, null, null, null);
            } else if (Constants.CAN_SCHEDULE_PREAPPROVE === actionRight) {
                lstCbbAction.push(actionCode.SCHEDULE);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_MANAGER_SCH);
                lstCbbAction.push(actionCode.CLOSE_BY_MANAGER_SCH);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, true, null, null, null);
            } else if (Constants.CAN_VERIFY === actionRight) {
                if (this.state.selectedData.risk !== "4" && this.state.selectedData.impactSegment !== "121") {
                    lstCbbAction.push(actionCode.CHANGE_TO_CAB);
                } else {
                    lstCbbAction.push(actionCode.CHANGE_TO_SCHEDULE);
                }
                lstCbbAction.push(actionCode.ASSIGN_TO_CONSIDER);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_MANAGER);
                lstCbbAction.push(actionCode.CLOSE_BY_MANAGER);
                if (this.state.selectedData.risk === "4" && this.state.selectedData.crType === "4") {
                } else {
                    lstCbbAction.push(actionCode.ASSIGN_TO_CAB);
                }
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, true, null, null, null);
            } else if (Constants.CAN_CLOSE === actionRight) {
                lstCbbAction.push(actionCode.CLOSECR);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.showToolbarGrid("workOrder", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_ONLY_ADDWORKLOG === actionRight) {
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(false, null, null, null, null, null);
                this.showControlAction(false, fieldsProperty);
                this.setReadOnlyForm(true, fieldsProperty);
            } else if (Constants.CAN_ASSIGN_CAB === actionRight) {
                lstCbbAction.push(actionCode.ASSIGN_TO_CAB);
                lstCbbAction.push(actionCode.CAB);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_BY_MANAGER_CAB);
                //cr qua tham dinh moi tra ve dc
                if (this.state.selectedData.considerUserId !== null && this.state.selectedData.considerUserId !== "") {
                    lstCbbAction.push(actionCode.RETURN_TO_APPRAISE_BY_MANAGER_CAB);
                }
                lstCbbAction.push(actionCode.CLOSE_BY_MANAGER_CAB);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_EDIT_CR_BY_QLTD === actionRight) {
                lstCbbAction.push(actionCode.EDIT_CR_BY_QLTD);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            } else if (Constants.CAN_CAB === actionRight) {
                lstCbbAction.push(actionCode.CAB);
                lstCbbAction.push(actionCode.RETURN_TO_CREATOR_WHEN_CAB);
                lstCbbAction.push(actionCode.RETURN_TO_CONSIDER_WHEN_CAB);
                lstCbbAction.push(actionCode.RETURN_TO_MANAGE_WHEN_CAB);
                this.enableButtonGrid(false);
                this.props.showToolbarGrid("worklog", {all: true});
                this.props.onChangeVisibleButton(true, null, null, null, null, null);
            }

            // bo sung thêm hành động khi tiếp nhận CR 
            if (Constants.CAN_RECEIVE === actionRight
                    || Constants.CAN_RECEIVE_NO_ACCEPT === actionRight
                    || Constants.CAN_RECEIVE_NO_ASSIGNEE === actionRight
                    || Constants.CAN_RECEIVE_STANDARD === actionRight
                    || Constants.CAN_RECEIVE_STANDARD_NO_ACCEPT === actionRight
                    || Constants.CAN_RECEIVE_STANDARD_NO_ASSIGNEE === actionRight
                    || Constants.CAN_RECEIVE_EMR === actionRight
                    || Constants.CAN_RECEIVE_EMR_NO_ACCEPT === actionRight
                    || Constants.CAN_RECEIVE_EMR_NO_ASSIGNEE === actionRight
                    || Constants.CAN_RECEIVE_PREAPPROVE === actionRight
                    || Constants.CAN_RECEIVE_PREAPPROVE_NO_ACCEPT === actionRight
                    || Constants.CAN_RECEIVE_PREAPPROVE_NO_ASSIGNEE === actionRight
                    || Constants.CAN_ONLY_REASSIGN === actionRight) {
                if (endDate !== null && endDate <= new Date()) {
                    // if (addedWoIdList != null && !addedWoIdList.isEmpty()) {
                    //     lstCbbAction.add(new ItemDataCR(actionCode.RESOLVE_WITH_FAILT_STATUS_DUE_TO_WO.toString(),
                    //             StringUtils.convertKeyToValueByMap(actionCode.getActionCodeName,
                    //                     actionCode.RESOLVE_WITH_FAILT_STATUS_DUE_TO_WO.toString())));
                    // }
                }
            }

        }
        this.setState({
            lstCbbAction,
        });
    }

    initActionAssign = () => {
        const { selectedData } = this.state;
        if (selectedData.isHandoverCa === "1") { //cho tiep nhan ban giao
            if (selectedData.handoverCa !== null && selectedData.handoverCa + "" === JSON.parse(localStorage.user).userID + "") {
            //     btnApproveAssign.setVisible(true);
            //     btnRejectAssign.setVisible(true);
            //     btnSave.setVisible(false);
            }
            this.setState({
                forwardDuty: this.props.t("crManagement:crManagement.dropdown.fowardDuty.wait")
            });
        } else if (selectedData.isHandoverCa === "2") { //tiep nhan ban giao
            this.setState({
                forwardDuty: this.props.t("crManagement:crManagement.dropdown.fowardDuty.delivered")
            });
        } else if (selectedData.isHandoverCa === "-1") { //tu choi ban giao
            this.setState({
                forwardDuty: this.props.t("crManagement:crManagement.dropdown.fowardDuty.handed")
            });
            this.props.onChangeVisibleButton(null, null, null, null, true, null);
        } else {
            this.setState({
                forwardDuty: this.props.t("crManagement:crManagement.dropdown.fowardDuty.handed")
            });
            this.props.onChangeVisibleButton(null, null, null, null, true, null);
        }
    }

    setDefaultValue = () => {
        if (this.state.modalName === "ADD") {
            this.setState({
                selectValueOrginatorUnit: {value: JSON.parse(localStorage.user).deptId}
            });
        } else {
            let selectValueRelatedCr = {};
            if (this.state.selectedData.crTypeCat !== null && this.state.selectedData.crTypeCat().trim() === "4") {
                selectValueRelatedCr = {value: "4"};
            } else if (this.state.selectedData.isPrimaryCr !== null && this.state.selectedData.isPrimaryCr.trim() === "1") {
                selectValueRelatedCr = {value: "1"};
            } else if (this.state.selectedData.relateToPrimaryCr !== null && this.state.selectedData.relateToPrimaryCr.trim() !== "") {
                selectValueRelatedCr = {value: "2"};
                if (this.state.modalName !== "CLONE") {
                    this.setState({
                        chooseCrRelated: this.state.selectedData.relateToPrimaryCr ? { crNumber: this.state.selectedData.relateToPrimaryCr } : {}
                    });
                }
            } else if (this.state.selectedData.relateToPreApprovedCr !== null && this.state.selectedData.relateToPreApprovedCr.trim() !== "") {
                selectValueRelatedCr = {value: "3"};
                if (this.state.modalName !== "CLONE") {
                    this.setState({
                        chooseCrRelated: this.state.selectedData.relateToPreApprovedCr ? { crNumber: this.state.selectedData.relateToPreApprovedCr } : {}
                    });
                }
            } else {
                selectValueRelatedCr = {value: "0"};
            }
            const userCab = this.state.selectedData.lstUserCab ? (this.state.selectedData.lstUserCab.find(item => item.valueStr + "" === this.state.selectedData.userCab + "") || {}) : {};
            this.setState({
                selectValueNation: this.state.selectedData.country ? {value: this.state.selectedData.country} : {},
                isAffected: this.state.selectedData.serviceAffecting === "0" ? "no" : "yes",
                selectValueOrginatorUnit: this.state.selectedData.changeOrginatorUnit ? {value: this.state.selectedData.changeOrginatorUnit} : {},
                selectValueImpactType: this.state.selectedData.dutyType ? {value: this.state.selectedData.dutyType} : {},
                earliestStartTime: this.state.selectedData.earliestStartTime ? new Date(this.state.selectedData.earliestStartTime) : null,
                latestStartTime: this.state.selectedData.latestStartTime ? new Date(this.state.selectedData.latestStartTime) : null,
                disturbanceStartTime: this.state.selectedData.disturbanceStartTime ? new Date(this.state.selectedData.disturbanceStartTime) : null,
                disturbanceEndTime: this.state.selectedData.disturbanceEndTime ? new Date(this.state.selectedData.disturbanceEndTime) : null,
                selectValueAffectedLevel: this.state.selectedData.impactAffect ? {value: this.state.selectedData.impactAffect} : {},
                selectValueResponsibleUnit: this.state.selectedData.changeResponsibleUnit ? {value: this.state.selectedData.changeResponsibleUnit} : {},
                selectValueResponsible: this.state.selectedData.changeResponsible ? {value: this.state.selectedData.changeResponsible} : {},
                selectValueAffectedService: this.state.selectedData.lstAffectedService ? this.state.selectedData.lstAffectedService.map(item => {return {value: item.affectedServiceId}}) : [],
                selectValueRelatedCr,
                selectValueActionGroup: this.state.selectedData.actionType ? {value: this.state.selectedData.actionType} : {},
                userCab: userCab.valueStr ? {username: userCab.displayStr, userCab: userCab.valueStr} : {},
                selectValueCircle: this.state.selectedData.circle ? {value: this.state.selectedData.circle} : {}
            }, () => {
                this.actionChangeValue();
            });
        }
    }

    openProcessCrPopup = () => {
        this.setState({
            isOpenPopupProcessCr: true
        });
    }

    closeProcessCrPopup = () => {
        this.setState({
            isOpenPopupProcessCr: false
        });
    }

    setValueProcessCrPopup = (state) => {
        this.setState({
            selectValueCrType: state.selectValueCrType,
            selectValueProcess: state.selectValueProcess,
            selectValuePriority: state.selectValuePriority,
            selectValueSubcategory: state.selectValueSubcategory,
            selectValueDeviceType: state.selectValueDeviceType,
            selectValueImpactSegment: state.selectValueImpactSegment,
            selectValueRisk: state.selectValueRisk,
            selectValueChildDomain: state.selectValueChildDomain,
            tracingCRCB: state.tracingCRCB
        }, () => {
            const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
            //show hide relate
            this.showHideRelate(this.state.selectValueCrType.value, this.state.actionRight, fieldsProperty);
            this.loadAppDept();
            this.props.setStateToParentState(0, this.state);
            // truongnt add
            if (state.selectValueCrType.value === "1") {
                fieldsProperty.parentCr.required = true;
            }

            const item = this.state.selectValueProcess.value;
            const crTypeStr = this.state.selectValueCrType.value;
            this.props.actions.findCrProcessById(item).then(response => {
                console.log(response);
            });
            if (item !== null && item === "0") {
                if (this.state.actionRight === "1") {
                    fieldsProperty.dutyType.disable = false;
                }
            } else {
                fieldsProperty.dutyType.disable = true;
                // cRDetail.getCbbDutyType().setEnabled(true);
                // ItemDataCR secondary = CRCommon.getItemDataCombobox(cRDetail.getCbbCRProcess(), mapCrProcess);
                // if (secondary != null) {
                //     String[] secondaryArr = secondary.getSecondArray();
                //     if (secondaryArr.length > 1) {
                //         String isLeaf = secondaryArr[1];
                //         if (!"1".equals(isLeaf.trim())) {//Không phải là quy trình lá
                //             CRCommon.showAlert(BundleUtils.getChangeManageString("cr.msg.alert"), BundleUtils.getChangeManageString("cr.msg.must.be.choose.leaf.process"));
                //             cRDetail.getCbbCRProcess().unselect(item);
                //         }
                //         String dutyType = secondaryArr[0];
                //         cRDetail.getCbbDutyType().select(dutyType);
                //     } else {
                //         String dutyType = secondaryArr[0];
                //         cRDetail.getCbbDutyType().select(dutyType);
                //     }
                // }
                // cRDetail.getCbbDutyType().setEnabled(false);
            }
            this.setState({
                changeResponsibleUnit: {},
                changeResponsible: {}
            });
            if ((this.state.modalName === "ADD" || this.state.modalName === "CLONE") && item !== null && item != "0") {
                // List<CrAlarmSettingDTO> listSearch = CrAlarmServiceImpl.getCrAlarmServieImpl().getAlarmSetting(null, null, null, Long.parseLong(item),
                //         null, null, null, null, null);
                // if (listSearch != null && !listSearch.isEmpty() && listSearch.get(0).getAutoLoad() != null && listSearch.get(0).getAutoLoad().equals(1L)) {
                //     loadAutoAlarm(Long.parseLong(item));
                // this.props.parentComponent.stateChildAlarmTab.searchAlarmByProcess();
                // } else {
                //     addedAlarmMap = new HashMap<>();
                //     addedVendorMap = new HashMap<>();
                //     addedModuleMap = new HashMap<>();
                //     setupTableAlarm(addedAlarmMap.values());
                //     setupTableVendor(addedVendorMap.values());
                //     setupTableModule(addedModuleMap.values());
                // }
            }
            if (item !== null) {
                this.props.actions.findCrProcessById(item).then(response => {
                    const process = response.payload.data;
                    if (process !== null && process.requireMop === "1" && crTypeStr === "2") {
                        this.props.showToolbarGrid("networkNodeAffected", {delete: false, add: false, import: false});
                        this.props.showToolbarGrid("networkNode", {delete: false, add: false, import: false});
                    } else {
                        this.props.showToolbarGrid("networkNodeAffected", {delete: true, add: true, import: true});
                        this.props.showToolbarGrid("networkNode", {delete: true, add: true, import: true});
                    }
                });
            }
            this.setState({
                fieldsProperty
            });
        });
    }

    openSourceCrPopup = () => {
        this.setState({
            isOpenSourceCrPopup: true
        });
    }

    closeSourceCrPopup = () => {
        this.setState({
            isOpenSourceCrPopup: false
        });
    }

    openCrRelatedPopup = () => {
        this.setState({
            isOpenCrRelatedPopup: true
        });
    }

    closeCrRelatedPopup = () => {
        this.setState({
            isOpenCrRelatedPopup: false
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        this.setState({
            isValidSubmitForm: false
        }, () => {
            this.props.onChangeChildTab(this.state.tabIndex, this.state, errors);
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.setState({
            isValidSubmitForm: true
        }, () => {
            const state = Object.assign({}, this.state);
            state.dataInfoTab = values;
            this.props.onChangeChildTab(this.state.tabIndex, state);
        });
    }

    onSubmitForm(tabIndex, isVisibleTab) {
        this.setState({
            tabIndex
        }, () => {
            if (isVisibleTab) {
                this.myForm.submit();
            } else {
                setTimeout(() => {
                    this.props.onChangeChildTab(this.state.tabIndex, {isValidSubmitForm: true});
                }, 100);
            }
        });
    }

    loadCreateBySys = (fieldsProperty) => {
        this.props.actions.getCreatedBySys(this.state.selectedData.crId).then(response => {
            const lstSystem = response.payload.data || [];
            let system = "";
            if (lstSystem.length === 0 || ["ADD", "CLONE"].includes(this.state.modalName)) {
                fieldsProperty.createdBySys.visible = false;
                fieldsProperty.createdBySys.disable = true;
            } else {
                for (let item of lstSystem) {
                    system += item.displayStr.trim() + "; ";
                }
                // truongnt add
                if (!fieldsProperty.parentCr.visible) {
                    fieldsProperty.createdBySys.visible = true;
                }
            }
            this.setState({
                sourceCreateCr: lstSystem.map(item => {return {itemName: item.displayStr.trim()}}),
                createdBySys: system
            });
        });
    }

    handleChangeActionGroup = (d) => {
        this.setState({
            selectValueActionGroup: d
        }, () => {
            const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
            fieldsProperty.reasonType.visible = true;
            fieldsProperty.crType.disable = true;
            fieldsProperty.unitAppraisal.visible = false;
            fieldsProperty.userCab.visible = false;
            fieldsProperty.viewUser.visible = false;
            this.stateInfoTabProcess.handleChangeSubcategory(this.state.selectValueSubcategory);//De reLoad Priority
            fieldsProperty.priority.disable = true;
            fieldsProperty.earliestStartTime.disable = true;
            fieldsProperty.latestStartTime.disable = true;
            fieldsProperty.changeResponsibleUnit.disable = true;
            fieldsProperty.disturbanceStartTime.disable = true;
            fieldsProperty.disturbanceEndTime.disable = true;
            fieldsProperty.changeResponsible.disable = true;
            fieldsProperty.isAffected.disable = true;
            fieldsProperty.totalAffectedCustomersTF.disable = true;
            fieldsProperty.totalAffectedMinutesTF.disable = true;
            fieldsProperty.tracingCR.disable = true;
            fieldsProperty.userAppraisal.visible = false;
            fieldsProperty.checkCrAuto.visible = false;
            fieldsProperty.returnCode.visible = false;
            fieldsProperty.lstFailedWo.visible = false;
            // truongnt add new
            fieldsProperty.isConfirmAction.visible = false;
//             this.subDTCode = null;

            const value = this.state.selectValueActionGroup.value || "";
            const actionCode = buildDataCbo("ACTION_CODE");
            if (actionCode.APPROVE.itemId === value || actionCode.APPRAISE.itemId === value
                    || actionCode.ACCEPT.itemId === value) {
                fieldsProperty.reasonType.disable = false;
                // truongnt add new
                if (actionCode.APPRAISE.itemId === value) {
                    fieldsProperty.isConfirmAction.visible = true;
                }
            } else if (actionCode.UPDATE_CR_WHEN_RECEIVE_STD.itemId === value) {
                fieldsProperty.priority.disable = false;
                this.stateInfoTabProcess.loadCbbPriority(null, null, value);
                fieldsProperty.earliestStartTime.disable = false;
                fieldsProperty.latestStartTime.disable = false;
                fieldsProperty.changeResponsibleUnit.disable = false;
                fieldsProperty.reasonType.visible = false;
                fieldsProperty.disturbanceStartTime.disable = false;
                fieldsProperty.disturbanceEndTime.disable = false;
                fieldsProperty.circleAdditionalInfo.disable = true;
                fieldsProperty.isAffected.disable = false;
            } else if (actionCode.CHANGE_CR_TYPE.itemId === value) { //KHONG DUNG NUA
            } else if (actionCode.SCHEDULE.itemId === value) {
                fieldsProperty.priority.disable = false;
                fieldsProperty.priority.required = true;
                fieldsProperty.dutyType.disable = false;
                fieldsProperty.changeResponsibleUnit.disable = false;
                fieldsProperty.changeResponsibleUnit.required = true;
                fieldsProperty.reasonType.visible = false;
                this.stateInfoTabProcess.loadCbbPriority(null, null, value);

                fieldsProperty.earliestStartTime.disable = false;
                fieldsProperty.latestStartTime.disable = false;
                fieldsProperty.disturbanceStartTime.disable = false;
                fieldsProperty.disturbanceEndTime.disable = false;

                fieldsProperty.circleAdditionalInfo.disable = false;
                fieldsProperty.isAffected.disable = false;

                fieldsProperty.changeResponsible.disable = false;

                // CrFilesAttachDTO crFile = new CrFilesAttachDTO();
                // crFile.setCrId(this.cRDetail.getLbCRId().getValue());
                // List<CrFilesAttachDTO> attachmentList = CrFilesAttachServiceImpl.getCrFilesAttachServiceImpl().getListCrFilesAttachDTO(crFile, 0, 100, "", "");
                // boolean check = false;
                // if (attachmentList != null) {
                //     for (CrFilesAttachDTO dto : attachmentList) {
                //         if (dto.getDtFileHistory() == null || dto.getDtCode() == null) {
                //             continue;
                //         }
                //         this.subDTCode = dto.getDtCode();
                //         check = true;
                //         break;
                //     }
                // }
                // if (check) {
                //     this.cRDetail.getCpcbbCheckCrAuto().setVisible(true);
                // }

                // truongnt add new
                fieldsProperty.isConfirmAction.visible = true;
            } else if (actionCode.CLOSECR.itemId === value) {
                this.props.actions.getListActionCodeByCode("RESOLVE_").then(response => {
                    this.setState({
                        lstReturnCodeAll: response.payload.data || []
                    });
                });
                fieldsProperty.returnCode.visible = true;
            } else if (actionCode.RESOLVE.itemId === value || actionCode.RESOLVE_APPROVE_STD.itemId === value) {
                this.props.actions.getListActionCodeByCode("RESOLVE_").then(response => {
                    this.setState({
                        lstReturnCodeAll: response.payload.data || []
                    });
                });
                fieldsProperty.returnCode.visible = true;
            } else if (actionCode.ASSIGN_TO_CONSIDER.itemId === value) {
                fieldsProperty.reasonType.visible = false;
                fieldsProperty.unitAppraisal.visible = true;
                fieldsProperty.viewUser.visible = true;
                fieldsProperty.earliestStartTime.disable = false;
                fieldsProperty.latestStartTime.disable = false;
                fieldsProperty.disturbanceStartTime.disable = false;
                fieldsProperty.disturbanceEndTime.disable = false;
            } else if (actionCode.ASSIGN_TO_EMPLOYEE_APPRAISAL.itemId === value
                    || actionCode.ASSIGN_EXC_TO_EMPLOYEE.itemId === value) {
                fieldsProperty.userAppraisal.visible = true;
                fieldsProperty.reasonType.visible = false;
                this.props.actions.actionGetListUser(JSON.parse(localStorage.user).deptId, "", "", "", "", "", "", "1").then((response) => {
                    this.setState({
                        listUserConsider: response.payload.data || []
                    });
                })
            } else if (actionCode.CHANGE_TO_CAB === value || actionCode.CHANGE_TO_SCHEDULE === value) {
                fieldsProperty.reasonType.visible = false;
                // enable picker user
                fieldsProperty.userCab.visible = false;
                fieldsProperty.earliestStartTime.disable = false;
                fieldsProperty.latestStartTime.disable = false;
                fieldsProperty.disturbanceStartTime.disable = false;
                fieldsProperty.disturbanceEndTime.disable = false;
            } else if (actionCode.ASSIGN_TO_CAB.itemId === value) {
                fieldsProperty.reasonType.visible = false;
                //enable picker user
                fieldsProperty.userCab.visible = true;
                fieldsProperty.earliestStartTime.disable = false;
                fieldsProperty.latestStartTime.disable = false;
                fieldsProperty.disturbanceStartTime.disable = false;
                fieldsProperty.disturbanceEndTime.disable = false;
            } else if (actionCode.CAB.itemId === value) {
                fieldsProperty.reasonType.visible = false;
                fieldsProperty.userCab.visible = false;
                // truongnt add new
                fieldsProperty.isConfirmAction.visible = true;
            } else if (actionCode.RETURN_TO_CREATOR_WHEN_CAB.itemId === value
                    || actionCode.RETURN_TO_CONSIDER_WHEN_CAB.itemId === value
                    || actionCode.RETURN_TO_MANAGE_WHEN_CAB.itemId === value) {
                fieldsProperty.reasonType.visible = false;
                //enable picker user
                fieldsProperty.userCab.visible = false;
            } else if (actionCode.EDIT_CR_BY_QLTD.itemId === value) {
                fieldsProperty.earliestStartTime.disable = false;
                fieldsProperty.latestStartTime.disable = false;
                fieldsProperty.disturbanceStartTime.disable = false;
                fieldsProperty.disturbanceEndTime.disable = false;
                fieldsProperty.reasonType.visible = false;
                fieldsProperty.circleAdditionalInfo.disable = false;
                fieldsProperty.isAffected.disable = false;
                // changeServiceAffecting();
            } else if (actionCode.RETURN_TO_CAB_WHEN_SCHEDULE.itemId === value
                    || actionCode.RETURN_TO_CREATOR_BY_MANAGER_CAB.itemId === value
                    || actionCode.RETURN_TO_APPRAISE_BY_MANAGER_CAB.itemId === value
                    || actionCode.CLOSE_BY_MANAGER_CAB.itemId === value) {
                fieldsProperty.reasonType.visible = false;
                fieldsProperty.userCab.visible = false;
            } else if (actionCode.RESOLVE_WITH_FAILT_STATUS_DUE_TO_WO.itemId === value) {
                fieldsProperty.reasonType.visible = true;
                fieldsProperty.userCab.visible = false;
            }
            this.setState({
                fieldsProperty
            });
            this.props.actions.getListReturnCodeByActionCode(value).then(response => {
                const listReasonType = response.payload.data || [];
                this.setState({
                    listReasonType: listReasonType.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, code: item.secondValue}})
                });
            });
        });
    }

    handleChangeRelatedCr = (d) => {
        this.setState({
            selectValueRelatedCr: d
        }, () => {
            this.changeRelated();
        });
    }

    actionChangeValue = () => {
        this.handleChangeRelatedCr(this.state.selectValueRelatedCr);
        this.handleChangeNation(this.state.selectValueNation);
    }

    setValueSourceCr = (data) => {
        this.setState({
            sourceCreateCr: data
        });
    }

    setValueCrRelated = (data) => {
        this.setState({
            chooseCrRelated: data[0]
        });
    }

    loadDtFromCr = () => {
        if (!this.state.selectValueRelatedCr.value || this.state.selectValueRelatedCr.value + "" !== "3") {
            this.setState({
                tabIndex: 0
            }, () => {
                document.getElementById("custom-relatedCr").focus();
                toastr.warning(this.props.t("crManagement:crManagement.message.required.relatedCr"));
            });
            return;
        }
        const crId = this.state.chooseCrRelated.crId || "";
        if (!crId || crId.trim() === "") {
            this.setState({
                tabIndex: 0
            }, () => {
                document.getElementById("custom-chooseCrRelated").focus();
                toastr.warning(this.props.t("crManagement:crManagement.message.required.chooseRelated"));
            });
            return;
        }
        this.props.actions.loadMop(this.state.chooseCrRelated).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("crManagement:crManagement.message.success.loadDtFromCr"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("crManagement:crManagement.message.error.loadDtFromCr"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("crManagement:crManagement.message.error.loadDtFromCr"));
            }
        });
    }

    handleChangeReasonType = (d) => {
        this.setState({
            selectValueReasonType: d
        }, () => {
            const reasonTypeId = this.state.selectValueReasonType.value || "";
            const action = this.state.selectValueActionGroup.value || "";
            const actionCode = buildDataCbo("ACTION_CODE");
//             cRDetail.getCsslstFailedWo().setVisible(false);
//             lstWoOfCr.clear();
            if (actionCode.RESOLVE.itemId === action + "" || actionCode.CLOSECR.itemId === action + "") {
                const lstCbbReturnView = [];
                for (let item of this.state.lstReturnCodeAll) {
                    if (reasonTypeId + "" === "39" || reasonTypeId + "" === "42") {//Neu la hoan thanh
                        if (item.secondValue.includes("RESOLVE_HT") && !item.secondValue.includes("RESOLVE_HT1P")) {
                            lstCbbReturnView.push(item);
                        }
                    } else if (reasonTypeId + "" === "40" || reasonTypeId + "" === "43") {
                        if (item.secondValue.includes("RESOLVE_HT1P")) {
                            lstCbbReturnView.push(item);
                        }
                    } else if (reasonTypeId + "" === "41" || reasonTypeId + "" === "44") {
                        if (item.secondValue.includes("RESOLVE_RB")) {
                            lstCbbReturnView.push(item);
                        }
                    }
                }
                if (reasonTypeId + "" === "40" || reasonTypeId + "" === "41") {
                    // if (addedWoIdList != null && !addedWoIdList.isEmpty()) {
                    //     lstWoOfCr = getlistWo(crDTOMain.getCrId(), crDTOMain.getCreatedDate(), addedWoIdList);
                    //     if (lstWoOfCr != null && !lstWoOfCr.isEmpty()) {
                    //         List<ItemDataCR> lstCbbReturnCode = CrGeneralServiceImpl.getCrGeneralServiceImpl().getListActionCodeByCode(WO_FAILT_CODE);
                    //         if (lstCbbReturnCode != null && !lstCbbReturnCode.isEmpty()) {
                    //             lstCbbReturnView.addAll(lstCbbReturnCode);
                    //             for (ItemDataCR data : lstCbbReturnCode) {
                    //                 lstReturnCodeAll.put(data.getValueStr(), data);
                    //             }
                    //         }
                    //     }
                    // }
                }
                this.setState({
                    lstCbbReturnView
                });
            } else if (actionCode.RESOLVE_WITH_FAILT_STATUS_DUE_TO_WO.itemId === action + "") {
                if (reasonTypeId + "" === "60") {
                //     lstWoOfCr = getlistWo(crDTOMain.getCrId(), crDTOMain.getCreatedDate(), addedWoIdList);
                //     if (checkWoWaitingFtStatus(lstWoOfCr)) {
                //         cRDetail.getCsslstFailedWo().setVisible(true);
                //     }
                }
            }
        });
    }

    openUserCabPopup = () => {
        this.setState({
            isOpenUserCabPopup: true
        });
    }

    closeUserCabPopup = () => {
        this.setState({
            isOpenUserCabPopup: false
        });
    }

    setValueUserCab = (data) => {
        this.setState({
            userCab: data[0]
        });
    }

    openViewUserPopup = () => {
        if (this.state.selectValueUnitConsider.value) {
            this.setState({
                isOpenViewUserPopup: true
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.considerUnit"));
            setTimeout(() => {
                try {
                    document.getElementById("idFormAddOrEditInfoTab").elements["custom-considerUnit"].focus();
                } catch (error) {
                    console.error(error);
                }
            }, 100);
        }
    }

    closeViewUserPopup = () => {
        this.setState({
            isOpenViewUserPopup: false
        });
    }

    handleChangeNation = (d) => {
        this.setState({
            selectValueNation: d
        }, () => {
            this.props.actions.getListLocationByLevelCBB(3, (d.value || "")).then(response => {
                this.setState({
                    circleList: response.payload.data || []
                });
            });
        });
    }

    setSelectedData = (selectedData) => {
        this.setState({
            selectedData
        });
    }

    render() {
        const { t, response } = this.props;
        const { fieldsProperty, createdDate, nationList } = this.state;
        const objectAddOrEdit = {};
        const impactTypeList = (response.crManagement.getDutyType && response.crManagement.getDutyType.payload) ? response.crManagement.getDutyType.payload.data : [];
        const affectedServiceList = (response.crManagement.getAffectedService && response.crManagement.getAffectedService.payload) ? response.crManagement.getAffectedService.payload.data : [];
        const impactAffectedList = (response.crManagement.getImpactAffect && response.crManagement.getImpactAffect.payload) ? response.crManagement.getImpactAffect.payload.data : [];
        const crWorkList = (response.crManagement.getListCrProcessLevel3 && response.crManagement.getListCrProcessLevel3.payload) ? response.crManagement.getListCrProcessLevel3.payload.data : [];
        const stateList = buildDataCbo("STATE");
        const crRelatedList = buildDataCbo("CR_RELATED");
        if (!["ADD"].includes(this.state.modalName)) {
            objectAddOrEdit.changeOrginatorName = this.state.selectedData.changeOrginatorName || "";
            objectAddOrEdit.title = this.state.selectedData.title || "";
            objectAddOrEdit.description = this.state.selectedData.description || "";
            objectAddOrEdit.totalAffectedCustomers = this.state.selectedData.totalAffectedCustomers || "";
            objectAddOrEdit.totalAffectedMinutes = this.state.selectedData.totalAffectedMinutes || "";
            objectAddOrEdit.circleAdditionalInfo = this.state.selectedData.circleAdditionalInfo || "";
            objectAddOrEdit.crNumber = this.state.selectedData.crNumber || "";
            objectAddOrEdit.actionNotes = this.state.selectedData.actionNotes || "";
            objectAddOrEdit.considerUnitName = this.state.selectedData.considerUnitName || "";
            objectAddOrEdit.considerUserName = this.state.selectedData.considerUserName || "";
        } else {
            const user = JSON.parse(localStorage.user);
            objectAddOrEdit.changeOrginatorName = user.fullName + " (" + user.userName + ")";
        }
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditInfoTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Card>
                        <CardHeader>
                           <span title={this.state.selectedData.crId} style={{ marginRight: '2.5rem' }}><i className="fa fa-barcode mr-2"></i>{this.state.selectedData.crId}</span>
                           <span title={["ADD", "CLONE"].includes(this.state.modalName) ? convertDateToDDMMYYYYHHMISS(createdDate) : convertDateToDDMMYYYYHHMISS(new Date(this.state.selectedData.createdDate))} style={{ marginRight: '2.5rem' }}><i className="fa fa-calendar mr-2"></i>{["ADD", "CLONE"].includes(this.state.modalName) ? convertDateToDDMMYYYYHHMISS(createdDate) : convertDateToDDMMYYYYHHMISS(new Date(this.state.selectedData.createdDate))}</span>
                           <span title={["ADD", "CLONE"].includes(this.state.modalName) ? stateList.find(item => item.itemId === "1").itemName : stateList.find(item => item.itemId + "" === this.state.selectedData.state + "").itemName}><i className="fa fa-dot-circle-o mr-2"></i>{["ADD", "CLONE"].includes(this.state.modalName) ? stateList.find(item => item.itemId === "1").itemName : stateList.find(item => item.itemId + "" === this.state.selectedData.state + "").itemName}</span>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="8">
                                    <CustomAvField name="title" label={t("crManagement:crManagement.label.crName")} autoFocus
                                    placeholder={t("crManagement:crManagement.placeholder.crName")} required={fieldsProperty.crName.required} maxLength="255" disabled={fieldsProperty.crName.disable}
                                    validate={{ required: { value: true, errorMessage: t("crManagement:crManagement.message.required.crName") } }} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"nation"}
                                        label={t("crManagement:crManagement.label.nation")}
                                        isRequired={fieldsProperty.country.required}
                                        messageRequire={t("crManagement:crManagement.message.required.nation")}
                                        options={nationList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleChangeNation}
                                        selectValue={this.state.selectValueNation}
                                        isDisabled={fieldsProperty.country.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="8">
                                    <CustomAvField type="textarea" rows="3" name="description" label={t("crManagement:crManagement.label.description")}
                                    placeholder={t("crManagement:crManagement.placeholder.description")} maxLength="2000" disabled={fieldsProperty.description.disable} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"circle"}
                                        label={t("crManagement:crManagement.label.circle")}
                                        isRequired={fieldsProperty.country.required}
                                        messageRequire={t("crManagement:crManagement.message.required.circle")}
                                        options={this.state.circleList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueCircle: d })}
                                        selectValue={this.state.selectValueCircle}
                                        isDisabled={fieldsProperty.country.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4" className={["ADD", "CLONE"].includes(this.state.modalName) ? "class-hidden" : ""}>
                                    <CustomAvField name="crNumber" label={t("crManagement:crManagement.label.crNumber")} disabled={true} />
                                </Col>
                                <Col xs="12" sm="4">
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.createdBySys.visible ? "" : "class-hidden"}>
                                    <CustomAvField name="createdBySys" label={t("crManagement:crManagement.label.createdBySys")} disabled={true}
                                        value={this.state.createdBySys} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="8">
                                    <CustomInputPopup
                                        name={"crProcess"}
                                        label={t("crManagement:crManagement.label.crProcess")}
                                        placeholder={t("crManagement:crManagement.placeholder.doubleClick")}
                                        value={this.state.selectValueProcess.label || ""}
                                        handleRemove={() => {}}
                                        handleDoubleClick={this.openProcessCrPopup}
                                        isRequired={fieldsProperty.crProcess.required}
                                        messageRequire={t("crManagement:crManagement.message.required.crProcess")}
                                        isDisabledDelete={true}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"affectedLevel"}
                                        label={t("crManagement:crManagement.label.affectedLevel")}
                                        isRequired={true}
                                        messageRequire={t("crManagement:crManagement.message.required.affectedLevel")}
                                        options={impactAffectedList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueAffectedLevel: d })}
                                        selectValue={this.state.selectValueAffectedLevel}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="8">
                                    <CustomMultiSelectLocal
                                        name={"crWork"}
                                        label={t("crManagement:crManagement.label.crWork")}
                                        isRequired={false}
                                        messageRequire={t("crManagement:crManagement.message.required.crWork")}
                                        options={crWorkList.map(item => {return {itemId: item.crProcessId, itemName: item.crProcessName}})}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueCrWork: d })}
                                        selectValue={this.state.selectValueCrWork}
                                        isOnlyInputSelect={false}
                                        isDisabled={fieldsProperty.crProcess.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"impactType"}
                                        label={t("crManagement:crManagement.label.impactType")}
                                        isRequired={fieldsProperty.dutyType.required}
                                        messageRequire={t("crManagement:crManagement.message.required.impactType")}
                                        options={impactTypeList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueImpactType: d })}
                                        selectValue={this.state.selectValueImpactType}
                                        isDisabled={fieldsProperty.dutyType.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomDatePicker
                                        name={"earliestStartTime"}
                                        label={t("crManagement:crManagement.label.startTimeCr")}
                                        isRequired={fieldsProperty.earliestStartTime.required}
                                        messageRequire={t("crManagement:crManagement.message.required.startTimeCr")}
                                        selected={this.state.earliestStartTime}
                                        handleOnChange={(d) => this.setState({ earliestStartTime: d }, () => {this.props.setStateToParentState(0, this.state);})}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={fieldsProperty.earliestStartTime.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomDatePicker
                                        name={"latestStartTime"}
                                        label={t("crManagement:crManagement.label.endTimeCr")}
                                        isRequired={fieldsProperty.latestStartTime.required}
                                        messageRequire={t("crManagement:crManagement.message.required.endTimeCr")}
                                        selected={this.state.latestStartTime}
                                        handleOnChange={(d) => this.setState({ latestStartTime: d }, () => {this.props.setStateToParentState(0, this.state);})}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={fieldsProperty.latestStartTime.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAutocomplete
                                        name={"responsibleUnit"}
                                        label={t("crManagement:crManagement.label.responsibleUnit")}
                                        placeholder={this.props.t("crManagement:crManagement.placeholder.responsibleUnit")}
                                        isRequired={fieldsProperty.changeResponsibleUnit.required}
                                        messageRequire={t("crManagement:crManagement.message.required.responsibleUnit")}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueResponsibleUnit: d })}
                                        selectValue={this.state.selectValueResponsibleUnit}
                                        moduleName={"UNIT"} 
                                        isOnlyInputSelect={false}
                                        isHasCheckbox={false}
                                        isDisabled={fieldsProperty.changeResponsibleUnit.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomDatePicker
                                        name={"disturbanceStartTime"}
                                        label={t("crManagement:crManagement.label.timeEffectServiceFrom")}
                                        isRequired={fieldsProperty.disturbanceStartTime.required}
                                        selected={this.state.disturbanceStartTime}
                                        handleOnChange={(d) => this.setState({ disturbanceStartTime: d })}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={fieldsProperty.disturbanceStartTime.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomDatePicker
                                        name={"disturbanceEndTime"}
                                        label={t("crManagement:crManagement.label.timeEffectServiceTo")}
                                        isRequired={fieldsProperty.disturbanceEndTime.required}
                                        selected={this.state.disturbanceEndTime}
                                        handleOnChange={(d) => this.setState({ disturbanceEndTime: d })}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={fieldsProperty.disturbanceEndTime.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAutocomplete
                                        name={"responsible"}
                                        label={t("crManagement:crManagement.label.responsible")}
                                        placeholder={this.props.t("crManagement:crManagement.placeholder.responsible")}
                                        isRequired={false}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueResponsible: d })}
                                        selectValue={this.state.selectValueResponsible}
                                        moduleName={"USERS"} 
                                        isOnlyInputSelect={false}
                                        isHasChildren={true}
                                        parentValue={(this.state.selectValueResponsibleUnit && this.state.selectValueResponsibleUnit.value) ? this.state.selectValueResponsibleUnit.value : ""}
                                        isDisabled={fieldsProperty.changeResponsible.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="12">
                                    <Card>
                                        <CardHeader>
                                            <span style={{ marginRight: '2.5rem', verticalAlign: 'middle' }}>
                                                {t("crManagement:crManagement.label.serviceAffecting")}
                                            </span>
                                            <span className="mr-4" style={{ verticalAlign: 'middle' }}>
                                                <input type="radio" data-target="#collapseAffected" value="yes" style={{ marginTop: '-3px', verticalAlign: 'middle' }}
                                                    name="isAffected" checked={this.state.isAffected === "yes"} disabled={fieldsProperty.isAffected.disable}
                                                    onChange={(e) => this.setState({ isAffected: e.target.value, collapseAffected: true})} /> {t("common:common.button.yes")}
                                            </span>
                                            <span style={{ verticalAlign: 'middle' }}>
                                                <input type="radio" data-target="#collapseAffected" value="no" style={{ marginTop: '-3px', verticalAlign: 'middle' }}
                                                    name="isAffected" checked={this.state.isAffected === "no"} disabled={fieldsProperty.isAffected.disable}
                                                    onChange={(e) => this.setState({ isAffected: e.target.value, collapseAffected: false})}  /> {t("common:common.button.no")}
                                            </span>
                                            <div className="card-header-actions">
                                                <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseAffected" onClick={() => this.setState({ collapseAffected: !this.state.collapseAffected })}><i className={(this.state.collapseAffected) ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                            </div>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.collapseAffected} id="collapseAffected">
                                            <CardBody>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomMultiSelectLocal
                                                            name={"affectedService"}
                                                            label={t("crManagement:crManagement.label.affectedService")}
                                                            isRequired={this.state.modalName !== "VIEW" ? this.state.isAffected === "yes" : false}
                                                            messageRequire={t("crManagement:crManagement.message.required.affectedService")}
                                                            options={affectedServiceList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                                            closeMenuOnSelect={false}
                                                            handleItemSelectChange={(d) => this.setState({ selectValueAffectedService: d })}
                                                            selectValue={this.state.selectValueAffectedService}
                                                            isOnlyInputSelect={false}
                                                            isDisabled={fieldsProperty.isAffected.disable ? fieldsProperty.affectedService.disable : this.state.isAffected !== "yes"}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="totalAffectedCustomers" label={t("crManagement:crManagement.label.affectedCustomers")}
                                                        required={this.state.modalName !== "VIEW" ? this.state.isAffected === "yes" : false} disabled={fieldsProperty.isAffected.disable ? fieldsProperty.totalAffectedCustomersTF.disable : this.state.isAffected !== "yes"}
                                                        validate={{ required: { value: true, errorMessage: t("crManagement:crManagement.message.required.affectedCustomers") },
                                                                    min: { value: 0, errorMessage: t("crManagement:crManagement.message.error.affectedCustomers") },
                                                                    pattern: { value: "[0-9]", errorMessage: t("crManagement:crManagement.message.error.affectedCustomers") } }} />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="totalAffectedMinutes" label={t("crManagement:crManagement.label.affectedMinutes")}
                                                        required={this.state.modalName !== "VIEW" ? this.state.isAffected === "yes" : false} disabled={fieldsProperty.isAffected.disable ? fieldsProperty.totalAffectedMinutesTF.disable : this.state.isAffected !== "yes"}
                                                        validate={{ required: { value: true, errorMessage: t("crManagement:crManagement.message.required.affectedMinutes") },
                                                                    min: { value: 0, errorMessage: t("crManagement:crManagement.message.error.affectedMinutes") },
                                                                    pattern: { value: "[0-9]", errorMessage: t("crManagement:crManagement.message.error.affectedMinutes") } }} />
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Collapse>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="8">
                                    <CustomAvField type="textarea" rows="3" name="circleAdditionalInfo" label={t("crManagement:crManagement.label.affectedArea")}
                                    placeholder={t("crManagement:crManagement.placeholder.affectedArea")} />
                                </Col>
                                <Col xs="12" sm="4" className={["ADD", "CLONE"].includes(this.state.modalName) ? "class-hidden" : ""}>
                                    <CustomAutocomplete 
                                        name={"orginatorUnit"}
                                        label={t("crManagement:crManagement.label.orginatorUnit")}
                                        isRequired={false}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueOrginatorUnit: d })}
                                        selectValue={this.state.selectValueOrginatorUnit}
                                        moduleName={"UNIT"}
                                        isOnlyInputSelect={false}
                                        isDisabled={true}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={["ADD", "CLONE"].includes(this.state.modalName) ? "class-hidden" : ""}>
                                    <CustomAvField name="changeOrginatorName" label={t("crManagement:crManagement.label.orginator")} disabled={true} />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.considerUnit.visible ? "" : "class-hidden"}>
                                    <CustomAvField name="considerUnitName" label={t("crManagement:crManagement.label.unitConsider")} disabled={true} />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.considerUser.visible ? "" : "class-hidden"}>
                                    <CustomAvField name="considerUserName" label={t("crManagement:crManagement.label.userConsider")} disabled={true} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"relatedCr"}
                                        label={t("crManagement:crManagement.label.relatedCr")}
                                        isRequired={fieldsProperty.crRelated.required}
                                        messageRequire={t("crManagement:crManagement.message.required.relatedCr")}
                                        options={crRelatedList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleChangeRelatedCr}
                                        selectValue={this.state.selectValueRelatedCr}
                                        isDisabled={fieldsProperty.crRelated.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.parentCr.visible ? "" : "class-hidden"}>
                                    <CustomInputPopup
                                        name={"sourceCreateCr"}
                                        label={t("crManagement:crManagement.label.sourceCreateCr")}
                                        placeholder={t("crManagement:crManagement.placeholder.doubleClick")}
                                        value={this.state.sourceCreateCr.map(item => item.itemName).join(";") || ""}
                                        handleRemove={() => this.setState({ sourceCreateCr: [] })}
                                        handleDoubleClick={this.openSourceCrPopup}
                                        isRequired={fieldsProperty.parentCr.required}
                                        messageRequire={t("crManagement:crManagement.message.required.sourceCreateCr")}
                                        isDisabledDelete={true}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.isConfirmAction.visible ? "" : "class-hidden"}>
                                    <CustomAppSwitch
                                        name={"isConfirmAction"}
                                        label={t("crManagement:crManagement.label.confirmImpact")}
                                        checked={this.state.isConfirmAction}
                                        handleChange={(checked) => this.setState({ isConfirmAction: checked })}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.actionGroup.visible ? "" : "class-hidden"}>
                                    <CustomSelectLocal
                                        name={"actionType"}
                                        label={t("crManagement:crManagement.label.actionGroup")}
                                        isRequired={fieldsProperty.actionGroup.visible}
                                        messageRequire={t("crManagement:crManagement.message.required.actionGroup")}
                                        options={this.state.lstCbbAction}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleChangeActionGroup}
                                        selectValue={this.state.selectValueActionGroup}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.forwardDuty.visible ? "" : "class-hidden"}>
                                    <CustomAvField name="forwardDuty" value={this.state.forwardDuty} label={t("crManagement:crManagement.label.forwardDuty")} disabled={true} />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.pickerCR.visible ? "" : "class-hidden"}>
                                    <CustomInputPopup
                                        name={"chooseCrRelated"}
                                        label={t("crManagement:crManagement.label.chooseRelated")}
                                        placeholder={t("crManagement:crManagement.placeholder.doubleClick")}
                                        value={this.state.chooseCrRelated.crNumber || ""}
                                        handleRemove={() => this.setState({ chooseCrRelated: {} })}
                                        handleDoubleClick={this.openCrRelatedPopup}
                                        isRequired={fieldsProperty.pickerCR.visible ? fieldsProperty.pickerCR.required : false}
                                        isDisabled={fieldsProperty.pickerCR.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.loadDt.visible ? "" : "class-hidden"}>
                                    <Row className="mb-2">
                                        <Col xs="12"><Label></Label></Col>
                                    </Row>
                                    <Row style={{ marginLeft: '0' }}>
                                        <Button type="button" color="primary" onClick={this.loadDtFromCr}><i className="fa fa-download"></i> {t("crManagement:crManagement.button.loadDtFromCr")}</Button>
                                    </Row>
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.noteAction.visible ? "" : "class-hidden"}>
                                    <CustomAvField type="textarea" rows="3" name="actionNotes" label={t("crManagement:crManagement.label.noteAction")}
                                        placeholder={t("crManagement:crManagement.placeholder.affectedArea")} maxLength="500" />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.reasonType.visible ? "" : "class-hidden"}>
                                    <CustomSelectLocal
                                        name={"reasonType"}
                                        label={t("crManagement:crManagement.label.reasonType")}
                                        isRequired={fieldsProperty.reasonType.visible}
                                        messageRequire={t("crManagement:crManagement.message.required.reasonType")}
                                        options={this.state.listReasonType}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleChangeReasonType}
                                        selectValue={this.state.selectValueReasonType}
                                        isDisabled={fieldsProperty.reasonType.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.unitAppraisal.visible ? "" : "class-hidden"}>
                                    <CustomAutocomplete
                                        name={"considerUnit"}
                                        label={t("crManagement:crManagement.label.considerUnit")}
                                        placeholder={this.props.t("crManagement:crManagement.placeholder.unitConsider")}
                                        isRequired={fieldsProperty.unitAppraisal.disable}
                                        messageRequire={t("crManagement:crManagement.message.required.considerUnit")}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueUnitConsider: d })}
                                        selectValue={this.state.selectValueUnitConsider}
                                        moduleName={"UNIT"} 
                                        isOnlyInputSelect={false}
                                        isHasCheckbox={false}
                                        isDisabled={fieldsProperty.unitAppraisal.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.userAppraisal.visible ? "" : "class-hidden"}>
                                    <CustomSelectLocal
                                        name={"considerUser"}
                                        label={t("crManagement:crManagement.label.considerUser")}
                                        isRequired={fieldsProperty.userAppraisal.visible}
                                        messageRequire={t("crManagement:crManagement.message.required.considerUser")}
                                        options={this.state.listUserConsider}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueUserConsider: d })}
                                        selectValue={this.state.selectValueUserConsider}
                                        isDisabled={fieldsProperty.userAppraisal.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.checkCrAuto.visible ? "" : "class-hidden"}>
                                    <CustomAppSwitch
                                        name={"checkCrAuto"}
                                        label={t("crManagement:crManagement.label.crCheckAuto")}
                                        checked={this.state.checkCrAuto}
                                        handleChange={(checked) => this.setState({ checkCrAuto: checked })}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.returnCode.visible ? "" : "class-hidden"}>
                                    <CustomSelectLocal
                                        name={"returnCode"}
                                        label={t("crManagement:crManagement.label.returnCode")}
                                        isRequired={fieldsProperty.returnCode.visible}
                                        messageRequire={t("crManagement:crManagement.message.required.returnCode")}
                                        options={this.state.lstCbbReturnView.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueReturnCode: d })}
                                        selectValue={this.state.selectValueReturnCode}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.lstFailedWo.visible ? "" : "class-hidden"}>
                                    <CustomAvField name="lstFailedWo" label={t("crManagement:crManagement.label.lstFailedWo")} disabled={true} />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.userCab.visible ? "" : "class-hidden"}>
                                    <CustomInputPopup
                                        name={"userCab"}
                                        label={t("crManagement:crManagement.label.userCAB")}
                                        placeholder={t("crManagement:crManagement.placeholder.doubleClick")}
                                        value={this.state.userCab.username || ""}
                                        handleRemove={() => this.setState({ userCab: {} })}
                                        handleDoubleClick={this.openUserCabPopup}
                                        isRequired={fieldsProperty.userCab.visible}
                                        messageRequire={t("crManagement:crManagement.message.required.userCAB")}
                                        isDisabled={false}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.viewUser.visible ? "" : "class-hidden"}>
                                    <span style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }} onClick={this.openViewUserPopup}>
                                        {t("crManagement:crManagement.label.viewUser")}
                                    </span>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </AvForm>
                <CrManagementCrInfoTabProcessPopup
                    onRef={ref => (this.stateInfoTabProcess = ref)}
                    parentState={this.state}
                    closePopup={this.closeProcessCrPopup}
                    setValue={this.setValueProcessCrPopup}
                    refParent={this} />
                <CrManagementInfoTabSourceCrPopup
                    parentState={this.state}
                    closePopup={this.closeSourceCrPopup}
                    setValue={this.setValueSourceCr} />
                <CrManagementInfoTabCrRelatedPopup
                    parentState={this.state}
                    closePopup={this.closeCrRelatedPopup}
                    setValue={this.setValueCrRelated} />
                <CrManagementInfoTabUserCabPopup
                    parentState={this.state}
                    closePopup={this.closeUserCabPopup}
                    setValue={this.setValueUserCab} />
                <CrManagementCrInfoTabViewUserPopup
                    parentState={this.state}
                    closePopup={this.closeViewUserPopup} />
            </div>
        );
    }
}

CrManagementCrInfoTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func,
    onChangeVisibleButton: PropTypes.func,
    setStateToParentState: PropTypes.func,
    showToolbarGrid: PropTypes.func,
    parentComponent: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCrInfoTab));