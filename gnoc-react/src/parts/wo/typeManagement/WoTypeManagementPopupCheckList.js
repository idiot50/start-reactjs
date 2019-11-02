import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import { CustomAvField } from '../../../containers/Utils';
import * as WoTypeManagementActions from './WoTypeManagementActions';
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class WoTypeManagementPopupCheckList extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            //Object Search
            objectSearch: {},
            backdrop: "static"
        };
    }

    updateCheckList = (event, values) => {
        const objectUpdate = Object.assign({isEnable: 1}, values);
        let objectCheckList = this.props.parentState.dataCheckList;
        for (const element of objectCheckList) {
            if (element.checklistName === objectUpdate.checklistName) {
                toastr.error(this.props.t("woTypeManagement:woTypeManagement.message.error.checkList"));
                return;
            }
        }
        objectCheckList.push(objectUpdate)
        this.props.onCheckListUpdate(objectCheckList);
        this.props.closePopup();
    }

    closePopup = () => {
        this.setState({
            objectSearch: {},
        });
        this.props.closePopup();
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddChecklistPopup");
        this.updateCheckList(event, values);
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddChecklistPopup");
    }

    render() {
        const { t } = this.props;
        const objectAddOrEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupCheckList} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormAddChecklistPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woTypeManagement:woTypeManagement.title.addNewCheckList")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField
                                    name={"checklistName"}
                                    label={t("woTypeManagement:woTypeManagement.label.checkListName")}
                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.checkListName")}
                                    required={true} maxLength="256"
                                    validate={{ required: { value: true, errorMessage: t("woTypeManagement:woTypeManagement.message.required.checkListName") } }}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomAvField
                                    name={"defaultValue"} maxLength="1024"
                                    label={t("woTypeManagement:woTypeManagement.label.defaultValue")}
                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.defaultValue")}
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" className="ml-auto mr-1"><i className="fa fa-save"></i> {t("woTypeManagement:woTypeManagement.button.add")}</Button>
                        <Button type="button" color="secondary" className="mr-auto" onClick={() => this.closePopup()}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

WoTypeManagementPopupCheckList.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woTypeManagement, common } = state;
    return {
        response: { woTypeManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, WoTypeManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoTypeManagementPopupCheckList));