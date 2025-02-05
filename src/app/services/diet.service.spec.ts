import { TestBed } from '@angular/core/testing';
import { DietService } from './diet.service';


describe('DietService', () => {
  let dietService: DietService;
  let dietServiceSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    dietService = TestBed.inject(DietService);
    dietServiceSpy = spyOn(dietService, 'getFoodList');
  });

  it('should be created', () => {
    expect(dietServiceSpy).toBeTruthy();
  });
});