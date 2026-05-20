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
          def suites = (params.TEST_PROJECT == 'ALL') ? [
            'homePageTests',
            'adminPageTests',
            'planningPageTests',
            'queryPageTests',
            'userPageTests',
            'reportPageTests',
            'executionPageTests'
          ] : [params.TEST_PROJECT]

          def results = [:]

          for (suite in suites) {
            stage("Suite: ${suite}") {
              try {
                bat "set TEST_PROJECT=${suite}\nnpx playwright test"
                results[suite] = 'PASSED'
              } catch (err) {
                results[suite] = 'FAILED'
                currentBuild.result = 'FAILURE'
                echo "Suite ${suite} FAILED: ${err.getMessage()} — pipeline will continue with next suite."
              }
            }
          }

          echo "=== Per-suite results ==="
          results.each { k, v -> echo "  ${k}: ${v}" }

          def failedCount = results.count { entry -> entry.value == 'FAILED' }
          if (failedCount > 0) {
            echo "${failedCount} of ${results.size()} suite(s) failed; build marked FAILURE but downstream stages will still run."
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
