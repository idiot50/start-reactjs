import { AvForm } from 'availity-reactstrap-validation';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomDateTimeRangePicker, CustomInputFilter, CustomReactTableSearch, CustomSelectLocal, SearchBar, SettingTableLocal } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigChildArrayActions from './UtilityConfigChildArrayActions';
import UtilityConfigChildArrayAddEdit from "./UtilityConfigChildArrayAddEdit";
import { confirmAlertDelete, convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import moment from 'moment';



class UtilityConfigChildArrayList extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityConfigChildArray = this.searchUtilityConfigChildArray.bind(this);

        this.state = {
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
            selectValueParentCode: {},
            selectValueParentName: {},
            selectValueStatus: {},
            listImpactSegmentCode: [],
            listImpactSegmentName: [],
        };
    }

    componentDidMount() {
        this.props.actions.getListImpactSegmentCBB().then((response) => {
            const listImpactSegmentName = response.payload.data && response.payload.data.map(i => ({ itemId: i.impactSegmentId, itemName: i.impactSegmentName }));
            const listImpactSegmentCode = response.payload.data && response.payload.data.map(i => ({ itemId: i.impactSegmentId, itemName: i.impactSegmentCode }));
            this.setState({
                listImpactSegmentName,
                listImpactSegmentCode
            })
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.search"));
            });
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.childrenId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.childrenId, d.childrenCode)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.childrenId)}>
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
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.parentArrId" />,
                id: "parentCode",
                width: 200,
                accessor: d => {
                    return <span title={d.parentCode}>{d.parentCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"parentCode"}
                        label={""}
                        isRequired={false}
                        options={this.state.listImpactSegmentCode}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeParentCode}
                        selectValue={this.state.selectValueParentCode}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.parentArrName" />,
                id: "parentName",
                width: 250,
                accessor: d => {
                    return <span title={d.parentName}>{d.parentName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"parentName"}
                        label={""}
                        isRequired={false}
                        options={this.state.listImpactSegmentName}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeParentName}
                        selectValue={this.state.selectValueParentName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.childArrId" />,
                id: "childrenCode",
                width: 200,
                accessor: d => {
                    return <span title={d.childrenCode}>{d.childrenCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="childrenCode" placeholder={this.props.t("utilityConfigChildArray:utilityConfigChildArray.placeholder.childArrId")}
                        value={this.state.objectSearch.childrenCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.childArrName" />,
                id: "childrenName",
                width: 250,
                accessor: d => {
                    return <span title={d.childrenName}>{d.childrenName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="childrenName" placeholder={this.props.t("utilityConfigChildArray:utilityConfigChildArray.placeholder.childArrName")}
                        value={this.state.objectSearch.childrenName} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.status" />,
                id: "status",
                minWidth: 200,
                accessor: d => {
                    const value = d.status === 1 ? this.props.t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.active") : this.props.t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.inActive");
                    return <span title={value}>{value}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"status"}
                        label={""}
                        isRequired={false}
                        options={[
                            { itemId: 1, itemName: this.props.t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.active") },
                            { itemId: 0, itemName: this.props.t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.inActive") }
                        ]}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeStatus}
                        selectValue={this.state.selectValueStatus}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.updater" />,
                id: "updatedUser",
                width: 200,
                accessor: d => {
                    return <span title={d.updatedUser}>{d.updatedUser}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="updatedUser" placeholder={this.props.t("utilityConfigChildArray:utilityConfigChildArray.placeholder.updater")}
                        value={this.state.objectSearch.updatedUser} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigChildArray:utilityConfigChildArray.label.updateTime" />,
                id: "updatedTime",
                width: 200,
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.updatedTime)}>{convertDateToDDMMYYYYHHMISS(d.updatedTime)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            }
        ];
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
            this.searchUtilityConfigChildArray();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.parentName = this.state.selectValueParentName.value ? this.state.selectValueParentName.label : "";
        values.parentCode = this.state.selectValueParentCode.value ? this.state.selectValueParentCode.label : "";
        values.status = this.state.selectValueStatus.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigChildArray();
        });
    }

    searchUtilityConfigChildArray() {
        this.props.actions.searchUtilityConfigChildArray(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityConfigChildArrayId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityConfigChildArray(utilityConfigChildArrayId).then((response) => {
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
                    toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.getDetail"));
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
                    this.searchUtilityConfigChildArray();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityConfigChildArray();
            }
        });
    }

    confirmDelete(utilityConfigChildArrayId, childrenCode) {
        confirmAlertDelete(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.confirmDelete", { childrenCode: childrenCode }),
            () => {
                this.props.actions.deleteUtilityConfigChildArray(utilityConfigChildArrayId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityConfigChildArray();
                        toastr.success(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.delete"));
                });
            }
        );

    }

    handleItemSelectChangeParentCode = (option) => {
        this.setState({ selectValueParentCode: option });
    }

    handleItemSelectChangeParentName = (option) => {
        this.setState({ selectValueParentName: option });
    }

    handleItemSelectChangeStatus(option) {
        this.setState({ selectValueStatus: option });
    }

    render() {
        console.log(this.state.selectValueParentCode);
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityConfigChildArrayAddEdit
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
                                                    title={t("utilityConfigChildArray:utilityConfigChildArray.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigChildArray:utilityConfigChildArray.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <SettingTableLocal
                                                    columns={columns}
                                                    onChange={this.handleChangeLocalColumnsTable}
                                                />
                                            </div>
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
                                                isCheckbox={false}
                                            />
                                        </CardBody>
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
    const { utilityConfigChildArray, common } = state;
    return {
        response: { utilityConfigChildArray, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigChildArrayActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigChildArrayList));