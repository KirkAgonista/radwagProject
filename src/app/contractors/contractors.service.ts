import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {map} from 'rxjs/operators';

import {Subject} from 'rxjs';
import {Contractors} from './contractors.model';

@Injectable()
export class ContractorsService {
  contractorsChanged = new Subject<Contractors[]>();
  private contractors: Contractors[];
  constructor(private http: Http) {}
  getContractors() {
    this.http.get('api/contractors')
      .pipe(map(response => response.json()))
      .subscribe(contractors => this.setContractors(contractors));
    return this.contractors;
  }
  setContractors(contractors: Contractors[]) {
    this.contractors = contractors;
    this.contractorsChanged.next(this.contractors.slice());
  }
  createContractor(contractor) {
    return this.http.post('api/contractors', contractor);
  }
  getContractor(i: number) {
    return this.contractors[i];
  }
  editContractor(contractorId, contractor) {
    return this.http.put('api/contractors/' + contractorId, contractor);
  }
  deleteContractor(contractorId) {
    return this.http.delete('api/contractors/' + contractorId);
  }

}
