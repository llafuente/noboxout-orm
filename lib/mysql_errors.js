module.exports = {

  "ER_HASHCHK" :
    /hashchk/,

  "ER_NISAMCHK" :
    /isamchk/,

  "ER_NO" :
    /NO/,

  "ER_YES" :
    /YES/,

  "ER_CANT_CREATE_FILE" :
    /Can't create file '(.*)' (errno\: (.*))/,

  "ER_CANT_CREATE_TABLE" :
    /Can't create table '(.*)' (errno\: (.*))/,

  "ER_CANT_CREATE_DB" :
    /Can't create database '(.*)' (errno\: (.*))/,

  "ER_DB_CREATE_EXISTS" :
    /Can't create database '(.*)'; database exists/,

  "ER_DB_DROP_EXISTS" :
    /Can't drop database '(.*)'; database doesn't exist/,

  "ER_DB_DROP_DELETE" :
    /Error dropping database (can't delete '(.*)', errno\: (.*))/,

  "ER_DB_DROP_RMDIR" :
    /Error dropping database (can't rmdir '(.*)', errno\: (.*))/,

  "ER_CANT_DELETE_FILE" :
    /Error on delete of '(.*)' (errno\: (.*))/,

  "ER_CANT_FIND_SYSTEM_REC" :
    /Can't read record in system table/,

  "ER_CANT_GET_STAT" :
    /Can't get status of '(.*)' (errno\: (.*))/,

  "ER_CANT_GET_WD" :
    /Can't get working directory (errno\: (.*))/,

  "ER_CANT_LOCK" :
    /Can't lock file (errno\: (.*))/,

  "ER_CANT_OPEN_FILE" :
    /Can't open file\: '(.*)' (errno\: (.*))/,

  "ER_FILE_NOT_FOUND" :
    /Can't find file\: '(.*)' (errno\: (.*))/,

  "ER_CANT_READ_DIR" :
    /Can't read dir of '(.*)' (errno\: (.*))/,

  "ER_CANT_SET_WD" :
    /Can't change dir to '(.*)' (errno\: (.*))/,

  "ER_CHECKREAD" :
    /Record has changed since last read in table '(.*)'/,

  "ER_DISK_FULL" :
    /Disk full ((.*)); waiting for someone to free some space.../,

  "ER_DUP_KEY" :
    /Can't write; duplicate key in table '(.*)'/,

  "ER_ERROR_ON_CLOSE" :
    /Error on close of '(.*)' (errno\: (.*))/,

  "ER_ERROR_ON_READ" :
    /Error reading file '(.*)' (errno\: (.*))/,

  "ER_ERROR_ON_RENAME" :
    /Error on rename of '(.*)' to '(.*)' (errno\: (.*))/,

  "ER_ERROR_ON_WRITE" :
    /Error writing file '(.*)' (errno\: (.*))/,

  "ER_FILE_USED" :
    /'(.*)' is locked against change/,

  "ER_FILSORT_ABORT" :
    /Sort aborted/,

  "ER_FORM_NOT_FOUND" :
    /View '(.*)' doesn't exist for '(.*)'/,

  "ER_GET_ERRNO" :
    /Got error (.*) from storage engine/,

  "ER_ILLEGAL_HA" :
    /Table storage engine for '(.*)' doesn't have this option/,

  "ER_KEY_NOT_FOUND" :
    /Can't find record in '(.*)'/,

  "ER_NOT_FORM_FILE" :
    /Incorrect information in file\: '(.*)'/,

  "ER_NOT_KEYFILE" :
    /Incorrect key file for table '(.*)'; try to repair it/,

  "ER_OLD_KEYFILE" :
    /Old key file for table '(.*)'; repair it!/,

  "ER_OPEN_AS_READONLY" :
    /Table '(.*)' is read only/,

  "ER_OUTOFMEMORY" :
    /Out of memory; restart server and try again (needed (.*) bytes)/,

  "ER_OUT_OF_SORTMEMORY" :
    /Out of sort memory, consider increasing server sort buffer size/,

  "ER_UNEXPECTED_EOF" :
    /Unexpected EOF found when reading file '(.*)' (errno\: (.*))/,

  "ER_CON_COUNT_ERROR" :
    /Too many connections/,

  "ER_OUT_OF_RESOURCES" :
    /Out of memory; check if mysqld or some other process uses all available memory; if not, you may have to use 'ulimit' to allow mysqld to use more memory or you can add more swap space/,

  "ER_BAD_HOST_ERROR" :
    /Can't get hostname for your address/,

  "ER_HANDSHAKE_ERROR" :
    /Bad handshake/,

  "ER_DBACCESS_DENIED_ERROR" :
    /Access denied for user '(.*)'@'(.*)' to database '(.*)'/,

  "ER_ACCESS_DENIED_ERROR" :
    /Access denied for user '(.*)'@'(.*)' (using password\: (.*))/,

  "ER_NO_DB_ERROR" :
    /No database selected/,

  "ER_UNKNOWN_COM_ERROR" :
    /Unknown command/,

  "ER_BAD_NULL_ERROR" :
    /Column '(.*)' cannot be null/,

  "ER_BAD_DB_ERROR" :
    /Unknown database '(.*)'/,

  "ER_TABLE_EXISTS_ERROR" :
    /Table '(.*)' already exists/,

  "ER_BAD_TABLE_ERROR" :
    /Unknown table '(.*)'/,

  "ER_NON_UNIQ_ERROR" :
    /Column '(.*)' in (.*) is ambiguous/,

  "ER_SERVER_SHUTDOWN" :
    /Server shutdown in progress/,

  "ER_BAD_FIELD_ERROR" :
    /Unknown column '(.*)' in '(.*)'/,

  "ER_WRONG_FIELD_WITH_GROUP" :
    /'(.*)' isn't in GROUP BY/,

  "ER_WRONG_GROUP_FIELD" :
    /Can't group on '(.*)'/,

  "ER_WRONG_SUM_SELECT" :
    /Statement has sum functions and columns in same statement/,

  "ER_WRONG_VALUE_COUNT" :
    /Column count doesn't match value count/,

  "ER_TOO_LONG_IDENT" :
    /Identifier name '(.*)' is too long/,

  "ER_DUP_FIELDNAME" :
    /Duplicate column name '(.*)'/,

  "ER_DUP_KEYNAME" :
    /Duplicate key name '(.*)'/,

  "ER_DUP_ENTRY" :
    /Duplicate entry '(.*)' for key (.*)/,

  "ER_WRONG_FIELD_SPEC" :
    /Incorrect column specifier for column '(.*)'/,

  "ER_PARSE_ERROR" :
    /(.*)/,

  "ER_EMPTY_QUERY" :
    /Query was empty/,

  "ER_NONUNIQ_TABLE" :
    /Not unique table\/alias\: '(.*)'/,

  "ER_INVALID_DEFAULT" :
    /Invalid default value for '(.*)'/,

  "ER_MULTIPLE_PRI_KEY" :
    /Multiple primary key defined/,

  "ER_TOO_MANY_KEYS" :
    /Too many keys specified; max (.*) keys allowed/,

  "ER_TOO_MANY_KEY_PARTS" :
    /Too many key parts specified; max (.*) parts allowed/,

  "ER_TOO_LONG_KEY" :
    /Specified key was too long; max key length is (.*) bytes/,

  "ER_KEY_COLUMN_DOES_NOT_EXITS" :
    /Key column '(.*)' doesn't exist in table/,

  "ER_BLOB_USED_AS_KEY" :
    /BLOB column '(.*)' can't be used in key specification with the used table type/,

  "ER_TOO_BIG_FIELDLENGTH" :
    /Column length too big for column '(.*)' (max = (.*)u); use BLOB or TEXT instead/,

  "ER_WRONG_AUTO_KEY" :
    /Incorrect table definition; there can be only one auto column and it must be defined as a key/,

  "ER_READY" :
    /(.*)/,

  "ER_NORMAL_SHUTDOWN" :
    /(.*)\: Normal shutdown\n/,

  "ER_GOT_SIGNAL" :
    /(.*)\: Got signal (.*). Aborting!\n/,

  "ER_SHUTDOWN_COMPLETE" :
    /(.*)\: Shutdown complete\n/,

  "ER_FORCING_CLOSE" :
    /(.*)\: Forcing close of thread (.*)  user\: '(.*)'\n/,

  "ER_IPSOCK_ERROR" :
    /Can't create IP socket/,

  "ER_NO_SUCH_INDEX" :
    /Table '(.*)' has no index like the one used in CREATE INDEX; recreate the table/,

  "ER_WRONG_FIELD_TERMINATORS" :
    /Field separator argument is not what is expected; check the manual/,

  "ER_BLOBS_AND_NO_TERMINATED" :
    /You can't use fixed rowlength with BLOBs; please use 'fields terminated by'/,

  "ER_TEXTFILE_NOT_READABLE" :
    /The file '(.*)' must be in the database directory or be readable by all/,

  "ER_FILE_EXISTS_ERROR" :
    /File '(.*)' already exists/,

  "ER_LOAD_INFO" :
    /Records\: (.*)  Deleted\: (.*)  Skipped\: (.*)  Warnings\: (.*)/,

  "ER_ALTER_INFO" :
    /Records\: (.*)  Duplicates\: (.*)/,

  "ER_WRONG_SUB_KEY" :
    /Incorrect prefix key; the used key part isn't a string, the used length is longer than the key part, or the storage engine doesn't support unique prefix keys/,

  "ER_CANT_REMOVE_ALL_FIELDS" :
    /You can't delete all columns with ALTER TABLE; use DROP TABLE instead/,

  "ER_CANT_DROP_FIELD_OR_KEY" :
    /Can't DROP '(.*)'; check that column\/key exists/,

  "ER_INSERT_INFO" :
    /Records\: (.*)  Duplicates\: (.*)  Warnings\: (.*)/,

  "ER_UPDATE_TABLE_USED" :
    /You can't specify target table '(.*)' for update in FROM clause/,

  "ER_NO_SUCH_THREAD" :
    /Unknown thread id\: (.*)u/,

  "ER_KILL_DENIED_ERROR" :
    /You are not owner of thread (.*)u/,

  "ER_NO_TABLES_USED" :
    /No tables used/,

  "ER_TOO_BIG_SET" :
    /Too many strings for column (.*) and SET/,

  "ER_NO_UNIQUE_LOGFILE" :
    /Can't generate a unique log-filename (.*).(1-999)\n/,

  "ER_TABLE_NOT_LOCKED_FOR_WRITE" :
    /Table '(.*)' was locked with a READ lock and can't be updated/,

  "ER_TABLE_NOT_LOCKED" :
    /Table '(.*)' was not locked with LOCK TABLES/,

  "ER_BLOB_CANT_HAVE_DEFAULT" :
    /BLOB\/TEXT column '(.*)' can't have a default value/,

  "ER_WRONG_DB_NAME" :
    /Incorrect database name '(.*)'/,

  "ER_WRONG_TABLE_NAME" :
    /Incorrect table name '(.*)'/,

  "ER_TOO_BIG_SELECT" :
    /The SELECT would examine more than MAX_JOIN_SIZE rows; check your WHERE and use SET SQL_BIG_SELECTS=1 or SET MAX_JOIN_SIZE=# if the SELECT is okay/,

  "ER_UNKNOWN_ERROR" :
    /Unknown error/,

  "ER_UNKNOWN_PROCEDURE" :
    /Unknown procedure '(.*)'/,

  "ER_WRONG_PARAMCOUNT_TO_PROCEDURE" :
    /Incorrect parameter count to procedure '(.*)'/,

  "ER_WRONG_PARAMETERS_TO_PROCEDURE" :
    /Incorrect parameters to procedure '(.*)'/,

  "ER_UNKNOWN_TABLE" :
    /Unknown table '(.*)' in (.*)/,

  "ER_FIELD_SPECIFIED_TWICE" :
    /Column '(.*)' specified twice/,

  "ER_INVALID_GROUP_FUNC_USE" :
    /Invalid use of group function/,

  "ER_UNSUPPORTED_EXTENSION" :
    /Table '(.*)' uses an extension that doesn't exist in this MySQL version/,

  "ER_TABLE_MUST_HAVE_COLUMNS" :
    /A table must have at least 1 column/,

  "ER_RECORD_FILE_FULL" :
    /The table '(.*)' is full/,

  "ER_UNKNOWN_CHARACTER_SET" :
    /Unknown character set\: '(.*)'/,

  "ER_TOO_MANY_TABLES" :
    /Too many tables; MySQL can only use (.*) tables in a join/,

  "ER_TOO_MANY_FIELDS" :
    /Too many columns/,

  "ER_TOO_BIG_ROWSIZE" :
    /Row size too large. The maximum row size for the used table type, not counting BLOBs, is (.*). You have to change some columns to TEXT or BLOBs/,

  "ER_STACK_OVERRUN" :
    /Thread stack overrun\:  Used\: (.*) of a (.*) stack.  Use 'mysqld --thread_stack=#' to specify a bigger stack if needed/,

  "ER_WRONG_OUTER_JOIN" :
    /Cross dependency found in OUTER JOIN; examine your ON conditions/,

  "ER_NULL_COLUMN_IN_INDEX" :
    /Table handler doesn't support NULL in given index. Please change column '(.*)' to be NOT NULL or use another handler/,

  "ER_CANT_FIND_UDF" :
    /Can't load function '(.*)'/,

  "ER_CANT_INITIALIZE_UDF" :
    /Can't initialize function '(.*)'; (.*)/,

  "ER_UDF_NO_PATHS" :
    /No paths allowed for shared library/,

  "ER_UDF_EXISTS" :
    /Function '(.*)' already exists/,

  "ER_CANT_OPEN_LIBRARY" :
    /Can't open shared library '(.*)' (errno\: (.*) (.*))/,

  "ER_CANT_FIND_DL_ENTRY" :
    /Can't find symbol '(.*)' in library/,

  "ER_FUNCTION_NOT_DEFINED" :
    /Function '(.*)' is not defined/,

  "ER_HOST_IS_BLOCKED" :
    /Host '(.*)' is blocked because of many connection errors; unblock with 'mysqladmin flush-hosts'/,

  "ER_HOST_NOT_PRIVILEGED" :
    /Host '(.*)' is not allowed to connect to this MySQL server/,

  "ER_PASSWORD_ANONYMOUS_USER" :
    /You are using MySQL as an anonymous user and anonymous users are not allowed to change passwords/,

  "ER_PASSWORD_NOT_ALLOWED" :
    /You must have privileges to update tables in the mysql database to be able to change passwords for others/,

  "ER_PASSWORD_NO_MATCH" :
    /Can't find any matching row in the user table/,

  "ER_UPDATE_INFO" :
    /Rows matched\: (.*)  Changed\: (.*)  Warnings\: (.*)/,

  "ER_CANT_CREATE_THREAD" :
    /Can't create a new thread (errno (.*)); if you are not out of available memory, you can consult the manual for a possible OS-dependent bug/,

  "ER_WRONG_VALUE_COUNT_ON_ROW" :
    /Column count doesn't match value count at row (.*)/,

  "ER_CANT_REOPEN_TABLE" :
    /Can't reopen table\: '(.*)'/,

  "ER_INVALID_USE_OF_NULL" :
    /Invalid use of NULL value/,

  "ER_REGEXP_ERROR" :
    /Got error '(.*)' from regexp/,

  "ER_MIX_OF_GROUP_FUNC_AND_FIELDS" :
    /Mixing of GROUP columns (MIN(),MAX(),COUNT(),...) with no GROUP columns is illegal if there is no GROUP BY clause/,

  "ER_NONEXISTING_GRANT" :
    /There is no such grant defined for user '(.*)' on host '(.*)'/,

  "ER_TABLEACCESS_DENIED_ERROR" :
    /(.*) command denied to user '(.*)'@'(.*)' for table '(.*)'/,

  "ER_COLUMNACCESS_DENIED_ERROR" :
    /(.*) command denied to user '(.*)'@'(.*)' for column '(.*)' in table '(.*)'/,

  "ER_ILLEGAL_GRANT_FOR_TABLE" :
    /Illegal GRANT\/REVOKE command; please consult the manual to see which privileges can be used/,

  "ER_GRANT_WRONG_HOST_OR_USER" :
    /The host or user argument to GRANT is too long/,

  "ER_NO_SUCH_TABLE" :
    /Table '(.*).(.*)' doesn't exist/,

  "ER_NONEXISTING_TABLE_GRANT" :
    /There is no such grant defined for user '(.*)' on host '(.*)' on table '(.*)'/,

  "ER_NOT_ALLOWED_COMMAND" :
    /The used command is not allowed with this MySQL version/,

  "ER_SYNTAX_ERROR" :
    /You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use/,

  "ER_DELAYED_CANT_CHANGE_LOCK" :
    /Delayed insert thread couldn't get requested lock for table (.*)/,

  "ER_TOO_MANY_DELAYED_THREADS" :
    /Too many delayed threads in use/,

  "ER_ABORTING_CONNECTION" :
    /Aborted connection (.*) to db\: '(.*)' user\: '(.*)' ((.*))/,

  "ER_NET_PACKET_TOO_LARGE" :
    /Got a packet bigger than 'max_allowed_packet' bytes/,

  "ER_NET_READ_ERROR_FROM_PIPE" :
    /Got a read error from the connection pipe/,

  "ER_NET_FCNTL_ERROR" :
    /Got an error from fcntl()/,

  "ER_NET_PACKETS_OUT_OF_ORDER" :
    /Got packets out of order/,

  "ER_NET_UNCOMPRESS_ERROR" :
    /Couldn't uncompress communication packet/,

  "ER_NET_READ_ERROR" :
    /Got an error reading communication packets/,

  "ER_NET_READ_INTERRUPTED" :
    /Got timeout reading communication packets/,

  "ER_NET_ERROR_ON_WRITE" :
    /Got an error writing communication packets/,

  "ER_NET_WRITE_INTERRUPTED" :
    /Got timeout writing communication packets/,

  "ER_TOO_LONG_STRING" :
    /Result string is longer than 'max_allowed_packet' bytes/,

  "ER_TABLE_CANT_HANDLE_BLOB" :
    /The used table type doesn't support BLOB\/TEXT columns/,

  "ER_TABLE_CANT_HANDLE_AUTO_INCREMENT" :
    /The used table type doesn't support AUTO_INCREMENT columns/,

  "ER_DELAYED_INSERT_TABLE_LOCKED" :
    /INSERT DELAYED can't be used with table '(.*)' because it is locked with LOCK TABLES/,

  "ER_WRONG_COLUMN_NAME" :
    /Incorrect column name '(.*)'/,

  "ER_WRONG_KEY_COLUMN" :
    /The used storage engine can't index column '(.*)'/,

  "ER_WRONG_MRG_TABLE" :
    /Unable to open underlying table which is differently defined or of non-MyISAM type or doesn't exist/,

  "ER_DUP_UNIQUE" :
    /Can't write, because of unique constraint, to table '(.*)'/,

  "ER_BLOB_KEY_WITHOUT_LENGTH" :
    /BLOB\/TEXT column '(.*)' used in key specification without a key length/,

  "ER_PRIMARY_CANT_HAVE_NULL" :
    /All parts of a PRIMARY KEY must be NOT NULL; if you need NULL in a key, use UNIQUE instead/,

  "ER_TOO_MANY_ROWS" :
    /Result consisted of more than one row/,

  "ER_REQUIRES_PRIMARY_KEY" :
    /This table type requires a primary key/,

  "ER_NO_RAID_COMPILED" :
    /This version of MySQL is not compiled with RAID support/,

  "ER_UPDATE_WITHOUT_KEY_IN_SAFE_MODE" :
    /You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column/,

  "ER_KEY_DOES_NOT_EXITS" :
    /Key '(.*)' doesn't exist in table '(.*)'/,

  "ER_CHECK_NO_SUCH_TABLE" :
    /Can't open table/,

  "ER_CHECK_NOT_IMPLEMENTED" :
    /The storage engine for the table doesn't support (.*)/,

  "ER_CANT_DO_THIS_DURING_AN_TRANSACTION" :
    /You are not allowed to execute this command in a transaction/,

  "ER_ERROR_DURING_COMMIT" :
    /Got error (.*) during COMMIT/,

  "ER_ERROR_DURING_ROLLBACK" :
    /Got error (.*) during ROLLBACK/,

  "ER_ERROR_DURING_FLUSH_LOGS" :
    /Got error (.*) during FLUSH_LOGS/,

  "ER_ERROR_DURING_CHECKPOINT" :
    /Got error (.*) during CHECKPOINT/,

  "ER_NEW_ABORTING_CONNECTION" :
    /Aborted connection (.*) to db\: '(.*)' user\: '(.*)' host\: '(.*)' ((.*))/,

  "ER_DUMP_NOT_IMPLEMENTED" :
    /The storage engine for the table does not support binary table dump/,

  "ER_FLUSH_MASTER_BINLOG_CLOSED" :
    /Binlog closed, cannot RESET MASTER/,

  "ER_INDEX_REBUILD" :
    /Failed rebuilding the index of  dumped table '(.*)'/,

  "ER_MASTER" :
    /Error from master\: '(.*)'/,

  "ER_MASTER_NET_READ" :
    /Net error reading from master/,

  "ER_MASTER_NET_WRITE" :
    /Net error writing to master/,

  "ER_FT_MATCHING_KEY_NOT_FOUND" :
    /Can't find FULLTEXT index matching the column list/,

  "ER_LOCK_OR_ACTIVE_TRANSACTION" :
    /Can't execute the given command because you have active locked tables or an active transaction/,

  "ER_UNKNOWN_SYSTEM_VARIABLE" :
    /Unknown system variable '(.*)'/,

  "ER_CRASHED_ON_USAGE" :
    /Table '(.*)' is marked as crashed and should be repaired/,

  "ER_CRASHED_ON_REPAIR" :
    /Table '(.*)' is marked as crashed and last (automatic?) repair failed/,

  "ER_WARNING_NOT_COMPLETE_ROLLBACK" :
    /Some non-transactional changed tables couldn't be rolled back/,

  "ER_TRANS_CACHE_FULL" :
    /Multi-statement transaction required more than 'max_binlog_cache_size' bytes of storage; increase this mysqld variable and try again/,

  "ER_SLAVE_MUST_STOP" :
    /This operation cannot be performed with a running slave; run STOP SLAVE first/,

  "ER_SLAVE_NOT_RUNNING" :
    /This operation requires a running slave; configure slave and do START SLAVE/,

  "ER_BAD_SLAVE" :
    /The server is not configured as slave; fix in config file or with CHANGE MASTER TO/,

  "ER_MASTER_INFO" :
    /Could not initialize master info structure; more error messages can be found in the MySQL error log/,

  "ER_SLAVE_THREAD" :
    /Could not create slave thread; check system resources/,

  "ER_TOO_MANY_USER_CONNECTIONS" :
    /User (.*) already has more than 'max_user_connections' active connections/,

  "ER_SET_CONSTANTS_ONLY" :
    /You may only use constant expressions with SET/,

  "ER_LOCK_WAIT_TIMEOUT" :
    /Lock wait timeout exceeded; try restarting transaction/,

  "ER_LOCK_TABLE_FULL" :
    /The total number of locks exceeds the lock table size/,

  "ER_READ_ONLY_TRANSACTION" :
    /Update locks cannot be acquired during a READ UNCOMMITTED transaction/,

  "ER_DROP_DB_WITH_READ_LOCK" :
    /DROP DATABASE not allowed while thread is holding global read lock/,

  "ER_CREATE_DB_WITH_READ_LOCK" :
    /CREATE DATABASE not allowed while thread is holding global read lock/,

  "ER_WRONG_ARGUMENTS" :
    /Incorrect arguments to (.*)/,

  "ER_NO_PERMISSION_TO_CREATE_USER" :
    /'(.*)'@'(.*)' is not allowed to create new users/,

  "ER_UNION_TABLES_IN_DIFFERENT_DIR" :
    /Incorrect table definition; all MERGE tables must be in the same database/,

  "ER_LOCK_DEADLOCK" :
    /Deadlock found when trying to get lock; try restarting transaction/,

  "ER_TABLE_CANT_HANDLE_FT" :
    /The used table type doesn't support FULLTEXT indexes/,

  "ER_CANNOT_ADD_FOREIGN" :
    /Cannot add foreign key constraint/,

  "ER_NO_REFERENCED_ROW" :
    /Cannot add or update a child row\: a foreign key constraint fails/,

  "ER_ROW_IS_REFERENCED" :
    /Cannot delete or update a parent row\: a foreign key constraint fails/,

  "ER_CONNECT_TO_MASTER" :
    /Error connecting to master\: (.*)/,

  "ER_QUERY_ON_MASTER" :
    /Error running query on master\: (.*)/,

  "ER_ERROR_WHEN_EXECUTING_COMMAND" :
    /Error when executing command (.*)\: (.*)/,

  "ER_WRONG_USAGE" :
    /Incorrect usage of (.*) and (.*)/,

  "ER_WRONG_NUMBER_OF_COLUMNS_IN_SELECT" :
    /The used SELECT statements have a different number of columns/,

  "ER_CANT_UPDATE_WITH_READLOCK" :
    /Can't execute the query because you have a conflicting read lock/,

  "ER_MIXING_NOT_ALLOWED" :
    /Mixing of transactional and non-transactional tables is disabled/,

  "ER_DUP_ARGUMENT" :
    /Option '(.*)' used twice in statement/,

  "ER_USER_LIMIT_REACHED" :
    /User '(.*)' has exceeded the '(.*)' resource (current value\: (.*))/,

  "ER_SPECIFIC_ACCESS_DENIED_ERROR" :
    /Access denied; you need (at least one of) the (.*) privilege(s) for this operation/,

  "ER_LOCAL_VARIABLE" :
    /Variable '(.*)' is a SESSION variable and can't be used with SET GLOBAL/,

  "ER_GLOBAL_VARIABLE" :
    /Variable '(.*)' is a GLOBAL variable and should be set with SET GLOBAL/,

  "ER_NO_DEFAULT" :
    /Variable '(.*)' doesn't have a default value/,

  "ER_WRONG_VALUE_FOR_VAR" :
    /Variable '(.*)' can't be set to the value of '(.*)'/,

  "ER_WRONG_TYPE_FOR_VAR" :
    /Incorrect argument type to variable '(.*)'/,

  "ER_VAR_CANT_BE_READ" :
    /Variable '(.*)' can only be set, not read/,

  "ER_CANT_USE_OPTION_HERE" :
    /Incorrect usage\/placement of '(.*)'/,

  "ER_NOT_SUPPORTED_YET" :
    /This version of MySQL doesn't yet support '(.*)'/,

  "ER_MASTER_FATAL_ERROR_READING_BINLOG" :
    /Got fatal error (.*) from master when reading data from binary log\: '(.*)'/,

  "ER_SLAVE_IGNORED_TABLE" :
    /Slave SQL thread ignored the query because of replicate-*-table rules/,

  "ER_INCORRECT_GLOBAL_LOCAL_VAR" :
    /Variable '(.*)' is a (.*) variable/,

  "ER_WRONG_FK_DEF" :
    /Incorrect foreign key definition for '(.*)'\: (.*)/,

  "ER_KEY_REF_DO_NOT_MATCH_TABLE_REF" :
    /Key reference and table reference don't match/,

  "ER_OPERAND_COLUMNS" :
    /Operand should contain (.*) column(s)/,

  "ER_SUBQUERY_NO_1_ROW" :
    /Subquery returns more than 1 row/,

  "ER_UNKNOWN_STMT_HANDLER" :
    /Unknown prepared statement handler ((.*)) given to (.*)/,

  "ER_CORRUPT_HELP_DB" :
    /Help database is corrupt or does not exist/,

  "ER_CYCLIC_REFERENCE" :
    /Cyclic reference on subqueries/,

  "ER_AUTO_CONVERT" :
    /Converting column '(.*)' from (.*) to (.*)/,

  "ER_ILLEGAL_REFERENCE" :
    /Reference '(.*)' not supported ((.*))/,

  "ER_DERIVED_MUST_HAVE_ALIAS" :
    /Every derived table must have its own alias/,

  "ER_SELECT_REDUCED" :
    /Select (.*) was reduced during optimization/,

  "ER_TABLENAME_NOT_ALLOWED_HERE" :
    /Table '(.*)' from one of the SELECTs cannot be used in (.*)/,

  "ER_NOT_SUPPORTED_AUTH_MODE" :
    /Client does not support authentication protocol requested by server; consider upgrading MySQL client/,

  "ER_SPATIAL_CANT_HAVE_NULL" :
    /All parts of a SPATIAL index must be NOT NULL/,

  "ER_COLLATION_CHARSET_MISMATCH" :
    /COLLATION '(.*)' is not valid for CHARACTER SET '(.*)'/,

  "ER_SLAVE_WAS_RUNNING" :
    /Slave is already running/,

  "ER_SLAVE_WAS_NOT_RUNNING" :
    /Slave already has been stopped/,

  "ER_TOO_BIG_FOR_UNCOMPRESS" :
    /Uncompressed data size too large; the maximum size is (.*) (probably, length of uncompressed data was corrupted)/,

  "ER_ZLIB_Z_MEM_ERROR" :
    /ZLIB\: Not enough memory/,

  "ER_ZLIB_Z_BUF_ERROR" :
    /ZLIB\: Not enough room in the output buffer (probably, length of uncompressed data was corrupted)/,

  "ER_ZLIB_Z_DATA_ERROR" :
    /ZLIB\: Input data corrupted/,

  "ER_CUT_VALUE_GROUP_CONCAT" :
    /Row (.*) was cut by GROUP_CONCAT()/,

  "ER_WARN_TOO_FEW_RECORDS" :
    /Row (.*) doesn't contain data for all columns/,

  "ER_WARN_TOO_MANY_RECORDS" :
    /Row (.*) was truncated; it contained more data than there were input columns/,

  "ER_WARN_NULL_TO_NOTNULL" :
    /Column set to default value; NULL supplied to NOT NULL column '(.*)' at row (.*)/,

  "ER_WARN_DATA_OUT_OF_RANGE" :
    /Out of range value for column '(.*)' at row (.*)/,

  "WARN_DATA_TRUNCATED" :
    /Data truncated for column '(.*)' at row (.*)/,

  "ER_WARN_USING_OTHER_HANDLER" :
    /Using storage engine (.*) for table '(.*)'/,

  "ER_CANT_AGGREGATE_2COLLATIONS" :
    /Illegal mix of collations ((.*),(.*)) and ((.*),(.*)) for operation '(.*)'/,

  "ER_DROP_USER" :
    /Cannot drop one or more of the requested users/,

  "ER_REVOKE_GRANTS" :
    /Can't revoke all privileges for one or more of the requested users/,

  "ER_CANT_AGGREGATE_3COLLATIONS" :
    /Illegal mix of collations ((.*),(.*)), ((.*),(.*)), ((.*),(.*)) for operation '(.*)'/,

  "ER_CANT_AGGREGATE_NCOLLATIONS" :
    /Illegal mix of collations for operation '(.*)'/,

  "ER_VARIABLE_IS_NOT_STRUCT" :
    /Variable '(.*)' is not a variable component (can't be used as XXXX.variable_name)/,

  "ER_UNKNOWN_COLLATION" :
    /Unknown collation\: '(.*)'/,

  "ER_SLAVE_IGNORED_SSL_PARAMS" :
    /SSL parameters in CHANGE MASTER are ignored because this MySQL slave was compiled without SSL support; they can be used later if MySQL slave with SSL is started/,

  "ER_SERVER_IS_IN_SECURE_AUTH_MODE" :
    /Server is running in --secure-auth mode, but '(.*)'@'(.*)' has a password in the old format; please change the password to the new format/,

  "ER_WARN_FIELD_RESOLVED" :
    /Field or reference '(.*)(.*)(.*)(.*)(.*)' of SELECT #(.*) was resolved in SELECT #(.*)/,

  "ER_BAD_SLAVE_UNTIL_COND" :
    /Incorrect parameter or combination of parameters for START SLAVE UNTIL/,

  "ER_MISSING_SKIP_SLAVE" :
    /It is recommended to use --skip-slave-start when doing step-by-step replication with START SLAVE UNTIL; otherwise, you will get problems if you get an unexpected slave's mysqld restart/,

  "ER_UNTIL_COND_IGNORED" :
    /SQL thread is not to be started so UNTIL options are ignored/,

  "ER_WRONG_NAME_FOR_INDEX" :
    /Incorrect index name '(.*)'/,

  "ER_WRONG_NAME_FOR_CATALOG" :
    /Incorrect catalog name '(.*)'/,

  "ER_WARN_QC_RESIZE" :
    /Query cache failed to set size (.*)u; new query cache size is (.*)u/,

  "ER_BAD_FT_COLUMN" :
    /Column '(.*)' cannot be part of FULLTEXT index/,

  "ER_UNKNOWN_KEY_CACHE" :
    /Unknown key cache '(.*)'/,

  "ER_WARN_HOSTNAME_WONT_WORK" :
    /MySQL is started in --skip-name-resolve mode; you must restart it without this switch for this grant to work/,

  "ER_UNKNOWN_STORAGE_ENGINE" :
    /Unknown storage engine '(.*)'/,

  "ER_WARN_DEPRECATED_SYNTAX" :
    /'(.*)' is deprecated and will be removed in a future release. Please use (.*) instead/,

  "ER_NON_UPDATABLE_TABLE" :
    /The target table (.*) of the (.*) is not updatable/,

  "ER_FEATURE_DISABLED" :
    /The '(.*)' feature is disabled; you need MySQL built with '(.*)' to have it working/,

  "ER_OPTION_PREVENTS_STATEMENT" :
    /The MySQL server is running with the (.*) option so it cannot execute this statement/,

  "ER_DUPLICATED_VALUE_IN_TYPE" :
    /Column '(.*)' has duplicated value '(.*)' in (.*)/,

  "ER_TRUNCATED_WRONG_VALUE" :
    /Truncated incorrect (.*) value\: '(.*)'/,

  "ER_TOO_MUCH_AUTO_TIMESTAMP_COLS" :
    /Incorrect table definition; there can be only one TIMESTAMP column with CURRENT_TIMESTAMP in DEFAULT or ON UPDATE clause/,

  "ER_INVALID_ON_UPDATE" :
    /Invalid ON UPDATE clause for '(.*)' column/,

  "ER_UNSUPPORTED_PS" :
    /This command is not supported in the prepared statement protocol yet/,

  "ER_GET_ERRMSG" :
    /Got error (.*) '(.*)' from (.*)/,

  "ER_GET_TEMPORARY_ERRMSG" :
    /Got temporary error (.*) '(.*)' from (.*)/,

  "ER_UNKNOWN_TIME_ZONE" :
    /Unknown or incorrect time zone\: '(.*)'/,

  "ER_WARN_INVALID_TIMESTAMP" :
    /Invalid TIMESTAMP value in column '(.*)' at row (.*)/,

  "ER_INVALID_CHARACTER_STRING" :
    /Invalid (.*) character string\: '(.*)'/,

  "ER_WARN_ALLOWED_PACKET_OVERFLOWED" :
    /Result of (.*)() was larger than max_allowed_packet ((.*)) - truncated/,

  "ER_CONFLICTING_DECLARATIONS" :
    /Conflicting declarations\: '(.*)(.*)' and '(.*)(.*)'/,

  "ER_SP_NO_RECURSIVE_CREATE" :
    /Can't create a (.*) from within another stored routine/,

  "ER_SP_ALREADY_EXISTS" :
    /(.*)/,

  "ER_SP_DOES_NOT_EXIST" :
    /(.*) (.*) does not exist/,

  "ER_SP_DROP_FAILED" :
    /Failed to DROP (.*) (.*)/,

  "ER_SP_STORE_FAILED" :
    /Failed to CREATE (.*) (.*)/,

  "ER_SP_LILABEL_MISMATCH" :
    /(.*)/,

  "ER_SP_LABEL_REDEFINE" :
    /Redefining label (.*)/,

  "ER_SP_LABEL_MISMATCH" :
    /End-label (.*) without match/,

  "ER_SP_UNINIT_VAR" :
    /Referring to uninitialized variable (.*)/,

  "ER_SP_BADSELECT" :
    /PROCEDURE (.*) can't return a result set in the given context/,

  "ER_SP_BADRETURN" :
    /RETURN is only allowed in a FUNCTION/,

  "ER_SP_BADSTATEMENT" :
    /(.*)/,

  "ER_UPDATE_LOG_DEPRECATED_IGNORED" :
    /The update log is deprecated and replaced by the binary log; SET SQL_LOG_UPDATE has been ignored. This option will be removed in MySQL 5.6./,

  "ER_UPDATE_LOG_DEPRECATED_TRANSLATED" :
    /The update log is deprecated and replaced by the binary log; SET SQL_LOG_UPDATE has been translated to SET SQL_LOG_BIN. This option will be removed in MySQL 5.6./,

  "ER_QUERY_INTERRUPTED" :
    /Query execution was interrupted/,

  "ER_SP_WRONG_NO_OF_ARGS" :
    /Incorrect number of arguments for (.*) (.*); expected (.*), got (.*)/,

  "ER_SP_COND_MISMATCH" :
    /Undefined CONDITION\: (.*)/,

  "ER_SP_NORETURN" :
    /No RETURN found in FUNCTION (.*)/,

  "ER_SP_NORETURNEND" :
    /FUNCTION (.*) ended without RETURN/,

  "ER_SP_BAD_CURSOR_QUERY" :
    /Cursor statement must be a SELECT/,

  "ER_SP_BAD_CURSOR_SELECT" :
    /Cursor SELECT must not have INTO/,

  "ER_SP_CURSOR_MISMATCH" :
    /Undefined CURSOR\: (.*)/,

  "ER_SP_CURSOR_ALREADY_OPEN" :
    /Cursor is already open/,

  "ER_SP_CURSOR_NOT_OPEN" :
    /Cursor is not open/,

  "ER_SP_UNDECLARED_VAR" :
    /Undeclared variable\: (.*)/,

  "ER_SP_WRONG_NO_OF_FETCH_ARGS" :
    /Incorrect number of FETCH variables/,

  "ER_SP_FETCH_NO_DATA" :
    /No data - zero rows fetched, selected, or processed/,

  "ER_SP_DUP_PARAM" :
    /Duplicate parameter\: (.*)/,

  "ER_SP_DUP_VAR" :
    /Duplicate variable\: (.*)/,

  "ER_SP_DUP_COND" :
    /Duplicate condition\: (.*)/,

  "ER_SP_DUP_CURS" :
    /Duplicate cursor\: (.*)/,

  "ER_SP_CANT_ALTER" :
    /Failed to ALTER (.*) (.*)/,

  "ER_SP_SUBSELECT_NYI" :
    /Subquery value not supported/,

  "ER_STMT_NOT_ALLOWED_IN_SF_OR_TRG" :
    /(.*) is not allowed in stored function or trigger/,

  "ER_SP_VARCOND_AFTER_CURSHNDLR" :
    /Variable or condition declaration after cursor or handler declaration/,

  "ER_SP_CURSOR_AFTER_HANDLER" :
    /Cursor declaration after handler declaration/,

  "ER_SP_CASE_NOT_FOUND" :
    /Case not found for CASE statement/,

  "ER_FPARSER_TOO_BIG_FILE" :
    /Configuration file '(.*)' is too big/,

  "ER_FPARSER_BAD_HEADER" :
    /Malformed file type header in file '(.*)'/,

  "ER_FPARSER_EOF_IN_COMMENT" :
    /Unexpected end of file while parsing comment '(.*)'/,

  "ER_FPARSER_ERROR_IN_PARAMETER" :
    /Error while parsing parameter '(.*)' (line\: '(.*)')/,

  "ER_FPARSER_EOF_IN_UNKNOWN_PARAMETER" :
    /Unexpected end of file while skipping unknown parameter '(.*)'/,

  "ER_VIEW_NO_EXPLAIN" :
    /EXPLAIN\/SHOW can not be issued; lacking privileges for underlying table/,

  "ER_FRM_UNKNOWN_TYPE" :
    /File '(.*)' has unknown type '(.*)' in its header/,

  "ER_WRONG_OBJECT" :
    /'(.*).(.*)' is not (.*)/,

  "ER_NONUPDATEABLE_COLUMN" :
    /Column '(.*)' is not updatable/,

  "ER_VIEW_SELECT_DERIVED" :
    /View's SELECT contains a subquery in the FROM clause/,

  "ER_VIEW_SELECT_CLAUSE" :
    /View's SELECT contains a '(.*)' clause/,

  "ER_VIEW_SELECT_VARIABLE" :
    /View's SELECT contains a variable or parameter/,

  "ER_VIEW_SELECT_TMPTABLE" :
    /View's SELECT refers to a temporary table '(.*)'/,

  "ER_VIEW_WRONG_LIST" :
    /View's SELECT and view's field list have different column counts/,

  "ER_WARN_VIEW_MERGE" :
    /View merge algorithm can't be used here for now (assumed undefined algorithm)/,

  "ER_WARN_VIEW_WITHOUT_KEY" :
    /View being updated does not have complete key of underlying table in it/,

  "ER_VIEW_INVALID" :
    /View '(.*).(.*)' references invalid table(s) or column(s) or function(s) or definer\/invoker of view lack rights to use them/,

  "ER_SP_NO_DROP_SP" :
    /Can't drop or alter a (.*) from within another stored routine/,

  "ER_SP_GOTO_IN_HNDLR" :
    /GOTO is not allowed in a stored procedure handler/,

  "ER_TRG_ALREADY_EXISTS" :
    /Trigger already exists/,

  "ER_TRG_DOES_NOT_EXIST" :
    /Trigger does not exist/,

  "ER_TRG_ON_VIEW_OR_TEMP_TABLE" :
    /Trigger's '(.*)' is view or temporary table/,

  "ER_TRG_CANT_CHANGE_ROW" :
    /Updating of (.*) row is not allowed in (.*)trigger/,

  "ER_TRG_NO_SUCH_ROW_IN_TRG" :
    /There is no (.*) row in (.*) trigger/,

  "ER_NO_DEFAULT_FOR_FIELD" :
    /Field '(.*)' doesn't have a default value/,

  "ER_DIVISION_BY_ZERO" :
    /Division by 0/,

  "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD" :
    /Incorrect (.*) value\: '(.*)' for column '(.*)' at row (.*)/,

  "ER_ILLEGAL_VALUE_FOR_TYPE" :
    /Illegal (.*) '(.*)' value found during parsing/,

  "ER_VIEW_NONUPD_CHECK" :
    /CHECK OPTION on non-updatable view '(.*).(.*)'/,

  "ER_VIEW_CHECK_FAILED" :
    /CHECK OPTION failed '(.*).(.*)'/,

  "ER_PROCACCESS_DENIED_ERROR" :
    /(.*) command denied to user '(.*)'@'(.*)' for routine '(.*)'/,

  "ER_RELAY_LOG_FAIL" :
    /Failed purging old relay logs\: (.*)/,

  "ER_PASSWD_LENGTH" :
    /Password hash should be a (.*)-digit hexadecimal number/,

  "ER_UNKNOWN_TARGET_BINLOG" :
    /Target log not found in binlog index/,

  "ER_IO_ERR_LOG_INDEX_READ" :
    /I\/O error reading log index file/,

  "ER_BINLOG_PURGE_PROHIBITED" :
    /Server configuration does not permit binlog purge/,

  "ER_FSEEK_FAIL" :
    /Failed on fseek()/,

  "ER_BINLOG_PURGE_FATAL_ERR" :
    /Fatal error during log purge/,

  "ER_LOG_IN_USE" :
    /A purgeable log is in use, will not purge/,

  "ER_LOG_PURGE_UNKNOWN_ERR" :
    /Unknown error during log purge/,

  "ER_RELAY_LOG_INIT" :
    /Failed initializing relay log position\: (.*)/,

  "ER_NO_BINARY_LOGGING" :
    /You are not using binary logging/,

  "ER_RESERVED_SYNTAX" :
    /The '(.*)' syntax is reserved for purposes internal to the MySQL server/,

  "ER_WSAS_FAILED" :
    /WSAStartup Failed/,

  "ER_DIFF_GROUPS_PROC" :
    /Can't handle procedures with different groups yet/,

  "ER_NO_GROUP_FOR_PROC" :
    /Select must have a group with this procedure/,

  "ER_ORDER_WITH_PROC" :
    /Can't use ORDER clause with this procedure/,

  "ER_LOGGING_PROHIBIT_CHANGING_OF" :
    /Binary logging and replication forbid changing the global server (.*)/,

  "ER_NO_FILE_MAPPING" :
    /Can't map file\: (.*), errno\: (.*)/,

  "ER_WRONG_MAGIC" :
    /Wrong magic in (.*)/,

  "ER_PS_MANY_PARAM" :
    /Prepared statement contains too many placeholders/,

  "ER_KEY_PART_0" :
    /Key part '(.*)' length cannot be 0/,

  "ER_VIEW_CHECKSUM" :
    /View text checksum failed/,

  "ER_VIEW_MULTIUPDATE" :
    /Can not modify more than one base table through a join view '(.*).(.*)'/,

  "ER_VIEW_NO_INSERT_FIELD_LIST" :
    /Can not insert into join view '(.*).(.*)' without fields list/,

  "ER_VIEW_DELETE_MERGE_VIEW" :
    /Can not delete from join view '(.*).(.*)'/,

  "ER_CANNOT_USER" :
    /Operation (.*) failed for (.*)/,

  "ER_XAER_NOTA" :
    /XAER_NOTA\: Unknown XID/,

  "ER_XAER_INVAL" :
    /XAER_INVAL\: Invalid arguments (or unsupported command)/,

  "ER_XAER_RMFAIL" :
    /XAER_RMFAIL\: The command cannot be executed when global transaction is in the  (.*) state/,

  "ER_XAER_OUTSIDE" :
    /XAER_OUTSIDE\: Some work is done outside global transaction/,

  "ER_XAER_RMERR" :
    /XAER_RMERR\: Fatal error occurred in the transaction branch - check your data for consistency/,

  "ER_XA_RBROLLBACK" :
    /XA_RBROLLBACK\: Transaction branch was rolled back/,

  "ER_NONEXISTING_PROC_GRANT" :
    /There is no such grant defined for user '(.*)' on host '(.*)' on routine '(.*)'/,

  "ER_PROC_AUTO_GRANT_FAIL" :
    /Failed to grant EXECUTE and ALTER ROUTINE privileges/,

  "ER_PROC_AUTO_REVOKE_FAIL" :
    /Failed to revoke all privileges to dropped routine/,

  "ER_DATA_TOO_LONG" :
    /Data too long for column '(.*)' at row (.*)/,

  "ER_SP_BAD_SQLSTATE" :
    /Bad SQLSTATE\: '(.*)'/,

  "ER_STARTUP" :
    /(.*)/,

  "ER_LOAD_FROM_FIXED_SIZE_ROWS_TO_VAR" :
    /Can't load value from file with fixed size rows to variable/,

  "ER_CANT_CREATE_USER_WITH_GRANT" :
    /You are not allowed to create a user with GRANT/,

  "ER_WRONG_VALUE_FOR_TYPE" :
    /Incorrect (.*) value\: '(.*)' for function (.*)/,

  "ER_TABLE_DEF_CHANGED" :
    /Table definition has changed, please retry transaction/,

  "ER_SP_DUP_HANDLER" :
    /Duplicate handler declared in the same block/,

  "ER_SP_NOT_VAR_ARG" :
    /OUT or INOUT argument (.*) for routine (.*) is not a variable or NEW pseudo-variable in BEFORE trigger/,

  "ER_SP_NO_RETSET" :
    /Not allowed to return a result set from a (.*)/,

  "ER_CANT_CREATE_GEOMETRY_OBJECT" :
    /Cannot get geometry object from data you send to the GEOMETRY field/,

  "ER_FAILED_ROUTINE_BREAK_BINLOG" :
    /A routine failed and has neither NO SQL nor READS SQL DATA in its declaration and binary logging is enabled; if non-transactional tables were updated, the binary log will miss their changes/,

  "ER_BINLOG_UNSAFE_ROUTINE" :
    /This function has none of DETERMINISTIC, NO SQL, or READS SQL DATA in its declaration and binary logging is enabled (you *might* want to use the less safe log_bin_trust_function_creators variable)/,

  "ER_BINLOG_CREATE_ROUTINE_NEED_SUPER" :
    /You do not have the SUPER privilege and binary logging is enabled (you *might* want to use the less safe log_bin_trust_function_creators variable)/,

  "ER_EXEC_STMT_WITH_OPEN_CURSOR" :
    /You can't execute a prepared statement which has an open cursor associated with it. Reset the statement to re-execute it./,

  "ER_STMT_HAS_NO_OPEN_CURSOR" :
    /The statement ((.*)u) has no open cursor./,

  "ER_COMMIT_NOT_ALLOWED_IN_SF_OR_TRG" :
    /Explicit or implicit commit is not allowed in stored function or trigger./,

  "ER_NO_DEFAULT_FOR_VIEW_FIELD" :
    /Field of view '(.*).(.*)' underlying table doesn't have a default value/,

  "ER_SP_NO_RECURSION" :
    /Recursive stored functions and triggers are not allowed./,

  "ER_TOO_BIG_SCALE" :
    /Too big scale (.*) specified for column '(.*)'. Maximum is (.*)u./,

  "ER_TOO_BIG_PRECISION" :
    /Too big precision (.*) specified for column '(.*)'. Maximum is (.*)u./,

  "ER_M_BIGGER_THAN_D" :
    /For float(M,D), double(M,D) or decimal(M,D), M must be >= D (column '(.*)')./,

  "ER_WRONG_LOCK_OF_SYSTEM_TABLE" :
    /You can't combine write-locking of system tables with other tables or lock types/,

  "ER_CONNECT_TO_FOREIGN_DATA_SOURCE" :
    /Unable to connect to foreign data source\: (.*)/,

  "ER_QUERY_ON_FOREIGN_DATA_SOURCE" :
    /There was a problem processing the query on the foreign data source. Data source error\: (.*)/,

  "ER_FOREIGN_DATA_SOURCE_DOESNT_EXIST" :
    /The foreign data source you are trying to reference does not exist. Data source error\:  (.*)/,

  "ER_FOREIGN_DATA_STRING_INVALID_CANT_CREATE" :
    /Can't create federated table. The data source connection string '(.*)' is not in the correct format/,

  "ER_FOREIGN_DATA_STRING_INVALID" :
    /The data source connection string '(.*)' is not in the correct format/,

  "ER_CANT_CREATE_FEDERATED_TABLE" :
    /Can't create federated table. Foreign data src error\:  (.*)/,

  "ER_TRG_IN_WRONG_SCHEMA" :
    /Trigger in wrong schema/,

  "ER_STACK_OVERRUN_NEED_MORE" :
    /Thread stack overrun\:  (.*) bytes used of a (.*) byte stack, and (.*) bytes needed.  Use 'mysqld --thread_stack=#' to specify a bigger stack./,

  "ER_TOO_LONG_BODY" :
    /Routine body for '(.*)' is too long/,

  "ER_WARN_CANT_DROP_DEFAULT_KEYCACHE" :
    /Cannot drop default keycache/,

  "ER_TOO_BIG_DISPLAYWIDTH" :
    /Display width out of range for column '(.*)' (max = (.*)u)/,

  "ER_XAER_DUPID" :
    /XAER_DUPID\: The XID already exists/,

  "ER_DATETIME_FUNCTION_OVERFLOW" :
    /Datetime function\: (.*) field overflow/,

  "ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG" :
    /Can't update table '(.*)' in stored function\/trigger because it is already used by statement which invoked this stored function\/trigger./,

  "ER_VIEW_PREVENT_UPDATE" :
    /The definition of table '(.*)' prevents operation (.*) on table '(.*)'./,

  "ER_PS_NO_RECURSION" :
    /The prepared statement contains a stored routine call that refers to that same statement. It's not allowed to execute a prepared statement in such a recursive manner/,

  "ER_SP_CANT_SET_AUTOCOMMIT" :
    /Not allowed to set autocommit from a stored function or trigger/,

  "ER_MALFORMED_DEFINER" :
    /Definer is not fully qualified/,

  "ER_VIEW_FRM_NO_USER" :
    /View '(.*)'.'(.*)' has no definer information (old table format). Current user is used as definer. Please recreate the view!/,

  "ER_VIEW_OTHER_USER" :
    /You need the SUPER privilege for creation view with '(.*)'@'(.*)' definer/,

  "ER_NO_SUCH_USER" :
    /The user specified as a definer ('(.*)'@'(.*)') does not exist/,

  "ER_FORBID_SCHEMA_CHANGE" :
    /Changing schema from '(.*)' to '(.*)' is not allowed./,

  "ER_ROW_IS_REFERENCED_2" :
    /Cannot delete or update a parent row\: a foreign key constraint fails ((.*))/,

  "ER_NO_REFERENCED_ROW_2" :
    /Cannot add or update a child row\: a foreign key constraint fails ((.*))/,

  "ER_SP_BAD_VAR_SHADOW" :
    /Variable '(.*)' must be quoted with `...`, or renamed/,

  "ER_TRG_NO_DEFINER" :
    /No definer attribute for trigger '(.*)'.'(.*)'. The trigger will be activated under the authorization of the invoker, which may have insufficient privileges. Please recreate the trigger./,

  "ER_OLD_FILE_FORMAT" :
    /'(.*)' has an old format, you should re-create the '(.*)' object(s)/,

  "ER_SP_RECURSION_LIMIT" :
    /Recursive limit (.*) (as set by the max_sp_recursion_depth variable) was exceeded for routine (.*)/,

  "ER_SP_PROC_TABLE_CORRUPT" :
    /Failed to load routine (.*). The table mysql.proc is missing, corrupt, or contains bad data (internal code (.*))/,

  "ER_SP_WRONG_NAME" :
    /Incorrect routine name '(.*)'/,

  "ER_TABLE_NEEDS_UPGRADE" :
    /Table upgrade required. Please do \"REPAIR TABLE `(.*)`\" or dump\/reload to fix it!/,

  "ER_SP_NO_AGGREGATE" :
    /AGGREGATE is not supported for stored functions/,

  "ER_MAX_PREPARED_STMT_COUNT_REACHED" :
    /Can't create more than max_prepared_stmt_count statements (current value\: (.*)u)/,

  "ER_VIEW_RECURSIVE" :
    /`(.*)`.`(.*)` contains view recursion/,

  "ER_NON_GROUPING_FIELD_USED" :
    /Non-grouping field '(.*)' is used in (.*) clause/,

  "ER_TABLE_CANT_HANDLE_SPKEYS" :
    /The used table type doesn't support SPATIAL indexes/,

  "ER_NO_TRIGGERS_ON_SYSTEM_SCHEMA" :
    /Triggers can not be created on system tables/,

  "ER_REMOVED_SPACES" :
    /Leading spaces are removed from name '(.*)'/,

  "ER_AUTOINC_READ_FAILED" :
    /Failed to read auto-increment value from storage engine/,

  "ER_USERNAME" :
    /user name/,

  "ER_HOSTNAME" :
    /host name/,

  "ER_WRONG_STRING_LENGTH" :
    /String '(.*)' is too long for (.*) (should be no longer than (.*))/,

  "ER_NON_INSERTABLE_TABLE" :
    /The target table (.*) of the (.*) is not insertable-into/,

  "ER_ADMIN_WRONG_MRG_TABLE" :
    /Table '(.*)' is differently defined or of non-MyISAM type or doesn't exist/,

  "ER_TOO_HIGH_LEVEL_OF_NESTING_FOR_SELECT" :
    /Too high level of nesting for select/,

  "ER_NAME_BECOMES_EMPTY" :
    /Name '(.*)' has become ''/,

  "ER_AMBIGUOUS_FIELD_TERM" :
    /First character of the FIELDS TERMINATED string is ambiguous; please use non-optional and non-empty FIELDS ENCLOSED BY/,

  "ER_FOREIGN_SERVER_EXISTS" :
    /The foreign server, (.*), you are trying to create already exists./,

  "ER_FOREIGN_SERVER_DOESNT_EXIST" :
    /The foreign server name you are trying to reference does not exist. Data source error\:  (.*)/,

  "ER_ILLEGAL_HA_CREATE_OPTION" :
    /Table storage engine '(.*)' does not support the create option '(.*)'/,

  "ER_PARTITION_REQUIRES_VALUES_ERROR" :
    /Syntax error\: (.*) PARTITIONING requires definition of VALUES (.*) for each partition/,

  "ER_PARTITION_WRONG_VALUES_ERROR" :
    /Only (.*) PARTITIONING can use VALUES (.*) in partition definition/,

  "ER_PARTITION_MAXVALUE_ERROR" :
    /MAXVALUE can only be used in last partition definition/,

  "ER_PARTITION_SUBPARTITION_ERROR" :
    /Subpartitions can only be hash partitions and by key/,

  "ER_PARTITION_SUBPART_MIX_ERROR" :
    /Must define subpartitions on all partitions if on one partition/,

  "ER_PARTITION_WRONG_NO_PART_ERROR" :
    /Wrong number of partitions defined, mismatch with previous setting/,

  "ER_PARTITION_WRONG_NO_SUBPART_ERROR" :
    /Wrong number of subpartitions defined, mismatch with previous setting/,

  "ER_WRONG_EXPR_IN_PARTITION_FUNC_ERROR" :
    /Constant, random or timezone-dependent expressions in (sub)partitioning function are not allowed/,

  "ER_NO_CONST_EXPR_IN_RANGE_OR_LIST_ERROR" :
    /Expression in RANGE\/LIST VALUES must be constant/,

  "ER_FIELD_NOT_FOUND_PART_ERROR" :
    /Field in list of fields for partition function not found in table/,

  "ER_LIST_OF_FIELDS_ONLY_IN_HASH_ERROR" :
    /List of fields is only allowed in KEY partitions/,

  "ER_INCONSISTENT_PARTITION_INFO_ERROR" :
    /The partition info in the frm file is not consistent with what can be written into the frm file/,

  "ER_PARTITION_FUNC_NOT_ALLOWED_ERROR" :
    /The (.*) function returns the wrong type/,

  "ER_PARTITIONS_MUST_BE_DEFINED_ERROR" :
    /For (.*) partitions each partition must be defined/,

  "ER_RANGE_NOT_INCREASING_ERROR" :
    /VALUES LESS THAN value must be strictly increasing for each partition/,

  "ER_INCONSISTENT_TYPE_OF_FUNCTIONS_ERROR" :
    /VALUES value must be of same type as partition function/,

  "ER_MULTIPLE_DEF_CONST_IN_LIST_PART_ERROR" :
    /Multiple definition of same constant in list partitioning/,

  "ER_PARTITION_ENTRY_ERROR" :
    /Partitioning can not be used stand-alone in query/,

  "ER_MIX_HANDLER_ERROR" :
    /The mix of handlers in the partitions is not allowed in this version of MySQL/,

  "ER_PARTITION_NOT_DEFINED_ERROR" :
    /For the partitioned engine it is necessary to define all (.*)/,

  "ER_TOO_MANY_PARTITIONS_ERROR" :
    /Too many partitions (including subpartitions) were defined/,

  "ER_SUBPARTITION_ERROR" :
    /It is only possible to mix RANGE\/LIST partitioning with HASH\/KEY partitioning for subpartitioning/,

  "ER_CANT_CREATE_HANDLER_FILE" :
    /Failed to create specific handler file/,

  "ER_BLOB_FIELD_IN_PART_FUNC_ERROR" :
    /A BLOB field is not allowed in partition function/,

  "ER_UNIQUE_KEY_NEED_ALL_FIELDS_IN_PF" :
    /A (.*) must include all columns in the table's partitioning function/,

  "ER_NO_PARTS_ERROR" :
    /Number of (.*) = 0 is not an allowed value/,

  "ER_PARTITION_MGMT_ON_NONPARTITIONED" :
    /Partition management on a not partitioned table is not possible/,

  "ER_FOREIGN_KEY_ON_PARTITIONED" :
    /Foreign key clause is not yet supported in conjunction with partitioning/,

  "ER_DROP_PARTITION_NON_EXISTENT" :
    /Error in list of partitions to (.*)/,

  "ER_DROP_LAST_PARTITION" :
    /Cannot remove all partitions, use DROP TABLE instead/,

  "ER_COALESCE_ONLY_ON_HASH_PARTITION" :
    /COALESCE PARTITION can only be used on HASH\/KEY partitions/,

  "ER_REORG_HASH_ONLY_ON_SAME_NO" :
    /REORGANIZE PARTITION can only be used to reorganize partitions not to change their numbers/,

  "ER_REORG_NO_PARAM_ERROR" :
    /REORGANIZE PARTITION without parameters can only be used on auto-partitioned tables using HASH PARTITIONs/,

  "ER_ONLY_ON_RANGE_LIST_PARTITION" :
    /(.*)/,

  "ER_ADD_PARTITION_SUBPART_ERROR" :
    /Trying to Add partition(s) with wrong number of subpartitions/,

  "ER_ADD_PARTITION_NO_NEW_PARTITION" :
    /At least one partition must be added/,

  "ER_COALESCE_PARTITION_NO_PARTITION" :
    /At least one partition must be coalesced/,

  "ER_REORG_PARTITION_NOT_EXIST" :
    /More partitions to reorganize than there are partitions/,

  "ER_SAME_NAME_PARTITION" :
    /Duplicate partition name (.*)/,

  "ER_NO_BINLOG_ERROR" :
    /It is not allowed to shut off binlog on this command/,

  "ER_CONSECUTIVE_REORG_PARTITIONS" :
    /When reorganizing a set of partitions they must be in consecutive order/,

  "ER_REORG_OUTSIDE_RANGE" :
    /Reorganize of range partitions cannot change total ranges except for last partition where it can extend the range/,

  "ER_PARTITION_FUNCTION_FAILURE" :
    /Partition function not supported in this version for this handler/,

  "ER_PART_STATE_ERROR" :
    /Partition state cannot be defined from CREATE\/ALTER TABLE/,

  "ER_LIMITED_PART_RANGE" :
    /The (.*) handler only supports 32 bit integers in VALUES/,

  "ER_PLUGIN_IS_NOT_LOADED" :
    /Plugin '(.*)' is not loaded/,

  "ER_WRONG_VALUE" :
    /Incorrect (.*) value\: '(.*)'/,

  "ER_NO_PARTITION_FOR_GIVEN_VALUE" :
    /Table has no partition for value (.*)/,

  "ER_FILEGROUP_OPTION_ONLY_ONCE" :
    /It is not allowed to specify (.*) more than once/,

  "ER_CREATE_FILEGROUP_FAILED" :
    /Failed to create (.*)/,

  "ER_DROP_FILEGROUP_FAILED" :
    /Failed to drop (.*)/,

  "ER_TABLESPACE_AUTO_EXTEND_ERROR" :
    /The handler doesn't support autoextend of tablespaces/,

  "ER_WRONG_SIZE_NUMBER" :
    /A size parameter was incorrectly specified, either number or on the form 10M/,

  "ER_SIZE_OVERFLOW_ERROR" :
    /The size number was correct but we don't allow the digit part to be more than 2 billion/,

  "ER_ALTER_FILEGROUP_FAILED" :
    /Failed to alter\: (.*)/,

  "ER_BINLOG_ROW_LOGGING_FAILED" :
    /Writing one row to the row-based binary log failed/,

  "ER_BINLOG_ROW_WRONG_TABLE_DEF" :
    /Table definition on master and slave does not match\: (.*)/,

  "ER_BINLOG_ROW_RBR_TO_SBR" :
    /Slave running with --log-slave-updates must use row-based binary logging to be able to replicate row-based binary log events/,

  "ER_EVENT_ALREADY_EXISTS" :
    /Event '(.*)' already exists/,

  "ER_EVENT_STORE_FAILED" :
    /Failed to store event (.*). Error code (.*) from storage engine./,

  "ER_EVENT_DOES_NOT_EXIST" :
    /Unknown event '(.*)'/,

  "ER_EVENT_CANT_ALTER" :
    /Failed to alter event '(.*)'/,

  "ER_EVENT_DROP_FAILED" :
    /Failed to drop (.*)/,

  "ER_EVENT_INTERVAL_NOT_POSITIVE_OR_TOO_BIG" :
    /INTERVAL is either not positive or too big/,

  "ER_EVENT_ENDS_BEFORE_STARTS" :
    /ENDS is either invalid or before STARTS/,

  "ER_EVENT_EXEC_TIME_IN_THE_PAST" :
    /Event execution time is in the past. Event has been disabled/,

  "ER_EVENT_OPEN_TABLE_FAILED" :
    /Failed to open mysql.event/,

  "ER_EVENT_NEITHER_M_EXPR_NOR_M_AT" :
    /No datetime expression provided/,

  "ER_COL_COUNT_DOESNT_MATCH_CORRUPTED" :
    /Column count of mysql.(.*) is wrong. Expected (.*), found (.*). The table is probably corrupted/,

  "ER_CANNOT_LOAD_FROM_TABLE" :
    /Cannot load from mysql.(.*). The table is probably corrupted/,

  "ER_EVENT_CANNOT_DELETE" :
    /Failed to delete the event from mysql.event/,

  "ER_EVENT_COMPILE_ERROR" :
    /Error during compilation of event's body/,

  "ER_EVENT_SAME_NAME" :
    /Same old and new event name/,

  "ER_EVENT_DATA_TOO_LONG" :
    /Data for column '(.*)' too long/,

  "ER_DROP_INDEX_FK" :
    /Cannot drop index '(.*)'\: needed in a foreign key constraint/,

  "ER_WARN_DEPRECATED_SYNTAX_WITH_VER" :
    /"The syntax '(.*)' is deprecated and will be removed in MySQL (.*). Please use (.*) instead/,

  "ER_CANT_WRITE_LOCK_LOG_TABLE" :
    /You can't write-lock a log table. Only read access is possible/,

  "ER_CANT_LOCK_LOG_TABLE" :
    /You can't use locks with log tables./,

  "ER_FOREIGN_DUPLICATE_KEY" :
    /Upholding foreign key constraints for table '(.*)', entry '(.*)', key (.*) would lead to a duplicate entry/,

  "ER_COL_COUNT_DOESNT_MATCH_PLEASE_UPDATE" :
    /Column count of mysql.(.*) is wrong. Expected (.*), found (.*). Created with MySQL (.*), now running (.*). Please use mysql_upgrade to fix this error./,

  "ER_TEMP_TABLE_PREVENTS_SWITCH_OUT_OF_RBR" :
    /Cannot switch out of the row-based binary log format when the session has open temporary tables/,

  "ER_STORED_FUNCTION_PREVENTS_SWITCH_BINLOG_FORMAT" :
    /Cannot change the binary logging format inside a stored function or trigger/,

  "ER_NDB_CANT_SWITCH_BINLOG_FORMAT" :
    /The NDB cluster engine does not support changing the binlog format on the fly yet/,

  "ER_PARTITION_NO_TEMPORARY" :
    /Cannot create temporary table with partitions/,

  "ER_PARTITION_CONST_DOMAIN_ERROR" :
    /Partition constant is out of partition function domain/,

  "ER_PARTITION_FUNCTION_IS_NOT_ALLOWED" :
    /This partition function is not allowed/,

  "ER_DDL_LOG_ERROR" :
    /Error in DDL log/,

  "ER_NULL_IN_VALUES_LESS_THAN" :
    /Not allowed to use NULL value in VALUES LESS THAN/,

  "ER_WRONG_PARTITION_NAME" :
    /Incorrect partition name/,

  "ER_CANT_CHANGE_TX_ISOLATION" :
    /Transaction isolation level can't be changed while a transaction is in progress/,

  "ER_DUP_ENTRY_AUTOINCREMENT_CASE" :
    /ALTER TABLE causes auto_increment resequencing, resulting in duplicate entry '(.*)' for key '(.*)'/,

  "ER_EVENT_MODIFY_QUEUE_ERROR" :
    /Internal scheduler error (.*)/,

  "ER_EVENT_SET_VAR_ERROR" :
    /Error during starting\/stopping of the scheduler. Error code (.*)/,

  "ER_PARTITION_MERGE_ERROR" :
    /Engine cannot be used in partitioned tables/,

  "ER_CANT_ACTIVATE_LOG" :
    /Cannot activate '(.*)' log/,

  "ER_RBR_NOT_AVAILABLE" :
    /The server was not built with row-based replication/,

  "ER_BASE64_DECODE_ERROR" :
    /Decoding of base64 string failed/,

  "ER_EVENT_RECURSION_FORBIDDEN" :
    /Recursion of EVENT DDL statements is forbidden when body is present/,

  "ER_EVENTS_DB_ERROR" :
    /Cannot proceed because system tables used by Event Scheduler were found damaged at server start/,

  "ER_ONLY_INTEGERS_ALLOWED" :
    /Only integers allowed as number here/,

  "ER_UNSUPORTED_LOG_ENGINE" :
    /This storage engine cannot be used for log tables/,

  "ER_BAD_LOG_STATEMENT" :
    /You cannot '(.*)' a log table if logging is enabled/,

  "ER_CANT_RENAME_LOG_TABLE" :
    /Cannot rename '(.*)'. When logging enabled, rename to\/from log table must rename two tables\: the log table to an archive table and another table back to '(.*)'/,

  "ER_WRONG_PARAMCOUNT_TO_NATIVE_FCT" :
    /Incorrect parameter count in the call to native function '(.*)'/,

  "ER_WRONG_PARAMETERS_TO_NATIVE_FCT" :
    /Incorrect parameters in the call to native function '(.*)'/,

  "ER_WRONG_PARAMETERS_TO_STORED_FCT" :
    /Incorrect parameters in the call to stored function '(.*)'/,

  "ER_NATIVE_FCT_NAME_COLLISION" :
    /This function '(.*)' has the same name as a native function/,

  "ER_DUP_ENTRY_WITH_KEY_NAME" :
    /Duplicate entry '(.*)' for key '(.*)'/,

  "ER_BINLOG_PURGE_EMFILE" :
    /Too many files opened, please execute the command again/,

  "ER_EVENT_CANNOT_CREATE_IN_THE_PAST" :
    /Event execution time is in the past and ON COMPLETION NOT PRESERVE is set. The event was dropped immediately after creation./,

  "ER_EVENT_CANNOT_ALTER_IN_THE_PAST" :
    /Event execution time is in the past and ON COMPLETION NOT PRESERVE is set. The event was dropped immediately after creation./,

  "ER_SLAVE_INCIDENT" :
    /The incident (.*) occured on the master. Message\: (.*)/,

  "ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT" :
    /Table has no partition for some existing values/,

  "ER_BINLOG_UNSAFE_STATEMENT" :
    /Unsafe statement written to the binary log using statement format since BINLOG_FORMAT = STATEMENT. (.*)/,

  "ER_SLAVE_FATAL_ERROR" :
    /Fatal error\: (.*)/,

  "ER_SLAVE_RELAY_LOG_READ_FAILURE" :
    /Relay log read failure\: (.*)/,

  "ER_SLAVE_RELAY_LOG_WRITE_FAILURE" :
    /Relay log write failure\: (.*)/,

  "ER_SLAVE_CREATE_EVENT_FAILURE" :
    /Failed to create (.*)/,

  "ER_SLAVE_MASTER_COM_FAILURE" :
    /Master command (.*) failed\: (.*)/,

  "ER_BINLOG_LOGGING_IMPOSSIBLE" :
    /Binary logging not possible. Message\: (.*)/,

  "ER_VIEW_NO_CREATION_CTX" :
    /View `(.*)`.`(.*)` has no creation context/,

  "ER_VIEW_INVALID_CREATION_CTX" :
    /Creation context of view `(.*)`.`(.*)' is invalid/,

  "ER_SR_INVALID_CREATION_CTX" :
    /Creation context of stored routine `(.*)`.`(.*)` is invalid/,

  "ER_TRG_CORRUPTED_FILE" :
    /Corrupted TRG file for table `(.*)`.`(.*)`/,

  "ER_TRG_NO_CREATION_CTX" :
    /Triggers for table `(.*)`.`(.*)` have no creation context/,

  "ER_TRG_INVALID_CREATION_CTX" :
    /Trigger creation context of table `(.*)`.`(.*)` is invalid/,

  "ER_EVENT_INVALID_CREATION_CTX" :
    /Creation context of event `(.*)`.`(.*)` is invalid/,

  "ER_TRG_CANT_OPEN_TABLE" :
    /Cannot open table for trigger `(.*)`.`(.*)`/,

  "ER_CANT_CREATE_SROUTINE" :
    /Cannot create stored routine `(.*)`. Check warnings/,

  "ER_NEVER_USED" :
    /Ambiguous slave modes combination. (.*)/,

  "ER_NO_FORMAT_DESCRIPTION_EVENT_BEFORE_BINLOG_STATEMENT" :
    /The BINLOG statement of type `(.*)` was not preceded by a format description BINLOG statement./,

  "ER_SLAVE_CORRUPT_EVENT" :
    /Corrupted replication event was detected/,

  "ER_LOAD_DATA_INVALID_COLUMN" :
    /Invalid column reference ((.*)) in LOAD DATA/,

  "ER_LOG_PURGE_NO_FILE" :
    /Being purged log (.*) was not found/,

  "ER_XA_RBTIMEOUT" :
    /XA_RBTIMEOUT\: Transaction branch was rolled back\: took too long/,

  "ER_XA_RBDEADLOCK" :
    /XA_RBDEADLOCK\: Transaction branch was rolled back\: deadlock was detected/,

  "ER_NEED_REPREPARE" :
    /Prepared statement needs to be re-prepared/,

  "ER_DELAYED_NOT_SUPPORTED" :
    /DELAYED option not supported for table '(.*)'/,

  "WARN_NO_MASTER_INFO" :
    /The master info structure does not exist/,

  "WARN_OPTION_IGNORED" :
    /<(.*)> option ignored/,

  "WARN_PLUGIN_DELETE_BUILTIN" :
    /Built-in plugins cannot be deleted/,

  "WARN_PLUGIN_BUSY" :
    /Plugin is busy and will be uninstalled on shutdown/,

  "ER_VARIABLE_IS_READONLY" :
    /(.*) variable '(.*)' is read-only. Use SET (.*) to assign the value/,

  "ER_WARN_ENGINE_TRANSACTION_ROLLBACK" :
    /Storage engine (.*) does not support rollback for this statement. Transaction rolled back and must be restarted/,

  "ER_SLAVE_HEARTBEAT_FAILURE" :
    /Unexpected master's heartbeat data\: (.*)/,

  "ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE" :
    /The requested value for the heartbeat period is either negative or exceeds the maximum allowed ((.*) seconds)./,

  "ER_NDB_REPLICATION_SCHEMA_ERROR" :
    /Bad schema for mysql.ndb_replication table. Message\: (.*)/,

  "ER_CONFLICT_FN_PARSE_ERROR" :
    /Error in parsing conflict function. Message\: (.*)/,

  "ER_EXCEPTIONS_WRITE_ERROR" :
    /Write to exceptions table failed. Message\: (.*)/,

  "ER_TOO_LONG_TABLE_COMMENT" :
    /Comment for table '(.*)' is too long (max = (.*)u)/,

  "ER_TOO_LONG_FIELD_COMMENT" :
    /Comment for field '(.*)' is too long (max = (.*)u)/,

  "ER_FUNC_INEXISTENT_NAME_COLLISION" :
    /FUNCTION (.*) does not exist. Check the 'Function Name Parsing and Resolution' section in the Reference Manual/,

  "ER_DATABASE_NAME" :
    /Database/,

  "ER_TABLE_NAME" :
    /Table/,

  "ER_PARTITION_NAME" :
    /Partition/,

  "ER_SUBPARTITION_NAME" :
    /Subpartition/,

  "ER_TEMPORARY_NAME" :
    /Temporary/,

  "ER_RENAMED_NAME" :
    /Renamed/,

  "ER_TOO_MANY_CONCURRENT_TRXS" :
    /"Too many active concurrent transactions/,

  "WARN_NON_ASCII_SEPARATOR_NOT_IMPLEMENTED" :
    /Non-ASCII separator arguments are not fully supported/,

  "ER_DEBUG_SYNC_TIMEOUT" :
    /debug sync point wait timed out/,

  "ER_DEBUG_SYNC_HIT_LIMIT" :
    /debug sync point hit limit reached/,

  "ER_DUP_SIGNAL_SET" :
    /Duplicate condition information item '(.*)'/,

  "ER_SIGNAL_WARN" :
    /Unhandled user-defined warning condition/,

  "ER_SIGNAL_NOT_FOUND" :
    /Unhandled user-defined not found condition/,

  "ER_SIGNAL_EXCEPTION" :
    /Unhandled user-defined exception condition/,

  "ER_RESIGNAL_WITHOUT_ACTIVE_HANDLER" :
    /RESIGNAL when handler not active/,

  "ER_SIGNAL_BAD_CONDITION_TYPE" :
    /SIGNAL\/RESIGNAL can only use a CONDITION defined with SQLSTATE/,

  "WARN_COND_ITEM_TRUNCATED" :
    /Data truncated for condition item '(.*)'/,

  "ER_COND_ITEM_TOO_LONG" :
    /Data too long for condition item '(.*)'/,

  "ER_UNKNOWN_LOCALE" :
    /Unknown locale\: '(.*)'/,

  "ER_SLAVE_IGNORE_SERVER_IDS" :
    /The requested server id (.*) clashes with the slave startup option --replicate-same-server-id/,

  "ER_QUERY_CACHE_DISABLED" :
    /Query cache is disabled; restart the server with query_cache_type=1 to enable it/,

  "ER_SAME_NAME_PARTITION_FIELD" :
    /Duplicate partition field name '(.*)'/,

  "ER_PARTITION_COLUMN_LIST_ERROR" :
    /Inconsistency in usage of column lists for partitioning/,

  "ER_WRONG_TYPE_COLUMN_VALUE_ERROR" :
    /Partition column values of incorrect type/,

  "ER_TOO_MANY_PARTITION_FUNC_FIELDS_ERROR" :
    /Too many fields in '(.*)'/,

  "ER_MAXVALUE_IN_VALUES_IN" :
    /Cannot use MAXVALUE as value in VALUES IN/,

  "ER_TOO_MANY_VALUES_ERROR" :
    /Cannot have more than one value for this type of (.*) partitioning/,

  "ER_ROW_SINGLE_PARTITION_FIELD_ERROR" :
    /Row expressions in VALUES IN only allowed for multi-field column partitioning/,

  "ER_FIELD_TYPE_NOT_ALLOWED_AS_PARTITION_FIELD" :
    /Field '(.*)' is of a not allowed type for this type of partitioning/,

  "ER_PARTITION_FIELDS_TOO_LONG" :
    /The total length of the partitioning fields is too large/,

  "ER_BINLOG_ROW_ENGINE_AND_STMT_ENGINE" :
    /Cannot execute statement\: impossible to write to binary log since both row-incapable engines and statement-incapable engines are involved./,

  "ER_BINLOG_ROW_MODE_AND_STMT_ENGINE" :
    /Cannot execute statement\: impossible to write to binary log since BINLOG_FORMAT = ROW and at least one table uses a storage engine limited to statement-based logging./,

  "ER_BINLOG_UNSAFE_AND_STMT_ENGINE" :
    /Cannot execute statement\: impossible to write to binary log since statement is unsafe, storage engine is limited to statement-based logging, and BINLOG_FORMAT = MIXED. (.*)/,

  "ER_BINLOG_ROW_INJECTION_AND_STMT_ENGINE" :
    /Cannot execute statement\: impossible to write to binary log since statement is in row format and at least one table uses a storage engine limited to statement-based logging./,

  "ER_BINLOG_STMT_MODE_AND_ROW_ENGINE" :
    /Cannot execute statement\: impossible to write to binary log since BINLOG_FORMAT = STATEMENT and at least one table uses a storage engine limited to row-based logging.(.*)/,

  "ER_BINLOG_ROW_INJECTION_AND_STMT_MODE" :
    /Cannot execute statement\: impossible to write to binary log since statement is in row format and BINLOG_FORMAT = STATEMENT./,

  "ER_BINLOG_MULTIPLE_ENGINES_AND_SELF_LOGGING_ENGINE" :
    /Cannot execute statement\: impossible to write to binary log since more than one engine is involved and at least one engine is self-logging./,

  "ER_BINLOG_UNSAFE_LIMIT" :
    /The statement is unsafe because it uses a LIMIT clause. This is unsafe because the set of rows included cannot be predicted./,

  "ER_BINLOG_UNSAFE_INSERT_DELAYED" :
    /The statement is unsafe because it uses INSERT DELAYED. This is unsafe because the times when rows are inserted cannot be predicted./,

  "ER_BINLOG_UNSAFE_SYSTEM_TABLE" :
    /The statement is unsafe because it uses the general log, slow query log, or performance_schema table(s). This is unsafe because system tables may differ on slaves./,

  "ER_BINLOG_UNSAFE_AUTOINC_COLUMNS" :
    /Statement is unsafe because it invokes a trigger or a stored function that inserts into an AUTO_INCREMENT column. Inserted values cannot be logged correctly./,

  "ER_BINLOG_UNSAFE_UDF" :
    /Statement is unsafe because it uses a UDF which may not return the same value on the slave./,

  "ER_BINLOG_UNSAFE_SYSTEM_VARIABLE" :
    /Statement is unsafe because it uses a system variable that may have a different value on the slave./,

  "ER_BINLOG_UNSAFE_SYSTEM_FUNCTION" :
    /Statement is unsafe because it uses a system function that may return a different value on the slave./,

  "ER_BINLOG_UNSAFE_NONTRANS_AFTER_TRANS" :
    /Statement is unsafe because it accesses a non-transactional table after accessing a transactional table within the same transaction./,

  "ER_MESSAGE_AND_STATEMENT" :
    /(.*)/,

  "ER_SLAVE_CONVERSION_FAILED" :
    /Column (.*) of table '(.*).(.*)' cannot be converted from type '(.*)' to type '(.*)'/,

  "ER_SLAVE_CANT_CREATE_CONVERSION" :
    /Can't create conversion table for table '(.*).(.*)'/,

  "ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_BINLOG_FORMAT" :
    /Cannot modify @@session.binlog_format inside a transaction/,

  "ER_PATH_LENGTH" :
    /The path specified for (.*) is too long./,

  "ER_WARN_DEPRECATED_SYNTAX_NO_REPLACEMENT" :
    /'(.*)' is deprecated and will be removed in a future release./,

  "ER_WRONG_NATIVE_TABLE_STRUCTURE" :
    /Native table '(.*)'.'(.*)' has the wrong structure/,

  "ER_WRONG_PERFSCHEMA_USAGE" :
    /Invalid performance_schema usage./,

  "ER_WARN_I_S_SKIPPED_TABLE" :
    /Table '(.*)'.'(.*)' was skipped since its definition is being modified by concurrent DDL statement/,

  "ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_BINLOG_DIRECT" :
    /Cannot modify @@session.binlog_direct_non_transactional_updates inside a transaction/,

  "ER_STORED_FUNCTION_PREVENTS_SWITCH_BINLOG_DIRECT" :
    /Cannot change the binlog direct flag inside a stored function or trigger/,

  "ER_SPATIAL_MUST_HAVE_GEOM_COL" :
    /A SPATIAL index may only contain a geometrical type column/,

  "ER_TOO_LONG_INDEX_COMMENT" :
    /Comment for index '(.*)' is too long (max = (.*)u)/,

  "ER_LOCK_ABORTED" :
    /Wait on a lock was aborted due to a pending exclusive lock/,

  "ER_DATA_OUT_OF_RANGE" :
    /(.*) value is out of range in '(.*)'/,

  "ER_WRONG_SPVAR_TYPE_IN_LIMIT" :
    /A variable of a non-integer based type in LIMIT clause/,

  "ER_BINLOG_UNSAFE_MULTIPLE_ENGINES_AND_SELF_LOGGING_ENGINE" :
    /Mixing self-logging and non-self-logging engines in a statement is unsafe./,

  "ER_BINLOG_UNSAFE_MIXED_STATEMENT" :
    /Statement accesses nontransactional table as well as transactional or temporary table, and writes to any of them./,

  "ER_INSIDE_TRANSACTION_PREVENTS_SWITCH_SQL_LOG_BIN" :
    /Cannot modify @@session.sql_log_bin inside a transaction/,

  "ER_STORED_FUNCTION_PREVENTS_SWITCH_SQL_LOG_BIN" :
    /Cannot change the sql_log_bin inside a stored function or trigger/,

  "ER_FAILED_READ_FROM_PAR_FILE" :
    /Failed to read from the .par file/,

  "ER_VALUES_IS_NOT_INT_TYPE_ERROR" :
    /VALUES value for partition '(.*)' must have type INT/,

  "ER_ACCESS_DENIED_NO_PASSWORD_ERROR" :
    /Access denied for user '(.*)'@'(.*)'/,

  "ER_SET_PASSWORD_AUTH_PLUGIN" :
    /SET PASSWORD has no significance for users authenticating via plugins/,

  "ER_GRANT_PLUGIN_USER_EXISTS" :
    /GRANT with IDENTIFIED WITH is illegal because the user (.*) already exists/,

  "ER_TRUNCATE_ILLEGAL_FK" :
    /Cannot truncate a table referenced in a foreign key constraint ((.*))/,

  "ER_PLUGIN_IS_PERMANENT" :
    /Plugin '(.*)' is force_plus_permanent and can not be unloaded/,

  "ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE_MIN" :
    /The requested value for the heartbeat period is less than 1 millisecond. The value is reset to 0, meaning that heartbeating will effectively be disabled./,

  "ER_SLAVE_HEARTBEAT_VALUE_OUT_OF_RANGE_MAX" :
    /The requested value for the heartbeat period exceeds the value of `slave_net_timeout' seconds. A sensible value for the period should be less than the timeout./,

  "ER_STMT_CACHE_FULL" :
    /Multi-row statements required more than 'max_binlog_stmt_cache_size' bytes of storage; increase this mysqld variable and try again/,

  "ER_MULTI_UPDATE_KEY_CONFLICT" :
    /Primary key\/partition key update is not allowed since the table is updated both as '(.*)' and '(.*)'./,

  "ER_TABLE_NEEDS_REBUILD" :
    /Table rebuild required. Please do \"ALTER TABLE `(.*)` FORCE\" or dump\/reload to fix it!/,

  "WARN_OPTION_BELOW_LIMIT" :
    /The value of '(.*)' should be no less than the value of '(.*)'/,

  "ER_INDEX_COLUMN_TOO_LONG" :
    /Index column size too large. The maximum column size is (.*)u bytes./,

  "ER_ERROR_IN_TRIGGER_BODY" :
    /Trigger '(.*)' has an error in its body\: '(.*)'/,

  "ER_ERROR_IN_UNKNOWN_TRIGGER_BODY" :
    /Unknown trigger has an error in its body\: '(.*)'/,

  "ER_INDEX_CORRUPT" :
    /Index (.*) is corrupted/,

  "ER_UNDO_RECORD_TOO_BIG" :
    /Undo log record is too big./,

  "ER_BINLOG_UNSAFE_INSERT_IGNORE_SELECT" :
    /INSERT IGNORE... SELECT is unsafe because the order in which rows are retrieved by the SELECT determines which (if any) rows are ignored. This order cannot be predicted and may differ on master and the slave./,

  "ER_BINLOG_UNSAFE_INSERT_SELECT_UPDATE" :
    /INSERT... SELECT... ON DUPLICATE KEY UPDATE is unsafe because the order in which rows are retrieved by the SELECT determines which (if any) rows are updated. This order cannot be predicted and may differ on master and the slave./,

  "ER_BINLOG_UNSAFE_REPLACE_SELECT" :
    /REPLACE... SELECT is unsafe because the order in which rows are retrieved by the SELECT determines which (if any) rows are replaced. This order cannot be predicted and may differ on master and the slave./,

  "ER_BINLOG_UNSAFE_CREATE_IGNORE_SELECT" :
    /CREATE... IGNORE SELECT is unsafe because the order in which rows are retrieved by the SELECT determines which (if any) rows are ignored. This order cannot be predicted and may differ on master and the slave./,

  "ER_BINLOG_UNSAFE_CREATE_REPLACE_SELECT" :
    /CREATE... REPLACE SELECT is unsafe because the order in which rows are retrieved by the SELECT determines which (if any) rows are replaced. This order cannot be predicted and may differ on master and the slave./,

  "ER_BINLOG_UNSAFE_UPDATE_IGNORE" :
    /UPDATE IGNORE is unsafe because the order in which rows are updated determines which (if any) rows are ignored. This order cannot be predicted and may differ on master and the slave./,

  "ER_PLUGIN_NO_UNINSTALL" :
    /Plugin '(.*)' is marked as not dynamically uninstallable. You have to stop the server to uninstall it./,

  "ER_PLUGIN_NO_INSTALL" :
    /Plugin '(.*)' is marked as not dynamically installable. You have to stop the server to install it./,

  "ER_BINLOG_UNSAFE_WRITE_AUTOINC_SELECT" :
    /Statements writing to a table with an auto-increment column after selecting from another table are unsafe because the order in which rows are retrieved determines what (if any) rows will be written. This order cannot be predicted and may differ on master and the slave./,

  "ER_BINLOG_UNSAFE_CREATE_SELECT_AUTOINC" :
    /CREATE TABLE... SELECT...  on a table with an auto-increment column is unsafe because the order in which rows are retrieved by the SELECT determines which (if any) rows are inserted. This order cannot be predicted and may differ on master and the slave./,

  "ER_BINLOG_UNSAFE_INSERT_TWO_KEYS" :
    /INSERT... ON DUPLICATE KEY UPDATE  on a table with more than one UNIQUE KEY is unsafe/,

  "ER_TABLE_IN_FK_CHECK" :
    /Table is being used in foreign key check./,

  "ER_UNSUPPORTED_ENGINE" :
    /Storage engine '(.*)' does not support system tables. [(.*).(.*)]/,

  "ER_BINLOG_UNSAFE_AUTOINC_NOT_FIRST" :
    /INSERT into autoincrement field which is not the first part in the composed primary key is unsafe./,

};
