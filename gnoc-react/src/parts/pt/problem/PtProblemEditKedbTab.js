import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as KedbManagementActions from '../../kedb/management/KedbManagementActions';
import { CustomReactTable, SettingTableLocal } from "../../../containers/Utils";
import * as PtProblemActions from "./PtProblemActions";
import PtProblemEditKedbTabAddEditPopup from './PtProblemEditKedbTabAddEditPopup';
import PtProblemEditKedbTabSearchPopup from './PtProblemEditKedbTabSearchPopup';
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class PtProblemEditKedbTab extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.openPopupAddEdit = this.openPopupAddEdit.bind(this);

        this.state = {
            ptProblem: props.parentState.selectedData,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            isOpenPopupAddEdit: false,
            isOpenPopupSearch: false,
            selectedData: null,
            isAddOrEdit: null,
            isHaveKedb: false,
            isAuth: false
        };
    }

    
    componentDidMount() {
        this.props.actions.getDetailPtProblem(this.props.parentState.selectedData.problemId).then((response) => {
            if (response.payload && response.payload.data) {
                this.props.actions.getItemMaster("PT_STATE", "itemId", "itemName", "1", "3").then((res) => {
                    let stateName = "";
                    for (const state of res.payload.data.data) {
                        if (state.itemId + "" === this.state.ptProblem.problemState + "") {
                            stateName = state.itemName;
                            break;
                        }
                    }
                    let ptProblem = response.payload.data;
                    ptProblem.stateName = stateName;
                    this.setState({
                        ptProblem,
                        objectSearch: {...this.state.objectSearch, kedbCode: ptProblem.relatedKedb, page: 1, pageSize: 1}
                    }, () => {
                        if (ptProblem.relatedKedb) {
                            this.getListKedb();
                        }
                    });
                });
            }
        });
        const userRolesList =  JSON.parse(localStorage.user).rolesList.map(function(item) {
            return item['roleCode'];
        });
        if (!userRolesList.includes("ADMIN_KEDB") && !userRolesList.includes("SUB_ADMIN_KEDB") && !userRolesList.includes("USER_KEDB")) {
            this.setState({ isAuth: true });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 100,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openPopupAddEdit("EDIT", d)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.courseCode" />,
                id: "kedbCode",
                width: 200,
                accessor: d => <span title={d.kedbCode}>{d.kedbCode}</span>,
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.courseName" />,
                id: "kedbName",
                width: 200,
                accessor: d => <span title={d.kedbName}>{d.kedbName}</span>,
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.vendor" />,
                id: "vendorName",
                width: 150,
                accessor: d => {
                    return d.vendorName ? <span title={d.vendorName}>{d.vendorName}</span>
                        : <span>&nbsp;</span>
                },
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.fragment" />,
                id: "typeName",
                width: 150,
                accessor: d => <span title={d.typeName}>{d.typeName}</span>,
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.nodeType" />,
                id: "subCategoryName",
                width: 150,
                accessor: d => <span title={d.subCategoryName}>{d.subCategoryName}</span>,
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.status" />,
                id: "kedbStateName",
                width: 150,
                accessor: d => <span title={d.kedbStateName}>{d.kedbStateName}</span>,
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.createdDate" />,
                id: "createdTime",
                width: 150,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>,
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
            sortName: sortName,
            sortType: sortType
        }

        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.kedbCode = this.state.ptProblem.relatedKedb;

        if (objectSearch.kedbCode) {
            this.setState({
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.getListKedb();
            });
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    setDataTableFromKedb = (data) => {
        this.setState({
            data,
            isHaveKedb: true,
            loading: false,
            pages: 1
        }, () => {
            this.props.onChangeChildTab(this.state);
        });
    }

    getListKedb() {
        this.props.actions.getListKedb(this.state.objectSearch).then((response) => {
            if (response.payload.data.data.length > 0) {
                this.setState({
                    isHaveKedb: true
                });
            }
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ptProbem:ptProbem.message.error.getKedb"));
        });
    }

    openPopupAddEdit(isAddOrEdit, object) {
        if (isAddOrEdit === "ADD") {
            this.setState({
                isOpenPopupAddEdit: true,
                isAddOrEdit: isAddOrEdit,
                selectedData: {},
            });
        } else if (isAddOrEdit === "EDIT") {
            this.props.actions.getKedbById(object.kedbId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isOpenPopupAddEdit: true,
                        isAddOrEdit: isAddOrEdit,
                        selectedData: response.payload.data,
                    });
                } else {
                    toastr.error(this.props.t("ptProbem:ptProbem.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProbem:ptProbem.message.error.getDetail"));
            });
        }
    }

    closePopupAddEdit = () => {
        this.setState({
            isOpenPopupAddEdit: false,
            isAddOrEdit: null
        });
    }

    openPopupSearch = () => {
        this.setState({
            isOpenPopupSearch: true,
        });
    }

    closePopupSearch = () => {
        this.setState({
            isOpenPopupSearch: false
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
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
                                <i className="fa fa-align-justify mr-2"></i>{t("ptProblem:ptProblem.title.courseList")}
                                <div className="card-header-actions card-header-actions-button-table">
                                    <Button type="button" className="mr-2" color="primary"
                                    onClick={this.openPopupSearch}><i className="fa fa-search"></i> {t("ptProblem:ptProblem.button.kedbSearch")}</Button>
                                    <Button type="button" className="mr-2" color="primary" disabled={this.state.isHaveKedb || this.state.isAuth}
                                    onClick={() => this.openPopupAddEdit("ADD")}><i className="fa fa-plus-circle"></i> {t("ptProblem:ptProblem.button.add")}</Button>
                                    <Button type="button" className="mr-2" color="secondary" onClick={(e) => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
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
                <PtProblemEditKedbTabAddEditPopup
                    closeAddOrEditPage={this.closePopupAddEdit}
                    parentState={this.state}
                    setDataTableFromKedb={this.setDataTableFromKedb} />
                <PtProblemEditKedbTabSearchPopup
                    closeSearchPage={this.closePopupSearch}
                    parentState={this.state}
                    setDataTableFromKedb={this.setDataTableFromKedb} />
            </div>
        );
    }
}

PtProblemEditKedbTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtProblemActions, KedbManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditKedbTab));