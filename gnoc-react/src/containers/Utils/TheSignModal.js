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
import {useDropzone} from 'react-dropzone';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import FileSaver from 'file-saver';
import { CustomAvField } from "../../containers/Utils";
import { confirmAlertInfo } from './Utils';

class TheSignModal extends Component {
    constructor(props) {
        super(props);

        this.onOpenedModal = this.onOpenedModal.bind(this);
        this.onTheSign = this.onTheSign.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);

        this.state = {
            btnTheSignLoading: false,
            //TheSignModal
            backdrop: "static",
            theSignModal: false,
            client: null,
            moduleName: null,
            file: null,
            selectedData: {}
        };
    }

    onOpenedModal(obj) {
        const { moduleName, client, selectedData } = obj;
        this.setState({
            moduleName,
            client,
            selectedData
        });
    }

    onCloseModal() {
        this.setState({
            file : null
        });
        this.props.closeTheSignModal();
    }

    onTheSign(event, values) {
        if(this.state.file === null) {
            toastr.warning(this.props.t("common:common.message.required.file"));
            this.setState({
                btnTheSignLoading: false
            });
            return;
        }
        confirmAlertInfo(this.props.t("common:common.message.confirmTheSign"),
        this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
        () => {
            values.odId = this.state.selectedData.odId;
            this.setState({
                btnTheSignLoading: true
            }, () => {
                this.props.actions.onTheSign(this.state.client, this.state.moduleName, this.state.file, values).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        toastr.success(this.props.t("common:common.message.success.theSign"));
                        this.props.theSignResult(true);
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                        this.props.theSignResult(false);
                    } else {
                        toastr.error(this.props.t("common:common.message.error.theSign"));
                        this.props.theSignResult(false);
                    }
                    this.onCloseModal();
                    this.setState({ btnTheSignLoading: false });
                }).catch((response) => {
                    this.setState({ btnTheSignLoading: false });
                    toastr.error(this.props.t("common:common.message.error.theSign"));
                    this.onCloseModal();
                });
            });
        }, () => {
            
        });
    }

    handleDrop = acceptedFiles => {
        if(acceptedFiles[0].size <= 40894464) {
            this.setState({ file: acceptedFiles[0] });
        } else {
            toastr.error(this.props.t("common:common.message.error.fileSize"));
        }
    }

    removeFile() {
        this.setState({
            file: null
        });
    }

    render() {
        const { t } = this.props;
        let user = {};
        user.userName = JSON.parse(localStorage.user).userName;
        return (
        <div>
            <Modal isOpen={this.props.stateTheSignModal.theSignModal} onOpened={this.onOpenedModal.bind(this, this.props.stateTheSignModal)} toggle={this.props.closeTheSignModal} backdrop={this.state.backdrop}
                    className={'modal-primary modal-md ' + this.props.className}>
                <AvForm onValidSubmit={this.onTheSign} model={user}>
                    <ModalHeader toggle={this.props.closeTheSignModal}>{t("common:common.title.theSign")}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField name="userName" label={t("common:common.label.username")} placeholder={t("common:common.placeholder.username")} required
                                    validate={{ required: { value: true, errorMessage: t("common:common.message.required.username") } }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField name="password" type="password" autoComplete="off" label={t("common:common.label.password")} placeholder={t("common:common.placeholder.password")} required
                                    validate={{ required: { value: true, errorMessage: t("common:common.message.required.password") }}} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField name="emailUser" label={t("common:common.label.emailApprove")} placeholder={t("common:common.placeholder.emailApprove")} required
                                    validate={{
                                        required: { value: true, errorMessage: t("common:common.message.required.emailApprove") },
                                        email: {value: true, errorMessage: t("common:common.message.error.emailFormat")}
                                    }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomAvField name="title" label={t("common:common.label.titleTheSign")} placeholder={t("common:common.placeholder.titleTheSign")} required
                                    validate={{ required: { value: true, errorMessage: t("common:common.message.required.titleTheSign") } }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="text-left">
                                <FormGroup>
                                    <Dropzone onDrop={this.handleDrop}
                                    files={this.state.file}
                                    removeFile={this.removeFile} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                    <LaddaButton type="submit"
                        className="btn btn-primary btn-md mr-1"
                        loading={this.state.btnTheSignLoading}
                        data-style={ZOOM_OUT}>
                        <i className="fa fa-sign-in"></i> {t("common:common.button.theSign")}
                    </LaddaButton>{' '}
                    <Button type="button" color="secondary" onClick={this.props.closeTheSignModal}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        </div>
        );
    }
}

TheSignModal.propTypes = {
    closeTheSignModal: PropTypes.func.isRequired,
    theSignResult: PropTypes.func.isRequired,
    stateTheSignModal: PropTypes.object.isRequired
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
    const {getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({
        accept: 'application/pdf',
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

    const downloadFileLocal = (item) => {
        FileSaver.saveAs(item, item.fileName);
    }

    return (
        <div {...rootProps}>
            <input {...getInputProps()}/>
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.dragFiles"/></p>
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.acceptFile"/></p>
            <p style={{marginBottom: '0.5em'}}><Trans i18nKey="common:common.label.maxFileSize"/></p>
            <button type="button" onClick={open}>
                <Trans i18nKey="common:common.button.chooseFileAttachment"/>
            </button>
            <aside>
                <ul style={{listStyleType: 'none'}}>
                    {
                        props.files ?
                        <li style={{marginLeft: '-2rem'}}>
                            <span className="app-span-icon-table" onClick={() => props.removeFile()}><i className="fa fa-times-circle"></i></span>
                            <Button color="link" onClick={() => downloadFileLocal(props.files)}>{props.files.path} - {props.files.size} bytes</Button>
                        </li> : ''
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TheSignModal));