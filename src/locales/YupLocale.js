export default {
  string: {
    url: () => ({ key: 'notUrl' }),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'exists' }),
  },
};
