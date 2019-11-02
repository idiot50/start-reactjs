import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import * as KedbManagementActions from './KedbManagementActions';
import KedbManagementAddEdit from './KedbManagementAddEdit';

class KedbManagementAddEditPopup extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedData: props.parentState.selectedData,
            backdrop: "static",
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.selectedData) {
            this.setState({ selectedData: newProps.parentState.selectedData });
        }
    }

    render() {
        const { t } = this.props;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupDetail} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop} >
                <KedbManagementAddEdit
                    closeAddOrEditPage={this.props.closePopup}
                    parentState={this.props.parentState}
                    isShowPopup={true} />
            </Modal>
        );
    }
}

KedbManagementAddEditPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, KedbManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(KedbManagementAddEditPopup));