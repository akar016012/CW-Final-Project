import { Product } from "../model/Product.js";
import * as Element from "./element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Routes from "../controller/routes.js";
import * as Edit from "../controller/edit_products.js";
import * as Auth from "../controller/auth.js";

let imageFile2Upload;

export function addEventListener() {
  Element.menuAdminProducts.addEventListener("click", async () => {
    history.pushState(null, null, Routes.routePathnames.ADMINPRODUCTS);
    const button = Element.menuAdminProducts;
    const label = Util.disabledButton(button);
    await admin_product_page();
    // await Util.sleep(1000);
    Util.enableButton(button, label);
  });
  Element.formAddProduct.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = e.target.getElementsByTagName("button")[0];
    const label = Util.disabledButton(button);
    await addNewProduct(e.target);
    Element.modalAddProduct.hide();
    await admin_product_page();
    Util.enableButton(button, label);
  });

  Element.formAddProduct.imageButton.addEventListener("change", (e) => {
    imageFile2Upload = e.target.files[0];
    if (!imageFile2Upload) {
      Element.formAddProduct.imageTag.src = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (Element.formAddProduct.imageTag.src = reader.result);
    reader.readAsDataURL(imageFile2Upload);
  });

  Element.formAdminSearch.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchButton =
      Element.formAdminSearch.getElementsByTagName("button")[0];
    const searchKeyword = e.target.searchKeyword.value;

    if (searchKeyword.length == 0) {
      Util.info(
        "Invalid Search Entry",
        "Enter the title of the product to search!!"
      );
      return;
    }
    search_admin_page(searchKeyword);
    e.target.searchKeyword.value = "";
  });
}
export let products;

export async function admin_product_page() {
  if (!Auth.currentUser) return;

  let html = `
    <div>
      <button id="button-add-product" class="btn btn-outline-danger">+ Add Product</button> 
    </div>
  `;

  try {
    products = await FirebaseController.getProductList();
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.info("Cannot get product list", JSON.stringify(e));
    return;
  }

  //render products
  products.forEach((p) => {
    html += buildProductCard(p);
  });

  Element.root.innerHTML = html;

  document
    .getElementById("button-add-product")
    .addEventListener("click", () => {
      Element.formAddProduct.form.reset();
      Element.formAddProduct.imageTag.src = "";
      imageFile2Upload = null;
      Element.modalAddProduct.show();
    });

  const editforms = document.getElementsByClassName("form-edit-product");
  for (let i = 0; i < editforms.length; i++) {
    editforms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disabledButton(button);
      await Edit.edit_product(e.target.docId.value);
      Util.enableButton(button, label);
    });
  }

  const deleteForms = document.getElementsByClassName("form-delete-product");
  for (let i = 0; i < deleteForms.length; i++) {
    deleteForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!window.confirm("Press OK to delete.")) return; //cancel button pressed
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disabledButton(button);
      await Edit.delete_product(e.target.docId.value, e.target.imageName.value);
      Util.enableButton(button, label);
    });
  }
}

async function addNewProduct(form) {
  const name = form.name.value;
  const price = form.price.value;
  const summary = form.summary.value;

  const product = new Product({ name, price, summary });

  // save the product object in Firebase
  //1. upload the image into Cloud Storage database => image name, url
  //2. store product info to Firestore with image info

  try {
    const { imageName, imageURL } = await FirebaseController.uploadImage(
      imageFile2Upload
    );
    product.imageName = imageName;
    product.imageURL = imageURL;
    await FirebaseController.addProduct(product.serialize());
    Util.info("Success!", `${product.name} added!`, Element.modalAddProduct);
    await admin_product_page();
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.info("Add Product failed", JSON.stringify(e), Element.modalAddProduct);
  }
}
function buildProductCard(product) {
  return `
  <div id="card-${product.docId}" class="card" style="width: 18rem; display: inline-block">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$ ${product.price}<br>${product.summary}</p>
        </div>
        <form class="form-edit-product float-start" method="post">
          <input type="hidden" name="docId" value="${product.docId}">
          <button class="btn btn-primary" type="submit">Edit</button>
        </form>
        <form class="form-delete-product float-end" method="post">
          <input type="hidden" name="docId" value="${product.docId}">
          <input type="hidden" name="imageName" value="${product.imageName}">
          <button class="btn btn-danger" type="submit">Delete</button>
        </form>
  </div>
  `;
}

export function searchResult(products) {
  let html = "";
  let index = 0;
  products.forEach((product) => {
    html += buildProductCard(product, index);
    ++index;
  });

  Element.root.innerHTML = html;
}

export async function search_admin_page(searchKeyword) {
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
  const editforms = document.getElementsByClassName("form-edit-product");
  for (let i = 0; i < editforms.length; i++) {
    editforms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disabledButton(button);
      await Edit.edit_product(e.target.docId.value);
      Util.enableButton(button, label);
    });
  }

  const deleteForms = document.getElementsByClassName("form-delete-product");
  for (let i = 0; i < deleteForms.length; i++) {
    deleteForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!window.confirm("Press OK to delete.")) return; //cancel button pressed
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disabledButton(button);
      await Edit.delete_product(e.target.docId.value, e.target.imageName.value);
      Util.enableButton(button, label);
    });
  }
}
