import assert from "node:assert/strict";
import test from "node:test";
import type { Robot } from "../src/data/roster";
import { carCellRuns } from "../src/lib/car-cells.ts";

const robot = (name: string, group: string | undefined, names: string[]): Robot => ({ name, group, lead: names, crew: {} });
const names = (r: Robot) => r.lead;

test("同一行相邻相同名单合并，包括跨项目分类的相同任务", () => {
  const cars = [robot("A", "步兵", ["甲", "乙"]), robot("B", "步兵", ["甲", "乙"]), robot("C", "哨兵", ["甲", "乙"])];
  assert.deepEqual(carCellRuns(cars, names), [
    { start: 0, span: 3, names: ["甲", "乙"] },
  ]);
});

test("负责人可以跨项目合并，只合并完全相同且相邻的名单", () => {
  const cars = [robot("飞镖", undefined, ["甲"]), robot("无人机", undefined, ["乙"]), robot("雷达", undefined, ["乙"]), robot("裁判", undefined, ["丙"])];
  assert.deepEqual(carCellRuns(cars, names).map(r => [r.start, r.span]), [[0, 1], [1, 2], [3, 1]]);
});

test("空列与不同名单均中断合并，不吞并或移动人员", () => {
  const cars = [robot("A", "步兵", ["甲"]), robot("B", "步兵", []), robot("C", "步兵", ["甲"]), robot("D", "步兵", ["乙"]), robot("E", "步兵", ["乙"])];
  assert.deepEqual(carCellRuns(cars, names).map(r => [r.start, r.span]), [[0, 1], [2, 1], [3, 2]]);
});
