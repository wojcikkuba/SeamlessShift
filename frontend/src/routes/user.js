import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Schedule from "views/Schedule";
import UserPage from "views/UserPage.js";
import MyClasses from "views/MyClasses.js";
import AddRequest from "views/AddRequest";
import CurrentRequests from "views/CurrentRequests";
import ManageUsers from "views/ManageUsers";
import ManageSubjects from "views/ManageSubjects";


var dashRoutes = [
  {
    path: "/current-requests",
    name: "Przeglądaj ogłoszenia",
    icon: "files_single-copy-04",
    component: <CurrentRequests />,
    layout: "/user",
  },
  {
    path: "/add-request",
    name: "Dodaj ogłoszenie",
    icon: "ui-1_simple-add",
    component: <AddRequest />,
    layout: "/user",
  },
  {
    path: "/my-classes",
    name: "Moje zajęcia",
    icon: "files_paper",
    component: <MyClasses />,
    layout: "/user",
  },
  {
    path: "/schedule",
    name: "Plany zajęć",
    icon: "ui-1_calendar-60",
    component: <Schedule />,
    layout: "/user",
  },
  {
    path: "/user-page",
    name: "Moje konto",
    icon: "users_single-02",
    component: <UserPage />,
    layout: "/user",
  },
  {
    path: "/manage-users",
    name: "Zarządzanie użytkownikami",
    icon: "users_single-02",
    component: <ManageUsers />,
    layout: "/user",
  },
  {
    path: "/manage-courses",
    name: "Zarządzanie planem",
    icon: "users_single-02",
    component: <ManageSubjects />,
    layout: "/user",
  },
  {
    //path: "/dashboard",
    path: '#',
    name: "Dashboard",
    icon: "design_app",
    component: <Dashboard />,
    layout: "/user",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "design_image",
    component: <Icons />,
    layout: "/user",
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "ui-1_bell-53",
    component: <Notifications />,
    layout: "/user",
  },

];
export default dashRoutes;
