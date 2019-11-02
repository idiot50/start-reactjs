import React, { Component } from 'react';
import classnames from 'classnames';
import { translate } from 'react-i18next';

const defaultButton = props => (
  <button type="button" {...props} className="-btn">
    {props.children}
  </button>
)

class ReactTablePagination extends Component {
  static defaultProps = {
    PreviousComponent: defaultButton,
    NextComponent: defaultButton,
    renderPageJump: ({
      onChange, value, onBlur, onKeyPress, inputType, pageJumpText,
    }) => (
      <div className="-pageJump">
        <input
          aria-label={pageJumpText}
          type={inputType}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
        />
      </div>
    ),
    renderCurrentPage: page => <span className="-currentPage">{page + 1}</span>,
    renderTotalPagesCount: pages => <span className="-totalPages">{pages || 1}</span>,
    renderPageSizeOptions: ({
      pageSize,
      pageSizeOptions,
      rowsSelectorText,
      onPageSizeChange,
      rowsText,
    }) => (
      <span className="select-wrap -pageSizeOptions">
        <select
          aria-label={rowsSelectorText}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          value={pageSize}
        >
          {pageSizeOptions.map((option, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={i} value={option}>
              {`${option} ${rowsText}`}
            </option>
          ))}
        </select>
      </span>
    ),
  }

  constructor (props) {
    super(props)

    this.getSafePage = this.getSafePage.bind(this)
    this.changePage = this.changePage.bind(this)
    this.applyPage = this.applyPage.bind(this)

    this.state = {
      page: props.page,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.page !== nextProps.page) {
      this.setState({ page: nextProps.page })
    }
  }

  getSafePage (page) {
    if (Number.isNaN(page)) {
      page = this.props.page
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1)
  }

  changePage (page) {
    page = this.getSafePage(page)
    this.setState({ page })
    if (this.props.page !== page) {
      this.props.onPageChange(page)
    }
  }

  applyPage (e) {
    if (e) {
      e.preventDefault()
    }
    const page = this.state.page
    this.changePage(page === '' ? this.props.page : page)
  }

  getPageJumpProperties () {
    return {
      onKeyPress: e => {
        if (e.which === 13 || e.keyCode === 13) {
          this.applyPage(e)
        }
      },
      onBlur: this.applyPage,
      value: this.state.page === '' ? '' : this.state.page + 1,
      onChange: e => {
        const val = e.target.value
        const page = val - 1
        if (val === '') {
          return this.setState({ page: val })
        }
        this.setState({ page: this.getSafePage(page) })
      },
      inputType: this.state.page === '' ? 'text' : 'number',
      pageJumpText: this.props.pageJumpText,
    }
  }

  render () {
    const {
      // Computed
      pages,
      // Props
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      PreviousComponent,
      NextComponent,
      renderPageJump,
      renderCurrentPage,
      renderTotalPagesCount,
      renderPageSizeOptions,

      renderTotalRowCount,
      t
    } = this.props

    return (
      <div className={classnames(className, '-pagination')} style={this.props.style}>
        <div className="-previous">
          <span className="class-text-total-count">{renderTotalRowCount}</span>
          <span
            title={t("common:common.table.previousText")}
            onClick={() => {
              if (!canPrevious) return
              this.changePage(page - 1)
            }}
            className={!canPrevious ? 'class-btn-pagination-previous class-hidden' : 'class-btn-pagination-previous'}
          >
            <i className="fa fa-angle-left"></i>
          </span>
          <span
            title={t("common:common.table.firstPage")}
            onClick={() => {
              if (!canPrevious) return
              this.changePage(0)
            }}
            style={{marginRight: '15px'}}
            className={!canPrevious ? 'class-btn-pagination-previous class-hidden' : 'class-btn-pagination-previous'}
          >
            <i className="fa fa-angle-double-left"></i>
          </span>
          {/* <PreviousComponent
            onClick={() => {
              if (!canPrevious) return
              this.changePage(page - 1)
            }}
            disabled={!canPrevious}
          >
            {this.props.previousText}
          </PreviousComponent> */}
        </div>
        <div className="-center">
          <span className="-pageInfo">
            {this.props.pageText}{' '}
            {showPageJump ? renderPageJump(this.getPageJumpProperties()) : renderCurrentPage(page)}{' '}
            {this.props.ofText} {renderTotalPagesCount(pages)}
          </span>
          {showPageSizeOptions &&
            renderPageSizeOptions({
              pageSize,
              rowsSelectorText: this.props.rowsSelectorText,
              pageSizeOptions,
              onPageSizeChange,
              rowsText: this.props.rowsText,
            })}
        </div>
        <div className="-next">
          <span
            title={t("common:common.table.nextText")}
            onClick={() => {
              if (!canNext) return
              this.changePage(page + 1)
            }}
            className={!canNext ? 'class-btn-pagination-next class-hidden' : 'class-btn-pagination-next'}
          >
            <i className="fa fa-angle-right"></i>
          </span>
          <span
            title={t("common:common.table.lastPage")}
            onClick={() => {
              if (!canNext) return
              this.changePage(pages - 1)
            }}
            style={{marginLeft: '15px'}}
            className={!canNext ? 'class-btn-pagination-next class-hidden' : 'class-btn-pagination-next'}
          >
            <i className="fa fa-angle-double-right"></i>
          </span>
          {/* <NextComponent
            onClick={() => {
              if (!canNext) return
              this.changePage(page + 1)
            }}
            disabled={!canNext}
          >
            {this.props.nextText}
          </NextComponent> */}
        </div>
      </div>
    )
  }
}

export default translate()(ReactTablePagination);
