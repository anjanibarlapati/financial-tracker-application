# CI/CD for FinGrow using Jenkins

## Table of Contents
- [Technologies Used](#technologies-used)
- [Requirements](#requirements)
- [Installation](#installation)

## Technologies Used

- Jenkins

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
4. To install Jenkins, follow the steps in this website [Jenkins](https://www.jenkins.io/doc/book/installing/macos/)

## Jenkins-GitHub Integration

1. Install required plugins like GitHub Integration and NodeJS plugins.
2. Create a job with a pipeline by adding GitHub repository link and branch name with credentials.
3. Implement stages for automated builds, test processes, and checks for code coverage thresholds.
4. Configure Jenkins to send email notifications for build failures and successes.


## Installation

1. To clone the repository:
   ```bash
   git clone -b fingrow-ci-cd-part-3 git@github.com:anjanibarlapati/financial-tracker-application.git
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