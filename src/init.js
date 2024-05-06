import * as yup from 'yup';
import i18n from 'i18next';
import resources from '../locales/index.js';
import locale from '../locales/yupLocale.js';
import watch from './watchers.js';

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
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
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
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        if (data.status.http_code === 404) throw new Error('noData');
        const parsedData = parser.parseFromString(data.contents, 'application/xml');
        const title = parsedData.querySelector('title');
        const description = parsedData.querySelector('description');
        console.log(title, description);
        const items = parsedData.querySelectorAll('item');
        const itemsInfo = Array.from(items).map((item) => ({
          title: item.querySelector('title').textContent,
          description: item.querySelector('description').textContent,
        }));
        const card = document.createElement('div');
        card.classList.add('card', 'border-0');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('card-title', 'h4');
        cardTitle.textContent = i18nextInstance.t('posts');
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'border-0', 'rounded-0');
        cardBody.append(cardTitle);
        card.append(cardBody);
        elements.posts.append(card, ul);

        itemsInfo.forEach((item) => {
          const li = document.createElement('li');
          li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
          const a = document.createElement('a');
          a.classList.add('fw-bold');
          a.textContent = item.title;
          const btn = document.createElement('button');
          btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
          btn.textContent = i18nextInstance.t('preview');
          li.append(a, btn);
          ul.appendChild(li);
        });
      })
      .catch((err) => {
        console.log(err, i18nextInstance.t(`errors.${err.message}`));
        watchedState.form.error = i18nextInstance.t(`errors.${err.message}`);
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
