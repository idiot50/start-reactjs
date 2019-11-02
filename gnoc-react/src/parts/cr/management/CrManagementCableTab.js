import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTableLocal, SettingTableLocal } from '../../../containers/Utils';
import CrManagementCableTabAddLanePopup from './CrManagementCableTabAddLanePopup';
import CrManagementCableTabAddCablePopup from './CrManagementCableTabAddCablePopup';

class CrManagementCableTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenAddLanePopup: false,
            isOpenAddCablePopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnAddOrEditLoading: false,
            //Table
            laneTable: {
                data: [],
                columns: this.buildTableColumnsLane(),
            },
            dataCheckedLaneTable: [],
            cableTable: {
                data: [],
                columns: this.buildTableColumnsCable()
            },
            dataCheckedCableTable: [],
            linkInfoTable: {
                data: [],
                columns: this.buildTableColumnsLinkInfo()
            },
            objectSearch: {}
        };
    }

    componentDidMount() {
        if (this.state.modalName === "EDIT") {
            this.searchCrCable();
        }
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    searchCrCable = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.crId = this.state.selectedData.crId;
        this.props.actions.getListCrCableByCondition(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : []
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("crManagement:crManagement.message.error.getAlarm"));
        });
    }

    buildTableColumnsLane() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.laneCode" />,
                id: "cableCode",
                minWidth: 150,
                accessor: d => d.cableCode ? <span title={d.cableCode}>{d.cableCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.startPoint" />,
                id: "startPoint",
                minWidth: 150,
                accessor: d => d.startPoint ? <span title={d.startPoint}>{d.startPoint}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.endPoint" />,
                id: "endPoint",
                minWidth: 150,
                accessor: d => d.endPoint ? <span title={d.endPoint}>{d.endPoint}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nation" />,
                id: "nationCode",
                minWidth: 150,
                accessor: d => d.nationCode ? <span title={d.nationCode}>{d.nationCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.createTime" />,
                id: "createdDate",
                minWidth: 150,
                accessor: d => d.createdDate ? <span title={d.createdDate}>{d.createdDate}</span> : <span>&nbsp;</span>
            }
        ];
    }

    setValueLane = (dataCheckedLaneTable) => {
        const checkedTemp = [...dataCheckedLaneTable];
        checkedTemp.forEach(element => {
            if (this.state.laneTable.data.some(el => el.cableCode === element.cableCode)) {
                dataCheckedLaneTable.splice(dataCheckedLaneTable.indexOf(element), 1);
            }
        });
        this.setState({
            laneTable: {
                ...this.state.laneTable,
                data: [...this.state.laneTable.data, ...dataCheckedLaneTable]
            }
        });
    }

    removeLane = () => {
        const dataCheckedLaneTable = [...this.state.dataCheckedLaneTable];
        if (dataCheckedLaneTable.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.laneTable.data];
        dataCheckedLaneTable.forEach(element => {
            listTemp = listTemp.filter(el => el.cableCode !== element.cableCode);
        });
        this.setState({
            laneTable: {
                ...this.state.laneTable,
                data: listTemp
            },
            dataCheckedLaneTable: []
        });
    }

    openAddLanePopup = () => {
        this.setState({
            isOpenAddLanePopup: true
        });
    }

    closeAddLanePopup = () => {
        this.setState({
            isOpenAddLanePopup: false
        });
    }

    buildTableColumnsCable() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.cableCode" />,
                id: "cableCode",
                minWidth: 150,
                accessor: d => <span title={d.cableCode}>{d.cableCode}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.startPoint" />,
                id: "startPoint",
                minWidth: 150,
                accessor: d => <span title={d.startPoint}>{d.startPoint}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.endPoint" />,
                id: "endPoint",
                minWidth: 150,
                accessor: d => <span title={d.endPoint}>{d.endPoint}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nation" />,
                id: "nation",
                minWidth: 150,
                accessor: d => <span title={d.nation}>{d.nation}</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.createTime" />,
                id: "createTime",
                minWidth: 150,
                accessor: d => <span title={d.createTime}>{d.createTime}</span>
            }
        ];
    }

    setValueCable = (dataCheckedCableTable, dataLinkInfo) => {
        const checkedTemp = [...dataCheckedCableTable];
        checkedTemp.forEach(element => {
            if (this.state.cableTable.data.some(el => el.cableCode === element.cableCode)) {
                dataCheckedCableTable.splice(dataCheckedCableTable.indexOf(element), 1);
            }
        });
        this.setState({
            cableTable: {
                ...this.state.cableTable,
                data: [...this.state.cableTable.data, ...dataCheckedCableTable]
            },
            linkInfoTable: {
                ...this.state.linkInfoTable,
                data: dataLinkInfo
            }
        });
    }

    removeCable = () => {
        const dataCheckedCableTable = [...this.state.dataCheckedCableTable];
        if (dataCheckedCableTable.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.cableTable.data];
        dataCheckedCableTable.forEach(element => {
            listTemp = listTemp.filter(el => el.cableCode !== element.cableCode);
        });
        this.setState({
            cableTable: {
                ...this.state.cableTable,
                data: listTemp
            },
            dataCheckedCableTable: []
        });
    }
    
    openAddCablePopup = () => {
        this.setState({
            isOpenAddCablePopup: true
        }, () => {
            this.stateAddCablePopup.setDataCablePopup(this.state.laneTable.data);
        });
    }

    closeAddCablePopup = () => {
        this.setState({
            isOpenAddCablePopup: false
        });
    }

    buildTableColumnsLinkInfo() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.capacity" />,
                id: "capacity",
                minWidth: 150,
                accessor: d => d.capacity ? <span title={d.capacity}>{d.capacity}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.linkCode" />,
                id: "linkName",
                minWidth: 150,
                accessor: d => d.linkName ? <span title={d.linkName}>{d.linkName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.device1" />,
                id: "device1",
                minWidth: 150,
                accessor: d => d.device1 ? <span title={d.device1}>{d.device1}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.device2" />,
                id: "device2",
                minWidth: 150,
                accessor: d => d.device2 ? <span title={d.device2}>{d.device2}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.port1" />,
                id: "port1",
                minWidth: 150,
                accessor: d => d.port1 ? <span title={d.port1}>{d.port1}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.port2" />,
                id: "port2",
                minWidth: 150,
                accessor: d => d.port2 ? <span title={d.port2}>{d.port2}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.fiber" />,
                id: "fiber",
                minWidth: 150,
                accessor: d => d.fiber ? <span title={d.fiber}>{d.fiber}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.createDate" />,
                id: "createTime",
                minWidth: 150,
                accessor: d => d.createTime ? <span title={d.createTime}>{d.createTime}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.modifyTime" />,
                id: "modifyTime",
                minWidth: 150,
                accessor: d => d.modifyTime ? <span title={d.modifyTime}>{d.modifyTime}</span> : <span>&nbsp;</span>
            }
        ];
    }

    render() {
        const { t } = this.props;
        const { laneTable, cableTable, linkInfoTable } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <div style={{position: 'absolute'}} className="mt-1">
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.laneList")}
                        </div>
                        {
                            this.props.parentState.visibleToolbarTab.lane.all ?
                            <div className="card-header-actions card-header-search-actions-button">
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.lane.add ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.add")}
                                    onClick={this.openAddLanePopup}><i className="fa fa-plus"></i></Button>
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.lane.add ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.delete")}
                                    onClick={() => {this.removeLane()}}><i className="fa fa-close"></i></Button>
                                <SettingTableLocal
                                    columns={laneTable.columns}
                                    onChange={(columns) => this.setState({ laneTable: {...laneTable, columns} })}
                                />
                            </div> :
                            <div className="card-header-actions card-header-search-actions-button">
                                <SettingTableLocal
                                    columns={laneTable.columns}
                                    onChange={(columns) => this.setState({ laneTable: {...laneTable, columns} })}
                                />
                            </div>
                        }
                    </CardHeader>
                    <CustomReactTableLocal
                        columns={laneTable.columns}
                        data={laneTable.data}
                        isCheckbox={true}
                        loading={false}
                        propsCheckbox={["cableCode"]}
                        defaultPageSize={10}
                        handleDataCheckbox={(dataCheckedLaneTable) => this.setState({ dataCheckedLaneTable })}
                    />
                </Card>
                <Card>
                    <CardHeader>
                        <div style={{position: 'absolute'}} className="mt-1">
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.cableList")}
                        </div>
                        {
                            this.props.parentState.visibleToolbarTab.cable.all ?
                            <div className="card-header-actions card-header-search-actions-button">
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.cable.add ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.add")}
                                    onClick={this.openAddCablePopup}
                                    disabled={laneTable.data.length < 1}><i className="fa fa-plus"></i></Button>
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.cable.add ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.delete")}
                                    onClick={() => {this.removeCable()}}><i className="fa fa-close"></i></Button>
                                <SettingTableLocal
                                    columns={cableTable.columns}
                                    onChange={(columns) => this.setState({ cableTable: {...cableTable, columns} })}
                                />
                            </div> :
                            <div className="card-header-actions card-header-search-actions-button">
                                <SettingTableLocal
                                    columns={cableTable.columns}
                                    onChange={(columns) => this.setState({ cableTable: {...cableTable, columns} })}
                                />
                            </div>
                        }
                    </CardHeader>
                    <CustomReactTableLocal
                        columns={cableTable.columns}
                        data={cableTable.data}
                        isCheckbox={true}
                        loading={false}
                        propsCheckbox={["cableCode"]}
                        defaultPageSize={10}
                        handleDataCheckbox={(dataCheckedCableTable) => this.setState({ dataCheckedCableTable })}
                    />
                </Card>
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.linkInfoList")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <SettingTableLocal
                                columns={linkInfoTable.columns}
                                onChange={(columns) => this.setState({ linkInfoTable: {...linkInfoTable, columns} })}
                            />
                        </div>
                    </CardHeader>
                    <CustomReactTableLocal
                        columns={linkInfoTable.columns}
                        data={linkInfoTable.data}
                        isCheckbox={false}
                        loading={false}
                        defaultPageSize={10}
                    />
                </Card>
                <CrManagementCableTabAddLanePopup
                    parentState={this.state}
                    closePopup={this.closeAddLanePopup}
                    setValue={this.setValueLane} />
                <CrManagementCableTabAddCablePopup
                    onRef={ref => (this.stateAddCablePopup = ref)}
                    parentState={this.state}
                    closePopup={this.closeAddCablePopup}
                    setValue={this.setValueCable} />
            </div>
        );
    }
}

CrManagementCableTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCableTab));