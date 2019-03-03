import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../data-transfer.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) { }

  ngOnInit() {
  addresseList = [];
  constructor(private router: Router, private data: DataTransferService){
    this.data.storage = [];
  }

  workorder_go(){
    this.router.navigate(['work-order']);
  }

  toggleEditable(event) {
    if ( event.target.checked ) {
        var elem = document.querySelector('ion-card-content');
        var closestParent = elem.closest('.address');
        this.data.storage.push(closestParent.textContent);
        //add
   }
   else{
    var elem = document.querySelector('ion-card-content');
    var closestParent = elem.closest('.address');
    //this.data.storage.push(closestParent.textContent);
      this.data.storage.splice( this.data.storage.indexOf(closestParent.textContent), 1 );
      //delete
   }

   console.log(this.data.storage);
  }

  work(){

  }

}
