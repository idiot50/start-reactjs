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

class WoManagementEditWorkChildTab extends Component {
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
                Header: <Trans i18nKey="woManagement:woManagement.label.woCode" />,
                id: "woCode",
                minWidth: 200,
                accessor: d => {
                    return d.woCode ? <span title={d.woCode}>{d.woCode}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.parentName" />,
                id: "parentName",
                minWidth: 200,
                accessor: d => {
                    return d.parentName ? <span title={d.parentName}>{d.parentName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woType" />,
                id: "woTypeName",
                minWidth: 200,
                accessor: d => {
                    return d.woTypeName ? <span title={d.woTypeName}>{d.woTypeName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woName" />,
                id: "woContent",
                minWidth: 200,
                accessor: d => {
                    return d.woContent ? <span title={d.woContent}>{d.woContent}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woStatus" />,
                id: "statusName",
                minWidth: 200,
                accessor: d => {
                    return d.statusName ? <span title={d.statusName}>{d.statusName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.woSystem" />,
                id: "woSystem",
                minWidth: 200,
                accessor: d => {
                    return d.woSystem ? <span title={d.woSystem}>{d.woSystem}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.systemCode" />,
                id: "woSystemId",
                minWidth: 200,
                accessor: d => {
                    return d.woSystemId ? <span title={d.woSystemId}>{d.woSystemId}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.createPersonName" />,
                id: "createPersonName",
                minWidth: 200,
                accessor: d => {
                    return d.createPersonName ? <span title={d.createPersonName}>{d.createPersonName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.createTime" />,
                id: "createDate",
                minWidth: 200,
                accessor: d => {
                    return d.createDate ? <span title={d.createDate}>{d.createDate}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.cdGroup" />,
                id: "cdName",
                minWidth: 200,
                accessor: d => {
                    return d.cdName ? <span title={d.cdName}>{d.cdName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.ftName" />,
                id: "ftName",
                minWidth: 200,
                accessor: d => {
                    return d.ftName ? <span title={d.ftName}>{d.ftName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.priority" />,
                id: "priorityName",
                minWidth: 200,
                accessor: d => {
                    return d.priorityName ? <span title={d.priorityName}>{d.priorityName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.startTime" />,
                id: "startTime",
                minWidth: 200,
                accessor: d => {
                    return d.startTime ? <span title={convertDateToDDMMYYYYHHMISS(d.startTime)}>{convertDateToDDMMYYYYHHMISS(d.startTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.endTime" />,
                id: "endTime",
                minWidth: 200,
                accessor: d => {
                    return d.endTime ? <span title={convertDateToDDMMYYYYHHMISS(d.endTime)}>{convertDateToDDMMYYYYHHMISS(d.endTime)}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.closedTime" />,
                id: "finishTime",
                minWidth: 200,
                accessor: d => {
                    return d.finishTime ? <span title={convertDateToDDMMYYYYHHMISS(d.finishTime)}>{convertDateToDDMMYYYYHHMISS(d.finishTime)}</span>
                    : <span>&nbsp;</span>
                }
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
            sortName: sortName ? sortName : null,
            sortType: sortType ? sortType : null
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.woId = this.state.selectedData.woId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListWoChild();
        });
    }

    getListWoChild(isSearchClicked = false) {
        this.props.actions.getListWoChild(this.state.objectSearch).then((response) => {
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

WoManagementEditWorkChildTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditWorkChildTab));