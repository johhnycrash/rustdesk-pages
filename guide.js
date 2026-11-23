(function () {
  const SERVER = {
    id: 'rustdesk.jonathanellis.dev',
    relay: 'rustdesk.jonathanellis.dev',
    api: 'https://rustdesk.jonathanellis.dev',
    key: 'JJ84OHiivky8RCgfbA9JUa801qBTpRIgDARzrFYEIPk=',
  };
  const RELEASES = 'https://github.com/rustdesk/rustdesk/releases/latest';
  const READY = 'Tell Jonathan you\'re ready. When the connection request appears, click <strong>Accept</strong>. Only accept a request you\'re expecting from Jonathan.';
  const MOBILE_SETTINGS = 'Open RustDesk\'s <strong>Settings</strong>, choose <strong>ID/Relay server</strong>, and copy in the four values below.';
  const DESKTOP_SETTINGS = 'Open RustDesk\'s <strong>Settings</strong>, choose <strong>Network</strong>, then <strong>ID/Relay server</strong>, and copy in the four values below.';

  const GUIDES = {
    windows: {
      name: 'Windows',
      file: 'the file ending in <strong>x86_64.exe</strong>',
      action: { kind: 'download', href: '/download/windows', label: 'Download for Windows' },
      steps: [
        'Click the button above, then open the downloaded file. Keep its long file name, because that is what connects it to Jonathan\'s server.',
        'If Windows says it protected your PC, click <strong>More info</strong>, then <strong>Run anyway</strong>.',
        'In RustDesk, click <strong>Install</strong> and approve the Windows prompt.',
        READY,
      ],
    },
    mac: {
      name: 'Mac',
      file: 'the file ending in <strong>aarch64.dmg</strong> for Apple silicon, or <strong>x86_64.dmg</strong> for Intel',
      action: { kind: 'command', command: `curl -fsSL ${SERVER.api}/setup/mac | bash` },
      steps: [
        'Click <strong>Copy</strong> above.',
        'Press <kbd>⌘</kbd> + <kbd>Space</kbd>, type <strong>Terminal</strong>, and press <kbd>Return</kbd>.',
        'Paste with <kbd>⌘</kbd> + <kbd>V</kbd> and press <kbd>Return</kbd>. RustDesk installs and opens by itself.',
        'Click <strong>Configure</strong> in RustDesk and turn on each permission until the pink panel disappears. <a href="/install/#mac-permissions">See the permission guide</a>.',
        READY,
      ],
    },
    linux: {
      name: 'Linux',
      file: 'the <strong>.deb</strong> or <strong>.rpm</strong> file for your system',
      action: { kind: 'command', command: `curl -fsSL ${SERVER.api}/setup/linux | bash` },
      steps: [
        'Click <strong>Copy</strong> above.',
        'Open a terminal, paste the command, and press <kbd>Enter</kbd>. Enter your password if asked.',
        'Open RustDesk from your apps menu.',
        READY,
      ],
    },
    android: {
      name: 'Android',
      file: 'the file ending in <strong>universal-signed.apk</strong>',
      action: { kind: 'download', href: '/download/android', label: 'Download for Android' },
      settings: true,
      steps: [
        'Tap the button above and open the downloaded file. Allow your browser to install apps if Android asks.',
        MOBILE_SETTINGS,
        'Go back, open the <strong>Share screen</strong> tab, and start the service.',
        'Send Jonathan the ID shown in RustDesk. When the connection request appears, tap <strong>Accept</strong>. Only accept a request you\'re expecting from Jonathan.',
      ],
    },
    ios: {
      name: 'iPhone or iPad',
      action: { kind: 'link', href: 'https://apps.apple.com/app/rustdesk-remote-desktop/id1581225015', label: 'Open the App Store' },
      settings: true,
      steps: [
        'Tap the button above and install RustDesk.',
        MOBILE_SETTINGS,
        'Send Jonathan the ID shown in RustDesk. When the connection request appears, tap <strong>Accept</strong>. Only accept a request you\'re expecting from Jonathan.',
        'Apple lets Jonathan view your screen but not tap for you, so you\'ll be guided through each step.',
      ],
    },
  };

  const root = document.getElementById('guide');
  if (!root) return;

  let current = null;
  let windowsHref = '/download/windows';
  let latestAvailable = true;

  function detect() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    if (/Windows/.test(ua)) return 'windows';
    if (/Macintosh/.test(ua)) return 'mac';
    if (/Linux|X11/.test(ua)) return 'linux';
    return null;
  }

  function fromHash() {
    const hash = location.hash.slice(1);
    return Object.prototype.hasOwnProperty.call(GUIDES, hash) ? hash : null;
  }

  // When the download service is unreachable, every link and command that depends on it is replaced.
  function view(guide) {
    if (latestAvailable || guide.action.kind === 'link') return guide;
    const first = `Click the button above. Under <strong>Assets</strong>, download ${guide.file}, then install it.`;
    return {
      ...guide,
      action: { kind: 'link', href: RELEASES, label: `Get RustDesk for ${guide.name}` },
      settings: true,
      steps: guide.settings ? [first, ...guide.steps.slice(1)] : [first, DESKTOP_SETTINGS, READY],
    };
  }

  async function copy(text, button) {
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
      button.classList.add('copied');
    } catch (err) {
      button.textContent = 'Select and copy';
    }
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copied');
    }, 1800);
  }

  function copyRow(label, value) {
    const row = document.createElement('div');
    row.className = 'copy-row';
    const text = document.createElement('div');
    text.className = 'copy-text';
    const name = document.createElement('span');
    name.textContent = label;
    const code = document.createElement('code');
    code.textContent = value;
    text.append(name, code);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', `Copy ${label}`);
    button.addEventListener('click', () => copy(value, button));
    row.append(text, button);
    return row;
  }

  function actionNode(guide) {
    const action = guide.action;
    if (action.kind === 'command') return copyRow('Setup command', action.command);
    const link = document.createElement('a');
    link.className = 'btn primary guide-cta';
    link.href = action.kind === 'download' && current === 'windows' ? windowsHref : action.href;
    link.textContent = action.label;
    if (action.kind === 'link') {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    return link;
  }

  function render() {
    const guide = GUIDES[current] && view(GUIDES[current]);
    const panel = root.querySelector('.guide-panel');
    root.querySelectorAll('.os-switch button').forEach((button) => {
      const active = button.dataset.os === current;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    panel.innerHTML = '';
    if (!guide) {
      const prompt = document.createElement('p');
      prompt.textContent = 'Choose your device above to get started.';
      panel.append(prompt);
      return;
    }
    const title = document.createElement('h2');
    title.className = 'guide-title';
    title.textContent = `Set up on ${guide.name}`;
    const action = document.createElement('div');
    action.className = 'guide-action';
    action.append(actionNode(guide));
    const steps = document.createElement('ol');
    steps.className = 'steps';
    guide.steps.forEach((step) => {
      const item = document.createElement('li');
      item.innerHTML = step;
      steps.append(item);
    });
    panel.append(title, action, steps);
    if (guide.settings) {
      const settings = document.createElement('div');
      settings.className = 'guide-settings';
      settings.append(
        copyRow('ID server', SERVER.id),
        copyRow('Relay server', SERVER.relay),
        copyRow('API server', SERVER.api),
        copyRow('Key', SERVER.key),
      );
      panel.append(settings);
    }
  }

  function select(os) {
    current = os;
    render();
  }

  const switcher = document.createElement('div');
  switcher.className = 'os-switch';
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('aria-label', 'Choose your device');
  Object.entries(GUIDES).forEach(([id, guide]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.os = id;
    button.textContent = guide.name;
    button.addEventListener('click', () => {
      history.replaceState(null, '', `#${id}`);
      select(id);
    });
    switcher.append(button);
  });
  const panel = document.createElement('div');
  panel.className = 'guide-panel';
  panel.setAttribute('aria-live', 'polite');
  const version = document.createElement('div');
  version.className = 'guide-version';
  root.replaceChildren(switcher, panel, version);

  window.addEventListener('hashchange', () => {
    const os = fromHash();
    if (os) select(os);
  });

  select(fromHash() || detect());

  if (detect() === 'windows' && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
    navigator.userAgentData.getHighEntropyValues(['architecture']).then((values) => {
      if (values.architecture === 'arm') {
        windowsHref = '/download/windows-arm';
        if (current === 'windows') render();
      }
    }).catch(() => {});
  }

  fetch('/api/latest', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('unavailable'))))
    .then((latest) => {
      version.textContent = `Latest version: RustDesk ${latest.version}`;
      if (!latest.platforms['windows-arm']) {
        windowsHref = '/download/windows';
        if (current === 'windows') render();
      }
    })
    .catch(() => {
      latestAvailable = false;
      version.textContent = 'Using RustDesk\'s official release page for now.';
      render();
    });
})();
