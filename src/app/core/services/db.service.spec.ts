import { TestBed } from '@angular/core/testing';

import { DBService } from './db.service';

describe('DbService', () => {
  let service: DBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
