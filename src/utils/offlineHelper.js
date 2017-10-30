function offlineHelper() {
  window.addEventListener('offline', () => {
    document.body.style.filter = 'grayscale(1)';
  });

  window.addEventListener('online', () => {
    document.body.style.filter = 'grayscale(0)';
  });
  if (window && window.navigator && window.navigator) {
    document.body.style.filter = (window.navigator.onLine) ? 'grayscale(0)' : 'grayscale(1)';
  }
}

export default offlineHelper;
