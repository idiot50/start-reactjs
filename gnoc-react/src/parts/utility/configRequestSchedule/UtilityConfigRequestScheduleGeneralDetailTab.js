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
import * as UtilityConfigRequestScheduleActions from './UtilityConfigRequestScheduleActions';
import { CustomReactTableLocal, CustomSelectLocal, CustomSticky, CustomAvField,CustomAppSwitch,  SettingTableLocal,CustomAutocomplete,CustomDatePicker } from "../../../containers/Utils";
import { invalidSubmitForm, validSubmitForm } from '../../../containers/Utils/Utils';
import { convertDateToDDMMYYYYHHMISS } from '../../../containers/Utils/Utils';



class UtilityConfigRequestScheduleGeneralDetailTab extends Component {
    constructor(props) {
        super(props);
        //tab
        this.setTabIndex = this.setTabIndex.bind(this);
        this.handleOnChangeChildTab = this.handleOnChangeChildTab.bind(this);

        this.toggleFormAddEdit = this.toggleFormAddEdit.bind(this);
        this.handleItemSelectChangeType = this.handleItemSelectChangeType.bind(this);
        this.handleItemSelectChangeStatus = this.handleItemSelectChangeStatus.bind(this);
        this.handleItemSelectChangeMonth =this.handleItemSelectChangeMonth.bind(this);
        this.handleItemSelectChangeYear = this.handleItemSelectChangeYear.bind(this);
        this.state = {
            btnAddOrEditLoading: false,
            collapseFormAddEdit: true,
            //AddOrEditModal
            isDetail: props.parentState.isDetail,
            selectedData: props.parentState.selectedData,
            //Table
            data: [],
            //Select
            selectValueOdGroupTypeId: {},
            statusListSelect: [
                { itemId: 1, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.active") },
                { itemId: 0, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.status.inActive") }
            ],
            selectTypeList: [
                { itemId: 0, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.month") },
                { itemId: 1, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.week") },
                { itemId: 2, itemName: props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.dropdown.type.day") }
            ],
            selectValueStatus: {},
            selectYear:{},
            selectMonth:{},
            selectUnit:{},
            selectType:null,
            complicateWork:false,
            sameNode:false,
            sameService:false,
            sameNodeShift:false,
            sameServiceShift:false,
            selectDate:null,
            selectEndDate:null,
            detailMonthOrWeek:null

        };
    }

    setTabIndex(index) {
        this.setState({
            tabIndex: index
        });
    }

    handleOnChangeChildTab(state) {
        switch (this.state.tabIndex) {
            case 4:
                this.setState({
                    objectTab: state
                });
                break;
            default:
                break;
        }
    }
    componentWillMount() {
            this.setState({
                selectUnit: { value: this.state.selectedData.unitId} ,
                selectType: { value: this.state.selectedData.type} ,
                selectDate: this.state.selectedData.startDate,
                selectEndDate: this.state.selectedData.endDate,
                selectMonth : { value: this.state.selectedData.month},
                selectWeek : {value: this.state.selectedData.week},
                selectYear : {value: this.state.selectedData.year},
                complicateWork:this.state.selectedData.complicateWork,
                sameNodeShift: this.state.selectedData.sameNodeShift,
                sameServiceShift:this.state.selectedData.sameServiceShift,
                sameNode:this.state.selectedData.sameNode,
                sameService:this.state.selectedData.sameService,
                date:  convertDateToDDMMYYYYHHMISS(this.state.selectedData.startDate).slice(0,10),
                // detailMonthOrWeek: (this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder",{}))
            })
    }

    componentWillUnmount() {
        this.setState({
            isDetail: null
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


    toggleFormAddEdit() {
        this.setState({ collapseFormAddEdit: !this.state.collapseFormAddEdit });
    }

    handleItemSelectChangeOdGroupTypeId(option) {
        this.setState({selectValueOdGroupTypeId: option});
    }

    handleItemSelectChangeStatus(option) {
        this.setState({selectValueStatus: option});
    }

    handleItemSelectChangeMonth(option){
        this.setState({selectMonth: option});
    }
    handleItemSelectChangeYear(option){
        this.setState({selectYear: option});
    }
    handleItemSelectChangeType(option){
        this.setState({selectType: option});
    }
    handleItemSelectChangeUnit(option){
        this.setState({selectUnit: option});
    }


    render() {
        
        const { t, response } = this.props;
        let objectDetail = this.state.isDetail === "DETAIL"  ? this.state.selectedData : {};
        let valueDay =(this.state.selectDate) ? (t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.day") + convertDateToDDMMYYYYHHMISS(this.state.selectDate).slice(0, 10)):"";
        const detailWeek = (this.state.selectWeek.value)? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.detailWeek", { week: this.state.selectWeek.value, year: this.state.selectYear.value }):"";
        const detailMonth = (this.state.selectMonth.value )? this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.detailMonth", { month: this.state.selectMonth.value, year: this.state.selectYear.value}):"";
        return (
            <div className="animated fadeIn">
                <AvForm id="idFormDetail"  model={objectDetail}>
                    <Row>
                        <Col xs="12">
                            <Card>
                                <Collapse isOpen={this.state.collapseFormAddEdit} id="collapseFormAddEdit">
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" sm="12">
                                                <Card style={{border:"none"}}>
                                                    <CardBody>
                                                        <Row >
                                                            <Col xs="12" sm="6">
                                                                <CustomAutocomplete
                                                                    isDisabled={true}
                                                                    name={"unitId"}
                                                                    label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.unit")}
                                                                    placeholder={this.props.t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.unit")}
                                                                    isRequired={false}
                                                                    closeMenuOnSelect={false}
                                                                    handleItemSelectChange={this.handleItemSelectChangeUnit}
                                                                    selectValue={this.state.selectUnit}
                                                                    moduleName={"UNIT"}
                                                                    isHasChildren={true}
                                                                />
                                                                </Col>
                                                            <Col xs="12" sm="6">
                                                                <CustomSelectLocal
                                                                    isDisabled={true}
                                                                    name={"type"}
                                                                    label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.type")}
                                                                    isRequired={true}
                                                                    messageRequire={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredType")}
                                                                    options={this.state.selectTypeList}
                                                                    closeMenuOnSelect={true}
                                                                    handleItemSelectChange={this.handleItemSelectChangeType}
                                                                    selectValue={this.state.selectType}
                                                                />
                                                            </Col>
                                                        </Row>
                                                       
                                                            
                                                                {   
                                                                    (this.state.selectType.value == 0 )?
                                                                    <div>
                                                                        <Row >
                                                                            <Col xs="12" sm="6">
                                                                                <CustomAvField  readOnly= {true} name="month"  label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.month")}  
                                                                                maxLength="500"  />  
                                                                            </Col> 
                                                                            <Col xs="12" sm="6">
                                                                                <CustomAvField  readOnly= {true} name="year"  label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.year")}  
                                                                                maxLength="500"  />  
                                                                            </Col>
                                                                        </Row>
                                                                        <Row >
                                                                            <Col xs="12" sm="6">
                                                                                <CustomAvField readOnly= {true} name="detailM" 
                                                                                 value={detailMonth} 
                                                                                 label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.detail")}
                                                                                 maxLength="500" />   
                                                                            </Col>
                    
                                                                            <Col xs="12" sm="6">
                                                                                <CustomAvField readOnly= {true} name="workTime" label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.hoursPerday")}  required
                                                                                    maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredHoursPerday") } }} />   
                                                                            </Col> 
                                                                        </Row>
                                                                   </div>
                                                                    : (this.state.selectType.value == 1)? 
                                                                        <div>
                                                                            <Row >
                                                                                <Col xs="12" sm="6">
                                                                                    <CustomAvField  readOnly= {true} name="week"  label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.week")}  
                                                                                    maxLength="500"  />  
                                                                                </Col> 
                                                                                <Col xs="12" sm="6">
                                                                                    <CustomAvField  readOnly= {true} name="year"  label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.year")}  
                                                                                    maxLength="500"  />  
                                                                                </Col>
                                                                            </Row>
                                                                            <Row >
                                                                                <Col xs="12" sm="6">
                                                                                    <CustomAvField readOnly= {true} name="detailW" 
                                                                                        value={(this.state.selectYear.value)?detailWeek:""} 
                                                                                        label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.detail")}
                                                                                        maxLength="500" />   
                                                                                </Col>
                        
                                                                                <Col xs="12" sm="6">
                                                                                    <CustomAvField readOnly= {true} name="workTime" label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.hoursPerday")}  required
                                                                                        maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredHoursPerday") } }} />   
                                                                                </Col> 
                                                                            </Row>
                                                                         </div>
                                                                    :    
                                                                        <div>
                                                                            <Row >
                                                                                <Col xs="12" sm="6">

                                                                                    <CustomAvField  readOnly= {true} name="startDate" value={this.state.date} label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.day")}
                                                                                        maxLength="500"  /> 
                                                                                </Col>
                                                                                <Col xs="12" sm="6">
                                                                                    <CustomAvField readOnly= {true} name="detail" value ={this.state.selectDate?t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.placeholder.day")+convertDateToDDMMYYYYHHMISS(this.state.selectDate).slice(0,10):""}  label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.detail")}  required
                                                                                        maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredHoursPerday") } }} />   
                                                                                </Col> 

                                                                            </Row> 
                                                                            <Row >
                                                                                <Col xs="12" sm="6">
                                                                                    <CustomAvField readOnly= {true} name="workTime" label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.hoursPerday")}  required
                                                                                        maxLength="500" validate={{ required: { value: true, errorMessage: t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.message.requiredHoursPerday") } }} />   
                                                                                </Col> 
                                                                            </Row> 
                                                                        </div>                                                                         
                                                                }
                                                        <Row >
                                                            <Col xs="12" sm="12">
                                                                <Row>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch 
                                                                            isDisabled={true}
                                                                            name="complicateWork" 
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.isGiveComplicatedWork")}
                                                                            checked={this.state.complicateWork}
                                                                            handleChange={(checked) => this.setState({ complicateWork: checked })}
                                                                        />
                                                                    </Col>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch 
                                                                            isDisabled={true}
                                                                            name="sameNode" 
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.isAllowCrNode")}
                                                                            checked={this.state.sameNode}
                                                                            handleChange={(checked) => this.setState({ sameNode: checked })}
                                                                        />
                                                                    </Col>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch 
                                                                             isDisabled={true}
                                                                            name="sameService" 
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.isAllowCrService")}
                                                                            checked={this.state.sameService}
                                                                            handleChange={(checked) => this.setState({ sameService: checked })}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                               
                                                            </Col>
                                                        </Row>
                                                        {
                                                        (this.state.selectType.value == 2 )?
                                                        <Row >
                                                            <Col xs="12" sm="12">
                                                                <Row>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch 
                                                                            isDisabled={true}
                                                                            name="sameNodeShift" 
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.sameNodeShift")}
                                                                            checked={this.state.sameNodeShift}
                                                                            handleChange={(checked) => this.setState({ sameNodeShift: checked })}
                                                                        />
                                                                    </Col>
                                                                    <Col xs="12" sm="4">
                                                                        <CustomAppSwitch 
                                                                             isDisabled={true}
                                                                            name="sameServiceShift" 
                                                                            label={t("utilityConfigRequestSchedule:utilityConfigRequestSchedule.label.sameServiceShift")}
                                                                            checked={this.state.sameServiceShift}
                                                                            handleChange={(checked) => this.setState({ sameServiceShift: checked })}
                                                                        />
                                                                    </Col>
                                                                    
                                                                </Row>
                                                               
                                                            </Col>
                                                        </Row>:''
                                                        }

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

UtilityConfigRequestScheduleGeneralDetailTab.propTypes = {
    // closeDetailPage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { utilityConfigRequestSchedule, common } = state;
    return {
        response: { utilityConfigRequestSchedule, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, UtilityConfigRequestScheduleActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(UtilityConfigRequestScheduleGeneralDetailTab));