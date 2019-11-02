import React, { Component } from 'react';
import {
    Input,
    ButtonDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

class SettingTableLocal extends Component {
    constructor(props) {
        super(props);

        this.handleClickItem = this.handleClickItem.bind(this);

        this.state = {
            toggleSettingTable: false,
            checkedIsShow: this.buildColumnsChecked(props.columns)
        };
    }

    buildColumnsChecked(columns) {
        for (const column of columns) {
            column.show = true;
        }
        return columns;
    }

    handleClickItem(e, object) {
        if (e.type === 'click' && e.clientX !== 0 && e.clientY !== 0) {
            const checkedIsShow = [...this.state.checkedIsShow];
            const index = checkedIsShow.findIndex((ch) => ch.id === object.id);
            const objChange = Object.assign({}, checkedIsShow[index]);
            objChange.show = !objChange.show;
            checkedIsShow.splice(index, 1, objChange);
            this.setState({
                checkedIsShow
            }, () => {
                this.props.onChange(checkedIsShow);
            });
        }
    }

    render() {
        const { t, columns } = this.props;
        return (
            <ButtonDropdown isOpen={this.state.toggleSettingTable} toggle={() => { this.setState({ toggleSettingTable: !this.state.toggleSettingTable }); }}>
                <DropdownToggle className="p-0 card-header-action btn-setting btn-custom" color="link" title={t("common:common.label.tableConfig")}>
                    <i className="icon-settings"></i>
                </DropdownToggle>
                <DropdownMenu right className="class-menu-setting-table">
                    {columns.map((column, idx) => {
                            const objCheck = this.state.checkedIsShow.find((ch) => ch.id === column.id);
                            if (objCheck && objCheck.id !== "action") {
                                return <DropdownItem key={"dropdown-item-" + idx} className="class-item-setting-table"
                                        toggle={false} onClick={(e) => this.handleClickItem(e, column)}>
                                            <Input type="checkbox"
                                                checked={objCheck.show}
                                                readOnly
                                            />
                                        {column.Header}
                                    </DropdownItem>
                            } else {
                                return "";
                            }
                        }
                    )}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

SettingTableLocal.propTypes = {
    columns: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};

export default translate()(SettingTableLocal);
