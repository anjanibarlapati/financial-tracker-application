# FinGrow

- This application help users to manage their income, expenses, and savings goals, providing insights into their financial habits and encouraging better financial decision-making.

## Description

1. It has a registration and login page.
2. User can manages all his/her transactions by storeing all transactions.
3. User can set budgets, update budgets and  check how much of the budget has been spent for different categories.
4. User can to set savings goals, add amount to savings goals and check progress towards them.
5. It generates finanical report of a user which has total income and expenses, summary of budget usage across different categories and progress towards savings goals over a specified period.
6. It alerts the user when he/she exceed the budget in any category or when he/she is close to reaching a savings goal.
7. It stores user data, transactions, budgets, and savings goals in the database.


## Table of Contents
- [Technologies Used](#technologies-used)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)

## Technologies Used

- Typescript
- Jest
- MongoDB
- Mongoose

## Requirements

1. Install Node.js on macOS. [NodeJS](https://nodejs.org/en/download/package-manager)
   ```bash
   brew install node
   ```
2. Install watchman on macOS using brew. [Watchman](https://formulae.brew.sh/formula/watchman)
   ```bash
   brew install watchman
   ```
3. To install MongoDB in MacOS, run following commands. [MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
   -  To tap MongoDB Homebrew,  .
      ```bash
      brew tap mongodb/brew
      ```
   -  To install MongoDB, run the following command
      ```
      brew install mongodb-community@7.0
      ```
   -  To run MongoDB as a macOS service
      ```
      brew services start mongodb-community@7.0
      ```


## Installation

1. To clone the repository:
   ```bash
   git clone -b fingrow-ci-cd git@github.com:anjanibarlapati/financial-tracker-application.git
   ```

2. To install dependencies:
   - Go to the frontend directory
      ```bash
      cd frontend
      ```
   - Run following command.
      ```bash
      npm install
      ```
   - Go to the backend directory
      ```bash
      cd backend
      ```
   - Run following command.
      ```bash
      npm install
      ```
      
 ## Usage
To run the backend test files, use below commands

   ```bash
   cd backend
   ```
   ```bash
   npm run test
   ```
To run the frontend test files, use below commands

   ```bash
   cd frontend
   ```
   ```bash
   npm run test
   ```

To run the project, use the following commands:

1. To run the backend execute the following commands
      ```bash
      cd backend
      ```
   ```bash
   npm run dev
   ```
2. To run the application run below commands in different terminal window.
      ```bash
      cd frontend
      ```
   ```bash
   npm run start
   ```
