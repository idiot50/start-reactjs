import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Label } from 'reactstrap';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Config from '../../config';
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import en from "date-fns/locale/en-US";
import moment from 'moment';
import _ from 'lodash';
import { renderRequired } from './Utils';

class CustomDatePicker extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.handleOnChangeRaw = this.handleOnChangeRaw.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.state = {
            value: "",
            isValid: true,
        };
    }

    handleOnChangeRaw(e) {
        this.setState({
            value: e.target.value
        }, () => {
            const format = _.replace(_.replace(this.props.dateFormat, new RegExp("dd", "g"), "DD"), new RegExp("yyyy", "g"), "YYYY");
            const momentDate = moment(this.state.value, format, true);
            if (momentDate.isValid()) {
                this.setState({
                    isValid: true
                });
            }
        });
    }

    handleOnSubmit(event) {
        if (event === 'Enter') {
            if (typeof this.props.search() !== 'undefined' && typeof this.props.search() === 'function') {
                this.props.search()
            }
        }
    }
    handleOnSelect() {
        window.setTimeout(() => { document.getElementById("custom-" + this.props.name).focus() }, 0)
    }

    handleOnBlur() {
        const format = _.replace(_.replace(this.props.dateFormat, new RegExp("dd", "g"), "DD"), new RegExp("yyyy", "g"), "YYYY");
        const momentDate = moment(this.state.value, format, true);
        if (momentDate.isValid() && this.state.isValid) {
            this.props.handleOnChange(momentDate.toDate());
            this.setState({
                isValid: false
            });
        }
    }

    handleOnChange = (d) => {
        if (d) {
            const dd = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
            const MM = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
            const yyyy = d.getFullYear() + '';
            const hh = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
            const mi = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
            const ss = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();
            let strDate = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mi + ":" + ss;
            strDate = strDate.replace(yyyy, yyyy.substring(0, 4));
            this.props.handleOnChange(new Date(new Date(strDate).toISOString()));
        } else {
            this.props.handleOnChange(null);
        }
    }

    render() {
        const { t } = this.props;
        let valueInputHidden;
        if (this.props.selected === null) {
            valueInputHidden = "";
        } else {
            valueInputHidden = JSON.stringify(this.props.selected);
        }
        const language = localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale;
        let locale;
        if (language === "vi_VN") {
            registerLocale("vi", vi);
            locale = "vi";
        } else if (language === "en_US") {
            registerLocale("en", en);
            locale = "en";
        } else {
            registerLocale("en", en);
            locale = "en";
        }
        return (
            this.props.isOnlyInputSelect ?
                <AvGroup>
                    <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired} />
                    <DatePicker
                        id={"custom-" + this.props.name}
                        selected={this.props.selected}
                        placeholderText={this.props.placeholder}
                        timeCaption={t('common:common.label.time')}
                        onChange={this.handleOnChange}
                        onChangeRaw={this.handleOnChangeRaw}
                        onBlur={this.handleOnBlur}
                        dateFormat={this.props.dateFormat}
                        showTimeSelect={this.props.showTimeSelect}
                        timeFormat={this.props.timeFormat}
                        locale={locale}
                        readOnly={this.props.readOnly ? this.props.readOnly : false}
                        autoFocus={this.props.autoFocus}
                        className="form-control"
                        shouldCloseOnSelect={this.props.shouldCloseOnSelect}
                        onKeyDown={(e) => this.handleOnSubmit(e.key)}
                        onSelect={this.handleOnSelect}
                        popperContainer={({ children }) => (
                            ReactDOM.createPortal(
                                children,
                                document.body
                            )
                        )}
                    />
                    <AvFeedback>{this.props.messageRequire}</AvFeedback>
                </AvGroup>
                :
                <AvGroup>
                    <Label>{this.props.label}</Label>
                    {this.props.isRequired ? renderRequired : null}
                    <AvInput type={"hidden"} name={"custom-input-" + this.props.name} value={valueInputHidden || ""} placeholder={""} required={this.props.isRequired} />
                    <DatePicker
                        id={"custom-" + this.props.name}
                        selected={this.props.selected}
                        placeholderText={this.props.placeholder}
                        timeCaption={t('common:common.label.time')}
                        onChange={this.handleOnChange}
                        onChangeRaw={this.handleOnChangeRaw}
                        onBlur={this.handleOnBlur}
                        dateFormat={this.props.dateFormat}
                        showTimeSelect={this.props.showTimeSelect}
                        timeFormat={this.props.timeFormat}
                        locale={locale}
                        readOnly={this.props.readOnly ? this.props.readOnly : false}
                        autoFocus={this.props.autoFocus}
                        className="form-control"
                        popperContainer={({ children }) => (
                            ReactDOM.createPortal(
                                children,
                                document.body
                            )
                        )}
                    />
                    <AvFeedback>{this.props.messageRequire}</AvFeedback>
                </AvGroup>
        );
    }
}

CustomDatePicker.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    messageRequire: PropTypes.string,
    search: PropTypes.func,
    placeholder: PropTypes.string,
    dateFormat: PropTypes.string.isRequired,
    showTimeSelect: PropTypes.bool.isRequired,
    timeFormat: PropTypes.string,
    selected: PropTypes.instanceOf(Date),
    handleOnChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    isOnlyInputSelect: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default translate()(CustomDatePicker);