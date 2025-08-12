// Basic JS for TimeShareZ static site

document.addEventListener("DOMContentLoaded", () => {
  console.log("TimeShareZ loaded");

  // Support button click
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(`"${btn.innerText}" clicked`);
    });
  });
});
