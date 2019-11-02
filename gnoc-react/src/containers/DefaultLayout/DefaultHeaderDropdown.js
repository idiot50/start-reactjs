import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Progress } from 'reactstrap';
import imgPerson from '../../assets/img/brand/person.svg';
import { translate, Trans } from 'react-i18next';
import Config from '../../config';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Auth actions
import * as authActions from '../../actions/authActions';
import * as commonActions from '../../actions/commonActions';
import _ from 'lodash';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

const propTypes = {
  notif: PropTypes.bool,
  language: PropTypes.bool,
  timezone: PropTypes.bool,
  accnt: PropTypes.bool,
  tasks: PropTypes.bool,
  mssgs: PropTypes.bool,
};
const defaultProps = {
  notif: false,
  language: false,
  timezone: false,
  accnt: false,
  tasks: false,
  mssgs: false,
};

class DefaultHeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleChangeTimezone = this.handleChangeTimezone.bind(this);
    this.toggle = this.toggle.bind(this);

    
    this.state = {
      dropdownOpen: false,
      dataLanguage: [],
      valueLanguage: "",
      valueLanguageFlag: "",
      dataTimezone: [],
      valueTimezone: ""
    };
  }

  componentDidMount() {
    // Language
    let language = localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale;
    this.props.actions.getListLanguage().then((response) => {
      const listLanguage = response.payload.data;
      let valueLanguage = "";
      let valueLanguageFlag = "";
      let objLanguage;
      for (const obj of listLanguage) {
        if (obj.isActive) {
          objLanguage = Object.assign({}, obj);
        }
        if (obj.languageKey === language) {
          valueLanguage = obj.languageName;
          valueLanguageFlag = obj.languageFlag;
        }
      }
      if (objLanguage) {
        localStorage.setItem('default_locale', objLanguage.languageKey);
        this.setState({
          dataLanguage: listLanguage,
          valueLanguage: objLanguage.languageName,
          valueLanguageFlag: objLanguage.languageFlag
        });
      } else {
        this.setState({
          dataLanguage: listLanguage,
          valueLanguage: valueLanguage,
          valueLanguageFlag: valueLanguageFlag
        });
      }
    }).catch((error) => {
      console.error(error);
    });
    // Timezone
    let timezone = sessionStorage.getItem('default_timezone') ? sessionStorage.getItem('default_timezone') : Config.defaultTimezone;
    this.props.actions.getListTimezone().then((response) => {
      const listTimezone = response.payload.data;
      let valueTimezone = "";
      let valueTimezoneOffset = sessionStorage.getItem('default_timezone_offset') ? sessionStorage.getItem('default_timezone_offset') : Config.defaultTimezoneOffset;
      let objTimezone;
      for (const obj of listTimezone) {
        if (obj.isActive) {
          objTimezone = Object.assign({}, obj);
        }
        if (obj.nationCode === timezone) {
          valueTimezone = obj.timezoneName;
          valueTimezoneOffset = obj.timezoneOffset;
        }
      }
      if (objTimezone) {
        sessionStorage.setItem('default_timezone', objTimezone.nationCode);
        sessionStorage.setItem('default_timezone_offset', objTimezone.timezoneOffset);
        this.setState({
          dataTimezone: listTimezone,
          valueTimezone: objTimezone.timezoneName
        });
      } else {
        sessionStorage.setItem('default_timezone_offset', valueTimezoneOffset);
        this.setState({
          dataTimezone: listTimezone,
          valueTimezone: valueTimezone
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  toggle() {
    let language = localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale;
    let timezone = sessionStorage.getItem('default_timezone') ? sessionStorage.getItem('default_timezone') : Config.defaultTimezone;
    let valueLanguage = "";
    let valueLanguageFlag = "";
    for (const obj of this.state.dataLanguage) {
      if(obj.languageKey === language) {
        valueLanguage = obj.languageName;
        valueLanguageFlag = obj.languageFlag;
        break;
      }
    }
    let valueTimezone = "";
    for (const obj of this.state.dataTimezone) {
      if(obj.nationCode === timezone) {
        valueTimezone = obj.timezoneName;
        break;
      }
    }
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      valueLanguage: valueLanguage,
      valueLanguageFlag: valueLanguageFlag,
      valueTimezone: valueTimezone
    });
  }

  handleLogout() {
    this.props.actions.onLogoutVsa();
  }

  handleChangeLanguage(language) {
    // this.props.i18n.changeLanguage(lng);
    localStorage.setItem('default_locale', language.languageKey);
    this.props.actions.updateUserLanguage(language.gnocLanguageId).then((response) => {
      window.location.reload();
    }).catch((error) => {
      console.error(error);
    });
  }

  handleChangeTimezone(timezone) {
    sessionStorage.setItem('default_timezone', timezone.nationCode);
    sessionStorage.setItem('default_timezone_offset', timezone.timezoneOffset);
    this.props.actions.updateUserTimeZone(timezone.gnocTimezoneId).then((response) => {
      // window.location.reload();
    }).catch((error) => {
      console.error(error);
    });
  }

  dropNotif() {
    const itemsCount = 5;
    return (
      <Dropdown nav className="d-md-down-none" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i className="icon-bell"></i><Badge pill color="danger">{itemsCount}</Badge>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="text-center"><strong>You have {itemsCount} notifications</strong></DropdownItem>
          <DropdownItem><i className="icon-user-follow text-success"></i> New user registered</DropdownItem>
          <DropdownItem><i className="icon-user-unfollow text-danger"></i> User deleted</DropdownItem>
          <DropdownItem><i className="icon-chart text-info"></i> Sales report is ready</DropdownItem>
          <DropdownItem><i className="icon-basket-loaded text-primary"></i> New client</DropdownItem>
          <DropdownItem><i className="icon-speedometer text-warning"></i> Server overloaded</DropdownItem>
          <DropdownItem header tag="div" className="text-center"><strong>Server</strong></DropdownItem>
          <DropdownItem>
            <div className="text-uppercase mb-1">
              <small><b>CPU Usage</b></small>
            </div>
            <Progress className="progress-xs" color="info" value="25" />
            <small className="text-muted">348 Processes. 1/4 Cores.</small>
          </DropdownItem>
          <DropdownItem>
            <div className="text-uppercase mb-1">
              <small><b>Memory Usage</b></small>
            </div>
            <Progress className="progress-xs" color="warning" value={70} />
            <small className="text-muted">11444GB/16384MB</small>
          </DropdownItem>
          <DropdownItem>
            <div className="text-uppercase mb-1">
              <small><b>SSD 1 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="danger" value={90} />
            <small className="text-muted">243GB/256GB</small>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  dropLanguage() {
    const { response } = this.props;
    let listLanguage = (response.common.language && response.common.language.payload) ? response.common.language.payload.data : [];
    let styleLanguage = {};
    if (listLanguage.length > 6) {
      styleLanguage = { height: '232px'};
    }
    return (
      <Dropdown nav className="d-md-down-none" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i className="icon-globe globe-flag"></i>
          <span className="flag">
            <i className={"flag-icon h6 " + this.state.valueLanguageFlag} title={this.state.valueLanguage}></i>
          </span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header tag="div" className="text-center"><strong><Trans i18nKey="common:common.label.language"/></strong></DropdownItem>
          <div style={styleLanguage}>
            <PerfectScrollbar>
              {listLanguage.map((language, idx) => {
                  return <DropdownItem key={"item-language-" + idx} onClick={() => this.handleChangeLanguage(language)}>{language.languageName}</DropdownItem>;
                },
              )}
            </PerfectScrollbar>
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }

  dropTimezone() {
    const { response } = this.props;
    let listTimezone = (response.common.timezone && response.common.timezone.payload) ? response.common.timezone.payload.data : [];
    let styleTimezone = {};
    if (listTimezone.length > 6) {
      styleTimezone = { height: '232px'};
    }
    return (
      <Dropdown nav className="d-md-down-none" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret className="class-timezone">
          {this.state.valueTimezone}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header tag="div" className="text-center"><strong><Trans i18nKey="common:common.label.timezone"/></strong></DropdownItem>
          <div style={styleTimezone}>
            <PerfectScrollbar>
            {listTimezone.map((timezone, idx) => {
                return <DropdownItem key={"item-timezone-" + idx} onClick={() => this.handleChangeTimezone(timezone)}>{timezone.timezoneName}</DropdownItem>;
              },
            )}
            </PerfectScrollbar>
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }

  dropAccnt() {
    let fullname;
    let avatarBase64 = imgPerson;
    try {
        const objectUsersDto = JSON.parse(localStorage.getItem('user'));
        if(objectUsersDto) {
          fullname = objectUsersDto.fullName;
            // if(objectUsersDto.avatarBase64) {
            //   avatarBase64 = objectUsersDto.avatarBase64;
            // }
        }
    } catch (error) {
        console.log(error);
    }
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav title={fullname.toUpperCase()} style={{maxWidth: '250px', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          <img src={avatarBase64} className="img-avatar" alt={fullname} />
          <span style={{color: '#20a8d8', fontWeight: '600'}}>{fullname.toUpperCase()}</span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="text-center"><strong><Trans i18nKey="common:common.label.account"/></strong></DropdownItem>
          {/* <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
          <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
          <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
          <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
          <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
          <DropdownItem divider />
          <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
          <DropdownItem><i className="fa fa-user"></i><Trans i18nKey="common:common.label.profile"/></DropdownItem>
          <DropdownItem onClick={this.handleLogout}><i className="fa fa-lock"></i><Trans i18nKey="common:common.label.logout"/></DropdownItem>
          {/*<DropdownItem><i className="fa fa-lock"></i> Logout</DropdownItem>*/}
        </DropdownMenu>
      </Dropdown>
    );
  }

  dropTasks() {
    const itemsCount = 15;
    return (
      <Dropdown nav className="d-md-down-none" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i className="icon-list"></i><Badge pill color="warning">{itemsCount}</Badge>
        </DropdownToggle>
        <DropdownMenu right className="dropdown-menu-lg">
          <DropdownItem header tag="div" className="text-center"><strong>You have {itemsCount} pending tasks</strong></DropdownItem>
          <DropdownItem>
            <div className="small mb-1">Upgrade NPM &amp; Bower <span
              className="float-right"><strong>0%</strong></span></div>
            <Progress className="progress-xs" color="info" value={0} />
          </DropdownItem>
          <DropdownItem>
            <div className="small mb-1">ReactJS Version <span className="float-right"><strong>25%</strong></span>
            </div>
            <Progress className="progress-xs" color="danger" value={25} />
          </DropdownItem>
          <DropdownItem>
            <div className="small mb-1">VueJS Version <span className="float-right"><strong>50%</strong></span>
            </div>
            <Progress className="progress-xs" color="warning" value={50} />
          </DropdownItem>
          <DropdownItem>
            <div className="small mb-1">Add new layouts <span className="float-right"><strong>75%</strong></span>
            </div>
            <Progress className="progress-xs" color="info" value={75} />
          </DropdownItem>
          <DropdownItem>
            <div className="small mb-1">Angular 2 Cli Version <span className="float-right"><strong>100%</strong></span></div>
            <Progress className="progress-xs" color="success" value={100} />
          </DropdownItem>
          <DropdownItem className="text-center"><strong>View all tasks</strong></DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  dropMssgs() {
    const itemsCount = 7;
    return (
      <Dropdown nav className="d-md-down-none" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i className="icon-envelope-letter"></i><Badge pill color="info">{itemsCount}</Badge>
        </DropdownToggle>
        <DropdownMenu right className="dropdown-menu-lg">
          <DropdownItem header tag="div"><strong>You have {itemsCount} messages</strong></DropdownItem>
          <DropdownItem href="#">
            <div className="message">
              <div className="pt-3 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">John Doe</small>
                <small className="text-muted float-right mt-1">Just now</small>
              </div>
              <div className="text-truncate font-weight-bold"><span className="fa fa-exclamation text-danger"></span> Important message</div>
              <div className="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </div>
            </div>
          </DropdownItem>
          <DropdownItem href="#">
            <div className="message">
              <div className="pt-3 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-warning"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Jane Doe</small>
                <small className="text-muted float-right mt-1">5 minutes ago</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <div className="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </div>
            </div>
          </DropdownItem>
          <DropdownItem href="#">
            <div className="message">
              <div className="pt-3 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/5.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-danger"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Janet Doe</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <div className="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </div>
            </div>
          </DropdownItem>
          <DropdownItem href="#">
            <div className="message">
              <div className="pt-3 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/4.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-info"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Joe Doe</small>
                <small className="text-muted float-right mt-1">4:03 AM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <div className="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </div>
            </div>
          </DropdownItem>
          <DropdownItem href="#" className="text-center"><strong>View all messages</strong></DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const { notif, language, timezone, accnt, tasks, mssgs } = this.props;
    return (
        notif ? this.dropNotif() :
          language ? this.dropLanguage() :
            timezone ? this.dropTimezone() :
              accnt ? this.dropAccnt() :
                tasks ? this.dropTasks() :
                  mssgs ? this.dropMssgs() : null
    );
  }
}

DefaultHeaderDropdown.propTypes = propTypes;
DefaultHeaderDropdown.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
  const { auth, common } = state;
  return {
      response: { auth, common }
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(Object.assign({}, authActions, commonActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(DefaultHeaderDropdown));
