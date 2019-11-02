import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { CustomAvField, CustomSelect, CustomAutocomplete } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoManagementAssignPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            selectValueReceiveUser: {}
        };
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAssignPopup");
        const woManagement = Object.assign({}, this.state.selectedData, values);
        woManagement.ftId = this.state.selectValueReceiveUser.value;
        woManagement.ftName = this.state.selectValueReceiveUser.label.split(/[()]+/)[1];
        woManagement.status = 5;
        woManagement.comment = woManagement.comment ? woManagement.comment.trim() : this.props.t("woManagement:woManagement.message.assignFt");
        this.props.actions.dispatchWo(woManagement).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.closePopup();
                this.props.closePage("PROCESS", true);
                toastr.success(this.props.t("woManagement:woManagement.message.success.assign"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.assign"));
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
        invalidSubmitForm(event, errors, values, "idFormAssignPopup");
    }

    closePopup = () => {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenAssignPopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormAssignPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.title.assign")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAutocomplete
                                    name={"ftId"}
                                    label={t("woManagement:woManagement.label.ftName")}
                                    placeholder={t("woManagement:woManagement.placeholder.ftName")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.ftName")}
                                    moduleName={"USERS_FT"}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueReceiveUser: d })}
                                    selectValue={this.state.selectValueReceiveUser}
                                    isHasChildren={true}
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="comment" label={t("woManagement:woManagement.label.notes")} />
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

WoManagementAssignPopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementAssignPopup));