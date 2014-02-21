# noboxout-orm [![Build Status](https://secure.travis-ci.org/llafuente/noboxout-orm.png?branch=master)](http://travis-ci.org/llafuente/noboxout-orm)


## Introduction

First we will start with ORM ([Object-relational mapping](http://en.wikipedia.org/wiki/Object-relational_mapping)) definition.

```quote
Object-relational mapping (ORM, O/RM, and O/R mapping) in computer software is a programming technique for converting data between incompatible type systems in object-oriented programming languages. This creates, in effect, a "virtual object database" that can be used from within the programming language.
```

Basically the Glue between database and Javascript Objects.
And we all know that there are many glues in the market...

## Why Norm?

Transaction and coding style. No ORM has a good Classical inheritance but you can check the [class](https://github.com/llafuente/class) we use :)

Because you only need MYSQL and memcached. Because it's what we support.

## Define models

Let's start!

```js

    var Country,
        Session,
        User;

    Country = norm.define("Country", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        iso2: norm.String.LENGTH(2).NOTNULL,

        // this is the constructor.
        // if declared, need to call this.__parent()
        initialize: function () {
            this.__parent();
        }
    }, {
        // NOTE!!
        // Norm has column prefix.
        // It's highly recompensed to avoid collisions, norm didn't handle collisions (maybe never will)
        prefix: "cn_",

        // tableName is the Class name lowercased by default
        tableName: "countries"

        // primaryKey is "id" by default
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

## Model/Entity functions

**At Entity level**

* $create(Connection con = null)

  Create a new instance and assign a connection if passed.

* $unique(Array: columns, String: uq_name)

  Add a unique to definition

* $hasOne(Entity target_entity, Object options)

  Add a relation to target_entity given options.
  With this method can be mapped:
  * OneToOne unidirectional & bidirectional
  * OneToMany unidirectional & bidirectional

  options
    * *foreignKey* ForeignKey name, default: target_entity (prefix + pk)
    * *property* name in the root class
    * *unique*: foreignKey is unique. See [defining relations](#defining-relations)
    * *refColumn*: reference column for FK
    * *notNull*: can be the relation null? default: false
    * *eager*: fetch relation in root by default? default: false
    * *refEager*: fetch relation target entity by default? default: false

* $hasMany(Entity target_entity, Object options)

  Add a relation to target_entity given options.
  With this method can be mapped:
  * ManyToOne unidirectional & bidirectional

  same options as above.

* $get(String id_pk, Object options) -> Query

  Get Entity from cache/database.

  options:
    * eager: Boolean|Undefined
      undefined, default behavior as defined in the model
      false, no eager
      true, all eager


* $delete(String id_pk) -> Query

  Build a **Query** to delete a single row in database given the primary key.

* $find(Object: where) -> Query

  Build a **Query** to retrieve any number of rows.

  SQL Where is created by keys as columns *equals* values as value

* $search(String id_pk) -> Query

  Same as $find but treat Strings as LIKE-ABLE, to do a text search

  Notice that it could be slow...

* $exists(String id_pk) -> Query

  Perform a count to database (it's not cached!) to check if given primary key exists.

* $export(Entity entity, Array group = []) -> Object

  Serialize the Entity to a plain object. No relation exported.

  Use group to filter columns. See [GROUPS](#column-groups)

  Override this method to have custom behaviors.

  Should not be used directly, use the instance method $export, that will call this

* $exportRelation(Entity: entity, Relation: rel, array:group = []) -> Object
  
  Export given relation, by default loop every item and do $export.

  Override this method to have custom behaviors.

  Should not be used directly, use the instance method $export, that will call this

* $createTable -> String

  return the create table as string.

  It's recommended to use norm.sync()



**At Instance Level**


* $merge(Object obj, Array groups = null)

  "unserialize" an entity.

  Use group to filter columns. See [GROUPS](#column-groups)

* $export(groups, Boolean|Array: export_relations)

  Export current Entity to a plain object.

  Use group to filter columns. See [GROUPS](#column-groups)
  export_relations
    true, export all relations
    false, no export relations
    Array, list of relations to be included.

* $fetch (Array relations = null, Function callback)

  retrieve relations.

  relations
    relations null, all
    relations array, list of them to be included.


## <a name="defining-relations"></a>Define relations

Defining relations is made at the model/entity level using **hasOne** & **hasMany** (*there is no belongTo*, not needed, see the examples)

### OneToOne relation unidirectional
```js
var User = norm.define("User" /* ... */);
var Session = norm.define("Session" /* ... */);

User.hasOne(Session);

// equivalent to do:
User.hasOne(Session, {
    foreignKey: "sess_id", // Sessions' (prefix + pk)
    property: "session", // tableName
    unique: true, // OneToOne, key is unique
    refColumn: "id" // User's pk
});

// usage

var u = User.$create(); // notice $, we try to mark everything with "$" prefix
u.session = Session.$create();
// set vars
u.$store(norm_connection, function() {/*...*/});

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


## Log
noboxout-orm use noboxout-log.

Mute log
```js
    require("noboxout-orm").Norm.logMute = true
```

Adjust verbosity
```js
    require("noboxout-orm").Norm.logLevel = 4; // all
    require("noboxout-orm").Norm.logLevel = 3; // no verbose
    require("noboxout-orm").Norm.logLevel = 2; // no verbose, debug
    require("noboxout-orm").Norm.logLevel = 1; // no verbose, debug, warn
    require("noboxout-orm").Norm.logLevel = 0; // no verbose, debug, warn, error
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
