BEGIN {
    i = 0
    print "module.exports = {\n";
}
{
    ++i;

    gsub(/^[ \t]+|[ \t]+$/, "");
    if (i % 2 == 1) {
        aux = $0;
        idx = index(aux, " ");
        if (idx) {
            aux = substr(aux, 1, idx -1);
        }

        print "  \"" aux "\" :";
    } else {
        aux = substr($0, 5);

        #gsub(/[()]/, "\$&", aux);

        gsub(/\"\"/, "\"", aux); //remove double quote

        gsub(/\"\%(.*)(s|d|u|ld|l)\"/, "\"(.*)\"", aux);
        gsub(/\'\%(.*)(s|d|u|ld|l)\'/, "'(.*)'", aux);

        gsub(/\%(s|d|u|ld|l)/, "(.*)", aux);
        gsub(/\%(\-\.|\.)([0-9]+|\*)s/, "(.*)", aux);

        aux = gensub(/[:\/]/, "\\\\\\0", "g", aux);
        print "    /" substr(aux, 2, length(aux) - 2) "/,\n";
    }
}
END {
    print "};";
}
