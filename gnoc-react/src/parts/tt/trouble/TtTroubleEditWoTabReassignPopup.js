import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomAvField } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtTroubleEditWoTabReassignPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            backdrop: "static",
            dataChecked: props.parentState.dataChecked
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.dataChecked) {
            this.setState({ dataChecked: newProps.parentState.dataChecked });
        }
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormWoReassignPopup");
        if (this.state.dataChecked[0].status + "" !== "8") {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.woStatusClose"));
            return;
        }
        const object = Object.assign({}, values);
        object.newStatus = 5;
        object.systemChange = "TT";
        object.woCode = this.state.dataChecked[0].woCode;
        object.reasonChange = object.reasonChange.trim();
        this.props.actions.changeStatusWo(object).then((response) => {
            toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.updateWo"));
            this.props.reloadDataGrid();
            this.props.closePopup();
        }).catch((error) => {
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.updateWo"));
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormWoReassignPopup");
    }

    render() {
        const { t } = this.props;
        const objectAddOrEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenReassignPopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormWoReassignPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <ModalHeader toggle={this.props.closePopup}>
                        {t("ttTrouble:ttTrouble.title.reassignWO")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="reasonChange" label={this.props.t("ttTrouble:ttTrouble.label.rejectReasonWo")}
                                placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.rejectReasonWo")} required
                                validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.rejectReasonWo") } }} />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" className="ml-auto"><i className="fa fa-save"></i> {t("common:common.button.save")}</Button>
                        <Button type="button" color="secondary" onClick={this.props.closePopup} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

TtTroubleEditWoTabReassignPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    reloadDataGrid: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, TtTroubleActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditWoTabReassignPopup));