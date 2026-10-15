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
    string(
      name: 'QALINK_SERVER_URL',
      defaultValue: 'https://lqatms-test5.ptcnet.ptc.com/QALink',
      description: 'QALink base URL under test (up to and including /QALink, no trailing slash)'
    )
    string(
      name: 'HECTOR_BUILD_NUMBER',
      defaultValue: '19',
      description: 'Hector developmentBuild number the results are published under'
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

          def serverUrl = params.QALINK_SERVER_URL.trim().replaceAll('/+$', '')
          if (!(serverUrl ==~ /^https?:\/\/.+/)) {
            error "QALINK_SERVER_URL must start with http:// or https:// (got '${params.QALINK_SERVER_URL}')"
          }
          def hectorBuild = params.HECTOR_BUILD_NUMBER.trim()
          if (!(hectorBuild ==~ /^\d+$/)) {
            error "HECTOR_BUILD_NUMBER must be a whole number (got '${params.HECTOR_BUILD_NUMBER}')"
          }
          echo "QALink server: ${serverUrl} | Hector developmentBuild: ${hectorBuild}"

          def results = [:]

          withEnv(["TEST_QALINK_BASE=${serverUrl}", "HECTOR_BUILD_NUMBER=${hectorBuild}"]) {
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
