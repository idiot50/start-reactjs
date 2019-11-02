import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Label, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as ptProblemActions from './PtProblemActions';
import { CustomAvField, CustomSticky, CustomRcTreeSelect, CustomAutocomplete , CustomSelect, CustomSelectLocal, CustomDatePicker, CustomFroalaEditor } from '../../../containers/Utils';
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class PtProblemDetail extends Component {
    constructor(props) {
        super(props);

        this.toggleFormDetail = this.toggleFormDetail.bind(this);
        this.toggleFormDetailAdvance = this.toggleFormDetailAdvance.bind(this);

        this.handleChangeCreatedTime = this.handleChangeCreatedTime.bind(this);
        this.handleItemSelectChangePriority = this.handleItemSelectChangePriority.bind(this);
        this.handelItemSelectChangeLocation = this.handelItemSelectChangeLocation.bind(this);
        this.handelItemSelectChangeReceiveUserId = this.handelItemSelectChangeReceiveUserId.bind(this);
        this.handleItemSelectChangeTypeId = this.handleItemSelectChangeTypeId.bind(this);
        this.handleItemSelectChangeVendor = this.handleItemSelectChangeVendor.bind(this);

        this.state = {
            collapseFormDetail: true,
            collapseFormDetailAdvance: true,
            selectedData: props.parentState.selectedData,
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
            selectValueSoftwareVersion: {},
            selectValueHardwareVersion: {},
            createdTime: null,
            deferredTime: null,
            esRcaTime: null,
            esSlTime: null,
            esWaTime: null,
            files: [],
            nodeTypeList: [],
            deviceTypeList: [],
            listStatusNext: [],
            //Text editor
            modelDescription: "",
            modelRca: "",
            modelWa: "",
            modelSolution: "",
            modelReasonOverdue: "",
            modelWorkLog: ""
        };
    }

    componentDidMount() {
        //get combobox
        this.getListWorklog();
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_CATE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_PRIORITY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_RELATED_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("VENDOR", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_CLOSE_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_SOLUTION_TYPE", "itemId", "itemName", "1", "3");
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
            if(this.state.selectedData.vendor) {
                let vendorList = (this.props.response.common.vendor && this.props.response.common.vendor.payload) ? this.props.response.common.vendor.payload.data.data : [];
                let vendorId = null;
                for (const obj of vendorList) {
                    if(obj.itemCode === this.state.selectedData.vendor) {
                        vendorId = obj.itemId;
                        break;
                    }
                }
                let obj = {typeId: this.state.selectedData.typeId, vendorId: vendorId ? vendorId : ""};
                this.props.actions.getListDeviceTypeVersion(obj).then((response) => {
                    this.setState({
                        deviceTypeList: response.payload.data
                    });
                });
            }
        }
        this.props.actions.getListProblemFiles({page: 1, pageSize: 1000, problemId: this.state.selectedData.problemId}).then((response) => {
            this.setState({
                files: response.payload.data.data ? response.payload.data.data : [],
            });
        }).catch((response) => {
        });
        this.getListStatusNext();
        this.setState({
            files: this.state.selectedData.attachFileList ? this.state.selectedData.attachFileList : [],
            createdTime: this.state.selectedData.createdTime ? new Date(this.state.selectedData.createdTime) : null,
            deferredTime: this.state.selectedData.deferredTime ? new Date(this.state.selectedData.deferredTime) : null,
            esRcaTime: this.state.selectedData.esRcaTime ? new Date(this.state.selectedData.esRcaTime) : null,
            esSlTime: this.state.selectedData.esSlTime ? new Date(this.state.selectedData.esSlTime) : null,
            esWaTime: this.state.selectedData.esWaTime ? new Date(this.state.selectedData.esWaTime) : null,
            modelDescription: this.state.selectedData.description ? this.state.selectedData.description : "",
            modelRca: this.state.selectedData.rca ? this.state.selectedData.rca : "",
            modelWa: this.state.selectedData.wa ? this.state.selectedData.wa : "",
            modelSolution: this.state.selectedData.solution ? this.state.selectedData.solution : "",
            modelReasonOverdue: this.state.selectedData.reasonOverdue ? this.state.selectedData.reasonOverdue : "",
            selectValueTypeId: { value: this.state.selectedData.typeId },
            selectValueSubCategoryId: { value: this.state.selectedData.subCategoryId },
            selectValueCategorization: { value: this.state.selectedData.categorization },
            selectValuePriorityId: { value: this.state.selectedData.priorityId },
            selectValueVendor: { value: this.state.selectedData.vendor },
            selectValueProblemState: { value: this.state.selectedData.problemState },
            selectValuePmGroup: { value: this.state.selectedData.pmGroup },
            selectValueLocation: { value: this.state.selectedData.locationId },
            selectValueReceiveUnitId: { value: this.state.selectedData.receiveUnitId },
            selectValueReceiveUserId: { value: this.state.selectedData.receiveUserId },
            selectValueSolutionType: { value: this.state.selectedData.solutionType },
            selectValueCloseCode: { value: this.state.selectedData.closeCode },
            selectValuePtRelatedType: this.state.selectedData.ptRelatedType ? { value: this.state.selectedData.ptRelatedType } : {},
            selectValueSoftwareVersion: this.state.selectedData.softwareVersion ? { value: this.state.selectedData.softwareVersion, label: this.state.selectedData.softwareVersion } : {},
            selectValueHardwareVersion: this.state.selectedData.hardwareVersion ? { value: this.state.selectedData.hardwareVersion, label: this.state.selectedData.hardwareVersion } : {},
            selectValueRcaType: this.state.selectedData.rcaType ? { value: this.state.selectedData.rcaType } : null,
        });
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
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    getListWorklog = () => {
        this.props.actions.getListProblemWorklog({page: 1, pageSize: 1000, problemId: this.state.selectedData.problemId, sortName: "createdTime", sortType: "asc"}).then((response) => {
            let content = "";
            for (const worklog of response.payload.data.data) {
                content += "==>" + worklog.createUserName + " " + convertDateToDDMMYYYYHHMISS(worklog.createdTime) + " Content: " + worklog.worklog + "<br>";
            }
            this.setState({
                modelWorkLog: content
            });
        }).catch((response) => {
            
        });
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

    toggleFormDetail() {
        this.setState({ collapseFormDetail: !this.state.collapseFormDetail });
    }

    toggleFormDetailAdvance() {
        this.setState({ collapseFormDetailAdvance: !this.state.collapseFormDetailAdvance });
    }

    handelItemSelectChangeLocation(option) {
        this.setState({selectValueLocation : option})
    }

    handelItemSelectChangeReceiveUserId(option) {
        this.setState({selectValueReceiveUserId : option})
    } 

    handleModelChangeDescription(model) {
        this.setState({ modelDescription: model })
    }

    handleModelChangeRca(model) {
        this.setState({ modelRca: model })
    }

    handleModelChangeWa(model) {
        this.setState({ modelWa: model })
    }

    handleModelChangeSolution(model) {
        this.setState({ modelSolution: model })
    }

    handleChangeCreatedTime(date) {
        this.setState({ createdTime: date });
    }

    handleItemSelectChangePriority(option) {
        this.setState({ selectValuePriorityId: option });
    }

    handleItemSelectChangeTypeId(option){
        this.setState({ selectValueTypeId: option });
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
                nodeTypeList: [],
                selectValueSubCategoryId: {}
            });
        }
    }

    handleItemSelectChangeVendor(option) {
        this.setState({ selectValueVendor: option });
    }

    downloadFile = (item) => {
        this.props.actions.downloadProblemFiles(item).then((response) => {
        }).catch((response) => {
            toastr.error(this.props.t("ptProbem:ptProbem.message.error.search"));
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
        return (
            <div className="animated fadeIn">
                <AvForm model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className="fa fa-plus-justify"></i>{t("common:common.title.info")}
                                        <div className="card-header-actions card-header-actions-button">
                                            <Button type="button" color="secondary" onClick={(e) => this.props.closePage('DETAIL')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormDetail} id="collapseFormDetail">
                                    <CardBody className={this.props.isShowPopup ? "class-card-body-show-popup" : ""}>
                                        <Row>
                                            <Col xs="12" sm="8">
                                                <CustomAvField name="problemName" label={t("ptProblem:ptProblem.label.problemName")} readOnly={true} />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomAvField name="problemCode" label={t("ptProblem:ptProblem.label.problemCode")} readOnly={true} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"typeId"}
                                                    label={t("ptProblem:ptProblem.label.techDomain")}
                                                    isRequired={false}
                                                    messageRequire={t("ptProblem:ptProblem.message.required.techDomain")}
                                                    options={ptTypeList}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeTypeId}
                                                    selectValue={this.state.selectValueTypeId}
                                                    isDisabled={true}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"problemState"}
                                                    label={t("ptProblem:ptProblem.label.problemState")}
                                                    isRequired={false}
                                                    messageRequire={t("ptProblem:ptProblem.message.required.status")}
                                                    options={this.state.listStatusNext}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={(d) => this.setState({ selectValueProblemState: d })}
                                                    selectValue={this.state.selectValueProblemState}
                                                    isDisabled={true}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"priorityId"}
                                                    label={t("ptProblem:ptProblem.label.priority")}
                                                    isRequired={false}
                                                    messageRequire={t("ptProblem:ptProblem.message.required.priority")}
                                                    options={priorityList}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangePriority}
                                                    selectValue={this.state.selectValuePriorityId}
                                                    isDisabled={true}
                                                />
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
                                                                    <CustomSelectLocal
                                                                        name={"categorization"}
                                                                        label={t("ptProblem:ptProblem.label.ticketType")}
                                                                        isRequired={false}
                                                                        messageRequire={t("ptProblem:ptProblem.message.required.ticketType")}
                                                                        options={ticketTypeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(d) => this.setState({ selectValueCategorization: d })}
                                                                        selectValue={this.state.selectValueCategorization}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name="relatedTt" label={t("ptProblem:ptProblem.label.relateIssue")} readOnly={true} />
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
                                                                        // placeholder={t("ptProblem:ptProblem.placeholder.createdDate")}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAutocomplete 
                                                                        name={"location"}
                                                                        label={t("ptProblem:ptProblem.label.section")}
                                                                        isRequired={false}
                                                                        closeMenuOnSelect={false}
                                                                        handleItemSelectChange={this.handelItemSelectChangeLocation}
                                                                        selectValue={this.state.selectValueLocation}
                                                                        moduleName={"REGION"} 
                                                                        isOnlyInputSelect={false}
                                                                        isHasCheckbox={false}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomSelectLocal
                                                                        name={"typeId"}
                                                                        label={t("ptProblem:ptProblem.label.techDomain")}
                                                                        isRequired={false}
                                                                        options={ptTypeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={this.handleItemSelectChangeTypeId}
                                                                        selectValue={this.state.selectValueTypeId}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomSelectLocal
                                                                        name={"vendor"}
                                                                        label={t("ptProblem:ptProblem.label.vendor")}
                                                                        isRequired={false}
                                                                        messageRequire={t("ptProblem:ptProblem.message.required.vendor")}
                                                                        options={vendorList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={this.handleItemSelectChangeVendor}
                                                                        selectValue={this.state.selectValueVendor}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="4">
                                                                    <CustomSelectLocal
                                                                        name={"subCategoryId"}
                                                                        label={t("ptProblem:ptProblem.label.nodeType")}
                                                                        isRequired={false}
                                                                        options={this.state.nodeTypeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(d) => this.setState({ selectValueSubCategoryId: d })}
                                                                        selectValue={this.state.selectValueSubCategoryId}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name={"hardwareVersion"} label={t("ptProblem:ptProblem.label.hardVersion")} disabled />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name={"softwareVersion"} label={t("ptProblem:ptProblem.label.softVersion")} disabled />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name="createUserName" label={t("ptProblem:ptProblem.label.createdPerson")} readOnly={true} />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAutocomplete 
                                                                        name={"receiveUserId"}
                                                                        label={t("ptProblem:ptProblem.label.handlePerson")}
                                                                        placeholder={""}
                                                                        isRequired={false}
                                                                        closeMenuOnSelect={false}
                                                                        handleItemSelectChange={this.handelItemSelectChangeReceiveUserId}
                                                                        selectValue={this.state.selectValueReceiveUserId}
                                                                        moduleName={"USERS"} 
                                                                        isOnlyInputSelect={false}
                                                                        isHasCheckbox={false}
                                                                        isDisabled={true}
                                                                        isHasChildren={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name="pmUserName" label={t("ptProblem:ptProblem.label.inchargePerson")} readOnly={true} />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" md="4">
                                                                    <CustomRcTreeSelect
                                                                        name={"rcaType"}
                                                                        label={t("ptProblem:ptProblem.label.reasonGroup")}
                                                                        isRequired={false}
                                                                        moduleName={"PT_RCA_TYPE"}
                                                                        handleChange={(value) => this.setState({ selectValueRcaType: value })}
                                                                        selectValue={this.state.selectValueRcaType}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="4">
                                                                    <CustomSelectLocal
                                                                        name={"solutionType"}
                                                                        label={t("ptProblem:ptProblem.label.solutionType")}
                                                                        isRequired={false}
                                                                        options={ptSolutionTypeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(d) => this.setState({ selectValueSolutionType: d })}
                                                                        selectValue={this.state.selectValueSolutionType}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="4">
                                                                    <CustomSelectLocal
                                                                        name={"closeCode"}
                                                                        label={t("ptProblem:ptProblem.label.closeCode")}
                                                                        isRequired={false}
                                                                        options={ptCloseTypeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(d) => this.setState({ selectValueCloseCode: d })}
                                                                        selectValue={this.state.selectValueCloseCode}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="4">
                                                                    <CustomDatePicker
                                                                        name={"esRcaTime"}
                                                                        label={t("ptProblem:ptProblem.label.rcaTime")}
                                                                        isRequired={false}
                                                                        selected={this.state.esRcaTime}
                                                                        handleOnChange={(d) => this.setState({esRcaTime: d})}
                                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                        showTimeSelect={true}
                                                                        timeFormat="HH:mm:ss"
                                                                        // placeholder={t("ptProblem:ptProblem.placeholder.rcaTime")}
                                                                        readOnly={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomDatePicker
                                                                        name={"esWaTime"}
                                                                        label={t("ptProblem:ptProblem.label.tempSolutionTime")}
                                                                        isRequired={false}
                                                                        selected={this.state.esWaTime}
                                                                        handleOnChange={(d) => this.setState({esWaTime: d})}
                                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                        showTimeSelect={true}
                                                                        timeFormat="HH:mm:ss"
                                                                        // placeholder={t("ptProblem:ptProblem.placeholder.tempSolutionTime")}
                                                                        readOnly={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomDatePicker
                                                                        name={"esSlTime"}
                                                                        label={t("ptProblem:ptProblem.label.completeSolutionTime")}
                                                                        isRequired={false}
                                                                        selected={this.state.esSlTime}
                                                                        handleOnChange={(d) => this.setState({esSlTime: d})}
                                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                        showTimeSelect={true}
                                                                        timeFormat="HH:mm:ss"
                                                                        // placeholder={t("ptProblem:ptProblem.placeholder.completeSolutionTime")}
                                                                        readOnly={true}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name="createUnitName" label={t("ptProblem:ptProblem.label.createdUnit")} readOnly={true} />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAutocomplete 
                                                                        name={"receiveUnitId"}
                                                                        label={t("ptProblem:ptProblem.label.handleUnit")}
                                                                        isRequired={false}
                                                                        closeMenuOnSelect={false}
                                                                        handleItemSelectChange={(d) => this.setState({ selectValueReceiveUnitId : d })}
                                                                        selectValue={this.state.selectValueReceiveUnitId}
                                                                        moduleName={"UNIT"} 
                                                                        isOnlyInputSelect={false}
                                                                        isHasCheckbox={false}
                                                                        isDisabled={true}
                                                                    />
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
                                                                    <CustomSelectLocal
                                                                        name={"ptRelatedType"}
                                                                        label={t("ptProblem:ptProblem.label.relateProblemType")}
                                                                        isRequired={false}
                                                                        options={ptRelatedTypeList}
                                                                        closeMenuOnSelect={true}
                                                                        handleItemSelectChange={(d) => this.setState({ selectValuePtRelatedType: d })}
                                                                        selectValue={this.state.selectValuePtRelatedType}
                                                                        isDisabled={true}
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name="relatedPt" label={t("ptProblem:ptProblem.label.relateProblem")} readOnly={true} />
                                                                </Col>
                                                                <Col xs="12" sm="4">
                                                                    <CustomAvField name="relatedKedb" label={t("ptProblem:ptProblem.label.kebd")} readOnly={true} />
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Collapse>
                                                </Card>
                                            </Col>
                                        </Row>
                                        {/* </editor-fold> */}
                                        <Row>
                                            <Col xs="12" md="12">
                                                <CustomFroalaEditor
                                                    name="description"
                                                    label={t("ptProblem:ptProblem.label.description")}
                                                    isRequired={false}
                                                    model={this.state.modelDescription}
                                                    handleModelChange={this.handleModelChangeDescription}
                                                    placeholder={""}
                                                    isDisabled={true} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" md="12">
                                                <CustomFroalaEditor
                                                    name="rca"
                                                    label={t("ptProblem:ptProblem.label.rootReason")}
                                                    isRequired={false}
                                                    model={this.state.modelRca}
                                                    handleModelChange={this.handleModelChangeRca}
                                                    placeholder={""}
                                                    isDisabled={true} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" md="12">
                                                <CustomFroalaEditor
                                                    name="wa"
                                                    label={t("ptProblem:ptProblem.label.tempSolution")}
                                                    isRequired={false}
                                                    model={this.state.modelWa}
                                                    handleModelChange={this.handleModelChangeWa}
                                                    placeholder={""}
                                                    isDisabled={true} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" md="12">
                                                <CustomFroalaEditor
                                                    name="solution"
                                                    label={t("ptProblem:ptProblem.label.completeSolution")}
                                                    isRequired={false}
                                                    model={this.state.modelSolution}
                                                    handleModelChange={this.handleModelChangeSolution}
                                                    placeholder={""}
                                                    isDisabled={true} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" md="12">
                                                <CustomFroalaEditor
                                                    name="worklog"
                                                    label={t("ptProblem:ptProblem.label.handleNote")}
                                                    isRequired={false}
                                                    model={this.state.modelWorkLog}
                                                    handleModelChange={(d) => this.setState({ modelWorkLog: d })}
                                                    placeholder={""}
                                                    isDisabled={true} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" md="12">
                                                <CustomFroalaEditor
                                                    name="reasonOverdue"
                                                    label={t("ptProblem:ptProblem.label.delayReason")}
                                                    isRequired={false}
                                                    model={this.state.modelReasonOverdue}
                                                    handleModelChange={(d) => this.setState({ modelReasonOverdue: d })}
                                                    placeholder={""}
                                                    isDisabled={true} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Label style={{ fontWeight: '500' }}>{t("ptProblem:ptProblem.label.attachFileList")}</Label>
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <ListGroup>
                                                    {this.state.files.map((item, index) => (
                                                        <ListGroupItem key={'item-' + index}>
                                                            <Button style={{ marginLeft: '-1.5em' }} color="link" onClick={() => this.downloadFile(item)}>{item.problemFileName}</Button>
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
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

PtProblemDetail.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    isShowPopup: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ptProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemDetail));