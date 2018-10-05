import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  http: any;

  constructor() { }
  my_data: any;
  public getResponseData() : Promise<any> {
      if(typeof(this.my_data) === "undefined") {
            return this.http.get('data.json')
            .toPromise().then(res => {

                                  this.my_data = res.json().response;
                                  return this.my_data;
                }).catch(this.handleError);
      } else {
          return Promise.resolve(this.my_data);
      }


  }
  handleError(handleError: any): any {
    throw new Error("Method not implemented.");
  }
}
