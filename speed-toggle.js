let isSpeedBoosted = false;

document.addEventListener('click', (event) => {
  const target = event.target;

  if (target.innerText.includes('3.0') || target.parentElement.innerText.includes('3.0')) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const vid = document.querySelector('video');
    if (vid) {
      if (!isSpeedBoosted) {
        vid.playbackRate = 3.0;
        isSpeedBoosted = true;
        console.log("Speed set to 3.0x");
      } else {
        vid.playbackRate = 1.0;
        isSpeedBoosted = false;
        console.log("Speed reset to 1.0x (Normal)");
      }
    }
  }
}, true);

console.log("Toggle script active: 3.0 button now toggles 3x speed.");

function triggerSpeedToggle() {
  const vid = document.querySelector('video');
  if (vid && !isSpeedBoosted) {
    vid.playbackRate = 3.0;
    isSpeedBoosted = true;
    console.log("Speed set to 3.0x");
  }
}

const observer = new MutationObserver(() => {
  triggerSpeedToggle();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
