import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import LaddaButton, { ZOOM_OUT } from 'react-ladda';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Label, Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { CustomAvField, CustomSelectLocal, CustomSticky, CustomInputMultiLanguage } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import * as commonActions from './../../../actions/commonActions';
import * as UtilityConfigChildArrayActions from './UtilityConfigChildArrayActions';

class UtilityConfigChildArrayAddEdit extends Component {
    constructor(props) {
        super(props);

        this.handleOnActiveSelect = this.handleOnActiveSelect.bind(this);
        this.handleOnInActiveSelect = this.handleOnInActiveSelect.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);
        this.handleItemSelectChangeParent = this.handleItemSelectChangeParent.bind(this);

        this.state = {
            btnAddOrEditLoading: false,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Select
            statusListSelect: [
                { itemId: 1, itemName: props.t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.active") },
                { itemId: 0, itemName: props.t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.inActive") }
            ],
            selectValueStatus: props.parentState.selectedData === undefined ? { itemId: 1, itemName: props.t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.active") } : { itemId: props.parentState.selectedData.status },
            isActive: true,
            //Select
            selectValueParentCode: {},
            selectValueParentName: {},
            updateTime: null,
            listImpactSegmentCode: [],
            listImpactSegmentName: [],
            listChildrenName: []
        };
    }


    componentDidMount() {
        this.props.actions.getListImpactSegmentCBB().then((response) => {
            const listImpactSegmentName = response.payload.data && response.payload.data.map(i => ({ itemId: i.impactSegmentId, itemName: i.impactSegmentName }));
            this.setState({
                listImpactSegmentName
            })
        }).catch((response) => {
            this.setState({
                btnAddOrEditLoading: false
            }, () => {
                toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.search"));
            });
        });

        if (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") {
            this.setState({
                selectValueParentName:  this.state.selectedData.parentId ? { value: this.state.selectedData.parentId } : {},
                listChildrenName: this.state.selectedData.listChildrenName || []
            })
            this.state.selectValueStatus.itemId === 1 ? this.setState({ isActive: true }) : this.setState({ isActive: false })
        }



    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    handleValidSubmitAddOrEdit(event, values) {
        validSubmitForm(event, values, "idFormAddOrEdit");
        this.setState({
            btnAddOrEditLoading: true
        }, () => {

            const utilityConfigChildArray = Object.assign({}, values);
            utilityConfigChildArray.parentId = this.state.selectValueParentName.value;
            utilityConfigChildArray.status = this.state.selectValueStatus.itemId;
            utilityConfigChildArray.childrenName = utilityConfigChildArray['childrenName-multi-language'].trim();
            utilityConfigChildArray.childrenName = utilityConfigChildArray.childrenName.trim();
            utilityConfigChildArray.childrenCode = utilityConfigChildArray.childrenCode.trim();
            utilityConfigChildArray.listChildrenName = this.state.listChildrenName.map(item => ({ ...item, leeValue: item.leeValue ? item.leeValue.trim() : "" }));
            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                if (this.state.isAddOrEdit === "COPY") {
                    utilityConfigChildArray.childrenId = "";
                }
                this.props.actions.addUtilityConfigChildArray(utilityConfigChildArray).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.add"));
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
                            toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityConfigChildArray.childrenId = this.state.selectedData.childrenId;
                this.props.actions.editUtilityConfigChildArray(utilityConfigChildArray).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.edit"));
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
                            toastr.error(this.props.t("utilityConfigChildArray:utilityConfigChildArray.message.error.edit"));
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

    handleItemSelectChangeParent(option) {
        this.setState({ selectValueParentName: option });
    }

    handleOnActiveSelect() {
        this.setState({
            isActive: true,
            selectValueStatus: this.state.statusListSelect[0]
        });
    }

    handleOnInActiveSelect() {
        this.setState({
            isActive: false,
            selectValueStatus: this.state.statusListSelect[1]
        });
    }

    handleChangeListChildrenName = (data) => {
        this.setState({ listChildrenName: data })
    }

    render() {
        const { t } = this.props;
        console.log(this.state.selectValueParentName);
        let objectAddOrEdit = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData : {};
        let dataLanguageExchange = (this.state.isAddOrEdit === "EDIT" || this.state.isAddOrEdit === "COPY") ? this.state.selectedData.listChildrenName : [];
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormAddOrEdit" onValidSubmit={this.handleValidSubmitAddOrEdit} onInvalidSubmit={this.handleInvalidSubmitAddOrEdit} model={objectAddOrEdit}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CustomSticky>
                                    <CardHeader>
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityConfigChildArray:utilityConfigChildArray.title.utilityConfigChildArrayAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityConfigChildArray:utilityConfigChildArray.title.utilityConfigChildArrayEdit") : ''}
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
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <CustomSelectLocal
                                                name={"parentId"}
                                                label={t("utilityConfigChildArray:utilityConfigChildArray.label.parentArr")}
                                                isRequired={true}
                                                messageRequire={t("utilityConfigChildArray:utilityConfigChildArray.message.requiredParentArr")}
                                                options={this.state.listImpactSegmentName}
                                                closeMenuOnSelect={true}
                                                handleItemSelectChange={this.handleItemSelectChangeParent}
                                                selectValue={this.state.selectValueParentName}
                                            />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <CustomInputMultiLanguage
                                                formId="idFormAddOrEdit"
                                                name="childrenName"
                                                label={t("utilityConfigChildArray:utilityConfigChildArray.label.childArrName")}
                                                placeholder={t("utilityConfigChildArray:utilityConfigChildArray.placeholder.childArrName")}
                                                isRequired={true}
                                                messageRequire={t("utilityConfigChildArray:utilityConfigChildArray.message.requiredChildArrName")}
                                                maxLength={200}
                                                autoFocus={false}
                                                dataLanguageExchange={dataLanguageExchange}
                                                handleChange={this.handleChangeListChildrenName}
                                            />

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <CustomAvField name="childrenCode" label={t("utilityConfigChildArray:utilityConfigChildArray.label.childArrId")} placeholder={t("utilityConfigChildArray:utilityConfigChildArray.placeholder.childArrId")} required
                                                maxLength="100" validate={{
                                                    required: { value: true, errorMessage: t("utilityConfigChildArray:utilityConfigChildArray.message.requiredChildArrId") }
                                                }} />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AvGroup>
                                                <div>
                                                    <Label style={{ fontWeight: '500' }}>{t("utilityConfigChildArray:utilityConfigChildArray.label.status")}</Label>
                                                </div>
                                                <ButtonGroup>
                                                    <Button color="outline-info" onClick={this.handleOnActiveSelect} active={this.state.isActive}>
                                                        {t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.active")}
                                                    </Button>
                                                    <Button color="outline-info" onClick={this.handleOnInActiveSelect} active={!this.state.isActive}>
                                                        {t("utilityConfigChildArray:utilityConfigChildArray.dropdown.status.inActive")}
                                                    </Button>
                                                </ButtonGroup>
                                            </AvGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        );
    }
}

UtilityConfigChildArrayAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigChildArray, common } = state;
    return {
        response: { utilityConfigChildArray, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigChildArrayActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigChildArrayAddEdit));