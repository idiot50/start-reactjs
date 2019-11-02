import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as PtProblemActions from './PtProblemActions';
import CustomReactTableLocal from "../../../containers/Utils/CustomReactTableLocal";
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class PtProblemListConfigFieldPopup extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            backdrop: "static",
            btnSubmitLoading: false,
            //Table
            data: [],
            loading: false,
            columns: this.buildTableColumns(),
            objectMapper: this.buildObjectMapper()
        };
    }

    onOpened = () => {
        this.props.actions.getItemMaster("PT_STATE", "itemId", "itemName", "1", "3");// trạng thái
        this.props.actions.getListSearchConfigUser({funcKey: "searchPTNew"}).then((response) => {
            if (response.payload.data.length > 0) {
                this.setState({
                    data: response.payload.data
                });
            } else {
                this.setState({
                    data: this.buildSearchDefault()
                });
            }
        }).catch((error) => {
            toastr.error(this.props.t("ptProblem:ptProblem.message.error.getSearchConfig"));
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.fieldName" />,
                id: "fieldName",
                sortable: false,
                accessor: d => <span title={this.props.t(this.state.objectMapper[d.fieldName].name)}>{this.props.t(this.state.objectMapper[d.fieldName].name)}</span>
            },
            {
                Header: <Trans i18nKey="ptProblem:ptProblem.label.fieldValue" />,
                id: "fieldValue",
                sortable: false,
                accessor: d => {
                    let html = "";
                    switch (this.state.objectMapper[d.fieldName].type) {
                        case "TEXT":
                            html = <span title={d.fieldValue}>{d.fieldValue}</span>;
                            break;
                        case "SELECT":
                            html = <span title={d.fieldValue ? JSON.parse(d.fieldValue).label : ""}>{d.fieldValue ? JSON.parse(d.fieldValue).label : ""}</span>;
                            break;
                        case "DATE":
                            html = <span title={convertDateToDDMMYYYYHHMISS(d.fieldValue)}>{convertDateToDDMMYYYYHHMISS(d.fieldValue)}</span>;
                            break;
                        case "MULTI_SELECT":
                            const stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
                            let stateListDefault = [];
                            for (const state of stateList) {
                                const stateIdList = d.fieldValue;
                                if (stateIdList.includes(state.itemId)) {
                                    stateListDefault.push({value: state.itemId, label: state.itemName});
                                }
                            }
                            html = <span title={stateListDefault.map(item => item.label).join(',')}>{stateListDefault.map(item => item.label).join(',')}</span>;
                            break;
                        default:
                            break;
                    }
                    return html;
                }
            }
        ];
    }

    buildSearchDefault = () => {
        const stateArr = ["PT_OPEN", "PT_UNASSIGNED", "PT_WA_FOUND", "PT_SL_FOUND", "PT_DIAGNOSED",
        "PT_WA_IMPL", "PT_SL_IMPL", "PT_WORKARROUND_PROPOSAL", "PT_SOLUTION_PROPOSAL",
        "PT_ROOT_CAUSE_PROPOSAL", "PT_ABNORMALLY_CLOSED", "PT_OPEN_2", "PT_CLEAR_INCOMPLETED",
        "PT_DEFERRED", "PT_QUEUED", "PT_REQ_DEFERRED"];
        const stateList = (this.props.response.common.ptState && this.props.response.common.ptState.payload) ? this.props.response.common.ptState.payload.data.data : [];
        let stateListDefault = [];
        for (const state of stateList) {
            if (stateArr.includes(state.itemCode)) {
                stateListDefault.push({value: state.itemId, label: state.itemName});
            }
        }
        return [
            {
                fieldName: "affectedNode",
                fieldValue: ""
            },
            {
                fieldName: "categorization",
                fieldValue: "{}"
            },
            {
                fieldName: "pmGroup",
                fieldValue: "{}"
            },
            {
                fieldName: "problemState",
                fieldValue: stateListDefault.map(item => item.value).join(",")
            },
            {
                fieldName: "problemName",
                fieldValue: ""
            },
            {
                fieldName: "problemCode",
                fieldValue: ""
            },
            {
                fieldName: "fromDate",
                fieldValue: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            },
            {
                fieldName: "toDate",
                fieldValue: new Date()
            },
            {
                fieldName: "priority",
                fieldValue: "{}"
            },
            {
                fieldName: "pmUsername",
                fieldValue: ""
            },
            {
                fieldName: "typeId",
                fieldValue: "{}"
            },
            {
                fieldName: "location",
                fieldValue: "{}"
            },
            {
                fieldName: "createUnit",
                fieldValue: "{}"
            },
            {
                fieldName: "receiveUnit",
                fieldValue: "{}"
            },
            {
                fieldName: "createUnitSub",
                fieldValue: "false"
            },
            {
                fieldName: "receiveUnitSub",
                fieldValue: "false"
            },
            {
                fieldName: "subCategory",
                fieldValue: "{}"
            },
        ];
    }

    buildObjectMapper() {
        return {
            affectedNode: {
                name: "ptProblem:ptProblem.label.node",
                type: "TEXT"
            },
            categorization: {
                name: "ptProblem:ptProblem.label.ticketType",
                type: "SELECT",
            },
            pmGroup: {
                name: "ptProblem:ptProblem.label.softGroup",
                type: "SELECT"
            },
            problemState: {
                name: "ptProblem:ptProblem.label.status",
                type: "MULTI_SELECT"
            },
            problemName: {
                name: "ptProblem:ptProblem.label.problemName",
                type: "TEXT"
            },
            problemCode: {
                name: "ptProblem:ptProblem.label.problemCode",
                type: "TEXT"
            },
            fromDate: {
                name: "ptProblem:ptProblem.label.createdDateFrom",
                type: "DATE"
            },
            toDate: {
                name: "ptProblem:ptProblem.label.createdDateTo",
                type: "DATE"
            },
            priority: {
                name: "ptProblem:ptProblem.label.priority",
                type: "SELECT"
            },
            pmUsername: {
                name: "ptProblem:ptProblem.label.softAccount",
                type: "TEXT"
            },
            typeId: {
                name: "ptProblem:ptProblem.label.techDomain",
                type: "SELECT"
            },
            location: {
                name: "ptProblem:ptProblem.label.section",
                type: "SELECT"
            },
            createUnit: {
                name: "ptProblem:ptProblem.label.createdUnit",
                type: "SELECT"
            },
            receiveUnit: {
                name: "ptProblem:ptProblem.label.handleUnit",
                type: "SELECT"
            },
            createUnitSub: {
                name: "ptProblem:ptProblem.label.subCreateUnit",
                type: "TEXT"
            },
            receiveUnitSub: {
                name: "ptProblem:ptProblem.label.subReceiveUnit",
                type: "TEXT"
            },
            subCategory: {
                name: "ptProblem:ptProblem.label.nodeType",
                type: "SELECT"
            }
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, loading } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenConfigFieldPopup} backdrop={this.state.backdrop}
                className={'modal-primary modal-lg'} onOpened={this.onOpened}>
                <ModalHeader toggle={this.props.closePopup}>{t("ptProblem:ptProblem.title.viewConfigField")}</ModalHeader>
                <ModalBody>
                    <CustomReactTableLocal
                        columns={columns}
                        data={data}
                        loading={loading}
                        defaultPageSize={10}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="secondary" onClick={this.props.closePopup}><i className="fa fa-times-circle"></i> {t("common:common.button.close")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

PtProblemListConfigFieldPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { ptProblem, common } = state;
    return {
        response: { ptProblem, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, PtProblemActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PtProblemListConfigFieldPopup));