import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Schedule from "views/Schedule";
import UserPage from "views/UserPage.js";
import MyClasses from "views/MyClasses.js";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "design_image",
    component: <Icons />,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "ui-1_bell-53",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "users_single-02",
    component: <UserPage />,
    layout: "/admin",
  },
  {
    path: "/my-classes",
    name: "Moje zajęcia",
    icon: "files_paper",
    component: <MyClasses />,
    layout: "/admin",
  },
  {
    path: "/schedule",
    name: "Plany zajęć",
    icon: "ui-1_calendar-60",
    component: <Schedule />,
    layout: "/admin",
  },
];
export default dashRoutes;
