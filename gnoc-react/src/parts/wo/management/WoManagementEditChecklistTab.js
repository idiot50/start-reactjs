import { AvForm } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import * as WoTypeManagementActions from '../typeManagement/WoTypeManagementActions';
import { SettingTableLocal, CustomReactTableLocal, CustomAvField, CustomSelectLocal } from '../../../containers/Utils';

class WoManagementEditChecklistTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            isAddOrEdit: null,
            objectSearch: {},
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            selectValueChecklist: {},
            isVisibleSave: false
        };
    }

    componentDidMount() {
        this.checkDisableButton();
        this.props.actions.getDetailWoTypeManagement(this.state.selectedData.woTypeId).then((response) => {
            const data = response.payload.data || {};
            if (data.woTypeCheckListDTOList && data.woTypeCheckListDTOList.length > 0) {
                this.props.actions.getListWoChecklistDetailDTO({woId: this.state.selectedData.woId}).then((res) => {
                    for (const obj of data.woTypeCheckListDTOList) {
                        const listCurrent = res.payload.data;
                        const currentData = listCurrent.find(item => item.woTypeChecklistId === obj.woTypeChecklistId) || {};
                        obj.checklistValue = currentData.checklistValue;
                    }
                    this.setState({
                        data: data.woTypeCheckListDTOList
                    });
                });
            } else {
                this.setState({
                    data: []
                });
            }
        }).catch((response) => {
            this.setState({
                data: []
            });
        });
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    checkDisableButton = () => {
        if (this.state.selectedData.ftName === JSON.parse(localStorage.user).userName
            && (this.state.selectedData.status === 6 || this.state.selectedData.status === 9
                || this.state.selectedData.status === 5 || this.state.selectedData.status === 3
                || this.state.selectedData.status === 1)) {
            this.setState({
                isVisibleSave: true
            });
        }
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.checklistName" />,
                id: "checklistName",
                accessor: d => <span title={d.checklistName}>{d.checklistName}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.checklistValue" />,
                id: "checklistValue",
                Cell: ({ original }) => {
                    const defaultValue = original.defaultValue ? original.defaultValue.split(";") : [];
                    const selectValue =  this.state.data.find((ch) => ch.woTypeChecklistId === original.woTypeChecklistId).checklistValue;
                    const value = defaultValue.length <= 1 ? (selectValue ? selectValue : original.defaultValue) : {value: selectValue};
                    return defaultValue.length <= 1 ? 
                            <CustomAvField name={"input-" + original.woTypeChecklistId} value={value}
                                isinputonly="true" onChange={(e) => this.onChangeRow(e.target.value, original)}/>
                            :
                            <CustomSelectLocal
                                name={"select-" + original.woTypeChecklistId}
                                label={""}
                                isRequired={false}
                                options={defaultValue.map(item => {return {itemId: item, itemName: item }})}
                                closeMenuOnSelect={true}
                                handleItemSelectChange={(d) => this.handleChangeValueChecklist(d, original)}
                                selectValue={value}
                                isOnlyInputSelect={true}
                            />;
                }
            }
        ];
    }

    handleChangeValueChecklist = (newValue, original) => {
        const data = [...this.state.data];
        for(const obj of data) {
            if(obj.woTypeChecklistId === original.woTypeChecklistId) {
                obj.checklistValue = newValue.value;
                break;
            }
        }
        this.setState({
            data
        });
    }

    onChangeRow = (newValue, original) => {
        const data = [...this.state.data];
        for(const obj of data) {
            if(obj.woTypeChecklistId === original.woTypeChecklistId) {
                obj.checklistValue = newValue;
                break;
            }
        }
        this.setState({
            data
        });
    }

    saveChecklist = () => {
        const woChecklistDetailDTO = [];
        for (const obj of this.state.data) {
            const checklist = {};
            checklist.woId = this.state.selectedData.woId;
            checklist.woTypeChecklistId = obj.woTypeChecklistId;
            checklist.checklistValue = obj.checklistValue;
            woChecklistDetailDTO.push(checklist);
        }
        this.props.actions.updateWoChecklistDetail(woChecklistDetailDTO).then((response) => {
            if (response.payload.data.key === "SUCCESS") {
                toastr.success(this.props.t("woManagement:woManagement.message.success.saveChecklist"));
            } else {
                toastr.error(this.props.t("woManagement:woManagement.message.error.saveChecklist"));
            }
        }).catch((response) => {
            try {
                toastr.error(response.error.response.data.errors[0].defaultMessage);
            } catch (error) {
                toastr.error(this.props.t("woManagement:woManagement.message.error.saveChecklist"));
            }
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data, isVisibleSave } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-plus-justify"></i>{t("woManagement:woManagement.title.checklistInfo")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <Button type="button" color="primary" className={isVisibleSave ? "mr-1" : "class-hidden"} onClick={this.saveChecklist}><i className="fa fa-save"></i> {t("common:common.button.save")}</Button>
                            <Button type="button" color="secondary" className="mr-1" onClick={() => this.props.closePage('PROCESS')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                            <SettingTableLocal
                                columns={columns}
                                onChange={(columns) => this.setState({ columns })}
                            />
                        </div>
                    </CardHeader>
                    <AvForm>
                        <CustomReactTableLocal
                            onRef={ref => (this.customReactTable = ref)}
                            columns={columns}
                            data={data}
                            loading={false}
                            defaultPageSize={10}
                        />
                    </AvForm>
                </Card>
            </div>
        );
    }
}

WoManagementEditChecklistTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { woManagement, common } = state;
    return {
        response: { woManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, WoManagementActions, WoTypeManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditChecklistTab));