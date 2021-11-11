import * as Element from "./element.js";
import * as Route from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import { ShoppingCart } from "../model/ShoppingCart.js";

export function addEventListeners() {
  Element.menuUserProducts.addEventListener("click", async () => {
    history.pushState(null, null, Route.routePathnames.USER);
    Route.routing(window.location.pathname, window.location.hash);
    const label = Util.disabledButton(Element.menuHome);
    await user_page();
    Util.enableButton(Element.menuHome, label);
  });

  //search eventListener ⬇

  Element.formSearch.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchButton = Element.formSearch.getElementsByTagName("button")[0];
    const searchKeyword = e.target.searchKeyword.value;

    if (searchKeyword.length == 0) {
      Util.info(
        "Invalid Search Entry",
        "Enter the title of the product to search!!"
      );
      return;
    }
    search_page(searchKeyword);
    e.target.searchKeyword.value = "";
  });
}
//search eventListener ⬆

export let products;
export let cart;

export async function user_page() {
  let html = `<h1>Enjoy Shopping</h1>`;
  try {
    products = await FirebaseController.getProductList();
    if (cart) {
      cart.items.forEach((item) => {
        const product = products.find((p) => item.docId == p.docId);
        product.qty = item.qty;
      });
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.info("Cannot get product info", JSON.stringify(e));
  }
  for (let i = 0; i < products.length; i++) {
    html += buildProductView(products[i], i);
  }
  Element.root.innerHTML = html;

  const decForms = document.getElementsByClassName("form-dec-qty");
  for (let i = 0; i < decForms.length; i++) {
    decForms[i].addEventListener("submit", (e) => {
      e.preventDefault();
      const p = products[e.target.index.value];
      cart.removeItem(p);
      document.getElementById("qty-" + p.docId).innerHTML =
        p.qty == null || p.qty == 0 ? "Add" : p.qty;
      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }

  const incForms = document.getElementsByClassName("form-inc-qty");
  for (let i = 0; i < decForms.length; i++) {
    incForms[i].addEventListener("submit", (e) => {
      e.preventDefault();
      const p = products[e.target.index.value];
      cart.addItem(p);
      document.getElementById("qty-" + p.docId).innerHTML = p.qty;
      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }
}

function buildProductView(product, index) {
  return `
	<div class="card" style="width: 18rem; display: inline-block;">
		<img src="${product.imageURL}" class="card-img-top">
		<div class="card-body">
			<h5 class="card-title">${product.name}</h5>
			<p class="card-text">
				${Util.currency(product.price)}<br>
				${product.summary}
			</p>
			<div class="container pt-3 bg-light ${Auth.currentUser ? "d-block" : "d-none"}">
			<form method="post" class="d-inline form-dec-qty">
				<input type="hidden" name="index" value="${index}">
				<button class="btn btn-outline-danger" type="submit">&minus;</button>
			</form>
			<div id="qty-${
        product.docId
      }" class="container rounded text-center text-white bg-primary d-inline-block w-50">
				${product.qty == null || product.qty == 0 ? "Add" : product.qty}
			</div >
			<form method="post" class="d-inline form-inc-qty">
				<input type="hidden" name="index" value="${index}">
				<button class="btn btn-outline-primary" type="submit">&plus;</button>
			</form>

			</div>
		</div>
	</div>
	`;
}

export function initShoppingCarts() {
  const cartString = window.localStorage.getItem(
    "cart_new-" + Auth.currentUser.uid
  );
  cart = ShoppingCart.parse(cartString);
  if (!cart || !cart.isValid() || cart.uid != Auth.currentUser.uid) {
    window.localStorage.removeItem("cart-" + Auth.currentUser.uid);
    cart = new ShoppingCart(Auth.currentUser.uid);
  }
  Element.shoppingcartCount.innerHTML = cart.getTotalQty();
}

export function searchResult(products) {
  let html = "";
  let index = 0;
  products.forEach((product) => {
    html += buildProductView(product, index);
    ++index;
  });

  Element.root.innerHTML = html;
}

export async function search_page(searchKeyword) {
  if (!Auth.currentUser) {
    Element.root.innerHTML = "<h1>Protected Page</h1>";
    return;
  }

  try {
    products = await FirebaseController.searchProduct(searchKeyword);
    searchResult(products);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    return;
  }

  //- minus button function ⬇
  const decForms = document.getElementsByClassName("form-dec-qty");
  for (let i = 0; i < decForms.length; i++) {
    decForms[i].addEventListener("submit", (e) => {
      e.preventDefault();
      const p = products[e.target.index.value];
      cart.removeItem(p);
      document.getElementById("qty-" + p.docId).innerHTML =
        p.qty == null || p.qty == 0 ? "Add" : p.qty;
      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }
  //- minus button function ⬆
  //+ minus button function ⬇

  const incForms = document.getElementsByClassName("form-inc-qty");
  for (let i = 0; i < decForms.length; i++) {
    incForms[i].addEventListener("submit", (e) => {
      e.preventDefault();
      const p = products[e.target.index.value];
      cart.addItem(p);
      document.getElementById("qty-" + p.docId).innerHTML = p.qty;
      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }
  //+ minus button function ⬆
}
