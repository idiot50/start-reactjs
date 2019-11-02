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
import * as UtilityDepartmentsRolesManagementActions from './UtilityDepartmentsRolesManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomAutocomplete } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityDepartmentsRolesManagementAddEdit extends Component {
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
            selectValueCmreName: {},
            crList : [],
            selectValueUnitName: {}
        };
    }

    componentDidMount() {
        this.props.actions.getListCrName({}).then((response) => {
            const listCr = response.payload ? response.payload.data.map(e => ({itemName: e.cmreName,itemId: e.cmreId})) : [];
            this.setState({
                crList: listCr
            });
        });
        //get combobox
        if ((this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") && this.state.selectedData) {
            this.setState({
                selectValueCmreName: this.state.selectedData.cmreId ? { value: this.state.selectedData.cmreId } : {},
                selectValueUnitName: this.state.selectedData.unitId ? { value: this.state.selectedData.unitId } : {}
            });
        }
        
       console.log(this.state.selectValueUnitName);
        
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
            values.unitId = this.state.selectValueUnitName.value;
            values.cmreId = this.state.selectValueCmreName.value;
            const utilityDepartmentsRolesManagement = Object.assign({} ,values);

            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityDepartmentsRolesManagement.cmroutId = "";
                }
                this.props.actions.addUtilityDepartmentsRolesManagement(utilityDepartmentsRolesManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.add"));
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
                            toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityDepartmentsRolesManagement.cmroutId = this.state.selectedData.cmroutId;
                this.props.actions.editUtilityDepartmentsRolesManagement(utilityDepartmentsRolesManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.edit"));
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
                            toastr.error(this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.error.edit"));
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

    handleItemSelectChangeCrmeName = (option) => {
        this.setState({ selectValueCmreName: option });
    }

    handleItemSelectChangeUnitName = (option) => {
        this.setState({ selectValueUnitName: option });
    }

    render() {
        console.log(this.state.selectValueCmreName);
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
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.title.utilityDepartmentsRolesManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.title.utilityDepartmentsRolesManagementEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.title.utilityDepartmentsRolesManagementInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAutocomplete
                                                                    name={"unitName"}
                                                                    label={t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.label.unitName")}
                                                                    placeholder={this.props.t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.placeholder.unitName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.requiredUnitName")}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleItemSelectChangeUnitName}
                                                                    selectValue={this.state.selectValueUnitName}
                                                                    moduleName={"UNIT"}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"cmreName"}
                                                                    label={t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.label.roleName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityDepartmentsRolesManagement:utilityDepartmentsRolesManagement.message.requiredRoleName")}
                                                                    options={this.state.crList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeCrmeName}
                                                                    selectValue={this.state.selectValueCmreName}
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

UtilityDepartmentsRolesManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityDepartmentsRolesManagement, common } = state;
    return {
        response: { utilityDepartmentsRolesManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityDepartmentsRolesManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityDepartmentsRolesManagementAddEdit));