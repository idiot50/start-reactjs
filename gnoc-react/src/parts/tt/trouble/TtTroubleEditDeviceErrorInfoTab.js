import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import * as TtTroubleActions from './TtTroubleActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import TtTroubleEditDeviceErrorInfoTabAdd from './TtTroubleEditDeviceErrorInfoTabAdd'

class TtTroubleEditDeviceErrorInfoTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.merName" />,
                id: "merName",
                width: 150,
                accessor: d => <span title={d.merName}>{d.merName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.cardName" />,
                id: "cardName",
                width: 150,
                accessor: d => <span title={d.cardName}>{d.cardName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.serialNo" />,
                id: "serialNo",
                width: 150,
                accessor: d => <span title={d.serialNo}>{d.serialNo}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.stationCode" />,
                id: "stationCode",
                minWidth: 150,
                accessor: d => <span title={d.stationCode}>{d.stationCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.contractCode" />,
                id: "contractCode",
                minWidth: 200,
                accessor: d => <span title={d.contractCode}>{d.contractCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.serialAlternative" />,
                id: "serialAlternative",
                minWidth: 200,
                accessor: d => <span title={d.serialAlternative}>{d.serialAlternative}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.slotCardPort" />,
                id: "slotCardPort",
                minWidth: 200,
                accessor: d => <span title={d.slotCardPort}>{d.slotCardPort}</span>
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
        this.props.actions.searchTtTroubleDeviceErrorInfo(this.state.objectSearch).then((response) => {
            this.setState({
                loading: false,
                data: response.payload.data.data
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getActionLog"));
        });
    }

    closePopup = (object) => {
        this.setState({
            isOpenPopup: false,
        },()=>{
            this.searchTtTrouble();
        });
    }

    openPopup = (object) => {
        this.setState({
            isOpenPopup: true,
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.listMerchandise")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <Button type="button" color="primary" className="mr-2" onClick={() => this.openPopup()}><i className="fa fa-plus-circle"></i> {t("ttTrouble:ttTrouble.button.implement")}</Button>
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
                <TtTroubleEditDeviceErrorInfoTabAdd
                    parentState={this.state}
                    closePopup={this.closePopup} />
            </div>
        );
    }
}

TtTroubleEditDeviceErrorInfoTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditDeviceErrorInfoTab));