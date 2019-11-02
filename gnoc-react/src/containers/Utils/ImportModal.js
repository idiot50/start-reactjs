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
import * as commonActions from '../../actions/commonActions';
import { translate, Trans } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { CustomSelectLocal } from './index';
import { DropzoneImport } from './Utils';

class ImportModal extends Component {
    constructor(props) {
        super(props);

        this.onOpenedModal = this.onOpenedModal.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.removeFileAttachment = this.removeFileAttachment.bind(this);
        this.downloadFileTemplate = this.downloadFileTemplate.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.handleItemSelectChangeTypeImport = this.handleItemSelectChangeTypeImport.bind(this);

        this.state = {
            btnUploadLoading: false,
            //ImportModal
            backdrop: "static",
            importModal: false,
            client: null,
            moduleName: null,
            file: null,
            filesAttachment: [],
            objectSearch: {},
            //Type import
            typeImportListSelect: [
                { itemId: "CDGROUP", itemName: props.t("common:common.dropdown.woCdGroup.cdGroup") },
                { itemId: "EMPLOYEE", itemName: props.t("common:common.dropdown.woCdGroup.employee") },
                { itemId: "WORK", itemName: props.t("common:common.dropdown.woCdGroup.work") }
            ],
            selectValueTypeImport: {}
        };
    }

    handleItemSelectChangeTypeImport(option) {
        this.setState({ selectValueTypeImport: option });
    }

    onOpenedModal(obj) {
        const { moduleName, client, objectSearch } = obj;
        this.setState({
            moduleName,
            client,
            objectSearch
        });
    }

    uploadFile(event, errors, values) {
        this.setState({
            btnUploadLoading: true
        }, () => {
            let moduleName = this.state.moduleName;
            if (moduleName === "WO_CDGROUPMANAGEMENT") {
                if (this.state.selectValueTypeImport.value === "CDGROUP") {
                    moduleName = "WO_CD_GROUP";
                } else if (this.state.selectValueTypeImport.value === "EMPLOYEE") {
                    moduleName = "WO_CD";
                } else if (this.state.selectValueTypeImport.value === "WORK") {
                    moduleName = "WO_TYPE_GROUP";
                }
            }
            this.props.actions.onImportFile(this.state.client, moduleName, this.state.file, this.state.filesAttachment, this.state.objectSearch).then((response) => {
                const contentDisposition = response.headers["content-disposition"];
                const result = contentDisposition.split(";")[1].split("=")[1].split("\"").join("");
                if (result === "SUCCESS") {
                    toastr.success(this.props.t("common:common.message.success.import"));
                    this.props.reloadGridData();
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
                }
                this.setState({ btnUploadLoading: false });
            }).catch((response) => {
                this.setState({ btnUploadLoading: false });
                toastr.error(this.props.t("common:common.message.error.import"));
            });
        });
    }

    handleDrop = acceptedFiles => {
        this.setState({ file: acceptedFiles[0] });
    }

    handleDropAttachment = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.filesAttachment.some(el => el.path === item.path)) {
                const arr = ['xls', 'xlsx', 'xlsm']
                if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if (item.size <= 40894464) {
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

    removeFile(item) {
        this.setState({ file: null });
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
        let moduleName = this.state.moduleName;
        if (moduleName === "WO_CDGROUPMANAGEMENT") {
            if (this.state.selectValueTypeImport.value === "CDGROUP") {
                moduleName = "WO_CD_GROUP";
            } else if (this.state.selectValueTypeImport.value === "EMPLOYEE") {
                moduleName = "WO_CD";
            } else if (this.state.selectValueTypeImport.value === "WORK") {
                moduleName = "WO_TYPE_GROUP";
            } else {
                return toastr.warning(this.props.t("common:common.message.required.downloadTemplate"))
            }
        }
        this.props.actions.onDownloadFileTemplate(this.state.client, moduleName).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadTemplate"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadTemplate"));
        });
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
        const { t } = this.props;
        let disabledImport = true;
        if (this.state.moduleName === "WO_CDGROUPMANAGEMENT") {
            if (this.state.selectValueTypeImport.value && this.state.file !== null) {
                disabledImport = false;
            }
        } else {
            if (this.state.file !== null) {
                disabledImport = false;
            }
        }
        return (
            <div>
                <Modal isOpen={this.props.stateImportModal.importModal} onOpened={this.onOpenedModal.bind(this, this.props.stateImportModal)} toggle={this.closeImportModal} backdrop={this.state.backdrop}
                    className={'modal-primary modal-md'} style={{ marginTop: '150px' }}>
                    <AvForm onSubmit={this.uploadFile}>
                        <ModalHeader toggle={this.closeImportModal}>{t("common:common.title.import")}</ModalHeader>
                        <ModalBody>
                            {
                                this.state.moduleName === "WO_CDGROUPMANAGEMENT" ?
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <CustomSelectLocal
                                                name={"typeImport"}
                                                label={t("common:common.label.typeImport")}
                                                isRequired={false}
                                                options={this.state.typeImportListSelect}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleItemSelectChangeTypeImport}
                                                selectValue={this.state.selectValueTypeImport}
                                            />
                                        </Col>
                                    </Row>
                                    : null
                            }
                            <Row>
                                <Col xs="12" sm="12" className="text-left">
                                    <FormGroup>
                                        <DropzoneImport onDrop={this.handleDrop}
                                            onClickDownloadFileTemplate={this.downloadFileTemplate}
                                            titleTemplate={t("common:common.button.downloadTemplate")}
                                            file={this.state.file}
                                            removeFile={this.removeFile}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            {
                                this.state.moduleName === "OD_CONFIG_SCHEDULE_CREATE" ?
                                    <Row>
                                        <Col xs="12" sm="12" className="text-left">
                                            <DropzoneAttment onDrop={this.handleDropAttachment}
                                                files={this.state.filesAttachment}
                                                removeFile={this.removeFileAttachment}
                                            />
                                        </Col>
                                    </Row>
                                    : null
                            }
                        </ModalBody>
                        <ModalFooter>
                            <LaddaButton type="submit" disabled={disabledImport}
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

ImportModal.propTypes = {
    closeImportModal: PropTypes.func.isRequired,
    reloadGridData: PropTypes.func.isRequired,
    stateImportModal: PropTypes.object.isRequired
};

function DropzoneAttment(props) {
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
    const onDrop = useCallback(acceptedFiles => {
        props.onDrop(acceptedFiles);
    }, []);
    const { getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        multiple: true,
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
    const acceptedFilesItems = props.files.map(file => (
        <div style={{ display: 'flex' }}>
            <span style={{ marginRight: '3px', cursor: 'pointer', fontSize: '18px' }} onClick={() => props.removeFile(file)}><i className="fa fa-times-circle"></i></span>
            <span style={{ marginTop: '4px' }}>{file.path} - {file.size} bytes</span>
        </div>
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
            <input {...getInputProps()} />
            <p style={{ marginBottom: '0.5em' }}><Trans i18nKey="common:common.label.dragFiles" /></p>
            <p style={{ marginBottom: '0.5em' }}><Trans i18nKey="common:common.label.acceptFile" /></p>
            <p style={{ marginBottom: '0.5em' }}><Trans i18nKey="common:common.label.maxFileSize" /></p>
            <button type="button" onClick={open}>
                <Trans i18nKey="common:common.button.chooseFileAttachment" />
            </button>
            <aside>
                <ul style={{ paddingLeft: '0rem', marginBottom: '0.5rem' }}>
                    {acceptedFilesItems}
                </ul>
            </aside>
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
        actions: bindActionCreators(commonActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ImportModal));