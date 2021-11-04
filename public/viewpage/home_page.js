import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as FirebaseController from "../controller/firebase_controller.js";

export function addEventListeners() {
  Element.menuHome.addEventListener("click", async () => {
    history.pushState(null, null, Routes.routePathnames.HOME);
    const label = Util.disabledButton(Element.menuHome);
    await home_page();
    Util.enableButton(Element.menuHome, label);
  });
}

export async function home_page() {
  let products;
  let html = "<h1> Welcome </h1>";

  try {
    products = await FirebaseController.getProductList();

    products.forEach((product) => {
      html += buildProductCard(product);
    });
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.info("getProductList Error", JSON.stringify(e));
    return;
  }
  Element.root.innerHTML = html;
}

//Display product information
function buildProductCard(product) {
  return `
			 <div class="card" style="width: 18rem; display:inline-block; ">
				 <img src="${product.imageURL}" class="card-img-top " >
				 <div class="card-body mx-2 ">
					 <h5 class="card-title">${product.name}</h5>
					 <p class="card-text">
						 ${Util.currency(product.price)} <br>
						 ${product.summary}
					 </p>        
				 </div>
			 </div>
   `;
}
