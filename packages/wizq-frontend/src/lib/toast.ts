import Toastify from 'toastify-js';

export const errorToast = (message: string): void => {
  console.error(`Toast: ${message}`);

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'bottom', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: '#ED4756',
    },
  }).showToast();
};

export const succesToast = (message: string): void => {
  console.log(`Toast: ${message}`);

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'bottom', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: '#34BE6D',
    },
  }).showToast();
};
