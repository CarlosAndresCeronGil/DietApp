
export interface ResolverMacrosResponse {
    macros: CalculateDietResponse;
}

export interface CalculateDietResponse {
    status: string;
    message: string;
    data: DataMacros;
    code: number;
}

export interface DataMacros {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}