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
import * as UtilityAffectedLevelActions from './UtilityAffectedLevelActions';
import { CustomInputMultiLanguage, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityAffectedLevelAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleChangeAffectedLevelName = this.handleChangeAffectedLevelName.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueAffectedLevel: {},
            selectValueAppliedSystem: {},
            listApproveLevel: [
                { itemId: 0, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.no") },
                { itemId: 1, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.yes") }
            ],
            listAppliedSystem: [
                { itemId: 1, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.applyforCR") },
                { itemId: 2, itemName: props.t("utilityAffectedLevel:utilityAffectedLevel.label.applyforMR") }
            ],
            listAffectedLevelName: []
        };
    }

    componentDidMount() {
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                selectValueAppliedSystem: this.state.selectedData.appliedSystem ? { value: this.state.selectedData.appliedSystem, label: this.state.selectedData.appliedSystem.appliedSystemName } : {},
                selectValueAffectedLevel: this.state.selectedData.twoApproveLevel ? { value: this.state.selectedData.twoApproveLevel, label: this.state.selectedData.twoApproveLevelName } : {},
                listAffectedLevelName: this.state.selectedData.listAffectedLevelName
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
            const utilityAffectedLevel = Object.assign({}, values);
            utilityAffectedLevel.affectedLevelCode = values.affectedLevelCode ? values.affectedLevelCode.trim() : "";
            utilityAffectedLevel.affectedLevelName = values['affectedLevelName-multi-language'] ? values['affectedLevelName-multi-language'].trim() : "";
            utilityAffectedLevel.twoApproveLevel = this.state.selectValueAffectedLevel.value;
            utilityAffectedLevel.twoApproveLevelName = this.state.selectValueAffectedLevel.label || "";
            utilityAffectedLevel.appliedSystem = this.state.selectValueAppliedSystem.value || "";
            utilityAffectedLevel.appliedSystemName = this.state.selectValueAppliedSystem.value || "";
            utilityAffectedLevel.listAffectedLevelName = this.state.listAffectedLevelName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }))
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityAffectedLevel(utilityAffectedLevel).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.success.add"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.duplicate"))
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.add"));
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
                            toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityAffectedLevel.affectedLevelId = this.state.selectedData.affectedLevelId;
                this.props.actions.editUtilityAffectedLevel(utilityAffectedLevel).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.success.edit"));
                        });
                    }
                    else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.duplicate"))
                        })
                    }
                    else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.edit"));
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
                            toastr.error(this.props.t("utilityAffectedLevel:utilityAffectedLevel.message.error.edit"));
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

    handleItemSelectChangeAffectedLevel = (option) => {
        this.setState({ selectValueAffectedLevel: option });
    }

    handleItemSelectChangeAppliedSystem = (option) => {
        this.setState({ selectValueAppliedSystem: option });
    }

    handleChangeAffectedLevelName(data) {
        this.setState({
            listAffectedLevelName: data
        });
    }

    render() {
        const { t } = this.props;
        const { listAppliedSystem, listApproveLevel } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listAffectedLevelName : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityAffectedLevel:utilityAffectedLevel.title.utilityAffectedLevelAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityAffectedLevel:utilityAffectedLevel.title.utilityAffectedLevelEdit") : ''}
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
                                                            <CustomAvField name="affectedLevelCode" label={t("utilityAffectedLevel:utilityAffectedLevel.label.affectedLevelCode")} placeholder={t("utilityAffectedLevel:utilityAffectedLevel.placeholder.affectedLevelCode")} required
                                                                autoFocus maxLength="100" validate={{ required: { value: true, errorMessage: t("utilityAffectedLevel:utilityAffectedLevel.message.required.affectedLevelCode") } }} />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomInputMultiLanguage
                                                                formId="idFormAddOrEdit"
                                                                name="affectedLevelName"
                                                                label={t("utilityAffectedLevel:utilityAffectedLevel.label.affectedLevelName")}
                                                                placeholder={t("utilityAffectedLevel:utilityAffectedLevel.placeholder.affectedLevelName")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityAffectedLevel:utilityAffectedLevel.message.required.affectedLevelName")}
                                                                maxLength={200}
                                                                autoFocus={false}
                                                                dataLanguageExchange={dataLanguageExchange}
                                                                handleChange={this.handleChangeAffectedLevelName}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                name={"twoApproveLevelName"}
                                                                label={t("utilityAffectedLevel:utilityAffectedLevel.label.affectedLevel")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityAffectedLevel:utilityAffectedLevel.message.required.affectedLevel")}
                                                                options={listApproveLevel}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeAffectedLevel}
                                                                selectValue={this.state.selectValueAffectedLevel}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <CustomSelectLocal
                                                                name={"appliedSystem"}
                                                                label={t("utilityAffectedLevel:utilityAffectedLevel.label.appliedSystem")}
                                                                isRequired={true}
                                                                messageRequire={t("utilityAffectedLevel:utilityAffectedLevel.message.required.appliedSystem")}
                                                                options={listAppliedSystem}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeAppliedSystem}
                                                                selectValue={this.state.selectValueAppliedSystem}
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

UtilityAffectedLevelAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityAffectedLevel, common } = state;
    return {
        response: { utilityAffectedLevel, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityAffectedLevelActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityAffectedLevelAddEdit));