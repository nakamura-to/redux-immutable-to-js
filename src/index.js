import mapValues from 'lodash.mapValues';
import isPlainObject from 'lodash.isPlainObject';
import { Iterable } from 'immutable';

export function isImmutable(obj) {
  return Iterable.isIterable(obj);
}

export function toJS(obj) {
  return obj.toJS();
}

export function toJSDeep(obj) {
  /* eslint no-use-before-define: 0 */
  return mapValues(obj, convert);
}

export function convert(obj) {
  if (isImmutable(obj)) {
    return toJS(obj);
  } else if (isPlainObject(obj)) {
    return toJSDeep(obj);
  }
  return obj;
}

export default function immutableToJS() {
  return createStore => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    return {
      ...store,
      getState: () => {
        const state = store.getState();
        return convert(state);
      },
    };
  };
}
