export interface IFinancialReportBudget  {
    category:string;
    amountSpent:number;
}

export interface IFinancialReportSavingsGoal  {
    title:string;
    progress: string;
}

export interface IFinancialReport {
    totalIncome: number;
    totalExpenses:number;
    budgets:IFinancialReportBudget[];
    savingsGoals: IFinancialReportSavingsGoal[];
}