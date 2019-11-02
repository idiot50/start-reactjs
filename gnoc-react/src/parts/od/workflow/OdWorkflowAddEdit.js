import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as odTypeActions from './../category/OdTypeActions';
import * as commonActions from './../../../actions/commonActions';
import * as OdWorkflowActions from './OdWorkflowActions';
import CustomReactTableLocal from "../../../containers/Utils/CustomReactTableLocal";
import OdWorkflowAddEditPopupReceiveUnit from './OdWorkflowAddEditPopupReceiveUnit';
import OdWorkflowAddEditPopupLinkCode from './OdWorkflowAddEditPopupLinkCode';
import { Dropzone, downloadFileLocal, convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import { CustomSelect, CustomSelectLocal, CustomDatePicker, CustomSticky, CustomAvField } from '../../../containers/Utils';
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class OdWorkflowAddEdit extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.closePopupReceiveUnit = this.closePopupReceiveUnit.bind(this);
        this.openPopupReceiveUnit = this.openPopupReceiveUnit.bind(this);
        this.openPopupLinkCode = this.openPopupLinkCode.bind(this);
        this.closePopupLinkCode = this.closePopupLinkCode.bind(this);
        this.addReceiveUnit = this.addReceiveUnit.bind(this);
        this.addLinkCode = this.addLinkCode.bind(this);
        this.clearListReceiveUnit = this.clearListReceiveUnit.bind(this);
        this.clearListLinkCode = this.clearListLinkCode.bind(this);
        this.handleDataCheckboxLinkCode = this.handleDataCheckboxLinkCode.bind(this);
        this.handleDataCheckboxReceiveUnit = this.handleDataCheckboxReceiveUnit.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
        this.handleItemSelectChangeOdType = this.handleItemSelectChangeOdType.bind(this);
        this.handleItemSelectChangeOdGroupTypeId = this.handleItemSelectChangeOdGroupTypeId.bind(this);
        this.handleItemSelectChangeOdPriorityId = this.handleItemSelectChangeOdPriorityId.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAdd: true,
            //AddOrEditModal
            addOrEditModal: props.parentState.addOrEditModal,
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Receive unit table
            listReceiveUnit: [],
            receiveUnitTable: {
                loading: true,
                columns: this.buildTableReceiveUnitColumns()
            },
            //Link code table
            listLinkCode: [],
            linkCodeTable: {
                loading: true,
                columns: this.buildTableLinkCodeColumns()
            },
            files: [],
            isOpenPopupReceiveUnit: false,
            isOpenPopupLinkCode: false,
            dataCheckedReceiveUnit: [],
            dataCheckedLinkCode: [],
            startTime: null,
            endTime: null,
            selectValueOdGroupTypeId: {},
            selectValueOdPriorityId: {},
            selectValueOdType: {},
            parentValueOdType: ''
        };
    }

    componentDidMount() {
        if(this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueOdType: {value: this.state.selectedData.odTypeId},
            });
        }
        if(this.state.isAddOrEdit === "ADD") {
            this.setState({
                selectValueOdType: {},
            });
        }
        this.props.actions.getItemMaster("OD_GROUP_TYPE", "itemId", "itemName", "1", "3");// nhóm loại công việc
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3");// mức độ ưu tiên
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    buildTableReceiveUnitColumns() {
        return [
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.receiveUnitName"/>,
                id: "unitName",
                accessor: d => <span title={d.unitName}>{d.unitName}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.receiveUnitCode"/>,
                id: "unitCode",
                accessor: d => <span title={d.unitCode}>{d.unitCode}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.receiveUnitParentName"/>,
                id: "parentUnitName",
                accessor: d => {
                    return d.parentUnitName ? <span title={d.parentUnitName}>{d.parentUnitName}</span>
                    : <span>&nbsp;</span>
                }
            }
        ];
    }

    buildTableLinkCodeColumns() {
        return [
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.systemName"/>,
                id: "system",
                width: 100,
                accessor: d => <span title={d.system}>{d.system}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.linkCode"/>,
                id: "systemCode",
                width: 200,
                accessor: d => <span title={d.systemCode}>{d.systemCode}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.status"/>,
                id: "status",
                width: 150,
                accessor: d => <span title={d.status}>{d.status}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createdTime"/>,
                id: "createTime",
                className: "text-center",
                width: 150,
                accessor: d => {
                    return d.createTime ? <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.endTimeRequest"/>,
                id: "endTime",
                className: "text-center",
                width: 200,
                accessor: d => {
                    return d.endTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endTime)}>{convertDateToDDMMYYYYHHMISS(d.endTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.content"/>,
                id: "content",
                width: 200,
                accessor: d => <span title={d.content}>{d.content}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.createPerson"/>,
                id: "createPersonName",
                width: 150,
                accessor: d => <span title={d.createPersonName}>{d.createPersonName}</span>
            },
            {
                Header: <Trans i18nKey="odWorkflow:odWorkflow.label.receiveUnit"/>,
                id: "receiveUnitName",
                minWidth: 150,
                accessor: d => <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
            }
        ];
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if(this.state.startTime <= new Date()) {
                toastr.warning(this.props.t("odWorkflow:odWorkflow.message.error.startTime"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            if (this.state.listReceiveUnit.length < 1) {
                toastr.warning(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.receiveUnit"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            const odWorkflow = values;
            const lstReceiveUnitId = [];
            for(const obj of this.state.listReceiveUnit) {
                lstReceiveUnitId.push(obj.unitId + "");
            }
            odWorkflow.odName = odWorkflow.odName.trim();
            odWorkflow.planCode = odWorkflow.planCode.trim();
            odWorkflow.description = odWorkflow.description.trim();
            odWorkflow.insertSource = "Main_branch";
            odWorkflow.lstReceiveUnitId = lstReceiveUnitId;
            odWorkflow.lstOdRelation = this.state.listLinkCode;
            odWorkflow.odTypeId = this.state.selectValueOdType.value;
            odWorkflow.priorityId = this.state.selectValueOdPriorityId.value;
            odWorkflow.odGroupTypeId = this.state.selectValueOdGroupTypeId.value;
            odWorkflow.startTime = convertDateToDDMMYYYYHHMISS(this.state.startTime);
            odWorkflow.endTime = convertDateToDDMMYYYYHHMISS(this.state.endTime);
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addOdWorkflow(this.state.files, odWorkflow).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("odWorkflow:odWorkflow.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.add"));
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
                            toastr.error(this.props.t("odWorkflow:odWorkflow.message.error.add"));
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
            const arr = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rar', 'zip', '7z', 'jpg', 'gif', 'png', 'bmp', 'sql']
            if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                if (item.size <= 40894464) {
                    if (!this.state.files.some(el => el.path === item.path)) {
                        this.setState({ files: [...this.state.files, item] });
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileSize"));
                }
            } else {
                toastr.error(this.props.t("common:common.message.error.fileFormat"));
            }
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

    closePopupReceiveUnit() {
        this.setState({
            isOpenPopupReceiveUnit: false,
        });
    }

    openPopupReceiveUnit() {
        this.setState({
            isOpenPopupReceiveUnit: true,
        });
    }

    closePopupLinkCode() {
        this.setState({
            isOpenPopupLinkCode: false,
        });
    }

    openPopupLinkCode() {
        this.setState({
            isOpenPopupLinkCode: true,
        });
    }

    addReceiveUnit(dataChecked) {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.listReceiveUnit.some(el => el.unitId === element.unitId)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            listReceiveUnit: [...this.state.listReceiveUnit, ...dataChecked]
        });
    }

    addLinkCode(dataChecked) {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.listLinkCode.some(el => (el.systemId === element.systemId && el.system === element.system))) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            listLinkCode: [...this.state.listLinkCode, ...dataChecked]
        });
    }

    clearListReceiveUnit(dataChecked) {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listReceiveUnit];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.unitId !== element.unitId);
        });
        this.setState({
            listReceiveUnit: listTemp,
            dataCheckedReceiveUnit: []
        });
    }

    clearListLinkCode(dataChecked) {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listLinkCode];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.woId !== element.woId);
        });
        this.setState({
            listLinkCode: listTemp,
            dataCheckedLinkCode: []
        });
    }

    handleDataCheckboxReceiveUnit(data) {
        this.setState({
            dataCheckedReceiveUnit: data
        });
    }

    handleDataCheckboxLinkCode(data) {
        this.setState({
            dataCheckedLinkCode: data
        });
    }

    handleChangeStartTime(startTime) {
        if(!startTime) {
            this.setState({
                startTime
            });
            return;
        }
        if(this.state.selectValueOdPriorityId.processTime != null) {
            let d = new Date(startTime);
            this.setState({
                endTime: new Date(d.getTime() + this.state.selectValueOdPriorityId.processTime*60*60*1000),
                startTime
            });
        } else {
            this.setState({
                startTime
            });
        }
    }

    handleChangeEndTime(endTime) {
        this.setState({ endTime });
    }
    
    handleItemSelectChangeOdType(option) {
        let priority = {...this.state.selectValueOdPriorityId};
        if(option.value) {
            this.props.actions.getDetailOdType(option.value).then((response) => {
                for(const obj of response.payload.data.odTypeDetailDTOS) {
                    if(obj.priorityId === Number.parseInt(priority.value, 10)) {
                        priority.processTime = obj.processTime;
                        break;
                    }
                }
                if(this.state.startTime && priority.value) {
                    let d = new Date(this.state.startTime);
                    this.setState({
                        selectValueOdType: option,
                        selectValueOdPriorityId: priority,
                        endTime: new Date(d.getTime() + priority.processTime*60*60*1000),
                    });
                } else {
                    this.setState({
                        selectValueOdType: option,
                        selectValueOdPriorityId: priority
                    });
                }
            });
        } else {
            priority.processTime = null;
            this.setState({
                selectValueOdType: option,
                selectValueOdPriorityId: priority
            });
        }
    }

    handleItemSelectChangeOdGroupTypeId(option) {
        this.setState({
            selectValueOdGroupTypeId: option,
            parentValueOdType: option.value,
            selectValueOdType: {value: null}
        });
    }

    handleItemSelectChangeOdPriorityId(option) {
        if(this.state.selectValueOdType.value) {
            this.props.actions.getDetailOdType(this.state.selectValueOdType.value).then((response) => {
                for(const obj of response.payload.data.odTypeDetailDTOS) {
                    if(obj.priorityId === option.value) {
                        option.processTime = obj.processTime;
                        break;
                    }
                }
                if(this.state.startTime) {
                    let d = new Date(this.state.startTime);
                    this.setState({
                        selectValueOdPriorityId: option,
                        endTime: new Date(d.getTime() + option.processTime*60*60*1000),
                    });
                } else {
                    this.setState({ selectValueOdPriorityId: option });
                }
            });
        } else {
            this.setState({ selectValueOdPriorityId: option });
        }
    }

    render() {
        const { t, response } = this.props;
        const { receiveUnitTable, linkCodeTable, files } = this.state;
        let objectAddOrEdit = {};
        let isReadOnlyEndTime = Boolean(this.state.selectValueOdPriorityId.processTime && this.state.startTime);
        objectAddOrEdit.odTypeId = this.state.selectedData.odTypeId;
        objectAddOrEdit.odName = this.state.selectedData.odName;
        objectAddOrEdit.description = this.state.selectedData.description ? this.state.selectedData.description : '';
        let odTypeGroupList = (response.common.odGroupType && response.common.odGroupType.payload) ? response.common.odGroupType.payload.data.data : [];
        let priorityList = (response.common.odPriority && response.common.odPriority.payload) ? response.common.odPriority.payload.data.data : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className="fa fa-plus-circle"></i>{t("odWorkflow:odWorkflow.title.odWorkflowAdd")}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {t("common:common.button.save")}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAdd} id="collapseFormAdd">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" md="12" lg="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("odWorkflow:odWorkflow.title.odWorkflowInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomAvField name="odName" label={t("odWorkflow:odWorkflow.label.woContent")} placeholder={t("odWorkflow:odWorkflow.placeholder.woContent")} required
                                                                    autoFocus validate={{ required: { value: true, errorMessage: t("odWorkflow:odWorkflow.message.odNameRequired") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4" md="4">
                                                                <CustomSelectLocal
                                                                    name={"odGroupTypeId"}
                                                                    label={t("odWorkflow:odWorkflow.label.woTypeGroup")}
                                                                    isRequired={false}
                                                                    options={odTypeGroupList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdGroupTypeId}
                                                                    selectValue={this.state.selectValueOdGroupTypeId}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4" md="4">
                                                                <CustomSelect
                                                                    name={"odTypeId"}
                                                                    label={t("odWorkflow:odWorkflow.label.woType")}
                                                                    isRequired={true}
                                                                    messageRequire={t("odWorkflow:odWorkflow.message.woTypeRequired")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdType}
                                                                    selectValue={this.state.selectValueOdType}
                                                                    moduleName={"GNOC_OD_TYPE"}
                                                                    parentValue={this.state.parentValueOdType ? this.state.parentValueOdType + '' : ''}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4" md="4">
                                                                <CustomSelectLocal
                                                                    name={"priorityId"}
                                                                    label={t("odWorkflow:odWorkflow.label.priority")}
                                                                    isRequired={true}
                                                                    messageRequire={t("odWorkflow:odWorkflow.message.priorityRequired")}
                                                                    options={priorityList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdPriorityId}
                                                                    selectValue={this.state.selectValueOdPriorityId}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4" md="4">
                                                                <CustomAvField name="planCode" label={t("odWorkflow:odWorkflow.label.planCode")} placeholder={t("odWorkflow:odWorkflow.placeholder.planCode")} />
                                                            </Col>
                                                            <Col xs="12" sm="4" md="4">
                                                                <CustomDatePicker
                                                                    name={"startTime"}
                                                                    label={t("odWorkflow:odWorkflow.label.startTime")}
                                                                    isRequired={true}
                                                                    messageRequire={t('odWorkflow:odWorkflow.message.startTimeRequired')}
                                                                    selected={this.state.startTime}
                                                                    timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                                    handleOnChange={this.handleChangeStartTime}
                                                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                    showTimeSelect={true}
                                                                    timeFormat="HH:mm:ss"
                                                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                                                    // placeholder={t("odWorkflow:odWorkflow.placeholder.startTime")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4" md="4">
                                                                <CustomDatePicker
                                                                    name={"endTime"}
                                                                    label={t("odWorkflow:odWorkflow.label.endTime")}
                                                                    isRequired={true}
                                                                    messageRequire={t('odWorkflow:odWorkflow.message.endTimeRequired')}
                                                                    selected={this.state.endTime}
                                                                    timeInputLabel={t('odWorkflow:odWorkflow.label.time')}
                                                                    handleOnChange={this.handleChangeEndTime}
                                                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                    readOnly={isReadOnlyEndTime}
                                                                    showTimeSelect={true}
                                                                    timeFormat="HH:mm:ss"
                                                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                                                    // placeholder={t("odWorkflow:odWorkflow.placeholder.endTime")}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12" md="12">
                                                                <CustomAvField type="textarea" rows="3" name="description" label={t("odWorkflow:odWorkflow.label.woDescription")} 
                                                                placeholder={t("odWorkflow:odWorkflow.placeholder.woDescription")} />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" md="12" lg="12">
                                                <Card>
                                                    <CardHeader>
                                                        <div style={{float: 'left'}}>
                                                            <span style={{position: 'absolute'}} className="mt-1">
                                                                {t("odWorkflow:odWorkflow.label.receiveUnit")}<span className="text-danger">{" (*)"}</span>
                                                            </span>
                                                        </div>
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openPopupReceiveUnit()} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.additional")}><i className="fa fa-plus"></i></Button>
                                                            <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearListReceiveUnit(this.state.dataCheckedReceiveUnit)} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.remove")}><i className="fa fa-close"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CustomReactTableLocal
                                                        columns={receiveUnitTable.columns}
                                                        data={this.state.listReceiveUnit}
                                                        loading={false}
                                                        defaultPageSize={3}
                                                        isCheckbox={true}
                                                        propsCheckbox={["unitId"]}
                                                        handleDataCheckbox={this.handleDataCheckboxReceiveUnit}
                                                    />
                                                </Card>
                                            </Col>
                                            <Col xs="12" md="12" lg="12">
                                                <Card>
                                                    <CardHeader>
                                                        <div style={{float: 'left'}}>
                                                            <span style={{position: 'absolute'}} className="mt-1">{t("odWorkflow:odWorkflow.label.linkCode")}</span>
                                                        </div>
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" size="md" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openPopupLinkCode()} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.additional")}><i className="fa fa-plus"></i> </Button>
                                                            <Button type="button" size="md" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearListLinkCode(this.state.dataCheckedLinkCode)} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.remove")}><i className="fa fa-close"></i> </Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CustomReactTableLocal
                                                        columns={linkCodeTable.columns}
                                                        data={this.state.listLinkCode}
                                                        loading={false}
                                                        defaultPageSize={3}
                                                        isCheckbox={true}
                                                        propsCheckbox={["systemId"]}
                                                        handleDataCheckbox={this.handleDataCheckboxLinkCode}
                                                    />
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                    <ListGroup>
                                                        {files.map(item => (
                                                            <ListGroupItem key={item.path} style={{height: '2.5em'}} className="d-flex align-items-center">
                                                                <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i> </span>
                                                                <Button color="link" onClick={() => downloadFileLocal(item)}>{item.name}</Button>
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
                <OdWorkflowAddEditPopupReceiveUnit
                    parentState={this.state}
                    closePopup={this.closePopupReceiveUnit}
                    addReceiveUnit={this.addReceiveUnit}
                />
                <OdWorkflowAddEditPopupLinkCode
                    parentState={this.state}
                    closePopup={this.closePopupLinkCode}
                    addLinkCode={this.addLinkCode}
                />
            </div>
        );
    }
}

OdWorkflowAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { odWorkflow, common, odType } = state;
    return {
        response: { odWorkflow, common, odType }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdWorkflowActions, commonActions, odTypeActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdWorkflowAddEdit));