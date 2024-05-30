import * as yup from 'yup';
import i18n from 'i18next';
import resources from '../locales/index.js';
import locale from '../locales/yupLocale.js';
import watch from './watchers.js';
import getRss, { parseRss } from './rss.js';

export default () => {
  const state = {
    form: {
      value: '',
      error: '',
    },
    urls: new Set(),
    feeds: [],
    posts: [],
    language: 'ru',
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalBtnClose: document.querySelector('button[class="btn btn-secondary"]'),
    modalBtnCloseCross: document.querySelector('button[class="btn-close close"]'),
    modalBtnReadMore: document.querySelector('.full-article'),
    readAllhref: document.querySelector('a[class="btn btn-primary full-article"]'),
    textNodes: {
      heading: document.querySelector('h1[class="display-3 mb-0"]'),
      subheading: document.querySelector('p[class="lead"]'),
      RSSLink: document.querySelector('label[for="url-input"]'),
      readAllBtn: document.querySelector('a[class="btn btn-primary full-article"]'),
      modalBtnClose: document.querySelector('button[class="btn btn-secondary"]'),
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

  const checkRssUpdates = (watchedState, time) => {
    if (watchedState.feeds.length > 0) {
      Array.from(watchedState.urls)
        .map((url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
          .then((response) => response.json())
          .then((data) => {
            const { posts } = parseRss(data);
            const postTitles = watchedState.posts.map((post) => post.title);
            const uniquePosts = posts.filter((newPost) => !postTitles.includes(newPost.title));
            const updatedPosts = watchedState.posts.concat(uniquePosts);
            // eslint-disable-next-line no-param-reassign
            watchedState.posts = updatedPosts;
          })
          .catch((e) => console.log(e)));
    }
    setTimeout(() => checkRssUpdates(watchedState, time), time);
  };

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

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.value = elements.input.value.trim();
    schema.notOneOf(state.urls)
      .validate(watchedState.form.value, { abortEarly: false })
      .then((url) => {
        watchedState.form.error = '';
        watchedState.urls.add(url);
        elements.form.reset();
        elements.input.focus();
        getRss(watchedState.form.value, i18nextInstance, watchedState);
      })
      .catch((err) => {
        const messages = err.errors.map((error) => i18nextInstance.t(`errors.${error.key}`));
        [watchedState.form.error] = messages;
      });
  });
  elements.input.focus();

  elements.input.addEventListener('invalid', (e) => {
    if (e.target.value.length === 0) {
      e.target.setCustomValidity(i18nextInstance.t('errors.required'));
    }
  });
  elements.input.addEventListener('input', (e) => {
    e.target.setCustomValidity('');
  });
  checkRssUpdates(watchedState, 5000);
};
