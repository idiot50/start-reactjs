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
import * as UtilityImpactSegmentActions from './UtilityImpactSegmentActions';
import { CustomInputMultiLanguage, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityImpactSegmentAddEdit extends Component {
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
            listAppliedSystem: [
                { itemId: 2, itemName: props.t("utilityImpactSegment:utilityImpactSegment.label.applyforCR") },
                { itemId: 1, itemName: props.t("utilityImpactSegment:utilityImpactSegment.label.applyforMR") }
            ],
            selectValueAppliedSystem: {},
            listImpactSegmentName: []
        };
    }

    componentDidMount() {
        //get combobox
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {

            this.setState({
                selectValueAppliedSystem: this.state.selectedData.appliedSystem ? { value: this.state.selectedData.appliedSystem, label: this.state.selectedData.appliedSystemName } : {},
                listImpactSegmentName: this.state.selectedData.listImpactSegmentName || []
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null,
            listImpactSegmentName: [],
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityImpactSegment = Object.assign({}, values);
            console.log(values)
            utilityImpactSegment.impactSegmentCode = values.impactSegmentCode ? values.impactSegmentCode.trim() : "";
            utilityImpactSegment.impactSegmentName = values['impactSegmentName-multi-language'] ? values['impactSegmentName-multi-language'].trim() : "";
            utilityImpactSegment.appliedSystem = this.state.selectValueAppliedSystem.value;
            utilityImpactSegment.appliedSystemName = this.state.selectValueAppliedSystem.label;
            utilityImpactSegment.listImpactSegmentName = this.state.listImpactSegmentName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }))
            utilityImpactSegment.isActive = 1;
            if (this.state.isAddOrEdit === "COPY") {
                utilityImpactSegment.impactSegmentId = "";
            }
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityImpactSegment(utilityImpactSegment).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityImpactSegment:utilityImpactSegment.message.success.add"));
                        });
                    } else if (response.payload.data.key === 'DUPLICATE') {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.duplicate"))
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.add"));
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
                            toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityImpactSegment.impactSegmentId = this.state.selectedData.impactSegmentId;
                this.props.actions.editUtilityImpactSegment(utilityImpactSegment).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityImpactSegment:utilityImpactSegment.message.success.edit"));
                        });
                    }
                    else if (response.payload.data.key === 'DUPLICATE') {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.duplicate"))
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.edit"));
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
                            toastr.error(this.props.t("utilityImpactSegment:utilityImpactSegment.message.error.edit"));
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

    handleItemSelectChangeAppliedSystem = (option) => {
        this.setState({ selectValueAppliedSystem: option });
    }

    handleChangeImpactSegmentName = (data) => {
        this.setState({
            listImpactSegmentName: data
        });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const { listAppliedSystem } = this.state;
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listImpactSegmentName : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityImpactSegment:utilityImpactSegment.title.utilityImpactSegmentAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityImpactSegment:utilityImpactSegment.title.utilityImpactSegmentEdit") : ''}
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
                                                    <Col xs="12" sm="4">
                                                        <CustomAvField name="impactSegmentCode" label={t("utilityImpactSegment:utilityImpactSegment.label.impactSegmentCode")} placeholder={t("utilityImpactSegment:utilityImpactSegment.placeholder.impactSegmentCode")} required
                                                            autoFocus maxLength="100" validate={{ required: { value: true, errorMessage: t("utilityImpactSegment:utilityImpactSegment.message.required.impactSegmentCode") } }} />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomInputMultiLanguage
                                                            formId="idFormAddOrEdit"
                                                            name="impactSegmentName"
                                                            label={t("utilityImpactSegment:utilityImpactSegment.label.impactSegmentName")}
                                                            placeholder={t("utilityImpactSegment:utilityImpactSegment.placeholder.impactSegmentName")}
                                                            isRequired={true}
                                                            messageRequire={t("utilityImpactSegment:utilityImpactSegment.message.required.impactSegmentName")}
                                                            maxLength={200}
                                                            autoFocus={false}
                                                            dataLanguageExchange={dataLanguageExchange}
                                                            handleChange={this.handleChangeImpactSegmentName}
                                                        />
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <CustomSelectLocal
                                                            name={"appliedSystem"}
                                                            label={t("utilityImpactSegment:utilityImpactSegment.label.appliedSystem")}
                                                            isRequired={true}
                                                            messageRequire={t("utilityImpactSegment:utilityImpactSegment.message.required.appliedSystem")}
                                                            options={listAppliedSystem}
                                                            closeMenuOnSelect={true}
                                                            handleItemSelectChange={this.handleItemSelectChangeAppliedSystem}
                                                            selectValue={this.state.selectValueAppliedSystem}
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

UtilityImpactSegmentAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityImpactSegment, common } = state;
    return {
        response: { utilityImpactSegment, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityImpactSegmentActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityImpactSegmentAddEdit));