import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../../actions/commonActions';
import * as CrManagementActions from './CrManagementActions';
import { CustomReactTableLocal, SettingTableLocal } from '../../../containers/Utils';
import CrManagementVendorTabAddPopup from './CrManagementVendorTabAddPopup';

class CrManagementVendorTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenAddVendorPopup: false,
            //AddOrEditModal
            selectedData: props.parentState.selectedData,
            modalName: props.parentState.modalName,
            btnAddOrEditLoading: false,
            //Table
            data: [],
            pages: null,
            columns: this.buildTableColumns(),
            objectSearch: {},
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        if (this.state.modalName === "EDIT") {
            this.searchCrManagementVendor();
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
        this.setState({
            modalName: null
        });
    }

    buildTableColumns() {
        return [
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.vendorCode" />,
                id: "vendorCode",
                minWidth: 150,
                accessor: d => d.vendorCode ? <span title={d.vendorCode}>{d.vendorCode}</span> : <span>&nbsp;</span>
            },
            {
                Header: <Trans i18nKey="crManagement:crManagement.label.vendorName" />,
                id: "vendorName",
                minWidth: 150,
                accessor: d => d.vendorName ? <span title={d.vendorName}>{d.vendorName}</span> : <span>&nbsp;</span>
            }
        ];
    }

    searchCrManagementVendor = () => {
        const objectSearch = Object.assign({}, this.state.objectSearch);
        objectSearch.crId = this.state.selectedData.crId;
        this.props.actions.searchVendorByCr(objectSearch).then((response) => {
            this.setState({
                data: response.payload.data ? response.payload.data : []
            });
        }).catch((response) => {
            toastr.error(this.props.t("crManagement:crManagement.message.error.getVendor"));
        });
    }

    fillDataList = (data) => {
        data = data.filter(el => (el.vendorCode !== null && el.vendorCode !== ""));
        this.setState({
            data
        });
    }

    setValueVendor = (dataChecked) => {
        const checkedTemp = [...dataChecked];
        checkedTemp.forEach(element => {
            if (this.state.data.some(el => el.vendorCode === element.vendorCode)) {
                dataChecked.splice(dataChecked.indexOf(element), 1);
            }
        });
        this.setState({
            data: [...this.state.data, ...dataChecked]
        });
    }

    removeVendor = () => {
        const dataChecked = [...this.state.dataChecked];
        if (dataChecked.length < 1) {
            toastr.warning(this.props.t("common:common.message.error.removeSelect"));
        }
        let listTemp = [...this.state.data];
        dataChecked.forEach(element => {
            listTemp = listTemp.filter(el => el.vendorCode !== element.vendorCode);
        });
        this.setState({
            data: listTemp,
            dataChecked: []
        });
    }

    openAddVendorPopup = () => {
        const { parentState } = this.props;
        if (parentState && parentState.objectInfoTab && parentState.objectInfoTab.selectValueProcess && parentState.objectInfoTab.selectValueProcess.value) {
            this.setState({
                isOpenAddVendorPopup: true
            });
        } else {
            toastr.warning(this.props.t("crManagement:crManagement.message.required.crProcess"));
            this.props.onChangeTab(0);
            setTimeout(() => {
                try {
                    document.getElementById("idFormAddOrEditInfoTab").elements["custom-input-crProcess"].nextElementSibling.focus();
                } catch (error) {
                    console.error(error);
                }
            }, 100);
        }
    }

    closeAddVendorPopup = () => {
        this.setState({
            isOpenAddVendorPopup: false
        });
    }

    render() {
        const { t } = this.props;
        const { columns, data } = this.state;
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardHeader>
                        <div style={{position: 'absolute'}} className="mt-1">
                            <i className="fa fa-align-justify mr-2"></i>{t("crManagement:crManagement.title.vendorList")}
                        </div>
                        {
                            this.props.parentState.visibleToolbarTab.vendor.all ?
                            <div className="card-header-actions card-header-search-actions-button">
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.vendor.add ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.add")}
                                    onClick={this.openAddVendorPopup}><i className="fa fa-plus"></i></Button>
                                <Button type="button" size="md" color="primary" className={this.props.parentState.visibleToolbarTab.vendor.delete ? "custom-btn btn-pill mr-2" : "class-hidden"}
                                    title={t("crManagement:crManagement.button.delete")}
                                    onClick={() => {this.removeVendor()}}><i className="fa fa-close"></i></Button>
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div> :
                            <div className="card-header-actions card-header-search-actions-button">
                                <SettingTableLocal
                                    columns={columns}
                                    onChange={(columns) => this.setState({ columns })}
                                />
                            </div>
                        }
                    </CardHeader>
                    <CustomReactTableLocal
                        columns={columns}
                        data={data}
                        isCheckbox={true}
                        loading={false}
                        propsCheckbox={["vendorCode"]}
                        defaultPageSize={10}
                        handleDataCheckbox={(dataChecked) => this.setState({ dataChecked })}
                    />
                </Card>
                <CrManagementVendorTabAddPopup
                    parentState={this.state}
                    closePopup={this.closeAddVendorPopup}
                    setValue={this.setValueVendor} />
            </div>
        );
    }
}

CrManagementVendorTab.propTypes = {
    closePage: PropTypes.func.isRequired,
    parentState: PropTypes.object.isRequired,
    onChangeTab: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CrManagementVendorTab));