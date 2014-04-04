#!/bin/sh

# you could choose your language here if you want, not recommended... but you can :)

egrep "^(WARN_|ER|(.*)eng( |  )\"(.*))" /usr/share/mysql/errmsg-utf8.txt  | \
awk '
BEGIN {
    i = 0
    print "{";
}
{
    ++i;

    gsub(/^[ \t]+|[ \t]+$/, "");
    if (i % 2 == 1)
        print "  {\n    \"" $0 "\" :";
    else {
        aux = substr($0, 5);
        gsub(/\%(.*)(s|d|u|l)/, "(.*)", aux);
        gsub(/\%s/, "(.*)", aux);
        gsub(/\%d/, "(.*)", aux);
        gsub(/\%u/, "(.*)", aux);
        gsub(/\%l/, "(.*)", aux);
        print "    " aux "\n  },";
    }
}
END {
    print "}";
}'