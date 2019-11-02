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
import * as UtilityDepartmentsScopeManagementActions from './UtilityDepartmentsScopeManagementActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField, CustomAutocomplete, CustomMultiSelectLocal } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityDepartmentsScopeManagementAddEdit extends Component {
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
            selectValueScope: {},
            selectValueImpactGroup: {},
            selectValueDeviceType: [],
            selectValueUnit: {},
            listScope: [],
            listImpactSegment: [],
            listDevice: []
        };
    }

    componentWillMount() {
        this.props.actions.getListManagerScopeCBB().then((response) => {
            this.setState({
                listScope: response.payload.data ? response.payload.data.map(i => ({ itemId: i.cmseId, itemName: i.cmseName })) : []
            })
        })
        this.props.actions.getListImpactSegmentCBB().then((response) => {
            this.setState({
                listImpactSegment: response.payload.data ? response.payload.data.map(i => ({ itemId: i.impactSegmentId, itemName: i.impactSegmentName })) : []
            })
        })
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.props.actions.getListDeviceTypeByImpactSegmentCBB(this.state.selectedData.crTypeId || "").then((response) => {
                this.setState({
                    listDevice: response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : []
                })
            })
            this.setState({
                selectValueDeviceType: this.state.selectedData.lstCrUnitsScopeDeviceTypeDTO.map(i => ({ value: i.deviceTypeId, label: i.deviceTypeName })) || [],
                selectValueUnit: this.state.selectedData.unitId ? { value: this.state.selectedData.unitId, lable: this.state.selectedData.unitName } : {},
                selectValueScope: this.state.selectedData.cmseId ? { value: this.state.selectedData.cmseId, label: this.state.selectedData.cmseName } : {},
                selectValueImpactGroup: this.state.selectedData.crTypeId ? { value: this.state.selectedData.crTypeId, label: this.state.selectedData.crTypeName } : {}
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
            const utilityDepartmentsScopeManagement = Object.assign({}, values);
            utilityDepartmentsScopeManagement.unitId = this.state.selectValueUnit.value || "";
            utilityDepartmentsScopeManagement.unitName = this.state.selectValueUnit.label || "";
            utilityDepartmentsScopeManagement.cmseId = this.state.selectValueScope.value || "";
            utilityDepartmentsScopeManagement.cmseName = this.state.selectValueScope.label || "";
            utilityDepartmentsScopeManagement.crTypeId = this.state.selectValueImpactGroup.value || "";
            utilityDepartmentsScopeManagement.crTypeName = this.state.selectValueImpactGroup.label || "";
            utilityDepartmentsScopeManagement.lstCrUnitsScopeDeviceTypeDTO =
                this.state.selectValueDeviceType ? this.state.selectValueDeviceType.map(i => ({ deviceTypeId: i.value, deviceTypeName: i.label })) : []
            if (this.state.isAddOrEdit === "COPY") {
                utilityDepartmentsScopeManagement.cmnoseId = "";
            }
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityDepartmentsScopeManagement(utilityDepartmentsScopeManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.success.add"));
                        });
                    }else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(response.payload.data.message);
                        });
                    }else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.add"));
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
                            toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityDepartmentsScopeManagement.cmnoseId = this.state.selectedData.cmnoseId;
                this.props.actions.editUtilityDepartmentsScopeManagement(utilityDepartmentsScopeManagement).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.success.edit"));
                        });
                    }else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(response.payload.data.message);
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.edit"));
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
                            toastr.error(this.props.t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.error.edit"));
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

    handleItemSelectChangeScope = (option) => {
        this.setState({ selectValueScope: option });
    }

    handleItemSelectChangeImpactGroup = (option) => {
        this.setState({ selectValueImpactGroup: option });
        if (option && option.value) {
            this.props.actions.getListDeviceTypeByImpactSegmentCBB(option.value).then((response) => {
                this.setState({
                    listDevice: response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })),
                    selectValueDeviceType: []
                })
            })
        } else {
            this.setState({
                selectValueDeviceType: [],
                listDevice: []
            })
        }
    }

    handleItemSelectChangeDeviceType = (option) => {
        this.setState({ selectValueDeviceType: option })
    }

    handleItemSelectChangeUnit = (option) => {
        this.setState({ selectValueUnit: option })
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const { listDevice, listScope, listImpactSegment } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.title.utilityDepartmentsScopeManagementAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.title.utilityDepartmentsScopeManagementEdit") : ''}
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
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomAutocomplete
                                                                name={"unitName"}
                                                                label={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.unit")}
                                                                placeholder={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.placeholder.unit")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.required.unit")}
                                                                closeMenuOnSelect={false}
                                                                handleItemSelectChange={this.handleItemSelectChangeUnit}
                                                                selectValue={this.state.selectValueUnit}
                                                                moduleName={"UNIT"}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                name={"cmseName"}
                                                                label={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.scope")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.message.required.scope")}
                                                                options={listScope}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeScope}
                                                                selectValue={this.state.selectValueScope}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                name={"crTypeName"}
                                                                label={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.impactGroup")}
                                                                isRequired={false}
                                                                options={listImpactSegment}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeImpactGroup}
                                                                selectValue={this.state.selectValueImpactGroup}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomMultiSelectLocal
                                                                name={"lstCrUnitsScopeDeviceTypeDTO"}
                                                                label={t("utilityDepartmentsScopeManagement:utilityDepartmentsScopeManagement.label.deviceType")}
                                                                isRequired={false}
                                                                options={listDevice}
                                                                handleItemSelectChange={this.handleItemSelectChangeDeviceType}
                                                                selectValue={this.state.selectValueDeviceType}
                                                                closeMenuOnSelect={false}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </CardBody>
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

UtilityDepartmentsScopeManagementAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityDepartmentsScopeManagement, common } = state;
    return {
        response: { utilityDepartmentsScopeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityDepartmentsScopeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityDepartmentsScopeManagementAddEdit));