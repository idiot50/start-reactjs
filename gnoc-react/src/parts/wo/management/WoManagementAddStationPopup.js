import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as WoCdGroupManagementActions from '../cdGroupManagement/WoCdGroupManagementActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField, CustomSelectLocal, CustomDatePicker, CustomReactTableLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class WoManagementAddStationPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            dataChecked: [],
            modifyDate: null
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.type" />,
                id: "typeStation",
                accessor: d => {
                    return d.typeStation ? <span title={d.typeStation}>{d.typeStation}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.stationAndLineCode" />,
                id: "stationCode",
                accessor: d => {
                    return d.stationCode ? <span title={d.stationCode}>{d.stationCode}</span>
                    : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.address" />,
                id: "address",
                accessor: d => {
                    return d.address ? <span title={d.address}>{d.address}</span>
                    : <span>&nbsp;</span>
                }
            }
        ];
    }

    onFetchData = (state, instance) => {
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
            this.getStationListNation();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.date = this.state.modifyDate ? convertDateToDDMMYYYYHHMISS(this.state.modifyDate) : "";
        objectSearch.stationCode = objectSearch.stationCode ? objectSearch.stationCode.trim() : "";
        objectSearch.page = 1;
        if (objectSearch.date || objectSearch.stationCode) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.getStationListNation();
            });
        } else {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.searchCondition"));
        }
    }

    getStationListNation = () => {
        if (this.state.objectSearch.date || this.state.objectSearch.stationCode) {
            this.props.actions.getStationListNation(this.state.objectSearch.stationCode, this.state.objectSearch.date).then((response) => {
                this.setState({
                    data: response.payload.data ? response.payload.data : [],
                    // pages: response.payload.data.pages,
                    loading: false,
                    btnSearchLoading: false
                });
            }).catch((response) => {
                this.setState({
                    loading: false,
                    btnSearchLoading: false
                });
                toastr.error(this.props.t("woManagement:woManagement.message.error.searchStationCode"));
            });
        } else {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
        }
    }

    closePopup = () => {
        this.setState({
            objectSearch: {},
            dataChecked: [],
            data: [],
            pages: null,
            selectValueGroupType: {}
        });
        this.props.closePopup();
    }

    setValue = () => {
        this.props.setValue(this.state.dataChecked);
        this.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenStationPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("woManagement:woManagement.label.stationAndLineCode")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="5">
                                <CustomAvField name="stationCode" label={t("woManagement:woManagement.label.stationAndLineCode")}
                                    placeholder={t("woManagement:woManagement.placeholder.stationAndLineCode")} />
                            </Col>
                            <Col xs="12" sm="5">
                                <CustomDatePicker
                                    name={"modifyDate"}
                                    label={t("woManagement:woManagement.label.modifyDate")}
                                    isRequired={false}
                                    selected={this.state.modifyDate}
                                    handleOnChange={(d) => this.setState({ modifyDate: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                            <Col xs="12" sm="2">
                                <Row className="mb-2">
                                    <Col xs="12"><Label></Label></Col>
                                </Row>
                                <Row>
                                    <LaddaButton type="submit"
                                        className="btn btn-primary btn-md mr-1"
                                        loading={this.state.btnSearchLoading}
                                        data-style={ZOOM_OUT}>
                                        <i className="fa fa-search"></i> {t("common:common.title.search")}
                                    </LaddaButton>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("woManagement:woManagement.label.searchResult")}</Label>
                                <CustomReactTableLocal
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    // pages={pages}
                                    loading={loading}
                                    // onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={[]}
                                    handleDataCheckbox={(d) => this.setState({ dataChecked: d })}
                                    isChooseOneCheckbox={true}
                                    handleChooseOneCheckbox={() => {toastr.warning(this.props.t("woManagement:woManagement.message.required.onlyOneRecord"));}}
                                />
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" className="ml-auto" disabled={this.state.dataChecked.length < 1} onClick={this.setValue}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

WoManagementAddStationPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, WoManagementActions, WoCdGroupManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementAddStationPopup));