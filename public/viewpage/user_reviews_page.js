import * as Element from "./element.js";
import * as UserReviewsUpdate from "../controller/user_edit_review_page.js";
import * as Routes from "../controller/routes.js";
import * as Util from "./util.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Auth from "../controller/auth.js";

export function addEventListeners() {
  Element.menuUserProductReview.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathnames.USERREVIEWS);
    user_review_page();
  });
}

export async function user_review_page() {
  let html = `<h1>Reviews from ${Auth.currentUser.email}</h1>`;
  console.log(Auth.currentUser.uid);

  const reviews = await FirebaseController.getReviews(Auth.currentUser.uid);

  if (reviews.length === 0) {
    html = "No reviews to be displayed!!!";
  } else {
    html += `
		<table class="table table-striped ">
		<thead>
			<tr>
				<th scope="col"></th>
				<th scope="col">Name</th>
				<th scope="col">Product Review</th>
				<th scope="col">Time/Date</th>
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

  //Delete review button add Event listener
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
        await FirebaseController.deleteReviewById(reviewId);
        document.getElementById(`review-${reviewId}`).remove();
        Util.info("Deleted ", `review deleted: review-${reviewId}`);
      } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info("Delete review  error", JSON.stringify(e));
      }
    });
  }

  //update review button add Event listener
  const editReviewButtons = document.getElementsByClassName("form-edit-review");
  for (let i = 0; i < editReviewButtons.length; i++) {
    editReviewButtons[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disabledButton(button);
      await UserReviewsUpdate.edit_review(e.target.reviewId.value);
      Util.enableButton(button, label);
    });
  }
}

function buildReviewInfo(review) {
  return `
        <tr id="review-${review.docId}" style="background-color: Turquoise;
		font-family: 'Courier New', Courier, monospace;
		font-size: larger;" style>
            <td> <img src= "${
              review.imageURL
            }" style="width:50%;height:50%;" > </td>
            <td> ${review.productName} </td>
            <td> ${review.review} </td>
            <td> ${new Date(review.timestamp).toString()}</td>
        
            <td>
                <form class="form-delete-review " method="post">
                    <input type="hidden" name="reviewId" value="${
                      review.docId
                    }">
                    <button class="btn btn-danger" type="submit"> Delete </button>
                </form>
                <form class="form-edit-review pt-5" method="post">
                    <input type="hidden" name="reviewId" value="${
                      review.docId
                    }">
                    <button class="btn btn-success" type="submit"> Edit </button>
                </form>
            <td>
        </tr>
    `;
}
