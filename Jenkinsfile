stage('Install Dependencies') {
  steps {
    bat 'npm ci'
  }
}
stage('Install Playwright Browsers') {
  steps {
    bat 'npx playwright install'
  }
}
stage('Install Browser Dependencies') {
  steps {
    bat 'npx playwright install-deps'
  }
}
stage('Run Tests') {
  steps {
    bat 'npx playwright test'
  }
}
stage('Format JUnit Report') {
  steps {
    bat 'npx ts-node tools/formatJUnitReport.ts'
  }
}
stage('Publish HTML Report') {
  steps {
    publishHTML(target: [
      reportDir: 'reports/html-report',
      reportFiles: 'index.html',
      reportName: 'Playwright Report'
    ])
  }
}
