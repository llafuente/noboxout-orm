# noboxout-orm [![Build Status](https://secure.travis-ci.org/llafuente/noboxout-orm.png?branch=master)](http://travis-ci.org/llafuente/noboxout-orm)

![NPM](https://nodei.co/npm/noboxout-orm.png?compact=true)

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

## Norm object

norm = require("noboxout-orm").Norm;

* setup(Object: configuration)

```js
  norm.setup({
      mysql: {
          host     : "127.0.0.1",
          user     : "travis",
          password : "",
          database: "norm_test"
      },
      memcached: {
          host: "127.0.0.1",
          port: 11211,
          config: {
              poolSize: 25
          }
      }
  });
```

* define(String entity_name, Object class_definition, Object table_definition)

  Define a model.
  All models are stored in **norm.models** with the given entity_name (case-sensitive)
  All table definitions are stored are **norm.tables**

* reserve(callback(Error err, Connection con))

  Reserve a new connection to database and memcached

  If you are working on a HTTP server environment, this should be call at the beginning of a request.

* release(Connection con)

  Release given connection

* sync

  Synchronize database schema, *DROPPING EVERYTHING FIRST*, there is no incremental sync (and no plans)

## Define models

Let's start!

```js

    var User;

    User = norm.define("User", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        login: norm.String.LENGTH(100),
        // sha1 in binary
        password: norm.String.Binary(64),
        email: norm.String.LENGTH(255),

        // you can define more properties that wont be mapped
        online: true,

        // this is the constructor.
        // if declared, remember to call this.__parent(data)
        initialize: function (data) {
            this.__parent(data);

            // do your staff
        }
    }, {
        // NOTE!!
        // Norm has column prefix.
        // It's highly recommended to avoid collisions
        // norm didn't handle collisions (maybe never will)
        prefix: "user_",

        // tableName is the Class name lowercased by default
        tableName: "users"

        // primaryKey is "id" by default
    });


```

**TYPES**

* Common for every type below.
  * NOTNULL
  * DEFAULT(Mixed)
  * UNIQUE
  * COMMENTS(String)
  * GROUPS(Array of strings)

* Number
  * UNSIGNED
  * ZERIFILL
  * LENGTH(Number)

* Decimal
  * UNSIGNED
  * ZERIFILL
  * LENGTH(Number)
  * DECIMALS(Number)

* Enum
  * CHARSET(String)
  * COLLATION(String)
  * VALUES(Array of strings)

* Date

* String
  * CHARSET(String)
  * COLLATION(String)
  * LENGTH(Number[0-255])

* Text
  * CHARSET(String)
  * COLLATION(String)

* Binary
  * LENGTH(number)


In future version we will let you setup and specific type like CHAR via DBTYPE(TYPE)
This has some risk, so we avoid it in this current release.


## Model/Entity functions

**At Entity level**

* $create(Connection con = null): Instance

  Create a new instance and assign a connection if passed.

  Do not store your entity in database.

* $unique(Array: columns, String: uq_name): this

  Add a unique to definition

* $hasOne(Entity target_entity, Object options): this

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

* $hasMany(Entity target_entity, Object options) : this

  Add a relation to target_entity given options.
  With this method can be mapped:
  * ManyToOne unidirectional & bidirectional

  same options as above.


* $get(String id_pk, Object options, Work work = null) -> Work

  Get Entity from cache/database.

  If work is provided 'get' will be append it to it.

  options:
    * eager: Boolean|Undefined
      undefined, default behavior as defined in the model
      false, no eager
      true, all eager
    * callback Function that will be called when get is finished
    * name key in the result object


* $delete(String id_pk, Object options, Work work = null) -> Work

  Build a **Query** to delete a single row in database given the primary key.

  If work is provided 'delete' will be append it to it.

  options:
    * callback Function that will be called when delete is finished
    * name key in the result object


* $find(Object where, Object options, Work work = null) -> Work

  Build a **Query** to retrieve any number of rows.

  SQL Where is created by keys as columns *equals* values as value

  If work is provided 'find' will be append it to it.

  options:
    * callback Function that will be called when find is finished
    * name key in the result object

* $search(String id_pk, Object options, Work work = null) -> Work

  Same as $find but treat Strings as LIKE-ABLE, to do a text search

  Notice that it could be slow...

  If work is provided 'search' will be append it to it.

  options:
    * callback Function that will be called when search is finished
    * name key in the result object

* $exists(String id_pk, Object options, Work work = null) -> Work

  Perform a count to database (it's not cached!) to check if given primary key exists.

  If work is provided 'exists' will be append it to it.

  options:
    * callback Function that will be called when exists is finished
    * name key in the result object

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

* $fetch ([Array relations = null,] Function callback) -> Work

  Retrieve relations.

  relations
    null, retrieve all relations
    Array, white-list of relation to be fetched.

  Note $fetch does not receive/return a work, a callback must be provided.


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

## Util

* Util.listFetch(Array[Entity], Object|Array fetch_options, callback): null

  Do a $fetch for every item in the list, wait responses and call callback.

* Util.getEntity(Entity entity, Number pk_val, Connection con, fetch_options, callback): null

  Get an entity from Primary key, then fetch, then call callback.

  Remember that eager is useful, but it's not cached while fetch is cached in most cases.

* Util.delCache(key): Function

  Return a function that delete from cache given key.

  Preferred usage with Work

```js
  work.push(Util.delCache("my-key"))
```

## Log

noboxout-orm use noboxout-log. By default print Warning/Error (logLevel 2)

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

To see bigger traces use:
```js
    require("noboxout-orm").Norm.logTrace = Number; // 3-4 should be enough to see your code
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
