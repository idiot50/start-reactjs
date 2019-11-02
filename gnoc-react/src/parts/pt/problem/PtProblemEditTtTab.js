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

class PtProblemEditTtTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);

        this.state = {
            objectSearch: {},
            //AddOrEditModal
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
                Header: <Trans i18nKey="ptProblem:ptProblem.label.priority" />,
                id: "priorityName",
                width: 200,
                accessor: d => <span title={d.priorityName}>{d.priorityName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.issueCode" />,
                id: "troubleCode",
                width: 200,
                accessor: d => <span title={d.troubleCode}>{d.troubleCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.issueName" />,
                id: "troubleName",
                width: 200,
                accessor: d => <span title={d.troubleName}>{d.troubleName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status" />,
                id: "stateName",
                width: 200,
                accessor: d => <span title={d.stateName}>{d.stateName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.issueArray" />,
                id: "typeName",
                width: 200,
                accessor: d => <span title={d.typeName}>{d.typeName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdDate" />,
                id: "createdTime",
                width: 200,
                accessor: d => <span title={d.createdTime}>{d.createdTime}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.remainTime" />,
                id: "remainTime",
                width: 200,
                accessor: d => <span title={d.remainTime}>{d.remainTime}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.recoveryTime" />,
                id: "clearTime",
                width: 200,
                accessor: d => <span title={d.clearTime}>{d.clearTime}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.lastUpdateTime" />,
                id: "lastUpdateTime",
                minWidth: 200,
                accessor: d => <span title={d.lastUpdateTime}>{d.lastUpdateTime}</span>
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
        objectSearch.troubleCode = this.state.selectedData.relatedTt;

        if (objectSearch.troubleCode) {
            this.setState({
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.onSearchTroubleRelated();
            });
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    onSearchTroubleRelated(isSearchClicked = false) {
        this.props.actions.onSearchTroubleRelated(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getTt"));
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
                                <i className="fa fa-align-justify mr-2"></i>{t("ptProblem:ptProblem.title.ttList")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    {/* <Button type="button" className="mr-2" color="primary" onClick={this.openPopupSearch}>
                                    <i className="fa fa-search"></i> {t("common:common.button.search")}</Button> */}
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

PtProblemEditTtTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditTtTab));