import React, { Component } from 'react';
import { Label, Button } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker-edited';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { renderRequired } from './Utils';

class CustomDateTimeRangePicker extends Component {
    constructor(props) {
        super(props);

        this.handleApply = this.handleApply.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleShow = this.handleShow.bind(this);

        this.state = {
            
        };
    }

    handleApply(event, picker) {
        this.props.handleApply(event, picker);
        try {
            document.getElementById("custom-" + this.props.name).focus();
        } catch (error) {
            console.error(error);
        }
    }

    handleCancel() {
        this.props.handleApply(null, { startDate: null, endDate: null });
        try {
            document.getElementById("custom-" + this.props.name).focus();
        } catch (error) {
            console.error(error);
        }
    }

    handleShow(event, picker) {
        const el = document.getElementById("custom-" + this.props.name);
        if (document.activeElement === el) {
            picker.container.hide();
        }
    }

    render() {
        const { t, startDate, endDate } = this.props;
        let label = '';
        let start = startDate && startDate.format(this.props.dateFormat) || '';
        let end = endDate && endDate.format(this.props.dateFormat) || '';
        label = start + t('common:common.locale.separator') + end;
        if (start === end) {
            label = start;
        }
        let valueInputHidden;
        if (start === '' || end === '') {
            valueInputHidden = "";
        } else {
            valueInputHidden = "value";
        }
        let pickerProps = {
            startDate,
            endDate,
        };
        let locale = {
            format: this.props.dateFormat,
            separator: t('common:common.locale.separator'),
            applyLabel: t('common:common.locale.applyLabel'),
            cancelLabel: t('common:common.locale.cancelLabel'),
            fromLabel: t('common:common.locale.fromLabel'),
            toLabel: t('common:common.locale.toLabel'),
            weekLabel: t('common:common.locale.weekLabel'),
            customRangeLabel: t('common:common.locale.customRangeLabel'),
            daysOfWeek: [
                t('common:common.locale.daysOfWeek.Su'),
                t('common:common.locale.daysOfWeek.Mo'),
                t('common:common.locale.daysOfWeek.Tu'),
                t('common:common.locale.daysOfWeek.We'),
                t('common:common.locale.daysOfWeek.Th'),
                t('common:common.locale.daysOfWeek.Fr'),
                t('common:common.locale.daysOfWeek.Sa')
            ],
            monthNames: [
                t('common:common.locale.monthNames.January'),
                t('common:common.locale.monthNames.February'),
                t('common:common.locale.monthNames.March'),
                t('common:common.locale.monthNames.April'),
                t('common:common.locale.monthNames.May'),
                t('common:common.locale.monthNames.June'),
                t('common:common.locale.monthNames.July'),
                t('common:common.locale.monthNames.August'),
                t('common:common.locale.monthNames.September'),
                t('common:common.locale.monthNames.October'),
                t('common:common.locale.monthNames.November'),
                t('common:common.locale.monthNames.December')
            ],
            firstDay: 1
        };
        return (
            this.props.isOnlyInputSelect ?
            <AvGroup>
                <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
                <DatetimeRangePicker
                autoUpdateInput={false}
                linkedCalendars={false}
                dateLimit={this.props.dateLimit}
                timePicker
                timePicker24Hour
                showDropdowns
                timePickerSeconds
                locale={locale}
                applyClass="btn-primary"
                onApply={this.handleApply}
                onCancel={this.handleCancel}
                onShow={this.handleShow}
                cancelClass="btn-secondary"
                className="date-time-range-picker"
                {...pickerProps}
                >
                    <div className="input-group">
                        <input id={"custom-" + this.props.name} readOnly type="text" style={{borderRadius: '0.25rem 0rem 0rem 0.25rem'}} className="form-control" value={label}/>
                        <span className="input-group-btn">
                            <Button type="button" className="default date-range-toggle" style={{borderRadius: '0rem 0.25rem 0.25rem 0rem'}}>
                            <i className="fa fa-calendar"/>
                            </Button>
                        </span>
                    </div>
                </DatetimeRangePicker>
                <AvFeedback>{this.props.messageRequire}</AvFeedback>
            </AvGroup>
            :
            <AvGroup>
                <Label>{this.props.label}</Label>
                {this.props.isRequired ? renderRequired : null}
                <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired}/>
                <DatetimeRangePicker
                autoUpdateInput={false}
                linkedCalendars={false}
                timePicker
                timePicker24Hour
                showDropdowns
                timePickerSeconds
                locale={locale}
                applyClass="btn-primary"
                onApply={this.handleApply}
                onCancel={this.handleCancel}
                onShow={this.handleShow}
                className="date-time-range-picker"
                {...pickerProps}
                >
                    <div className="input-group">
                        <input id={"custom-" + this.props.name} readOnly type="text" style={{borderRadius: '0.25rem 0rem 0rem 0.25rem'}} className="form-control" value={label}/>
                        <span className="input-group-btn">
                            <Button type="button" className="default date-range-toggle" style={{borderRadius: '0rem 0.25rem 0.25rem 0rem'}}>
                            <i className="fa fa-calendar"/>
                            </Button>
                        </span>
                    </div>
                </DatetimeRangePicker>
                <AvFeedback>{this.props.messageRequire}</AvFeedback>
            </AvGroup>
        );
    }
}

CustomDateTimeRangePicker.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,

    startDate: PropTypes.instanceOf(moment),
    endDate: PropTypes.instanceOf(moment),
    dateLimit: PropTypes.object,
    dateFormat: PropTypes.string.isRequired,
    handleApply: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,

    isOnlyInputSelect: PropTypes.bool
};

export default translate()(CustomDateTimeRangePicker);