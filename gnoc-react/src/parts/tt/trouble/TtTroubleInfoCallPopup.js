import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import CustomReactTable from "../../../containers/Utils/CustomReactTable";

class TtTroubleInfoCallPopup extends Component {
    constructor(props) {
        super(props);

        this.closePopup = this.closePopup.bind(this);

        this.state = {
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {}
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.selectedData) {
            this.setState({ selectedData: newProps.parentState.selectedData });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.userCall" />,
                id: "userCall",
                accessor: d => <span title={d.userCall}>{d.userCall}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.startCallTime" />,
                id: "startCallTime",
                accessor: d => <span title={d.startCallTime}>{d.startCallTime}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.receiveUnit" />,
                id: "userName",
                accessor: d => <span title={d.userName}>{d.userName}</span>
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.mobile" />,
                id: "phone",
                accessor: d => <span title={d.phone}>{d.phone}</span>,
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.result" />,
                id: "result",
                accessor: d => <span title={d.result}>{d.result}</span>,
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.resultTime" />,
                id: "resultTime",
                accessor: d => <span title={d.resultTime}>{d.resultTime}</span>,
            },
            {
                Header: <Trans i18nKey="ttTrouble:ttTrouble.label.description" />,
                id: "description",
                accessor: d => <span title={d.description}>{d.description}</span>,
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
        objectSearch.troubleId = this.state.selectedData.troubleId;

        this.setState({
            loading: true,
            objectSearch: objectSearch
        }, () => {
            this.viewCall();
        });
    }

    viewCall = () => {
        this.props.actions.viewCall(this.state.objectSearch).then((response) => {
            const data = response.payload.data.data || [];
            if (data.length > 0) {
                data[0].totalRow = response.payload.data.total;
            }
            this.setState({
                data,
                pages: response.payload.data.pages,
                loading: false
            });
        }).catch((response) => {
            this.setState({
                loading: false
            });
            toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.getViewCall"));
        });
    }

    closePopup() {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenInfoCallPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.closePopup}>
                    {t("ttTrouble:ttTrouble.button.infoCall")}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="12">
                            <CustomReactTable
                                onRef={ref => (this.customReactTable = ref)}
                                columns={columns}
                                data={data}
                                pages={pages}
                                loading={loading}
                                onFetchData={this.onFetchData}
                                defaultPageSize={10}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="secondary" onClick={this.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TtTroubleInfoCallPopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleInfoCallPopup));