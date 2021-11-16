import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as Util from "./util.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";

export function addEventListeners() {
  Element.reviewCheck.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathnames.REVIEWS);
    adminReviewCheck();
  });
}

export async function adminReviewCheck() {
  let html = `<h1>Product Reviews Check!! </h1>`;

  // get all reviews from Firebase
  const reviews = await FirebaseController.reviewsList();

  //display reviews
  if (reviews.length === 0) {
    html = "No reviews available! Please add a review!!";
  } else {
    html += `
                <table class="table table-striped ">
                <thead>
                    <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Product Review</th>
                        <th scope="col">Review By:</th>
                        <th scope="col">Review time</th>
                    </tr>
                </thead>
                <tbody>
        `;

    reviews.forEach((review) => {
      html += buildReviewInfo(review);
    });

    html += "</tbody></table>";
  }

  Element.root.innerHTML = html;

  const deleteReviewForms =
    document.getElementsByClassName("form-delete-review");
  for (let i = 0; i < deleteReviewForms.length; i++) {
    deleteReviewForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const r = confirm("Are you sure to delete this review?");
      if (!r) return;
      const button = e.target.getElementsByTagName("button")[0];
      Util.disabledButton(button);

      const reviewId = e.target.reviewId.value;
      try {
        await FirebaseController.adminDeleteFunction(reviewId);
        document.getElementById(`review-${reviewId}`).remove();
        Util.info("Deleted ", `review deleted: review-${reviewId}`);
      } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info("Delete review  error", JSON.stringify(e));
      }
    });
  }
}

function buildReviewInfo(review) {
  return `
		  <tr id="review-${review.docId}" style="background-color: CadetBlue;
		  font-family: 'Courier New', Courier, monospace;
		  font-size: larger;" style>
			  <td> <img src= "${review.imageURL}" style="width:50%;height:50%;" > </td>
			  <td> ${review.productName} </td>
			  <td> ${review.review} </td>
			  <td> ${review.userName} </td>
			  <td> ${new Date(review.timestamp).toString()}</td>
			  <td>
                <form class="form-delete-review " method="post">
                    <input type="hidden" name="reviewId" value="${
                      review.docId
                    }">
                    <button class="btn btn-danger" type="submit"> Delete </button>
                </form>
            <td>
		  </tr>
	  `;
}
