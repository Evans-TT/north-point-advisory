import "./styles.css";

const target = new Date("2026-09-22T00:00:00+02:00").getTime();

const elements = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

const pad = (value) => String(value).padStart(2, "0");

function updateCountdown() {
  const distance = Math.max(0, target - Date.now());
  const values = {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };

  Object.entries(values).forEach(([unit, value]) => {
    const nextValue = pad(value);
    if (elements[unit].textContent !== nextValue) {
      elements[unit].textContent = nextValue;
      elements[unit].animate(
        [
          { opacity: 0.45, transform: "translateY(-0.08em)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 260, easing: "ease-out" },
      );
    }
  });

  if (distance === 0) {
    document.querySelector("#countdown-note").textContent = "We have arrived.";
  }
}

document.querySelector("#year").textContent = new Date().getFullYear();
updateCountdown();
setInterval(updateCountdown, 1_000);
