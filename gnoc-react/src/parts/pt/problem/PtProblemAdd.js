import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from './../../../actions/commonActions';
import { CustomSticky, CustomFroalaEditor, CustomSelect, CustomSelectLocal, CustomReactTableLocal, CustomAutocomplete, CustomAvField, CustomInputPopup } from '../../../containers/Utils';
import * as ptProblem from './PtProblemActions';
import { Dropzone, downloadFileLocal, confirmAlertInfo, validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";
import PtProblemAddPopupNodeCode from './PtProblemAddPopUpNodeCode';
import PtProblemAddPopupTicketName from './PtProblemAddPopupTicketName';
import PtProblemEditInfoTabRelatedTtPopup from "./PtProblemEditInfoTabRelatedTtPopup";


class PtProblemAdd extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.openPopupNodeCode = this.openPopupNodeCode.bind(this);
        this.closePopupNodeCode = this.closePopupNodeCode.bind(this);
        this.handleModelChangeDescription = this.handleModelChangeDescription.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        
        this.state = {
            btnAddOrEditLoading: false,
            //AddOrEditModal
            modalName: props.parentState.modalName,
            problemName: "",
            //Table
            listNodeCode: [],
            nodeCodeTable: {
                loading: false,
                columns: this.buildTableColumns(),
            },
            //Select
            selectValueNodeType: {},
            selectValuePriority: {},
            selectValueSoftGroup: {},
            selectValueReceiveUnitId: {},
            selectValueRegion: this.props.isShowPopup ? {value: this.props.parentState.selectedData.locationId, label: this.props.parentState.selectedData.location} : {},
            selectValueHandlePerson: {},
            selectValueTechDomain: {},
            selectValueTicketType: {},
            selectValueVendor: this.props.isShowPopup ? {value: this.props.parentState.selectedData.vendorId} : {},
            //node code table
            dataCheckedNodeCode: [],
            isOpenPopupNodeCode: false,
            isOpenPopupTicketName: false,
            //Text editor
            modelDescription: props.t("ptProblem:ptProblem.textEditorGuilde.description"),
            files: [],
            filesCurrent: [],
            filesShow: [],
            nodeTypeList: [],
            valueTt: this.props.isShowPopup ? this.props.parentState.selectedData.troubleCode : "",
            isOpenPopupRelatedTtSearch: false,
            isRequiredTt: false
        };
    }

    componentDidMount() {
        //get combobox
        this.props.actions.getItemMaster("PT_PRIORITY", "itemId", "itemName", "1", "3");// mức độ ưu tiên
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");// mảng kỹ thuật
        this.props.actions.getItemMaster("PT_SOFTGROUP", "itemId", "itemName", "1", "3");// Nhom PM
        this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3");// loại node mạng
        this.props.actions.getItemMaster("PT_CATE", "itemId", "itemName", "1", "3");// phân loại ticket
        this.props.actions.getItemMaster("PT_STATE", "itemId", "itemName", "1", "3");// trạng thái
        this.props.actions.getItemMaster("VENDOR", "itemId", "itemName", "1", "3");
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.columnName" />,
                id: "deviceCode",
                sortable: false,
                accessor: d => <span title={d.deviceCode}>{d.deviceCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.IP" />,
                id: "ip",
                className: "text-center",
                sortable: false,
                accessor: d => <span title={d.ip}>{d.ip}</span>

            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.nation" />,
                id: "nationCode",
                sortable: false,
                accessor: d => <span title={d.nationCode}>{d.nationCode}</span>

            }
        ];
    }

    closePopupNodeCode() {
        this.setState({
            isOpenPopupNodeCode: false,
        });
    }

    openPopupNodeCode() {
        this.setState({
            isOpenPopupNodeCode: true,
        });
    }

    openPopupTicketName = () => {
        if (this.state.selectValueTechDomain.value && this.state.selectValueNodeType.value && this.state.problemName) {
            this.setState({
                isOpenPopupTicketName: true,
            });
        } else {
            let fieldName = "";
            if (!this.state.problemName) {
                fieldName = this.props.t("ptProblem:ptProblem.label.problemName");
            } else if (!this.state.selectValueTechDomain.value) {
                fieldName = this.props.t("ptProblem:ptProblem.label.techDomain");
            } else if (!this.state.selectValueNodeType.value) {
                fieldName = this.props.t("ptProblem:ptProblem.label.nodeType");
            } 
            toastr.warning(this.props.t("ptProblem:ptProblem.message.required.ptDuplicate", { fieldName: fieldName }));
        }
    }

    closePopupTicketName = () => {
        this.setState({
            isOpenPopupTicketName: false,
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        if (this.state.modelDescription.length > 4000) {
            this.setState({
                btnAddOrEditLoading: false
            });
            toastr.warning(this.props.t("ptProblem:ptProblem.message.required.descriptionMaxLength"));
            return;
        }
        confirmAlertInfo(this.props.t("ptProblem:ptProblem.message.confirmAdd"),
        this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
        () => {
            this.setState({
                btnAddOrEditLoading: true
            }, () => {
                const ptProblem = values;
                ptProblem.problemName = ptProblem.problemName.trim();
                ptProblem.categorization = this.state.selectValueTicketType.value;
                ptProblem.pmGroup = this.state.selectValueSoftGroup.value;
                ptProblem.typeId = this.state.selectValueTechDomain.value;
                ptProblem.priorityId = this.state.selectValuePriority.value;
                ptProblem.receiveUnitId = this.state.selectValueReceiveUnitId.value;
                ptProblem.subCategoryId = this.state.selectValueNodeType.value;
                ptProblem.vendor = this.state.selectValueVendor.value;
                ptProblem.receiveUserId = this.state.selectValueHandlePerson.value;
                ptProblem.affectedNode = this.state.listNodeCode.map(item => item.deviceCode).join(',');
                ptProblem.nodeName = this.state.listNodeCode.map(item => item.deviceName).join(',');
                ptProblem.nodeIp = this.state.listNodeCode.map(item => item.ip).join(',');
                ptProblem.locationId = this.state.selectValueRegion.value;
                ptProblem.location = this.state.selectValueRegion.label;
                ptProblem.description = this.state.modelDescription;
                ptProblem.stateCode = "PT_OPEN";
                ptProblem.insertSource = "PT";

                //for testing
                ptProblem.createdTime = new Date();
                ptProblem.lastUpdateTime = new Date();
                ptProblem.impactId = -1;
                const techDomainList = (this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : [];
                const stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
                let itemCode = "";
                let problemState = "";
                let itemName = "";
                for (const type of techDomainList) {
                    if (type.itemId + "" === this.state.selectValueTechDomain.value + "") {
                        itemCode = type.itemCode;
                        break;
                    }
                }
                for (const state of stateList) {
                    if (state.itemCode + "" === "PT_OPEN") {
                        problemState = state.itemId;
                        itemName = state.itemName;
                        break;
                    }
                }
                ptProblem.problemState = problemState;
                ptProblem.itemTypeCode = itemCode;
                ptProblem.subCategoryIdStr = this.state.selectValueNodeType.label;
                ptProblem.content = this.props.t("ptProblem:ptProblem.message.addPT");
                ptProblem.stateName = itemName;
                ptProblem.relatedTt = this.state.valueTt;

                this.props.actions.addPtProblem(this.state.files, ptProblem).then(response => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            if (this.props.isShowPopup) {
                                this.props.reloadPage();
                            }
                            this.props.closePage('ADD', true);
                            toastr.success(this.props.t("ptProblem:ptProblem.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("ptProblem:ptProblem.message.error.add"));
                        }

                    });
                }).catch(response => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("ptProblem:ptProblem.message.error.add"));
                        }
                    });
                });
            });
        }, () => {
            this.setState({
                btnAddOrEditLoading: false
            });
        });
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

    onChangeProblemName= (e)=>{
        this.setState({problemName: e.target.value });
    }

    handleItemSelectChangeTicketType = (option) => {
        this.setState({ selectValueTicketType: option });
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
                isRequiredTt: true
            });
        } else {
            this.setState({
                isRequiredTt: false
            });
        }
    }

    handleItemSelectChangeNodeType = option => {
        this.setState({ selectValueNodeType: option });
    }

    handleItemSelectChangePriority = option => {
        this.setState({ selectValuePriority: option });
    }

    handleItemSelectChangeHandlePerson = option => {
        if(option && option.value){
            this.setState({
                selectValueHandlePerson: option,
                selectValueReceiveUnitId: {value: option.parentValue, label: option.parentLabel}
            });
        } else {
            this.setState({
                selectValueHandlePerson: option,
                selectValueReceiveUnitId: {}
            });
        }
    }

    handleItemSelectChangeSoftGroup = option => {
        this.setState({ selectValueSoftGroup: option });
    }

    handleItemSelectChangeTechDomain = option => {
        this.setState({
            selectValueNodeType: {value: null},
            selectValueTechDomain: option
        });
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

    handleItemSelectChangeVendor = option => {
        this.setState({ selectValueVendor: option });
    }

    handleItemSelectChangeReceiveUnitID = option => {
        this.setState({
            selectValueReceiveUnitId: option,
            selectValueHandlePerson: {}
        });
    }

    handleItemSelectChangeRegion = option => {
        this.setState({ selectValueRegion: option });
    }

    handleModelChangeDescription(model) {
        this.setState({ modelDescription: model });
    }

    handleDataCheckboxNodeCode = (data) => {
        this.setState({
            dataCheckedNodeCode: data
        });

    }

    addNodeCode = (dataChecked) => {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.listNodeCode.some(el => el.ip === element.ip)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            listNodeCode: [...this.state.listNodeCode, ...dataChecked]
        });
    }

    clearListNodeCode = (dataChecked) => {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listNodeCode];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.ip !== element.ip);
        });
        this.setState({
            listNodeCode: listTemp,
            dataCheckedNodeCode: []
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

    render() {
        const { t, response } = this.props;
        const { filesShow, nodeCodeTable } = this.state;
        let objectAdd = {};
        let techDomainList = (response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : [];
        let ticketTypeList = (response.common.ptCate && response.common.ptCate.payload) ? response.common.ptCate.payload.data.data : [];
        let priorityList = (response.common.ptPriority && response.common.ptPriority.payload) ? response.common.ptPriority.payload.data.data : [];
        let vendorList = [];
        for (const vendor of (response.common.vendor && response.common.vendor.payload) ? response.common.vendor.payload.data.data : []) {
            vendorList.push({itemId: vendor.itemCode, itemName: vendor.itemName});
        }
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAdd}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className="fa fa-plus-circle"></i>{t("common:common.title.add")}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="button"
                                                className="btn btn-warning btn-md mr-1"
                                                loading={this.props.parentState.btnCheckPTLoading}
                                                data-style={ZOOM_OUT} onClick={() => this.openPopupTicketName()}>
                                                <i className="fa fa-copy"></i> {t("common:common.button.checkPT")}
                                            </LaddaButton>{' '}
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {t("common:common.button.save")}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={(e) => this.props.closePage('ADD')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <CardBody>
                                    <Row>
                                        <Col xs="8" sm="8">
                                            <CustomAvField name="problemName" label={t("ptProblem:ptProblem.label.problemName")} placeholder={t("ptProblem:ptProblem.placeholder.problemName")}
                                                required onChange={this.onChangeProblemName} autoFocus maxLength="500"
                                                validate={{ required: { value: true, errorMessage: t("ptProblem:ptProblem.message.required.problemName") } }}
                                            />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <CustomSelect
                                                name={"pmGroup"}
                                                label={t("ptProblem:ptProblem.label.softGroup")}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.softGroup")}
                                                closeMenuOnSelect={true}
                                                moduleName={"ROLE"}
                                                handleItemSelectChange={this.handleItemSelectChangeSoftGroup}
                                                selectValue={this.state.selectValueSoftGroup}
                                            />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <CustomSelectLocal
                                                name={"typeId"}
                                                label={t("ptProblem:ptProblem.label.techDomain")}
                                                isMulti={false}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.techDomain")}
                                                options={techDomainList}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleItemSelectChangeTechDomain}
                                                selectValue={this.state.selectValueTechDomain}
                                            />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <CustomSelectLocal
                                                name={"categorization"}
                                                label={t("ptProblem:ptProblem.label.ticketType")}
                                                isMulti={false}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.ticketType")}
                                                options={ticketTypeList}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleItemSelectChangeTicketType}
                                                selectValue={this.state.selectValueTicketType}

                                            />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <CustomAutocomplete
                                                name={"receiveUnitId"}
                                                label={t("ptProblem:ptProblem.label.handleUnit")}
                                                placeholder={t("ptProblem:ptProblem.placeholder.handleUnit")}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.handleUnit")}
                                                closeMenuOnSelect={false}
                                                handleItemSelectChange={this.handleItemSelectChangeReceiveUnitID}
                                                selectValue={this.state.selectValueReceiveUnitId}
                                                moduleName={"UNIT"}
                                                isHasCheckbox={false}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="4">
                                            <CustomSelectLocal
                                                name={"subCategoryId"}
                                                label={t("ptProblem:ptProblem.label.nodeType")}
                                                isMulti={false}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.nodeType")}
                                                options={this.state.nodeTypeList}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleItemSelectChangeNodeType}
                                                selectValue={this.state.selectValueNodeType}
                                            />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <CustomSelectLocal
                                                name={"priorityId"}
                                                label={t("ptProblem:ptProblem.label.priority")}
                                                isMulti={false}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.priority")}
                                                options={priorityList}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleItemSelectChangePriority}
                                                selectValue={this.state.selectValuePriority}
                                            />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <CustomAutocomplete
                                                name={"receiveUserId"}
                                                label={t("ptProblem:ptProblem.label.handlePerson")}
                                                placeholder={t("ptProblem:ptProblem.placeholder.handlePerson")}
                                                isRequired={false}
                                                closeMenuOnSelect={false}
                                                handleItemSelectChange={this.handleItemSelectChangeHandlePerson}
                                                selectValue={this.state.selectValueHandlePerson}
                                                moduleName={"USERS"}
                                                parentValue={(this.state.selectValueReceiveUnitId && this.state.selectValueReceiveUnitId.value) ? this.state.selectValueReceiveUnitId.value + "" : "" }
                                                isHasChildren={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="4">
                                            <CustomSelectLocal
                                                name={"vendor"}
                                                label={t("ptProblem:ptProblem.label.vendor")}
                                                isMulti={false}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.vendor")}
                                                options={vendorList}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleItemSelectChangeVendor}
                                                selectValue={this.state.selectValueVendor}
                                            />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <CustomAutocomplete
                                                name={"locationId"}
                                                label={t("ptProblem:ptProblem.label.section")}
                                                placeholder={t("ptProblem:ptProblem.placeholder.section")}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.section")}
                                                closeMenuOnSelect={false}
                                                handleItemSelectChange={this.handleItemSelectChangeRegion}
                                                selectValue={this.state.selectValueRegion}
                                                moduleName={"REGION"}
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
                                                isRequired={this.state.isRequiredTt}
                                                messageRequire={this.props.t("ptProblem:ptProblem.message.required.tt")}
                                                isDisabled={this.props.isShowPopup}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <Card>
                                                <CardHeader>
                                                    <div style={{ float: 'left' }}>
                                                        <span style={{ position: 'absolute' }} className="mt-1">
                                                            {t("ptProblem:ptProblem.label.nodeCode")}
                                                        </span>
                                                    </div>
                                                    <div className="card-header-actions card-header-search-actions-button">
                                                        <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openPopupNodeCode()} title={t("ptProblem:ptProblem.button.additional")}><i className="fa fa-plus"></i></Button>
                                                        <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearListNodeCode(this.state.dataCheckedNodeCode)} title={t("ptProblem:ptProblem.button.remove")}><i className="fa fa-close"></i></Button>
                                                    </div>
                                                </CardHeader>
                                                <CustomReactTableLocal
                                                    columns={nodeCodeTable.columns}
                                                    data={this.state.listNodeCode}
                                                    isCheckbox={true}
                                                    loading={nodeCodeTable.loading}
                                                    propsCheckbox={["deviceCode", "ip"]}
                                                    defaultPageSize={5}
                                                    handleDataCheckbox={this.handleDataCheckboxNodeCode}
                                                />
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <CustomFroalaEditor
                                                name="description"
                                                label={t("ptProblem:ptProblem.label.description")}
                                                isRequired={true}
                                                messageRequire={t("ptProblem:ptProblem.message.required.description")}
                                                model={this.state.modelDescription}
                                                handleModelChange={this.handleModelChangeDescription}
                                                placeholder={""} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <Label style={{fontWeight: '500'}}>{t("ptProblem:ptProblem.label.attachFile")}</Label>
                                        </Col>
                                        <Col xs="12" sm="12">
                                            <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                        </Col>
                                        <Col xs="12" sm="12">
                                            <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                <ListGroup>
                                                    {filesShow.map((item, index) => (
                                                        <ListGroupItem key={'item-' + index}>
                                                            <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i> </span>
                                                            <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
                <PtProblemAddPopupNodeCode
                    parentState={this.state}
                    closePopup={this.closePopupNodeCode}
                    addNodeCode={this.addNodeCode}
                />
                <PtProblemAddPopupTicketName
                    parentState={this.state}
                    closePopup={this.closePopupTicketName}
                />
                <PtProblemEditInfoTabRelatedTtPopup
                    parentState={this.state}
                    closePopup={this.closePopupRelatedTtSearch}
                    setValueTt={this.setValueTt} />
            </div>
        );
    }
}

PtProblemAdd.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    reloadPage: PropTypes.func,
    isShowPopup: PropTypes.bool
};

function mapStateToProps(state) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ptProblem, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemAdd));