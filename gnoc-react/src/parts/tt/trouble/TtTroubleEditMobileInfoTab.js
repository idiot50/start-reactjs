import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomSticky, CustomSelectLocal, CustomAvField, CustomDatePicker, CustomInputPopup } from '../../../containers/Utils';
import { validSubmitForm, invalidSubmitForm, confirmAlertInfo } from "../../../containers/Utils/Utils";
import TtTroubleEditMobileInfoTabCellPopup from './TtTroubleEditMobileInfoTabCellPopup';
import TtTroubleEditMobileInfoTabConcavePopup from './TtTroubleEditMobileInfoTabConcavePopup';

class TtTroubleEditMobileIncidentInfoTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            isOpenCell: false,
            isOpenConcave: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            //select
            selectValueDeferType: {},
            selectValueGroupSolution: {},
            cellService: {},
            concave: {},
            estimateTime: null,
            deferTypeList: [],
            groupSolutionList: [],
            mapConfigProperty: props.parentState.mapConfigProperty,
            latitude: '',
            longitude: '',
            fieldsProperty: {},
            mobileData: {},
            tabIndex: null,
            isValidSubmitForm: false,
            mapGroupSolution: []
        };
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        const deferTypeList = [];
        deferTypeList.push({ itemId: 1, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.deferType.customer") });
        if (this.checkExistProperty(this.state.selectedData.typeId + "", "TT.TYPE.DD_MOBILE")) {
            deferTypeList.push({ itemId: 2, itemName: this.props.t("ttTrouble:ttTrouble.dropdown.deferType.technical") })
        }
        this.setState({
            deferTypeList
        });
        this.getGroupSolution();
        this.setState({
            estimateTime: this.state.selectedData.estimateTime ? new Date(this.state.selectedData.estimateTime) : null,
            selectValueDeferType: { value: this.state.selectedData.deferType },
            selectValueGroupSolution: { value: this.state.selectedData.groupSolution },
            longitude: this.state.selectedData.longitude || '',
            latitude: this.state.selectedData.latitude || '',
            cellService: this.state.selectedData.cellService ? {cellCode: this.state.selectedData.cellService} : {},
            concave: this.state.selectedData.concave ? {concavePointCode: this.state.selectedData.concave} : {},
        });
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
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

    getGroupSolution = () => {
        this.props.actions.getListGroupSolution(this.state.selectedData).then((response) => {
            const groupSolutionList = response.payload.data.map(item => {return {itemId: item.solutionId, itemName: item.name}});
            this.setState({
                groupSolutionList: groupSolutionList || [],
                mapGroupSolution: response.payload.data || []
            }, () => {
                this.props.onChangeChildInfoTab(12, this.state);
            });
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        this.setState({
            isValidSubmitForm: false
        }, () => {
            this.props.onChangeChildTab(this.state.tabIndex, this.state, errors);
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.setState({
            isValidSubmitForm: true
        }, () => {
            const state = Object.assign({}, this.state);
            state.dataInfoTab = values;
            this.props.onChangeChildTab(this.state.tabIndex, state);
        });
        // validSubmitForm(event, values, "idFormAddOrEdit");
        // this.setState({
        //     btnAddOrEditLoading: true
        // }, () => {
        //     const ttTrouble = Object.assign({}, this.state.selectedData, values);
        //     if (this.state.fieldsProperty.deferType && this.state.fieldsProperty.deferType.visible) {
        //         ttTrouble.deferType = this.state.selectValueDeferType.value;
        //     } else {
        //         ttTrouble.deferType = this.state.selectedData.deferType;
        //     }
        //     if (this.state.fieldsProperty.estimateTime && this.state.fieldsProperty.estimateTime.visible) {
        //         ttTrouble.estimateTime = this.state.estimateTime;
        //     } else {
        //         ttTrouble.estimateTime = this.state.selectedData.estimateTime;
        //     }
        //     ttTrouble.longitude = ttTrouble.longitude ? ttTrouble.longitude.trim() : "";
        //     ttTrouble.latitude = ttTrouble.latitude ? ttTrouble.latitude.trim() : "";
        //     ttTrouble.concave = this.state.concave.value;
        //     ttTrouble.cellService = this.state.cellService.cellCode;
        //     this.updateTtProblem(ttTrouble);
        // });
    }

    handleChangeEstimateTime = (date) => {
        this.setState({ estimateTime: date });
    }

    updateTtProblem = (ttTrouble) => {
        // this.setState({
        //     mobileData: ttTrouble
        // }, () => {
        //     this.setState({
        //         isSubmit: true,
        //         btnAddOrEditLoading: false
        //     }, () => {
        //         this.props.onChangeChildTab(12, this.state);
        //     });
        // });
        this.props.actions.editTtTrouble(ttTrouble).then((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                if (response.payload.data.key === "SUCCESS") {
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.update"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
                }
            });
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
                }
            });
        });
    }

    openCellPopup = () => {
        this.setState({
            isOpenCell: true
        });
    }

    closeCellPopup = () => {
        this.setState({
            isOpenCell: false
        });
    }

    setValueCell = (object) => {
        this.setState({
            cellService: object
        });
    }

    openConcavePopup = () => {
        if (this.state.longitude === '') {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.longitude"));
            document.getElementById("longitude").focus();
            return;
        }
        if (this.state.latitude === '') {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.latitude"));
            document.getElementById("latitude").focus();
            return;
        }
        this.setState({
            isOpenConcave: true
        });
    }

    sendTKTU = () => {
        if (this.state.selectedData.isSendTktu + "" === "1") {
            toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.concaveAreaSend"));
            return;
        }
        if (this.state.longitude === '') {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.longitude"));
            document.getElementById("longitude").focus();
            return;
        }
        if (this.state.latitude === '') {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.latitude"));
            document.getElementById("latitude").focus();
            return;
        }
        if (!this.state.cellService.cellCode) {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.cellService"));
            return;
        }
        confirmAlertInfo(this.props.t("ttTrouble:ttTrouble.message.confirmConcave"),
        this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
        () => {
            const ttTrouble = Object.assign({}, this.state.selectedData);
            ttTrouble.longitude = this.state.longitude;
            ttTrouble.latitude = this.state.latitude;
            ttTrouble.cellService = this.state.cellService.cellCode;
            this.props.actions.sendTicketToTKTU(ttTrouble).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.sendMessage"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.sendMessage"));
                }
            }).catch((response) => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.sendMessage"));
                }
            });
        }, () => {
        });
    }

    closeConcavePopup = () => {
        this.setState({
            isOpenConcave: false
        });
    }

    setValueConcave = (object) => {
        this.setState({
            concave: object
        });
    }

    setFieldsProperty = (object) => {
        this.setState({
            fieldsProperty: object
        });
    }

    onSubmitForm(tabIndex, isVisibleTab) {
        this.setState({
            tabIndex
        }, () => {
            if (isVisibleTab) {
                this.myForm.submit();
            } else {
                setTimeout(() => {
                    this.props.onChangeChildTab(this.state.tabIndex, {isValidSubmitForm: true});
                }, 100);
            }
        });
    }

    render() {
        const { t } = this.props;
        const { fieldsProperty } = this.state;
        const isExtendSendTKTU = !(this.state.selectedData.insertSource.includes("BCCS") && this.state.selectedData.isSendTktu + "" === "1");
        let objectAddOrEdit = {};
        objectAddOrEdit.longitude = this.state.selectedData.longitude || "";
        objectAddOrEdit.latitude = this.state.selectedData.latitude || "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditMobileTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Card>
                        <CustomSticky level={1}>
                            <CardHeader>
                                {t("ttTrouble:ttTrouble.title.mobileInformation")}
                                {/* <div className="card-header-actions card-header-actions-button">
                                    <LaddaButton type="submit"
                                        className="btn btn-primary btn-md mr-1"
                                        loading={this.state.btnAddOrEditLoading}
                                        data-style={ZOOM_OUT}>
                                        <i className="fa fa-save"></i> {t("common:common.button.save")}
                                    </LaddaButton>
                                </div> */}
                            </CardHeader>
                        </CustomSticky>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="4" className={fieldsProperty.deferType && fieldsProperty.deferType.visible ? "" : "class-hidden"}>
                                    <CustomSelectLocal
                                        name={"deferType"}
                                        label={t("ttTrouble:ttTrouble.label.deferType")}
                                        isRequired={fieldsProperty.deferType && fieldsProperty.deferType.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.deferType")}
                                        options={this.state.deferTypeList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueDeferType : d })}
                                        selectValue={this.state.selectValueDeferType}
                                        isDisabled={fieldsProperty.deferType && fieldsProperty.deferType.disable ? true : false}
                                    />
                                </Col>
                                <Col xs="12" sm="4" className={fieldsProperty.estimateTime && fieldsProperty.estimateTime.visible ? "" : "class-hidden"}>
                                    <CustomDatePicker
                                        name={"estimateTime"}
                                        label={t("ttTrouble:ttTrouble.label.estimateTime")}
                                        isRequired={fieldsProperty.estimateTime && fieldsProperty.estimateTime.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.estimateTime")}
                                        selected={this.state.estimateTime}
                                        handleOnChange={this.handleChangeEstimateTime}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={fieldsProperty.estimateTime && fieldsProperty.estimateTime.disable ? true : false}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomSelectLocal
                                        name={"groupSolution"}
                                        label={t("ttTrouble:ttTrouble.label.groupSolution")}
                                        isRequired={fieldsProperty.groupSolution && fieldsProperty.groupSolution.required ? true : false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.groupSolution")}
                                        options={this.state.groupSolutionList}
                                        closeMenuOnSelect={true}
                                        handleItemSelectChange={(d) => this.setState({ selectValueGroupSolution : d })}
                                        selectValue={this.state.selectValueGroupSolution}
                                        isDisabled={fieldsProperty.groupSolution && fieldsProperty.groupSolution.disable ? true : false}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="longitude" label={t("ttTrouble:ttTrouble.label.longitude")} maxLength="9"
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.longitude")} value={this.state.longitude}
                                        onBlur={(e) => this.setState({ longitude: e.target.value })}
                                        required={fieldsProperty.longitude && fieldsProperty.longitude.required ? true : false}
                                        disabled={fieldsProperty.longitude && fieldsProperty.longitude.disable ? true : false}
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.longitude") },
                                                    pattern: {value: '^[+]?[0-9]+([.]([0-9])+)?$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.latitude")},
                                                    min: {value: 102, errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.longitude")},
                                                    max: {value: 114.999999, errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.longitude")},
                                                    maxLength: {value: 9, errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.latitudeMaxLength")} }} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="latitude" label={t("ttTrouble:ttTrouble.label.latitude")} maxLength="9"
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.latitude")} value={this.state.latitude}
                                        onBlur={(e) => this.setState({ latitude: e.target.value })}
                                        required={fieldsProperty.latitude && fieldsProperty.latitude.required ? true : false}
                                        disabled={fieldsProperty.latitude && fieldsProperty.latitude.disable ? true : false}
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.latitude") },
                                                    pattern: {value: '^[+]?[0-9]+([.]([0-9])+)?$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.latitude")},
                                                    min: {value: 7, errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.latitude")},
                                                    max: {value: 23.999999, errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.latitude")},
                                                    maxLength: {value: 9, errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.latitudeMaxLength")} }} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomInputPopup
                                        name={"cellService"}
                                        label={t("ttTrouble:ttTrouble.label.service")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                        value={this.state.cellService.cellCode || ""}
                                        handleRemove={() => this.setState({ cellService: {} })}
                                        handleDoubleClick={this.openCellPopup}
                                        isRequired={false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.service")}
                                        isDisabled={false}
                                    />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomInputPopup
                                        name={"concave"}
                                        label={t("ttTrouble:ttTrouble.label.area")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.doubleClick")}
                                        value={this.state.concave.concavePointCode || ""}
                                        handleRemove={() => this.setState({ concave: {} })}
                                        handleDoubleClick={this.openConcavePopup}
                                        isRequired={false}
                                        messageRequire={t("ttTrouble:ttTrouble.message.required.area")}
                                        isDisabled={false}
                                        isExtend={isExtendSendTKTU}
                                        extendTitle={t("ttTrouble:ttTrouble.label.sendTktu")}
                                        extendIcon={"fa fa-plus"}
                                        extendClick={this.sendTKTU}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </AvForm>
                <TtTroubleEditMobileInfoTabCellPopup
                    parentState={this.state}
                    closePopup={this.closeCellPopup}
                    setValue={this.setValueCell} />
                <TtTroubleEditMobileInfoTabConcavePopup
                    parentState={this.state}
                    closePopup={this.closeConcavePopup}
                    setValue={this.setValueConcave} />
            </div>
        );
    }
}

TtTroubleEditMobileIncidentInfoTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func,
    onChangeChildInfoTab: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditMobileIncidentInfoTab));