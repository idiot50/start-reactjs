import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { CustomAvField, CustomSelectLocal, CustomAutocomplete, CustomDatePicker } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoManagementPendingPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            endTimePending: null
        };
    }

    handleValidSubmitAddOrEdit(event, values) {
        if (this.state.endTimePending < new Date()) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.pendingTime"));
            return;
        }
        validSubmitForm(event, values, "idFormPendingPopup");
        const woManagement = Object.assign({}, this.state.selectedData, values);
        woManagement.reasonName = woManagement.reasonName ? woManagement.reasonName.trim() : "";
        woManagement.endPendingTime = this.state.endTimePending;
        woManagement.system = "web";
        this.props.actions.pendingWoFromWeb(woManagement).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.closePopup();
                this.props.closePage("PROCESS", true);
                toastr.success(this.props.t("woManagement:woManagement.message.success.pendingWo"));
            } else if (response.payload.data.key === "ERROR" || response.payload.data.key === "FAIL") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.pendingWo"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(response.error.response.data.message);
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormPendingPopup");
    }

    closePopup = () => {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data } = this.state;
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPendingPopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormPendingPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.title.updatePending")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomDatePicker
                                    name={"endTimePending"}
                                    label={t("woManagement:woManagement.label.endTimePending")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.endTimePending")}
                                    selected={this.state.endTimePending}
                                    handleOnChange={(d) => this.setState({ endTimePending: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="reasonName" label={t("woManagement:woManagement.label.reasonPending")} required maxLength="128"
                                        validate={{ required: { value: true, errorMessage: t("woManagement:woManagement.message.required.reasonPending") } }} />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" className="ml-auto" onClick={() => {}}>
                            <i className="fa fa-save"></i> {t("common:common.button.save")}
                        </Button>
                        <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

WoManagementPendingPopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementPendingPopup));