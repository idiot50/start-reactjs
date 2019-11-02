import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as KedbManagementActions from './KedbManagementActions';
import * as ptProblemActions from '../../pt/problem/PtProblemActions';
import { CustomSelectLocal, CustomFroalaEditor, CustomRate, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { Dropzone, downloadFileLocal, convertModelFroalaEditor, convertDateToDDMMYYYYHHMISS, confirmAlertInfo } from "../../../containers/Utils/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class KedbManagementAddEdit extends Component {
    constructor(props) {
        super(props);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            kedbCode: props.parentState.selectedData.kedbCode,
            //Select
            modelDescription: "",
            modelRootCause: "",
            modelSolution: "",
            selectValueNodeType: {},
            selectValueKedbStateName: {},
            selectValueParentTypeName: {},
            selectValueTypeName: {},
            selectValueVendor: {},
            selectValueHandleUnit: {},
            selectValueSoftwareVersion: {},
            selectValueHardwareVersion: {},
            selectValueApproved: {},
            //
            softVersionList: [],
            hardVersionList: [],
            files: props.parentState.selectedData.listKedbFilesDTO ? props.parentState.selectedData.listKedbFilesDTO : [],
            filesCurrent: props.parentState.selectedData.listKedbFilesDTO ? props.parentState.selectedData.listKedbFilesDTO : [],
            idFileDelete: [],
            nodeTypeList: [],
            yourRating: props.parentState.selectedData.yourRating ? props.parentState.selectedData.yourRating : 0,
            averageRating: props.parentState.selectedData.averageRating ? props.parentState.selectedData.averageRating : 0,
            disabled: false,
            loopVersion: true,
            kedbStateList: [],
            unitCheckList: []
        };
    }
    
    componentDidMount() {
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3"); //Phan mang
        this.props.actions.getItemMaster("UNIT_CHECK_KEDB", "itemId", "itemName", "1", "3"); //Don vi phe duyet
        this.props.actions.getItemMaster("KEDB_STATE", "itemId", "itemName", "1", "3");  //Trang thai
        this.props.actions.getItemMaster("ARRAY_BHKN", "itemId", "itemName", "1", "3").then((response) => {
            if (this.props.isShowPopup) {
                for (const array of response.payload.data.data) {
                    if (array.itemCode === "KEDB") {
                        this.setState({
                            selectValueParentTypeName: { value: array.itemId },
                        });
                        break;
                    }
                }
            } else {
                if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "DETAIL") {
                    this.setState({
                        selectValueParentTypeName: { value: this.state.selectedData.parentTypeId }
                    });
                }
            }
        }); //Mang
        this.props.actions.getItemMaster("VENDOR", "itemId", "itemName", "1", "3");
        this.getListStatusNext();
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "DETAIL") {
            this.setState({
                selectValueTypeName: { value: this.state.selectedData.typeId },
                selectValueHandleUnit: { value: this.state.selectedData.unitCheckId, label: this.state.selectedData.unitCheckName },
                selectValueNodeType: { value: this.state.selectedData.subCategoryId },
                selectValueHardwareVersion: { value: this.state.selectedData.hardwareVersion, label: this.state.selectedData.hardwareVersion },
                selectValueKedbStateName: { value: this.state.selectedData.kedbState },
                selectValueSoftwareVersion: { value: this.state.selectedData.softwareVersion, label: this.state.selectedData.softwareVersion },
                selectValueVendor: { value: this.state.selectedData.vendor },
                modelDescription: this.state.selectedData.description ? this.state.selectedData.description : "",
                modelSolution: this.props.parentState.solution ? this.props.parentState.solution : this.state.selectedData.solution,
                modelRootCause: this.state.selectedData.rca ? this.state.selectedData.rca : ""
            }, () => {
                let nodeTypeList = [];
                this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
                    for (const obj of response.payload.data.data) {
                        if (obj.parentItemId === this.state.selectedData.typeId) {
                            nodeTypeList.push(obj);
                        }
                    }
                    this.setState({
                        nodeTypeList,
                    });

                });
            }
            )
        } else if (this.state.isAddOrEdit === "ADD") {
            this.setState({
                modelDescription: this.props.t("kedbManagement:kedbManagement.textEditorGuilde.description"),
                modelSolution: this.props.t("kedbManagement:kedbManagement.textEditorGuilde.solution"),
                modelRootCause: this.props.t("kedbManagement:kedbManagement.textEditorGuilde.reason"),
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.parentState.isAddOrEdit === "DETAIL") {
            this.setState({
                disabled: true
            });
        }
        if (this.props.isShowPopup) {
            this.getListStatusNext();
            if (this.state.loopVersion) {
                if (this.state.selectValueTypeName.value && this.state.selectValueNodeType.value) {
                    this.getUnitCheck();
                }
                if (this.state.selectValueVendor.value || this.state.selectValueNodeType.value) {
                    this.getDeviceType();
                    this.setState({
                        loopVersion: false
                    })
                } else {
                    this.setState({
                        loopVersion: false,
                        softVersionList: [],
                        hardVersionList: []
                    })
                }
            }
        }
    }

    componentDidUpdate() {
        if (this.state.loopVersion) {
            if (this.state.selectValueTypeName.value && this.state.selectValueNodeType.value) {
                this.getUnitCheck();
            }
            if (this.state.selectValueVendor.value || this.state.selectValueNodeType.value) {
                this.getDeviceType();
                this.setState({
                    loopVersion: false
                });
            } else {
                this.setState({
                    loopVersion: false,
                    softVersionList: [],
                    hardVersionList: []
                });
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });

    }

    getUnitCheck = () => {
        const object = {
            subCategoryId: this.state.selectValueNodeType.value,
            typeId : this.state.selectValueTypeName.value
        }
        this.props.actions.getListUnitCheckKedb(object).then((response) => {
            let resList = response.payload.data.filter(item => item !== null);
            let unitCheckList = [];
            for (const res of resList) {
                unitCheckList.push({itemId: res.unitId, itemName: res.unitName + " (" + res.unitCode + ")" })
            }
            this.setState({
                unitCheckList
            });
        });
    }

    getDeviceType = () => {
        let softVersionList = [];
        let hardVersionList = [];
        let objectVersion = {
            vendorId: this.state.selectValueVendor.value,
            typeId : this.state.selectValueNodeType.value
        }
        this.props.actions.getListDeviceVersion(objectVersion).then((response) => {
            for (const obj of response.payload.data) {
                if(!softVersionList.find((e) => e.itemId === obj.softwareVersion)) {
                    softVersionList.push({ itemId: obj.softwareVersion, itemName: obj.softwareVersion });
                }
                if(!hardVersionList.find((e) => e.itemId === obj.hardwareVersion)) {
                    hardVersionList.push({ itemId: obj.hardwareVersion, itemName: obj.hardwareVersion });
                }
            }
            this.setState({
                softVersionList,
                hardVersionList,
            });
        });
    }

    getListStatusNext = () => {
        const kedbStateList = (this.props.response.common.kedbState && this.props.response.common.kedbState.payload) ? this.props.response.common.kedbState.payload.data.data : [];
        let stateList = [];
        if (this.state.isAddOrEdit === "EDIT") {
            let kedbOpen = null;
            let kedbCreateApprove = null;
            let kedbUpdateApprove = null;
            let kedbClosed = null;
            let kedbCanceled = null;
            let stateCode = ""
            for (const state of kedbStateList) {
                if (state.itemId + "" === this.state.selectedData.kedbState + "") {
                    stateCode = state.itemCode;
                }
                switch (state.itemCode) {
                    case "KEDB_OPEN":
                        kedbOpen = state;
                        break;
                    case "KEDB_CREATE_APPROVE":
                        kedbCreateApprove = state;
                        break;
                    case "KEDB_UPDATE_APPROVE":
                        kedbUpdateApprove = state;
                        break;
                    case "KEDB_CLOSED":
                        kedbClosed = state;
                        break;
                    case "KEDB_CANCELED":
                        kedbCanceled = state;
                        break;
                    default: break;
                }
            }
            switch (stateCode) {
                case "KEDB_OPEN":
                    stateList = [kedbOpen, kedbCreateApprove, kedbCanceled];
                    break;
                case "KEDB_CREATE_APPROVE":
                    stateList = [kedbCreateApprove, kedbClosed, kedbCanceled];
                    break;
                case "KEDB_UPDATE_APPROVE": case "KEDB_CLOSED":
                    stateList = [kedbUpdateApprove, kedbClosed, kedbCanceled];
                    break;
                case "KEDB_CANCELED":
                    stateList = [kedbCanceled];
                    break;
                default: break;
            }
        } else {
            stateList = kedbStateList;
        }
        this.setState({
            kedbStateList: stateList
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: this.state.isAddOrEdit === "ADD" ? false : true
        }, () => {
            // phân quyền
            const userRolesList =  JSON.parse(localStorage.user).rolesList.map(function(item) {
                return item['roleCode'];
            });
            const stateCode = this.state.selectValueKedbStateName.itemCode;
            if (!userRolesList.includes("ADMIN_KEDB") && !userRolesList.includes("SUB_ADMIN_KEDB") && !userRolesList.includes("USER_KEDB")) {
                toastr.warning(this.props.t("kedbManagement:kedbManagement.message.error.authority"));
                this.setState({ btnAddOrEditLoading: false });
                return;
            }
            // else {
            //     if (this.state.isAddOrEdit === "EDIT") {
            //         if (userRolesList.includes("USER_KEDB") && !userRolesList.includes("ADMIN_KEDB") && !userRolesList.includes("SUB_ADMIN_KEDB")) {
            //             if (this.state.selectedData.createUserId !== JSON.parse(localStorage.user).userID) {
            //                 toastr.warning(this.props.t("kedbManagement:kedbManagement.message.error.authority"));
            //                 this.setState({ btnAddOrEditLoading: false });
            //                 return;
            //             }
            //         }
            //     }
            // }
            if (stateCode === "KEDB_CANCELED" || stateCode === "KEDB_CLOSED") {
                if (!userRolesList.includes("ADMIN_KEDB") && !userRolesList.includes("SUB_ADMIN_KEDB")) {
                    if (JSON.parse(localStorage.user).deptId + "" !== this.state.selectValueHandleUnit.value + "" ) {
                        toastr.warning(this.props.t("kedbManagement:kedbManagement.message.error.authority"));
                        this.setState({ btnAddOrEditLoading: false });
                        return;
                    }
                }
            }
            const kedbManagement = values;
            kedbManagement.kedbName = kedbManagement.kedbName.trim();
            kedbManagement.typeId = this.state.selectValueTypeName ? this.state.selectValueTypeName.value : null;
            kedbManagement.parentTypeId = this.state.selectValueParentTypeName ? this.state.selectValueParentTypeName.value : null;
            kedbManagement.subCategoryId = this.state.selectValueNodeType ? this.state.selectValueNodeType.value : null;
            kedbManagement.vendor = this.state.selectValueVendor ? this.state.selectValueVendor.value.toString() : null;
            kedbManagement.kedbState = this.state.selectValueKedbStateName.value;
            kedbManagement.ptTtRelated = kedbManagement.ptTtRelated ? kedbManagement.ptTtRelated.trim() : "";
            kedbManagement.softwareVersion = this.state.selectValueSoftwareVersion ? this.state.selectValueSoftwareVersion.label: null;
            kedbManagement.hardwareVersion = this.state.selectValueHardwareVersion ? this.state.selectValueHardwareVersion.label : null;
            kedbManagement.unitCheckId = this.state.selectValueHandleUnit ? this.state.selectValueHandleUnit.value : null;
            kedbManagement.unitCheckName = this.state.selectValueHandleUnit ? this.state.selectValueHandleUnit.label : null;
            kedbManagement.description = convertModelFroalaEditor(this.state.modelDescription);
            kedbManagement.createUserName = kedbManagement.createUserName.trim();
            kedbManagement.rca = convertModelFroalaEditor(this.state.modelRootCause);
            kedbManagement.solution = convertModelFroalaEditor(this.state.modelSolution);
            const comments = kedbManagement.newComment ? JSON.parse(localStorage.user).userName + "_" + convertDateToDDMMYYYYHHMISS(new Date()) + "_" + kedbManagement.newComment.trim() + "\n" : "";
            kedbManagement.comments = this.state.selectedData.comments ? comments + this.state.selectedData.comments : comments;
            delete kedbManagement.newComment;
            if (this.state.isAddOrEdit === "ADD") {
                confirmAlertInfo(this.props.t("kedbManagement:kedbManagement.message.confirmAdd"),
                this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
                () => {
                    this.setState({
                        btnAddOrEditLoading: true
                    }, () => {
                        if (this.props.isShowPopup) {
                            let problemsDTO = {...this.props.parentState.ptProblem};
                            problemsDTO.problemsDTOOld = this.props.parentState.ptProblem;
                            kedbManagement.problemsDTO = problemsDTO;
                        }
                        this.props.actions.addKedbManagement(this.state.files, kedbManagement).then((response) => {
                            if (response.payload.data.key === "SUCCESS") {
                                this.setState({
                                    btnAddOrEditLoading: false
                                }, () => {
                                    this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                                    if (this.props.isShowPopup) {
                                        this.props.actions.getListKedb({ page: 1, pageSize: 1, kedbCode: response.payload.data.object.kedbCode }).then((response) => {
                                            const data = response.payload.data.data;
                                            this.props.setDataTableFromKedb(data);
                                        });
                                    }
                                    toastr.success(this.props.t("kedbManagement:kedbManagement.message.success.add"));
                                });
                            } else if (response.payload.data.key === "ERROR") {
                                this.setState({
                                    btnAddOrEditLoading: false
                                }, () => {
                                    toastr.error(response.payload.data.message);
                                });
                            } else {
                                this.setState({
                                    btnAddOrEditLoading: false
                                }, () => {
                                    toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.add"));
                                });
                            }
                        }).catch((response) => {
                            this.setState({
                                btnAddOrEditLoading: false
                            }, () => {
                                try {
                                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                                } catch (error) {
                                    toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.add"));
                                }
                            });
                        });
                    });
                }, () => {
                    this.setState({
                        btnAddOrEditLoading: false
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                kedbManagement.completer = kedbManagement.completer ? kedbManagement.completer.trim() : "";
                kedbManagement.kedbId = this.state.selectedData.kedbId;
                kedbManagement.yourRating = this.state.yourRating ? this.state.yourRating : 1;
                kedbManagement.idFileDelete = this.state.idFileDelete;
                kedbManagement.kedbStateBeforeUpdate = this.state.selectedData.kedbState;
                kedbManagement.createdTime = this.state.selectedData.createdTime;
                kedbManagement.createUserId = this.state.selectedData.createUserId;
                kedbManagement.kedbRatingDTO = {point: this.state.yourRating, note: "WEB GNOC"};
                if (this.props.isShowPopup) {
                    kedbManagement.problemsDTO = this.props.parentState.ptProblem;
                }
                this.props.actions.editKedbManagement(this.state.files, kedbManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            if (this.props.isShowPopup) {
                                this.props.actions.getListKedb({ page: 1, pageSize: 1, kedbCode: this.state.selectedData.kedbCode }).then((response) => {
                                    const data = response.payload.data.data;
                                    this.props.setDataTableFromKedb(data);
                                });
                            }
                            toastr.success(this.props.t("kedbManagement:kedbManagement.message.success.edit"));
                        });
                    } else if (response.payload.data.key === "NOT_ACCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.authority"));
                        });
                    } else if (response.payload.data.key === "ERROR" || response.payload.data.key === "NO_CAN_DELETE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.filePermission"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.edit"));
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
                            toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.edit"));
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

    handleItemSelectChangeHardwareVersion = (option) => {
        this.setState({
            selectValueHardwareVersion: option
        })
    }

    handleItemSelectChangeKedbStateName = (option) => {
        this.setState({
            selectValueKedbStateName: option
        })
    }

    handleItemSelectChangeNodeType = (option) => {
        this.setState({
            selectValueNodeType: option,
            loopVersion: true,
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {},
            selectValueHandleUnit: {},
            unitCheckList: []
        })
    }
    handleItemSelectChangeHandleUnit = (option) => {
        this.setState({
            selectValueHandleUnit: option
        })
    }

    handleItemSelectChangeParentTypeName = (option) => {
        this.setState({
            selectValueParentTypeName: option
        })
    }

    handleItemSelectChangeSoftwareVersion = (option) => {
        this.setState({
            selectValueSoftwareVersion: option
        })
    }
    handleItemSelectAverageRating = (rate) => {
        this.setState({
            averageRating: rate
        })
    }
    handleItemSelectYourRating = (rate) => {
        this.setState({
            yourRating: rate
        })
    }

    handleItemSelectChangeTypeName = (option) => {
        this.setState({
            selectValueTypeName: option,
            loopVersion: true,
            selectValueNodeType: {},
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {},
            selectValueHandleUnit: {},
            unitCheckList: []
        })
        if (option.value) {
            let nodeTypeList = [];
            this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
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
                nodeTypeList: []
            });
        }
    }

    handleItemSelectChangeVendor = (option) => {
        this.setState({
            selectValueVendor: option,
            loopVersion: true,
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {}
        })
    }

    handleModelChangeDescription = (modal) => {
        this.setState({ modelDescription: modal })
    }

    handleModelChangeRootCause = (modal) => {
        this.setState({ modelRootCause: modal })
    }

    handleModelChangeSolution = (modal) => {
        this.setState({ modelSolution: modal })
    }

    downloadFile(item) {
        this.props.actions.downloadKedbFiles({kedbFileName: item.kedbFileName, createTime: item.createTime}).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

    handleModelChangeDescription = (modal) => {
        this.setState({
            modelDescription: modal
        })
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.path === item.path)) {
                const arr = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rar', 'zip', '7z', 'jpg', 'gif', 'png', 'bmp', 'sql']
                if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if (item.size <= 40894464) {
                        item.kedbFileName = item.name;
                        this.setState({ files: [...this.state.files, item] });
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
        if (this.state.filesCurrent.indexOf(item) >= 0) {
            this.setState({
                idFileDelete: [...this.state.idFileDelete, item.kedbFileId]
            });
        }
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    roundNumber(num) {
        return (num % 1 !== 0 && num.toString().split(".")[1].length > 2) ? num.toFixed(2) : num;
    }

    render() {
        const { files, disabled, nodeTypeList, softVersionList, hardVersionList } = this.state;
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "DETAIL") ? this.state.selectedData : {};
        if (this.state.isAddOrEdit === "ADD") {
            let temp = JSON.parse(localStorage.getItem("user"))
            objectAddOrEdit.createUserName = temp.userName;
        }
        const typeNameList = (response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : [];
        const parentTypeNameList = (response.common.arrayBhkn && response.common.arrayBhkn.payload) ? response.common.arrayBhkn.payload.data.data : [];
        const vendorList = (response.common.vendor && response.common.vendor.payload) ? response.common.vendor.payload.data.data : [];
        objectAddOrEdit.ptTtRelated = objectAddOrEdit.ptTtRelated ? objectAddOrEdit.ptTtRelated : "";
        if(this.props.parentState.isAddOrEdit === "ADD") {
            objectAddOrEdit.ptTtRelated = (this.props.parentState.ptProblem && this.props.parentState.ptProblem.problemCode) ? this.props.parentState.ptProblem.problemCode : "";
        }
        objectAddOrEdit.completer = objectAddOrEdit.completer ? objectAddOrEdit.completer : "";
        objectAddOrEdit.comments = objectAddOrEdit.comments ? objectAddOrEdit.comments : "";
        objectAddOrEdit.averageRating = objectAddOrEdit.averageRating ? objectAddOrEdit.averageRating : "";
        objectAddOrEdit.yourRating = objectAddOrEdit.yourRating ? objectAddOrEdit.yourRating : "";
        objectAddOrEdit.unitCheckId = objectAddOrEdit.unitCheckId ? objectAddOrEdit.unitCheckId : "";
        const numLike = (objectAddOrEdit.numLike && objectAddOrEdit.averageRating) ? " (" + this.roundNumber(objectAddOrEdit.averageRating) + "/" + objectAddOrEdit.numLike + ")" : "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky isNotSticky={this.props.isShowPopup}>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD") ? "fa fa-plus-circle" : this.state.isAddOrEdit === "DETAIL" ? "" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD") ? t("kedbManagement:kedbManagement.title.kedbManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("kedbManagement:kedbManagement.title.kedbManagementEdit") : t("kedbManagement:kedbManagement.title.information")}
                                        <div className="card-header-actions card-header-actions-button">
                                            {this.state.isAddOrEdit === "DETAIL" ? "" :
                                                <LaddaButton type="submit"
                                                    className="btn btn-primary btn-md mr-1"
                                                    loading={this.state.btnAddOrEditLoading}
                                                    data-style={ZOOM_OUT}>
                                                    <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                                                </LaddaButton>
                                            }
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody className={this.props.isShowPopup ? "class-card-body-show-popup" : ""}>
                                        {this.state.isAddOrEdit === "ADD" ? <div>
                                            <Row>
                                                <Col xs="8" sm="8">
                                                    <CustomAvField name="kedbName" label={t("kedbManagement:kedbManagement.label.kedbName")} placeholder={t("kedbManagement:kedbManagement.placeholder.kedbName")}
                                                        required autoFocus maxLength="500"
                                                        validate={{ required: { value: true, errorMessage: t("kedbManagement:kedbManagement.message.required.kedbName") } }}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"parentTypeId"}
                                                        label={t("kedbManagement:kedbManagement.label.parentTypeName")}
                                                        isMulti={false}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.parentTypeName')}
                                                        options={parentTypeNameList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeParentTypeName}
                                                        selectValue={this.state.selectValueParentTypeName}
                                                        isDisabled={this.props.isShowPopup}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"typeId"}
                                                        label={t("kedbManagement:kedbManagement.label.typeName")}
                                                        isMulti={false}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.typeName')}
                                                        options={typeNameList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeTypeName}
                                                        selectValue={this.state.selectValueTypeName}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"subCategoryId"}
                                                        label={t("kedbManagement:kedbManagement.label.nodeType")}
                                                        isMulti={false}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.nodeType')}
                                                        options={nodeTypeList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeNodeType}
                                                        selectValue={this.state.selectValueNodeType}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"vendor"}
                                                        label={t("kedbManagement:kedbManagement.label.vendor")}
                                                        isMulti={false}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.vendor')}
                                                        options={vendorList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeVendor}
                                                        selectValue={this.state.selectValueVendor}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"kedbState"}
                                                        label={t("kedbManagement:kedbManagement.label.status")}
                                                        isMulti={false}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.kedbState')}
                                                        options={this.state.kedbStateList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeKedbStateName}
                                                        selectValue={this.state.selectValueKedbStateName}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="createUserName" label={t("kedbManagement:kedbManagement.label.createUserName")}
                                                        disabled={true}
                                                        placeholder={t("kedbManagement:kedbManagement.placeholder.createUserName")}
                                                        validate={{ required: { value: true, errorMessage: t("kedbManagement:kedbManagement.message.required.createUserName") } }}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="ptTtRelated" label={t("kedbManagement:kedbManagement.label.createdByPt")} placeholder={t("kedbManagement:kedbManagement.placeholder.createdByPt")}
                                                        disabled={this.props.isShowPopup} maxLength="500"
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"softwareVersion"}
                                                        label={t("kedbManagement:kedbManagement.label.softwareVersion")}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.softwareVersion')}
                                                        options={softVersionList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeSoftwareVersion}
                                                        selectValue={this.state.selectValueSoftwareVersion}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"hardwareVersion"}
                                                        label={t("kedbManagement:kedbManagement.label.hardwareVersion")}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.hardwareVersion')}
                                                        options={hardVersionList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeHardwareVersion}
                                                        selectValue={this.state.selectValueHardwareVersion}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"unitCheckId"}
                                                        label={t("kedbManagement:kedbManagement.label.handleUnit")}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.unitCheckId')}
                                                        options={this.state.unitCheckList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeHandleUnit}
                                                        selectValue={this.state.selectValueHandleUnit}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                            :
                                            <div>
                                                <Row>
                                                    <Col xs="8" sm="8">
                                                        <CustomAvField name="kedbName" label={t("kedbManagement:kedbManagement.label.kedbName")} placeholder={t("kedbManagement:kedbManagement.placeholder.kedbName")}
                                                            required autoFocus disabled={disabled} maxLength="500"
                                                            validate={{ required: { value: true, errorMessage: t("kedbManagement:kedbManagement.message.required.kedbName") } }}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="kedbCode" label={t("kedbManagement:kedbManagement.label.kedbCode")}
                                                            disabled={true}
                                                            value={this.state.kedbCode}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"parentTypeId"}
                                                            label={t("kedbManagement:kedbManagement.label.parentTypeName")}
                                                            isMulti={false}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.parentTypeName')}
                                                            isDisabled={this.props.isShowPopup || disabled}
                                                            options={parentTypeNameList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeParentTypeName}
                                                            selectValue={this.state.selectValueParentTypeName}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"typeId"}
                                                            label={t("kedbManagement:kedbManagement.label.typeName")}
                                                            isMulti={false}
                                                            isDisabled={disabled}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.typeName')}
                                                            options={typeNameList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeTypeName}
                                                            selectValue={this.state.selectValueTypeName}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"subCategoryId"}
                                                            label={t("kedbManagement:kedbManagement.label.nodeType")}
                                                            isMulti={false}
                                                            isDisabled={disabled}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.nodeType')}
                                                            options={nodeTypeList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeNodeType}
                                                            selectValue={this.state.selectValueNodeType}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"kedbState"}
                                                            label={t("kedbManagement:kedbManagement.label.status")}
                                                            isMulti={false}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.kedbState')}
                                                            options={this.state.kedbStateList}
                                                            isDisabled={disabled}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeKedbStateName}
                                                            selectValue={this.state.selectValueKedbStateName}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="createUserName" label={t("kedbManagement:kedbManagement.label.createUserName")}
                                                            disabled={true}
                                                            placeholder={t("kedbManagement:kedbManagement.placeholder.createUserName")}
                                                            validate={{ required: { value: true, errorMessage: t("kedbManagement:kedbManagement.message.required.createUserName") } }}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"vendor"}
                                                            label={t("kedbManagement:kedbManagement.label.vendor")}
                                                            isMulti={false}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.vendor')}
                                                            options={vendorList}
                                                            isDisabled={disabled}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeVendor}
                                                            selectValue={this.state.selectValueVendor}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"hardwareVersion"}
                                                            label={t("kedbManagement:kedbManagement.label.hardwareVersion")}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.hardwareVersion')}
                                                            options={hardVersionList}
                                                            isDisabled={disabled}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeHardwareVersion}
                                                            selectValue={this.state.selectValueHardwareVersion}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"softwareVersion"}
                                                            label={t("kedbManagement:kedbManagement.label.softwareVersion")}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.softwareVersion')}
                                                            isDisabled={disabled}
                                                            options={softVersionList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeSoftwareVersion}
                                                            selectValue={this.state.selectValueSoftwareVersion}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="2">
                                                        <CustomRate
                                                            name={"averageRating"}
                                                            label={t("kedbManagement:kedbManagement.label.averageRate") + numLike}
                                                            value={Math.round(this.state.averageRating*2)/2}
                                                            isDisabled={true}
                                                            handleChange={this.handleItemSelectAverageRating}
                                                            isRequired={false}
                                                            allowHalf={true}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="2">
                                                        <CustomRate
                                                            name={"yourRating"}
                                                            label={t("kedbManagement:kedbManagement.label.rate")}
                                                            value={this.state.yourRating}
                                                            isDisabled={disabled}
                                                            handleChange={this.handleItemSelectYourRating}
                                                            isRequired={false}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="completer"
                                                            label={t("kedbManagement:kedbManagement.label.staff")}
                                                            disabled={true}
                                                            placeholder={t("kedbManagement:kedbManagement.placeholder.staff")} />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="ptTtRelated" label={t("kedbManagement:kedbManagement.label.createdByPt")} placeholder={t("kedbManagement:kedbManagement.placeholder.createdByPt")}
                                                            disabled={disabled || this.props.isShowPopup} maxLength="500"
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"unitCheckId"}
                                                            label={t("kedbManagement:kedbManagement.label.handleUnit")}
                                                            isRequired={true}
                                                            messageRequire={t('kedbManagement:kedbManagement.message.required.unitCheckId')}
                                                            isDisabled={disabled}
                                                            options={this.state.unitCheckList}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeHandleUnit}
                                                            selectValue={this.state.selectValueHandleUnit}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>}
                                        {this.props.parentState.isAddOrEdit === 'DETAIL' ? <Row>
                                            <Col xs="12" sm="12">
                                                <CustomFroalaEditor
                                                    name="description"
                                                    label={t("kedbManagement:kedbManagement.label.description")}
                                                    isRequired={true}
                                                    messageRequire={t('kedbManagement:kedbManagement.message.required.description')}
                                                    isDisabled={true}
                                                    model={this.state.modelDescription}
                                                    handleModelChange={this.handleModelChangeDescription}
                                                    placeholder={t("kedbManagement:kedbManagement.placeholder.description")} />
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <CustomFroalaEditor
                                                    name="rca"
                                                    label={t("kedbManagement:kedbManagement.label.rootCause")}
                                                    isRequired={true}
                                                    messageRequire={t('kedbManagement:kedbManagement.message.required.rootCause')}
                                                    isDisabled={true}
                                                    model={this.state.modelRootCause}
                                                    handleModelChange={this.handleModelChangeRootCause}
                                                    placeholder={t("kedbManagement:kedbManagement.placeholder.rootCause")} />
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <CustomFroalaEditor
                                                    name="solution"
                                                    label={t("kedbManagement:kedbManagement.label.solution")}
                                                    isRequired={true}
                                                    messageRequire={t('kedbManagement:kedbManagement.message.required.solution')}
                                                    isDisabled={true}
                                                    model={this.state.modelSolution}
                                                    handleModelChange={this.handleModelChangeSolution}
                                                    placeholder={t("kedbManagement:kedbManagement.placeholder.solution")} />
                                            </Col>
                                        </Row> : <Row>
                                                <Col xs="12" sm="12">
                                                    <CustomFroalaEditor
                                                        name="description"
                                                        label={t("kedbManagement:kedbManagement.label.description")}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.description')}
                                                        model={this.state.modelDescription}
                                                        handleModelChange={this.handleModelChangeDescription}
                                                        placeholder={t("kedbManagement:kedbManagement.placeholder.description")} />
                                                </Col>
                                                <Col xs="12" sm="12">
                                                    <CustomFroalaEditor
                                                        name="rca"
                                                        label={t("kedbManagement:kedbManagement.label.rootCause")}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.rootCause')}
                                                        model={this.state.modelRootCause}
                                                        handleModelChange={this.handleModelChangeRootCause}
                                                        placeholder={t("kedbManagement:kedbManagement.placeholder.rootCause")} />
                                                </Col>
                                                <Col xs="12" sm="12">
                                                    <CustomFroalaEditor
                                                        name="solution"
                                                        label={t("kedbManagement:kedbManagement.label.solution")}
                                                        isRequired={true}
                                                        messageRequire={t('kedbManagement:kedbManagement.message.required.solution')}
                                                        model={this.state.modelSolution}
                                                        handleModelChange={this.handleModelChangeSolution}
                                                        placeholder={t("kedbManagement:kedbManagement.placeholder.solution")} />
                                                </Col>
                                            </Row>}
                                        <Row>
                                            <Col xs="12" sm="12" md="12">
                                                <CustomAvField type="textarea"
                                                    rows="3" name="newComment"
                                                    disabled={disabled} maxLength="2000"
                                                    label={t("kedbManagement:kedbManagement.label.newComment")}
                                                />
                                            </Col>
                                            <Col xs="12" sm="12" md="12">
                                                <CustomAvField type="textarea" rows="3" name="comments" disabled={true} label={t("kedbManagement:kedbManagement.label.comment")}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Label style={{ fontWeight: 500 }}>{t("kedbManagement:kedbManagement.label.attachFile")}</Label>
                                            </Col>
                                            <Col xs="12" sm="12" className={disabled ? "class-hidden" : ""}>
                                                <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                    <ListGroup>
                                                        {files.map((item, index) => (
                                                            <ListGroupItem key={"item-" + index} style={{ height: '2.5em' }} className="d-flex align-items-center">
                                                                <span className={disabled ? "class-hidden" : "app-span-icon-table"} onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                                {item.kedbFileId ? <Button style={ disabled ? { marginLeft: '-1.5em' } : {}} color="link" onClick={() => this.downloadFile(item)}>{item.kedbFileName}</Button>
                                                                    : <Button color="link" onClick={() => downloadFileLocal(item)}>{item.kedbFileName}</Button>
                                                                }
                                                            </ListGroupItem>
                                                        ))}
                                                    </ListGroup>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

KedbManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    isShowPopup: PropTypes.bool,
    setDataTableFromKedb: PropTypes.func,
    reloadPage: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { kedbManagement, common } = state;
    return {
        response: { kedbManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, KedbManagementActions, ptProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(KedbManagementAddEdit));