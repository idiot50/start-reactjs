import React, { Component } from 'react';
import { Input, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonActions from '../../actions/commonActions';
import { translate, Trans } from 'react-i18next';
// import 'rc-tree/assets/index.css';
import './../../scss/rc-tree/index.css';
import Tree, { TreeNode } from 'rc-tree';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
  
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

export function setValueTreeData(treeData, value) {
    let obj = {};
    const loop = (data) => {
        data.forEach((item) => {
            if (value === item.value) {
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

export function filterTreeData(param, treeData) {
    const filterTree = (filter, list) => {
        return _.filter(list, (item) => {
            if (_.includes(_.toLower(item.title), _.toLower(filter))) {
                return true;
            } else if (item.children) {
                item.children = filterTree(filter, item.children);
                return !_.isEmpty(item.children);
            }
        });
    };
    return filterTree(param, treeData);
}

class CustomRcTree extends Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);

        this.state = {
            isRenderTree: false,
            treeData: [],
            treeDataAll: []
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        this.getTreeData();
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    getTreeData = () => {
        this.props.actions.getTreeData("stream", this.props.moduleName, "", "").then((response) => {
            const treeData = response.payload.data;
            this.setState({
                isRenderTree: true,
                treeData,
                treeDataAll: treeData
            });
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
                const treeData = _.cloneDeep(this.state.treeData);
                getNewTreeData(treeData, treeNode.props.eventKey, treeDataChildren);
                const treeDataAll = _.cloneDeep(this.state.treeDataAll);
                getNewTreeData(treeDataAll, treeNode.props.eventKey, treeDataChildren);
                this.setState({
                    treeData,
                    treeDataAll
                });
                resolve();
            }).catch((error) => {
                console.error(error);
            });
        });
    };

    handleSelect = (d) => {
        let obj = { value: null };
        if (d.length > 0) {
            let treeKey = d[0] ? d[0] : "";
            treeKey = treeKey.split("-");
            obj = setValueTreeData(this.state.treeData, treeKey[treeKey.length - 1]);
        }
        this.props.handleSelect(obj);
    }

    handleChangeInput(value) {
        const treeDataAll = _.cloneDeep(this.state.treeDataAll);
        const treeData = filterTreeData(value, treeDataAll);
        this.setState({
            treeData
        });
    }

    reloadTree() {
        this.setState({
            isRenderTree: false
        }, () => {
            this.getTreeData();
        });
    }

    render() {
        const { t } = this.props;
        const { isRenderTree, treeData } = this.state;
        const loop = (data) => {
            return data.map((item) => {
                if (item.children) {
                    return <TreeNode title={item.title} key={item.key}>{loop(item.children)}</TreeNode>
                }
                return (
                    <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf} />
                );
            });
        };
        const treeNodes = loop(treeData);
        return (
            <div>
                <Col xs="12" className="mt-2 mb-1">
                    <Input type="text" onChange={(e) => this.handleChangeInput(e.target.value)} placeholder={t("common:common.placeholder.search")} />
                </Col>
                <div style={{ height: this.props.height ? this.props.height : 'auto', paddingBottom: '6px' }}>
                    {
                        isRenderTree && (
                            <PerfectScrollbar>
                                <Tree
                                    onSelect={this.handleSelect}
                                    loadData={this.onLoadData}
                                    checkable={this.props.checkable}
                                    onCheck={this.props.handleCheck}
                                    checkedKeys={this.props.checkedKeys}
                                    showLine
                                >
                                {treeNodes}
                                </Tree>
                            </PerfectScrollbar>
                        )
                    }
                </div>
            </div>
        );
    }
}

CustomRcTree.propTypes = {
    moduleName: PropTypes.string.isRequired,
    handleSelect: PropTypes.func.isRequired,
    height: PropTypes.string,
    checkable: PropTypes.bool,
    onCheck: PropTypes.func,
    checkedKeys: PropTypes.array
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CustomRcTree));