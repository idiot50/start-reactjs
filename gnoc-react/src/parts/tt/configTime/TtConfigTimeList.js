import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as TtConfigTimeActions from './TtConfigTimeActions';
import TtConfigTimeAddEdit from "./TtConfigTimeAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { convertDateToDDMMYYYYHHMISS, validSubmitForm, confirmAlertDelete } from "../../../containers/Utils/Utils";

class TtConfigTimeList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchTtConfigTime = this.searchTtConfigTime.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);
        this.handleItemSelectChangeCountry = this.handleItemSelectChangeCountry.bind(this);
        this.handleItemSelectChangeTypeId = this.handleItemSelectChangeTypeId.bind(this);
        this.handleItemSelectChangeSubCategory = this.handleItemSelectChangeSubCategory.bind(this);
        this.handleItemSelectChangePriority = this.handleItemSelectChangePriority.bind(this);
        this.handleItemSelectChangeIscall = this.handleItemSelectChangeIscall.bind(this);

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
            selectValueCountry: {},
            selectValueTypeId: {},
            selectValueSubCategory: {},
            selectValuePriority: {},
            selectValueIscall: {},
            loopVersion: false
        };
    }

    componentDidMount() {
        // get combobox
        this.props.actions.getItemMaster("GNOC_COUNTRY", "itemId", "itemName", "1", "3"); // quốc gia
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3"); // mảng sự cố
        this.props.actions.getItemMaster("TT_PRIORITY", "itemId", "itemName", "1", "3"); // độ ưu tiên
        this.getSubCategory();
    }

    componentDidUpdate() {
        if (this.state.loopVersion) {
            this.getSubCategory();
            this.setState({
                loopVersion: false
            })
        }
    }

    getSubCategory = () => {
        let subCategoryList = [];
        let typeId = (this.state.selectValueTypeId && this.state.selectValueTypeId.value) ? this.state.selectValueTypeId.value : null;
        if (typeId === null)  {
            this.setState({subCategoryList :[]})
        } else {
            this.props.actions.getListSubCategory(typeId).then((response) => {
                for (const obj of response.payload.data) {
                    if (!subCategoryList.find((e) => e.itemId === obj.itemId)) {
                        subCategoryList.push({itemId: obj.itemId, itemName: obj.itemName});
                    }
                }
                this.setState({
                    subCategoryList
                })
            })
        }
        
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.action" />,
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
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.ttConfigTimeCode)}>
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
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.country" />,
                id: "countryName",
                minWidth: 150,
                accessor: d => {
                    return d.countryName ? <span title={d.countryName}>{d.countryName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"country"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.gnocCountry && this.props.response.common.gnocCountry.payload) ? this.props.response.common.gnocCountry.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCountry}
                        selectValue={this.state.selectValueCountry}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.typeId" />,
                id: "typeName",
                minWidth: 300,
                accessor: d => {
                    return d.typeName ? <span title={d.typeName}>{d.typeName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"typeId"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeTypeId}
                        selectValue={this.state.selectValueTypeId}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.subCategoryId" />,
                id: "subCategoryName",
                minWidth: 300,
                accessor: d => {
                    return d.subCategoryName ? <span title={d.subCategoryName}>{d.subCategoryName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"subCategoryId"}
                        label={""}
                        isRequired={false}
                        options={this.state.subCategoryList ? this.state.subCategoryList : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeSubCategory}
                        selectValue={this.state.selectValueSubCategory}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.ttPriority" />,
                id: "priorityName",
                minWidth: 200,
                accessor: d => {
                    return d.priorityName ? <span title={d.priorityName}>{d.priorityName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"priorityId"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.ttPriority && this.props.response.common.ttPriority.payload) ? this.props.response.common.ttPriority.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangePriority}
                        selectValue={this.state.selectValuePriority}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.createTtTime" />,
                id: "createTtTime",
                width: 250,
                accessor: d => {
                    return <span title={d.createTtTime}>{d.createTtTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.processTtTime" />,
                id: "processTtTime",
                width: 300,
                accessor: d => {
                    return <span title={d.processTtTime}>{d.processTtTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.timeStationVip" />,
                id: "timeStationVip",
                width: 250,
                accessor: d => {
                    return <span title={d.timeStationVip}>{d.timeStationVip}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.timeWoVip" />,
                id: "timeWoVip",
                width: 250,
                accessor: d => {
                    return <span title={d.timeWoVip}>{d.timeWoVip}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.closeTtTime" />,
                id: "closeTtTime",
                width: 250,
                accessor: d => {
                    return <span title={d.closeTtTime}>{d.closeTtTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.processWoTime" />,
                id: "processWoTime",
                width: 150,
                accessor: d => {
                    return <span title={d.processWoTime}>{d.processWoTime}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.isCall" />,
                id: "isCall",
                minWidth: 150,
                accessor: d => {
                    return d.isCall ? <span>{this.props.t("ttConfigTime:ttConfigTime.dropdown.isCall.1")}</span> : <span>{this.props.t("ttConfigTime:ttConfigTime.dropdown.isCall.0")}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"isCall"}
                        label={""}
                        isRequired={false}
                        options={[
                            { itemId: 1, itemName: this.props.t("ttConfigTime:ttConfigTime.dropdown.isCall.1") },
                            { itemId: 0, itemName: this.props.t("ttConfigTime:ttConfigTime.dropdown.isCall.0") }
                        ]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeIscall}
                        selectValue={this.state.selectValueIscall}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.lastUpdateTime" />,
                id: "lastUpdateTime",
                width: 200,
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}>{convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.timeAboutOverdue" />,
                id: "timeAboutOverdue",
                width: 250,
                accessor: d => {
                    return <span title={d.timeAboutOverdue}>{d.timeAboutOverdue}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.cdAudioName" />,
                id: "cdAudioName",
                width: 200,
                accessor: d => {
                    return <span title={d.cdAudioName}>{d.cdAudioName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="ttConfigTime:ttConfigTime.label.ftAudioName" />,
                id: "ftAudioName",
                width: 200,
                accessor: d => {
                    return <span title={d.ftAudioName}>{d.ftAudioName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
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
        } else {
            sortName = "typeName";
            sortType = "asc";
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
            this.searchTtConfigTime();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        validSubmitForm(event, values, "idFormSearch");
        values.country = this.state.selectValueCountry.code;
        values.typeId = this.state.selectValueTypeId.value;
        values.subCategoryId = this.state.selectValueSubCategory.value;
        values.priorityId = this.state.selectValuePriority.value;
        values.isCall = this.state.selectValueIscall.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchTtConfigTime(true);
        });
    }

    searchTtConfigTime(isSearchClicked = false) {
        this.props.actions.searchTtConfigTime(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.search"));
        });
    }

    openAddOrEditPage(value, ttConfigTimeId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value,
                selectedData: {isCall: false, isStationVip: false}
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailTtConfigTime(ttConfigTimeId).then((response) => {
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
                    toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.getDetail"));
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
                    this.searchTtConfigTime();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchTtConfigTime();
            }
        });
    }

    confirmDelete(ttConfigTimeId, ttConfigTimeCode) {
        confirmAlertDelete(this.props.t("ttConfigTime:ttConfigTime.message.confirmDelete", { ttConfigTimeCode: ttConfigTimeCode }),
        () => {
            this.props.actions.deleteTtConfigTime(ttConfigTimeId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchTtConfigTime();
                    toastr.success(this.props.t("ttConfigTime:ttConfigTime.message.success.delete"));
                } else {
                    toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttConfigTime:ttConfigTime.message.error.delete"));
            });
        });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "tt_cat",
            moduleName: "CFG_TIME_TROUBLE_PROCESS_MANAGEMENT"
        });
    }

    closeImportModal() {
        this.setState({
            importModal: false,
            client: null,
            moduleName: null
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("tt_cat", "CFG_TIME_TROUBLE_PROCESS_MANAGEMENT", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeCountry(option) {
        this.setState({ selectValueCountry: option });
    }
    handleItemSelectChangeTypeId(option) {
        this.setState({ 
            selectValueTypeId: option,
            loopVersion: true,
            selectValueSubCategory: {}
        });
    }
    handleItemSelectChangeSubCategory(option) {
        this.setState({ selectValueSubCategory: option });
    }
    handleItemSelectChangePriority(option) {
        this.setState({ selectValuePriority: option });
    }
    handleItemSelectChangeIscall(option) {
        this.setState({ selectValueIscall: option });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <TtConfigTimeAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <div className="animated fadeIn">
                        <AvForm id="idFormSearch" onSubmit={this.search} model={objectSearch}>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                    title={t("ttConfigTime:ttConfigTime.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ttConfigTime:ttConfigTime.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ttConfigTime:ttConfigTime.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("ttConfigTime:ttConfigTime.button.export")}
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
                    <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.searchTtConfigTime}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { ttConfigTime, common } = state;
    return {
        response: { ttConfigTime, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtConfigTimeActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtConfigTimeList));