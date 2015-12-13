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
  return mapValues(obj, value => convert(value));
}

export function convert(any) {
  if (isImmutable(any)) {
    return toJS(any);
  } else if (isPlainObject(any)) {
    return toJSDeep(any);
  }
  return any;
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
