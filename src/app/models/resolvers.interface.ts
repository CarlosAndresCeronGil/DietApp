import { CalculateDietResponse } from "./calculate-diet.interface";
import { FoodResponse } from "./food-data.interface";

export interface ResolverMacrosAndFoodListResponse {
    macros: CalculateDietResponse;
    foodList: FoodResponse;
}