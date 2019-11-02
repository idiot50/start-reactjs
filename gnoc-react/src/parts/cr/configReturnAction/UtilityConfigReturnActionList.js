import { AvForm } from 'availity-reactstrap-validation';
import React, { Component } from 'react';
import { Trans, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomInputFilter, CustomReactTableSearch, CustomSelectLocal, SearchBar, SettingTableLocal } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigReturnActionActions from './UtilityConfigReturnActionActions';
import UtilityConfigReturnActionAddEdit from "./UtilityConfigReturnActionAddEdit";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityConfigReturnActionList extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        // this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityConfigReturnAction = this.searchUtilityConfigReturnAction.bind(this);
        this.handleItemSelectChangeReturnCategory = this.handleItemSelectChangeReturnCategory.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this)

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
            returnCategorySelect:[],
            //Select
            selectValueReturnCategory: {},
            selectValueStatus:{},
            statusListSelect: [
                { itemId: 1, itemName: props.t("common:common.dropdown.status.active") },
                { itemId: 0, itemName: props.t("common:common.dropdown.status.inActive") }
            ],
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("CR_RETURN_CATEGORY", "itemId", "itemName", "1", "3").then((response) => {
            
            let returnCategorySelect = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(i => ({itemId:i.itemValue,itemName:i.itemName})) : [];
            this.setState({
                returnCategorySelect
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.search"));
        });;
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigReturnAction:utilityConfigReturnAction.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.returnCodeCategoryId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        {/* <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.returnCodeCategoryId)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span> */}
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.returnCodeCategoryId)}>
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
                Header: <Trans i18nKey="utilityConfigReturnAction:utilityConfigReturnAction.label.returnCode" />,
                id: "returnCode",
                width: 250,
                accessor: d => {
                    return <span title={d.returnCode}>{d.returnCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="returnCode" placeholder={this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.placeholder.returnCode")}
                        value={this.state.objectSearch.returnCode} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigReturnAction:utilityConfigReturnAction.label.returnTitle" />,
                id: "returnTitle",
                width: 250,
                accessor: d => {
                    return <span title={d.returnTitle}>{d.returnTitle}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="returnTitle" placeholder={this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.placeholder.returnTitle")}
                        value={this.state.objectSearch.returnTitle} />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigReturnAction:utilityConfigReturnAction.label.returnCategory" />,
                id: "returnCategoryName",
                accessor: d => {
                    return <span title={d.returnCategoryName}>{d.returnCategoryName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"returnCategory"}
                        label={""}
                        isRequired={false}
                        options={this.state.returnCategorySelect}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeReturnCategory}
                        selectValue={this.state.selectValueReturnCategory}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigReturnAction:utilityConfigReturnAction.label.description" />,
                id: "description",
                accessor: d => {
                    return <span title={d.description}>{d.description}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="description" placeholder={this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.placeholder.description")}
                        value={this.state.objectSearch.description} />
                )
            },
            {
                Header: <Trans i18nKey="common:common.label.status"/>,
                width: 150,
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
            this.searchUtilityConfigReturnAction();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.returnCategory = this.state.selectValueReturnCategory.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.isActive = this.state.selectValueStatus.value ;
        objectSearch.page = 1;
        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigReturnAction();
        });
    }

    searchUtilityConfigReturnAction() {
        this.props.actions.searchUtilityConfigReturnAction(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityConfigReturnActionId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityConfigReturnAction(utilityConfigReturnActionId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.getDetail"));
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
                    this.searchUtilityConfigReturnAction();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityConfigReturnAction();
            }
        });
    }

    // confirmDelete(utilityConfigReturnActionId, utilityConfigReturnActionCode) {
    //     confirmAlertDelete(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.confirmDelete", { utilityConfigReturnActionCode: utilityConfigReturnActionCode }),
    //         () => {
    //             this.props.actions.deleteUtilityConfigReturnAction(utilityConfigReturnActionId).then((response) => {
    //                 if (response.payload.data.key === "SUCCESS") {
    //                     this.searchUtilityConfigReturnAction();
    //                     toastr.success(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.success.delete"));
    //                 } else {
    //                     toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.delete"));
    //                 }
    //             }).catch((response) => {
    //                 toastr.error(this.props.t("utilityConfigReturnAction:utilityConfigReturnAction.message.error.delete"));
    //             });
    //         }
    //     );
    // }

    handleItemSelectChangeReturnCategory(option) {
        this.setState({ selectValueReturnCategory: option });
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
                    <UtilityConfigReturnActionAddEdit
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
                                                    title={t("utilityConfigReturnAction:utilityConfigReturnAction.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigReturnAction:utilityConfigReturnAction.button.add")}
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
    const { utilityConfigReturnAction, common } = state;
    return {
        response: { utilityConfigReturnAction, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigReturnActionActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigReturnActionList));