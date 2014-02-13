#!/bin/sh

mysql -u root -p -e 'CREATE USER "travis"@"localhost" IDENTIFIED BY "";'
mysql -u root -p -e 'CREATE DATABASE norm_test CHARACTER SET utf8 COLLATE utf8_bin;'
mysql -u root -p -e 'GRANT ALL PRIVILEGES ON norm_test.* TO "travis"@"localhost" WITH GRANT OPTION;'