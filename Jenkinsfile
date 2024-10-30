pipeline {
    agent any

    environment {
        PATH = "${env.PATH}:/usr/local/bin/"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    dir('./frontend') {
                        sh 'npm install'
                    }
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    dir('./frontend') {
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    dir('./frontend') {
                        sh 'npm run build'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Tests and  Build completed successful.'
        }
        failure {
            echo 'Tests or Build failed.'
        }
    }
}
