(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  if (!nav) return;
  const panel = document.createElement('details');
  panel.style.cssText = 'max-width:40em;margin:1em auto;padding:1em;font:16px system-ui;background:white;color:#402719';
  const summary = document.createElement('summary');
  summary.textContent = 'Connection speed test';
  const result = document.createElement('p');
  panel.append(summary, result);
  document.body.appendChild(panel);
  let largestPaint;
  const seconds = ms => (ms / 1000).toFixed(2) + ' s';
  function show() {
    result.textContent = 'First byte: ' + seconds(nav.responseStart) +
      ' ? Main content: ' + (largestPaint ? seconds(largestPaint) : 'measuring') +
      ' ? Visit: ' + nav.type + '. Reload to compare a repeat visit.';
  }
  if (window.PerformanceObserver?.supportedEntryTypes.includes('largest-contentful-paint')) {
    new PerformanceObserver(list => {
      largestPaint = list.getEntries().at(-1).startTime;
      show();
    }).observe({type: 'largest-contentful-paint', buffered: true});
  }
  show();
})();
