import { assert } from 'chai';
import immutableToJS, { isImmutable, toJS, toJSDeep, convert } from '../src/index';
import { Map, List, Record } from 'immutable';

describe('index spec', () => {
  const map = Map({ a: 1, b: 2 });
  const list = List([1, 2]);
  const Person = Record({ name: 'hoge', age: 10 });
  const person = Person({ name: 'foo' });

  describe('isImmutable', () => {
    it('must return true if an argument is immutable', () => {
      assert.ok(isImmutable(map));
      assert.ok(isImmutable(list));
      assert.ok(isImmutable(person));
    });

    it('must return false if an argument is not immutable', () => {
      assert.notOk(isImmutable({}));
      assert.notOk(isImmutable([]));
      assert.notOk(isImmutable('a'));
      assert.notOk(isImmutable(0));
      assert.notOk(isImmutable(true));
    });
  });

  describe('toJS', () => {
    it('must convert an immutable object to a JS object', () => {
      assert.deepEqual(toJS(map), { a: 1, b: 2 });
      assert.deepEqual(toJS(list), [1, 2]);
      assert.deepEqual(toJS(person), { name: 'foo', age: 10 });
    });

    it('must fail to convert a JS object', () => {
      assert.throw(() => toJS({}));
    });
  });

  describe('toJSDeep', () => {
    it('must convert immutable children of plain object to JS objects recursively', () => {
      const level0 = {
        array: [3, 4],
        map,
        list,
        person,
        level1: {
          obj: { c: 3, d: 4 },
          map,
          list,
          person,
          level2: {
            string: 'hello',
            map,
            list,
            person,
          },
        },
      };
      assert.deepEqual(toJSDeep(level0), {
        array: [3, 4],
        map: { a: 1, b: 2 },
        list: [1, 2],
        person: { name: 'foo', age: 10 },
        level1: {
          obj: { c: 3, d: 4 },
          map: { a: 1, b: 2 },
          list: [1, 2],
          person: { name: 'foo', age: 10 },
          level2: {
            string: 'hello',
            map: { a: 1, b: 2 },
            list: [1, 2],
            person: { name: 'foo', age: 10 },
          },
        },
      });
    });
  });

  describe('convert', () => {
    it('must convert an immutable object to a JS object', () => {
      assert.deepEqual(convert(map), { a: 1, b: 2 });
    });

    it('must return a JS object as it is', () => {
      const array = [1, 2];
      assert.strictEqual(convert(array), array);
      assert.strictEqual(convert('hello'), 'hello');
      assert.strictEqual(convert(0), 0);
      assert.strictEqual(convert(true), true);
    });

    it('must convert immutable children of plain object to JS objects recursively', () => {
      const level0 = {
        array: [3, 4],
        map,
        list,
        person,
        level1: {
          obj: { c: 3, d: 4 },
          map,
          list,
          person,
          level2: {
            string: 'hello',
            map,
            list,
            person,
          },
        },
      };
      assert.deepEqual(toJSDeep(level0), {
        array: [3, 4],
        map: { a: 1, b: 2 },
        list: [1, 2],
        person: { name: 'foo', age: 10 },
        level1: {
          obj: { c: 3, d: 4 },
          map: { a: 1, b: 2 },
          list: [1, 2],
          person: { name: 'foo', age: 10 },
          level2: {
            string: 'hello',
            map: { a: 1, b: 2 },
            list: [1, 2],
            person: { name: 'foo', age: 10 },
          },
        },
      });
    });
  });

  describe('immutableToJS', () => {
    const handler = immutableToJS();

    it('must return a function to handle createStore', () => {
      assert.isFunction(handler);
      assert.strictEqual(handler.length, 1);
    });

    describe('finalCreateStore', () => {
      it('must replace `getState` function', () => {
        const originalStore = {
          getState: () => ({}),
        };
        const createStore = (reducer, initialState) => originalStore;
        const finalCreateStore = handler(createStore);
        const store = finalCreateStore(state => state);
        assert.notStrictEqual(originalStore, store);
        assert.notStrictEqual(originalStore.getState, store.getState);
        assert.isFunction(store.getState);
        assert.strictEqual(store.getState.length, 0);
      });

      describe('`getState`', () => {
        it('must convert immutable children of plain object to JS objects recursively', () => {
          const originalState = {
            map,
            list,
            object: {
              person,
            },
          };
          const originalStore = {
            getState: () => originalState,
          };
          const createStore = (reducer, initialState) => originalStore;
          const finalCreateStore = handler(createStore);
          const store = finalCreateStore(state => state);
          assert.deepEqual(store.getState(), {
            map: { a: 1, b: 2 },
            list: [1, 2],
            object: {
              person: { name: 'foo', age: 10 },
            },
          });
        });
      });
    });
  });
});
