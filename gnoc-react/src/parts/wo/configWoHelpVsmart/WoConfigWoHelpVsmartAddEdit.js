import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label, Button, Col, Card, CardBody, CardHeader, Collapse, Row, ListGroup, ListGroupItem, CardLink } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoConfigWoHelpVsmartActions from './WoConfigWoHelpVsmartActions';
import { CustomSelectLocal, CustomSticky, CustomAvField, CustomSelect } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, Dropzone, renderRequired, downloadFileLocal } from '../../../containers/Utils/Utils';

class WoConfigWoHelpVsmartAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.downloadFileTemplate = this.downloadFileTemplate.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueSbbSystem: {},
            selectValueTypeCbb: {},
            listCbbSystem: [],
            listTypeCbb: [],
            //file
            files: [],
            client: 'wo_cat',
            moduleName: 'CFG_WO_HEPL_VSMART',
            isHideCombobox: null
        };
    }

    componentDidMount() {
        this.props.actions.getListCbbSystem().then(res => {
            this.setState({ listCbbSystem: res.payload.data })
        });
        if ((this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY")) {
            this.setState({
                files: [{ fileName: this.state.selectedData.fileId }],
                selectValueSbbSystem: this.state.selectedData.systemId ? { value: this.state.selectedData.systemId } : {},
                isHideCombobox: this.state.selectedData.systemId,
                selectValueTypeCbb: this.state.selectedData.typeId ? { value: this.state.selectedData.typeId } : {}
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const woConfigWoHelpVsmart = Object.assign({}, values);
            woConfigWoHelpVsmart.systemId = this.state.selectValueSbbSystem.value;
            woConfigWoHelpVsmart.typeId = this.state.selectValueTypeCbb.value;
            woConfigWoHelpVsmart.typeName = this.state.selectValueTypeCbb.label;
            if (this.state.files < 1) {
                toastr.warning(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.fileRequired"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            } else {
                woConfigWoHelpVsmart.fileId = this.state.files[0].fileName;
            }
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    woConfigWoHelpVsmart.id = "";
                }
                this.props.actions.addWoConfigWoHelpVsmart(this.state.files, woConfigWoHelpVsmart).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.success.add"));
                        } else if (response.payload.data.key === "FILE_INVALID_FORMAT") {
                            toastr.warning(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.file"));
                        } else if (response.payload.data.key === "NODATA") {
                            toastr.warning(this.props.t("common:common.message.error.noData"));
                        } else {
                            toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.add"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                woConfigWoHelpVsmart.id = this.state.selectedData.id;
                this.props.actions.editWoConfigWoHelpVsmart(this.state.files, woConfigWoHelpVsmart).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.success.edit"));
                        } else if (response.payload.data.key === "FILE_INVALID_FORMAT") {
                            toastr.warning(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.file"));
                        } else if (response.payload.data.key === "NODATA") {
                            toastr.warning(this.props.t("common:common.message.error.noData"));
                        } else {
                            toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.edit"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.edit"));
                        }
                    });
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleItemSelectChangeSbbSystem = (option) => {
        this.setState({
            selectValueSbbSystem: option,
            isHideCombobox: option.value,
            selectValueTypeCbb: {}
        });
    }

    handleItemSelectChangeTypeCbb = (option) => {
        this.setState({ selectValueTypeCbb: option });
    }

    downloadFileTemplate = () => {
        if (this.state.selectValueSbbSystem.value != null) {
            this.props.actions.onDownloadFileTemplateCfgWoHelpVsmart({ systemId: this.state.selectValueSbbSystem.value }).then((response) => {
                toastr.success(this.props.t("common:common.message.success.downloadTemplate"));
            }).catch((response) => {
                toastr.error(this.props.t("common:common.message.error.downloadTemplate"));
            })
        } else {
            toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.requiredSystemName"));
        }
    }

    downloadFileAttach = (id) => {
        this.props.actions.onDownloadFileCfgWoHelpVsmartById(id).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadTemplate"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadTemplate"));
        })
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.fileName === item.name)) {
                const arr = ['xls', 'xlsx']
                if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if (item.size <= 40894464) {
                        item.fileName = item.name;
                        this.setState({
                            files: [item]
                        });
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
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    render() {
        const { t } = this.props;
        const { files } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.title.woConfigWoHelpVsmartAdd") : this.state.isAddOrEdit === "EDIT" ? t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.title.woConfigWoHelpVsmartEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <CustomSelectLocal
                                                    name={"systemId"}
                                                    label={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.systemName")}
                                                    isRequired={true}
                                                    messageRequire={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.requiredSystemName")}
                                                    options={this.state.listCbbSystem}
                                                    closeMenuOnSelect={true}
                                                    handleItemSelectChange={this.handleItemSelectChangeSbbSystem}
                                                    selectValue={this.state.selectValueSbbSystem}
                                                />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                {this.state.isHideCombobox === null ?
                                                    <CustomSelectLocal
                                                        name={""}
                                                        label={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.typeName")}
                                                        isRequired={false}
                                                        messageRequire={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.requiredTypeName")}
                                                        options={[]}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeTypeCbb}
                                                        selectValue={this.state.selectValueTypeCbb}
                                                    />
                                                    :
                                                    <CustomSelect
                                                        name={"typeId"}
                                                        label={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.typeName")}
                                                        isRequired={false}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleItemSelectChangeTypeCbb}
                                                        selectValue={this.state.selectValueTypeCbb}
                                                        moduleName={this.state.isHideCombobox === 1 ? "GNOC_OD_TYPE" : "GNOC_DICH_VU_WO_HELP"}
                                                    />
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Label style={{ fontWeight: 500 }}>{t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.attachFile")}</Label>{renderRequired}
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <Dropzone onDrop={this.handleDrop} allowGlobalDrops={false} acceptFile={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.acceptFile")}/>
                                            </Col>
                                            <Col xs="12" sm="12">
                                                <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                    <ListGroup>
                                                        {files.map((item, index) => (
                                                            <ListGroupItem key={"item-" + index} style={{ height: '2.5em' }} className="d-flex align-items-center">
                                                                <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                                {
                                                                    (typeof item.name === 'string') ?
                                                                    <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                                                    :
                                                                    <Button color="link" onClick={() => this.downloadFileAttach(objectAddOrEdit.id)}>{item.fileName}</Button>
                                                                }
                                                            </ListGroupItem>
                                                        ))}
                                                    </ListGroup>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Button color="link" onClick={this.downloadFileTemplate}>{t("common:common.button.downloadTemplate")}</Button>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

WoConfigWoHelpVsmartAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woConfigWoHelpVsmart, common } = state;
    return {
        response: { woConfigWoHelpVsmart, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoConfigWoHelpVsmartActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoConfigWoHelpVsmartAddEdit));