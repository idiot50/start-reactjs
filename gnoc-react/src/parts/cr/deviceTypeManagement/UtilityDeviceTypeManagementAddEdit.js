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
import * as UtilityDeviceTypeManagementActions from './UtilityDeviceTypeManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomFroalaEditor, CustomInputMultiLanguage } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityDeviceTypeManagementAddEdit extends Component {
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
            listDeviceTypeName: []
        };
    }

    componentDidMount() {
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                listDeviceTypeName: this.state.selectedData.listDeviceTypeName || []
            })
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
            const utilityDeviceTypeManagement = Object.assign({}, values);
            utilityDeviceTypeManagement.listDeviceTypeName = this.state.listDeviceTypeName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }));
            utilityDeviceTypeManagement.isActive = 1;
            utilityDeviceTypeManagement.deviceTypeCode = utilityDeviceTypeManagement.deviceTypeCode ? utilityDeviceTypeManagement.deviceTypeCode.trim() : "";
            utilityDeviceTypeManagement.deviceTypeName = utilityDeviceTypeManagement['deviceTypeName-multi-language'] ? utilityDeviceTypeManagement['deviceTypeName-multi-language'].trim() : "";
            utilityDeviceTypeManagement.description = utilityDeviceTypeManagement.description ? utilityDeviceTypeManagement.description.trim() : "";
            
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityDeviceTypeManagement.deviceTypeId = "";
                }
                this.props.actions.addUtilityDeviceTypeManagement(utilityDeviceTypeManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.error.add"));
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
                            toastr.error(this.props.t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityDeviceTypeManagement.deviceTypeId = this.state.selectedData.deviceTypeId;
                this.props.actions.editUtilityDeviceTypeManagement(utilityDeviceTypeManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.error.edit"));
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
                            toastr.error(this.props.t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.error.edit"));
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

    handleChangeListDeviceTypeName = (data) => {
        this.setState({
            listDeviceTypeName: data
        });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listDeviceTypeName : [];
        const { columns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.title.utilityDeviceTypeManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.title.utilityDeviceTypeManagementEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.title.utilityDeviceTypeManagementInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField name="deviceTypeCode" label={t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.label.deviceTypeId")} placeholder={t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.placeholder.deviceTypeId")} required
                                                                    autoFocus maxLength="100" validate={{ required: { value: true, errorMessage: t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.requiredDeviceTypeId") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomInputMultiLanguage
                                                                    formId="idFormAddOrEdit"
                                                                    name="deviceTypeName"
                                                                    label={t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.label.deviceType")}
                                                                    placeholder={t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.placeholder.deviceType")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.message.requiredDeviceType")}
                                                                    maxLength={600}
                                                                    autoFocus={false}
                                                                    dataLanguageExchange={dataLanguageExchange}
                                                                    handleChange={this.handleChangeListDeviceTypeName}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <CustomAvField type="textarea" rows="3" name="description" maxLength="200"
                                                                    label={t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.label.description")}
                                                                    placeholder={t("utilityDeviceTypeManagement:utilityDeviceTypeManagement.placeholder.description")}
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
            </div>
        );
    }
}

UtilityDeviceTypeManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityDeviceTypeManagement, common } = state;
    return {
        response: { utilityDeviceTypeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityDeviceTypeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityDeviceTypeManagementAddEdit));