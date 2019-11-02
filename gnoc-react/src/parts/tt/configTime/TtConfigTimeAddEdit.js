import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtConfigTimeActions from './TtConfigTimeActions';
import { CustomAppSwitch, CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class TtConfigTimeAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeCountry = this.handleItemSelectChangeCountry.bind(this);
        this.handleItemSelectChangeTypeId = this.handleItemSelectChangeTypeId.bind(this);
        this.handleItemSelectChangeSubCategory = this.handleItemSelectChangeSubCategory.bind(this);
        this.handleItemSelectChangePriority = this.handleItemSelectChangePriority.bind(this);
        this.handleChangeIsCall = this.handleChangeIsCall.bind(this);
        this.handleChangeVipStation = this.handleChangeVipStation.bind(this);
        
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            isCall: (props.parentState.selectedData.isCall !== null && props.parentState.selectedData.isCall !== "") ? props.parentState.selectedData.isCall : false,
            isStationVip: (props.parentState.selectedData.isStationVip !== null && props.parentState.selectedData.isStationVip !== "") ? props.parentState.selectedData.isStationVip : false,
            //Table
            data: [],
            //Select
            selectValueCountry: {},
            selectValueTypeId: {},
            selectValueSubCategory: {},
            selectValuePriority: {},
            subCategoryList: [],
            loopVersion: true
        };
    }

    componentDidMount() {
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                isCall: this.state.selectedData.isCall,
                selectValueCountry: { value: this.state.selectedData.country },
                selectValueTypeId: { value: this.state.selectedData.typeId },
                selectValueSubCategory: { value: this.state.selectedData.subCategoryId },
                selectValuePriority: { value: this.state.selectedData.priorityId }
            });
        } else if (this.state.isAddOrEdit === "ADD") {
            this.setState({
                selectValueCountry: {},
                selectValueTypeId: {},
                selectValueSubCategory: {},
                selectValuePriority: {},
            });
        }
        // get combobox
        this.props.actions.getItemMaster("GNOC_COUNTRY", "itemId", "itemName", "1", "3"); // quốc gia
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3"); // mảng sự cố
        this.props.actions.getItemMaster("TT_PRIORITY", "itemId", "itemName", "1", "3"); // độ ưu tiên
    }

    componentDidUpdate() {
        if (this.state.loopVersion) {
            this.getSubCategory();
            this.setState({
                loopVersion: false
            })
        }
    }

    getSubCategory = () => {
        let subCategoryList = [];
        let typeId = (this.state.selectValueTypeId && this.state.selectValueTypeId.value) ? this.state.selectValueTypeId.value : null;
        if (typeId === null) {
            this.setState({ subCategoryList : []})
        } else {
            this.props.actions.getListSubCategory(typeId).then((response) => {
                for (const obj of response.payload.data) {
                    if (!subCategoryList.find((e) => e.itemId === obj.itemId)) {
                        subCategoryList.push({itemId: obj.itemId, itemName: obj.itemName});
                    }
                }
                this.setState({
                    subCategoryList
                })
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
            values.country = this.state.selectValueCountry.value;
            values.subCategoryId = this.state.selectValueSubCategory.value;
            values.priorityId = this.state.selectValuePriority.value;
            values.typeId = this.state.selectValueTypeId.value;
            values.isCall = this.state.isCall === true ? 1 : 0;
            values.isStationVip = this.state.isStationVip === true ? 1 : 0;
            const ttConfigTime = Object.assign({}, values);
            
            if (!this.state.isStationVip) {
                ttConfigTime.timeStationVip = "";
                ttConfigTime.timeWoVip = ""
            }
            if (this.state.isAddOrEdit === "COPY") {
                ttConfigTime.id = "";
            }
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addTtConfigTime(ttConfigTime).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttConfigTime:ttConfigTime.message.success.add"));
                        } else {
                            toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.add"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                ttConfigTime.id = this.state.selectedData.id;
                this.props.actions.editTtConfigTime(ttConfigTime).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("ttConfigTime:ttConfigTime.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.edit"));
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

    handleItemSelectChangeCountry(option) {
        this.setState({ selectValueCountry: option });
    }

    handleItemSelectChangeTypeId(option) {
        this.setState({ 
            selectValueTypeId: option,
            loopVersion: true,
            selectValueSubCategory: {}
        });
    }

    handleItemSelectChangeSubCategory(option) {
        this.setState({ selectValueSubCategory: option });
    }

    handleItemSelectChangePriority(option) {
        this.setState({ selectValuePriority: option });
    }

    handleChangeIsCall(checked) {
        this.setState({ isCall: checked });
    }

    handleChangeVipStation(checked) {
        this.setState({ isStationVip: checked });
    }

    render() {
        const { t, response } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const countryList = (response.common.gnocCountry && response.common.gnocCountry.payload) ? response.common.gnocCountry.payload.data.data : [];
        const typeIdList = (response.common.ptType && response.common.ptType.payload) ? response.common.ptType.payload.data.data : [];
        const ttPriorityList = (response.common.ttPriority && response.common.ttPriority.payload) ? response.common.ttPriority.payload.data.data : [];
        objectAddOrEdit.ttConfigTimeId = objectAddOrEdit.ttConfigTimeId ? objectAddOrEdit.ttConfigTimeId : '';
        objectAddOrEdit.isCall = objectAddOrEdit.isCall === 1 ? true : false;
        objectAddOrEdit.isStationVip = objectAddOrEdit.isStationVip === 1 ? true : false;
        objectAddOrEdit.createTtTime = objectAddOrEdit.createTtTime ? objectAddOrEdit.createTtTime + "" : "";
        objectAddOrEdit.closeTtTime = objectAddOrEdit.closeTtTime ? objectAddOrEdit.closeTtTime + "" : "";
        objectAddOrEdit.processTtTime = objectAddOrEdit.processTtTime ? objectAddOrEdit.processTtTime + "" : "";
        objectAddOrEdit.processWoTime = objectAddOrEdit.processWoTime ? objectAddOrEdit.processWoTime + "" : "";
        objectAddOrEdit.timeAboutOverdue = objectAddOrEdit.timeAboutOverdue ? objectAddOrEdit.timeAboutOverdue + "" : "";
        objectAddOrEdit.timeStationVip = objectAddOrEdit.timeStationVip ? objectAddOrEdit.timeStationVip + "" : "";
        objectAddOrEdit.timeWoVip = objectAddOrEdit.timeWoVip ? objectAddOrEdit.timeWoVip + "" : "";
        for (const country of countryList) {
            country.itemId = country.itemCode;
        }
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("ttConfigTime:ttConfigTime.title.ttConfigTimeAdd") : this.state.isAddOrEdit === "EDIT" ? t("ttConfigTime:ttConfigTime.title.ttConfigTimeEdit") : ''}
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
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardHeader>
                                                        <i className="fa fa-align-justify"></i>{t("ttConfigTime:ttConfigTime.title.ttConfigTimeInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"country"}
                                                                    label={t("ttConfigTime:ttConfigTime.label.country")}
                                                                    isRequired={true}
                                                                    options={countryList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeCountry}
                                                                    selectValue={this.state.selectValueCountry}
                                                                    messageRequire={t("ttConfigTime:ttConfigTime.message.requiredCountry")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"typeId"}
                                                                    label={t("ttConfigTime:ttConfigTime.label.typeId")}
                                                                    isRequired={true}
                                                                    options={typeIdList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeTypeId}
                                                                    selectValue={this.state.selectValueTypeId}
                                                                    messageRequire={t("ttConfigTime:ttConfigTime.message.requiredType")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"subCategoryId"}
                                                                    label={t("ttConfigTime:ttConfigTime.label.subCategoryId")}
                                                                    isRequired={true}
                                                                    options={this.state.subCategoryList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeSubCategory}
                                                                    selectValue={this.state.selectValueSubCategory}
                                                                    messageRequire={t("ttConfigTime:ttConfigTime.message.requiredSubCategory")}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"priorityId"}
                                                                    label={t("ttConfigTime:ttConfigTime.label.ttPriority")}
                                                                    isRequired={true}
                                                                    options={ttPriorityList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangePriority}
                                                                    selectValue={this.state.selectValuePriority}
                                                                    messageRequire={t("ttConfigTime:ttConfigTime.message.requiredPriority")}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="createTtTime" label={t("ttConfigTime:ttConfigTime.label.createTtTime")} required
                                                                    maxLength="500" validate={{
                                                                        required: { value: true, errorMessage: t("ttConfigTime:ttConfigTime.message.requiredCreateTtTime") },
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongDataFormat") },
                                                                        min: {value: 0.01, errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongZeroDataFormat")}
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="closeTtTime" label={t("ttConfigTime:ttConfigTime.label.closeTtTime")} required
                                                                    maxLength="500" validate={{
                                                                        required: { value: true, errorMessage: t("ttConfigTime:ttConfigTime.message.requiredCloseTtTime") },
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongDataFormat") },
                                                                        min: {value: 0.01, errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongZeroDataFormat")}
                                                                    }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="processTtTime" label={t("ttConfigTime:ttConfigTime.label.processTtTime")} required
                                                                    maxLength="500" validate={{
                                                                        required: { value: true, errorMessage: t("ttConfigTime:ttConfigTime.message.requiredProcessTtTime") },
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongDataFormat") },
                                                                        min: {value: 0.01, errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongZeroDataFormat")}
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="processWoTime" label={t("ttConfigTime:ttConfigTime.label.processWoTime")} required
                                                                    maxLength="500" validate={{
                                                                        required: { value: true, errorMessage: t("ttConfigTime:ttConfigTime.message.requiredProcessWoTime") },
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongDataFormat") },
                                                                        min: {value: 0.01, errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongZeroDataFormat")}
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAppSwitch 
                                                                    name={"isCall"}
                                                                    label={t("ttConfigTime:ttConfigTime.label.isCall")}
                                                                    checked={this.state.isCall}
                                                                    handleChange={this.handleChangeIsCall}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="timeAboutOverdue" label={t("ttConfigTime:ttConfigTime.label.timeAboutOverdue")}
                                                                    maxLength="500" validate={{
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongDataFormat") },
                                                                        min: {value: 0.01, errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongZeroDataFormat")}
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="cdAudioName" label={t("ttConfigTime:ttConfigTime.label.cdAudioName")} 
                                                                    maxLength="100" />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="ftAudioName" label={t("ttConfigTime:ttConfigTime.label.ftAudioName")} 
                                                                    maxLength="100" />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAppSwitch 
                                                                    name={"isStationVip"}
                                                                    label={t("ttConfigTime:ttConfigTime.label.vipStation")}
                                                                    checked={this.state.isStationVip}
                                                                    handleChange={this.handleChangeVipStation}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4" style={this.state.isStationVip ? {} : { display: 'none' }}> 
                                                                <CustomAvField name="timeStationVip" label={t("ttConfigTime:ttConfigTime.label.timeStationVip")} required={this.state.isStationVip} 
                                                                    maxLength="500" validate={{
                                                                        required: { value: true, errorMessage: t("ttConfigTime:ttConfigTime.message.requiredTimeStationVip") },
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongDataFormat") },
                                                                        min: {value: 0.01, errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongZeroDataFormat")}
                                                                    }} />
                                                            </Col>
                                                            <Col xs="12" sm="4" style={this.state.isStationVip ? {} : { display: 'none' }}>
                                                                <CustomAvField name="timeWoVip" label={t("ttConfigTime:ttConfigTime.label.timeWoVip")} required={this.state.isStationVip} 
                                                                    maxLength="500" validate={{
                                                                        required: { value: true, errorMessage: t("ttConfigTime:ttConfigTime.message.requiredTimeWoVip") },
                                                                        pattern: { value: '^[+]?([0-9]{1,4})?([.][0-9]{1,2})?$', errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongDataFormat") },
                                                                        min: {value: 0.01, errorMessage: this.props.t("ttConfigTime:ttConfigTime.message.error.wrongZeroDataFormat")}
                                                                    }} />
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
            </div>
        );
    }
}

TtConfigTimeAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttConfigTime, common } = state;
    return {
        response: { ttConfigTime, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtConfigTimeActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtConfigTimeAddEdit));