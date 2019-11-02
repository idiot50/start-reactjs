import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityStatusConfigActions from './UtilityStatusConfigActions';
import UtilityStatusConfigAddEdit from "./UtilityStatusConfigAddEdit";
import { CustomReactTableSearch, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityStatusConfigList extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityStatusConfig = this.searchUtilityStatusConfig.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleKeyDownForm = this.handleKeyDownForm.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.onExport = this.onExport.bind(this);

        this.state = {
            collapseFormSearchAdvance: false,
            btnSearchLoading: false,
            btnExportLoading: false,
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
            selectValueBeginState: {},
            selectValueEndState: {},
            selectValueProcess: {},
            stateList: [],
        };
    }

    componentDidMount() {
        this.props.actions.getListProcess();
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityStatusConfig:utilityStatusConfig.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: (d) => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.id)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.processName)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.id)}>
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
                Header: <Trans i18nKey="utilityStatusConfig:utilityStatusConfig.label.procedure" />,
                id: "process",
                width: 250,
                accessor: d => {
                    return <span title={d.processName}>{d.processName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"process"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.utilityStatusConfig.listProcess && this.props.response.utilityStatusConfig.listProcess.payload) ? this.props.response.utilityStatusConfig.listProcess.payload.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeProcess}
                        selectValue={this.state.selectValueProcess}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityStatusConfig:utilityStatusConfig.label.initialStatus" />,
                id: "beginStateName",
                width: 250,
                accessor: d => {
                    return <div ><span title={d.beginStateName} >{d.beginStateName}</span></div>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"beginStateName"}
                        label={""}
                        isRequired={false}
                        options={this.state.stateList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeBeginState}
                        selectValue={this.state.selectValueBeginState}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityStatusConfig:utilityStatusConfig.label.lastStatus" />,
                id: "endStateName",
                width: 200,
                accessor: d => {
                    return <div >
                        <span title={d.endStateName}>{d.endStateName}</span></div>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"endStateName"}
                        label={""}
                        isRequired={false}
                        options={this.state.stateList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeEndState}
                        selectValue={this.state.selectValueEndState}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityStatusConfig:utilityStatusConfig.label.description" />,
                id: "description",
                minWidth: 200,
                accessor: d => {
                    return <div ><span title={d.description}>{d.description}</span></div>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="description" placeholder={this.props.t("utilityStatusConfig:utilityStatusConfig.placeholder.initialStatus")} />
                )
            },
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
            this.searchUtilityStatusConfig();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.beginStateId = (this.state.selectValueBeginState && this.state.selectValueBeginState.value) ? this.state.selectValueBeginState.value : "";
        objectSearch.endStateId = (this.state.selectValueEndState && this.state.selectValueEndState.value) ? this.state.selectValueEndState.value : "";
        objectSearch.process = (this.state.selectValueProcess && this.state.selectValueProcess.value) ? this.state.selectValueProcess.value : "";
        objectSearch.description = values.description.length !== 0 ? values.description.trim() : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityStatusConfig(true);
        });
    }

    searchUtilityStatusConfig(isSearchClicked = false) {
        this.props.actions.searchUtilityStatusConfig(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data,
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
            toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityStatusConfigId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityStatusConfig(utilityStatusConfigId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    })
                } else {
                    toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.getDetail"));
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
                    this.searchUtilityStatusConfig();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityStatusConfig();
            }
        });
    }
    
    confirmDelete(utilityStatusConfigId, utilityStatusConfigCode) {
        confirmAlertDelete(this.props.t("utilityStatusConfig:utilityStatusConfig.message.confirmDelete", { utilityStatusConfigCode: utilityStatusConfigCode }),
            () => {
                this.props.actions.deleteWoMapProvinceCdGroup(utilityStatusConfigId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityStatusConfig();
                        toastr.success(this.props.t("utilityStatusConfig:utilityStatusConfig.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityStatusConfig:utilityStatusConfig.message.error.delete"));
                });
            }
        );
    }


    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("stream", "TRANSITION_STATE_CONFIG", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeProcess = (option) => {
        this.setState({ selectValueProcess: option });
        if (option && option.value) {
            this.props.actions.getListState(option.value).then((response) => {
                this.setState({
                    selectValueBeginState: {},
                    selectValueEndState: {},
                    stateList: response.payload.data
                })
            })

        }
    }
    handleItemSelectChangeBeginState = (option) => {
        this.setState({ selectValueBeginState: option });
    }
    handleItemSelectChangeEndState = (option) => {
        this.setState({ selectValueEndState: option });
    }

    handleKeyDownForm(event) {
        if (event.key === 'Enter') {
            this.setState({
                isSearchClicked: false
            });
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityStatusConfigAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <div className="animated fadeIn">
                        <AvForm onSubmit={this.search} model={objectSearch} onKeyDown={this.handleKeyDownForm} ref={el => this.myFormRef = el} >
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                    title={t("utilityStatusConfig:utilityStatusConfig.placeholder.searchAll")} value={this.state.objectSearch.searchAll} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityStatusConfig:utilityStatusConfig.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityStatusConfig:utilityStatusConfig.button.export")}
                                                    onClick={() => this.onExport()}><i className="fa fa-download"></i>
                                                </LaddaButton>
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
    const { utilityStatusConfig, common } = state;
    return {
        response: { utilityStatusConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityStatusConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityStatusConfigList));