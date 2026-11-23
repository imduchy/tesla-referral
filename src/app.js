// Copy-to-clipboard for the referral code, plus a GoatCounter event.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const label = button.textContent;
    let timer;

    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Clipboard API unavailable: select the code so the visitor can copy it manually.
        const code = document.getElementById('referral-code');
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }

      button.textContent = button.dataset.copiedLabel;
      clearTimeout(timer);
      timer = setTimeout(() => { button.textContent = label; }, 2000);

      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: 'copy-code', title: 'Referral code copied', event: true });
      }
    });
  });

  // Close the language menu when clicking outside it or pressing Escape.
  const menu = document.querySelector('.lang-menu');
  if (menu) {
    document.addEventListener('click', (e) => { if (!menu.contains(e.target)) menu.open = false; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') menu.open = false; });
  }
});
