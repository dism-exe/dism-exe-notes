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
function formatMarkdownTable(summary, title, includeTotalRow = false) {
	let report = `# Time Summary – ${title}\n\n`;
	report += `| Note/Heading | Time Spent |\n`;
	report += `|--------------|------------|\n`;

	if (includeTotalRow) {
		const total = Object.values(summary).reduce((acc, cur) => acc + cur.total, 0);
		report += `| **Total** | **${formatDuration(total)}** |\n`;
	}

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
	const weeklyDir = `${dir}/weekly`;
	const dailyDir = `${dir}/daily`;
	await fs.mkdir(weeklyDir).catch(() => {});
	await fs.mkdir(dailyDir).catch(() => {});

	const files = await fs.list(dir);
	const allEntries = [];

	for (const file of files.files) {
		const basename = file.split("/").pop();
		const match = basename.match(/^Timeline-(\d{4})-(\d{2})-Wk(\d{2})\.md$/);
		if (!match) continue;

		const [_, year, month, week] = match;
		const timelineFile = `${dir}/${basename}`;
		const content = await fs.read(timelineFile);
		const timeBlock = content.match(/```simple-time-tracker\n({[\s\S]*?})\n```/);
		if (!timeBlock) continue;

		const entries = JSON.parse(timeBlock[1]).entries;
		allEntries.push(...entries);

		// === Weekly Summary ===
		const weeklySummary = accumulateDurations(entries);
		const weeklyReport = formatMarkdownTable(weeklySummary, `Week ${week}`, true);
		const weeklyFile = `${weeklyDir}/Summary-${year}-${month}-Wk${week}.md`;
		await fs.write(weeklyFile, weeklyReport);

		// === Daily Summaries ===
		const dailyBuckets = {};
		for (const e of entries) {
			if (!e.startTime || !e.endTime) continue;
			const date = new Date(e.startTime).toISOString().split("T")[0];
			if (!dailyBuckets[date]) dailyBuckets[date] = [];
			dailyBuckets[date].push(e);
		}

		for (const [date, dayEntries] of Object.entries(dailyBuckets)) {
			const dailySummary = accumulateDurations(dayEntries);
			const dailyReport = formatMarkdownTable(dailySummary, date, true);
			const dailyFile = `${dailyDir}/Summary-${date}.md`;
			await fs.write(dailyFile, dailyReport);
		}
	}

	// === All-Time Summary ===
	const allSummary = accumulateDurations(allEntries);
	const allTimeReport = formatMarkdownTable(allSummary, "All Time", false);
	const allTimePath = `${dir}/Summary-All-Time.md`;
	await fs.write(allTimePath, allTimeReport);

	new Notice("All time summaries generated.");
}

module.exports = summarize_time_logs;