pipeline {
  agent { label 'qalink-agent' }

  parameters {
    choice(
      name: 'TEST_PROJECT',
      choices: [
        'ALL',
        'homePageTests',
        'adminPageTests',
        'planningPageTests',
        'queryPageTests',
        'userPageTests',
        'reportPageTests',
        'executionPageTests'
      ],
      description: 'Select which Playwright test project to run, or ALL to run every suite sequentially'
    )
  }

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
        script {
          if (params.TEST_PROJECT == 'ALL') {
            def suites = [
              'homePageTests',
              'adminPageTests',
              'planningPageTests',
              'queryPageTests',
              'userPageTests',
              'reportPageTests',
              'executionPageTests'
            ]
            for (suite in suites) {
              bat "set TEST_PROJECT=${suite}\nnpx playwright test"
            }
          } else {
            bat "set TEST_PROJECT=${params.TEST_PROJECT}\nnpx playwright test"
          }
        }
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
