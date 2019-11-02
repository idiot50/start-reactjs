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
import * as TtInfoConfigActions from './TtInfoConfigActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtInfoConfigAddEdit extends Component {
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
            selectValueType: {},
            selectValueAlarmGroup: {},
            selectValueSubCategory: {}
        };
    }
    componentDidMount() {
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueType: { value: this.state.selectedData.typeId },
                selectValueAlarmGroup: { value: this.state.selectedData.alarmGroupId },
                selectValueSubCategory: { value: this.state.selectedData.subCategoryId },
                statusListSelectAlarmGroup: (this.props.response.common.alarmGroup && this.props.response.common.alarmGroup.payload) ? this.props.response.common.alarmGroup.payload.data.data : [],
                statusListSelectSubCategory: (this.props.response.common.ptSubCategory && this.props.response.common.ptSubCategory.payload) ? this.props.response.common.ptSubCategory.payload.data.data : []
            });
        }
        //get combobox
        this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("ALARM_GROUP", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
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
            values.typeId = this.state.selectValueType.value;
            values.alarmGroupId = this.state.selectValueAlarmGroup.value;
            values.subCategoryId = this.state.selectValueSubCategory.value;
            const ttInfoConfig = Object.assign({}, values);
            ttInfoConfig.troubleName = ttInfoConfig.troubleName.trim();
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    ttInfoConfig.id = null;
                }
                this.props.actions.addTtInfoConfig(ttInfoConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttInfoConfig:ttInfoConfig.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                ttInfoConfig.id = this.state.selectedData.id;
                this.props.actions.editTtInfoConfig(ttInfoConfig).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttInfoConfig:ttInfoConfig.message.success.edit"));
                        });
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        })
                        toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.duplicate"));
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.edit"));
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
    handleItemSelectChangeType = (option) => {
        this.setState({ selectValueType: option });
        if (option.value) {
            this.props.actions.getListAlarmGroup(option.value).then((response) => {
                this.setState({
                    statusListSelectAlarmGroup: response.payload.data
                });
            });
            this.props.actions.getListItemByCategoryAndParent("PT_SUB_CATEGORY", option.value).then((response) => {
                this.setState({
                    statusListSelectSubCategory: response.payload.data
                });
            });
        } else {
            this.setState({
                statusListSelectAlarmGroup: [],
                selectValueAlarmGroup: {},
                statusListSelectSubCategory: [],
                selectValueSubCategory: {}
            });
        }
    }
    handleItemSelectChangeAlarmGroup = (option) => {
        this.setState({ selectValueAlarmGroup: option });
    }
    handleItemSelectChangeSubCategory = (option) => {
        this.setState({ selectValueSubCategory: option });
    }


    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const statusListSelectType = (response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("ttInfoConfig:ttInfoConfig.title.ttInfoConfigAdd") : this.state.isAddOrEdit === "EDIT" ? t("ttInfoConfig:ttInfoConfig.title.ttInfoConfigEdit") : ''}
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
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("ttInfoConfig:ttInfoConfig.title.ttInfoConfigInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"typeId"}
                                                                    label={t("ttInfoConfig:ttInfoConfig.label.troubleArray")}
                                                                    isRequired={true}
                                                                    messageRequire={t("ttInfoConfig:ttInfoConfig.message.requiredTroubleArray")}
                                                                    options={statusListSelectType}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeType}
                                                                    selectValue={this.state.selectValueType}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"alarmGroupId"}
                                                                    label={t("ttInfoConfig:ttInfoConfig.label.troubleGroup")}
                                                                    isRequired={true}
                                                                    messageRequire={t("ttInfoConfig:ttInfoConfig.message.requiredTroubleGroup")}
                                                                    options={this.state.statusListSelectAlarmGroup ? this.state.statusListSelectAlarmGroup : []}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeAlarmGroup}
                                                                    selectValue={this.state.selectValueAlarmGroup}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"subCategoryId"}
                                                                    label={t("ttInfoConfig:ttInfoConfig.label.subCategory")}
                                                                    isRequired={true}
                                                                    messageRequire={t("ttInfoConfig:ttInfoConfig.message.requiredSubCategory")}
                                                                    options={this.state.statusListSelectSubCategory ? this.state.statusListSelectSubCategory : []}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeSubCategory}
                                                                    selectValue={this.state.selectValueSubCategory}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField name="troubleName" label={t("ttInfoConfig:ttInfoConfig.label.troubleName")}
                                                                    //placeholder={t("ttInfoConfig:ttInfoConfig.placeholder.troubleName")} 
                                                                    required maxLength="500" validate={{ required: { value: true, errorMessage: t("ttInfoConfig:ttInfoConfig.message.requiredTroubleName") } }} />
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

TtInfoConfigAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttInfoConfig, common } = state;
    return {
        response: { ttInfoConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtInfoConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtInfoConfigAddEdit));