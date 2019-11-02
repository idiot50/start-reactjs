import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomSticky, CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import TtTroubleEditRelatedTtTabAddPopup from './TtTroubleEditRelatedTtTabAddPopup';

class TtTroubleEditRelatedTtTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            isOpenSearchPopup: false,
            //Table
            data: [],
            pages: null,
            loading: true,
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
        this.checkDisableButton();
    }

    checkDisableButton = () => {
        const { selectedData } = this.state;
        if (selectedData.receiveUnitId === JSON.parse(localStorage.user).deptId
            && selectedData.state !== 9 && selectedData.state !== 10 && selectedData.state !== 2) {
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
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.action" />,
                id: "action",
                width: 100,
                className: "text-center",
                accessor: d => <Button color="danger" size="sm" type="button" className="icon" onClick={() => this.deleteRelatedTt(d)}>
                                <i className="fa fa-trash-o"></i></Button>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.troubleCode" />,
                id: "troubleCode",
                width: 200,
                accessor: d => <span title={d.troubleCode}>{d.troubleCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.troubleName" />,
                id: "troubleName",
                width: 150,
                accessor: d => <span title={d.troubleName}>{d.troubleName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.receiveUnitProblemTab" />,
                id: "receiveUnitName",
                width: 200,
                accessor: d => <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createdTime",
                width: 150,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.state" />,
                id: "stateName",
                minWidth: 150,
                accessor: d => <span title={d.stateName}>{d.stateName}</span>
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
            this.getListRelatedTT();
        });
    }

    getListRelatedTT = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.troubleCode = this.state.selectedData.relatedTt;
        this.props.actions.getListRelatedTT(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data || [],
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getRelatedTt"));
        });
    }

    setDataFromPopup = (data) => {
        this.setState({
            data
        });
    }

    openSearchPopup = () => {
        this.setState({
            isOpenSearchPopup: true
        });
    }

    closeSearchPopup = () => {
        this.setState({
            isOpenSearchPopup: false
        });
    }

    deleteRelatedTt = (object) => {
        const ttTrouble = Object.assign({}, this.state.selectedData);
        ttTrouble.relatedTt = null;
        this.props.actions.onUpdateTroubleEntity(ttTrouble).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.setDataFromPopup([]);
                toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.deleteRelatedTt"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.deleteRelatedTt"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.deleteRelatedTt"));
            }
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, isDisable } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CustomSticky level={1}>
                        <CardHeader>
                            <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.troubleList")}
                            <div className="card-header-actions card-header-actions-button-table">
                                <Button type="button" color="primary" className="mr-2" onClick={this.openSearchPopup} disabled={isDisable}>
                                    <i className="fa fa-plus-circle"></i> {t("ttTrouble:ttTrouble.button.implement")}
                                </Button>
                                {/* <Button type="button" color="secondary" className="mr-2" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button> */}
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        </CardHeader>
                    </CustomSticky>
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
                <TtTroubleEditRelatedTtTabAddPopup
                    parentState={this.state}
                    closePopup={this.closeSearchPopup}
                    setDataFromPopup={this.setDataFromPopup}
                />
            </div>
        );
    }
}

TtTroubleEditRelatedTtTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditRelatedTtTab));