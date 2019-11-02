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
import * as UtilityRolesManagementActions from './UtilityRolesManagementActions';
import { CustomFroalaEditor, CustomSelectLocal, CustomSticky, CustomAvField, CustomInputMultiLanguage } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityRolesManagementAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            statusListSelect: [
                { itemId: 1, itemName: props.t("utilityRolesManagement:utilityRolesManagement.dropdown.status.active") },
                { itemId: 0, itemName: props.t("utilityRolesManagement:utilityRolesManagement.dropdown.status.inActive") }
            ],
            isEmergencyList: [
                { itemId: 1, itemName: props.t("utilityRolesManagement:utilityRolesManagement.dropdown.emergency.yes") },
                { itemId: 0, itemName: props.t("utilityRolesManagement:utilityRolesManagement.dropdown.emergency.no") }
            ],
            selectValueStatus: {},
            selectValueIsScheduleCrEmergency: {},
            listRoleName: []
        };
    }

    componentDidMount() {
        //get combobox
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueIsScheduleCrEmergency: this.state.selectedData.isScheduleCrEmergency ? { value: this.state.selectedData.isScheduleCrEmergency } : {},
                selectValueStatus: this.state.selectedData.status ? { value: this.state.selectedData.status } : {},
                listRoleName: this.state.selectedData.listRoleName || []
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });

    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityRolesManagement = Object.assign({}, values);
            utilityRolesManagement.isScheduleCrEmergency = this.state.selectValueIsScheduleCrEmergency ? this.state.selectValueIsScheduleCrEmergency.value : null;
            utilityRolesManagement.status = this.state.selectValueStatus ? this.state.selectValueStatus.value : null;
            utilityRolesManagement.listRoleName =  this.state.listRoleName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }));
            utilityRolesManagement.cmreCode = utilityRolesManagement.cmreCode ? utilityRolesManagement.cmreCode.trim() : "";
            utilityRolesManagement.cmreName = utilityRolesManagement['cmreName-multi-language'] ? utilityRolesManagement['cmreName-multi-language'].trim() : "";
            utilityRolesManagement.description = utilityRolesManagement.description ? utilityRolesManagement.description.trim() : "";
            delete utilityRolesManagement.processTime;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityRolesManagement.cmreId = "";
                }
                this.props.actions.addUtilityRolesManagement(utilityRolesManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityRolesManagement:utilityRolesManagement.message.success.add"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.duplicate"))
                        })
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.add"));
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
                            toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityRolesManagement.cmreId = this.state.selectedData.cmreId;
                this.props.actions.editUtilityRolesManagement(utilityRolesManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityRolesManagement:utilityRolesManagement.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.edit"));
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
                            toastr.error(this.props.t("utilityRolesManagement:utilityRolesManagement.message.error.edit"));
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

    handleItemSelectChangeIsScheduleCrEmergency = (option) => {
        this.setState({ selectValueIsScheduleCrEmergency: option });
    }

    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }
    handleChangeListRoleName = (option) => {
        this.setState({ listRoleName: option });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listRoleName : [];
        const { columns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityRolesManagement:utilityRolesManagement.title.utilityRolesManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityRolesManagement:utilityRolesManagement.title.utilityRolesManagementEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityRolesManagement:utilityRolesManagement.title.utilityRolesManagementInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField name="cmreCode" label={t("utilityRolesManagement:utilityRolesManagement.label.roleCode")} placeholder={t("utilityRolesManagement:utilityRolesManagement.placeholder.roleCode")} required
                                                                    autoFocus maxLength="200" validate={{ required: { value: true, errorMessage: t("utilityRolesManagement:utilityRolesManagement.message.requiredRoleCode") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomInputMultiLanguage
                                                                    formId="idFormAddOrEdit"
                                                                    name="cmreName"
                                                                    label={t("utilityRolesManagement:utilityRolesManagement.label.roleName")}
                                                                    placeholder={t("utilityRolesManagement:utilityRolesManagement.placeholder.roleName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityRolesManagement:utilityRolesManagement.message.requiredRoleName")}
                                                                    maxLength={200}
                                                                    autoFocus={false}
                                                                    dataLanguageExchange={dataLanguageExchange}
                                                                    handleChange={this.handleChangeListRoleName}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"status"}
                                                                    label={t("utilityRolesManagement:utilityRolesManagement.label.status")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityRolesManagement:utilityRolesManagement.message.requiredStatus")}
                                                                    options={this.state.statusListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                    selectValue={this.state.selectValueStatus}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"isScheduleCrEmergency"}
                                                                    label={t("utilityRolesManagement:utilityRolesManagement.label.roleCr")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityRolesManagement:utilityRolesManagement.message.requiredRoleCr")}
                                                                    options={this.state.isEmergencyList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeIsScheduleCrEmergency}
                                                                    selectValue={this.state.selectValueIsScheduleCrEmergency}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomAvField type="textarea" rows="3" name="description" maxLength="200"
                                                                    label={t("utilityRolesManagement:utilityRolesManagement.label.description")}
                                                                />
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
            </div >
        );
    }
}

UtilityRolesManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityRolesManagement, common } = state;
    return {
        response: { utilityRolesManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityRolesManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityRolesManagementAddEdit));