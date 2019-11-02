import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../actions/commonActions';
import { translate, Trans } from 'react-i18next';
// import 'rc-tree-select/assets/index.css';
import './../../scss/rc-tree-select/index.css';
import TreeSelect, { TreeNode, SHOW_PARENT } from 'rc-tree-select';
import { renderRequired } from './Utils';
  
export function getNewTreeData(treeData, curKey, child) {
    const loop = (data) => {
        data.forEach((item) => {
            if (curKey.indexOf(item.key) === 0) {
                if (item.children) {
                    loop(item.children);
                } else {
                    item.children = child;
                }
            }
        });
    };
    loop(treeData);
}

export function setValueTreeData(treeData, d) {
    let obj = {};
    const loop = (data) => {
        data.forEach((item) => {
            if (d.value === item.value) {
                obj = Object.assign({}, item);
                obj.label = obj.title;
            } else {
                if (item.children && !obj.value) {
                    loop(item.children);
                }
            }
        });
    };
    loop(treeData);
    return obj;
}

class CustomRcTreeSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tsOpen: false,
            treeData: []
        };
    }

    componentDidMount() {
        this.getTreeData();
    }

    getTreeData = () => {
        this.props.actions.getTreeData("stream", this.props.moduleName, "", this.props.paramValue).then((response) => {
            const treeData = response.payload.data;
            // if (this.props.isOnlySelectLeaf) {
            //     for (const item of treeData) {
            //         item.disabled = item.isLeaf ? false : true;
            //     }
            // }
            this.setState({ treeData });
        }).catch((error) => {
            console.error(error);
        });
    }

    onLoadData = treeNode => {
        return new Promise(resolve => {
            const treeKey = treeNode.props.eventKey.split("-");
            this.props.actions.getTreeData("stream", this.props.moduleName, treeKey[treeKey.length - 1], "").then((response) => {
                const treeDataChildren = response.payload.data;
                for (const data of treeDataChildren) {
                    data.key = treeNode.props.eventKey + "-" + data.key;
                }
                // if (this.props.isOnlySelectLeaf) {
                //     for (const item of treeDataChildren) {
                //         item.disabled = item.isLeaf ? false : true;
                //     }
                // }
                let { treeData } = this.state;
                treeData = treeData.slice();
                getNewTreeData(treeData, treeNode.props.eventKey, treeDataChildren);
                this.setState({ treeData });
                resolve();
            }).catch((error) => {
                console.error(error);
            });
        });
    };

    onDropdownVisibleChange = (v, info) => {
        this.setState({
            tsOpen: v
        }, () => {
            if (v) {
                this.setState({
                    treeData: []
                }, () => {
                    this.getTreeData();
                });
            }
        });
    }

    handleChange = (d) => {
        let obj;
        if (d) {
            obj = setValueTreeData(this.state.treeData, d);
        }
        if (this.props.isOnlySelectLeaf) {
            if (obj && !obj.isLeaf) {
                this.setState({
                    tsOpen: true
                }, () => {
                    if (this.props.handleSelectNotLeaf) {
                        this.props.handleSelectNotLeaf(obj);
                    }
                });
            } else {
                this.props.handleChange(obj);
            }
        } else {
            this.props.handleChange(obj);
        }
    }

    render() {
        const { treeData } = this.state;
        const { t } = this.props;
        let valueInputHidden;
        if (this.props.selectValue) {
            valueInputHidden = "value";
        }
        return (
        this.props.isOnlyInputSelect ?
        <AvGroup>
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                placeholder={t("common:common.placeholder.select")}
                searchPlaceholder={t("common:common.placeholder.search")}
                notFoundContent={t("common:common.placeholder.noOptionsMessage")}
                treeData={treeData}
                labelInValue
                allowClear
                treeLine
                showSearch={false}
                open={this.state.tsOpen}
                // treeIcon
                treeNodeFilterProp="title"
                disabled={this.props.isDisabled}
                value={this.props.selectValue}
                onChange={this.handleChange}
                loadData={this.onLoadData}
                onDropdownVisibleChange={this.onDropdownVisibleChange}
                autoFocus={this.props.autoFocus}
            />
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        :
        <AvGroup>
            <Label>{this.props.label}</Label>
            {this.props.isRequired ? renderRequired : null}
            <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
            <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                placeholder={t("common:common.placeholder.select")}
                searchPlaceholder={t("common:common.placeholder.search")}
                notFoundContent={t("common:common.placeholder.noOptionsMessage")}
                treeData={treeData}
                labelInValue
                allowClear
                treeLine
                showSearch={false}
                open={this.state.tsOpen}
                // treeIcon
                treeNodeFilterProp="title"
                disabled={this.props.isDisabled}
                value={this.props.selectValue}
                onChange={this.handleChange}
                loadData={this.onLoadData}
                onDropdownVisibleChange={this.onDropdownVisibleChange}
                autoFocus={this.props.autoFocus}
            />
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        );
    }
}

CustomRcTreeSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    moduleName: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    selectValue: PropTypes.object,
    isDisabled: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
    isOnlySelectLeaf: PropTypes.bool,
    handleSelectNotLeaf: PropTypes.func,
    paramValue: PropTypes.string,
    autoFocus: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
    return {
        response: state.common
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(commonActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CustomRcTreeSelect));