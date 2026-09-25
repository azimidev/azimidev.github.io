'use strict';

/* The DevTools pane shared by /v1/ and /v2/.
   Styles: shows the rules for whatever you're reading; unticking one flips an `off-*` class on <html>,
           and the page's own CSS decides what that switch undoes.
   Console: the page narrates its JS here, and visitors can type a few commands.
            No eval: anything typed is looked up in `commands`, never executed. */
(() => {
	const logEl = document.getElementById('log');
	if (!logEl) return;

	const print = (kind, text) => {
		const line = document.createElement('li');
		line.className = `line ${kind}`;
		line.textContent = text;
		logEl.append(line);
		logEl.scrollTop = logEl.scrollHeight;
	};
	window.devtools = { print };

	/* ---------- Styles ---------- */
	const panels = document.querySelectorAll('[data-panel]');
	const crumbs = document.getElementById('crumbs');
	const targets = [...document.querySelectorAll('[data-styles]')];

	// a real breadcrumb, from <main> down to the heading being read
	const pathTo = el => {
		const node = el.id ? el : el.querySelector('[id]') ?? el;
		const parts = [];
		for (let n = node; n && n.tagName !== 'BODY'; n = n.parentElement) {
			parts.unshift(n.tagName.toLowerCase() + (n.id ? `#${n.id}` : ''));
			if (n.tagName === 'MAIN') break;
		}
		return parts.join(' > ');
	};

	let inView = null;
	const show = el => {
		const id = el.dataset.styles;
		if (id === inView) return;
		inView = id;
		panels.forEach(panel => panel.hidden = panel.dataset.panel !== id);
		crumbs.textContent = pathTo(el);
		print('info', `IntersectionObserver: #${id} is in view`);
	};
	// whichever target last crossed the top 45% of the screen wins; recomputed on every crossing,
	// so a fast scroll that jumps over a heading still lands on the right panel
	const pick = () => {
		const line = window.innerHeight * .45;
		let current = targets[0];
		for (const target of targets) if (target.getBoundingClientRect().top < line) current = target;
		show(current);
	};
	const observer = new IntersectionObserver(pick, { rootMargin: '0px 0px -55% 0px' });
	targets.forEach(target => observer.observe(target));

	document.querySelectorAll('[data-off]').forEach(box => box.addEventListener('change', () => {
		const added = document.documentElement.classList.toggle(box.dataset.off, !box.checked);
		print('in', `document.documentElement.classList.toggle("${box.dataset.off}")`);
		print('ret', String(added));
	}));

	/* ---------- Console ---------- */
	const email = document.getElementById('email').dataset;
	const address = `${email.name}@${email.domain}.${email.tld}`;
	const eric = {
		name: 'Eric Azimi',
		city: 'London',
		roles: ['Tech Lead', 'Software Architect', 'Full-Stack Engineer'],
		freeTime: 'programming',
	};
	// read straight from the page, so the console can't drift from the list
	const skills = () => [...document.querySelector('[data-skills]').children].map(li => {
		const copy = li.cloneNode(true);
		copy.querySelector('small')?.remove();
		return copy.textContent.replace(/\s+/g, ' ').trim();
	});
	const toggleEditing = () => {
		document.designMode = document.designMode === 'on' ? 'off' : 'on';
		print('ret', `"${document.designMode}"`);
		print('info', document.designMode === 'on'
			? 'The whole page is editable now. Click any text and rewrite my CV.'
			: 'Back to read-only. Your edits live until you refresh.');
	};
	const boxToggle = document.getElementById('box-toggle');

	const commands = {
		'help()': () => [
			'eric             who is this',
			'eric.skills      what he is good at',
			'eric.hire()      open your mail app',
			'edit()           make the whole page editable',
			boxToggle && 'box()            put him back in the box (or out)',
			'sudo hire eric   go on',
			'clear()          tidy up',
		].filter(Boolean).forEach(row => print('info', row)),
		'eric': () => print('ret', `{name: "${eric.name}", city: "${eric.city}", roles: Array(${eric.roles.length}), freeTime: "${eric.freeTime}"}`),
		'eric.roles': () => print('ret', JSON.stringify(eric.roles)),
		'eric.skills': () => {
			const list = skills();
			print('ret', `(${list.length}) ${JSON.stringify(list)}`);
		},
		'eric.hire()': () => {
			print('info', `Opening your mail app for ${address}…`);
			print('ret', 'undefined');
			window.location.href = `mailto:${address}`;
		},
		'edit()': toggleEditing,
		'document.designMode="on"': toggleEditing,
		'sudo hire eric': () => {
			print('err', 'eric is not in the sudoers file. This incident will be reported.');
			print('info', `Reported to ${address}. Or skip the paperwork: eric.hire()`);
		},
		'clear()': () => {
			logEl.replaceChildren();
			print('info', 'Console was cleared');
		},
	};
	if (boxToggle) commands['box()'] = () => boxToggle.click();
	commands['help'] = commands['help()'];
	commands['console.clear()'] = commands['clear()'];

	const history = [];
	let cursor = 0;
	const cmd = document.getElementById('cmd');
	const run = raw => {
		const input = raw.trim();
		if (!input) return;
		print('in', input);
		history.push(input);
		cursor = history.length;
		const key = input.replace(/;+$/, '').replace(/\s*=\s*/g, '=').replace(/'/g, '"').replace(/\s+/g, ' ');
		const command = commands[key];
		if (command) return command();
		const name = input.match(/^[A-Za-z_$][\w$]*/)?.[0];
		print('err', name
			? `Uncaught ReferenceError: ${name} is not defined`
			: 'Uncaught SyntaxError: Invalid or unexpected token');
		print('info', 'Try help()');
	};
	document.getElementById('prompt').addEventListener('submit', event => {
		event.preventDefault();
		run(cmd.value);
		cmd.value = '';
	});
	cmd.addEventListener('keydown', event => {
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
		event.preventDefault();
		cursor = Math.max(0, Math.min(history.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)));
		cmd.value = history[cursor] ?? '';
	});

	print('info', 'This console runs the page. Type help() and press Enter.');
	run('eric');

	// and one for whoever opens the real DevTools
	console.log(
		'%cHi, developer.%c\nYou opened DevTools on a portfolio. That is exactly who I want to hear from: ' + address,
		'font: bold 20px helvetica, sans-serif; background: #ffb700; color: #000; padding: 4px 10px;',
		'font: 13px monospace;'
	);
})();
