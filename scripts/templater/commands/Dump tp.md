<%*
function dump(obj, depth = 0, visited = new Set()) {
  if (visited.has(obj)) return '[Circular]';
  visited.add(obj);

  if (depth > 4) return '[Max depth]';

  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'function' ? '[Function]' : obj;
  }

  let result = {};
  for (const key of Object.keys(obj)) {
    try {
      result[key] = dump(obj[key], depth + 1, visited);
    } catch (e) {
      result[key] = `[Error: ${e.message}]`;
    }
  }

  return result;
}

const fullDump = dump(tp);
tR += '```json\n' + JSON.stringify(fullDump, null, 2) + '\n```';
%>
