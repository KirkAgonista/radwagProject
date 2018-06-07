import {Component, OnDestroy, OnInit} from '@angular/core';
import { GoodsService } from './goods.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Subscription} from 'rxjs';
import {Goods} from './goods.model';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class GoodsComponent implements OnInit, OnDestroy  {
  bsModalRef: BsModalRef;
  public goods: Goods[];
  subscription: Subscription;
  goodsFilterForm: FormGroup;
  tags = this.goodsService.tags;
  constructor(
    public authService: AuthService,
    private goodsService: GoodsService,
    private modalService: BsModalService
  ) {}
  ngOnInit() {
    this.subscription = this.goodsService.goodsChanged
      .subscribe(
        (goods: Goods[]) => {
          this.goods = goods;
        }
      );
    this.goods = this.goodsService.getGoods();
    this.initForm();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  openModalGood(editMode: boolean, i: number) {
    if (!editMode && i === -1) {
      const initialState = {
        title: 'Utwórz nowy towar',
        edit: 'Utwórz',
        editMode,
        good: {}
      };
      this.bsModalRef = this.modalService.show(ModalContentComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Anuluj';
    } else {
      const initialState = {
        title: 'Edytuj',
        edit: 'Zmień',
        editMode,
        good: this.goodsService.getGood(i),
      };
      this.bsModalRef = this.modalService.show(ModalContentComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Anuluj';
    }
  }
  openModalGoodInfo(i: number) {
    const initialState = {
      good: this.goodsService.getGood(i)
    };
    this.bsModalRef = this.modalService.show(GoodInfoModalComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Zamknij';
  }
  private initForm() {
    this.goodsFilterForm = new FormGroup({
      'tags': new FormGroup(this.createTags())
    });
  }
  onFilter() {
    const checkedTags = [];
    Object.keys(this.goodsFilterForm.value.tags).forEach(
      tag => { if (this.goodsFilterForm.value.tags[tag]) {checkedTags.push(tag); }});
    const formValue = {};
    Object.keys(this.goodsFilterForm.value)
      .forEach(control => {if (control !== 'tags') { formValue[control] = this.goodsFilterForm.value[control]; }});
    formValue['tags'] = checkedTags;
    // console.log(this.goodsFilterForm.value.tags);
    this.goodsService.filterGoods(this.goodsFilterForm.value.tags);
  }
  onStopFilter() {
    this.goodsService.getGoods();
    Object.keys(this.goodsFilterForm.value.tags).forEach(tag => this.goodsFilterForm.get('tags').get(tag).setValue(false));
  }
  createTags() {
    const tagsForm = {};
    this.tags.forEach((tag) => tagsForm[tag.value] = new FormControl(tag.checked));
    return tagsForm;
  }
  onTagChange(event) {
    this.goodsFilterForm.get('tags').get(event.target.name).setValue(event.target.checked);
  }
  onGoodDelete(goodId) {
    this.goodsService.deleteGood(goodId)
      .subscribe();
    this.goodsService.getGoods();
  }
}
// Modal Component - Good Creation/Edit
@Component({
  selector: 'app-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}} {{good.name}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class=" m-0 p-0">
        <form class="m-0 p-2" (ngSubmit)="onSubmit()" [formGroup]="goodsForm">
          <div class="form-group">
            <label for="name">Nazwa:</label>
            <input id="name" class="form-control" type="text" name="name" formControlName="name"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="goodsForm.get('name').hasError('required') && goodsForm.get('name').touched">
            Brak nazwy towaru.
          </div>
          <div class="form-group">
            <label for="price">Cena za sztukę (zł):</label>
            <input id="price" class="form-control" type="number" name="price" formControlName="price"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="goodsForm.get('price').hasError('required') && goodsForm.get('price').touched">
            Brak ceny.
          </div>
          <div class="form-group">
            <label for="weightPrice">Cena za 100 gram (zł):</label>
            <input id="weightPrice" class="form-control" type="number" name="weightPrice" formControlName="weightPrice"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="goodsForm.get('weightPrice').hasError('required') && goodsForm.get('weightPrice').touched">
            Brak ceny za 100 gram.
          </div>
          <div class="form-group">
            <label for="quantity">Ilość:</label>
            <input id="quantity" class="form-control" type="number" name="quantity" formControlName="quantity"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="goodsForm.get('quantity').hasError('required') && goodsForm.get('quantity').touched">
            Brak ilości.
          </div>

          <div class="form-group">
            <label for="code">Kod produktu:</label>
            <input id="code" class="form-control" type="text" name="code" formControlName="code"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="goodsForm.get('code').hasError('required') && goodsForm.get('code').touched">
            Brak kodu.
          </div>
          <div class="form-group">
            <label for="weight">Waga (kg):</label>
            <input id="weight" class="form-control" type="number" name="weight" formControlName="weight"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="goodsForm.get('weight').hasError('required') && goodsForm.get('weight').touched">
            Brak wagi.
          </div>
          <div class="form-group">
            <label for="description">Opis:</label>
            <textarea id="description" class="form-control" name="description" formControlName="description"></textarea>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="goodsForm.get('description').hasError('required') && goodsForm.get('description').touched">
            Brak opisu.
          </div>
          <div class="form-group">
            <label for="image">Zdjęcie:</label>
            <input id="image" class="form-control" type="text" name="image" formControlName="image"/>
          </div>
          <div class="form-group">
            <label for="tags">Etykiety:</label>
            <div id="tags" class="row justify-content-between" formGroupName="tags">
              <div class="col-md-6" *ngFor="let tag of tags">
                <input [id]="tag.value" type="checkbox" [name]="tag.value"
                       [formControlName]="tag.value" [value]="tag.value"
                       (change)="onTagChange($event)"
                />{{tag.value}}
              </div>
            </div>
          </div>
          <div class="row modal-footer">
            <div class="col-sm-3">
              <button class="btn btn-primary"
                      type="submit"
                      [disabled]="goodsForm.invalid && !this.authService.isAuthenticated()"
              >{{edit}}</button>
            </div>
            <div class="col-sm-3">
              <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
 `
})
// Class - Good Creation Edit Modal Component
export class ModalContentComponent implements OnInit {
  title: string;
  edit: string;
  closeBtnName: string;
  goodsForm: FormGroup;
  good: Goods;
  editMode = false;
  tags = this.goodsService.tags;
  constructor(
    public bsModalRef: BsModalRef,
    public authService: AuthService,
    public router: Router,
    public goodsService: GoodsService
  ) {}
  ngOnInit() {
    this.initForm();
  }
  onSubmit() {
    const checkedTags = [];
    Object.keys(this.goodsForm.value.tags).forEach(
      tag => { if (this.goodsForm.value.tags[tag]) {checkedTags.push(tag); }});
    const formValue = {};
    Object.keys(this.goodsForm.value).forEach(control => {if (control !== 'tags') { formValue[control] = this.goodsForm.value[control]; }});
    formValue['tags'] = checkedTags;
    if (this.editMode) {
      this.goodsService.editGood(this.good._id, formValue)
        .subscribe();
    } else {
      this.goodsService.createGood(formValue)
        .subscribe();
    }
    this.bsModalRef.hide();
    setTimeout(() => this.goodsService.getGoods(), 300);
  }
  createTags() {
    const tagsForm = {};
    if (this.editMode) {
      this.tags.forEach(tag => (this.good.tags.includes(tag.value) ? tag.checked = true : tag.checked = false ));
      this.tags.forEach((tag) => tagsForm[tag.value] = new FormControl(tag.checked));
    } else {
      this.tags.forEach((tag) => tagsForm[tag.value] = new FormControl(false));
    }
    return tagsForm;
  }
  onTagChange(event) {
    this.goodsForm.get('tags').get(event.target.name).setValue(event.target.checked);
  }
  private initForm() {
    const name = this.good.name;
    const price = this.good.price;
    const weightPrice = this.good.weightPrice;
    const quantity = this.good.quantity;
    const code = this.good.code;
    const weight = this.good.weight;
    const description = this.good.description;
    const image = this.good.image;
    this.goodsForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'price': new FormControl(price, Validators.required),
      'weightPrice': new FormControl(weightPrice, Validators.required),
      'quantity': new FormControl(quantity, Validators.required),
      'code': new FormControl(code, Validators.required),
      'weight': new FormControl(weight, Validators.required),
      'description': new FormControl(description, Validators.required),
      'image': new FormControl(image),
      'tags': new FormGroup(this.createTags())
    });
  }
}
// Modal Component - User Info
@Component({
  selector: 'app-good-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{good.name}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <img class="img-fluid" [src]="good.image" [alt]="good.name">
          <ul style="list-style: none;">
            <li>Kod produktu: {{good.code}}</li>
            <li>Cena za sztukę: {{good.price}}zł</li>
            <li>Cena za 100 gram: {{good.weightPrice}}zł</li>
            <li>Ilość: {{good.quantity}}</li>
            <li>Waga: {{good.weight}}</li>
            <li>Opis: {{good.description}}</li>
          </ul>
        </div>
        <div class="ml-3 mb-3 mr-1">Etykiety:</div>
        <div class="row mb-3 mx-3 justify-content-around">
          <div class="col-sm-4" *ngFor="let tag of good.tags">
            <span class="badge badge-secondary">{{tag}}</span>
          </div>
        </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
    </div>
  `
})
// Class - User Info Modal Component
export class GoodInfoModalComponent implements OnInit {
  closeBtnName: string;
  good: Goods;
  constructor(
    public bsModalRef: BsModalRef
  ) {}
  ngOnInit() {
  }
}
