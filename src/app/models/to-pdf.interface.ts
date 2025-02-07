import { FoodItem } from "./food-data.interface";

export interface GoalsInfo {
    goal: string;
    weight: string;
    activity_level: string;
    age: string;
}

export interface ToPdf extends GoalsInfo {
    foods: FoodItem[];
    goal_calories: number;
    monthly_change_kg: number;
    weekly_change_kg: number;
}

export interface ToPdfResponse {
    status: string;
    message: string;
    data: {
        url: string;
    }
}