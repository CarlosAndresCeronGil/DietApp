import { FoodItem } from "./food-data.interface";

export interface GoalsInfo {
    goal: string;
    weight: string;
    activity_level: string;
    age: string;
}

export interface ToPdf extends GoalsInfo {
    foods: FoodItem[];
}