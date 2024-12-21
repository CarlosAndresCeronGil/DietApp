export interface ResolverFoodListResponse {
  foodList: FoodResponse;
}

export interface FoodResponse {
  status: string;
  message: string;
  data: FoodData;
  code: number;
}

export interface FoodData {
  items: FoodItem[];
  pagination: Pagination;
}

export interface FoodItem {
  id: number;
  name: string;
  protein: string;
  carbs: string;
  fat: string;
  kcal: string;
  quantity: string;
  unit: string;
  type: string;
  image_url: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}




