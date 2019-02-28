import { TestBed, async, inject } from '@angular/core/testing';

import { RedirGuard } from './redir.guard';

describe('RedirGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirGuard]
    });
  });

  it('should ...', inject([RedirGuard], (guard: RedirGuard) => {
    expect(guard).toBeTruthy();
  }));
});
