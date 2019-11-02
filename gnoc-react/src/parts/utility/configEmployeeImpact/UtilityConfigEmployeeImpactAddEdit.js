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
import * as UtilityConfigEmployeeImpactActions from './UtilityConfigEmployeeImpactActions';
import { CustomAutocomplete, CustomSelectLocal, CustomSticky } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';

class UtilityConfigEmployeeImpactAddEdit extends Component {
    constructor(props) {
        super(props);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleValidSubmitAddOrEdit = this.handleValidSubmitAddOrEdit.bind(this);
        this.handleInvalidSubmitAddOrEdit = this.handleInvalidSubmitAddOrEdit.bind(this);

        this.handleOnChangeEmpUser = this.handleOnChangeEmpUser.bind(this);
        this.handleItemSelectChangeEmpArray = this.handleItemSelectChangeEmpArray.bind(this);
        this.handleItemSelectChangeEmpArrayChild = this.handleItemSelectChangeEmpArrayChild.bind(this);
        this.handleItemSelectChangeEmpLevel = this.handleItemSelectChangeEmpLevel.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isAddOrEdit: props.parentState.isAddOrEdit,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            selectEmpUser: {},
            selectValueStatus: {},
            selectEmpArray: {},
            selectEmpArrayChild: {},
            selectEmpLevel: {},
            listParentArray: [],
            listChildArray:[]
        };
    }

    componentDidMount() {
        this.props.actions.getListParentArray().then((response) => {
            const list = response.payload.data.map(i => { return ({ itemName: i.displayStr, itemId: i.valueStr }) })
            this.setState({ listParentArray: list })
        });

        this.props.actions.getListChildArray({page:1,pageSize:100}).then((response) =>{
            const list = response.payload.data.map(i => { return ({ itemName: i.childrenName, itemId: i.childrenId }) })
            this.setState({ listChildArray: list })

        });
        if (this.state.isAddOrEdit === 'EDIT' || this.state.isAddOrEdit === 'COPY') {
            this.setState({
                selectEmpUser: this.state.selectedData.empId ? { value: this.state.selectedData.empId,label:this.state.selectedData.empUsername } : {},
                selectEmpArray: this.state.selectedData.empArray ? { value: this.state.selectedData.empArray } : {},
                selectEmpLevel: this.state.selectedData.empLevel ? { value: this.state.selectedData.empLevel } : {},
                selectEmpArrayChild: this.state.selectedData.empArrayChild ? { value: this.state.selectedData.empArrayChild } : {}
            })
        }

    }

    componentWillUnmount() {
        this.setState({
            isAddOrEdit: null
        });
    }

    onChangeRowProcessTime(newValue, object) {
        //Set into data
        const data = [...this.state.data];
        for (const obj of data) {
            if (obj.itemId === object.itemId) {
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
            values.empArray = this.state.selectEmpArray.value;
            values.empArrayChild = this.state.selectEmpArrayChild.value;
            values.empLevel = this.state.selectEmpLevel.value;
            values.empId = this.state.selectEmpUser.value;
            values.empUsername = this.state.selectEmpUser.label;       
            values.updatedTime = new Date();
            const utilityConfigEmployeeImpact = Object.assign({}, values);
            utilityConfigEmployeeImpact.empUsername = this.state.selectEmpUser.label;
            if (this.state.isAddOrEdit === "COPY") {
                utilityConfigEmployeeImpact.idImpact = "";
            }

            if (this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") {
                this.props.actions.addUtilityConfigEmployeeImpact(utilityConfigEmployeeImpact).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.success.add"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.add"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.add"));
                        }
                    });
                });
            } else if (this.state.isAddOrEdit === "EDIT") {
                utilityConfigEmployeeImpact.idImpact = this.state.selectedData.idImpact;
                console.log(utilityConfigEmployeeImpact)
                this.props.actions.editUtilityConfigEmployeeImpact(utilityConfigEmployeeImpact).then((response) => {
                    if (response.payload.data.key === "SUCCESS") {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            this.props.closeAddOrEditPage(this.state.isAddOrEdit);
                            toastr.success(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.success.edit"));
                        });
                    } else {
                        this.setState({
                            btnAddOrEditLoading: false
                        }, () => {
                            toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.edit"));
                        });
                    }
                }).catch((response) => {
                    this.setState({
                        btnAddOrEditLoading: false
                    }, () => {
                        try {
                            toastr.error(response.error.response.data.errors[0].defaultMessage);
                        } catch (error) {
                            toastr.error(this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.error.edit"));
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

    handleOnChangeEmpUser(value) {
        this.setState({ selectEmpUser: value });
    }
    handleItemSelectChangeEmpArray(option) {
        this.setState({ selectEmpArray: option });
        this.props.actions.getListChildArray({page:1,pageSize:100,parentId:option.value}).then((response) =>{
            const list = response.payload.data.map(i => { return ({ itemName: i.childrenName, itemId: i.childrenId }) })
            this.setState({ listChildArray: list })

        });
    }
    handleItemSelectChangeEmpArrayChild(option) {
        this.setState({ selectEmpArrayChild: option });
    }

    handleItemSelectChangeEmpLevel(option) {
        this.setState({ selectEmpLevel: option });
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
                                        <i className={(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? "fa fa-plus-circle" : "fa fa-edit"}></i>{(this.state.isAddOrEdit === "ADD" || this.state.isAddOrEdit === "COPY") ? t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.title.utilityConfigEmployeeImpactAdd") : this.state.isAddOrEdit === "EDIT" ? t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.title.utilityConfigEmployeeImpactEdit") : ''}
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
                                                <Card style={{ border: 'none' }}>
                                                    <CardBody >
                                                        <Row>
                                                            <Col xs="12" sm="3">
                                                                <CustomAutocomplete
                                                                    name={"empId"}
                                                                    label={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.employee")}
                                                                    placeholder={this.props.t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.placeholder.employee")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.requiredEmployee")}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleOnChangeEmpUser}
                                                                    selectValue={this.state.selectEmpUser}
                                                                    moduleName={"USERS"}
                                                                    isHasChildren={true}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="3">
                                                                <CustomSelectLocal
                                                                    name={"empArray"}
                                                                    label={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.parentArray")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.requiredParentArray")}
                                                                    options={this.state.listParentArray}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeEmpArray}
                                                                    selectValue={this.state.selectEmpArray}
                                                                />
                                                            </Col>

                                                            <Col xs="12" sm="3">
                                                                <CustomSelectLocal
                                                                    name={"empArrayChild"}
                                                                    label={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.childArray")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.requiredChildArray")}
                                                                    options={this.state.listChildArray}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeEmpArrayChild}
                                                                    selectValue={this.state.selectEmpArrayChild}
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="3">
                                                                <CustomSelectLocal
                                                                    name={"empLevel"}
                                                                    label={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.label.level")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigEmployeeImpact:utilityConfigEmployeeImpact.message.requiredLevel")}
                                                                    options={this.props.parentState.listLevel}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeEmpLevel}
                                                                    selectValue={this.state.selectEmpLevel}
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

UtilityConfigEmployeeImpactAddEdit.propTypes = {
    closeAddOrEditPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigEmployeeImpact, common } = state;
    return {
        response: { utilityConfigEmployeeImpact, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigEmployeeImpactActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigEmployeeImpactAddEdit));