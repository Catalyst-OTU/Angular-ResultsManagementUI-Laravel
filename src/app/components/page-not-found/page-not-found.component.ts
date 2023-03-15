import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  ngOnInit(): void {
    throw Error("The Page you requested doesn't exist!");
  }
  

}
