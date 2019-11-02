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


class UtilityCrAlarmSettingPopupAlarmSearch extends Component {
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
            dataChecked: [],
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            btnAddOrEditLoading: false,
            //select
            selectValueNation: {},
            selectValueFaultField: {},
            selectValueFaultGroupName: {},
            isFirstLoad: true,
            faultList: [],
            groupFaultList: []
        };
    }

    componentWillMount() {

    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.selectedData) {
            this.setState({
                selectedData: nextProps.parentState.selectedData,
            })
            
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.faultName" />,
                id: "faultName",
                accessor: d => d.faultName ? <span title={d.faultName}>{d.faultName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.alarmField" />,
                id: "faultSrc",
                accessor: d => d.faultSrc ? <span title={d.faultSrc}>{d.faultSrc}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.faultGroupName" />,
                id: "faultGroupName",
                accessor: d => d.faultGroupName ? <span title={d.faultGroupName}>{d.faultGroupName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.vendorCode" />,
                id: "vendorCode",
                accessor: d => d.vendorCode ? <span title={d.vendorCode}>{d.vendorCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.moduleCode" />,
                id: "moduleCode",
                accessor: d => d.moduleCode ? <span title={d.moduleCode}>{d.moduleCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.keyword" />,
                id: "keyword",
                accessor: d => d.keyword ? <span title={d.keyword}>{d.keyword}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="utilityCrAlarmSetting:utilityCrAlarmSetting.label.deviceTypeCode" />,
                id: "deviceTypeCode",
                accessor: d => d.deviceTypeCode ? <span title={d.deviceTypeCode}>{d.deviceTypeCode}</span> : <span>&nbsp;</span>
            },
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
            if (this.state.isFirstLoad) {
                this.setState({
                    loading: false
                })
            } else {
                this.getListSearch();
            }
        });
    }

    search(event, error, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.faultGroupId = this.state.selectValueFaultGroupName ? this.state.selectValueFaultGroupName.value : {};
        objectSearch.faultSrc = this.state.selectValueFaultField ? this.state.selectValueFaultField.value : {};
        objectSearch.nationCode = 'NOC';
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch,
            isFirstLoad: false
        }, () => {
            this.customReactTable.resetPage();
            this.getListSearch(true);
        });
    }

    getListSearch(isSearchClicked = false) {
        this.props.actions.getListAlarmSetting(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.error.searchAlarmList"));
            this.setState({ btnSearchLoading: false });
        });
    }

    closePopup = () => {
        this.setState({
            objectSearch: {},
            btnSearchLoading: false,
            isFirstLoad: true
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    add = (dataChecked) => {
        if (dataChecked.length > 0) {
            this.props.addAlarm(dataChecked);
            this.closePopup();
        } else {
            toastr.warning(this.props.t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredCheckAlarm"));
        }
    }

    handleItemSelectChangeFaultField = (option) => {
        this.setState({ selectValueFaultField: option });
        if (option.value) {
            this.props.actions.getListGroupFaultSrc(option.value, "NOC").then((response) => {
                const groupFaultList = response.payload.data && response.payload.data.map(i => ({ itemId: i.fault_group_id, itemName: i.fault_group_name }))
                this.setState({
                    groupFaultList
                });
            });
        } else {
            this.setState({
                groupFaultList: [],
                selectValueFaultGroupName: {}
            });
        }
    }

    handleItemSelectChangeFaultGroupName = (option) => {
        this.setState({ selectValueFaultGroupName: option });
    }
    handleItemSelectChangeNation = (option) => {
        this.setState({ selectValueNation: option });
        if (option.value) {
            this.props.actions.getListFaultSrc(option.code).then((response) => {
                const faultList = response.payload.data ? response.payload.data.map(i => ({ itemId: i, itemName: i })) : []
                this.setState({
                    faultList
                })
            })
        } else {
            this.setState({
                faultList: [],
                selectValueFaultField: {}
            })
        }
    }
    render() {
        console.log(this.state.selectedData);
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupAlarm} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("utilityCrAlarmSetting:utilityCrAlarmSetting.title.listAlarm")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="4">
                                        <CustomSelectLocal
                                            name={"nation"}
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.nation")}
                                            isRequired={true}
                                            messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredNation")}
                                            options={this.state.selectedData ? this.state.selectedData.countryList : []}
                                            closeMenuOnSelect={true}
                                            handleItemSelectChange={this.handleItemSelectChangeNation}
                                            selectValue={this.state.selectValueNation}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomSelectLocal
                                            name={"faultSrc"}
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.alarmField")}
                                            isRequired={true}
                                            messageRequire={t("utilityCrAlarmSetting:utilityCrAlarmSetting.message.requiredAlarmField")}
                                            options={this.state.faultList}
                                            closeMenuOnSelect={true}
                                            handleItemSelectChange={this.handleItemSelectChangeFaultField}
                                            selectValue={this.state.selectValueFaultField}
                                        />
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <CustomSelectLocal
                                            name={"froupFaultList"}
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.alarmGroupName")}
                                            isRequired={false}
                                            options={this.state.groupFaultList}
                                            closeMenuOnSelect={true}
                                            handleItemSelectChange={this.handleItemSelectChangeFaultGroupName}
                                            selectValue={this.state.selectValueFaultGroupName}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="5">
                                        <CustomAvField
                                            name="faultName"
                                            label={t("utilityCrAlarmSetting:utilityCrAlarmSetting.label.faultName")}
                                            placeholder={t("utilityCrAlarmSetting:utilityCrAlarmSetting.placeholder.faultName")}
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
                                defaultPageSize={10}
                                isCheckbox={true}
                                propsCheckbox={["faultId", "faultName", "faultSrc", "faultGroupName", "vendorCode","vendorName", "moduleCode","moduleName", "keyword", "deviceTypeCode","deviceTypeId","crAlarmSettingId","faultLevelCode","crImpactSegmentId","faultGroupId","faultLevelId","lstModule","lstVendor","serviceCode"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" onClick={() => this.add(this.state.dataChecked)} className="ml-auto"><i className="fa fa-check"></i> {t("utilityCrAlarmSetting:utilityCrAlarmSetting.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal >
        );
    }
}

UtilityCrAlarmSettingPopupAlarmSearch.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrAlarmSettingPopupAlarmSearch));