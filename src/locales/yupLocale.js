export default {
  string: {
    url: () => ({ key: 'invalid' }),
  },
  mixed: {
    notOneOf: () => ({ key: 'alreadyExists' }),
    required: () => ({ key: 'required' }),
  },
};
