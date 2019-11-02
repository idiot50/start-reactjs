import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigTempImportActions from './UtilityConfigTempImportActions';
import UtilityConfigTempImportAddEdit from "./UtilityConfigTempImportAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityConfigTempImportList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityConfigTempImport = this.searchUtilityConfigTempImport.bind(this);
        this.search = this.search.bind(this);
        // this.confirmDelete = this.confirmDelete.bind(this);
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
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
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
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.tempImportId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.tempImportId)}>
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
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.fileCode" />,
                id: "code",
                accessor: d => {
                    return <span title={d.code}>{d.code}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="code" placeholder={this.props.t("utilityConfigTempImport:utilityConfigTempImport.placeholder.fileCode")}
                        value={this.state.objectSearch.code} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.fileName" />,
                id: "name",
                accessor: d => {
                    return <span title={d.name}>{d.name}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="name" placeholder={this.props.t("utilityConfigTempImport:utilityConfigTempImport.placeholder.fileName")}
                        value={this.state.objectSearch.name} />
                ),
                Cell: ({ original }) => {
                    return (
                        <Button style={{ paddingLeft: '0px' }} color="link" onClick={() => this.downloadFileByPath({ filePath: original.path })} ><span title={original.name}>{original.name}</span></Button>
                    )
                }
            },
            {
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.path" />,
                id: "path",
                accessor: d => {
                    return <span title={d.path}>{d.path}</span>
                },
                Filter: ({ filter, onChange }) => (null)
            },
            {
                Header: <Trans i18nKey="utilityConfigTempImport:utilityConfigTempImport.label.description" />,
                id: "title",
                accessor: d => {
                    return <span title={d.title}>{d.title}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="title" placeholder={this.props.t("utilityConfigTempImport:utilityConfigTempImport.placeholder.description")}
                        value={this.state.objectSearch.title} />
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
            },

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
            this.searchUtilityConfigTempImport();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.code = values.code ? values.code.trim() : "";
        objectSearch.name = values.name ? values.name.trim() : "";
        objectSearch.path = values.path ? values.path.trim() : "";
        objectSearch.title = values.title ? values.title.trim() : "";
        objectSearch.isActive = this.state.selectValueActive.value;
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigTempImport(true);
        });
    }

    searchUtilityConfigTempImport(isSearchClicked = false) {
        this.props.actions.searchUtilityConfigTempImport(this.state.objectSearch).then((response) => {
            let tempList = response.payload.data.data ?
                response.payload.data.data.map(i => ({ ...i, isActiveName: i.isActive === 1 ? this.props.t("common:common.dropdown.status.active") : i.isActive === 0 ? this.props.t("common:common.dropdown.status.inActive") : null }))
                : [];
            this.setState({
                data: tempList,
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
            toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityConfigTempImportId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityConfigTempImport(utilityConfigTempImportId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.getDetail"));
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
                    this.searchUtilityConfigTempImport();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityConfigTempImport();
            }
        });
    }
    // confirmDelete(utilityConfigTempImportId, utilityConfigTempImportCode) {
    //     confirmAlertDelete(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.required.confirmDelete", { utilityConfigTempImportCode: utilityConfigTempImportCode }),
    //         () => {
    //             this.props.actions.deleteUtilityConfigTempImport(utilityConfigTempImportId).then((response) => {
    //                 if (response.payload.data.key === "SUCCESS") {
    //                     this.searchUtilityConfigTempImport();
    //                     toastr.success(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.success.delete"));
    //                 } else {
    //                     toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.delete"));
    //                 }
    //             }).catch((response) => {
    //                 toastr.error(this.props.t("utilityConfigTempImport:utilityConfigTempImport.message.error.delete"));
    //             });
    //         }
    //     );
    // }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            const obj = this.state.objectSearch;
            delete obj['custom-input-isActive']
            this.props.actions.onExportFile("cr_cat", "CR_TEMP_IMPORT", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    downloadFileByPath(data) {
        this.props.actions.onDownloadFileByPath('cr_cat', data).then((response) => {
            toastr.success(this.props.t("common:common.message.success.downloadFile"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.downloadFile"));
        });
    }

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
                    <UtilityConfigTempImportAddEdit
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
                                                    title={t("utilityConfigTempImport:utilityConfigTempImport.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigTempImport:utilityConfigTempImport.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityConfigTempImport:utilityConfigTempImport.button.export")}
                                                    onClick={() => this.onExport()}><i className="fa fa-download"></i>
                                                </LaddaButton>
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
    const { utilityConfigTempImport, common } = state;
    return {
        response: { utilityConfigTempImport, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigTempImportActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigTempImportList));