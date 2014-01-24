# noboxout-orm [![Build Status](https://secure.travis-ci.org/llafuente/noboxout-orm.png?branch=master)](http://travis-ci.org/llafuente/noboxout-orm)


## Introduction

Noboxout ORM (norm)

Do not use it yet. I will complete the README when it's stable.
I'm working on it (maybe not right now, but daily...)

## Done

* hasOne unidirectional and bidirectional

## TODO list

* storage: memory

## Define models


## Define relations

### OneToOne relation unidirectional
```js
var User = norm.define("User", {});
var Session = norm.define("Session", {});

User.hasOne(Session);

```

### OneToOne relation bidirectional
```js
var User = norm.define("User", {});
var Session = norm.define("Session", {});

User.hasOne(Session, {refProperty: "owner"});

```

### ManyToOne relation unidirectional
```js
var Person = norm.define("Person", {});
var Country = norm.define("Country", {});

Person.hasOne(Country, {unique: false});

```

### ManyToOne relation bidirectional
```js
var Person = norm.define("Person", {});
var Country = norm.define("Country", {});

Person.hasOne(Country, {unique: false, refProperty: "citizens"});

```


### ManyToOne self-relation unidirectional
```js
var User = norm.define("User", {});

User.hasMany(User, {property: "mentors", foreignKey: "mentor_id"});

```

### ManyToOne self-relation bidirectional
```js
var User = norm.define("User", {});

User.hasMany(User, {property: "mentors", foreignKey: "mentor_id", refProperty: "mentee"});

```


## Install

With [npm](http://npmjs.org) do:

```

npm install node-class

```

## test (travis-ci ready!)


```

npm test
// or
cd /test
node test-class.js

```

## license


MIT.
