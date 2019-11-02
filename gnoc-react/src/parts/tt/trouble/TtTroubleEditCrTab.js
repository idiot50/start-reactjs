import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import * as CrManagementActions from '../../cr/management/CrManagementActions';
import { CustomReactTable, SettingTableLocal } from '../../../containers/Utils';
import TtTroubleEditInfoTabRelatedCR from './TtTroubleEditInfoTabRelatedCR';
import CrManagementAddEditPopup from '../../cr/management/CrManagementAddEditPopup';

class TtTroubleEditCrTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);

        this.state = {
            isOpenPopupRelatedCr: false,
            isOpenPopupCrAddEdit: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {},
            isVisible: true,
            isDisable: false
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    checkDisableButton = () => {
        if (this.state.selectedData.receiveUnitId !== JSON.parse(localStorage.user).deptId) {
            this.setState({
                isVisible: false
            });
        }
        if (this.props.parentState.isDisableUpdate) {
            this.setState({
                isDisable: true
            });
        } else {
            if (this.state.selectedData.state === 5 || this.state.selectedData.state === 8) {
                this.setState({
                    isDisable: false
                });
            } else {
                this.setState({
                    isDisable: true
                });
            }
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.crNumber" />,
                id: "crNumber",
                width: 150,
                accessor: d => <span title={d.crNumber}>{d.crNumber}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.crName" />,
                id: "title",
                width: 150,
                accessor: d => <span title={d.title}>{d.title}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.status" />,
                id: "state",
                width: 150,
                accessor: d => <span title={d.state}>{d.state}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createUser" />,
                id: "changeOrginatorName",
                minWidth: 150,
                accessor: d => <span title={d.changeOrginatorName}>{d.changeOrginatorName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.earliestStartTime" />,
                id: "earliestStartTime",
                minWidth: 200,
                accessor: d => <span title={d.earliestStartTime}>{d.earliestStartTime}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.lastestStartTime" />,
                id: "latestStartTime",
                minWidth: 200,
                accessor: d => <span title={d.latestStartTime}>{d.latestStartTime}</span>
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
            objectSearch: objectSearch
        }, () => {
            this.searchProblemCR();
        });
    }

    searchProblemCR = () => {
        this.props.actions.searchProblemCR(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.searchCR"));
        });
    }

    openPopup = () => {
        this.setState({
            isOpenPopupRelatedCr: true
        });
    }

    closePopup = () => {
        this.setState({
            isOpenPopupRelatedCr: false
        });
    }

    setValue = (d) => {
        this.setState({
            data: [...this.state.data, d]
        }, () => {
            const ttTrouble = Object.assign({}, this.state.selectedData);
            // ttTrouble.crDTOS = [d];
            this.insertCrCreatedFromOtherSystem({troubleId: ttTrouble.troubleId, crDTOS: [d]});
        });
    }

    insertCrCreatedFromOtherSystem = (ttTrouble) => {
        this.props.actions.insertCrCreatedFromOtherSystem(ttTrouble).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.update"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
            }
        });
    }

    openCrAddEditPopup = () => {
        this.props.actions.getSequenseCr("cr_seq", 1).then((response) => {
            this.setState({
                isOpenPopupCrAddEdit: true,
                modalName: "ADD",
                selectedDataCr: { crId: response.payload.data[0], actionRight: "1", crCreatedFromOtherSysDTO: {systemId: "3", objectId: this.state.selectedData.troubleId, stepId: this.state.selectedData.state} },
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
        const { columns, data, pages, loading, isVisible, isDisable } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.crList")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <Button type="button" color="primary" className="mr-2" disabled={isDisable} onClick={this.openCrAddEditPopup}>
                                <i className="fa fa-plus-circle"></i> {t("ttTrouble:ttTrouble.button.add")}
                            </Button>
                            <Button type="button" color="primary" className={isVisible && data.length === 0 ? "mr-2" : "class-hidden"} onClick={this.openPopup}><i className="fa fa-plus-circle"></i> {t("ttTrouble:ttTrouble.button.relateCR")}</Button>
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
                <TtTroubleEditInfoTabRelatedCR
                    parentState={this.state}
                    closePopup={this.closePopup}
                    setValue={this.setValue} />
                <CrManagementAddEditPopup
                    parentState={this.state}
                    closePopup={this.closeCrAddEditPopup}
                    closePage={this.props.closePage}
                    moduleName={"TT"}
                    reloadDataGrid={this.searchProblemCR} />
            </div>
        );
    }
}

TtTroubleEditCrTab.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditCrTab));