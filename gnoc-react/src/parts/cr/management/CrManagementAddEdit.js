import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import { Card, CardHeader, Col, Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomSticky } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import { validSubmitForm, invalidSubmitForm, convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import CrManagementUnitApproveTab from './CrManagementUnitApproveTab';
import CrManagementCrInfoTab from './CrManagementCrInfoTab';
import CrManagementAttachmentTab from './CrManagementAttachmentTab';
import CrManagementAffectedNodeTab from './CrManagementAffectedNodeTab';
import CrManagementAlarmListTab from './CrManagementAlarmListTab';
import CrManagementCableTab from './CrManagementCableTab';
import CrManagementDependentCrTab from './CrManagementDependentCrTab';
import CrManagementImpactNodeTab from './CrManagementImpactNodeTab';
import CrManagementModuleTab from './CrManagementModuleTab';
import CrManagementVendorTab from './CrManagementVendorTab';
import CrManagementWorklogTab from './CrManagementWorklogTab';
import CrManagementWorkOrderTab from './CrManagementWorkOrderTab';
import CrManagementHistoryTab from './CrManagementHistoryTab';
import { buildDataCbo } from './CrManagementUtils';
import CrManagementCrDuplicatePopup from './CrManagementCrDuplicatePopup';
import CrManagementCrAssignPopup from './CrManagementCrAssignPopup';
import CrManagementAddEditPopup from './CrManagementAddEditPopup';

class CrManagementAddEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countTab: 0,
            isOpenPopupDuplicate: false,
            isOpenPopupAssign: false,
            isOpenPopupCrAddEdit: false,
            //Tabs
            tabIndex: 0,
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            titleUpdate: props.parentState.titleUpdate,
            btnAddOrEditLoading: false,
            objectInfoTab: {},
            isHandleSave: "",
            visibleButtonSave: true,
            visibleButtonSaveDraft: false,
            visibleButtonDuplicate: false,
            visibleButtonClone: false,
            visibleButtonAssign: false,
            visibleButtonClose: false,
            visibleToolbarTab: this.initVisibleToolbarTab()
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.props.isShowPopup) {
            if (newProps.parentState.selectedDataCr) {
                this.setState({ selectedData: newProps.parentState.selectedDataCr || {} });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.countTab === 1) {
            this.setState({
                countTab: 0
            }, () => {
                if (this.state.objectInfoTab.isValidSubmitForm) {
                    this.handleSubmit();
                }
            });
        }
    }

    initVisibleToolbarTab = () => {
        return {
            worklog: {
                all: false
            },
            attachment: {
                all: false
            },
            networkNode: {
                all: false,
                add: true,
                delete: true,
                export: true,
                import: true
            },
            networkNodeAffected: {
                all: false,
                add: true,
                delete: true,
                export: true,
                import: true
            },
            workOrder: {
                all: false
            },
            alarm: {
                all: true,
                add: true,
                delete: true,
                export: true,
                loadAlarm: true
            },
            module: {
                all: true,
                add: false,
                delete: false
            },
            vendor: {
                all: true,
                add: true,
                delete: true
            },
            lane: {
                all: true,
                add: false,
            },
            cable: {
                all: true,
                add: false,
            },
        }
    }

    setVisibleButtonTab = (field, objButton) => {
        const visibleToolbarTab = Object.assign({}, this.state.visibleToolbarTab);
        for (const key in objButton) {
            if (objButton.hasOwnProperty(key)) {
                visibleToolbarTab[field][key] = objButton[key];
            }
        }
        this.setState({
            visibleToolbarTab
        });
    }

    handleSubmit = () => {
        const values = this.state.objectInfoTab.dataInfoTab;
        validSubmitForm(null, values, "idFormAddOrEditInfoTab");
        const crManagement = Object.assign({}, ["ADD", "CLONE"].includes(this.state.modalName) ? {} : this.state.selectedData, values);
        if (this.state.modalName === "ADD" || this.state.modalName === "CLONE") {
            this.setDataToObject(crManagement);
            const check = this.validateBeforeSubmit(crManagement);
            if (check) {
                this.setState({
                    btnAddOrEditLoading: true
                }, () => {
                    this.props.actions.addCrManagement(crManagement).then((response) => {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            if (response.payload.data.key === "SUCCESS") {
                                if (this.props.modalName && this.props.isShowPopup) {
                                    this.props.closePopup();
                                } else {
                                    this.props.closePage("ADD", true);
                                }
                                toastr.success(this.props.t("crManagement:crManagement.message.success.add"));
                            } else if (response.payload.data.key === "ERROR") {
                                toastr.error(response.payload.data.message);
                            } else {
                                toastr.error(this.props.t("crManagement:crManagement.message.error.add"));
                            }
                        });
                    }).catch((response) => {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            try {
                                toastr.error(response.error.response.data.errors[0].defaultMessage);
                            } catch (error) {
                                toastr.error(this.props.t("crManagement:crManagement.message.error.add"));
                            }
                        });
                    });
                });
            }
        } else if (this.state.modalName === "EDIT") {
            const Constants = buildDataCbo("ACTION_RIGHT");
            const actionCode = buildDataCbo("ACTION_CODE");
            const { objectInfoTab } = this.state;
            // this.createWoAfterClose = false;
            const action = objectInfoTab.selectValueActionGroup ? objectInfoTab.selectValueActionGroup.value : "";
            if (objectInfoTab.actionRight !== null && Object.keys(Constants).map(key => Constants[key]).includes(objectInfoTab.actionRight)) {
                if (Constants.CAN_EDIT === objectInfoTab.actionRight || actionCode.UPDATE_CR_WHEN_RECEIVE_STD.itemId === action) {
                    this.setDataToObject(crManagement);
                    const check = this.validateBeforeSubmit(crManagement);
                    if (check) {
                        this.setState({
                            btnAddOrEditLoading: true
                        }, () => {
                            this.props.actions.editCrManagement(crManagement).then((response) => {
                                this.setState({
                                    btnAddOrEditLoading: false
                                }, () => {
                                    if (response.payload.data.key === "SUCCESS") {
                                        this.props.closePage("ADD", true);
                                        toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                                    } else if (response.payload.data.key === "ERROR") {
                                        toastr.error(response.payload.data.message);
                                    } else {
                                        toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                                    }
                                });
                            }).catch((response) => {
                                this.setState({
                                    btnAddOrEditLoading: false
                                }, () => {
                                    try {
                                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                                    } catch (error) {
                                        toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                                    }
                                });
                            });
                        });
                    }
                } else {
                    const check = this.validateBeforeSubmitForProcess(crManagement);
                    if (check) {
                        this.setDataToObjectForProcess(crManagement);
                        this.handleProcess(crManagement);
                    }
                }
            }
        }
    }

    handleProcess = (crManagement) => {
        const Constants = buildDataCbo("ACTION_RIGHT");
        const { objectInfoTab } = this.state;
        if (Constants.CAN_APPROVE === objectInfoTab.actionRight || Constants.CAN_APPROVE_STANDARD === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionApproveCR(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_CONSIDER === objectInfoTab.actionRight
                || Constants.CAN_CONSIDER_NO_APPRAISE === objectInfoTab.actionRight
                || Constants.CAN_CONSIDER_NO_ASSIGNEE === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionAppraiseCr(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_RECEIVE === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_NO_ACCEPT === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_NO_ASSIGNEE === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_STANDARD === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_STANDARD_NO_ACCEPT === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_STANDARD_NO_ASSIGNEE === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_EMR === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_EMR_NO_ACCEPT === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_EMR_NO_ASSIGNEE === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_PREAPPROVE === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_PREAPPROVE_NO_ACCEPT === objectInfoTab.actionRight
                || Constants.CAN_RECEIVE_PREAPPROVE_NO_ASSIGNEE === objectInfoTab.actionRight
                || Constants.CAN_ONLY_REASSIGN === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionReceiveCr(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_RESOLVE === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionResolveCr(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_ASSIGN_CAB === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionAssignCab(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_CAB === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionCab(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_EDIT_CR_BY_QLTD === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionEditCr(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_SCHEDULE === objectInfoTab.actionRight
                || Constants.CAN_SCHEDULE_EMR === objectInfoTab.actionRight
                || Constants.CAN_SCHEDULE_PREAPPROVE === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionScheduleCr(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_VERIFY === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionVerify(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        } else if (Constants.CAN_CLOSE === objectInfoTab.actionRight) {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                this.props.actions.actionCloseCr(crManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closePage("ADD", true);
                            toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                        }
                    });
                });
            });
        }
    }

    validateBeforeSubmit = (crManagement) => {
        if (crManagement.lstNetworkNodeId && crManagement.lstNetworkNodeId.length > 1000) {
            toastr.warning(this.props.t("crManagement:crManagement.message.error.nodeOver", {number: 1000}));
            return false;
        }
        if (crManagement.lstNetworkNodeIdAffected && crManagement.lstNetworkNodeIdAffected.length > 1000) {
            toastr.warning(this.props.t("crManagement:crManagement.message.error.nodeOver", {number: 1000}));
            return false;
        }
        //bo sung validate ko tao cr chuan cho kieu cr xlsc/xlvd, bao duong
        if (crManagement.crType === "2") {
            if (crManagement.subcategory === "9" || crManagement.subcategory === "10" || crManagement.subcategory === "11") {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("idFormAddOrEditInfoTab").elements["custom-input-crProcess"].nextElementSibling.focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.subcategoryNotAllow"));
                });
                return false;
            }
        }

        const actionCode = buildDataCbo("ACTION_CODE");
        const { objectInfoTab } = this.state;
        if (["ADD", "CLONE"].includes(this.state.modalName) || (crManagement.actionType
            && (actionCode.UPDATE.itemId === crManagement.actionType.trim()
            || actionCode.APPROVE.itemId === crManagement.actionType.trim()
            || actionCode.ASSIGN_TO_CONSIDER.itemId === crManagement.actionType.trim()
            || actionCode.CHANGE_TO_CAB.itemId === crManagement.actionType.trim()
            || actionCode.ASSIGN_TO_CAB.itemId === crManagement.actionType.trim()
            || actionCode.CAB.itemId === crManagement.actionType.trim()
            || actionCode.SCHEDULE.itemId === crManagement.actionType.trim()
            || actionCode.EDIT_CR_BY_QLTD.itemId === crManagement.actionType.trim()))) {
            if (objectInfoTab.earliestStartTime && objectInfoTab.earliestStartTime < new Date() && crManagement.crType !== "1") {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-earliestStartTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.earliestStartTime"));
                });
                return false;
            }

            if (objectInfoTab.latestStartTime && objectInfoTab.earliestStartTime && objectInfoTab.latestStartTime < objectInfoTab.earliestStartTime) {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-latestStartTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.lastestStartTime"));
                });
                return false;
            }

            if (objectInfoTab.disturbanceEndTime && objectInfoTab.disturbanceStartTime && objectInfoTab.disturbanceEndTime < objectInfoTab.disturbanceStartTime) {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-disturbanceEndTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.timeEffectServiceFrom"));
                });
                return false;
            }
            if (objectInfoTab.earliestStartTime && objectInfoTab.disturbanceStartTime && objectInfoTab.latestStartTime
                && objectInfoTab.disturbanceEndTime && (objectInfoTab.disturbanceStartTime < objectInfoTab.earliestStartTime || objectInfoTab.disturbanceEndTime > objectInfoTab.latestStartTime)) {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-disturbanceStartTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.disturbanceInDatecr"));
                });
                return false;
            }
        }
        return true;
    }

    validateBeforeSubmitForProcess = (crManagement) => {
        if (buildDataCbo("CR_CONFIG").WAITING_MOP_STATUS === crManagement.waitingMopStatus) {
            toastr.warning(this.props.t("crManagement:crManagement.message.error.waitingVmsaMop"));
            return false;
        }
        //bo sung validate ko tao cr chuan cho kieu cr xlsc/xlvd, bao duong
        if (crManagement.crType === "2") {
            if (crManagement.subcategory === "9" || crManagement.subcategory === "10" || crManagement.subcategory === "11") {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("idFormAddOrEditInfoTab").elements["custom-input-crProcess"].nextElementSibling.focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.subcategoryNotAllow"));
                });
                return false;
            }
        }
        const actionCode = buildDataCbo("ACTION_CODE");
        const { objectInfoTab } = this.state;
        if (["ADD", "CLONE"].includes(this.state.modalName) || (crManagement.actionType
            && (actionCode.UPDATE.itemId === crManagement.actionType.trim()
            || actionCode.APPROVE.itemId === crManagement.actionType.trim()
            || actionCode.ASSIGN_TO_CONSIDER.itemId === crManagement.actionType.trim()
            || actionCode.CHANGE_TO_CAB.itemId === crManagement.actionType.trim()
            || actionCode.ASSIGN_TO_CAB.itemId === crManagement.actionType.trim()
            || actionCode.CAB.itemId === crManagement.actionType.trim()
            || actionCode.SCHEDULE.itemId === crManagement.actionType.trim()
            || actionCode.EDIT_CR_BY_QLTD.itemId === crManagement.actionType.trim() ))) {
            if (objectInfoTab.earliestStartTime && objectInfoTab.earliestStartTime < new Date() && crManagement.crType !== "1") {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-earliestStartTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.earliestStartTime"));
                });
                return false;
            }

            if (objectInfoTab.latestStartTime && objectInfoTab.earliestStartTime && objectInfoTab.latestStartTime < objectInfoTab.earliestStartTime) {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-latestStartTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.lastestStartTime"));
                });
                return false;
            }

            if (objectInfoTab.disturbanceEndTime && objectInfoTab.disturbanceStartTime && objectInfoTab.disturbanceEndTime < objectInfoTab.disturbanceStartTime) {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-disturbanceEndTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.timeEffectServiceFrom"));
                });
                return false;
            }
            if (objectInfoTab.earliestStartTime && objectInfoTab.disturbanceStartTime && objectInfoTab.latestStartTime
                && objectInfoTab.disturbanceEndTime && (objectInfoTab.disturbanceStartTime < objectInfoTab.earliestStartTime || objectInfoTab.disturbanceEndTime > objectInfoTab.latestStartTime)) {
                this.setState({
                    tabIndex: 0
                }, () => {
                    document.getElementById("custom-disturbanceStartTime").focus();
                    toastr.warning(this.props.t("crManagement:crManagement.message.error.disturbanceInDatecr"));
                });
                return false;
            }
        }
        return true;
    }
    
    onChangeTab = (tabIndex) => {
        this.setState({
            tabIndex
        });
    }

    handleOnChangeChildTab = (index, state, errors) => {
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
            default:
                break;
        }
    }

    setStateToParentState = (index, state) => {
        switch (index) {
            case 0:
                this.setState({
                    objectInfoTab: state
                });
                break;
            default:
                break;
        }
    }

    handleOnChangeDataAlarmListTab = (data) => {
        this.stateChildModuleTab.fillDataList(data);
        this.stateChildVendorTab.fillDataList(data);
    }

    handleOnSave = (isHandleSave) => {
        this.setState({
            btnAddOrEditLoading: true,
            isHandleSave
        }, () => {
            this.stateChildInfoTab.onSubmitForm(0, true);
        });
    }

    setDataToObject = (object) => {
        const Constants = buildDataCbo("ACTION_RIGHT");
        const { objectInfoTab, isHandleSave } = this.state;
        object.isClickedNode = "1";
        object.isClickedNodeAffected = "1";
        object.actionRight = Constants.CAN_EDIT;
        object.title = objectInfoTab.dataInfoTab.title ? objectInfoTab.dataInfoTab.title.trim() : "";
        object.crId = objectInfoTab.selectedData.crId;
        object.actionType = objectInfoTab.selectValueActionGroup ? objectInfoTab.selectValueActionGroup.value : "";
        object.state = "1";
        if (this.state.modalName === "ADD" || this.state.modalName === "CLONE") {
            object.createdDate = new Date();
            object.crNumber = this.genCrNumber();
        }
        object.updateTime = new Date();
        object.description = objectInfoTab.dataInfoTab.description ? objectInfoTab.dataInfoTab.description.trim() : "";
        object.crType = objectInfoTab.selectValueCrType.value;
        object.subcategory = objectInfoTab.selectValueSubcategory.value;
        object.risk = objectInfoTab.selectValueRisk.value;
        object.impactSegment = objectInfoTab.selectValueImpactSegment.value;
        object.childImpactSegment = objectInfoTab.selectValueChildDomain.value;
        object.deviceType = objectInfoTab.selectValueDeviceType.value;
        object.priority = objectInfoTab.selectValuePriority.value;
        object.earliestStartTime = objectInfoTab.earliestStartTime;
        object.latestStartTime = objectInfoTab.latestStartTime;
        object.disturbanceStartTime = objectInfoTab.disturbanceStartTime;
        object.disturbanceEndTime = objectInfoTab.disturbanceEndTime;

        object.processTypeId = objectInfoTab.selectValueProcess.value;
        // dau viec cr
        object.processTypeLv3Id = objectInfoTab.selectValueCrWork.map(item => item.value).join(",");
        object.impactAffect = objectInfoTab.selectValueAffectedLevel.value;
        object.country = objectInfoTab.selectValueNation.value;
        object.circle = objectInfoTab.selectValueCircle.value;
        object.dutyType = objectInfoTab.selectValueImpactType.value;
        object.serviceAffecting = objectInfoTab.isAffected === "yes" ? "1" : "0";
        if (objectInfoTab.isAffected === "yes") {
            object.lstAffectedService = objectInfoTab.selectValueAffectedService.map(item => {return {affectedServiceId: item.value, crId: objectInfoTab.selectedData.crId, insertTime: convertDateToDDMMYYYYHHMISS(new Date())}});
            object.totalAffectedCustomers = objectInfoTab.dataInfoTab.totalAffectedCustomers ? objectInfoTab.dataInfoTab.totalAffectedCustomers.trim() : "";
            object.totalAffectedMinutes = objectInfoTab.dataInfoTab.totalAffectedMinutes ? objectInfoTab.dataInfoTab.totalAffectedMinutes.trim() : "";
        } else {
            object.lstAffectedService = null;
            object.totalAffectedCustomers = null;
            object.totalAffectedMinutes = null;
        }
        object.actionNotes = objectInfoTab.dataInfoTab.actionNotes ? objectInfoTab.dataInfoTab.actionNotes.trim() : "";
        // truongnt add new
        if (objectInfoTab.fieldsProperty.isConfirmAction.visible) {
            object.isConfirmAction = objectInfoTab.isConfirmAction ? "1" : "0";
        }

        const actionCode = buildDataCbo("ACTION_CODE");
        if (actionCode.UPDATE_CR_WHEN_RECEIVE_STD.itemId === object.actionType
                || actionCode.UPDATE_CR_WHEN_APPROVE_STD.itemId === object.actionType) {
            object.changeOrginator = objectInfoTab.selectedData.changeOrginator;
            object.changeOrginatorUnit = objectInfoTab.selectedData.changeOrginatorUnit;
        } else {
            object.changeOrginator = JSON.parse(localStorage.user).userID;
            object.changeOrginatorUnit = JSON.parse(localStorage.user).deptId;
        }

        object.changeResponsibleUnit = objectInfoTab.selectValueResponsibleUnit.value;
        object.changeResponsible = objectInfoTab.selectValueResponsible.value;
        object.userLogin = JSON.parse(localStorage.user).userID;
        object.userLoginUnit = JSON.parse(localStorage.user).deptId;

        object.lstNetworkNodeId = this.getNetworkNode();
        object.lstNetworkNodeIdAffected = this.getNetworkNodeAffected();
        object.lstAppDept = objectInfoTab.listApprovalDepartment.map(item => Object.assign(item, {crId: object.crId}));

        object.circleAdditionalInfo = objectInfoTab.dataInfoTab.circleAdditionalInfo ? objectInfoTab.dataInfoTab.circleAdditionalInfo.trim() : "";
        const crType = objectInfoTab.selectValueCrType.value;
        if (crType + "" === "1") {
            if (objectInfoTab.tracingCRCB) {
                object.isTracingCr = "1";
            } else {
                object.isTracingCr = "0";
            }
        }

        if (this.stateChildWorkOrderTab.state.data.length > 0) {
            object.listWoId = this.stateChildWorkOrderTab.state.data.map(item => item.woId).join(",");
        }

        if (this.state.modalName === "ADD" || this.state.modalName === "CLONE") {
            object.isLoadMop = (objectInfoTab.isLoadMop ? "2" : "0");
        }

        const crRelated = objectInfoTab.chooseCrRelated.crNumber;
        const related = objectInfoTab.selectValueRelatedCr.value;
        object.crRelatedCbb = objectInfoTab.selectValueRelatedCr.value;
        if (related === "4") {
            object.crTypeCat = related;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = null;
        } else if (related === "1") {
            object.crTypeCat = null;
            object.isPrimaryCr = "1";
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = null;
        } else if (related === "2") {
            object.crTypeCat = null;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = crRelated;
            object.relateToPreApprovedCr = null;
        } else if (related === "3") {
            object.crTypeCat = null;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = crRelated;
        } else {
            object.crTypeCat = null;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = null;
        }
        object.lstCrCreatedFromOtherSysDTO = this.getLstCrCreatedFromOtherSysDTO();
        if (this.props.isShowPopup && this.props.moduleName === "WO") {
            object.crCreatedFromOtherSysDTO = this.state.selectedData.crCreatedFromOtherSysDTO || {};
        }

        if (this.stateChildAlarmTab) {
            object.isClickedToAlarmTag = 1;
            object.lstAlarn = this.stateChildAlarmTab.state.data.map(item => {return {crId: objectInfoTab.selectedData.crId, code: item.faultId + "-" + item.nationCode}});
        }

        if (this.stateChildCableTab) {
            object.isClickedToCableTag = 1;
            object.lstCable = this.stateChildCableTab.state.laneTable.data.concat(this.stateChildCableTab.state.cableTable.data);
            object.lstLaneCable = this.stateChildCableTab.state.laneTable.data;
        }

        if (this.stateChildModuleTab) {
            object.isClickedToModuleTag = 1;
            object.lstModuleDetail = this.stateChildModuleTab.state.data;
        }

        if (this.stateChildVendorTab) {
            object.isClickedToVendorTag = 1;
            object.lstVendorDetail = this.stateChildVendorTab.state.data;
        }

        object.nodeSavingMode = buildDataCbo("CR_CONFIG").SAVING_NODE_WITH_FULL_INFO_MODE;

        // if (this.validateProcessFileObj != null && this.validateProcessFileObj.getValidateKey() != null && this.validateProcessFileObj.getProcessId() != null) {
        //     if (this.validateProcessFileObj.getProcessId().equals(crManagement.getProcessTypeId())) {
        //         crManagement.setvMSAValidateKey(this.validateProcessFileObj.getValidateKey());
        //         crManagement.setWaitingMopStatus("1");
        //     }
        // }

        // truongnt add
        if (isHandleSave === "SAVE_DRAFT") {
            object.state = "0";
            object.sentDate = null;
        } else {
            if (object.actionType + "" === "34") {
                object.state = "5";
            } else {
                object.state = "1";
                //Neu la mang acc ATTT thi bat buoc phai phe duyet
                if ("121" === object.impactSegment + "") {
                    // cRDetail.getIsApproveCr().setValue(Boolean.TRUE);
                    object.lstAppDept = [];
                    object.state = "5";
                } else {
                    //Neu tich chon khong can phe duyet CR
                    if (isHandleSave === "SEND_NOT_APPROVE") {
                        if (object.crType + "" !== "2") {
                            object.lstAppDept = [];
                            object.state = "2";
                        } else {
                            object.lstAppDept = [];
                            object.state = "5";
                        }
                    }
                }
            }
            object.sentDate = new Date();
        }
    }

    setDataToObjectForProcess = (object) => {
        // this.failedWoList.clear();
        const Constants = buildDataCbo("ACTION_RIGHT");
        const { objectInfoTab } = this.state;
        
        object.isClickedNode = "1";
        object.isClickedNodeAffected = "1";
        object.actionRight = objectInfoTab.actionRight;
        object.title = objectInfoTab.dataInfoTab.title ? objectInfoTab.dataInfoTab.title.trim() : "";
        object.actionType = objectInfoTab.selectValueActionGroup ? objectInfoTab.selectValueActionGroup.value : "";
        if (objectInfoTab.fieldsProperty.reasonType.visible) {
            object.actionReturnCodeId = objectInfoTab.selectValueReasonType.value || "";
        }
        object.createdDate = objectInfoTab.selectedData.createdDate;
        object.dutyType = objectInfoTab.selectValueImpactType.value;
        object.earliestStartTime = objectInfoTab.earliestStartTime;
        object.latestStartTime = objectInfoTab.latestStartTime;
        object.disturbanceStartTime = objectInfoTab.disturbanceStartTime;
        object.disturbanceEndTime = objectInfoTab.disturbanceEndTime;
        object.updateTime = new Date();
        object.actionNotes = objectInfoTab.dataInfoTab.actionNotes ? objectInfoTab.dataInfoTab.actionNotes.trim() : "";
        object.userLogin = JSON.parse(localStorage.user).userID;
        object.userLoginUnit = JSON.parse(localStorage.user).deptId;
        object.crId = objectInfoTab.selectedData.crId;
        object.crNumber = objectInfoTab.selectedData.crNumber;
        object.searchType = objectInfoTab.selectedData.searchType;
        object.activeWOControllSignal = objectInfoTab.selectedData.activeWOControllSignal;
        object.crType = objectInfoTab.selectedData.crType;
        object.risk = objectInfoTab.selectedData.risk;
        object.circleAdditionalInfo = objectInfoTab.dataInfoTab.circleAdditionalInfo ? objectInfoTab.dataInfoTab.circleAdditionalInfo.trim() : "";
        object.changeResponsibleUnit = objectInfoTab.selectedData.changeResponsibleUnit;
        object.changeResponsible = objectInfoTab.selectedData.changeResponsible;
        object.processTypeId = objectInfoTab.selectValueProcess.value;
        // dau viec cr
        object.processTypeLv3Id = objectInfoTab.selectValueCrWork.map(item => item.value).join(",");
        object.changeOrginatorUnit = objectInfoTab.selectedData.changeOrginatorUnit;
        object.vMSAValidateKey = objectInfoTab.selectedData.vMSAValidateKey;
        object.waitingMopStatus = objectInfoTab.selectedData.waitingMopStatus;
        object.serviceAffecting = objectInfoTab.isAffected === "yes" ? "1" : "0";
        if (objectInfoTab.isAffected === "yes") {
            object.lstAffectedService = objectInfoTab.selectValueAffectedService.map(item => {return {affectedServiceId: item.value, crId: objectInfoTab.selectedData.crId, insertTime: convertDateToDDMMYYYYHHMISS(new Date())}});
            object.totalAffectedCustomers = objectInfoTab.dataInfoTab.totalAffectedCustomers ? objectInfoTab.dataInfoTab.totalAffectedCustomers.trim() : "";
            object.totalAffectedMinutes = objectInfoTab.dataInfoTab.totalAffectedMinutes ? objectInfoTab.dataInfoTab.totalAffectedMinutes.trim() : "";
        } else {
            object.lstAffectedService = null;
            object.totalAffectedCustomers = null;
            object.totalAffectedMinutes = null;
        }

        if (this.stateChildWorkOrderTab.state.data.length > 0) {
            object.listWoId = this.stateChildWorkOrderTab.state.data.map(item => item.woId).join(",");
        }

        const crType = objectInfoTab.selectValueCrType.value;
        if (crType + "" === "1") {
            if (objectInfoTab.tracingCRCB) {
                object.isTracingCr = "1";
                const changeOrginator = object.changeOrginator;
                object.changeResponsible = changeOrginator;
            } else {
                object.isTracingCr = "0";
            }
        }

        // if (cRDetail.getCsslstFailedWo().isVisible()) {
        //     crManagement.setFailDueToFT("1");
        //     String woListArr = cRDetail.getLstFailedWo().getValue();
        //     if (woListArr != null && !woListArr.trim().isEmpty()) {
        //         String[] woIds = woListArr.trim().split(",");
        //         for (String id : woIds) {
        //             if (id != null && !id.trim().isEmpty()) {
        //                 this.failedWoList.add(id.trim();
        //             }
        //         }

        //     }
        // } else {
        //     crManagement.setFailDueToFT("0");
        // }

        object.failDueToFT = "0";

        object.isClickedToAlarmTag = 1;
        object.lstAlarn = this.stateChildAlarmTab.state.data.map(item => {return {crId: objectInfoTab.selectedData.crId, code: item.faultId + "-" + item.nationCode}});

        object.isClickedToModuleTag = 1;
        object.lstModuleDetail = this.stateChildModuleTab.state.data;

        object.isClickedToVendorTag = 1;
        object.lstVendorDetail = this.stateChildVendorTab.state.data;

        object.lstLaneCable = this.stateChildCableTab.state.laneTable.data;

        object.impactSegment = objectInfoTab.selectedData.impactSegment;
        const action = objectInfoTab.selectValueActionGroup ? objectInfoTab.selectValueActionGroup.value : "";
        const actionCode = buildDataCbo("ACTION_CODE");
        if (actionCode.CHANGE_CR_TYPE.itemId === action) {
            object.crType = objectInfoTab.selectValueCrType.value;
        } else if (actionCode.ASSIGN_TO_CONSIDER.itemId === action) {
            //kiem tra dau vao, giao tham dinh
            object.crType = objectInfoTab.selectedData.crType;
            object.considerUnitId = objectInfoTab.selectValueUnitConsider.value;
        } else if (actionCode.CHANGE_TO_CAB.itemId === action) {
            //kiem tra dau vao, chuyen CAB
            object.crType = objectInfoTab.selectedData.crType;
        } else if (actionCode.ASSIGN_TO_EMPLOYEE_APPRAISAL.itemId === action || actionCode.ASSIGN_EXC_TO_EMPLOYEE.itemId === action) {
            object.assignUserId = objectInfoTab.selectValueUserConsider.value;
            object.lstNetworkNodeId = this.getNetworkNode();
            object.lstNetworkNodeIdAffected = this.getNetworkNodeAffected();
        } else if (actionCode.SCHEDULE.itemId === action) {
            object.changeResponsibleUnit = objectInfoTab.selectValueResponsibleUnit.value;
            object.changeResponsible = objectInfoTab.selectValueResponsible.value;
            object.priority = objectInfoTab.selectValuePriority.value;
            object.processTypeId = objectInfoTab.selectValueProcess.value;
            if (objectInfoTab.fieldsProperty.checkCrAuto.visible) {
                object.autoExecute = objectInfoTab.checkCrAuto ? "1" : "0";
            }
        } else if (actionCode.APPRAISE.itemId === action) {
            //tham dinh, lay user cab du kien
            object.lstNetworkNodeId = this.getNetworkNode();
            object.lstNetworkNodeIdAffected = this.getNetworkNodeAffected();
        } else if (actionCode.ASSIGN_TO_CAB.itemId === action) {
            object.userCab = objectInfoTab.userCab.userCab;
        } else if (actionCode.CAB.itemId === action) {
            object.lstAffectedService = objectInfoTab.selectValueAffectedService.map(item => {return {affectedServiceId: item.value, crId: objectInfoTab.selectedData.crId, insertTime: convertDateToDDMMYYYYHHMISS(new Date())}});
        } else if (actionCode.EDIT_CR_BY_QLTD.itemId === action || actionCode.CHANGE_TO_SCHEDULE.itemId === action) {
            object.lstAffectedService = objectInfoTab.selectValueAffectedService.map(item => {return {affectedServiceId: item.value, crId: objectInfoTab.selectedData.crId, insertTime: convertDateToDDMMYYYYHHMISS(new Date())}});
            object.state = objectInfoTab.selectedData.state;
        } else if (actionCode.RESOLVE.itemId === action || actionCode.RESOLVE_APPROVE_STD.itemId === action) {
            object.crReturnResolve = objectInfoTab.selectValueReturnCode.value;
            object.processTypeId = objectInfoTab.selectValueProcess.value;
            if (objectInfoTab.fieldsProperty.reasonType.visible) {
                object.resolveReturnCode = objectInfoTab.selectValueReasonType.value || "";
            }
        } else if (actionCode.CLOSECR.itemId === action) {
            object.crReturnCodeId = objectInfoTab.selectValueReturnCode.value;
        }
        if (Constants.CAN_APPROVE_STANDARD === objectInfoTab.actionRight || Constants.CAN_APPROVE === objectInfoTab.actionRight) {
            object.crType = objectInfoTab.selectedData.crType;
        }
        // truongnt add new
        if (objectInfoTab.fieldsProperty.isConfirmAction.visible) {
            object.isConfirmAction = objectInfoTab.isConfirmAction ? "1" : "0";
        }

        const crRelated = objectInfoTab.chooseCrRelated.crNumber;
        const related = objectInfoTab.selectValueRelatedCr.value;
        object.crRelatedCbb = objectInfoTab.selectValueRelatedCr.value;
        if (related === "4") {
            object.crTypeCat = related;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = null;
        } else if (related === "1") {
            object.crTypeCat = null;
            object.isPrimaryCr = "1";
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = null;
        } else if (related === "2") {
            object.crTypeCat = null;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = crRelated;
            object.relateToPreApprovedCr = null;
        } else if (related === "3") {
            object.crTypeCat = null;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = crRelated;
        } else {
            object.crTypeCat = null;
            object.isPrimaryCr = null;
            object.relateToPrimaryCr = null;
            object.relateToPreApprovedCr = null;
        }
    }

    genCrNumber() {
        const crTypeLong = this.state.objectInfoTab.selectValueCrType.value + "";
        const crType = crTypeLong === "0" ? "NORMAL" : crTypeLong === "1" ? "EMERGENCY" : crTypeLong === "2" ? "STANDARD" : "";
        const crNumber = "CR_"
                + crType + "_"
                + this.state.objectInfoTab.selectValueImpactSegment.code + "_"
                + this.state.selectedData.crId;
        return crNumber.toUpperCase();
    }

    setVisibleButton = (save, saveDraft, duplicate, clone, assign, close) => {
        if (this.state.modalName !== "VIEW") {
            if (save !== null) {
                this.setState({
                    visibleButtonSave: save
                });
            }
            if (saveDraft !== null) {
                this.setState({
                    visibleButtonSaveDraft: saveDraft
                });
            }
            if (duplicate !== null) {
                this.setState({
                    visibleButtonDuplicate: duplicate
                });
            }
            if (clone !== null) {
                this.setState({
                    visibleButtonClone: clone
                });
            }
            if (assign !== null) {
                this.setState({
                    visibleButtonAssign: assign
                });
            }
            if (close !== null) {
                this.setState({
                    visibleButtonClose: close
                });
            }
        } else {
            this.setState({
                visibleButtonSave: false,
                visibleButtonSaveDraft: false,
                visibleButtonDuplicate: false,
                visibleButtonClone: true,
                visibleButtonAssign: false,
                visibleButtonClose: false
            });
        }
    }

    getNetworkNode = () => {
        const lst = [];
        for (const item of this.stateChildImpactNodeTab.state.data) {
            const data = {
                crId: this.state.selectedData.crId,
                deviceId: item.deviceId,
                ipId: item.ipId,
                ip: item.ip,
                deviceCode: item.deviceCode,
                deviceName: item.deviceName,
                nationCode: item.nationCode,
                insertTime: convertDateToDDMMYYYYHHMISS(new Date()),
                dtCode: item.dtCode,
            };
            lst.push(data);
        }
        return lst;
    }

    getNetworkNodeAffected = () => {
        const lst = [];
        for (const item of this.stateChildAffectedNodeTab.state.data) {
            const data = {
                crId: this.state.selectedData.crId,
                deviceId: item.deviceId,
                ipId: item.ipId,
                ip: item.ip,
                deviceCode: item.deviceCode,
                deviceName: item.deviceName,
                nationCode: item.nationCode,
                insertTime: convertDateToDDMMYYYYHHMISS(new Date()),
                dtCode: item.dtCode,
            };
            lst.push(data);
        }
        return lst;
    }

    getLstCrCreatedFromOtherSysDTO = () => {
        const lst = [];
        const strCode = this.state.objectInfoTab.sourceCreateCr.length > 0 ? this.state.objectInfoTab.sourceCreateCr.map(item => item.itemName) : [];
        for (let str of strCode) {
            if (str) {
                const dto = {};
                let id = "";
                try {
                    id = str.substring(str.lastIndexOf("_") + 1, str.length());
                } catch (error) {
                    
                }
                dto.objectId = id;
                dto.objectCode = str;
                if (str.startsWith("PT")) {
                    dto.systemId = "2";
                } else if (str.startsWith("TT")) {
                    dto.systemId = "3";
                } else if (str.startsWith("WO")) {
                    dto.systemId = "4";
                } else if (str.startsWith("(PT)")) {
                    dto.systemId = "2";
                } else if (str.startsWith("(TT)")) {
                    dto.systemId = "3";
                } else if (str.startsWith("(WO)")) {
                    dto.systemId = "4";
                } else if (str.startsWith("GNOC_TT")) {
                    dto.systemId = "3";
                } else if (str.startsWith("GNOC_PT")) {
                    dto.systemId = "2";
                } else if (str.startsWith("GNOC_WO")) {
                    dto.systemId = "4";
                } else if (str.includes("TT")) {
                    dto.systemId = "3";
                } else if (str.includes("WO")) {
                    dto.systemId = "4";
                } else if (str.includes("PT")) {
                    dto.systemId = "2";
                } else if (str.includes("SR") || str.startsWith("GNOC_SR")) {
                    dto.systemId = "5";
                } else if (str.includes("RR") || str.startsWith("RISK")) {
                    dto.systemId = "7";
                } else {
                    dto.systemId = "6";
                }
                lst.push(dto);
            }
        }
        return lst;
    }

    openDuplicatePopup = () => {
        const object = Object.assign({}, this.state.selectedData);
        this.setDataToObject(object);
        object.lstNetworkNodeId = [];
        this.setState({
            checkDuplicateDto: object,
            isOpenPopupDuplicate: true
        });
    }

    closeDuplicatePopup = () => {
        this.setState({
            isOpenPopupDuplicate: false,
            checkDuplicateDto: {}
        });
    }

    openAssignPopup = () => {
        this.setState({
            isOpenPopupAssign: true
        });
    }

    closeAssignPopup = () => {
        this.setState({
            isOpenPopupAssign: false
        });
    }

    openCrAddEditPopup = () => {
        this.props.actions.getSequenseCr("cr_seq", 1).then((response) => {
            this.setState({
                isOpenPopupCrAddEdit: true,
                modalName: "CLONE"
            }, () => {
                this.stateChildInfoTab.setSelectedData(Object.assign(this.state.selectedData, { crId: response.payload.data[0], actionRight: "1", searchType: this.state.selectedData.searchType }));
            });
        });
    }

    closeCrAddEditPopup = () => {
        this.setState({
            isOpenPopupCrAddEdit: false,
            modalName: this.props.parentState.modalName
        }, () => {
            this.stateChildInfoTab.setSelectedData(Object.assign({}, this.state.selectedData, { crId: this.state.selectedData.crNumber.split("_")[3] }));
        });
    }

    render() {
        const { t } = this.props;
        const { visibleButtonSave, visibleButtonSaveDraft, visibleButtonDuplicate, visibleButtonClone, titleUpdate, visibleButtonAssign, visibleButtonClose } = this.state;
        return (
            <Card>
                <CustomSticky isNotSticky={this.props.isShowPopup}>
                    <CardHeader>
                        <i className={["ADD", "CLONE"].includes(this.state.modalName) ? "fa fa-plus-circle" : "fa fa-" + titleUpdate.icon}></i>
                        <span>{["ADD", "CLONE"].includes(this.state.modalName) ? t("crManagement:crManagement.title.addNewCr") : titleUpdate.title}</span>
                        <div className="card-header-actions card-header-actions-button">
                            {
                                (["ADD", "CLONE"].includes(this.state.modalName) || (this.state.selectedData.state + "" === "0" && this.state.selectedData.actionRight === "1")) ? 
                                <span>
                                    <LaddaButton type="button"
                                        className={visibleButtonSave ? "btn btn-primary btn-md mr-1" : "class-hidden"}
                                        loading={this.state.isHandleSave === "SEND_APPROVE" ? this.state.btnAddOrEditLoading : false}
                                        data-style={ZOOM_OUT}
                                        onClick={() => this.handleOnSave("SEND_APPROVE")}>
                                        <i className="fa fa-send"></i> {t("crManagement:crManagement.button.sendApprove")}
                                    </LaddaButton>{' '}
                                    <LaddaButton type="button"
                                        className={visibleButtonSave ? "btn btn-primary btn-md mr-1" : "class-hidden"}
                                        loading={this.state.isHandleSave === "SEND_NOT_APPROVE" ? this.state.btnAddOrEditLoading : false}
                                        data-style={ZOOM_OUT}
                                        onClick={() => this.handleOnSave("SEND_NOT_APPROVE")}>
                                        <i className="fa fa-send"></i> {t("crManagement:crManagement.button.sendNotApprove")}
                                    </LaddaButton>{' '}
                                    <LaddaButton type="button"
                                        className={visibleButtonSaveDraft ? "btn btn-primary btn-md mr-1" : "class-hidden"}
                                        loading={this.state.isHandleSave === "SAVE_DRAFT" ? this.state.btnAddOrEditLoading : false}
                                        data-style={ZOOM_OUT}
                                        onClick={() => this.handleOnSave("SAVE_DRAFT")}>
                                        <i className="fa fa-save"></i> {t("crManagement:crManagement.button.saveCr")}
                                    </LaddaButton>{' '}
                                    <Button type="button" color="primary" onClick={this.openCrAddEditPopup} className={visibleButtonClone ? "mr-1" : "class-hidden"}><i className="fa fa-copy"></i> {t("crManagement:crManagement.button.clone")}</Button>
                                </span> :
                                <span>
                                    <LaddaButton type="button"
                                        className={visibleButtonSave ? "btn btn-primary btn-md mr-1" : "class-hidden"}
                                        loading={this.state.isHandleSave === "SAVE" ? this.state.btnAddOrEditLoading : false}
                                        data-style={ZOOM_OUT}
                                        onClick={() => this.handleOnSave("SAVE")}>
                                        <i className="fa fa-save"></i> {t("crManagement:crManagement.button.save")}
                                    </LaddaButton>
                                    <Button type="button" color="primary" onClick={this.openDuplicatePopup} className={visibleButtonDuplicate ? "mr-1" : "class-hidden"}><i className="fa fa-clone"></i> {t("crManagement:crManagement.button.checkDuplicate")}</Button>
                                    {/* <Button type="button" color="primary" onClick={() => {}} className={visibleButtonClose ? "mr-1" : "class-hidden"}><i className="fa fa-band"></i> {t("crManagement:crManagement.button.close")}</Button> */}
                                    <Button type="button" color="primary" onClick={this.openCrAddEditPopup} className={visibleButtonClone ? "mr-1" : "class-hidden"}><i className="fa fa-copy"></i> {t("crManagement:crManagement.button.clone")}</Button>
                                    <Button type="button" color="primary" onClick={this.openAssignPopup} className={visibleButtonAssign ? "mr-1" : "class-hidden"}><i className="fa fa-refresh"></i> {t("crManagement:crManagement.button.assign")}</Button>
                                </span>
                            }
                            <Button type="button" color="secondary" onClick={() => {this.props.isShowPopup ? this.props.closePopup() : this.props.closePage('EDIT', false)}}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                        </div>
                    </CardHeader>
                </CustomSticky>
                <Col xs="12" className={this.props.isShowPopup ? "class-card-body-show-popup" : ""}>
                    <Tabs style={{ paddingTop: '15px' }} selectedIndex={this.state.tabIndex} onSelect={this.onChangeTab}>
                        <TabList>
                            <Tab>{t("crManagement:crManagement.title.crInformation")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.unitApprove")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.attachment")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.history")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.impactNode")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.affectedNode")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.worklog")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.workOrder")}</Tab>
                            <Tab>{t("crManagement:crManagement.title.dependentCr")}</Tab>
                            {
                                (this.props.moduleName) ?
                                null : <Tab>{t("crManagement:crManagement.title.module")}</Tab>
                            }
                            {
                                (this.props.moduleName) ?
                                null : <Tab>{t("crManagement:crManagement.title.vendor")}</Tab>
                            }
                            {
                                (this.props.moduleName) ?
                                null : <Tab>{t("crManagement:crManagement.title.alarmList")}</Tab>
                            }
                            {
                                (this.props.moduleName) ?
                                null : <Tab>{t("crManagement:crManagement.title.cableLineImpact")}</Tab>
                            }
                        </TabList>
                        <TabPanel forceRender={true}>
                            <CrManagementCrInfoTab
                                onRef={ref => (this.stateChildInfoTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeChildTab={this.handleOnChangeChildTab}
                                onChangeVisibleButton={this.setVisibleButton}
                                setStateToParentState={this.setStateToParentState}
                                showToolbarGrid={this.setVisibleButtonTab}
                                parentComponent={this} />
                        </TabPanel>
                        <TabPanel>
                            <CrManagementUnitApproveTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <CrManagementAttachmentTab
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeTab={this.onChangeTab} />
                        </TabPanel>
                        <TabPanel>
                            <CrManagementHistoryTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <CrManagementImpactNodeTab
                                onRef={ref => (this.stateChildImpactNodeTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <CrManagementAffectedNodeTab
                                onRef={ref => (this.stateChildAffectedNodeTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel>
                            <CrManagementWorklogTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        <TabPanel forceRender={true}>
                            <CrManagementWorkOrderTab
                                onRef={ref => (this.stateChildWorkOrderTab = ref)}
                                closePage={this.props.closePage}
                                parentState={this.state}
                                onChangeTab={this.onChangeTab} />
                        </TabPanel>
                        <TabPanel>
                            <CrManagementDependentCrTab
                                closePage={this.props.closePage}
                                parentState={this.state} />
                        </TabPanel>
                        {
                            (this.props.moduleName) ?
                            null : <span>
                                <TabPanel forceRender={true}>
                                    <CrManagementModuleTab
                                        onRef={ref => (this.stateChildModuleTab = ref)}
                                        closePage={this.props.closePage}
                                        parentState={this.state}
                                        onChangeTab={this.onChangeTab} />
                                </TabPanel>
                                <TabPanel forceRender={true}>
                                    <CrManagementVendorTab
                                        onRef={ref => (this.stateChildVendorTab = ref)}
                                        closePage={this.props.closePage}
                                        parentState={this.state}
                                        onChangeTab={this.onChangeTab} />
                                </TabPanel>
                                <TabPanel forceRender={true}>
                                    <CrManagementAlarmListTab
                                        onRef={ref => (this.stateChildAlarmTab = ref)}
                                        closePage={this.props.closePage}
                                        parentState={this.state}
                                        onChangeData={this.handleOnChangeDataAlarmListTab}
                                        onChangeTab={this.onChangeTab} />
                                </TabPanel>
                                <TabPanel forceRender={true}>
                                    <CrManagementCableTab
                                        onRef={ref => (this.stateChildCableTab = ref)}
                                        closePage={this.props.closePage}
                                        parentState={this.state} />
                                </TabPanel>
                            </span>
                        }
                    </Tabs>
                </Col>
                <CrManagementCrDuplicatePopup
                    parentState={this.state}
                    closePopup={this.closeDuplicatePopup} />
                <CrManagementCrAssignPopup
                    parentState={this.state}
                    closePopup={this.closeAssignPopup}
                    closePage={this.props.closePage} />
                <CrManagementAddEditPopup
                    parentState={this.state}
                    closePopup={this.closeCrAddEditPopup}
                    closePage={this.props.closePage} />
            </Card>
        );
    }
}

CrManagementAddEdit.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    isShowPopup: PropTypes.bool,
    closePopup: PropTypes.func,
    moduleName: PropTypes.string
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementAddEdit));