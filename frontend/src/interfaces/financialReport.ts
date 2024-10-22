export interface IFinancialReportBudget  {
    category:string;
    amount:number;
    amountSpent:number;
}

export interface IFinancialReportSavingsGoal  {
    title:string;
    targetAmount:number;
    currentAmountSaved:number;
    progress: string;
}

export interface IFinancialReport {
    totalIncome: number;
    totalExpenses:number;
}