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
            selectValueResult: {},
            selectValueReceiveUser: {},
            isAssign: false
        };
    }

    async handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormStatusPopup");
        const check = await this.validateComplete();
        if (check) {
            const woManagement = Object.assign({}, this.state.selectedData, values);
            woManagement.action = this.state.selectValueResult.value ? parseInt(this.state.selectValueResult.value) : woManagement.result;
            if (this.state.selectValueResult.value === "2" || this.state.selectValueResult.value === "0") {
                woManagement.finishTime = new Date();
                woManagement.status = 8;
            } else if (this.state.selectValueResult.value === "1") {
                woManagement.lastUpdateTime = new Date();
                woManagement.finishTime = null;
                // Xu ly update lai wo ve DISPATCH
                woManagement.status = 3;
                // woManagement.action = null;
                woManagement.ftId = this.state.selectValueReceiveUser.value;
                woManagement.ftName = this.state.selectValueReceiveUser.label.split(/[()]+/)[1];
            } else if (this.state.selectValueResult.value === "3") {
                toastr.warning(this.props.t("woManagement:woManagement.message.error.resultInvalid"));
                return;
            }
            woManagement.comment = woManagement.comment ? woManagement.comment.trim() : "";
            this.props.actions.approveWo(woManagement).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.closePopup();
                    this.props.closePage("PROCESS", true);
                    toastr.success(this.props.t("woManagement:woManagement.message.success.approveWo") + ": " + woManagement.woCode);
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.approveWo"));
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

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormStatusPopup");
    }

    closePopup = () => {
        this.props.closePopup();
    }

    handleChangeResult = (d) => {
        this.setState({
            selectValueResult: d
        }, () => {
            if (this.state.selectValueResult.value) {
                if (this.state.selectValueResult.value === "1") {
                    this.setState({
                        isAssign: true
                    });
                } else {
                    this.setState({
                        isAssign: false
                    });
                }
            }
        });
    }

    render() {
        const { t } = this.props;
        const woResultStatus = (this.props.response.common.woResultStatus && this.props.response.common.woResultStatus.payload) ? this.props.response.common.woResultStatus.payload.data.data : [];
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenStatusPopup} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormStatusPopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.title.updateStatus")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"result"}
                                    label={t("woManagement:woManagement.label.result")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.result")}
                                    options={woResultStatus.map(item => {return {itemId: item.itemValue, itemName: item.itemName}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeResult}
                                    selectValue={this.state.selectValueResult}
                                />
                            </Col>
                            <Col xs="12" sm="12" className={this.state.isAssign ? "" : "class-hidden"}>
                                <CustomAutocomplete
                                    name={"receiveUserId"}
                                    label={t("woManagement:woManagement.label.ftName")}
                                    placeholder={t("woManagement:woManagement.placeholder.ftName")}
                                    isRequired={this.state.isAssign}
                                    messageRequire={t("woManagement:woManagement.message.required.ftName")}
                                    moduleName={"USERS_FT"}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueReceiveUser: d })}
                                    selectValue={this.state.selectValueReceiveUser}
                                    isHasChildren={true}
                                />
                            </Col>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="comment" label={t("woManagement:woManagement.label.comments")} maxLength="128" />
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
        actions: bindActionCreators(Object.assign({}, commonActions, WoManagementActions, WoTypeManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementRejectPopup));