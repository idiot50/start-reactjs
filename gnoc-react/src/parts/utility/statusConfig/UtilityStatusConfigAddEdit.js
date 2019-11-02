import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityStatusConfigActions from './UtilityStatusConfigActions';
import { CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class UtilityStatusConfigAddEdit extends Component {
    constructor(props) {
        super(props);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueBeginState: {},
            selectValueEndState: {},
            selectValueProcess: {},
            stateList: [],
        };
    }

    componentDidMount() {
        this.props.actions.getListProcess();
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.props.actions.getListState(this.state.selectedData.process).then((response) => {
                this.setState({
                    stateList: response.payload.data,
                    selectValueBeginState: this.state.selectedData.beginStateId ? { value: this.state.selectedData.beginStateId } : {},
                    selectValueEndState: this.state.selectedData.endStateId ? { value: this.state.selectedData.endStateId } : {},
                    selectValueProcess: this.state.selectedData.process ? { value: this.state.selectedData.process } : {},
                })
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityStatusConfig = Object.assign({}, values);
            utilityStatusConfig.beginStateId = (this.state.selectValueBeginState && this.state.selectValueBeginState.value) ? this.state.selectValueBeginState.value : "";
            utilityStatusConfig.endStateId = (this.state.selectValueEndState && this.state.selectValueEndState.value) ? this.state.selectValueEndState.value : "";
            utilityStatusConfig.process = (this.state.selectValueProcess && this.state.selectValueProcess.value) ? this.state.selectValueProcess.value : "";
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === 'COPY') {
                this.props.actions.addUtilityStatusConfig(utilityStatusConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityStatusConfig:utilityStatusConfig.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.add"));
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
                            toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityStatusConfig.id = this.state.selectedData.id;
                this.props.actions.editUtilityStatusConfig(utilityStatusConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityStatusConfig:utilityStatusConfig.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.edit"));
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
                            toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.edit"));
                        }
                    });
                });
            }
        });
    }

    handleItemSelectChangeProcess = (option) => {
        this.setState({ selectValueProcess: option });
        if (option && option.value) {
            this.props.actions.getListState(option.value).then((response) => {
                this.setState({
                    selectValueBeginState: {},
                    selectValueEndState: {},
                    stateList: response.payload.data
                })
            })

        }
    }

    handleItemSelectChangeBeginState = (option) => {
        this.setState({ selectValueBeginState: option });
    }

    handleItemSelectChangeEndState = (option) => {
        this.setState({ selectValueEndState: option });
    }

    render() {
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityStatusConfig:utilityStatusConfig.title.utilityStatusConfigAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityStatusConfig:utilityStatusConfig.title.utilityStatusConfigEdit") : ''}
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
                                <Collapse isOpen={true} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("utilityStatusConfig:utilityStatusConfig.title.utilityStatusConfigInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"process"}
                                                                    label={t("utilityStatusConfig:utilityStatusConfig.label.procedure")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityStatusConfig:utilityStatusConfig.message.requiredProcedure")}
                                                                    options={(this.props.response.utilityStatusConfig.listProcess && this.props.response.utilityStatusConfig.listProcess.payload) ? this.props.response.utilityStatusConfig.listProcess.payload.data : []}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeProcess}
                                                                    selectValue={this.state.selectValueProcess}
                                                                    autoFocus={true}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"beginStateId"}
                                                                    label={t("utilityStatusConfig:utilityStatusConfig.label.initialStatus")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityStatusConfig:utilityStatusConfig.message.requiredInitialStatus")}
                                                                    options={this.state.stateList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeBeginState}
                                                                    selectValue={this.state.selectValueBeginState}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"endStateId"}
                                                                    label={t("utilityStatusConfig:utilityStatusConfig.label.lastStatus")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityStatusConfig:utilityStatusConfig.message.requiredLastStatus")}
                                                                    options={this.state.stateList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeEndState}
                                                                    selectValue={this.state.selectValueEndState}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField name="description" label={t("utilityStatusConfig:utilityStatusConfig.label.description")} placeholder={t("utilityStatusConfig:utilityStatusConfig.placeholder.description")} required
                                                                    maxLength="250" validate={{ required: { value: true, errorMessage: t("utilityStatusConfig:utilityStatusConfig.message.requiredDescription") } }} />
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

UtilityStatusConfigAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { utilityStatusConfig, common } = state;
    return {
        response: { utilityStatusConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityStatusConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityStatusConfigAddEdit));