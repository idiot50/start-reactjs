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
import * as PtConfigActions from './PtConfigActions';
import { CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class PtConfigAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeTypeCode = this.handleItemSelectChangeTypeCode.bind(this);
        this.handleItemSelectChangePriorityCode = this.handleItemSelectChangePriorityCode.bind(this);

        this.state = {
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueTypeCode: {},
            selectValuePriorityCode: {}
        };
    }

    componentDidMount() {
        if(this.state.isAddOrEdit === "EDIT") {
            this.setState({
                selectValueTypeCode: { value: this.state.selectedData.typeCode },
                selectValuePriorityCode: { value: this.state.selectedData.priorityCode }
            });
        }
        //get combobox
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_PRIORITY", "itemId", "itemName", "1", "3");
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
            const ptConfig = values;
            ptConfig.cfgCode = ptConfig.cfgCode.trim();
            ptConfig.rcaFoundTime = ptConfig.rcaFoundTime.trim();
            ptConfig.waFoundTime = ptConfig.waFoundTime.trim();
            ptConfig.slFoundTime = ptConfig.slFoundTime.trim();
            if(ptConfig.slFoundTime.length > 10) {
                toastr.warning(this.props.t("ptConfig:ptConfig.message.error.slDataFormatLength"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            if(ptConfig.waFoundTime.length > 10) {
                toastr.warning(this.props.t("ptConfig:ptConfig.message.error.waDataFormatLength"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            if(ptConfig.rcaFoundTime.length > 10) {
                toastr.warning(this.props.t("ptConfig:ptConfig.message.error.rcaDataFormatLength"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            ptConfig.typeCode = this.state.selectValueTypeCode.value;
            ptConfig.priorityCode = this.state.selectValuePriorityCode.value;
            if (this.state.isAddOrEdit === "ADD") {
                this.props.actions.addPtConfig(ptConfig).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ptConfig:ptConfig.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("ptConfig:ptConfig.message.error.add"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("ptConfig:ptConfig.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                ptConfig.id = this.state.selectedData.id;
                ptConfig.cfgProblemTimeProcessDTOS = [{cfgCode: this.state.selectedData.cfgCode}];
                this.props.actions.editPtConfig(ptConfig).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ptConfig:ptConfig.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("ptConfig:ptConfig.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("ptConfig:ptConfig.message.error.edit"));
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

    handleItemSelectChangePriorityCode(option) {
        this.setState({ selectValuePriorityCode: option });
    }

    handleItemSelectChangeTypeCode(option) {
        this.setState({ selectValueTypeCode: option });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = this.state.isAddOrEdit === "EDIT" ? this.state.selectedData : {};
        let priorityList = (response.common.ptPriority && response.common.ptPriority.payload) ? response.common.ptPriority.payload.data.data : [];
        for (const priority of priorityList) {
            priority.itemId = priority.itemCode;
        }
        let typeCodeList = (response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : [];
        for (const typeCode of typeCodeList) {
            typeCode.itemId = typeCode.itemCode;
        }
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={this.state.isAddOrEdit === "ADD" ? "fa fa-plus-circle" : "fa fa-edit"}></i>{this.state.isAddOrEdit === "ADD" ? t("common:common.title.add") : this.state.isAddOrEdit === "EDIT" ? t("common:common.title.edit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {this.state.isAddOrEdit === "ADD" ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("ptConfig:ptConfig.title.ptConfigInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="cfgCode" label={t("ptConfig:ptConfig.label.configCode")} placeholder={t("ptConfig:ptConfig.placeholder.configCode")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("ptConfig:ptConfig.message.required.configCode") } }}
                                                                    autoFocus readOnly={this.state.isAddOrEdit === "EDIT"} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"typeCode"}
                                                                    label={t("ptConfig:ptConfig.label.technicalDepartment")}
                                                                    isRequired={true}
                                                                    isDisabled={this.state.isAddOrEdit === "EDIT"}
                                                                    options={typeCodeList}
                                                                    messageRequire={t("ptConfig:ptConfig.message.required.technicalDepartment")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeTypeCode}
                                                                    selectValue={this.state.selectValueTypeCode}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"priorityCode"}
                                                                    label={t("ptConfig:ptConfig.label.priority")}
                                                                    isRequired={true}
                                                                    isDisabled={this.state.isAddOrEdit === "EDIT"}
                                                                    options={priorityList}
                                                                    messageRequire={t("ptConfig:ptConfig.message.required.priority")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangePriorityCode}
                                                                    selectValue={this.state.selectValuePriorityCode}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="rcaFoundTime" label={t("ptConfig:ptConfig.label.estimatedTimeFindRca")} placeholder={t("ptConfig:ptConfig.placeholder.estimatedTimeFindRca")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("ptConfig:ptConfig.message.required.estimatedTimeFindRca") },
                                                                    pattern: {value: '^[+]?[ ]*[0-9]{1,}?[ ]*$', errorMessage: t("ptConfig:ptConfig.message.error.rcaDataFormat")} }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="waFoundTime" label={t("ptConfig:ptConfig.label.estimatedTimeFindTemporarySolution")} placeholder={t("ptConfig:ptConfig.placeholder.estimatedTimeFindTemporarySolution")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("ptConfig:ptConfig.message.required.estimatedTimeFindTemporarySolution") },
                                                                    pattern: {value: '^[+]?[ ]*[0-9]{1,}?[ ]*$', errorMessage: t("ptConfig:ptConfig.message.error.waDataFormat")} }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="slFoundTime" label={t("ptConfig:ptConfig.label.estimatedTimeFindRadicalSolution")} placeholder={t("ptConfig:ptConfig.placeholder.estimatedTimeFindRadicalSolution")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("ptConfig:ptConfig.message.required.estimatedTimeFindRadicalSolution") },
                                                                    pattern: {value: '^[+]?[ ]*[0-9]{1,}?[ ]*$', errorMessage: t("ptConfig:ptConfig.message.error.slDataFormat")} }} />
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

PtConfigAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ptConfig, common } = state;
    return {
        response: { ptConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtConfigAddEdit));