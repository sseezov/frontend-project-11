import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from '../locales/index.js';

export default () => {
  const state = {
    form: {
      value: '',
      error: '',
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

  const schema = yup.string().url().required().notOneOf(state.feed.urls);

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
      .forEach((nodeName) => {
        elements.textNodes[nodeName]
          .textContent = i18nextInstance.t(nodeName);
      });
  };

  loadTranslation();

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.error':
        if (watchedState.form.error) {
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
    schema.notOneOf(state.feed.urls)
      .validate(watchedState.form.value, { abortEarly: false })
      .then((url) => {
        watchedState.form.error = '';
        watchedState.feed.urls.push(url);
        elements.form.reset();
        elements.input.focus();
      })
      .catch((err) => { [watchedState.form.error] = err.errors; });
  });
  elements.input.focus();
};
