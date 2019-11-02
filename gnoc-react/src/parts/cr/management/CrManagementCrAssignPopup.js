import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Row, Col, ListGroup, ListGroupItem, Label } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomSelectLocal, CustomAvField, CustomInputPopup } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { validSubmitForm, invalidSubmitForm, convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import CrManagementInfoTabUserCabPopup from './CrManagementInfoTabUserCabPopup';
import { Dropzone, downloadFileLocal } from "../../../containers/Utils/Utils";

class CrManagementCrAssignPopup extends Component {
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
            createdDate: new Date(),
            userCab: {},
            isOpenUserCabPopup: false,
            files: []
        };
    }

    componentDidMount() {
        
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddWorklog");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const crManagement = Object.assign({}, values);
            crManagement.crId = this.state.selectedData.crId;
            crManagement.handoverCa = this.state.userCab.userCab;
            crManagement.workLog = crManagement.workLog ? crManagement.workLog.trim() : "";
            this.props.actions.doAssignHandoverCa(this.state.files, crManagement).then((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.props.closePopup();
                        this.props.closePage("EDIT", true);
                        toastr.success(this.props.t("crManagement:crManagement.message.success.edit"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
                    }
                });
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    try {
                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                    } catch (error) {
                        toastr.error(this.props.t("crManagement:crManagement.message.error.edit"));
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

    openUserCabPopup = () => {
        this.setState({
            isOpenUserCabPopup: true
        });
    }

    closeUserCabPopup = () => {
        this.setState({
            isOpenUserCabPopup: false
        });
    }

    setValueUserCab = (data) => {
        this.setState({
            userCab: data[0]
        });
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.path === item.path)) {
                const arr = ['doc','docx','pdf','xls','xlsx','ppt','pptx','csv','txt','rar','zip','7z','jpg','gif','png','bmp','sql']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({ files: [...this.state.files, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFile = (item) => {
        let index = this.state.files.indexOf(item);
        let arrFile = [...this.state.files];
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    render() {
        const { t } = this.props;
        const objectAddOrEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupAssign} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormAddWorklog" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <ModalHeader toggle={this.closePage}>
                        {t("crManagement:crManagement.title.worklogInfo")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField type="textarea" rows="3" name="workLog" label={t("crManagement:crManagement.label.worklog")} required
                                    maxLength="2000" validate={{ required: { value: true, errorMessage: t("crManagement:crManagement.message.required.worklog") } }} />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomInputPopup
                                    name={"userId"}
                                    label={t("crManagement:crManagement.label.userAssign")}
                                    placeholder={t("crManagement:crManagement.placeholder.doubleClick")}
                                    value={this.state.userCab.username || ""}
                                    handleRemove={() => this.setState({ userCab: {} })}
                                    handleDoubleClick={this.openUserCabPopup}
                                    isRequired={false}
                                    messageRequire={t("crManagement:crManagement.message.required.userAssign")}
                                    isDisabled={false}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <Label style={{ fontWeight: '500' }}>{t("crManagement:crManagement.label.fileImpactLog")}</Label>
                            </Col>
                            <Col xs="12" sm="12">
                                <Dropzone onDrop={this.handleDrop} className="pb-2" />
                            </Col>
                            <Col xs="12" sm="12">
                                <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                    <ListGroup>
                                        {this.state.files.map((item, index) => (
                                            <ListGroupItem key={"item-" + index} style={{height: '2.5em'}} className="d-flex align-items-center">
                                                <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                </div>
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
                <CrManagementInfoTabUserCabPopup
                    parentState={this.state}
                    closePopup={this.closeUserCabPopup}
                    setValue={this.setValueUserCab} />
            </Modal>
        );
    }
}

CrManagementCrAssignPopup.propTypes = {
    closePopup: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    closePage: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCrAssignPopup));