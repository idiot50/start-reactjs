import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as CrManagementActions from '../../cr/management/CrManagementActions'
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import WoManagementSearchCrPopup from './WoManagementSearchCrPopup';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import { buildDataCbo } from '../../cr/management/CrManagementUtils';
import CrManagementAddEditPopup from '../../cr/management/CrManagementAddEditPopup';

class WoManagementEditCrTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);

        this.state = {
            isOpenPopupSearchCr: false,
            isOpenPopupCrAddEdit: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            isAddOrEdit: null,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            isDisabledButton: true
        };
    }

    componentDidMount() {
        if (JSON.parse(localStorage.user).userID === this.state.selectedData.ftId
            && (this.state.selectedData.status === 3 || this.state.selectedData.status === 4 || this.state.selectedData.status === 5)) {
            this.setState({
                isDisabledButton: false
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.viewDetail" />,
                id: "viewDetail",
                width: 100,
                className: "text-center",
                accessor: d => <Button title={this.props.t("woManagement:woManagement.label.viewDetail")}><i className="fa fa-file-text-o"></i></Button>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.crNumber" />,
                id: "crNumber",
                accessor: d => <span title={d.crNumber}>{d.crNumber}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.crName" />,
                id: "title",
                accessor: d => <span title={d.title}>{d.title}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.state" />,
                id: "state",
                accessor: d => {
                    const state = buildDataCbo("STATE").find(item => item.itemId + "" === d.state + "") || {};
                    return d.state ? <span title={state.itemName}>{state.itemName}</span>
                    : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.changeOrginatorName" />,
                id: "changeOrginatorName",
                accessor: d => <span title={d.changeOrginatorName}>{d.changeOrginatorName}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.earliestStartTime" />,
                id: "earliestStartTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.earliestStartTime)}>{convertDateToDDMMYYYYHHMISS(d.earliestStartTime)}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.latestStartTime" />,
                id: "latestStartTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.latestStartTime)}>{convertDateToDDMMYYYYHHMISS(d.latestStartTime)}</span>
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
            sortName: sortName ? sortName : null,
            sortType: sortType ? sortType : null
        }

        const objectSearch = Object.assign({}, values);
        objectSearch.objectId = this.state.selectedData.woId;
        objectSearch.systemId = 4;
        objectSearch.stepId = null;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListCRFromOtherSystem();
        });
    }

    getListCRFromOtherSystem() {
        this.props.actions.getListCRFromOtherSystem(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("woManagement:woManagement.message.error.getCr"));
        });
    }

    openSearchCrPopup = () => {
        this.setState({
            isOpenPopupSearchCr: true
        });
    }

    closeSearchCrPopup = () => {
        this.setState({
            isOpenPopupSearchCr: false
        });
    }

    setValueSearchCr = (dataChecked) => {
        this.setState({
            data: dataChecked
        });
    }
    
    openCrAddEditPopup = () => {
        this.props.actions.getSequenseCr("cr_seq", 1).then((response) => {
            this.setState({
                isOpenPopupCrAddEdit: true,
                modalName: "ADD",
                selectedDataCr: { crId: response.payload.data[0], actionRight: "1", crCreatedFromOtherSysDTO: {systemId: "4", objectId: this.state.selectedData.woId, stepId: this.state.selectedData.status} },
            });
        });
    }

    closeCrAddEditPopup = () => {
        this.setState({
            isOpenPopupCrAddEdit: false,
            modalName: this.props.parentState.modalName,
            selectedDataCr: {},
        });
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading, isDisabledButton } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    {/* <CustomSticky level={1}> */}
                        <CardHeader>
                            <i className="fa fa-plus-justify"></i>{t("woManagement:woManagement.title.cr")}
                            <div className="card-header-actions card-header-actions-button-table">
                                <Button type="button" color="primary" className="mr-1" onClick={this.openCrAddEditPopup} disabled={isDisabledButton}>
                                    <i className="fa fa-plus-circle"></i> {t("woManagement:woManagement.button.add")}
                                </Button>
                                <Button type="button" color="primary" className="mr-1" onClick={this.openSearchCrPopup} disabled={isDisabledButton}>
                                    <i className="fa fa-search"></i> {t("woManagement:woManagement.button.search")}
                                </Button>
                                <Button type="button" color="secondary" className="mr-1" onClick={() => this.props.closePage('PROCESS')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        </CardHeader>
                    {/* </CustomSticky> */}
                    {/* <CardBody> */}
                    <CustomReactTable
                        onRef={ref => (this.customReactTable = ref)}
                        columns={columns}
                        data={data}
                        pages={pages}
                        loading={loading}
                        onFetchData={this.onFetchData}
                        defaultPageSize={10}
                    />
                    {/* </CardBody> */}
                </Card>
                <WoManagementSearchCrPopup
                    parentState={this.state}
                    closePopup={this.closeSearchCrPopup}
                    setValue={this.setValueSearchCr} />
                <CrManagementAddEditPopup
                    parentState={this.state}
                    closePopup={this.closeCrAddEditPopup}
                    closePage={this.props.closePage}
                    moduleName={"WO"}
                    reloadDataGrid={this.getListCRFromOtherSystem} />
            </div>
        );
    }
}

WoManagementEditCrTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditCrTab));