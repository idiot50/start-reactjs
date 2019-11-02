import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import { CustomReactTableLocal, SettingTableLocal, CustomAvField } from "../../../containers/Utils";
import * as PtProblemActions from "./PtProblemActions";
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class PtProblemEditPtTab extends Component {
    constructor(props) {
        super(props);

        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);

        this.state = {
            objectSearch: {},
            //AddOrEditModal
            modalName: props.parentState.modalName,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns()
        };
    }
    
    componentDidMount() {
        let objectSearch = { page: 1, pageSize: 1000 };
        objectSearch.relatedPt = this.state.selectedData.relatedPt ? this.state.selectedData.relatedPt : "";
        objectSearch.problemId = this.state.selectedData.problemId ? this.state.selectedData.problemId : "";
        objectSearch.problemState = this.state.selectedData.problemState ? this.state.selectedData.problemState : "";
        objectSearch.ptRelatedType = this.state.selectedData.ptRelatedType ? this.state.selectedData.ptRelatedType : "";
        objectSearch.problemCode = this.state.selectedData.problemCode ? this.state.selectedData.problemCode : "";
        this.setState({
            objectSearch
        }, () => {
            this.getListPtRelated();
        });
    }
    
    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.problemCode" />,
                id: "problemCode",
                accessor: d => <span title={d.problemCode}>{d.problemCode}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.problemName" />,
                id: "problemName",
                accessor: d => <span title={d.problemName}>{d.problemName}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.description" />,
                id: "description",
                accessor: d => <span title={d.description.replace(/<\/?[^>]+(>|$)/g, "")}>{d.description.replace(/<\/?[^>]+(>|$)/g, "")}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status" />,
                id: "statusStr",
                accessor: d => <span title={d.statusStr}>{d.statusStr}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdDate" />,
                id: "createdTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
            }
        ];
    }

    getListPtRelated(isSearchClicked = false) {
        this.props.actions.getListPtRelated(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data ? response.payload.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptConfig:ptConfig.message.error.search"));
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify mr-2"></i>{t("ptProblem:ptProblem.title.issueList")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    <Button type="button" className="mr-2" color="secondary" onClick={(e) => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                    <SettingTableLocal
                                        columns={columns}
                                        onChange={this.handleChangeLocalColumnsTable}
                                    />
                                </div>
                            </CardHeader>
                            <CustomReactTableLocal
                                columns={columns}
                                data={data}
                                loading={loading}
                                defaultPageSize={10}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

PtProblemEditPtTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditPtTab));