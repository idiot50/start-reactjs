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
import * as UtilityGroupDepartmentConfigActions from './UtilityGroupDepartmentConfigActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomAutocomplete, CustomSelect } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityGroupDepartmentConfigAddEdit extends Component {
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
            //Table
            data: [],
            //Select
            selectValueUnitName: {},
            selectValueGroupUnitName: {}
        };
    }

    componentDidMount() {
        //get combobox
        if ((this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY")) {
            this.setState({
                selectValueGroupUnitName: this.state.selectedData.groupUnitId ? { value: this.state.selectedData.groupUnitId } : {},
                selectValueUnitName: this.state.selectedData.unitId ? { value: this.state.selectedData.unitId } : {}
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
            values.groupUnitId = this.state.selectValueGroupUnitName ? this.state.selectValueGroupUnitName.value : null;
            values.unitId = this.state.selectValueUnitName ? this.state.selectValueUnitName.value : null;
            const utilityGroupDepartmentConfig = Object.assign({}, values);

            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityGroupDepartmentConfig.groupUnitDetailId = "";
                }
                this.props.actions.addUtilityGroupDepartmentConfig(utilityGroupDepartmentConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.add"));
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
                            toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityGroupDepartmentConfig.groupUnitDetailId = this.state.selectedData.groupUnitDetailId;
                this.props.actions.editUtilityGroupDepartmentConfig(utilityGroupDepartmentConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.edit"));
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
                            toastr.error(this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.error.edit"));
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

    handleItemSelectChangeUnitName = (option) => {
        this.setState({ selectValueUnitName: option });
    }
    handleItemSelectChangeGroupUnitName = (option) => {
        this.setState({ selectValueGroupUnitName: option });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};

        const { columns } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.title.utilityGroupDepartmentConfigAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.title.utilityGroupDepartmentConfigEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.title.utilityGroupDepartmentConfigInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAutocomplete
                                                                    name={"unitName"}
                                                                    label={t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.label.unitName")}
                                                                    placeholder={this.props.t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.placeholder.unitName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.requiredUnitName")}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleItemSelectChangeUnitName}
                                                                    selectValue={this.state.selectValueUnitName}
                                                                    moduleName={"UNIT"}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelect
                                                                    name={"groupUnitName"}
                                                                    label={t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.label.groupUnitName")}
                                                                    isRequired={true}
                                                                    closeMenuOnSelect={true}
                                                                    messageRequire={t("utilityGroupDepartmentConfig:utilityGroupDepartmentConfig.message.requiredGroupUnitName")}
                                                                    handleItemSelectChange={this.handleItemSelectChangeGroupUnitName}
                                                                    selectValue={this.state.selectValueGroupUnitName}
                                                                    moduleName={"GNOC_CR_GROUP_UNIT"}
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

UtilityGroupDepartmentConfigAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityGroupDepartmentConfig, common } = state;
    return {
        response: { utilityGroupDepartmentConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityGroupDepartmentConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityGroupDepartmentConfigAddEdit));