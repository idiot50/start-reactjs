import { AvForm } from 'availity-reactstrap-validation';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomInputFilter, CustomReactTableSearch, CustomSelectLocal, SearchBar, SettingTableLocal } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import * as commonActions from './../../../actions/commonActions';
import * as UtilityWorkLogsActions from './UtilityWorkLogsActions';
import UtilityWorkLogsAddEdit from "./UtilityWorkLogsAddEdit";


class UtilityWorkLogsList extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        // this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.searchUtilityWorkLogs = this.searchUtilityWorkLogs.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.handleItemSelectChangeWorkLogType = this.handleItemSelectChangeWorkLogType.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this)
        this.state = {
            //Object Search
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            //AddOrEditPage
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            //Select
            listWorklogType:[],
            selectValueWorkLogType: {},
            selectValueStatus:{},
            statusListSelect: [
                { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
            ],
        };
    }

    componentDidMount() {
        this.props.actions.getListWorkLogType().then((response) => {
            let listWorklogType = (response.payload && response.payload.data) ? response.payload.data.map(i => ({itemId:i.wlayType,itemName:i.wlayNameType})) : []
            this.setState({
                listWorklogType
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.search"));
        });;
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityWorkLogs:utilityWorkLogs.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.wlayId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        {/* <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.wlayId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span> */}
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.wlayId)}>
                            <Button type="button" size="sm" className="btn-warning icon"><i className="fa fa-copy"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityWorkLogs:utilityWorkLogs.label.worklogType" />,
                id: "wlayNameType",
                width: 250,
                accessor: d => {
                    return <span title={d.wlayNameType}>{d.wlayNameType}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"wlayType"}
                        label={""}
                        isRequired={false}
                        options={this.state.listWorklogType||[]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeWorkLogType}
                        selectValue={this.state.selectValueWorkLogType}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityWorkLogs:utilityWorkLogs.label.worklogCode" />,
                id: "wlayCode",
                width: 200,
                accessor: d => {
                    return <span title={d.wlayCode}>{d.wlayCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="wlayCode" placeholder={this.props.t("utilityWorkLogs:utilityWorkLogs.placeholder.worklogCode")}
                        value={this.state.objectSearch.wlayCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityWorkLogs:utilityWorkLogs.label.worklogName" />,
                id: "wlayName",
                width: 250,
                accessor: d => {
                    return <span title={d.wlayName}>{d.wlayName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="wlayName" placeholder={this.props.t("utilityWorkLogs:utilityWorkLogs.placeholder.worklogName")}
                        value={this.state.objectSearch.wlayName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityWorkLogs:utilityWorkLogs.label.description" />,
                id: "wlayDescription",
                accessor: d => {
                    return <span title={d.wlayDescription}>{d.wlayDescription}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="wlayDescription" placeholder={this.props.t("utilityWorkLogs:utilityWorkLogs.placeholder.description")}
                        value={this.state.objectSearch.wlayDescription} />
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.status"/>,
                id: "wlayIsActive",
                accessor: d => {
                    return <span title={d.wlayIsActive}>{(d.wlayIsActive)?this.props.t("common:common.dropdown.status.active"):this.props.t("common:common.dropdown.status.inActive")}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"wlayIsActive"}
                        label={""}
                        isRequired={false}
                        options={this.state.statusListSelect}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeStatus}
                        selectValue={this.state.selectValueStatus}
                        isOnlyInputSelect={true}
                    />
                )
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

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchUtilityWorkLogs();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.wlayType = this.state.selectValueWorkLogType.value;
        values.wlayIsActive = this.state.selectValueStatus.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityWorkLogs(true);
        });
    }

    searchUtilityWorkLogs() {
        console.log(this.state.objectSearch)
        this.props.actions.searchUtilityWorkLogs(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityWorkLogsId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityWorkLogs(utilityWorkLogsId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.odGroupTypeId === null) {
                        response.payload.data.odGroupTypeId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.getDetail"));
            });
        }
    }

    closeAddOrEditPage(isAddOrEdit) {
        this.setState({
            isAddOrEditVisible: false,
            isAddOrEdit: null
        }, () => {
            if (isAddOrEdit === "ADD" || isAddOrEdit === "COPY") {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchUtilityWorkLogs();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityWorkLogs();
            }
        });
    }
    // confirmDelete(utilityWorkLogsId, utilityWorkLogsCode) {
    //     confirmAlertDelete(this.props.t("utilityWorkLogs:utilityWorkLogs.message.confirmDelete", { utilityWorkLogsCode: utilityWorkLogsCode }),
    //         () => {
    //             this.props.actions.deleteUtilityWorkLogs(utilityWorkLogsId).then((response) => {
    //                 if (response.payload.data.key === "SUCCESS") {
    //                     this.searchUtilityWorkLogs();
    //                     toastr.success(this.props.t("utilityWorkLogs:utilityWorkLogs.message.success.delete"));
    //                 } else {
    //                     toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.delete"));
    //                 }
    //             }).catch((response) => {
    //                 toastr.error(this.props.t("utilityWorkLogs:utilityWorkLogs.message.error.delete"));
    //             });
    //         }
    //     );
    // }

    handleItemSelectChangeWorkLogType(option) {
        this.setState({ selectValueWorkLogType: option });
    }
    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityWorkLogsAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <div className="animated fadeIn">
                        <AvForm onSubmit={this.search} model={objectSearch}>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                    title={t("utilityWorkLogs:utilityWorkLogs.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityWorkLogs:utilityWorkLogs.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <SettingTableLocal
                                                    columns={columns}
                                                    onChange={this.handleChangeLocalColumnsTable}
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            <CustomReactTableSearch
                                                onRef={ref => (this.customReactTableSearch = ref)}
                                                columns={columns}
                                                data={data}
                                                pages={pages}
                                                loading={loading}
                                                onFetchData={this.onFetchData}
                                                defaultPageSize={10}
                                                isCheckbox={false}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                    </div>
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityWorkLogs, common } = state;
    return {
        response: { utilityWorkLogs, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityWorkLogsActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityWorkLogsList));