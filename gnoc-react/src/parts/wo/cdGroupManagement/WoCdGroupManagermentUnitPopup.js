import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoCdGroupManagementActions from './WoCdGroupManagementActions';
import { translate, Trans } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { CustomAutocomplete, CustomReactTable } from "../../../containers/Utils";
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { toastr } from 'react-redux-toastr';
import { CustomAvField } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';



class WoCdGroupManagermentUnitPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: this.buildUnitTableColumns(),
            pages: null,
            loading: false,
            //Modal
            backdrop: "static",
            dataChecked: [],
            objectSearch: {}
        }
    }

    buildUnitTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.unitName" />,
                id: "unitName",
                sortable: false,
                accessor: d => <span title={d.unitName}>{d.unitName}</span>
            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.unitCode" />,
                id: "unitCode",
                sortable: false,
                accessor: d => <span title={d.unitCode}>{d.unitCode}</span>

            },
            {
                Header: <Trans i18nKey="woCdGroupManagement:woCdGroupManagement.label.parentUnit" />,
                id: "parentUnitName",
                sortable: false,
                accessor: d => <span title={d.parentUnitName}>{d.parentUnitName}</span>

            },
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
            this.getListUnit();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({},this.state.objectSearch, values);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListUnit();
        });
    }

    getListUnit = () => {
        this.props.actions.getListReceiveUnitSearch(this.state.objectSearch).then((response) => {
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
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getNetworkNode"));
        });
    }


    closePopup = () => {
        this.setState({
            objectSearch: {},
            dataChecked: [],
            data: [],
            pages: null
        });
        this.props.closePopup();
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    addDeviceCode = (dataChecked) => {
        if (dataChecked.length > 0) {
            this.props.setValue(dataChecked);
            this.closePopup();
        }
    }

    render() {
        const { t } = this.props;
        const { isOpenUnitPopup } = this.props.parentState;
        const { dataChecked, columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={isOpenUnitPopup}
                className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop}>
                <ModalHeader toggle={this.closePopup}>
                    {t("woCdGroupManagement:woCdGroupManagement.title.unitPopup")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="5">
                                <CustomAvField name="unitName" label={this.props.t("woCdGroupManagement:woCdGroupManagement.label.unitName")}
                                    placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.unitName")} />
                            </Col>
                            <Col xs="12" sm="5">
                                <CustomAvField name="unitCode" label={this.props.t("woCdGroupManagement:woCdGroupManagement.label.unitCode")}
                                    placeholder={this.props.t("woCdGroupManagement:woCdGroupManagement.placeholder.unitCode")} />
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
                            <Col xs="12" sm="12">
                                <Label>{t("woCdGroupManagement:woCdGroupManagement.label.searchResult")}</Label>
                                <CustomReactTable
                                    onRef={ref => (this.customReactTable = ref)}
                                    columns={columns}
                                    data={data}
                                    pages={pages}
                                    loading={loading}
                                    onFetchData={this.onFetchData}
                                    defaultPageSize={10}
                                    isCheckbox={true}
                                    propsCheckbox={["unitName", "unitCode", "unitId", "parentUnitId", "parentUnitName"]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                    isChooseOneCheckbox={false}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" className="text-center mt-3">
                                <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} onClick={() => this.addDeviceCode(dataChecked)} style={{ marginRight: '1em' }}><i className="fa fa-check"></i> {t("woCdGroupManagement:woCdGroupManagement.button.choose")}</Button>
                                <Button type="button" color="secondary" className="mr-auto" onClick={() => this.closePopup()}><i className="fa fa-close"></i> {t("woCdGroupManagement:woCdGroupManagement.button.close")}</Button>
                            </Col>
                        </Row>

                    </AvForm>

                </ModalBody>

            </Modal>
        );
    }
}

WoCdGroupManagermentUnitPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { woCdGroupManagement, common } = state;
    return {
        response: { woCdGroupManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoCdGroupManagementActions, commonActions), dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoCdGroupManagermentUnitPopup));