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
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import WoManagementAddPopup from '../../wo/management/WoManagementAddPopup';

class PtProblemEditWoTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);

        this.state = {
            isOpenPopupWoAddEdit: false,
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
                Header: <Trans i18nKey="ptProblem:ptProblem.label.workContent" />,
                id: "woContent",
                width: 200,
                accessor: d => <span title={d.woContent}>{d.woContent}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.workCode" />,
                id: "woCode",
                width: 200,
                accessor: d => <span title={d.woCode}>{d.woCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status" />,
                id: "statusName",
                width: 150,
                accessor: d => <span title={d.statusName}>{d.statusName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.workType" />,
                id: "woTypeName",
                width: 200,
                accessor: d => <span title={d.woTypeName}>{d.woTypeName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdEmployee" />,
                id: "createPersonName",
                width: 200,
                accessor: d => <span title={d.createPersonName}>{d.createPersonName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.handleGroup" />,
                id: "cdName",
                width: 200,
                accessor: d => <span title={d.cdName}>{d.cdName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.priority" />,
                id: "priorityName",
                width: 200,
                accessor: d => <span title={d.priorityName}>{d.priorityName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.startTime" />,
                id: "startTime",
                width: 200,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.startTime)}>{convertDateToDDMMYYYYHHMISS(d.startTime)}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.endTime" />,
                id: "endTime",
                width: 200,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.endTime)}>{convertDateToDDMMYYYYHHMISS(d.endTime)}</span>
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
        objectSearch.problemCode = this.state.selectedData.problemCode;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchProblemWo();
        });
    }

    searchProblemWo(isSearchClicked = false) {
        this.props.actions.searchProblemWo(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getWo"));
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    openWoAddEditPopup = () => {
        this.setState({
            isOpenPopupWoAddEdit: true,
            modalName: "ADD"
        });
    }

    closeWoAddEditPopup = () => {
        this.setState({
            isOpenPopupWoAddEdit: false,
            modalName: ""
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
                                <i className="fa fa-align-justify mr-2"></i>{t("ptProblem:ptProblem.title.woList")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    <Button type="button" color="primary" className="mr-2" onClick={this.openWoAddEditPopup}><i className="fa fa-plus-circle"></i> {t("ptProblem:ptProblem.button.addWo")}</Button>
                                    <Button type="button" color="secondary" onClick={() => this.props.closePage('EDIT')} className="mr-2"><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
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
                <WoManagementAddPopup
                    parentState={this.state}
                    closePopup={this.closeWoAddEditPopup}
                    closePage={this.props.closePage}
                    parentSource={{woSystem: "PT", woSystemId: this.state.selectedData.problemCode}}
                    reloadDataGridParent={this.searchProblemWO} />
            </div>
        );
    }
}

PtProblemEditWoTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditWoTab));