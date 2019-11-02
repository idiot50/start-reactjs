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
import * as WoConfigPropertyActions from './WoConfigPropertyActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoConfigPropertyAddEdit extends Component {
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
            selectValueOdGroupTypeId: {},
            statusListSelect: [
                { itemId: 1, itemName: props.t("woConfigProperty:woConfigProperty.dropdown.status.active") },
                { itemId: 0, itemName: props.t("woConfigProperty:woConfigProperty.dropdown.status.inActive") }
            ],
            selectValueStatus: {}
        };
    }

    componentDidMount() {

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
            const woConfigProperty = Object.assign({}, values);
            woConfigProperty.key = woConfigProperty.key.trim().toUpperCase();
            woConfigProperty.value = woConfigProperty.value.trim();
            woConfigProperty.description = woConfigProperty.description.trim();
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                // if(this.state.isAddOrEdit === "COPY") {
                //     woConfigProperty.key = "";
                // }
                this.props.actions.addWoConfigProperty(woConfigProperty).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woConfigProperty:woConfigProperty.message.success.add"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("woConfigProperty:woConfigProperty.message.error.duplicate"))
                        })
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woConfigProperty:woConfigProperty.message.error.add"));
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
                            toastr.error(this.props.t("woConfigProperty:woConfigProperty.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                woConfigProperty.key = this.state.selectedData.key;
                this.props.actions.editWoConfigProperty(woConfigProperty).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woConfigProperty:woConfigProperty.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woConfigProperty:woConfigProperty.message.error.edit"));
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
                            toastr.error(this.props.t("woConfigProperty:woConfigProperty.message.error.edit"));
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

    render() {
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woConfigProperty:woConfigProperty.title.woConfigPropertyAdd") : this.state.isAddOrEdit === "EDIT" ? t("woConfigProperty:woConfigProperty.title.woConfigPropertyEdit") : ''}
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
                                                        <i className="fa fa-align-justify"></i>{t("woConfigProperty:woConfigProperty.title.woConfigPropertyInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="key" label={t("woConfigProperty:woConfigProperty.label.key")} placeholder={t("woConfigProperty:woConfigProperty.placeholder.key")} required
                                                                    disabled={this.state.isAddOrEdit === 'EDIT' ? true : false}
                                                                    autoFocus maxLength="200" 
                                                                    validate={{
                                                                        required: { value: true, errorMessage: t("woConfigProperty:woConfigProperty.message.requiredKey") },
                                                                        pattern: { value: '^([a-zA-Z0-9_]{1,200})?$', errorMessage: t("woConfigProperty:woConfigProperty.message.requiredKeyPattern") }
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="value" label={t("woConfigProperty:woConfigProperty.label.value")} placeholder={t("woConfigProperty:woConfigProperty.placeholder.value")} required
                                                                    maxLength="1000" validate={{ required: { value: true, errorMessage: t("woConfigProperty:woConfigProperty.message.requiredValue") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="description" label={t("woConfigProperty:woConfigProperty.label.description")} placeholder={t("woConfigProperty:woConfigProperty.placeholder.description")} required
                                                                    maxLength="2000" validate={{ required: { value: true, errorMessage: t("woConfigProperty:woConfigProperty.message.requiredDescription") } }} />
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

WoConfigPropertyAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woConfigProperty, common } = state;
    return {
        response: { woConfigProperty, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoConfigPropertyActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoConfigPropertyAddEdit));