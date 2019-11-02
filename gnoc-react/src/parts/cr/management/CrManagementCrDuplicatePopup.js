import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTableLocal } from '../../../containers/Utils';

class CrManagementCrDuplicatePopup extends Component {
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
            objectSearch: {},
            checkDuplicateDto: {}
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.checkDuplicateDto) {
            this.setState({ checkDuplicateDto: newProps.parentState.checkDuplicateDto });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.deviceCode" />,
                id: "deviceCode",
                accessor: d => d.deviceCode ? <span title={d.deviceCode}>{d.deviceCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.nodeIp" />,
                id: "ip",
                accessor: d => d.ip ? <span title={d.ip}>{d.ip}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.startTime" />,
                id: "startTime",
                accessor: d => d.startTime ? <span title={d.startTime}>{d.startTime}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.endTime" />,
                id: "endTime",
                accessor: d => d.endTime ? <span title={d.endTime}>{d.endTime}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crNumber" />,
                id: "crNumber",
                accessor: d => d.crNumber ? <span title={d.crNumber}>{d.crNumber}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.crName" />,
                id: "title",
                accessor: d => d.title ? <span title={d.title}>{d.title}</span> : <span>&nbsp;</span>
            },
        ];
    }

    actionGetListUser = () => {
        this.props.actions.actionGetListDuplicateCRImpactedNode(this.state.checkDuplicateDto).then((response) => {
            console.log(response)
            // const data = response.payload.data || [];
            // this.setState({
            //     data
            // });
        }).catch((response) => {
            toastr.error(this.props.t("crManagement:crManagement.message.error.getListDuplicate"));
        });
    }

    closePopup() {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupDuplicate} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} onOpened={this.actionGetListUser}>
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.checkDuplicateResult")}
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

CrManagementCrDuplicatePopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, CrManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCrDuplicatePopup));