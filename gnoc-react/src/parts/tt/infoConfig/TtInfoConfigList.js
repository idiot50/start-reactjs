import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

import * as commonActions from './../../../actions/commonActions';
import * as TtInfoConfigActions from './TtInfoConfigActions';
import TtInfoConfigAddEdit from "./TtInfoConfigAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class TtInfoConfigList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchTtInfoConfig = this.searchTtInfoConfig.bind(this);
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
            //Select
            selectValueType: {},
            selectValueAlarmGroup: {},
            selectValueSubCategory: {},
            alarmGroupList: [],
            subCategoryList: []
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("ALARM_GROUP", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttInfoConfig:ttInfoConfig.label.action" />,
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
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id)}>
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
                Header: <Trans i18nKey="ttInfoConfig:ttInfoConfig.label.troubleArray" />,
                id: "typeName",
                width: 250,
                accessor: d => {
                    return d.typeName ? <span title={d.typeName}>{d.typeName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"typeId"}
                        label={""}
                        isRequired={false}
                        options={
                            (this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : []
                        }
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeType}
                        selectValue={this.state.selectValueType}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttInfoConfig:ttInfoConfig.label.troubleGroup" />,
                id: "alarmGroupName",
                width: 250,
                accessor: d => {
                    return d.alarmGroupName ? <span title={d.alarmGroupName}>{d.alarmGroupName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"alarmGroupId"}
                        label={""}
                        isRequired={false}
                        options={this.state.alarmGroupList ? this.state.alarmGroupList : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeAlarmGroup}
                        selectValue={this.state.selectValueAlarmGroup}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttInfoConfig:ttInfoConfig.label.subCategory" />,
                id: "subCategoryName",
                width: 250,
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
                Header: <Trans i18nKey="ttInfoConfig:ttInfoConfig.label.troubleName" />,
                id: "troubleName",
                minWidth: 200,
                accessor: d => {
                    return d.troubleName ? <span title={d.troubleName}>{d.troubleName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="troubleName"
                        //placeholder={this.props.t("ttInfoConfig:ttInfoConfig.placeholder.troubleName")}
                        value={this.state.objectSearch.troubleName} />
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
            this.searchTtInfoConfig();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.typeId = this.state.selectValueType ? this.state.selectValueType.value : "";
        objectSearch.alarmGroupId = this.state.selectValueAlarmGroup ? this.state.selectValueAlarmGroup.value : "";
        objectSearch.subCategoryId = this.state.selectValueSubCategory ? this.state.selectValueSubCategory.value : "";
        objectSearch.troubleName = objectSearch.troubleName ? objectSearch.troubleName.trim() : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchTtInfoConfig(true);
        });
    }

    searchTtInfoConfig(isSearchClicked = false) {
        this.props.actions.searchTtInfoConfig(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.search"));
        });
    }

    openAddOrEditPage(value, ttInfoConfigId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailTtInfoConfig(ttInfoConfigId).then((response) => {
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
                    toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.getDetail"));
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
                    this.searchTtInfoConfig();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchTtInfoConfig();
            }
        });
    }

    confirmDelete(ttInfoConfigId) {
        confirmAlertDelete(this.props.t("ttInfoConfig:ttInfoConfig.message.confirmDelete", { ttInfoConfigId: ttInfoConfigId }),
            () => {
                this.props.actions.deleteTtInfoConfig(ttInfoConfigId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchTtInfoConfig();
                        toastr.success(this.props.t("ttInfoConfig:ttInfoConfig.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("ttInfoConfig:ttInfoConfig.message.error.delete"));
                });
            });
    }
    handleItemSelectChangeType = (option) => {
        this.setState({ selectValueType: option });
        if (option.value) {
            this.props.actions.getListAlarmGroup(option.value).then((response) => {
                this.setState({
                    alarmGroupList: response.payload.data
                });
            });
            this.props.actions.getListItemByCategoryAndParent("PT_SUB_CATEGORY", option.value).then((response) => {
                this.setState({
                    subCategoryList: response.payload.data
                });
            });
        } else {
            this.setState({
                alarmGroupList: [],
                subCategoryList: [],
                selectValueAlarmGroup: {},
                selectValueSubCategory: {}
            });
        }
    }
    handleItemSelectChangeAlarmGroup = (option) => {
        this.setState({ selectValueAlarmGroup: option });
    }
    handleItemSelectChangeSubCategory = (option) => {
        this.setState({ selectValueSubCategory: option });
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <TtInfoConfigAddEdit
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
                                                    title={t("ttInfoConfig:ttInfoConfig.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ttInfoConfig:ttInfoConfig.button.add")}
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
    const { ttInfoConfig, common } = state;
    return {
        response: { ttInfoConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtInfoConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtInfoConfigList));