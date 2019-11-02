import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Card, CardBody, CardHeader, Collapse, Row } from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { toastr } from 'react-redux-toastr';
import * as commonActions from './../../../actions/commonActions';
import * as WoConfigMapUnitGnocNimsActions from './WoConfigMapUnitGnocNimsActions';
import {  CustomSelectLocal, CustomSticky, CustomAvField } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class WoConfigMapUnitGnocNimsAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeBusinessName = this.handleItemSelectChangeBusinessName.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            selectBusinessName: {}
        };
    }
    componentDidMount() {
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                selectBusinessName : this.state.selectedData.businessCode ? {value:this.state.selectedData.businessCode} : {}
            });
        }
        //get combobox
        this.props.actions.getItemMaster("CFG_MAP_GNOC_NIMS_BUSINESS", "itemId", "itemName", "1", "3").then((response) => {
            let businessNameList = (response.payload && response.payload.data && response.payload.data.data) ? response.payload.data.data.map(i=>{ return {itemId:i.itemId,itemName:i.itemName}}) : []
            this.setState({
                businessNameList
            })
        }).catch((response) => {
            toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.search"));
        });
       
        
    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

   
    onChangeRowProcessTime(newValue, object) {
        //Set into data
        const data = [...this.state.data];
        for(const obj of data) {
            if(obj.itemId === object.itemId) {
                obj.processTime = newValue;
                break;
            }
        }
        this.setState({
            data
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {
            values.businessCode = this.state.selectBusinessName.value||null;
            const woConfigMapUnitGnocNims = Object.assign({}, values);
            woConfigMapUnitGnocNims.unitNimsCode =  woConfigMapUnitGnocNims.unitNimsCode.trim();
            woConfigMapUnitGnocNims.unitGnocCode = woConfigMapUnitGnocNims.unitGnocCode.trim();
            console.log(woConfigMapUnitGnocNims);
            if(this.state.isAddOrEdit === "COPY") {
                woConfigMapUnitGnocNims.id = "";
            }
          
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addWoConfigMapUnitGnocNims(woConfigMapUnitGnocNims).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.success.add"));
                        });
                    } else if(response.payload.data.key === "FAIL") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.add"));
                        });
                    }else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.warning(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.duplicate"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                woConfigMapUnitGnocNims.id = this.state.selectedData.id;
                this.props.actions.editWoConfigMapUnitGnocNims(woConfigMapUnitGnocNims).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            console.error(error);
                            toastr.error(this.props.t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.error.edit"));
                        }
                    });
                });
            }
        });
    }

    handleInvalidSubmitAddOrEdit(event, errors, values) {
        toastr.warning(this.props.t("common:common.message.required.allFields"));
        invalidSubmitForm(event, errors, values, "idFormAddOrEdit");
    }

    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleItemSelectChangeBusinessName(option) {
        this.setState({selectBusinessName: option});
    }


    render() {
        const { t } = this.props;
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.title.woConfigMapUnitGnocNimsAdd") : this.state.isAddOrEdit === "EDIT" ? t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.title.woConfigMapUnitGnocNimsEdit") : ''}
                                        <div className="card-header-actions card-header-actions-button">
                                            <LaddaButton type="submit"
                                                className="btn btn-primary btn-md mr-1"
                                                loading={this.state.btnAddOrEditLoading}
                                                data-style={ZOOM_OUT}>
                                                <i className="fa fa-save"></i> {(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("common:common.button.save") : this.state.isAddOrEdit === "EDIT" ? t("common:common.button.update") : ''}
                                            </LaddaButton>{' '}
                                            <Button type="button" color="secondary" onClick={this.props.closeAddOrEditPage}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                        </div>
                                    </CardHeader>
                                </CustomSticky>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card>
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="unitNimsCode" label={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.label.NIMSCode")} placeholder={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.placeholder.NIMSCode")} required
                                                                    autoFocus maxLength="500" validate={{ required: { value: true, errorMessage: t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.requiredNIMSCode") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomAvField name="unitGnocCode" label={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.label.GNOCCode")} placeholder={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.placeholder.GNOCCode")} required
                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.message.requiredGNOCCode") } }} />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <CustomSelectLocal
                                                                    name={"businessCode"}
                                                                    label={t("woConfigMapUnitGnocNims:woConfigMapUnitGnocNims.label.businessName")}
                                                                    isRequired={false}
                                                                    options={(this.state.businessNameList)?this.state.businessNameList:[]}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeBusinessName}
                                                                    selectValue={this.state.selectBusinessName}
                                                                />
                                                            </Col> 
                                                        </Row>
                                                     
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            
                                        </Row>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

WoConfigMapUnitGnocNimsAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woConfigMapUnitGnocNims, common } = state;
    return {
        response: { woConfigMapUnitGnocNims, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoConfigMapUnitGnocNimsActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoConfigMapUnitGnocNimsAddEdit));