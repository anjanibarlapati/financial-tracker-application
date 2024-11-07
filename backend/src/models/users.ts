import mongoose from 'mongoose';

const transactionsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    }
},
    { "_id": false }
)

const incomeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    }
},
    { "_id": false }
)

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    amountSpent: {
        type: Number,
        required: true
    }
},
    { "_id": false }
)

const savingsGoalsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmountSaved: {
        type: Number,
        required: true
    }
},
    { "_id": false }
)

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    transactions: [{
        type: transactionsSchema,
        required:false
    }],
    income: [{
        type: incomeSchema,
        required:false
    }],
    availableBalance: {
        type: Number,
        required: true,
    },
    totalIncome: {
        type: Number,
        required: true
    },
    budgets: [{
        type: budgetSchema,
        required:false
    }],
    totalBudget: {
        type: Number,
        required: true
    },
    savingsGoals: [{
        type: savingsGoalsSchema,
        required:false
    }],

},
);

export const User = mongoose.model('User', usersSchema);
