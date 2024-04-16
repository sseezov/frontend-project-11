import onChange from 'on-change';
import * as yup from 'yup';

export default () => {
  const state = {
    form: {
      value: '',
      error: '',
      status: 'filling',
    },
    feed: {
      urls: [],
    },
  };

  const schema = yup.string().url().required();

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.error':
        if (watchedState.form.error.length > 0) {
          elements.input.classList.add('is-invalid');
          elements.feedback.textContent = watchedState.form.error;
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.add('text-danger');
        } else {
          elements.input.classList.remove('is-invalid');
          elements.feedback.textContent = 'RSS успешно загружен';
          elements.feedback.classList.add('text-success');
          elements.feedback.classList.remove('text-danger');
        }
        break;
      default:
        console.log(path);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.value = elements.input.value;
    schema.validate(watchedState.form.value, { abortEarly: false })
      .then((url) => {
        watchedState.form.error = [];
        if (watchedState.feed.urls.includes(url)) {
          watchedState.form.error = 'RSS уже существует';
        } else watchedState.feed.urls.push(url);
        elements.form.reset();
        elements.input.focus();
      })
      .catch((err) => { [watchedState.form.error] = err.errors; });
  });
  elements.input.focus();
};
