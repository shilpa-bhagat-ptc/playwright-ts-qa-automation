pipeline {
  agent any

  parameters {
    choice(
      name: 'TEST_PROJECT',
      choices: [
        'homePageTests',
        'adminPageTests',
        'planningPageTests',
        'queryPageTests',
        'userPageTests',
        'reportPageTests',
        'executionPageTests'
      ],
      description: 'Select which Playwright test project (class/suite) to run'
    )
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/shilpa-bhagat-ptc/playwright-ts-qa-automation.git'
      }
    }

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
        // Run only the selected project
        bat "npx playwright test --project=${params.TEST_PROJECT}"
      }
    }

    stage('Publish HTML Report') {
      steps {
        archiveArtifacts artifacts: 'reports/html-report/**', fingerprint: true, allowEmptyArchive: true
        archiveArtifacts artifacts: 'screenshots/**', fingerprint: true, allowEmptyArchive: true
      }
    }

    stage('Format JUnit Report') {
      steps {
        bat 'npx ts-node tools/formatJUnitReport.ts'
      }
    }
  }
}
