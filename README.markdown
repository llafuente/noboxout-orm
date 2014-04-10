# noboxout-orm (norm) [![Build Status](https://secure.travis-ci.org/llafuente/noboxout-orm.png?branch=master)](http://travis-ci.org/llafuente/noboxout-orm)


![NPM](https://nodei.co/npm/noboxout-orm.png?compact=true)


## Introduction

```quote
Object-relational mapping (ORM, O/RM, and O/R mapping) in computer software is a programming technique for converting data between incompatible type systems in object-oriented programming languages. This creates, in effect, a "virtual object database" that can be used from within the programming language.
```

Basically the Glue between database and Javascript Objects.

## Why norm?

Why there are so many glues out there? :)

Three main things (Pros)

* Coding style (Classical object oriented inheritance using [node-class](https://github.com/llafuente/class))
* Transactions
* Error handling done right.

Cons:

* Only Mysql and Memcached available


## Norm object

* **setup**(Object: configuration)

```js
  norm = require("noboxout-orm").Norm;

  norm.setup({
      database: {
          host     : "127.0.0.1",
          user     : "travis",
          password : "",
          database: "norm_test"
      },
      cache: {
          host: "127.0.0.1",
          port: 11211,
          config: {
              poolSize: 25
          }
      }
  });
```

* **define** (String entity_name, Object class_definition, Object table_definition)

  Define a model.

  All models are stored in **norm.models** with the given entity_name (case-sensitive)

  All table definitions are stored are **norm.tables**

* **reserve** (callback(Error err, Connection con))

  Reserve a new connection to Database and Cache

  If you are working on a HTTP server environment, this should (**must** in our case) be call at the beginning of a request.

* **release** (Connection con)

  Release given connection

* **registerError** (code String, tokens Array, new_error String, entity Entity)

  Rewrite errors to something meaningful for your app.

  **note** use a null value inside the tokens to match anything "*"

  see [Error Handling](#handling-errors)

* **sync**()

  Synchronize database schema, *DROPPING EVERYTHING FIRST*, there is no incremental sync (and no plans atm)

* **verbose/debug/log/info/warn/err**(...)

  Colored log to stdout/stderr . @See [Log section](#log)


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
            this.__parent(data); // it's mandatory!

            // do your staff
        }
    }, {
        // NOTE!!
        // Norm has column prefix.
        // It's highly recommended to avoid collisions
        // norm didn't handle column name collisions
        prefix: "user_",

        // by default is the Class name lowercased
        tableName: "users",

        // primaryKey is "id" by default
        primaryKey: "id"
    });


```

**DATABASE MAPPING TYPES**

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
This has some risks, so we avoid it in the current release.


## Model/Entity functions

To avoid collisions, we prefix all functions with "**$**"

**At Entity level**

* **$create** (Connection con = null): Instance

  Create a new instance and assign a connection if passed.

  Note: Do not store your entity in database.

* **$unique** (Array: columns, String: uq_name): this

  Add a unique to definition

* **$hasOne** (Entity target_entity, Object options): this

  Add a relation to target_entity given options.
  With this method can be mapped:
  * OneToOne unidirectional & bidirectional
  * OneToMany unidirectional & bidirectional

  <a name="hasOneOptions"></a>

  *options* (Object)
  * *foreignKey*: String

      ForeignKey name

      Default: (prefix + primaryKey) of target entity

  * *property*: String

      Property name in the root entity

      Default: target entity name lowercased

  * *unique*: Boolean

      Set foreignKey unique. See [defining relations](#defining-relations)

      Default: true

  * *refColumn*: String

      Property name in the target entity

      Default: root entity name lowercased

  * *notNull*: Boolean

      Default: false

  * *eager*: Boolean

      Fetch relation in root by default?

      **Not working atm, in todo list.**

      Default: false

  * *refEager*: Boolean

      Fetch relation target entity by default?

      Not working atm, in todo list.

      Default: false


* **$hasMany** (Entity target_entity, Object options) : this

  Add a relation to target_entity given options.

  With this method can be mapped:
  * ManyToOne unidirectional & bidirectional

  *options* it's the same object as [$hasOne:Options](#hasOneOptions)

* **$get** (String id_pk, Object options, Work work = null) -> Work

  Get Entity from cache/database.

  If work is provided 'get' will be append it to it.

  options (Object)
  * eager: Boolean|Undefined

      undefined, default behavior as defined by the model

      false, no eager

      true, all eager

  * callback Function that will be called when get is finished

  * name key in the result object


* **$delete** (String id_pk, Object options, Work work = null) -> Work

  Build a **Query** to delete a single row in database given the primary key.

  If work is provided 'delete' will be append it to it.

  options (Object)
  * callback:Function

      Function that will be called when find is finished

  * name: String

      Key in the result object


* **$find** (Object where, Object options, Work work = null) -> Work

  Build a **Query** to retrieve any number of rows.

  SQL Where is created by keys as columns *equals* values as value

  If work is provided 'find' will be append it to it.

  options (Object)
  * callback:Function (optional)

      Function that will be called when find is finished

  * name: String (optional)

      Key in the result object


* **$search** (String id_pk, Object options, Work work = null) -> Work

  Like $find but handles Strings as **LIKE** (not equal). Useful for text search

  *Notice* that it could be slow... **LIKE** is slow.

  If work is provided 'search' will be append it to it.

  options (Object)
  * callback:Function (optional)

      Function that will be called when search is finished

  * name: String (optional)

      Key in the result object


* **$exists** (String id_pk, Object options, Work work = null) -> Work

  Perform a count to database (it's not cached!) to check if given primary key exists.

  If work is provided 'exists' will be append it to it.

  options (Object)
  * callback:Function (optional)

      Function that will be called when exists is finished

  * name: String (optional)

     Key in the result object


* **$export** (Entity entity, Array group = []) -> Object

  Serialize the Entity to a plain object. No relation exported.

  Use group to filter columns. See [GROUPS](#column-groups)

  Override this method to have custom behaviors.

  Should not be used directly, use the instance method **$export**, that will handle relations and groups.


* **$exportRelation** (Entity: entity, Relation: rel, array:group = []) -> Object

  Export given relation, by default loop every item and do $export.

  Override this method to have custom behaviors.

  Should not be used directly, use the instance method **$export**, that will handle relations and groups.


* $createTable -> Array

  return the create table as string.

  It's recommended to use norm.sync() to avoid foreignKey issues.



**At Instance Level**


* **$merge** (Object obj, Array groups = null)

  "unserialize" an entity.

  Use group to filter columns. See [GROUPS](#column-groups)

* **$export** (groups, Boolean|Array: export_relations)

  Export current Entity to a plain object.

  Use group to filter columns. See [GROUPS](#column-groups)
  export_relations
    true, export all relations
    false, no export relations
    Array, list of relations to be included.

* **$fetch** ([Array relations = null,] Function callback) -> Work

  Retrieve relations.

  relations
  *  if null, retrieve all relations
  *  if Array, white-list of relation to be fetched.

  **Note** *$fetch* does not receive/return a work, a callback must be provided.


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

  Get an entity by PrimaryKey, then fetch, then call callback.

  Remember that eager is useful, but it's not cached while fetch is cached in most cases.

* Util.cachekey(key, value)

  Create a valid cachekey given any DB-compatible, useful for Binary/Buffer values

* Util.delCache(key): Function

  Return a function that delete from cache given key.

  Example:

```js
  work.push(Util.delCache("my-key")); // return a function compatible with work :)
```

<a name="error-handling"></a>
## Error Handling

Norm can handle errors, and match Database error into something meaningful for you app. So you not need to handle errors, **registerError** and throw it.

Example:

```js

    // setup models
    var User = norm.define("user", {
        id: norm.Number.LENGTH(10).UNSIGNED,
        name: norm.String.NOTNULL.LENGTH(255),
        initialize: function () {
            this.__parent();
        }
    }, {
        prefix: "us_",
        tableName: "user"
    });

    User.$unique(["name"], "uq_user_name");

    // register errors in norm
    norm.registerError('ER_BAD_NULL_ERROR', [ 'us_name' ], "invalid user name");
    norm.registerError('ER_DUP_ENTRY', [ null, 'uq_user_name' ], "user name is use");

    // tests / examples

    test("null test", function (t) {
        var work = User.$create().$store();
        work.exec(con, function(err, res) {

            t.equals(err.message, "invalid user name");

            t.end();
        });
    });

    test("unique test", function (t) {
        User.$create().$merge({
            name: "test-001"
        }).$store().exec(con, function(err, res) {

            User.$create().$merge({
                name: "test-001"
            }).$store().exec(con, function(err, res) {
                t.equals(err.message, "user in use");
            });

            t.end();
        });
    });

```


Errors in Norm have **long-traces**, that we manually manage for you. check test/test-norm-errors.js to see those long-traces.

This way you will see in the traces the origin of the error.

Remember to adjust Error.stackTraceLimit to something a bit greater that 10. 15 should be enough

```

{ [Error: invalid tag name]
  code: 'ER_BAD_NULL_ERROR',
  errno: 1048,
  sqlState: '23000',
  index: 0,
  sql: 'INSERT INTO `tag` (`tg_name`,`tg_updated_at`,`tg_created_at`,`tg_id`) VALUES(NULL,NULL,\'2014-04-10 10:41:15.835\',NULL)',
  args: null,
  tokens: [ 'tg_name' ],
  dbMessage: 'ER_BAD_NULL_ERROR: Column \'tg_name\' cannot be null' }

Error: ER_DUP_ENTRY: Duplicate entry 'test-001' for key 'uq_user_name'
    at Query.Sequence._packetToError (noboxout-orm/node_modules/mysql/lib/protocol/sequences/Sequence.js:30:14)
    at Query.ErrorPacket (noboxout-orm/node_modules/mysql/lib/protocol/sequences/Query.js:82:18)
    at Protocol._parsePacket (noboxout-orm/node_modules/mysql/lib/protocol/Protocol.js:197:24)
    at Parser.write (noboxout-orm/node_modules/mysql/lib/protocol/Parser.js:62:12)
    at Protocol.write (noboxout-orm/node_modules/mysql/lib/protocol/Protocol.js:37:16)
    at Socket.ondata (stream.js:51:26)
    at Socket.EventEmitter.emit (events.js:117:20)
    at Socket.<anonymous> (_stream_readable.js:746:14)
    at Socket.EventEmitter.emit (events.js:92:17)
    at emitReadable_ (_stream_readable.js:408:10)
    --------------------
    at Protocol._enqueue (noboxout-orm/node_modules/mysql/lib/protocol/Protocol.js:110:26)
    at PoolConnection.Connection.query (noboxout-orm/node_modules/mysql/lib/Connection.js:148:25)
    at __class.query (noboxout-orm/lib/mysql.js:85:29)
    at __class.query (noboxout-orm/lib/connection.js:103:27)
    at store_entity_cb (noboxout-orm/lib/util.js:134:13)
    at Object.storeRelations (noboxout-orm/lib/util.js:243:13)
    at Object.module.exports.storeEntity (noboxout-orm/lib/util.js:271:18)
    at Array.0 (noboxout-orm/lib/entity.js:80:22)
    at array.mapSerial.all_null (noboxout-orm/lib/work.js:129:25)
    at next (js-array-enhancements/lib/arrays.js:529:21)
Previous Error
    at __class.query (noboxout-orm/lib/connection.js:101:28)
    at store_entity_cb (noboxout-orm/lib/util.js:134:13)
    at Object.storeRelations (noboxout-orm/lib/util.js:243:13)
    at Object.module.exports.storeEntity (noboxout-orm/lib/util.js:271:18)
    at Array.0 (noboxout-orm/lib/entity.js:80:22)
    at array.mapSerial.all_null (noboxout-orm/lib/work.js:129:25)
    at next (js-array-enhancements/lib/arrays.js:529:21)
    at Object.module.exports.mapSerial (js-array-enhancements/lib/arrays.js:540:9)
    at module.exports.__class.exec (noboxout-orm/lib/work.js:106:19)
    at noboxout-orm/test/test-norm-errors.js:69:25 // <--- HERE!


```

<a name="log"></a>
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

## FAQ

### Why my errors do not match ?

Mysql errors change continously. We create a bash that parse "/usr/share/mysql/errmsg-utf8.txt"

Remember to edit "mysql_parse_errors.sh" if in your system *errmsg-utf8.txt* is not in the default folder.

``bash
cd lib
sh mysql_parse_errors.sh

```

## Install

With [npm](http://npmjs.org) do:

```

npm install noboxout-orm

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
