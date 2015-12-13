Redux Immutable to JS
=============================

A proxy creator for Redux store to convert immutable objects to JS objects.

## Motivation

Redux Immutable to JS allows you to convert immutable objects to JS objects
automatically when Redux state is required outside reducers.

This library is inspired by [Immutable Data Structures and JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript).

> If you are using Immutable.js in a
specific part of your system, don't make anything outside of it access the
data structures directly. A good example is Redux and it's single atom app state.
If the app state is an Immutable.js object, don't force React components to
use Immutable.js' API directly.

## Installation

```sh
npm install --save redux-immutable-to-js
```

## Example App

```sh
$ cd example
$ npm install
$ npm start
```

## Examples of Use

### Simple

```js
import { createStore } from 'redux';
import immutableToJS from 'redux-immutable-to-js'
import rootReducer from './reducers/index';

// create a store that has redux-immutable-to-js enabled
const finalCreateStore = immutableToJS()(createStore);

const store = finalCreateStore(rootReducer);
```

### Composition

```js
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import immutableToJS from 'redux-immutable-to-js'
import rootReducer from './reducers/index';

// create a store that has redux-thunk middleware and redux-immutable-to-js enabled
const finalCreateStore = compose(
  applyMiddleware(thunk),
  immutableToJS()
)(createStore)

const store = finalCreateStore(rootReducer);
```

## License

MIT
