import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import { CustomReactTable, SettingTableLocal, CustomAvField } from "../../../containers/Utils";
import * as PtProblemActions from "./PtProblemActions";
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class PtProblemEditHistoryTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);

        this.state = {
            objectSearch: {},
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns()
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.updatedUser" />,
                id: "createrUserName",
                accessor: d => <span title={d.createrUserName}>{d.createrUserName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.updatedUnit" />,
                id: "createrUnitName",
                accessor: d => <span title={d.createrUnitName}>{d.createrUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.content" />,
                id: "content",
                accessor: d => <span title={d.content}>{d.content}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status" />,
                id: "type",
                accessor: d => <span title={d.type}>{d.type}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.updateTime" />,
                id: "createTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
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
        objectSearch.problemId = this.state.selectedData.problemId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchProblemActionLogs();
        });
    }

    searchProblemActionLogs(isSearchClicked = false) {
        this.props.actions.searchProblemActionLogs(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getActionLog"));
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify mr-2"></i>{t("ptProblem:ptProblem.title.historyList")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    <Button type="button" className="mr-2" color="secondary" onClick={(e) => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                    <SettingTableLocal
                                        columns={columns}
                                        onChange={this.handleChangeLocalColumnsTable}
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
                    </Col>
                </Row>
            </div>
        );
    }
}

PtProblemEditHistoryTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditHistoryTab));