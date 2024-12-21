import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DietService } from '../../../services/diet.service';
import { CalculateDietResponse } from '../../../models/calculate-diet.interface';

export const macrosResolver: ResolveFn<CalculateDietResponse> = (route, state) => {
  return inject(DietService).calculateDiet(route.queryParams);
};
