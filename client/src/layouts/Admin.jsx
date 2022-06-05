/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react library for routing
import { Route, Switch, Redirect } from "react-router-dom";
// core components


import routes from "../routes.js";
import Sidebar from "../components/layouts/Sidebar/Sidebar";
import AdminNavbar from "../components/layouts/Navbars/AdminNavbar";
import Footer from "../components/layouts/Footers/AdminFooter";
import my_logo from '../assets/img/logo/logo_music_dashboard.png';
import "../assets/css/argon-dashboard-custom.css";
import { GlobalConsumer } from "../context/Context.jsx";
import Auth from "../service/Auth.jsx";
import ActionType from "../context/GlobalActionContentx.jsx";

class Admin extends React.Component {
  state = {
    sidenavOpen: true
  };

  componentDidMount() {
    this.loadCacheUser();
  }

  loadCacheUser = () => {
    try {
      var user = JSON.parse(Auth.getUser());
      this.props.dispatch({ action: ActionType.SET_USER, data: user });
    } catch (err) {
      console.log("err", err);
    }
  }

  componentDidUpdate(e) {
    if (e.history.pathname !== e.location.pathname) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainContent.scrollTop = 0;
    }
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  // toggles collapse between mini sidenav and normal
  toggleSidenav = e => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    this.setState({
      sidenavOpen: !this.state.sidenavOpen
    });
  };
  getNavbarTheme = () => {
    return this.props.location.pathname.indexOf(
      "admin/alternative-dashboard"
    ) === -1
      ? "dark"
      : "light";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          levelUser={this.props.state.user.level}
          routes={routes}
          toggleSidenav={this.toggleSidenav}
          sidenavOpen={this.state.sidenavOpen}
          logo={{
            innerLink: "/",
            imgSrc: my_logo,
            imgAlt: "..."
          }}
        />
        <div
          className="main-content"
          ref="mainContent"
          onClick={this.closeSidenav}
        >
          <AdminNavbar
            nameUser={this.props.state.user.name}
            imageUser={this.props.state.user.image}
            {...this.props}
            theme={this.getNavbarTheme()}
            toggleSidenav={this.toggleSidenav}
            sidenavOpen={this.state.sidenavOpen}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/admin/godevs" />
          </Switch>
          <Footer />
        </div>
        {this.state.sidenavOpen ? (
          <div className="backdrop d-xl-none" onClick={this.toggleSidenav} />
        ) : null}
      </>
    );
  }
}

export default GlobalConsumer(Admin);
