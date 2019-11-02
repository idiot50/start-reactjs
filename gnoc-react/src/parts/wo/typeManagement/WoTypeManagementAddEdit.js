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
import * as WoTypeManagementActions from './WoTypeManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomReactTable } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, Dropzone, downloadFileLocal, convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import WoTypeManagementPopupCheckList from './WoTypeManagementPopupCheckList';
import WoTypeManagementPopupFile from './WoTypeManagementPopupFile';
import _ from 'lodash';

class WoTypeManagementAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table List require infomation
            dataListInfo: [],
            columnsListInfo: this.buildTableColumnsListInfo(),
            checkedIsRequire: [],
            loadingList: false,
            //Table file
            dataFile: [],
            dataFileCurrent: props.parentState.isAddOrEdit === "EDIT" ? props.parentState.selectedData.cfgFileCreateWoDTOList : [],
            columnsFile: this.buildTableColumnsFile(),
            dataCheckedFile: [],
            loadingFile: false,
            //Table check list
            dataCheckList: [],
            dataCheckListCurrent: props.parentState.isAddOrEdit === "EDIT" ? props.parentState.selectedData.woTypeCheckListDTOList : [],
            columnsCheckList: this.buildTableColumnsCheckList(),
            dataCheckedCheckList: [],
            loadingCheckList: false,
            //Select
            statusListSelect: [
                { itemId: 1, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.status.active") },
                { itemId: 0, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.status.inActive") }
            ],
            isAllowListSelect: [
                { itemId: 1, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.allow") },
                { itemId: 0, itemName: props.t("woTypeManagement:woTypeManagement.dropdown.isAllow.notAllow") }
            ],
            selectValueWoGroupName: {},
            selectValueStatus: {},
            selectValueIsCreated: {},
            selectValueIsAllowPause: {},
            selectValueAllowManualCreate: {},
            files: [],
            filesCurrent: props.parentState.isAddOrEdit === "EDIT" ? props.parentState.selectedData.woTypeFilesGuideDTOList : [],
            //List
            listWoGroupType: [],
            fileGuideIdDeleteList: [],
            fileCreateIdDeleteList: [],
            checkListIdDeleteList: []
        };
    }

    componentDidMount() {
        //get combobox
        this.props.actions.getItemMaster("WO_GROUP_TYPE", "itemId", "itemName", "1", "3").then((res) => {
            this.setState({
                listWoGroupType: (res.payload && res.payload.data) ? res.payload.data.data : []
            });
        });
        this.props.actions.getItemMaster("CFG_REQUIRED_WO_TYPE", "itemId", "itemName", "1", "3").then((res) => {
            let data = (res.payload && res.payload.data) ? res.payload.data.data : [];
            data = data.map(item => { return { cfgId: item.itemId, cfgName: item.itemName, value: item.status } });
            let dataListInfo = [];
            if (this.state.isAddOrEdit === "EDIT") {
                dataListInfo = [...this.state.selectedData.woTypeCfgRequiredDTOList];
                for (let i = 0; i < data.length; i++) {
                    const index = dataListInfo.findIndex(item => item.cfgId === data[i].cfgId);
                    if (index !== -1) {
                        dataListInfo[index].cfgName = data[i].cfgName;
                    }
                }
            }
            this.setState({
                dataListInfo: ["EDIT"].includes(this.state.isAddOrEdit) ? dataListInfo : data,
                checkedIsRequire: ["EDIT"].includes(this.state.isAddOrEdit) ? this.state.selectedData.woTypeCfgRequiredDTOList.filter(item => item.value === 1) : data
            });
        });
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueWoGroupName: this.state.selectedData.woGroupType !== null ? { value: this.state.selectedData.woGroupType } : {},
                selectValueStatus: this.state.selectedData.isEnable !== null ? { value: this.state.selectedData.isEnable } : {},
                selectValueIsCreated: this.state.selectedData.createFromOtherSys !== null ? { value: this.state.selectedData.createFromOtherSys } : {},
                selectValueAllowManualCreate: this.state.selectedData.enableCreate !== null ? { value: this.state.selectedData.enableCreate } : {},
                selectValueIsAllowPause: this.state.selectedData.allowPending !== null ? { value: this.state.selectedData.allowPending } : {},
                dataCheckList: this.props.parentState.selectedData.woTypeCheckListDTOList || []
            });
            if (this.state.isAddOrEdit === "EDIT") {
                const dataFile = this.state.selectedData.cfgFileCreateWoDTOList || []
                for (let i = 0; i < dataFile.length; i++) {
                    dataFile[i].id = i + 1;
                }
                this.setState({
                    files: this.state.selectedData.woTypeFilesGuideDTOList || [],
                    dataFile
                });
            }
        }
        if (this.state.isAddOrEdit === "ADD") {
            this.setState({
                selectValueStatus: { value: 1 },
                selectValueIsCreated: { value: 1 },
                selectValueAllowManualCreate: { value: 1 },
                selectValueIsAllowPause: { value: 1 },
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }
    // List info 
    buildTableColumnsListInfo() {
        return [
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.requiredInfo" />,
                id: "cfgName",
                accessor: d => <span title={d.cfgName}>{d.cfgName}</span>
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.required" />,
                accessor: "value",
                className: "text-center",
                sortable: false,
                Cell: ({ original }) => {
                    const isChecked = this.state.checkedIsRequire.find((ch) => ch.cfgId === original.cfgId);
                    return (
                        <input type="checkbox" checked={isChecked ? true : false} onChange={(e) => this.toggleCheckboxRowIsRequire(e.target.checked, original)} />
                    );
                }

            }
        ];
    }

    toggleCheckboxRowIsRequire(checked, object) {
        //Set checked
        const checkedIsRequire = [...this.state.checkedIsRequire];
        if (checked) {
            checkedIsRequire.push(object);
        } else {
            const index = checkedIsRequire.findIndex((ch) => ch.cfgId === object.cfgId);
            checkedIsRequire.splice(index, 1);
        }
        //Set into data
        const dataListInfo = [...this.state.dataListInfo];
        const indexData = dataListInfo.findIndex((ch) => ch.cfgId === object.cfgId);
        const objectEdit = Object.assign({}, dataListInfo[indexData]);
        objectEdit.value = checked ? 1 : 0;
        dataListInfo.splice(indexData, 1, objectEdit);
        this.setState({
            dataListInfo,
            checkedIsRequire
        });
    }

    downloadFileCreate = (d) => {
        this.props.actions.downloadFileCreate(d.cfgFileCreateWoId).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.downloadFile"));
        });
    }

    downloadFileGuide = (d) => {
        this.props.actions.downloadFilesGuide(d.woTypeFilesGuideId).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.downloadFile"));
        });
    }
    // List File
    buildTableColumnsFile() {
        return [
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("woTypeManagement:woTypeManagement.button.download")}>
                            <Button type="button" size="sm" className="btn-info icon mr-1" disabled={d.cfgFileCreateWoId !== undefined ? false : true} onClick={() => this.downloadFileCreate(d)}><i className="fa fa-download"></i></Button>
                        </span>
                    </div>;
                    return html;
                }
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.fileName" />,
                id: "fileName",
                accessor: d => <span title={d.fileName}>{d.fileName}</span>
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.required" />,
                id: "required",
                accessor: d => {
                    return d.required ?
                        <span title={this.props.t("woTypeManagement:woTypeManagement.dropdown.required.required")}>{this.props.t("woTypeManagement:woTypeManagement.dropdown.required.required")}</span> :
                        <span title={this.props.t("woTypeManagement:woTypeManagement.dropdown.required.notRequired")}>{this.props.t("woTypeManagement:woTypeManagement.dropdown.required.notRequired")}</span>
                }
            }
        ];
    }

    handleChangeCheckedFile = (option) => {
        this.setState({
            dataCheckedFile: option
        });
    }

    onFileUpdate = (data) => {
        const dataFile = [...this.state.dataFile, data];
        for (let i = 0; i < dataFile.length; i++) {
            dataFile[i].id = i + 1;
        }
        this.setState({
            dataFile
        });
    }

    removeFileList = dataCheckedFile => {
        if (dataCheckedFile.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.dataFile];
        dataCheckedFile.forEach(element => {
            listTemp = listTemp.filter(el => el.id !== element.id);
        });
        let fileCreateIdDeleteList = [...this.state.fileCreateIdDeleteList];
        for (const file of dataCheckedFile) {
            if (this.state.dataFileCurrent.some(item => item.cfgFileCreateWoId === file.cfgFileCreateWoId)) {
                fileCreateIdDeleteList.push(file.cfgFileCreateWoId);
            }
        }
        this.setState({
            dataFile: listTemp,
            fileCreateIdDeleteList
        });
    }

    removeFile = (item) => {
        if (this.state.filesCurrent.indexOf(item) >= 0) {
            this.setState({
                fileGuideIdDeleteList: [...this.state.fileGuideIdDeleteList, item.woTypeFilesGuideId]
            });
        }
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    // CheckList
    buildTableColumnsCheckList() {
        return [
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.checkListName" />,
                id: "checklistName",
                accessor: d => <span title={d.checklistName}>{d.checklistName}</span>
            },
            {
                Header: <Trans i18nKey="woTypeManagement:woTypeManagement.label.defaultValue" />,
                id: "defaultValue",
                accessor: d => <span title={d.defaultValue}>{d.defaultValue}</span>
            }
        ];
    }

    onCheckListUpdate = (data) => {
        this.setState({
            dataCheckList: data
        })
    }

    removeCheckList = dataCheckedCheckList => {
        if (dataCheckedCheckList.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.dataCheckList];
        dataCheckedCheckList.forEach(element => {
            listTemp = listTemp.filter(el => el.checklistName !== element.checklistName);
        });
        let checkListIdDeleteList = [...this.state.checkListIdDeleteList];
        for (const checklist of dataCheckedCheckList) {
            if (this.state.dataCheckListCurrent.some(item => item.woTypeChecklistId === checklist.woTypeChecklistId)) {
                checkListIdDeleteList.push(checklist.woTypeChecklistId);
            }
        }
        this.setState({
            dataCheckList: listTemp,
            checkListIdDeleteList
        });
    }

    handleChangeCheckedCheckList = (option) => {
        this.setState({
            dataCheckedCheckList: option
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const woTypeManagement = Object.assign({}, this.state.selectedData, values);
            woTypeManagement.woTypeCheckListDTOList = this.state.dataCheckList;
            woTypeManagement.isEnable = this.state.selectValueStatus.value;
            woTypeManagement.woGroupType = this.state.selectValueWoGroupName.value;
            woTypeManagement.enableCreate = this.state.selectValueAllowManualCreate.value;
            woTypeManagement.allowPending = this.state.selectValueIsAllowPause.value;
            woTypeManagement.createFromOtherSys = this.state.selectValueIsCreated.value;
            woTypeManagement.woTypeCfgRequiredDTOList = this.state.dataListInfo;
            woTypeManagement.woTypeCode = woTypeManagement.woTypeCode ? woTypeManagement.woTypeCode.trim().toUpperCase() : "";
            woTypeManagement.woTypeName = woTypeManagement.woTypeName ? woTypeManagement.woTypeName.trim() : "";
            woTypeManagement.processTime = woTypeManagement.processTime ? woTypeManagement.processTime.trim() : "";
            woTypeManagement.timeOver = woTypeManagement.timeOver ? woTypeManagement.timeOver.trim() : "";
            woTypeManagement.smsCycle = woTypeManagement.smsCycle ? woTypeManagement.smsCycle.trim() : "";
            woTypeManagement.timeAutoCloseWhenOver = woTypeManagement.timeAutoCloseWhenOver ? woTypeManagement.timeAutoCloseWhenOver.trim() : "";
            woTypeManagement.woCloseAutomaticTime = woTypeManagement.woCloseAutomaticTime ? woTypeManagement.woCloseAutomaticTime.trim() : "";
            const dataFile = _.cloneDeep(this.state.dataFile);
            const filesCreate = [];
            let indexFile = 0;
            for (const data of dataFile) {
                if (data.file) {
                    filesCreate.push(data.file);
                    data.indexFile = indexFile;
                    data.file = null;
                    indexFile++;
                } else {
                    data.indexFile = null;
                }
            }
            woTypeManagement.cfgFileCreateWoDTOList = dataFile;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    woTypeManagement.woTypeId = "";
                }
                this.props.actions.addWoTypeManagement(this.state.files, filesCreate, woTypeManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woTypeManagement:woTypeManagement.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else if (response.payload.data.key === "DUPLICATE") {
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.duplicate"));
                        } else {
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.add"));
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
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                woTypeManagement.woTypeId = this.state.selectedData.woTypeId;
                woTypeManagement.fileGuideIdDeleteList = this.state.fileGuideIdDeleteList;
                woTypeManagement.fileCreateIdDeleteList = this.state.fileCreateIdDeleteList;
                woTypeManagement.checkListIdDeleteList = this.state.checkListIdDeleteList;
                this.props.actions.editWoTypeManagement(this.state.files.filter(item => !item.woTypeId), filesCreate, woTypeManagement).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woTypeManagement:woTypeManagement.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else if (response.payload.data.key === "DUPLICATE") {
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.duplicate"));
                        } else {
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.edit"));
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
                            toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.edit"));
                        }
                    });
                });
            }
        });
    }

    openPopupFile = () => {
        this.setState({ isOpenPopupFile: true })
    }
    closePopupFile = () => {
        this.setState({ isOpenPopupFile: false });
    }

    openPopupCheckList = () => {
        this.setState({ isOpenPopupCheckList: true })
    }
    closePopupCheckList = () => {
        this.setState({ isOpenPopupCheckList: false });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleItemSelectChangeWoGroupName = (option) => {
        this.setState({ selectValueWoGroupName: option });
    }

    handleItemSelectChangeStatus = (option) => {
        this.setState({ selectValueStatus: option });
    }

    handleItemSelectChangeIsAllowPause = (option) => {
        this.setState({ selectValueIsAllowPause: option });
    }

    handleItemSelectChangeAllowManualCreate = (option) => {
        this.setState({ selectValueAllowManualCreate: option });
    }
    handleItemSelectChangeIsCreated = (option) => {
        this.setState({ selectValueIsCreated: option });
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.fileName === item.name)) {
                const arr = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rar', 'zip', '7z', 'jpg', 'gif', 'png', 'bmp', 'sql']
                if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if (item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({
                            files: [...this.state.files, item]
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

    render() {
        const { t } = this.props;
        let objectAddOrEdit = {};
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            objectAddOrEdit.woTypeCode = this.state.selectedData.woTypeCode || "";
            objectAddOrEdit.woTypeName = this.state.selectedData.woTypeName || "";
            objectAddOrEdit.processTime = this.state.selectedData.processTime !== null ? this.state.selectedData.processTime + "" : "";
            objectAddOrEdit.timeOver = this.state.selectedData.timeOver !== null ? this.state.selectedData.timeOver + "" : "";
            objectAddOrEdit.smsCycle = this.state.selectedData.smsCycle !== null ? this.state.selectedData.smsCycle + "" : "";
            objectAddOrEdit.timeAutoCloseWhenOver = this.state.selectedData.timeAutoCloseWhenOver !== null ? this.state.selectedData.timeAutoCloseWhenOver + "" : "";
            objectAddOrEdit.woCloseAutomaticTime = this.state.selectedData.woCloseAutomaticTime !== null ? this.state.selectedData.woCloseAutomaticTime + "" : "";
        }
        const { columnsCheckList, columnsFile, columnsListInfo, statusListSelect, isAllowListSelect } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woTypeManagement:woTypeManagement.title.woTypeManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("woTypeManagement:woTypeManagement.title.woTypeManagementEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                                            </LaddaButton>{' '}
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
                                                        <i className="fa fa-align-justify"></i>{t("woTypeManagement:woTypeManagement.title.woTypeManagementInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="woTypeCode" label={t("woTypeManagement:woTypeManagement.label.woTypeCode")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.woTypeCode")} required
                                                                    autoFocus maxLength="50"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: t("woTypeManagement:woTypeManagement.message.requiredWoTypeCode") },
                                                                        pattern: { value: '^([a-zA-Z0-9_]{1,50})?$', errorMessage: t("woTypeManagement:woTypeManagement.message.required.woTypeName") }
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"woGroupType"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.woGroupName")}
                                                                    isRequired={true}
                                                                    options={this.state.listWoGroupType}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeWoGroupName}
                                                                    selectValue={this.state.selectValueWoGroupName}
                                                                    messageRequire={t("woTypeManagement:woTypeManagement.message.requiredGroupType")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="woTypeName" label={t("woTypeManagement:woTypeManagement.label.woTypeName")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.woTypeName")} required
                                                                    maxLength="1000"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: t("woTypeManagement:woTypeManagement.message.requiredWoTypeName") },
                                                                    }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"isEnable"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.status")}
                                                                    isRequired={true}
                                                                    options={statusListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                    selectValue={this.state.selectValueStatus}
                                                                    messageRequire={t("woTypeManagement:woTypeManagement.message.requiredStatus")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="processTime" label={t("woTypeManagement:woTypeManagement.label.duration")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.duration")}
                                                                    validate={{
                                                                        pattern: { value: '^([ ])*([0-9]{1,10})?([ ])*$', errorMessage: this.props.t("woTypeManagement:woTypeManagement.message.error.wrongDataFormat") },
                                                                        maxLength: { value: 10, errorMessage: this.props.t("woTypeManagement:woTypeManagement.message.error.maxLength", { number: 10 }) },
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"enableCreate"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.allowManualCreate")}
                                                                    isRequired={true}
                                                                    options={isAllowListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeAllowManualCreate}
                                                                    selectValue={this.state.selectValueAllowManualCreate}
                                                                    messageRequire={t("woTypeManagement:woTypeManagement.message.requiredAllowManualCreate")}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="timeOver" label={t("woTypeManagement:woTypeManagement.label.timeOverdue")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.timeOverdue")}
                                                                    maxLength="4"
                                                                    validate={{
                                                                        pattern: { value: '^([ ])*([0-9]{1,10})?([ ])*$', errorMessage: this.props.t("woTypeManagement:woTypeManagement.message.error.wrongDataFormat") },
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="smsCycle" label={t("woTypeManagement:woTypeManagement.label.cycleMessageOverdue")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.cycleMessageOverdue")}
                                                                    maxLength="4"
                                                                    validate={{
                                                                        pattern: { value: '^([ ])*([0-9]{1,10})?([ ])*$', errorMessage: this.props.t("woTypeManagement:woTypeManagement.message.error.wrongDataFormat") },
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="woCloseAutomaticTime" label={t("woTypeManagement:woTypeManagement.label.timeAutoCloseWo")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.timeAutoCloseWo")}
                                                                    maxLength="4"
                                                                    validate={{
                                                                        pattern: { value: '^([ ])*([0-9]{1,10})?([ ])*$', errorMessage: this.props.t("woTypeManagement:woTypeManagement.message.error.wrongDataFormat") },
                                                                    }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"allowPending"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.isAllowPause")}
                                                                    isRequired={true}
                                                                    options={isAllowListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeIsAllowPause}
                                                                    selectValue={this.state.selectValueIsAllowPause}
                                                                    messageRequire={t("woTypeManagement:woTypeManagement.message.requiredIsAllowPause")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"createFromOtherSys"}
                                                                    label={t("woTypeManagement:woTypeManagement.label.isCreated")}
                                                                    isRequired={true}
                                                                    options={isAllowListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeIsCreated}
                                                                    selectValue={this.state.selectValueIsCreated}
                                                                    messageRequire={t("woTypeManagement:woTypeManagement.message.requiredIsCreated")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="timeAutoCloseWhenOver" label={t("woTypeManagement:woTypeManagement.label.timeAutoCloseWoOverdue")}
                                                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.timeAutoCloseWoOverdue")}
                                                                    maxLength="4"
                                                                    validate={{
                                                                        pattern: { value: '^([ ])*([0-9]{1,10})?([ ])*$', errorMessage: this.props.t("woTypeManagement:woTypeManagement.message.error.wrongDataFormat") },
                                                                    }} />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-list-ul"></i>{t("woTypeManagement:woTypeManagement.title.attachedFiles")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Col xs="12" sm="12">
                                                            <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                                        </Col>
                                                        <Col xs="12" sm="12">
                                                            <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                                <ListGroup>
                                                                    {this.state.files.map((item, index) => (
                                                                        <ListGroupItem key={"item-" + index} style={{ height: '2.5em' }} className="d-flex align-items-center">
                                                                            <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                                            {item.woTypeFilesGuideId ? <Button color="link" onClick={() => this.downloadFileGuide(item)}>{item.fileName}</Button>
                                                                                : <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                                                            }
                                                                        </ListGroupItem>
                                                                    ))}
                                                                </ListGroup>
                                                            </div>
                                                        </Col>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-list-ul"></i>{t("woTypeManagement:woTypeManagement.title.woTypeManagementListRequiredInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columnsListInfo}
                                                            data={this.state.dataListInfo}
                                                            loading={this.state.loadingFile}
                                                            isCheckbox={false}
                                                            defaultPageSize={3}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-list-ul"></i>{t("woTypeManagement:woTypeManagement.title.woTypeManagementFile")}
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                                title={t("woTypeManagement:woTypeManagement.button.add")}
                                                                onClick={() => this.openPopupFile()}><i className="fa fa-plus"></i></Button>
                                                            <Button type="button" size="md" color="secondary" className="custom-btn btn-pill mr-2"
                                                                onClick={() => this.removeFileList(this.state.dataCheckedFile)}
                                                                title={t("woTypeManagement:woTypeManagement.button.delete")}
                                                            ><i className="fa fa-times"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columnsFile}
                                                            data={this.state.dataFile}
                                                            isCheckbox={true}
                                                            loading={this.state.loadingFile}
                                                            defaultPageSize={3}
                                                            handleDataCheckbox={this.handleChangeCheckedFile}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-list-ul"></i>{t("woTypeManagement:woTypeManagement.title.woTypeManagementCheckList")}
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                                title={t("woTypeManagement:woTypeManagement.button.add")}
                                                                onClick={() => this.openPopupCheckList()}><i className="fa fa-plus"></i></Button>
                                                            <Button type="button" size="md" color="secondary" className="custom-btn btn-pill mr-2"
                                                                onClick={() => this.removeCheckList(this.state.dataCheckedCheckList)}
                                                                title={t("woTypeManagement:woTypeManagement.button.delete")}
                                                            ><i className="fa fa-times"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columnsCheckList}
                                                            data={this.state.dataCheckList}
                                                            isCheckbox={true}
                                                            loading={this.state.loadingCheckList}
                                                            defaultPageSize={3}
                                                            handleDataCheckbox={this.handleChangeCheckedCheckList}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
                <WoTypeManagementPopupCheckList
                    parentState={this.state}
                    closePopup={this.closePopupCheckList}
                    onCheckListUpdate={this.onCheckListUpdate}
                />
                <WoTypeManagementPopupFile
                    parentState={this.state}
                    closePopup={this.closePopupFile}
                    onFileUpdate={this.onFileUpdate}
                />
            </div >
        );
    }
}

WoTypeManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woTypeManagement, common } = state;
    return {
        response: { woTypeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoTypeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoTypeManagementAddEdit));