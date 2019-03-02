import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkOrderPage } from './work-order.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

const routes: Routes = [
  {
    path: '',
    component: WorkOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ], 
  declarations: [WorkOrderPage], 
})
export class WorkOrderPageModule {
  myphoto:any;
  constructor(private camera: Camera) { }
  captureDataUrl: string;

  capture(){  
    const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64 (DATA_URL):
    this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    // Handle error
    });


  }
}




