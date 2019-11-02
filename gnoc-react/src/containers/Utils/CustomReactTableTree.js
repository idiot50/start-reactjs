import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from "rc-table";
import './../../scss/rc-table/index.css';
import { translate } from 'react-i18next';
import CustomPaginationComponent from './CustomPaginationComponent';

class CustomReactTableTree extends Component {
    constructor(props) {
        super(props);

        this.handleOnRowClick = this.handleOnRowClick.bind(this);
        this.handleClickSort = this.handleClickSort.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            page: 0,
            pageSize: props.defaultPageSize,
            sorted: []
        };
    }

    componentDidMount() {
        this.props.onFetchData(this.state);
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    handlePageChange(page) {
        this.setState({
            page
        }, () => {
            this.props.onFetchData(this.state);
        });
    }

    handlePageSizeChange(pageSize) {
        this.setState({
            page: 0,
            pageSize: pageSize
        }, () => {
            this.props.onFetchData(this.state);
        });
    }

    resetPage() {
        this.setState({
            page: 0
        });
    }

    handleOnRowClick(record, index, event) {
        const bodyTableElement = event.target.parentNode.parentNode;
        if (bodyTableElement.classList.contains("rc-table-tbody")) {
            const listTrElement = bodyTableElement.childNodes;
            for (const el of listTrElement) {
                el.classList.remove('class-focus-row');
            }
            event.target.parentNode.classList.add('class-focus-row');
        }
    }

    handleClickSort(event, name) {
        const sorted = [];
        if (this.state.sorted.length > 0) {
            if (this.state.sorted[0].desc) {
                sorted.push({ id: name, desc: false });
            } else {
                sorted.push({ id: name, desc: true });
            }
        } else {
            sorted.push({ id: name, desc: false });
        }
        this.setState({
            sorted
        }, () => {
            this.props.onFetchData(this.state);
        });
    }

    render() {
        const { t } = this.props;
        const data = [...this.props.data];
        const totalRow = data.length > 0 ? data[0].totalRow : 0;
        if(data.length < 10) {
            const length = 10 - data.length;
            for (let i = 0; i < length; i++) {
                const objEmpty = {};
                objEmpty[this.props.rowKey] = "key-rc-table-empty-" + i;
                data.push(objEmpty);
            }
        }
        for (let i = 0; i < data.length; i++) {
            if(!(data[i][this.props.rowKey] && (data[i][this.props.rowKey] + "").indexOf('key-rc-table-empty-') !== -1)) {
                if(!data[i].isleaf && !data[i].children) {
                    data[i].children = [];
                }
            }
        }
        let canPrevious = false, canNext = false;
        if (this.state.page > 0) {
            canPrevious = true;
        }
        if (this.state.page >= 0 && this.state.page < this.props.pages - 1) {
            canNext = true;
        }
        return (
            <div className="rc-table-custom">
                <Table
                useFixedHeader
                columns={this.props.columns}
                data={data}
                indentSize={20}
                onExpand={this.props.onExpand}
                rowKey={this.props.rowKey}
                rowClassName={(record, i) => {
                    let oddOrEven;
                    if (i & 1) {
                        oddOrEven = "even";
                    } else {
                        oddOrEven = "odd";
                    }
                    return `rc-row-${oddOrEven}`;
                }}
                onRow={(record, index) => ({
                    onClick: (event) => this.handleOnRowClick(record, index, event)
                })}
                scroll={{ y: 361 }}
                emptyText={t('common:common.table.noDataText')}
                components={{
                    header: {
                        cell: (props) => {
                            const { sort, name, ...restProps } = props;
                            if (sort) {
                                let className = "";
                                if (this.state.sorted.length > 0) {
                                    if (this.state.sorted[0].desc) {
                                        className = "rc-sort-desc";
                                    } else {
                                        className = "rc-sort-asc";
                                    }
                                }
                                return <th { ...restProps } 
                                    onClick={(e) => this.handleClickSort(e, name)}
                                    className={className}
                                    style={{ cursor: 'pointer' }}
                                    />
                            } else {
                                return <th { ...restProps } />
                            }
                        }
                    }
                }}
                />
                <CustomPaginationComponent 
                pages={this.props.pages}
                page={this.state.page}
                onPageChange={this.handlePageChange}
                onPageSizeChange={this.handlePageSizeChange}
                showPageSizeOptions={true}
                showPageJump={true}
                canPrevious={canPrevious}
                canNext={canNext}
                pageSizeOptions={[10, 20, 30, 40, 50]}
                defaultPageSize={this.props.defaultPageSize}
                showPagination ={true}
                renderTotalRowCount={t('common:common.table.totalRecord', { number: totalRow })}
                pageText={t('common:common.table.pageText')}
                ofText={t('common:common.table.ofText')}
                rowsText={t('common:common.table.rowsText')}
                />
                {
                    totalRow === 0 ? <div className="rc-noData">{t('common:common.table.noDataText')}</div> : null
                }
                <div className={"-loading " + (this.props.loading ? "-active" : "")}>
                    <div className="-loading-inner">{t('common:common.table.loadingText')}</div>
                </div>
            </div>
        );
    }
}

CustomReactTableTree.propTypes = {
    rowKey: PropTypes.any.isRequired,
    onFetchData: PropTypes.func.isRequired,
    onExpand: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    pages: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    defaultPageSize: PropTypes.number.isRequired,
    showPagination: PropTypes.bool
};

export default translate()(CustomReactTableTree);
