//menu elements.........

export const menuHome = document.getElementById("menu-home");
export const menuSignOut = document.getElementById("menu-signout");
export const menuProfile = document.getElementById("menu-button-profile");
export const menuShoppingCart = document.getElementById(
  "menu-button-shoppingcart"
);

//users buttons
export const menuUserPurchases = document.getElementById("menu-user-purchases");
export const menuUserProducts = document.getElementById("menu-user-products");
export const menuUserProductReview = document.getElementById(
  "menu-user-product-reviews"
);
export const formSearch = document.getElementById("form-search");

//admin buttons
export const menuAdminPurchases = document.getElementById(
  "menu-admin-purchases"
);
export const menuAdminProducts = document.getElementById("menu-admin-products");
export const menuAdminUsers = document.getElementById("menu-admin-users");
export const reviewCheck = document.getElementById("menu-Review-check-admin");

//sign up
export const formSignup = document.getElementById("form-signup");
export const formSignUpPassowrdError = document.getElementById(
  "form-signup-password-error"
);
export const menuSignup = document.getElementById("button-form-signup");

//sign in
export const formSignIn = document.getElementById("form-signin");

//Add new Products
export const formAddProduct = {
  form: document.getElementById("form-add-product"),
  errorName: document.getElementById("form-add-product-error-name"),
  errorPrice: document.getElementById("form-add-product-error-price"),
  errorSummary: document.getElementById("form-add-product-error-summary"),
  imageTag: document.getElementById("form-add-product-image-tag"),
  imageButton: document.getElementById("form-add-product-image-button"),
  errorImage: document.getElementById("form-add-product-error-image"),
};
export const formAddProductError = {
  name: document.getElementById("form-add-product-error-name"),
  price: document.getElementById("form-add-product-error-price"),
  summary: document.getElementById("form-add-product-error-summary"),
  image: document.getElementById("form-add-product-error-image"),
};
export const imageTagProduct = document.getElementById(
  "form-add-product-image-tag"
);
export const formImageAddButton = document.getElementById(
  "form-add-product-image-button"
);

//edit products
export const formEditProduct = {
  form: document.getElementById("form-edit-product"),
  imageTag: document.getElementById("form-edit-product-image-tag"),
  imageButton: document.getElementById("form-edit-product-image-button"),
  errorName: document.getElementById("form-edit-product-error-name"),
  errorPrice: document.getElementById("form-edit-product-error-price"),
  errorSummary: document.getElementById("form-edit-product-error-summary"),
  errorImage: document.getElementById("form-edit-product-error-image"),
};

export const formEditImageTag = document.getElementById(
  "form-edit-product-image-tag"
);

//popup infobox
export const popupInfoTilte = document.getElementById("modal-info-title");
export const popupInfoBody = document.getElementById("modal-info-body");

//transaction view
export const modalTransactionTitle = document.getElementById(
  "modal-transaction-title"
);
export const modalTransactionBody = document.getElementById(
  "modal-transaction-body"
);

//root element
export const root = document.getElementById("root");

//modals
export const modalSignin = new bootstrap.Modal(
  document.getElementById("modal-signin"),
  { backdrop: "static" }
);

export const modalInfo = new bootstrap.Modal(
  document.getElementById("modal-info"),
  { backdrop: "static" }
);

export const modalTransactionView = new bootstrap.Modal(
  document.getElementById("modal-transaction-view"),
  { backdrop: "static" }
);

export const modalSignup = new bootstrap.Modal(
  document.getElementById("modal-signup"),
  { backdrop: "static" }
);

export const formSignUpPasswordError = document.getElementById(
  "form-signup-password-error"
);

export const modalAddProduct = new bootstrap.Modal(
  document.getElementById("modal-add-product"),
  { backdrop: "static" }
);

export const modalEditProduct = new bootstrap.Modal(
  document.getElementById("modal-edit-product"),
  { backdrop: "static" }
);

export const shoppingcartCount = document.getElementById("shoppingcart-count");
