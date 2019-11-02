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
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import TtTroubleEditInvolveIBMTabAdd from "./TtTroubleEditInvolveIBMTabAdd";
import {convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class TtTroubleEditInvolveIBMTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            objectInfoTab: props.parentState.objectInfoTab,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            closeAddOrEditPage: false,
            columns: this.buildTableColumns(),
            isDisable: true
        };
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    componentDidMount() {
        if (this.state.selectedData.receiveUnitId + "" === JSON.parse(localStorage.user).deptId + "") {
            this.setState({
                isDisable: false
            });
        } else {
            this.setState({
                isDisable: true
            });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createdTime",
                width: 150,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.troubleName" />,
                id: "ibmName",
                width: 150,
                accessor: d => <span title={d.ibmName }>{d.ibmName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.receiveUnitName" />,
                id: "receiveUnitName",
                width: 150,
                accessor: d => <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.productName" />,
                id: "productName",
                minWidth: 150,
                accessor: d => <span title={d.productName}>{d.productName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.receiveUserName" />,
                id: "receiveUserName",
                minWidth: 200,
                accessor: d => <span title={d.receiveUserName}>{d.receiveUserName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.status" />,
                id: "status",
                minWidth: 200,
                accessor: d => <span title={d.status}>{d.status}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.timeExpectClose" />,
                id: "timeExpectClose",
                minWidth: 200,
                accessor: d => <span title={d.timeExpectClose}>{d.timeExpectClose}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.timeClose" />,
                id: "timeClose",
                minWidth: 200,
                accessor: d => <span title={d.timeClose}>{d.timeClose}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.unitLiable" />,
                id: "unitLiable",
                minWidth: 200,
                accessor: d => <span title={d.unitLiable}>{d.unitLiable}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.userLiable" />,
                id: "userLiable",
                minWidth: 200,
                accessor: d => <span title={d.userLiable}>{d.userLiable}</span>
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
            sortType: sortType,
            troubleId: this.state.selectedData.troubleId
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch,
            troubleId: this.state.selectedData.troubleId

        }, () => {
            this.searchTtTrouble();
        });
    }

    searchTtTrouble = () => {
        this.props.actions.searchTtTroubleIBM(this.state.objectSearch).then((response) => {
            this.setState({
                loading: false,
                data: response.payload.data.data
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getTroubleIBM"));
        });
    }

    openAddOrEditPage(value) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        }
    }

    closeAddOrEditPage = () => {
        this.setState({
            isAddOrEditVisible: false,
            isAddOrEdit: null
        }, () => {
            this.searchTtTrouble();
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, isDisable } = this.state;
        return (
            <div className="animated fadeIn">
                <CustomCSSTransition
                    isVisible={this.state.isAddOrEditVisible}
                    content={
                        <TtTroubleEditInvolveIBMTabAdd
                            closeAddOrEditPage={this.closeAddOrEditPage}
                            parentState={this.state} />
                    }
                >
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.involveIBM")}
                            <div className="card-header-actions card-header-actions-button-table">
                                <Button type="button" color="primary" className="mr-2" onClick={() => this.openAddOrEditPage('ADD')} disabled={isDisable}>
                                    <i className="fa fa-plus-circle"></i> {t("ttTrouble:ttTrouble.button.add")}
                                </Button>
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
                </CustomCSSTransition>
            </div>
        );
    }
}

TtTroubleEditInvolveIBMTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditInvolveIBMTab));