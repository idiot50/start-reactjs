import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as WoCdGroupManagementActions from '../cdGroupManagement/WoCdGroupManagementActions';
import * as commonActions from './../../../actions/commonActions';
import * as WoMapProvinceCdGroupActions from './WoMapProvinceCdGroupActions';
import WoMapProvinceCdGroupAddEdit from "./WoMapProvinceCdGroupAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomSelect } from "../../../containers/Utils";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";

class WoMapProvinceCdGroupList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoMapProvinceCdGroup = this.searchWoMapProvinceCdGroup.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);

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
            selectValueProvince: {},
            selectValueCdGroup: {},
            listProvince: []
        };
    }

    componentDidMount() {
        this.props.actions.getListLocationProvince().then((response) => {
            const listProvince = response.payload.data && response.payload.data.map(i => ({ itemId: i.locationCode, itemName: i.locationName }))
            this.setState({
                listProvince,
            })
        });
       
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woMapProvinceCdGroup:woMapProvinceCdGroup.label.action"/>,
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
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.id)}>
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
                Header: <Trans i18nKey="woMapProvinceCdGroup:woMapProvinceCdGroup.label.province"/>,
                id: "locationName",
                width: 210,
                accessor: d => {
                    return <span title={d.locationName}>{d.locationName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"locationCode"}
                        label={""}
                        isRequired={false}
                        options={this.state.listProvince}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeProvince}
                        selectValue={this.state.selectValueProvince}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woMapProvinceCdGroup:woMapProvinceCdGroup.label.cdGroup"/>,
                id: "cdGroup",
                width: 210,
                accessor: d => {
                    return <span title={d.cdName}>{d.cdName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelect
                        name={"cdId"}
                        label={""}
                        isRequired={false}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeCdGroup}
                        selectValue={this.state.selectValueCdGroup}
                        moduleName={"GNOC_WO_CD_GROUP"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woMapProvinceCdGroup:woMapProvinceCdGroup.label.accidentInspectionDistrict"/>,
                id: "numberDistrictSc",
                width: 250,
                accessor: d => {
                    return <span title={d.numberDistrictSc}>{d.numberDistrictSc}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMapProvinceCdGroup:woMapProvinceCdGroup.label.accidentInspectionAccount"/>,
                id: "numberAccountSc",
                width: 250,
                accessor: d => {
                    return <span title={d.numberAccountSc}>{d.numberAccountSc}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMapProvinceCdGroup:woMapProvinceCdGroup.label.deployInspectionDistrict"/>,
                id: "numberDistrictTk",
                width: 250,
                accessor: d => {
                    return <span title={d.numberDistrictTk}>{d.numberDistrictTk}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woMapProvinceCdGroup:woMapProvinceCdGroup.label.deployInspectionAccount"/>,
                id: "numberAccountTk",
                width: 250,
                accessor: d => {
                    return <span title={d.numberAccountTk}>{d.numberAccountTk}</span>
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
            this.searchWoMapProvinceCdGroup();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.locationCode = this.state.selectValueProvince.value;
        values.cdId = this.state.selectValueCdGroup.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoMapProvinceCdGroup(true);
        });
    }

    searchWoMapProvinceCdGroup(isSearchClicked = false) {
        this.props.actions.searchWoMapProvinceCdGroup(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.search"));
        });
    }

    openAddOrEditPage(value, woMapProvinceCdGroupId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailWoMapProvinceCdGroup(woMapProvinceCdGroupId).then((response) => {
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
                    toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.getDetail"));
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
                    this.searchWoMapProvinceCdGroup();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchWoMapProvinceCdGroup();
            }
        });
    }

    confirmDelete(woMapProvinceCdGroupId, woMapProvinceCdGroupCode) {
        confirmAlertDelete(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.confirmDelete", { woMapProvinceCdGroupCode: woMapProvinceCdGroupCode }),
            () => {
                this.props.actions.deleteWoMapProvinceCdGroup(woMapProvinceCdGroupId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchWoMapProvinceCdGroup();
                        toastr.success(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("woMapProvinceCdGroup:woMapProvinceCdGroup.message.error.delete"));
                });
            }
        );
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "wo_cat",
            moduleName: "MAP_PROVINCE_CD"
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
            const obj = this.state.objectSearch
            delete obj['custom-input-locationCode'];
            delete obj['custom-input-cdId'];
            this.props.actions.onExportFile("wo_cat", "MAP_PROVINCE_CD", obj).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeProvince = (option) => {
        this.setState({ selectValueProvince : option })
    }

    handleItemSelectChangeCdGroup = (option) => {
        this.setState({ selectValueCdGroup : option })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <WoMapProvinceCdGroupAddEdit
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
                                                title={t("woMapProvinceCdGroup:woMapProvinceCdGroup.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woMapProvinceCdGroup:woMapProvinceCdGroup.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woMapProvinceCdGroup:woMapProvinceCdGroup.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("woMapProvinceCdGroup:woMapProvinceCdGroup.button.export")}
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
                        reloadGridData={this.searchWoMapProvinceCdGroup}
                        stateImportModal={this.state}/>
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { woMapProvinceCdGroup, common } = state;
    return {
        response: { woMapProvinceCdGroup, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoMapProvinceCdGroupActions, commonActions, WoCdGroupManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoMapProvinceCdGroupList));