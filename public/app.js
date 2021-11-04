import * as Routes from "./controller/routes.js";
import * as Auth from "./controller/auth.js";
import * as HomePage from "./viewpage/home_page.js";

Auth.addEventListeners();
HomePage.addEventListeners();

window.onload = () => {
  const path = window.location.pathname;
  Routes.routing(path);
};

window.addEventListener("popstate", (e) => {
  e.preventDefault();
  const pathname = e.target.location.pathname;
  const hash = e.target.location.hash;
  Routes.routing(pathname, hash);
});
