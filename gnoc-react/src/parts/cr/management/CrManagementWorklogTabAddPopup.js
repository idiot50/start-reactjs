import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Row, Col } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomSelectLocal, CustomAvField } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { validSubmitForm, invalidSubmitForm, convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import { buildDataCbo } from './CrManagementUtils';

class CrManagementWorklogTabAddPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        
        this.state = {
            backdrop: "static",
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            actionGroupList: [],
            worklogCategoryList: [],
            selectValueActionGroup: {},
            selectValueWorklogCategory: {},
            createdDate: new Date()
        };
    }

    componentDidMount() {
        let step = "CR_CREATOR";
        if (this.state.modalName === "EDIT") {
            const state = buildDataCbo("STATE").find(item => item.itemId + "" === this.state.selectedData.state + "") || {};
            step = state.itemCode;
        }
        this.props.actions.getListUserGroupBySystem(step, { ugcySystem: "2" }).then((response) => {
            const actionGroupList = response.payload.data ? response.payload.data.map(value => ({ itemId: value.ugcyId, itemName: value.ugcyName, itemCode: value.ugcyCode })) : [];
            if (actionGroupList.length > 0) {
                this.props.actions.getListWorkLogCategoryDTO({ wlayType: actionGroupList[0].itemId }).then((response) => {
                    const worklogCategoryList = response.payload.data ? response.payload.data.map(value => ({ itemId: value.wlayId, itemName: value.wlayName, itemCode: value.wlayCode })) : [];
                    this.setState({
                        actionGroupList,
                        worklogCategoryList,
                        selectValueActionGroup: { value: actionGroupList[0].itemId }
                    });
                });
            } else {
                this.setState({
                    actionGroupList,
                    selectValueActionGroup: { value: actionGroupList[0].itemId }
                });
            }
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddWorklog");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const crManagementWorkLog = Object.assign({}, values);
            crManagementWorkLog.wlgObjectType = 2;
            crManagementWorkLog.wlgObjectId = this.state.selectedData.crId;
            crManagementWorkLog.userGroupAction = this.state.selectValueActionGroup.value;
            crManagementWorkLog.wlayId = this.state.selectValueWorklogCategory.value;
            crManagementWorkLog.wlgText = crManagementWorkLog.wlgText.trim();
            delete crManagementWorkLog["createUser"];
            delete crManagementWorkLog["createdDate"];
            this.props.actions.insertWorkLog(crManagementWorkLog).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        this.props.closePage();
                        toastr.success(this.props.t("crManagement:crManagement.message.success.addWorkLog"));
                    });
                } else {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        toastr.error(this.props.t("crManagement:crManagement.message.error.addWorkLog"));
                    });
                }
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    try {
                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                    } catch (error) {
                        toastr.error(this.props.t("crManagement:crManagement.message.error.addWorkLog"));
                    }
                });
            });
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddWorklog");
    }

    closePage = () => {
        this.props.closePage();
    }

    render() {
        const { t } = this.props;
        const { actionGroupList, worklogCategoryList } = this.state;
        const objectAddOrEdit = {};
        objectAddOrEdit.createUser = JSON.parse(localStorage.user).userName;
        objectAddOrEdit.createdDate = convertDateToDDMMYYYYHHMISS(this.state.createdDate);
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupAddWorklog} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormAddWorklog" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <ModalHeader toggle={this.closePage}>
                        {t("crManagement:crManagement.title.worklogInfo")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField name="createUser" label={t("crManagement:crManagement.label.createUser")} disabled />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomAvField name="createdDate" label={t("crManagement:crManagement.label.createTime")} disabled />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"actionGroup"}
                                    label={t("crManagement:crManagement.label.actionGroup")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.actionGroup")}
                                    options={actionGroupList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueActionGroup: d })}
                                    selectValue={this.state.selectValueActionGroup}
                                    isDisabled={true}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"worklogCategory"}
                                    label={t("crManagement:crManagement.label.worklogCategory")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.worklogCategory")}
                                    options={worklogCategoryList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueWorklogCategory: d })}
                                    selectValue={this.state.selectValueWorklogCategory}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField type="textarea" rows="3" name="wlgText" label={t("crManagement:crManagement.label.worklogDescription")} required
                                    maxLength="2000" validate={{ required: { value: true, errorMessage: t("crManagement:crManagement.message.required.worklogDescription") } }} />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <LaddaButton type="submit"
                            className="btn btn-primary btn-md ml-auto"
                            loading={this.state.btnAddOrEditLoading}
                            data-style={ZOOM_OUT}>
                            <i className="fa fa-save"></i> {t("common:common.button.save")}
                        </LaddaButton>
                        <Button type="button" color="secondary" onClick={this.closePage} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

CrManagementWorklogTabAddPopup.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementWorklogTabAddPopup));