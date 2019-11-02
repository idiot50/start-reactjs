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

class WoManagementRejectPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            selectValueGroupReason: {},
            checkCd: props.parentState.checkCd
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.checkCd) {
            this.setState({ checkCd: newProps.parentState.checkCd });
        }
    }

    componentDidMount() {
        this.props.actions.getItemMaster("WO_REJECT_REASON", "itemId", "itemName", "1", "3");
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormRejectPopup");
        const woDtoReject = Object.assign({}, this.state.selectedData);
        if (this.state.checkCd) {
            woDtoReject.ftId = null;
        }
        const comment = this.props.t("woManagement:woManagement.label.groupReason") + ": "
                        + this.state.selectValueGroupReason.label + ". "
                        + this.props.t("woManagement:woManagement.label.reasonReject") + ": "
                        + values.reasonReject;
        woDtoReject.comment = comment;
        woDtoReject.role = this.state.checkCd ? "CD" : "FT";
        this.props.actions.rejectWoForWeb(woDtoReject).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.closePopup();
                this.props.closePage("PROCESS", true);
                toastr.success(this.props.t("woManagement:woManagement.message.success.rejectWo") + ": " + woDtoReject.woCode);
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.rejectWo"));
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
        invalidSubmitForm(event, errors, values, "idFormRejectPopup");
    }

    closePopup = () => {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const woRejectReason = (this.props.response.common.woRejectReason && this.props.response.common.woRejectReason.payload) ? this.props.response.common.woRejectReason.payload.data.data : [];
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenRejectPopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormRejectPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.title.rejectReason")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"groupReason"}
                                    label={t("woManagement:woManagement.label.groupReason")}
                                    messageRequire={t("woManagement:woManagement.message.required.groupReason")}
                                    isRequired={true}
                                    options={woRejectReason}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueGroupReason: d })}
                                    selectValue={this.state.selectValueGroupReason}
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="reasonReject" required
                                label={t("woManagement:woManagement.label.reasonReject")} maxLength="1000"
                                validate={{ required: { value: true, errorMessage: t("woManagement:woManagement.message.required.reasonReject") } }} />
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

WoManagementRejectPopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementRejectPopup));