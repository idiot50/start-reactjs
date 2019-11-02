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
import * as UtilityCrActionCodeActions from './UtilityCrActionCodeActions';
import { CustomAppSwitch, CustomSticky, CustomAvField,CustomSelectLocal } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityCrActionCodeAddEdit extends Component {
    constructor(props) {
        super(props);
  
        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleChangeIsEditable = this.handleChangeIsEditable.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this)
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueOdGroupTypeId: {},
            selectValueStatus: {},
            isUneditable: true,
            statusListSelect: [
                { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
            ],
            disabled:false,
        };
    }

    componentDidMount() {
        if(this.state.isAddOrEdit ==="EDIT" || this.state.isAddOrEdit ==="COPY"){
            this.setState({
                isUneditable: (!this.state.selectedData.isEditable),
                selectValueStatus: {value:this.state.selectedData.isActive}
            });
            if (this.state.isAddOrEdit === "EDIT" && this.state.selectedData.isEditable === 0) {
                this.setState({
                    disabled: true
                })
            }
        }else if(this.state.isAddOrEdit ==="ADD"){
            this.setState({
                 selectedData:null
            });
        }
     
    }
   
    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            disabled:false
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityCrActionCode = Object.assign({}, values);
            utilityCrActionCode.isEditable = this.state.isUneditable ? 0 : 1;
            utilityCrActionCode.isActive = this.state.selectValueStatus.value;
            utilityCrActionCode.crActionCode = utilityCrActionCode.crActionCode.trim();
            utilityCrActionCode.crActionCodeTittle = utilityCrActionCode.crActionCodeTittle.trim();
            if(this.state.isAddOrEdit === "COPY") {
                utilityCrActionCode.crActionCodeId = "";
            }
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityCrActionCode(utilityCrActionCode).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrActionCode:utilityCrActionCode.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                            
                        } catch (error) {
                            toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityCrActionCode.crActionCodeId = this.state.selectedData.crActionCodeId;
                this.props.actions.editUtilityCrActionCode(utilityCrActionCode).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrActionCode:utilityCrActionCode.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.edit"));
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

    handleChangeIsEditable = (checked) => {
        this.setState({
            isUneditable: checked
        });
    }
    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }

    render() {
        const { t } = this.props;
        const {disabled} = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityCrActionCode:utilityCrActionCode.title.utilityCrActionCodeAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityCrActionCode:utilityCrActionCode.title.utilityCrActionCodeEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                hidden={(this.state.isAddOrEdit === "EDIT") ? ((this.state.selectedData && this.state.selectedData.isEditable === 1) ? false : true) : false}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityCrActionCode:utilityCrActionCode.title.utilityCrActionCodeInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField 
                                                                    disabled = {disabled}
                                                                    name="crActionCode"
                                                                    label={t("utilityCrActionCode:utilityCrActionCode.label.actionCode")}
                                                                    placeholder={t("utilityCrActionCode:utilityCrActionCode.placeholder.actionCode")}
                                                                    required
                                                                    autoFocus maxLength="400"
                                                                    validate={{required: {value: true, errorMessage: t("utilityCrActionCode:utilityCrActionCode.message.requiredActionCode")}}}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField 
                                                                    disabled ={disabled}                                                                 
                                                                    name="crActionCodeTittle"
                                                                    label={t("utilityCrActionCode:utilityCrActionCode.label.actionCodeTitle")}
                                                                    placeholder={t("utilityCrActionCode:utilityCrActionCode.placeholder.actionCodeTitle")}
                                                                    required
                                                                    maxLength="400"
                                                                    validate={{required: {value: true, errorMessage: t("utilityCrActionCode:utilityCrActionCode.message.requiredActionCodeTitle")}}}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    isDisabled ={disabled}                                                                 
                                                                    name={"isActive"}
                                                                    label={t("common:common.label.status")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigReturnAction:utilityConfigReturnAction.message.requiredReturnCategory")}
                                                                    options={this.state.statusListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                    selectValue={this.state.selectValueStatus}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                        <Col xs="12" sm="12">
                                                                <CustomAppSwitch 
                                                                    isDisabled = {disabled}
                                                                    name={"isEditable"}
                                                                    label={t("utilityCrActionCode:utilityCrActionCode.label.isEditable")}
                                                                    checked={this.state.isUneditable}
                                                                    handleChange={this.handleChangeIsEditable}
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

UtilityCrActionCodeAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityCrActionCode, common } = state;
    return {
        response: { utilityCrActionCode, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrActionCodeActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrActionCodeAddEdit));