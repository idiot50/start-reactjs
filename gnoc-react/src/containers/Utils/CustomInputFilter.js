import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { AvInput } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

class CustomInputFilter extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: "",
            isFirst: true
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isFirst) {
            this.setState({
                value: this.props.value ? this.props.value : ""
            });
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value,
            isFirst: false
        });
    }

    render() {
        const { t, value } = this.props;
        return (
            <div>
                <AvInput type={"hidden"} name={this.props.name} value={this.state.value} onChange={(e) => console.log(e)} />
                <Input id={"input-filter-" + this.props.name} name={"input-filter-" + this.props.name} defaultValue={value} placeholder={this.props.placeholder} onKeyUp={this.handleChange} />
            </div>
        );
    }
}

CustomInputFilter.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string
};

export default translate()(CustomInputFilter);