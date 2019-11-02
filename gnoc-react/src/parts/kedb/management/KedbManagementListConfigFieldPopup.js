import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import * as commonActions from '../../../actions/commonActions';
import * as KedbActions from './KedbManagementActions';
import CustomReactTableLocal from "../../../containers/Utils/CustomReactTableLocal";
import { convertDateToDDMMYYYYHHMISS } from "../../../containers/Utils/Utils";

class KedbManagementListConfigFieldPopup extends Component {
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
        this.props.actions.getItemMaster("KEDB_STATE", "itemId", "itemName", "1", "3");
        this.props.actions.getListSearchConfigUser({funcKey: "searchKedb"}).then((response) => {
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
            toastr.error(this.props.t("kedbManagement:kedbManagement.message.error.getSearchConfig"));
        });
    }
    
    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="kedbManagement:kedbManagement.label.fieldName" />,
                id: "fieldName",
                sortable: false,
                accessor: d => <span title={this.props.t(this.state.objectMapper[d.fieldName].name)}>{this.props.t(this.state.objectMapper[d.fieldName].name)}</span>
            },
            {
                Header: <Trans i18nKey="kedbManagement:kedbManagement.label.fieldValue" />,
                id: "fieldValue",
                sortable: false,
                accessor: d => {
                    let html = "";
                    switch (this.state.objectMapper[d.fieldName].type) {
                        case "TEXT":
                            html = <span title={d.fieldValue}>{d.fieldValue}</span>;
                            break;
                        case "SELECT":
                            html = <span title={JSON.parse(d.fieldValue).label}>{JSON.parse(d.fieldValue).label}</span>;
                            break;
                        case "DATE":
                            html = <span title={convertDateToDDMMYYYYHHMISS(d.fieldValue)}>{convertDateToDDMMYYYYHHMISS(d.fieldValue)}</span>;
                            break;
                        case "MULTI_SELECT":
                            const stateList = (this.props.response.common.kedbState && this.props.response.common.kedbState.payload) ? this.props.response.common.kedbState.payload.data.data : [];
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
        const stateArr = ["KEDB_OPEN", "KEDB_CREATE_APPROVE", "KEDB_UPDATE_APPROVE", "KEDB_CLOSED"];
        const stateList = (this.props.response.common.kedbState && this.props.response.common.kedbState.payload) ? this.props.response.common.kedbState.payload.data.data : [];
        let stateListDefault = [];
        for (const state of stateList) {
            if (stateArr.includes(state.itemCode)) {
                stateListDefault.push({value: state.itemId, label: state.itemName});
            }
        }
        return [
            {
                fieldName: "kedbCode",
                fieldValue: ""
            },
            {
                fieldName: "kedbName",
                fieldValue: ""
            },
            {
                fieldName: "vendor",
                fieldValue: "{}"
            },
            {
                fieldName: "parentType",
                fieldValue: "{}"
            },
            {
                fieldName: "type",
                fieldValue: "{}"
            },
            {
                fieldName: "subCategory",
                fieldValue: "{}"
            },
            {
                fieldName: "kedbState",
                fieldValue: stateListDefault.map(item => item.value).join(",")
            },
            {
                fieldName: "createUserName",
                fieldValue: ""
            },
            {
                fieldName: "fromDate",
                fieldValue: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            },
            {
                fieldName: "toDate",
                fieldValue: new Date(new Date().setHours(23,59,59,999))
            },
            {
                fieldName: "softwareVersion",
                fieldValue: "{}"
            },
            {
                fieldName: "hardwareVersion",
                fieldValue: "{}"
            },
            {
                fieldName: "description",
                fieldValue: ""
            },
            {
                fieldName: "checkDescription",
                fieldValue: "false"
            },
            {
                fieldName: "completer",
                fieldValue: ""
            }
        ];
    }

    buildObjectMapper() {
        return {
            kedbCode: {
                name: "kedbManagement:kedbManagement.label.kedbCode",
                type: "TEXT"
            },
            kedbName: {
                name: "kedbManagement:kedbManagement.label.kedbName",
                type: "TEXT",
            },
            vendor: {
                name: "kedbManagement:kedbManagement.label.vendor",
                type: "SELECT"
            },
            parentType: {
                name: "kedbManagement:kedbManagement.label.parentTypeName",
                type: "SELECT"
            },
            type: {
                name: "kedbManagement:kedbManagement.label.typeName",
                type: "SELECT"
            },
            subCategory: {
                name: "kedbManagement:kedbManagement.label.nodeType",
                type: "SELECT"
            },
            kedbState: {
                name: "kedbManagement:kedbManagement.label.status",
                type: "MULTI_SELECT"
            },
            createUserName: {
                name: "kedbManagement:kedbManagement.label.createUserName",
                type: "TEXT"
            },
            fromDate: {
                name: "kedbManagement:kedbManagement.label.createTimeFrom",
                type: "DATE"
            },
            toDate: {
                name: "kedbManagement:kedbManagement.label.createTimeTo",
                type: "DATE"
            },
            softwareVersion: {
                name: "kedbManagement:kedbManagement.label.softwareVersion",
                type: "SELECT"
            },
            hardwareVersion: {
                name: "kedbManagement:kedbManagement.label.hardwareVersion",
                type: "SELECT"
            },
            description: {
                name: "kedbManagement:kedbManagement.label.searchByContent",
                type: "TEXT"
            },
            checkDescription: {
                name: "kedbManagement:kedbManagement.label.checkDescription",
                type: "TEXT"
            },
            completer: {
                name: "kedbManagement:kedbManagement.label.staff",
                type: "TEXT"
            }
        }
    }

    render() {
        const { t } = this.props;
        const { columns, data, loading } = this.state;
        return (
            <Modal isOpen={this.props.parentState.isOpenConfigFieldPopup} backdrop={this.state.backdrop}
                className={'modal-primary modal-lg'} onOpened={this.onOpened}>
                <ModalHeader toggle={this.props.closePopup}>{t("kedbManagement:kedbManagement.title.viewConfigField")}</ModalHeader>
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

KedbManagementListConfigFieldPopup.propTypes = {
    parentState: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
    const { kedbManagement, common } = state;
    return {
        response: { kedbManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, commonActions, KedbActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(KedbManagementListConfigFieldPopup));