import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import CrManagementWorklogTabAddPopup from './CrManagementWorklogTabAddPopup';

class CrManagementWorklogTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);

        this.state = {
            isOpenPopupAddWorklog: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {}
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
                Header: <Trans i18nKey="crManagement:crManagement.label.createUser" />,
                id: "userName",
                width: 150,
                accessor: d => d.userName ? <span title={d.userName}>{d.userName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.actionGroup" />,
                id: "userGroupActionName",
                width: 150,
                accessor: d => d.userGroupActionName ? <span title={d.userGroupActionName}>{d.userGroupActionName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.createTime" />,
                id: "createdDate",
                width: 150,
                accessor: d => d.createdDate ? <span title={d.createdDate}>{d.createdDate}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.worklogDescription" />,
                id: "wlgText",
                minWidth: 150,
                accessor: d => d.wlgText ? <span title={d.wlgText}>{d.wlgText}</span> : <span>&nbsp;</span>
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
            this.searchWorkLog();
        });
    }

    searchWorkLog = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.wlgObjectId = this.state.selectedData.crId;
        this.props.actions.searchWorkLog(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("crManagement:crManagement.message.error.getWorklog"));
        });
    }

    openAddWorklogPopup = () => {
        this.setState({
            isOpenPopupAddWorklog: true
        });
    }

    closeAddWorklogPopup = () => {
        this.setState({
            isOpenPopupAddWorklog: false
        }, () => {
            const objectSearch = Object.assign({}, this.state.objectSearch);
            objectSearch.page = 1;
            this.setState({
                objectSearch,
                loading: true
            }, () => {
                this.customReactTable.resetPage();
                this.searchWorkLog();
            });
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
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.worklogList")}
                        </div>
                        {
                            this.props.parentState.visibleToolbarTab.worklog.all ?
                            <div className="card-header-actions card-header-search-actions-button">
                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                    title={t("crManagement:crManagement.button.add")}
                                    onClick={this.openAddWorklogPopup}><i className="fa fa-plus"></i></Button>
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div> :
                            <div className="card-header-actions card-header-search-actions-button">
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        }
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
                <CrManagementWorklogTabAddPopup
                    parentState={this.state}
                    closePage={this.closeAddWorklogPopup} />
            </div>
        );
    }
}

CrManagementWorklogTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementWorklogTab));