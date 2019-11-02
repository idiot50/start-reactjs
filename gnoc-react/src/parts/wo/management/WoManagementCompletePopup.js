import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as WoTypeManagementActions from '../typeManagement/WoTypeManagementActions';
import { CustomAvField, CustomSelectLocal, CustomAutocomplete } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoManagementCompletePopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            selectValueResult: {},
            selectValueReceiveUser: {}
        };
    }

    async handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormCompletePopup");
        const check = await this.validateComplete();
        if (check) {
            const woManagement = Object.assign({}, this.state.selectedData, values);
            woManagement.comment = woManagement.comment ? woManagement.comment.trim() : "";
            woManagement.checkRefresh = true;
            const history = {
                woId: woManagement.woId,
                woCode: woManagement.woCode,
                woContent: woManagement.woContent,
                fileName: woManagement.fileName,
                userName: JSON.parse(localStorage.user).userName,
                updateTime: new Date(),
                comments: "Web:" + (woManagement.comment ? woManagement.comment : this.props.t("woManagement:woManagement.label.startProcess")),
                createPersonId: woManagement.createPersonId,
                cdId: woManagement.cdId,
                ftId: woManagement.ftId
            };
            woManagement.woHistoryDTO = history;
            if (woManagement.status === 5) {
                woManagement.showMaterialInfo = true;
            } else {
                woManagement.showMaterialInfo = false;
            }
            
            woManagement.status = 6;
            this.props.actions.updateStatusFromWeb(woManagement).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.closePopup();
                    this.props.closePage("PROCESS", true);
                    toastr.success(this.props.t("woManagement:woManagement.message.success.completeWo") + ": " + woManagement.woCode);
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.completeWo"));
                }
            }).catch((response) => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(response.error.response.data.message);
                }
            });
        }
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormCompletePopup");
    }

    async validateComplete() {
        const lstAllChecklist = await this.props.actions.getDetailWoTypeManagement(this.state.selectedData.woTypeId).then((response) => {
            return response.payload.data.woTypeCheckListDTOList;
        }).catch((response) => {
            return [];
        });
        if (lstAllChecklist.length > 0) {
            const lstChecklistInput = await this.props.actions.getListWoChecklistDetailDTO({woId: this.state.selectedData.woId}).then((response) => {
                return response.payload.data;
            }).catch((response) => {
                return [];
            });
            if (lstChecklistInput === null || lstChecklistInput.length !== lstAllChecklist.length) {
                toastr.warning(this.props.t("woManagement:woManagement.message.required.checklist"));
                return false;
            }
        }
        return true;
    }

    closePopup = () => {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenCompletePopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormCompletePopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.title.updateComplete")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="comment" label={t("woManagement:woManagement.label.comments")} maxLength="128"
                                required validate={{ required: { value: true, errorMessage: t("woManagement:woManagement.message.required.comments") } }} />
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

WoManagementCompletePopup.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, commonActions, WoManagementActions, WoTypeManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementCompletePopup));