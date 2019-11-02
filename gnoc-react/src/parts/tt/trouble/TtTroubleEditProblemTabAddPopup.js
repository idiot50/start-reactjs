import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as PtProblemActions from '../../pt/problem/PtProblemActions';
import PtProblemAdd from "../../pt/problem/PtProblemAdd";

class TtTroubleEditProblemTabAddPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            backdrop: "static"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentState.selectedData) {
            this.setState({ selectedData: nextProps.parentState.selectedData });
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupAdd} className={'modal-primary modal-lg class-modal-include'}
                backdrop={this.state.backdrop} >
                <ModalBody>
                    <PtProblemAdd
                        parentState={this.state}
                        closePage={this.props.closePage}
                        isShowPopup={true}
                        reloadPage={this.props.reloadPage} />
                </ModalBody>
            </Modal>
        );
    }
}

TtTroubleEditProblemTabAddPopup.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    reloadPage: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, PtProblemActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditProblemTabAddPopup));