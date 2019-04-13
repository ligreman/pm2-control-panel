import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProcessDialogComponent } from './new-process-dialog.component';

describe('NewProcessDialogComponent', () => {
  let component: NewProcessDialogComponent;
  let fixture: ComponentFixture<NewProcessDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProcessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
