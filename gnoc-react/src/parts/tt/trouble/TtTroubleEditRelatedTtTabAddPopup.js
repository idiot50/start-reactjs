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
import { CustomAvField, CustomDatePicker } from '../../../containers/Utils';
import { AvForm } from 'availity-reactstrap-validation';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';

class TtTroubleEditRelatedTtTabAddPopup extends Component {
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
            createdTimeFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            createdTimeTo: new Date(new Date().setHours(23,59,59,999)),
            isFirst: true,
            dataChecked: []
        };
    }

    buildTableColumns() {
        return [
            // {
            //     Header: <Trans i18nKey="ttTrouble:ttTrouble.label.action"/>,
            //     id: "action",
            //     width: 100,
            //     accessor: d => (
            //         <div className="text-center">
            //             <span title={this.props.t("common:common.button.choose")}>
            //                 <Button type="button" size="sm" color="secondary" className="btn-info icon mr-1" onClick={() => this.updateTtTrouble(d)}>
            //                     <i className="fa fa-check"></i>
            //                 </Button>
            //             </span>
            //         </div>
            //     )
            // },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.troubleCode" />,
                id: "troubleCode",
                width: 200,
                accessor: d => <span title={d.troubleCode}>{d.troubleCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.troubleName" />,
                id: "troubleName",
                width: 200,
                accessor: d => <span title={d.troubleName}>{d.troubleName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.receiveUnitProblemTab" />,
                id: "receiveUnitName",
                width: 300,
                accessor: d => <span title={d.receiveUnitName}>{d.receiveUnitName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.createTime" />,
                id: "createdTime",
                minWidth: 100,
                accessor: d => <span title={convertDateToDDMMYYYYHHMISS(d.createdTime)}>{convertDateToDDMMYYYYHHMISS(d.createdTime)}</span>
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
        if (this.state.isFirst) {
            objectSearch.createdTimeFrom = convertDateToDDMMYYYYHHMISS(this.state.createdTimeFrom);
            objectSearch.createdTimeTo = convertDateToDDMMYYYYHHMISS(this.state.createdTimeTo);
        }

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.getListRelatedTTByPopup();
        });
    }

    search = (event, values) => {
        if (this.state.createdTimeFrom > this.state.createdTimeTo) {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.error.createTimeFrom"));
        }
        const objectSearch = Object.assign({}, this.state.objectSearch, values);
        objectSearch.createdTimeFrom = convertDateToDDMMYYYYHHMISS(this.state.createdTimeFrom);
        objectSearch.createdTimeTo = convertDateToDDMMYYYYHHMISS(this.state.createdTimeTo);
        objectSearch.page = 1;
        if (objectSearch.troubleCode || objectSearch.troubleName) {
            this.setState({
                btnSearchLoading: true,
                loading: true,
                objectSearch: objectSearch,
                isFirst: false
            }, () => {
                this.customReactTable.resetPage();
                this.getListRelatedTTByPopup();
            });
        } else {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.searchCondition"));
        }
    }

    updateTtTrouble = () => {
        if (this.state.dataChecked.length === 1) {
            const ttTrouble = Object.assign({}, this.state.selectedData);
            ttTrouble.relatedTt = this.state.dataChecked[0].troubleCode;
            this.props.actions.onUpdateTroubleEntity(ttTrouble).then((response) => {
                if (response.payload.data.key === "SUCCESS") {
                    this.props.setDataFromPopup([this.state.dataChecked[0]]);
                    this.closePopup();
                    toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.update"));
                } else if (response.payload.data.key === "ERROR") {
                    toastr.error(response.payload.data.message);
                } else {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
                }
            }).catch((response) => {
                try {
                    toastr.error(response.error.response.data.errors[0].defaultMessage);
                } catch (error) {
                    toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.update"));
                }
            });
        } else {
            toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));
        }
    }

    getListRelatedTTByPopup = () => {
        if (this.state.objectSearch.troubleCode || this.state.objectSearch.troubleName) {
            this.props.actions.getListRelatedTTByPopup(this.state.objectSearch).then((response) => {
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
                toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.search"));
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
            isFirst: true,
            createdTimeFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            createdTimeTo: new Date(new Date().setHours(23,59,59,999)),
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
            <Modal isOpen={this.props.parentState.isOpenSearchPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.title.troubleList")}
                </ModalHeader>
                <ModalBody>
                    <AvForm onValidSubmit={this.search} model={objectSearch}>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomAvField name="troubleCode" label={this.props.t("ttTrouble:ttTrouble.label.troubleCode")}
                                placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.troubleCode")} />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomAvField name="troubleName" label={this.props.t("ttTrouble:ttTrouble.label.troubleName")}
                                placeholder={this.props.t("ttTrouble:ttTrouble.placeholder.troubleName")} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"createdTimeFrom"}
                                    label={t("ttTrouble:ttTrouble.label.createDateFrom")}
                                    isRequired={true}
                                    messageRequire={t("ttTrouble:ttTrouble.message.required.createDateFrom")}
                                    selected={this.state.createdTimeFrom}
                                    handleOnChange={(d) => this.setState({ createdTimeFrom: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                            <Col xs="12" sm="6">
                                <CustomDatePicker
                                    name={"createdTimeTo"}
                                    label={t("ttTrouble:ttTrouble.label.createDateTo")}
                                    isRequired={true}
                                    messageRequire={t("ttTrouble:ttTrouble.message.required.createDateTo")}
                                    selected={this.state.createdTimeTo}
                                    handleOnChange={(d) => this.setState({ createdTimeTo: d })}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeSelect={true}
                                    timeFormat="HH:mm:ss"
                                    placeholder="dd/MM/yyyy HH:mm:ss"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" className="align-self-center text-center">
                                {/* <LaddaButton type="submit"
                                    className="btn btn-primary btn-md mr-1"
                                    loading={this.state.btnSearchLoading}
                                    data-style={ZOOM_OUT}>
                                    <i className="fa fa-search"></i> {t("common:common.title.search")}
                                </LaddaButton> */}
                                <Button type="submit" color="primary">
                                    <i className="fa fa-search"></i> {t("common:common.title.search")}
                                </Button>
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
                    <Button type="button" color="primary" className="ml-auto" disabled={this.state.dataChecked.length < 1} onClick={this.updateTtTrouble}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TtTroubleEditRelatedTtTabAddPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    setDataFromPopup: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditRelatedTtTabAddPopup));