import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomAppSwitch, CustomAvField, CustomSelectLocal, CustomSticky,CustomInputMultiLanguage } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityWorkLogsActions from './UtilityWorkLogsActions';

class UtilityWorkLogsAddEdit extends Component {
    constructor(props) {
        super(props);

        this.handleChangeIsEditable = this.handleChangeIsEditable.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeWorkLogType = this.handleItemSelectChangeWorkLogType.bind(this);
        this.handleChangeWorklogName = this.handleChangeWorklogName.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            listWorklogType:[],
            wlayIsUneditable: true,
            selectValueWorkLogType: {},
            listWorkLogCategory:[],
            selectValueStatus: {},
            disabled:false,
            statusListSelect: [
                { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
            ],
            
        };
    }
    componentDidMount() {
        this.props.actions.getListWorkLogType().then((response) => {
            let listWorklogType = (response.payload && response.payload.data) ? response.payload.data.map(i => ({itemId:i.wlayType,itemName:i.wlayNameType})) : []
            this.setState({
                listWorklogType
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.search"));
        });;
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({   
                listWorkLogCategory: this.state.selectedData.listWorkLogCategory,
                wlayIsUneditable: (!this.state.selectedData.wlayIsEditable),
                selectValueStatus: {value:this.state.selectedData.wlayIsActive},
                selectValueWorkLogType: { value: this.state.selectedData ? this.state.selectedData.wlayType : null },
            })
            if (this.state.isAddOrEdit === "EDIT" && this.state.selectedData.wlayIsEditable === 0) {
                this.setState({
                    disabled: true
                })
            }
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
            values.workLogType = this.state.selectValueWorkLogType.value;
            const utilityWorkLogs = Object.assign({}, values);
            utilityWorkLogs.wlayCode = (utilityWorkLogs.wlayCode)?utilityWorkLogs.wlayCode.trim():"";
            utilityWorkLogs.wlayIsEditable = this.state.wlayIsUneditable ? 0 : 1;
            utilityWorkLogs.wlayIsActive = this.state.selectValueStatus.value;
            utilityWorkLogs.wlayName =  values['wlayName-multi-language'] ? values['wlayName-multi-language'].trim() : "";
            utilityWorkLogs.listWorkLogCategory = this.state.listWorkLogCategory.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }));
            utilityWorkLogs.wlayDescription = (utilityWorkLogs.wlayDescription)?utilityWorkLogs.wlayDescription.trim():"";
            utilityWorkLogs.wlayType = this.state.selectValueWorkLogType.value;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityWorkLogs.wlayId = "";
                }
                this.props.actions.addUtilityWorkLogs(utilityWorkLogs).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityWorkLogs:utilityWorkLogs.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityWorkLogs.wlayId = this.state.selectedData.wlayId;
                this.props.actions.editUtilityWorkLogs(utilityWorkLogs).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityWorkLogs:utilityWorkLogs.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.edit"));
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

    handleItemSelectChangeWorkLogType(option) {
        this.setState({ selectValueWorkLogType: option });
    }

    handleChangeIsEditable = (checked) => {
        this.setState({
            wlayIsUneditable: checked
        });
    }
    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }

    handleChangeWorklogName(data) {
        this.setState({
            listWorkLogCategory: data
        });
    }
    render() {
        const { t } = this.props;
        const {disabled} = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listWorkLogCategory : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityWorkLogs:utilityWorkLogs.title.utilityWorkLogsAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityWorkLogs:utilityWorkLogs.title.utilityWorkLogsEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                hidden={(this.state.isAddOrEdit === "EDIT") ? ((this.state.selectedData && this.state.selectedData.wlayIsEditable === 1) ? false : true) : false}
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
                                                    <i className="fa fa-align-justify"></i>{t("utilityWorkLogs:utilityWorkLogs.title.utilityWorkLogsInfo")}
                                                </CardHeader>
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                isDisabled ={disabled}                                                                
                                                                name={"wlayType"}
                                                                label={t("utilityWorkLogs:utilityWorkLogs.label.worklogType")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityWorkLogs:utilityWorkLogs.message.requiredWorkLogType")}
                                                                options={this.state.listWorklogType}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeWorkLogType}
                                                                selectValue={this.state.selectValueWorkLogType}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomAvField 
                                                                disabled = {disabled}
                                                                name="wlayCode" 
                                                                label={t("utilityWorkLogs:utilityWorkLogs.label.worklogCode")} 
                                                                placeholder={t("utilityWorkLogs:utilityWorkLogs.placeholder.worklogCode")} required
                                                                maxLength="100" validate={{ required: { value: true, errorMessage: t("utilityWorkLogs:utilityWorkLogs.message.requiredWorkLogCode") } }} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                                <CustomInputMultiLanguage
                                                                    isDisabled ={disabled}                                                                
                                                                    formId="idFormAddOrEdit"
                                                                    name="wlayName"
                                                                    label={t("utilityWorkLogs:utilityWorkLogs.label.worklogName")}
                                                                    placeholder={t("utilityWorkLogs:utilityWorkLogs.placeholder.worklogName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityWorkLogs:utilityWorkLogs.message.requiredWorkLogName")}
                                                                    maxLength={200}
                                                                    autoFocus={false}
                                                                    dataLanguageExchange={dataLanguageExchange}
                                                                    handleChange={this.handleChangeWorklogName}
                                                                />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomAvField 
                                                                disabled = {disabled}
                                                                name="wlayDescription" 
                                                                label={t("utilityWorkLogs:utilityWorkLogs.label.description")}
                                                                placeholder={t("utilityWorkLogs:utilityWorkLogs.placeholder.description")}
                                                                maxLength="500" />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                isDisabled ={disabled}                                                                 
                                                                name={"wlayIsActive"}
                                                                label={t("common:common.label.status")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityWorkLogs:utilityWorkLogs.message.requiredStatus")}
                                                                options={this.state.statusListSelect}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeStatus}
                                                                selectValue={this.state.selectValueStatus}
                                                                />
                                                            </Col>
                                                        <Col xs="12" sm="6"> 
                                                            <CustomAppSwitch
                                                                isDisabled ={disabled}                                                                 
                                                                name={"wlayIsEditable"}
                                                                label={t("utilityWorkLogs:utilityWorkLogs.label.uneditable")}
                                                                checked={this.state.wlayIsUneditable}
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

UtilityWorkLogsAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityWorkLogs, common } = state;
    return {
        response: { utilityWorkLogs, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityWorkLogsActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityWorkLogsAddEdit));