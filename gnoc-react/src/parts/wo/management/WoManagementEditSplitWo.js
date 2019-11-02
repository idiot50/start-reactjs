import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Row, ListGroupItem, ListGroup } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { CustomReactTableLocal, CustomSticky, CustomAvField, CustomAutocomplete, CustomDatePicker } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm, Dropzone, downloadFileLocal } from '../../../containers/Utils/Utils';

class WoManagementEditSplitWo extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            //Table
            ftList: [],
            columns: this.buildTableColumns(),
            dataChecked: [],
            indexAdd: 0,
            startTime: null,
            endTime: null,
            files: []
        };
    }

    componentDidMount() {
        
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.receiveUser" />,
                id: "receiveUser",
                minWidth: 200,
                Cell: ({ original }) => {
                    return (
                        <CustomAutocomplete
                            name={"receiveUser" + original.id}
                            label={""}
                            placeholder={this.props.t("woManagement:woManagement.placeholder.receiveUser")}
                            isRequired={true}
                            messageRequire={this.props.t("woManagement:woManagement.message.required.receiveUser")}
                            closeMenuOnSelect={false}
                            handleItemSelectChange={(d) => this.handleItemSelectChangeReceiveUser(d, original)}
                            selectValue={original.receiveUser || {}}
                            moduleName={"USERS_FT"}
                            isOnlyInputSelect={true}
                            isHasChildren={true}
                        />
                    );
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.workDescription" />,
                id: "workDescription",
                minWidth: 400,
                Cell: ({ original }) => {
                    return <CustomAvField type="text" name={"input-" + original.id} value={original.workDescription || ""} 
                        isinputonly="true" onChange={(e) => this.onChangeRowWorkDescription(e.target.value, original)} />;
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.getFileParent" />,
                className: 'text-center',
                id: "getFileParent",
                minWidth: 100,
                Cell: ({ original }) => {
                    return <input type="checkbox" name={"checkbox-" + original.id} value={original.getFileParent || ""} onChange={(e) => this.onChangeRowFileParent(e.target.checked, original)} />;
                }
            }
        ];
    }

    addFt = () => {
        const objAdd = {};
        objAdd.id = this.state.indexAdd;
        objAdd.getFileParent = false;
        this.setState({
            ftList: [...this.state.ftList, objAdd],
            indexAdd: this.state.indexAdd + 1
        });
    }

    removeFt = () => {
        if (this.state.dataChecked.length === 0) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
            return;
        }
        const ftList = [...this.state.ftList];
        for (const original of this.state.dataChecked) {
            const index = ftList.findIndex(item => item.id === original.id);
            ftList.splice(index, 1);
        }
        this.setState({
            ftList
        });
    }

    onChangeRowWorkDescription = (d, original) => {
        const ftList = [...this.state.ftList];
        for (const obj of ftList) {
            if (obj.id === original.id) {
                obj.workDescription = d;
                break;
            }
        }
        this.setState({
            ftList
        });
    }

    onChangeRowFileParent = (d, original) => {
        const ftList = [...this.state.ftList];
        for (const obj of ftList) {
            if (obj.id === original.id) {
                obj.getFileParent = d;
                break;
            }
        }
        this.setState({
            ftList
        });
    }

    handleItemSelectChangeReceiveUser = (d, original) => {
        const ftList = [...this.state.ftList];
        for (const obj of ftList) {
            if (obj.id === original.id) {
                obj.receiveUser = d;
                break;
            }
        }
        this.setState({
            ftList
        });
    }

    setDataToObject(object, systemOther, systemOtherCode) {
        // set khi gọi từ hệ thống khác
        if (systemOther === null || systemOtherCode === null) {
            object.woSystem = this.state.selectedData.woSystem || "";
        } else {
            object.woSystem = systemOther;
            object.woSystemId = systemOtherCode;
        }
        object.woContent = this.state.selectedData.woContent || "";
        object.woDescription = this.state.selectedData.woContent || "";
        object.woTypeId = this.state.selectedData.woTypeId || "";
        object.startTime = this.state.startTime;
        object.endTime = this.state.endTime;
        object.planCode = object.planCode ? object.planCode.trim() : "";
        object.cdIdList = [this.state.selectedData.cdId];
        object.priorityId = this.state.selectedData.priorityId;
        object.woDetailDTO = {accountIsdn: ""};
        object.fileName = this.state.files.map(item => item.fileName).join(",");
        object.createPersonId = JSON.parse(localStorage.user).userID;
        // status 
        object.status = 3;
        object.parentId = this.state.selectedData.woId;

        // Construction
        object.constructionCode = "";
        // station
        object.stationCode = "";
        // Warehouse code
        object.warehouseCode = "";
        // // Longitude
        object.longitude = "";
        // Latitude
        object.longitude = "";

        const woKTTSInfoDTO = {};
        object.woKTTSInfoDTO = woKTTSInfoDTO;
        object.lstUsername = this.state.ftList.map(item => item.receiveUser.label.split(/[()]+/)[1]);
        object.lstDescription = this.state.ftList.map(item => item.workDescription ? item.workDescription : "");
        object.getFileParent = this.state.ftList.map(item => item.getFileParent);
        object.parentWo = Object.assign({}, this.state.selectedData, {status: 3});
    }

    handleValidSubmitAddOrEdit(event, values) {
        if (this.state.ftList.length === 0) {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.receiveUser"));
            return;
        }
        if (this.state.startTime < new Date()) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.dateNotLargeForNow"));
            return;
        } else if (this.state.startTime > this.state.endTime) {
            toastr.warning(this.props.t("woManagement:woManagement.message.error.dateCompare"));
            return;
        }
        validSubmitForm(event, values, "idFormEditSplit");
        if(values && values.constructor === Object) {
            for (const key in values) {
                if(values.hasOwnProperty(key)) {
                    if(key.indexOf('input-') !== -1) {
                        delete values[key];
                    }
                }
            }
        }
        const woManagement = Object.assign({}, values);
        this.setDataToObject(woManagement, null, null);
        this.props.actions.splitWo(this.state.files, woManagement).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                // this.closePopup();
                this.props.closePage("PROCESS", true);
                toastr.success(this.props.t("woManagement:woManagement.message.success.splitWo") + ": " + this.state.selectedData.woCode);
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.splitWo"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                // toastr.error(response.error.response.data.message);
                toastr.error(this.props.t("woManagement:woManagement.message.error.splitWo"));
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormEditSplit");
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
        let index = this.state.files.indexOf(item);
        let arrFile = this.state.files;
        arrFile.splice(index, 1);
        this.setState({
            files: arrFile
        });
    }

    render() {
        const { t, response } = this.props;
        const { ftList, columns, files } = this.state;
        let objectAddOrEdit = {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormEditSplit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={"fa fa-plus-circle"}></i>{t("woManagement:woManagement.title.splitWo")}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {t("common:common.button.save")}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closePageSplit}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <CustomDatePicker
                                                name={"startTime"}
                                                label={t("woManagement:woManagement.label.startTimeAdd")}
                                                isRequired={true}
                                                messageRequire={t("woManagement:woManagement.message.required.startTimeAdd")}
                                                selected={this.state.startTime}
                                                handleOnChange={(d) => this.setState({ startTime: d })}
                                                dateFormat="dd/MM/yyyy HH:mm:ss"
                                                showTimeSelect={true}
                                                timeFormat="HH:mm:ss"
                                                placeholder="dd/MM/yyyy HH:mm:ss"
                                            />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <CustomDatePicker
                                                name={"endTime"}
                                                label={t("woManagement:woManagement.label.endTimeAdd")}
                                                isRequired={true}
                                                messageRequire={t("woManagement:woManagement.message.required.endTimeAdd")}
                                                selected={this.state.endTime}
                                                handleOnChange={(d) => this.setState({ endTime: d })}
                                                dateFormat="dd/MM/yyyy HH:mm:ss"
                                                showTimeSelect={true}
                                                timeFormat="HH:mm:ss"
                                                placeholder="dd/MM/yyyy HH:mm:ss"
                                            />
                                        </Col>
                                    </Row>
                                    <Card>
                                        <CardHeader>
                                            <div style={{ float: 'left' }}>
                                                <span style={{ position: 'absolute' }} className="mt-1">
                                                    {t("woManagement:woManagement.title.ftInfo")}
                                                </span>
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" className="custom-btn btn-pill mr-2" color="primary" onClick={this.addFt} title={t("common:common.button.additional")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" className="custom-btn btn-pill" color="secondary" onClick={this.removeFt} title={t("common:common.button.discard")}><i className="fa fa-close"></i></Button>
                                            </div>
                                        </CardHeader>
                                        <CustomReactTableLocal
                                            columns={columns}
                                            data={ftList}
                                            loading={false}
                                            defaultPageSize={3}
                                            isCheckbox={true}
                                            propsCheckbox={[]}
                                            handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                                        />
                                    </Card>
                                </CardBody>
                            </Card>
                            <Row>
                                <Col xs="12" sm="12">
                                    <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                </Col>
                                <Col xs="12" sm="12">
                                    <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                        <ListGroup>
                                            {files.map((item, index) => (
                                                <ListGroupItem key={"item-" + index} style={{height: '2.5em'}} className="d-flex align-items-center">
                                                    <span className="app-span-icon-table" onClick={() => this.removeFile(item)}><i className="fa fa-times-circle"></i></span>
                                                    {item.woId ? <Button color="link" onClick={() => this.downloadFile(item)}>{item.fileName}</Button>
                                                    : <Button color="link" onClick={() => downloadFileLocal(item)}>{item.fileName}</Button>
                                                    }
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

WoManagementEditSplitWo.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    closePageSplit: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditSplitWo));