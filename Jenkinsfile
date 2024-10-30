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
            mail bcc: '', body: """Project: ${env.JOB_NAME}   Build Number: ${env.BUILD_NUMBER}   url: ${env.BUILD_URL}""", cc: '', from: '', replyTo: '', subject: "'${currentBuild.result}'", to: 'barlapatianjani@gmail.com'        
        }
        failure {
            mail bcc: '', body: """Project: ${env.JOB_NAME}   Build Number: ${env.BUILD_NUMBER}   url: ${env.BUILD_URL}""", cc: '', from: '', replyTo: '', subject: "'${currentBuild.result}'", to: 'barlapatianjani@gmail.com'        
        }
    }
}
