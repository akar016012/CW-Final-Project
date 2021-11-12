import * as FirebaseController from "./firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import * as Element from "../viewpage/element.js";
import { Reviews } from "../model/Reviews.js";
import * as UserReviewPage from "../viewpage/user_reviews_page.js";

export function addEventListeners() {
  //Update the product
  Element.formUpdateReviewProduct.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = e.target.getElementsByTagName("button")[0];
    const label = Util.disabledButton(button);
    const rev = new Reviews({
      review: e.target.review.value,
      timestamp: Date.now(),
    });

    rev.docId = e.target.docId.value;

    const reviewErrors = rev.validate();

    if (reviewErrors) {
      if (reviewErrors.review)
        Element.formUpdateReviewProductError.reviewUpdateError.innerHTML =
          reviewErrors.review;
    } else {
      try {
        await FirebaseController.updateReview(rev);
        Element.modelUpdateReviewProduct.hide();
        Util.info(
          "updated!",
          `${rev.docId} is updated successfully`,
          "modelUpdateReviewProduct"
        );

        //refresh browser
        UserReviewPage.user_review_page();
      } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info(
          "Edit Review Failed",
          JSON.stringify(e),
          "modelUpdateReviewProduct"
        );
      }
    }

    Util.enableButton(button, label);
  });
}

export async function edit_review(reviewId) {
  //Get info to the modal form of Edit review
  let review;
  try {
    review = await FirebaseController.getReviewById(reviewId);
    if (!review) {
      Util.info("getReviewById error", `No review found by Id ${reviewId}`);
      return;
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.info("getReviewById error", JSON.stringify(e));
  }

  //Get info to the modal form of Edit Product
  Element.formUpdateReviewProduct.docId.value = review.docId;
  Element.formUpdateReviewImageTag.src = review.imageURL;
  Element.formUpdateReviewProduct.name.value = review.productName;
  Element.formUpdateReviewProduct.review.value = review.review;

  Element.modelUpdateReviewProduct.show();
}
