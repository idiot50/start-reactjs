import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as KedbManagementActions from '../../kedb/management/KedbManagementActions';
import KedbManagementAddEdit from "../../kedb/management/KedbManagementAddEdit";

class PtProblemEditKedbTabAddEditPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            backdrop: "static"
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.isAddOrEdit) {
            this.setState({ isAddOrEdit: nextProps.parentState.isAddOrEdit });
        }
        if (nextProps.parentState.selectedData) {
            this.setState({ selectedData: nextProps.parentState.selectedData });
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupAddEdit} className={'modal-primary modal-lg class-modal-include'}
                backdrop={this.state.backdrop} >
                <ModalBody>
                    <KedbManagementAddEdit
                        parentState={this.props.parentState}
                        closeAddOrEditPage={this.props.closeAddOrEditPage}
                        isShowPopup={true}
                        setDataTableFromKedb={this.props.setDataTableFromKedb} />
                </ModalBody>
            </Modal>
        );
    }
}

PtProblemEditKedbTabAddEditPopup.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    setDataTableFromKedb: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { kedbManagement, common } = state;
    return {
        response: { kedbManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, KedbManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemEditKedbTabAddEditPopup));