import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-datepicker-select-nav',
  templateUrl: './datepicker-select-nav.component.html',
  styleUrls: ['./datepicker-select-nav.component.scss']
})
export class DatepickerSelectNavComponent implements OnInit, OnChanges{
  @Input() selectedMonth;
  @Input() selectedYear;
  @Input() yearList;
  @Input() monthList;
  @Output() monthSelectedEvent: EventEmitter<number> = new EventEmitter();
  @Output() yearSelectedEvent: EventEmitter<number> = new EventEmitter();
  @ViewChild('month', {static: true, read: ElementRef}) monthSelect: ElementRef;
  @ViewChild('year', {static: true, read: ElementRef}) yearSelect: ElementRef;
  constructor() {
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.selectedMonth)
  }

  onMonthSelect(event) {
    const monthNum = event.target.value;
    this.monthSelectedEvent.emit(+monthNum);
  }
  onYearSelect(event) {
    const yearNum = event.target.value;
    this.yearSelectedEvent.emit(+yearNum);
  }

}
