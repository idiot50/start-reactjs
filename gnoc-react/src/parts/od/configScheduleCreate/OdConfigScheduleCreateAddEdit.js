import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as OdConfigScheduleCreateActions from './OdConfigScheduleCreateActions';
import OdConfigScheduleCreateAddEditPopup from './OdConfigScheduleCreateAddEditPopup';
import { CustomSelectLocal, CustomSelect, CustomReactTableLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { Dropzone, downloadFileLocal } from "../../../containers/Utils/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class OdConfigScheduleCreateAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAdd = this.toggleFormAdd.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);
        this.addReceiveUnit = this.addReceiveUnit.bind(this);
        this.handleItemSelectChangeOdType = this.handleItemSelectChangeOdType.bind(this);
        this.handleItemSelectChangeOdSchedule = this.handleItemSelectChangeOdSchedule.bind(this);
        this.handleItemSelectChangeOdPriority = this.handleItemSelectChangeOdPriority.bind(this);
        this.handleItemSelectChangeOdGroupType = this.handleItemSelectChangeOdGroupType.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAdd: true,
            listOdType: [],
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            listReceiveUnit: props.parentState.listReceiveUnit,
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            isOpenPopup: false,
            backdrop: "static",
            closePage: null,
            files: props.parentState.files,
            filesCurrent: props.parentState.files,
            idFileDelete: [],
            dataChecked: [],
            selectValueOdType: {},
            parentValueOdType: "",
            selectValueOdSchedule: {},
            selectValueOdPriority: {},
            selectValueOdGroupType: {}
        };
    }

    componentDidMount() {
        if(this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueOdType: {value: this.state.selectedData.odTypeId},
                selectValueOdSchedule: {value: this.state.selectedData.schedule},
                selectValueOdPriority: {value: this.state.selectedData.odPriority},
            });
        } else if(this.state.isAddOrEdit === "ADD") {
            this.setState({
                selectValueOdType: {},
                selectValueOdSchedule: {},
                selectValueOdPriority: {},
            });
        }
        this.props.actions.getItemMaster("OD_PRIORITY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("OD_SCHEDULE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("OD_GROUP_TYPE", "itemId", "itemName", "1", "3");
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked: data
        });
    }

    closePopup() {
        this.setState({
            isOpenPopup: false,
        });
    }

    openPopup() {
        this.setState({
            isOpenPopup: true,
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.unitName" />,
                id: "unitName",
                accessor: d => <span title={d.unitName}>{d.unitName}</span>
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.unitCode" />,
                id: "unitCode",
                accessor: d => <span title={d.unitCode}>{d.unitCode}</span>
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.parentUnitName" />,
                id: "parentUnitName",
                accessor: d => <span title={d.parentUnitName}>{d.parentUnitName}</span>
            },
        ];
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if(this.state.listReceiveUnit.length < 1) {
                toastr.warning(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.receiveUnit"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            const odConfigScheduleCreate = values;
            let receiveUnit = '';
            this.state.listReceiveUnit.forEach(element => {
                receiveUnit += element.unitId + ",";
            });
            receiveUnit = receiveUnit.substring(0, receiveUnit.length - 1);
            odConfigScheduleCreate.odName = odConfigScheduleCreate.odName.trim();
            odConfigScheduleCreate.odDescription = odConfigScheduleCreate.odDescription.trim();
            odConfigScheduleCreate.receiveUnit = receiveUnit;
            odConfigScheduleCreate.odTypeId = this.state.selectValueOdType.value;
            odConfigScheduleCreate.odPriority = this.state.selectValueOdPriority.value;
            odConfigScheduleCreate.schedule = this.state.selectValueOdSchedule.value;
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if(this.state.isAddOrEdit === "COPY") {
                    odConfigScheduleCreate.id = "";
                    // odConfigScheduleCreate.idFileDelete = this.state.idFileDelete;
                    // odConfigScheduleCreate.odFileId = this.state.selectedData.odFileId;
                }
                this.props.actions.insertOdConfigScheduleCreate(this.state.files, odConfigScheduleCreate).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.success.add"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.add"));
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
                            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                odConfigScheduleCreate.id = this.state.selectedData.id;
                odConfigScheduleCreate.idFileDelete = this.state.idFileDelete;
                odConfigScheduleCreate.odFileId = this.state.selectedData.odFileId;
                this.props.actions.updateOdConfigScheduleCreate(this.state.files, odConfigScheduleCreate).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.success.edit"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.edit"));
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
                            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.edit"));
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

    toggleFormAdd() {
        this.setState({ collapseFormAdd: !this.state.collapseFormAdd });
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

    removeFile(item) {
        if(this.state.filesCurrent.indexOf(item) >= 0) {
            this.setState({
                idFileDelete: [...this.state.idFileDelete, item.odFileId]
            });
        }
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    downloadFile(item) {
        this.props.actions.onDownloadFileById("od_cat", item.odFileId).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

    addReceiveUnit(dataChecked) {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.listReceiveUnit.some(el => el.unitId === element.unitId)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            listReceiveUnit: [...this.state.listReceiveUnit, ...dataChecked]
        });
    }

    removeReceiveUnit(dataChecked) {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.listReceiveUnit];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.unitId !== element.unitId);
        });
        this.setState({
            listReceiveUnit: listTemp,
            dataChecked: []
        });
    }

    handleItemSelectChangeOdType(option) {
        this.setState({selectValueOdType: option});
    }

    handleItemSelectChangeOdSchedule(option) {
        this.setState({selectValueOdSchedule: option});
    }

    handleItemSelectChangeOdPriority(option) {
        this.setState({selectValueOdPriority: option});
    }

    handleItemSelectChangeOdGroupType(option) {
        this.setState({
            selectValueOdGroupType: option,
            parentValueOdType: option.value,
            selectValueOdType: {value: null}
        });
    }

    render() {
        const { t, response } = this.props;
        let listOdPriority = (response.common.odPriority && response.common.odPriority.payload) ? response.common.odPriority.payload.data.data : [];
        let listOdSchedule = (response.common.odSchedule && response.common.odSchedule.payload) ? response.common.odSchedule.payload.data.data : [];
        let listOdGroupType = (response.common.odGroupType && response.common.odGroupType.payload) ? response.common.odGroupType.payload.data.data : [];
        for(const obj of listOdSchedule) {
            obj.itemId = Number.parseInt(obj.itemValue, 10);
        }
        const { columns, loading, files } = this.state;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        objectAddOrEdit.odDescription = objectAddOrEdit.odDescription ? objectAddOrEdit.odDescription:'';
        objectAddOrEdit.odTypeName = objectAddOrEdit.odTypeName ? objectAddOrEdit.odTypeName:'';
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("odConfigScheduleCreate:odConfigScheduleCreate.title.odAdd") : this.state.isAddOrEdit === "EDIT" ? t("odConfigScheduleCreate:odConfigScheduleCreate.title.odEdit") : ''}
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
                                <Collapse isOpen={this.state.collapseFormAdd} id="collapseFormAdd">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("odConfigScheduleCreate:odConfigScheduleCreate.title.odInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField maxLength="250" name="odName" label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.woName")} placeholder={t("odConfigScheduleCreate:odConfigScheduleCreate.placeholder.woName")} required
                                                                    autoFocus validate={{ required: { value: true, errorMessage: t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.woName") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelect
                                                                    name={"odTypeId"}
                                                                    label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.odTypeName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.odTypeName")}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdType}
                                                                    selectValue={this.state.selectValueOdType}
                                                                    moduleName={"GNOC_OD_TYPE"}
                                                                    parentValue={this.state.parentValueOdType}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomAvField type="textarea" maxLength="500" name="odDescription" label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.workDescription")} placeholder={t("odConfigScheduleCreate:odConfigScheduleCreate.placeholder.workDescription")} />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"odPriority"}
                                                                    label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.odPriorityName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.odPriorityName")}
                                                                    options={listOdPriority}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdPriority}
                                                                    selectValue={this.state.selectValueOdPriority}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"odTypeName"}
                                                                    label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.woGroupType")}
                                                                    isRequired={false}
                                                                    options={listOdGroupType}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdGroupType}
                                                                    selectValue={this.state.selectValueOdGroupType}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    name={"schedule"}
                                                                    label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.schedule")}
                                                                    isRequired={true}
                                                                    messageRequire={t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.schedule")}
                                                                    options={listOdSchedule}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeOdSchedule}
                                                                    selectValue={this.state.selectValueOdSchedule}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("odConfigScheduleCreate:odConfigScheduleCreate.title.odActionInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="12">
                                                                <Card>
                                                                    <CardHeader>
                                                                        <div style={{float: 'left'}}>
                                                                            <span style={{position: 'absolute'}} className="mt-1">
                                                                                {t("odConfigScheduleCreate:odConfigScheduleCreate.label.receiveUnit")}<span className="text-danger">{" (*)"}</span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="card-header-actions card-header-search-actions-button">
                                                                            <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={() => this.openPopup()} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.additional")}><i className="fa fa-plus"></i></Button>
                                                                            <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={() => this.removeReceiveUnit(this.state.dataChecked)} title={t("odConfigScheduleCreate:odConfigScheduleCreate.button.remove")}><i className="fa fa-close"></i></Button>
                                                                        </div>
                                                                    </CardHeader>
                                                                    <CustomReactTableLocal
                                                                        columns={columns}
                                                                        data={this.state.listReceiveUnit}
                                                                        loading={loading}
                                                                        defaultPageSize={3}
                                                                        isCheckbox={true}
                                                                        propsCheckbox={["unitId"]}
                                                                        handleDataCheckbox={this.handleDataCheckbox}
                                                                    />
                                                                </Card>
                                                            </Col>
                                                            <Col xs="12" sm="12">
                                                                <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                                            </Col>
                                                            <Col xs="12" sm="12">
                                                                <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                                    <ListGroup>
                                                                        {files.map((item, index) => (
                                                                            <ListGroupItem key={"item-" + index} style={{height: '2.5em'}} className="d-flex align-items-center">
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
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
                <OdConfigScheduleCreateAddEditPopup
                    parentState={this.state}
                    closePopup={this.closePopup}
                    addReceiveUnit={this.addReceiveUnit}
                />
            </div>
        );
    }
}

OdConfigScheduleCreateAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { odConfigScheduleCreate, common } = state;
    return {
        response: { odConfigScheduleCreate, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, OdConfigScheduleCreateActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdConfigScheduleCreateAddEdit));