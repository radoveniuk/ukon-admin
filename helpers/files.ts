export const sendFile = (file?: File) => new Promise<string>((resolve, reject) => {
  if (!file) {
    return reject('file not found');
  };
  let formData = new FormData();
  formData.append('file', file);
  fetch('/api/files', { method: 'POST', body: formData }).then((res) => res.json()).then(({ filename }) => { resolve(filename); });
});