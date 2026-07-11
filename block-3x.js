let is3x = false;

document.addEventListener('click', (event) => {
  const target = event.target;

  if (target.innerText.includes('3.0') || (target.parentElement && target.parentElement.innerText.includes('3.0'))) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const vid = document.querySelector('video');
    if (vid) {
      if (!is3x) {
        vid.playbackRate = 3.0;
        is3x = true;
        console.log("Speed set to 3.0x");
      } else {
        vid.playbackRate = 1.0;
        is3x = false;
        console.log("Speed reset to 1.0x (Normal)");
      }
    }
  }
}, true);

console.log("Toggle script active: 3.0 button now toggles between 3x and 1x.");
