import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTable, SettingTableLocal, CustomReactTableLocal } from '../../../containers/Utils';
import { buildDataCbo } from './CrManagementUtils';

class CrManagementUnitApproveTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            loading: true,
            columns: this.buildTableColumns(),
            objectSearch: {},
        };
    }

    componentWillUnmount() {
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.unitNameApprove" />,
                id: "unitName",
                minWidth: 200,
                accessor: d => d.unitName ? <span title={d.unitName}>{d.unitName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.userNameApprove" />,
                id: "userName",
                minWidth: 150,
                accessor: d => d.userName ? <span title={d.userName}>{d.userName}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.cadtLevel" />,
                id: "cadtLevel",
                minWidth: 150,
                accessor: d => d.cadtLevel ? <span title={d.cadtLevel}>{d.cadtLevel}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.approvedDate" />,
                id: "approvedDate",
                minWidth: 150,
                accessor: d => d.approvedDate ? <span title={d.approvedDate}>{d.approvedDate}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.status" />,
                id: "status",
                minWidth: 150,
                accessor: d => {
                    const status = buildDataCbo("APPROVAL_STATUS").find(item => item.itemId + "" === d.status + "") || {};
                    return d.status ? <span status={status.itemName}>{status.itemName}</span> : <span>&nbsp;</span>
                }
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.notes" />,
                id: "notes",
                minWidth: 150,
                accessor: d => d.notes ? <span notes={d.notes}>{d.notes}</span> : <span>&nbsp;</span>
            }
        ];
    }

    render() {
        const { t, parentState } = this.props;
        const { columns } = this.state;
        let data = [];
        if (parentState && parentState.objectInfoTab && parentState.objectInfoTab.listApprovalDepartment) {
            data = parentState.objectInfoTab.listApprovalDepartment;
        }
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.listUnitApprove")}
                        <div className="card-header-actions card-header-actions-button-table">
                            <SettingTableLocal
                                columns={columns}
                                onChange={(columns) => this.setState({ columns })}
                            />
                        </div>
                    </CardHeader>
                    <CustomReactTableLocal
                        onRef={ref => (this.customReactTable = ref)}
                        columns={columns}
                        data={data}
                        loading={false}
                        defaultPageSize={10}
                    />
                </Card>
            </div>
        );
    }
}

CrManagementUnitApproveTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const { crManagement, common } = state;
    return {
        response: { crManagement, common }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, CrManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementUnitApproveTab));