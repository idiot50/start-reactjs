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

class CustomRcTreeMultiSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            treeData: []
        };
    }

    componentDidMount() {
        this.props.actions.getTreeData("stream", this.props.moduleName, "", this.props.parentValue).then((response) => {
            const treeData = response.payload.data;
            this.setState({ treeData });
        }).catch((error) => {
            console.error(error);
        });
    }

    onLoadData = treeNode => {
        return new Promise(resolve => {
            const treeKey = treeNode.props.eventKey.split("-");
            this.props.actions.getTreeData("stream", this.props.moduleName, treeKey[treeKey.length - 1], this.props.parentValue).then((response) => {
                const treeDataChildren = response.payload.data;
                for (const data of treeDataChildren) {
                    data.key = treeNode.props.eventKey + "-" + data.key;
                }
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

    render() {
        const { treeData } = this.state;
        const { t } = this.props;
        let valueInputHidden;
        if (this.props.selectValue.length > 0) {
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
                // treeIcon
                treeNodeFilterProp="title"
                treeCheckable
                treeCheckStrictly
                maxTagTextLength={15}
                maxTagCount={1}
                maxTagPlaceholder={valueList => {
                    return t('common:common.placeholder.option', { number: valueList.length })
                }}
                disabled={this.props.isDisabled}
                value={this.props.selectValue}
                onChange={this.props.handleChange}
                loadData={this.onLoadData}
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
                // treeIcon
                treeNodeFilterProp="title"
                treeCheckable
                treeCheckStrictly
                maxTagTextLength={15}
                maxTagCount={1}
                maxTagPlaceholder={valueList => {
                    return t('common:common.placeholder.option', { number: valueList.length })
                }}
                disabled={this.props.isDisabled}
                value={this.props.selectValue}
                onChange={this.props.handleChange}
                loadData={this.onLoadData}
                autoFocus={this.props.autoFocus}
            />
            <AvFeedback>{this.props.messageRequire}</AvFeedback>
        </AvGroup>
        );
    }
}

CustomRcTreeMultiSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    moduleName: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    selectValue: PropTypes.array,
    isDisabled: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CustomRcTreeMultiSelect));