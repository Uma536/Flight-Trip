import {
  Component, OnInit, ViewChild, ElementRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trip-status',
  templateUrl: './trip-status.component.html',
  styleUrls: ['./trip-status.component.scss']
})
export class TripStatusComponent implements OnInit {
  @ViewChild('tripdetails', { static: false }) tripdetails: ElementRef;
  @ViewChild('tripstatus', { static: false }) tripstatus: ElementRef;

  colors = ['#7B68EE', '#1E90FF', '#F4A460', '#C0C0C0', '#C0C0C0', '#7B68EE'];
 pathlevels = [];
 tripdata: any = [];

  constructor(private httpClient: HttpClient) { }
  ngOnInit() {
    this.httpClient.get('assets/tripdetails.json').subscribe(data => {
      this.tripdata = data;
    }),
    setTimeout(() => {
      this.pathlevels = this.getpath();
    });
  }

  getpath() {
    const rect = this.tripdetails.nativeElement.getBoundingClientRect();
    let width = this.tripstatus.nativeElement.getBoundingClientRect().width;
    const space = (rect.width - width * this.tripdata.length) / (this.tripdata.length);
    width = width + space;
    const pathlevels = [];

    this.tripdata.forEach((trip, i) => {
      if (i) {
        const destination = this.tripdata[i - 1].level * 50 + 1;
        const source = i * width - space;
        const toY = trip.level * 50 + 1;
        const toX = i * width;

        if (trip.level === this.tripdata[i - 1].level) {
          pathlevels.push(
            'M' + source + ',' + destination + ' L' + (toX) + ',' + toY
          );
        } else {
          const middle = (source + toX) / 2;
          pathlevels.push(
            'M' + source + ',' + destination + ' C' + middle + ',' + destination + ' ' + middle + ',' + toY + ' ' + toX + ',' + toY
          );
        }
      }
    });
    return pathlevels;
  }
}
