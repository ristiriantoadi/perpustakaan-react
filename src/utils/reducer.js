import {
    GET_DATA,
    DELETE_BOOK,
    POST_BOOK,
    SEACRH_BOOK,
    UPDATE_BOOK,
    DELETE_MEMBER,
    POST_MEMBER,
    SEACRH_MEMBER,
    UPDATE_MEMBER,
  } from './types';
  
  export function reducer(state, action) {
    switch (action.type) {
      case GET_DATA:
        return {
          ...state,
          book: action.book,
          member: action.member,
          loading: action.loading,
        };
      case POST_BOOK:
        return {
          ...state,
          loading: action.loading,
        };
      case DELETE_BOOK:
        return {
          ...state,
          loading: action.loading,
        };
      case UPDATE_BOOK:
        return {
          ...state,
          loading: action.loading,
        };
      case SEACRH_BOOK:
        return {
          ...state,
          loading: action.loading,
        };
      case POST_MEMBER:
        return {
          ...state,
          loading: action.loading,
        };
      case DELETE_MEMBER:
        return {
          ...state,
          loading: action.loading,
        };
      case UPDATE_MEMBER:
        return {
          ...state,
          loading: action.loading,
        };
      case SEACRH_MEMBER:
        return {
          ...state,
          loading: action.loading,
        };
      default:
        throw new Error('Unexpected action');
    }
  }