import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { Card, CardHeader, Col, Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import TtTroubleEditInfoTab from "./TtTroubleEditInfoTab";
import TtTroubleEditWorkLogTab from "./TtTroubleEditWorkLogTab";
import TtTroubleEditAttachFileTab from "./TtTroubleEditAttachFileTab";
import TtTroubleEditProblemTab from "./TtTroubleEditProblemTab";
import TtTroubleEditRelatedTtTab from "./TtTroubleEditRelatedTtTab";
import TtTroubleEditCrTab from "./TtTroubleEditCrTab";
import TtTroubleEditWoTab from "./TtTroubleEditWoTab";
import TtTroubleEditTransmissionInfoTab from "./TtTroubleEditTransmissionInfoTab";
import TtTroubleEditBRCDInfoTab from "./TtTroubleEditBRCDInfoTab";
import TtTroubleEditHelpInfoTab from "./TtTroubleEditHelpInfoTab";
import TtTroubleEditMOPTab from "./TtTroubleEditMOPTab";
import TtTroubleEditDeviceErrorInfoTab from "./TtTroubleEditDeviceErrorInfoTab";
import TtTroubleEditMobileInfoTab from "./TtTroubleEditMobileInfoTab";
import TtTroubleEditInvolveIBMTab from "./TtTroubleEditInvolveIBMTab";
import TtTroubleEditDetailTab from "./TtTroubleEditDetailTab";
import { CustomSticky } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtTroubleEdit extends Component {
    constructor(props) {
        super(props);

        this.setTabIndex = this.setTabIndex.bind(this);
        this.handleOnChangeChildInfoTab = this.handleOnChangeChildInfoTab.bind(this);
        this.handleOnChangeChildTab = this.handleOnChangeChildTab.bind(this);
        this.handleSetLoading = this.handleSetLoading.bind(this);
        this.handleChangeDisableUpdate = this.handleChangeDisableUpdate.bind(this);
        

        this.state = {
            countTab: 0,
            //Tabs
            tabIndex: 0,
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            objectInfoTab: {},
            objectWorklogTab: {},
            objectBRCDTab: {},
            objectTransmisstionTab: {},
            objectMobileTab: {},
            objectFileTab: {},
            visibleDefault: {
                transInfo: false,
                deviceError: false,
                mop: false,
                mobileInfo: false,
                helpInfo: false,
                brcd: false
            },
            isDisableUpdate: false,
            isReqWorklog: false,
            mapConfigProperty: props.parentState.mapConfigProperty
        };
    }

    componentDidMount() {
        // this.props.actions.getConfigProperty("").then((response) => {
        //     this.setState({
        //         mapConfigProperty: response.payload.data || {}
        //     }, () => {
                this.checkVisibleTab();
        //     });
        // });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.countTab === 5) {
            this.setState({
                countTab: 0
            }, () => {
                const checkTrans = this.state.visibleDefault.transInfo ? this.state.objectTransmisstionTab.isValidSubmitForm : true;
                const checkBRCD = this.state.visibleDefault.brcd ? this.state.objectBRCDTab.isValidSubmitForm : true;
                const checkMobile = this.state.visibleDefault.mobileInfo ? this.state.objectMobileTab.isValidSubmitForm : true;
                if (this.state.objectInfoTab.isValidSubmitForm && this.state.objectFileTab.isValidSubmitForm && checkTrans && checkBRCD && checkMobile) {
                    this.handleSubmit();
                }
            });
        }
    }

    handleOnSave = () => {
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            this.stateChildInfoTab.onSubmitForm(0, true);
            this.stateChildTransmissionTab.onSubmitForm(8, this.state.visibleDefault.transInfo);
            this.stateChildBRCDTab.onSubmitForm(9, this.state.visibleDefault.brcd);
            this.stateChildMobileTab.onSubmitForm(12, this.state.visibleDefault.mobileInfo);
            this.stateChildFileTab.onSubmitForm(3, true);
        });
    }
    
    async handleSubmit() {
        const values = this.state.objectInfoTab.dataInfoTab;
        validSubmitForm(null, values, "idFormAddOrEditInfoTab");
        const ttTrouble = Object.assign({}, this.state.selectedData, values);
        this.setDataToObject(ttTrouble);
        const check = await this.validateBeforeSubmit(ttTrouble);
        if (check) {
            this.updateTtTrouble(this.state.objectFileTab.files, ttTrouble);
        } else {
            this.setState({
                btnAddOrEditLoading: false
            });
        }
    }

    checkVisibleTab = () => {
        const visibleDefault = Object.assign({}, this.state.visibleDefault);
        const { selectedData } = this.state;
        if (this.checkExistProperty(selectedData.typeId + "", "TT.TYPE.TRANS")) {
            visibleDefault.transInfo = true;
        }
        // if (selectedData.reasonId && this.checkExistProperty(selectedData.reasonId, "TT.REASON.DEVICE.ERR")) {
        //     if (this.state.selectedData.state === 9) { //CLEAR
        //         visibleDefault.deviceError = true;
        //     }
        // }
        if (selectedData.insertSource === "SPM") {
            visibleDefault.brcd = true;
        } else if (selectedData.insertSource.includes("NOC")) {
            visibleDefault.mop = true;
        }
        if (this.checkExistProperty(selectedData.typeId, "TT.TYPE.EM_FTTX_CABLE")) {
            visibleDefault.brcd = true;
        }
        if (selectedData.insertSource === "BCCS" && this.checkExistProperty(selectedData.typeId, "TT.TYPE.DD_MOBILE")) {
            visibleDefault.mobileInfo = true;
        }
        if (selectedData.isTickHelp === 1) {
            visibleDefault.helpInfo = true;
        }
        this.setState({
            visibleDefault
        }, () => {
            this.stateChildInfoTab.setFieldsProperty();
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
    
    setTabIndex(index) {
        this.setState({
            tabIndex: index
        });
    }

    handleChangeDisableUpdate(value) {
        this.setState({
            isDisableUpdate: value
        }, () => {
            this.stateChildCRTab.checkDisableButton();
        });
    }

    handleOnChangeChildInfoTab(index, state) {
        switch (index) {
            case 0:
                this.setState({
                    objectInfoTab: state
                }, () => {
                    if (this.stateChildTransmissionTab) {
                        this.stateChildTransmissionTab.setFieldsProperty(this.state.objectInfoTab.fieldsProperty);
                    }
                    if (this.stateChildBRCDTab) {
                        this.stateChildBRCDTab.setFieldsProperty(this.state.objectInfoTab.fieldsProperty.brcd.required);
                    }
                    if (this.stateChildMobileTab) {
                        this.stateChildMobileTab.setFieldsProperty(this.state.objectInfoTab.fieldsProperty);
                    }
                });
                break;
            case 2:
                this.setState({
                    objectWorklogTab: state
                });
                break;
            case 8:
                this.setState({
                    objectTransmisstionTab: state
                });
                break;
            case 9:
                this.setState({
                    objectBRCDTab: state
                });
                break;
            case 12:
                this.setState({
                    objectMobileTab: state
                });
                break;
            default:
                break;
        }
    }

    handleOnChangeChildTab(index, state, errors) {
        const count = this.state.countTab;
        switch (index) {
            case 0:
                if (state.isValidSubmitForm) {
                    this.setState({
                        objectInfoTab: state,
                        countTab: count + 1
                    });
                } else {
                    this.setState({
                        objectInfoTab: state,
                        countTab: count + 1,
                        tabIndex: index,
                        btnAddOrEditLoading: false
                    }, () => {
                        invalidSubmitForm(null, errors, null, "idFormAddOrEditInfoTab");
                    });
                }
                break;
            case 2:
                this.setState({
                    objectWorklogTab: state
                });
                break;
            case 3:
                if (state.isValidSubmitForm) {
                    this.setState({
                        objectFileTab: state,
                        countTab: count + 1
                    });
                } else {
                    this.setState({
                        objectFileTab: state,
                        countTab: count + 1,
                        tabIndex: index,
                        btnAddOrEditLoading: false
                    }, () => {
                        invalidSubmitForm(null, errors, null, "idFormAddOrEditFileTab");
                    });
                }
                break;
            case 8:
                if (state.isValidSubmitForm) {
                    this.setState({
                        objectTransmisstionTab: state,
                        countTab: count + 1
                    });
                } else {
                    this.setState({
                        objectTransmisstionTab: state,
                        countTab: count + 1,
                        tabIndex: index,
                        btnAddOrEditLoading: false
                    }, () => {
                        invalidSubmitForm(null, errors, null, "idFormAddOrEditTransTab");
                    });
                }
                break;
            case 9:
                if (state.isValidSubmitForm) {
                    this.setState({
                        objectBRCDTab: state,
                        countTab: count + 1
                    });
                } else {
                    this.setState({
                        objectBRCDTab: state,
                        countTab: count + 1,
                        tabIndex: index,
                        btnAddOrEditLoading: false
                    }, () => {
                        invalidSubmitForm(null, errors, null, "idFormAddOrEditBRCDTab");
                    });
                }
                break;
            case 12:
                if (state.isValidSubmitForm) {
                    this.setState({
                        objectMobileTab: state,
                        countTab: count + 1
                    });
                } else {
                    this.setState({
                        objectMobileTab: state,
                        countTab: count + 1,
                        tabIndex: index,
                        btnAddOrEditLoading: false
                    }, () => {
                        invalidSubmitForm(null, errors, null, "idFormAddOrEditMobileTab");
                    });
                }
                break;
            default:
                break;
        }
    }

    handleSetLoading(boolean) {
        this.setState({
            btnAddOrEditLoading: boolean
        });
    }

    async checkWoClosed(object) {
        const response = await this.props.actions.getListDataSearchWo(object).then((response) => {
            const data = response.payload.data;
            return data;
        }).catch((error) => {
            return [];
        });
        if (response && response.length > 0) {
            for (const wo of response) {
                if (wo.status !== 8 && wo.status !== 2) {
                    return false;
                }
            }
        }
        return true;
    }

    async validateBeforeSubmit(ttTrouble) {
        const { objectInfoTab, objectWorklogTab, objectMobileTab, selectedData } = this.state;
        if (objectInfoTab.fieldsProperty.relatedCr.required && objectInfoTab.relatedCr.length < 1) {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.relatedCr"));
            return false;
        }
        if (objectInfoTab.beginTroubleTime && objectInfoTab.beginTroubleTime > new Date()) {
            this.setState({
                tabIndex: 0
            }, () => {
                document.getElementById("custom-beginTroubleTime").focus();
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.beginTroubleTime"));
            });
            return false;
        } else if (objectInfoTab.endTroubleTime && objectInfoTab.endTroubleTime > new Date()) {
            this.setState({
                tabIndex: 0
            }, () => {
                document.getElementById("custom-endTroubleTime").focus();
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.endTroubleTime"));
            });
            return false;
        } else if (objectInfoTab.endTroubleTime && objectInfoTab.beginTroubleTime && objectInfoTab.beginTroubleTime > objectInfoTab.endTroubleTime) {
            this.setState({
                tabIndex: 0
            }, () => {
                document.getElementById("custom-beginTroubleTime").focus();
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.endTimeLowerStartTime"));
            });
            return false;
        } else if (objectMobileTab.estimateTime && objectMobileTab.estimateTime < new Date()) {
            this.setState({
                tabIndex: 12
            }, () => {
                document.getElementById("custom-estimateTime").focus();
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.estimateTime"));
            });
            return false;
        }
        if (objectInfoTab.selectValueStatus.value === 6 || objectInfoTab.selectValueStatus.value === 7) {
            if (objectInfoTab.deferredTime && objectInfoTab.deferredTime < new Date()) {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-deferredTime").focus();
                    toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.deferredTime"));
                });
                return false;
            }
            //validate mobile
            if (this.state.visibleDefault.mobileInfo) {
                const { objectMobileTab, objectInfoTab } = this.state;
                if (objectMobileTab.selectValueGroupSolution) {
                    const networkSolutionDTO = objectMobileTab.mapGroupSolution.find(item => item.solutionId + "" === objectMobileTab.selectValueGroupSolution.value);
                    if (networkSolutionDTO && networkSolutionDTO.maxAppointTime) {
                        const maxDefer = new Date(new Date().getTime() + networkSolutionDTO.maxAppointTime*60*60*1000);
                        if (objectInfoTab.deferredTime > maxDefer) {
                            this.setState({
                                tabIndex: 0
                            }, () => {
                                document.getElementById("custom-deferredTime").focus();
                                toastr.warning(this.props.t("ttTrouble:ttTrouble.label.deferredTime") + " " + 
                                this.props.t("ttTrouble:ttTrouble.message.error.incidentMax", {day: networkSolutionDTO.maxAppointTime}));
                            });
                            return false;
                        }
                    }
                    
                    if (networkSolutionDTO && networkSolutionDTO.maxFinishTime) {
                        const maxEsti = new Date(new Date().getTime() + networkSolutionDTO.maxFinishTime*60*60*1000);
                        if (objectMobileTab.estimateTime > maxEsti) {
                            this.setState({
                                tabIndex: 12
                            }, () => {
                                document.getElementById("custom-estimateTime").focus();
                                toastr.warning(this.props.t("ttTrouble:ttTrouble.label.estimateTime") + " " + 
                                this.props.t("ttTrouble:ttTrouble.message.error.incidentMax", {day: networkSolutionDTO.maxFinishTime}));
                            });
                            return false;
                        }
                    }
                    if (ttTrouble.deferType + "" === "2") {
                        if (networkSolutionDTO && networkSolutionDTO.maxAppointTimes) {
                            const numDelay = ttTrouble.numPending === null ? 1 : ttTrouble.numPending;
                            if (networkSolutionDTO.maxAppointTimes < numDelay) {
                                this.setState({
                                    tabIndex: 12
                                }, () => {
                                    document.getElementById("custom-deferType").focus();
                                    toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.incidentMaxActionDelay", {time: networkSolutionDTO.maxAppointTimes}));
                                });
                                return false;
                            }
                        }
                    }
                }
            }
        }
        if (selectedData.priorityId !== objectInfoTab.selectValuePriority.value) {
            if (!objectWorklogTab.isAddedWorklog) {
                this.setState({
                    isReqWorklog: true
                }, () => {
                    toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.reqWorklog"));
                    this.setState({
                        tabIndex: 2
                    });
                });
                return false;
            }
        }
        let checkState = false;
        if (objectInfoTab.selectValueStatus.code === "CLOSED" || objectInfoTab.selectValueStatus.code === "CLOSED NOT KEDB") {
            checkState = true;
        }
        if (checkState && selectedData.insertSource && selectedData.woCode
            && (selectedData.insertSource.includes("SPM") || selectedData.insertSource.includes("BCCS")
            || (selectedData.insertSource.includes("NOC") && selectedData.countReopen + "" === "10000"))) {
            const object = {
                woSystemId: selectedData.troubleCode,
                userId: JSON.parse(localStorage.user).userID,
                woCode: selectedData.woCode,
            };
            const check = await this.checkWoClosed(object);
            if (!check) {
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.woNotClose"));
                return false;
            }
        }
        if (checkState && selectedData.insertSource && selectedData.insertSource.includes("NOC")) {
            const object = Object.assign({}, this.state.selectedData);
            this.setDataToObject(object);
            const response = await this.props.actions.checkWoRequiredClosed(object).then((response) => {
                const data = response.payload.data;
                return data;
            }).catch((error) => {
                return {};
            });
            if (response.key === "SUCCESS" && response.message !== "") {
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.requiredHaveWo") + "\n" + response.message);
                return false;
            }
        }
        return true;
    }

    setDataToObject(object) {
        const { objectInfoTab } = this.state;
        object.troubleName = object.troubleName.trim();
        object.description = object.description.trim();
        object.infoTicket = object.infoTicket ? object.infoTicket.trim() : "";
        object.downtime = object.downtime ? object.downtime.trim() : "";
        object.numAffect = object.numAffect ? object.numAffect.trim() : "";
        if (objectInfoTab.fieldsProperty.spmCode.visible) {
            object.spmCode = object.spmCode ? object.spmCode.trim() : "";
        }
        object.subMin = object.subMin ? object.subMin.trim() : "";
        object.rootCause = object.rootCause ? object.rootCause.trim() : "";
        object.rejectReason = object.rejectReason ? object.rejectReason.trim() : "";
        object.deferredReason = object.deferredReason ? object.deferredReason.trim() : "";
        object.workArround = object.workArround ? object.workArround.trim() : "";
        object.priorityId = objectInfoTab.selectValuePriority ? objectInfoTab.selectValuePriority.value : "";
        object.priorityName = objectInfoTab.selectValuePriority ? objectInfoTab.selectValuePriority.label : "";
        object.typeId = objectInfoTab.selectValuePtType ? objectInfoTab.selectValuePtType.value : "";
        object.typeName = objectInfoTab.selectValuePtType ? objectInfoTab.selectValuePtType.code : "";
        object.country = objectInfoTab.selectValueCountry ? objectInfoTab.selectValueCountry.value : "";
        object.receiveUnitId = objectInfoTab.selectValueReceiveUnit ? objectInfoTab.selectValueReceiveUnit.unitId : "";
        object.receiveUnitName = objectInfoTab.selectValueReceiveUnit ? objectInfoTab.selectValueReceiveUnit.unitName : "";
        object.receiveUserId = objectInfoTab.selectValueReceiveUser.value !== null ? objectInfoTab.selectValueReceiveUser.value : "";
        object.receiveUserName = objectInfoTab.selectValueReceiveUser !== null ? objectInfoTab.selectValueReceiveUser.label : "";
        object.subCategoryId = objectInfoTab.selectValueSubCategory ? objectInfoTab.selectValueSubCategory.value : -1;
        object.locationId = objectInfoTab.selectValueLocation ? objectInfoTab.selectValueLocation.value : "";
        object.location = objectInfoTab.selectValueLocation ? objectInfoTab.selectValueLocation.label : "";
        object.impactId = objectInfoTab.selectValueImpact ? objectInfoTab.selectValueImpact.value : "";
        object.vendorId = objectInfoTab.selectValueVendor ? objectInfoTab.selectValueVendor.value : "";
        object.warnLevel = objectInfoTab.selectValueWarnLevel ? objectInfoTab.selectValueWarnLevel.value : null;
        object.affectedNode = objectInfoTab.networkNodeCode.map(item => item.deviceCode).join(",");
        object.lstNode = objectInfoTab.networkNodeCode;
        object.nationCode = objectInfoTab.networkNodeCode.length > 0 ? objectInfoTab.networkNodeCode[0].nationCode : "";
        object.risk = objectInfoTab.selectValueRisk.value;
        object.affectedService = objectInfoTab.selectValueAffectService.map(item => item.value).join(",");
        object.alarmGroupId = objectInfoTab.selectValueAlarmGroup ? objectInfoTab.selectValueAlarmGroup.value : null;
        object.alarmGroupCode = objectInfoTab.selectValueAlarmGroup ? objectInfoTab.selectValueAlarmGroup.code : null;
        object.strAlarmGroupDescription = objectInfoTab.selectValueAlarmGroup ? objectInfoTab.selectValueAlarmGroup.subValue : null;
        object.transNetworkTypeId = objectInfoTab.selectValueTranNwType ? objectInfoTab.selectValueTranNwType.value : null;
        object.isStationVip = objectInfoTab.stationVip ? "1" : "0";
        object.autoClose = objectInfoTab.autoClose ? "1" : "0";
        object.isTickHelp = objectInfoTab.help ? "1" : "0";
        object.supportUnitId = objectInfoTab.selectValueSupportUnit ? objectInfoTab.selectValueSupportUnit.value : null;
        object.supportUnitName = objectInfoTab.selectValueSupportUnit ? objectInfoTab.selectValueSupportUnit.label : null;
        object.solutionType = objectInfoTab.selectValueSolutionType.value || "";
        object.relatedCr = objectInfoTab.relatedCr.length > 0 ? objectInfoTab.relatedCr[0].crNumber : "";
        object.relatedKedb = objectInfoTab.relatedKedb || "";
        object.rejectedCode = objectInfoTab.selectValueRejectCode ? objectInfoTab.selectValueRejectCode.value : null;
        object.reasonId = objectInfoTab.selectValueReason ? objectInfoTab.selectValueReason.value : null;
        object.reasonName = objectInfoTab.selectValueReason ? objectInfoTab.selectValueReason.label : null;
        object.deferredTime = objectInfoTab.deferredTime ? objectInfoTab.deferredTime : "";
        object.lastUpdateTime = new Date();
        object.beginTroubleTime = objectInfoTab.beginTroubleTime || "";
        object.endTroubleTime = objectInfoTab.endTroubleTime || "";
        object.closeCode = objectInfoTab.selectValueCloseCode ? objectInfoTab.selectValueCloseCode.value : "";
        if (objectInfoTab.fieldsProperty.reason.visible) {
            object.reasonLv1Id = objectInfoTab.selectValueReasonLv1.value || "";
            object.reasonLv1Name = objectInfoTab.selectValueReasonLv1.label || "";
            object.reasonLv2Id = objectInfoTab.selectValueReasonLv2.value || "";
            object.reasonLv2Name = objectInfoTab.selectValueReasonLv2.label || "";
            object.reasonLv3Id = objectInfoTab.selectValueReasonLv3.value || "";
            object.reasonLv3Name = objectInfoTab.selectValueReasonLv3.label || "";
        }
        if (objectInfoTab.fieldsProperty.reasonOverdue.visible) {
            object.reasonOverdueId = objectInfoTab.selectValueReasonOverdue1.value || "";
            object.reasonOverdueName = objectInfoTab.selectValueReasonOverdue1.label || "";
            object.reasonOverdueId2 = objectInfoTab.selectValueReasonOverdue2.value || "";
            object.reasonOverdueName2 = objectInfoTab.selectValueReasonOverdue2.label || "";
        }
        if (this.state.visibleDefault.brcd) {
            if (this.state.objectBRCDTab && this.state.objectBRCDTab.brcdData) {
                const brcdData = this.state.objectBRCDTab.brcdData;
                object.numAon = brcdData.numAon ? brcdData.numAon.trim() : "";
                object.numGpon = brcdData.numGpon ? brcdData.numGpon.trim() : "";
                object.numNexttv = brcdData.numNexttv ? brcdData.numNexttv.trim() : "";
                object.numThc = brcdData.numThc ? brcdData.numThc.trim() : "";
            }
        }
        if (this.state.visibleDefault.transInfo) {
            if (this.state.objectTransmisstionTab && this.state.objectTransmisstionTab.transmisstionData) {
                const objectTransmisstionTab = this.state.objectTransmisstionTab;
                object.transNetworkTypeId = objectTransmisstionTab.selectValueNWTypes.value || "";
                object.networkLevel = objectTransmisstionTab.selectValueNetworkLevel.map(i => { return i.value }).join(",") || "";
                if (objectInfoTab.fieldsProperty.transInfo2.visible) {
                    object.cableType = objectTransmisstionTab.selectValueCableType.value || "";
                    object.lineCutCode = objectTransmisstionTab.valueLineCutCode || "";
                    object.closuresReplace = objectTransmisstionTab.closuresReplace || "";
                    object.codeSnippetOff = objectTransmisstionTab.selectValueCodeSnippetOff.map(item => item.value).join(",") || "";
                    object.transReasonEffectiveId = objectTransmisstionTab.selectValueTransReason.value || "";
                    object.transReasonEffectiveContent = objectTransmisstionTab.transmisstionData.transReasonEffectiveContent ? objectTransmisstionTab.transmisstionData.transReasonEffectiveContent.trim() : "";
                }
            }
        }
        if (this.state.visibleDefault.mobileInfo) {
            if (this.state.objectMobileTab && this.state.objectMobileTab.mobileData) {
                const objectMobileTab = this.state.objectMobileTab;
                if (objectInfoTab.fieldsProperty.deferType && objectInfoTab.fieldsProperty.deferType.visible) {
                    object.deferType = objectMobileTab.selectValueDeferType.value;
                } else {
                    object.deferType = objectInfoTab.selectedData.deferType;
                }
                if (objectInfoTab.fieldsProperty.estimateTime && objectInfoTab.fieldsProperty.estimateTime.visible) {
                    object.estimateTime = objectMobileTab.estimateTime;
                } else {
                    object.estimateTime = objectInfoTab.selectedData.estimateTime;
                }
                object.longitude = objectMobileTab.longitude ? objectMobileTab.longitude.trim() : "";
                object.latitude = objectMobileTab.latitude ? objectMobileTab.latitude.trim() : "";
                object.concave = objectMobileTab.concave.concavePointCode || "";
                object.cellService = objectMobileTab.cellService.cellCode || "";
                object.groupSolution = objectMobileTab.selectValueGroupSolution.value || "";
            }
        }

        //validate data
        const beginState = objectInfoTab.stateAllList.find(item => item.itemId + "" === objectInfoTab.selectedData.state + "");
        const endState = objectInfoTab.stateAllList.find(item => item.itemId + "" === objectInfoTab.selectValueStatus.value + "");
        if (endState.itemCode === "WAITING RECEIVE" && beginState.itemCode === "WAITING RECEIVE" &&
            JSON.parse(localStorage.user).deptId + "" === object.receiveUnitId) {
            object.state = "5";
            object.stateName = "QUEUE";
            object.queueTime = new Date();
        } else {
            object.state = objectInfoTab.selectValueStatus.value;
            object.stateName = objectInfoTab.selectValueStatus.code;
        }

        if (object.stateName === "CLEAR" && object.insertSource === "SPM" && !object.woCode &&
            this.checkExistProperty(object.alarmGroupCode, "ALARM_GROUP_BROKEN_CABLE")) {
            object.countReopen = "1";
        }

        if (object.stateName === "CLEAR" && objectInfoTab.selectedData.createUnitId === object.receiveUnitId &&
            (!object.isTickHelp || object.isTickHelp === "0")) {
            if (object.stateName === "CLEAR" && object.insertSource === "SPM" && !object.woCode &&
                this.checkExistProperty(object.alarmGroupCode, "ALARM_GROUP_BROKEN_CABLE")) {
                object.countReopen = "1";
            } else if (!object.relatedKedb) { //khong co kedb
                object.state = "10";
                object.stateName = "CLOSED NOT KEDB";
                object.checkbox = "5";
            } else { //co kedb
                object.state = "11";
                object.stateName = "CLOSED";
                object.checkbox = "5";
            }
        }

        if (beginState.itemCode === "CLEAR" && endState.itemCode === "WAITING RECEIVE") {
            if (!(objectInfoTab.selectedData.receiveUnitId !== object.receiveUnitId &&
                JSON.parse(localStorage.user).deptId + "" === objectInfoTab.selectedData.createUnitId)) {
                object.assignTime = object.lastUpdateTime;
                object.assignTimeTemp = "";
                object.timeUsed = "0";
            }
        }
    }

    updateTtTrouble = (files, ttTrouble) => {
        this.props.actions.editTtTrouble(files, ttTrouble).then((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                if (response.payload.data.key === "SUCCESS") {
                    this.props.closePage("EDIT", true);
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.update"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
                }
            });
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(response.error.response.data.message);
                    // toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
                }
            });
        });
    }

    onChangeTab = (tabIndex) => {
        this.setState({
            tabIndex
        });
    }

    setVisibleTab = (object) => {
        const visibleDefault = Object.assign({}, this.state.visibleDefault);
        try {
            visibleDefault[object.key] = object.value;
            this.setState({
                visibleDefault
            });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { t } = this.props;
        const { visibleDefault, isDisableUpdate } = this.state;
        return (
            <Card>
                <CustomSticky>
                    <CardHeader>
                        <i className="fa fa-edit"></i>
                        <span>{t("ttTrouble:ttTrouble.title.updateTrouble")}</span>
                        <div className="card-header-actions card-header-actions-button">
                            <LaddaButton type="button"
                                className="btn btn-primary btn-md mr-1"
                                loading={this.state.btnAddOrEditLoading}
                                data-style={ZOOM_OUT}
                                onClick={this.handleOnSave}
                                disabled={isDisableUpdate}>
                                <i className="fa fa-save"></i> {t("ttTrouble:ttTrouble.button.saveTrouble")}
                            </LaddaButton>{' '}
                            <Button type="button" color="secondary" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                        </div>
                    </CardHeader>
                </CustomSticky>
                {/* <CardHeader>
                    <i className="fa fa-align-justify"></i>{t("ttTrouble:ttTrouble.title.updateTrouble")}
                </CardHeader> */}
                <Col xs="12" >
                    <Tabs style={{ paddingTop: '15px' }} selectedIndex={this.state.tabIndex} onSelect={this.onChangeTab}>
                        <TabList>
                            <Tab>{t("ttTrouble:ttTrouble.title.troubleInformation")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.detail")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.workLog")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.attachFile")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.problem")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.relatedTt")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.cr")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.wo")}</Tab>
                            <Tab disabled={!visibleDefault.transInfo}>{t("ttTrouble:ttTrouble.title.transmissionInfo")}</Tab>
                            <Tab disabled={!visibleDefault.brcd}>{t("ttTrouble:ttTrouble.title.brcdInformation")}</Tab>
                            <Tab disabled={!visibleDefault.helpInfo}>{t("ttTrouble:ttTrouble.title.helpInformation")}</Tab>
                            <Tab disabled={!visibleDefault.mop}>{t("ttTrouble:ttTrouble.title.mop")}</Tab>
                            <Tab disabled={!visibleDefault.mobileInfo}>{t("ttTrouble:ttTrouble.title.mobileInformation")}</Tab>
                            <Tab disabled={!visibleDefault.deviceError}>{t("ttTrouble:ttTrouble.title.deviceErrorInfo")}</Tab>
                            <Tab>{t("ttTrouble:ttTrouble.title.involveIBM")}</Tab>
                        </TabList>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditInfoTab
                                onRef={ref => (this.stateChildInfoTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildInfoTab={this.handleOnChangeChildInfoTab}
                                onChangeChildTab={this.handleOnChangeChildTab}
                                setLoading={this.handleSetLoading}
                                setTabIndex={this.setTabIndex}
                                setVisibleTab={this.setVisibleTab}
                                onChangeDisableUpdate={this.handleChangeDisableUpdate} />
                        </TabPanel>
                        <TabPanel>
                            <TtTroubleEditDetailTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditWorkLogTab
                                onRef={ref => (this.stateChildWorkLogTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditAttachFileTab
                                onRef={ref => (this.stateChildFileTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab} />
                        </TabPanel>
                        <TabPanel>
                            <TtTroubleEditProblemTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditRelatedTtTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditCrTab
                                onRef={ref => (this.stateChildCRTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditWoTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditTransmissionInfoTab
                                onRef={ref => (this.stateChildTransmissionTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditBRCDInfoTab
                                onRef={ref => (this.stateChildBRCDTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab} />
                        </TabPanel>
                        <TabPanel>
                            <TtTroubleEditHelpInfoTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <TtTroubleEditMOPTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditMobileInfoTab
                                onRef={ref => (this.stateChildMobileTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab}
                                onChangeChildInfoTab={this.handleOnChangeChildInfoTab} />
                        </TabPanel>
                        <TabPanel>
                            <TtTroubleEditDeviceErrorInfoTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <TtTroubleEditInvolveIBMTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                    </Tabs>
                </Col>
            </Card>
        );
    }
}

TtTroubleEdit.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEdit));