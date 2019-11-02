import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomAppSwitch, CustomAvField, CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomInputFilter } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityCrAlarmSettingActions from './UtilityCrAlarmSettingActions';
import UtilityCrAlarmSettingPopupAlarmSearch from './UtilityCrAlarmSettingPopupAlarmSearch';
import UtilityCrAlarmSettingPopupVendor from "./UtilityCrAlarmSettingPopupVendor";
import UtilityCrAlarmSettingPopupModule from './UtilityCrAlarmSettingPopupModule';

class UtilityCrAlarmSettingAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleAlarmList = this.toggleAlarmList.bind(this);
        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.toggleTableSearch = this.toggleTableSearch.bind(this);
        this.handleChangeIsAutoLoad = this.handleChangeIsAutoLoad.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeDomain = this.handleItemSelectChangeDomain.bind(this);
        this.handleItemSelectChangeProcess = this.handleItemSelectChangeProcess.bind(this);
        this.handleItemSelectChangeDeviceType = this.handleItemSelectChangeDeviceType.bind(this);
        this.handleItemSelectChangeAlarmGroupName = this.handleItemSelectChangeAlarmGroupName.bind(this);

        this.state = {
            isAutoLoad: false,
            btnAddOrEditLoading: false,
            btnSearchLoading: false,
            collapseFormAddEdit: true,
            collapseTableSearch: true,
            collapseAlarmList: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            selectValueOdGroupTypeId: {},
            statusListSelect: [
                { itemId: 1, itemName: props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.dropdown.status.active") },
                { itemId: 0, itemName: props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.dropdown.status.inActive") }
            ],
            selectValueDomain: {},
            selectValueDeviceType: {},
            selectValueProcess: {},
            selectValueAlarmGroupName: {},
            //column
            data: props.parentState.selectedData.lstAlarm ? props.parentState.selectedData.lstAlarm : [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            impactSegmentList: [],
            deviceTypeList: [],
            countryList: [],
            dataChecked: [],
            processList: [],
            listDeleteId: [],
            isUpdateVendor: false,
            isUpdateModule: false,
            isEdit: false
        };
    }

    componentDidMount() {
        this.props.actions.getNationMap().then((response) => {
            this.setState({
                nationList: response.payload.data ? Object.keys(response.payload.data).map((i) => ({ itemId: i, itemName: i })) : []
            })
        })
        this.props.actions.getListImpactSegmentCBB().then((response) => {
            const impactSegmentList = response.payload.data ? response.payload.data.map(i => ({ itemId: i.impactSegmentId, itemName: i.impactSegmentName })) : []
            this.setState({
                impactSegmentList
            })
        })
        this.props.actions.getListCountry('GNOC_COUNTRY', '').then((response) => {
            this.setState({
                countryList: response.payload.data ? response.payload.data : []
            })
        })
        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            if (this.state.isAddOrEdit === "EDIT") { this.setState({ isEdit: true }) }
            this.setState({
                selectValueDomain: this.state.selectedData.crDomain ? { value: this.state.selectedData.crDomain } : {},
                selectValueDeviceType: this.state.selectedData.deviceType ? { value: this.state.selectedData.deviceType } : {},
                selectValueProcess: this.state.selectedData.crProcessId ? { value: this.state.selectedData.crProcessId } : {},
                isAutoLoad: this.state.selectedData.autoLoad ? true : false
            });
            if (this.state.selectedData && (this.state.selectedData.crDomain || this.state.selectedData.deviceType)) {
                let objProcess = {
                    impactSegmentId: this.state.selectedData.crDomain,
                    deviceTypeId: this.state.selectedData.deviceType
                }
                this.props.actions.getListDeviceType(this.state.selectedData.crDomain).then((response) => {
                    const deviceTypeList = response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : []
                    this.setState({
                        deviceTypeList
                    });
                });
                this.props.actions.getListCrProcessCBB(objProcess).then((response) => {
                    const processList = response.payload.data ? response.payload.data.map(i => ({ itemId: i.valueStr, itemName: i.displayStr })) : []
                    this.setState({
                        processList
                    });
                });
            } else {
                this.setState({
                    deviceTypeList: [],
                    selectValueDeviceType: {},
                    processList: [],
                    selectValueProcess: {}
                });
            }
        }

    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.faultName" />,
                id: "faultName",
                width: 250,
                accessor: d => {
                    return d.faultName ? <span title={d.faultName}>{d.faultName}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.faultGroupName" />,
                id: "faultGroupName",
                width: 200,
                accessor: d => {
                    return d.faultGroupName ? <span title={d.faultGroupName}>{d.faultGroupName}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.vendorCode" />,
                id: "vendorCode",
                width: 200,
                accessor: d => {
                    return d.lstVendor && d.lstVendor.length > 0 ?
                        <span title={this.getListVendor(d).join(",")} style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupVendor(d)}>
                            {this.getListVendor(d).join(",")}
                        </span>
                        : <span style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupVendor(d)}>
                            {this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.updateVendor")}
                        </span>
                }
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.moduleCode" />,
                id: "moduleCode",
                width: 200,
                accessor: d => {
                    return d.moduleCode ?
                        <span title={d.moduleCode} style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupModule()}>
                            {d.moduleCode}
                        </span>
                        : <span style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }}
                            onClick={() => this.openPopupModule()}>
                            {this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.updateModule")}
                        </span>
                }
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.createUser" />,
                id: "createUser",
                width: 200,
                accessor: d => {
                    return d.createUser ? <span title={d.createUser}>{d.createUser}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.keyword" />,
                id: "keyword",
                width: 200,
                accessor: d => {
                    return d.keyword ? <span title={d.keyword}>{d.keyword}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.NOCDevice" />,
                id: "NOCDevice",
                width: 200,
                accessor: d => {
                    return d.deviceTypeCode ? <span title={d.deviceTypeCode}>{d.deviceTypeCode}</span> : <span>&nbsp;</span>
                }
            }
        ];
    }

    getListVendor(d) {
        const listVendor = [];
        if (d.lstVendor && d.lstVendor.length > 0) {
            for (const data of d.lstVendor) {
                if (data.vendorCode) {
                    listVendor.push(data.vendorCode);
                }
            }
        }
        return listVendor;
    }

    getListCopy(arr) {
        for (const e of arr) {
            e.crAlarmSettingId = null
        }
        return arr;
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            const utilityCrAlarmSetting = Object.assign({}, values);
            utilityCrAlarmSetting.crProcessId = this.state.selectValueProcess.value ? this.state.selectValueProcess.value : null
            utilityCrAlarmSetting.autoLoad = this.state.isAutoLoad ? 1 : 0;
            utilityCrAlarmSetting.lstAlarm = this.state.data;
            
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityCrAlarmSetting.lstAlarm = this.getListCopy(utilityCrAlarmSetting.lstAlarm);
                }
                this.props.actions.editUtilityCrAlarmSetting(utilityCrAlarmSetting).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.success.add"));
                        });
                    } else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(response.payload.data.message);
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.add"));
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
                            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityCrAlarmSetting.lstDeleteId = this.state.listDeleteId ? this.state.listDeleteId : [];
                utilityCrAlarmSetting.casId = this.state.selectedData.casId;
                this.props.actions.updateUtilityCrAlarmSetting(utilityCrAlarmSetting).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.success.edit"));
                        });
                    }else if (response.payload.data.key === "DUPLICATE") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(response.payload.data.message);
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.edit"));
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
                            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.edit"));
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

    toggleTableSearch() {
        this.setState({ collapseTableSearch: !this.state.collapseTableSearch });
    }

    toggleAlarmList() {
        this.setState({ collapseAlarmList: !this.state.collapseAlarmList });
    }

    handleItemSelectChangeDeviceType(option) {
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

    handleItemSelectChangeProcess(option) {
        this.setState({ selectValueProcess: option });
    }

    handleItemSelectChangeDomain(option) {
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

    handleItemSelectChangeAlarmGroupName(option) {
        this.setState({ selectValueAlarmGroupName: option });
    }

    handleItemSelectChangeNation(option) {
        this.setState({ selectValueNation: option });
    }

    handleChangeIsAutoLoad(checked) {
        this.setState({ isAutoLoad: checked });
    }

    closePopupAlarm = () => {
        this.setState({
            isOpenPopupAlarm: false,
        });
    }

    openPopupAlarm = () => {
        this.setState({
            isOpenPopupAlarm: true,
            selectedData: this.state
        });
    }

    closePopupVendor = () => {
        this.setState({
            isOpenPopupVendor: false,
        });
    }

    openPopupVendor = (d) => {
        let objectSearch = {
            crAlarmSettingId: d.crAlarmSettingId,
            faultId: d.faultId
        }
        this.props.actions.getDetailUtilityCrAlarmSettingByCasId(objectSearch).then((response) => {
            if (response.payload && response.payload.data) {
                this.setState({
                    isOpenPopupVendor: true,
                    selectedData: response.payload.data,
                    isUpdateVendor: true
                });
            } else {
                toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.getDetail"));
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.getDetail"));
        });
    }

    closePopupModule = () => {
        this.setState({
            isOpenPopupModule: false,
        });
    }

    openPopupModule = (d) => {
        let objectSearch = {
            // crAlarmSettingId: d.casId,
            // faultId: d.faultId
        }
        this.props.actions.getDetailUtilityCrAlarmSettingByCasId(objectSearch).then((response) => {
            if (response.payload && response.payload.data) {
                this.setState({
                    isOpenPopupModule: true,
                    selectedData: response.payload.data
                });
            } else {
                toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchModule"));
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchModule"));
        });
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    addVendor = (dataVendor, faultId) => {
        const { data } = this.state
        for (let i = 0; i < data.length; i++) {
            if (data[i].faultId === faultId) {
                data[i].lstVendor = dataVendor
            }
        }
        this.setState({ data })
    }

    addModule = (dataVendor, faultId) => {
        // const { data } = this.state
        // for (let i = 0; i < data.length; i++) {
        //     if (data[i].faultId === faultId) {
        //         data[i].lstVendor = dataVendor
        //     }
        // }
        // this.setState({ data })
    }

    addAlarm = dataChecked => {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.data.some(el => el.faultId === element.faultId)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            data: [...this.state.data, ...dataChecked]
        });
    }

    getListDeleteId(list) {
        let listDelete = [];
        for (const e of list) {
            if (e.crAlarmSettingId) listDelete.push(e.crAlarmSettingId)
        }
        return listDelete
    }

    removeAlarm = (dataChecked) => {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listDelete = this.getListDeleteId(dataChecked)
        let listTemp = [...this.state.data];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.faultId !== element.faultId);
        });
        this.setState({
            data: listTemp,
            dataChecked: [],
            listDeleteId: [...this.state.listDeleteId, ...listDelete]
        });
    }

    render() {
        console.log(this.state.listDeleteId);
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        const { columns, data, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.utilityCrAlarmSettingAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.utilityCrAlarmSettingEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                disabled={this.state.data.length < 1}
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
                                                        <i className="fa fa-align-justify"></i>{t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.utilityCrAlarmSettingInfo")}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"domain"}
                                                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.domain")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredDomain")}
                                                                    options={this.state.impactSegmentList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeDomain}
                                                                    selectValue={this.state.selectValueDomain}
                                                                //isDisabled={this.state.isEdit}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"deviceType"}
                                                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.deviceType")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredDeviceType")}
                                                                    options={this.state.deviceTypeList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeDeviceType}
                                                                    selectValue={this.state.selectValueDeviceType}
                                                                //isDisabled={this.state.isEdit}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"CRProcessName"}
                                                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.CRProcessName")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredCRProcessName")}
                                                                    options={this.state.processList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeProcess}
                                                                    selectValue={this.state.selectValueProcess}
                                                                //isDisabled={this.state.isEdit}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAppSwitch
                                                                    name={"isAutoLoad"}
                                                                    label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.isAutoLoad")}
                                                                    checked={this.state.isAutoLoad}
                                                                    handleChange={this.handleChangeIsAutoLoad}
                                                                //isDisabled={this.state.isEdit}
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
                                                        <i className="fa fa-list-ul"></i>{t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.alarmList")}
                                                        <div className="card-header-actions card-header-search-actions-button">
                                                            <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                                title={t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.add")}
                                                                onClick={() => this.openPopupAlarm()}><i className="fa fa-plus"></i></Button>
                                                            <Button type="button" color="secondary" className="custom-btn btn-pill mr-2" onClick={() => this.removeAlarm(this.state.dataChecked)}><i className="fa fa-times-circle"></i></Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <CustomReactTableLocal
                                                            columns={columns}
                                                            data={data}
                                                            loading={loading}
                                                            isCheckbox={true}
                                                            propsCheckbox={["faultId", "crAlarmSettingId"]}
                                                            defaultPageSize={10}
                                                            handleDataCheckbox={this.handleDataCheckbox}
                                                        />
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
                <UtilityCrAlarmSettingPopupAlarmSearch
                    parentState={this.state}
                    closePopup={this.closePopupAlarm}
                    addAlarm={this.addAlarm}
                />
                <UtilityCrAlarmSettingPopupVendor
                    parentState={this.state}
                    closePopup={this.closePopupVendor}
                    addVendor={this.addVendor}
                />
                <UtilityCrAlarmSettingPopupModule
                    parentState={this.state}
                    closePopup={this.closePopupModule}
                    addVendor={this.addModule}
                />
            </div>
        );
    }
}

UtilityCrAlarmSettingAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityCrAlarmSetting, common } = state;
    return {
        response: { utilityCrAlarmSetting, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrAlarmSettingActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrAlarmSettingAddEdit));