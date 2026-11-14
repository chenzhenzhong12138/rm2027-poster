import type { Robot } from "../data/roster";

export interface CarCellRun {
  start: number;
  span: number;
  names: string[];
}

/** 合并只改变展示；每台车的数据和统计保持独立。 */
export function carCellRuns(
  robots: Robot[],
  readNames: (robot: Robot) => string[],
): CarCellRun[] {
  const runs: CarCellRun[] = [];
  robots.forEach((robot, start) => {
    const names = readNames(robot);
    if (!names.length) return;
    const last = runs[runs.length - 1];
    if (last && last.start + last.span === start &&
      names.length === last.names.length && names.every((name, i) => name === last.names[i])) {
      last.span += 1;
    } else {
      runs.push({ start, span: 1, names });
    }
  });
  return runs;
}
