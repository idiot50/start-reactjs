import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoManagementAuditPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            selectValueGroupReason: {}
        };
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAuditPopup");
        const woManagement = Object.assign({}, this.state.selectedData, values);
        woManagement.comment = woManagement.comment ? woManagement.comment.trim() : "";
        woManagement.auditResult = this.state.selectValueGroupReason.value;
        this.props.actions.auditWo(woManagement).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.closePopup();
                this.props.closePage("PROCESS", true);
                toastr.success(this.props.t("woManagement:woManagement.message.success.auditWo") + ": " + woManagement.woCode);
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.auditWo"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("woManagement:woManagement.message.error.auditWo"));
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAuditPopup");
    }

    closePopup = () => {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenAuditPopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormAuditPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.button.audit")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"auditReason"}
                                    label={t("woManagement:woManagement.label.auditReason")}
                                    messageRequire={t("woManagement:woManagement.message.required.auditReason")}
                                    isRequired={true}
                                    options={[
                                        {itemId: "OK", itemName: "OK"},
                                        {itemId: "NOK", itemName: "NOK"}
                                    ]}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueGroupReason: d })}
                                    selectValue={this.state.selectValueGroupReason}
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="comment" required
                                label={t("woManagement:woManagement.label.commentAudit")} maxLength="500"
                                validate={{ required: { value: true, errorMessage: t("woManagement:woManagement.message.required.commentAudit") } }} />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" className="ml-auto">
                            <i className="fa fa-save"></i> {t("common:common.button.save")}
                        </Button>
                        <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

WoManagementAuditPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    closePage: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, WoManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementAuditPopup));