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

// open_timeline_log.ts
async function openTimelineLog(tp, identity) {
  const fs = tp.app.vault.adapter;
  const filename = getCurrentWeekFilename();
  const filePath = `scripts/templater/data/${identity}/${filename}`;
  await ensureTimelineFile(fs, filePath);
  await app.workspace.openLinkText(filePath, "/", false);
}
module.exports = openTimelineLog;
