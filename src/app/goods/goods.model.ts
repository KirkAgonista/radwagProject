export class Goods {
  public name: string;
  public price: number;
  public weightPrice: number;
  public quantity: number;
  public code: string;
  public weight: number;
  public description: string;
  public image: string;
  public _id: string;
  public tags: string[];

  constructor(
    name: string,
    price: number,
    weightPrice: number,
    quantity: number,
    code: string,
    weight: number,
    description: string,
    image: string,
    _id: string,
    tags: string[]) {
    this.name = name;
    this.price = price;
    this.weightPrice = weightPrice;
    this.quantity = quantity;
    this.code = code;
    this.weight = weight;
    this.description = description;
    this.image = image;
    this._id = _id;
    this.tags = tags;
  }
}
