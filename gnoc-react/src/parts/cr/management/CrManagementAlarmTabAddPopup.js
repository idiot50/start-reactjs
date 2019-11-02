import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';
import { invalidSubmitForm } from '../../../containers/Utils/Utils';

class CrManagementAlarmTabAddPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            dataChecked: [],
            selectValueFaultField: {},
            selectValueFaultGroupName: {},
            selectValueNation: {},
            faultSrcList: [],
            groupFaultSrcList: [],
            nationList: []
        };
    }

    componentDidMount() {
        this.props.actions.getListItemByCategory("GNOC_COUNTRY", null).then((response) => {
            const nationList = response.payload.data && response.payload.data.map(value => ({ itemId: value.itemCode, itemName: value.itemName }))
            this.setState({
                nationList: nationList ? nationList : []
            });
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.alarmName" />,
                id: "faultName",
                minWidth: 150,
                accessor: d => d.faultName ? <span title={d.faultName}>{d.faultName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.alarmField" />,
                id: "faultSrc",
                minWidth: 150,
                accessor: d => d.faultSrc ? <span title={d.faultSrc}>{d.faultSrc}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.alarmGroupName" />,
                id: "faultGroupName",
                minWidth: 150,
                accessor: d => d.faultGroupName ? <span title={d.faultGroupName}>{d.faultGroupName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.keyword" />,
                id: "keyword",
                minWidth: 150,
                accessor: d => d.keyword ? <span title={d.keyword}>{d.keyword}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.deviceType" />,
                id: "deviceTypeCode",
                minWidth: 150,
                accessor: d =>  d.deviceTypeCode ? <span title={d.deviceTypeCode}>{d.deviceTypeCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.vendorCodeAlarm" />,
                id: "vendorCode",
                minWidth: 150,
                accessor: d => d.vendorCode ? <span title={d.vendorCode}>{d.vendorCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.moduleCodeAlarm" />,
                id: "moduleCode",
                minWidth: 150,
                accessor: d => d.moduleCode ? <span title={d.moduleCode}>{d.moduleCode}</span> : <span>&nbsp;</span>
            }
        ];
    }

    onFetchData = (state, instance) => {
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
            this.getListAlarm();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.faultName = objectSearch.faultName ? objectSearch.faultName.trim() : "";
        objectSearch.faultSrc = this.state.selectValueFaultField.value ? this.state.selectValueFaultField.value : "";
        objectSearch.faultGroupId = this.state.selectValueFaultGroupName.value ? this.state.selectValueFaultGroupName.value : "";
        objectSearch.nationCode = this.state.selectValueNation.value ? this.state.selectValueNation.value : "";
        objectSearch.page = 1;
        if (objectSearch.faultSrc !== "" && objectSearch.nationCode !== "") {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.getListAlarm();
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.searchCondition"));
        }
    }

    getListAlarm = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.faultName = objectSearch.faultName ? objectSearch.faultName.trim() : "";
        objectSearch.faultSrc = this.state.selectValueFaultField.value ? this.state.selectValueFaultField.value : "";
        objectSearch.faultGroupId = this.state.selectValueFaultGroupName.value ? this.state.selectValueFaultGroupName.value : "";
        objectSearch.nationCode = this.state.selectValueNation.value ? this.state.selectValueNation.value : "";
        if (objectSearch.faultSrc !== "" && objectSearch.nationCode !== "") {
            this.props.actions.searchAlarmList(objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data ? response.payload.data.data : [],
                    pages: response.payload.data.pages,
                    loading: false,
                    btnSearchLoading: false
                });
            }).catch((response) => {
                this.setState({
                    loading: false,
                    btnSearchLoading: false
                });
                toastr.error(this.props.t("crManagement:crManagement.message.error.getNetworkNode"));
            });
        } else {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
        }
    }

    closePopup = () => {
        this.setState({
            objectSearch: {},
            dataChecked: [],
            data: [],
            pages: null
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    setValue = (dataChecked) => {
        if (dataChecked.length > 0) {
            this.props.setValue(dataChecked);
            this.closePopup();
        }
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearchAlarm");
    }

    handleItemSelectChangeNation = (option) => {
        this.setState({ selectValueNation: option });
        if (option.value) {
            this.props.actions.getListFaultSrc(option.value).then((response) => {
                const faultSrcList = response.payload.data && response.payload.data.map(value => ({ itemId: value, itemName: value }))
                this.setState({
                    faultSrcList: faultSrcList ? faultSrcList : []
                });
            });
        } else {
            this.setState({
                faultSrcList: [],
                selectValueFaultField: {}
            });
        }
    }

    handleItemSelectChangeFaultField = (option) => {
        this.setState({ selectValueFaultField: option });
        if (option.value && this.state.selectValueNation.value) {
            this.props.actions.getListGroupFaultSrc(option.value, this.state.selectValueNation.value).then((response) => {
                const groupFaultSrcList = response.payload.data && response.payload.data.map(i => ({ itemId: i.fault_group_id, itemName: i.fault_group_name }))
                this.setState({
                    groupFaultSrcList
                });
            });
        } else {
            this.setState({
                groupFaultSrcList: [],
                selectValueFaultGroupName: {}
            });
        }
    }

    handleItemSelectChangeFaultGroupName = (option) => {
        this.setState({ selectValueFaultGroupName: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, faultSrcList, groupFaultSrcList, nationList } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenAddAlarmPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.alarmList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchAlarm" onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="3">
                                <CustomAvField name="faultName" label={this.props.t("crManagement:crManagement.label.alarmName")}
                                placeholder={this.props.t("crManagement:crManagement.placeholder.alarmName")} />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomSelectLocal
                                    name={"nationCode"}
                                    label={t("crManagement:crManagement.label.nation")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.nation")}
                                    options={nationList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleItemSelectChangeNation}
                                    selectValue={this.state.selectValueNation}
                                />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomSelectLocal
                                    name={"faultSrc"}
                                    label={t("crManagement:crManagement.label.alarmField")}
                                    isRequired={true}
                                    messageRequire={t("crManagement:crManagement.message.required.alarmField")}
                                    options={faultSrcList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleItemSelectChangeFaultField}
                                    selectValue={this.state.selectValueFaultField}
                                />
                            </Col>
                            <Col xs="12" sm="3">
                                <CustomSelectLocal
                                    name={"groupFaultSrc"}
                                    label={t("crManagement:crManagement.label.alarmGroupName")}
                                    isRequired={false}
                                    options={groupFaultSrcList}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={this.handleItemSelectChangeFaultGroupName}
                                    selectValue={this.state.selectValueFaultGroupName}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" style={{ textAlign: 'center' }}>
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-search"></i> {t("common:common.title.search")}
                                </LaddaButton>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("crManagement:crManagement.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={[]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                    // isChooseOneCheckbox={true}
                                    // handleChooseOneCheckbox={() => {toastr.warning(this.props.t("crManagement:crManagement.message.required.onlyOneRecord"));}}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.setValue(this.state.dataChecked)}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" onClick={this.closePopup} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

CrManagementAlarmTabAddPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, CrManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementAlarmTabAddPopup));