import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css'],
})
export class ImageCropperComponent implements OnInit {
  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  @Output() setImageEvent = new EventEmitter<string>();
  @Input() file: string = '';
  showImageCropper:boolean = false;
  showLoader:boolean = false;

  constructor(
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    
  }

  onFileChange(event: any): void {
    let files = event.target.files[0];
    console.log(files.size);
    if (files.size > 1000000) {//1000141 for 1mb
      this.snackBar.open("Image size must within 1mb", '',{
        duration: 3000,
        panelClass: ['red-snackbar']
      });
      return;
    }

    this.imgChangeEvt = event;
    this.showImageCropper = true;
    this.showLoader = true;
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64;
    // this.file = e.base64;
    this.showLoader = false;
  }
  imgLoad() {
      // display cropper tool
  }
  initCropper() {
      // init cropper
  }

  imgFailed() {
      // error msg
  }

  closePopup() {
    this.showImageCropper = false;
    this.setImageEvent.emit(this.file);
  }
}