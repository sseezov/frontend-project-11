import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from '../locales/index.js';

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
    language: 'en',
  };

  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: state.language,
    resources,
  });

  const schema = yup.string().url().required();

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    textNodes: {
      heading: document.querySelector('h1[class="display-3 mb-0"]'),
      subheading: document.querySelector('p[class="lead"]'),
      RSSLink: document.querySelector('label[for="url-input"]'),
    },
  };

  const loadTranslation = () => {
    Object.keys(elements.textNodes)
      .forEach((node) => { elements.textNodes[node].textContent = i18nextInstance.t(node); });
  };

  loadTranslation();

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
