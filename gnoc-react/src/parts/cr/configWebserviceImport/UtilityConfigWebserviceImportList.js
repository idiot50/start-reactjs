import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigWebserviceImportActions from './UtilityConfigWebserviceImportActions';
import UtilityConfigWebserviceImportAddEdit from "./UtilityConfigWebserviceImportAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityConfigWebserviceImportList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.search = this.search.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.searchUtilityConfigWebserviceImport = this.searchUtilityConfigWebserviceImport.bind(this);

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
            //Select
            selectValueActive: {},
            activeList:
                [
                    { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                    { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
                ]
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.webServiceId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        {/* <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.webServiceId, d.webServiceName)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span> */}
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.webServiceId)}>
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
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.webserviceName" />,
                id: "webServiceName",
                width: 250,
                accessor: d => {
                    return <span title={d.webServiceName}>{d.webServiceName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="webServiceName" placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.webserviceName")}
                        value={this.state.objectSearch.webServiceName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.URL" />,
                id: "url",
                accessor: d => {
                    return <span title={d.url}>{d.url}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="url" placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.URL")}
                        value={this.state.objectSearch.url} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.namespaceURI" />,
                id: "nameSpaceURI",
                accessor: d => {
                    return <span title={d.nameSpaceURI}>{d.nameSpaceURI}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="nameSpaceURI" placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.namespaceURI")}
                        value={this.state.objectSearch.nameSpaceURI} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.localPart" />,
                id: "localPart",
                accessor: d => {
                    return <span title={d.localPart}>{d.localPart}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="localPart" placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.localPart")}
                        value={this.state.objectSearch.localPart} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.wsClassPath" />,
                id: "webServiceClassPath",
                accessor: d => {
                    return <span title={d.webServiceClassPath}>{d.webServiceClassPath}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="webServiceClassPath" placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.wsClassPath")}
                        value={this.state.objectSearch.webServiceClassPath} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigWebserviceImport:utilityConfigWebserviceImport.label.getPortMethod" />,
                id: "getPortMethod",
                accessor: d => {
                    return <span title={d.getPortMethod}>{d.getPortMethod}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="getPortMethod" placeholder={this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.getPortMethod")}
                        value={this.state.objectSearch.getPortMethod} />
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.status" />,
                id: "isActiveName",
                accessor: d => {
                    return <span title={d.isActiveName}>{d.isActiveName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"isActive"}
                        label={""}
                        isRequired={false}
                        options={this.state.activeList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeActive}
                        selectValue={this.state.selectValueActive}
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
            this.searchUtilityConfigWebserviceImport();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.webServiceName = values.webServiceName ? values.webServiceName.trim() : "";
        objectSearch.url = values.url ? values.url.trim() : "";
        objectSearch.nameSpaceURI = values.nameSpaceURI ? values.nameSpaceURI.trim() : "";
        objectSearch.localPart = values.localPart ? values.localPart.trim() : "";
        objectSearch.webServiceClassPath = values.webServiceClassPath ? values.webServiceClassPath.trim() : "";
        objectSearch.getPortMethod = values.getPortMethod ? values.getPortMethod.trim() : "";
        objectSearch.userName = values.userName ? values.userName.trim() : "";
        objectSearch.password = values.password ? values.password.trim() : "";
        objectSearch.isActive = this.state.selectValueActive.value;
        objectSearch.page = 1;
        delete objectSearch['custom-input-isActive'];
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigWebserviceImport(true);
        });
    }

    searchUtilityConfigWebserviceImport(isSearchClicked = false) {
        this.props.actions.searchUtilityConfigWebserviceImport(this.state.objectSearch).then((response) => {
            let tempData = response.payload.data.data ?
                response.payload.data.data.map(i => ({
                    ...i, isActiveName: i.isActive === 1 ? this.props.t("common:common.dropdown.status.active")
                        : i.isActive === 0 ? this.props.t("common:common.dropdown.status.inActive") : null
                })) : [];
            this.setState({
                data: tempData,
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
            toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.search"));
        });
    }


    openAddOrEditPage(value, utilityConfigWebserviceImportId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityConfigWebserviceImport(utilityConfigWebserviceImportId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.webServiceId === null) {
                        response.payload.data.webServiceId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.getDetail"));
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
                    this.searchUtilityConfigWebserviceImport();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityConfigWebserviceImport();
            }
        });
    }

    // confirmDelete(utilityConfigWebserviceImportId, utilityConfigWebserviceImportCode) {
    //     confirmAlertDelete(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.confirmDelete", { utilityConfigWebserviceImportCode: utilityConfigWebserviceImportCode }),
    //         () => {
    //             this.props.actions.deleteUtilityConfigWebserviceImport(utilityConfigWebserviceImportId).then((response) => {
    //                 if (response.payload.data.key === "SUCCESS") {
    //                     this.searchUtilityConfigWebserviceImport();
    //                     toastr.success(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.success.delete"));
    //                 } else {
    //                     toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.delete"));
    //                 }
    //             }).catch((response) => {
    //                 toastr.error(this.props.t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.message.error.delete"));
    //             });
    //         }
    //     );
    // }

    handleItemSelectChangeActive = (option) => {
        this.setState({
            selectValueActive: option
        })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityConfigWebserviceImportAddEdit
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
                                                    title={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigWebserviceImport:utilityConfigWebserviceImport.button.add")}
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
    const { utilityConfigWebserviceImport, common } = state;
    return {
        response: { utilityConfigWebserviceImport, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigWebserviceImportActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigWebserviceImportList));