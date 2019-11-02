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
import * as UtilityCrImpactFrameActions from './UtilityCrImpactFrameActions';
import {  CustomSticky, CustomAvField, CustomAppSwitch,CustomInputMultiLanguage,CustomSelectLocal } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';


class UtilityCrImpactFrameAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);
        this.handleChangeImpactFrameName = this.handleChangeImpactFrameName.bind(this);
        this.handleChangeIsEditable = this.handleChangeIsEditable.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            isUneditable: true,
            selectValueStatus:{},
            listCrImpactFrame:[],
            statusListSelect: [
                { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
            ],
            disabled:false
        };
    }

    componentDidMount() {
        if(this.state.isAddOrEdit==="EDIT"  || this.state.isAddOrEdit === 'COPY'){
            this.setState({
                isUneditable: !this.state.selectedData.isEditable,
                listCrImpactFrame: this.state.selectedData.listCrImpactFrame,
                selectValueStatus: {value:this.state.selectedData.isActive}
            })
            if (this.state.isAddOrEdit === "EDIT" && this.state.selectedData.isEditable === 0) {
                this.setState({
                    disabled: true
                })
            }
        }
        
    }
    componentWillMount(){
       
    }
    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            disabled:false
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        debugger
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityCrImpactFrame = Object.assign({}, values);
            utilityCrImpactFrame.impactFrameCode = utilityCrImpactFrame.impactFrameCode.trim();
            utilityCrImpactFrame.impactFrameName =  values['impactFrameName-multi-language'] ? values['impactFrameName-multi-language'].trim() : "";
            utilityCrImpactFrame.description = utilityCrImpactFrame.description.trim();
            utilityCrImpactFrame.isEditable = this.state.isUneditable ? 0: 1;
            utilityCrImpactFrame.isActive = this.state.selectValueStatus.value;
            utilityCrImpactFrame.listCrImpactFrame = this.state.listCrImpactFrame.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }))
            if(this.state.isAddOrEdit === "COPY") {
                utilityCrImpactFrame.impactFrameId = "";
            }
            
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
              
                this.props.actions.addUtilityCrImpactFrame(utilityCrImpactFrame).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityCrImpactFrame.impactFrameId = this.state.selectedData.impactFrameId;
                this.props.actions.editUtilityCrImpactFrame(utilityCrImpactFrame).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.edit"));
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

    
    handleChangeImpactFrameName(data) {
        this.setState({
            listCrImpactFrame: data
        });
    }
    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }
    handleChangeIsEditable = (checked) => {
        this.setState({
            isUneditable: checked
        });
    }
    render() {
        const { t } = this.props;
        const {disabled} = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listCrImpactFrame : [];
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityCrImpactFrame:utilityCrImpactFrame.title.utilityCrImpactFrameInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField 
                                                                    disabled = {disabled}
                                                                    name="impactFrameCode"
                                                                    label={t("utilityCrImpactFrame:utilityCrImpactFrame.label.frameCode")}
                                                                    placeholder={t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.frameCode")}
                                                                    required
                                                                    autoFocus maxLength="100"
                                                                    validate={{ required: {value : true, errorMessage: t("utilityCrImpactFrame:utilityCrImpactFrame.message.requiredFrameCode")}}}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomInputMultiLanguage
                                                                    isDisabled = {disabled}
                                                                    formId="idFormAddOrEdit"
                                                                    name="impactFrameName"
                                                                    label={t("utilityCrImpactFrame:utilityCrImpactFrame.label.frameName")}
                                                                    placeholder={t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.frameName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrImpactFrame:utilityCrImpactFrame.message.requiredFrameName")}
                                                                    maxLength={100}
                                                                    autoFocus={false}
                                                                    dataLanguageExchange={dataLanguageExchange}
                                                                    handleChange={this.handleChangeImpactFrameName}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField 
                                                                    disabled = {disabled}
                                                                    name="startTime"
                                                                    label={t("utilityCrImpactFrame:utilityCrImpactFrame.label.startTime")}
                                                                    placeholder={t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.startTime")}
                                                                    required                                                             
                                                                    validate={{ 
                                                                        pattern: { value: '^[0-9]+$', errorMessage: t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.number") },
                                                                        min: {value: 0, errorMessage: this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.startTimeError")},
                                                                        max: {value: 23, errorMessage: this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.startTimeError")},                                                                        
                                                                        required: {value : true, errorMessage: t("utilityCrImpactFrame:utilityCrImpactFrame.message.requiredStartTime")
                                                                    }}}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField
                                                                    disabled = {disabled}
                                                                    name="endTime"
                                                                    label={t("utilityCrImpactFrame:utilityCrImpactFrame.label.endTime")}
                                                                    placeholder={t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.endTime")}
                                                                    required                                                                  
                                                                    validate={{
                                                                        pattern: { value: '^[0-9]+$', errorMessage: t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.number") },
                                                                        min: {value: 0, errorMessage: this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.endTimeError")},
                                                                        max: {value: 23, errorMessage: this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.endTimeError")},                                                                        
                                                                        required: {value : true, errorMessage: t("utilityCrImpactFrame:utilityCrImpactFrame.message.requiredEndtime")
                                                                    }}}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField
                                                                    disabled = {disabled}
                                                                    name="description"
                                                                    label={t("utilityCrImpactFrame:utilityCrImpactFrame.label.description")}
                                                                    placeholder={t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.description")}
                                                                    maxLength="500"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    isDisabled ={disabled}                                                                 
                                                                    name={"isActive"}
                                                                    label={t("common:common.label.status")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrImpactFrame:utilityCrImpactFrame.message.requiredStatus")}
                                                                    options={this.state.statusListSelect}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                    selectValue={this.state.selectValueStatus}
                                                                />
                                                            </Col>
                                                           
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
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

UtilityCrImpactFrameAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityCrImpactFrame, common } = state;
    return {
        response: { utilityCrImpactFrame, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrImpactFrameActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrImpactFrameAddEdit));