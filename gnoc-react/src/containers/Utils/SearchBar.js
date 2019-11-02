import React, { Component } from 'react';
import { Button, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { AvInput } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        return (
            <div className="class-button-search-all">
                <i style={{position: 'absolute', left: '1.7rem', top: '1.2rem', color: '#73818f'}} className="fa fa-search"></i>
                <Tooltip placement="bottom" overlay={
                    <div style={{ maxWidth: '250px'}}>{this.props.title}</div>
                }>
                    <AvInput className="class-button-search-all" style={{paddingLeft: '1.4rem', borderRadius: '1rem'}} name="searchAll" placeholder={this.props.placeholder} value={this.props.value} />
                </Tooltip>
                <Button type="submit" className="class-hidden"/>
            </div>
        );
    }
}

SearchBar.propTypes = {
    placeholder: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string
};

export default translate()(SearchBar);