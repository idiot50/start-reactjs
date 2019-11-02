import React, { Component, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  FormGroup,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { translate, Trans } from 'react-i18next';
import {useDropzone} from 'react-dropzone';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { CustomSelectLocal } from '../../../containers/Utils';
import { invalidSubmitForm } from '../../../containers/Utils/Utils';

class CrManagementImport extends Component {
    constructor(props) {
        super(props);

        this.onOpenedModal = this.onOpenedModal.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.downloadFileTemplate = this.downloadFileTemplate.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);

        this.state = {
            btnUploadLoading: false,
            backdrop: "static",
            importModal: false,
            file: null,
            selectValueNation: {value: "VNM"},
            selectedData: {},
            actionType: 0
        };
    }

    onOpenedModal(obj) {
        const { selectedData, actionType } = obj;
        this.setState({
            selectedData,
            actionType
        });
    }

    uploadFile(event, values) {
        this.setState({
            btnUploadLoading: true
        }, () => {
            if (this.props.moduleName === "CR_NUMBER") {
                this.props.actions.importCheckCr(this.state.file).then((response) => {
                    const result = response.payload.data.key;
                    if (result === "SUCCESS") {
                        if (response.payload.data.object) {
                            document.getElementById("input-filter-crNumber").value = response.payload.data.object;
                            toastr.success(this.props.t("common:common.message.success.import"));
                            this.props.closeImportModal();
                        } else {
                            toastr.error(this.props.t("common:common.message.error.noData"));
                        }
                    } else if (result === "FILE_IS_NULL") {
                        toastr.error(this.props.t("common:common.message.error.fileNull"));
                    } else if (result === "FILE_INVALID_FORMAT") {
                        toastr.error(this.props.t("common:common.message.error.fileInvalidFormat"));
                    } else if (result === "DATA_OVER") {
                        toastr.error(this.props.t("common:common.message.error.dataOver"));
                    } else if (result === "ERROR") {
                        toastr.error(this.props.t("common:common.message.error.import"));
                    } else if (result === "NODATA") {
                        toastr.error(this.props.t("common:common.message.error.noData"));
                    } else {
                        toastr.error(this.props.t("common:common.message.error.import"));
                    }
                    this.setState({ btnUploadLoading: false });
                }).catch((response) => {
                    this.setState({ btnUploadLoading: false });
                    toastr.error(this.props.t("common:common.message.error.import"));
                });
            } else if (this.props.moduleName === "NETWORK_NODE") {
                this.props.actions.actionImportAndGetNetworkNodeV2(this.state.file, this.state.selectedData, this.state.selectValueNation.value, this.state.actionType).then((response) => {
                    const result = response.payload.data.key;
                    if (result === "SUCCESS" && response.payload.data.message !== "NOK") {
                        this.props.setValueDataTable(response.payload.data.object);
                        toastr.success(this.props.t("common:common.message.success.import"));
                        this.props.closeImportModal();
                    } else if (result === "FILE_IS_NULL") {
                        toastr.error(this.props.t("common:common.message.error.fileNull"));
                    } else if (result === "FILE_INVALID_FORMAT") {
                        toastr.error(this.props.t("common:common.message.error.fileInvalidFormat"));
                    } else if (result === "DATA_OVER") {
                        toastr.error(this.props.t("common:common.message.error.dataOver"));
                    } else if (result === "ERROR") {
                        toastr.error(this.props.t("common:common.message.error.import"));
                    } else if (result === "NODATA") {
                        toastr.error(this.props.t("common:common.message.error.noData"));
                    } else {
                        toastr.error(this.props.t("common:common.message.error.import"));
                    }
                    this.setState({ btnUploadLoading: false });
                }).catch((response) => {
                    this.setState({ btnUploadLoading: false });
                    toastr.error(this.props.t("common:common.message.error.import"));
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormImportCr");
    }

    handleDrop = acceptedFiles => {
        this.setState({ file: acceptedFiles[0] });
    }

    handleDropAttachment = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.filesAttachment.some(el => el.path === item.path)) {
                const arr = ['xls','xlsx', 'xlsm']
                if(arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if(item.size <= 40894464) {
                        this.setState({ filesAttachment: [...this.state.filesAttachment, item] });
                    } else {
                        toastr.error(this.props.t("common:common.message.error.fileSize"));
                    }
                } else {
                    toastr.error(this.props.t("common:common.message.error.fileFormat"));
                }
            }
        });
    }

    removeFileAttachment(item) {
        let index = this.state.filesAttachment.indexOf(item);
        let arrFile = this.state.filesAttachment;
        arrFile.splice(index, 1);
        this.setState({
            filesAttachment: arrFile
        });
    }

    downloadFileTemplate() {
        if (this.props.moduleName === "CR_NUMBER") {
            this.props.actions.onDownloadFileTemplate("cr", "CR_MAIN").then((response) => {
                toastr.success(this.props.t("common:common.message.success.downloadTemplate"));
            }).catch((response) => {
                toastr.error(this.props.t("common:common.message.error.downloadTemplate"));
            });
        } else if (this.props.moduleName === "NETWORK_NODE") {
            this.props.actions.onDownloadFileTemplate("cr", "").then((response) => {
                toastr.success(this.props.t("common:common.message.success.downloadTemplate"));
            }).catch((response) => {
                toastr.error(this.props.t("common:common.message.error.downloadTemplate"));
            });
        }
    }

    closeImportModal() {
        this.setState({
            file: null,
            filesAttachment: [],
            selectValueTypeImport: {}
        });
        this.props.closeImportModal();
    }

    render() {
        const { t, response } = this.props;
        let disabledImport = this.state.file === null;
        const nationList = (response.timezone && response.timezone.payload) ? response.timezone.payload.data : [];
        return (
        <div>
            <Modal isOpen={this.props.parentState.importModal} onOpened={this.onOpenedModal.bind(this, this.props.parentState)} toggle={this.closeImportModal} backdrop={this.state.backdrop}
                    className={'modal-primary modal-md ' + this.props.className}>
                <AvForm id="idFormImportCr" onValidSubmit={this.uploadFile} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit}>
                    <ModalHeader toggle={this.closeImportModal}>
                        {this.props.moduleName === "CR_NUMBER" ? t("crManagement:crManagement.title.importCrNumber") : t("crManagement:crManagement.title.importNetworkNode")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"nation"}
                                    label={t("crManagement:crManagement.label.nation")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.nation")}
                                    options={Array.from(new Set(nationList.map(item => item.nationCode))).map(item => {return {itemId: item, itemName: item}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueNation: d })}
                                    selectValue={this.state.selectValueNation}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="text-left">
                                <FormGroup>
                                    <Dropzone onDrop={this.handleDrop} onClickDownloadFileTemplate={this.downloadFileTemplate} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                    <LaddaButton type="submit"  disabled={disabledImport}
                        className="btn btn-primary btn-md mr-1"
                        loading={this.state.btnUploadLoading}
                        data-style={ZOOM_OUT}>
                        <i className="fa fa-upload"></i> {t("common:common.button.upload")}
                    </LaddaButton>{' '}
                    <Button type="button" color="secondary" onClick={this.closeImportModal}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        </div>
        );
    }
}

CrManagementImport.propTypes = {
    closeImportModal: PropTypes.func.isRequired,
    reloadGridData: PropTypes.func,
    parentState: PropTypes.object.isRequired,
    moduleName: PropTypes.string.isRequired,
    setValueDataTable: PropTypes.func
};

const baseStyle = {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: '5px 0px 0px 5px'
};
const activeStyle = {
    borderStyle: 'solid',
    borderColor: '#6c6',
    backgroundColor: '#eee'
};
const acceptStyle = {
    borderStyle: 'solid',
    borderColor: '#00e676'
};
const rejectStyle = {
    borderStyle: 'solid',
    borderColor: '#ff1744'
};

function  Dropzone(props) {
    const onDrop = useCallback(acceptedFiles => {
        props.onDrop(acceptedFiles);
    }, []);
    const {acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        accept: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel.sheet.macroEnabled.12', 'application/vnd.ms-excel'],
        multiple: false,
        onDrop
    });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);
    const acceptedFilesItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));
    const rootProps = getRootProps({
        style,
        // Disable click and keydown behavior
        onClick: event => event.stopPropagation(),
        onKeyDown: event => {
            if (event.keyCode === 32 || event.keyCode === 13) {
                event.stopPropagation();
            }
        }
    });
    return (
        <div {...rootProps}>
            <input {...getInputProps()}/>
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.dragFiles"/></p>
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.acceptFileExcel"/></p>
            <button type="button" onClick={open}>
                <Trans i18nKey="common:common.button.chooseFileImport"/>
            </button>
            <aside>
                <ul style={{paddingLeft: '1rem', marginBottom: '0rem'}}>
                    {acceptedFilesItems}
                </ul>
            </aside>
            <span style={{marginLeft: '-6px'}}>
                <Button type="button" color="link" onClick={() => props.onClickDownloadFileTemplate()}><Trans i18nKey="common:common.button.downloadTemplate"/></Button>
            </span>
        </div>
    );
}

function mapStateToProps(state, ownProps) {
    return {
        response: state.common
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementImport));