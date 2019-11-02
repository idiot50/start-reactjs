import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomAvField, CustomSticky, CustomInputMultiLanguage } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityScopesManagementActions from './UtilityScopesManagementActions';

class UtilityScopesManagementAddEdit extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            listCmseName: []
        };
    }

    componentWillMount() {
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                listCmseName: this.state.selectedData.listCmseName
            });
        }
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityScopesManagement = Object.assign({}, values);
            utilityScopesManagement.listCmseName = this.state.listCmseName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }))
            utilityScopesManagement.isActive = 1;
            utilityScopesManagement.cmseCode = utilityScopesManagement.cmseCode ? utilityScopesManagement.cmseCode.trim() : "";
            utilityScopesManagement.description = utilityScopesManagement.description ? utilityScopesManagement.description.trim() : "";
            utilityScopesManagement.cmseName = utilityScopesManagement['cmseName-multi-language'] ? utilityScopesManagement['cmseName-multi-language'].trim() : "";
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityScopesManagement.cmseId = "";
                }
                this.props.actions.addUtilityScopesManagement(utilityScopesManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityScopesManagement:utilityScopesManagement.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.add"));
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
                            toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityScopesManagement.cmseId = this.state.selectedData.cmseId;
                this.props.actions.editUtilityScopesManagement(utilityScopesManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityScopesManagement:utilityScopesManagement.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.edit"));
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
                            toastr.error(this.props.t("utilityScopesManagement:utilityScopesManagement.message.error.edit"));
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

    handleChangeListRoleName = (option) => {
        this.setState({ listCmseName: option})
    }

    render() {
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listCmseName : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityScopesManagement:utilityScopesManagement.title.utilityScopesManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityScopesManagement:utilityScopesManagement.title.utilityScopesManagementEdit") : ''}
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
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <Card>
                                                <CardHeader>
                                                    <i className="fa fa-align-justify"></i>{t("utilityScopesManagement:utilityScopesManagement.title.utilityScopesManagementInfo")}
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomAvField name="cmseCode" label={t("utilityScopesManagement:utilityScopesManagement.label.rangeCode")} placeholder={t("utilityScopesManagement:utilityScopesManagement.placeholder.rangeCode")} required
                                                                maxLength="100" validate={{
                                                                    required: { value: true, errorMessage: t("utilityScopesManagement:utilityScopesManagement.message.requiredRangeCode") }
                                                                }} />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomInputMultiLanguage
                                                                formId="idFormAddOrEdit"
                                                                name="cmseName"
                                                                label={t("utilityScopesManagement:utilityScopesManagement.label.rangeName")}
                                                                placeholder={t("utilityScopesManagement:utilityScopesManagement.placeholder.rangeName")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityScopesManagement:utilityScopesManagement.message.requiredRangeName")}
                                                                maxLength={200}
                                                                autoFocus={false}
                                                                dataLanguageExchange={dataLanguageExchange}
                                                                handleChange={this.handleChangeListRoleName}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12">
                                                            <CustomAvField type="textarea"
                                                                rows="3" name="description" maxLength="1000"
                                                                label={t("utilityScopesManagement:utilityScopesManagement.label.description")} placeholder={t("utilityScopesManagement:utilityScopesManagement.placeholder.description")} />
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

UtilityScopesManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityScopesManagement, common } = state;
    return {
        response: { utilityScopesManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityScopesManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityScopesManagementAddEdit));