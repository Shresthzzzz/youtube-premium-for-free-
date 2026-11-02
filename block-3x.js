let is3x = false;

function toggle3x() {
  const vid = document.querySelector('video');
  if (vid) {
    if (!is3x) {
      vid.playbackRate = 3.0;
      is3x = true;
      console.log("[YouTube Premium] Speed set to 3.0x");
    } else {
      vid.playbackRate = 1.0;
      is3x = false;
      console.log("[YouTube Premium] Speed reset to 1.0x (Normal)");
    }
  }
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!target) return;
  const text = target.innerText || '';
  const parentText = target.parentElement ? target.parentElement.innerText || '' : '';

  if (text.includes('3.0') || parentText.includes('3.0')) {
    event.stopImmediatePropagation();
    event.preventDefault();
    toggle3x();
  }
}, true);

// Quick hotkey: Alt + 3 toggles 3x playback speed
document.addEventListener('keydown', (event) => {
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable)) {
    return;
  }
  if ((event.altKey && event.key === '3') || (event.shiftKey && event.key === '#')) {
    toggle3x();
  }
});

console.log("[YouTube Premium] Speed toggle script active (click '3.0' or press Alt+3).");
