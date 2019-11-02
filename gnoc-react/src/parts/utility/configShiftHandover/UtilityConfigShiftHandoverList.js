import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigShiftHandoverActions from './UtilityConfigShiftHandoverActions';
import UtilityConfigShiftHandoverAddEdit from "./UtilityConfigShiftHandoverAddEdit";
import { CustomReactTableSearch, CustomDateTimeRangePicker, CustomSelectLocal, SettingTableLocal, SearchBar, CustomInputFilter, MoreButtonTable, CustomAutocomplete, CustomDatePicker } from "../../../containers/Utils";
import { CustomCSSTransition } from "../../../containers/Utils/CustomCSSTransition";
import { confirmAlertDelete, convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";
import moment from 'moment';


class UtilityConfigShiftHandoverList extends Component {
    constructor(props) {
        super(props);

        this.toggleFormInfo = this.toggleFormInfo.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChangeLocalColumnsTable = this.handleChangeLocalColumnsTable.bind(this);
        this.searchUtilityConfigShiftHandover = this.searchUtilityConfigShiftHandover.bind(this);
        this.search = this.search.bind(this);
        this.openAddOrEditPage = this.openAddOrEditPage.bind(this);
        this.closeAddOrEditPage = this.closeAddOrEditPage.bind(this);
        this.onExport = this.onExport.bind(this);

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
            shiftList: [],
            kpiList: [],
            statusList: [
                { itemId: 0, itemName: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.waitingShift") },
                { itemId: 1, itemName: this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.label.handOverShift") },
            ],
            selectValueShift: {},
            selectValueLastUpdateTime: null,
            createTimeFrom: moment().subtract(1, 'year'),
            createTimeTo: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }),
            lastUpdateTimeFrom: moment().subtract(1, 'year'),
            lastUpdateTimeTo: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }),
            selectValueUser: {},
            selectValueUnit: {},
            selectValueStatus: {}
        };
    }

    componentDidMount() {
        this.props.actions.getItemMaster("GNOC_SHIFT", "itemId", "itemName", "1", "3");
        this.props.actions.getListShiftID().then((response) => {
            let tempList = (response.payload && response.payload.data) ? response.payload.data.map(i => ({ itemId: i.shiftId, itemName: i.shiftName })) : []
            this.setState({
                shiftList: tempList
            })
        })
        this.props.actions.getItemMaster("GNOC_SHIFT_KPI", "itemId", "itemName", "1", "3").then((response) => {
            this.setState({
                kpiList: response.payload.data.data
            })

        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.action" />,
                id: "action",
                sortable: false,
                fixed: "left",
                width: 180,
                accessor: d => {
                    let html = <div></div>;
                    html = <div className="text-center">
                        <span title={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.detail")} onClick={() => this.openAddOrEditPage("DETAIL", d.id)}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1"><i className="fa fa-info-circle"></i></Button>
                        </span>

                        <span title={this.props.t("common:common.button.copy")} onClick={() => this.openAddOrEditPage("COPY", d.id)}>
                            <Button type="button" size="sm" className="btn-warning icon mr-1"><i className="fa fa-copy"></i></Button>
                        </span>
                        <span title={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.download")} onClick={() => this.downloadFileDetail(d)}>
                            <Button type="button" size="sm" className="btn-success icon mr-1"><i className="fa fa-download"></i></Button>
                        </span>
                        <span title={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.handover")} hidden={this.onShowButtonHandover(d)} onClick={() => this.openAddOrEditPage("TAKESHIFT", d.id)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-gear"></i></Button>
                        </span>
                        <span title={this.props.t("common:common.button.edit")} hidden={this.onShowButtonEdit(d)} onClick={() => this.openAddOrEditPage("EDIT", d.id)}>
                            <Button type="button" size="sm" className="btn-info icon mr-1"><i className="fa fa-edit"></i></Button>
                        </span>
                    </div >;
                    return html;
                },
                Filter: ({ filter, onChange }) => (
                    <div style={{ height: '2.7em' }}></div>
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.shiftUser" />,
                id: "userName",
                accessor: d => {
                    return <span title={d.userName}>{d.userName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"userId"}
                        label={""}
                        isRequired={false}
                        placeholder={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.shiftUser")}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeHandleUser}
                        selectValue={this.state.selectValueUser}
                        moduleName={"USERS"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.shiftUnit" />,
                id: "unitName",
                accessor: d => {
                    return <span title={d.unitName}>{d.unitName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomAutocomplete
                        name={"unitId"}
                        label={""}
                        isRequired={false}
                        placeholder={this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.shiftUnit")}
                        closeMenuOnSelect={false}
                        handleItemSelectChange={this.handleItemSelectChangeHandleUnit}
                        selectValue={this.state.selectValueUnit}
                        moduleName={"UNIT"}
                        isOnlyInputSelect={true}
                        isHasChildren={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.shiftTime" />,
                id: "createdTime",
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"createdTime"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.createTimeFrom}
                        endDate={this.state.createTimeTo}
                        handleApply={this.handleApplyEndTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.shift" />,
                id: "shiftName",
                accessor: d => {
                    return <span title={d.shiftName}>{d.shiftName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"shiftName"}
                        label={""}
                        isRequired={false}
                        options={(this.props.response.common.gnocShift && this.props.response.common.gnocShift.payload) ? this.props.response.common.gnocShift.payload.data.data : []}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeShift}
                        selectValue={this.state.selectValueShift}
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.lastUpdateTime" />,
                id: "lastUpdateTime",
                accessor: d => {
                    return <span title={convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}>{convertDateToDDMMYYYYHHMISS(d.lastUpdateTime)}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomDateTimeRangePicker
                        name={"lastUpdateTime"}
                        label={""}
                        isRequired={false}
                        startDate={this.state.lastUpdateTimeFrom}
                        endDate={this.state.lastUpdateTimeTo}
                        handleApply={this.handleApplyLastUpdateTime}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        isOnlyInputSelect={true}
                    />
                )
            },
            {
                Header: <Trans i18nKey="utilityConfigShiftHandover:utilityConfigShiftHandover.label.status" />,
                id: "statusName",
                accessor: d => {
                    return <span title={d.statusName}>{d.statusName}</span>
                },
                Filter: ({ filter, onChange }) => (
                    <CustomSelectLocal
                        name={"statusName"}
                        label={""}
                        isRequired={false}
                        options={this.state.statusList}
                        closeMenuOnSelect={true}
                        handleItemSelectChange={this.handleItemSelectChangeStatus}
                        selectValue={this.state.selectValueStatus}
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
            this.searchUtilityConfigShiftHandover();
        });
    }

    handleChangeLocalColumnsTable(columns) {
        this.setState({
            columns
        });
    }


    search(event, errors, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.userId = (this.state.selectValueUser && this.state.selectValueUser.value) ? parseInt(this.state.selectValueUser.value) : "";
        objectSearch.unitId = (this.state.selectValueUnit && this.state.selectValueUnit.value) ? parseInt(this.state.selectValueUnit.value) : "";
        objectSearch.createTimeFrom = (this.state.createTimeFrom) ? this.state.createTimeFrom.toDate() : null;;
        objectSearch.createTimeTo = (this.state.createTimeTo) ? this.state.createTimeTo.toDate() : null;
        objectSearch.lastUpdateTimeFrom = (this.state.lastUpdateTimeFrom) ? this.state.lastUpdateTimeFrom.toDate() : null;
        objectSearch.lastUpdateTimeTo =(this.state.lastUpdateTimeTo) ? this.state.lastUpdateTimeTo.toDate() : null;
        objectSearch.lastUpdateTime = this.state.selectValueLastUpdateTime || "";
        objectSearch.shiftId = this.state.selectValueShift.value ? this.state.selectValueShift.value : "";
        objectSearch.status = this.state.selectValueStatus.value ? this.state.selectValueStatus.value : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTableSearch.resetPage();
            this.searchUtilityConfigShiftHandover(true);
        });
    }

    searchUtilityConfigShiftHandover(isSearchClicked = false) {
        this.props.actions.searchUtilityConfigShiftHandover(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.error.search"));
        });
    }

    openAddOrEditPage(value, utilityConfigShiftHandoverId) {
        if (value === "ADD") {
            this.setState({
                isAddOrEditVisible: true,
                isAddOrEdit: value
            });
        } else if (value === "EDIT" || value === "COPY" || value === 'DETAIL') {
            this.props.actions.getDetailUtilityConfigShiftHandover(utilityConfigShiftHandoverId).then((response) => {
                if (response.payload && response.payload.data) {
                    if (response.payload.data.id === null) {
                        response.payload.data.id = "";
                    }
                    this.setState({
                        isAddOrEditVisible: true,
                        isAddOrEdit: value,
                        selectedData: response.payload.data
                    });
                } else {
                    toastr.error(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.error.getDetail"));
                }
            }).catch((response) => {
                toastr.error(this.props.t("utilityConfigShiftHandover:utilityConfigShiftHandover.message.error.getDetail"));
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
                    this.searchUtilityConfigShiftHandover();
                });
            } else if (isAddOrEdit === "EDIT") {
                this.searchUtilityConfigShiftHandover();
            }
        });
    }

    onExport() {
        this.setState({
            btnExportLoading: true
        }, () => {
            this.props.actions.onExportFile("stream", "EXPORT_SHIFT_HANDOVER_DATA", this.state.objectSearch).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    downloadFileDetail(data) {
        this.props.actions.onExportFile("stream", "EXPORT_SHIFT_HANDOVER_ROW", data).then((response) => {
            toastr.success(this.props.t("common:common.message.success.export"));
        }).catch((response) => {
            toastr.error(this.props.t("common:common.message.error.export"));
        });
    }

    handleItemSelectChangeHandleShiftUser = (option) => {
        this.setState({ selectValueUser: option })
    }

    handleItemSelectChangeHandleUnit = (option) => {
        this.setState({ selectValueUnit: option })
    }

    handleItemSelectChangeShift = (option) => {
        this.setState({ selectValueShift: option });
    }

    handleApplyEndTime = (event, picker) => {
        this.setState({
            createTimeFrom: picker.startDate,
            createTimeTo: picker.endDate,
        });
    }

    handleApplyLastUpdateTime = (event, picker) => {
        this.setState({
            lastUpdateTimeFrom: picker.startDate,
            lastUpdateTimeTo: picker.endDate
        })
    }

    handleOnChangeLastUpdateTime = (option) => {
        this.setState({ selectValueLastUpdateTime: option })
    }

    handleItemSelectChangeStatus = (option) => {
        this.setState({
            selectValueStatus: option
        })
    }

    handleItemSelectChangeHandleUser = (option) => {
        this.setState({
            selectValueUser: option
        })
    }

    onShowButtonHandover = (value) => {
        if (value.shiftStaftDTOList && value.shiftStaftDTOList.length > 0) {
            for (let i of value.shiftStaftDTOList) {
                if (i.receiveUserId === JSON.parse(localStorage.getItem("user")).userID) {
                    return false;
                }
            }
        }
        return true;
    }

    onShowButtonEdit = (value) => {
        if (JSON.parse(localStorage.getItem("user")).userID === value.userId) {
            return false;
        }
        return true;
    }


    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <CustomCSSTransition
                isVisible={this.state.isAddOrEditVisible}
                content={
                    <UtilityConfigShiftHandoverAddEdit
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
                                                    title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.placeholder.searchAll")} />
                                            </div>
                                            <div className="card-header-actions card-header-search-actions-button">
                                                <Button type="button" size="md" color="primary" className="custom-btn btn-pill mr-2"
                                                    title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.add")}
                                                    onClick={() => this.openAddOrEditPage("ADD")}><i className="fa fa-plus"></i></Button>
                                                <LaddaButton type="button"
                                                    className="btn btn-primary btn-md custom-btn btn-pill mr-3"
                                                    loading={this.state.btnExportLoading}
                                                    data-style={ZOOM_OUT}
                                                    title={t("utilityConfigShiftHandover:utilityConfigShiftHandover.button.export")}
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
                </div>
            </CustomCSSTransition>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { utilityConfigShiftHandover, common } = state;
    return {
        response: { utilityConfigShiftHandover, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigShiftHandoverActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigShiftHandoverList));