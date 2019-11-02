import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';

class TtTroubleEditHelpInfoTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            btnExportLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
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
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.caseName" />,
                id: "caseName",
                width: 200,
                accessor: d => <span title={d.caseName}>{d.caseName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.testCaseName" />,
                id: "testCaseName",
                width: 150,
                accessor: d => <span title={d.testCaseName}>{d.testCaseName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.result" />,
                id: "result",
                width: 200,
                accessor: d => <span title={d.result}>{d.result}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.fileName" />,
                id: "fileName",
                minWidth: 150,
                accessor: d => <span title={d.fileName}>{d.fileName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.download" />,
                id: "download",
                minWidth: 100,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("ttTrouble:ttTrouble.button.download")} onClick={() => this.onExport(d)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-download"></i></Button>
                        </span>
                    </div>
                    return html;
                }
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.description" />,
                id: "description",
                minWidth: 200,
                accessor: d => <span title={d.description}>{d.description}</span>
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

        const objectSearch = Object.assign({}, values);
        objectSearch.woCode = this.state.selectedData.woCode;
        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchTtTrouble();
        });
    }

    searchTtTrouble = () => {
        this.props.actions.getListInfoTickHelpByWoCode(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getActionLog"));
        });
    }

    onExport = (data) => {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.downloadFileInforHelp(data).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.downloadFile"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.downloadFileHelp"));
            });
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        console.log(data);
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.listCaseTest")}
                        <div className="card-header-actions card-header-actions-button-table">
                            {/* <Button type="button" color="secondary" className="mr-2" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button> */}
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
                        defaultPageSize={3}
                    />
                </Card>
            </div>
        );
    }
}

TtTroubleEditHelpInfoTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditHelpInfoTab));