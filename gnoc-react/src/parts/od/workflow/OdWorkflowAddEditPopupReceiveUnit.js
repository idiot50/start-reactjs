import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';

import * as commonActions from '../../../actions/commonActions';
import * as odWorkflowActions from './OdWorkflowActions';
import * as OdConfigScheduleCreateActions from './../configScheduleCreate/OdConfigScheduleCreateActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField } from "../../../containers/Utils";

class OdWorkflowAddEditPopupReceiveUnit extends Component {
    constructor(props) {
        super(props);

        this.onFetchData = this.onFetchData.bind(this);
        this.search = this.search.bind(this);
        this.getListReceiveUnitSearch = this.getListReceiveUnitSearch.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleDataCheckbox = this.handleDataCheckbox.bind(this);

        this.state = {
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            selected: {},
            selectAll: 0,
            //Object Search
            objectSearch: {},
            backdrop: "static",
            btnSearchLoading: false,
            listReceiveUnit: this.props.parentState.selectedData,
            dataChecked: []
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.unitName" />,
                id: "unitName",
                accessor: d => <span title={d.unitName}>{d.unitName}</span>
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.unitCode" />,
                id: "unitCode",
                accessor: d => <span title={d.unitCode}>{d.unitCode}</span>
            },
            {
                Header: <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.label.parentUnitName" />,
                id: "parentUnitName",
                accessor: d => {
                    return d.parentUnitName ? <span title={d.parentUnitName}>{d.parentUnitName}</span>
                    : <span>&nbsp;</span>
                }
            },
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
            this.getListReceiveUnitSearch();
        });
    }

    search(event, errors, values) {
        let obj = values.objectSearch;
        const objectSearch = Object.assign({}, this.state.objectSearch, obj);
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListReceiveUnitSearch(true);
        });
    }

    getListReceiveUnitSearch(isSearchClicked = false) {
        this.props.actions.getListReceiveUnitSearch(this.state.objectSearch).then((response) => {
            this.setState({
                data: response.payload.data.data ? response.payload.data.data : [],
                pages: response.payload.data.pages,
                loading: false
            });
            if(isSearchClicked) {
                this.setState({ btnSearchLoading: false });
            }
        }).catch((response) => {
            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.error.searchUnit"));
        });
    }

    closePopup() {
        this.setState({
            objectSearch: {},
            dataChecked: []
        });
        this.props.closePopup();
    }

    handleDataCheckbox(data) {
        this.setState({
            dataChecked: data
        });
    }

    addReceiveUnit(dataChecked) {
        if (dataChecked.length > 0) {
            this.props.addReceiveUnit(dataChecked);
            this.closePopup();
        } else {
            toastr.error(this.props.t("odConfigScheduleCreate:odConfigScheduleCreate.message.required.receiveUnit"));
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading, objectSearch } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupReceiveUnit} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("odConfigScheduleCreate:odConfigScheduleCreate.label.addNewReceiveUnit")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12">
                                <Row>
                                    <Col xs="12" sm="5">
                                        <CustomAvField name="objectSearch.unitName" label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.unitName")}
                                        placeholder={t("odConfigScheduleCreate:odConfigScheduleCreate.placeholder.unitName")} />
                                    </Col>
                                    <Col xs="12" sm="5">
                                        <CustomAvField name="objectSearch.unitCode" label={t("odConfigScheduleCreate:odConfigScheduleCreate.label.unitCode")}
                                        placeholder={t("odConfigScheduleCreate:odConfigScheduleCreate.placeholder.unitCode")} />
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
                                                <i className="fa fa-search"></i> <Trans i18nKey="odConfigScheduleCreate:odConfigScheduleCreate.button.search" />
                                            </LaddaButton>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </AvForm>
                    <Row>
                        <Col xs="12">
                            <Label>{t("odConfigScheduleCreate:odConfigScheduleCreate.label.unitList")}</Label>
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.onFetchData}
                                defaultPageSize={10}
                                isCheckbox={true}
                                propsCheckbox={["unitId", "unitName", "unitCode", "parentUnitName"]}
                                handleDataCheckbox={this.handleDataCheckbox}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.addReceiveUnit(this.state.dataChecked)}><i className="fa fa-check"></i> {t("odConfigScheduleCreate:odConfigScheduleCreate.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

OdWorkflowAddEditPopupReceiveUnit.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    addReceiveUnit: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { odWorkflow, common, odConfigScheduleCreate } = state;
    return {
        response: { odWorkflow, common, odConfigScheduleCreate }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, odWorkflowActions, commonActions, OdConfigScheduleCreateActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OdWorkflowAddEditPopupReceiveUnit));