import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import MultiselectTwoSides from 'react-multiselect-two-sides';
import 'react-multiselect-two-sides/style.css';
import '../../scss/react-multiselect-two-sides/index.scss';

class CustomMultiSelectTwoSides extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        const { t, options, value } = this.props;
        const selectedCount = value.length;
        const availableCount = options.length - selectedCount;
        return (
            <MultiselectTwoSides
                options={options}
                value={value}
                className="msts_theme_example"
                onChange={this.props.handleChange}
                disabled={this.props.isDisabled}
                availableHeader={this.props.availableHeader}
                availableFooter={t("common:common.label.available") + `: ${availableCount}`}
                selectedHeader={this.props.selectedHeader}
                selectedFooter={t("common:common.label.selected") + `: ${selectedCount}`}
                clearFilterText=""
                deselectAllText={t("common:common.button.deselectAll")}
                selectAllText={t("common:common.button.selectAll")}
                placeholder={t("common:common.placeholder.search")}
                labelKey="label"
                valueKey="value"
                showControls
                searchable
            />
        );
    }
}

CustomMultiSelectTwoSides.propTypes = {
    availableHeader: PropTypes.string.isRequired,
    selectedHeader: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
};

export default translate()(CustomMultiSelectTwoSides);