import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup, AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityGroupUnitActions from './UtilityGroupUnitActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomInputMultiLanguage } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, renderRequired } from '../../../containers/Utils/Utils';

class UtilityGroupUnitAddEdit extends Component {
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
            listGroupUnitName: []
        };
    }

    componentDidMount() {
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                listGroupUnitName: this.state.selectedData.listGroupUnitName || []
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
            const utilityGroupUnit = Object.assign({}, values);
            utilityGroupUnit.groupUnitCode = values.groupUnitCode ? values.groupUnitCode.trim() : "";
            utilityGroupUnit.groupUnitName = values['groupUnitName-multi-language'] ? values['groupUnitName-multi-language'].trim() : "";
            utilityGroupUnit.listGroupUnitName = this.state.listGroupUnitName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }));
            utilityGroupUnit.isActive = 1;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityGroupUnit(utilityGroupUnit).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityGroupUnit:utilityGroupUnit.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.add"));
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
                            toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityGroupUnit.groupUnitId = this.state.selectedData.groupUnitId;
                this.props.actions.editUtilityGroupUnit(utilityGroupUnit).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityGroupUnit:utilityGroupUnit.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.edit"));
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
                            toastr.error(this.props.t("utilityGroupUnit:utilityGroupUnit.message.error.edit"));
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

    handleChangeListGroupUnitName = (data) => {
        this.setState({
            listGroupUnitName: data
        })
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listGroupUnitName : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityGroupUnit:utilityGroupUnit.title.utilityGroupUnitAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityGroupUnit:utilityGroupUnit.title.utilityGroupUnitEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityGroupUnit:utilityGroupUnit.title.utilityGroupUnitInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="6" sm="6">
                                                                <CustomAvField name="groupUnitCode" label={t("utilityGroupUnit:utilityGroupUnit.label.utilityGroupUnitCode")} placeholder={t("utilityGroupUnit:utilityGroupUnit.placeholder.utilityGroupUnitCode")} required
                                                                    autoFocus maxLength="100" validate={{ required: { value: true, errorMessage: t("utilityGroupUnit:utilityGroupUnit.message.requiredGroupUnitCode") } }} />
                                                            </Col>

                                                            <Col xs="6" sm="6">
                                                                <CustomInputMultiLanguage
                                                                    formId="idFormAddOrEdit"
                                                                    name="groupUnitName"
                                                                    label={t("utilityGroupUnit:utilityGroupUnit.label.utilityGroupUnitName")}
                                                                    placeholder={t("utilityGroupUnit:utilityGroupUnit.placeholder.utilityGroupUnitName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityGroupUnit:utilityGroupUnit.message.requiredGroupUnitName")}
                                                                    maxLength={200}
                                                                    autoFocus={false}
                                                                    dataLanguageExchange={dataLanguageExchange}
                                                                    handleChange={this.handleChangeListGroupUnitName}
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

UtilityGroupUnitAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityGroupUnit, common } = state;
    return {
        response: { utilityGroupUnit, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityGroupUnitActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityGroupUnitAddEdit));