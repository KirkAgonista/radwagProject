export class Contractors {
  public name: string;
  public address: string;
  public nip: string;
  public town: string;
  public zipCode: string;
  public phoneNumber: string;
  public _id: string;

  constructor(
    name: string,
    address: string,
    nip: string,
    town: string,
    zipCode: string,
    phoneNumber: string,
    _id: string) {
    this.name = name;
    this.address = address;
    this.nip = nip;
    this.town = town;
    this.zipCode = zipCode;
    this.phoneNumber = phoneNumber;
    this._id = _id;
  }
}
