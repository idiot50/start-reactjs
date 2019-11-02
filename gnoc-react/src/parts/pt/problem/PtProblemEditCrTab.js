import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from '../../cr/management/CrManagementActions';
import { CustomReactTable, SettingTableLocal, CustomAvField } from "../../../containers/Utils";
import * as PtProblemActions from "./PtProblemActions";
import CrManagementAddEditPopup from '../../cr/management/CrManagementAddEditPopup';

class PtProblemEditCrTab extends Component {
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
                Header: <Trans i18nKey="ptProblem:ptProblem.label.crNumber" />,
                id: "crNumber",
                accessor: d => <span title={d.crNumber}>{d.crNumber}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.crName" />,
                id: "title",
                accessor: d => <span title={d.title}>{d.title}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status" />,
                id: "state",
                accessor: d => <span title={d.state}>{d.state}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdUser" />,
                id: "changeOrginatorName",
                accessor: d => <span title={d.changeOrginatorName}>{d.changeOrginatorName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.startTime" />,
                id: "earliestStartTime",
                accessor: d => <span title={d.earliestStartTime}>{d.earliestStartTime}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.endTime" />,
                id: "latestStartTime",
                accessor: d => <span title={d.latestStartTime}>{d.latestStartTime}</span>
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
            sortName: sortName ? sortName : "",
            sortType: sortType ? sortType : ""
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.problemId = this.state.selectedData.problemId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchProblemCr();
        });
    }

    searchProblemCr(isSearchClicked = false) {
        this.props.actions.searchProblemCr(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getCr"));
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
    }

    openCrAddEditPopup = () => {
        this.props.actions.getSequenseCr("cr_seq", 1).then((response) => {
            this.setState({
                isOpenPopupCrAddEdit: true,
                modalName: "ADD",
                selectedDataCr: { crId: response.payload.data[0], actionRight: "1", crCreatedFromOtherSysDTO: {systemId: "2", objectId: this.state.selectedData.problemId, stepId: this.state.selectedData.state} },
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
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify mr-2"></i>{t("ptProblem:ptProblem.title.crList")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    <Button type="button" color="primary" className="mr-2" onClick={this.openCrAddEditPopup}><i className="fa fa-plus-circle"></i> {t("ptProblem:ptProblem.button.addCr")}</Button>
                                    <Button type="button" color="secondary" onClick={(e) => this.props.closePage('EDIT')} className="mr-2"><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
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
                <CrManagementAddEditPopup
                    parentState={this.state}
                    closePopup={this.closeCrAddEditPopup}
                    closePage={this.props.closePage}
                    moduleName={"PT"}
                    reloadDataGrid={this.searchProblemCr} />
            </div>
        );
    }
}

PtProblemEditCrTab.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, PtProblemActions, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditCrTab));