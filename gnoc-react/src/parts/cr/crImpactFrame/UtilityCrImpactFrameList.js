import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityCrImpactFrameActions from './UtilityCrImpactFrameActions';
import UtilityCrImpactFrameAddEdit from "./UtilityCrImpactFrameAddEdit";
import { CustomReactTableSearch, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityCrImpactFrameList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityCrImpactFrame = this.searchUtilityCrImpactFrame.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this)
        this.state = {
            collapseFormInfo: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            //Object Search
            objectSearch: {},
            //Table
            data: [{}],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            //AddOrEditPage
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectValueStatus:{},
            statusListSelect: [
                { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
            ],
        };
    }

    componentDidMount() {
      
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityCrImpactFrame:utilityCrImpactFrame.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.impactFrameId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        {/* <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.impactFrameId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span> */}
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.impactFrameId)}>
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
                Header: <Trans i18nKey="utilityCrImpactFrame:utilityCrImpactFrame.label.frameCode"/>,
                id: "impactFrameCode",
                accessor: d => {
                    return <span title={d.impactFrameCode}>{d.impactFrameCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="impactFrameCode" placeholder={this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.frameCode")}
                    value={this.state.objectSearch.impactFrameCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrImpactFrame:utilityCrImpactFrame.label.frameName"/>,
                id: "impactFrameName",
                accessor: d => {
                    return <span title={d.impactFrameName}>{d.impactFrameName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="impactFrameName" placeholder={this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.frameName")}
                    value={this.state.objectSearch.impactFrameName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrImpactFrame:utilityCrImpactFrame.label.startTime"/>,
                id: "startTime",
                accessor: d => {
                    return <span title={d.startTime}>{d.startTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="startTime" placeholder={this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.startTime")}
                    value={this.state.objectSearch.startTime} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrImpactFrame:utilityCrImpactFrame.label.endTime"/>,
                id: "endTime",
                accessor: d => {
                    return <span title={d.endTime}>{d.endTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="endTime" placeholder={this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.endTime")}
                    value={this.state.objectSearch.endTime} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrImpactFrame:utilityCrImpactFrame.label.description"/>,
                id: "description",
                accessor: d => {
                    return <span title={d.description}>{d.description}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="description" placeholder={this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.description")}
                    value={this.state.objectSearch.description} />
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.status"/>,
                id: "isActive",
                accessor: d => {
                    return <span title={d.isActive}>{(d.isActive)?this.props.t("common:common.dropdown.status.active"):this.props.t("common:common.dropdown.status.inActive")}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"isActive"}
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

    toggleFormInfo() {
        this.setState({ collapseFormInfo: !this.state.collapseFormInfo });
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
            this.searchUtilityCrImpactFrame();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) { 
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.isActive = this.state.selectValueStatus.value ;
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityCrImpactFrame(true);
        });
    }

    searchUtilityCrImpactFrame(isSearchClicked = false) {
        this.props.actions.searchUtilityCrImpactFrame(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityCrImpactFrameId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityCrImpactFrame(utilityCrImpactFrameId).then((response) => {
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
                    toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.getDetail"));
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
                    this.searchUtilityCrImpactFrame();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityCrImpactFrame();
            }
        });
    }

    confirmDelete(utilityCrImpactFrameId) {
        confirmAlertDelete(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.confirmDelete", { utilityCrImpactFrameCode: utilityCrImpactFrameId }),
            () => {
                this.props.actions.deleteUtilityCrImpactFrame(utilityCrImpactFrameId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityCrImpactFrame();
                        toastr.success(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityCrImpactFrame:utilityCrImpactFrame.message.error.delete"));
                });
            }
        );
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
                    <UtilityCrImpactFrameAddEdit
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
                                                    title={t("utilityCrImpactFrame:utilityCrImpactFrame.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityCrImpactFrame:utilityCrImpactFrame.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <SettingTableLocal
                                                    columns={columns}
                                                    onChange={this.handleChangeLocalColumnsTable}
                                                />
                                            </div>
                                        </CardHeader>
                                        <Collapse isOpen={this.state.collapseFormInfo} id="collapseFormInfo">
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
                                        </Collapse>
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
    const { utilityCrImpactFrame, common } = state;
    return {
        response: { utilityCrImpactFrame, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrImpactFrameActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrImpactFrameList));