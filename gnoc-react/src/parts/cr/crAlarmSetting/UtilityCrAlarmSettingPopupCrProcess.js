import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityCrAlarmSettingActions from './UtilityCrAlarmSettingActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import { validSubmitForm, invalidSubmitForm } from '../../../containers/Utils/Utils';

class UtilityCrAlarmSettingPopupCrProcess extends Component {
    constructor(props) {
        super(props);
        this.closePopup = this.closePopup.bind(this);

        this.state = {
            //Table1
            data: [],
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            btnAddOrEditLoading: false,
            impactSegmentList: [],
            deviceTypeList: [],
            processList: [],
            selectValueDomain: {},
            selectValueDeviceType: {},
            selectValueProcess: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.selectedData) {
            this.setState({
                selectedData: nextProps.parentState
            })
        }
    }

    closePopup() {
        this.setState({
            objectSearch: {},
            btnSearchLoading: false
        });
        this.props.closePopup();
    }

    saveValue = () => {
        this.props.setValue(this.state);
        this.closePopup();
    }
    handleValidSubmitAddOrEdit = (event, values) => {
        validSubmitForm(event, values, "idFormAddChecklistPopup");
        const objSearch = Object.assign({}, values);
        objSearch.impactSegmentId = this.state.selectValueDomain ? this.state.selectValueDomain.value : null
        objSearch.deviceTypeId = this.state.selectValueDeviceType ? this.state.selectValueDeviceType.value : null
        this.props.actions.getListCrProcessCBB(objSearch).then((response) => {
            const processList = response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : []
            this.setState({
                processList
            });
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.search"));
        });


    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddChecklistPopup");
    }

    handleItemSelectChangeDeviceType = (option) => {
        this.setState({ selectValueDeviceType: option });
        if (option.value) {
            let obj = {
                impactSegmentId: this.state.selectValueDomain.value,
                deviceTypeId: option.value
            }
            this.props.actions.getListCrProcessCBB(obj).then((response) => {
                const processList = response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : []
                this.setState({
                    processList
                });
            });
        } else {
            this.setState({
                processList: [],
                selectValueProcess: {}
            });
        }
    }

    handleItemSelectChangeProcess = (option) => {
        this.setState({ selectValueProcess: option });
    }

    handleItemSelectChangeDomain = (option) => {
        this.setState({ selectValueDomain: option });
        if (option.value) {
            this.props.actions.getListDeviceType(option.value).then((response) => {
                const deviceTypeList = response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : []
                this.setState({
                    deviceTypeList
                });
            });
        } else {
            this.setState({
                deviceTypeList: [],
                selectValueDeviceType: {}
            });
        }
    }

    render() {
        console.log(this.state);
        const { t } = this.props;
        const objectAddOrEdit = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupCrProcess} className={'modal-primary modal-md ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.searchProcess")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormAddChecklistPopup" onValidSubmit={(event, error ,values) => this.handleValidSubmitAddOrEdit(event, error ,values)} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"domain"}
                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.domain")}
                                    isRequired={true}
                                    messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredDomain")}
                                    options={this.props.parentState ? this.props.parentState.impactSegmentList : []}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleItemSelectChangeDomain}
                                    selectValue={this.state.selectValueDomain}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomSelectLocal
                                    name={"deviceType"}
                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.deviceType")}
                                    isRequired={true}
                                    messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredDeviceType")}
                                    options={this.state.deviceTypeList ? this.state.deviceTypeList : []}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleItemSelectChangeDeviceType}
                                    selectValue={this.state.selectValueDeviceType}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField
                                    name={"crProcessName"} maxLength="1024"
                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.crProcessName")}
                                    placeholder={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.crProcessName")}
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomAvField
                                    name={"crProcessCode"} maxLength="1024"
                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.crProcessCode")}
                                    placeholder={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.crProcessCode")}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" className="text-center mt-2">
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-search"></i> <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.button.search" />
                                </LaddaButton>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <CustomSelectLocal
                                    name={"CRProcessName"}
                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.CRProcessName")}
                                    messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredCRProcessName")}
                                    options={this.state.processList ? this.state.processList : []}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleItemSelectChangeProcess}
                                    selectValue={this.state.selectValueProcess}
                                    isRequired={false}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" color="primary" className="ml-auto mr-1" onClick={() => this.saveValue()} ><i className="fa fa-save"></i> {t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={() => this.closePopup()}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

UtilityCrAlarmSettingPopupCrProcess.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityCrAlarmSetting, common } = state;
    return {
        response: { utilityCrAlarmSetting, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, UtilityCrAlarmSettingActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrAlarmSettingPopupCrProcess));