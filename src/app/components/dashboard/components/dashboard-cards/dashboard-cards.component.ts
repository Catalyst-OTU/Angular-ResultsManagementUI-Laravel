import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.scss']
})
export class DashboardCardsComponent implements OnInit {
  colors = ["#e81e62","#ef5350","#ba000d","#c62828","#ec407a",
  "#ab47bc","#7e57c2","#5c6bc0","#42a5f5","#29b6f6",
  "#26c6da","#26a69a","#66bb6a","#9ccc65","#d4e157",
  "#ffee58","#ffca28","#ffa726","#ff7043","#8d6e63","#bdbdbd","#78909c"]
  @Input()
  clickFunction:any;

  @Input()
  headerIcon: string;

  @Input()
  headerColor: string;

  @Input()
  color: string;

  @Input()
  adjustAmount: number = -40;

  @Input()
  showFooter = true;

  @Input()
  footerIcon: string = "fas fa-redo-alt";

  @Input()
  messages: { headerMessage: string; headerValue: string}[]


  @Input()
  headerValue: string;

  @Input()
  footerMessage: string;


  @Input()
  cardHeading: string;

  linearStyle:any;


  constructor() {

  }

  runClickFunction(){
    if(this.clickFunction){
      this.clickFunction();
    }
  }

  ngOnInit() {
    this.color = this.color? this.color :
    this.colors[Math.floor(Math.random() * this.colors.length )]

    this.linearStyle = {
     'background' : `linear-gradient(60deg, ${this.getHexColor(this.headerColor)} ,${this.adjustColor(this.headerColor, this.adjustAmount)})`,
     color: 'white',
     padding: '15px',
     'box-shadow': `0 4px 20px 0px ${this.adjustColor(this.headerColor, 180)}, 0 7px 10px -5px ${this.adjustColor(this.headerColor, 200)}`
   }

  }

  getHexColor = (colorStr: string) => {

    if ((colorStr.startsWith('#'))){
      return colorStr;
    }
 
     const a = document.createElement('div');
     a.style.color = colorStr;
     var colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
     document.body.removeChild(a);
     return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : null;
 }
 // getHexColor('teal')
 
 adjustColor = (color: string, amount: number) => {
     // if (!(color.startsWith('#'))){
       color = this.getHexColor(color) || '#0000FF';
     // }
     return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
 }
 

}
