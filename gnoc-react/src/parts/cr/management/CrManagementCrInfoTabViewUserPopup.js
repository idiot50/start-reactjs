import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTableLocal } from '../../../containers/Utils';

class CrManagementCrInfoTabViewUserPopup extends Component {
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
            selectValueUnitConsider: {}
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.selectValueUnitConsider) {
            this.setState({ selectValueUnitConsider: newProps.parentState.selectValueUnitConsider });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.staffCode" />,
                id: "staffCode",
                accessor: d => d.staffCode ? <span title={d.staffCode}>{d.staffCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.staffName" />,
                id: "fullname",
                accessor: d => d.fullname ? <span title={d.fullname}>{d.fullname}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.staffTelNumber" />,
                id: "mobile",
                accessor: d => d.mobile ? <span title={d.mobile}>{d.mobile}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.unitName" />,
                id: "unitName",
                accessor: d => d.unitName ? <span title={d.unitName}>{d.unitName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.role" />,
                id: "roleName",
                accessor: d => d.roleName ? <span title={d.roleName}>{d.roleName}</span> : <span>&nbsp;</span>
            },
        ];
    }

    actionGetListUser = () => {
        this.props.actions.actionGetListUser(this.state.selectValueUnitConsider.value, "", "", "", "", "", "", "1").then((response) => {
            const data = response.payload.data || [];
            this.setState({
                data
            });
        }).catch((response) => {
            toastr.error(this.props.t("crManagement:crManagement.message.error.getListUser"));
        });
    }

    closePopup() {
        this.props.closePopup();
    }

    render() {
        const { t } = this.props;
        const { columns, data } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenViewUserPopup} className={'modal-primary modal-lg ' + this.props.className}
                backdrop={this.state.backdrop} onOpened={this.actionGetListUser}>
                <ModalHeader toggle={this.closePopup}>
                    {t("crManagement:crManagement.title.userList")}
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

CrManagementCrInfoTabViewUserPopup.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementCrInfoTabViewUserPopup));