# FinGrow

- This application help users to manage their income, expenses, and savings goals, providing insights into their financial habits and encouraging better financial decision-making.

## Description

1. We can manage multiple users.
2. It  manages all the transactions which stores individual transactions of a user.
3. User can set, track budgets and check how much of the budget has been spent for different categories.
4. User can to set savings goals and check progress towards a specific goal.
5. It generates finanical report of a user which has total income and expenses over a specified period, summary of budget usage across different categories and progress towards savings goals.
6. It alerts the user when he/she exceed the budget in any category or when he/she is close to reaching a savings goal.
7. It securely stores user data, transactions, budgets, and savings goals in the database.
8. It stores the previous transactions which are not stored in the database from a CSV file.


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
   git clone -b fingrow-part-2 https://github.com/anjanibarlapati/financial-tracker-application
   ```

2. To install dependencies:
   - Go to the project directory
      ```bash
      cd folder-name
      ```
   - Run following command.
      ```bash
      npm install
      ```
 ## Usage
To run the project, use the following commands:

1. To run the backend, go to the directory where the file is located (here backend directory) and execute the following command:
   ```bash
   npx ts-node index.ts
   ```
2. To run the application run below command in different terminal window.
   ```bash
   npm run test
   ```
