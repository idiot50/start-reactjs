import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Tooltip,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Employees actions
import * as employeesActions from '../../../actions/employeesActions';
// Child components
import { translate, Trans } from 'react-i18next';
import Dropzone from 'react-dropzone';
import ReactAvatarEditor from 'react-avatar-editor';
import _debounce from 'lodash.debounce';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

class AddOrEditEmployeeContainer extends Component {
    constructor(props) {
        super(props);

        this.onOpenedModal = this.onOpenedModal.bind(this);
        this.onClosedModal = this.onClosedModal.bind(this);

        this.validateUsername = this.validateUsername.bind(this);
        this.validateEmployeeCode = this.validateEmployeeCode.bind(this);

        this.state = {
            //AddOrEditModal
            backdrop: "static",
            addOrEditModal: false,
            isAddOrEdit: null,
            objectAddOrEdit: {},
            //Validate
            errorUsername: "",
            errorEmployeeCode: "",
            //Avatar
            image: null,
            allowZoomOut: false,
            position: { x: 0.5, y: 0.5 },
            scale: 1,
            rotate: 0,
            borderRadius: 0,
            width: 200,
            height: 200
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            addOrEditModal: newProps.stateAddOrEditModal.addOrEditModal,
            isAddOrEdit: newProps.stateAddOrEditModal.isAddOrEdit
        });
    }

    onOpenedModal(objectUser) {
        if(this.state.isAddOrEdit === "ADD") {
            
        } else if(this.state.isAddOrEdit === "EDIT") {
            if(objectUser.avatarBase64 !== null) {
                fetch(objectUser.avatarBase64)
                .then(res => res.blob())
                .then(blob => {
                    let filename = objectUser.avatarName;
                    let mimeType = objectUser.avatarType;
                    let fileAvatar = new File([blob], filename, {type:mimeType});
                    this.setState({image: fileAvatar});
                });
            } else {
                this.setState({image: null});
            }
        }
    }

    onClosedModal() {
        this.setState({
            isAddOrEdit: null,
            image: null
        });
    }

    validateUsername = _debounce((value, ctx, input, cb) => {
        let userId = "";
        if(this.props.response.detail !== undefined && this.state.isAddOrEdit === "EDIT") {
            userId = this.props.response.detail.payload.data.userId;
        }
        if (!value || value === "") {
            this.setState({errorUsername: this.props.t("employee:employee.message.username.required")});
            cb(false);
        } else if (!value.match(/^[A-Za-z0-9]+$/)) {
            this.setState({errorUsername: this.props.t("employee:employee.message.username.pattern")});
            cb(false);
        } else {
            this.props.actions.onCheckExistUsername(value, userId).then((response) => {
                if(response.payload.data.key === "DUPLICATE") {
                    this.setState({errorUsername: this.props.t("employee:employee.message.username.duplicate")});
                    cb(false);
                } else {
                    cb(true);
                }
            }).catch((response) => {
                
            });

        }
    }, 0);

    validateEmployeeCode = _debounce((value, ctx, input, cb) => {
        let userId = "";
        if(this.props.response.detail !== undefined && this.state.isAddOrEdit === "EDIT") {
            userId = this.props.response.detail.payload.data.userId;
        }
        if (!value || value === "") {
            this.setState({errorEmployeeCode: this.props.t("employee:employee.message.employeeCode.required")});
            cb(false);
        } else if (!value.match(/^[A-Za-z0-9]+$/)) {
            this.setState({errorEmployeeCode: this.props.t("employee:employee.message.employeeCode.pattern")});
            cb(false);
        } else {
            this.props.actions.onCheckExistEmployeeCode(value, userId).then((response) => {
                if(response.payload.data.key === "DUPLICATE") {
                    this.setState({errorEmployeeCode: this.props.t("employee:employee.message.employeeCode.duplicate")});
                    cb(false);
                } else {
                    cb(true);
                }
            }).catch((response) => {
                
            });
        }
    }, 0);

    handleNewImage = e => {
        this.setState({ image: e.target.files[0] });
    }

    handleScale = e => {
        const scale = parseFloat(e.target.value);
        this.setState({ scale });
    }

    handleAllowZoomOut = ({ target: { checked: allowZoomOut } }) => {
        this.setState({ allowZoomOut });
    }

    rotateLeft = e => {
        e.preventDefault()
        this.setState({
        rotate: this.state.rotate - 90,
        })
    }

    rotateRight = e => {
        e.preventDefault()
        this.setState({
            rotate: this.state.rotate + 90,
        })
    }

    handleBorderRadius = e => {
        const borderRadius = parseInt(e.target.value);
        this.setState({ borderRadius });
    }

    logCallback(e) {
        // eslint-disable-next-line
        // console.log('callback', e);
    }

    handlePositionChange = position => {
        this.setState({ position });
    }

    handleDrop = acceptedFiles => {
        this.setState({ image: acceptedFiles[0] });
    }

    render() {
        const nowDate = new Date().toJSON().split('T')[0];
        const { t } = this.props;
        let objectAddOrEdit = {};
        if(this.state.isAddOrEdit === "ADD") {

        } else if(this.state.isAddOrEdit === "EDIT") {
            if(this.props.response.detail !== undefined) {
                objectAddOrEdit = this.props.response.detail.payload.data;
                let dateOfBirthString = objectAddOrEdit.dateOfBirth === null ? undefined : objectAddOrEdit.dateOfBirth;
                if(dateOfBirthString !== undefined) {
                    dateOfBirthString = new Date(objectAddOrEdit.dateOfBirth).toJSON().toString().split('T')[0];
                }
                objectAddOrEdit.objectUser = {
                    username: objectAddOrEdit.username === null ? undefined : objectAddOrEdit.username,
                    firstName: objectAddOrEdit.firstName === null ? undefined : objectAddOrEdit.firstName,
                    lastName: objectAddOrEdit.lastName === null ? undefined : objectAddOrEdit.lastName,
                    password: objectAddOrEdit.password === null ? undefined : objectAddOrEdit.password,
                    rePassword: objectAddOrEdit.rePassword === null ? undefined : objectAddOrEdit.rePassword,
                    email: objectAddOrEdit.email === null ? undefined : objectAddOrEdit.email,
                    phone: objectAddOrEdit.phone === null ? undefined : objectAddOrEdit.phone,
                    dateOfBirth: dateOfBirthString,
                    employeeCode: objectAddOrEdit.employeeCode === null ? undefined : objectAddOrEdit.employeeCode,
                    enabled: objectAddOrEdit.enabled === true ? "1" : objectAddOrEdit.enabled === false ? "0" : "",
                    unitId: objectAddOrEdit.unitId === null ? undefined : objectAddOrEdit.unitId
                };
            }
        }
        return (
        <div>
            <Modal isOpen={this.state.addOrEditModal} onOpened={this.onOpenedModal.bind(this, objectAddOrEdit)} onClosed={this.onClosedModal} toggle={this.props.closeAddOrEditModal} backdrop={this.state.backdrop}
                    className={(this.state.isAddOrEdit === "ADD" ? 'modal-success ' : this.state.isAddOrEdit === "EDIT" ? 'modal-primary ' : '') + 'modal-lg ' + this.props.className}>
            <AvForm onValidSubmit={this.props.handleValidSubmitAddOrEdit} onInvalidSubmit={this.props.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                <ModalHeader toggle={this.props.closeAddOrEditModal}>{this.state.isAddOrEdit === "ADD" ? t("common:common.title.add") : this.state.isAddOrEdit === "EDIT" ? t("common:common.title.edit") : ''}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="12" sm="6" className="text-right">
                        <FormGroup>
                            <Dropzone
                            onDrop={this.handleDrop}
                            disableClick
                            multiple={false}
                            style={{ width: this.state.width, height: this.state.height, marginBottom:'50px' }}
                            >
                            <ReactAvatarEditor
                                ref={this.props.setEditorRefAvatar}
                                scale={parseFloat(this.state.scale)}
                                width={this.state.width}
                                height={this.state.height}
                                position={this.state.position}
                                onPositionChange={this.handlePositionChange}
                                rotate={parseFloat(this.state.rotate)}
                                borderRadius={this.state.width / (100 / this.state.borderRadius)}
                                onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
                                onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
                                onImageReady={this.logCallback.bind(this, 'onImageReady')}
                                image={this.state.image}
                                className="editor-canvas"
                            />
                            </Dropzone>
                            <br></br>
                            <Input name="newImage" type="file" onChange={this.handleNewImage} />
                        </FormGroup>
                        
                        </Col>
                        <Col xs="12" sm="6">
                        <FormGroup>
                            <Label for="scale"><Trans i18nKey="employee:employee.label.zoom"/></Label>
                            <Input
                            id="scale"
                            name="scale"
                            type="range"
                            onChange={this.handleScale}
                            min={this.state.allowZoomOut ? '0.1' : '1'}
                            max="2"
                            step="0.01"
                            defaultValue="1"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="allowZoomOut"><Trans i18nKey="employee:employee.label.allowScale"/></Label>
                            <Input type="checkbox" id="allowZoomOut" name="allowZoomOut" className="ml-3" onChange={this.handleAllowZoomOut} checked={this.state.allowZoomOut} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="borderRadius"><Trans i18nKey="employee:employee.label.borderRadius"/></Label>
                            <Input
                            id="borderRadius"
                            name="borderRadius"
                            type="range"
                            onChange={this.handleBorderRadius}
                            min="0"
                            max="50"
                            step="1"
                            defaultValue="0"/>
                        </FormGroup>
                        <FormGroup>
                            <Label><Trans i18nKey="employee:employee.label.rotate"/></Label>
                            <br></br>
                            <Button type="button" onClick={this.rotateLeft}><i className="fa fa-rotate-left"></i> <Trans i18nKey="employee:employee.button.rotateLeft"/></Button>{' '}
                            <Button type="button" onClick={this.rotateRight}><i className="fa fa-rotate-right"></i> <Trans i18nKey="employee:employee.button.rotateRight"/></Button>
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                            <AvGroup>
                                <Label><Trans i18nKey="employee:employee.label.username"/></Label>
                                <AvInput name="objectUser.username" placeholder={t("employee:employee.placeholder.username")} required
                                    maxLength="16" pattern="^[A-Za-z0-9]+$" 
                                    validate={{async: this.validateUsername}}
                                />
                                <AvFeedback>{this.state.errorUsername}</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col xs="12" sm="6" md="3">
                            <AvField name="objectUser.firstName" label={t("employee:employee.label.firstName")} placeholder={t("employee:employee.placeholder.firstName")} required
                                validate={{
                                required: {value: true, errorMessage: t("employee:employee.message.firstName")}
                        }}/>
                        </Col>
                        <Col xs="12" sm="6" md="3">
                            <AvField name="objectUser.lastName" label={t("employee:employee.label.lastName")} placeholder={t("employee:employee.placeholder.lastName")} required
                                validate={{
                                required: {value: true, errorMessage: t("employee:employee.message.lastName")}
                        }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                            <AvField name="objectUser.password" type="password" autoComplete="off" label={t("employee:employee.label.password")} placeholder={t("employee:employee.placeholder.password")} required maxLength="16"
                                validate={{
                                required: {value: true, errorMessage: t("employee:employee.message.password.required")},
                                pattern: {value: '^[A-Za-z0-9]+$', errorMessage: t("employee:employee.message.password.pattern")},
                                minLength: {value: 6, errorMessage: t("employee:employee.message.password.minMaxLength")}
                            }}/>
                        </Col>
                        <Col xs="12" sm="6">
                            <AvField name="objectUser.rePassword" type="password" autoComplete="off" label={t("employee:employee.label.rePassword")} placeholder={t("employee:employee.placeholder.rePassword")} required maxLength="16"
                                validate={{
                                match: { value: 'objectUser.password', errorMessage: t("employee:employee.message.password.match")},
                                required: {value: true, errorMessage: t("employee:employee.message.requiredRePassword")}
                            }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                            <AvField name="objectUser.email" label={t("employee:employee.label.email")} placeholder={t("employee:employee.placeholder.email")} required
                                validate={{
                                required: {value: true, errorMessage: t("employee:employee.message.email")},
                                email: {value: true, errorMessage: t("employee:employee.message.invalidateEmail")}
                            }}/>
                        </Col>
                        <Col xs="12" sm="6">
                            <AvField name="objectUser.phone" label={t("employee:employee.label.phone")} placeholder={t("employee:employee.placeholder.phone")} required maxLength="15"
                                validate={{
                                required: {value: true, errorMessage: t("employee:employee.message.phone")},
                                number: {value: true, errorMessage: t("employee:employee.message.invalidatePhone")},
                                minLength: {value: 9, errorMessage: t("employee:employee.message.invalidatePhone")}
                            }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                            <AvField name="objectUser.dateOfBirth" label={t("employee:employee.label.dateOfBirth")} type="date" max={nowDate} required
                                validate={{
                                required: {value: true, errorMessage: t("employee:employee.message.requiredDateOfBirth")},
                                dateRange: {start: {value: -100, units: 'years'}, end: {value: 0, units: 'years'}, errorMessage: t("employee:employee.message.dateOfBirthRange")},
                                date: {format: 'dd/mm/yyyy', errorMessage: t("employee:employee.message.invalidateDate")}
                            }}/>
                        </Col>
                        <Col xs="12" sm="6">
                            <AvGroup>
                                <Label><Trans i18nKey="employee:employee.label.employeeCode"/></Label>
                                <AvInput name="objectUser.employeeCode" placeholder={t("employee:employee.placeholder.employeeCode")} required
                                    pattern="^[A-Za-z0-9]+$" 
                                    validate={{async: this.validateEmployeeCode}}
                                />
                                <AvFeedback>{this.state.errorEmployeeCode}</AvFeedback>
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                            <AvField type="select" name="objectUser.enabled" label={t("employee:employee.label.status")} required
                                validate={{
                                required: {value: true, errorMessage: t("employee:employee.message.requiredStatus")}
                            }}>
                                <option value="">{t("employee:employee.dropdown.all")}</option>
                                <option value="1">{t("employee:employee.dropdown.status.isActive")}</option>
                                <option value="0">{t("employee:employee.dropdown.status.looked")}</option>
                            </AvField>
                        </Col>
                        <Col xs="12" sm="6">
                            <AvField type="select" name="objectUser.unitId" label={t("employee:employee.label.unit")}>
                                <option value="">{t("employee:employee.dropdown.all")}</option>
                                {/* <option value="1">{t("employee:employee.dropdown.status.isActive")}</option>
                                <option value="0">{t("employee:employee.dropdown.status.looked")}</option> */}
                            </AvField>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                <LaddaButton type="submit"
                    className="btn btn-success btn-md mr-1"
                    loading={this.props.stateAddOrEditModal.btnAddOrEditLoading}
                    data-style={ZOOM_OUT}>
                    <i className="fa fa-save"></i> {this.state.isAddOrEdit === "ADD" ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                </LaddaButton>{' '}
                <Button type="button" color="danger" onClick={this.props.closeAddOrEditModal}><i className="fa fa-reply"></i> {t("common:common.button.cancel")}</Button>
                </ModalFooter>
            </AvForm>
            </Modal>
        </div>
        );
    }
}

AddOrEditEmployeeContainer.propTypes = {
    closeAddOrEditModal: PropTypes.func.isRequired,
    stateAddOrEditModal: PropTypes.object.isRequired,
    handleValidSubmitAddOrEdit: PropTypes.func.isRequired,
    handleInvalidSubmitAddOrEdit: PropTypes.func.isRequired,
    setEditorRefAvatar: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        response: state.employees
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(employeesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddOrEditEmployeeContainer));