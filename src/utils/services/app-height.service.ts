import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppHeightService {
  private renderer: Renderer2;
  private appRootElement ? : HTMLElement;
  private appHeight ? : number;
  private appHeightSubject = new Subject<number>();


  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setAppRootElement(appRootElement: HTMLElement) {
    this.appRootElement = appRootElement;
    this.updateAppHeight();
  }

  getAppHeight(): Observable<number> {
    return this.appHeightSubject.asObservable();
  }

  updateAppHeight() {
    this.appHeight = this.appRootElement?.offsetHeight;
    this.appHeight && this.appHeightSubject.next(this.appHeight);
  }
}

