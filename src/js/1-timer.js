import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("button[data-start]");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");


let userSelectedDate;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({ title: "Error", message: "Please choose a date in the future" });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
      }
    },
};


flatpickr(datetimePicker, options);

startButton.addEventListener("click", handlerClick);
function handlerClick() {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    const interval = setInterval(() => {
      const now = new Date();
      const timeDifference = userSelectedDate - now;

      if (timeDifference <= 0) {
          clearInterval(interval);
          datetimePicker.disabled = false;
          startButton.disabled = true;
          updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
      }

      const timeLeft = convertMs(timeDifference);
      updateDisplay(timeLeft);
      }, 1000);
    
};



function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}


function updateDisplay({ days, hours, minutes, seconds }) {
    daysSpan.textContent = addZero(days);
    hoursSpan.textContent = addZero(hours);
    minutesSpan.textContent = addZero(minutes);
    secondsSpan.textContent = addZero(seconds);
}

function addZero(value) {
    return String(value).padStart(2, "0");
}

document.addEventListener("DOMContentLoaded", () => {
    startButton.disabled = true;
});