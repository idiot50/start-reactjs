import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as CrManagementActions from './CrManagementActions';
import CrManagementAddEdit from './CrManagementAddEdit';

class CrManagementAddEditPopup extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedDataCr: props.parentState.selectedDataCr,
            modalName: props.parentState.modalName,
            backdrop: "static",
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.parentState.selectedDataCr) {
            this.setState({ selectedDataCr: newProps.parentState.selectedDataCr || {} });
        }
        if (newProps.parentState.modalName) {
            this.setState({ modalName: newProps.parentState.modalName });
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupCrAddEdit} className={'modal-primary modal-lg ' + this.props.className}
            backdrop={this.state.backdrop} >
                <CrManagementAddEdit
                    closePage={this.props.closePage}
                    parentState={this.props.parentState}
                    isShowPopup={true}
                    closePopup={this.props.closePopup}
                    moduleName={this.props.moduleName}
                    reloadDataGrid={this.props.reloadDataGrid} />
            </Modal>
        );
    }
}

CrManagementAddEditPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
    closePage: PropTypes.func.isRequired,
    moduleName: PropTypes.string,
    reloadDataGrid: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementAddEditPopup));