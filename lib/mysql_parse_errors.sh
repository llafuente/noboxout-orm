#!/bin/sh

# you could choose your language here if you want, not recommended... but you can :)

# To file for easy to read
(cat <<XML
BEGIN {
    i = 0
    print "module.exports = {\n";
}
{
    ++i;

    gsub(/^[ \t]+|[ \t]+$/, "");
    if (i % 2 == 1) {
        aux = \$0;
        idx = index(aux, " ");
        if (idx) {
            aux = substr(aux, 1, idx -1);
        }

        print "  \"" aux "\" :";
    } else {
        aux = substr(\$0, 5);

        #gsub(/[()]/, "\\\$&", aux);

        gsub(/\"\"/, "\"", aux); //remove double quote

        gsub(/\"\%(.*)(s|d|u|ld|l)\"/, "\"(.*)\"", aux);
        gsub(/\'\%(.*)(s|d|u|ld|l)\'/, "'(.*)'", aux);

        gsub(/\%(s|d|u|ld|l)/, "(.*)", aux);
        gsub(/\%(\-\.|\.)([0-9]+|\*)s/, "(.*)", aux);

        aux = gensub(/[:\/]/, "\\\\\\\\\\\\0", "g", aux);
        print "    /" substr(aux, 2, length(aux) - 2) "/,\n";
    }
}
END {
    print "};";
}
XML
) > awk.awk



egrep "^(WARN_|ER|(.*)eng( |  )\"(.*))" /usr/share/mysql/errmsg-utf8.txt | awk -f awk.awk > mysql_errors.js