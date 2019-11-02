import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigEmployeeDayOffActions from './UtilityConfigEmployeeDayOffActions';
import UtilityConfigEmployeeDayOffAddEdit from "./UtilityConfigEmployeeDayOffAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAutocomplete, CustomDatePicker } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete, convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class UtilityConfigEmployeeDayOffList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityConfigEmployeeDayOff = this.searchUtilityConfigEmployeeDayOff.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.onExport = this.onExport.bind(this);
        this.handleItemSelectChangeVacation = this.handleItemSelectChangeVacation.bind(this);
        this.handleItemSelectChangeHandleEmployeeName = this.handleItemSelectChangeHandleEmployeeName.bind(this);

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
            selectValueVacation: {},
            selectValueUnitName: {},
            selectValueEmployee: {},
            dayOff: null
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.action" />,
                id: "action",
                width: 120,
                sortable: false,
                fixed: "left",
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.idDayOff)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.idDayOff, d.empUnit)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.idDayOff)}>
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
                Header: <Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.employeeName" />,
                id: "empUsername",
                accessor: d => {
                    return <span title={d.empUsername}>{d.empUsername}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"empUsername"}
                        label={""}
                        placeholder={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.placeholder.employeeName")}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeHandleEmployeeName}
                        selectValue={this.state.selectValueEmployee}
                        moduleName={"USERS"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                        isRequired={false}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.unit" />,
                id: "unitName",
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitName"}
                        label={""}
                        placeholder={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.placeholder.unit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeUnitName}
                        selectValue={this.state.selectValueUnitName}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.dayOff" />,
                id: "dayOff",
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.dayOff)}>{convertDateToDDMMYYYYHHMISS(d.dayOff)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDatePicker
                        name={"dayOff"}
                        label={""}
                        isRequired={false}
                        handleOnChange={this.handleOnChangeDayOff}
                        dateFormat="dd/MM/yyyy"
                        selected={this.state.dayOff}
                        placeholder={this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.placeholder.dayOff")}
                        isOnlyInputSelect={true}
                        shouldCloseOnSelect={true}
                        showTimeSelect={false}
                        search={this.search}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.label.vacation" />,
                id: "vacationName",
                accessor: d => {
                    return <span title={d.vacationName}>{d.vacationName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"vacationName"}
                        label={""}
                        isRequired={false}
                        options={[
                            { itemId: 'MOR', itemName: this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.mor") },
                            { itemId: 'AFT', itemName: this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.aft") },
                            { itemId: 'FULL', itemName: this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.full") }
                        ]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeVacation}
                        selectValue={this.state.selectValueVacation}
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
            this.searchUtilityConfigEmployeeDayOff();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.empId = this.state.selectValueEmployee && this.state.selectValueEmployee.value;
        objectSearch.unitId = this.state.selectValueUnitName && parseInt(this.state.selectValueUnitName.value);
        objectSearch.dayOff = this.state.dayOff || "";
        objectSearch.vacation = this.state.selectValueVacation.value || "";
        objectSearch.page = 1;
        delete objectSearch['custom-input-dayOff'];
        delete objectSearch['custom-input-empUsername'];
        delete objectSearch['custom-input-unitName'];
        delete objectSearch['custom-input-vacationName'];
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigEmployeeDayOff(true);
        });
    }

    searchUtilityConfigEmployeeDayOff(isSearchClicked = false) {
        this.props.actions.searchUtilityConfigEmployeeDayOff(this.state.objectSearch).then((response) => {
            const tempList = response.payload.data ? response.payload.data.data.map(i => ({
                ...i,
                vacationName: i.vacation === 'MOR' ? this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.mor")
                    : i.vacation === 'AFT' ? this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.aft")
                        : i.vacation === 'FULL' ? this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.dropdown.vacation.full")
                            : null
            })) : [];
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
            toastr.error(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityConfigEmployeeDayOffId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityConfigEmployeeDayOff(utilityConfigEmployeeDayOffId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.idDayOff === null) {
                        response.payload.data.idDayOff = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.error.getDetail"));
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
                    this.searchUtilityConfigEmployeeDayOff();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityConfigEmployeeDayOff();
            }
        });
    }

    confirmDelete(utilityConfigEmployeeDayOffId, utilityConfigEmployeeDayOffCode) {
        confirmAlertDelete(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.confirmDelete", { utilityConfigEmployeeDayOffCode: utilityConfigEmployeeDayOffCode }),
            () => {
                this.props.actions.deleteUtilityConfigEmployeeDayOff(utilityConfigEmployeeDayOffId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityConfigEmployeeDayOff();
                        toastr.success(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.message.error.delete"));
                });
            }
        );
    }

    openImportModal() {
        this.setState({
            importModal: true,
            client: "stream",
            moduleName: "EMPLOYEE_DAY_OFF_IMPORT_FILE"
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
            this.props.actions.onExportFile("stream", "EXPORT_EMPLOYEE_DAY_OFF", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    handleItemSelectChangeVacation(option) {
        this.setState({ selectValueVacation: option });
    }

    handleOnChangeDayOff=(value)=> {
        this.setState({
            dayOff: value
        });
    }

    handleItemSelectChangeHandleEmployeeName = (option) => {
        this.setState({
            selectValueEmployee: option
        });
    }

    handleItemSelectChangeUnitName = (option) => {
        this.setState({
            selectValueUnitName: option
        })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityConfigEmployeeDayOffAddEdit
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
                                                    title={t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.button.import")}
                                                    onClick={() => this.openImportModal()}><i className="fa fa-upload"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityConfigEmployeeDayOff:utilityConfigEmployeeDayOff.button.export")}
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
                        reloadGridData={this.searchUtilityConfigEmployeeDayOff}
                        stateImportModal={this.state} />
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityConfigEmployeeDayOff, common } = state;
    return {
        response: { utilityConfigEmployeeDayOff, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigEmployeeDayOffActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigEmployeeDayOffList));