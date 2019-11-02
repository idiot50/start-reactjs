import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomSticky, CustomReactTable, SettingTableLocal, CustomDatePicker, CustomAvField } from '../../../containers/Utils';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class TtTroubleEditDetailTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            btnAddOrEditLoading: false,
            //Table
            historyTable: {
                data: [],
                pages: null,
                loading: true,
                columns: this.buildTableColumnsHistory()
            },
            affectedNodeTable: {
                data: [],
                pages: null,
                loading: true,
                columns: this.buildTableColumnsAffectedNode()
            },
            nocInformationTable: {
                data: [],
                pages: null,
                loading: true,
                columns: this.buildTableColumnsNOCInformation()
            },
            objectSearch: {}
        };
    }

    componentDidMount() {
        this.setState({
            selectValueDeferType: { value: this.state.selectedData.deferType },
            createdTime: this.state.selectedData.createdTime ? new Date(this.state.selectedData.createdTime) : null,
            lastUpdateTime: this.state.selectedData.lastUpdateTime ? new Date(this.state.selectedData.lastUpdateTime) : null,
            clearTime: this.state.selectedData.clearTime ? new Date(this.state.selectedData.clearTime) : null,
            queueTime: this.state.selectedData.queueTime ? new Date(this.state.selectedData.queueTime) : null,
            closedTime: this.state.selectedData.closedTime ? new Date(this.state.selectedData.closedTime) : null,
            assignTimeTemp: this.state.selectedData.assignTimeTemp ? new Date(this.state.selectedData.assignTimeTemp) : null,
            assignTime: this.state.selectedData.assignTime ? new Date(this.state.selectedData.assignTime) : null,
            catchingTime: this.state.selectedData.catchingTime ? new Date(this.state.selectedData.catchingTime) : null,
        });
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    // start table history
    buildTableColumnsHistory() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.unit" />,
                id: "createrUnitName",
                accessor: d => <span title={d.createrUnitName}>{d.createrUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.user" />,
                id: "createrUserName",
                accessor: d => <span title={d.createrUserName}>{d.createrUserName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.content" />,
                id: "content",
                accessor: d => <span title={d.content}>{d.content}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTimeHistoryTab" />,
                id: "createTime",
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createTime)}>{convertDateToDDMMYYYYHHMISS(d.createTime)}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.actionType" />,
                id: "type",
                accessor: d => <span title={d.type}>{d.type}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.state" />,
                id: "stateName",
                accessor: d => <span title={d.stateName}>{d.stateName}</span>
            }
        ];
    }

    onFetchDataHistory = (state, instance) => {
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

        const objectSearch = Object.assign({}, {troubleId: this.state.selectedData.troubleId}, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchTtTroubleHistory();
        });
    }

    searchTtTroubleHistory = () => {
        this.props.actions.getListTroubleHistorysDTO(this.state.objectSearch).then((response) => {
            const data = response.payload.data.data || [];
            if (data.length > 0) {
                data[0].totalRow = response.payload.data.total;
            }
            this.setState({
                historyTable: {
                    ...this.state.historyTable,
                    data,
                    pages: response.payload.data.pages,
                    loading: false
                }
            });
        }).catch((response) => {
            this.setState({
                historyTable: {
                    ...this.state.historyTable,
                    loading: false
                }
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getActionLog"));
        });
    }
    // end table history

    // start table affected node
    buildTableColumnsAffectedNode() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.networkNodeCode" />,
                id: "deviceCode",
                accessor: d => <span title={d.deviceCode}>{d.deviceCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.networkNodeName" />,
                id: "deviceName",
                accessor: d => <span title={d.deviceName}>{d.deviceName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.networkNodeIp" />,
                id: "ip",
                accessor: d => <span title={d.ip}>{d.ip}</span>
            }
        ];
    }

    onFetchDataAffectedNode = (state, instance) => {
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

        const objectSearch = Object.assign({}, {troubleId: this.state.selectedData.troubleId}, values);

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchTtTroubleAffectedNode();
        });
    }

    searchTtTroubleAffectedNode = () => {
        this.props.actions.getListTroubleAffectedNode(this.state.objectSearch).then((response) => {
            const data = response.payload.data.data || [];
            if (data.length > 0) {
                data[0].totalRow = response.payload.data.total;
            }
            this.setState({
                affectedNodeTable: {
                    ...this.state.affectedNodeTable,
                    data,
                    pages: response.payload.data.pages,
                    loading: false
                }
            });
        }).catch((response) => {
            this.setState({
                affectedNodeTable: {
                    ...this.state.affectedNodeTable,
                    loading: false
                }
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getActionLog"));
        });
    }
    // end table affected node

    // start table noc information
    buildTableColumnsNOCInformation() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.account" />,
                id: "account",
                accessor: d => <span title={d.account}>{d.account}</span>
            }
        ];
    }

    onFetchDataNOCInformation = (state, instance) => {
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

        const objectSearch = Object.assign({}, {troubleId: this.state.selectedData.troubleId}, values);
        
        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.searchTtTroubleNOCInformation();
        });
    }

    searchTtTroubleNOCInformation = () => {
        this.props.actions.getListTroubleNOCInformation(this.state.objectSearch).then((response) => {
            const data = response.payload.data.data || [];
            if (data.length > 0) {
                data[0].totalRow = response.payload.data.total;
            }
            this.setState({
                nocInformationTable: {
                    ...this.state.nocInformationTable,
                    data,
                    pages: response.payload.data.pages,
                    loading: false
                }
            });
        }).catch((response) => {
            this.setState({
                nocInformationTable: {
                    ...this.state.nocInformationTable,
                    loading: false
                }
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getActionLog"));
        });
    }
    // end table noc information

    render() {
        const { t } = this.props;
        const { historyTable, affectedNodeTable, nocInformationTable } = this.state;
        let objectAddOrEdit = {};
        objectAddOrEdit.createUserName = this.state.selectedData.createUserName || "";
        objectAddOrEdit.createUnitName = this.state.selectedData.createUnitName || "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditDetailTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Card>
                        <CustomSticky level={1}>
                            <CardHeader>
                                {t("ttTrouble:ttTrouble.title.detail")}
                                {/* <div className="card-header-actions card-header-actions-button">
                                    <Button type="button" color="secondary" onClick={() => this.props.closePage('EDIT')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                </div> */}
                            </CardHeader>
                        </CustomSticky>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"createdTime"}
                                        label={t("ttTrouble:ttTrouble.label.createTime")}
                                        isRequired={false}
                                        selected={this.state.createdTime}
                                        handleOnChange={(d) => { this.setState({ createdTime: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"lastUpdateTime"}
                                        label={t("ttTrouble:ttTrouble.label.lastUpdateTime")}
                                        isRequired={false}
                                        selected={this.state.lastUpdateTime}
                                        handleOnChange={(d) => { this.setState({ lastUpdateTime: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"assignTime"}
                                        label={t("ttTrouble:ttTrouble.label.assignTime")}
                                        isRequired={false}
                                        selected={this.state.assignTime}
                                        handleOnChange={(d) => { this.setState({ assignTime: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"queueTime"}
                                        label={t("ttTrouble:ttTrouble.label.queueTime")}
                                        isRequired={false}
                                        selected={this.state.queueTime}
                                        handleOnChange={(d) => { this.setState({ queueTime: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"clearTime"}
                                        label={t("ttTrouble:ttTrouble.label.clearTime")}
                                        isRequired={false}
                                        selected={this.state.clearTime}
                                        handleOnChange={(d) => { this.setState({ clearTime: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"closedTime"}
                                        label={t("ttTrouble:ttTrouble.label.closeTime")}
                                        isRequired={false}
                                        selected={this.state.closedTime}
                                        handleOnChange={(d) => { this.setState({ closedTime: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                                <Col xs="12" sm="3">
                                    <CustomAvField name="createUserName" label={t("ttTrouble:ttTrouble.label.creator")} readOnly/>
                                </Col>
                                <Col xs="12" sm="3">
                                    <CustomAvField name="createUnitName" label={t("ttTrouble:ttTrouble.label.creationUnit")} readOnly/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"assignTimeTemp"}
                                        label={t("ttTrouble:ttTrouble.label.openDefferedTime")}
                                        isRequired={false}
                                        selected={this.state.assignTimeTemp}
                                        handleOnChange={(d) => { this.setState({ assignTimeTemp: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                                <Col xs="12" sm="3">
                                    <CustomDatePicker
                                        name={"catchingTime"}
                                        label={t("ttTrouble:ttTrouble.label.catchingTime")}
                                        isRequired={false}
                                        selected={this.state.catchingTime}
                                        handleOnChange={(d) => { this.setState({ catchingTime: d }) }}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeSelect={true}
                                        timeFormat="HH:mm:ss"
                                        placeholder="dd/MM/yyyy HH:mm:ss"
                                        readOnly={true}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i>{t("ttTrouble:ttTrouble.title.history")}
                            <div className="card-header-actions">
                                <SettingTableLocal
                                    columns={historyTable.columns}
                                    onChange={(columns) => this.setState({ historyTable: { ...this.state.historyTable, columns } })}
                                />
                            </div>
                        </CardHeader>
                        <CustomReactTable
                            onRef={ref => (this.customReactTableHistory = ref)}
                            columns={historyTable.columns}
                            data={historyTable.data}
                            pages={historyTable.pages}
                            loading={historyTable.loading}
                            onFetchData={this.onFetchDataHistory}
                            defaultPageSize={10}
                        />
                    </Card>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i>{t("ttTrouble:ttTrouble.title.affectedNode")}
                            <div className="card-header-actions">
                                <SettingTableLocal
                                    columns={affectedNodeTable.columns}
                                    onChange={(columns) => this.setState({ affectedNodeTable: { ...this.state.affectedNodeTable, columns } })}
                                />
                            </div>
                        </CardHeader>
                        <CustomReactTable
                            onRef={ref => (this.customReactTableAffectedNode = ref)}
                            columns={affectedNodeTable.columns}
                            data={affectedNodeTable.data}
                            pages={affectedNodeTable.pages}
                            loading={affectedNodeTable.loading}
                            onFetchData={this.onFetchDataAffectedNode}
                            defaultPageSize={10}
                        />
                    </Card>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i>{t("ttTrouble:ttTrouble.title.nocInformation")}
                            <div className="card-header-actions">
                                <SettingTableLocal
                                    columns={nocInformationTable.columns}
                                    onChange={(columns) => this.setState({ nocInformationTable: { ...this.state.nocInformationTable, columns } })}
                                />
                            </div>
                        </CardHeader>
                        <CustomReactTable
                            onRef={ref => (this.customReactTableNocInformation = ref)}
                            columns={nocInformationTable.columns}
                            data={nocInformationTable.data}
                            pages={nocInformationTable.pages}
                            loading={nocInformationTable.loading}
                            onFetchData={this.onFetchDataNOCInformation}
                            defaultPageSize={10}
                        />
                    </Card>
                </AvForm>
            </div>
        );
    }
}

TtTroubleEditDetailTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditDetailTab));