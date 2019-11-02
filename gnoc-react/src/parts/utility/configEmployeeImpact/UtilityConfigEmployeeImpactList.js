import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';


import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigEmployeeImpactActions from './UtilityConfigEmployeeImpactActions';
import UtilityConfigEmployeeImpactAddEdit from "./UtilityConfigEmployeeImpactAddEdit";
import { CustomReactTableSearch,CustomDateTimeRangePicker, CustomSelectLocal,CustomInputFilter, SettingTableLocal, SearchBar, CustomAutocomplete, CustomDatePicker } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import {convertDateToDDMMYYYYHHMISS} from '../../../containers/Utils/Utils';
import { confirmAlertDelete } from "../../../containers/Utils/Utils";
class UtilityConfigEmployeeImpactList extends Component {
    constructor(props) {
        super(props);
        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityConfigEmployeeImpact = this.searchUtilityConfigEmployeeImpact.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.handleItemSelectChangeParrentArray = this.handleItemSelectChangeParrentArray.bind(this);
        this.handleItemSelectChangeEmpLevel = this.handleItemSelectChangeEmpLevel.bind(this);
        this.handleOnChangeUpdatedTime = this.handleOnChangeUpdatedTime.bind(this);
        this.handleItemSelectChangeChildArray = this.handleItemSelectChangeChildArray.bind(this);
        this.handleOnChangeEmpUser = this.handleOnChangeEmpUser.bind(this);
        this.handleOnChangeUnit = this.handleOnChangeUnit.bind(this);
        this.state = {
            collapseFormInfo: true,
            btnSearchLoading: false,
            btnExportLoading: false,
            objectSearch: {},
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            client: null,
            moduleName: null,
            listParentArray: [],
            listChildArray:[],
            listLevel:[],
            //Select
            selectUpdatedTime: null,
            selectValueEmpLevel: {},
            selectParrentArray: {},
            selectChildArray: {},
            selectUnit: {},
            selectEmpUser:{},
            updatedTimeFrom:null,
            updatedTimeTo:null
        };
    }

    componentDidMount() {
        this.props.actions.getListParentArray().then((response) => {
            const list = response.payload.data.map(i => { return ({ itemName: i.displayStr, itemId: i.valueStr }) })
            this.setState({ listParentArray: list })
        });

        this.props.actions.getListChildArray({page:1,pageSize:100}).then((response) =>{
            const list = response.payload.data.map(i => { return ({ itemName: i.childrenName, itemId: i.childrenId }) })
            this.setState({ listChildArray: list })

        });

        this.props.actions.getListLevel({ page: 1, pageSize: 10 }).then((response) => {
            const list = response.payload.data.data.map(i => { return ({ itemName:''+i.empLevel,itemId:i.empLevel }) })
            this.setState({ listLevel: list })
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.idImpact)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.idImpact)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.idImpact)}>
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
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.employee" />,
                id: "empUsername",
                width: 250,
                accessor: d => {
                    return <span title={d.empUsername}>{d.empUsername}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"empId"}
                        label={""}
                        placeholder={this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.placeholder.employee")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeEmpUser}
                        selectValue={this.state.selectEmpUser}
                        moduleName={"USERS"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                     />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.unit" />,
                id: "unitName",
                width: 250,
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitId"}
                        label={""}
                        placeholder={this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.placeholder.unit")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleOnChangeUnit}
                        selectValue={this.state.selectUnit}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                     />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.parentArray" />,
                id: "empArrayName",
                width: 200,
                accessor: d => {
                    return d.empArrayName ? <span title={d.empArrayName}>{d.empArrayName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"empArrayName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listParentArray}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeParrentArray}
                        selectValue={this.state.selectParrentArray}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.childArray" />,
                id: "empArrayChildName",
                width: 200,
                accessor: d => {
                    return <span title={d.empArrayChildName}>{d.empArrayChildName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"empArrayChildName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listChildArray}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeChildArray}
                        selectValue={this.state.selectChildArray}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.level" />,
                id: "empLevel",
                width: 120  ,
                accessor: d => {
                    return d.empLevel ? <span title={d.empLevel}>{d.empLevel}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"empLevel"}
                        label={""}
                        isRequired={false}
                        options={this.state.listLevel}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeEmpLevel}
                        selectValue={this.state.selectValueEmpLevel}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.updatedUser" />,
                id: "updatedUser",
                width: 120,
                accessor: d => {
                    return <span title={d.updatedUser}>{d.updatedUser}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="updatedUser" placeholder={this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.placeholder.updatedUser")}
                        value={this.state.objectSearch.updatedUser} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.updatedTime" />,
                id: "updatedTime",
                width: 200,
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.updatedTime)}>{convertDateToDDMMYYYYHHMISS(d.updatedTime)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"updatedTime"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.updatedTimeFrom}
                        endDate={this.state.updatedTimeTo}
                        handleApply={this.handleOnChangeUpdatedTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
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
            this.searchUtilityConfigEmployeeImpact();

        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        debugger
        values.empId = (this.state.selectEmpUser)?this.state.selectEmpUser.value:null;
        values.empArray = this.state.selectParrentArray.value;
        values.empArrayChild = this.state.selectChildArray.value;
        values.unitId = (this.state.selectUnit)?this.state.selectUnit.value:null;
        values.empLevel = this.state.selectValueEmpLevel.value;
        values.updatedTimeFrom = (this.state.updatedTimeFrom)?this.state.updatedTimeFrom.toDate():null;
        values.updatedTimeTo = (this.state.updatedTimeTo)?this.state.updatedTimeTo.toDate():null;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigEmployeeImpact(true);
        });
    }

    searchUtilityConfigEmployeeImpact(isSearchClicked = false) {
        this.props.actions.searchUtilityConfigEmployeeImpact(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.search"));
        });
    }

    openAddOrEditPage(value, idImpact) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityConfigEmployeeImpact(idImpact).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.idImpact === null) {
                        response.payload.data.idImpact = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.getDetail"));
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
                    this.searchUtilityConfigEmployeeImpact();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityConfigEmployeeImpact();
            }
        });
    }
    confirmDelete(idImpact) {
        confirmAlertDelete(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.confirmDelete", { idImpact: idImpact }),
        () => {
            this.props.actions.deleteUtilityConfigEmployeeImpact(idImpact).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchUtilityConfigEmployeeImpact();
                    toastr.success(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.success.delete"));
                } else {
                    toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.delete"));
            });
        }
    );
    }

    handleItemSelectChangeParrentArray(option) {
        this.setState({ selectParrentArray: option });
        this.props.actions.getListChildArray({page:1,pageSize:100,parentId:option.value}).then((response) =>{
            const list = response.payload.data.map(i => { return ({ itemName: i.childrenName, itemId: i.childrenId }) })
            this.setState({ listChildArray: list })

        });
    }
    handleItemSelectChangeChildArray(option) {
        this.setState({ selectChildArray: option });
    }
    handleItemSelectChangeEmpLevel(option) {
        this.setState({ selectValueEmpLevel: option });
    }

    handleOnChangeUpdatedTime(event,picker) {
        this.setState({
            updatedTimeFrom: picker.startDate,
            updatedTimeTo: picker.endDate,
        });
    }

    handleOnChangeUnit(value){
        this.setState({selectUnit:value});
    }
    handleOnChangeEmpUser(value){
        this.setState({selectEmpUser:value});
    }
    render() {
        console.log(this.state.updatedTimeFrom)
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityConfigEmployeeImpactAddEdit
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
                                                    title={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.button.add")}
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
    const { utilityConfigEmployeeImpact, common } = state;
    return {
        response: { utilityConfigEmployeeImpact, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigEmployeeImpactActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigEmployeeImpactList));