document.getElementById("getTitle").addEventListener("click", function (e) {
  const button = this;
  const titleCard = document.getElementById("titleCard");
  const titleElement = document.getElementById("title");

  // Add loading state
  button.classList.add("loading");
  button.textContent = "Fetching...";

  // Create sparkle effect
  createSparkles(e);

  // Simulate slight delay for animation effect
  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        titleElement.textContent = tabs[0].title;
        titleCard.classList.remove("show");
        // Force reflow to restart animation
        void titleCard.offsetWidth;
        titleCard.classList.add("show");
      } else {
        titleElement.textContent = "No active tab found.";
        titleCard.classList.add("show");
      }

      // Remove loading state
      button.classList.remove("loading");
      button.textContent = "Get Tab Title";
    });
  }, 300);
});

function createSparkles(e) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();

  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const angle = (Math.PI * 2 * i) / 8;
    const distance = 30 + Math.random() * 20;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    sparkle.style.cssText = `
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;

    button.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
  }
}
