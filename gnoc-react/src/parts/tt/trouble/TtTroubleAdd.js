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
import * as TtConfigTimeActions from '../configTime/TtConfigTimeActions';
import { CustomSelectLocal, CustomSticky, CustomAvField, CustomDatePicker, CustomAutocomplete, CustomInputPopup, CustomAppSwitch, CustomMultiSelectLocal, CustomSelect } from "../../../containers/Utils";
import { Dropzone, downloadFileLocal, validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";
import TtTroubleAddSearchUnitPopup from './TtTroubleAddSearchUnitPopup';
import TtTroubleAddSearchNodePopup from './TtTroubleAddSearchNodePopup';

class TtTroubleAdd extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            btnAddLoading: false,
            isOpenSearchUnitPopup: false,
            isOpenSearchNodePopup: false,
            //AddOrEditModal
            modalName: props.parentState.modalName,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            selectValueStatus: {},
            selectValuePtType: {},
            selectValueAlarmGroup: {},
            selectValueSubCategory: {},
            selectValueVendor: {},
            selectValueImpact: {},
            selectValuePriority: {},
            selectValueAffectService: [],
            selectValueRisk: {},
            selectValueCountry: {},
            selectValueTranNwType: {},
            selectValueNetworkLevel: [],
            selectValueReceiveUser: {},
            selectValueReceiveUnit: {},
            files: [],
            stationVip: false,
            haveAutoCreateWO: false,
            networkNodeCode: [],
            beginTroubleTime: null,
            endTroubleTime: null,
            //combo list
            ptTypeList: [],
            ptSubCatList : [],
            ttStateList : [],
            ttPriorityList : [],
            vendorList : [],
            ttImpactList: [],
            insertSourceList: [],
            alarmGroupList: [],
            affectServiceList: [],
            ttRiskList: [],
            countryList: [],
            transNwTypeList: [],
            networkLevelList: [],
            mapConfigProperty: {},
            fieldsProperty: this.buildDefaultFields(),
            isPtTypeChange: true,
            isChangeAutoCreateWO: true,
            isGetPriority: true,
            checkConfigTime: true
        };
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    componentDidMount() {
        this.getListCatItem();
        this.props.actions.getConfigProperty("").then((response) => {
            this.setState({
                mapConfigProperty: response.payload.data || {}
            }, () => {
                this.onChangeType();
            });
        });
        this.setDefaultValue();
        if (this.state.modalName === "CLONE") {
            const fieldsProperty = {...this.state.fieldsProperty};
            if (this.state.selectedData.impactId + "" === "71") {
                fieldsProperty.affectedService.disable = false;
            }
            this.setState({
                fieldsProperty
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isPtTypeChange) {
            this.onChangeType();
            this.setState({
                isPtTypeChange: false
            });
        }
        if (this.state.isChangeAutoCreateWO) {
            this.onChangeAutoCreateWO();
            this.setState({
                isChangeAutoCreateWO: false
            });
        }
        if (this.state.isGetPriority) {
            const typeId = this.state.selectValuePtType.value;
            const alarmGroupId = this.state.selectValueAlarmGroup.value;
            const country = this.state.selectValueCountry.value;
            if (typeId && alarmGroupId && country) {
                this.props.actions.getPriorityByProps(typeId, alarmGroupId, country).then((response) => {
                    const data = response.payload.data;
                    const priority = data.find(item => item.itemId + "" === this.state.selectedData.priorityId + "");
                    this.setState({
                        ttPriorityList: response.payload.data,
                        selectValuePriority: priority ? { value: priority.itemId, label: priority.itemName } : {}
                    });
                });
            } else {
                this.setState({
                    selectValuePriority: {},
                    ttPriorityList: []
                });
            }
            this.setState({
                isGetPriority: false
            });
        }
    }

    buildDefaultFields() {
        return {
            affectedService: {
                required: false, disable: true, visible: true
            },
            transInfo: {
                required: false, disable: false, visible: false
            },
            affectedNode: {
                required: false, disable: false, visible: true
            }
        }
    }

    checkExistProperty(value, key) {
        if (this.state.mapConfigProperty) {
            try {
                const arrProperty = this.state.mapConfigProperty[key].split(",");
                return arrProperty.includes(value + "");
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    setDefaultValue = () => {
        const { selectedData } = this.state;
        this.setState({
            haveAutoCreateWO: selectedData.autoCreateWO === 1 ? true : false,
            stationVip: selectedData.isStationVip === 1 ? true : false,
            selectValueCountry: selectedData.country ? { value: selectedData.country } : {},
            selectValueLocation: selectedData.locationId ? { value: selectedData.locationId, label: selectedData.location } : {},
            selectValueSubCategory: selectedData.subCategoryId ? { value: selectedData.subCategoryId } : {},
            networkNodeCode: selectedData.affectedNode ? selectedData.affectedNode.split(",").map(item => { return { deviceCode: item, nationCode: selectedData.nationCode }; }) : [],
            selectValueImpact: selectedData.impactId ? { value: selectedData.impactId } : {},
            selectValueAffectService: selectedData.affectedService ? selectedData.affectedService.split(",").map(item => { return { value: item }; }) : [],
            selectValueRisk: selectedData.risk ? { value: selectedData.risk } : {},
            selectValueVendor: selectedData.vendorId ? { value: selectedData.vendorId } : {},
            selectValueNetworkLevel: selectedData.networkLevel ? selectedData.networkLevel.split(",").map(item => { return {value: item}; }) : [],
            beginTroubleTime: selectedData.beginTroubleTime ? new Date(selectedData.beginTroubleTime) : null,
            // endTroubleTime: selectedData.endTroubleTime ? new Date(selectedData.endTroubleTime) : null,
            selectValueTranNwType: selectedData.transNetworkTypeId ? { value: selectedData.transNetworkTypeId } : {},
            selectValueReceiveUnit: selectedData.receiveUnitId ? { unitId: selectedData.receiveUnitId, unitName: selectedData.receiveUnitName } : {},
            selectValueReceiveUser: selectedData.receiveUserId ? { value: selectedData.receiveUserId, label: selectedData.receiveUserName } : {},
            isChangeAutoCreateWO: true,
            isGetPriority: true
        });
    }

    onChangeType = () => {
        if (this.state.selectValuePtType.value) {
            this.props.actions.getListItemByCategoryAndParent("PT_SUB_CATEGORY", this.state.selectValuePtType.value).then((response) => {
                this.setState({
                    ptSubCatList: response.payload.data || []
                });
            });
            this.props.actions.getListItemByCategoryAndParent("ALARM_GROUP", this.state.selectValuePtType.value).then((response) => {
                const alarmGroupList = response.payload.data;
                let alarmGroup = {};
                for (const alarm of alarmGroupList) {
                    alarm.itemValue = alarm.description;
                    if (alarm.itemId + "" === this.state.selectedData.alarmGroupId + "") {
                        alarmGroup = alarm;
                    }
                }
                this.setState({
                    alarmGroupList,
                    selectValueAlarmGroup: this.state.modalName === "CLONE" ? { value: alarmGroup.itemId, code: alarmGroup.itemCode, subValue: alarmGroup.description } : {},
                    isGetPriority: true
                });
            });
            this.props.actions.getLstNetworkLevel(this.state.selectValuePtType.value).then((response) => {
                const networkLevelList = response.payload.data || [];
                for (const network of networkLevelList) {
                    network.itemId = network.itemCode;
                }
                this.setState({
                    networkLevelList
                });
            });
            if (this.checkExistProperty(this.state.selectValuePtType.value + "", "TT.TYPE.TRANS")) {
                const fieldsProperty = {...this.state.fieldsProperty};
                fieldsProperty.transInfo.required = true;
                fieldsProperty.transInfo.visible = true;
                this.setState({
                    fieldsProperty
                });
            } else {
                const fieldsProperty = {...this.state.fieldsProperty};
                fieldsProperty.transInfo.required = false;
                fieldsProperty.transInfo.visible = false;
                this.setState({
                    fieldsProperty
                });
            }
            if (this.checkExistProperty(this.state.selectValuePtType.value + "", "TT.TYPE.TRANS.NODE")) {
                const fieldsProperty = {...this.state.fieldsProperty};
                fieldsProperty.affectedNode.required = true;
                this.setState({
                    fieldsProperty
                });
            } else {
                const fieldsProperty = {...this.state.fieldsProperty};
                    fieldsProperty.affectedNode.required = this.state.haveAutoCreateWO;
                    this.setState({
                        fieldsProperty
                    });
            }
        } else {
            const fieldsProperty = {...this.state.fieldsProperty};
            fieldsProperty.affectedNode.required = this.state.haveAutoCreateWO;
            fieldsProperty.transInfo.required = false;
            fieldsProperty.transInfo.visible = false;
            this.setState({
                fieldsProperty,
                ptSubCatList: [],
                alarmGroupList: []
            });
        }
    }

    onChangeAutoCreateWO = () => {
        if (this.state.selectValuePtType.value) {
            if (this.checkExistProperty(this.state.selectValuePtType.value + "", "TT.TYPE.TRANS.NODE")) {
                const fieldsProperty = {...this.state.fieldsProperty};
                fieldsProperty.affectedNode.required = true;
                this.setState({
                    fieldsProperty
                });
            } else {
                const fieldsProperty = {...this.state.fieldsProperty};
                fieldsProperty.affectedNode.required = this.state.haveAutoCreateWO;
                this.setState({
                    fieldsProperty
                });
            }
        } else {
            const fieldsProperty = {...this.state.fieldsProperty};
            fieldsProperty.affectedNode.required = this.state.haveAutoCreateWO;
            this.setState({
                fieldsProperty
            });
        }
    }

    getListCatItem = () => {
        let arrCatItem = [];
        arrCatItem.push("PT_TYPE");//mang su co
        arrCatItem.push("TT_STATE");//trang thai
        arrCatItem.push("VENDOR");//vendor
        arrCatItem.push("TT_IMPACT");//muc anh huong
        arrCatItem.push("INSERT_SOURCE");//nguon tao
        arrCatItem.push("PT_AFFECT_SERVICE");//dich vu anh huong
        arrCatItem.push("TT_RISK");//nhom nguy co
        arrCatItem.push("GNOC_COUNTRY");//quoc gia
        arrCatItem.push("TT_TRANS_NW_TYPE");//loai truyen dan

        const data = JSON.stringify(arrCatItem).replace("[", "%5B").replace("]", "%5D");

        this.props.actions.getListCatItemDTO(data).then((response) => {
            let ptTypeList = [];
            let ttStateList = [];
            let vendorList = [];
            let ttImpactList = [];
            let insertSourceList = [];
            let affectServiceList = [];
            let ttRiskList = [];
            let countryList = [];
            let transNwTypeList = [];
            for (const item of response.payload.data) {
                switch(item.categoryCode) {
                    case "PT_TYPE":
                        ptTypeList.push(item);
                        break;
                    case "TT_STATE":
                        const stateArr = ["OPEN", "WAITING RECEIVE"];
                        if (stateArr.includes(item.itemCode)) {
                            ttStateList.push(item);
                        }
                        if (item.itemCode === "WAITING RECEIVE") {
                            this.setState({
                                selectValueStatus: { value: item.itemId, label: item.itemName, code: item.itemCode, subValue: item.itemValue }
                            });
                        }
                        break;
                    case "VENDOR":
                        vendorList.push(item);
                        break;
                    case "TT_IMPACT":
                        ttImpactList.push(item);
                        break;
                    case "INSERT_SOURCE":
                        insertSourceList.push(item);
                        break;
                    case "PT_AFFECT_SERVICE":
                        item.itemId = item.itemCode;
                        affectServiceList.push(item);
                        break;
                    case "TT_RISK":
                        ttRiskList.push(item);
                        break;
                    case "GNOC_COUNTRY":
                        item.itemId = item.itemCode;
                        countryList.push(item);
                        break;
                    case "TT_TRANS_NW_TYPE":
                        transNwTypeList.push(item);
                        break;
                    default:
                        break;
                }
            }
            this.setState({
                ptTypeList,
                ttStateList,
                vendorList,
                ttImpactList,
                insertSourceList,
                affectServiceList,
                ttRiskList,
                countryList,
                transNwTypeList
            }, () => {
                this.setDefaultValue1();
            });
        });
    }

    setDefaultValue1 = () => {
        const ptType = this.state.ptTypeList.find(item => item.itemId + "" === this.state.selectedData.typeId + "");
        // const state = this.state.ttStateList.find(item => item.itemId + "" === this.state.selectedData.state + "");
        this.setState({
            selectValuePtType: ptType ? { value: ptType.itemId, code: ptType.itemCode } : {},
            isPtTypeChange: true,
            // selectValueStatus: state ? { value: state.itemId, code: state.itemCode } : {},
        });
    }

    setDataToObject(object) {
        object.troubleName = object.troubleName.trim();
        object.description = object.description.trim();
        // object.workLog = object.workLog ? object.workLog.trim() : "";
        object.createdTime = new Date();
        object.insertSource = "TT";
        object.priorityId = this.state.selectValuePriority.value || "";
        object.priorityName = this.state.selectValuePriority.label || "";
        object.state = this.state.selectValueStatus.value || "";
        object.stateName = this.state.selectValueStatus.code || "";
        object.beginTroubleTime = this.state.beginTroubleTime || "";
        object.endTroubleTime = this.state.endTroubleTime || "";
        object.typeId = this.state.selectValuePtType.value || "";
        object.typeName = this.state.selectValuePtType.code || "";
        object.country = this.state.selectValueCountry.value || "";
        object.receiveUnitId = this.state.selectValueReceiveUnit.unitId || "";
        object.receiveUnitName = this.state.selectValueReceiveUnit.unitName || "";
        object.receiveUserId = this.state.selectValueReceiveUser.value !== null ? this.state.selectValueReceiveUser.value : "";
        object.receiveUserName = this.state.selectValueReceiveUser.value !== null ? this.state.selectValueReceiveUser.label : "";
        object.subCategoryId = this.state.selectValueSubCategory.value || -1;
        object.locationId = this.state.selectValueLocation ? this.state.selectValueLocation.value : "";
        object.location = this.state.selectValueLocation ? this.state.selectValueLocation.label : "";
        object.impactId = this.state.selectValueImpact.value || "";
        object.vendorId = this.state.selectValueVendor.value || "";
        object.affectedNode = this.state.networkNodeCode.map(item => item.deviceCode).join(",");
        object.lstNode = this.state.networkNodeCode;
        object.nationCode = this.state.networkNodeCode.length > 0 ? this.state.networkNodeCode[0].nationCode : "";
        object.risk = this.state.selectValueRisk.value || "";
        object.affectedService = this.state.selectValueAffectService.map(item => item.value).join(",");
        object.alarmGroupId = this.state.selectValueAlarmGroup.value || "";
        object.alarmGroupCode = this.state.selectValueAlarmGroup.code || "";
        object.strAlarmGroupDescription = this.state.selectValueAlarmGroup.subValue || "";
        object.networkLevel = this.state.selectValueNetworkLevel.map(item => item.value).join(",");
        object.transNetworkTypeId = this.state.selectValueTranNwType.value;
        object.isStationVip = this.state.stationVip ? "1": "0";
        object.autoCreateWO = this.state.haveAutoCreateWO ? "1": "0";
        object.authorityDTO = {requestId: "123456", username: "admin@123", password: "admin@123", partyCode: "TT"};
    }

    validateBeforeSubmit() {
        if (this.state.beginTroubleTime && this.state.beginTroubleTime > new Date()) {
            document.getElementById("custom-beginTroubleTime").focus();
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.beginTroubleTime"));
            return false;
        } else if (this.state.endTroubleTime && this.state.endTroubleTime > new Date()) {
            document.getElementById("custom-endTroubleTime").focus();
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.endTroubleTime"));
            return false;
        } else if (this.state.endTroubleTime && this.state.beginTroubleTime && this.state.beginTroubleTime > this.state.endTroubleTime) {
            document.getElementById("custom-beginTroubleTime").focus();
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.endTimeLowerStartTime"));
            return false;
        }
        return true;
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        const ttTrouble = Object.assign({}, values);
        this.setDataToObject(ttTrouble);
        if (!this.validateBeforeSubmit()) return;
        const data = {
            page: 1, pageSize: 10,
            typeId: this.state.selectValuePtType.value,
            subCategoryId: this.state.selectValueAlarmGroup.value,
            priorityId: this.state.selectValuePriority.value,
            country: ttTrouble.insertSource.includes("NOC") ? this.state.selectValueCountry.value : "NOC"
        };
        this.props.actions.searchTtConfigTime(data).then(response => {
            const data = response.payload.data.data;
            if (data.length < 1) {
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.contactAdmin"));
            } else if (ttTrouble.isStationVip === "1" && data[0].isStationVip !== 1) {
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.stationVipNotConfig"));
            } else {
                this.addTroubles(ttTrouble);
            }
        }).catch(error => {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.getConfigTime"));
        });
    }

    addTroubles = (ttTrouble) => {
        this.setState({
            btnAddLoading: true
        }, () => {
            this.props.actions.addTtTrouble(this.state.files, ttTrouble).then((response) => {
                this.setState({
                    btnAddLoading: false
                }, () => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.props.closePage("ADD", true);
                        toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.add"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.add"));
                    }
                });
            }).catch((response) => {
                this.setState({
                    btnAddLoading: false
                }, () => {
                    const message = response.error.response.data.message;
                    if (message.includes('FAIL_AUTO_CREATE_WO')) {
                        toastr.error(message);
                    } else if (message.includes('call.wo.error')) {
                        toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.callWo"))
                    } else {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.add"));
                        }
                    }
                });
            });
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    //start handle combo
    handleChangeSelectValuePtType = (d) => {
        this.setState({
            selectValuePtType: d,
            selectValueAlarmGroup: {},
            selectValueSubCategory: {},
            isPtTypeChange: true,
            isGetPriority: true
        });
    }

    handleChangeSelectValueImpact = (d) => {
        this.setState({
            selectValueImpact: d
        });
        if (d.code === "Yes") {
            const fieldsProperty = {...this.state.fieldsProperty};
            fieldsProperty.affectedService.required = true;
            fieldsProperty.affectedService.disable = false;
            this.setState({
                fieldsProperty
            });
        } else {
            const fieldsProperty = {...this.state.fieldsProperty};
            fieldsProperty.affectedService.required = false;
            fieldsProperty.affectedService.disable = true;
            this.setState({
                fieldsProperty,
                selectValueAffectService: []
            });
        }
    }
    //end handle combo

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

    openSearchUnitPopup = () => {
        this.setState({
            isOpenSearchUnitPopup: true
        });
    }

    closeSearchUnitPopup = () => {
        this.setState({
            isOpenSearchUnitPopup: false
        });
    }

    setValueSearchUnitPopup = (d) => {
        const selectValueReceiveUnit = {unitName: d.unitName + " (" + d.unitCode + ")", unitId: d.unitId};
        this.setState({
            selectValueReceiveUnit,
            selectValueReceiveUser: {}
        },() => {
            this.closeSearchUnitPopup();
        });
    }

    openSearchNodePopup = () => {
        this.setState({
            isOpenSearchNodePopup: true
        });
    }

    closeSearchNodePopup = () => {
        this.setState({
            isOpenSearchNodePopup: false
        });
    }

    setValueSearchNodePopup = (d) => {
        this.setState({
            networkNodeCode: d
        });
    }

    render() {
        const { t } = this.props;
        const { files, fieldsProperty, selectedData } = this.state;
        //list item
        const { ptTypeList, ttStateList, alarmGroupList, ptSubCatList, vendorList, ttImpactList, ttPriorityList,
                affectServiceList, ttRiskList, countryList, transNwTypeList, networkLevelList } = this.state;
        let objectAddOrEdit = {};
        objectAddOrEdit.troubleName = selectedData.troubleName || "";
        objectAddOrEdit.description = selectedData.description || "";
        // objectAddOrEdit.workLog = selectedData.workLog || "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
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
                                            <Button type="button" color="secondary" onClick={() => this.props.closePage("ADD")}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
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
                                                    <CustomAvField name="troubleName" label={this.props.t("ttTrouble:ttTrouble.label.troubleName")} autoFocus
                                                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.troubleName")} required maxLength="500"
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.troubleName") } }} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomDatePicker
                                                        name={"beginTroubleTime"}
                                                        label={t("ttTrouble:ttTrouble.label.beginTroubleTime")}
                                                        isRequired={false}
                                                        selected={this.state.beginTroubleTime}
                                                        handleOnChange={(d) => this.setState({ beginTroubleTime: d })}
                                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                                        showTimeSelect={true}
                                                        timeFormat="HH:mm:ss"
                                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="8">
                                                    <CustomAvField type="textarea" rows="5" name="description" label={this.props.t("ttTrouble:ttTrouble.label.descriptionAdd")}
                                                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.description")} required maxLength="2000"
                                                    validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.description") } }} />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <Row>
                                                        <Col xs="12" sm="12">
                                                            <CustomDatePicker
                                                                name={"endTroubleTime"}
                                                                label={t("ttTrouble:ttTrouble.label.endTroubleTime")}
                                                                isRequired={false}
                                                                selected={this.state.endTroubleTime}
                                                                handleOnChange={(d) => this.setState({ endTroubleTime: d })}
                                                                dateFormat="dd/MM/yyyy HH:mm:ss"
                                                                showTimeSelect={true}
                                                                timeFormat="HH:mm:ss"
                                                                placeholder="dd/MM/yyyy HH:mm:ss"
                                                                readOnly={true}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="12">
                                                            <CustomAutocomplete 
                                                                name={"locationId"}
                                                                label={t("ttTrouble:ttTrouble.label.location")}
                                                                placeholder={t("ttTrouble:ttTrouble.placeholder.location")}
                                                                isRequired={true}
                                                                messageRequire={t("ttTrouble:ttTrouble.message.required.location")}
                                                                closeMenuOnSelect={false}
                                                                handleItemSelectChange={(d) => this.setState({selectValueLocation: d})}
                                                                selectValue={this.state.selectValueLocation}
                                                                moduleName={"REGION"} 
                                                                isHasCheckbox={false}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"typeId"}
                                                        label={t("ttTrouble:ttTrouble.label.domainTt")}
                                                        isRequired={true}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.domainTt")}
                                                        options={ptTypeList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleChangeSelectValuePtType}
                                                        selectValue={this.state.selectValuePtType}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"alarmGroupId"}
                                                        label={t("ttTrouble:ttTrouble.label.incidentGroup")}
                                                        isRequired={true}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.incidentGroup")}
                                                        options={alarmGroupList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueAlarmGroup: d, isGetPriority: true })}
                                                        selectValue={this.state.selectValueAlarmGroup}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"subCategoryId"}
                                                        label={t("ttTrouble:ttTrouble.label.subCategory")}
                                                        isRequired={true}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.subCategory")}
                                                        options={ptSubCatList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueSubCategory: d })}
                                                        selectValue={this.state.selectValueSubCategory}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"country"}
                                                        label={t("ttTrouble:ttTrouble.label.country")}
                                                        isRequired={true}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.country")}
                                                        options={countryList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueCountry: d, isGetPriority: true })}
                                                        selectValue={this.state.selectValueCountry}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"priorityId"}
                                                        label={t("ttTrouble:ttTrouble.label.priority")}
                                                        isRequired={true}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.priority")}
                                                        options={ttPriorityList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValuePriority: d })}
                                                        selectValue={this.state.selectValuePriority}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomInputPopup
                                                        name={"receiveUnitId"}
                                                        label={t("ttTrouble:ttTrouble.label.responsibleUnitAdd")}
                                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                                        value={this.state.selectValueReceiveUnit.unitName || ""}
                                                        handleRemove={() => this.setState({ selectValueReceiveUnit: {}, selectValueReceiveUser: {} })}
                                                        handleDoubleClick={this.openSearchUnitPopup}
                                                        isRequired={true}
                                                        messageRequire={this.props.t("ttTrouble:ttTrouble.message.required.responsibleUnitAdd")}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"state"}
                                                        label={t("ttTrouble:ttTrouble.label.status")}
                                                        isRequired={true}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.status")}
                                                        options={ttStateList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueStatus: d })}
                                                        selectValue={this.state.selectValueStatus}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"impactId"}
                                                        label={t("ttTrouble:ttTrouble.label.impactAdd")}
                                                        isRequired={true}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.impactAdd")}
                                                        options={ttImpactList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={this.handleChangeSelectValueImpact} 
                                                        selectValue={this.state.selectValueImpact}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelect
                                                        name={"receiveUserId"}
                                                        label={t("ttTrouble:ttTrouble.label.responsiblePerson")}
                                                        isRequired={false}
                                                        moduleName={"USERS"}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueReceiveUser: d })}
                                                        selectValue={this.state.selectValueReceiveUser}
                                                        parentValue={(this.state.selectValueReceiveUnit && this.state.selectValueReceiveUnit.unitId) ? this.state.selectValueReceiveUnit.unitId : "-1"}
                                                        isHasChildren={(this.state.selectValueReceiveUnit && this.state.selectValueReceiveUnit.unitId) ? false : true}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomInputPopup
                                                        name={"affectedNode"}
                                                        label={t("ttTrouble:ttTrouble.label.networkNodeCode")}
                                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                                        value={this.state.networkNodeCode.map(item => item.deviceCode).join(",")}
                                                        handleRemove={() => this.setState({ networkNodeCode: [] })}
                                                        handleDoubleClick={this.openSearchNodePopup}
                                                        isRequired={fieldsProperty.affectedNode.required}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomMultiSelectLocal
                                                        name={"affectedService"}
                                                        label={t("ttTrouble:ttTrouble.label.affectedService")}
                                                        isRequired={fieldsProperty.affectedService.required}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.affectedService")}
                                                        options={affectServiceList}
                                                        closeMenuOnSelect={false}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueAffectService: d })}
                                                        selectValue={this.state.selectValueAffectService}
                                                        isDisabled={fieldsProperty.affectedService.disable}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"risk"}
                                                        label={t("ttTrouble:ttTrouble.label.riskGroup")}
                                                        isRequired={false}
                                                        options={ttRiskList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueRisk: d })}
                                                        selectValue={this.state.selectValueRisk}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"vendorId"}
                                                        label={t("ttTrouble:ttTrouble.label.vendor")}
                                                        isRequired={false}
                                                        options={vendorList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueVendor: d })}
                                                        selectValue={this.state.selectValueVendor}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAppSwitch 
                                                        name={"isStationVip"}
                                                        label={t("ttTrouble:ttTrouble.label.stationVip")}
                                                        checked={this.state.stationVip}
                                                        handleChange={(checked) => this.setState({ stationVip: checked })}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomAppSwitch 
                                                        name={"autoCreateWO"}
                                                        label={t("ttTrouble:ttTrouble.label.haveAutoCreateWO")}
                                                        checked={this.state.haveAutoCreateWO}
                                                        handleChange={(checked) => this.setState({ haveAutoCreateWO: checked, isChangeAutoCreateWO: true })}
                                                    />
                                                </Col>
                                            </Row>
                                            {/* <Row>
                                                <Col xs="12">
                                                    <CustomAvField type="textarea" rows="3" name="workLog" label={this.props.t("ttTrouble:ttTrouble.label.actionProcess")}
                                                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.description")} maxLength="2000" />
                                                </Col>
                                            </Row> */}
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
                                    <Card className={fieldsProperty.transInfo.visible ? "" : "class-hidden"}>
                                        <CardHeader>
                                            <span>{t("ttTrouble:ttTrouble.title.transmissionInfo")}</span>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col xs="12" sm="4">
                                                    <CustomSelectLocal
                                                        name={"transNetworkTypeId"}
                                                        label={t("ttTrouble:ttTrouble.label.transmissionType")}
                                                        isRequired={false}
                                                        options={transNwTypeList}
                                                        closeMenuOnSelect={true}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueTranNwType: d })}
                                                        selectValue={this.state.selectValueTranNwType}
                                                    />
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <CustomMultiSelectLocal
                                                        name={"networkLevel"}
                                                        label={t("ttTrouble:ttTrouble.label.networkLevel")}
                                                        isRequired={fieldsProperty.transInfo.required}
                                                        messageRequire={t("ttTrouble:ttTrouble.message.required.networkLevel")}
                                                        options={networkLevelList}
                                                        closeMenuOnSelect={false}
                                                        handleItemSelectChange={(d) => this.setState({ selectValueNetworkLevel: d })}
                                                        selectValue={this.state.selectValueNetworkLevel}
                                                    />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
                <TtTroubleAddSearchUnitPopup
                    parentState={this.state}
                    closePopup={this.closeSearchUnitPopup}
                    setValue={this.setValueSearchUnitPopup}
                />
                <TtTroubleAddSearchNodePopup
                    parentState={this.state}
                    closePopup={this.closeSearchNodePopup}
                    setValue={this.setValueSearchNodePopup}
                />
            </div>
        );
    }
}

TtTroubleAdd.propTypes = {
    closePage: PropTypes.func.isRequired,
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
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, TtConfigTimeActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleAdd));