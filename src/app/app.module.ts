import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content.component';
import { LoginComponent } from './login.component';
import { BaseFlightComponent } from './base-flight.component';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { ReadonlyDirective } from './readonly.directive';
import { VitaEntryService } from './vita-entry.service';
import { AuthenticateService } from './authenticate.service';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoginComponent,
    BaseFlightComponent,
    ReadonlyDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: "/"},
    VitaEntryService,
    AuthenticateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(auth: VitaEntryService) {
  }
}
