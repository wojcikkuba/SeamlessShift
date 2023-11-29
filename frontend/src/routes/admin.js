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
import ReportsAdmin from "views/ReportsAdmin";

var dashRoutes = [
  {
    path: "/current-requests",
    name: "Przeglądaj ogłoszenia",
    icon: "files_single-copy-04",
    component: <CurrentRequests />,
    layout: "/admin",
  },
  {
    path: "/add-request",
    name: "Dodaj ogłoszenie",
    icon: "ui-1_simple-add",
    component: <AddRequest />,
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
  {
    path: "/user-page",
    name: "Moje konto",
    icon: "users_single-02",
    component: <UserPage />,
    layout: "/admin",
  },
  {
    path: "/reports-admin",
    name: "Raporty",
    icon: "business_chart-bar-32",
    component: <ReportsAdmin />,
    layout: "/admin",
  },
  {
    path: "/manage-users",
    name: "Zarządzanie użytkownikami",
    icon: "business_badge",
    component: <ManageUsers />,
    layout: "/admin",
  },
  {
    path: "/manage-subjects",
    name: "Zarządzanie planem",
    icon: "ui-2_settings-90",
    component: <ManageSubjects />,
    layout: "/admin",
  },
  {
    //path: "/dashboard",
    path: '#',
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
  
];
export default dashRoutes;
