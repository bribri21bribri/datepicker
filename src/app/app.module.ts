import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { AppComponent } from './app.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { AddressComponent } from './address/address.component';
import { DatepickerSelectNavComponent } from './datepicker/datepicker-select-nav/datepicker-select-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    DatepickerComponent,
    AddressComponent,
    DatepickerSelectNavComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
