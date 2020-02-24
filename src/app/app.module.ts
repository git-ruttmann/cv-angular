import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { LocalStorageModule } from 'angular-2-local-storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import { ContentHeaderComponent } from './content/content-header.component';
import { LoginComponent } from './base/login.component';
import { BaseFlightComponent } from './base/base-flight.component';
import { ReadonlyDirective } from './base/readonly.directive';
import { VitaEntryService } from './services/vita-entry.service';
import { AuthenticateService } from './services/authenticate.service';
import { BaseStateService } from './services/base-state.service';
import { BackgroundImageViewportService } from './services/background-image-viewport.service';
import { TrackingService } from './services/tracking.service';
import { WelcomeComponent } from './content/welcome.component';
import { VitaEntryComponent } from './content/vita-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    LoginComponent,
    BaseFlightComponent,
    ReadonlyDirective,
    ContentHeaderComponent,
    WelcomeComponent,
    VitaEntryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    LocalStorageModule.forRoot({
      storageType: 'localStorage',
    }),
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: "/"},
    VitaEntryService,
    AuthenticateService,
    BaseStateService,
    BackgroundImageViewportService,
    TrackingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(auth: VitaEntryService) {
  }
}
