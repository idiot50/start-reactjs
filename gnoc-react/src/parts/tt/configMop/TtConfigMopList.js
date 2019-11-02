import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as TtConfigMopActions from './TtConfigMopActions';
import TtConfigMopAddEdit from "./TtConfigMopAddEdit";
import { CustomReactTableSearch, CustomDateTimeRangePicker, CustomSelectLocal, CustomAutocomplete, SettingTableLocal, SearchBar, CustomInputFilter } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { convertDateToDDMMYYYYHHMISS, confirmAlertDelete } from "../../../containers/Utils/Utils";
import moment from 'moment';

class TtConfigMopList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchTtConfigMop = this.searchTtConfigMop.bind(this);
        this.search = this.search.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);

        this.state = {
            collapseFormInfo: true,
            btnSearchLoading: false,
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
            selectValueConfigMopName: {},
            selectValueConfigMopGroup: {},
            selectValueHandlePerson: {},
            createTimeFromSearch: moment().subtract(1, 'year'),
            createTimeToSearch: moment(),
            mopArrayList: [],
            loop: false
            //Select

        };
    }

    componentDidMount() {
        this.props.actions.getMopGroup();
    }

    componentDidUpdate(nextState) {
        if (this.state.loop) {
            if (this.state.selectValueConfigMopName !== nextState.selectValueConfigMopName) {
                this.setState({
                    selectValueConfigMopGroup: {},
                })
            }
            this.setState({ loop: false })
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttConfigMop:ttConfigMop.label.action" />,
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
                        <span title={this.props.t("common:common.button.delete")} onClick={() => this.confirmDelete(d.id, d.typeName)}>
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
                Header: <Trans i18nKey="ttConfigMop:ttConfigMop.label.mopName" />,
                id: "typeName",
                width: 350,
                accessor: d => {
                    return <span title={d.typeName}>{d.typeName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"configMopName"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.ttConfigMop.mopGroup && this.props.response.ttConfigMop.mopGroup.payload) ? this.props.response.ttConfigMop.mopGroup.payload.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeConfigMopName}
                        selectValue={this.state.selectValueConfigMopName}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigMop:ttConfigMop.label.groupMopName" />,
                id: "alarmGroupName",
                width: 350,
                accessor: d => {
                    return <span title={d.alarmGroupName}>{d.alarmGroupName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"configMopGroup"}
                        label={""}
                        isRequired={false}
                        options={this.state.mopArrayList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeConfigMopGroup}
                        selectValue={this.state.selectValueConfigMopGroup}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigMop:ttConfigMop.label.updateUser" />,
                id: "updateUser",
                width: 350,
                accessor: d => {
                    return <span title={d.updateUser}>{d.updateUser}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"updateUser"}
                        label={this.props.t("ttConfigMop:ttConfigMop.label.updateUser")}
                        placeholder={this.props.t("ttConfigMop:ttConfigMop.placeholder.updateUser")}
                        isRequired={false}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeHandlePerson}
                        selectValue={this.state.selectValueHandlePerson}
                        moduleName={"USERS"}
                        isOnlyInputSelect={true}
                        isHasCheckbox={false}
                        isHasChildren={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="ttConfigMop:ttConfigMop.label.lastUpdateTime" />,
                id: "lastUpdateTime",
                minWidth: 200,
                accessor: d => {
                    return <span title={d.lastUpdateTime}>{d.lastUpdateTime}</span>

                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"lastUpdateTime"}
                        label={""}
                        isRequired={false}
                        endDate={this.state.createTimeToSearch}
                        startDate={this.state.createTimeFromSearch}
                        handleApply={this.handleApplyCreateTime}
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
            this.searchTtConfigMop();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }

    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.typeId = this.state.selectValueConfigMopName ? this.state.selectValueConfigMopName.value : null;
        objectSearch.alarmGroupId = this.state.selectValueConfigMopGroup ? this.state.selectValueConfigMopGroup.value : null;
        objectSearch.userID = this.state.selectValueHandlePerson && this.state.selectValueHandlePerson.value;
        objectSearch.searchStartTime = convertDateToDDMMYYYYHHMISS(this.state.createTimeFromSearch.toDate());
        objectSearch.searchEndTime = convertDateToDDMMYYYYHHMISS(this.state.createTimeToSearch.toDate());
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchTtConfigMop(true);
        });
    }

    searchTtConfigMop(isSearchClicked = false) {
        this.props.actions.searchTtConfigMop(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.search"));
        });
    }

    openAddOrEditPage(value, ttConfigMopId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY") {
            this.props.actions.getDetailTtConfigMop(ttConfigMopId).then((response) => {
                if (response.payload && response.payload.data) {
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.getDetail"));
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
                    this.searchTtConfigMop();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchTtConfigMop();
            }
        });
    }

    confirmDelete(id, typeName) {
        confirmAlertDelete(this.props.t("ttConfigMop:ttConfigMop.message.confirmDelete", { typeName: typeName }),
        () => {
            this.props.actions.deleteTtConfigMop(id).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.searchTtConfigMop();
                    toastr.success(this.props.t("ttConfigMop:ttConfigMop.message.success.delete"));
                } else {
                    toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.delete"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("ttConfigMop:ttConfigMop.message.error.delete"));
            });
        });
    }

    handleItemSelectChangeConfigMopName = (option) => {
        this.setState({
            selectValueConfigMopName: option
        })
        if (option.value) {
            this.props.actions.getMopArray(option.value).then((response) => {
                this.setState({
                    mopArrayList: response.payload.data,
                    loop: true
                });
            });
        } else {
            this.setState({
                mopArrayList: [],
                selectValueConfigMopGroup: {}
            });
        }
    }

    handleItemSelectChangeConfigMopGroup = (option) => {
        this.setState({
            selectValueConfigMopGroup: option
        })
    }

    handleItemSelectChangeHandlePerson = (option) => {
        this.setState({
            selectValueHandlePerson: option
        })
    }

    handleApplyCreateTime = (event, picker) => {
        this.setState({
            createTimeFromSearch: picker.startDate,
            createTimeToSearch: picker.endDate,
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <TtConfigMopAddEdit
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
                                                    title={t("ttConfigMop:ttConfigMop.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("ttConfigMop:ttConfigMop.button.add")}
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
    const { ttConfigMop, common } = state;
    return {
        response: { ttConfigMop, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtConfigMopActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtConfigMopList));