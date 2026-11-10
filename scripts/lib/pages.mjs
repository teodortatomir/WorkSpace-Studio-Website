// The original logo click handlers target the domain root. For project Pages
// hosting, point them at the same homepage relative to the current HTML file.
// No base tag, visual rules, asset paths or external URLs are changed.
export function adaptHomepageLinks(html, relativeFile) {
  const depth = relativeFile.split('/').length - 1;
  const homepage = '../'.repeat(depth) + 'index.html';
  return html.replaceAll("window.location.href='/index.html'", `window.location.href='${homepage}'`);
}
