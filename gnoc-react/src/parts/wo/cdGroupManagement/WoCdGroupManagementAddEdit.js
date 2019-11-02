import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoCdGroupManagementActions from './WoCdGroupManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomMultiSelectTwoSides } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import WoCdGroupManagementUserPopup from "./WoCdGroupManagermentUserPopup";
import WoCdGroupManagementUnitPopup from "./WoCdGroupManagermentUnitPopup";
import { when } from 'q';

class WoCdGroupManagementAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.buildUserTableColumns = this.buildUserTableColumns.bind(this);
        this.buildUnitTableColumns = this.buildUnitTableColumns.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            isOpenUserPopup: false,
            isOpenUnitPopup: false,
            disable: false,
            listUserCoordinator: {
                loading: false,
                columns: this.buildUserTableColumns()
            },
            listUnitCoordinator: {
                loading: false,
                columns: this.buildUnitTableColumns()
            },
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            assignment: props.parentState.assignment,
            selectedData: props.parentState.selectedData,
            //Select
            listCdGroupType: [],
            listUserChecked: [],
            listUnitChecked: [],
            selectValueWoGroupType: {},
            selectValueMarket: {},
            listDataUserCoordinator: [],
            listUserIdDel: [],
            listUserIdInsert: [],
            listDataUnitCoordinator: [],
            listUnitIdDel: [],
            listUnitIdInsert: [],
            cdWorkTypeList: [],
            valueWorkType: []
        };
    }

    componentWillMount() {
        this.props.actions.getItemMaster("GNOC_COUNTRY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("WO_CD_GROUP_TYPE", "itemId", "itemName", "1", "3").then((response) => {
            let tempList = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(i => ({ ...i, itemId: parseInt(i.itemValue) })) : []
            this.setState({
                listCdGroupType: tempList
            })
        })
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueWoGroupType: (this.state.selectedData.groupTypeId && this.state.selectedData.groupTypeId !== -1) ? { value: this.state.selectedData.groupTypeId} : {},
                selectValueMarket: this.state.selectedData.nationId ? { value: this.state.selectedData.nationId} : {}
            })
            switch (this.state.assignment) {
                case "USER":
                    {
                        this.props.actions.getListWoCdDTO({ woGroupId: this.state.selectedData.woGroupId }).then((response) => {
                            this.setState({
                                disable: true,
                                listDataUserCoordinator: response.payload.data || []
                            })
                        })
                        break;
                    }
                case "UNIT":
                    {
                        this.props.actions.getListWoCdGroupUnitDTO({ cdGroupId: this.state.selectedData.woGroupId }).then((response) => {
                            this.setState({
                                disable: true,
                                listDataUnitCoordinator: response.payload.data || []
                            })
                        })
                        break;
                    }
                case "WORK":
                    {
                        this.props.actions.getListWoTypeAll().then((response) => {
                            const cdWorkTypeList = (response.payload && response.payload.data) ? response.payload.data.map(item => {
                                return {
                                    value: item.woTypeId,
                                    label: item.woTypeName,
                                }
                            }) : [];
                            this.setState({
                                disable: true,
                                cdWorkTypeList
                            });
                        })
                        this.props.actions.getListWoTypeGroupDTO({ woGroupId: this.state.selectedData.woGroupId }).then((response) => {
                            const valueWorkType = (response.payload && response.payload.data) ? response.payload.data.map(item => item.woTypeId) : [];
                            this.setState({
                                valueWorkType
                            });
                        })
                        break;
                    }
                default:
                    this.setState({
                        disable: false
                    })
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            disable: false,
            assignment: ""
        });
    }

    buildUserTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.username" />,
                id: "username",
                sortable: false,
                accessor: d => <span title={d.username}>{d.username}</span>
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.fullname" />,
                id: "fullname",
                sortable: false,
                accessor: d => <span title={d.fullname}>{d.fullname}</span>

            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.email" />,
                id: "email",
                sortable: false,
                accessor: d => <span title={d.email}>{d.email}</span>

            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.phoneNumber" />,
                id: "mobile",
                sortable: false,
                accessor: d => <span title={d.mobile}>{d.mobile}</span>

            }
        ];
    }

    buildUnitTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.unitName" />,
                id: "unitName",
                sortable: false,
                accessor: d => <span title={d.unitName}>{d.unitName}</span>
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.unitCode" />,
                id: "unitCode",
                sortable: false,
                accessor: d => <span title={d.unitCode}>{d.unitCode}</span>

            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.parentUnit" />,
                id: "parentUnitName",
                sortable: false,
                accessor: d => <span title={d.parentUnitName}>{d.parentUnitName}</span>

            },
        ];
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const woCdGroupManagement = Object.assign({}, values);
            woCdGroupManagement.woGroupCode = (values && values.woGroupCode) ? values.woGroupCode.trim() : "";
            woCdGroupManagement.woGroupName = (values && values.woGroupName) ? values.woGroupName.trim() : "";
            woCdGroupManagement.email = (values && values.email) ? values.email.trim() : "";
            woCdGroupManagement.mobile = (values && values.mobile) ? values.mobile.trim() : "";
            woCdGroupManagement.groupTypeId = this.state.selectValueWoGroupType.value || "";
            woCdGroupManagement.groupTypeName = this.state.selectValueWoGroupType.label || "";
            woCdGroupManagement.nationId = this.state.selectValueMarket.value || "";
            woCdGroupManagement.nationName = this.state.selectValueMarket.label || "";
            woCdGroupManagement.isEnable = 1;
            if (this.state.isAddOrEdit === "COPY") {
                woCdGroupManagement.woGroupId = "";
            };
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addWoCdGroupManagement(woCdGroupManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.add"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.duplicate"));
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.add"));
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
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT" && this.state.assignment === "") {
                woCdGroupManagement.woGroupId = this.state.selectedData.woGroupId;
                this.props.actions.editWoCdGroupManagement(woCdGroupManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.edit"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.duplicate"));
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.edit"));
                        }
                    });
                });
            } else if (this.state.assignment === 'USER') {
                let objectUserDTO = {};
                objectUserDTO.woGroupId = this.state.selectedData.woGroupId;
                objectUserDTO.listUserIdDel = this.state.listUserIdDel.map(i => i.userId) || [];
                objectUserDTO.listUserIdInsert = this.state.listUserIdInsert.map(i => i.userId) || [];
                this.props.actions.updateWoCd(objectUserDTO).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.editUser"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.editUser"));
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
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.editUser"));
                        }
                    });
                });
            } else if (this.state.assignment === 'UNIT') {
                let objectUnitDTO = {};
                objectUnitDTO.cdGroupId = this.state.selectedData.woGroupId;
                objectUnitDTO.listUnitIdDel = this.state.listUnitIdDel.map(i => i.unitId) || [];
                objectUnitDTO.listUnitIdInsert = this.state.listUnitIdInsert.map(i => i.unitId) || [];
                this.props.actions.updateWoCdGroupUnit(objectUnitDTO).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.editUnit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.editUnit"));
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
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.editUnit"));
                        }
                    });
                });
            } else if (this.state.assignment === 'WORK') {
                let objectWorkDTO = {};
                objectWorkDTO.woGroupId = this.state.selectedData.woGroupId;
                objectWorkDTO.listWoTypeIdInsert = this.state.valueWorkType || [];
                this.props.actions.updateWoTypeGroup(objectWorkDTO).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.editWork"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.editWork"));
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
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.editWork"));
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

    handleItemSelectWoGroupType = (option) => {
        this.setState({ selectValueWoGroupType: option })
    }

    handleItemSelectChangeMarket = (option) => {
        this.setState({ selectValueMarket: option })
    }

    handleChangeWorkType = (value) => {
        this.setState({ valueWorkType: value })
    }

    openUserPopup = () => {
        this.setState({
            isOpenUserPopup: true
        })
    }

    closeUserPopup = () => {
        this.setState({
            isOpenUserPopup: false
        })
    }

    setValueUserPopup = (listUser) => {
        let templistUser = []
        for (const user of listUser) {
            if (!this.state.listDataUserCoordinator.some(item => item.userId === user.userId)) {
                templistUser.push(user)
            } else {
                toastr.warning(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.userDuplicate"))
            }
        }
        this.setState({
            listDataUserCoordinator: [...this.state.listDataUserCoordinator].concat(templistUser),
            listUserIdInsert: [...this.state.listUserIdInsert].concat(templistUser)
        })
    }

    handleDataCheckboxListUserCoordinator = (data) => {
        this.setState({
            listUserChecked: data
        })
    }

    clearListUser = (dataChecked) => {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listDataUserCoordinator];
        let tempListUserIdDel = [...this.state.listUserIdDel];
        let tempListUserIdInsert = [...this.state.listUserIdInsert];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.userId !== element.userId);
            if (element.hasOwnProperty("isEnable")) {
                tempListUserIdDel.push(element)
            } else {
                tempListUserIdInsert = tempListUserIdInsert.filter(i => i.userId !== element.userId)
            }
        });
        this.setState({
            listDataUserCoordinator: listTemp,
            listUserChecked: [],
            listUserIdDel: tempListUserIdDel,
            listUserIdInsert: tempListUserIdInsert
        });
    }

    openUnitPopup = () => {
        this.setState({
            isOpenUnitPopup: true
        })
    }

    closeUnitPopup = () => {
        this.setState({
            isOpenUnitPopup: false
        })
    }

    setValueUnitPopup = (listUnit) => {
        let templistUnit = []
        for (const unit of listUnit) {
            if (!this.state.listDataUnitCoordinator.some(item => item.unitId === unit.unitId)) {
                templistUnit.push({ ...unit, add: 1 })
            } else {
                toastr.warning(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.unitDuplicate"))
            }
        }
        this.setState({
            listDataUnitCoordinator: [...this.state.listDataUnitCoordinator].concat(templistUnit),
            listUnitIdInsert: [...this.state.listUnitIdInsert].concat(templistUnit)
        })
    }

    handleDataCheckboxListUnitCoordinator = (data) => {
        this.setState({
            listUnitChecked: data
        })
    }

    clearListUnit = (dataChecked) => {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listDataUnitCoordinator];
        let tempListUnitIdDel = [...this.state.listUnitIdDel];
        let tempListUnitIdInsert = [...this.state.listUnitIdInsert]
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.unitId !== element.unitId);
            if (element.hasOwnProperty('add')) {
                tempListUnitIdInsert = tempListUnitIdInsert.filter(i => i.unitId !== element.unitId)
            } else {
                tempListUnitIdDel.push(element)
            }
        });
        this.setState({
            listDataUnitCoordinator: listTemp,
            listUnitChecked: [],
            listUnitIdDel: tempListUnitIdDel,
            listUnitIdInsert: tempListUnitIdInsert
        });
    }

    assignmentUserCd = () => {
        return (
            <Col xs="12" sm="12">
                <Card>
                    <CardHeader>
                        <div style={{ float: 'left' }}>
                            <span style={{ position: 'absolute' }} className="mt-1">
                                {this.props.t("woCdGroupManagement:woCdGroupManagement.label.listUserCoordinator")}
                            </span>
                        </div>
                        <div className="card-header-actions card-header-search-actions-button">
                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openUserPopup()} title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.additional")}><i className="fa fa-plus"></i></Button>
                            <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearListUser(this.state.listUserChecked)} title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.remove")}><i className="fa fa-close"></i></Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <CustomReactTableLocal
                            columns={this.state.listUserCoordinator.columns}
                            data={this.state.listDataUserCoordinator}
                            isCheckbox={true}
                            loading={this.state.listUserCoordinator.loading}
                            propsCheckbox={["userId", "isEnable"]}
                            defaultPageSize={5}
                            handleDataCheckbox={this.handleDataCheckboxListUserCoordinator}
                        />
                    </CardBody>
                </Card>

            </Col>
        )
    }

    assignmentUnitCd = () => {
        return (
            <Col xs="12" sm="12">
                <Card>
                    <CardHeader>
                        <div style={{ float: 'left' }}>
                            <span style={{ position: 'absolute' }} className="mt-1">
                                {this.props.t("woCdGroupManagement:woCdGroupManagement.label.listUnitCoordinator")}
                            </span>
                        </div>
                        <div className="card-header-actions card-header-search-actions-button">
                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openUnitPopup()} title={this.props.t("common:common.button.additional")}><i className="fa fa-plus"></i></Button>
                            <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.clearListUnit(this.state.listUnitChecked)} title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.remove")}><i className="fa fa-close"></i></Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <CustomReactTableLocal
                            columns={this.state.listUnitCoordinator.columns}
                            data={this.state.listDataUnitCoordinator}
                            isCheckbox={true}
                            loading={this.state.listUnitCoordinator.loading}
                            propsCheckbox={["unitId", "add"]}
                            defaultPageSize={5}
                            handleDataCheckbox={this.handleDataCheckboxListUnitCoordinator}
                        />
                    </CardBody>
                </Card>
            </Col>
        )
    }

    assignmentWorkCd = () => {
        return (
            <Col xs="12" sm="12">
                <Card>
                    <CardHeader>
                        <div style={{ float: 'left' }}>
                            <span className="mt-1">
                                {this.props.t("woCdGroupManagement:woCdGroupManagement.label.listWorkCoordinator")}
                            </span>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomMultiSelectTwoSides
                                    availableHeader={this.props.t("woCdGroupManagement:woCdGroupManagement.label.allWorkTypeList")}
                                    selectedHeader={this.props.t("woCdGroupManagement:woCdGroupManagement.label.chosenWorkTypeList")}
                                    options={this.state.cdWorkTypeList}
                                    value={this.state.valueWorkType}
                                    handleChange={this.handleChangeWorkType}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        )
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const marketList = (this.props.response.common.gnocCountry && this.props.response.common.gnocCountry.payload) ? this.props.response.common.gnocCountry.payload.data.data : []
        const { assignment, disable, listCdGroupType } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woCdGroupManagement:woCdGroupManagement.title.woCdGroupManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("woCdGroupManagement:woCdGroupManagement.title.woCdGroupManagementEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("woCdGroupManagement:woCdGroupManagement.title.woCdGroupManagementInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"woGroupType"}
                                                                    label={t("woCdGroupManagement:woCdGroupManagement.label.cdGroupLevel")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woCdGroupManagement:woCdGroupManagement.message.required.cdGroupLevel")}
                                                                    options={listCdGroupType}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectWoGroupType}
                                                                    selectValue={this.state.selectValueWoGroupType}
                                                                    isDisabled={disable}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="woGroupCode" label={t("woCdGroupManagement:woCdGroupManagement.label.cdGroupCode")} placeholder={t("woCdGroupManagement:woCdGroupManagement.placeholder.cdGroupCode")} required
                                                                    maxLength="50" disabled={disable} validate={{
                                                                        required: { value: true, errorMessage: t("woCdGroupManagement:woCdGroupManagement.message.required.cdGroupCode") },
                                                                        pattern: { value: '^([a-zA-Z0-9_]{1,50})?$', errorMessage: t("woCdGroupManagement:woCdGroupManagement.message.required.upperCdGroupCode") }
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="woGroupName" label={t("woCdGroupManagement:woCdGroupManagement.label.cdGroupName")} placeholder={t("woCdGroupManagement:woCdGroupManagement.placeholder.cdGroupName")} required
                                                                    maxLength="100" disabled={disable} validate={{ required: { value: true, errorMessage: t("woCdGroupManagement:woCdGroupManagement.message.required.cdGroupName") } }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"market"}
                                                                    label={t("woCdGroupManagement:woCdGroupManagement.label.market")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woCdGroupManagement:woCdGroupManagement.message.required.market")}
                                                                    options={marketList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeMarket}
                                                                    selectValue={this.state.selectValueMarket}
                                                                    isDisabled={disable}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="email" label={t("woCdGroupManagement:woCdGroupManagement.label.email")} placeholder={t("woCdGroupManagement:woCdGroupManagement.placeholder.email")}
                                                                    validate={{
                                                                        pattern: { value: '^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4})?$', errorMessage: t("woCdGroupManagement:woCdGroupManagement.message.required.email") }
                                                                    }}
                                                                    disabled={disable} maxLength="100" />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="mobile" label={t("woCdGroupManagement:woCdGroupManagement.label.phoneNumber")} placeholder={t("woCdGroupManagement:woCdGroupManagement.placeholder.phoneNumber")}
                                                                    validate={{
                                                                        pattern: { value: '^([0-9]{0,15})?$', errorMessage: t("woCdGroupManagement:woCdGroupManagement.message.required.phoneNumber") }
                                                                    }}
                                                                    disabled={disable} maxLength="15" />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {assignment === 'USER' ? this.assignmentUserCd() : assignment === 'UNIT' ? this.assignmentUnitCd() : assignment === 'WORK' ? this.assignmentWorkCd() : null}

                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
                <WoCdGroupManagementUserPopup
                    parentState={this.state}
                    closePopup={this.closeUserPopup}
                    setValue={this.setValueUserPopup}
                />
                <WoCdGroupManagementUnitPopup
                    parentState={this.state}
                    closePopup={this.closeUnitPopup}
                    setValue={this.setValueUnitPopup}
                />
            </div>
        );
    }
}

WoCdGroupManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woCdGroupManagement, common } = state;
    return {
        response: { woCdGroupManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoCdGroupManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoCdGroupManagementAddEdit));