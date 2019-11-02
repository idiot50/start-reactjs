import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as WoManagementActions from './WoManagementActions';
import { SettingTableLocal, CustomReactTableLocal } from '../../../containers/Utils';

class WoManagementEditCdListTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            isAddOrEdit: null,
            objectSearch: {},
            //Table
            data: props.parentState.selectedData.listCd || [],
            pages: null,
            loading: false,
            columns: this.buildTableColumns()
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
                Header: <Trans i18nKey="woManagement:woManagement.label.username" />,
                id: "username",
                accessor: d => <span title={d.username}>{d.username}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.fullname" />,
                id: "fullname",
                accessor: d => <span title={d.fullname}>{d.fullname}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.mobile" />,
                id: "mobile",
                accessor: d => <span title={d.mobile}>{d.mobile}</span>
            },
            {
                Header: <Trans i18nKey="woManagement:woManagement.label.email" />,
                id: "email",
                accessor: d => <span title={d.email}>{d.email}</span>
            }
        ];
    }

    render() {
        const { t, response } = this.props;
        const { columns, data, pages, loading } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    {/* <CustomSticky level={1}> */}
                        <CardHeader>
                            <i className="fa fa-plus-justify"></i>{t("woManagement:woManagement.title.cdList")}
                            <div className="card-header-actions card-header-actions-button-table">
                                <Button type="button" color="secondary" className="mr-1" onClick={() => this.props.closePage('PROCESS')}><i className="fa fa-reply"></i> {t("common:common.button.back")}</Button>
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        </CardHeader>
                    {/* </CustomSticky> */}
                    {/* <CardBody> */}
                    <CustomReactTableLocal
                        onRef={ref => (this.customReactTable = ref)}
                        columns={columns}
                        data={data}
                        // pages={pages}
                        loading={loading}
                        // onFetchData={this.onFetchData}
                        defaultPageSize={10}
                    />
                    {/* </CardBody> */}
                </Card>
            </div>
        );
    }
}

WoManagementEditCdListTab.propTypes = {
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
        actions: bindActionCreators(Object.assign({}, WoManagementActions, commonActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(WoManagementEditCdListTab));