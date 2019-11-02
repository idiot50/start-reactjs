import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTable, SettingTableLocal, CustomReactTableLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import CrManagementImport from './CrManagementImport';
import CrManagementNetworkNodePopup from './CrManagementNetworkNodePopup';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class CrManagementAffectedNodeTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenNetworkNodePopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnExportLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {},
            dataChecked: [],
            importModal: false,
            actionType: 1
        };
    }

    componentDidMount() {
        if (this.state.modalName !== "ADD") {
            this.getLisNodeOfCR();
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

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nodeIp" />,
                id: "ip",
                minWidth: 150,
                accessor: d => {
                    return d.ip ? <span title={d.ip}>{d.ip}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.deviceCode" />,
                id: "deviceCode",
                minWidth: 150,
                accessor: d => {
                    return d.deviceCode ? <span title={d.deviceCode}>{d.deviceCode}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.deviceName" />,
                id: "deviceName",
                minWidth: 150,
                accessor: d => {
                    return d.deviceName ? <span title={d.deviceName}>{d.deviceName}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.deviceCodeOld" />,
                id: "deviceCodeOld",
                minWidth: 150,
                accessor: d => {
                    return d.deviceCodeOld ? <span title={d.deviceCodeOld}>{d.deviceCodeOld}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nationCode" />,
                id: "nationCode",
                minWidth: 150,
                accessor: d => {
                    return d.nationCode ? <span title={d.nationCode}>{d.nationCode}</span>
                    : <span>&nbsp;</span>
                }
            }
        ];
    }

    getLisNodeOfCR = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.crId = this.state.selectedData.crId;
        objectSearch.crCreatedDateStr = convertDateToDDMMYYYYHHMISS(new Date(this.state.selectedData.createdDate));
        objectSearch.earlierStartTimeStr = convertDateToDDMMYYYYHHMISS(new Date(this.state.selectedData.earliestStartTime));
        objectSearch.nodeType = 1;
        objectSearch.saveType = this.state.selectedData.nodeSavingMode;
        this.props.actions.getLisNodeOfCR(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data ? response.payload.data : [],
            });
        }).catch((response) => {
            toastr.error(this.props.t("crManagement:crManagement.message.error.getAffectedNode"));
        });
    }

    openImportModal = () => {
        this.setState({
            importModal: true
        });
    }

    closeImportModal = () => {
        this.setState({
            importModal: false
        });
    }

    openNetworkNodePopup = () => {
        this.setState({
            isOpenNetworkNodePopup: true
        });
    }

    closeNetworkNodePopup = () => {
        this.setState({
            isOpenNetworkNodePopup: false
        });
    }

    setValueNetworkNodePopup = (dataChecked) => {
        const checkedTemp = [...dataChecked];
        checkedTemp.map(element => {
            if (this.state.data.some(el => el.ipId === element.ipId)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            data: [...this.state.data, ...dataChecked]
        });
    }

    removeNetworkNode = (dataChecked) => {
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.data];
        dataChecked.map(element => {
            listTemp = listTemp.filter(el => el.ipId !== element.ipId);
        });
        this.setState({
            data: listTemp,
            dataChecked: []
        }, () => {
            this.customReactTable.clearChecked();
        });
    }

    onExport = () => {
        this.setState({
            btnExportLoading: true
        }, () => {
            const data = [];
            for (const item of this.state.data) {
                const node = {
                    ip: item.ip,
                    ipId: item.ipId,
                    deviceCode: item.deviceCode,
                    deviceCodeOld: item.deviceCodeOld,
                    deviceName: item.deviceName,
                    deviceId: item.deviceId,
                    nationCode: item.nationCode
                };
                data.push(node);
            }
            this.props.actions.onExportFile("cr", "IMPACT_NODES", data).then((response) => {
                this.setState({ btnExportLoading: false });
                toastr.success(this.props.t("common:common.message.success.export"));
            }).catch((response) => {
                this.setState({ btnExportLoading: false });
                toastr.error(this.props.t("common:common.message.error.export"));
            });
        });
    }

    setValueDataTable = (list) => {
        this.setState({
            data: this.state.data.concat(list)
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                <CardHeader>
                        <div style={{position: 'absolute'}} className="mt-1">
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.affectedNodeList")}
                        </div>
                        {
                            this.props.parentState.visibleToolbarTab.networkNodeAffected.all ?
                            <div className="card-header-actions card-header-search-actions-button">
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.networkNodeAffected.import ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.import")}
                                    onClick={this.openImportModal}><i className="fa fa-upload"></i></Button>
                                <LaddaButton type="button"
                                    className={this.props.parentState.visibleToolbarTab.networkNodeAffected.export ? "btn btn-primary btn-md custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.export")}
                                    loading={this.state.btnExportLoading}
                                    data-style={ZOOM_OUT}
                                    onClick={this.onExport}>
                                    <i className="fa fa-download"></i>
                                </LaddaButton>
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.networkNodeAffected.add ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.add")}
                                    onClick={this.openNetworkNodePopup}><i className="fa fa-plus"></i></Button>
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.networkNodeAffected.delete ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.delete")}
                                    onClick={() => this.removeNetworkNode(this.state.dataChecked)}><i className="fa fa-close"></i></Button>
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div> :
                            <div className="card-header-actions card-header-search-actions-button">
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        }
                    </CardHeader>
                    <CustomReactTableLocal
                        onRef={ref => (this.customReactTable = ref)}
                        columns={columns}
                        data={data}
                        // pages={pages}
                        loading={false}
                        // onFetchData={this.onFetchData}
                        defaultPageSize={10}
                        isCheckbox={true}
                        propsCheckbox={[]}
                        handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                    />
                </Card>
                <CrManagementImport
                    closeImportModal={this.closeImportModal}
                    reloadGridData={this.getLisNodeOfCR}
                    parentState={this.state}
                    moduleName="NETWORK_NODE"
                    setValueDataTable={this.setValueDataTable} />
                <CrManagementNetworkNodePopup
                    parentState={this.state}
                    closePopup={this.closeNetworkNodePopup}
                    setValue={this.setValueNetworkNodePopup} />
            </div>
        );
    }
}

CrManagementAffectedNodeTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementAffectedNodeTab));