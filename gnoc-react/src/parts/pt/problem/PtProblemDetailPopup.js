import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import * as PtProblemActions from './PtProblemActions';
import PtProblemDetail from './PtProblemDetail';

class PtProblemDetailPopup extends Component {
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
            <Modal isOpen={this.props.parentState.detailModal} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop} >
                <PtProblemDetail
                    closePage={this.props.closePopup}
                    parentState={this.state}
                    isShowPopup={true} />
            </Modal>
        );
    }
}

PtProblemDetailPopup.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, PtProblemActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemDetailPopup));