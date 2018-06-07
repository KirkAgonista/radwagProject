import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {map} from 'rxjs/operators';


import {Subject} from 'rxjs';
import {Goods} from './goods.model';

@Injectable()
export class GoodsService {
  goodsChanged = new Subject<Goods[]>();
  private goods: Goods[];
  private filteredGoods: Goods[] = [];
  public tags = [
    { value: 'wkręty', checked: false },
    { value: 'wkręt do drewna', checked: false },
    { value: 'wkręt samowiercący', checked: false },
    { value: 'haki', checked: false },
    { value: 'hak oczkowy', checked: false },
    { value: 'hak podłogowy', checked: false },
    { value: 'kołki', checked: false },
    { value: 'kołek metalowy', checked: false },
    { value: 'kołek wbijany', checked: false },
  ];
  constructor(private http: Http) {}
  getGoods() {
    this.http.get('api/goods')
      .pipe(map(response => response.json()))
      .subscribe(goods => this.setGoods(goods));
    return this.goods;
  }
  setGoods(goods: Goods[]) {
    this.goods = goods;
    this.goodsChanged.next(this.goods.slice());
  }
  createGood(good) {
    return this.http.post('api/goods', good);
  }
  getGood(i: number) {
    return this.goods[i];
  }
  editGood(goodId, good) {
    return this.http.put('api/goods/' + goodId, good);
  }
  deleteGood(goodId) {
    return this.http.delete('api/goods/' + goodId);
  }
  filterGoods(tags: object) {
      this.filteredGoods = [];
      const checkedTags = this.checkedTags(tags);
      this.goods.forEach(good => {
        if (checkedTags.length > 0) {
          if (this.arrayContainsArray(good.tags, checkedTags)) {
            this.filteredGoods.push(good);
          }
        } else {
          // do not filter anything
          this.filteredGoods.push(good);
        }
      });
      // filter goods that component is subscribed to
      this.goodsChanged.next(this.filteredGoods);
  }
  arrayContainsArray (arr1, arr2) {
    // check if array with tags is not empty
    if (0 === arr2.length) {
      return false;
    }
    // return true if every tag in filter is in good tags
    return arr2.every(function (value) {
      return (arr1.indexOf(value) >= 0);
    });
  }
  checkedTags(obj) {
    const checkedTags = [];
    // add tags to array if their value is true
    Object.keys(obj).forEach(
      tag => { if (obj[tag]) {checkedTags.push(tag); }});
    return checkedTags;
  }
}
