import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomReactTableLocal } from '../../../containers/Utils';

class TtTroubleEditMobileInfoTabConcavePopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            btnSearchLoading: false,
            selectedData: props.parentState.selectedData,
            objectSearch: {},
            backdrop: "static",
            //Table
            data: [],
            columns: this.buildTableColumns(),
            dataChecked: [],
            latitude: '',
            longitude: ''
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.longitude) {
            this.setState({ longitude: newProps.parentState.longitude });
        }
        if (newProps.parentState.latitude) {
            this.setState({ latitude: newProps.parentState.latitude });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.concave" />,
                id: "concavePointCode",
                accessor: d => <span title={d.concavePointCode}>{d.concavePointCode}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.cell" />,
                id: "cells",
                accessor: d => <span title={d.cells}>{d.cells}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.latitude" />,
                id: "lat",
                accessor: d => <span title={d.lat}>{d.lat}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.longitude" />,
                id: "lng",
                accessor: d => <span title={d.lng}>{d.lng}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.approveStatus" />,
                id: "approveStatusName",
                accessor: d => <span title={d.approveStatusName}>{d.approveStatusName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.location" />,
                id: "locationNameFull",
                accessor: d => <span title={d.locationNameFull}>{d.locationNameFull}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.networkType" />,
                id: "networkTypeName",
                accessor: d => <span title={d.networkTypeName}>{d.networkTypeName}</span>
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
            objectSearch: objectSearch
        }, () => {
            this.getListConcave();
        });
    }

    getListConcave = () => {
        this.props.actions.getListConcave([], this.state.longitude, this.state.latitude).then((response) => {
            this.setState({
                data: response.payload.data ? response.payload.data : [],
                pages: response.payload.data.pages,
                loading: false,
                btnSearchLoading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false,
                btnSearchLoading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getConcave"));
        });
    }

    closePopup = () => {
        this.setState({
            dataChecked: []
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
        const { columns, data } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenConcave} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} onOpened={this.getListConcave} >
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.title.tktuList")}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="12">
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
                                handleDataCheckbox={(d) => this.setState({ dataChecked: d })}
                                isChooseOneCheckbox={true}
                                handleChooseOneCheckbox={() => {toastr.warning(this.props.t("ttTrouble:ttTrouble.message.required.onlyOneRecord"));}}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" className="ml-auto" disabled={this.state.dataChecked.length < 1} onClick={this.setValue}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" className="mr-auto" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TtTroubleEditMobileInfoTabConcavePopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditMobileInfoTabConcavePopup));