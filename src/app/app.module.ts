import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import { LoginComponent } from './base/login.component';
import { BaseFlightComponent } from './base/base-flight.component';
import { ReadonlyDirective } from './base/readonly.directive';
import { VitaEntryService } from './services/vita-entry.service';
import { AuthenticateService } from './services/authenticate.service';
import { BaseStateService } from './services/base-state.service';

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
    BaseStateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(auth: VitaEntryService) {
  }
}
