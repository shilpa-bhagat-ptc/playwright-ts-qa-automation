import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import builder from 'xmlbuilder';

async function formatXml(inputFile: string, outputFile: string) {
  const xmlData = fs.readFileSync(inputFile, 'utf-8');
  const parsed = await parseStringPromise(xmlData);

  // 🔐 Safe test suite extraction
  const suiteList: any[] =
    parsed.testsuites?.testsuite ??
    (parsed.testsuite ? [parsed.testsuite] : []);

  if (suiteList.length === 0) {
    console.warn("⚠️ No test suites found in the XML.");
    return;
  }

  const root = builder.create('Tests');

  for (const suite of suiteList) {
    const testCases = suite.testcase || [];

    for (const testCase of testCases) {
      const attrs = testCase.$;
      const failure = testCase.failure ? 'failed' : 'passed';

      root.ele('Test', {
        class: attrs.classname,
        name: attrs.name,
        result: failure,
        time: attrs.time || '0s',
        package: 'com.ptc.qalink',
        scrumTeam: 'QALink',
        tags: '',
        jira: '',
        priority: 'P1'
      });
    }
  }
