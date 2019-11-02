import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField } from '../../../containers/Utils';
import CustomReactTableLocal from "../../../containers/Utils/CustomReactTableLocal";

class TtTroubleEditDeviceErrorInfoTabAdd extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getListDeviceSearch = this.getListDeviceSearch.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);

        this.state = {
            //Table1
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            dataChecked1: [],
            //Table2
            data2: [],
            pages2: null,
            loading2: false,
            columns2: this.buildTableColumns(),
            dataChecked2: [],
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            btnSearchLoadingSupport: false,
            isSearchSupport: false,
            btnAddOrEditLoading: false,
            troubleId: props.parentState.selectedData.troubleId
        };
    }

    componentDidMount() {
        if (this.props.parentState.data) {
            this.setState({
                data2: [...this.props.parentState.data]
            })
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.merName" />,
                id: "merName",
                width: 150,
                accessor: d => <span title={d.merName}>{d.merName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.cardName" />,
                id: "cardName",
                width: 150,
                accessor: d => <span title={d.cardName}>{d.cardName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.serialNo" />,
                id: "serialNo",
                width: 150,
                accessor: d => <span title={d.serialNo}>{d.serialNo}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.stationCode" />,
                id: "stationCode",
                minWidth: 150,
                accessor: d => <span title={d.stationCode}>{d.stationCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.contractCode" />,
                id: "contractCode",
                minWidth: 200,
                accessor: d => <span title={d.contractCode}>{d.contractCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.serialAlternative" />,
                id: "serialAlternative",
                minWidth: 200,
                accessor: d => <span title={d.serialAlternative}>{d.serialAlternative}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.slotCardPort" />,
                id: "slotCardPort",
                minWidth: 200,
                accessor: d => <span title={d.slotCardPort}>{d.slotCardPort}</span>
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
            this.getListDeviceSearch();
        });
    }

    updateDeviceError = () => {
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            if (this.state.data2.length < 1) {
                toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.deviceError"));
                this.setState({
                    btnAddOrEditLoading: false
                });
                return;
            }
            let objectSend = Object.assign({}, objectSend);
            objectSend.lst = this.state.data2.map(item => {
                item.troubleId = this.state.troubleId;
                delete item.troubleCardId;
                return item
            });
            objectSend.troubleId = this.state.troubleId;
            this.props.actions.addTtTroubleDeviceErrorInfo(objectSend).then((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.closePopup();
                        toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.deviceErrorAdd"));
                    } else if (response.payload.data.key === "ERROR") {
                        toastr.error(response.payload.data.message);
                    } else {
                        toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.deviceErrorAdd"));
                    }
                });
            }).catch((response) => {
                this.setState({
                    btnAddOrEditLoading: false
                }, () => {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.deviceErrorAdd"));
                });
            });
        })
    }

    removeUser = dataChecked2 => {
        if (dataChecked2.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.data2];
        dataChecked2.forEach(element => {
            listTemp = listTemp.filter(el => el.troubleCardId !== element.troubleCardId);
        });
        this.setState({
            data2: listTemp
        });
    }

    search(event, error, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.page = 1;
        objectSearch.pageSize = 10;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch,
            isSearchSupport: false
        }, () => {
            this.customReactTable.resetPage();
            this.getListDeviceSearch(true);
        });
    }

    getListDeviceSearch(isSearchClicked = false) {
        this.props.actions.searchTtTroubleDeviceErrorInfo(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if (isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.searchMer"));
            this.setState({
                btnSearchLoading: false,
                loading: false
            })
        });
    }


    closePopup() {
        this.setState({
            objectSearch: {},
            btnSearchLoading: false,
            btnSearchLoadingSupport: false,
            isSearchSupport: false
        });
        this.props.closePopup();
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked1: data
        });
    }

    handleDataCheckbox2 = (data) => {
        this.setState({
            dataChecked2: data
        });
    }
    addUser(dataChecked1) {
        if (dataChecked1.length > 0) {
            const checkedTemp = [...dataChecked1];
            checkedTemp.forEach(element => {
                if (this.state.data2.some(el => el.troubleCardId === element.troubleCardId)) {
                    dataChecked1.splice(dataChecked1.indexOf(element), 1);
                }
            });
            this.setState({
                objectSearch: {},
                data2: [...this.state.data2, ...dataChecked1],
                dataChecked1: []
            });
            this.customReactTable.clearChecked();
        } else {
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.required.users"));
        }
    }
    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch, data2, columns2, loading2 } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.label.deviceErrorAdd")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormDeviceErrorPopup" onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="3">
                                        <CustomAvField
                                            name={"merCode"}
                                            label={t("ttTrouble:ttTrouble.label.merCode")}
                                            placeholder={t("ttTrouble:ttTrouble.placeholder.merCode")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="3">
                                        <CustomAvField
                                            name={"stationCode"}
                                            label={t("ttTrouble:ttTrouble.label.stationCode")}
                                            placeholder={t("ttTrouble:ttTrouble.placeholder.stationCode")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="3">
                                        <CustomAvField
                                            name={"serialNo"}
                                            label={t("ttTrouble:ttTrouble.label.serialNo")}
                                            placeholder={t("ttTrouble:ttTrouble.placeholder.serialNo")}
                                        />
                                    </Col>
                                    <Col xs="12" sm="3">
                                        <Row className="mb-2">
                                            <Col xs="12"><Label></Label></Col>
                                        </Row>
                                        <Row>
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnSearchLoading}
                                                data-style={ZOOM_OUT}
                                                style={{ marginLeft: '2em' }}>
                                                <i className="fa fa-search"></i> <Trans i18nKey="ttTrouble:ttTrouble.button.search" />
                                            </LaddaButton>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AvForm>
                    <Row>
                        <Col xs="12">
                            <Label>{t("ttTrouble:ttTrouble.label.searchResults")}</Label>
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.onFetchData}
                                defaultPageSize={10}
                                isCheckbox={true}
                                propsCheckbox={["merName", "cardName", "serialNo", "stationCode", "contractCode", "serialAlternative", "slotCardPort", "updateTime", "troubleCardId"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="text-center mt-2">
                            <Button type="button" color="primary" disabled={this.state.dataChecked1.length < 1} className="ml-auto" onClick={() => this.addUser(this.state.dataChecked1)}><i className="fa fa-plus"></i> {t("ttTrouble:ttTrouble.button.add")}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <Label>{t("ttTrouble:ttTrouble.label.selectedList")}</Label>
                            <CustomReactTableLocal
                                columns={columns2}
                                data={data2}
                                loading={loading2}
                                isCheckbox={true}
                                propsCheckbox={["merName", "cardName", "serialNo", "stationCode", "contractCode", "serialAlternative", "slotCardPort", "updateTime", "troubleCardId"]}
                                defaultPageSize={5}
                                handleDataCheckbox={this.handleDataCheckbox2}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.data2.length < 1} onClick={() => this.updateDeviceError()} className="ml-auto"><i className="fa fa-check"></i> {t("ttTrouble:ttTrouble.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={() => this.removeUser(this.state.dataChecked2)}><i className="fa fa-times-circle"></i> {t("common:common.button.delete")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TtTroubleEditDeviceErrorInfoTabAdd.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, TtTroubleActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditDeviceErrorInfoTabAdd));