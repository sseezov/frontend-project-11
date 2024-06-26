/* eslint-disable no-param-reassign */
const setModal = (elements, post) => {
  const {
    modal,
    modalTitle,
    modalBody,
    modalBtnClose,
    modalBtnCloseCross,
    readAllhref,
  } = elements;
  const { title, description, href } = post;

  modalTitle.textContent = title;
  modalBody.textContent = description;
  modal.classList.add('show');
  modal.style = 'display:block';
  const closeModal = () => {
    modal.classList.remove('show');
    modal.style = '';
  };
  readAllhref.setAttribute('href', href);
  [modalBtnClose, modalBtnCloseCross].forEach((elem) => {
    elem.addEventListener('click', closeModal);
  });
};

const createCard = (i18nextInstance, type) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nextInstance.t(type);
  cardBody.append(cardTitle);
  card.append(cardBody);
  return card;
};

const renderPosts = (watchedState, elements, i18nextInstance) => {
  elements.posts.innerHTML = '';
  const postsCard = createCard(i18nextInstance, 'posts');
  const postsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.posts.append(postsCard, postsUl);

  watchedState.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    if (post.readed) {
      a.classList.add('fw-normal', 'link-secondary');
    } else a.classList.add('fw-bold');
    a.setAttribute('data-id', post.id);
    a.textContent = post.title;
    const btn = document.createElement('button');
    btn.setAttribute('data-id', post.id);
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.textContent = i18nextInstance.t('preview');
    li.append(a, btn);
    postsUl.appendChild(li);
  });

  postsUl.addEventListener('click', (e) => {
    if (e.target.nodeName === 'BUTTON') {
      const a = e.target.parentElement.querySelector('a');
      a.classList.add('fw-normal', 'link-secondary');
      a.classList.remove('fw-bold');
      const { id } = a.dataset;
      watchedState.posts.forEach((post) => {
        if (post.id === id) {
          post.readed = true;
        }
      });

      const titleText = e.target.parentElement.querySelector('a').textContent;
      watchedState.posts.forEach((post) => {
        if (post.title === titleText) {
          setModal(elements, post);
        }
      });
    }
  });
};

const renderFeeds = (watchedState, elements, i18nextInstance) => {
  elements.feeds.innerHTML = '';
  const feedsCard = createCard(i18nextInstance, 'feeds');
  const feedsUl = document.createElement('ul');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.feeds.append(feedsCard, feedsUl);
  watchedState.feeds.forEach((feed) => {
    const feedsLi = document.createElement('li');
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedsH3 = document.createElement('h3');
    feedsH3.classList.add('h6', 'm-0');
    feedsH3.textContent = feed.title;
    const feedsP = document.createElement('p');
    feedsP.classList.add('m-0', 'small', 'text-black-50');
    feedsP.textContent = feed.description;
    feedsLi.append(feedsH3, feedsP);
    feedsUl.append(feedsLi);
  });
};

export {
  setModal, createCard, renderFeeds, renderPosts,
};
