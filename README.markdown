# noboxout-orm [![Build Status](https://secure.travis-ci.org/llafuente/noboxout-orm.png?branch=master)](http://travis-ci.org/llafuente/noboxout-orm)


## Introduction

Noboxout ORM (norm)

Do not use it yet. I will complete the README when it's stable.
I'm working on it (maybe not right now, but daily...)

## TODO list

* storage: memory
* memcached
* transaction support
* pool handling
* only update changes
* many more tests

## Define models

Usage of prefix.
Prefix is needed by *norm* because it do not handle field name collisions.
We consider a bad practice to have in your database the same field name twice, mainly because it force the ORM to query everything and remap later. Also because we are lazy "*SELECT * FROM X JOIN Y*" will never give an error this way. 


```js 

    var Country,
        Session,
        User;

    Country = norm.define("Country", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        iso2: norm.String.LENGTH(2),

        // this is the constructor.
        // if declared, need to call this.__parent()
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "cn_",
        tableName: "countries"

        // notes:
        // primaryKey is "id" by default
        // tableName is the Class name lowercased by default
    });

    Session = norm.define("Session", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        start_date: norm.Date.NOTNULL,
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "sess_",
        tableName: "sessions"
    });

    User = norm.define("User", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        login: norm.String.LENGTH(100),
        pwd: norm.String.LENGTH(52),
        email: norm.String.LENGTH(255),
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "user_",
        tableName: "users"
    });


```

## Define relations

Defining relations is made at the model using **hasOne** & **hasMany** (*there is no belongTo*, not needed)

### OneToOne relation unidirectional
```js
var User = norm.define("User" /* ... */);
var Session = norm.define("Session" /* ... */);

User.hasOne(Session);

// equivalent to do:
User.hasOne(Session, {
    foreignKey: "sess_id",
    property: "session",
    unique: true,
    refColumn: "id"
});
```

### OneToOne relation bidirectional
```js
var User = norm.define("User" /* ... */);
var Session = norm.define("Session" /* ... */);

User.hasOne(Session, {refProperty: "owner"});

```

### ManyToOne relation unidirectional
```js
var Person = norm.define("Person" /* ... */);
var Country = norm.define("Country" /* ... */);

Person.hasOne(Country, {unique: false});

```

### ManyToOne relation bidirectional
```js
var Person = norm.define("Person" /* ... */);
var Country = norm.define("Country" /* ... */);

Person.hasOne(Country, {unique: false, refProperty: "citizens"});

```


### OneToMany *self-relation* unidirectional
```js
var User = norm.define("User" /* ... */);

User.hasMany(User, {property: "mentors", foreignKey: "mentor_id"});

```

### OneToMany *self-relation* bidirectional
```js
var User = norm.define("User" /* ... */);

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
