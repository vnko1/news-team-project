import { Report } from 'notiflix/build/notiflix-report-aio';
import { Spinner } from 'spin.js';
import 'spin.js/spin.css';

export const spinner = new Spinner({
  color: '#A8A8A8',
  position: 'fixed',
  top: '50vh',
  left: '50vw',
});
