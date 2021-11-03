import * as HomePage from "../viewpage/home_page.js";

//user pages routes
import * as UserPage from "../viewpage/user_page.js";
import * as ReviewPage from "../viewpage/reviews_page.js";
import * as UserProfilePage from "../viewpage/user_profile_page.js";
import * as UserPurchasePage from "../viewpage/user_purchases_page.js";
import * as UserReviewPage from "../viewpage/user_reviews_page.js";
import * as UserShoppingCartPage from "../viewpage/user_shopping_cart_page.js";

//admin pages routes
import * as AdminProductPage from "../viewpage/admin_product_page.js";
import * as AdminPurchasesPage from "../viewpage/admin_purchases_page.js";
import * as AdminReviewCheck from "../viewpage/admin_review_check_page.js";
import * as AdminUserPage from "../viewpage/admin_user_page.js";

export const routePathnames = {
  HOME: "/",
  USER: "/user",
  REVIEWs: "/reviews",
  USERPROFILE: "/profile",
  USERPURCASES: "/purchases",
  USERREVIEWS: "/myReviews",
  USERSHOPPINGCART: "/shoppingcart",
  ADMINPRODUCTS: "/adminprod",
  ADMINPURCHASES: "/adminpurchase",
  ADMINREVIEW: "/reviewcheck",
  ADMINUSER: "/admin",
};

export const routes = [
  { pathname: routePathnames.HOME, page: HomePage.home_page },
  { pathname: routePathnames.USER, page: UserPage.user_page },
  { pathname: routePathnames.REVIEWs, page: ReviewPage.reviews_page },
  {
    pathname: routePathnames.USERPROFILE,
    page: UserProfilePage.user_profile_page,
  },
  {
    pathname: routePathnames.USERPURCASES,
    page: UserPurchasePage.user_purchases_page,
  },
  {
    pathname: routePathnames.USERREVIEWS,
    page: UserReviewPage.user_reviews_page,
  },
  {
    pathname: routePathnames.USERSHOPPINGCART,
    page: UserShoppingCartPage.user_shopping_cart_page,
  },
  {
    pathname: routePathnames.ADMINPRODUCTS,
    page: AdminProductPage.admin_product_page,
  },
  {
    pathname: routePathnames.ADMINPURCHASES,
    page: AdminPurchasesPage.admin_purchases_page,
  },
  {
    pathname: routePathnames.ADMINREVIEW,
    page: AdminReviewCheck.admin_review_check_page,
  },
  { pathname: routePathnames.ADMINUSER, page: AdminUserPage.admin_user_page },
];

//routing function
export function routing(path) {
  const route = routes.find((r = r.pathnames == path));
  if (route) route.page();
  else routes[0].page();
}
