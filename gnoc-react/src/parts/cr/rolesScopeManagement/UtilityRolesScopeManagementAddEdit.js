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
import * as UtilityRolesScopeManagementActions from './UtilityRolesScopeManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityRolesScopeManagementAddEdit extends Component {
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
            //combobox
            listManagerScope: [],
            listManagerRole: [],
            //Select
            selectValueScope: {},
            selectValueRole: {}
        };
    }

    componentWillMount() {
        //get combobox
        this.props.actions.getListManagerScopeCBB().then((response) => {
            const listScope = response.payload.data && response.payload.data.map(i => ({ itemId: i.cmseId, itemName: i.cmseName }))
            this.setState({
                listManagerScope: listScope
            })
        });
        this.props.actions.getListCrManagerRolesCBB().then((response) => {
            const listRoles = response.payload.data && response.payload.data.map(i => ({ itemId: i.cmreId, itemName: i.cmreName }))
            this.setState({
                listManagerRole: listRoles
            })
        });
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                selectValueRole: this.state.selectedData.cmreName ? { label: this.state.selectedData.cmreName, value: this.state.selectedData.cmreId } : {},
                selectValueScope: this.state.selectedData.cmseName ?{ label: this.state.selectedData.cmseName, value: this.state.selectedData.cmseId } : {}
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
            const utilityRolesScopeManagement = Object.assign({}, values);
            utilityRolesScopeManagement.cmseName = this.state.selectValueScope.label || "";
            utilityRolesScopeManagement.cmseId = this.state.selectValueScope.value || "";
            utilityRolesScopeManagement.cmreId = this.state.selectValueRole.value || "";
            utilityRolesScopeManagement.cmreName = this.state.selectValueRole.label || "";
            if (this.state.isAddOrEdit === "COPY") {
                utilityRolesScopeManagement.cmsorsId = "";
                utilityRolesScopeManagement.cmsorsName = "";
            }
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityRolesScopeManagement(utilityRolesScopeManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.success.add"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.duplicate"));
                        });
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityRolesScopeManagement.cmsorsId = this.state.selectedData.cmsorsId;
                this.props.actions.editUtilityRolesScopeManagement(utilityRolesScopeManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.success.edit"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.duplicate"));
                        });
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.edit"));
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
                            toastr.error(this.props.t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.error.edit"));
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

    handleItemSelectChangeRole = (option) => {
        this.setState({ selectValueRole: option });
    }

    handleItemSelectChangeScope = (option) => {
        this.setState({ selectValueScope: option });
    }

    render() {
        const { t, response } = this.props;
        const { listManagerRole, listManagerScope } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityRolesScopeManagement:utilityRolesScopeManagement.title.utilityRolesScopeManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityRolesScopeManagement:utilityRolesScopeManagement.title.utilityRolesScopeManagementEdit") : ''}
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
                                                <Row>
                                                    <Col xs="12" sm="6">
                                                        <CustomSelectLocal
                                                            name={"scope"}
                                                            label={t("utilityRolesScopeManagement:utilityRolesScopeManagement.label.scope")}
                                                            isRequired={true}
                                                            messageRequire={t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.scope")}
                                                            options={listManagerScope}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeScope}
                                                            selectValue={this.state.selectValueScope}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="6">
                                                        <CustomSelectLocal
                                                            name={"role"}
                                                            label={t("utilityRolesScopeManagement:utilityRolesScopeManagement.label.role")}
                                                            isRequired={true}
                                                            messageRequire={t("utilityRolesScopeManagement:utilityRolesScopeManagement.message.role")}
                                                            options={listManagerRole}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeRole}
                                                            selectValue={this.state.selectValueRole}
                                                        />
                                                    </Col>
                                                </Row>
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

UtilityRolesScopeManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityRolesScopeManagement, common } = state;
    return {
        response: { utilityRolesScopeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityRolesScopeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityRolesScopeManagementAddEdit));