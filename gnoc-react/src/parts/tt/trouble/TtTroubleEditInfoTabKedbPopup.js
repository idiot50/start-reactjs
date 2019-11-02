import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as commonActions from './../../../actions/commonActions';
import * as KedbManagementActions from '../../kedb/management/KedbManagementActions';
import KedbManagementList from "../../kedb/management/KedbManagementList";
import * as TtTroubleActions from './TtTroubleActions';

class TtTroubleEditInfoTabKedbPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            backdrop: "static",
            dataChecked: []
        };
    }

    setValue = (object) => {
        this.props.setValue(object[0].kedbCode);
    }

    setDataChecked = (dataChecked) => {
        this.setState({
            dataChecked
        });
    }

    render() {
        const { t } = this.props;
        return (
            <Modal isOpen={this.props.parentState.isOpenPopupRelatedKedb} className={'modal-primary modal-lg class-modal-include'}
                backdrop={this.state.backdrop} >
                <ModalHeader toggle={this.props.closeSearchPage}>
                    {t("ttTrouble:ttTrouble.title.kedbSearch")}
                </ModalHeader>
                <ModalBody>
                    <KedbManagementList
                        parentState={this.props.parentState}
                        isShowPopup={true}
                        setDataChecked={this.setDataChecked} />
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" disabled={this.state.dataChecked.length < 1} className="ml-auto" onClick={() => this.setValue(this.state.dataChecked)}><i className="fa fa-check"></i> {t("common:common.button.choose")}</Button>
                    <Button type="button" color="secondary" onClick={this.props.closeSearchPage} className="mr-auto"><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

TtTroubleEditInfoTabKedbPopup.propTypes = {
    closeSearchPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    setValue: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    const { kedbManagement, common } = state;
    return {
        response: { kedbManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, KedbManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditInfoTabKedbPopup));