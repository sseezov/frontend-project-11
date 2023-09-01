import * as yup from "yup";

const schema = yup.string().matches(
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)$/, 'введите правильный адрес')

export default (str) => schema.validate(str);