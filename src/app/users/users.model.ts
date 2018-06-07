export class Users {
  public username: string;
  public firstName: string;
  public lastName: string;
  public position: string;
  public email: string;
  public isAdmin: boolean;
  public _id: string;


  constructor(
    username: string,
    firstName: string,
    lastName: string,
    position: string,
    email: string,
    isAdmin: boolean,
    _id: string) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
    this.email = email;
    this.isAdmin = isAdmin;
    this._id = _id;
  }
}
