const blockClick = (event) => {
  if (event.target.innerText.includes('3.0') || event.target.parentElement.innerText.includes('3.0')) {
    event.stopImmediatePropagation();
    event.preventDefault();
    console.log("3.0 click blocked.");
  }
};

document.addEventListener('click', blockClick, true);
console.log("Click interceptor active.");
