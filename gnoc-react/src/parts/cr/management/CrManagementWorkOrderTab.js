import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import * as WoManagementActions from '../../wo/management/WoManagementActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import WoManagementAddPopup from '../../wo/management/WoManagementAddPopup';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class CrManagementWorkOrderTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            objectSearch: {},
            isFirstSearch: true
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.woName" />,
                id: "woContent",
                minWidth: 200,
                accessor: d => d.woContent ? <span title={d.woContent}>{d.woContent}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.woCode" />,
                id: "woCode",
                minWidth: 200,
                accessor: d => d.woCode ? <span title={d.woCode}>{d.woCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.woStatus" />,
                id: "statusName",
                minWidth: 150,
                accessor: d => d.statusName ? <span title={d.statusName}>{d.statusName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.woType" />,
                id: "woTypeName",
                minWidth: 150,
                accessor: d => d.woTypeName ? <span title={d.woTypeName}>{d.woTypeName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.cd" />,
                id: "cdName",
                minWidth: 200,
                accessor: d => d.cdName ? <span title={d.cdName}>{d.cdName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.startTime" />,
                id: "startTime",
                minWidth: 150,
                accessor: d => d.startTime ? <span title={convertDateToDDMMYYYYHHMISS(d.startTime)}>{convertDateToDDMMYYYYHHMISS(d.startTime)}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.endTime" />,
                id: "endTime",
                minWidth: 150,
                accessor: d => d.endTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endTime)}>{convertDateToDDMMYYYYHHMISS(d.endTime)}</span> : <span>&nbsp;</span>
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
        objectSearch.woSystemId = this.state.selectedData.crId;

        if (!(this.state.isFirstSearch && this.state.modalName === "ADD")) {
            this.setState({
                loading: true,
                objectSearch: objectSearch,
                isFirstSearch: false
            }, () => {
                this.searchWoManagement();
            });
        }
    }

    searchWoManagement = () => {
        this.props.actions.searchWoManagement(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("crManagement:crManagement.message.error.getWorkOrder"));
        });
    }

    openWoAddEditPopup = () => {
        const { parentState } = this.props;
        if (parentState && parentState.objectInfoTab && parentState.objectInfoTab.selectValueProcess && parentState.objectInfoTab.selectValueProcess.value) {
            if (!parentState.objectInfoTab.earliestStartTime) {
                toastr.warning(this.props.t("crManagement:crManagement.message.required.startTimeCr"));
                this.props.onChangeTab(0);
                setTimeout(() => {
                    try {
                        document.getElementById("idFormAddOrEditInfoTab").elements["custom-earliestStartTime"].focus();
                    } catch (error) {
                        console.error(error);
                    }
                }, 100);
                return;
            }
            if (!parentState.objectInfoTab.latestStartTime) {
                toastr.warning(this.props.t("crManagement:crManagement.message.required.endTimeCr"));
                this.props.onChangeTab(0);
                setTimeout(() => {
                    try {
                        document.getElementById("idFormAddOrEditInfoTab").elements["custom-latestStartTime"].focus();
                    } catch (error) {
                        console.error(error);
                    }
                }, 100);
                return;
            }
            this.setState({
                isOpenPopupWoAddEdit: true,
                modalName: "ADD",
                startTime: parentState.objectInfoTab.earliestStartTime,
                endTime: parentState.objectInfoTab.latestStartTime
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.crProcess"));
            this.props.onChangeTab(0);
            setTimeout(() => {
                try {
                    document.getElementById("idFormAddOrEditInfoTab").elements["custom-input-crProcess"].nextElementSibling.focus();
                } catch (error) {
                    console.error(error);
                }
            }, 100);
        }
    }

    closeWoAddEditPopup = () => {
        this.setState({
            isOpenPopupWoAddEdit: false,
            modalName: "",
            startTime: null,
            endTime: null
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <div style={{position: 'absolute'}} className="mt-1">
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.workOrderList")}
                        </div>
                        <div className="card-header-actions card-header-search-actions-button">
                            <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                title={t("crManagement:crManagement.button.add")}
                                onClick={this.openWoAddEditPopup}><i className="fa fa-plus"></i></Button>
                            <SettingTableLocal
                                columns={columns}
                                onChange={(columns) => this.setState({ columns })}
                            />
                        </div>
                    </CardHeader>
                    <CustomReactTable
                        onRef={ref => (this.customReactTable = ref)}
                        columns={columns}
                        data={data}
                        pages={pages}
                        loading={loading}
                        onFetchData={this.onFetchData}
                        defaultPageSize={10}
                    />
                </Card>
                <WoManagementAddPopup
                    parentState={this.state}
                    closePopup={this.closeWoAddEditPopup}
                    closePage={this.props.closePage}
                    parentSource={{woSystem: "CR", woSystemId: this.state.selectedData.crId}}
                    reloadDataGridParent={this.searchWoManagement} />
            </div>
        );
    }
}

CrManagementWorkOrderTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeTab: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, WoManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementWorkOrderTab));