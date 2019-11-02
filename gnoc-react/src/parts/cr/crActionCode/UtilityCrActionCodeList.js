
import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityCrActionCodeActions from './UtilityCrActionCodeActions';
import UtilityCrActionCodeAddEdit from "./UtilityCrActionCodeAddEdit";
import { CustomReactTableSearch, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityCrActionCodeList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityCrActionCode = this.searchUtilityCrActionCode.bind(this);
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
                Header: <Trans i18nKey="utilityCrActionCode:utilityCrActionCode.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.crActionCodeId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        {/* {
                            (!d.isEditable)?
                            <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.crActionCodeId)}>
                                <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                            </span>:''
                        } */}
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.crActionCodeId)}>
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
                Header: <Trans i18nKey="utilityCrActionCode:utilityCrActionCode.label.actionCode"/>,
                id: "crActionCode",
                accessor: d => {
                    return <span title={d.crActionCode}>{d.crActionCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="crActionCode" placeholder={this.props.t("utilityCrActionCode:utilityCrActionCode.placeholder.actionCode")}
                    value={this.state.objectSearch.crActionCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityCrActionCode:utilityCrActionCode.label.actionCodeTitle"/>,
                id: "crActionCodeTittle",
                accessor: d => {
                    return <span title={d.crActionCodeTittle}>{d.crActionCodeTittle}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="crActionCodeTittle" placeholder={this.props.t("utilityCrActionCode:utilityCrActionCode.placeholder.actionCodeTitle")}
                    value={this.state.objectSearch.crActionCodeTittle} />
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
            this.searchUtilityCrActionCode();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.isActive = this.state.selectValueStatus.value;
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityCrActionCode(true);
        });
    }

    searchUtilityCrActionCode(isSearchClicked = false) {
        this.props.actions.searchUtilityCrActionCode(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityCrActionCodeId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityCrActionCode(utilityCrActionCodeId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.crActionCodeId === null) {
                        response.payload.data.crActionCodeId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.getDetail"));
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
                    this.searchUtilityCrActionCode();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityCrActionCode();
            }
        });
    }

    confirmDelete(utilityCrActionCodeId, utilityCrActionCodeCode) {
        confirmAlertDelete(this.props.t("utilityCrActionCode:utilityCrActionCode.message.confirmDelete", { utilityCrActionCodeCode: utilityCrActionCodeCode }),
            () => {
                this.props.actions.deleteUtilityCrActionCode(utilityCrActionCodeId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityCrActionCode();
                        toastr.success(this.props.t("utilityCrActionCode:utilityCrActionCode.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityCrActionCode:utilityCrActionCode.message.error.delete"));
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
                    <UtilityCrActionCodeAddEdit
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
                                                    title={t("utilityCrActionCode:utilityCrActionCode.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityCrActionCode:utilityCrActionCode.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                {/* <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityCrActionCode:utilityCrActionCode.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityCrActionCode:utilityCrActionCode.button.export")}
                                                    onClick={() => this.onExport()}><i className="fa fa-download"></i>
                                                </LaddaButton> */}
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
                    {/* <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchUtilityCrActionCode}
                        stateImportModal={this.state}/> */}
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityCrActionCode, common } = state;
    return {
        response: { utilityCrActionCode, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityCrActionCodeActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityCrActionCodeList));