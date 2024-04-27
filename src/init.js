import * as yup from 'yup';
import i18n from 'i18next';
import resources from '../locales/index.js';
import locale from '../locales/yupLocale.js';
import watch from './watchers.js';
import axios from 'axios';

export default () => {
  const state = {
    form: {
      value: '',
      error: '',
    },
    feed: {
      urls: new Set(),
    },
    language: 'en',
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    textNodes: {
      heading: document.querySelector('h1[class="display-3 mb-0"]'),
      subheading: document.querySelector('p[class="lead"]'),
      RSSLink: document.querySelector('label[for="url-input"]'),
      readAllBtn: document.querySelector('a[class="btn btn-primary full-article"]'),
      closeModalBtn: document.querySelector('button[class="btn btn-secondary"]'),
      addBtn: document.querySelector('button[class="h-100 btn btn-lg btn-primary px-sm-5"]'),
      example: document.querySelector('p[class="mt-2 mb-0 text-muted"]'),
    },
  };

  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: state.language,
    resources,
  });
  yup.setLocale(locale);

  const schema = yup.string().url().required();

  const loadTranslation = () => {
    Object.keys(elements.textNodes)
      .forEach((nodeName) => {
        elements.textNodes[nodeName]
          .textContent = i18nextInstance.t(nodeName);
      });
  };

  loadTranslation();

  const watchedState = watch(elements, state, i18nextInstance);

  const getRss = (link) => {
    const parser = new DOMParser();
    fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        const parsedData = parser.parseFromString(data.contents, 'application/xml');
        const items = parsedData.querySelectorAll('item');
        items.forEach((item) => console.log(item.querySelector('title').textContent));
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.value = elements.input.value;
    schema.notOneOf(state.feed.urls)
      .validate(watchedState.form.value, { abortEarly: false })
      .then((url) => {
        watchedState.form.error = '';
        watchedState.feed.urls.add(url);
        elements.form.reset();
        elements.input.focus();
        getRss(watchedState.form.value);
      })
      .catch((err) => {
        const messages = err.errors.map((error) => i18nextInstance.t(`errors.${error.key}`));
        [watchedState.form.error] = messages;
      });
  });
  elements.input.focus();
};
