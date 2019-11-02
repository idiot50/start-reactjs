import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as TtTroubleActions from './TtTroubleActions';
import { CustomSticky, CustomSelectLocal, CustomAvField } from '../../../containers/Utils';
import { validSubmitForm, invalidSubmitForm } from "../../../containers/Utils/Utils";
import { timeout } from 'q';
import { setTimeout } from 'timers';

class TtTroubleEditBRCDInfoTab extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            brcdData: {},
            btnAddOrEditLoading: false,
            //Select
            selectValueStatus: {},
            isRequired: false,
            tabIndex: null,
            isValidSubmitForm: false
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        this.setState({
            isValidSubmitForm: false
        }, () => {
            this.props.onChangeChildTab(this.state.tabIndex, this.state, errors);
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        this.setState({
            isValidSubmitForm: true
        }, () => {
            const state = Object.assign({}, this.state);
            state.brcdData = values;
            this.props.onChangeChildTab(this.state.tabIndex, state);
        });
        // validSubmitForm(event, values, "idFormAddOrEdit");
        // this.setState({
        //     btnAddOrEditLoading: true
        // }, () => {
        //     const ttTrouble = Object.assign({}, this.state.selectedData, values);
        //     this.updateTtProblem(ttTrouble);
        // });
    }

    setFieldsProperty = (check) => {
        this.setState({
            isRequired: check
        });
    }

    updateTtProblem = (ttTrouble) => {
        // this.setState({
        //     brcdData: ttTrouble
        // }, () => {
        //     if (this.props.parentState.objectInfoTab.isReqBRCD) {
        //         this.setState({
        //             isSubmit: true
        //         }, () => {
        //             this.props.onChangeChildTab(8, this.state);
        //         });
        //     } else {
        //         this.props.onChangeChildTab(8, this.state);
        //     }
        // });
        // toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.updateBRCD"));
        // this.props.actions.getInsertOrUpdateInfoBRCD(ttTrouble).then((response) => {
        //     this.setState({
        //         btnAddOrEditLoading: false
        //     }, () => {
        //         if (response.payload.data.key === "SUCCESS") {
        //             this.props.closePage("EDIT");
        //             toastr.success(this.props.t("ttTrouble:ttTrouble.message.success.updateBRCD"));
        //         } else if (response.payload.data.key === "ERROR") {
        //             toastr.error(response.payload.data.message);
        //         } else {
        //             toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.updateBRCD"));
        //         }
        //     });
        // }).catch((response) => {
        //     this.setState({
        //         btnAddOrEditLoading: false
        //     }, () => {
        //         try {
        //             toastr.error(response.error.response.data.errors[0].defaultMessage);
        //         } catch (error) {
        //             toastr.error(this.props.t("ttTrouble:ttTrouble.message.error.updateBRCD"));
        //         }
        //     });
        // });
    }

    onSubmitForm(tabIndex, isVisibleTab) {
        this.setState({
            tabIndex
        }, () => {
            if (isVisibleTab) {
                this.myForm.submit();
            } else {
                setTimeout(() => {
                    this.props.onChangeChildTab(this.state.tabIndex, {isValidSubmitForm: true});
                }, 100);
            }
        });
    }

    render() {
        const { t } = this.props;
        const { isRequired } = this.state;
        let objectAddOrEdit = this.state.selectedData;
        objectAddOrEdit.numAon = objectAddOrEdit.numAon || "";
        objectAddOrEdit.numGpon = objectAddOrEdit.numGpon || "";
        objectAddOrEdit.numNexttv = objectAddOrEdit.numNexttv || "";
        objectAddOrEdit.numThc = objectAddOrEdit.numThc || "";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEditBRCDTab" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit} ref={(ref) => this.myForm = ref}>
                    <Card>
                        <CustomSticky level={1}>
                            <CardHeader>
                                {t("ttTrouble:ttTrouble.title.brcdInformation")}
                                {/* <div className="card-header-actions card-header-actions-button">
                                    <LaddaButton type="submit"
                                        className="btn btn-primary btn-md mr-1"
                                        loading={this.state.btnAddOrEditLoading}
                                        data-style={ZOOM_OUT}>
                                        <i className="fa fa-save"></i> {t("common:common.button.save")}
                                    </LaddaButton>{' '}
                                </div> */}
                            </CardHeader>
                        </CustomSticky>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="numAon" label={t("ttTrouble:ttTrouble.label.aon")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.aon")}
                                        required={isRequired} maxLength="9"
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.aon") },
                                                    pattern: {value: '^[+]?[0-9]+$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.onlyInteger")} }} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="numGpon" label={t("ttTrouble:ttTrouble.label.gpon")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.gpon")}
                                        required={isRequired} maxLength="9"
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.gpon") },
                                                    pattern: {value: '^[+]?[0-9]+$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.onlyInteger")} }} />
                                </Col>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="numNexttv" label={t("ttTrouble:ttTrouble.label.nexttv")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.nexttv")}
                                        required={isRequired} maxLength="9"
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.nexttv") },
                                                    pattern: {value: '^[+]?[0-9]+$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.onlyInteger")} }} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="12" sm="4">
                                    <CustomAvField name="numThc" label={t("ttTrouble:ttTrouble.label.thc")}
                                        placeholder={t("ttTrouble:ttTrouble.placeholder.thc")}
                                        required={isRequired} maxLength="9"
                                        validate={{ required: { value: true, errorMessage: t("ttTrouble:ttTrouble.message.required.thc") },
                                                    pattern: {value: '^[+]?[0-9]+$', errorMessage: this.props.t("ttTrouble:ttTrouble.message.error.onlyInteger")} }} />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </AvForm>
            </div>
        );
    }
}

TtTroubleEditBRCDInfoTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeChildTab: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    const { ttTrouble, common } = state;
    return {
        response: { ttTrouble, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, TtTroubleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(TtTroubleEditBRCDInfoTab));