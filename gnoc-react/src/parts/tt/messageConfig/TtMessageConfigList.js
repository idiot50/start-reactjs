import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as TtMessageConfigActions from './TtMessageConfigActions';
import TtMessageConfigAddEdit from "./TtMessageConfigAddEdit";
import { CustomReactTableSearch, ImportModal, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, CustomAvField, CustomAutocomplete } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from '../../../containers/Utils/Utils';

class ttMessageConfigList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.searchTtMessageConfig = this.searchTtMessageConfig.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);

        this.state = {
            collapseFormInfo: true,
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
            selectValueConfigLevel: {},
            selectValueHandlePerson: {},
            selectValueUnit: {},
            selectValuePriority: {},
            selectValueSection: {},
            priorityList: []
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("LEVEL_CALL_IPCC", "itemId", "itemName", "1", "3")
        this.props.actions.getItemMaster("TT_PRIORITY", "itemId", "itemName", "1", "3").then((response) => {
            console.log(response)
            this.setState({
                priorityList: response.payload.data ? response.payload.data.data : []
            })
        })
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.cfgId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.cfgId, d.cfgName)}>
                            <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.cfgId)}>
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
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.spmCode" />,
                id: "cfgName",
                width: 300,
                accessor: d => {
                    return <span title={d.cfgName}>{d.cfgName}</span>
                },
                Filter: ({ filter, onChange }) => {
                    return (
                        <CustomInputFilter name="cfgName" 
                            //placeholder={this.props.t("ttMessageConfig:ttMessageConfig.placeholder.spmCode")}
                            value={this.state.objectSearch.cfgName} />
                    )
                }
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.configLevel" />,
                id: "levelName",
                width: 250,
                accessor: d => {
                    return <span title={d.levelName}>{d.levelName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"levelId"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.levelCallIpcc && this.props.response.common.levelCallIpcc.payload) ? this.props.response.common.levelCallIpcc.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeConfigLevel}
                        selectValue={this.state.selectValueConfigLevel}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.unit" />,
                id: "unitName",
                width: 300,
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => {
                    return (
                        <CustomAutocomplete
                            name={"unitName"}
                            label={""}
                            placeholder={this.props.t("ttMessageConfig:ttMessageConfig.placeholder.unit")}
                            isRequired={false}
                            closeMenuOnSelect={true}
                            handleItemSelectChange={this.handleItemSelectChangeUnit}
                            selectValue={this.state.selectValueUnit}
                            moduleName={"UNIT"}
                            isOnlyInputSelect={true}
                            isHasCheckbox={false}
                        />
                    )
                }
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.section" />,
                id: "locationName",
                minWidth: 300,
                accessor: d => {
                    return d.locationName && <span title={d.locationName}>{d.locationName}</span>
                },
                Filter: ({ filter, onChange }) => {
                    return (
                        <div style={{ padding: '0px' }}>
                            <CustomAutocomplete
                                name={"locationId"}
                                label={""}
                                placeholder={this.props.t("ttMessageConfig:ttMessageConfig.placeholder.section")}
                                isRequired={false}
                                closeMenuOnSelect={true}
                                handleItemSelectChange={this.handleItemSelectChangeSection}
                                selectValue={this.state.selectValueSection}
                                moduleName={"REGION"}
                                isOnlyInputSelect={true}
                                isHasCheckbox={false}
                            />
                        </div>
                    )
                }
            },
            {
                Header: <Trans i18nKey="ttMessageConfig:ttMessageConfig.label.priority" />,
                id: "priorityName",
                minWidth: 200,
                accessor: d => {
                    return d.priorityName && <span title={d.priorityName}>{d.priorityName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"priorityId"}
                        label={""}
                        messageRequire={this.props.t("ttMessageConfig:ttMessageConfig.message.required.priority")}
                        options={this.state.priorityList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangePriority}
                        selectValue={this.state.selectValuePriority}
                        isRequired={false}
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
            this.searchTtMessageConfig();
        });
    }

    handleChangeLocalColumnsTable = (columns) => {
        this.setState({
            columns
        });
    }

    search = (event, errors, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.levelName = (this.state.selectValueConfigLevel && this.state.selectValueConfigLevel.value) ? this.state.selectValueConfigLevel.label : "";
        objectSearch.unitName = (this.state.selectValueUnit && this.state.selectValueUnit.value) ? this.state.selectValueUnit.label : "";
        objectSearch.locationId = (this.state.selectValueSection && this.state.selectValueSection.value) ? this.state.selectValueSection.value : "";
        objectSearch.priorityId = (this.state.selectValuePriority && this.state.selectValuePriority.value) ? this.state.selectValuePriority.value : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchTtMessageConfig(true);
        });
    }

    searchTtMessageConfig(isSearchClicked = false) {
        this.props.actions.searchTtMessageConfig(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.search"));
        });
    }

    openAddOrEditPage(value, ttMessageConfigId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            const objectGetDetail = Object.assign({}, objectGetDetail)
            this.props.actions.getDetailTtMessageConfig(ttMessageConfigId).then((response) => {

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
                    toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.getDetail"));
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
                    this.searchTtMessageConfig();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchTtMessageConfig();
            }
        });
    }
    handleKeyDownForm = event => {
        if (event.key === 'Enter') {
            this.setState({
                isSearchClicked: false
            });
        }
    }

    confirmDelete(cfgId, cfgName) {
        confirmAlertDelete(this.props.t("ttMessageConfig:ttMessageConfig.message.confirmDelete", { cfgName: cfgName }),
        () => {
            this.props.actions.deleteTtMessageConfig(cfgId).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchTtMessageConfig();
                    toastr.success(this.props.t("ttMessageConfig:ttMessageConfig.message.success.delete"));
                } else {
                    toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttMessageConfig:ttMessageConfig.message.error.delete"));
            });
        });
    }

    handleItemSelectChangeUnit = (option) => {
        this.setState({ selectValueUnit: option })
    }

    handleItemSelectChangeConfigLevel = (option) => {
        this.setState({ selectValueConfigLevel: option })
    }

    handleItemSelectChangeHandlePerson = (option) => {
        this.setState({ selectValueHandlePerson: option })
    }

    handleItemSelectChangePriority = (option) => {
        this.setState({ selectValuePriority: option })
    }

    handleItemSelectChangeSection = (option) => {
        this.setState({ selectValueSection: option })
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <TtMessageConfigAddEdit
                        closeAddOrEditPage={this.closeAddOrEditPage}
                        parentState={this.state} />
                }>
                <div>
                    <div className="animated fadeIn">
                        <AvForm onKeyDown={this.handleKeyDownForm} onSubmit={this.search} model={objectSearch} ref={el => this.myFormRef = el}>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <div className="card-header-search-actions">
                                                <SearchBar placeholder={t("common:common.placeholder.quickSearch")}
                                                    title={t("ttMessageConfig:ttMessageConfig.placeholder.searchAll")} value={this.state.objectSearch.searchAll} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ttMessageConfig:ttMessageConfig.button.add")}
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
    const { ttMessageConfig, common } = state;
    return {
        response: { ttMessageConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtMessageConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ttMessageConfigList));