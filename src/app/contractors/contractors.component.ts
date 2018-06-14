import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap';
import {Contractors} from './contractors.model';
import {ContractorsService} from './contractors.service';


@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.css']
})
export class ContractorsComponent implements OnInit, OnDestroy {
  public contractors: Contractors[];
  subscription: Subscription;
  private bsModalRef: any;
  constructor(
    public authService: AuthService,
    public contractorsService: ContractorsService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.subscription = this.contractorsService.contractorsChanged
      .subscribe(
        (contractors: Contractors[]) => {
          this.contractors = contractors;
        }
      );
    this.contractors = this.contractorsService.getContractors();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  openModalContractors(editMode: boolean, i: number) {
    if (!editMode && i === -1) {
      const initialState = {
        title: 'Utwórz nowego kontrahenta',
        edit: 'Utwórz',
        editMode,
        contractor: {}
      };
      this.bsModalRef = this.modalService.show(ContractorModalContentComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Anuluj';
    } else {
      const initialState = {
        title: 'Edytuj',
        edit: 'Zmień',
        editMode,
        contractor: this.contractorsService.getContractor(i),
      };
      this.bsModalRef = this.modalService.show(ContractorModalContentComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Anuluj';
    }
  }
  openModalDeleteConfirmation(contractor: Contractors) {
    const initialState = {contractor};
    this.bsModalRef = this.modalService.show(ContractorDeleteConfirmationModalContentComponent, {initialState});
  }
}
// Modal Component - Contractor Creation/Edit
@Component({
  selector: 'app-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}} {{contractor.name}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class=" m-0 p-0">
        <form class="m-0 p-3" (ngSubmit)="onSubmit()" [formGroup]="contractorsForm">
          <div class="form-group">
            <label for="name">Nazwa Kontrahenta:</label>
            <input class="form-control" type="text" name="name" formControlName="name"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('name').hasError('required') && contractorsForm.get('name').touched">
            Brak nazwy.
          </div>
          <div class="form-group">
            <label for="address">Adres:</label>
            <input class="form-control" type="text" name="address" formControlName="address"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('address').hasError('required') && contractorsForm.get('address').touched">
            Brak adresu.
          </div>
          <div class="form-group">
            <label for="nip">NIP:</label>
            <input class="form-control" type="text" name="nip" formControlName="nip" pattern="[0-9]{3}\\-[0-9]{3}\\-[0-9]{2}\\-[0-9]{2}"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('nip').hasError('pattern') && contractorsForm.get('nip').touched">
            NIP musi być podany według następującego wzorca (999-999-99-99).
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('nip').hasError('required') && contractorsForm.get('nip').touched">
            Brak NIP.
          </div>
          <div class="form-group">
            <label for="town">Miasto:</label>
            <input class="form-control" type="text" name="town" formControlName="town"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('town').hasError('required') && contractorsForm.get('town').touched">
            Brak miasta.
          </div>
          <div class="form-group">
            <label for="zipCode">Kod Pocztowy:</label>
            <input class="form-control" type="text" name="zipCode" formControlName="zipCode" pattern="[0-9]{2}\\-[0-9]{3}"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('zipCode').hasError('pattern') && contractorsForm.get('zipCode').touched">
            Kod pocztowy musi być podany według następującego wzorca (99-999).
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('zipCode').hasError('required') && contractorsForm.get('zipCode').touched">
            Brak kodu pocztowego.
          </div>
          <div class="form-group">
            <label for="phoneNumber">Numer telefonu:</label>
            <input class="form-control" type="text" name="phoneNumber" formControlName="phoneNumber" minlength="9"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('phoneNumber').hasError('minlength') && contractorsForm.get('phoneNumber').touched">
            Numer telefonu musi mieć minimum 9 cyfr.
          </div>
          <div
            class="alert alert-danger"
            *ngIf="contractorsForm.get('phoneNumber').hasError('required') && contractorsForm.get('phoneNumber').touched">
            Brak numeru telefonu.
          </div>
          <div class="row">
            <div class="col-sm-3">
              <button class="btn btn-primary" type="submit" [disabled]="contractorsForm.invalid">{{edit}}</button>
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
// Class - Contractor Creation Edit Modal Component
export class ContractorModalContentComponent implements OnInit {
  title: string;
  edit: string;
  closeBtnName: string;
  contractorsForm: FormGroup;
  contractor: Contractors;
  editMode = false;

  constructor(
    public bsModalRef: BsModalRef,
    public authService: AuthService,
    public router: Router,
    public contractorsService: ContractorsService
  ) {}

  ngOnInit() {
    this.initForm();
  }
  onSubmit() {
    if (this.editMode) {
      this.contractorsService.editContractor(this.contractor._id, this.contractorsForm.value)
        .subscribe(data => this.contractorsService.getContractors());
    } else {
      this.contractorsService.createContractor(this.contractorsForm.value)
        .subscribe(data => this.contractorsService.getContractors());
    }
    this.bsModalRef.hide();
  }
  private initForm() {
    const name = this.contractor.name;
    const address = this.contractor.address;
    const nip = this.contractor.nip;
    const town = this.contractor.town;
    const zipCode = this.contractor.zipCode;
    const phoneNumber = this.contractor.phoneNumber;
    this.contractorsForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'address': new FormControl(address, Validators.required),
      'nip': new FormControl(nip, Validators.required),
      'town': new FormControl(town, Validators.required),
      'zipCode': new FormControl(zipCode, Validators.required),
      'phoneNumber': new FormControl(phoneNumber, Validators.required)
    });
  }
}
// Modal Component - Contractor Delete Confirmation
@Component({
  selector: 'app-modal-confirmation-content',
  template: `<div class="modal-header">
    <h4 class="modal-title pull-left">Potwierdzenie</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>
    <div class="modal-body">
      Czy napewno chcesz usunąć {{contractor.name}}?
      </div>
      <div class="modal-footer">
      <button type="button"
    class="btn btn-danger"
    (click)="onContractorDelete(contractor._id)"
      >Usuń</button>
      <button class="btn btn-secondary" type="button" (click)="bsModalRef.hide()">
      Anuluj
      </button>
      </div>`
})
// Class - Contractor Delete Confirmation Modal Component
export class ContractorDeleteConfirmationModalContentComponent implements OnInit {
  contractor: Contractors;

  constructor(
    public bsModalRef: BsModalRef,
    public contractorsService: ContractorsService
  ) {}

  ngOnInit() {

  }
  async onContractorDelete(contractorId) {
    await this.contractorsService.deleteContractor(contractorId)
      .subscribe(data => this.contractorsService.getContractors());
    this.bsModalRef.hide();
  }
}
