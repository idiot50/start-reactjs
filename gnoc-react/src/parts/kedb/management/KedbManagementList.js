import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Collapse, Row, Label } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as KedbManagementActions from './KedbManagementActions';
import KedbManagementAddEdit from "./KedbManagementAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTable, CustomInputFilter, CustomDateTimeRangePicker, CustomMultiSelectLocal, SearchBar, CustomAvField } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import moment from 'moment';
import KedbManagementListConfigFieldPopup from './KedbManagementListConfigFieldPopup';
import { convertDateToDDMMYYYYHHMISS, validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";
import KedbManagementHistoryPopup from './KedbManagementHistoryPopup';
import KedbManagementAddEditPopup from './KedbManagementAddEditPopup';


class KedbManagementList extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeColumnsTable = this.handleChangeColumnsTable.bind(this);
        this.searchKedbManagement = this.searchKedbManagement.bind(this);
        this.search = this.search.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);
        this.getConfigSearch = this.getConfigSearch.bind(this);

        this.state = {
            btnSearchLoading: false,
            btnExportLoading: false,
            isOpenConfigFieldPopup: false,
            isOpenHistoryPopup: false,
            detailModal: false,
            isOpenPopupDetail: false,
            //Object Search
            isFirstSearchTable: true,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: props.isShowPopup ? false : true,
            columns: this.buildTableColumns(),
            deviceVersionList: [],
            //AddOrEditPage
            isAddOrEdit: null,
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectedData: null,
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {},
            selectValueVendor: {},
            selectValueParentType: {},
            selectValueType: {},
            selectValueSubCategoryId: {},
            selectValueKedbStateName: [],
            softVersionList: [],
            hardVersionList: [],
            objConfigSearch: {},
            collapseFormSearch: false,
            createTimeFromSearch: this.props.isShowPopup ? null : moment().subtract(1, 'year'),
            createTimeToSearch: this.props.isShowPopup ? null : moment().set({hour:23,minute:59,second:59,millisecond:0}),
            enableContent: false,
            loopVersion: false,
            isAuth: false,
            stateListDefault: [],
            isGetSubCategory: false
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("PT_TT_RELATED", "itemId", "itemName", "1", "3")
        this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3")
        this.props.actions.getItemMaster("VENDOR", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("ARRAY_BHKN", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("KEDB_STATE", "itemId", "itemName", "1", "3").then((response) => {
            const stateArr = ["KEDB_OPEN", "KEDB_CREATE_APPROVE", "KEDB_UPDATE_APPROVE", "KEDB_CLOSED"];
            let stateListDefault = [];
            for (const state of response.payload.data.data) {
                if (stateArr.includes(state.itemCode)) {
                    stateListDefault.push({value: state.itemId, label: state.itemName});
                }
            }
            this.setState({
                stateListDefault
            }, () => {
                if (!this.props.isShowPopup) {
                    this.getConfigSearch();
                }
            });
        }).catch((error) => {
            if (!this.props.isShowPopup) {
                this.getConfigSearch();
            }
        });
        this.props.actions.getItemMaster("PT_TYPE", "itemId", "itemName", "1", "3");
        this.props.actions.getItemMaster("COMPLETER", "itemId", "itemName", "1", "3");
        this.getDeviceType();
        const userRolesList =  JSON.parse(localStorage.user).rolesList.map(function(item) {
            return item['roleCode'];
        });
        if (!userRolesList.includes("ADMIN_KEDB") && !userRolesList.includes("SUB_ADMIN_KEDB") && !userRolesList.includes("USER_KEDB")) {
            this.setState({ isAuth: true });
        }
    }

    componentDidUpdate() {
        if (this.state.loopVersion) {
            this.getDeviceType();
            this.setState({
                loopVersion: false
            })
        }
        if (this.state.isGetSubCategory) {
            if(this.state.selectValueType.value) {
                this.props.actions.getItemMaster("PT_SUB_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
                    let subCategoryList = [];
                    for (const obj of response.payload.data.data) {
                        if(obj.parentItemId + "" === this.state.selectValueType.value + "") {
                            subCategoryList.push(obj);
                        }
                    }
                    this.setState({
                        subCategoryList,
                        isGetSubCategory: false
                    });
                });
            }
        }
    }

    getDeviceType = () => {
        let softVersionList = [];
        let hardVersionList = [];
        let objectVersion = {
            vendorId: (this.state.selectValueVendor && this.state.selectValueVendor.value) ? this.state.selectValueVendor.value : null,
            typeId : (this.state.selectValueNodeType && this.state.selectValueNodeType.value) ? this.state.selectValueNodeType.value : null
        }
        this.props.actions.getListDeviceVersion(objectVersion).then((response) => {
            for (const obj of response.payload.data) {
                if(!softVersionList.find((e) => e.itemId === obj.softwareVersion)) {
                    softVersionList.push({ itemId: obj.softwareVersion, itemName: obj.softwareVersion });
                }
                if(!hardVersionList.find((e) => e.itemId === obj.hardwareVersion)) {
                    hardVersionList.push({ itemId: obj.hardwareVersion, itemName: obj.hardwareVersion });
                }
            }
            this.setState({
                softVersionList,
                hardVersionList,
            })
        })
    }

    toggleFormSearch = () => {
        this.setState({ collapseFormSearch: !this.state.collapseFormSearch });
    }

    buildTableColumns() {
        return [
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.action"),
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                show: !this.props.isShowPopup,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.kedbId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-gear"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.title.detail")} onClick={() => this.openAddOrEditPage("DETAIL", d.kedbId)}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1"><i className="fa fa-info-circle"></i></Button>
                        </span>
                        <span title={this.props.t("kedbManagement:kedbManagement.title.history")} onClick={() => this.openHistoryPopup(d.kedbId)} >
                            <Button type="button" size="sm" className="btn-success icon"><i className="fa fa-history"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.kedbCode"),
                id: "kedbCode",
                width: 250,
                accessor: d => {
                    if (this.props.isShowPopup) {
                        return <span title={d.kedbCode} style={{ cursor: 'pointer', color: 'rgb(32, 168, 216)', textDecoration: 'underline' }} onClick={() => this.openPopupDetail("DETAIL", d)}>{d.kedbCode}</span>
                    } else {
                        return <span title={d.kedbCode}>{d.kedbCode}</span>
                    }
                },
                Filter: ({ filter, onChange }) => {
                    let kedbCode = (this.state.objConfigSearch.kedbCode && this.state.objConfigSearch.kedbCode.value) ? this.state.objConfigSearch.kedbCode.value : "";
                    return (
                        <CustomInputFilter name="kedbCode" value={kedbCode}
                        placeholder={this.props.t("kedbManagement:kedbManagement.placeholder.kedbCode")} />
                    );
                }
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.kedbName"),
                id: "kedbName",
                width: 200,
                accessor: d => <span title={d.kedbName}>{d.kedbName}</span>,
                Filter: ({ filter, onChange }) => {
                    let kedbName = (this.state.objConfigSearch.kedbName && this.state.objConfigSearch.kedbName.value) ? this.state.objConfigSearch.kedbName.value : "";
                    return (
                        <CustomInputFilter name="kedbName" value={kedbName}
                        placeholder={this.props.t("kedbManagement:kedbManagement.placeholder.kedbName")} />
                    );
                }
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.vendor"),
                id: "vendorName",
                width: 180,
                accessor: d => {
                    return <span title={d.vendorName}>{d.vendorName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"vendor"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.vendor && this.props.response.common.vendor.payload) ? this.props.response.common.vendor.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeVendor}
                        selectValue={this.state.selectValueVendor}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.parentTypeName"),
                id: "parentTypeName",
                width: 200,
                accessor: d => { return <span title={d.parentTypeName}>{d.parentTypeName}</span> },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"parentTypeId"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.arrayBhkn && this.props.response.common.arrayBhkn.payload) ? this.props.response.common.arrayBhkn.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeParentType}
                        selectValue={this.state.selectValueParentType}
                        isOnlyInputSelect={true}
                    />
                )
            }, 
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.typeName"),
                id: "typeName",
                width: 200,
                accessor: d => { return <span title={d.typeName}>{d.typeName}</span> },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"typeId"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.ptType && this.props.response.common.ptType.payload) ? this.props.response.common.ptType.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeType}
                        selectValue={this.state.selectValueType}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.nodeType"),
                id: "subCategoryName",
                width: 200,
                accessor: d => { return <span title={d.subCategoryName}>{d.subCategoryName}</span> },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"subCategoryId"}
                        label={""}
                        isRequired={false}
                        options={this.state.subCategoryList ? this.state.subCategoryList : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeSubCategoryId}
                        selectValue={this.state.selectValueSubCategoryId}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.status"),
                id: "kedbStateName",
                width: 200,
                accessor: d => { return <span title={d.kedbStateName}>{d.kedbStateName}</span> },
                Filter: ({ filter, onChange }) => (
                    <CustomMultiSelectLocal
                        name={"kedbState"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.kedbState && this.props.response.common.kedbState.payload) ? this.props.response.common.kedbState.payload.data.data : []}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeKedbStateName}
                        selectValue={this.state.selectValueKedbStateName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.createUserName"),
                id: "createUserName",
                width: 200,
                accessor: d => <span title={d.createUserName}>{d.createUserName}</span>,
                Filter: ({ filter, onChange }) => {
                    let createUserName = (this.state.objConfigSearch.createUserName && this.state.objConfigSearch.createUserName.value) ? this.state.objConfigSearch.createUserName.value : "";
                    return (
                        <CustomInputFilter name="createUserName" value={createUserName}
                        placeholder={this.props.t("kedbManagement:kedbManagement.placeholder.createUserName")} />
                    );
                }
            },
            {
                Header: this.props.t("kedbManagement:kedbManagement.label.createdTime"),
                id: "createdTime",
                width: 200,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>,
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"fromDate"}
                        label={""}
                        isRequired={true}
                        endDate={this.state.createTimeToSearch}
                        startDate={this.state.createTimeFromSearch}
                        handleApply={this.handleApplyCreateTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            }
        ];
    }

    handleApplyCreateTime = (event, picker) => {
        this.setState({
            createTimeFromSearch: picker.startDate,
            createTimeToSearch: picker.endDate,
        }, () => {
            if (this.state.createTimeFromSearch && this.state.createTimeToSearch) {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.fromDate = this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null;
                objectSearch.toDate = this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null;
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchKedbManagement();
                });
            }
        });
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
            if (this.props.isShowPopup) {
                if (!this.state.isFirstSearchTable) {
                    this.searchKedbManagement();
                } else {
                    this.setState({
                        loading: false
                    });
                }
            } else {
                this.searchKedbManagement();
            }
        });
    }

    handleChangeColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    clearSearchConditions = () => {
        this.setState({
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {},
            selectValueKedbStateName: this.state.stateListDefault,
            selectValueSubCategoryId: {},
            selectValueParentType: {},
            selectValueTypeId: {},
            selectValueVendor: {},
            selectValueNodeType: {},
            createTimeFromSearch: moment().subtract(1, 'year'),
            createTimeToSearch: moment().set({hour:23,minute:59,second:59,millisecond:0}),
            enableContent: false,
        }, () => {
            // this.myFormRef.reset();
            try {
                this.myFormRef._inputs.searchAll.value = "";
                document.getElementById("searchAll").value = "";
                this.myFormRef._inputs.completer.value = "";
                document.getElementById("completer").value = "";
                this.myFormRef._inputs.contentFile.value = "";
                document.getElementById("contentFile").value = "";
                document.getElementById("input-filter-kedbCode").value = "";
                document.getElementById("input-filter-kedbName").value = "";
                document.getElementById("input-filter-createUserName").value = "";
            } catch (error) {

            }
        });
    }
    
    // openDetailPage(value, kedbId) {
    //     this.props.actions.getKedbById(kedbId).then((response) => {
    //         if (response.payload && response.payload.data) {
    //             this.setState({
    //                 detailModal: true,
    //                 isAddOrEdit: value,
    //                 selectedData: response.payload.data,
    //             });
    //         } else {
    //             toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.getDetail"));
    //         }
    //     }).catch((response) => {
    //         toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.getDetail"));
    //     });
    // }

    openAddOrEditPage(value, kedbId) {
        if (value === "ADD") {
            this.setState({
                detailModal: false,
                isAddOrEdit: value,
                selectedData: {},
            });
        } else if (value === "EDIT" || value === "DETAIL") {
            this.props.actions.getKedbById(kedbId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        detailModal: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data,
                    });
                } else {
                    toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.getDetail"));
            });
        }
    }

    closeAddOrEditPage(isAddOrEdit) {
        this.setState({
            isAddOrEdit: null
        }, () => {
            if (isAddOrEdit === "ADD") {
                const objectSearch = Object.assign({}, this.state.objectSearch);
                objectSearch.page = 1;
                this.setState({
                    objectSearch
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchKedbManagement();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchKedbManagement();
            }
        });
    }

    search(event, values) {
        validSubmitForm(event, values, "idFormSearch");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);

        objectSearch.parentTypeId = this.state.selectValueParentType ? this.state.selectValueParentType.value : null;
        objectSearch.typeId = this.state.selectValueType ? this.state.selectValueType.value : null;
        objectSearch.vendor = this.state.selectValueVendor ? this.state.selectValueVendor.value : null;
        objectSearch.subCategoryId = this.state.selectValueSubCategoryId ? this.state.selectValueSubCategoryId.value : null;
        objectSearch.listKedbState = this.state.selectValueKedbStateName.map(item => Number.parseInt(item.value, 10));
        objectSearch.softwareVersion = this.state.selectValueSoftwareVersion ? this.state.selectValueSoftwareVersion.value : null;
        objectSearch.hardwareVersion = this.state.selectValueHardwareVersion ? this.state.selectValueHardwareVersion.value : null;
        objectSearch.fromDate = this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null;
        objectSearch.toDate = this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null;
        if (!this.state.enableContent) {
            delete objectSearch.contentFile;
        }
        objectSearch.page = 1;

        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch,
            isFirstSearchTable: false
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchKedbManagement(true);
        });
    }

    searchKedbManagement(isSearchClicked = false) {
        if (this.props.isShowPopup) {
            this.props.actions.searchKedbManagement(this.state.objectSearch).then((response) => {
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
                toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.search"));
            });
        } else {
            if (!this.state.isFirstSearchTable) {
                if (this.state.objectSearch.fromDate && this.state.objectSearch.toDate) {
                    this.props.actions.searchKedbManagement(this.state.objectSearch).then((response) => {
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
                        toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.search"));
                    });
                } else {
                    this.setState({
                        btnSearchLoading: false,
                        loading: false
                    });
                }
            }
        }
    }

    deleteSearchConfig = () => {
        if (this.state.objConfigSearch) {
            this.props.actions.deleteListSearchConfigUser({funcKey: "searchKedb"}).then((response) => {
                toastr.success(this.props.t("common:common.message.success.resetDefaultSearchConfigUser"));
                this.getConfigSearch();
            }).catch((error) => {
                toastr.error(this.props.t("common:common.message.error.resetDefaultSearchConfigUser"));
            });
        }
    }

    getConfigSearch = () => {
        this.props.actions.getListSearchConfigUser({funcKey: "searchKedb"}).then((response) => {
            let objConfigSearch = {};
            if (response.payload.data.length > 0) {
                for (const obj of response.payload.data) {
                    objConfigSearch[obj.fieldName] = {id: obj.searchConfigUserId, value: obj.fieldValue};
                }
            } else {
                objConfigSearch = this.buildSearchConfigDefault();
            }
            const stateList = (this.props.response.common.kedbState && this.props.response.common.kedbState.payload) ? this.props.response.common.kedbState.payload.data.data : [];
            let stateListDefault = [];
            for (const state of stateList) {
                const stateIdList = objConfigSearch.kedbState.value;
                if (stateIdList.includes(state.itemId)) {
                    stateListDefault.push({value: state.itemId, label: state.itemName});
                }
            }
            this.setState({
                objConfigSearch,
                selectValueHardwareVersion: objConfigSearch.hardwareVersion.value ? JSON.parse(objConfigSearch.hardwareVersion.value) : {},
                selectValueSoftwareVersion: objConfigSearch.softwareVersion.value ? JSON.parse(objConfigSearch.softwareVersion.value) : {},
                selectValueVendor: objConfigSearch.vendor.value ? JSON.parse(objConfigSearch.vendor.value) : {},
                selectValueParentType: objConfigSearch.parentType.value ? JSON.parse(objConfigSearch.parentType.value) : {},
                selectValueType: objConfigSearch.type.value ? JSON.parse(objConfigSearch.type.value) : {},
                selectValueSubCategoryId: objConfigSearch.subCategory.value ? JSON.parse(objConfigSearch.subCategory.value) : {},
                selectValueKedbStateName: stateListDefault || [],
                createTimeFromSearch: objConfigSearch.fromDate.value ? moment(objConfigSearch.fromDate.value) : null,
                createTimeToSearch: objConfigSearch.toDate.value ? moment(objConfigSearch.toDate.value) : null,
                enableContent: objConfigSearch.checkDescription.value === "true" ? true : false,
                isGetSubCategory: true
            }, () => {
                let values = {
                    page: 1,
                    pageSize: 10
                }
                const objectSearch = Object.assign({}, this.state.objectSearch, values);
                objectSearch.searchAll = objConfigSearch.searchAll ? objConfigSearch.searchAll.value : "";
                objectSearch.kedbCode = objConfigSearch.kedbCode ? objConfigSearch.kedbCode.value : "";
                objectSearch.kedbName = objConfigSearch.kedbName ? objConfigSearch.kedbName.value : "";
                objectSearch.createUserName = objConfigSearch.createUserName ? objConfigSearch.createUserName.value : "";
                objectSearch.vendor = this.state.selectValueVendor ? this.state.selectValueVendor.value : null;
                objectSearch.typeId = this.state.selectValueType ? this.state.selectValueType.value : null;
                objectSearch.parentTypeId = this.state.selectValueParentType ? this.state.selectValueParentType.value : null;
                objectSearch.subCategoryId = this.state.selectValueSubCategoryId ? this.state.selectValueSubCategoryId.value : null;
                objectSearch.softwareVersion = this.state.selectValueSoftwareVersion ? this.state.selectValueSoftwareVersion.value : null;
                objectSearch.hardwareVersion = this.state.selectValueHardwareVersion ? this.state.selectValueHardwareVersion.value : null;
                objectSearch.description = objConfigSearch.description ? objConfigSearch.description.value : "";
                objectSearch.completer = objConfigSearch.completer ? objConfigSearch.completer.value : "";
                objectSearch.fromDate = this.state.createTimeFromSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate()) : null;
                objectSearch.toDate = this.state.createTimeToSearch ? convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate()) : null;
                objectSearch.listKedbState = this.state.selectValueKedbStateName.map(item => Number.parseInt(item.value, 10));

                this.setState({
                    loading: true,
                    objectSearch,
                    isFirstSearchTable: false
                }, () => {
                    this.searchKedbManagement();
                });
            });
        }).catch((error) => {
            const objConfigSearch = this.buildSearchConfigDefault();
            let values = {
                page: 1,
                pageSize: 10
            }
            const objectSearch = Object.assign({}, this.state.objectSearch, values);
            objectSearch.fromDate = convertDateToDDMMYYYYHHMISS(moment(objConfigSearch.fromDate.value).toDate());
            objectSearch.toDate = convertDateToDDMMYYYYHHMISS(moment(objConfigSearch.toDate.value).toDate());
            objectSearch.listKedbState = objConfigSearch.kedbState.value;
            
            this.setState({
                loading: true,
                objectSearch,
                isFirstSearchTable: false
            }, () => {
                this.searchKedbManagement();
            });
        });
    }

    buildSearchConfigDefault = () => {
        return {
            searchAll: {value: ""},
            kedbCode: {value: ""},
            kedbName: {value: ""},
            vendor: {value: JSON.stringify({})},
            parentType: {value: JSON.stringify({})},
            type: {value: JSON.stringify({})},
            subCategory: {value: JSON.stringify({})},
            kedbState: {value: this.state.stateListDefault.map(item => Number.parseInt(item.value, 10))},
            createUserName: {value: ""},
            fromDate: {value: moment().subtract(1, 'year').toDate()},
            toDate: {value: moment().set({hour:23,minute:59,second:59,millisecond:0}).toDate()},
            softwareVersion: {value: JSON.stringify({})},
            hardwareVersion: {value: JSON.stringify({})},
            description: {value: ""},
            checkDescription: {value: "false"},
            completer: {value: ""},
        }
    }

    saveConfigSearch = () => {
        let funcKey = "searchKedb";
        let objInsertConfig = [
            {
                fieldName: "kedbCode",
                fieldValue: this.state.objectSearch.kedbCode,
            },
            {
                fieldName: "kedbName",
                fieldValue: this.state.objectSearch.kedbName,
            },
            {
                fieldName: "vendor",
                fieldValue: JSON.stringify(this.state.selectValueVendor),
            },
            {
                fieldName: "parentType",
                fieldValue: JSON.stringify(this.state.selectValueParentType),
            },
            {
                fieldName: "type",
                fieldValue: JSON.stringify(this.state.selectValueType),
            },
            {
                fieldName: "subCategory",
                fieldValue: JSON.stringify(this.state.selectValueSubCategoryId),
            },
            {
                fieldName: "kedbState",
                fieldValue: this.state.selectValueKedbStateName.map(item => item.value).join(","),
            },
            {
                fieldName: "createUserName",
                fieldValue: this.state.objectSearch.createUserName,
            },
            {
                fieldName: "fromDate",
                fieldValue: this.state.createTimeFromSearch ? this.state.createTimeFromSearch.toDate() : null,
            },
            {
                fieldName: "toDate",
                fieldValue: this.state.createTimeToSearch ? this.state.createTimeToSearch.toDate() : null,
            },
            {
                fieldName: "softwareVersion",
                fieldValue: JSON.stringify(this.state.selectValueSoftwareVersion),
            },
            {
                fieldName: "hardwareVersion",
                fieldValue: JSON.stringify(this.state.selectValueHardwareVersion),
            },
            {
                fieldName: "description",
                fieldValue: this.state.objectSearch.contentFile,
            },
            {
                fieldName: "checkDescription",
                fieldValue: this.state.enableContent,
            },
            {
                fieldName: "completer",
                fieldValue: this.state.objectSearch.completer,
            }
        ];
        this.props.actions.insertOrUpdateListSearchConfigUser({searchConfigUserDTOS: objInsertConfig, funcKey: funcKey}).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("ptProblem:ptProblem.message.success.saveSearchConfig"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("ptProblem:ptProblem.message.error.saveSearchConfig"));
            }
        }).catch((error) => {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.saveSearchConfig"));
        });
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "kedb",
            moduleName: "KEDB_MANAGEMENT"
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
            this.props.actions.onExportFile("kedb", "KEDB_MANAGEMENT", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeSoftwareVersion = (option) => {
        this.setState({
            selectValueSoftwareVersion: option
        })
    }

    handleItemSelectChangeHardwareVersion = (option) => {
        this.setState({
            selectValueHardwareVersion: option
        })
    }


    handleItemSelectChangeSubCategoryId = (option) => {
        this.setState({
            selectValueSubCategoryId: option,
            loopVersion: true,
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {}
        })
    }

    handleItemSelectChangeVendor = (option) => {
        this.setState({
            selectValueVendor: option,
            loopVersion: true,
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {}
        })
       
    }

    handleItemSelectChangeType = (option) => {
        this.setState({
            selectValueType: option,
            selectValueSubCategoryId: {},
            selectValueHardwareVersion: {},
            selectValueSoftwareVersion: {}
        });
        if (option.value) {
            let subCategoryList = [];
            this.props.actions.getListSubCategory(option.value).then((response) => {
                for (const obj of response.payload.data) {
                    subCategoryList.push(obj);
                }
                this.setState({
                    subCategoryList
                });
            });
        } else {
            this.setState({
                subCategoryList: []
            });
        }
    }

    handleItemSelectChangeKedbStateName = (option) => {
        this.setState({
            selectValueKedbStateName: option
        });
    }

    handleItemSelectChangeParentType = (option) => {
        this.setState({
            selectValueParentType: option
        })
      
    }
    toogleInputContent = () => {
        this.setState({ enableContent: !this.state.enableContent })
    }

    closeConfigFieldPopup = () => {
        this.setState({
            isOpenConfigFieldPopup: false,
        });
    }

    openConfigFieldPopup = () => {
        this.setState({
            isOpenConfigFieldPopup: true,
        });
    }
    closeHistoryPopup = () => {
        this.setState({
            isOpenHistoryPopup: false,
        });
    }

    openHistoryPopup = (kedbId) => {
        this.setState({
            isOpenHistoryPopup: true,
            selectedData: {kedbId: kedbId}
        });
    }

    handleKeyDownForm = event => {
        if(event.key === 'Enter'){
            this.setState({
                isSearchClicked: false
            });
        }
    }

    openPopupDetail(isAddOrEdit, object) {
        if (isAddOrEdit === "DETAIL") {
            this.props.actions.getKedbById(object.kedbId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isOpenPopupDetail: true,
                        selectedData: response.payload.data,
                        isAddOrEdit,
                        detailModal: false
                    });
                } else {
                    toastr.error(this.props.t("ptProbem:ptProbem.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ptProbem:ptProbem.message.error.getDetail"));
            });
        }
    }

    closePopupDetail = () => {
        this.setState({
            isOpenPopupDetail: false,
            isAddOrEdit: null,
            selectedData: {},
            detailModal: false
        });
    }

    handleInvalidSubmitAddOrEdit = (event, errors, values) => {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormSearch");
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objConfigSearch } = this.state;
        const objectSearch = {};
        let completer = (objConfigSearch.completer && objConfigSearch.completer.value) ? objConfigSearch.completer.value : "";
        let contentFile = (objConfigSearch.description && objConfigSearch.description.value) ? objConfigSearch.description.value : "";
        return (
            <CustomCSSTransition
                isVisible={["ADD", "EDIT", "DETAIL"].includes(this.state.isAddOrEdit) && !this.props.isShowPopup}
                content={
                    <KedbManagementAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state}
                        reloadPage={this.getConfigSearch} />
                }>
                <div>
                    <div className="animated fadeIn">
                        <AvForm id="idFormSearch" onKeyDown={this.handleKeyDownForm} onValidSubmit={this.search} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectSearch} ref={el => this.myFormRef = el}>
                            <div className="animated fadeIn">
                                <Row>
                                    <Col xs="12">
                                        <Card>
                                            <CardHeader>
                                                <i className="fa fa-search"></i>{t("common:common.title.advancedSearch")}
                                                <div className="card-header-actions">
                                                    <Button type="button" color="link" className="card-header-action btn-minimize" data-target="#collapseFormSearch" onClick={this.toggleFormSearch}><i className={this.state.collapseFormSearch ? "icon-arrow-up" : "icon-arrow-down"}></i></Button>
                                                </div>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.collapseFormSearch} id="collapseFormSearch">
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" sm="4">
                                                            <CustomSelectLocal
                                                                name={"softwareVersion"}
                                                                label={t("kedbManagement:kedbManagement.label.softwareVersion")}
                                                                isRequired={false}
                                                                options={this.state.softVersionList}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeSoftwareVersion}
                                                                selectValue={this.state.selectValueSoftwareVersion}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="4">
                                                            <CustomSelectLocal
                                                                name={"hardwareVersion"}
                                                                label={t("kedbManagement:kedbManagement.label.hardwareVersion")}
                                                                isRequired={false}
                                                                options={this.state.hardVersionList}
                                                                closeMenuOnSelect={true}
                                                                handleItemSelectChange={this.handleItemSelectChangeHardwareVersion}
                                                                selectValue={this.state.selectValueHardwareVersion}
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="4">
                                                            <CustomAvField name="completer" type="text" label={t("kedbManagement:kedbManagement.label.staff")}
                                                            placeholder={t("kedbManagement:kedbManagement.placeholder.staff")} value={this.state.objectSearch.completer || completer} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" sm="12">
                                                            <Label >
                                                                <input type="checkbox" style={{ position: "relative", verticalAlign: "middle", bottom: "1px", marginRight: "5px" }}
                                                                onChange={this.toogleInputContent} checked={this.state.enableContent} />
                                                                {t("kedbManagement:kedbManagement.label.searchByContent")}
                                                            </Label>
                                                            <CustomAvField name="contentFile" type="text" placeholder={t("kedbManagement:kedbManagement.placeholder.searchByContent")}
                                                            disabled={!this.state.enableContent} value={contentFile || this.state.objectSearch.contentFile} />
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                                <CardFooter className="text-center">
                                                    <LaddaButton type="submit"
                                                        className="btn btn-primary btn-md mr-1"
                                                        loading={this.state.btnSearchLoading}
                                                        data-style={ZOOM_OUT}>
                                                        <i className="fa fa-search"></i> {t("common:common.title.search")}
                                                    </LaddaButton>
                                                    <Button type="button" size="md" color="secondary" className="mr-1" onClick={this.clearSearchConditions}><i className="fa fa-refresh"></i> {t("common:common.button.clear")}</Button>
                                                </CardFooter>
                                            </Collapse>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                title={t("kedbManagement:kedbManagement.placeholder.searchAll")} />
                                            </div>
                                            {
                                                this.props.isShowPopup ? "" :
                                                <div className="card-header-actions card-header-search-actions-button">
                                                    <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                        title={t("kedbManagement:kedbManagement.button.add")} disabled={this.state.isAuth}
                                                        onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                    <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                        title={t("kedbManagement:kedbManagement.button.import")} disabled={this.state.isAuth}
                                                        onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                    <LaddaButton type="button"
                                                        className="btn btn-primary btn-md custom-btn btn-pill mr-2"
                                                        loading={this.state.btnExportLoading}
                                                        data-style={ZOOM_OUT}
                                                        title={t("kedbManagement:kedbManagement.button.export")}
                                                        onClick={() => this.onExport()}><i className="fa fa-download"></i>
                                                    </LaddaButton>
                                                    <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2" title={t("kedbManagement:kedbManagement.button.save")}
                                                        onClick={this.saveConfigSearch}><i className="fa fa-save"></i>
                                                    </Button>
                                                    <LaddaButton type="button"
                                                        className="btn btn-primary btn-md custom-btn btn-pill mr-2"
                                                        title={t("kedbManagement:kedbManagement.button.restore")}
                                                        data-style={ZOOM_OUT}
                                                        onClick={this.deleteSearchConfig}>
                                                        <i className="fa fa-refresh"></i>
                                                    </LaddaButton>
                                                    <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                        title={t("ptProblem:ptProblem.title.viewConfigField")}
                                                        onClick={this.openConfigFieldPopup}><i className="fa fa-eye"></i>
                                                    </Button>
                                                    <SettingTable
                                                        columns={columns}
                                                        onChange={this.handleChangeColumnsTable}
                                                        moduleName={"KEDB_LIST"}
                                                    />
                                                </div>
                                            }
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
                                                isCheckbox={this.props.isShowPopup}
                                                propsCheckbox={[]}
                                                handleDataCheckbox={(dataChecked) => this.props.setDataChecked(dataChecked)}
                                                isChooseOneCheckbox={true}
                                                handleChooseOneCheckbox={() => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));}}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </AvForm>
                    </div>
                    <ImportModal
                        closeImportModal={this.closeImportModal}
                        reloadGridData={this.getConfigSearch}
                        stateImportModal={this.state} />
                    <KedbManagementListConfigFieldPopup
                        closePopup={this.closeConfigFieldPopup}
                        parentState={this.state} />
                    <KedbManagementHistoryPopup
                        closePopup={this.closeHistoryPopup}
                        parentState={this.state} />
                    <KedbManagementAddEditPopup
                        closePopup={this.closePopupDetail}
                        parentState={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

KedbManagementList.propTypes = {
    parentState: PropTypes.object,
    isShowPopup: PropTypes.bool,
    setDataChecked: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { kedbManagement, common } = state;
    return {
        response: { kedbManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, KedbManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(KedbManagementList));