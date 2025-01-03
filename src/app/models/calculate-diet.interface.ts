
export interface ResolverMacrosResponse {
    macros: CalculateDietResponse;
}

export interface CalculateDietResponse {
    status: string;
    message: string;
    data: Data;
    code: number;
}

export interface Data {
    macros: Macros;
    weight_change: WeightChange;
}

export interface Macros {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface WeightChange {
    monthly_change_kg: number;
    weekly_change_kg: number;
}