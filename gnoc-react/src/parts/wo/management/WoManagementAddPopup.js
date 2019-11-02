import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as WoManagementActions from './WoManagementActions';
import WoManagementAdd from './WoManagementAdd';

class WoManagementAddPopup extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            backdrop: "static",
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.selectedData) {
            this.setState({ selectedData: newProps.parentState.selectedData });
        }
        if (newProps.parentState.modalName) {
            this.setState({ modalName: newProps.parentState.modalName });
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupWoAddEdit} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop} >
                <WoManagementAdd
                    closePage={this.props.closePage}
                    parentState={this.props.parentState}
                    isShowPopup={true}
                    closePopup={this.props.closePopup}
                    parentSource={this.props.parentSource}
                    reloadDataGridParent={this.props.reloadDataGridParent} />
            </Modal>
        );
    }
}

WoManagementAddPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    closePage: PropTypes.func.isRequired,
    parentSource: PropTypes.object.isRequired,
    reloadDataGridParent: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementAddPopup));