pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        stage('Install Browser Dependencies') {
            steps {
                bat 'npx playwright install'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
        stage('Format JUnit Report') {
            steps {
                bat 'npx ts-node ./utils/formatJunitTest.ts'
            }
        }
