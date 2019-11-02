import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Row, Col } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { buildDataCbo } from './CrManagementUtils';
import { CustomSelectLocal, CustomAppSwitch } from '../../../containers/Utils';
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class CrManagementCrInfoTabProcessPopup extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        
        this.state = {
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            fieldsProperty: props.parentState.fieldsProperty,
            backdrop: "static",
            selectValueCrType: {},
            selectValueProcess: {},
            selectValuePriority: {},
            selectValueSubcategory: {},
            selectValueDeviceType: {},
            selectValueImpactSegment: {},
            selectValueRisk: {},
            tracingCRCB: false,
            riskList: [],
            priorityList: [],
            deviceTypeList: [],
            crProcessList: [],
            isVisibleTracingCRCB: false,
            selectValueChildDomain: {},
        };
    }

    componentDidMount() {
        this.props.actions.getListSubcategoryCBB();
        this.props.actions.getListImpactSegmentCBB();
        if (this.state.modalName !== "ADD") {
            this.setState({
                selectValuePriority: this.state.selectedData.priority ? {value: this.state.selectedData.priority} : {},
                tracingCRCB: this.state.selectedData.isTracingCr === "0" ? false : true,
                selectValueChildDomain: this.state.selectedData.childImpactSegment ? {value: this.state.selectedData.childImpactSegment} : {},
            }, () => {
                this.handleChangeCrType(this.state.selectedData.crType ? {value: this.state.selectedData.crType} : {});
                this.handleChangeDeviceType(this.state.selectedData.deviceType ? {value: this.state.selectedData.deviceType} : {});
                this.handleChangeImpactSegment(this.state.selectedData.impactSegment ? {value: this.state.selectedData.impactSegment, code: this.state.selectedData.crNumber.split("_")[2]} : {});
                this.handleChangeSubcategory(this.state.selectedData.subcategory ? {value: this.state.selectedData.subcategory} : {});
                this.handleChangeRisk(this.state.selectedData.risk ? {value: this.state.selectedData.risk} : {});
                this.handleChangeProcess(this.state.selectedData.processTypeId ? {value: this.state.selectedData.processTypeId} : {});
            });
        }
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.props.setValue(this.state);
        this.closePopup();
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormProcessCr");
    }

    closePopup = () => {
        this.props.closePopup();
    }

    handleChangeCrType = (d) => {
        this.setState({
            selectValueCrType: d,
            selectValueRisk: {},
            isVisibleTracingCRCB: false,
            tracingCRCB: false,
            selectValuePriority: {},
            priorityList: []
        }, () => {
            const value = this.state.selectValueCrType.value;
    
            if (value + "" === "1") {
                this.setState({
                    isVisibleTracingCRCB: true
                });
            }
            let riskList = buildDataCbo("RISK");
            if (value + "" === "0") {
                riskList = riskList.filter(item => ["1", "2", "3"].includes(item.itemId));
            }
            if (value + "" === "2") {
                riskList = riskList.filter(item => ["4"].includes(item.itemId));
                this.setState({
                    selectValueRisk: {value: "4"}
                });
            }
            this.setState({
                riskList
            }, () => {
                //Cr chuan bo xu ly su co/xu ly van de
                // const lstCbbSubcategory = (response.crManagement.getSubcategory && response.crManagement.getSubcategory.payload) ? response.crManagement.getSubcategory.payload.data : [];
                // if (value === 2) {
                //     for (let i = lstCbbSubcategory.length - 1; i >= 0; i--) {
                //         const item = lstCbbSubcategory[i];
                //         if (item.valueStr === 9 || item.valueStr === 10 || item.valueStr === 11) {
                //             lstCbbSubcategory.splice(i, 1);
                //         }
                //     }
                // }
                this.loadCrProcess();
                const subcategoryList = (this.props.response.crManagement.getSubcategory && this.props.response.crManagement.getSubcategory.payload) ? this.props.response.crManagement.getSubcategory.payload.data : [];
                const subcategory = subcategoryList.find(item => item.valueStr + "" === this.state.selectValueSubcategory.value + "") || {};
                this.loadCbbPriority(value, subcategory.secondValue || "", null);
        
                //show hide relate
                // this.props.refParent.showHideRelate(value, this.props.parentState.actionRight);
        
                // const relatedCr = this.props.parentState.selectValueRelatedCr.value || "";
                //CR lien ket den Pre-Approve hoac CR EMERGENCY: KHONG can phe duyet
                // if (relatedCr !== "3" && value !== "1") {
                //     this.props.refParent.loadAppDept();
                // }
                // this.changeRisk();
            });
        });
    }

    changeRisk = () => {
        const value = this.state.selectValueRisk.value;
        if (value) {
            this.props.refParent.showApproveDept(value);
        }
    }

    loadCbbPriority = (crType, subcategory, actionCodeL) => {
        this.setState({
            priorityList: []
        }, () => {
            let priorityList = [];
            if (actionCodeL == null) {
                if (crType + "" === "1") {
                    priorityList = buildDataCbo("PRIORITY");
                    priorityList = priorityList.filter(item => item.itemId + "" === "3");
                    this.setState({
                        selectValuePriority: {value: "3"}
                    });
                } else {
                    if (["BUSINESS_REQUIREMENT", "INCIDENT_RESOLUTION", "PROBLEM_RESOLUTION"].includes(subcategory.toUpperCase())) {
                        priorityList = buildDataCbo("PRIORITY");
                        priorityList = priorityList.filter(item => item.itemId + "" === "0");
                        this.setState({
                            selectValuePriority: {value: "0"}
                        });
                    } else {
                        priorityList = buildDataCbo("PRIORITY");
                        priorityList = priorityList.filter(item => ["1", "2"].includes(item.itemId));
                    }
                }
            } else {
                if (actionCodeL === "22") {
                    priorityList = buildDataCbo("PRIORITY");
                } else if (actionCodeL === "34") {
                    priorityList = buildDataCbo("PRIORITY");
                    priorityList = priorityList.filter(item => ["0", "1", "2"].includes(item.itemId));
                }
            }
            this.setState({
                priorityList
            });
        });
    }

    handleChangeImpactSegment = (d) => {
        this.setState({
            selectValueImpactSegment: d
        }, () => {
            this.loadCbbDeviceType(d);
            this.loadCbbChildImpactSegment(d);
            this.loadCrProcess();
        });
    }

    handleChangeRisk = (d) => {
        this.setState({
            selectValueRisk: d
        }, () => {
            // this.props.refParent.handleChangeRisk(d);
            // this.changeRisk();
            this.loadCrProcess();
        });
    }

    loadCbbDeviceType = (d) => {
        this.props.actions.getListDeviceType({impactSegment: d.value}).then(response => {
            this.setState({
                deviceTypeList: response.payload.data || []
            }, () => {
                this.loadCrProcess();
            });
        });
    }

    loadCbbChildImpactSegment = (d) => {
        this.props.actions.getCbbChildArray({parentId: d.value, status: 1});
    }

    loadCrProcess = () => {
        this.setState({
            crProcessList: []
        }, () => {
            const crType = this.state.selectValueCrType.value;
            const risk = this.state.selectValueRisk.value;
            const impactSegment = this.state.selectValueImpactSegment.value;
            const deviceType = this.state.selectValueDeviceType.value;
            const data = {
                crTypeId: crType,
                riskLevel: risk,
                impactSegmentId: impactSegment,
                deviceTypeId: deviceType
            };
            this.props.actions.getListCrProcessCBB(data).then(response => {
                const crProcessList = response.payload.data ? response.payload.data.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue, itemValue: item.clevel}}) : [];
                if (crType !== "2") {
                    if (risk !== "4" || crType === "1") {
                        crProcessList.push({itemId: "0", itemName: this.props.t("crManagement:crManagement.dropdown.crProcess.processSpecial")})
                    }
                }
                this.setState({
                    crProcessList
                }, () => {
                    if (this.state.selectValueProcess.value && !this.state.selectValueProcess.label) {
                        const crProcess = this.state.crProcessList.find(item => item.itemId + "" === this.state.selectValueProcess.value + "") || {};
                        this.setState({
                            selectValueProcess: {value: crProcess.itemId, label: crProcess.itemName, subValue: crProcess.clevel}
                        }, () => {
                            this.props.setValue(this.state);
                        });
                    }
                });
            });
        });
    }

    handleChangeDeviceType = (d) => {
        this.setState({
            selectValueDeviceType: d
        }, () => {
            this.loadCrProcess();
        });
    }

    handleChangeProcess = (d) => {
        this.setState({
            selectValueProcess: d
        }, () => {
            const process = this.state.crProcessList.find(item => item.itemId + "" === d.value + "") || {};
            if (process.itemId && process.itemValue + "" === "2") {
                const data = {
                    parentId: this.state.selectValueProcess.value
                };
                this.props.actions.getListCrProcessCBBLevel3(data);
            }
        });
    }

    handleChangeSubcategory = (d) => {
        this.setState({
            selectValueSubcategory: d,
            selectValuePriority: {},
            priorityList: []
        }, () => {
            const subcategoryList = (this.props.response.crManagement.getSubcategory && this.props.response.crManagement.getSubcategory.payload) ? this.props.response.crManagement.getSubcategory.payload.data : [];
            const subcategory = subcategoryList.find(item => item.valueStr + "" === this.state.selectValueSubcategory.value + "") || {};
            this.loadCbbPriority(this.state.selectValueCrType.value, subcategory.secondValue || "", null);
        });
    }

    render() {
        const { t, response } = this.props;
        const { fieldsProperty } = this.state;
        const subcategoryList = (response.crManagement.getSubcategory && response.crManagement.getSubcategory.payload) ? response.crManagement.getSubcategory.payload.data : [];
        const impactSegmentList = (response.crManagement.getImpactSegment && response.crManagement.getImpactSegment.payload) ? response.crManagement.getImpactSegment.payload.data : [];
        const childArrayList = (response.crManagement.getCbbChildArray && response.crManagement.getCbbChildArray.payload) ? response.crManagement.getCbbChildArray.payload.data : [];
        const crTypeList = buildDataCbo("CR_TYPE");
        const objectAddOrEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupProcessCr} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <AvForm id="idFormProcessCr" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <ModalHeader toggle={this.closePopup}>
                        {t("crManagement:crManagement.label.crProcess")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"crType"}
                                    label={t("crManagement:crManagement.label.crType")}
                                    isRequired={fieldsProperty.crType.required}
                                    messageRequire={t("crManagement:crManagement.message.required.crType")}
                                    options={crTypeList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeCrType}
                                    selectValue={this.state.selectValueCrType}
                                    isDisabled={fieldsProperty.crType.disable}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"risk"}
                                    label={t("crManagement:crManagement.label.risk")}
                                    isRequired={fieldsProperty.risk.required}
                                    messageRequire={t("crManagement:crManagement.message.required.risk")}
                                    options={this.state.riskList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeRisk}
                                    selectValue={this.state.selectValueRisk}
                                    isDisabled={fieldsProperty.risk.disable}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                            {
                                this.state.isVisibleTracingCRCB ?
                                <CustomAppSwitch
                                    name={"tracingCRCB"}
                                    label={t("crManagement:crManagement.label.isTracingCr")}
                                    checked={this.state.tracingCRCB}
                                    handleChange={(checked) => this.setState({ tracingCRCB: checked })}
                                /> : null
                            }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"impactSegment"}
                                    label={t("crManagement:crManagement.label.domain")}
                                    isRequired={fieldsProperty.impactSegment.required}
                                    messageRequire={t("crManagement:crManagement.message.required.domain")}
                                    options={impactSegmentList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeImpactSegment}
                                    selectValue={this.state.selectValueImpactSegment}
                                    isDisabled={fieldsProperty.impactSegment.disable}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"deviceType"}
                                    label={t("crManagement:crManagement.label.deviceType")}
                                    isRequired={fieldsProperty.deviceType.required}
                                    messageRequire={t("crManagement:crManagement.message.required.deviceType")}
                                    options={this.state.deviceTypeList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeDeviceType}
                                    selectValue={this.state.selectValueDeviceType}
                                    isDisabled={fieldsProperty.deviceType.disable}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"childDomain"}
                                    label={t("crManagement:crManagement.label.childDomain")}
                                    isRequired={fieldsProperty.childImpactSegment.required}
                                    options={childArrayList.map(item => {return {itemId: item.childrenId, itemName: item.childrenName}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueChildDomain: d })}
                                    selectValue={this.state.selectValueChildDomain}
                                    isDisabled={fieldsProperty.childImpactSegment.disable}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"subcategory"}
                                    label={t("crManagement:crManagement.label.subcategory")}
                                    isRequired={fieldsProperty.subCategory.required}
                                    messageRequire={t("crManagement:crManagement.message.required.subcategory")}
                                    options={subcategoryList.map(item => {return {itemId: item.valueStr, itemName: item.displayStr, itemCode: item.secondValue}})}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeSubcategory}
                                    selectValue={this.state.selectValueSubcategory}
                                    isDisabled={fieldsProperty.subCategory.disable}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"priority"}
                                    label={t("crManagement:crManagement.label.priority")}
                                    isRequired={fieldsProperty.priority.required}
                                    messageRequire={t("crManagement:crManagement.message.required.priority")}
                                    options={this.state.priorityList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValuePriority: d })}
                                    selectValue={this.state.selectValuePriority}
                                    isDisabled={fieldsProperty.priority.disable}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"process"}
                                    label={t("crManagement:crManagement.label.process")}
                                    isRequired={fieldsProperty.crProcess.required}
                                    messageRequire={t("crManagement:crManagement.message.required.process")}
                                    options={this.state.crProcessList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleChangeProcess}
                                    selectValue={this.state.selectValueProcess}
                                    isDisabled={fieldsProperty.crProcess.disable}
                                />
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary" className="ml-auto"><i className="fa fa-save"></i> {t("common:common.button.save")}</Button>
                        <Button type="button" color="secondary" onClick={this.closePopup} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        );
    }
}

CrManagementCrInfoTabProcessPopup.propTypes = {
    closePopup: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    setValue: PropTypes.func.isRequired,
    refParent: PropTypes.any
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCrInfoTabProcessPopup));