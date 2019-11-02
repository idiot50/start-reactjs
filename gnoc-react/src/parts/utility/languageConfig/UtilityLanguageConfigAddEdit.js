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
import * as UtilityLanguageConfigActions from './UtilityLanguageConfigActions';
import { CustomSelectFlag, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class UtilityLanguageConfigAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeFlag = this.handleItemSelectChangeFlag.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            data: [],
            selectValueGnocLanguageId: {},
            selectValueFlag: {}
        };
    }

    componentDidMount() {
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                selectValueFlag: this.state.selectedData.languageFlag ? { value: this.state.selectedData.languageFlag } : {}
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
            const utilityLanguageConfig = Object.assign({}, values);
            if (this.state.isAddOrEdit === "COPY") {
                utilityLanguageConfig.gnocLanguageId = "";
            }
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                utilityLanguageConfig.languageFlag = this.state.selectValueFlag.value;
                this.props.actions.addUtilityLanguageConfig(utilityLanguageConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.add"));
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
                            toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityLanguageConfig.gnocLanguageId = this.state.selectedData.gnocLanguageId;
                utilityLanguageConfig.languageFlag = this.state.selectValueFlag.value;
                this.props.actions.editUtilityLanguageConfig(utilityLanguageConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.edit"));
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
                            toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.edit"));
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

    handleItemSelectChangeFlag(option) {
        this.setState({ selectValueFlag: option });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityLanguageConfig:utilityLanguageConfig.title.utilityLanguageConfigAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityLanguageConfig:utilityLanguageConfig.title.utilityLanguageConfigEdit") : ''}
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
                                                <Card style={{ border: 'none' }}>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectFlag
                                                                    name={"languageFlag"}
                                                                    label={t("utilityLanguageConfig:utilityLanguageConfig.label.flag")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityLanguageConfig:utilityLanguageConfig.message.requiredUtilityFlag")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeFlag}
                                                                    selectValue={this.state.selectValueFlag}
                                                                    autoFocus={true}
                                                                />
                                                            </Col>

                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="languageKey" label={t("utilityLanguageConfig:utilityLanguageConfig.label.key")} placeholder={t("utilityLanguageConfig:utilityLanguageConfig.placeholder.key")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityLanguageConfig:utilityLanguageConfig.message.requiredUtilityKey") } }} />
                                                            </Col>

                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="languageName" label={t("utilityLanguageConfig:utilityLanguageConfig.label.name")} placeholder={t("utilityLanguageConfig:utilityLanguageConfig.placeholder.name")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityLanguageConfig:utilityLanguageConfig.message.requiredUtilityName") } }} />
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

UtilityLanguageConfigAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityLanguageConfig, common } = state;
    return {
        response: { utilityLanguageConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityLanguageConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityLanguageConfigAddEdit));