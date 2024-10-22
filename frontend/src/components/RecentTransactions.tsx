import { useContext, useEffect, useState } from 'react';
import '../styles/RecentTransactions.css';
import { UserContext } from '../contexts/user';
import { ITransaction } from '../interfaces/transactions';

export function RecentTransactions(): JSX.Element {

    const { currentUser } = useContext(UserContext);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    useEffect(() => {
        setTransactions(currentUser.transactions.slice(-5).reverse());
    }, [currentUser]);

    return (
        <div className="recent-transactions-container">
            <div className="recent-transactions-header">
                <img src={'/assets/recent-transactions.png'} alt="recent-transactions" className="recent-transactions-icon"></img>
                <h3 className="recent-transactions-title">Recent Transactions</h3>
            </div>
            <div className="recent-transactions-body">
                {transactions.length === 0 ? (<p className='no-transactions'>No recent transactions</p>) : (
                    <>
                        <div className='transaction-body'>
                            <p className='transaction-titles'>Transaction Type</p>
                            <p className='transaction-titles'>Transaction Category</p>
                            <p className='transaction-titles' >Transaction Amount</p>
                        </div>
                        {transactions.map((transaction, index) => {
                            return (
                                <div key={index} className='transaction-body' data-testid="transactions">
                                    <p className='transaction-type'>{transaction.type}</p>
                                    <p>{transaction.category}</p>
                                    <p className={transaction.type === 'debit' ? 'debit-amount' : 'credit-amount'}>{transaction.amount}</p>
                                </div>
                            )
                        }
                        )}
                    </>
                )}
            </div>
        </div>
    )
}