import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ZfTermsComponent } from './components/zf-terms/zf-terms.component';

@NgModule({
  declarations: [
    AppComponent,
    ZfTermsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
