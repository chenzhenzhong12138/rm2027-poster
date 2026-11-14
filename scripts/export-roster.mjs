import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const { groups } = JSON.parse(await readFile(new URL("public/data/tech.json", root), "utf8"));
const people = new Map();
const grades = [["g3", "大三"], ["g2", "大二"]];
for (const group of groups) {
  for (const sub of group.subs) {
    for (const [key, grade] of grades) {
      for (const name of sub[key]) {
        const person = people.get(name) ?? { name, grade, roles: [] };
        if (person.grade !== grade) throw new Error(`${name} 的年级不一致`);
        person.roles.push(group.name === sub.name ? group.name : `${group.name} / ${sub.name}`);
        people.set(name, person);
      }
    }
  }
}

const count = (group, key) => new Set(group.subs.flatMap(sub => sub[key])).size;
const gradeCount = grade => [...people.values()].filter(person => person.grade === grade).length;
const lines = [
  "# RM2027 技术组当前名单",
  "",
  `共 **${people.size} 人**：大三 **${gradeCount("大三")} 人**，大二 **${gradeCount("大二")} 人**。`,
  "",
  "人数按统计范围内的实际人员计算；跨组兼任会在相应组内分别列出，因此各大组人数之和不等于总人数。第二页车组名单保留原版，尚未按本次技术组变动调整。",
  "",
  "| 组别 | 大三 | 大二 | 人数 |",
  "| --- | ---: | ---: | ---: |",
  ...groups.map(group => `| ${group.name} | ${count(group, "g3")} | ${count(group, "g2")} | ${count(group, "g3") + count(group, "g2")} |`),
  "",
];
const text = [`RM2027 技术组当前名单`, `共 ${people.size} 人：大三 ${gradeCount("大三")} 人，大二 ${gradeCount("大二")} 人。`, ""];
for (const group of groups) {
  const title = `${group.name}（${count(group, "g3") + count(group, "g2")} 人）`;
  lines.push(`## ${title}`, "");
  text.push(title);
  for (const sub of group.subs) {
    if (sub.name !== group.name) {
      lines.push(`### ${sub.name}（${sub.g3.length + sub.g2.length} 人）`, "");
      text.push(`  ${sub.name}（${sub.g3.length + sub.g2.length} 人）`);
    }
    for (const [key, grade] of grades) {
      const row = `${grade}（${sub[key].length} 人）：${sub[key].join("、") || "暂无"}`;
      lines.push(`- ${row}`);
      text.push(`  ${row}`);
    }
    lines.push("");
  }
  text.push("");
}
lines.push("## 全体人员索引", "", "| 序号 | 姓名 | 年级 | 所属组别 |", "| ---: | --- | --- | --- |");
let index = 0;
for (const [, grade] of grades) {
  for (const person of people.values()) {
    if (person.grade !== grade) continue;
    lines.push(`| ${++index} | ${person.name} | ${person.grade} | ${person.roles.join("；")} |`);
  }
}
lines.push("", "数据来源：`public/data/tech.json`。修改数据后运行 `pnpm export:roster` 重新生成。", "");
const output = new URL("exports/", root);
await mkdir(output, { recursive: true });
for (const [extension, content] of [["md", lines.join("\n")], ["txt", text.join("\n")]]) {
  const file = new URL(`RM2027-技术组当前名单.${extension}`, output);
  await writeFile(file, content, "utf8");
  console.log(fileURLToPath(file));
}
