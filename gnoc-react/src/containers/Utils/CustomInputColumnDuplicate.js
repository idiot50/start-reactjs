import React, { Component } from 'react';
import { AvInput, AvFeedback, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import CustomAvInput from './CustomAvInput';

class CustomInputColumnDuplicate extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        let check = false;
        let valueInputHidden;
        const dataRow = this.props.data.find(item => item[this.props.rowId] === this.props.dataRowOriginal[this.props.rowId]);
        for (const da of this.props.data) {
            if (dataRow[this.props.rowName] && dataRow[this.props.rowName] !== "" 
                && da[this.props.rowName] === dataRow[this.props.rowName]
                && da[this.props.rowId] !== this.props.dataRowOriginal[this.props.rowId]) {
                check = true;
                break;
            }
        }
        if (!check) {
            if (dataRow[this.props.rowName] && dataRow[this.props.rowName] !== "") {
                valueInputHidden = dataRow[this.props.rowName];
            }
        }
        if (this.props.isPattern && dataRow[this.props.rowName] && dataRow[this.props.rowName] !== "") {
            const patternRegExp = new RegExp(this.props.valuePattern, "g");
            if (!patternRegExp.test(dataRow[this.props.rowName])) {
                check = false;
            }
        }
        // if ("custom-" + this.props.rowName + this.props.dataRowOriginal[this.props.rowId] !== document.activeElement.id) {
        //     valueInputHidden = dataRow[this.props.rowName];
        // }
        const pattern = this.props.isPattern ? {pattern: this.props.valuePattern} : null;
        return (
        <AvGroup className={(!valueInputHidden && check) ? "text-danger" : ""}>
            <AvInput type={"hidden"}
                name={"custom-input-" + this.props.rowName + this.props.dataRowOriginal[this.props.rowId]} 
                value={valueInputHidden || ""} 
                placeholder={""} 
                required={true} />
            <CustomAvInput
                name={"custom-" + this.props.rowName + this.props.dataRowOriginal[this.props.rowId]}
                value={dataRow[this.props.rowName] || ""}
                placeholder={this.props.placeholder}
                onChange={this.props.handleOnChange}
                disabled={this.props.isDisabled}
                maxLength={this.props.maxLength}
                required={this.props.isRequired}
                className="class-input-column-duplicate"
                {...pattern} 
            />
            {
                (!valueInputHidden && check) ?
                <div style={{ width: "100%", marginTop: "0.25rem", fontSize: "80%", color: "#f86c6b" }}>
                    {this.props.messageDuplicate}
                </div>
                : null
            }
            <AvFeedback>
            {
                (!dataRow[this.props.rowName] || dataRow[this.props.rowName] === "") ? this.props.messageRequire
                : this.props.isPattern ? this.props.messagePattern
                : ""
            }
            </AvFeedback>
        </AvGroup>
        );
    }
}

CustomInputColumnDuplicate.propTypes = {
    isRequired: PropTypes.bool.isRequired,
    isPattern: PropTypes.bool,
    valuePattern: PropTypes.string,
    messagePattern: PropTypes.string,
    messageRequire: PropTypes.string,
    messageDuplicate: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.string,
    isDisabled: PropTypes.bool,
    handleOnChange: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    dataRowOriginal: PropTypes.object.isRequired,
    rowName: PropTypes.any.isRequired,
    rowId: PropTypes.any.isRequired,
};

export default translate()(CustomInputColumnDuplicate);