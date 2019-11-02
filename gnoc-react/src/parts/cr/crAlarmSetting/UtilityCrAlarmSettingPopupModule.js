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
import CustomReactTableLocal from "../../../containers/Utils/CustomReactTableLocal";

class UtilityCrAlarmSettingPopupModule extends Component {
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
            selectValueNation: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.selectedData) {
            this.setState({
                selectedData: nextProps.parentState,
                data2: nextProps.parentState.selectedData.lstModule ? nextProps.parentState.selectedData.lstModule : []
            })
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.applicationCode" />,
                id: "applicationCode",
                accessor: d => <span title={d.applicationCode}>{d.applicationCode}</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.moduleCode" />,
                id: "moduleCode",
                accessor: d => <span title={d.moduleCode}>{d.moduleCode}</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.moduleName" />,
                id: "moduleName",
                accessor: d => <span title={d.moduleName}>{d.moduleName}</span>
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

    updateModule = () => {
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.data2.length < 1) {
                toastr.warning(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredModule"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }

            let objectSend = Object.assign({}, this.state.selectedData);
            objectSend.lstAlarm = [
                {
                    lstModule: [...this.state.data2],
                    lstVendor: objectSend.lstVendor,
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
            this.props.actions.editUtilityCrAlarmSetting(objectSend).then((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.closePopup();
                        toastr.success(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.success.updateModule"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.updateModule"));
                    }
                });
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.updateModule"));
                });
            });
        })
    }

    removeModule = dataChecked2 => {
        if (dataChecked2.length < 1) {
            toastr.warning(this.props.t("common:common.message.message.requiredModule"));
        }
        let listTemp = [...this.state.data2];
        dataChecked2.forEach(element => {
            listTemp = listTemp.filter(el => el.moduleCode !== element.moduleCode);
        });
        this.setState({
            data2: listTemp
        });
    }

    search(event, error, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        objectSearch.pageSize = 10;
        objectSearch.sortName = null;
        objectSearch.sortType = null;
        objectSearch.nationCode = this.state.selectValueNation ? this.state.selectValueNation.value : null; 
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
        this.props.actions.getModuleList(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchModule"));
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
    addModule(dataChecked1) {
        if (dataChecked1.length > 0) {
            const checkedTemp = [...dataChecked1];
            checkedTemp.forEach(element => {
                if (this.state.data2.some(el => el.moduleCode === element.moduleCode)) {
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
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredModule"));
        }
    }

    handleItemSelectChangeNation = (option) => {
        this.setState({ selectValueNation: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch, data2, columns2, loading2 } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupModule} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.addModule")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="3">
                                        <CustomAvField
                                            name="serviceCode"
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.applicationCode")}
                                            placeholder={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.applicationCode")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="3">
                                        <CustomAvField
                                            name="moduleCode"
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.moduleCode")}
                                            placeholder={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.moduleCode")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="3">
                                        <CustomSelectLocal
                                            name={"nation"}
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.nation")}
                                            isRequired={true}
                                            messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredNation")}
                                            options={this.state.selectedData ? this.state.selectedData.nationList : []}
                                            closeMenuOnSelect={true}
                                            handleItemSelectChange={this.handleItemSelectChangeNation}
                                            selectValue={this.state.selectValueNation}
                                        />
                                    </Col>
                                    <Col xs="12" sm="3">
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
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="text-center mt-2">
                            <Button type="button" color="primary" disabled={this.state.dataChecked1.length < 1} className="ml-auto" onClick={() => this.addModule(this.state.dataChecked1)}><i className="fa fa-plus"></i> {t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.add")}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <Label>{t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.listModule")}</Label>
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
                    <Button type="button" color="primary" disabled={this.state.data2.length < 1} onClick={() => this.updateModule()} className="ml-auto"><i className="fa fa-check"></i> {t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={() => this.removeModule(this.state.dataChecked2)}><i className="fa fa-times-circle"></i> {t("common:common.button.delete")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

UtilityCrAlarmSettingPopupModule.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrAlarmSettingPopupModule));