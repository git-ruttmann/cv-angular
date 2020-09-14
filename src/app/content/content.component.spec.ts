import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LocalStorageModule } from 'angular-2-local-storage';
import { ContentComponent } from './content.component';
import { ContentHeaderComponent } from './content-header.component';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ContentHeaderComponent, 
        ContentComponent 
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        LocalStorageModule.forRoot({
          storageType: 'localStorage',
        }),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
