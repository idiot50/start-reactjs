import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import './../../scss/react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { translate } from 'react-i18next';
import CustomPaginationComponent from './CustomPaginationComponent';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class CustomReactTableSearch extends Component {
    constructor(props) {
        super(props);

        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.toggleCheckboxRow = this.toggleCheckboxRow.bind(this);

        this.state = {
            pageSize: props.defaultPageSize,
            selectedRow: null,
            selected: {},
            selectAll: 0
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    handlePageSizeChange(pageSize) {
        this.setState({
            pageSize: pageSize
        });
    }

    toggleCheckboxRow(obj) {
        let newSelected = {};
        if (this.props.isChooseOneCheckbox) {
            newSelected[obj] = !this.state.selected[obj];
            if (this.props.handleChooseOneCheckbox) {
                const selectedCheck = this.state.selected;
                let check = false;
                for(var keyCheck in selectedCheck) {
                    if(selectedCheck[keyCheck] && keyCheck !== obj) {
                        check = true;
                    }
                }
                if (check) {
                    this.props.handleChooseOneCheckbox();
                }
            }
        } else {
            newSelected = Object.assign({}, this.state.selected);
            newSelected[obj] = !this.state.selected[obj];
        }
        let isUnchecked = true;
        for (const prop in newSelected ) {
            if (newSelected[prop]) {
                isUnchecked = false;
                break;
            }
        }
        this.setState({
            selected: newSelected,
            selectAll: isUnchecked ? 0 : 2
        });
        let objSelected = [];
        for(var key in newSelected) {
            if(newSelected[key]) {
                objSelected.push(JSON.parse(key));
            }
        }
        this.props.handleDataCheckbox(objSelected);
    }

    toggleSelectAll() {
        let newSelected = {};
        if (this.state.selectAll === 0) {
            this.props.data.forEach(x => {
                if (this.props.propsCheckbox && this.props.propsCheckbox.length > 0) {
                    let objPush = {};
                    this.props.propsCheckbox.forEach(y => {
                        objPush[y] = x[y];
                    });
                    newSelected[JSON.stringify(objPush)] = true;
                } else {
                    newSelected[JSON.stringify(x)] = true;
                }
            });
        }
        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
        let objSelected = [];
        for(var key in newSelected) {
            if(newSelected[key]) {
                objSelected.push(JSON.parse(key));
            }
        }
        this.props.handleDataCheckbox(objSelected);
    }

    resetPage() {
        this.reactTableRef.setState({
            page: 0
        });
    }

    clearChecked() {
        this.setState({
            selected: {},
            selectAll: 0
        });
    }

    render() {
        const { t } = this.props;
        const colIndex = {
            Header: this.props.t("common:common.label.number"),
            id: "row",
            width: 50,
            className: "text-center",
            fixed: "left",
            sortable: false,
            Cell: (row) => {
                return <div style={{lineHeight: 2.2}}>{(row.page * row.pageSize) + row.index + 1}</div>;
            },
            Filter: ({ filter, onChange }) => (
                <div style={{height: '2.7em'}}></div>
            )
        };
        const colCheckbox = {
            id: "checkbox",
            accessor: "",
            width: 60,
            className: "text-center",
            fixed: "left",
            sortable: false,
            Cell: ({ original }) => {
                let objPush = {};
                if (this.props.propsCheckbox && this.props.propsCheckbox.length > 0) {
                    this.props.propsCheckbox.forEach(y => {
                        objPush[y] = original[y];
                    });
                } else {
                    objPush = original
                }
                return (
                    <div style={{lineHeight: 2.2}}>
                        <input type="checkbox" checked={this.state.selected[JSON.stringify(objPush)] === true} onChange={() => this.toggleCheckboxRow(JSON.stringify(objPush))} />
                    </div>
                );
            },
            Header: x => {
                return (
                    <input type="checkbox" checked={this.state.selectAll === 1}
                    ref={input => {
                        if(input) {
                            input.indeterminate = this.state.selectAll === 2;
                        }
                    }}
                    onChange={() => this.toggleSelectAll()}
                    disabled={this.props.isChooseOneCheckbox}
                    />
                );
            },
            Filter: ({ filter, onChange }) => (
                <div style={{height: '2.7em'}}></div>
            )
        };
        let cols = this.props.columns;
        cols = this.props.isCheckbox ? [colIndex, colCheckbox, ...cols] : [colIndex, ...cols];
        const totalRow = this.props.data.length > 0 ? this.props.data[0].totalRow : 0;
        const minRows = (this.state.pageSize > 10 && this.state.pageSize > totalRow && totalRow > 10) ? totalRow : 10;
        let height = 'auto';
        if (this.state.pageSize > 10) {
            height = '500px';
        }
        if (this.props.isContainsAvField && this.state.pageSize > 10) {
            height = '543px';
        }
        return (
            <div>
                <ReactTableFixedColumns
                innerRef={(ref) => (this.reactTableRef = ref)}
                columns={cols}
                manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                data={this.props.data}
                pages={this.props.pages} // Display the total number of pages
                loading={this.props.loading} // Display the loading overlay when we need it
                onFetchData={this.props.onFetchData} // Request new data when things change
                onPageSizeChange={this.handlePageSizeChange}
                pageSizeOptions={[10, 20, 30, 40, 50]}
                defaultPageSize={this.props.defaultPageSize}
                showPagination ={this.props.showPagination}
                filterable={true}
                minRows={minRows}
                className="-striped -highlight"
                style={{ height: height }}
                PaginationComponent={CustomPaginationComponent}
                renderTotalRowCount={t('common:common.table.totalRecord', { number: totalRow })}
                getTrProps={(state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedRow: rowInfo.index
                          })
                        },
                        className: (rowInfo && rowInfo.original && (rowInfo.index === this.state.selectedRow)) ? "class-focus-row" : ""
                      }
                    } else {
                      return {}
                    }
                }}
                // Text
                // previousText={"<"}
                // nextText={">"}
                loadingText={t('common:common.table.loadingText')}
                noDataText={t('common:common.table.noDataText')}
                pageText={t('common:common.table.pageText')}
                ofText={t('common:common.table.ofText')}
                rowsText={t('common:common.table.rowsText')}
                />
            </div>
        );
    }
}

CustomReactTableSearch.propTypes = {
    onFetchData: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    pages: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    defaultPageSize: PropTypes.number.isRequired,
    showPagination: PropTypes.bool,
    isContainsAvField: PropTypes.bool,
    isCheckbox: PropTypes.bool,
    propsCheckbox: PropTypes.array,
    handleDataCheckbox: PropTypes.func,
    isChooseOneCheckbox: PropTypes.bool,
    handleChooseOneCheckbox: PropTypes.func
};

export default translate()(CustomReactTableSearch);