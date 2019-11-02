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
import TtTroubleEditMOPTabDetailPopup from './TtTroubleEditMOPTabDetailPopup';
import { convertDateToDDMMYYYYHHMISS, confirmAlertInfo } from '../../../containers/Utils/Utils';

class TtTroubleEditMOPTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenDetailPopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
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
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.action"/>,
                id: "action",
                width: 100,
                accessor: d => (
                    <div className="text-center">
                        <span title={this.props.t("ttTrouble:ttTrouble.button.viewDetail")}>
                            <Button type="button" size="sm" color="secondary" className="btn-info mr-1" onClick={() => this.openDetailPopup(d)}>
                                <i className="fa fa-eye"></i>
                            </Button>
                        </span>
                        <span title={this.props.t("ttTrouble:ttTrouble.button.runDT")} className={d.stateMop + "" === "2" || this.state.selectedData.endTroubleTime ? "class-hidden" : ""}>
                            <Button type="button" size="sm" color="secondary" className="btn-info" onClick={() => this.runDT(d)}>
                                <i className="fa fa-play"></i>
                            </Button>
                        </span>
                    </div>
                )
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.mopName" />,
                id: "mopName",
                width: 150,
                accessor: d => <span title={d.mopName}>{d.mopName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.groupMopName" />,
                id: "groupMopName",
                width: 150,
                accessor: d => <span title={d.groupMopName}>{d.groupMopName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.runType" />,
                id: "runTypeName",
                width: 150,
                accessor: d => <span title={d.runTypeName}>{d.runTypeName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.numberRun" />,
                id: "numberRun",
                minWidth: 150,
                accessor: d => <span title={d.numberRun}>{d.numberRun}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.runCycle" />,
                id: "runCycle",
                minWidth: 200,
                accessor: d => <span title={d.runCycle}>{d.runCycle}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.maxNumberRun" />,
                id: "maxNumberRun",
                minWidth: 200,
                accessor: d => <span title={d.maxNumberRun}>{d.maxNumberRun}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.system" />,
                id: "system",
                minWidth: 200,
                accessor: d => <span title={d.system}>{d.system}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.stateMopName" />,
                id: "stateMopName",
                minWidth: 200,
                accessor: d => <span title={d.stateMopName}>{d.stateMopName}</span>
            }
        ];
    }

    runDT = (object) => {
        confirmAlertInfo(this.props.t("ttTrouble:ttTrouble.message.confirmMop"),
        this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
        () => {
            object.stateMop = "2";
            object.isRun = "1";
            object.workLog = (object.workLog ? object.workLog : "") +
            "\n\r" + convertDateToDDMMYYYYHHMISS(new Date()) + JSON.parse(localStorage.user).userName + " run MOP";
            object.lastUpdateTime = null;
            this.props.actions.updateTroubleMop(object).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.getListTroubleMop();
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.runMop"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.runMop"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getDetailMop"));
            });
        }, () => {
            
        });
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
        objectSearch.troubleId = this.state.selectedData.troubleId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListTroubleMop();
        });
    }

    getListTroubleMop = () => {
        this.props.actions.getListTroubleMop(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getMop"));
        });
    }

    openDetailPopup = (d) => {
        this.props.actions.getListTroubleMop({troubleMopId: d.troubleMopId, page: 1, pageSize: 1}).then((response) => {
            this.setState({
                mopDetail: response.payload.data.data[0] || {},
                isOpenDetailPopup: true
            });
        }).catch((response) => {
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getDetailMop"));
        });
    }

    closeDetailPopup = () => {
        this.setState({
            isOpenDetailPopup: false
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.listMop")}
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
                        defaultPageSize={10}
                    />
                </Card>
                <TtTroubleEditMOPTabDetailPopup
                    parentState={this.state}
                    closePopup={this.closeDetailPopup} />
            </div>
        );
    }
}

TtTroubleEditMOPTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditMOPTab));