import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomAvField, CustomReactTableLocal, CustomReactTable } from '../../../containers/Utils';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { AvForm } from 'availity-reactstrap-validation';

class TtTroubleSearchLineCutCodePopup extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.onFetchData = this.onFetchData.bind(this);
        this.handleChooseClick = this.handleChooseClick.bind(this);
        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            backdrop: "static",
            objectSearch: {},
            //Table1
            data: [],
            pages: null,
            loading: false,
            dataChecked: [],
            columns: this.buildTableColumns(),

        };
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.lineCutCode" />,
                id: "laneCode",
                accessor: d => <span title={d.laneCode}>{d.laneCode}</span>
            }, {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.startPoint" />,
                id: "startPoint",
                accessor: d => <span title={d.startPoint}>{d.startPoint}</span>
            }, {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.endPoint" />,
                id: "endPoint",
                accessor: d => <span title={d.endPoint}>{d.endPoint}</span>
            }, {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.length" />,
                id: "length",
                accessor: d => <span title={d.length}>{d.length}</span>
            }
        ]
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
            this.searchInfraCableLane();
        });
    }

    search(event, values) {
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.laneCode = objectSearch.laneCode ? objectSearch.laneCode.trim() : "";
        objectSearch.page = 1;
        if (objectSearch.laneCode) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch
            }, () => {
                this.customReactTable.resetPage();
                this.searchInfraCableLane();
            });
        } else {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.searchCondition"));
        }
    }

    searchInfraCableLane() {
        if (this.state.objectSearch.laneCode) {
            this.props.actions.searchInfraCableLane(this.state.objectSearch).then((response) => {
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
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.infraCableLane"));
            });
        } else {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
        }
    }

    handleDataCheckbox = (data) => {
        this.setState({
            dataChecked: data
        });
    }

    handleChooseClick = (dataChecked) => {
        if (dataChecked.length === 0) {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.lineCutCode"));
        } else {
            let setDataChecked = dataChecked.map(i => { return i.laneCode }).join(",")
            this.props.setValue(setDataChecked);
            this.props.closePopup();
            this.setState({
                objectSearch: {},
                data: [],
                dataChecked: [],
            });
        }
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

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        const objectSearch = {};
        return (
            <Modal isOpen={this.props.parentState.isOpenSearchLineCutCodePopup}
                className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop}>
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.title.lineCutCode")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="10">
                                <CustomAvField name="laneCode" label={this.props.t("ttTrouble:ttTrouble.label.lineCutCode")}
                                    placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.lineCutCode")} />
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
                                    propsCheckbox={["laneCode"]}
                                    handleDataCheckbox={this.handleDataCheckbox}
                                    // isChooseOneCheckbox={true}
                                    // handleChooseOneCheckbox={() => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" className="text-center mt-3">
                                <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" style={{ margin: '0 auto' }} onClick={() => this.handleChooseClick(this.state.dataChecked)}><i className="fa fa-check"></i> {t("ttTrouble:ttTrouble.button.choose")}</Button>
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
            </Modal>);
    }
}

TtTroubleSearchLineCutCodePopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired
}

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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleSearchLineCutCodePopup))