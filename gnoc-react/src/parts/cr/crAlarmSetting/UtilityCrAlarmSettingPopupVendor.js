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
import { CustomAvField } from '../../../containers/Utils';
import CustomReactTableLocal from "../../../containers/Utils/CustomReactTableLocal";

class UtilityCrAlarmSettingPopupVendor extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);

        this.state = {
            //Table1
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            dataChecked1: [],
            //Table2
            data2: [],
            pages2: null,
            loading2: false,
            columns2: this.buildTableColumns(),
            dataChecked2: [],
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            btnAddOrEditLoading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.selectedData) {
            this.setState({
                selectedData: nextProps.parentState,
                data2: nextProps.parentState.selectedData.lstVendor ? nextProps.parentState.selectedData.lstVendor : [],

            })
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.vendorCode" />,
                id: "vendorCode",
                accessor: d => <span title={d.vendorCode}>{d.vendorCode}</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.vendorName" />,
                id: "vendorName",
                accessor: d => <span title={d.vendorName}>{d.vendorName}</span>
            }
        ];
    }

    onFetchData(state, instance) {
        let sortName = null;
        let sortType = null;
        if (state.sorted.length > 0) {
            if (state.sorted[0].id !== null && state.sorted[0].id !== undefined) {
                sortName = state.sorted[0].id;
                sortType = state.sorted[0].desc ? "desc" : "asc";
            }
        }

        let values = {
            page: state.page + 1,
            pageSize: state.pageSize,
            sortName: sortName,
            sortType: sortType
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListSearch();
        });
    }

    updateVendor = () => {
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.data2.length < 1) {
                toastr.warning(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredVendor"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }

            let objectSend = Object.assign({}, this.state.selectedData.selectedData);
            objectSend.lstAlarm = [
                {
                    lstVendor: [...this.state.data2],
                    lstModule: objectSend.lstModule,
                    crProcessId: objectSend.crProcessId,
                    crProcessName: objectSend.crProcessName,
                    createdUser: objectSend.createdUser,
                    deviceTypeId: objectSend.deviceType,
                    deviceTypeCode: objectSend.deviceTypeCode,
                    faultGroupName: objectSend.faultGroupName,
                    faultId: objectSend.faultId,
                    faultLevelCode: objectSend.faultLevelCode,
                    faultName: objectSend.faultName,
                    faultSrc: objectSend.faultSrc,
                    keyword: objectSend.keyword,
                    crAlarmSettingId: objectSend.casId,
                    crImpactSegmentId: objectSend.crDomain,
                    autoLoad: objectSend.autoLoad
                }
            ]
            if (this.state.selectedData.isUpdateVendor) {
                this.props.addVendor(this.state.data2, this.state.selectedData.selectedData.faultId);
                this.closePopup();
            } else {
                this.props.actions.updateVendorOrModuleAlarmSetting(objectSend).then((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.closePopup();
                            toastr.success(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.success.updateVendor"));
                        } else if (response.payload.data.key === "ERROR") {
                            toastr.error(response.payload.data.message);
                        } else {
                            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.updateVendor"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.updateVendor"));
                    });
                });
            }
        })
    }

    removeVendor = dataChecked2 => {
        if (dataChecked2.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.data2];
        dataChecked2.forEach(element => {
            listTemp = listTemp.filter(el => el.vendorCode !== element.vendorCode);
        });
        this.setState({
            data2: listTemp
        });
    }

    getListData(key, lstAlarm, dataVendor) {
        let listAlarmSave = [];
        for (let i = 0; i < lstAlarm.length() - 1; i++) {
            if (i !== key) {
                listAlarmSave[i] = lstAlarm[i]
            } else {
                listAlarmSave[key] = Object.assign({}, this.selectedData)
            }
        }
    }

    search(event, error, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        objectSearch.pageSize = 5;
        objectSearch.sortName = null;
        objectSearch.sortType = null;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch,
            isSearchSupport: false
        }, () => {
            this.customReactTable.resetPage();
            this.getListSearch(true);
        });
    }

    getListSearch(isSearchClicked = false) {
        this.props.actions.getVendorList(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchVendor"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {},
            btnSearchLoading: false
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked1: data
        });
    }

    handleDataCheckbox2 = (data) => {
        this.setState({
            dataChecked2: data
        });
    }
    addVendor(dataChecked1) {
        if (dataChecked1.length > 0) {
            const checkedTemp = [...dataChecked1];
            checkedTemp.forEach(element => {
                if (this.state.data2.some(el => el.vendorCode === element.vendorCode)) {
                    dataChecked1.splice(dataChecked1.indexOf(element), 1);
                }
            });
            this.setState({
                objectSearch: {},
                data2: [...this.state.data2, ...dataChecked1],
                dataChecked1: []
            });
            this.customReactTable.clearChecked();
        } else {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredVendor"));
        }
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch, data2, columns2, loading2 } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupVendor} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.addVendor")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomAvField
                                            name="vendorCode"
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.vendorCode")}
                                            placeholder={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.vendorCode")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomAvField
                                            name="vendorName"
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.vendorName")}
                                            placeholder={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.vendorName")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <Row className="mb-2">
                                            <Col xs="12"><Label></Label></Col>
                                        </Row>
                                        <Row>
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnSearchLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-search"></i> <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.button.search" />
                                            </LaddaButton>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AvForm>
                    <Row>
                        <Col xs="12">
                            <Label>{t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.searchResults")}</Label>
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.onFetchData}
                                defaultPageSize={5}
                                isCheckbox={true}
                                propsCheckbox={["vendorId", "vendorCode", "vendorName"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                                showPagination={true}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="text-center mt-2">
                            <Button type="button" color="primary" disabled={this.state.dataChecked1.length < 1} className="ml-auto" onClick={() => this.addVendor(this.state.dataChecked1)}><i className="fa fa-plus"></i> {t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.add")}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <Label>{t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.listVendor")}</Label>
                            <CustomReactTableLocal
                                columns={columns2}
                                data={data2}
                                loading={loading2}
                                isCheckbox={true}
                                propsCheckbox={["vendorCode"]}
                                defaultPageSize={5}
                                handleDataCheckbox={this.handleDataCheckbox2}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.data2.length < 1} onClick={() => this.updateVendor()} className="ml-auto"><i className="fa fa-check"></i> {t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" disabled={this.state.dataChecked2.length < 1} onClick={() => this.removeVendor(this.state.dataChecked2)}><i className="fa fa-times-circle"></i> {t("common:common.button.delete")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

UtilityCrAlarmSettingPopupVendor.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrAlarmSettingPopupVendor));