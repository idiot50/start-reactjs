import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as WoConfigWoHelpVsmartActions from './WoConfigWoHelpVsmartActions';
import WoConfigWoHelpVsmartAddEdit from "./WoConfigWoHelpVsmartAddEdit";
import { CustomReactTableSearch, CustomSelect, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class WoConfigWoHelpVsmartList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoConfigWoHelpVsmart = this.searchWoConfigWoHelpVsmart.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);

        this.state = {
            collapseFormInfo: true,
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
            isHideCombobox: null,
            //Select
            selectValueSbbSystem: {},
            selectValueTypeCbb: {},
            listCbbSystem : [],
            listTypeCbb : []
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("CFG_WO_HELP_SYSTEM", "itemId", "itemName", "1", "3").then(res => {
            this.setState({listCbbSystem: res.payload && res.payload.data ? res.payload.data.data : []})
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.action"/>,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.id)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.systemName)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.id)}>
                            <Button type="button" size="sm" className="btn-warning icon"><i className="fa fa-copy"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
                )
            },
            {
                Header: <Trans i18nKey="woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.systemName"/>,
                id: "systemName",
                width: 400,
                accessor: d => {
                    return <span title={d.systemName}>{d.systemName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"systemName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listCbbSystem}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeSbbSystem}
                        selectValue={this.state.selectValueSbbSystem}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woConfigWoHelpVsmart:woConfigWoHelpVsmart.label.typeName"/>,
                id: "typeName",
                accessor: d => {
                    return <span title={d.typeName}>{d.typeName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    this.state.isHideCombobox === null ? <div style={{ height: '2.7em' }}></div> :
                    <CustomSelect
                        name={"typeName"}
                        label={""}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeTypeCbb}
                        selectValue={this.state.selectValueTypeCbb}
                        moduleName={this.state.isHideCombobox === 1 ? "GNOC_OD_TYPE" : "GNOC_DICH_VU_WO_HELP"}
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
            this.searchWoConfigWoHelpVsmart();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.systemId = this.state.selectValueSbbSystem.value;
        values.typeId = this.state.selectValueTypeCbb.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoConfigWoHelpVsmart(true);
        });
    }

    searchWoConfigWoHelpVsmart(isSearchClicked = false) {
        this.props.actions.searchWoConfigWoHelpVsmart(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            this.setState({
                btnSearchLoading: false,
                loading: false
            });
            toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.search"));
        });
    }

    openAddOrEditPage(value, woConfigWoHelpVsmartId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailWoConfigWoHelpVsmart(woConfigWoHelpVsmartId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.id === null) {
                        response.payload.data.id = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.getDetail"));
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
                    this.searchWoConfigWoHelpVsmart();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchWoConfigWoHelpVsmart();
            }
        });
    }

    confirmDelete(woConfigWoHelpVsmartId, systemName) {
        confirmAlertDelete(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.confirmDelete", { systemName: systemName }),
        () => {
            this.props.actions.deleteWoConfigWoHelpVsmart(woConfigWoHelpVsmartId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchWoConfigWoHelpVsmart();
                    toastr.success(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.success.delete"));
                } else {
                    toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.message.error.delete"));
            });
        });
    }

    handleItemSelectChangeSbbSystem = (option) => {
        this.setState({
            selectValueSbbSystem: option,
            isHideCombobox: option.value
        });
    }

    handleItemSelectChangeTypeCbb = (option) => {
        this.setState({selectValueTypeCbb: option});
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <WoConfigWoHelpVsmartAddEdit
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
                                                title={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woConfigWoHelpVsmart:woConfigWoHelpVsmart.button.add")}
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
    const { woConfigWoHelpVsmart, common } = state;
    return {
        response: { woConfigWoHelpVsmart, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoConfigWoHelpVsmartActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoConfigWoHelpVsmartList));