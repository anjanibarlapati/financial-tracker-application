export interface ITransaction  {
    id:number;
    type: 'debit' | 'credit';
    amount: number;
    category: string; 
    date:Date
}