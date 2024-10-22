export interface IFinancialReportBudget  {
    category:string;
    amount:number;
    amountSpent:number;
}

export interface IFinancialReportSavingsGoal  {
    title:string;
    progress: string;
}

export interface IFinancialReport {
    totalIncome: number;
    totalExpenses:number;
}