import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as Auth from "../controller/auth.js";
import * as Util from "./util.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";

export function addEventListeners() {
  Element.customerReview.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathnames.REVIEWS);
    mainReview();
  });
}

export async function mainReview() {
  let html = `<h1>Product Reviews from All Users!! </h1>`;

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
		  </tr>
	  `;
}
