import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DietService } from '../../../services/diet.service';
import { FoodResponse } from '../../../models/food-data.interface';

export const foodListResolver: ResolveFn<FoodResponse> = (route, state) => {
  return inject(DietService).getFoodList();
};
