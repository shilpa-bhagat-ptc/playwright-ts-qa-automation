pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/shilpa-bhagat-ptc/playwright-ts-qa-automation.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Install Browser Dependencies') {
      steps {
        sh 'npx playwright install-deps'
      }
    }

    stage('Global Setup') {
      steps {
        script {
          if (fileExists('.auth/storageState.json')) {
            echo 'Storage state already exists, skipping global setup.'
          } else {
            echo 'Running global setup...'
            sh 'npx ts-node tests/config/global-setup.ts'
          }
        }
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Publish HTML Report') {
      steps {
        archiveArtifacts artifacts: 'reports/html-report/**', fingerprint: true
        archiveArtifacts artifacts: 'screenshots/**', fingerprint: true
        allowEmptyArchive: true
      }
    }

    stage('Format JUnit Report') {
      steps {
        sh 'npx ts-node tools/formatJUnitReport.ts'
      }
    }
  }

  post {
    always {
      junit 'reports/test-results/formatted-test-results.xml'
    }
  }
}
