// === Format ms to h m s ===
function formatDuration(ms) {
	const totalSecs = Math.round(ms / 1000);
	const h = Math.floor(totalSecs / 3600);
	const m = Math.floor((totalSecs % 3600) / 60);
	const s = totalSecs % 60;
	return `${h}h ${m}m ${s}s`;
}

// === Parse Entries and Accumulate Durations with Parent Handling ===
async function accumulateDurations(entries, vault, metadataCache) {
	const summary = {};       // note -> { total, headings }
	const childMap = {};      // parent -> Set(children)

	for (const e of entries) {
		if (!e.startTime || !e.endTime) continue;
		const duration = new Date(e.endTime) - new Date(e.startTime);
		if (duration <= 0) continue;

		const raw = e.name.match(/\[\[(.+?)\]\]/);
		if (!raw) continue;

		const [noteLink, heading = null] = raw[1].split("#");
		let superitem = noteLink;

		const file = vault.getMarkdownFiles().find(f => f.basename === noteLink);
		if (file) {
			const cache = metadataCache.getFileCache(file);
			const frontmatter = cache?.frontmatter || {};
			if (frontmatter.parent) {
				const parentMatch = frontmatter.parent.match(/\[\[(.+?)\]\]/);
				if (parentMatch) {
					superitem = parentMatch[1];
					if (!childMap[superitem]) childMap[superitem] = new Set();
					childMap[superitem].add(noteLink);
				}
			}
		}

		if (!summary[superitem]) summary[superitem] = { total: 0, headings: {} };
		if (!summary[noteLink]) summary[noteLink] = { total: 0, headings: {} };

		summary[noteLink].total += duration;

		if (heading) {
			if (!summary[noteLink].headings[heading]) summary[noteLink].headings[heading] = 0;
			summary[noteLink].headings[heading] += duration;
		}

		if (superitem !== noteLink) {
			summary[superitem].total += duration;
		}
	}

	return { summary, childMap };
}

// === Markdown Table Formatter for full summary ===
function formatMarkdownTable(summaryData, title, includeTotalRow = false) {
	const { summary, childMap } = summaryData;
	let report = `# 1 Time Summary – ${title}\n\n`;
	report += `| Note/Heading | Time Spent |\n`;
	report += `|--------------|------------|\n`;

	const topLevelNotes = Object.keys(summary).filter(note => !Object.values(childMap).some(set => set.has(note)));
	topLevelNotes.sort((a, b) => (summary[b]?.total || 0) - (summary[a]?.total || 0));

	if (includeTotalRow) {
		const total = topLevelNotes.reduce((acc, note) => acc + (summary[note]?.total || 0), 0);
		report += `| **Total** | **${formatDuration(total)}** |\n`;
	}

	const processed = new Set();

	const renderNote = (note, indent = "", bold = true) => {
		if (processed.has(note)) return;
		processed.add(note);

		const data = summary[note];
		if (!data) return;

		report += `| ${indent}[[${note}]] | ${bold ? `**${formatDuration(data.total)}**` : formatDuration(data.total)} |\n`;

		const sortedHeadings = Object.entries(data.headings || {}).sort((a, b) => b[1] - a[1]);
		for (const [heading, dur] of sortedHeadings) {
			report += `| ${indent}&nbsp;&nbsp;&nbsp;&nbsp;[[${note}#${heading}\\|${heading}]] | ${formatDuration(dur)} |\n`;
		}

		if (childMap[note]) {
			const sortedChildren = Array.from(childMap[note]).sort((a, b) => (summary[b]?.total || 0) - (summary[a]?.total || 0));
			for (const child of sortedChildren) {
				renderNote(child, indent + "&nbsp;&nbsp;&nbsp;&nbsp;", false);
			}
		}
	};

	for (const note of topLevelNotes) renderNote(note);

	report += `\n`;
	return report;
}

// === Markdown Formatter for a single branch ===
function formatBranchMarkdown(summary, childMap, root, includeTotalRow = false) {
	let report = `# 1 Time Summary – ${root}\n\n`;
	report += `| Note/Heading | Time Spent |\n`;
	report += `|--------------|------------|\n`;

	if (!summary[root]) {
		report += `| [[${root}]] | ${formatDuration(0)} |\n\n`;
		return report;
	}

	if (includeTotalRow) {
		const total = summary[root]?.total || 0;
		report += `| **Total** | **${formatDuration(total)}** |\n`;
	}

	const processed = new Set();

	const renderNode = (note, indent = "", bold = true) => {
		if (processed.has(note)) return;
		processed.add(note);

		const data = summary[note];
		if (!data) return;

		report += `| ${indent}[[${note}]] | ${bold ? `**${formatDuration(data.total)}**` : formatDuration(data.total)} |\n`;

		const sortedHeadings = Object.entries(data.headings || {}).sort((a, b) => b[1] - a[1]);
		for (const [heading, dur] of sortedHeadings) {
			report += `| ${indent}&nbsp;&nbsp;&nbsp;&nbsp;[[${note}#${heading}\\|${heading}]] | ${formatDuration(dur)} |\n`;
		}

		const children = childMap[note] ? Array.from(childMap[note]) : [];
		children.sort((a, b) => (summary[b]?.total || 0) - (summary[a]?.total || 0));
		for (const child of children) renderNode(child, indent + "&nbsp;&nbsp;&nbsp;&nbsp;", false);
	};

	renderNode(root);

	report += `\n`;
	return report;
}

// === Main Function ===
async function summarize_time_logs(tp, identity) {
	const vault = tp.app.vault;
	const metadataCache = tp.app.metadataCache;
	const fs = vault.adapter;
	const dir = `scripts/templater/data/${identity}`;
	const weeklyDir = `${dir}/weekly`;
	const dailyDir = `${dir}/daily`;
	const totalDir = `${dir}/total`;
	await fs.mkdir(weeklyDir).catch(() => {});
	await fs.mkdir(dailyDir).catch(() => {});
	await fs.mkdir(totalDir).catch(() => {});

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

		const weeklySummaryData = await accumulateDurations(entries, vault, metadataCache);
		const weeklyReport = formatMarkdownTable(weeklySummaryData, `Week ${week}`, true);
		const weeklyYearDir = `${weeklyDir}/${year}`;
		await fs.mkdir(weeklyYearDir).catch(() => {});
		await fs.write(`${weeklyYearDir}/Summary-${year}-${month}-Wk${week}.md`, weeklyReport);

		const dailyBuckets = {};
		for (const e of entries) {
			if (!e.startTime || !e.endTime) continue;
			const date = new Date(e.startTime).toISOString().split("T")[0];
			if (!dailyBuckets[date]) dailyBuckets[date] = [];
			dailyBuckets[date].push(e);
		}

		for (const [date, dayEntries] of Object.entries(dailyBuckets)) {
			const dayYear = new Date(dayEntries[0].startTime).getFullYear();
			const dailyYearDir = `${dailyDir}/${dayYear}`;
			await fs.mkdir(dailyYearDir).catch(() => {});
			const dailySummaryData = await accumulateDurations(dayEntries, vault, metadataCache);
			const dailyReport = formatMarkdownTable(dailySummaryData, date, true);
			await fs.write(`${dailyYearDir}/Summary-${date}.md`, dailyReport);
		}
	}

	const allSummaryData = await accumulateDurations(allEntries, vault, metadataCache);
	const { summary, childMap } = allSummaryData;
	const topLevelNotes = Object.keys(summary).filter(note => !Object.values(childMap).some(set => set.has(note)));

	for (const root of topLevelNotes) {
		const branchReport = formatBranchMarkdown(summary, childMap, root, true);

		// Determine year: first subitem if exists, else root
		let firstNote = root;
		if (childMap[root] && childMap[root].size > 0) {
			firstNote = Array.from(childMap[root])[0];
		}

		const entryForYear = allEntries.find(e => {
			const raw = e.name.match(/\[\[(.+?)\]\]/);
			return raw && raw[1].split("#")[0] === firstNote;
		});

		const year = entryForYear ? new Date(entryForYear.startTime).getFullYear() : new Date().getFullYear();
		const totalYearDir = `${totalDir}/${year}`;
		await fs.mkdir(totalYearDir).catch(() => {});

		let safeName = String(root).replace(/[\/\\:\*\?"<>\|]/g, "").trim();
		if (!safeName) safeName = root.replace(/\s+/g, "_");
		safeName = safeName.slice(0, 200);

		await fs.write(`${totalYearDir}/Summarize ${safeName}.md`, branchReport);
	}

	new Notice("All time summaries generated.");
}

module.exports = summarize_time_logs;