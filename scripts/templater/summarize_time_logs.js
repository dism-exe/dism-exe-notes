// === Format ms to h m s ===
function formatDuration(ms) {
	const totalSecs = Math.round(ms / 1000);
	const h = Math.floor(totalSecs / 3600);
	const m = Math.floor((totalSecs % 3600) / 60);
	const s = totalSecs % 60;
	return `${h}h ${m}m ${s}s`;
}

// === Parse Entries and Accumulate Durations ===
function accumulateDurations(entries) {
	const summary = {};

	for (const e of entries) {
		if (!e.startTime || !e.endTime) continue;
		const duration = new Date(e.endTime) - new Date(e.startTime);
		if (duration <= 0) continue;

		const raw = e.name.match(/\[\[(.+?)\]\]/);
		if (!raw) continue;

		const [note, heading = null] = raw[1].split("#");
		if (!summary[note]) summary[note] = { total: 0, headings: {} };

		summary[note].total += duration;

		if (heading) {
			if (!summary[note].headings[heading]) summary[note].headings[heading] = 0;
			summary[note].headings[heading] += duration;
		}
	}
	return summary;
}

// === Markdown Table Formatter ===
function formatMarkdownTable(summary, title) {
	let report = `# Time Summary – ${title}\n\n`;
	report += `| Note/Heading | Time Spent |\n`;
	report += `|--------------|------------|\n`;

	for (const [note, data] of Object.entries(summary).sort((a, b) => b[1].total - a[1].total)) {
		report += `| [[${note}]] | ${formatDuration(data.total)} |\n`;

		const headings = Object.entries(data.headings);
		for (const [heading, dur] of headings.sort((a, b) => b[1] - a[1])) {
			report += `| &nbsp;&nbsp;&nbsp;&nbsp;[[${note}#${heading}\\|${heading}]] | ${formatDuration(dur)} |\n`;
		}
	}

	report += `\n`;
	return report;
}

// === Main Function ===
async function summarize_time_logs(tp, identity) {
	const fs = tp.app.vault.adapter;
	const dir = `scripts/templater/data/${identity}`;
	const files = await fs.list(dir);
	const allEntries = [];

	for (const file of files.files) {
		const basename = file.split("/").pop();
		const match = basename.match(/^Timeline-(\d{4})-(\d{2})-Wk(\d{2})\.md$/);
		if (!match) continue;

		const [_, year, month, week] = match;
		const summaryFile = `${dir}/Summary-${year}-${month}-Wk${week}.md`;
		const timelineFile = `${dir}/${basename}`;

		const content = await fs.read(timelineFile);
		const timeBlock = content.match(/```simple-time-tracker\n({[\s\S]*?})\n```/);
		if (!timeBlock) continue;

		const entries = JSON.parse(timeBlock[1]).entries;
		allEntries.push(...entries);

		const summary = accumulateDurations(entries);
		const report = formatMarkdownTable(summary, `Week ${week}`);
		await fs.write(summaryFile, report);
	}

	// === All-Time Summary ===
	const allSummary = accumulateDurations(allEntries);
	const allTimeReport = formatMarkdownTable(allSummary, "All Time");
	const allTimePath = `${dir}/Summary-All-Time.md`;
	await fs.write(allTimePath, allTimeReport);

	new Notice("All time summaries generated.");
}

module.exports = summarize_time_logs;
