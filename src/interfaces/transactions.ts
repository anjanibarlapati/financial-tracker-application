export interface ITransaction  {
    id:number;
    userId:number;
    type: 'debit' | 'credit';
    amount: number;
    category: string; 
    date:Date
}