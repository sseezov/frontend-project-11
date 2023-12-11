import i18next from 'i18next';
import resources from './locales/resources.js';
import * as yup from 'yup';
import locale from './locales/yupLocale.js';
import watch from './watchers.js';
import axios from 'axios';
import parse from './rss.js';

const loadRss = (url) => {
  const urlWithProxy = addProxy(url);
  return axios.get(urlWithProxy, { timeout: 1000 })
}

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};


export default () => {

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-form input'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('.rss-form button[type="submit"]'),
  };

  const state = {
    form: {
      error: null,
      status: 'filling',
      valid: false,
    }
  }

  const i18nextInstance = i18next.createInstance();

  const promise = i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    yup.setLocale(locale);

    const baseUrlSchema = yup.string().url().required();

    const validateUrl = (url) => {
      // только асинхронные функции
      return baseUrlSchema.validate(url)
        .then(() => null)
        .catch((e) => e.message);
    };

    const watchedState = watch(elements, state, i18nextInstance);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const url = data.get('url');

      validateUrl(url)
        .then((error) => {
          if (!error) {
            watchedState.form = {
              ...watchedState.form,
              valid: true,
              error: null,
            };
            console.log(url)
            loadRss(url).then((data)=>console.log(data));
          } else {
            watchedState.form = {
              ...watchedState.form,
              valid: false,
              error: error.key,
            };
          }
        });
    });
  })
  return promise;
}
