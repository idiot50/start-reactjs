import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, FormGroup, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { CustomDatePicker } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm, convertDateToDDMMYYYYHHMISS, DropzoneImport } from '../../../containers/Utils/Utils';

class WoManagementExportFileTestServicePopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            createTimeFrom: null,
            createTimeTo: null,
            filesCr: null,
            filesWo: null,
            handleSubmit: ""
        };
    }

    handleValidSubmitAddOrEdit(event, values) {
        if (this.state.createTimeFrom > this.state.createTimeTo) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.createTimeFrom"));
            return;
        }
        let files = [];
        let moduleName = "";
        let message = "";
        if (this.state.handleSubmit === "WO") {
            files = this.state.filesWo ? [this.state.filesWo] : [];
            moduleName = "EXPORT_FILE_TEST_SERVICE";
            message = this.props.t("woManagement:woManagement.message.error.exportWo");
        } else if (this.state.handleSubmit === "CR") {
            files = this.state.filesCr ? [this.state.filesCr] : [];
            moduleName = "EXPORT_WO_FROM_CR";
            message = this.props.t("woManagement:woManagement.message.error.exportCr");
        }
        this.props.actions.onExportFileWoTestService(files, convertDateToDDMMYYYYHHMISS(this.state.createTimeFrom), convertDateToDDMMYYYYHHMISS(this.state.createTimeTo), moduleName).then((response) => {
            const contentDisposition = response.headers["content-disposition"];
            const content = contentDisposition.split(";")[2].split("=")[1].split("\"").join("");
            const resultObject = JSON.parse(decodeURIComponent(content));
            if (resultObject.key === "SUCCESS") {
                if (this.state.handleSubmit === "WO") {
                    this.closePopup();
                }
                toastr.success(this.props.t("common:common.message.success.downloadFile"));
            } else if (resultObject.key === "FILE_IS_NULL") {
                toastr.error(this.props.t("common:common.message.error.fileNull"));
            } else if (resultObject.key === "FILE_INVALID_FORMAT") {
                toastr.error(this.props.t("common:common.message.error.fileInvalidFormat"));
            } else if (resultObject.key === "DATA_OVER") {
                toastr.error(this.props.t("common:common.message.error.dataOver"));
            } else if (resultObject.key === "ERROR") {
                try {
                    toastr.error(resultObject.message);
                } catch (error) {
                    toastr.error(this.props.t("common:common.message.error.import"));
                }
            } else if (resultObject.key === "NODATA") {
                if (this.state.handleSubmit === "CR") {
                    toastr.error(this.props.t("woManagement:woManagement.message.error.woNotFound"));
                } else {
                    toastr.error(this.props.t("common:common.message.error.noData"));
                }
            }
        }).catch((response) => {
            toastr.error(message);
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormExportFileTestServicePopup");
    }

    handleDropCr = acceptedFiles => {
        this.setState({ filesCr: acceptedFiles[0] });
    }

    removeFileCr = () => {
        this.setState({
            filesCr: null
        });
    }

    handleDropWo = acceptedFiles => {
        this.setState({ filesWo: acceptedFiles[0] });
    }

    removeFileWo = () => {
        this.setState({
            filesWo: null
        });
    }

    closePopup = () => {
        this.setState({
            createTimeFrom: null,
            createTimeTo: null,
            filesCr: null,
            filesWo: null,
            handleSubmit: ""
        }, () => {
            this.props.closePopup();
        });
    }

    downloadFileTemplate = (module) => {
        if (module === "CR") {
            this.props.actions.onDownloadFileTemplate("wo", "WO_TEST_SERVICE_CR").then((response) => {
            }).catch((response) => {
                toastr.error(this.props.t("woManagement:woManagement.message.error.downloadFile"));
            });
        } else {
            this.props.actions.onDownloadFileTemplate("wo", "WO_TEST_SERVICE_WO").then((response) => {
            }).catch((response) => {
                toastr.error(this.props.t("woManagement:woManagement.message.error.downloadFile"));
            });
        }
    }

    exportListWo = () => {
        this.setState({
            handleSubmit: "WO"
        }, () => {
            this.handleValidSubmitAddOrEdit(null, null);
            // this.myForm.submit();
        });
    }

    exportListCr = () => {
        this.setState({
            handleSubmit: "CR"
        }, () => {
            this.myForm.submit();
        });
    }

    render() {
        const { t } = this.props;
        const { filesCr, filesWo } = this.state;
        const objectAddEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenExportFileTestServicePopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormExportFileTestServicePopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddEdit} ref={(ref) => this.myForm = ref}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woManagement:woManagement.title.exportFileTestService")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"createTimeFrom"}
                                    label={t("woManagement:woManagement.label.createTimeFrom")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.createTimeFrom")}
                                    selected={this.state.createTimeFrom}
                                    handleOnChange={(d) => this.setState({ createTimeFrom: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"createTimeTo"}
                                    label={t("woManagement:woManagement.label.createTimeTo")}
                                    isRequired={true}
                                    messageRequire={t("woManagement:woManagement.message.required.createTimeTo")}
                                    selected={this.state.createTimeTo}
                                    handleOnChange={(d) => this.setState({ createTimeTo: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="mb-2">
                                {t("woManagement:woManagement.label.crList")}
                            </Col>
                            <Col xs="12" sm="12">
                                <FormGroup>
                                    <DropzoneImport onDrop={this.handleDropCr}
                                        onClickDownloadFileTemplate={() => this.downloadFileTemplate("CR")}
                                        titleTemplate={t("common:common.button.downloadTemplate")}
                                        file={this.state.filesCr}
                                        removeFile={this.removeFileCr}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12" sm="12" className="mb-2 text-center mt-2">
                                <Button type="button" color="primary" onClick={this.exportListCr} disabled={this.state.filesCr === null}>
                                    <i className="fa fa-download"></i> {t("woManagement:woManagement.button.exportListWo")}
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="mb-2">
                                {t("woManagement:woManagement.label.woTestServiceList")}
                            </Col>
                            <Col xs="12" sm="12">
                                <FormGroup>
                                    <DropzoneImport onDrop={this.handleDropWo}
                                        onClickDownloadFileTemplate={() => this.downloadFileTemplate("WO")}
                                        titleTemplate={t("common:common.button.downloadTemplate")}
                                        file={this.state.filesWo}
                                        removeFile={this.removeFileWo}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="12" sm="12" className="text-center mt-2">
                                <Button type="button" color="primary" className="mr-1" onClick={this.exportListWo} disabled={this.state.filesWo === null}>
                                    <i className="fa fa-download"></i> {t("woManagement:woManagement.button.exportWoDetail")}
                                </Button>
                                <Button type="button" color="secondary" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </AvForm>
            </Modal>
        );
    }
}

WoManagementExportFileTestServicePopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementExportFileTestServicePopup));