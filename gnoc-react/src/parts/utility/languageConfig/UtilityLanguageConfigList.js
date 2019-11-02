import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityLanguageConfigActions from './UtilityLanguageConfigActions';
import UtilityLanguageConfigAddEdit from "./UtilityLanguageConfigAddEdit";
import { CustomReactTableSearch, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete } from "../../../containers/Utils/Utils";

class UtilityLanguageConfigList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityLanguageConfig = this.searchUtilityLanguageConfig.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);

        this.state = {
            collapseFormInfo: true,
            btnSearchLoading: false,
            objectSearch: {},
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            isAddOrEditVisible: false,
            isAddOrEdit: null,
            selectValueGnocLanguageId: {},
            selectValueStatus: {}
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityLanguageConfig:utilityLanguageConfig.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 120,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("common:common.button.edit")} onClick={() => this.openAddOrEditPage("EDIT", d.gnocLanguageId)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                        {
                            (d.gnocLanguageId === 1 || d.gnocLanguageId === 2) ? null :
                                <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.gnocLanguageId)}>
                                    <Button type="button" size="sm" className="btn-danger icon mr-1"><i className="fa fa-trash-o"></i></Button>
                                </span>
                        }
                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.gnocLanguageId)}>
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
                Header: <Trans i18nKey="utilityLanguageConfig:utilityLanguageConfig.label.flag" />,
                id: "languageFlag",
                width: 100,
                className: "text-center",
                accessor: d => {
                    return <span style={{ verticalAlign: 'bottom' }}>
                        <i className={"flag-icon " + d.languageFlag} style={{ fontSize: '21px' }} ></i>
                    </span>

                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityLanguageConfig:utilityLanguageConfig.label.key" />,
                id: "languageKey",
                accessor: d => {
                    return <span title={d.languageKey}>{d.languageKey}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="languageKey" placeholder={this.props.t("utilityLanguageConfig:utilityLanguageConfig.placeholder.key")}
                        value={this.state.objectSearch.languageKey} />
                )

            },
            {
                Header: <Trans i18nKey="utilityLanguageConfig:utilityLanguageConfig.label.name" />,
                id: "languageName",
                accessor: d => {
                    return d.languageName ? <span title={d.languageName}>{d.languageName}</span>
                        : <span>&nbsp;</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomInputFilter name="languageName" placeholder={this.props.t("utilityLanguageConfig:utilityLanguageConfig.placeholder.name")}
                        value={this.state.objectSearch.languageName} />
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
            this.searchUtilityLanguageConfig();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        values.gnocLanguageId = this.state.selectValueGnocLanguageId.value;
        values.status = this.state.selectValueStatus.value;
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityLanguageConfig(true);
        });
    }

    searchUtilityLanguageConfig(isSearchClicked = false) {
        this.props.actions.searchUtilityLanguageConfig(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.search"));
        });
    }

    openAddOrEditPage(value, gnocLanguageId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailUtilityLanguageConfig(gnocLanguageId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.gnocLanguageId === null) {
                        response.payload.data.gnocLanguageId = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.getDetail"));
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
                    this.searchUtilityLanguageConfig();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityLanguageConfig();
            }
        });
    }

    confirmDelete(gnocLanguageId) {
        confirmAlertDelete(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.confirmDelete", { utilityLanguageConfigCode: gnocLanguageId }),
            () => {
                this.props.actions.deleteUtilityLanguageConfig(gnocLanguageId).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.searchUtilityLanguageConfig();
                        toastr.success(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.success.delete"));
                    } else {
                        toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.delete"));
                    }
                }).catch((response) => {
                    toastr.error(this.props.t("utilityLanguageConfig:utilityLanguageConfig.message.error.delete"));
                });
            }
        );
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityLanguageConfigAddEdit
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
                                                    title={t("utilityLanguageConfig:utilityLanguageConfig.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("odType:odType.button.add")}
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
    const { utilityLanguageConfig, common } = state;
    return {
        response: { utilityLanguageConfig, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityLanguageConfigActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityLanguageConfigList));