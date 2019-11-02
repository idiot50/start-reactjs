import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";
import { CustomAvField, CustomSelectLocal } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';

class TtTroubleEditMobileInfoTabCellPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            selectValueCellType: {},
            //Table
            data: [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns(),
            dataChecked: []
        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.cellCode" />,
                id: "cellCode",
                accessor: d => <span title={d.cellCode}>{d.cellCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.btsCode" />,
                id: "btsCode",
                accessor: d => <span title={d.btsCode}>{d.btsCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.deviceCodeCell" />,
                id: "deviceCode",
                accessor: d => <span title={d.deviceCode}>{d.deviceCode}</span>
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
            this.getListCellService();
        });
    }

    search = (event, values) => {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.cellCode = objectSearch.cellCode ? objectSearch.cellCode.trim() : "";
        objectSearch.cellType = this.state.selectValueCellType.value ? this.state.selectValueCellType.label : "";
        objectSearch.page = 1;
        this.setState({
            btnSearchLoading: true,
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.customReactTable.resetPage();
            this.getListCellService();
        });
    }

    getListCellService = () => {
        if (this.state.objectSearch.cellCode && this.state.objectSearch.cellType) {
            this.props.actions.getListCellService(this.state.objectSearch).then((response) => {
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
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getCellService"));
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
            selectValueCellType: {},
            data: [],
            pages: null
        });
        this.props.closePopup();
    }

    setValue = () => {
        if (this.state.dataChecked.length === 1) {
            this.props.setValue(this.state.dataChecked[0]);
            this.closePopup();
        } else {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenCell} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.title.cellService")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="5">
                                <CustomAvField name="cellCode" label={this.props.t("ttTrouble:ttTrouble.label.cellCode")}
                                placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.cellCode")} required maxLength="250"
                                validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.cellCode") } }} />
                            </Col>
                            <Col xs="12" sm="5">
                                <CustomSelectLocal
                                    name={"cellType"}
                                    label={t("ttTrouble:ttTrouble.label.cellType")}
                                    isRequired={true}
                                    messageRequire={t("ttTrouble:ttTrouble.message.required.cellType")}
                                    options={[
                                        {itemId: "2", itemName: "Cell 2G"},
                                        {itemId: "3", itemName: "Cell 3G"},
                                        {itemId: "4", itemName: "Cell 4G"}
                                    ]}
                                    closeMenuOnSelect={true}
                                    handleItemSelectChange={(d) => this.setState({ selectValueCellType: d })}
                                    selectValue={this.state.selectValueCellType}
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
                                <Label>{t("ttTrouble:ttTrouble.label.searchResult")}</Label>
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
                                    isChooseOneCheckbox={true}
                                    handleChooseOneCheckbox={() => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));}}
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

TtTroubleEditMobileInfoTabCellPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditMobileInfoTabCellPopup));