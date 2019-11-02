import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as WoCdGroupManagementActions from './WoCdGroupManagementActions';
import WoCdGroupManagementAddEdit from "./WoCdGroupManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField, MoreButtonTable } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertInfo, confirmAlertDelete } from '../../../containers/Utils/Utils';

class WoCdGroupManagementList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoCdGroupManagement = this.searchWoCdGroupManagement.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.toggleExport = this.toggleExport.bind(this);
        this.onExport = this.onExport.bind(this);

        this.state = {
            collapseFormInfo: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            popoverOpenExport: false,
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
            assignment: null,
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectValueWoGroupType: {},
            selectValueMarket: {},
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("WO_CD_GROUP_TYPE", "itemId", "itemName", "1", "3")
        this.props.actions.getItemMaster("GNOC_COUNTRY", "itemId", "itemName", "1", "3");
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 180,
                accessor: (d) => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        {
                            d.isEnable ?
                                <span title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.unlock")} onClick={() => this.confirmLockOrUnlock("LOCK", d)}>
                                    <i className="fa fa-unlock-alt" style={{ cursor: 'pointer', verticalAlign: 'bottom', fontSize: '1.6rem', marginRight: '5px', color: '#4dbd74' }}></i>
                                </span>
                                :
                                <span title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.lock")} onClick={() => this.confirmLockOrUnlock("UNLOCK", d)}>
                                    <i className="fa fa-lock" style={{ cursor: 'pointer', verticalAlign: 'bottom', fontSize: '1.6rem', marginRight: '5px' }}></i>
                                </span>
                        }
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", "", d.woGroupId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.woGroupId, d.woGroupCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", "", d.woGroupId)}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1"><i className="fa fa-copy"></i></Button>
                        </span>
                        <MoreButtonTable targetId={d.woGroupId + ""}>
                            <span title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.assignmentUser")}>
                                <Button type="button" size="sm" className="btn-info icon mr-1" onClick={() => this.openAddOrEditPage("EDIT", "USER", d.woGroupId)}><i className="fa fa-user" ></i></Button>
                            </span>
                            <span title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.assignmentUnit")}>
                                <Button type="button" size="sm" className="btn-info icon mr-1" onClick={() => this.openAddOrEditPage("EDIT", "UNIT", d.woGroupId)} ><i className="fa fa-users"></i></Button>
                            </span>
                            <span title={this.props.t("woCdGroupManagement:woCdGroupManagement.button.assignmentWork")}>
                                <Button type="button" size="sm" className="btn-info icon mr-1" onClick={() => this.openAddOrEditPage("EDIT", "WORK", d.woGroupId)}><i className="fa fa-file" ></i></Button>
                            </span>
                        </MoreButtonTable>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.cdGroupCode" />,
                id: "woGroupCode",
                width: 250,
                accessor: d => {
                    return <span title={d.woGroupCode}>{d.woGroupCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="woGroupCode" placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.cdGroupCode")}
                        value={this.state.objectSearch.woGroupCode} />
                )
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.cdGroupName" />,
                id: "woGroupName",
                width: 250,
                accessor: d => {
                    return <span title={d.woGroupName}>{d.woGroupName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="woGroupName" placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.cdGroupName")}
                        value={this.state.objectSearch.woGroupName} />
                )
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.cdGroupLevel" />,
                id: "groupTypeName",
                width: 250,
                accessor: d => {
                    return d.groupTypeName ? <span title={d.groupTypeName}>{d.groupTypeName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"groupTypeName"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.woCdGroupType && this.props.response.common.woCdGroupType.payload) ? this.props.response.common.woCdGroupType.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeWoGroupType}
                        selectValue={this.state.selectValueWoGroupType}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.market" />,
                id: "nationName",
                minWidth: 200,
                accessor: d => {
                    return d.nationName ? <span title={d.nationName}>{d.nationName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"nationName"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.gnocCountry && this.props.response.common.gnocCountry.payload) ? this.props.response.common.gnocCountry.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeMarket}
                        selectValue={this.state.selectValueMarket}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.email" />,
                id: "email",
                minWidth: 200,
                accessor: d => {
                    return d.email ? <span title={d.email}>{d.email}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="email" placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.email")}
                        value={this.state.objectSearch.email} />
                )
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.phoneNumber" />,
                id: "mobile",
                minWidth: 200,
                accessor: d => {
                    return d.mobile ? <span title={d.mobile}>{d.mobile}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="mobile" placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.phoneNumber")}
                        value={this.state.objectSearch.mobile} />
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
            this.searchWoCdGroupManagement();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.searchAll = values.searchAll.trim() || "";
        objectSearch.woGroupCode = values.woGroupCode.trim() || "";
        objectSearch.woGroupName = values.woGroupName.trim() || "";
        objectSearch.groupTypeId = (this.state.selectValueWoGroupType && this.state.selectValueWoGroupType.subValue) ? parseInt(this.state.selectValueWoGroupType.subValue) : "";
        objectSearch.nationId = this.state.selectValueMarket.value || "";
        objectSearch.page = 1;
        delete objectSearch['custom-input-groupTypeName'];
        delete objectSearch['custom-input-nationName'];
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoCdGroupManagement(true);
        });
    }

    searchWoCdGroupManagement(isSearchClicked = false) {
        this.props.actions.searchWoCdGroupManagement(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.search"));
        });
    }

    confirmLockOrUnlock(type, woCdGroupManagement) {
        if (type === "LOCK") {
            confirmAlertInfo(this.props.t("woCdGroupManagement:woCdGroupManagement.message.lock", { woCdGroupManagementCode: woCdGroupManagement.woGroupCode }),
                this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
                () => {
                    this.props.actions.updateStatusWoCdGroupManagement({ woGroupId: woCdGroupManagement.woGroupId, isEnable: 0 }).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.searchWoCdGroupManagement();
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.lock"));
                        } else {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.lock"));
                        }
                    }).catch((response) => {
                        toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.lock"));
                    });
                }, () => {

                });
        } else if (type === "UNLOCK") {
            confirmAlertInfo(this.props.t("woCdGroupManagement:woCdGroupManagement.message.unlock", { woCdGroupManagementCode: woCdGroupManagement.woGroupCode }),
                this.props.t("common:common.button.yes"), this.props.t("common:common.button.no"),
                () => {
                    this.props.actions.updateStatusWoCdGroupManagement({ woGroupId: woCdGroupManagement.woGroupId, isEnable: 1 }).then((response) => {
                        if (response.payload.data.key === "SUCCESS") {
                            this.searchWoCdGroupManagement();
                            toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.unlock"));
                        } else {
                            toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.unlock"));
                        }
                    }).catch((response) => {
                        toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.unlock"));
                    });
                }, () => {

                });
        }
    }

    openAddOrEditPage = (value, assignment, woCdGroupManagementId) => {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value,
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailWoCdGroupManagement(woCdGroupManagementId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.odGroupTypeId === null) {
                        response.payload.data.odGroupTypeId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        assignment: assignment,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.getDetail"));
            });
        }
    }

    closeAddOrEditPage(isAddOrEdit) {
        this.setState({
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            assignment: null
        }, () => {
            if (isAddOrEdit === "ADD" || isAddOrEdit === "COPY") {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchWoCdGroupManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchWoCdGroupManagement();
            }
        });
    }

    confirmDelete(woCdGroupManagementId, woCdGroupManagementCode) {
        confirmAlertDelete(this.props.t("woCdGroupManagement:woCdGroupManagement.message.confirmDelete", { woCdGroupManagementCode: woCdGroupManagementCode }),
            () => {
                this.props.actions.deleteWoCdGroupManagement(woCdGroupManagementId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchWoCdGroupManagement();
                        toastr.success(this.props.t("woCdGroupManagement:woCdGroupManagement.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("woCdGroupManagement:woCdGroupManagement.message.error.delete"));
                });
            });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "wo_cat",
            moduleName: "WO_CDGROUPMANAGEMENT"
        });
    }

    closeImportModal() {
        this.setState({
            importModal: false,
            client: null,
            moduleName: null
        });
    }

    toggleExport() {
        this.setState({
            popoverOpenExport: !this.state.popoverOpenExport
        });
    }

    onExport(moduleName) {
        this.setState({
            btnExportLoading: true
        }, () => {
            let objectSearch = Object.assign({}, this.state.objectSearch);
            if (moduleName === "WO_CD") {
                objectSearch.woCdGroupDTO = {}
                objectSearch.woCdGroupDTO.woGroupCode = objectSearch.woGroupCode;
                objectSearch.woCdGroupDTO.woGroupName = objectSearch.woGroupName;
                objectSearch.woCdGroupDTO.email = objectSearch.email;
                objectSearch.woCdGroupDTO.mobile = objectSearch.mobile
                delete objectSearch.groupTypeId;
                delete objectSearch.nationId;
                delete objectSearch.woGroupCode;
                delete objectSearch.woGroupName;
                delete objectSearch.email;
                delete objectSearch.mobile;
                objectSearch = Object.assign({}, objectSearch)
            }
            this.props.actions.onExportFile("wo_cat", moduleName, objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeWoGroupType = (option) => {
        this.setState({ selectValueWoGroupType: option });
    }

    handleItemSelectChangeMarket = (option) => {
        this.setState({ selectValueMarket: option })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <WoCdGroupManagementAddEdit
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
                                                    title={t("woCdGroupManagement:woCdGroupManagement.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woCdGroupManagement:woCdGroupManagement.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("woCdGroupManagement:woCdGroupManagement.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton id="popoverExport" type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("woCdGroupManagement:woCdGroupManagement.button.export")}
                                                    onClick={() => this.toggleExport()}><i className="fa fa-download"></i>
                                                </LaddaButton>
                                                <Popover trigger="legacy" placement="bottom" isOpen={this.state.popoverOpenExport} target="popoverExport" toggle={this.toggleExport}>
                                                    <PopoverHeader><Trans i18nKey="woCdGroupManagement:woCdGroupManagement.button.export" /></PopoverHeader>
                                                    <PopoverBody>
                                                        <div><Button color="link" onClick={() => this.onExport("WO_CD_GROUP")}>{t("woCdGroupManagement:woCdGroupManagement.button.export")}</Button></div>
                                                        <div><Button color="link" onClick={() => this.onExport("WO_CD")}>{t("woCdGroupManagement:woCdGroupManagement.button.exportStaffFiles")}</Button></div>
                                                    </PopoverBody>
                                                </Popover>
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
                        reloadGridData={this.searchWoCdGroupManagement}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { woCdGroupManagement, common } = state;
    return {
        response: { woCdGroupManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoCdGroupManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoCdGroupManagementList));