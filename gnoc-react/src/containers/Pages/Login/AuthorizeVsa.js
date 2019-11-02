import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Auth actions
import * as authActions from '../../../actions/authActions';
import history from './../../../history';
import Config from '../../../config';
import { translate } from 'react-i18next';

class AuthorizeVsa extends Component {
  constructor(props) {
    super();
    this.state = { ...props };
  }

  componentWillMount() {
    localStorage.setItem('obj_ip_login', JSON.stringify({
      "city": "Hanoi",
      "country": "Vietnam",
      "countryCode": "VN",
      "query": "0.0.0.0",
      "region": "HN",
      "regionName": "Hanoi",
      "timezone": "Asia/Ha_Noi"
    }));
    try {
      let ticket = new URLSearchParams(this.props.location.search).get('ticket');
      localStorage.setItem('ticket_vsa', ticket);
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.props.actions.onValidateTokenVsa().then((response) => {
      localStorage.setItem('authorization', response.payload.headers.authorization);
      localStorage.setItem('is_authenticated', "true");
      let languageKey;
      if(response.payload.data && response.payload.data.object) {
        if(response.payload.data.languageKey) {
          languageKey = response.payload.data.languageKey;
        }
        localStorage.setItem('menuVsa', JSON.stringify(response.payload.data.object.parentMenu));
        localStorage.setItem('user', JSON.stringify(response.payload.data.object));
      }
      const locationState = localStorage.getItem('current_location_state');
      if (locationState && locationState !== "/authorize"
        && locationState !== "/401" && locationState !== "/404" && locationState !== "/500") {
        if (locationState === "/") {
          history.push('/dashboard');
        } else {
          history.push(locationState);
        }
      } else {
        history.push('/dashboard');
      }
      if(languageKey) {
        localStorage.setItem('default_locale', languageKey);
        window.location.reload();
      }
      // this.props.actions.onGetToken({username: response.payload.data.object.userName}).then((response) => {
      //   const {access_token, refresh_token} = response.payload.data;
      //   localStorage.setItem('access_token', access_token);
      //   localStorage.setItem('refresh_token', refresh_token);
      //   localStorage.setItem('is_authenticated', "true");
      //   this.props.actions.onLogin().then((response) => {
      //     if(response.payload.data && response.payload.data.objectUsersDto.userId && response.payload.data.userToken.userID) {
      //       localStorage.setItem('menuVsa', JSON.stringify(response.payload.data.userToken.parentMenu));
      //       localStorage.setItem('user', JSON.stringify(response.payload.data));
      //       const locationState = localStorage.getItem('current_location_state');
      //       if (locationState && locationState !== "/authorize") {
      //         history.push(locationState);
      //       } else {
      //         history.push('/dashboard');
      //       }
      //     } else {
      //       localStorage.clear();
      //     }
      //   }).catch((response) => {
      //     localStorage.clear();
      //   });
      // }).catch((response) => {
      //   localStorage.clear();
      // });
    }).catch((response) => {
      if (response.error.response && response.error.response.status === 401 && response.error.response.data.message === "invalid_session_vsa") {
        const isAuthenticated = localStorage.getItem('is_authenticated') === "true" ? true : false;
        if(isAuthenticated) {
          history.push('/401');
        } else {
          window.location = Config.apiUrl + "/oauthVsa/logoutVsa";
        }
      } else {
        history.push('/500');
      }
    });
  }

  render() {
    return (
      <div className="animated fadeIn text-center" style={{paddingTop: '40vh'}}>
        <div className="sk-three-bounce">
          <div className="sk-child sk-bounce1"></div>
          <div className="sk-child sk-bounce2"></div>
          <div className="sk-child sk-bounce3"></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    response: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AuthorizeVsa));