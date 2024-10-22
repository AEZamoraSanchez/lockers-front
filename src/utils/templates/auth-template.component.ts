import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-template',
  standalone: true,
  imports: [],
  template: `
  <section class="bg-[url('https://img.asmedia.epimg.net/resizer/f4HDtSPjEasJj8B_cXPKpra1CC4=/360x203/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/HCIDPA5EIZBOZMVBB6UA4JNWDU.jpg')] bg-contain w-full h-[100%]  lg:bg-right-top login-content">

  <section class="absolute bottom-0 left-0 w-full bg-blue-700 h-[75%] rounded-t-[25px] px-[20px] py-[30px] gap-[1.9vh] sm:px-[35px] lg:h-[100%] lg:w-[40%] lg:rounded-t-[0] lg:min-w-[512px]">
    <ng-content></ng-content>
  </section>

</section>`,
})
export class AuthTemplateComponent {

}
