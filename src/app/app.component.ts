// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'fg';
// }
// 'use strict';
// import * as fs from "fs"

// let student = {  
//     name: 'Mike',
//     age: 23, 
//     gender: 'Male',
//     department: 'English',
//     car: 'Honda' 
// };

// let data = JSON.stringify(student);  
// fs.writeFileSync('./src/app/data.json', data);
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,OnInit} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from './service.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#008000',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
  
})
export class AppComponent {
  
  constructor (private httpService: HttpClient) { }

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date(Date.parse("2018-10-04T02:15:12.356Z"));

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  event2:CalendarEvent[];
  events: CalendarEvent[]=[
    
  ];
  st:any;
  parsedJSON: any;
  d:any;
  ngOnInit():any 
    {
      this.httpService.get('./src/app/data.json').subscribe(
        data=>{
          this.events=data as CalendarEvent[];
          console.log(this.events)
          this.st=JSON.stringify(this.events);
          this.parsedJSON = JSON.parse(this.st);
         for (var i=0;i<this.parsedJSON.length;i++) {
              this.parsedJSON[i].start=new Date(Date.parse(this.parsedJSON[i].start));
              this.parsedJSON[i].end=new Date(Date.parse(this.parsedJSON[i].end));
              this.parsedJSON[i].actions=this.actions;
            
              this.d=this.parsedJSON[i].title;
              if(this.parsedJSON[i].color=="red")
                this.parsedJSON[i].color=colors.red;
              if(this.parsedJSON[i].color=="yellow")
                this.parsedJSON[i].color=colors.yellow;
              if(this.parsedJSON[i].color=="green")
                this.parsedJSON[i].color=colors.green;
           }
           this.events=this.parsedJSON as CalendarEvent[];
           return (this.events);
        }
        
      )
      console.log(this.events);
      
  }
  
  //getresult():CalendarEvent[]{
    // this.httpService.get('./src/app/data.json').subscribe(
    //   data=>{
    //     this.events=data as CalendarEvent[];
    //     console.log(this.events)
    //     this.st=JSON.stringify(this.events);
    //     this.parsedJSON = JSON.parse(this.st);
    //    for (var i=0;i<this.parsedJSON.length;i++) {
    //         this.parsedJSON[i].start=new Date(Date.parse(this.parsedJSON[i].start));
    //         this.parsedJSON[i].end=new Date(Date.parse(this.parsedJSON[i].end));
    //         if(this.parsedJSON[i].color=="red")
    //           this.parsedJSON[i].color=colors.red;
    //         if(this.parsedJSON[i].color=="yellow")
    //           this.parsedJSON[i].color=colors.yellow;
    //      }
    //      this.events=this.parsedJSON as CalendarEvent[];
    //   }
      
    // )
    // console.log(this.events);
    // return this.events;
    
  //}
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();


  //events:this.arrBirds;
    evens: CalendarEvent[] = this.events;
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: new Date(),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   }]
  



  activeDayIsOpen: boolean = true;


  dayClicked2(){
    console.log(this.events);
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(this.events);
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        this.events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    console.log(this.events);
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}