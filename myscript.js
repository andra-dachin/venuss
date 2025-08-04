function goToPage(page) {
    document.body.style.transition = "opacity 0.5s";
    document.body.style.opacity = 0;
  
    setTimeout(function() {
      window.location.href = page;
    }, 500);
  }
  document.getElementById('homeBtn').addEventListener('click', () => goToPage('index.html'));

 const debugEl = document.getElementById('debug');
const iconMap = ["Simin", "2", "tren", "film", "matcha", "cireșe", "flamingo", "churros", "schueheps"];
const icon_height = 79;
const num_icons = 9;
const time_per_icon = 100;
const indexes = [0, 0, 0];

const roll = (reel, offset = 0) => {
  const delta = (offset + 2) * num_icons + Math.floor(Math.random() * num_icons);
  return new Promise((resolve) => {
    const style = getComputedStyle(reel);
    const currentPos = parseFloat(style.backgroundPositionY) || 0;
    const targetPos = currentPos + delta * icon_height;
    const normalizedPos = targetPos % (num_icons * icon_height);

    setTimeout(() => {
      reel.style.transition = `background-position-y ${(8 + delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
      reel.style.backgroundPositionY = `${targetPos}px`;
    }, offset * 150);

    setTimeout(() => {
      reel.style.transition = 'none';
      reel.style.backgroundPositionY = `${normalizedPos}px`;
      resolve(delta % num_icons);
    }, (8 + delta) * time_per_icon + offset * 150);
  });
};

const rollAll = () => {
  debugEl.textContent = 'rolling...';
  const reels = document.querySelectorAll('.slots .reel');

  Promise.all([...reels].map((reel, i) => roll(reel, i)))
    .then((deltas) => {
      deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);
      const result = indexes.map(i => iconMap[i]);
      debugEl.textContent = result.join(' - ');

      const slotEl = document.querySelector('.slots');
      slotEl.classList.remove("win1", "win2");

      if (indexes[0] === indexes[1] && indexes[1] === indexes[2]) {
  // toate 3 sunt egale → win2
  slotEl.classList.add("win2");
  setTimeout(() => slotEl.classList.remove("win2"), 2000);
} else if (indexes[0] === indexes[1] || indexes[1] === indexes[2]||indexes[0]===indexes[2]) {
  // doar 2 consecutive egale → win1
  slotEl.classList.add("win1");
  setTimeout(() => slotEl.classList.remove("win1"), 2000);
}


      setTimeout(rollAll, 3000);
    });
};

setTimeout(rollAll, 1000);

