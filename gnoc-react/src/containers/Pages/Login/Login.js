import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Auth actions
import * as authActions from '../../../actions/authActions';
// Child components
import LoginForm from './LoginForm';
import history from './../../../history';
import { translate, Trans } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import axios from "axios";
import Config from '../../../config';
import { geolocated } from 'react-geolocated';

class Login extends Component {
    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);

        this.state = {
            btnLoginLoading: false
        };
    }

    componentDidMount() {
        axios.get(Config.apiUrlGetIp)
        .then(function (response) {
            if(response.status === 200) {
                localStorage.setItem('obj_ip_login', JSON.stringify(response.data));
            }
        }).catch(function (error) {
            console.log(error);
        }).then(function () {
            // always executed
            localStorage.setItem('obj_ip_login', JSON.stringify({
                "city": "Hanoi",
                "country": "Vietnam",
                "countryCode": "VN",
                "query": "0.0.0.0",
                "region": "HN",
                "regionName": "Hanoi",
                "timezone": "Asia/Ha_Noi"
            }));
        });
    }

    handleValidSubmit(event, values) {
        this.setState({
            btnLoginLoading: true
        }, () => {
            this.props.actions.onGetToken(values).then((response) => {
                const {access_token, refresh_token} = response.payload.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('is_authenticated', "true");
                this.props.actions.onLogin().then((response) => {
                    this.setState({
                        btnLoginLoading: false
                    }, () => {
                        if(response.payload.data && response.payload.data.objectUsersDto.userId) {
                            localStorage.setItem('user', JSON.stringify(response.payload.data));
                            const locationState = localStorage.getItem('current_location_state');
                            if (locationState) {
                                history.push(locationState);
                            } else {
                                history.push('/');
                            }
                        } else {
                            localStorage.clear();
                            toastr.error(this.props.t("auth:auth.message.error.getInfoUser"));
                        }
                    });
                }).catch((response) => {
                    this.setState({
                        btnLoginLoading: false
                    }, () => {
                        localStorage.clear();
                        toastr.error(this.props.t("auth:auth.message.error.connectServer"));
                    });
                });
            }).catch((response) => {
                this.setState({
                    btnLoginLoading: false
                }, () => {
                    //localStorage.clear();
                    try {
                        if(response.error.response.data.error === "invalid_grant") {
                            toastr.error(this.props.t("auth:auth.message.error.wrongUsernamePassword"));
                        }
                    } catch (error) {
                        console.log(error);
                        toastr.error(this.props.t("auth:auth.message.error.connectServer"));
                    }
                });
            });
        });
    }

    displayRedirectMessages() {
        const isExpiredToken = localStorage.getItem('is_expired_token');
        if (isExpiredToken === "true") {
            return true;
        } else {
            return false;
        }
    }

    render() {
        let errorMessage = <div></div>;
        if(this.displayRedirectMessages()) {
            errorMessage = <div className="alert alert-danger"><Trans i18nKey="auth:auth.message.error.needLogin"/></div>;
        }
        return (
            <LoginForm handleValidSubmit = {this.handleValidSubmit} errorMessage={errorMessage} btnLoginLoading={this.state.btnLoginLoading} />
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        response: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(geolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  })(translate()(Login)));