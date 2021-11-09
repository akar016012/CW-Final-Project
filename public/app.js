import * as Routes from "./controller/routes.js";
import * as Auth from "./controller/auth.js";
import * as HomePage from "./viewpage/home_page.js";
import * as UserShoppingCartPage from "./viewpage/user_shopping_cart_page.js";
import * as UserMainPage from "./viewpage/user_page.js";
import * as UserProfilePage from "./viewpage/user_profile_page.js";
import * as UserPurchases from "./viewpage/user_purchases_page.js";
import * as AdminUsers from "./viewpage/admin_user_page.js";
import * as AdminHome from "./viewpage/admin_product_page.js";
import * as Edit from "./controller/edit_products.js";

Auth.addEventListeners();
HomePage.addEventListeners();
UserShoppingCartPage.addEventListeners();
UserMainPage.addEventListeners();
UserProfilePage.addEventListeners();
UserPurchases.addEventListeners();
AdminUsers.addEventListeners();
AdminHome.addEventListener();
Edit.addEventListener();

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
