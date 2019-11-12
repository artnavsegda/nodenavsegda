exports.complete = function(line) {
  const completions = 'help error exit quit q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}

