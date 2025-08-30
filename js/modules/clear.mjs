export function clear(_args) {
	const divs = document.querySelectorAll("div:not(.active)");
	[...divs].forEach(div => div.remove());
}
