export class Product {
  constructor(data) {
    this.name = data.name.toLowerCase().trim();
    this.price =
      typeof data.price == "number" ? data.price : Number(data.price);
    this.summary = data.summary;
    this.imageName = data.imageName;
    this.imageURL = data.imageURL;
    this.qty = Number.isInteger(data.qty) ? data.qty : null;
  }

  serialize() {
    return {
      name: this.name,
      price: this.price,
      summary: this.summary,
      imageName: this.imageName,
      imageURL: this.imageURL,
      qty: this.qty,
    };
  }
  serializeForUpdate() {
    const p = {};
    if (this.name) p.name = this.name;
    if (this.price) p.price = this.price;
    if (this.summary) p.summary = this.summary;
    if (this.imageName) p.imageName = this.imageName;
    if (this.imageURL) p.imageURL = this.imageURL;
    return p;
  }
  static isSerializedProduct(p) {
    if (!p.name) return false;
    if (!p.price || typeof p.price != "number") return false;
    if (!p.summary) return false;
    if (!p.imageName) return false;
    if (!p.imageURL || !p.imageURL.includes("https")) return false;
    if (!p.qty || !Number.isInteger(p.qty)) return false;

    return true;
  }

  validate(image) {
    const errors = {};
    if (!this.name || this.name.length < 2) {
      errors.name = "Product name should be min 2 chars";
    }
    if (!this.price || !Number(this.price)) {
      errors.price = "Price is invalid";
    }
    if (!this.summary || this.summary.length < 2) {
      errors.summary = "Summary too short. Min 5 chars";
    }
    if (!image) {
      errors.image = "image not selected";
    }
    if (Object.keys(errors).length == 0) return null;
    else return errors;
  }
}
