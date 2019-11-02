import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Auth actions
import * as authActions from '../../actions/authActions';
import { translate, Trans } from 'react-i18next';
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
// icon menu
import iconsMenu from '../../iconsMenu';
import history from '../../history';
import Config from '../../config';
import _ from 'lodash';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      menu: {},
      routesVsa: []
    };
  }

  componentWillMount() {
    try {
      //Get routes VSA
      let routesVsa = _.cloneDeep(routes);
      for (const route of routesVsa) {
        route.name = <Trans i18nKey={"common:common.menu." + route.code} />;
      }
      //Get menu VSA
      let menu = _.cloneDeep(navigation); 
      for (const item of menu.items) {
        item.name = <Trans i18nKey={"common:common.menu." + item.code} />;
      }
      const menuVsa = JSON.parse(localStorage.getItem('menuVsa')) === null ? [] : JSON.parse(localStorage.getItem('menuVsa'));
      
      for (const elementParent of menuVsa) {
        let objectChild = [];
        if (elementParent.childObjects.length > 0) {
          for (const elementChild of elementParent.childObjects) {
            objectChild.push({
              id: elementChild.objectId,
              code: elementChild.objectCode,
              name: <Trans i18nKey={"common:common." + elementChild.objectName} />,
              type: elementChild.objectType,
              description: elementChild.description,
              url: elementChild.objectUrl,
              icon: iconsMenu[elementChild.objectCode],
            });
            for (const route of routesVsa) {
              if (route.code === elementChild.objectCode) {
                route.path = elementChild.objectUrl;
                route.name = <Trans i18nKey={"common:common." + elementChild.objectName} />;
                break;
              }
            }
          }
        }
        for (const route of routesVsa) {
          if (route.code === elementParent.objectCode) {
            route.path = elementParent.objectUrl;
            route.name = <Trans i18nKey={"common:common." + elementParent.objectName} />;
            break;
          }
        }
        menu.items.push({
          id: elementParent.objectId,
          code: elementParent.objectCode,
          name: <Trans i18nKey={"common:common." + elementParent.objectName} />,
          type: elementParent.objectType,
          description: elementParent.description,
          url: elementParent.objectUrl,
          icon: iconsMenu[elementParent.objectCode],
          children: objectChild
        });
      }
      this.setState({
        menu: menu,
        routesVsa: routesVsa
      });
    } catch (error) {
        console.log(error);
    }
  }

  componentDidMount() {
    this.props.actions.onValidateTokenVsa().then((response) => {
      try {
        const { smartOfficeToken, smartOfficeLink} = response.payload.data;
        // if(response.payload.data.languageKey && localStorage.getItem('default_locale')
        //   && (response.payload.data.languageKey !== localStorage.getItem('default_locale'))) {
        //   localStorage.setItem('default_locale', response.payload.data.languageKey);
        //   window.location.reload();
        // }
        this.onLoadScriptSmartOfficeChat(smartOfficeLink, smartOfficeToken);
      } catch (error) {
        console.error(error);
      }
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

  onLoadScriptSmartOfficeChat(link, token) {
    const script = document.createElement("script");
    script.src = link;
    script.async = true;
    script.addEventListener('load', function () {
      window.embedSmartOfficeChat({'token': token});
    });
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  loading = () =>
    <div className="animated fadeIn pt-1 text-center">
      <div className="sk-three-bounce">
        <div className="sk-child sk-bounce1"></div>
        <div className="sk-child sk-bounce2"></div>
        <div className="sk-child sk-bounce3"></div>
      </div>
    </div>;

  loadingSystem = () =>
    <div className="animated fadeIn text-center">
      <div className="sk-circle class-custom-sk-circle">
        <div className="sk-circle1 sk-child"></div>
        <div className="sk-circle2 sk-child"></div>
        <div className="sk-circle3 sk-child"></div>
        <div className="sk-circle4 sk-child"></div>
        <div className="sk-circle5 sk-child"></div>
        <div className="sk-circle6 sk-child"></div>
        <div className="sk-circle7 sk-child"></div>
        <div className="sk-circle8 sk-child"></div>
        <div className="sk-circle9 sk-child"></div>
        <div className="sk-circle10 sk-child"></div>
        <div className="sk-circle11 sk-child"></div>
        <div className="sk-circle12 sk-child"></div>
      </div>
    </div>;

  render() {
    return (
      <div className="app">
        <div className="class-loading-overlay">{this.loadingSystem()}</div>
        <AppHeader fixed>
          {/* <Suspense fallback={this.loading()}> */}
            <DefaultHeader />
          {/* </Suspense> */}
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={this.state.menu} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={this.state.routesVsa}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {this.state.routesVsa.map((route, idx) => {
                      return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                          <route.component {...props} />
                      )} />)
                        : (null);
                    },
                  )}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            {/* <Suspense fallback={this.loading()}> */}
              <DefaultAside />
            {/* </Suspense> */}
          </AppAside>
        </div>
        <AppFooter>
          {/* <Suspense fallback={this.loading()}> */}
            <DefaultFooter />
          {/* </Suspense> */}
        </AppFooter>
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(DefaultLayout));