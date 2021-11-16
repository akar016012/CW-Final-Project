import { AccountInfo } from "../model/account_info.js";
import { Product } from "../model/Product.js";
import * as Constant from "../model/constant.js";
import { ShoppingCart } from "../model/ShoppingCart.js";
import { Reviews } from "../model/Reviews.js";

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}

export async function getProductList() {
  const products = [];
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionNames.PRODUCTS)
    .orderBy("name")
    .get();

  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;
}

export async function getAccountInfo(uid) {
  const doc = await firebase
    .firestore()
    .collection(Constant.collectionNames.ACCOUNT_INFO)
    .doc(uid)
    .get();
  if (doc.exists) {
    return new AccountInfo(doc.data());
  } else {
    const defaultInfo = AccountInfo.instance();
    await firebase
      .firestore()
      .collection(Constant.collectionNames.ACCOUNT_INFO)
      .doc(uid)
      .set(defaultInfo.serialize());
    return defaultInfo;
  }
}
export async function upddateAccountInfo(uid, updateInfo) {
  //updateInfo= {key: value}
  await firebase
    .firestore()
    .collection(Constant.collectionNames.ACCOUNT_INFO)
    .doc(uid)
    .update(updateInfo);
}

export async function uploadProfilePhoto(photoFile, imageName) {
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PROFILE_PHOTOS + imageName);
  const taskSnapShot = await ref.put(photoFile);
  const photoURL = await taskSnapShot.ref.getDownloadURL();
  return photoURL;
}

export async function createUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function checkOut(cart) {
  const data = cart.serialize(Date.now());
  await firebase
    .firestore()
    .collection(Constant.collectionNames.PURCHASE_HISTORY)
    .add(data);
}
export async function getPurchaseHistory(uid) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionNames.PURCHASE_HISTORY)
    .where("uid", "==", uid)
    .orderBy("timestamp", "desc")
    .get();
  const carts = [];
  snapShot.forEach((doc) => {
    const sc = ShoppingCart.deserialize(doc.data());
    carts.push(sc);
  });
  return carts;
}

//admin CF
const cf_addProduct = firebase.functions().httpsCallable("cf_addProduct");

export async function addProduct(product) {
  await cf_addProduct(product);
}

export async function uploadImage(imageFile, imageName) {
  if (!imageName) imageName = Date.now() + imageFile.name;

  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCTS_IMAGES + imageName);

  const taskSnapShot = await ref.put(imageFile);
  const imageURL = await taskSnapShot.ref.getDownloadURL();
  return {
    imageName,
    imageURL,
  };
}

// const cf_getProductList = firebase
//   .functions()
//   .httpsCallable("cf_getProductList");
// export async function getProductList() {
//   const products = [];
//   const result = await cf_getProductList(); // result.data
//   result.data.forEach((data) => {
//     const p = new Product(data);
//     p.docId = data.docId;
//     products.push(p);
//   });
//   return products;
// }

const cf_getProductById = firebase
  .functions()
  .httpsCallable("cf_getProductById");
export async function getProductById(docId) {
  const result = await cf_getProductById(docId);
  if (result.data) {
    const product = new Product(result.data);
    product.docId = result.data.docId;
    return product;
  } else {
    return null;
  }
}

const cf_updateProduct = firebase.functions().httpsCallable("cf_updateProduct");

export async function updateProduct(product) {
  const docId = product.docId;
  const data = product.serializeForUpdate();
  await cf_updateProduct({ docId, data });
}

const cf_deleteProduct = firebase.functions().httpsCallable("cf_deleteProduct");

export async function deleteProduct(docId, imageName) {
  await cf_deleteProduct(docId);
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCTS_IMAGES + imageName);

  await ref.delete();
}

const cf_getUserList = firebase.functions().httpsCallable("cf_getUserList");
export async function getUserList() {
  const result = await cf_getUserList();
  return result.data;
}

const cf_updateUser = firebase.functions().httpsCallable("cf_updateUser");
export async function updateUser(uid, update) {
  await cf_updateUser({ uid, update });
}

const cf_deleteUser = firebase.functions().httpsCallable("cf_deleteUser");
export async function deleteUser(uid) {
  await cf_deleteUser(uid);
}

export async function searchProduct(keyword) {
  const productList = [];
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionNames.PRODUCTS)
    .where("name", "==", keyword)
    .get();
  snapShot.forEach((doc) => {
    const prod = new Product(doc.data());
    prod.docId = doc.id;
    productList.push(prod);
  });
  return productList;
}

//get the list of all reviews
export async function getReviews(userId) {
  let userReviews = [];
  const snapshot = await firebase
    .firestore()
    .collection(Constant.collectionNames.REVIEWS)
    .where("userId", "==", userId)
    .orderBy("timestamp", "desc")
    .get();
  snapshot.forEach((doc) => {
    const sc = new Reviews(doc.data());
    sc.docId = doc.id;
    userReviews.push(sc);
  });
  return userReviews;
}

//user get product by Id
export async function userGetProductById(docId) {
  const ref = await firebase
    .firestore()
    .collection(Constant.collectionNames.PRODUCTS)
    .doc(docId)
    .get();
  if (!ref.exists) {
    return null;
  }
  const prod = new Product(ref.data());
  prod.docId = docId;
  return prod;
}

export async function addReview(comment) {
  const review = await firebase
    .firestore()
    .collection(Constant.collectionNames.REVIEWS)
    .add(comment);
}

export async function deleteReviewById(docId) {
  await firebase
    .firestore()
    .collection(Constant.collectionNames.REVIEWS)
    .doc(docId)
    .delete();
}

//user get review by Id
export async function getReviewById(docId) {
  const ref = await firebase
    .firestore()
    .collection(Constant.collectionNames.REVIEWS)
    .doc(docId)
    .get();
  if (!ref.exists) {
    return null;
  }
  const review = new Reviews(ref.data());
  review.docId = docId;
  return review;
}

//Update Product
const cf_updateReview = firebase.functions().httpsCallable("cf_updateReview");
export async function updateReview(review) {
  const docId = review.docId;
  const data = review.serializeForUpdate();
  await cf_updateReview({ docId, data });
}

export async function reviewsList() {
  let reviews = [];
  const snapshot = await firebase
    .firestore()
    .collection(Constant.collectionNames.REVIEWS)
    .orderBy("timestamp", "desc")
    .get();
  snapshot.forEach((doc) => {
    const r = new Reviews(doc.data());
    r.docId = doc.id;
    reviews.push(r);
  });
  return reviews;
}

//admin delete function
const cf_adminDeleteFunction = firebase
  .functions()
  .httpsCallable("cf_adminDeleteFunction");
export async function adminDeleteFunction(reviewId) {
  await cf_adminDeleteFunction(reviewId);
}
