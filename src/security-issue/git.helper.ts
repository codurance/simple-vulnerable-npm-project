import { NotFoundException } from "@nestjs/common";
import testFileRegexPatterns from './../assets/regex-patterns/test-files.json';
import commitMessageRegexPatterns from './../assets/regex-patterns/commit-messages.json';

export function getIntervalIncludingCurrentMonth(period: string): string {
  const date = new Date();
  if (period === '3m') {
    date.setMonth(date.getMonth() - 2);
  } else if (period === '6m') {
    date.setMonth(date.getMonth() - 5);
  } else if (period === '1y') {
    date.setMonth(date.getMonth() - 11);
  }
  return date.toISOString().split('T')[0];
}

export function getRepoPath(filesPath: string, repo: string): string {
  const filesArray = filesPath.split(',');
  const projectNames = filesArray.map((el) => el.replace(/\([^)]*\)/g, '').split('_')[0]);
  const projectPaths = filesArray.map((el) => el.split('_')[1]);
  const repoProjectIndex = projectNames.indexOf(repo);

  if (repoProjectIndex >= 0) {
    return projectPaths[repoProjectIndex];
  }
  throw new NotFoundException('Can not find path based on repo name');
}

export function isTestFile(path: string): boolean {
  for (const testFilePattern of testFileRegexPatterns.test_file_patterns) {
    const regex = new RegExp(testFilePattern.pattern);
    if (regex.test(path))
      return true;
  }
  return false;
}

export function findLatestRegister(dataArray) {
  try {
    return dataArray ?
      dataArray.reduce((latest, current) => {
        const latestDate = new Date(latest.date);
        const currentDate = new Date(current.date);
        return latestDate > currentDate ? latest : current;
      }) : undefined;
  } catch (e) {
    return undefined;
  }
}

export function getFormattedAverage(value: number, dividedBy: number) {
  return value > 0 && dividedBy > 0
    ? Math.round(
      (value / dividedBy) * 100,
    ) / 100
    : 0
}

export function isCommitTraceableAndToWhat(commitMessage: string): { isTraceable: boolean, taskPattern: string } {
  for (const taskNamePattern of commitMessageRegexPatterns.task_name_patterns) {
    const regex = new RegExp(taskNamePattern.pattern);
    if (regex.test(commitMessage))
      return {
        isTraceable: true,
        taskPattern: taskNamePattern.example
      }
  }
  return {
    isTraceable: false,
    taskPattern: ''
  }
}