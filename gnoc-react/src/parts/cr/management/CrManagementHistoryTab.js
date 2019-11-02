import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';

class CrManagementHistoryTab extends Component {
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
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {},
        };
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.actionUser" />,
                id: "userName",
                width: 150,
                accessor: d => d.userName ? <span title={d.userName}>{d.userName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.actionDate" />,
                id: "changeDate",
                width: 150,
                accessor: d => d.changeDate ? <span title={d.changeDate}>{d.changeDate}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.action" />,
                id: "actionName",
                width: 150,
                accessor: d => d.actionName ? <span title={d.actionName}>{d.actionName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crStatus" />,
                id: "statusName",
                width: 150,
                accessor: d => d.statusName ? <span title={d.statusName}>{d.statusName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.reasonType" />,
                id: "returnTitle",
                width: 150,
                accessor: d => d.returnTitle ? <span title={d.returnTitle}>{d.returnTitle}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.reason" />,
                id: "reasonTitle",
                width: 200,
                accessor: d => d.reasonTitle ? <span title={d.reasonTitle}>{d.reasonTitle}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.notes" />,
                id: "notes",
                minWidth: 150,
                accessor: d => d.notes ? <span title={d.notes}>{d.notes}</span> : <span>&nbsp;</span>
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
            this.searchHistory();
        });
    }

    searchHistory = () => {
        if (this.state.modalName === "EDIT") {
            const objectSearch = Object.assign({}, this.state.objectSearch);
            objectSearch.crId = this.state.selectedData.crId;
            this.props.actions.searchHistory(objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data ? response.payload.data.data : [],
                    pages: response.payload.data.pages,
                    loading: false
                });
            }).catch((response) => {
                this.setState({
                    loading: false
                });
                toastr.error(this.props.t("crManagement:crManagement.message.error.getHistory"));
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.historyList")}
                        <div className="card-header-actions card-header-actions-button-table">
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
            </div>
        );
    }
}

CrManagementHistoryTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementHistoryTab));