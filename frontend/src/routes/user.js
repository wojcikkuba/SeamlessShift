import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Schedule from "views/Schedule";
import UserPage from "views/UserPage.js";
import MyClasses from "views/MyClasses.js";
import AddRequest from "views/AddRequest";
import CurrentRequests from "views/CurrentRequests";
import Reports from "views/Reports";


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
    path: "/reports",
    name: "Raporty",
    icon: "business_chart-bar-32",
    component: <Reports />,
    layout: "/user",
  },

];
export default dashRoutes;
