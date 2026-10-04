/* Google Analytics: basic consent mode. No Google requests before consent. */
(function () {
  'use strict';
  const config = document.currentScript.dataset;
  const measurementId = config.measurementId;
  const polish = document.documentElement.lang === 'pl';
  const key = 'analytics-consent-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  let accepted = false;
  let started = false;
  let panel;
  let settings;
  const showSettings = /^\/polityka-prywatnosci(?:\.html)?\/?$/.test(location.pathname);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved && Date.now() - saved.time < maxAge &&
        ['accepted', 'rejected'].includes(saved.choice) ? saved.choice : null;
    } catch (_) { return null; }
  }
  function start() {
    if (started || !['goproject.com.pl', 'www.goproject.com.pl'].includes(location.hostname)) return;
    started = true;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    // Do not send query strings, fragments, form fields or contact details.
    window.gtag('config', measurementId, {
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? document.referrer.split(/[?#]/)[0] : '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(tag);
  }
  function clearCookies() {
    const names = document.cookie.split(';').map(c => c.split('=')[0].trim()).filter(n => /^_ga(?:_|$)/.test(n));
    const parts = location.hostname.split('.');
    const domains = ['', location.hostname];
    for (let i = 1; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'));
    names.forEach(name => domains.forEach(domain => {
      document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
    }));
  }
  function choose(choice) {
    const wasStarted = started;
    accepted = choice === 'accepted';
    try { localStorage.setItem(key, JSON.stringify({ choice: choice, time: Date.now() })); } catch (_) {}
    panel.hidden = true;
    settings.hidden = !showSettings;
    if (accepted) start();
    else {
      window['ga-disable-' + measurementId] = true;
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
      clearCookies();
      // Unload an already-running tag when consent is withdrawn.
      if (wasStarted) location.reload();
    }
    if (accepted) window['ga-disable-' + measurementId] = false;
    if (showSettings) settings.focus({ preventScroll: true });
    else if (document.activeElement && panel.contains(document.activeElement)) document.activeElement.blur();
  }
  const saved = readChoice();
  accepted = saved === 'accepted';
  if (accepted) start();
  function render() {
    const style = document.createElement('style');
    style.textContent = `
      .analytics-choice{position:fixed;left:20px;bottom:20px;z-index:10000;width:min(460px,calc(100vw - 40px));padding:24px;background:var(--bg2,#fff);color:var(--text,#111);border:1px solid var(--border,#d1d5db);box-shadow:0 8px 32px #0002;border-radius:8px;font-family:inherit;text-align:left}
      .analytics-choice[hidden],.analytics-settings[hidden]{display:none!important}
      .analytics-choice h2{font-size:18px;font-weight:700;line-height:1.3;margin:0 0 12px}
      .analytics-choice p{font-size:14px;line-height:1.55;margin:0 0 16px}
      .analytics-choice a{color:inherit;text-decoration:underline}
      .analytics-choice-actions{display:flex;gap:10px}
      .analytics-choice button{flex:1;padding:11px 12px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;font-size:13px;font-weight:600;line-height:1.35;cursor:pointer;border-radius:4px}
      .analytics-choice button:focus-visible,.analytics-settings:focus-visible{outline:3px solid #2563eb;outline-offset:3px}
      .analytics-settings{position:static;margin:12px 0 0;padding:0;border:0;background:transparent;color:inherit;font:inherit;font-size:12px;line-height:1.4;text-decoration:underline;cursor:pointer}
      @media(max-width:480px){.analytics-choice{left:12px;bottom:12px;width:calc(100vw - 24px);padding:20px}.analytics-choice-actions{flex-direction:column}}
    `;
    document.head.appendChild(style);
    panel = document.createElement('section');
    panel.className = 'analytics-choice';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'analytics-choice-title');
    const title = polish ? 'Analityczne pliki cookies' : 'Analytics cookies';
    const description = polish
      ? 'Za Twoją zgodą używamy Google Analytics, aby sprawdzać, jak odwiedzający korzystają ze strony. Możesz odmówić lub zmienić wybór w dowolnej chwili.'
      : 'With your permission, we use Google Analytics to understand how visitors use this website. You can decline or change your choice at any time.';
    panel.innerHTML = '<h2 id="analytics-choice-title">' + title + '</h2><p>' + description +
      ' <a href="' + config.privacyUrl + '">' + (polish ? 'Polityka prywatności' : 'Privacy notice') + '</a>.</p>' +
      '<div class="analytics-choice-actions"><button type="button" data-choice="rejected">' +
      (polish ? 'Odrzuć analityczne' : 'Decline analytics') + '</button><button type="button" data-choice="accepted">' +
      (polish ? 'Zezwól na analityczne' : 'Allow analytics') + '</button></div>';
    panel.hidden = saved !== null;
    panel.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => choose(button.dataset.choice)));
    document.body.appendChild(panel);
    settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'analytics-settings';
    settings.textContent = polish ? 'Ustawienia cookies' : 'Cookie settings';
    settings.hidden = !showSettings || saved === null;
    settings.addEventListener('click', () => {
      panel.hidden = false;
      settings.hidden = true;
      panel.querySelector('button').focus({ preventScroll: true });
    });
    if (showSettings) (document.querySelector('main') || document.body).appendChild(settings);
    document.addEventListener('click', event => {
      if (!accepted) return;
      const link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      const type = /^tel:/i.test(href) ? 'phone' : /^mailto:/i.test(href) ? 'email' : null;
      if (type) window.gtag('event', 'contact_click', { contact_type: type });
    });
    document.addEventListener('website:lead-sent', () => {
      if (accepted) window.gtag('event', 'generate_lead', { method: 'contact_form' });
    });
    window.addEventListener('storage', event => {
      if (event.key === key && readChoice() !== (accepted ? 'accepted' : 'rejected')) location.reload();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
