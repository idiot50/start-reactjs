import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, Input} from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';

import * as commonActions from './../../../actions/commonActions';
import * as OdConfigBusinessActions from './OdConfigBusinessActions';
import { CustomReactTableLocal, CustomSelect, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class OdConfigBusinessAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeOdType = this.handleItemSelectChangeOdType.bind(this);
        this.handleItemSelectChangeSendCreate = this.handleItemSelectChangeSendCreate.bind(this);
        this.handleItemSelectChangeOdPriority = this.handleItemSelectChangeOdPriority.bind(this);
        this.handleItemSelectChangeSendReceiveUser= this.handleItemSelectChangeSendReceiveUser.bind(this);
        this.handleItemSelectChangeSendReceiveUnit = this.handleItemSelectChangeSendReceiveUnit.bind(this);
        this.handleItemSelectChangeOdNewStatus = this.handleItemSelectChangeOdNewStatus.bind(this);
        this.handleItemSelectChangeOdOldStatus = this.handleItemSelectChangeOdOldStatus.bind(this);

        this.toggleCheckboxRowEditable = this.toggleCheckboxRowEditable.bind(this);
        this.toggleCheckboxRowIsRequired = this.toggleCheckboxRowIsRequired.bind(this);
        this.toggleCheckboxRowIsVisible = this.toggleCheckboxRowIsVisible.bind(this);
        this.onChangeRowMessage = this.onChangeRowMessage.bind(this);
        this.toggleCheckboxRowChangeStatus = this.toggleCheckboxRowChangeStatus.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            loading: true,
            columns: this.buildTableColumns(),
            columnChangeStatus: this.buildTableColumnChangeStatus(),
            checkedEditable: [],
            checkedIsRequired: [],
            checkedIsVisible: [],
            checkedChangeStatus: props.parentState.selectedData.odChangeStatusRoleDTO ? props.parentState.selectedData.odChangeStatusRoleDTO : [],
            sendCreateListSelect: [
                { itemId: 1, itemName: props.t("odConfigBusiness:odConfigBusiness.dropdown.status.yes") },
                { itemId: 0, itemName: props.t("odConfigBusiness:odConfigBusiness.dropdown.status.no") },
            ],
            sendReceiveUnitListSelect: [
                { itemId: 1, itemName: props.t("odConfigBusiness:odConfigBusiness.dropdown.status.sendToUnit") },
                { itemId: 0, itemName: props.t("odConfigBusiness:odConfigBusiness.dropdown.status.no") },
                { itemId: 2, itemName: props.t("odConfigBusiness:odConfigBusiness.dropdown.status.sendToLeader") }
            ],
            lstStatus: [],
            //Select
            selectValueOdType: {},
            selectValueOdOldStatus: {},
            selectValueOdNewStatus: {},
            selectValueSendCreate: {},
            selectValueOdPriority: {},
            selectValueSendReceiveUser: {},
            selectValueSendReceiveUnit: {}
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("OD_STATUS", "itemId", "itemName", "1", "3").then((response) => {
            let lstStatus = response.payload.data.data.map(item => {
                return {
                    itemId: item.itemValue,
                    itemName: item.itemName,
                    itemCode: item.itemCode
                }
            });
            this.setState({
                lstStatus
            });
        });
        if(this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueOdType: {value: this.state.selectedData.odTypeId},
                selectValueOdOldStatus: {value: this.state.selectedData.oldStatus},
                selectValueOdNewStatus: {value: this.state.selectedData.newStatus},
                selectValueSendCreate: {value: this.state.selectedData.sendCreate},
                selectValueOdPriority: {value: this.state.selectedData.odPriority},
                selectValueSendReceiveUser: {value: this.state.selectedData.sendReceiveUser},
                selectValueSendReceiveUnit: {value: this.state.selectedData.sendReceiveUnit}
            });
        } else if(this.state.isAddOrEdit === "ADD") {
            this.setState({
                selectValueOdType: {},
                selectValueOdOldStatus: {},
                selectValueOdNewStatus: {},
                selectValueSendCreate: {},
                selectValueOdPriority: {},
                selectValueSendReceiveUser: {},
                selectValueSendReceiveUnit: {}
            });
        }
        //get combobox
        this.props.actions.getItemMaster("OD_CFG_BUSINESS_COLUMN", "itemId", "itemName", "1", "3").then((response) => {
            const dataOdCfgBusinessColumn = response.payload.data.data;
            let odCfgBusinessColumns = [];
            if ((this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") && this.state.selectedData.odCfgBusinessDTO) {
                let checkedEditable = [];
                let checkedIsRequired = [];
                let checkedIsVisible = [];
                for (const obj of this.state.selectedData.odCfgBusinessDTO) {
                    let column = {
                        ...obj,
                        itemId: Number.parseInt(obj.columnId, 10),
                        itemName: obj.columnNameValue,
                        itemValue: obj.columnName,
                        message: obj.message
                    };
                    odCfgBusinessColumns.push(column);
                    if(obj.editable) {
                        checkedEditable.push(column);
                    }
                    if(obj.isRequired) {
                        checkedIsRequired.push(column);
                    }
                    if(obj.isVisible) {
                        checkedIsVisible.push(column);
                    }
                }
                this.setState({
                    data: odCfgBusinessColumns,
                    loading: false,
                    checkedEditable,
                    checkedIsRequired,
                    checkedIsVisible
                });
            } else {
                for(const obj of dataOdCfgBusinessColumn) {
                    obj.columnId = obj.itemId;
                    obj.columnNameValue = obj.itemName;
                    obj.columnName = obj.itemValue;
                    odCfgBusinessColumns.push({
                        itemId: obj.itemId,
                        itemName: obj.itemName,
                        itemValue: obj.itemValue,
                        message: null
                    });
                }
                this.setState({
                    data: odCfgBusinessColumns,
                    loading: false
                });
            }
        }).catch((error) => {
        });
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("OD_CHANGE_STATUS_ROLE", "itemId", "itemName", "1", "3");
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.columnName" />,
                id: "itemName",
                sortable: false,
                width: 300,
                accessor: d => <span title={d.itemName}>{d.itemName}</span>
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.isVisible" />,
                accessor: "isVisible",
                className: "text-center",
                sortable: false,
                width: 150,
                Cell: ({ original }) => {
                    const isCheckedVisible = this.state.checkedIsVisible.find((ch) => ch.itemId === original.itemId);
                    return (
                        <input type="checkbox" checked={isCheckedVisible ? true : false} onChange={(e) => this.toggleCheckboxRowIsVisible(e.target.checked, original)} />
                    );
                }
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.editable" />,
                accessor: "editable",
                className: "text-center",
                sortable: false,
                width: 150,
                Cell: ({ original }) => {
                    const isCheckedVisible = this.state.checkedIsVisible.find((ch) => ch.itemId === original.itemId);
                    const isCheckedEditable = this.state.checkedEditable.find((ch) => ch.itemId === original.itemId);
                    return (
                        <input type="checkbox" disabled={isCheckedVisible ? false : true} checked={isCheckedEditable ? true : false} onChange={(e) => this.toggleCheckboxRowEditable(e.target.checked, original)} />
                    );
                }
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.isRequired" />,
                accessor: "isRequired",
                className: "text-center",
                sortable: false,
                width: 150,
                Cell: ({ original }) => {
                    const isCheckedVisible = this.state.checkedIsVisible.find((ch) => ch.itemId === original.itemId);
                    const isCheckedRequired = this.state.checkedIsRequired.find((ch) => ch.itemId === original.itemId);
                    return (
                        <input type="checkbox" disabled={isCheckedVisible ? false : true} checked={isCheckedRequired ? true : false} onChange={(e) => this.toggleCheckboxRowIsRequired(e.target.checked, original)} />
                    );
                }
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.message" />,
                accessor: "message",
                className: "text-center",
                sortable: false,
                width: 200,
                Cell: ({ original }) => {
                    const isCheckedVisible = this.state.checkedIsVisible.find((ch) => ch.itemId === original.itemId);
                    const isOnchangeValue = this.state.data.find((ch) => ch.itemId === original.itemId);
                    return <Input type="text" disabled={isCheckedVisible ? false : true} value={(isOnchangeValue && isOnchangeValue.message) ? isOnchangeValue.message : ""} onChange={(e) => this.onChangeRowMessage(e.target.value, original)} />;
                }
            }
        ];
    }

    buildTableColumnChangeStatus() {
        return [
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.roleName" />,
                id: "itemName",
                sortable: false,
                className: "text-center",
                accessor: d => <span title={d.itemName}>{d.itemName}</span>
            },
            {
                Header: <Trans i18nKey="odConfigBusiness:odConfigBusiness.label.permissionEditStatus" />,
                accessor: "itemValue",
                className: "text-center",
                sortable: false,
                Cell: ({ original }) => {
                    const isChecked = this.state.checkedChangeStatus.find((ch) => ch.roleId === Number.parseInt(original.itemValue, 10));
                    return (
                        <input type="checkbox" checked={isChecked ? true : false} onChange={(e) => this.toggleCheckboxRowChangeStatus(e.target.checked, original)} />
                    );
                }
            },
        ];
    }

    toggleCheckboxRowChangeStatus(checked, object) {
        //Set checked
        const checkedChangeStatus = [];
        for(const obj of this.state.checkedChangeStatus) {
            checkedChangeStatus.push({roleId: obj.roleId});
        }
        if(checked) {
            checkedChangeStatus.push({roleId: Number.parseInt(object.itemValue, 10)});
        } else {
            const index = checkedChangeStatus.findIndex((ch) => ch.roleId === Number.parseInt(object.itemValue, 10));
            checkedChangeStatus.splice(index, 1);
        }
        this.setState({
            checkedChangeStatus
        });
    }

    toggleCheckboxRowEditable(checked, object) {
        //Set checked
        const checkedEditable = [...this.state.checkedEditable];
        if(checked) {
            checkedEditable.push(object);
        } else {
            const index = checkedEditable.findIndex((ch) => ch.itemId === object.itemId);
            checkedEditable.splice(index, 1);
        }
        //Set into data
        const data = [...this.state.data];
        const indexData = data.findIndex((ch) => ch.itemId === object.itemId);
        const objectEdit = Object.assign({}, data[indexData]);
        objectEdit.editable = checked ? 1 : 0;
        data.splice(indexData, 1, objectEdit);
        this.setState({
            data,
            checkedEditable
        });
    }

    toggleCheckboxRowIsRequired(checked, object) {
        //Set checked
        const checkedIsRequired = [...this.state.checkedIsRequired];
        if(checked) {
            checkedIsRequired.push(object);
        } else {
            const index = checkedIsRequired.findIndex((ch) => ch.itemId === object.itemId);
            checkedIsRequired.splice(index, 1);
        }
        //Set into data
        const data = [...this.state.data];
        const indexData = data.findIndex((ch) => ch.itemId === object.itemId);
        const objectEdit = Object.assign({}, data[indexData]);
        objectEdit.isRequired = checked ? 1 : 0;
        data.splice(indexData, 1, objectEdit);
        this.setState({
            data,
            checkedIsRequired
        });
    }

    toggleCheckboxRowIsVisible(checked, object) {
        //Set checked
        const checkedIsVisible = [...this.state.checkedIsVisible];
        if(checked) {
            checkedIsVisible.push(object);
        } else {
            const index = checkedIsVisible.findIndex((ch) => ch.itemId === object.itemId);
            checkedIsVisible.splice(index, 1);
        }
        //Set into data
        const data = [...this.state.data];
        const indexData = data.findIndex((ch) => ch.itemId === object.itemId);
        const objectEdit = Object.assign({}, data[indexData]);
        objectEdit.isVisible= checked ? 1 : 0;

        const checkedIsRequired = [...this.state.checkedIsRequired];
        const checkedEditable = [...this.state.checkedEditable];
        if (!checked) {
            checkedIsRequired.splice(checkedIsRequired.findIndex((ch) => ch.itemId === object.itemId), 1);
            objectEdit.isRequired = 0;
            checkedEditable.splice(checkedEditable.findIndex((ch) => ch.itemId === object.itemId), 1);
            objectEdit.editable = 0;
            objectEdit.message = "";
        }
        data.splice(indexData, 1, objectEdit);
        this.setState({
            data,
            checkedIsRequired,
            checkedEditable,
            checkedIsVisible
        });
    }

    onChangeRowMessage(newValue, object) {
        //Set into data
        const data = [...this.state.data];
        for(const obj of data) {
            if(obj.itemId === object.itemId) {
                obj.message = newValue;
                break;
            }
        }
        this.setState({
            data
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if(this.state.checkedChangeStatus.length < 1) {
                toastr.warning(this.props.t("odConfigBusiness:odConfigBusiness.message.requiredPermissionEditStatus"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            let odConfigBusiness = values;
            odConfigBusiness.odTypeId = this.state.selectValueOdType.value;
            odConfigBusiness.odPriority = this.state.selectValueOdPriority.value;
            odConfigBusiness.oldStatus = this.state.selectValueOdOldStatus.value;
            odConfigBusiness.newStatus = this.state.selectValueOdNewStatus.value;
            odConfigBusiness.sendReceiveUnit = this.state.selectValueSendReceiveUnit.value;
            odConfigBusiness.sendCreate = this.state.selectValueSendCreate.value;
            odConfigBusiness.sendReceiveUser = this.state.selectValueSendReceiveUser.value;
            odConfigBusiness.isDefault = this.state.selectValueOdType.value ? 0 : 1;
            let list = [...this.state.data];
            for(const obj of list) {
                obj.columnName = obj.itemValue;
                if(this.state.checkedEditable.find((el) => el.itemId === obj.itemId)) {
                    obj.editable = 1;
                }
                if(this.state.checkedIsRequired.find((el) => el.itemId === obj.itemId)) {
                    obj.isRequired = 1;
                }
                if(this.state.checkedIsVisible.find((el) => el.itemId === obj.itemId)) {
                    obj.isVisible = 1;
                }
            }
            odConfigBusiness.odCfgBusinessDTO = list;
            odConfigBusiness.createContent = odConfigBusiness.createContent.trim();
            odConfigBusiness.receiveUserContent = odConfigBusiness.receiveUserContent.trim();
            odConfigBusiness.receiveUnitContent = odConfigBusiness.receiveUnitContent.trim();
            odConfigBusiness.odChangeStatusRoleDTO = this.state.checkedChangeStatus;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if(this.state.isAddOrEdit === "COPY") {
                    odConfigBusiness.id = "";
                }
                this.props.actions.addOdConfigBusiness(odConfigBusiness).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("odConfigBusiness:odConfigBusiness.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.add"));
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
                            toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                odConfigBusiness.id = this.state.selectedData.id;
                this.props.actions.editOdConfigBusiness(odConfigBusiness).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("odConfigBusiness:odConfigBusiness.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.edit"));
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
                            toastr.error(this.props.t("odConfigBusiness:odConfigBusiness.message.error.edit"));
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

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleItemSelectChangeOdType(option) {
        this.setState({selectValueOdType: option});
    }

    handleItemSelectChangeSendCreate(option) {
        this.setState({selectValueSendCreate: option});
    }

    handleItemSelectChangeSendReceiveUser(option) {
        this.setState({selectValueSendReceiveUser: option});
    }

    handleItemSelectChangeSendReceiveUnit(option) {
        this.setState({selectValueSendReceiveUnit: option});
    }

    handleItemSelectChangeOdPriority(option) {
        this.setState({selectValueOdPriority: option});
    }

    handleItemSelectChangeOdNewStatus(option) {
        this.setState({selectValueOdNewStatus: option});
    }

    handleItemSelectChangeOdOldStatus(option) {
        this.setState({selectValueOdOldStatus: option});
    }

    render() {
        const { t, response } = this.props;
        let odCfgBusinessColumnList = [];
        if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
            odCfgBusinessColumnList = (response.common.odCfgBusinessColumn && response.common.odCfgBusinessColumn.payload) ? response.common.odCfgBusinessColumn.payload.data.data : [];
            for (const odCfgBusinessColumn of odCfgBusinessColumnList) {
                odCfgBusinessColumn.editable = null;
                odCfgBusinessColumn.isRequired = null;
                odCfgBusinessColumn.isVisible = null;
                odCfgBusinessColumn.message = null;
            }
        } else if (this.state.isAddOrEdit === "EDIT") {
            odCfgBusinessColumnList = this.state.data;
        }
        let priorityList = (response.common.odPriority && response.common.odPriority.payload) ? response.common.odPriority.payload.data.data : [];
        let odChangeStatusRoleList = (response.common.odChangeStatusRole && response.common.odChangeStatusRole.payload) ? response.common.odChangeStatusRole.payload.data.data : [];
        const { columns, columnChangeStatus, loading } = this.state;
        let objectAddOrEdit = this.state.selectedData;
        objectAddOrEdit.odTypeId = objectAddOrEdit.odTypeId != null ? objectAddOrEdit.odTypeId : '';
        objectAddOrEdit.sendReceiveUser = objectAddOrEdit.sendReceiveUser != null ? objectAddOrEdit.sendReceiveUser : '';
        objectAddOrEdit.sendCreate = objectAddOrEdit.sendCreate != null ? objectAddOrEdit.sendCreate : '';
        objectAddOrEdit.createContent = objectAddOrEdit.createContent != null ? objectAddOrEdit.createContent : '';
        objectAddOrEdit.receiveUserContent = objectAddOrEdit.receiveUserContent != null ? objectAddOrEdit.receiveUserContent : '';
        objectAddOrEdit.nextAction = objectAddOrEdit.nextAction != null ? objectAddOrEdit.nextAction : '';
        objectAddOrEdit.sendReceiveUnit = objectAddOrEdit.sendReceiveUnit != null ? objectAddOrEdit.sendReceiveUnit : '';
        objectAddOrEdit.receiveUnitContent = objectAddOrEdit.receiveUnitContent != null ? objectAddOrEdit.receiveUnitContent : '';
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={this.state.isAddOrEdit === "ADD" ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("odConfigBusiness:odConfigBusiness.title.odConfigAdd") : this.state.isAddOrEdit === "EDIT" ? t("odConfigBusiness:odConfigBusiness.title.odConfigEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("odConfigBusiness:odConfigBusiness.title.odConfigInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelect
                                                                    autoFocus={true}
                                                                    name={"odTypeId"}
                                                                    label={t("odConfigBusiness:odConfigBusiness.label.odTypeName")}
                                                                    isRequired={false}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdType}
                                                                    selectValue={this.state.selectValueOdType}
                                                                    moduleName={"GNOC_OD_TYPE"}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"odPriority"}
                                                                    label={t("odConfigBusiness:odConfigBusiness.label.odPriorityName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("odConfigBusiness:odConfigBusiness.message.requiredOdPriorityName")}
                                                                    options={priorityList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdPriority}
                                                                    selectValue={this.state.selectValueOdPriority}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"oldStatus"}
                                                                    label={t("odConfigBusiness:odConfigBusiness.label.oldStatusName")}
                                                                    isRequired={true}
                                                                    options={this.state.lstStatus}
                                                                    messageRequire={t("odConfigBusiness:odConfigBusiness.message.requiredOldStatusName")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdOldStatus}
                                                                    selectValue={this.state.selectValueOdOldStatus}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"newStatus"}
                                                                    label={t("odConfigBusiness:odConfigBusiness.label.newStatusName")}
                                                                    isRequired={true}
                                                                    options={this.state.lstStatus}
                                                                    messageRequire={t("odConfigBusiness:odConfigBusiness.message.requiredNewStatusName")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdNewStatus}
                                                                    selectValue={this.state.selectValueOdNewStatus}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"sendCreate"}
                                                                    label={t("odConfigBusiness:odConfigBusiness.label.sendCreate")}
                                                                    isRequired={false}
                                                                    options={this.state.sendCreateListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeSendCreate}
                                                                    selectValue={this.state.selectValueSendCreate}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField name="createContent" label={t("odConfigBusiness:odConfigBusiness.label.createContent")} 
                                                                    placeholder={t("odConfigBusiness:odConfigBusiness.placeholder.createContent")}/>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"sendReceiveUser"}
                                                                    label={t("odConfigBusiness:odConfigBusiness.label.sendReceiveUser")}
                                                                    isRequired={false}
                                                                    options={this.state.sendCreateListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeSendReceiveUser}
                                                                    selectValue={this.state.selectValueSendReceiveUser}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField name="receiveUserContent" label={t("odConfigBusiness:odConfigBusiness.label.receiveUserContent")} 
                                                                    placeholder={t("odConfigBusiness:odConfigBusiness.placeholder.receiveUserContent")} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"sendReceiveUnit"}
                                                                    label={t("odConfigBusiness:odConfigBusiness.label.sendReceiveUnit")}
                                                                    isRequired={false}
                                                                    options={this.state.sendReceiveUnitListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeSendReceiveUnit}
                                                                    selectValue={this.state.selectValueSendReceiveUnit}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField name="receiveUnitContent" label={t("odConfigBusiness:odConfigBusiness.label.receiveUnitContent")} 
                                                                    placeholder={t("odConfigBusiness:odConfigBusiness.placeholder.receiveUnitContent")} />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-list-ul"></i>
                                                        {t("odConfigBusiness:odConfigBusiness.title.odTypeInfoExtra")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <Card>
                                                                    <CustomReactTableLocal
                                                                        columns={columns}
                                                                        data={odCfgBusinessColumnList}
                                                                        loading={loading}
                                                                        defaultPageSize={10}
                                                                        isContainsAvField={true}
                                                                    />  
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="12">
                                            <Card>
                                                <CardHeader>
                                                    <i className="fa fa-list-ul"></i>
                                                    {t("odConfigBusiness:odConfigBusiness.title.permissionEditStatus")}<span className="text-danger">{" (*)"}</span>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" sm="12">
                                                            <Card>
                                                                <CustomReactTableLocal
                                                                    columns={columnChangeStatus}
                                                                    data={odChangeStatusRoleList}
                                                                    loading={false}
                                                                    defaultPageSize={5}
                                                                />  
                                                            </Card>
                                                        </Col>
                                                    </Row>
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
            </div>
        );
    }
}

OdConfigBusinessAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { odConfigBusiness, common } = state;
    return {
        response: { odConfigBusiness, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdConfigBusinessActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdConfigBusinessAddEdit));