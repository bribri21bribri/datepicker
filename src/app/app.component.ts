import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  dataForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) {

  }
  ngOnInit() {
    this.dataForm = this.fb.group({
      date: ['2019-04-04'],
      address: this.fb.group({
        zip: [{
          value: '',
          disabled: true
        }],
        county: [],
        district: [],
        villageName: [],
        village: [],
        neighbor: []
      })
    });

    this.dataForm.get('date')
    .valueChanges
    .subscribe(value => {
      console.log(value);
    });
  }
}
