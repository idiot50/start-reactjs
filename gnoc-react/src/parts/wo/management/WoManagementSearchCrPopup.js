import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as TtTroubleActions from '../../tt/trouble/TtTroubleActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField, CustomDatePicker } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';
import { convertDateToDDMMYYYYHHMISS, validSubmitForm } from '../../../containers/Utils/Utils';

class WoManagementSearchCrPopup extends Component {
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
            loading: true,
            columns: this.buildTableColumns(),
            dataChecked: [],
            earliestStartTime: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            earliestStartTimeTo: new Date()
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.crNumber" />,
                id: "crNumber",
                sortable: false,
                accessor: d => <span title={d.crNumber}>{d.crNumber}</span>
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
            this.searchCrRelated();
        });
    }

    search = (event, values) => {
        validSubmitForm(event, values, "idFormSearchCr");
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.crNumber = objectSearch.crNumber ? objectSearch.crNumber.trim() : "";
        objectSearch.earliestStartTime = this.state.earliestStartTime ? convertDateToDDMMYYYYHHMISS(this.state.earliestStartTime) : "";
        objectSearch.earliestStartTimeTo = this.state.earliestStartTimeTo ? convertDateToDDMMYYYYHHMISS(this.state.earliestStartTimeTo) : "";
        objectSearch.page = 1;
        if (objectSearch.crNumber) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.searchCrRelated();
            });
        } else {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.searchCondition"));
        }
    }

    searchCrRelated = () => {
        if (this.state.objectSearch.crNumber) {
            this.props.actions.searchCrRelated(this.state.objectSearch).then((response) => {
                this.setState({
                    data: response.payload.data.data ? response.payload.data.data : [],
                    pages: response.payload.data.pages,
                    loading: false,
                    btnSearchLoading: false
                });
            }).catch((response) => {
                this.setState({
                    loading: false,
                    btnSearchLoading: false
                });
                toastr.error(this.props.t("woManagement:woManagement.message.error.searchCr"));
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
            dataChecked: []
        });
        this.props.closePopup();
    }

    setValue = () => {
        if (this.state.dataChecked.length === 1) {
            this.props.setValue(this.state.dataChecked[0]);
            this.closePopup();
        } else {
            toastr.warning(this.props.t("woManagement:woManagement.message.required.onlyOneRecord"));
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupSearchCr} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("woManagement:woManagement.button.searchCr")}
                </ModalHeader>
                <ModalBody>
                    <AvForm id="idFormSearchCr" onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="4">
                                <CustomAvField name="crNumber" label={this.props.t("woManagement:woManagement.label.crNumber")}
                                placeholder={this.props.t("woManagement:woManagement.placeholder.crNumber")} />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomDatePicker
                                    name={"earliestStartTime"}
                                    label={t("woManagement:woManagement.label.earliestStartTime")}
                                    isRequired={true}
                                    messageRequire={t('woManagement:woManagement.message.required.earliestStartTime')}
                                    selected={this.state.earliestStartTime}
                                    handleOnChange={(d) => this.setState({ earliestStartTime: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                            <Col xs="12" sm="4">
                                <CustomDatePicker
                                    name={"earliestStartTimeTo"}
                                    label={t("woManagement:woManagement.label.latestStartTime")}
                                    isRequired={true}
                                    messageRequire={t('woManagement:woManagement.message.required.latestStartTime')}
                                    selected={this.state.earliestStartTimeTo}
                                    handleOnChange={(d) => this.setState({ earliestStartTimeTo: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="align-self-center text-center">
                                <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-search"></i> {t("common:common.title.search")}
                                </LaddaButton>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Label>{t("woManagement:woManagement.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={[]}
                                    handleDataCheckbox={(d) => this.setState({ dataChecked: d })}
                                    // isChooseOneCheckbox={true}
                                    // handleChooseOneCheckbox={() => {toastr.warning(this.props.t("woManagement:woManagement.message.required.onlyOneRecord"));}}
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

WoManagementSearchCrPopup.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, commonActions, WoManagementActions, TtTroubleActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementSearchCrPopup));