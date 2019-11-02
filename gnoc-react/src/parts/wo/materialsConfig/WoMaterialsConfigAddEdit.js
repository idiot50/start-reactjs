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
import * as WoMaterialsConfigActions from './WoMaterialsConfigActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomAutocomplete } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoMaterialsConfigAddEdit extends Component {
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
            //Select
            selectValueAction: {},
            selectValueInfraType: {},
            selectValueMaterial: {},
            selectValueService: {},
            actionList: [],
            serviceList: [],
            pureServiceList: []
        };
    }

    componentWillMount() {
        this.props.actions.getItemServiceMaster("serviceId", "serviceName", 1, 8).then((response) => {
            let listService = response.payload.data.data.map(i => ({ itemId: i.serviceId, itemName: i.serviceName }))
            this.setState({
                serviceList: listService,
            });
        });
        this.props.actions.getItemMaster('WO_ACTION_GROUP', "itemId", "itemName", "1", "3").then((response) => {
            this.setState({
                actionList: response.payload.data.data,
            });
        });
    }

    componentDidMount() {
        this.props.actions.getItemMaster("WO_TECHNOLOGY_CODE", "itemId", "itemName", "1", "3")
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueInfraType: this.state.selectedData.infraType ? { value: this.state.selectedData.infraType } : {},
                selectValueService: this.state.selectedData.serviceId ? { value: this.state.selectedData.serviceId } : {},
                selectValueAction: this.state.selectedData.actionId ? { value: this.state.selectedData.actionId } : {},
                selectValueMaterial: this.state.selectedData.materialId ? { value: this.state.selectedData.materialId } : {},
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
            const woMaterialsConfig = Object.assign({}, values);
            woMaterialsConfig.infraType = this.state.selectValueInfraType.value || "";
            woMaterialsConfig.serviceId = this.state.selectValueService.value || "";
            woMaterialsConfig.actionId = this.state.selectValueAction.value || "";
            woMaterialsConfig.materialId = this.state.selectValueMaterial ? this.state.selectValueMaterial.value : "";
            woMaterialsConfig.isEnable = 1;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addWoMaterialsConfig(woMaterialsConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woMaterialsConfig:woMaterialsConfig.message.success.add"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.duplicate"))
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.add"));
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
                            toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                woMaterialsConfig.materialThresId = this.state.selectedData.materialThresId;
                this.props.actions.editWoMaterialsConfig(woMaterialsConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woMaterialsConfig:woMaterialsConfig.message.success.edit"));
                        });
                    }
                    else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.duplicate"))
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.edit"));
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
                            toastr.error(this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.edit"));
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

    handleItemSelectChangeInfraType = (option) => {
        this.setState({
            selectValueInfraType: option
        })
    }

    handleItemSelectChangeAction = (option) => {
        this.setState({
            selectValueAction: option
        })
    }

    handleItemSelectChangeService = (option) => {
        this.setState({
            selectValueService: option
        })
    }

    handleItemSelectChangeMaterial = (option) => {
        this.setState({
            selectValueMaterial: option
        })
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }


    render() {
        const { t, response } = this.props;
        let woTechList = (this.props.response.common.woTechnologyCode && this.props.response.common.woTechnologyCode.payload) ? this.props.response.common.woTechnologyCode.payload.data.data.map(item => ({ ...item, itemId: item.itemValue })) : []
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        objectAddOrEdit.techThres = objectAddOrEdit.techThres ? objectAddOrEdit.techThres + "" : "";
        objectAddOrEdit.warningThres = objectAddOrEdit.warningThres ? objectAddOrEdit.warningThres + "" : "";
        objectAddOrEdit.freeThres = objectAddOrEdit.freeThres ? objectAddOrEdit.freeThres + "" : "";
        objectAddOrEdit.techDistanctThres = objectAddOrEdit.techDistanctThres ? objectAddOrEdit.techDistanctThres + "" : "";
        objectAddOrEdit.warningDistanctThres = objectAddOrEdit.warningDistanctThres ? objectAddOrEdit.warningDistanctThres + "" : "";
        objectAddOrEdit.freeDistanctThres = objectAddOrEdit.freeDistanctThres ? objectAddOrEdit.freeDistanctThres + "" : "";
        const { serviceList, actionList, } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woMaterialsConfig:woMaterialsConfig.title.woMaterialsConfigAdd") : this.state.isAddOrEdit === "EDIT" ? t("woMaterialsConfig:woMaterialsConfig.title.woMaterialsConfigEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("woMaterialsConfig:woMaterialsConfig.title.woMaterialsConfigInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"infraType"}
                                                                    label={t("woMaterialsConfig:woMaterialsConfig.label.tech")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woMaterialsConfig:woMaterialsConfig.message.required.tech")}
                                                                    options={woTechList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeInfraType}
                                                                    selectValue={this.state.selectValueInfraType}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"serviceId"}
                                                                    label={t("woMaterialsConfig:woMaterialsConfig.label.service")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woMaterialsConfig:woMaterialsConfig.message.required.service")}
                                                                    options={serviceList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeService}
                                                                    selectValue={this.state.selectValueService}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"actionId"}
                                                                    label={t("woMaterialsConfig:woMaterialsConfig.label.action")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woMaterialsConfig:woMaterialsConfig.message.required.action")}
                                                                    options={actionList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeAction}
                                                                    selectValue={this.state.selectValueAction}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAutocomplete
                                                                    name={"materialId"}
                                                                    label={t("woMaterialsConfig:woMaterialsConfig.label.material")}
                                                                    placeholder={t("woMaterialsConfig:woMaterialsConfig.placeholder.material")}
                                                                    isRequired={true}
                                                                    messageRequire={t("woMaterialsConfig:woMaterialsConfig.message.required.material")}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleItemSelectChangeMaterial}
                                                                    selectValue={this.state.selectValueMaterial}
                                                                    moduleName={"GNOC_WO_MATERIAL"}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="techThres" label={t("woMaterialsConfig:woMaterialsConfig.label.technical")} placeholder={t("woMaterialsConfig:woMaterialsConfig.placeholder.technical")} required
                                                                    maxLength="7"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: t("woMaterialsConfig:woMaterialsConfig.message.required.technical") },
                                                                        pattern: { value: '^([1-9]([0-9]{1,6})?)?$', errorMessage: this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.wrongDataFormat") }
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="warningThres" label={t("woMaterialsConfig:woMaterialsConfig.label.alarm")} placeholder={t("woMaterialsConfig:woMaterialsConfig.placeholder.alarm")} required
                                                                    maxLength="7"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: t("woMaterialsConfig:woMaterialsConfig.message.required.alarm") },
                                                                        pattern: { value: '^([1-9]([0-9]{1,6})?)?$', errorMessage: this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.wrongDataFormat") }
                                                                    }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="freeThres" label={t("woMaterialsConfig:woMaterialsConfig.label.free")} placeholder={t("woMaterialsConfig:woMaterialsConfig.placeholder.free")} required
                                                                    maxLength="7"
                                                                    validate={{
                                                                        required: { value: true, errorMessage: t("woMaterialsConfig:woMaterialsConfig.message.required.free") },
                                                                        pattern: { value: '^([1-9]([0-9]{1,6})?)?$', errorMessage: this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.wrongDataFormat") },
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="techDistanctThres" label={t("woMaterialsConfig:woMaterialsConfig.label.techNIMS")} placeholder={t("woMaterialsConfig:woMaterialsConfig.placeholder.techNIMS")}
                                                                    maxLength="7" validate={{ pattern: { value: '^([0-9]{1,7})?$', errorMessage: this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.wrongDataFormat") } }}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="warningDistanctThres" label={t("woMaterialsConfig:woMaterialsConfig.label.alarmNIMS")} placeholder={t("woMaterialsConfig:woMaterialsConfig.placeholder.alarmNIMS")}
                                                                    maxLength="7" validate={{ pattern: { value: '^([0-9]{1,7})?$', errorMessage: this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.wrongDataFormat") } }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="freeDistanctThres" label={t("woMaterialsConfig:woMaterialsConfig.label.freeNIMS")} placeholder={t("woMaterialsConfig:woMaterialsConfig.placeholder.freeNIMS")}
                                                                    maxLength="7" validate={{ pattern: { value: '^([0-9]{1,7})?$', errorMessage: this.props.t("woMaterialsConfig:woMaterialsConfig.message.error.wrongDataFormat") } }}
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

WoMaterialsConfigAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woMaterialsConfig, common } = state;
    return {
        response: { woMaterialsConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoMaterialsConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoMaterialsConfigAddEdit));