/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// import TableUsers from "./views/pages/users/TableUsers.jsx";
import Login from "./views/Login/Login.jsx";
import TableArtists from "./views/pages/artists/TableArtists.jsx";
import TabelGodevs from "./views/pages/godevs/TabelGodevs.jsx";
import TableApplications from "./views/pages/applications/TableApplications.jsx";
import PageSettingAds from "./views/pages/applications/PageSettingAds.jsx";
import TableMusics from "./views/pages/musics/TableMusics.jsx";

var routes = [
  {
    path: "/godevs",
    name: "Godevs",
    icon: "ni ni-tv-2 text-primary",
    component: TabelGodevs,
    layout: "/admin"
  },
  {
    path: "/applications",
    name: "Applications",
    icon: "fab fa-android text-orange",
    component: TableApplications,
    layout: "/admin"
  },
  {
    path: "/musics",
    name: "Audio",
    icon: "fas fa-headphones text-info",
    component: TableMusics,
    layout: "/admin"
  },
  {
    path: "/artists",
    name: "Artist",
    icon: "fas fa-user-friends text-pink",
    component: TableArtists,
    layout: "/admin"
  },
  // {
  //   path: "/users",
  //   name: "Users",
  //   icon: "fa fa-users text-blue",
  //   component: TableUsers,
  //   layout: "/admin"
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/settingAds",
    component: PageSettingAds,
    layout: "/admin",
  },
];
export default routes;
