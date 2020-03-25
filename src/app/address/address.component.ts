import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { zipcodeData } from '../mock/twzipcode';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  @Input() parentform: FormGroup;
  zipcodeFull: { [key: string]: any };
  districtList: any;
  constructor() { }

  ngOnInit(): void {
    this.zipcodeFull = zipcodeData;
    this.watchValueChange();
  }

  watchValueChange() {
    this.parentform.controls.county.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        this.districtList = this.zipcodeFull[result];
        this.parentform.controls.district.setValue('');
      });

    this.parentform.controls.district.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        if(result) {
          this.parentform.controls.zip.setValue(this.districtList[result]);
        } else{
          this.parentform.controls.zip.setValue(null);
        }
      });

    this.parentform.controls.zip.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        if (!this.parentform.controls.district.value) {
          this.setZip(result, false);
        }
      });
  }

  public setZip(zipCode: string, setZip: boolean) {
    if (zipCode) {
      for (const county in this.zipcodeFull) {
        if (this.zipcodeFull.hasOwnProperty(county)) {
          const element = this.zipcodeFull[county];
          for (const district in element) {
            if (element.hasOwnProperty(district)) {
              const element2 = element[district];
              if (element2 === zipCode) {
                this.districtList = this.zipcodeFull[county];
                this.parentform.controls.county.setValue(county);
                this.parentform.controls.district.setValue(district);
                if (setZip) {
                  this.parentform.controls.zip.setValue(zipCode);
                }
                break;
              }
            }
          }
        }
      }
    }
  }

  descOrder(a, b) {
    if (a.key < b.key) {
      return b.key;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
