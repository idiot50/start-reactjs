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

class CrManagementDependentCrTab extends Component {
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
                Header: <Trans i18nKey="crManagement:crManagement.label.crNumber" />,
                id: "crNumber",
                width: 150,
                accessor: d => d.crNumber ? <span title={d.crNumber}>{d.crNumber}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crName" />,
                id: "title",
                width: 150,
                accessor: d => d.title ? <span title={d.title}>{d.title}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.state" />,
                id: "state",
                width: 150,
                accessor: d => d.state ? <span title={d.state}>{d.state}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.earliestStartTime" />,
                id: "earliestStartTime",
                width: 150,
                accessor: d => d.earliestStartTime ? <span title={d.earliestStartTime}>{d.earliestStartTime}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.lastestStartTime" />,
                id: "latestStartTime",
                width: 150,
                accessor: d => d.latestStartTime ? <span title={d.latestStartTime}>{d.latestStartTime}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.priority" />,
                id: "priority",
                minWidth: 150,
                accessor: d => d.priority ? <span title={d.priority}>{d.priority}</span> : <span>&nbsp;</span>
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
            this.searchCrManagementCrRelated();
        });
    }

    searchCrManagementCrRelated = () => {
        if (this.state.modalName === "EDIT") {
            const objectSearch = Object.assign({}, this.state.objectSearch);
            objectSearch.crId = this.state.selectedData.crId;
            this.props.actions.getListCrRelated(objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data ? response.payload.data.data : [],
                    pages: response.payload.data.pages,
                    loading: false
                });
            }).catch((response) => {
                this.setState({
                    loading: false
                });
                toastr.error(this.props.t("crManagement:crManagement.message.error.getDependentCr"));
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
                        <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.dependentCrList")}
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

CrManagementDependentCrTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementDependentCrTab));