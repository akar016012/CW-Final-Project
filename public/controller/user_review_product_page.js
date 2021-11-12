import * as FirebaseController from "./firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import * as Element from "../viewpage/element.js";
import { Reviews } from "../model/Reviews.js";
import * as Auth from "./auth.js";

export function addEventListeners() {
  Element.formReviewProduct.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = e.target.getElementsByTagName("button")[0];
    const label = Util.disabledButton(button);
    await addReview(e, e.target.name.value, Element.formReviewImageTag.src);
    Util.enableButton(button, label);
    Element.modelReviewProduct.hide();
  });
}

export async function review_product(docId) {
  let product;
  try {
    product = await FirebaseController.userGetProductById(docId);
    if (!product) {
      Util.info("getProductById error", `No product found with Id ${docId}`);
      return;
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.info("getProductById error", JSON.stringify(e));
  }

  Element.formReviewImageTag.src = product.imageURL;
  Element.formReviewProduct.docId.value = product.docId;
  Element.formReviewProduct.name.value = product.name;
  Element.formReviewProduct.price.value = product.price;
  Element.formReviewProduct.review.value = "";
  Element.modelReviewProduct.show();
}

async function addReview(e, prodName, productImage) {
  const review = new Reviews({
    review: e.target.review.value,
    timestamp: Date.now(),
    userId: Auth.currentUser.uid,
    productId: e.target.docId.value,
    productName: prodName,
    imageURL: productImage,
    userName: Auth.currentUser.email,
  });

  const reviewErrors = review.validate();

  if (reviewErrors) {
    if (reviewErrors.review)
      Element.formReviewProductError.reviewCommentError.innerHTML =
        reviewErrors.review;
  } else {
    try {
      await FirebaseController.addReview(review.serialize());

      Util.info(
        "Success",
        ` Your review on ${prodName} has been added `,
        "modal-review-product"
      );
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.info(
        "Add product Failed",
        JSON.stringify(e),
        "modal-review-product"
      );
    }
  }
}
