import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomAppSwitch, CustomAvField, CustomSelectLocal, CustomSticky } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigReturnActionActions from './UtilityConfigReturnActionActions';

class UtilityConfigReturnActionAddEdit extends Component {
    constructor(props) {
        super(props);

        this.handleChangeIsEditable = this.handleChangeIsEditable.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeReturnCategory = this.handleItemSelectChangeReturnCategory.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this)

        this.state = {
            btnAddOrEditLoading: false,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueReturnCategory: {},
            selectValueStatus: {},
            isUneditable: true,
            returnCategorySelect:[],
            statusListSelect: [
                { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
            ],
            disabled:false
        };
    }
    componentWillMount(){
      
    }
    componentDidMount() {
        this.props.actions.getItemMaster("CR_RETURN_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
            
            let returnCategorySelect = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(i => ({itemId:i.itemValue,itemName:i.itemName})) : []
            this.setState({
                returnCategorySelect
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.search"));
        });
        if(this.state.isAddOrEdit ==="EDIT" || this.state.isAddOrEdit ==="COPY"){
            this.setState({
                isUneditable: (!this.state.selectedData.isEditable),
                selectValueStatus: {value:this.state.selectedData.isActive},
                selectValueReturnCategory : {value:this.state.selectedData.returnCategory}
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
            values.returnCategory = this.state.selectValueReturnCategory.value;
            const utilityConfigReturnAction = Object.assign({}, values);
            utilityConfigReturnAction.isEditable = this.state.isUneditable ? 0 : 1;
            utilityConfigReturnAction.isActive = this.state.selectValueStatus.value;
            utilityConfigReturnAction.returnCode = utilityConfigReturnAction.returnCode.trim();
            utilityConfigReturnAction.returnTitle = utilityConfigReturnAction.returnTitle.trim();
            utilityConfigReturnAction.description = (utilityConfigReturnAction.description)? utilityConfigReturnAction.description.trim():"";
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityConfigReturnAction.returnCodeCategoryId = "";
                }
                this.props.actions.addUtilityConfigReturnAction(utilityConfigReturnAction).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityConfigReturnAction.returnCodeCategoryId = this.state.selectedData.returnCodeCategoryId;
                this.props.actions.editUtilityConfigReturnAction(utilityConfigReturnAction).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.edit"));
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

    handleItemSelectChangeReturnCategory(option) {
        this.setState({ selectValueReturnCategory: option });
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
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityConfigReturnAction:utilityConfigReturnAction.title.utilityConfigReturnActionAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityConfigReturnAction:utilityConfigReturnAction.title.utilityConfigReturnActionEdit") : ''}
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
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <Card>
                                                <CardHeader>
                                                    <i className="fa fa-align-justify"></i>{t("utilityConfigReturnAction:utilityConfigReturnAction.title.utilityConfigReturnActionInfo")}
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomAvField 
                                                                disabled = {disabled}  
                                                                name="returnCode" 
                                                                label={t("utilityConfigReturnAction:utilityConfigReturnAction.label.returnCode")} 
                                                                placeholder={t("utilityConfigReturnAction:utilityConfigReturnAction.placeholder.returnCode")}
                                                                required
                                                                autoFocus 
                                                                maxLength="200" 
                                                                validate={{ required: { value: true, errorMessage: t("utilityConfigReturnAction:utilityConfigReturnAction.message.requiredReturnCode") } }} />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomAvField 
                                                                disabled = {disabled}                                                               
                                                                name="returnTitle" 
                                                                label={t("utilityConfigReturnAction:utilityConfigReturnAction.label.returnTitle")} 
                                                                placeholder={t("utilityConfigReturnAction:utilityConfigReturnAction.placeholder.returnTitle")} required                                
                                                                maxLength="200" 
                                                                validate={{ required: { value: true, errorMessage: t("utilityConfigReturnAction:utilityConfigReturnAction.message.requiredReturnTitle") } }} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                isDisabled ={disabled}                                                                                                                                 
                                                                name={"returnCategory"}
                                                                label={t("utilityConfigReturnAction:utilityConfigReturnAction.label.returnCategory")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityConfigReturnAction:utilityConfigReturnAction.message.requiredReturnCategory")}
                                                                options={this.state.returnCategorySelect}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeReturnCategory}
                                                                selectValue={this.state.selectValueReturnCategory}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomAvField 
                                                                disabled = {disabled}                                                                                                                               
                                                                name="description" 
                                                                label={t("utilityConfigReturnAction:utilityConfigReturnAction.label.description")} 
                                                                placeholder={t("utilityConfigReturnAction:utilityConfigReturnAction.placeholder.description")}
                                                                maxLength="1000" />
                                                        </Col>
                                                    </Row>
                                                    <Row> 
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                isDisabled ={disabled}                                                                 
                                                                isRequired={true}
                                                                messageRequire={t("utilityConfigReturnAction:utilityConfigReturnAction.message.requiredStatus")}
                                                                name={"isActive"}
                                                                label={t("common:common.label.status")}
                                                                options={this.state.statusListSelect}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                selectValue={this.state.selectValueStatus}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomAppSwitch 
                                                                isDisabled = {(this.state.selectedData)?((this.state.selectedData.isEditable)?false:true):false}
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
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

UtilityConfigReturnActionAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigReturnAction, common } = state;
    return {
        response: { utilityConfigReturnAction, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigReturnActionActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigReturnActionAddEdit));