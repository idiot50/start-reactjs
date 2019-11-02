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
import * as UtilityVersionCatalogActions from './UtilityVersionCatalogActions';
import * as KedbManagementActions from '../../kedb/management/KedbManagementActions';
import { CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class UtilityVersionCatalogAddEdit extends Component {
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
            selectValueVendor: {},
            selectValueSubTypeId: {},
            selectValueTypeId: {},
            typeList: []
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("VENDOR", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.props.actions.getListItemByCategoryAndParent("PT_SUB_CATEGORY", this.state.selectedData.subTypeId).then((response) => {
                this.setState({
                    typeList: response.payload.data
                }, () => {
                    this.setState({
                        selectValueSubTypeId: this.state.selectedData.subTypeId ? { value: this.state.selectedData.subTypeId } : {},
                        selectValueVendor: this.state.selectedData.vendorId ? { value: this.state.selectedData.vendorId } : {},
                        selectValueTypeId: this.state.selectedData.typeId ? { value: this.state.selectedData.typeId } : {}
                    });
                });
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
            const utilityVersionCatalog = Object.assign({}, values);
            utilityVersionCatalog.vendorId = this.state.selectValueVendor.value;
            utilityVersionCatalog.subTypeId = this.state.selectValueSubTypeId.value;
            utilityVersionCatalog.typeId = this.state.selectValueTypeId.value;
            utilityVersionCatalog.softwareVersion = utilityVersionCatalog.softwareVersion.trim();
            utilityVersionCatalog.hardwareVersion = utilityVersionCatalog.hardwareVersion.trim();
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityVersionCatalog.deviceTypeVersionId = null;
                }
                this.props.actions.addUtilityVersionCatalog(utilityVersionCatalog).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.error.add"));
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
                            toastr.error(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityVersionCatalog.deviceTypeVersionId = this.state.selectedData.deviceTypeVersionId;
                this.props.actions.editUtilityVersionCatalog(utilityVersionCatalog).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityVersionCatalog:utilityVersionCatalog.message.error.edit"));
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

    handleItemSelectChangeVendor = (option) => {
        this.setState({ selectValueVendor: option });
    }

    handleItemSelectChangeSubTypeId = (option) => {
        this.setState({ selectValueSubTypeId: option })
        if (option && option.value) {
            this.props.actions.getListItemByCategoryAndParent("PT_SUB_CATEGORY", option.value).then((response) => {
                this.setState({
                    typeList: response.payload.data
                });
            });
        } else {
            this.setState({
                typeList: [],
                selectValueTypeId: {}
            });
        }
    }

    handleItemSelectChangeTypeId = (option) => {
        this.setState({ selectValueTypeId: option })
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityVersionCatalog:utilityVersionCatalog.title.utilityVersionCatalogAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityVersionCatalog:utilityVersionCatalog.title.utilityVersionCatalogEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY" ? t("common:common.button.update") : ''}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"vendorId"}
                                                    label={t("utilityVersionCatalog:utilityVersionCatalog.label.vendor")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityVersionCatalog:utilityVersionCatalog.message.requiredVendor")}
                                                    options={(response.common.vendor && response.common.vendor.payload) ? response.common.vendor.payload.data.data : []}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeVendor}
                                                    selectValue={this.state.selectValueVendor}
                                                    autoFocus={true}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomAvField name="softwareVersion" label={t("utilityVersionCatalog:utilityVersionCatalog.label.versionSoftware")}
                                                    maxLength="100"
                                                    placeholder={t("utilityVersionCatalog:utilityVersionCatalog.placeholder.versionSoftware")} required
                                                    validate={{ required: { value: true, errorMessage: t("utilityVersionCatalog:utilityVersionCatalog.message.requiredVersionSoftware") } }}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomAvField name="hardwareVersion" label={t("utilityVersionCatalog:utilityVersionCatalog.label.versionHardware")}
                                                    maxLength="100"
                                                    placeholder={t("utilityVersionCatalog:utilityVersionCatalog.placeholder.versionHardware")} required
                                                    validate={{ required: { value: true, errorMessage: t("utilityVersionCatalog:utilityVersionCatalog.message.requiredVersionHardware") } }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"subTypeId"}
                                                    label={t("utilityVersionCatalog:utilityVersionCatalog.label.domain")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityVersionCatalog:utilityVersionCatalog.message.requiredDomain")}
                                                    options={(response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : []}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeSubTypeId}
                                                    selectValue={this.state.selectValueSubTypeId}
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <CustomSelectLocal
                                                    name={"typeId"}
                                                    label={t("utilityVersionCatalog:utilityVersionCatalog.label.subCategory")}
                                                    isRequired={true}
                                                    messageRequire={t("utilityVersionCatalog:utilityVersionCatalog.message.requiredSubCategory")}
                                                    options={this.state.typeList ? this.state.typeList : []}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeTypeId}
                                                    selectValue={this.state.selectValueTypeId}
                                                />
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

UtilityVersionCatalogAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityVersionCatalog, common } = state;
    return {
        response: { utilityVersionCatalog, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityVersionCatalogActions, commonActions, KedbManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityVersionCatalogAddEdit));