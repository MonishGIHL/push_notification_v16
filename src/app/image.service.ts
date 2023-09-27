import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { mapTo, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  base64ToImage(base64String: string): Observable<HTMLImageElement> {
    const img = new Image();
    img.src = base64String;

 

    return fromEvent(img, 'load').pipe(
      mapTo(img),
      take(1)
    );
  }
}