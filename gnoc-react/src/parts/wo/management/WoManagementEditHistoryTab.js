import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class WoManagementEditHistoryTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            isAddOrEdit: null,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            statusList: props.parentState.statusList,
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
                Header: <Trans i18nKey="woManagement:woManagement.label.oldStatus" />,
                id: "oldStatus",
                accessor: d => {
                    const status = this.state.statusList.find(item => item.itemId === d.oldStatus) || {};
                    const statusName = d.oldStatus === 2 ? this.props.t("woManagement:woManagement.button.reject") : status.itemName;
                    return status.itemName ? <span title={statusName}>{statusName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.newStatus" />,
                id: "newStatus",
                accessor: d => {
                    const status = this.state.statusList.find(item => item.itemId === d.newStatus) || {};
                    const statusName = d.newStatus === 2 ? this.props.t("woManagement:woManagement.button.reject") : status.itemName;
                    return status.itemName ? <span title={statusName}>{statusName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.updateTime" />,
                id: "updateTime",
                accessor: d => {
                    return d.updateTime ? <span title={convertDateToDDMMYYYYHHMISS(d.updateTime)}>{convertDateToDDMMYYYYHHMISS(d.updateTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.descriptionCd" />,
                id: "comments",
                accessor: d => <span title={d.comments}>{d.comments}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.userName" />,
                id: "userName",
                accessor: d => <span title={d.userName}>{d.userName}</span>
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

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.woId = this.state.selectedData.woId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListWoHistoryByWoId();
        });
    }

    getListWoHistoryByWoId(isSearchClicked = false) {
        this.props.actions.getListWoHistoryByWoId(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("woManagement:woManagement.message.error.getHistory"));
        });
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-plus-justify"></i>{t("woManagement:woManagement.title.history")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <Button type="button" color="secondary" className="mr-1" onClick={() => this.props.closePage('PROCESS')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
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

WoManagementEditHistoryTab.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, WoManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditHistoryTab));