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
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';
import TtTroubleEditProblemTabAddPopup from './TtTroubleEditProblemTabAddPopup';

class TtTroubleEditProblemTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenPopupAdd: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
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
        const { selectedData, data } = this.state;
        if (selectedData.state === 11 && selectedData.relatedKedb && data.length < 1
            && selectedData.receiveUnitId === JSON.parse(localStorage.user).deptId) {
            this.setState({
                isDisable: false
            });
        } else if ((selectedData.state === 10 || selectedData.state === 8 || selectedData.state === 9)
            && data.length < 1 && selectedData.receiveUnitId === JSON.parse(localStorage.user).deptId) {
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
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.problemCode" />,
                id: "problemCode",
                width: 200,
                accessor: d => <span title={d.problemCode}>{d.problemCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.problemName" />,
                id: "problemName",
                width: 200,
                accessor: d => <span title={d.problemName}>{d.problemName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.receiveUnitProblemTab" />,
                id: "receiveUnitId",
                width: 150,
                accessor: d => {
                    return d.receiveUnitIdStr ? <span title={d.receiveUnitIdStr}>{d.receiveUnitIdStr}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createdTime",
                width: 200,
                className: "text-center",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.problemState" />,
                id: "statusStr",
                minWidth: 100,
                accessor: d => <span title={d.statusStr}>{d.statusStr}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.priority" />,
                id: "priorityName",
                minWidth: 100,
                accessor: d => <span title={d.priorityName}>{d.priorityName}</span>
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
            this.getListProblems();
        });
    }

    getListProblems = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.relatedTt = this.state.selectedData.troubleCode;
        this.props.actions.getListProblems(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data || [],
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getRelatedPt"));
        });
    }

    openPopupAdd = () => {
        this.setState({
            isOpenPopupAdd: true
        });
    }

    closePopupAdd = () => {
        this.setState({
            isOpenPopupAdd: false
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, isDisable } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("ttTrouble:ttTrouble.title.problemList")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <Button type="button" color="primary" className="mr-2" onClick={this.openPopupAdd} disabled={isDisable}>
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
                <TtTroubleEditProblemTabAddPopup
                    parentState={this.state}
                    closePage={this.closePopupAdd}
                    reloadPage={this.getListProblems}
                />
            </div>
        );
    }
}

TtTroubleEditProblemTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditProblemTab));