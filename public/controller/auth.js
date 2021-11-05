import * as Element from "../viewpage/element.js";
import * as UserPage from "../viewpage/user_page.js";
import * as Util from "../viewpage/util.js";
import * as Routes from "./routes.js";
import * as UserProfilePage from "../viewpage/user_profile_page.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "./firebase_controller.js";

export let currentUser;

export function addEventListeners() {
  //sign in
  Element.formSignIn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await FirebaseController.signIn(email, password);
      Element.modalSignin.hide();
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.info("Sign In Error", JSON.stringify(e), Element.modalSignin);
    }
  });

  //signout
  Element.menuSignOut.addEventListener("click", async () => {
    try {
      await FirebaseController.signOut();
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.info("Sign Out Error", JSON.stringify(e));
    }
  });

  //sign up
  Element.menuSignup.addEventListener("click", () => {
    Element.modalSignin.hide();
    Element.formSignup.reset();
    Element.modalSignup.show();
  });

  Element.menuSignup.addEventListener("submit", (e) => {
    e.preventDefault();
    sign_up(e.target);
  });

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      await UserProfilePage.getAccountInfo(user);
      UserPage.initShoppingCarts();
      let elements = document.getElementsByClassName("menu-pre-auth");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
      }

      //If user is an admin
      if (Constant.adminEmails.includes(user.email)) {
        let admin_nav_bar = document.getElementsByClassName("menu-admin-auth");
        for (let i = 0; i < admin_nav_bar.length; i++) {
          admin_nav_bar[i].style.display = "block";
        }
        let menuHome = document.getElementsByClassName("menu-home-auth")[0];
        menuHome.style.display = "none";
        history.pushState(null, null, Routes.routePathnames.ADMINPRODUCTS);
        Routes.routing(window.location.pathname, window.location.hash);
      }

      // not admin
      else if (!Constant.adminEmails.includes(user.email)) {
        let admin_nav_bar = document.getElementsByClassName("menu-user-auth");
        for (let i = 0; i < admin_nav_bar.length; i++) {
          admin_nav_bar[i].style.display = "block";
        }
        let menuHome = document.getElementsByClassName("menu-home-auth")[0];
        menuHome.style.display = "none";
        history.pushState(null, null, Routes.routePathnames.USER);
        Routes.routing(window.location.pathname, window.location.hash);
      }
    }
    // user signed out
    else {
      //signed out
      currentUser = null;
      let elements = document.getElementsByClassName("menu-pre-auth");
      for (let i = 0; i < elements.length; i++)
        elements[i].style.display = "block";
      elements = document.getElementsByClassName("menu-post-auth");
      for (let i = 0; i < elements.length; i++)
        elements[i].style.display = "none";
      history.pushState(null, null, Routes.routePathnames.HOME);
      Routes.routing(window.location.pathname, window.location.hash);
    }
  });
  Element.formSignup.addEventListener("click", () => {
    //show signup modal
    Element.modalSignin.hide();
    Element.modalSignup.reset();
    Element.modalSignup.show();
  });
  Element.formSignup.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    Element.formSignUpPassowrdError.innerHTML = "";
    if (password != passwordConfirm) {
      Element.formSignUpPassowrdError.innerHTML = "Two passwords do not match";
      return;
    }
    try {
      await FirebaseController.createUser(email, password);
      Util.info(
        `Account Created!`,
        `You are now signed in as ${email}`,
        Element.modalSignup
      );
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.info(
        "Failed to create new account",
        JSON.stringify(e),
        Element.modalSignup
      );
    }
  });
}
