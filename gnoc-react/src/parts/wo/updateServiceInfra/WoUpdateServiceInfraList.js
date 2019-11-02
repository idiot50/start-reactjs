import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';

import * as commonActions from './../../../actions/commonActions';
import * as WoUpdateServiceInfraActions from './WoUpdateServiceInfraActions';
import { CustomReactTableSearch, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { validSubmitForm } from '../../../containers/Utils/Utils';

class WoUpdateServiceInfraList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchWoUpdateServiceInfra = this.searchWoUpdateServiceInfra.bind(this);
        this.search = this.search.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.handleChangeService = this.handleChangeService.bind(this);
        this.handleChangeInfra = this.handleChangeInfra.bind(this);

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
            //Import modal
            importModal: false,
            client: null,
            moduleName: null,
            //Select
            selectValueOdGroupTypeId: {},
            selectValueStatus: {},
            serviceList: [],
            selectValueService:{},
            infraTypeList: []
        };
    }

    componentDidMount() {
        this.props.actions.getItemServiceMaster( "serviceId", "serviceName", "1", "8").then((response) => {
            let serviceList = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(i=>{ return {itemId:i.serviceId,itemName:i.serviceName}}) : []
            this.setState({
                serviceList
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.search"));
        });
        this.props.actions.getItemMaster("WO_TECHNOLOGY_CODE", "itemId", "itemName", "1", "3").then((response) => {
            let infraTypeList = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(i=>{ return {itemId:i.itemValue,itemName:i.itemName}}) : []
            this.setState({
                infraTypeList
            })
        }).catch((response) => {
            toastr.error(this.props.t("utilityProcessManagement:utilityProcessManagement.message.error.search"));
        });

    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woUpdateServiceInfra:woUpdateServiceInfra.label.woCode"/>,
                id: "woCode",
                accessor: d => {
                    return <span title={d.woCode}>{d.woCode}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="woCode" placeholder={this.props.t("woUpdateServiceInfra:woUpdateServiceInfra.placeholder.woCode")}
                    value={this.state.objectSearch.woCode} />
                )
            },
            {
                Header: <Trans i18nKey="woUpdateServiceInfra:woUpdateServiceInfra.label.account"/>,
                id: "accountIsdn",
                accessor: d => {
                    return <span title={d.accountIsdn}>{d.accountIsdn}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="accountIsdn" placeholder={this.props.t("woUpdateServiceInfra:woUpdateServiceInfra.placeholder.account")}
                    value={this.state.objectSearch.accountIsdn} />
                )
            },
            {
                Header: <Trans i18nKey="woUpdateServiceInfra:woUpdateServiceInfra.label.status"/>,
                id: "statusName",
                accessor: d => {
                    return <span title={d.statusName}>{d.statusName}</span>
                },
                Filter: () => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woUpdateServiceInfra:woUpdateServiceInfra.label.service"/>,
                id: "serviceName",
                Cell: ({original}) => {
                    return (
                        <CustomSelectLocal
                        name={"serviceId" + original.woId}
                        label={""}
                        isRequired={false}
                        messageRequire={""}
                        options={this.state.serviceList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={(option) => this.handleChangeService(option, original)}
                        selectValue={{value: original.serviceId}}
                        isOnlyInputSelect={true}
                        />
                    );
                },
                Filter: () => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woUpdateServiceInfra:woUpdateServiceInfra.label.infrastructure"/>,
                id: "infraType",
                Cell: ({original}) => {
                    return (
                        <CustomSelectLocal
                            name={"infraType" + original.woId}
                            label={""}
                            isRequired={false}
                            messageRequire={""}
                            options={this.state.infraTypeList}
                            closeMenuOnSelect={true}
                            handleItemSelectChange={(option) => this.handleChangeInfra(option, original)}
                            selectValue={{value: original.infraType}}
                            isOnlyInputSelect={true}
                        />
                    );
                },
                Filter: () => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="woUpdateServiceInfra:woUpdateServiceInfra.label.save"/>,
                id: "action",
                width: 90,
                accessor: d => {
                    let html = <div></div>;
                    let disable = d.status ? false : true;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.save")} onClick={() => this.saveItem(d)}>
                            <Button type="button" size="sm" className="btn-info icon" disabled={disable}><i className="fa fa-save"></i></Button>
                        </span>
                    </div>;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{height: '2.7em'}}></div>
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
            this.searchWoUpdateServiceInfra();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        validSubmitForm(event, values, "idFormSearch");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchWoUpdateServiceInfra(true);
        });
    }

    searchWoUpdateServiceInfra(isSearchClicked = false) {
        this.props.actions.searchWoUpdateServiceInfra(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("woUpdateServiceInfra:woUpdateServiceInfra.message.error.search"));
        });
    }


    saveItem = (object) => {
        this.props.actions.editWoUpdateServiceInfra(object).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                this.setState({
                    objectSearch: Object.assign(this.state.objectSearch, {page: 1})
                }, () => {
                    this.customReactTableSearch.resetPage();
                    this.searchWoUpdateServiceInfra();
                });
                toastr.success(this.props.t("woUpdateServiceInfra:woUpdateServiceInfra.message.success.update"));
            } else if (response.payload.data.key === "ERROR") {
                toastr.error(response.payload.data.message);
            } else {
                toastr.error(this.props.t("woUpdateServiceInfra:woUpdateServiceInfra.message.error.update"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("woUpdateServiceInfra:woUpdateServiceInfra.message.error.update"));
            }
        });
    }

    handleChangeService(option, original) {
        const data = [...this.state.data];
        const index = data.findIndex(item => item.woId === original.woId);
        const row = data.find(item => item.woId === original.woId);
        row.serviceId = option.value;
        data.splice(index, 1, row);
        this.setState({
            data
        });
    }

    handleChangeInfra(option, original) {
        const data = [...this.state.data];
        const index = data.findIndex(item => item.woId === original.woId);
        const row = data.find(item => item.woId === original.woId);
        row.infraType = option.value;
        data.splice(index, 1, row);
        this.setState({
            data
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormSearch" onSubmit={this.search} model={objectSearch}>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <div className="card-header-search-actions">
                                        <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                        title={t("woUpdateServiceInfra:woUpdateServiceInfra.placeholder.searchAll")} />
                                    </div>
                                    <div className="card-header-actions card-header-search-actions-button">
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
                                            isContainsAvField={true}
                                            isCheckbox={false}
                                        />
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { woUpdateServiceInfra, common } = state;
    return {
        response: { woUpdateServiceInfra, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoUpdateServiceInfraActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoUpdateServiceInfraList));