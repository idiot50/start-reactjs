import React, { Component, useMemo, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import * as WoTypeManagementActions from './WoTypeManagementActions';
import { downloadFileLocal, validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class WoTypeManagementPopupFile extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            backdrop: "static",
            files: [],
            selectValueRequired: {}
        };
    }

    closePopup = () => {
        this.setState({
            selectValueRequired: {},
            files: []
        });
        this.props.closePopup();
    }

    handleItemSelectChangeRequired = (option) => {
        this.setState({ selectValueRequired: option })
    }

    handleDrop = acceptedFiles => {
        const arr = ['xls','xlsx'];
        if(arr.includes(acceptedFiles[0].name.split('.').pop().toLowerCase())) {
            if(acceptedFiles[0].size <= 40894464) {
                acceptedFiles[0].fileName = acceptedFiles[0].name;
                this.setState({ files: [acceptedFiles[0]] });
            } else {
                toastr.error(this.props.t("common:common.message.error.fileSize"));
            }
        } else {
            toastr.error(this.props.t("common:common.message.error.fileFormat"));
        }
    }

    removeFile(item) {
        this.setState({
            files: []
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddFilePopup");
        let objectUpdate = null;
        if (this.state.files.length > 0) {
            objectUpdate = {};
            objectUpdate.file = this.state.files[0];
            objectUpdate.required = this.state.selectValueRequired.value;
            objectUpdate.fileName = values.fileName.trim();
        } else {
            objectUpdate = {};
            objectUpdate.file = null;
            objectUpdate.required = this.state.selectValueRequired.value;
            objectUpdate.fileName = values.fileName.trim();
        }
        this.props.onFileUpdate(objectUpdate)
        this.closePopup();
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddFilePopup");
    }

    render() {
        const { t } = this.props;
        const objectAddOrEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupFile} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormAddFilePopup" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("woTypeManagement:woTypeManagement.title.addNewFile")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField
                                    name={"fileName"}
                                    label={t("woTypeManagement:woTypeManagement.label.fileName")}
                                    placeholder={t("woTypeManagement:woTypeManagement.placeholder.fileName")}
                                    required={true} maxLength={250}
                                    validate={{ required: { value: true, errorMessage: t("woTypeManagement:woTypeManagement.message.required.fileName") } }}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"isRequired"}
                                    label={t("woTypeManagement:woTypeManagement.label.required")}
                                    options={[
                                        { itemId: 1, itemName: t("woTypeManagement:woTypeManagement.dropdown.required.required") },
                                        { itemId: 0, itemName: t("woTypeManagement:woTypeManagement.dropdown.required.notRequired") }
                                    ]}
                                    isRequired={true}
                                    messageRequire={t("woTypeManagement:woTypeManagement.message.required.required")}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleItemSelectChangeRequired}
                                    selectValue={this.state.selectValueRequired}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <Dropzone onDrop={this.handleDrop} className="pb-2" />
                            </Col>
                            <Col xs="12" sm="12">
                                <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                    <ListGroup>
                                        {this.state.files.map((item, index) => (
                                            <ListGroupItem key={"item-" + index} style={{ height: '2.5em' }} className="d-flex align-items-center">
                                                <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                {item.odFileId ? <Button color="link" onClick={() => this.downloadFile(item)}>{item.fileName}</Button>
                                                    : <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                                }
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                </div>
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

function Dropzone(props) {
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
    const {acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        // accept: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel.sheet.macroEnabled.12', 'application/vnd.ms-excel'],
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
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.maxFileSize"/></p>
            <button type="button" onClick={open} className="mb-2">
                <Trans i18nKey="common:common.button.chooseFile"/>
            </button>
        </div>
    );
}

WoTypeManagementPopupFile.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoTypeManagementPopupFile));