import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const customerInputEl = document.getElementById('datetime-picker');

const options = {
  enableTime: false,
  time_24hr: true,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    ms = selectedDate - options.defaultDate;

    if (ms < 0) {
      Report.warning('Please choose a date in the future');
    } else startBtnEl.disabled = false;

    return;
  },
};

flatpickr(customerInputEl, options);