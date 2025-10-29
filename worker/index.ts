

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data.payload;
    (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(title, {
      body,
      icon,
    });
  }
});
