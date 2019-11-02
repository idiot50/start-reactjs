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
import TtTroubleEditWoTabReassignPopup from './TtTroubleEditWoTabReassignPopup';
import WoManagementAddPopup from '../../wo/management/WoManagementAddPopup';

class TtTroubleEditWoTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);

        this.state = {
            isOpenReassignPopup: false,
            isOpenPopupWoAddEdit: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {},
            isDisable: false,
            dataChecked: []
        };
    }

    componentDidMount() {
        // nếu đặt forceRender thì gọi từ parent giống CR
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
        if (JSON.parse(localStorage.user).deptId === this.state.selectedData.receiveUnitId) {
            this.setState({
                isDisable: false
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.woName" />,
                id: "woContent",
                width: 200,
                accessor: d => <span title={d.woContent}>{d.woContent}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.woCode" />,
                id: "woCode",
                width: 150,
                accessor: d => <span title={d.woCode}>{d.woCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.woStatus" />,
                id: "statusName",
                width: 200,
                accessor: d => <span title={d.statusName}>{d.statusName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.woType" />,
                id: "woTypeName",
                minWidth: 150,
                accessor: d => <span title={d.woTypeName}>{d.woTypeName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createUserWOTab" />,
                id: "createPersonName",
                minWidth: 200,
                accessor: d => <span title={d.createPersonName}>{d.createPersonName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.cd" />,
                id: "cdName",
                minWidth: 200,
                accessor: d => <span title={d.cdName}>{d.cdName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.priority" />,
                id: "priorityName",
                minWidth: 150,
                accessor: d => <span title={d.priorityName}>{d.priorityName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.startTime" />,
                id: "startTime",
                minWidth: 200,
                accessor: d => <span title={d.startTime}>{d.startTime}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.endTime" />,
                id: "endTime",
                minWidth: 200,
                accessor: d => <span title={d.endTime}>{d.endTime}</span>
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
        objectSearch.troubleCode = this.state.selectedData.troubleCode;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchProblemWO();
        });
    }

    searchProblemWO = () => {
        this.props.actions.searchProblemWO(this.state.objectSearch).then((response) => {
            const data = response.payload.data.data || [];
            if (data.length > 0) {
                data[0].totalRow = response.payload.data.total;
            }
            this.setState({
                data,
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.searchWO"));
        });
    }

    openReassignPopup = () => {
        this.setState({
            isOpenReassignPopup: true
        });
    }

    closeReassignPopup = () => {
        this.setState({
            isOpenReassignPopup: false
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
        const { columns, data, pages, loading, isDisable, dataChecked } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.woList")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <Button type="button" color="primary" disabled={isDisable} className="mr-2" onClick={this.openWoAddEditPopup}>
                                <i className="fa fa-plus-circle"></i> {t("ttTrouble:ttTrouble.button.add")}
                            </Button>
                            <Button type="button" color="primary" disabled={isDisable || dataChecked.length < 1} className="mr-2" onClick={this.openReassignPopup}>
                                <i className="fa fa-times-circle"></i> {t("ttTrouble:ttTrouble.button.reassignWO")}
                            </Button>
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
                        isCheckbox={true}
                        propsCheckbox={[]}
                        handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                        isChooseOneCheckbox={true}
                        handleChooseOneCheckbox={() => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));}}
                    />
                </Card>
                <TtTroubleEditWoTabReassignPopup
                    parentState={this.state}
                    closePopup={this.closeReassignPopup}
                    reloadDataGrid={this.searchProblemWO} />
                <WoManagementAddPopup
                    parentState={this.state}
                    closePopup={this.closeWoAddEditPopup}
                    closePage={this.props.closePage}
                    parentSource={{woSystem: "TT", woSystemId: this.state.selectedData.troubleCode}}
                    reloadDataGridParent={this.searchProblemWO} />
            </div>
        );
    }
}

TtTroubleEditWoTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditWoTab));