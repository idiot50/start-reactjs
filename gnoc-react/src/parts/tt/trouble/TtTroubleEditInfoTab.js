import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomAvField, CustomAppSwitch, CustomReactTableLocal, CustomAutocomplete, CustomSelectLocal, CustomInputPopup, CustomSelect, CustomMultiSelectLocal, CustomDatePicker, CustomRcTreeSelect } from '../../../containers/Utils';
import TtTroubleAddSearchNodePopup from './TtTroubleAddSearchNodePopup';
import TtTroubleAddSearchUnitPopup from './TtTroubleAddSearchUnitPopup';
import TtTroubleEditInfoTabKedbPopup from './TtTroubleEditInfoTabKedbPopup';
import TtTroubleEditInfoTabRelatedCR from './TtTroubleEditInfoTabRelatedCR';
import { validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";
import TtProblemChatPopup from "./TtTroubleChatPopup"

class TtTroubleEditInfoTab extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAdvanceInfo = this.toggleFormAdvanceInfo.bind(this);
        this.toggleFormReasonAndSolution = this.toggleFormReasonAndSolution.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            collapseFormAdvanceInfo: true,
            collapseFormReasonAndSolution: true,
            isOpenPopupRelatedKedb: false,
            isOpenPopupRelatedCr: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            //Table
            columns: this.buildTableColumns(),
            loading: false,
            //Select
            stationVip: false,
            batchIncident: false,
            help: false,
            autoClose: false,
            selectValueStatus: {},
            selectValuePtType: {},
            selectValueAlarmGroup: {},
            selectValueSubCategory: {},
            selectValueVendor: {},
            selectValueImpact: {},
            selectValuePriority: {},
            selectValueAffectService: [],
            selectValueRisk: {},
            selectValueCountry: {},
            selectValueTranNwType: {},
            selectValueReceiveUser: {},
            selectValueReceiveUnit: {},
            selectValueSupportUnit: {},
            selectValueWarnLevel: {},
            selectValueRejectCode: {},
            networkNodeCode: [],
            selectValueReason: {},
            selectValueSolutionType: {},
            selectValueReasonLv1: {},
            selectValueReasonLv2: {},
            selectValueReasonLv3: {},
            selectValueReasonOverdue1: {},
            selectValueReasonOverdue2: {},
            selectValueCloseCode: {},
            deferredTime: null,
            relatedKedb: "",
            relatedCr: [],
            beginTroubleTime: null,
            endTroubleTime: null,
            isPtTypeChange: true,
            isGetPriority: true,
            isChangeImpact: true,
            isReceiveUnitChange: false,
            isChangeReasonLv1: true,
            isChangeReasonLv2: true,
            isChangeReasonOverdue1: true,
            //combo list
            ptTypeList: [],
            ptSubCatList: [],
            ttStateList: [],
            ttPriorityList: [],
            vendorList: [],
            ttImpactList: [],
            insertSourceList: [],
            warnLevelList: [],
            alarmGroupList: [],
            affectServiceList: [],
            ttRiskList: [],
            countryList: [],
            transNwTypeList: [],
            rejectCodeList: [],
            solutionTypeList: [],
            reasonLv1: [],
            reasonLv2: [],
            reasonLv3: [],
            reasonOverdueLv1: [],
            reasonOverdueLv2: [],
            closeCodeList: [],
            mapConfigProperty: props.parentState.mapConfigProperty,
            fieldsProperty: this.buildDefaultFields(),
            dataChecked: [],
            stateAllList: [],
            //for tab
            isNocCheck: true,
            dataInfoTab: {},
            tabIndex: null,
            isValidSubmitForm: false,
            involveIBMData: {}
        };
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        this.getReason3Level();
        this.setDefaultValue();
        this.getCRRelated();
        this.setFieldsProperty();
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

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isChangeReasonLv1) {
            if (this.state.selectValueReasonLv1.value) {
                const data = { ...this.state.selectedData, parentId: this.state.selectValueReasonLv1.value, level: '2' };
                this.props.actions.getListReasonBCCS(data).then((response) => {
                    this.setState({
                        reasonLv2: response.payload.data.map(item => {return {itemId: item.compCauseId, itemName: item.name}})
                    });
                });
            }
            this.setState({
                isChangeReasonLv1: false
            });
        }
        if (this.state.isChangeReasonLv2) {
            if (this.state.selectValueReasonLv2.value) {
                const data = { ...this.state.selectedData, parentId: this.state.selectValueReasonLv2.value, level: '3' };
                this.props.actions.getListReasonBCCS(data).then((response) => {
                    this.setState({
                        reasonLv3: response.payload.data.map(item => {return {itemId: item.compCauseId, itemName: item.name}})
                    });
                });
            }
            this.setState({
                isChangeReasonLv2: false
            });
        }
        if (this.state.isChangeReasonOverdue1) {
            if (this.state.selectValueReasonOverdue1.value) {
                const data = { ...this.state.selectedData, parentId: this.state.selectValueReasonOverdue1.value, level: '2' };
                this.props.actions.getListReasonOverdue(data).then((response) => {
                    this.setState({
                        reasonOverdueLv2: response.payload.data.map(item => {return {itemId: item.compCauseId, itemName: item.name}})
                    });
                });
            }
            this.setState({
                isChangeReasonOverdue1: false
            });
        }
        if (this.state.isPtTypeChange) {
            this.onChangeType();
            this.setState({
                isPtTypeChange: false
            });
        }
        // if (this.state.isGetPriority) {
        //     if (this.state.selectedData.insertSource !== "SPM" || this.state.selectedData.insertSource !== "BCCS") {
        //         const typeId = this.state.selectValuePtType.value;
        //         const alarmGroupId = this.state.selectValueAlarmGroup.value;
        //         const country = this.state.selectValueCountry.value;
        //         if (typeId && alarmGroupId && country) {
        //             this.props.actions.getPriorityByProps(typeId, alarmGroupId, country).then((response) => {
        //                 this.setState({
        //                     ttPriorityList: response.payload.data
        //                 });
        //             });
        //         } else {
        //             this.setState({
        //                 selectValuePriority: {},
        //                 ttPriorityList: []
        //             });
        //         }
        //     }
        //     this.setState({
        //         isGetPriority: false
        //     });
        // }
        if (this.state.isChangeImpact) {
            if (!this.state.selectValueImpact.value) {
                const fieldsProperty = { ...this.state.fieldsProperty };
                fieldsProperty.affectedService.required = false;
                fieldsProperty.affectedService.disable = true;
                this.setState({
                    fieldsProperty,
                    selectValueAffectService: []
                });
            }
            if (this.state.selectValueImpact.code) {
                const impact = this.state.selectValueImpact.code ? this.state.selectValueImpact : this.state.ttImpactList.find(item => item.itemId + "" === this.state.selectedData.impactId + "") || {};
                const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
                if (impact.code === "Yes") {
                    fieldsProperty.affectedService.required = true;
                    fieldsProperty.affectedService.disable = false;
                    if (this.state.selectValueStatus.value === 9 || this.state.selectValueStatus.value === 10 || this.state.selectValueStatus.value === 11) {
                        fieldsProperty.numAffect.required = true;
                        fieldsProperty.downtime.required = true;
                        fieldsProperty.subMin.required = true;
                    } else {
                        fieldsProperty.numAffect.required = false;
                        fieldsProperty.downtime.required = false;
                        fieldsProperty.subMin.required = false;
                    }
                } else {
                    fieldsProperty.affectedService.required = false;
                    fieldsProperty.affectedService.disable = true;
                    fieldsProperty.reasonTypeCbo.required = false;
                    fieldsProperty.reasonTypeTxt.required = false;
                    fieldsProperty.numAffect.required = false;
                    fieldsProperty.downtime.required = false;
                    fieldsProperty.subMin.required = false;
                    this.setState({
                        selectValueAffectService: []
                    });
                }
                let check = false;
                if (this.state.selectedData.state === 9  && this.state.selectedData.createUnitId === this.state.selectValueReceiveUnit.unitId) {
                    check = true;
                }
                if ((check || this.state.selectedData.state === 10 || this.state.selectedData.state === 11)
                && this.checkExistProperty(this.state.selectedData.typeId, "TT.TYPE.EM_FTTX_CABLE") && impact.code === "Yes") {
                    fieldsProperty.brcd.required = true;
                } else {
                    fieldsProperty.brcd.required = false;
                }
                this.setState({
                    fieldsProperty,
                    isChangeImpact: false
                }, () => {
                    this.props.onChangeChildInfoTab(0, this.state);
                });
            } else {
                if (this.state.ttImpactList.length > 0) {
                    this.setState({
                        isChangeImpact: false
                    });
                }
            }
        }
    }

    onChangeType = () => {
        if (this.state.selectValuePtType.value) {
            this.props.actions.getListItemByCategoryAndParent("PT_SUB_CATEGORY", this.state.selectValuePtType.value).then((response) => {
                this.setState({
                    ptSubCatList: response.payload.data || []
                });
            });
            this.props.actions.getListItemByCategoryAndParent("ALARM_GROUP", this.state.selectValuePtType.value).then((response) => {
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
    }

    checkUserRight = () => {
        const { selectedData } = this.state;
        const userUnitId = JSON.parse(localStorage.user).deptId;
        const state = this.state.stateAllList.find(item => item.itemId === selectedData.state) || {};
        let disable = false;
        if (userUnitId !== selectedData.receiveUnitId && userUnitId !== selectedData.createUnitId) {
            //1. Nguoi dung khong thuoc don vi tao va don vi xu ly => khong duoc cap nhat
            disable = true;
        } else if (userUnitId === selectedData.receiveUnitId && userUnitId === selectedData.createUnitId) {
            //2. Nguoi dung thuoc don vi vua tao va vua xu ly ==> duoc phep cap nhat bat ke trang thai nao
            if (state.itemCode === "CLOSED") {
                disable = true;
            } else {
                disable = false;
            }
        } else if (userUnitId === selectedData.receiveUnitId) {
            //3. Nguoi dung chi thuoc don vi xu ly
            if (state.itemCode === "WAIT FOR DEFERRED" || state.itemCode === "CLEAR" ||state.itemCode === "CLOSED NOT KEDB"
                || state.itemCode === "CLOSED" || state.itemCode === "OPEN"
                || state.itemCode === "REJECT" || state.itemCode === "CANCELED") {
                disable = true;
            }
        } else if (userUnitId === selectedData.createUnitId) {
            //4. Nguoi dung chi thuoc don vi tao
            //chi cho phep cap nhat lai don vi xu ly
            if (state.itemCode === "QUEUE" || state.itemCode === "SOLUTION FOUND"
            || state.itemCode === "WAITING RECEIVE" || state.itemCode === "DEFERRED") {
                this.hideAllTroubleForm();
            } else if (state.itemCode === "CLOSED") {
                disable = true;
            }
        }
        if (userUnitId === selectedData.receiveUnitId) {
            if ((state.itemCode === "CLOSED" || state.itemCode === "CLOSED NOT KEDB") && selectedData.insertSource.includes("NOC")) {
                disable = false;
                // dialog.getTxtWorkArround().setEnabled(true);
                // dialog.getCmbSolutionType().setEnabled(true);
                //trang thai dong ko kedb, don vi tao la don vi xu ly thi dc cap nhat full
                if (state.itemCode === "CLOSED NOT KEDB"
                        && userUnitId === selectedData.createUnitId) {
                } else {
                    this.hideAllTroubleForm();
                }
            }
        }
        this.props.onChangeDisableUpdate(disable);
    }

    hideAllTroubleForm = () => {
        const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        fieldsProperty.status.disable = true;
        fieldsProperty.receiveUserId.disable = true;
        fieldsProperty.supportUnitId.disable = true;
        fieldsProperty.closeCode.disable = true;
        fieldsProperty.impact.disable = true;
        fieldsProperty.subCategoryId.disable = true;
        fieldsProperty.affectedService.disable = true;
        fieldsProperty.priority.disable = true;
        fieldsProperty.riskGroup.disable = true;
        fieldsProperty.numAffect.disable = true;
        fieldsProperty.affectedNode.disable = true;
        this.setState({
            fieldsProperty
        });
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

    buildDefaultFields() {
        return {
            affectedService: {
                required: false, disable: false, visible: true
            },
            reason: {
                required: false, disable: false, visible: false
            },
            reasonOverdue: {
                required: false, disable: false, visible: false
            },
            receiveUnitId: {
                required: true, disable: false, visible: true
            },
            receiveUserId: {
                required: false, disable: false, visible: true
            },
            relatedKedb: {
                required: false, disable: false, visible: true
            },
            // country: {
            //     required: false, disable: true, visible: true
            // },
            relatedCr: {
                required: false, disable: false, visible: true
            },
            rejectReason: {
                required: false, disable: true, visible: true
            },
            batchIncident: {
                required: false, disable: true, visible: false
            },
            closeCode: {
                required: false, disable: true, visible: true
            },
            solutionType: {
                required: false, disable: false, visible: true
            },
            workArround: {
                required: false, disable: false, visible: true
            },
            endTroubleTime: {
                required: false, disable: true, visible: true
            },
            reasonId: {
                required: false, disable: false, visible: true
            },
            rootCause: {
                required: false, disable: false, visible: true
            },
            rejectCode: {
                required: false, disable: true, visible: true
            },
            deferredTime: {
                required: false, disable: true, visible: true
            },
            deferredReason: {
                required: false, disable: true, visible: true
            },
            downtime: {
                required: false, disable: false, visible: true
            },
            numAffect: {
                required: false, disable: false, visible: true
            },
            subMin: {
                required: false, disable: false, visible: true
            },
            brcd: {
                required: false, disable: false, visible: true
            },
            affectedNode: {
                required: false, disable: false, visible: true
            },
            beginTroubleTime: {
                required: false, disable: false, visible: true
            },
            transInfo: {
                required: false, disable: false, visible: false
            },
            transInfo2: {
                required: false, disable: false, visible: false
            },
            lineCut: {
                required: false, disable: false, visible: false
            },
            snippetOff: {
                required: false, disable: false, visible: false
            },
            reasonTypeCbo: {
                required: false, disable: false, visible: false
            },
            reasonTypeTxt: {
                required: false, disable: false, visible: false
            },
            tranNwType: {
                required: false, disable: false, visible: false
            },
            closuresReplace: {
                required: false, disable: false, visible: false
            },
            deviceError: {
                required: false, disable: false, visible: false
            },
            spmCode: {
                required: false, disable: false, visible: true
            },
            status: {
                required: false, disable: false, visible: true
            },
            supportUnitId: {
                required: false, disable: false, visible: true
            },
            impact: {
                required: false, disable: false, visible: true
            },
            subCategoryId: {
                required: false, disable: false, visible: true
            },
            deferType: {
                required: false, disable: false, visible: true
            },
            estimateTime: {
                required: false, disable: false, visible: true
            },
            groupSolution: {
                required: false, disable: false, visible: true
            },
            longitude: {
                required: false, disable: false, visible: true
            },
            latitude: {
                required: false, disable: false, visible: true
            },
            cellService: {
                required: false, disable: false, visible: true
            },
            concave: {
                required: false, disable: false, visible: true
            },
            priority: {
                required: false, disable: false, visible: true
            },
            riskGroup: {
                required: false, disable: false, visible: true
            },
            description: {
                required: false, disable: false, visible: true
            }
        }
    }

    getCRRelated = () => {
        if (this.state.selectedData.relatedCr) {
            this.props.actions.loadCrRelatedDetail(this.state.selectedData.relatedCr).then((response) => {
                this.setState({
                    relatedCr: response.payload.data ? response.payload.data : [],
                });
            });
        }
    }

    setFieldsProperty = () => {
        const fieldsProperty = this.buildDefaultFields();
        // set lai mac dinh
        fieldsProperty.deferredTime.disable = true;
        fieldsProperty.deferredReason.disable = true;
        fieldsProperty.closeCode.disable = true;
        fieldsProperty.rejectReason.disable = true;
        fieldsProperty.rejectCode.disable = true;
        fieldsProperty.solutionType.required = false;
        fieldsProperty.workArround.required = false;
        fieldsProperty.endTroubleTime.required = false;
        fieldsProperty.deferredTime.required = false;
        fieldsProperty.deferredReason.required = false;
        fieldsProperty.closeCode.required = false;
        fieldsProperty.rejectReason.required = false;
        fieldsProperty.rejectCode.required = false;
        fieldsProperty.relatedKedb.required = false;
        fieldsProperty.reasonId.required = false;
        fieldsProperty.rootCause.required = false;
        fieldsProperty.endTroubleTime.disable = true;
        fieldsProperty.closuresReplace.required = false;
        fieldsProperty.lineCut.required = false;
        fieldsProperty.snippetOff.required = false;
        fieldsProperty.tranNwType.required = false;
        fieldsProperty.reasonTypeCbo.required = false;
        fieldsProperty.reasonTypeTxt.required = false;
        fieldsProperty.lineCut.required = false;
        //bccs
        fieldsProperty.longitude.required = false;
        fieldsProperty.latitude.required = false;
        fieldsProperty.groupSolution.required = false;
        fieldsProperty.deferType.required = false;
        fieldsProperty.estimateTime.required = false;

        fieldsProperty.deferType.disable = true;
        fieldsProperty.estimateTime.disable = true;
        fieldsProperty.groupSolution.disable = true;
        fieldsProperty.longitude.disable = true;
        fieldsProperty.latitude.disable = true;
        fieldsProperty.cellService.visible = true;
        fieldsProperty.concave.visible = true;
        fieldsProperty.reason.visible = false;
        fieldsProperty.reason.required = false;
        fieldsProperty.reasonOverdue.visible = false;
        fieldsProperty.reasonOverdue.required = false;
        fieldsProperty.receiveUnitId.disable = true;

        const selectedData = this.state.selectedData;
        //truongnt
        if (selectedData.solutionType && (selectedData.solutionType + "" === "1443" || selectedData.solutionType + "" === "1441")) {
            fieldsProperty.relatedCr.required = true;
        } else {
            fieldsProperty.relatedCr.required = false;
        }
        if (selectedData.state !== 1 || selectedData.state !== 4) {
            fieldsProperty.description.disable = true;
        }
        //end
        if (selectedData.insertSource === "SPM") {
            fieldsProperty.batchIncident.visible = true;
            fieldsProperty.spmCode.visible = true;
            fieldsProperty.spmCode.disable = true;
        } else {
            fieldsProperty.batchIncident.visible = false;
            fieldsProperty.spmCode.visible = false;
        }
        if (selectedData.impactId + "" === "71") {
            fieldsProperty.affectedService.required = true;
            fieldsProperty.affectedService.disable = false;
            if (selectedData.state === 9 || selectedData.state === 10 || selectedData.state === 11) {
                fieldsProperty.numAffect.required = true;
                fieldsProperty.downtime.required = true;
                fieldsProperty.subMin.required = true;
            } else {
                fieldsProperty.numAffect.required = false;
                fieldsProperty.downtime.required = false;
                fieldsProperty.subMin.required = false;
            }
        } else {
            fieldsProperty.affectedService.required = false;
            fieldsProperty.affectedService.disable = true;
        }
        if (selectedData.insertSource.includes("NOC")) {
            fieldsProperty.beginTroubleTime.disable = true;
        }

        if (this.state.selectValuePtType.value) {
            if (this.checkExistProperty(this.state.selectValuePtType.value + "", "TT.TYPE.TRANS")) {
                if (this.checkExistProperty(this.state.selectValuePtType.value + "", "TT.TYPE.TRANS.NODE")) {
                    fieldsProperty.affectedNode.required = true;
                } else {
                    fieldsProperty.affectedNode.required = false;
                }
            } else {
                fieldsProperty.affectedNode.required = false;
            }
        }

        if (selectedData.state === 2) {
            fieldsProperty.rejectReason.required = true;
            fieldsProperty.rejectReason.disable = false;
        } else if (selectedData.state === 11 || selectedData.state === 10) {
            this.setRequireControlForClear(fieldsProperty);
            if (selectedData.state === 11) {
                fieldsProperty.relatedKedb.required = true;
            }
            fieldsProperty.closeCode.disable = false;
            fieldsProperty.closeCode.required = true;
            if (selectedData.insertSource === "SPM" || selectedData.insertSource.includes("BCCS")) {
                if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                    fieldsProperty.reason.visible = true;
                    fieldsProperty.reason.required = true;
                    fieldsProperty.reasonOverdue.disable = true;
                    fieldsProperty.reasonOverdue.visible = true;
                    fieldsProperty.reasonOverdue.required = true;
                } else {
                    fieldsProperty.reason.visible = true;
                    fieldsProperty.reason.required = true;
                }
                fieldsProperty.reason.disable = true;
                if (selectedData.insertSource === "BCCS") {
                    this.setControlForCC(false, fieldsProperty);
                }
                if (this.checkExistProperty(selectedData.reasonId, "TT.REASON.DEVICE.ERR.RESET")) {
                    this.props.setVisibleTab({key: "mobileInfo", value: true});
                }
            }
        } else if (selectedData.state === 9) {
            this.setRequireControlForClear(fieldsProperty);
            if (selectedData.createUnitId === selectedData.receiveUnitId) {
                fieldsProperty.closeCode.disable = false;
                fieldsProperty.closeCode.required = true;
            }
            if (this.state.isNocCheck) {
                if (selectedData.insertSource.includes("NOC")) {
                    if (!selectedData.endTroubleTime) {
                        toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.notClearInNoc"));
                    }
                    // gnocBO
                } else if (selectedData.insertSource === "SPM" || selectedData.insertSource.includes("BCCS")) {
                    fieldsProperty.reason.disable = false;
                    if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                        fieldsProperty.reason.visible = true;
                        fieldsProperty.reason.required = true;
                        fieldsProperty.reasonOverdue.disable = false;
                        fieldsProperty.reasonOverdue.visible = true;
                        fieldsProperty.reasonOverdue.required = true;
                    } else {
                        fieldsProperty.reason.visible = true;
                        fieldsProperty.reason.required = true;
                        fieldsProperty.reasonOverdue.visible = false;
                        fieldsProperty.reasonOverdue.required = false;
                    }
                    fieldsProperty.endTroubleTime.disable = false;
                    if (selectedData.insertSource === "BCCS") {
                        this.setControlForCC(false, fieldsProperty);
                    }
                } else {
                    fieldsProperty.endTroubleTime.disable = false;
                }
            } else {
                fieldsProperty.endTroubleTime.disable = false;
            }
            // Neu dang chon la Da khac phuc thi loai mang truyen dan bat buoc phai chon
            fieldsProperty.tranNwType.required = true;
            //Neu da khac phuc va dich vu la co anh huong
            if (selectedData.impactId + "" === "71") {
                fieldsProperty.reasonTypeCbo.required = true;
                fieldsProperty.reasonTypeTxt.required = true;
                fieldsProperty.downtime.required = true;
                fieldsProperty.numAffect.required = true;
                fieldsProperty.subMin.required = true;
            } else {
                fieldsProperty.reasonTypeCbo.required = false;
                fieldsProperty.reasonTypeTxt.required = false;
                fieldsProperty.downtime.required = false;
                fieldsProperty.numAffect.required = false;
                fieldsProperty.subMin.required = false;
            }
        } else if (selectedData.state === 4) {
            fieldsProperty.rejectReason.required = true;
            fieldsProperty.rejectReason.disable = false;
            fieldsProperty.rejectCode.required = true;
            fieldsProperty.rejectCode.disable = false;
        } else if (selectedData.state === 6) {
            fieldsProperty.deferredTime.required = true;
            fieldsProperty.deferredTime.disable = false;
            fieldsProperty.deferredReason.required = true;
            fieldsProperty.deferredReason.disable = false;
            if (selectedData.insertSource.includes("BCCS")) {
                this.setControlForCC(true, fieldsProperty);
                if (this.checkExistProperty(selectedData.typeId, "TT.TYPE.DD_MOBILE")) {
                    if (selectedData.deferType && selectedData.deferType + "" === "2") {
                        if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = true;
                            fieldsProperty.reasonOverdue.required = true;
                        } else {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = false;
                            fieldsProperty.reasonOverdue.required = false;
                        }
                    } else {
                        fieldsProperty.reason.visible = false;
                        fieldsProperty.reason.required = false;
                        fieldsProperty.reasonOverdue.visible = false;
                        fieldsProperty.reasonOverdue.required = false;
                    }
                }
            }
        } else if (selectedData.state === 7) {
            if (selectedData.insertSource.includes("BCCS")) {
                this.setControlForCC(true, fieldsProperty);
                if (this.checkExistProperty(selectedData.typeId, "TT.TYPE.DD_MOBILE")) {
                    if (selectedData.deferType && selectedData.deferType + "" === "2") {
                        if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = true;
                            fieldsProperty.reasonOverdue.required = true;
                        } else {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = false;
                            fieldsProperty.reasonOverdue.required = false;
                        }
                    } else {
                        fieldsProperty.reason.visible = false;
                        fieldsProperty.reason.required = false;
                        fieldsProperty.reasonOverdue.visible = false;
                        fieldsProperty.reasonOverdue.required = false;
                    }
                }
            }
        } else if (selectedData.state === 8) {
            fieldsProperty.solutionType.disable = false;
            fieldsProperty.solutionType.required = true;
            fieldsProperty.workArround.disable = false;
            fieldsProperty.workArround.required = true;
        } else if (selectedData.state === 3) {
            fieldsProperty.receiveUnitId.disable = true;
        } else if (selectedData.state === 1) {
            fieldsProperty.receiveUnitId.disable = false;
        } else if (selectedData.state === 5) {
            if (selectedData.receiveUnitId === JSON.parse(localStorage.user).deptId
                && (selectedData.isMove === null || selectedData.isMove !== 1)) {
                fieldsProperty.receiveUnitId.disable = false;
            }
        }
        if (selectedData.createUnitId === JSON.parse(localStorage.user).deptId) {
            if (selectedData.state !== 11 && selectedData.state !== 10) {
                fieldsProperty.receiveUnitId.disable = false;
                fieldsProperty.receiveUserId.disable = false;
                fieldsProperty.solutionType.disable = false;
                fieldsProperty.workArround.disable = false;
            } else {
                fieldsProperty.receiveUnitId.disable = true;
                fieldsProperty.receiveUserId.disable = true;
                fieldsProperty.solutionType.disable = true;
                fieldsProperty.workArround.disable = true;
            }
        }
        //truongnt add
        if (JSON.parse(localStorage.user).deptId === selectedData.receiveUnitId) {
            if ((selectedData.state === 10 || selectedData.state === 11) && selectedData.insertSource.includes("NOC")) {
                fieldsProperty.solutionType.disable = false;
                fieldsProperty.workArround.disable = false;
            }
        }

        //start kiem tra de chon canh bao truyen dan lien quan start
        if (selectedData.state === 9) {
            //chua biet lam the nao
        } else {
            //chua biet lam the nao
        }
        if (this.props.parentState.visibleDefault.transInfo) {
            if (selectedData.state === 9 || selectedData.state === 11
                || selectedData.state === 10 || selectedData.state === 5) {
                fieldsProperty.transInfo2.visible = true;
            } else {
                fieldsProperty.transInfo2.visible = false;
            }
            if (selectedData.reasonId) {
                if (this.checkExistProperty(selectedData.reasonId, "TT.TYPE.TRAN.REASON")) {
                    if (selectedData.state === 11 || selectedData.state === 10) {
                        fieldsProperty.closuresReplace.required = true;
                    } else if (selectedData.state === 9) {
                        fieldsProperty.lineCut.required = true;
                        fieldsProperty.snippetOff.required = true;
                    }
                }
            }
        }
        let check = false;
        if (selectedData.state === 9 && selectedData.createUnitId === selectedData.receiveUnitId) {
            check = true;
        }
        if ((check || selectedData.state === 10 || selectedData.state === 11)
        && this.checkExistProperty(selectedData.typeId, "TT.TYPE.EM_FTTX_CABLE") && selectedData.impactId + "" === "71") {
            fieldsProperty.brcd.required = true;
        } else {
            fieldsProperty.brcd.required = false;
        }

        this.setState({
            fieldsProperty
        }, () => {
            this.props.onChangeChildInfoTab(0, this.state);
        });
    }

    setRequireControlForClear(fieldsProperty) {
        fieldsProperty.solutionType.disable = false;
        fieldsProperty.workArround.disable = false;
        fieldsProperty.reasonId.required = true;
        fieldsProperty.rootCause.required = true;
        fieldsProperty.solutionType.required = true;
        fieldsProperty.workArround.required = true;
        fieldsProperty.endTroubleTime.required = true;
    }

    validateWhenStatusChange = () => {
        // const fieldsProperty = this.buildDefaultFields();
        const fieldsProperty = {...this.state.fieldsProperty};
        // set lai mac dinh
        fieldsProperty.deferredTime.disable = true;
        fieldsProperty.deferredReason.disable = true;
        fieldsProperty.closeCode.disable = true;
        fieldsProperty.rejectReason.disable = true;
        fieldsProperty.rejectCode.disable = true;
        fieldsProperty.solutionType.required = false;
        fieldsProperty.workArround.required = false;
        fieldsProperty.endTroubleTime.required = false;
        fieldsProperty.deferredTime.required = false;
        fieldsProperty.deferredReason.required = false;
        fieldsProperty.closeCode.required = false;
        fieldsProperty.rejectReason.required = false;
        fieldsProperty.rejectCode.required = false;
        fieldsProperty.relatedKedb.required = false;
        fieldsProperty.reasonId.required = false;
        fieldsProperty.rootCause.required = false;
        fieldsProperty.endTroubleTime.disable = true;
        fieldsProperty.closuresReplace.required = false;
        fieldsProperty.lineCut.required = false;
        fieldsProperty.snippetOff.required = false;
        fieldsProperty.tranNwType.required = false;
        fieldsProperty.reasonTypeCbo.required = false;
        fieldsProperty.reasonTypeTxt.required = false;
        fieldsProperty.lineCut.required = false;
        //bccs
        fieldsProperty.longitude.required = false;
        fieldsProperty.latitude.required = false;
        fieldsProperty.groupSolution.required = false;
        fieldsProperty.deferType.required = false;
        fieldsProperty.estimateTime.required = false;

        fieldsProperty.deferType.disable = true;
        fieldsProperty.estimateTime.disable = true;
        fieldsProperty.groupSolution.disable = true;
        fieldsProperty.longitude.disable = true;
        fieldsProperty.latitude.disable = true;
        fieldsProperty.cellService.visible = true;
        fieldsProperty.concave.visible = true;
        fieldsProperty.reason.visible = false;
        fieldsProperty.reason.required = false;
        fieldsProperty.reasonOverdue.visible = false;
        fieldsProperty.reasonOverdue.required = false;
        fieldsProperty.receiveUnitId.disable = true;
        
        const selectedData = this.state.selectedData;
        const stateOld = this.state.stateAllList.find(item => item.itemId === selectedData.state) || {};

        if (this.state.selectValueStatus.code !== "OPEN" || selectedData.state !== "REJECT") {
            fieldsProperty.description.disable = true;
        }

        if (this.state.selectValueStatus.code === "CANCELED") {
            fieldsProperty.rejectReason.required = true;
            fieldsProperty.rejectReason.disable = false;
        } else if (this.state.selectValueStatus.code === "CLOSED" || this.state.selectValueStatus.code === "CLOSED NOT KEDB") {
            if (stateOld.itemCode !== "OPEN") {
                this.setRequireControlForClear(fieldsProperty);
            }
            if (this.state.selectValueStatus.code === "CLOSED") {
                fieldsProperty.relatedKedb.required = true;
            }
            fieldsProperty.closeCode.disable = false;
            fieldsProperty.closeCode.required = true;
            if (selectedData.insertSource === "SPM" || selectedData.insertSource.includes("BCCS")) {
                if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                    fieldsProperty.reason.visible = true;
                    fieldsProperty.reason.required = true;
                    fieldsProperty.reasonOverdue.disable = true;
                    fieldsProperty.reasonOverdue.visible = true;
                    fieldsProperty.reasonOverdue.required = true;
                } else {
                    fieldsProperty.reason.visible = true;
                    fieldsProperty.reason.required = true;
                    fieldsProperty.reason.required = true;
                }
                fieldsProperty.reason.disable = true;
                if (selectedData.insertSource === "BCCS") {
                    this.setControlForCC(false, fieldsProperty);
                }
                if (this.checkExistProperty(this.state.selectValueReason ? this.state.selectValueReason.value : selectedData.reasonId, "TT.REASON.DEVICE.ERR.RESET")) {
                    this.props.setVisibleTab({key: "mobileInfo", value: true});
                }
            }
        } else if (this.state.selectValueStatus.code === "CLEAR") {
            this.setRequireControlForClear(fieldsProperty);
            if (selectedData.createUnitId === selectedData.receiveUnitId) {
                fieldsProperty.closeCode.disable = false;
                fieldsProperty.closeCode.required = true;
            }
            if (this.state.isNocCheck) {
                if (selectedData.insertSource.includes("NOC")) {
                    this.props.actions.getAlarmClearGNOC(this.state.selectedData).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.setState({
                                endTroubleTime: new Date(response.payload.data.object) || null
                            });
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        }
                    }).catch((error) => {
                        toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.haveOccur"));
                    });
                } else if (selectedData.insertSource === "SPM" || selectedData.insertSource.includes("BCCS")) {
                    fieldsProperty.reason.disable = false;
                    if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                        fieldsProperty.reason.visible = true;
                        fieldsProperty.reason.required = true;
                        fieldsProperty.reasonOverdue.disable = false;
                        fieldsProperty.reasonOverdue.visible = true;
                        fieldsProperty.reasonOverdue.required = true;
                    } else {
                        fieldsProperty.reason.visible = true;
                        fieldsProperty.reason.required = true;
                        fieldsProperty.reasonOverdue.visible = false;
                        fieldsProperty.reasonOverdue.required = false;
                    }
                    fieldsProperty.endTroubleTime.disable = false;
                    if (selectedData.insertSource === "BCCS") {
                        this.setControlForCC(false, fieldsProperty);
                    }
                } else {
                    fieldsProperty.endTroubleTime.disable = false;
                }
            } else {
                fieldsProperty.endTroubleTime.disable = false;
            }
            // Neu dang chon la Da khac phuc thi loai mang truyen dan bat buoc phai chon
            fieldsProperty.tranNwType.required = true;
            //Neu da khac phuc va dich vu la co anh huong
            if (this.state.selectValueImpact.value + "" === "71") {
                fieldsProperty.reasonTypeCbo.required = true;
                fieldsProperty.reasonTypeTxt.required = true;
                fieldsProperty.downtime.required = true;
                fieldsProperty.numAffect.required = true;
                fieldsProperty.subMin.required = true;
            } else {
                fieldsProperty.reasonTypeCbo.required = false;
                fieldsProperty.reasonTypeTxt.required = false;
                fieldsProperty.downtime.required = false;
                fieldsProperty.numAffect.required = false;
                fieldsProperty.subMin.required = false;
            }
        } else if (this.state.selectValueStatus.code === "REJECT") {
            fieldsProperty.rejectReason.required = true;
            fieldsProperty.rejectReason.disable = false;
            fieldsProperty.rejectCode.required = true;
            fieldsProperty.rejectCode.disable = false;
        } else if (this.state.selectValueStatus.code === "WAIT FOR DEFERRED") {
            fieldsProperty.deferredTime.required = true;
            fieldsProperty.deferredTime.disable = false;
            fieldsProperty.deferredReason.required = true;
            fieldsProperty.deferredReason.disable = false;
            if (selectedData.insertSource.includes("BCCS")) {
                this.setControlForCC(true, fieldsProperty);
                if (this.checkExistProperty(selectedData.typeId, "TT.TYPE.DD_MOBILE")) {
                    if (selectedData.deferType && selectedData.deferType + "" === "2") {
                        if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = true;
                            fieldsProperty.reasonOverdue.required = true;
                        } else {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = false;
                            fieldsProperty.reasonOverdue.required = false;
                        }
                    } else {
                        fieldsProperty.reason.visible = false;
                        fieldsProperty.reason.required = false;
                        fieldsProperty.reasonOverdue.visible = false;
                        fieldsProperty.reasonOverdue.required = false;
                    }
                }
            }
        } else if (this.state.selectValueStatus.code === "DEFERRED") {
            if (selectedData.insertSource.includes("BCCS")) {
                this.setControlForCC(true, fieldsProperty);
                if (this.checkExistProperty(selectedData.typeId, "TT.TYPE.DD_MOBILE")) {
                    if (selectedData.deferType && selectedData.deferType + "" === "2") {
                        if (selectedData.remainTime && parseFloat(selectedData.remainTime) < 0) {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = true;
                            fieldsProperty.reasonOverdue.required = true;
                        } else {
                            fieldsProperty.reason.visible = true;
                            fieldsProperty.reason.required = true;
                            fieldsProperty.reasonOverdue.visible = false;
                            fieldsProperty.reasonOverdue.required = false;
                        }
                    } else {
                        fieldsProperty.reason.visible = false;
                        fieldsProperty.reason.required = false;
                        fieldsProperty.reasonOverdue.visible = false;
                        fieldsProperty.reasonOverdue.required = false;
                    }
                }
            }
        } else if (this.state.selectValueStatus.code === "SOLUTION FOUND") {
            fieldsProperty.solutionType.disable = false;
            fieldsProperty.solutionType.required = true;
            fieldsProperty.workArround.disable = false;
            fieldsProperty.workArround.required = true;
        } else if (this.state.selectValueStatus.code === "WAITING RECEIVE") {
            if (stateOld.itemCode === "CLEAR") {
                fieldsProperty.rejectReason.disable = false;
                fieldsProperty.rejectReason.required = true;
                fieldsProperty.receiveUnitId.disable = false;
            } else if (stateOld.itemCode === "REJECT") {
                fieldsProperty.receiveUnitId.disable = false;
            } else {
                fieldsProperty.receiveUnitId.disable = true;
            }
        } else if (this.state.selectValueStatus.code === "OPEN") {
            fieldsProperty.receiveUnitId.disable = false;
        } else if (this.state.selectValueStatus.code === "QUEUE") {
            if (selectedData.receiveUnitId === JSON.parse(localStorage.user).deptId + ""
                && selectedData.state === 5 && (selectedData.isMove === null || selectedData.isMove !== 1)) {
                fieldsProperty.receiveUnitId.disable = false;
            }
        }

        if (selectedData.createUnitId === JSON.parse(localStorage.user).deptId) {
            if (this.state.selectValueStatus.code !== "CLOSED" && this.state.selectValueStatus.code !== "CLOSED NOT KEDB") {
                fieldsProperty.receiveUnitId.disable = false;
                fieldsProperty.receiveUserId.disable = false;
                fieldsProperty.solutionType.disable = false;
                fieldsProperty.workArround.disable = false;
            } else {
                fieldsProperty.receiveUnitId.disable = true;
                fieldsProperty.receiveUserId.disable = true;
                fieldsProperty.solutionType.disable = true;
                fieldsProperty.workArround.disable = true;
            }
        }
        //truongnt add
        if (JSON.parse(localStorage.user).deptId === selectedData.receiveUnitId) {
            if ((this.state.selectValueStatus.code === "CLOSED" || this.state.selectValueStatus.code === "CLOSED NOT KEDB") && selectedData.insertSource.includes("NOC")) {
                fieldsProperty.solutionType.disable = false;
                fieldsProperty.workArround.disable = false;
            }
        }

        //start kiem tra de chon canh bao truyen dan lien quan start
        if (this.state.selectValueStatus.code === "CLEAR") {
            //chua biet lam the nao
        } else {
            //chua biet lam the nao
        }
        if (this.props.parentState.visibleDefault.transInfo) {
            if (this.state.selectValueStatus.code === "CLEAR" || this.state.selectValueStatus.code === "CLOSED"
                || this.state.selectValueStatus.code === "CLOSED NOT KEDB" || this.state.selectValueStatus.code === "QUEUE") {
                fieldsProperty.transInfo2.visible = true;
            } else {
                fieldsProperty.transInfo2.visible = false;
            }
            if (this.state.selectValueReason) {
                if (this.checkExistProperty(this.state.selectValueReason.value, "TT.TYPE.TRAN.REASON")) {
                    if (this.state.selectValueStatus.code === "CLOSED" || this.state.selectValueStatus.code === "CLOSED NOT KEDB") {
                        fieldsProperty.closuresReplace.required = true;
                    } else if (this.state.selectValueStatus.code === "CLEAR") {
                        fieldsProperty.lineCut.required = true;
                        fieldsProperty.snippetOff.required = true;
                    }
                }
            }
        }
        let check = false;
        if (this.state.selectValueStatus.code === "CLEAR" && selectedData.createUnitId === selectedData.receiveUnitId) {
            check = true;
        }
        if ((check || this.state.selectValueStatus.code === "CLOSED" || this.state.selectValueStatus.code === "CLOSED NOT KEDB")
        && this.checkExistProperty(selectedData.typeId, "TT.TYPE.EM_FTTX_CABLE") && this.state.selectValueImpact.code === "Yes") {
            fieldsProperty.brcd.required = true;
        } else {
            fieldsProperty.brcd.required = false;
        }

        //truongnt them
        if (this.state.selectValueImpact.value + "" === "71") {
            fieldsProperty.affectedService.required = true;
            fieldsProperty.affectedService.disable = false;
            if (this.state.selectValueStatus.value === 9 || this.state.selectValueStatus.value === 10 || this.state.selectValueStatus.value === 11) {
                fieldsProperty.numAffect.required = true;
                fieldsProperty.downtime.required = true;
                fieldsProperty.subMin.required = true;
            } else {
                fieldsProperty.numAffect.required = false;
                fieldsProperty.downtime.required = false;
                fieldsProperty.subMin.required = false;
            }
        } else {
            fieldsProperty.affectedService.required = false;
            fieldsProperty.affectedService.disable = true;
            fieldsProperty.reasonTypeCbo.required = false;
            fieldsProperty.reasonTypeTxt.required = false;
            fieldsProperty.numAffect.required = false;
            fieldsProperty.downtime.required = false;
            fieldsProperty.subMin.required = false;
            this.setState({
                selectValueAffectService: []
            });
        }

        this.setState({
            fieldsProperty,
        }, () => {
            this.props.onChangeChildInfoTab(0, this.state);
        });
    }

    getReason3Level = () => {
        if (this.state.selectedData.insertSource.includes("SPM") || this.state.selectedData.insertSource.includes("BCCS")) {
            const fieldsProperty = { ...this.state.fieldsProperty };
            fieldsProperty.reason.required = true;
            fieldsProperty.reason.visible = true;
            fieldsProperty.reasonOverdue.required = true;
            fieldsProperty.reasonOverdue.visible = true;
            this.setState({
                fieldsProperty
            }, () => {
                const data = { ...this.state.selectedData, parentId: null, level: '1' };
                this.props.actions.getListReasonBCCS(data).then((response) => {
                    this.setState({
                        reasonLv1: response.payload.data.map(item => {return {itemId: item.compCauseId, itemName: item.name}})
                    });
                });
                this.props.actions.getListReasonOverdue(data).then((response) => {
                    this.setState({
                        reasonOverdueLv1: response.payload.data.map(item => {return {itemId: item.compCauseId, itemName: item.name}})
                    });
                });
            });
        }
    }

    setControlForCC = (boolean, fieldsProperty) => {
        // const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        fieldsProperty.deferType.required = boolean;
        fieldsProperty.deferType.disable = !boolean;
        fieldsProperty.deferType.visible = boolean;
        fieldsProperty.estimateTime.required = boolean;
        fieldsProperty.estimateTime.disable = !boolean;
        fieldsProperty.estimateTime.visible = boolean;
        fieldsProperty.longitude.required = boolean;
        fieldsProperty.latitude.required = boolean;
        fieldsProperty.groupSolution.required = true;

        fieldsProperty.longitude.disable = false;
        fieldsProperty.latitude.disable = false;
        fieldsProperty.groupSolution.disable = false;
        fieldsProperty.cellService.visible = true;
        fieldsProperty.concave.visible = true;

        // this.setState({
        //     fieldsProperty
        // });
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
        arrCatItem.push("PT_AFFECT_SERVICE");//dich vu anh huong
        arrCatItem.push("TT_RISK");//nhom nguy co
        arrCatItem.push("GNOC_COUNTRY");//quoc gia
        arrCatItem.push("TT_TRANS_NW_TYPE");//loai truyen dan
        arrCatItem.push("NETWORK_LEVEL");//muc mang
        arrCatItem.push("TT_REJECT_CODE");//ma tu choi
        arrCatItem.push("TT_SOLUTION_TYPE");//nhom giai phap
        arrCatItem.push("TT_CLOSE_CODE");//ma dong

        const data = JSON.stringify(arrCatItem).replace("[", "%5B").replace("]", "%5D");

        this.props.actions.getListCatItemDTO(data).then((response) => {
            let ptTypeList = [];
            let ttStateList = [];
            let ttPriorityList = [];
            let vendorList = [];
            let ttImpactList = [];
            let insertSourceList = [];
            let warnLevelList = [];
            let affectServiceList = [];
            let ttRiskList = [];
            let countryList = [];
            let transNwTypeList = [];
            let rejectCodeList = [];
            let solutionTypeList = [];
            let closeCodeList = [];
            for (const item of response.payload.data) {
                switch (item.categoryCode) {
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
                    case "PT_AFFECT_SERVICE":
                        item.itemId = item.itemCode;
                        affectServiceList.push(item);
                        break;
                    case "TT_RISK":
                        ttRiskList.push(item);
                        break;
                    case "GNOC_COUNTRY":
                        item.itemId = item.itemCode;
                        countryList.push(item);
                        break;
                    case "TT_TRANS_NW_TYPE":
                        transNwTypeList.push(item);
                        break;
                    case "TT_REJECT_CODE":
                        rejectCodeList.push(item);
                        break;
                    case "TT_SOLUTION_TYPE":
                        solutionTypeList.push(item);
                        break;
                    case "TT_CLOSE_CODE":
                        closeCodeList.push(item);
                        break;
                    default:
                        break;
                }
            }
            let stateList = [];
            const selectedData = this.state.selectedData;
            let currentState = ttStateList.find(item => item.itemId + "" === selectedData.state + "") || {};
            stateList.push(currentState);
            if (selectedData.insertSource.includes("SPM") && selectedData.isTickHelp === 1 && currentState.itemCode === "QUEUE") {
                const stateReject = ttStateList.find(item => item.itemCode === "REJECT") || {};
                if (!stateList.find(item => item.itemId + "" === stateReject.itemId + "")) {
                    stateList.push(stateReject);
                }
                const stateClear = ttStateList.find(item => item.itemCode === "CLEAR") || {};
                if (!stateList.find(item => item.itemId + "" === stateClear.itemId + "")) {
                    stateList.push(stateClear);
                }
                this.setState({
                    ttStateList: stateList
                });
            } else {
                this.props.actions.getTransitionState({ beginStateId: selectedData.state }).then((response) => {
                    const data = response.payload.data;
                    if (selectedData.insertSource === "BCCS") {
                        if (this.checkExistProperty(selectedData.typeId + "", "TT.TYPE.DD_MOBILE") &&
                            (selectedData.state === 3 || selectedData.state === 5)) {
                            const stateWaitForDeferred = ttStateList.find(item => item.itemCode === "WAIT FOR DEFERRED") || {};
                            if (!stateList.find(item => item.itemId + "" === stateWaitForDeferred.itemId + "")) {
                                stateList.push(stateWaitForDeferred);
                            }
                        }
                    }
                    for (const state of data) {
                        const object = {
                            itemId: state.endStateId,
                            itemName: state.endStateName,
                            itemCode: state.endStateCode
                        };
                        if (stateList.find(item => item.itemId + "" === object.itemId + "")) continue;
                        stateList.push(object);
                    }
                    this.setState({
                        ttStateList: stateList
                    });
                });
            }
            this.setState({
                ptTypeList,
                ttPriorityList,
                vendorList,
                ttImpactList,
                insertSourceList,
                warnLevelList,
                affectServiceList,
                ttRiskList,
                countryList,
                transNwTypeList,
                rejectCodeList,
                solutionTypeList,
                closeCodeList,
                stateAllList: ttStateList
            }, () => {
                const state = ttStateList.find(item => item.itemId + "" === selectedData.state + "") || {};
                this.setState({
                    selectValueStatus: state.itemId ? { value: state.itemId, code: state.itemCode } : {},
                });
                this.checkUserRight();
            });
        });
    }

    setDefaultValue = () => {
        const { selectedData } = this.state;
        this.setState({
            autoClose: selectedData.autoClose === 1 ? true : false,
            stationVip: selectedData.isStationVip === 1 ? true : false,
            help: selectedData.isTickHelp === 1 ? true : false,
            batchIncident: selectedData.errorCode === 1 ? true : false,
            selectValueCountry: selectedData.country ? { value: selectedData.country } : {},
            selectValuePtType: selectedData.typeId ? { value: selectedData.typeId, code: selectedData.typeName } : {},
            selectValueAlarmGroup: selectedData.alarmGroupId ? { value: selectedData.alarmGroupId, code: selectedData.alarmGroupCode, subValue: selectedData.strAlarmGroupDescription } : {},
            selectValueLocation: selectedData.locationId ? { value: selectedData.locationId, label: selectedData.location } : {},
            selectValuePriority: selectedData.priorityId ? { value: selectedData.priorityId, label: selectedData.priorityName } : {},
            selectValueSubCategory: selectedData.subCategoryId ? { value: selectedData.subCategoryId } : {},
            networkNodeCode: selectedData.affectedNode ? selectedData.affectedNode.split(",").map(item => { return { deviceCode: item, nationCode: selectedData.nationCode }; }) : [],
            selectValueImpact: selectedData.impactId ? { value: selectedData.impactId, code: selectedData.impactId + "" === "71" ? "Yes" : "No" } : {},
            selectValueReceiveUnit: selectedData.receiveUnitId ? { unitId: selectedData.receiveUnitId, unitName: selectedData.receiveUnitName } : {},
            selectValueReceiveUser: selectedData.receiveUserId ? { value: selectedData.receiveUserId, label: selectedData.receiveUserName } : {},
            selectValueAffectService: selectedData.affectedService ? selectedData.affectedService.split(",").map(item => { return { value: item }; }) : [],
            selectValueSupportUnit: selectedData.supportUnitId ? { value: selectedData.supportUnitId, label: selectedData.supportUnitName } : {},
            selectValueWarnLevel: selectedData.warnLevel ? { value: selectedData.warnLevel } : this.state.warnLevelList.find(item => item.itemCode === "TT_Severity_Minor") || {},
            selectValueRisk: selectedData.risk ? { value: selectedData.risk } : {},
            relatedKedb: selectedData.relatedKedb || "",
            selectValueVendor: selectedData.vendorId ? { value: selectedData.vendorId } : {},
            selectValueReason: selectedData.reasonId ? { value: selectedData.reasonId, label: selectedData.reasonName } : null,
            selectValueRejectCode: selectedData.rejectedCode ? { value: selectedData.rejectedCode } : {},
            selectValueSolutionType: selectedData.solutionType ? { value: selectedData.solutionType } : {},
            beginTroubleTime: selectedData.beginTroubleTime ? new Date(selectedData.beginTroubleTime) : null,
            endTroubleTime: selectedData.endTroubleTime ? new Date(selectedData.endTroubleTime) : null,
            deferredTime: selectedData.deferredTime ? new Date(selectedData.deferredTime) : null,
            selectValueCloseCode: selectedData.closeCode ? { value: selectedData.closeCode } : {},
            selectValueReasonLv1: selectedData.reasonLv1Id ? { value: selectedData.reasonLv1Id, label: selectedData.reasonLv1Name } : {},
            selectValueReasonLv2: selectedData.reasonLv2Id ? { value: selectedData.reasonLv2Id, label: selectedData.reasonLv2Name } : {},
            selectValueReasonLv3: selectedData.reasonLv3Id ? { value: selectedData.reasonLv3Id, label: selectedData.reasonLv3Name } : {},
            selectValueReasonOverdue1: selectedData.reasonOverdueId ? { value: selectedData.reasonOverdueId } : {},
            selectValueReasonOverdue2: selectedData.reasonOverdueId2 ? { value: selectedData.reasonOverdueId2 } : {},
            isGetPriority: true,
            isPtTypeChange: true,
            isChangeImpact: true,
            isChangeReasonLv1: true,
            isChangeReasonLv2: true,
            isChangeReasonOverdue1: true
        }, () => {
            this.getListCatItem();
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.crNumber" />,
                id: "crNumber",
                sortable: false,
                accessor: d => <span title={d.crNumber}>{d.crNumber}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.crName" />,
                id: "title",
                sortable: false,
                accessor: d => <span title={d.title}>{d.title}</span>

            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.earliestStartTime" />,
                id: "earliestStartTime",
                sortable: false,
                accessor: d => <span title={d.earliestStartTime}>{d.earliestStartTime}</span>

            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.lastestStartTime" />,
                id: "latestStartTime",
                sortable: false,
                accessor: d => <span title={d.latestStartTime}>{d.latestStartTime}</span>

            }
        ];
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

    toggleFormAdvanceInfo() {
        this.setState({ collapseFormAdvanceInfo: !this.state.collapseFormAdvanceInfo });
    }

    toggleFormReasonAndSolution() {
        this.setState({ collapseFormReasonAndSolution: !this.state.collapseFormReasonAndSolution });
    }

    //start handle combo
    handleChangeSelectValuePtType = (d) => {
        this.setState({
            selectValuePtType: d,
            selectValueAlarmGroup: {},
            selectValueSubCategory: {},
            isPtTypeChange: true,
            isGetPriority: true
        });
    }

    handleChangeSelectValueImpact = (d) => {
        this.setState({
            selectValueImpact: d
        });
        const fieldsProperty = {...this.state.fieldsProperty};
        if (d.code === "Yes") {
            fieldsProperty.affectedService.required = true;
            fieldsProperty.affectedService.disable = false;
            if (this.state.selectValueStatus.value === 9 || this.state.selectValueStatus.value === 10 || this.state.selectValueStatus.value === 11) {
                fieldsProperty.numAffect.required = true;
                fieldsProperty.downtime.required = true;
                fieldsProperty.subMin.required = true;
            } else {
                fieldsProperty.numAffect.required = false;
                fieldsProperty.downtime.required = false;
                fieldsProperty.subMin.required = false;
            }
        } else {
            fieldsProperty.affectedService.required = false;
            fieldsProperty.affectedService.disable = true;
            fieldsProperty.reasonTypeCbo.required = false;
            fieldsProperty.reasonTypeTxt.required = false;
            fieldsProperty.numAffect.required = false;
            fieldsProperty.downtime.required = false;
            fieldsProperty.subMin.required = false;
            this.setState({
                selectValueAffectService: []
            });
        }
        // if (d.code === "Yes") {
        //     const fieldsProperty = {...this.state.fieldsProperty};
        //     fieldsProperty.affectedService.required = true;
        //     fieldsProperty.affectedService.disable = false;
        //     if (this.state.selectValueStatus.value === 9 || this.state.selectValueStatus.code === 10
        //     || this.state.selectValueStatus.code === 11) {
        //         fieldsProperty.downtime.required = true;
        //     } else {
        //         fieldsProperty.downtime.required = false;
        //     }
        //     this.setState({
        //         fieldsProperty
        //     });
        // } else {
        //     const fieldsProperty = {...this.state.fieldsProperty};
        //     fieldsProperty.affectedService.required = false;
        //     fieldsProperty.affectedService.disable = true;
        //     this.setState({
        //         fieldsProperty,
        //         selectValueAffectService: []
        //     });
        // }
    }

    handleChangeSelectValueSolutionType = (d) => {
        this.setState({
            selectValueSolutionType: d
        }, () => {
            const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
            if (this.state.selectValueSolutionType.subValue && this.state.selectValueSolutionType.subValue + "" === "1") {
                fieldsProperty.relatedCr.required = true;
            } else {
                fieldsProperty.relatedCr.required = false;
            }
            this.setState({
                fieldsProperty
            });
        });
    }

    handleChangeSelectValueStatus = (d) => {
        if (d.code !== "CLOSED") {
            this.setState({
                selectValueCloseCode: {}
            });
        }
        this.setState({
            selectValueStatus: d
        }, () => {
            this.props.onChangeChildInfoTab(0, this.state);
            this.validateWhenStatusChange();
        });
    }

    handleChangeSelectValueReason = (d) => {
        this.setState({
            selectValueReason: d
        }, () => {
            this.validateReasonChange();
        });
    }

    handleChangeSelectValueReasonLv1 = (d) => {
        this.setState({
            selectValueReasonLv1: d,
            selectValueReasonLv2: {},
            selectValueReasonLv3: {},
            isChangeReasonLv1: true
        });
    }

    handleChangeSelectValueReasonLv2 = (d) => {
        this.setState({
            selectValueReasonLv2: d,
            selectValueReasonLv3: {},
            isChangeReasonLv2: true
        });
    }

    handleChangeSelectValueReasonOverdue1 = (d) => {
        this.setState({
            selectValueReasonOverdue1: d,
            selectValueReasonOverdue2: {},
            isChangeReasonOverdue1: true
        });
    }
    //end handle combo

    validateReasonChange = () => {
        let reason = this.state.selectValueReason ? this.state.selectValueReason.value : null;
        if (!reason) {
            reason = this.state.selectedData.reasonId;
        }
        const fieldsProperty = Object.assign({}, this.state.fieldsProperty);
        if(reason && this.checkExistProperty(reason, "TT.TYPE.TRAN.REASON")) {
            if (this.state.selectValueStatus.value + "" === "10" || this.state.selectValueStatus.value + "" === "11") {
                fieldsProperty.lineCut.required = true;
                fieldsProperty.snippetOff.required = true;
                fieldsProperty.closuresReplace.required = true;
            } else if (this.state.selectValueStatus.value + "" === "9") {
                fieldsProperty.lineCut.required = true;
                fieldsProperty.snippetOff.required = true;
            } else {
                fieldsProperty.lineCut.required = false;
                fieldsProperty.snippetOff.required = false;
                fieldsProperty.closuresReplace.required = false;
            }
        } else {
            fieldsProperty.lineCut.required = false;
            fieldsProperty.snippetOff.required = false;
            fieldsProperty.closuresReplace.required = false;
        }

        if (reason && this.checkExistProperty(reason, "TT.REASON.DEVICE.ERR")) {
            if (this.state.selectValueStatus.value + "" === "9") {
                fieldsProperty.deviceError.visible = true;
            }
        }
        this.setState({
            fieldsProperty
        }, () => {
            this.props.onChangeChildInfoTab(0, this.state);
        });
     }

    openSearchNodePopup = () => {
        this.setState({
            isOpenSearchNodePopup: true
        });
    }

    closeSearchNodePopup = () => {
        this.setState({
            isOpenSearchNodePopup: false
        });
    }

    setValueSearchNodePopup = (d) => {
        this.setState({
            networkNodeCode: d
        }, () => {
            this.closeSearchNodePopup();
        });
    }

    openSearchUnitPopup = () => {
        this.setState({
            isOpenSearchUnitPopup: true
        });
    }

    closeSearchUnitPopup = () => {
        this.setState({
            isOpenSearchUnitPopup: false
        });
    }

    setValueSearchUnitPopup = (d) => {
        const selectValueReceiveUnit = {unitName: d.unitName + " (" + d.unitCode + ")", unitId: d.unitId};
        this.setState({
            selectValueReceiveUnit,
            selectValueReceiveUser: {},
            isReceiveUnitChange: true
        }, () => {
            this.closeSearchUnitPopup();
        });
    }

    openRelatedKedbPopup = () => {
        this.setState({
            isOpenPopupRelatedKedb: true
        });
    }

    closeRelatedKedbPopup = () => {
        this.setState({
            isOpenPopupRelatedKedb: false
        });
    }

    setValueRelatedKedb = (d) => {
        this.setState({
            relatedKedb: d
        }, () => {
            this.closeRelatedKedbPopup();
        });
    }

    openRelatedCrPopup = () => {
        this.setState({
            isOpenPopupRelatedCr: true
        });
    }

    closeRelatedCrPopup = () => {
        this.setState({
            isOpenPopupRelatedCr: false
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

    closePopupChat = (object) => {
        this.setState({
            isOpenPopup: false,
        });
    }

    setValueRelatedCr = (data) => {
        this.setState({
            relatedCr: [data]
        });
    }

    removeValueRelatedCr = () => {
        this.setState({
            relatedCr: []
        });
    }

    // getStateChildTab(callback) {
    //     const dataInfoTab = this.myForm.getValues();
    //     const state = Object.assign({}, this.state);
    //     state.dataInfoTab = dataInfoTab;
    //     callback(state);
    // }

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

    render() {
        const { t } = this.props;
        const { columns, loading, fieldsProperty, relatedCr, selectedData } = this.state;
        const { ptTypeList, ttStateList, alarmGroupList, ptSubCatList, vendorList, ttImpactList, ttPriorityList, solutionTypeList, closeCodeList,
            affectServiceList, ttRiskList, countryList, warnLevelList, rejectCodeList, reasonLv1, reasonLv2, reasonLv3, reasonOverdueLv1, reasonOverdueLv2 } = this.state;
        let objectAddOrEdit = {};
        objectAddOrEdit.troubleName = selectedData.troubleName || "";
        objectAddOrEdit.description = selectedData.description || "";
        objectAddOrEdit.infoTicket = selectedData.infoTicket || "";
        objectAddOrEdit.downtime = selectedData.downtime || "";
        objectAddOrEdit.numAffect = selectedData.numAffect || "";
        objectAddOrEdit.spmCode = selectedData.spmCode || "";
        objectAddOrEdit.subMin = selectedData.subMin || "";
        objectAddOrEdit.rootCause = selectedData.rootCause || "";
        objectAddOrEdit.rejectReason = selectedData.rejectReason || "";
        objectAddOrEdit.deferredReason = selectedData.deferredReason || "";
        objectAddOrEdit.workArround = selectedData.workArround || "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditInfoTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Card>
                        <CardHeader>
                            <span>{this.state.selectedData.troubleCode}</span>
                            {/* <span style={{ marginLeft: '8rem' }}><i className="fa fa-calendar mr-1"></i>{this.state.selectedData.createdTime}</span> */}
                            <div className="card-header-actions card-header-actions-button-table">
                                <Button type="button" color="primary" className="mr-2" onClick={() => this.openPopupChat(selectedData)}><i className="fa fa-paper-plane"></i> {t("ttTrouble:ttTrouble.button.chatGroup")}</Button>
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1 class-hidden"
                                    loading={this.state.btnAddOrEditLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-save"></i> {t("common:common.button.save")}
                                </LaddaButton>{' '}
                                {/* <Button type="button" color="secondary" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button> */}
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="2">
                                    <CustomAppSwitch
                                        name={"autoClose"}
                                        label={t("ttTrouble:ttTrouble.label.autoClose")}
                                        checked={this.state.autoClose}
                                        handleChange={(checked) => this.setState({ autoClose: checked })}
                                        isDisabled={true}
                                    />
                                </Col>
                                <Col xs="12" sm="2">
                                    <CustomAppSwitch
                                        name={"isStationVip"}
                                        label={t("ttTrouble:ttTrouble.label.stationVip")}
                                        checked={this.state.stationVip}
                                        handleChange={(checked) => this.setState({ stationVip: checked })}
                                        isDisabled={true}
                                    />
                                </Col>
                                <Col xs="12" sm="2" className={fieldsProperty.batchIncident.visible ? "" : "class-hidden"}>
                                    <CustomAppSwitch
                                        name={"errorCode"}
                                        label={t("ttTrouble:ttTrouble.label.batchIncident")}
                                        checked={this.state.batchIncident}
                                        handleChange={(checked) => this.setState({ batchIncident: checked })}
                                        isDisabled={fieldsProperty.batchIncident.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="2">
                                    <CustomAppSwitch
                                        name={"isTickHelp"}
                                        label={t("ttTrouble:ttTrouble.label.help")}
                                        checked={this.state.help}
                                        handleChange={(checked) => this.setState({ help: checked })}
                                        isDisabled={true}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={this.state.selectedData.isTickHelp === 1 ? "" : "class-hidden"}>
                                    <span style={{ fontWeight: '500' }}>{t("ttTrouble:ttTrouble.label.numberOfHelp") + ": "}{this.state.selectedData.numHelp || 1}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="8">
                                    <CustomAvField name="troubleName" label={t("ttTrouble:ttTrouble.label.troubleName")} autoFocus
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.troubleName")} required maxLength="500"
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.troubleName") } }} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomDatePicker
                                        name={"beginTroubleTime"}
                                        label={t("ttTrouble:ttTrouble.label.beginTroubleTime")}
                                        isRequired={false}
                                        selected={this.state.beginTroubleTime}
                                        handleOnChange={(d) => this.setState({ beginTroubleTime: d })}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={fieldsProperty.beginTroubleTime.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="8">
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <CustomAvField type="textarea" rows="3" style={{ maxHeight: '13rem' }} name="description" label={t("ttTrouble:ttTrouble.label.descriptionAdd")}
                                                placeholder={t("ttTrouble:ttTrouble.placeholder.description")} maxLength="2000" required disabled={fieldsProperty.description.disable}
                                                validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.descriptionAdd") } }} />
                                        </Col>
                                        <Col xs="12" sm="12">
                                            <CustomAvField type="textarea" rows="3" style={{ maxHeight: '13rem' }} name="infoTicket" label={t("ttTrouble:ttTrouble.label.informationTicket")}
                                                placeholder={t("ttTrouble:ttTrouble.placeholder.informationTicket")} maxLength="2000"/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs="12" sm="4">
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <CustomDatePicker
                                                name={"endTroubleTime"}
                                                label={t("ttTrouble:ttTrouble.label.endTroubleTime")}
                                                isRequired={fieldsProperty.endTroubleTime.required}
                                                messageRequire={t("ttTrouble:ttTrouble.message.required.endTroubleTime")}
                                                selected={this.state.endTroubleTime}
                                                handleOnChange={(d) => this.setState({ endTroubleTime: d })}
                                                dateFormat="dd/MM/yyyy HH:mm:ss"
                                                showTimeSelect={true}
                                                timeFormat="HH:mm:ss"
                                                placeholder="dd/MM/yyyy HH:mm:ss"
                                                readOnly={fieldsProperty.endTroubleTime.disable}
                                            />
                                        </Col>
                                        <Col xs="12" sm="12">
                                            <CustomSelectLocal
                                                name={"state"}
                                                label={t("ttTrouble:ttTrouble.label.status")}
                                                isRequired={true}
                                                messageRequire={t("ttTrouble:ttTrouble.message.required.status")}
                                                options={ttStateList}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleChangeSelectValueStatus}
                                                selectValue={this.state.selectValueStatus}
                                                isDisabled={fieldsProperty.status.disable}
                                            />
                                        </Col>
                                        <Col xs="12" sm="12">
                                            <CustomSelectLocal
                                                name={"country"}
                                                label={t("ttTrouble:ttTrouble.label.country")}
                                                isRequired={false}
                                                messageRequire={t("ttTrouble:ttTrouble.message.required.country")}
                                                options={countryList}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={(d) => this.setState({ selectValueCountry: d, isGetPriority: true })}
                                                selectValue={this.state.selectValueCountry}
                                                isDisabled={true}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomAutocomplete
                                        name={"locationId"}
                                        label={t("ttTrouble:ttTrouble.label.location")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.location")}
                                        isRequired={true}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.location")}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueLocation: d })}
                                        selectValue={this.state.selectValueLocation}
                                        moduleName={"REGION"}
                                        isHasCheckbox={false}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"typeId"}
                                        label={t("ttTrouble:ttTrouble.label.domainTt")}
                                        isRequired={true}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.domainTt")}
                                        options={ptTypeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleChangeSelectValuePtType}
                                        selectValue={this.state.selectValuePtType}
                                        isDisabled={true}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"alarmGroupId"}
                                        label={t("ttTrouble:ttTrouble.label.incidentGroup")}
                                        isRequired={false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.incidentGroup")}
                                        options={alarmGroupList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueAlarmGroup: d, isGetPriority: true })}
                                        selectValue={this.state.selectValueAlarmGroup}
                                        isDisabled={true}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"priorityId"}
                                        label={t("ttTrouble:ttTrouble.label.priority")}
                                        isRequired={true}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.priority")}
                                        options={ttPriorityList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValuePriority: d })}
                                        selectValue={this.state.selectValuePriority}
                                        isDisabled={fieldsProperty.priority.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"subCategoryId"}
                                        label={t("ttTrouble:ttTrouble.label.subCategory")}
                                        isRequired={true}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.subCategory")}
                                        options={ptSubCatList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueSubCategory: d })}
                                        selectValue={this.state.selectValueSubCategory}
                                        isDisabled={fieldsProperty.subCategoryId.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomInputPopup
                                        name={"affectedNode"}
                                        label={t("ttTrouble:ttTrouble.label.networkNodeCode")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                        value={this.state.networkNodeCode.map(item => item.deviceCode).join(",")}
                                        handleRemove={() => this.setState({ networkNodeCode: [] })}
                                        handleDoubleClick={this.openSearchNodePopup}
                                        isRequired={fieldsProperty.affectedNode.required}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.networkNodeCode")}
                                        isDisabled={fieldsProperty.affectedNode.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"impactId"}
                                        label={t("ttTrouble:ttTrouble.label.impactAdd")}
                                        isRequired={true}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.impactAdd")}
                                        options={ttImpactList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={this.handleChangeSelectValueImpact}
                                        selectValue={this.state.selectValueImpact}
                                        isDisabled={fieldsProperty.impact.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomMultiSelectLocal
                                        name={"affectedService"}
                                        label={t("ttTrouble:ttTrouble.label.affectedService")}
                                        isRequired={fieldsProperty.affectedService.required}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.affectedService")}
                                        options={affectServiceList}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueAffectService: d })}
                                        selectValue={this.state.selectValueAffectService}
                                        isDisabled={fieldsProperty.affectedService.disable}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"risk"}
                                        label={t("ttTrouble:ttTrouble.label.riskGroup")}
                                        isRequired={false}
                                        options={ttRiskList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueRisk: d })}
                                        selectValue={this.state.selectValueRisk}
                                        isDisabled={fieldsProperty.riskGroup.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomInputPopup
                                        name={"receiveUnitId"}
                                        label={t("ttTrouble:ttTrouble.label.responsibleUnitAdd")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                        value={this.state.selectValueReceiveUnit.unitName || ""}
                                        handleRemove={() => this.setState({ selectValueReceiveUnit: {}, selectValueReceiveUser: {} })}
                                        handleDoubleClick={this.openSearchUnitPopup}
                                        isRequired={fieldsProperty.receiveUnitId.required}
                                        isDisabled={fieldsProperty.receiveUnitId.disable}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.responsibleUnitAdd")}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelect
                                        name={"receiveUserId"}
                                        label={t("ttTrouble:ttTrouble.label.responsiblePerson")}
                                        isRequired={false}
                                        moduleName={"USERS"}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueReceiveUser: d })}
                                        selectValue={this.state.selectValueReceiveUser}
                                        parentValue={(this.state.selectValueReceiveUnit && this.state.selectValueReceiveUnit.unitId) ? this.state.selectValueReceiveUnit.unitId : ""}
                                        isDisabled={fieldsProperty.receiveUserId.disable}
                                        isHasChildren={(this.state.selectValueReceiveUnit && this.state.selectValueReceiveUnit.unitId) ? false : true}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"closeCode"}
                                        label={t("ttTrouble:ttTrouble.label.closeCode")}
                                        isRequired={fieldsProperty.closeCode.required}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.closeCode")}
                                        options={closeCodeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueCloseCode: d })}
                                        selectValue={this.state.selectValueCloseCode}
                                        isDisabled={fieldsProperty.closeCode.disable}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomAutocomplete
                                        name={"supportUnitId"}
                                        label={t("ttTrouble:ttTrouble.label.supportUnit")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.supportUnit")}
                                        isRequired={false}
                                        closeMenuOnSelect={false}
                                        handleItemSelectChange={(d) => this.setState({ selectValueSupportUnit: d })}
                                        selectValue={this.state.selectValueSupportUnit}
                                        moduleName={"UNIT"}
                                        isDisabled={fieldsProperty.supportUnitId.disable}
                                    />
                                </Col>
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
                            <Card>
                                <CardHeader>
                                    <span>{t("ttTrouble:ttTrouble.title.reasonAndSolutionDetail")}</span>
                                    <div className="card-header-actions">
                                        <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormReasonAndSolution" onClick={this.toggleFormReasonAndSolution}><i className={this.state.collapseFormReasonAndSolution ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                    </div>
                                </CardHeader>
                                <Collapse isOpen={this.state.collapseFormReasonAndSolution} id="collapseFormReasonAndSolution">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomRcTreeSelect
                                                    name={"reasonId"}
                                                    label={t("ttTrouble:ttTrouble.label.reasonGroup")}
                                                    isRequired={fieldsProperty.reasonId.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.reasonGroup")}
                                                    moduleName={"CAT_REASON"}
                                                    handleChange={this.handleChangeSelectValueReason}
                                                    selectValue={this.state.selectValueReason}
                                                    paramValue={(this.state.selectValuePtType && this.state.selectValuePtType.value) ? this.state.selectValuePtType.value + "" : ""}
                                                    isOnlySelectLeaf={true}
                                                    handleSelectNotLeaf={(d) => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.treeIsLeaf"));}}
                                                    isDisabled={fieldsProperty.reasonId.disable}
                                                />
                                            </Col>
                                            <Col xs="12" sm="8">
                                                <CustomAvField type="textarea" rows="3" style={{ maxHeight: '13rem' }} name="rootCause" label={t("ttTrouble:ttTrouble.label.reasonDetail")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.reasonDetail")}
                                                    required={fieldsProperty.rootCause.required} disabled={fieldsProperty.rootCause.disable}
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.reasonDetail") } }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"rejectedCode"}
                                                    label={t("ttTrouble:ttTrouble.label.rejectCode")}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.rejectCode")}
                                                    isRequired={fieldsProperty.rejectCode.required}
                                                    options={rejectCodeList}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={(d) => this.setState({ selectValueRejectCode: d })}
                                                    selectValue={this.state.selectValueRejectCode}
                                                    isDisabled={fieldsProperty.rejectCode.disable}
                                                />
                                            </Col>
                                            <Col xs="12" sm="8">
                                                <CustomAvField type="textarea" rows="3" style={{ maxHeight: '13rem' }} name="rejectReason" label={t("ttTrouble:ttTrouble.label.rejectReason")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.rejectReason")}
                                                    disabled={fieldsProperty.rejectReason.disable}
                                                    required={fieldsProperty.rejectReason.required}
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.rejectReason") } }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomDatePicker
                                                    name={"deferredTime"}
                                                    label={t("ttTrouble:ttTrouble.label.deferredTime")}
                                                    isRequired={fieldsProperty.deferredTime.required}
                                                    selected={this.state.deferredTime}
                                                    handleOnChange={(d) => this.setState({ deferredTime: d })}
                                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                                    showTimeSelect={true}
                                                    timeFormat="HH:mm:ss"
                                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                                    readOnly={fieldsProperty.deferredTime.disable}
                                                />
                                            </Col>
                                            <Col xs="12" sm="8">
                                                <CustomAvField type="textarea" rows="3" style={{ maxHeight: '13rem' }} name="deferredReason" label={t("ttTrouble:ttTrouble.label.deferredReason")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.deferredReason")} maxLength="500"
                                                    required={fieldsProperty.deferredReason.required} disabled={fieldsProperty.deferredReason.disable}
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.deferredReason") } }} />
                                            </Col>
                                        </Row>
                                        <Row className={fieldsProperty.reason.visible ? "" : "class-hidden"}>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"reasonLv1Id"}
                                                    label={t("ttTrouble:ttTrouble.label.reasonFromBCCSLevel1")}
                                                    isRequired={fieldsProperty.reason.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.reasonFromBCCSLevel1")}
                                                    options={reasonLv1}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleChangeSelectValueReasonLv1}
                                                    selectValue={this.state.selectValueReasonLv1}
                                                    isDisabled={fieldsProperty.reason.disable}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"reasonLv2Id"}
                                                    label={t("ttTrouble:ttTrouble.label.reasonFromBCCSLevel2")}
                                                    isRequired={fieldsProperty.reason.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.reasonFromBCCSLevel2")}
                                                    options={reasonLv2}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleChangeSelectValueReasonLv2}
                                                    selectValue={this.state.selectValueReasonLv2}
                                                    isDisabled={fieldsProperty.reason.disable}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"reasonLv3Id"}
                                                    label={t("ttTrouble:ttTrouble.label.reasonFromBCCSLevel3")}
                                                    isRequired={fieldsProperty.reason.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.reasonFromBCCSLevel3")}
                                                    options={reasonLv3}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={(d) => this.setState({ selectValueReasonLv3: d })}
                                                    selectValue={this.state.selectValueReasonLv3}
                                                    isDisabled={fieldsProperty.reason.disable}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className={fieldsProperty.reasonOverdue.visible ? "" : "class-hidden"}>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"reasonOverdueId"}
                                                    label={t("ttTrouble:ttTrouble.label.reasonOverdueLevel1")}
                                                    isRequired={fieldsProperty.reasonOverdue.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.reasonOverdueLevel1")}
                                                    options={reasonOverdueLv1}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleChangeSelectValueReasonOverdue1}
                                                    selectValue={this.state.selectValueReasonOverdue1}
                                                    isDisabled={fieldsProperty.reasonOverdue.disable}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"reasonOverdueId2"}
                                                    label={t("ttTrouble:ttTrouble.label.reasonOverdueLevel2")}
                                                    isRequired={fieldsProperty.reasonOverdue.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.reasonOverdueLevel2")}
                                                    options={reasonOverdueLv2}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={(d) => this.setState({ selectValueReasonOverdue2: d })}
                                                    selectValue={this.state.selectValueReasonOverdue2}
                                                    isDisabled={fieldsProperty.reasonOverdue.disable}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"solutionType"}
                                                    label={t("ttTrouble:ttTrouble.label.solutionType")}
                                                    isRequired={fieldsProperty.solutionType.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.solutionType")}
                                                    options={solutionTypeList}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleChangeSelectValueSolutionType}
                                                    selectValue={this.state.selectValueSolutionType}
                                                    isDisabled={fieldsProperty.solutionType.disable}
                                                />
                                            </Col>
                                            <Col xs="12" sm="8">
                                                <CustomAvField type="textarea" rows="3" style={{ maxHeight: '13rem' }} name="workArround" label={t("ttTrouble:ttTrouble.label.workaroundDetail")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.workaroundDetail")}
                                                    required={fieldsProperty.workArround.required} disabled={fieldsProperty.workArround.disable}
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.workaroundDetail") } }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <div style={{ float: 'left' }}>
                                                            <span style={{ position: 'absolute' }} className="mt-1">
                                                                {t("ttTrouble:ttTrouble.label.relateCr")}{fieldsProperty.relatedCr.required ? <span className="text-danger">{" (*)"}</span> : ""}
                                                            </span>
                                                        </div>
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openRelatedCrPopup()} title={t("ttTrouble:ttTrouble.button.implement")}><i className="fa fa-plus"></i></Button>
                                                            <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.removeValueRelatedCr()} title={t("ttTrouble:ttTrouble.button.remove")}><i className="fa fa-close"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CustomReactTableLocal
                                                        columns={columns}
                                                        data={relatedCr}
                                                        // isCheckbox={true}
                                                        loading={loading}
                                                        // propsCheckbox={["crNumber"]}
                                                        defaultPageSize={2}
                                                        // handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                                                    />
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <span>{t("common:common.title.advanceInfo")}</span>
                                    <div className="card-header-actions">
                                        <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormAdvanceInfo" onClick={this.toggleFormAdvanceInfo}><i className={this.state.collapseFormAdvanceInfo ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                    </div>
                                </CardHeader>
                                <Collapse isOpen={this.state.collapseFormAdvanceInfo} id="collapseFormAdvanceInfo">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomInputPopup
                                                    name={"relatedKedb"}
                                                    label={t("ttTrouble:ttTrouble.label.kedb")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                                    value={this.state.relatedKedb || ""}
                                                    handleRemove={() => this.setState({ relatedKedb: "" })}
                                                    handleDoubleClick={this.openRelatedKedbPopup}
                                                    isRequired={fieldsProperty.relatedKedb.required}
                                                    messageRequire={t("ttTrouble:ttTrouble.message.required.kedb")}
                                                    isDisabled={fieldsProperty.relatedKedb.disable}
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
                                                <CustomAvField name="downtime" label={t("ttTrouble:ttTrouble.label.downtime")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.downtime")}
                                                    required={fieldsProperty.downtime.required} maxLength="9"
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.downtime") },
                                                    pattern: {value: '^[+]?[0-9]+([.]([0-9])+)?$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.wrongDataFormat")} }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomAvField name="numAffect" label={t("ttTrouble:ttTrouble.label.numberOfSubcribersAffected")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.numberOfSubcribersAffected")}
                                                    required={fieldsProperty.numAffect.required} maxLength="9" disabled={fieldsProperty.numAffect.disable}
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.numberOfSubcribersAffected") },
                                                    pattern: {value: '^[+]?[0-9]+([.]([0-9])+)?$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.wrongDataFormat")} }} />
                                            </Col>
                                            <Col xs="12" sm="4" className={fieldsProperty.spmCode.visible ? "" : "class-hidden"}>
                                                <CustomAvField name="spmCode" label={t("ttTrouble:ttTrouble.label.code")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.code")} disabled={fieldsProperty.spmCode.disable} />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomAvField name="subMin" label={t("ttTrouble:ttTrouble.label.subMin")}
                                                    placeholder={t("ttTrouble:ttTrouble.placeholder.subMin")}
                                                    required={fieldsProperty.subMin.required} maxLength="9"
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.subMin") },
                                                    pattern: {value: '^[+]?[0-9]+([.]([0-9])+)?$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.wrongDataFormat")} }} />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </CardBody>
                    </Card>
                </AvForm>
                <TtTroubleAddSearchUnitPopup
                    parentState={this.state}
                    closePopup={this.closeSearchUnitPopup}
                    setValue={this.setValueSearchUnitPopup}
                />
                <TtTroubleAddSearchNodePopup
                    parentState={this.state}
                    closePopup={this.closeSearchNodePopup}
                    setValue={this.setValueSearchNodePopup}
                />
                <TtTroubleEditInfoTabKedbPopup
                    closeSearchPage={this.closeRelatedKedbPopup}
                    parentState={this.state}
                    setValue={this.setValueRelatedKedb}
                />
                <TtTroubleEditInfoTabRelatedCR
                    parentState={this.state}
                    closePopup={this.closeRelatedCrPopup}
                    setValue={this.setValueRelatedCr}
                />
                <TtProblemChatPopup
                    parentState={this.state}
                    closePopup={this.closePopupChat}
                />
            </div>
        );
    }
}

TtTroubleEditInfoTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func,
    onChangeChildInfoTab: PropTypes.func,
    setLoading: PropTypes.func,
    setTabIndex: PropTypes.func,
    setVisibleTab: PropTypes.func
};

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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditInfoTab));