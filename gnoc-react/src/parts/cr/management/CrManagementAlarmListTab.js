import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader, Row, Col } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTableLocal, SettingTableLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import CrManagementAlarmTabAddPopup from './CrManagementAlarmTabAddPopup';

class CrManagementAlarmListTab extends Component {
    constructor(props) {
        super(props);

        this.onExport = this.onExport.bind(this);

        this.state = {
            isOpenAddAlarmPopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnExportLoading: false,
            //Table
            data: [],
            pages: null,
            columns: this.buildTableColumns(),
            objectSearch: {},
            dataChecked: []
        };
    }

    componentDidMount() {
        if (this.state.modalName === "EDIT") {
            this.searchAlarmByCr();
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
                Header: <Trans i18nKey="crManagement:crManagement.label.alarmName" />,
                id: "faultName",
                minWidth: 150,
                accessor: d => d.faultName ? <span title={d.faultName}>{d.faultName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.alarmField" />,
                id: "faultSrc",
                minWidth: 150,
                accessor: d => d.faultSrc ? <span title={d.faultSrc}>{d.faultSrc}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.vendorCodeAlarm" />,
                id: "vendorCode",
                minWidth: 150,
                accessor: d => d.vendorCode ? <span title={d.vendorCode}>{d.vendorCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.moduleCodeAlarm" />,
                id: "moduleCode",
                minWidth: 150,
                accessor: d => d.moduleCode ? <span title={d.moduleCode}>{d.moduleCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nation" />,
                id: "nationCode",
                minWidth: 150,
                accessor: d => d.nationCode ? <span title={d.nationCode}>{d.nationCode}</span> : <span>&nbsp;</span>
            }
        ];
    }

    searchAlarmByCr = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.crId = this.state.selectedData.crId;
        this.props.actions.searchAlarmByCr(objectSearch).then((response) => {
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

    searchAlarmByProcess = () => {
        const { parentState } = this.props;
        if (parentState && parentState.objectInfoTab && parentState.objectInfoTab.selectValueProcess && parentState.objectInfoTab.selectValueProcess.value) {
            const objectSearch = Object.assign({}, this.state.objectSearch);
            objectSearch.crProcessId = parentState.objectInfoTab.selectValueProcess.value || this.state.selectedData.crProcessId;
            this.props.actions.searchAlarmByProcess(objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data ? response.payload.data : []
                }, () => {
                    this.props.onChangeData(this.state.data);
                });
            }).catch((response) => {
                this.setState({
                    loading: false
                });
                toastr.error(this.props.t("crManagement:crManagement.message.error.getAlarm"));
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.crProcess"));
            this.props.onChangeTab(0);
            setTimeout(() => {
                try {
                    document.getElementById("idFormAddOrEditInfoTab").elements["custom-input-crProcess"].nextElementSibling.focus();
                } catch (error) {
                    console.error(error);
                }
            }, 100);
        }
    }

    setValueAlarm = (dataChecked) => {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.data.some(el => el.casId === element.casId)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            data: [...this.state.data, ...dataChecked]
        });
    }

    removeAlarm = () => {
        const dataChecked = [...this.state.dataChecked];
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.data];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.casId !== element.casId);
        });
        this.setState({
            data: listTemp,
            dataChecked: []
        });
    }

    openAddAlarmPopup = () => {
        this.setState({
            isOpenAddAlarmPopup: true
        });
    }

    closeAddAlarmPopup = () => {
        this.setState({
            isOpenAddAlarmPopup: false
        });
    }

    onExport() {
        const listId = this.state.data.map((item, index) => {
            return item.casId;
        });
        if (listId.length > 0) {
            this.setState({
                btnExportLoading: true
            }, () => {
                this.props.actions.onExportFile("cr", "CR_ALARM", listId).then((response) => {
                    this.setState({ btnExportLoading: false });
                    toastr.success(this.props.t("common:common.message.success.export"));
                }).catch((response) => {
                    this.setState({ btnExportLoading: false });
                    toastr.error(this.props.t("common:common.message.error.export"));
                });
            });
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" className={(this.props.parentState.visibleToolbarTab.alarm.all && this.props.parentState.visibleToolbarTab.alarm.loadAlarm) ? "text-center mb-1" : "class-hidden"}>
                        <Button type="button" size="md" color="primary" title={t("crManagement:crManagement.button.loadAlarm")}
                            onClick={() => {this.searchAlarmByProcess()}}><i className="fa fa-refresh"></i> {t("crManagement:crManagement.button.loadAlarm")}</Button>
                    </Col>
                </Row>
                <Card>
                    <CardHeader>
                        <div style={{position: 'absolute'}} className="mt-1">
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.alarmList")}
                        </div>
                        {
                            this.props.parentState.visibleToolbarTab.alarm.all ?
                            <div className="card-header-actions card-header-search-actions-button">
                                <LaddaButton type="button"
                                    className={this.props.parentState.visibleToolbarTab.alarm.export ? "btn btn-primary btn-md custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.export")}
                                    loading={this.state.btnExportLoading}
                                    data-style={ZOOM_OUT}
                                    onClick={() => this.onExport()}
                                    disabled={data.length < 1}>
                                    <i className="fa fa-download"></i>
                                </LaddaButton>
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.alarm.add ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.add")}
                                    onClick={this.openAddAlarmPopup}><i className="fa fa-plus"></i></Button>
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.alarm.delete ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.delete")}
                                    onClick={() => {this.removeAlarm()}}><i className="fa fa-close"></i></Button>
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
                        columns={columns}
                        data={data}
                        isCheckbox={true}
                        loading={false}
                        propsCheckbox={["casId"]}
                        defaultPageSize={10}
                        handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                    />
                </Card>
                <CrManagementAlarmTabAddPopup
                    parentState={this.state}
                    closePopup={this.closeAddAlarmPopup} 
                    setValue={this.setValueAlarm} />
            </div>
        );
    }
}

CrManagementAlarmListTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeData: PropTypes.func.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementAlarmListTab));