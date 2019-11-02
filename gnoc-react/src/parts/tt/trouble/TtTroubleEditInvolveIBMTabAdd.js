import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, ListGroup, Row, ListGroupItem } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomSelectLocal, CustomSticky, CustomAvField, CustomDatePicker, CustomAutocomplete, CustomInputPopup, CustomAppSwitch, CustomMultiSelectLocal, CustomSelect } from "../../../containers/Utils";
import { Dropzone, downloadFileLocal, validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";

class TtTroubleEditInvolveIBMTabAdd extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            isAddOrEdit: null,
            btnAddLoading: false,
            isOpenSearchUnitPopup: false,
            isOpenSearchNodePopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            selectValueProduct: {},
            selectValueReceiveUnit: {},
            files: [],
            //combo list
            ttProductList: [],
            ttReceiveUnitList: [],
            troubleId: props.parentState.troubleId
        };
    }

    componentDidMount() {
        let productList = [];
        let unitList = [];
        this.props.actions.getProductList().then((response) => {
            this.props.actions.getUnitList().then((response) => {
                for (const j of response.payload.data) {
                    unitList.push({ itemId: j.unitCode, itemName: j.unitName })
                }
            })
            for (const i of response.payload.data) {
                productList.push({ itemId: i.code, itemName: i.name })
            }
            this.setState({
                ttProductList: productList,
                ttReceiveUnitList: unitList
            })
        })

    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    setDataToObject(object) {
        let temp = JSON.parse(localStorage.getItem("user"))
        object.troubleId = this.state.troubleId;
        object.ibmName = object.ibmName.trim();
        object.description = object.description.trim();
        object.solution = object.solution ? object.solution.trim() : "";
        object.errorTime = this.state.errorTime || "";
        object.receiveUnitCode = this.state.selectValueReceiveUnit.value || "";
        object.receiveUnitName = this.state.selectValueReceiveUnit.label;
        object.receiveUserName = this.state.selectValueReceiveUser.label && this.state.selectValueReceiveUser.label.split(/[()]/g)[1].trim();
        object.createUserName = temp.userName;
        object.createUserID = temp.userID;
        object.productName = this.state.selectValueProduct.label;
        object.productCode = this.state.selectValueProduct.value;
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormInvolveIBMAdd");
        if (this.state.errorTime > new Date()) {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.startTroubleTime"));
            return;
        }
        this.setState({
            btnAddLoading: true
        }, () => {
            const ttTrouble = Object.assign({}, values);
            delete ttTrouble.receiveUser;
            this.setDataToObject(ttTrouble);
            this.props.actions.addTTroubleIBM(this.state.files, ttTrouble).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.setState({
                        btnAddLoading: false
                    }, () => {
                        this.props.closeAddOrEditPage();
                        toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.add"));
                    });
                } else if (response.payload.data.key === "ERROR") {
                    this.setState({
                        btnAddLoading: false
                    }, () => {
                        toastr.error(response.payload.data.message);
                    });
                } else {
                    this.setState({
                        btnAddLoading: false
                    }, () => {
                        toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.add"));
                    });
                }
            }).catch((response) => {
                this.setState({
                    btnAddLoading: false
                }, () => {
                    try {
                        toastr.error(response.error.response.data.errors[0].defaultMessage);
                    } catch (error) {
                        toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.add"));
                    }
                });
            });
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormInvolveIBMAdd");
    }

    handleDrop = acceptedFiles => {
        acceptedFiles.forEach(item => {
            if (!this.state.files.some(el => el.path === item.path)) {
                const arr = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'rar', 'zip', '7z', 'jpg', 'gif', 'png', 'bmp', 'sql']
                if (arr.includes(item.name.split('.').pop().toLowerCase())) {
                    if (item.size <= 40894464) {
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
        const { t } = this.props;
        const { files, ttReceiveUnitList, ttProductList } = this.state;
        let objectAddOrEdit = this.state.isAddOrEdit === "COPY" ? this.state.selectedData : {};
        let temp = JSON.parse(localStorage.getItem("user"));
        objectAddOrEdit.createUserName = temp.userName;
        objectAddOrEdit.ibmName = document.getElementById('idFormAddOrEditInfoTab').elements['troubleName'].value;
        objectAddOrEdit.description = document.getElementById('idFormAddOrEditInfoTab').elements['description'].value;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormInvolveIBMAdd" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className="fa fa-plus-circle"></i>{t("ttTrouble:ttTrouble.title.addTrouble")}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {t("common:common.button.save")}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <CardBody>
                                    <Card>
                                        <CardHeader>
                                            <span>{t("ttTrouble:ttTrouble.title.troubleInformation")}</span>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col xs="12" sm="8">
                                                    <CustomAvField name="ibmName" label={this.props.t("ttTrouble:ttTrouble.label.troubleName")}
                                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.troubleName") } }}
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.troubleName")} required maxLength="300" />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"receiveUnitCode"}
                                                        label={t("ttTrouble:ttTrouble.label.responsibleUnitAdd")}
                                                        messageRequire={this.props.t("ttTrouble:ttTrouble.message.required.responsibleUnitAdd")}
                                                        isRequired={true}
                                                        options={ttReceiveUnitList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueReceiveUnit: d })}
                                                        selectValue={this.state.selectValueReceiveUnit}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="8">
                                                    <CustomAvField type="textarea" rows="5" name="description" label={this.props.t("ttTrouble:ttTrouble.label.descriptionAdd")}
                                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.descriptionAdd") } }}
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.description")} required maxLength="2000" />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <Row>
                                                        <Col xs="12" sm="12">
                                                            <CustomSelectLocal
                                                                name={"productName"}
                                                                label={t("ttTrouble:ttTrouble.label.productName")}
                                                                messageRequire={this.props.t("ttTrouble:ttTrouble.message.required.productName")}
                                                                isRequired={true}
                                                                options={ttProductList}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={(d) => this.setState({ selectValueProduct: d })}
                                                                selectValue={this.state.selectValueProduct}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="12">
                                                            <CustomAutocomplete
                                                                name={"receiveUser"}
                                                                label={t("ttTrouble:ttTrouble.label.receiveUsername")}
                                                                placeholder={t("ttTrouble:ttTrouble.placeholder.receiveUsername")}
                                                                isRequired={true}
                                                                messageRequire={t("ttTrouble:ttTrouble.message.required.receiveUsername")}
                                                                closeMenuOnSelect={false}
                                                                handleItemSelectChange={(d) => this.setState({ selectValueReceiveUser: d })}
                                                                selectValue={this.state.selectValueReceiveUser}
                                                                moduleName={"USERS"}
                                                                isHasChildren={true}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="8">
                                                    <CustomAvField type="textarea" rows="3" name="solution" label={this.props.t("ttTrouble:ttTrouble.label.actionProcess")}
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.description")} maxLength="2000" />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="errorCode" label={this.props.t("ttTrouble:ttTrouble.label.errorCode")}
                                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.errorCode") } }}
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.errorCode")} required maxLength="300" />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="createUserName" label={this.props.t("ttTrouble:ttTrouble.label.createdUserName")}
                                                        disabled
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.createdUserName")} maxLength="300" />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="status" label={this.props.t("ttTrouble:ttTrouble.label.status")}
                                                        defaultValue="New" disabled
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.status")} maxLength="300" />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomDatePicker
                                                        name={"errorTime"}
                                                        label={t("ttTrouble:ttTrouble.label.startTroubleTime")}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.startTroubleTime")}
                                                        isRequired={true}
                                                        selected={this.state.errorTime}
                                                        handleOnChange={(d) => this.setState({ errorTime: d })}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        showTimeSelect={true}
                                                        timeFormat="HH:mm:ss"
                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="accountError" label={this.props.t("ttTrouble:ttTrouble.label.accountError")}
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.accountError")} maxLength="300" />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="ipServer" label={this.props.t("ttTrouble:ttTrouble.label.ipServer")}
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.ipServer")} maxLength="300" />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAvField name="numComplaint" label={this.props.t("ttTrouble:ttTrouble.label.numberOfReflections")}
                                                        validate={{ pattern: { value: "^[+]?[0-9]+$", errorMessage: this.props.t("ttTrouble:ttTrouble.message.required.numberRequired") },
                                                                    min: {value: 1, errorMessage: this.props.t("ttTrouble:ttTrouble.message.required.numberRequired")} }}
                                                        placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.numberOfReflections")} maxLength="300" />
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs="12" sm="12">
                                                    <Dropzone onDrop={this.handleDrop} className="pb-2" />
                                                </Col>
                                                <Col xs="12" sm="12">
                                                    <div style={{ overflowY: 'auto', maxHeight: '65px' }} className="mt-2">
                                                        <ListGroup>
                                                            {files.map((item, index) => (
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
                                        </CardBody>
                                    </Card>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

TtTroubleEditInvolveIBMTabAdd.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditInvolveIBMTabAdd));