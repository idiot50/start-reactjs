import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as WoTypeManagementActions from '../typeManagement/WoTypeManagementActions';
import * as WoCdGroupManagementActions from '../cdGroupManagement/WoCdGroupManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomDatePicker, CustomSelect, CustomInputPopup } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, Dropzone, downloadFileLocal, DropzoneTable } from '../../../containers/Utils/Utils';
import WoManagementAddCdGroupPopup from './WoManagementAddCdGroupPopup';
import WoManagementAddStationPopup from './WoManagementAddStationPopup';
import WoManagementAddWarehousePopup from './WoManagementAddWarehousePopup';
import _ from 'lodash';

class WoManagementAdd extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            isOpenCdGroupPopup: false,
            isOpenStationPopup: false,
            isOpenWarehousePopup: false,
            //AddOrEditModal
            modalName: props.parentState.modalName,
            selectedData: props.parentState.selectedData,
            mapConfigProperty: props.parentState.mapConfigProperty,
            //Table
            cdGroupList: [],
            columns: this.buildTableColumns(),
            columnsFileAttach: this.buildTableColumnsFileAttach(),
            //Select
            selectValueWorkOrderObject: {},
            selectValueWoType: {},
            selectValueWoTypeGroup: {},
            selectValuePriority: {},
            selectValueContract: {},
            selectValueConstruction: {},
            selectValueProcessAction: {},
            startTime: null,
            endTime: null,
            files: [],
            dataFileAttach: [],
            dataChecked: [],
            fieldsProperty: this.buildDefaultFields(),
            stationCode: {},
            wareHouse: {},
            constructionList: [],
            actionSourceList: [],
            actionList: [],
            isGetConstract: false,
            isGetConstruction: false,
            contractList: []
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.startTime) {
            this.setState({ startTime: newProps.parentState.startTime });
        }
        if (newProps.parentState.endTime) {
            this.setState({ endTime: newProps.parentState.endTime });
        }
    }

    componentDidMount() {
        this.getListCombobox();
        if (["EDIT", "COPY"].includes(this.state.modalName)) {
            this.setDefaultValue();
            this.checkVisibleControl(this.state.selectedData);
            // if (this.state.modalName === "EDIT") {
            //     this.props.actions.getListFileFromWo(this.state.selectedData.woId).then((response) => {
            //         const data = response.payload.data || [];
            //         this.setState({
            //             files: data
            //         });
            //     });
            // }
            if (this.state.selectedData.cdId) {
                this.props.actions.getDetailWoCdGroupManagement(this.state.selectedData.cdId).then((response) => {
                    const data = response.payload.data;
                    this.setState({
                        cdGroupList: [data]
                    });
                });
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isGetConstruction) {
            if (this.state.stationCode.stationCode) {
                this.props.actions.getConstructionListNation(this.state.stationCode.stationCode).then((response) => {
                    const data = response.payload.data || [];
                    this.setState({
                        constructionList: data.map(item => {return {itemId: item.constrtCode, itemName: item.constrtCode}})
                    });
                });
            }
            this.setState({
                isGetConstruction: false
            });
        }
        if (this.state.isGetConstract) {
            if (this.state.selectValueConstruction.value) {
                this.props.actions.getListContractFromConstrNation(this.state.selectValueConstruction.value).then((response) => {
                    const data = response.payload.data || [];
                    this.setState({
                        contractList: data.map(item => {return {itemId: item.contractId, itemName: item.code, itemValue: item.partnerName}})
                    });
                });
            }
            this.setState({
                isGetConstract: false
            });
        }
    }

    getListCombobox = () => {
        this.props.actions.getItemMaster("WO_GROUP_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getPriorityByWoTypeId("");
        this.getListWoType();
        this.props.actions.getListWoSystemInsertWeb();
        this.props.actions.getListWoKttsAction("ACTION").then((response) => {
            const data = response.payload.data || [];
            this.setState({
                actionList: data.map(item => {return {itemId: item.itemId, itemName: item.itemName, itemValue: item.parentItemId}})
            });
        });
        this.props.actions.getListWoKttsAction("ACTION_SOURCE").then((response) => {
            this.setState({
                actionSourceList: response.payload.data || []
            });
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
            stationCode: {
                required: false, disable: false, visible: false
            },
            warehouseCode: {
                required: false, disable: false, visible: false, label: "wareHouseCode"
            },
            contract: {
                required: false, disable: false, visible: false
            },
            construction: {
                required: false, disable: false, visible: false
            },
            processAction: {
                required: false, disable: false, visible: false
            },
            contractId: {
                required: false, disable: false, visible: false
            },
            processSource: {
                required: false, disable: false, visible: false
            }
        }
    }

    checkVisibleControl(selectedData) {
        const fieldsProperty = this.buildDefaultFields();
        // let checkCDUCTT = false;
        // if (this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS")
        //         && (selectedData.status === 1 || selectedData.status === 3 || selectedData.status === 0)) {
        //     if (this.checkUserIsCd(JSON.parse(localStorage.user).userName)) {
        //         checkCDUCTT = true;
        //     }
        // }
        // if ((this.state.modalName === "EDIT" && checkCDUCTT) || ["ADD", "COPY"].includes(this.state.modalName)) {
            // truongnt add new
            if (this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS")) {
                fieldsProperty.warehouseCode.visible = true;
                fieldsProperty.stationCode.visible = true;
            }
            // truongnt add new
            if (this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.HC")
                || this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.THUHOI")) {
                fieldsProperty.warehouseCode.label = "wareHouseCode2";
            } else if (this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.NC")
                    || this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.NC.UCTT")) {
                fieldsProperty.warehouseCode.visible = true;
                fieldsProperty.stationCode.visible = true;
                fieldsProperty.construction.visible = true;
                fieldsProperty.processAction.visible = true;
                fieldsProperty.processSource.visible = true;
            } else if (this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.NC.THUE")
                    || this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.NC.UCTT.THUE")) {
                fieldsProperty.warehouseCode.visible = true;
                fieldsProperty.stationCode.visible = true;
                fieldsProperty.construction.visible = true;
                fieldsProperty.processAction.visible = true;
                fieldsProperty.processSource.visible = true;
                fieldsProperty.contract.visible = true;
                fieldsProperty.contractId.visible = true;
            }
            // else if (this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.DC.HC")
            //         || this.checkExistProperty(selectedData.woTypeId, "WO.TYPE.CHECK.QLTS.DC.NC")) {
            //     fieldsProperty.warehouseCode.visible = false;
            // }
            this.setState({
                fieldsProperty
            });
        // }
    }

    // checkUserIsCd(userName) {
    //     let checkUserCD = false;
    //     if (this.state.cdList && this.state.cdList.length > 0) {
    //         for (const eCdInGroup of this.state.cdList) {
    //             if (eCdInGroup.username === userName) {
    //                 checkUserCD = true;
    //                 break;
    //             }
    //         }
    //     }
    //     return checkUserCD;
    // }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woGroupCode" />,
                id: "woGroupCode",
                accessor: d => <span title={d.woGroupCode}>{d.woGroupCode}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woGroupName" />,
                id: "woGroupName",
                accessor: d => <span title={d.woGroupName}>{d.woGroupName}</span>
            }
        ];
    }

    buildTableColumnsFileAttach() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.fileName" />,
                id: "fileName",
                minWidth: 300,
                Cell: ({ original }) => {
                    const woType = this.state.dataFileAttach.find(item => item.cfgFileCreateWoId === original.cfgFileCreateWoId) || {};
                    const files = woType.file || [];
                    return (
                        <Row>
                            <Col xs="12" sm="12" style={{ display: 'inherit' }}>
                                <input type="text" id={"selectFile" + original.cfgFileCreateWoId} style={{ opacity: '0', filter: 'alpha(opacity=0)', width: '0', height: '0' }} />
                                <DropzoneTable onDrop={(acceptedFiles) => this.handleDropWoType(acceptedFiles, original)} className="pb-2" />
                                {files.map((item, index) => (
                                    <div key={"item-" + index} style={{ marginLeft: '1.5em' }}>
                                        <span className="app-span-icon-table" onClick={() => this.removeFileWoType(original)}><i className="fa fa-times-circle"></i></span>
                                        <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    );
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.required" />,
                id: "required",
                minWidth: 150,
                accessor: d => {
                    return d.required ?
                    <span title={this.props.t("woManagement:woManagement.dropdown.required.required")}>{this.props.t("woManagement:woManagement.dropdown.required.required")}</span> :
                    <span title={this.props.t("woManagement:woManagement.dropdown.required.notRequired")}>{this.props.t("woManagement:woManagement.dropdown.required.notRequired")}</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.content" />,
                id: "fileName",
                minWidth: 200,
                accessor: d => <span title={d.fileName}>{d.fileName}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.action" />,
                id: "download",
                minWidth: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("woManagement:woManagement.button.download")}>
                            <Button type="button" size="sm" className="btn-info icon mr-1" onClick={() => this.downloadFileCreate(d)}><i className="fa fa-download"></i></Button>
                        </span>
                    </div>;
                    return html;
                }
            }
        ];
    }

    downloadFileCreate = (d) => {
        this.props.actions.downloadFileCreate(d.cfgFileCreateWoId).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("woManagement:woManagement.message.error.downloadFile"));
        });
    }

    downloadFile = (d) => {
        this.props.actions.downloadWoFile(this.state.selectedData.woId, d.fileName).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("woManagement:woManagement.message.error.downloadFile"));
        });
    }

    setDefaultValue = () => {
        const { selectedData } = this.state;
        this.setState({
            startTime: selectedData.startTime ? new Date(selectedData.startTime) : null,
            endTime: selectedData.endTime ? new Date(selectedData.endTime) : null,
            selectValueWoTypeGroup: selectedData.woTypeGroupId ? {value: selectedData.woTypeGroupId} : {},
            selectValueWoType: selectedData.woTypeId ? {value: selectedData.woTypeId} : {},
            selectValueWorkOrderObject: selectedData.woSystem ? {value: selectedData.woSystem} : {},
            selectValuePriority: selectedData.priorityId ? {value: selectedData.priorityId} : {},
            stationCode: {stationCode: selectedData.stationCode, longitude: selectedData.longitude, latitude: selectedData.latitude},
            wareHouse: {code: selectedData.warehouseCode},
            selectValueConstruction: selectedData.constructionCode ? {value: selectedData.constructionCode} : {},
            selectValueProcessAction: selectedData.processActionId ? {value: selectedData.processActionId} : {},
            selectValueContract: selectedData.contractId ? {value: selectedData.contractId, label: selectedData.contractCode} : {},
            isGetConstract: true,
            isGetConstruction: true
        }, () => {
            this.getFileByWoType();
        });
    }

    setDataToObject(object, systemOther, systemOtherCode) {
        // set khi gọi từ hệ thống khác
        if (systemOther === null || systemOtherCode === null) {
            object.woSystem = this.state.selectValueWorkOrderObject.value || "";
        } else {
            object.woSystem = systemOther;
            object.woSystemId = systemOtherCode;
        }
        object.woContent = object.woContent ? object.woContent.trim() : "";
        object.woDescription = object.woDescription ? object.woDescription.trim() : "";
        object.woTypeId = this.state.selectValueWoType.value || "";
        object.startTime = this.state.startTime;
        object.endTime = this.state.endTime;
        object.planCode = object.planCode ? object.planCode.trim() : "";
        object.cdIdList = this.state.cdGroupList.map(item => item.woGroupId);
        object.priorityId = this.state.selectValuePriority.value || "";
        object.woDetailDTO = {accountIsdn: ""};
        object.fileName = this.state.files.filter(item => item.woId !== undefined).map(item => item.fileName).join(",");
        if (this.state.modalName === "EDIT") {
            object.woId = this.state.selectedData.woId;
        } else {
            object.createPersonId = JSON.parse(localStorage.user).userID;
        }
        // status 
        if (["ADD", "COPY"].includes(this.state.modalName)) {
            if (systemOther === "CR") {
                object.status = 7;
            } else {
                object.status = 0;
            }
        } else {
            if (this.state.selectedData.status === 2 && this.state.selectedData.ftId === null && this.state.selectedData.createPersonId === JSON.parse(localStorage.user).userID) {
                object.status = 0;
            } else {
                object.status = this.state.selectedData.status;
            }
        }

        // Construction
        object.constructionCode = this.state.selectValueConstruction.value || "";
        // station
        object.stationCode = this.state.stationCode.stationCode || "";
        // Warehouse code
        object.warehouseCode = this.state.wareHouse.code || "";
        // // Longitude
        object.longitude = this.state.stationCode.longitude || "";
        // Latitude
        object.longitude = this.state.stationCode.latitude || "";

        const woKTTSInfoDTO = {};
        if (this.state.modalName === "EDIT") {
            woKTTSInfoDTO.woId = this.state.selectedData.woId;
            woKTTSInfoDTO.contractId = this.state.selectValueContract.value;
            woKTTSInfoDTO.contractCode = this.state.selectValueContract.label;
            woKTTSInfoDTO.contractPartner = object.contractPartner ? object.contractPartner.trim() : "";
            woKTTSInfoDTO.processActionName = object.processActionName ? object.processActionName.trim() : "";
            woKTTSInfoDTO.processActionId = this.state.selectValueProcessAction.value;
        } else {
            if (this.checkExistProperty(object.woTypeId, "WO.TYPE.CHECK.QLTS")) {
                woKTTSInfoDTO.contractId = this.state.selectValueContract.value;
                woKTTSInfoDTO.contractCode = this.state.selectValueContract.label;
                woKTTSInfoDTO.contractPartner = object.contractPartner ? object.contractPartner.trim() : "";
                woKTTSInfoDTO.processActionName = object.processActionName ? object.processActionName.trim() : "";
                woKTTSInfoDTO.processActionId = this.state.selectValueProcessAction.value;
            }
        }
        object.woKTTSInfoDTO = woKTTSInfoDTO;
    }

    validateBeforeSubmit = (object) => {
        if (this.state.cdGroupList.length < 1) {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.cdGroup"));
            return false;
        }
        if (this.state.dataFileAttach.length > 0) {
            for (const item of this.state.dataFileAttach) {
                if (item.required === 1 && (!item.file || item.file.length === 0)) {
                    try {
                        document.getElementById("selectFile" + item.cfgFileCreateWoId).focus();
                    } catch (error) {
                        console.error(error);
                    }
                    toastr.warning(this.props.t("woManagement:woManagement.message.required.fileAttach"));
                    return false;
                }
            }
        }
        if (this.state.startTime < new Date()) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.dateNotLargeForNow"));
            return false;
        } else if (this.state.startTime > this.state.endTime) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.dateCompare"));
            return false;
        }
        return true;
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        const woManagement = Object.assign({}, this.state.modalName === "EDIT" ? this.state.selectedData : {}, values);
        if (this.props.isShowPopup && this.props.parentSource) {
            this.setDataToObject(woManagement, this.props.parentSource.woSystem, this.props.parentSource.woSystemId);
        } else {
            this.setDataToObject(woManagement, null, null);
        }
        const check = this.validateBeforeSubmit(woManagement);
        if (!check) return;
        const dataFile = _.cloneDeep(this.state.dataFileAttach);
        const filesCreate = [];
        let indexFile = 0;
        for (const data of dataFile) {
            if (data.file && data.file.length > 0) {
                filesCreate.push(data.file[0]);
                data.indexFile = indexFile;
                data.file = null;
                indexFile++;
            } else {
                data.indexFile = null;
            }
        }
        woManagement.cfgFileCreateWoDTOList = dataFile;
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.modalName === "ADD" || this.state.modalName === "COPY") {
                this.props.actions.addWoManagement(this.state.files, filesCreate, woManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            if (this.props.isShowPopup && this.props.parentSource) {
                                this.props.reloadDataGridParent();
                                this.props.closePopup();
                            } else {
                                this.props.closePage("ADD", true);
                            }
                            toastr.success(this.props.t("woManagement:woManagement.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else if (response.payload.data.key === "FILE_INVALID_FORMAT") {
                            toastr.error("File " + response.payload.data.message + this.props.t("woManagement:woManagement.message.error.invalidFomat"));
                        } else if (response.payload.data.key === "FILE_NOT_FOUND") {
                            toastr.error(this.props.t("woManagement:woManagement.message.error.downloadFile"));
                        } else {
                            toastr.error(this.props.t("woManagement:woManagement.message.error.add"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("woManagement:woManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.modalName === "EDIT") {
                this.props.actions.editWoManagement(this.state.files, filesCreate, woManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            if (this.props.isShowPopup && this.props.parentSource) {
                                this.props.reloadDataGridParent();
                                this.props.closePopup();
                            } else {
                                this.props.closePage("EDIT", true);
                            }
                            toastr.success(this.props.t("woManagement:woManagement.message.success.update"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else if (response.payload.data.key === "FILE_INVALID_FORMAT") {
                            toastr.error("File " + response.payload.data.message + this.props.t("woManagement:woManagement.message.error.invalidFomat"));
                        } else if (response.payload.data.key === "FILE_NOT_FOUND") {
                            toastr.error(this.props.t("woManagement:woManagement.message.error.downloadFile"));
                        } else {
                            toastr.error(this.props.t("woManagement:woManagement.message.error.update"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("woManagement:woManagement.message.error.update"));
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

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.path === item.path)) {
                const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        item.fileName = item.name;
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

    handleDropWoType = (acceptedFiles, original) => {
        const arr = ['xls','xlsx'];
        if(arr.includes(acceptedFiles[0].name.split('.').pop().toLowerCase())) {
            if(acceptedFiles[0].size <= 40894464) {
                acceptedFiles[0].fileName = acceptedFiles[0].name;
                const dataFileAttach = [...this.state.dataFileAttach];
                const index = dataFileAttach.findIndex(item => item.cfgFileCreateWoId === original.cfgFileCreateWoId);
                const data = dataFileAttach.find(item => item.cfgFileCreateWoId === original.cfgFileCreateWoId) || {};
                dataFileAttach.splice(index, 1, Object.assign(data, {file: [acceptedFiles[0]]}));
                this.setState({
                    dataFileAttach
                });
            } else {
                toastr.warning(this.props.t("common:common.message.error.fileSize"));
            }
        } else {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.onlyUsedExcel"));
        }
    }

    removeFileWoType(original) {
        const dataFileAttach = [...this.state.dataFileAttach];
        const index = dataFileAttach.findIndex(item => item.cfgFileCreateWoId === original.cfgFileCreateWoId);
        const data = dataFileAttach.find(item => item.cfgFileCreateWoId === original.cfgFileCreateWoId) || {};
        dataFileAttach.splice(index, 1, Object.assign(data, {file: []}));
        this.setState({
            dataFileAttach
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

    setValueCdGroup = (dataChecked) => {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.cdGroupList.some(el => el.woGroupCode === element.woGroupCode)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            cdGroupList: [...this.state.cdGroupList, ...dataChecked]
        }, () => {
            if (!this.state.selectValueWoType.value) {
                this.getListWoType();
            }
        });
    }

    openWarehousePopup = () => {
        this.setState({
            isOpenWarehousePopup: true
        });
    }

    closeWarehousePopup = () => {
        this.setState({
            isOpenWarehousePopup: false
        });
    }

    setValueWarehouse = (dataChecked) => {
        this.setState({
            wareHouse: dataChecked[0]
        });
    }

    openStationPopup = () => {
        this.setState({
            isOpenStationPopup: true
        });
    }

    closeStationPopup = () => {
        this.setState({
            isOpenStationPopup: false
        });
    }

    setValueStation = (dataChecked) => {
        this.setState({
            stationCode: dataChecked[0],
            selectValueConstruction: {},
            constructionList: [],
            isGetConstruction: true
        });
    }

    removeCdGroup = () => {
        const dataChecked = [...this.state.dataChecked];
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.cdGroupList];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.woGroupCode !== element.woGroupCode);
        });
        this.setState({
            cdGroupList: listTemp,
            dataChecked: []
        });
    }

    handleItemSelectChangeWoType = (option) => {
        this.setState({
            selectValueWoType: option
        }, () => {
            this.checkVisibleControl({woTypeId: option.value});
            this.getFileByWoType();
            this.handleGetTimeProcess();
        });
    }

    handleItemSelectChangeStartTime = (d) => {
        this.setState({
            startTime: d
        }, () => {
            this.handleGetTimeProcess();
        });
    }

    handleGetTimeProcess = () => {
        if (this.state.selectValueWoType.value && this.state.startTime) {
            // cau hinh thoi gian thuc hien wo
            // this.props.actions.getListWoTypeTimeDTO({woTypeId: this.state.selectValueWoType.value}).then((response) => {
            //     const lstTime = response.payload.data || [];
            //     if (lstTime.length > 0) {
            //         const woTypeTimeDTO = lstTime[0];
            //         if (woTypeTimeDTO.duration !== null) {
            //             let stDate = this.state.startTime;
            //             const duration = woTypeTimeDTO.duration * 24 * 60 * 60 * 1000;
            //             if (woTypeTimeDTO.isImmediate === 1 && (stDate.getHours() > 17 || (stDate.getHours() === 17 && stDate.getMinutes() >= 30))) {
            //                 const tomorow = new Date(stDate.getTime() + 24 * 60 * 60 * 1000);
            //                 stDate = new Date(tomorow.getFullYear(), tomorow.getMonth() + 1, tomorow.getDate(), 8, 0, 0);
            //             }
            //             const enDate = new Date(stDate.getTime() + duration);
            //             this.setState({
            //                 endTime: enDate
            //             });
            //         }
            //     }
            // });

            this.props.actions.getDetailWoTypeManagement(this.state.selectValueWoType.value).then((response) => {
                const data = response.payload.data || {};
                if (data.processTime !== null) {
                    let stDate = this.state.startTime;
                    const duration = data.processTime * 24 * 60 * 60 * 1000;
                    if (stDate.getHours() > 17 || (stDate.getHours() === 17 && stDate.getMinutes() >= 30)) {
                        const tomorow = new Date(stDate.getTime() + 24 * 60 * 60 * 1000);
                        stDate = new Date(tomorow.getFullYear(), tomorow.getMonth(), tomorow.getDate(), 8, 0, 0);
                    }
                    const enDate = new Date(stDate.getTime() + duration);
                    this.setState({
                        endTime: enDate
                    });
                }
            });
        }
    }

    getFileByWoType = () => {
        // if (this.state.modalName !== "EDIT") {
            this.props.actions.getDetailWoTypeManagement(this.state.selectValueWoType.value).then((response) => {
                const data = response.payload.data || {};
                if (data.cfgFileCreateWoDTOList !== null && data.cfgFileCreateWoDTOList.length > 0) {
                    this.setState({
                        dataFileAttach: data.cfgFileCreateWoDTOList
                    });
                } else {
                    this.setState({
                        dataFileAttach: []
                    });
                }
            }).catch((response) => {
                this.setState({
                    dataFileAttach: []
                });
            });
        // }
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
        const data = { enableCreate: 1 };
        if (this.state.selectValueWoTypeGroup.value) {
            data.woGroupType = this.state.selectValueWoTypeGroup.value;
            if (this.state.selectValueWoTypeGroup.code === "OTHER") {
                data.woGroupType = -1;
            }
        }
        if (this.state.cdGroupList && this.state.cdGroupList.length > 0) {
            data.lstCdGroup = this.state.cdGroupList.map(item => item.woGroupId);
        }
        this.props.actions.getListWoTypeDTO(data);
    }

    render() {
        const { t, response } = this.props;
        const { fieldsProperty } = this.state;
        const { cdGroupList, columns, files, columnsFileAttach, dataFileAttach, selectedData, constructionList, actionSourceList, actionList, contractList } = this.state;
        const woGroupType = (response.common.woGroupType && response.common.woGroupType.payload) ? response.common.woGroupType.payload.data.data : [];
        const woSystemList = (response.woManagement.getListWoSystem && response.woManagement.getListWoSystem.payload) ? response.woManagement.getListWoSystem.payload.data : [];
        const priorityList = (response.woManagement.getPriorityByWoType && response.woManagement.getPriorityByWoType.payload) ? response.woManagement.getPriorityByWoType.payload.data : [];
        const woTypeList = (response.woManagement.getListWoTypeDTO && response.woManagement.getListWoTypeDTO.payload) ? response.woManagement.getListWoTypeDTO.payload.data : [];
        let objectAddOrEdit = {};
        if (["COPY", "EDIT"].includes(this.state.modalName)) {
            objectAddOrEdit.woContent = selectedData.woContent || "";
            objectAddOrEdit.woDescription = selectedData.woDescription || "";
            objectAddOrEdit.planCode = selectedData.planCode || "";
            objectAddOrEdit.contractId = selectedData.contractId || "";
            objectAddOrEdit.processSource = selectedData.processSource || "";
            objectAddOrEdit.stationCode = selectedData.stationCode || "";
            objectAddOrEdit.warehouseCode = selectedData.warehouseCode || "";
            objectAddOrEdit.woSystem = selectedData.woSystem || "";
            objectAddOrEdit.processActionName = selectedData.processActionName || "";
            objectAddOrEdit.contractPartner = selectedData.contractPartner || "";
        }
        let processActionName = {};
        if (actionSourceList.length > 0 && this.state.selectValueProcessAction.value) {
            processActionName = actionSourceList.find(item => item.itemId === this.state.selectValueProcessAction.subValue) || {};
        }
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky isNotSticky={this.props.isShowPopup}>
                                    <CardHeader>
                                        <i className={["ADD", "COPY"].includes(this.state.modalName) ? "fa fa-plus-circle" : "fa fa-edit"}></i>
                                        {["ADD", "COPY"].includes(this.state.modalName) ? t("woManagement:woManagement.title.woManagementAdd") : t("woManagement:woManagement.title.woManagementUpdate")}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {t("common:common.button.save")}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={() => {this.props.isShowPopup ? this.props.closePopup() : this.props.closePage("ADD", false)}}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <CardBody className={this.props.isShowPopup ? "class-card-body-show-popup" : ""}>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <CustomAvField name="woContent" label={t("woManagement:woManagement.label.woName")} autoFocus
                                                placeholder={t("woManagement:woManagement.placeholder.woName")} required maxLength="1000"
                                                validate={{ required: { value: true, errorMessage: t("woManagement:woManagement.message.required.woName") } }} />
                                        </Col>
                                        <Col xs="12" sm="12">
                                            <CustomAvField type="textarea" rows="3" name="woDescription" label={t("woManagement:woManagement.label.workDescription")}
                                                placeholder={t("woManagement:woManagement.placeholder.workDescription")} maxLength="1000" />
                                        </Col>
                                    </Row>
                                    <Card>
                                        <CardHeader>{t("woManagement:woManagement.title.performWorkOrderInfo")}</CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    {!(this.props.isShowPopup && this.props.parentSource) ?
                                                    <CustomSelectLocal
                                                        name={"woSystem"}
                                                        label={t("woManagement:woManagement.label.workOrderObject")}
                                                        isRequired={true}
                                                        messageRequire={t("woManagement:woManagement.message.required.workOrderObject")}
                                                        options={woSystemList.map(item => {return {itemId: item.itemCode, itemName: item.itemName}})}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueWorkOrderObject: d })}
                                                        selectValue={this.state.selectValueWorkOrderObject}
                                                    />
                                                     :
                                                    <CustomAvField name="woSystem" value={this.props.parentSource.woSystem} label={t("woManagement:woManagement.label.workOrderObject")} required disabled />
                                                    }
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"woTypeGroupId"}
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
                                                        name={"woTypeId"}
                                                        label={t("woManagement:woManagement.label.woType")}
                                                        isRequired={true}
                                                        messageRequire={t("woManagement:woManagement.message.required.woType")}
                                                        options={woTypeList.map(item => {return {itemId: item.woTypeId, itemName: item.woTypeName, itemCode: item.woTypeCode}})}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeWoType}
                                                        selectValue={this.state.selectValueWoType}
                                                    />
                                                    {/* <CustomSelect
                                                        name={"woTypeId"}
                                                        label={t("woManagement:woManagement.label.woType")}
                                                        isRequired={true}
                                                        messageRequire={t("woManagement:woManagement.message.required.woType")}
                                                        moduleName={"GNOC_WO_TYPE_FOR_WO"}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeWoType}
                                                        selectValue={this.state.selectValueWoType}
                                                        parentValue={(this.state.selectValueWoTypeGroup && this.state.selectValueWoTypeGroup.value) ? this.state.selectValueWoTypeGroup.value : ""}
                                                    /> */}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomDatePicker
                                                        name={"startTime"}
                                                        label={t("woManagement:woManagement.label.startTimeAdd")}
                                                        isRequired={true}
                                                        messageRequire={t("woManagement:woManagement.message.required.startTimeAdd")}
                                                        selected={this.state.startTime}
                                                        handleOnChange={this.handleItemSelectChangeStartTime}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        showTimeSelect={true}
                                                        timeFormat="HH:mm:ss"
                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomDatePicker
                                                        name={"endTime"}
                                                        label={t("woManagement:woManagement.label.endTimeAdd")}
                                                        isRequired={true}
                                                        messageRequire={t("woManagement:woManagement.message.required.endTimeAdd")}
                                                        selected={this.state.endTime}
                                                        handleOnChange={(d) => this.setState({ endTime: d })}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        showTimeSelect={true}
                                                        timeFormat="HH:mm:ss"
                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"priorityId"}
                                                        label={t("woManagement:woManagement.label.priority")}
                                                        isRequired={true}
                                                        messageRequire={t("woManagement:woManagement.message.required.priority")}
                                                        options={priorityList.map(item => {return {itemId: item.priorityId, itemName: item.priorityName}})}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValuePriority: d })}
                                                        selectValue={this.state.selectValuePriority}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="12">
                                                    <Card>
                                                        <CardHeader>
                                                            <div style={{ float: 'left' }}>
                                                                <span style={{ position: 'absolute' }} className="mt-1">
                                                                    {t("woManagement:woManagement.label.cdGroup")}<span className="text-danger">{" (*)"}</span>
                                                                </span>
                                                            </div>
                                                            <div className="card-header-actions card-header-search-actions-button">
                                                                <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={this.openCdGroupPopup} title={t("common:common.button.additional")}><i className="fa fa-plus"></i></Button>
                                                                <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={this.removeCdGroup} title={t("common:common.button.discard")}><i className="fa fa-close"></i></Button>
                                                            </div>
                                                        </CardHeader>
                                                        <CustomReactTableLocal
                                                            columns={columns}
                                                            data={cdGroupList}
                                                            isCheckbox={true}
                                                            loading={false}
                                                            propsCheckbox={[]}
                                                            defaultPageSize={3}
                                                            handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                                                        />
                                                    </Card>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="12">
                                                    <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                                </Col>
                                                <Col xs="12" sm="12">
                                                    <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                        <ListGroup>
                                                            {files.map((item, index) => (
                                                                <ListGroupItem key={"item-" + index} style={{height: '2.5em'}} className="d-flex align-items-center">
                                                                    <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                                    {item.woId ? <Button color="link" onClick={() => this.downloadFile(item)}>{item.fileName}</Button>
                                                                    : <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                                                    }
                                                                </ListGroupItem>
                                                            ))}
                                                        </ListGroup>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '6px' }}>
                                                <Col xs="12" sm="4" className={fieldsProperty.stationCode.visible ? "" : "class-hidden"}>
                                                    <CustomInputPopup
                                                        name={"stationCode"}
                                                        label={t("woManagement:woManagement.label.stationAndLineCode")}
                                                        placeholder={t("woManagement:woManagement.placeholder.doubleClick")}
                                                        value={this.state.stationCode.stationCode || ""}
                                                        handleRemove={() => this.setState({ stationCode: {}, constructionList: [], selectValueConstruction: {}, contractList: [], selectValueContract: {} })}
                                                        handleDoubleClick={this.openStationPopup}
                                                        isRequired={fieldsProperty.stationCode.visible}
                                                        messageRequire={t("woManagement:woManagement.message.required.stationAndLineCode")}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4" className={fieldsProperty.construction.visible ? "" : "class-hidden"}>
                                                    <CustomSelectLocal
                                                        name={"constructionCode"}
                                                        label={t("woManagement:woManagement.label.construction")}
                                                        isRequired={fieldsProperty.construction.visible}
                                                        messageRequire={t("woManagement:woManagement.message.required.construction")}
                                                        options={constructionList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueConstruction: d, selectValueContract: {}, contractList: [], isGetConstract: true })}
                                                        selectValue={this.state.selectValueConstruction}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4" className={fieldsProperty.contract.visible ? "" : "class-hidden"}>
                                                    <CustomSelectLocal
                                                        name={"contractId"}
                                                        label={t("woManagement:woManagement.label.contract")}
                                                        isRequired={fieldsProperty.contract.visible}
                                                        messageRequire={t("woManagement:woManagement.message.required.contract")}
                                                        options={contractList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueContract: d })}
                                                        selectValue={this.state.selectValueContract}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4" className={fieldsProperty.contractId.visible ? "" : "class-hidden"}>
                                                    <CustomAvField name="contractPartner" label={t("woManagement:woManagement.label.contractPartner")} disabled
                                                    value={this.state.selectValueContract.subValue || ""} />
                                                </Col>
                                                <Col xs="12" sm="4" className={fieldsProperty.processAction.visible ? "" : "class-hidden"}>
                                                    <CustomSelectLocal
                                                        name={"processActionId"}
                                                        label={t("woManagement:woManagement.label.processAction")}
                                                        isRequired={fieldsProperty.processAction.visible}
                                                        messageRequire={t("woManagement:woManagement.message.required.processAction")}
                                                        options={actionList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueProcessAction: d })}
                                                        selectValue={this.state.selectValueProcessAction}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4" className={fieldsProperty.processSource.visible ? "" : "class-hidden"}>
                                                    <CustomAvField name="processActionName" label={t("woManagement:woManagement.label.processSource")} disabled
                                                    value={processActionName.itemName || ""} />
                                                </Col>
                                                <Col xs="12" sm="4" className={fieldsProperty.warehouseCode.visible ? "" : "class-hidden"}>
                                                    <CustomInputPopup
                                                        name={"warehouseCode"}
                                                        label={t("woManagement:woManagement.label." + fieldsProperty.warehouseCode.label)}
                                                        placeholder={t("woManagement:woManagement.placeholder.doubleClick")}
                                                        value={this.state.wareHouse.code || ""}
                                                        handleRemove={() => this.setState({ wareHouse: {} })}
                                                        handleDoubleClick={this.openWarehousePopup}
                                                        isRequired={fieldsProperty.warehouseCode.visible}
                                                        messageRequire={t("woManagement:woManagement.message.required." + fieldsProperty.warehouseCode.label)}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="planCode" label={t("woManagement:woManagement.label.planCode")}
                                                        placeholder={t("woManagement:woManagement.placeholder.planCode")} maxLength="1000" />
                                                </Col>
                                            </Row>
                                            <Row className={dataFileAttach.length < 1 ? "class-hidden" : ""}>
                                                <Col xs="12" sm="12">
                                                    <Card>
                                                        <CardHeader>
                                                            {t("woManagement:woManagement.title.fileOfType")}
                                                        </CardHeader>
                                                        <CustomReactTableLocal
                                                            columns={columnsFileAttach}
                                                            data={dataFileAttach}
                                                            loading={false}
                                                            defaultPageSize={3}
                                                        />
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
                <WoManagementAddCdGroupPopup
                    parentState={this.state}
                    closePopup={this.closeCdGroupPopup}
                    setValue={this.setValueCdGroup}
                    isChooseOnly={false} />
                <WoManagementAddStationPopup
                    parentState={this.state}
                    closePopup={this.closeStationPopup}
                    setValue={this.setValueStation} />
                <WoManagementAddWarehousePopup
                    parentState={this.state}
                    closePopup={this.closeWarehousePopup}
                    setValue={this.setValueWarehouse} />
            </div>
        );
    }
}

WoManagementAdd.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    isShowPopup: PropTypes.bool,
    closePopup: PropTypes.func,
    parentSource: PropTypes.object,
    reloadDataGridParent: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions, WoTypeManagementActions, WoCdGroupManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementAdd));