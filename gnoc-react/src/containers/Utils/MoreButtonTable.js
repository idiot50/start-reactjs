import React, { Component } from 'react';
import { Button, Popover, PopoverBody } from 'reactstrap';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';

class MoreButtonTable extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.toggleClose = this.toggleClose.bind(this);

        this.state = {
            popoverOpen: false
        };
    }

    toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen,
        });
    }

    toggleClose() {
        this.setState({
            popoverOpen: false,
        });
    }

    render() {
        const { t } = this.props;
        return (
            <span title={t("common:common.title.showMore")}>
                <Button id={"Popover-" + this.props.targetId} onClick={this.toggle} type="button" size="sm" className="btn-secondary icon mr-1"><i className="fa fa-ellipsis-h"></i></Button>
                <Popover trigger="legacy" placement="bottom" isOpen={this.state.popoverOpen} target={"Popover-" + this.props.targetId} toggle={this.toggleClose}>
                    <PopoverBody onClick={this.toggleClose}>{this.props.children}</PopoverBody>
                </Popover>
            </span>
        );
    }
}

MoreButtonTable.propTypes = {
    targetId: PropTypes.string
};

export default translate()(MoreButtonTable);