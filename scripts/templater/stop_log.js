// timeline_common.ts
function getISOWeek(date) {
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 3 - (tmp.getDay() + 6) % 7);
  const week1 = new Date(tmp.getFullYear(), 0, 4);
  return 1 + Math.round(((tmp.getTime() - week1.getTime()) / 864e5 - 3 + (week1.getDay() + 6) % 7) / 7);
}
function getCurrentWeekFilename() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const week = getISOWeek(now).toString().padStart(2, "0");
  return `Timeline-${year}-${month}-Wk${week}.md`;
}
async function ensureTimelineFile(fs, path) {
  const exists = await fs.exists(path);
  if (!exists) {
    const starter = `# 1 Time Logs

\`\`\`simple-time-tracker
{
  "entries": []
}
\`\`\`
`;
    await fs.write(path, starter);
  }
}
async function stopLastLogEntry(fs, filePath) {
  let content = await fs.read(filePath);
  const match = content.match(/```simple-time-tracker\n({[\s\S]*?})\n```/);
  if (!match) throw new Error("No simple-time-tracker block found.");
  const json = JSON.parse(match[1]);
  const latest = [...json.entries].reverse().find((e) => e.endTime === null);
  if (!latest) {
    console.warn("No ongoing log entry to stop.");
    return;
  }
  latest.endTime = (/* @__PURE__ */ new Date()).toISOString();
  const newBlock = "```simple-time-tracker\n" + JSON.stringify(json, null, 2) + "\n```";
  const updated = content.replace(/```simple-time-tracker\n({[\s\S]*?})\n```/, newBlock);
  await fs.write(filePath, updated);
  new Notice("Stop log recorded.");
}

// stop_log.ts
async function stop_log(tp, identity) {
  const fs = tp.app.vault.adapter;
  const filename = getCurrentWeekFilename();
  const timelineFilePath = `scripts/templater/data/${identity}/${filename}`;
  await ensureTimelineFile(fs, timelineFilePath);
  await stopLastLogEntry(fs, timelineFilePath);
}
module.exports = stop_log;
