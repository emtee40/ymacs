#! /bin/bash

# make sure the "uglifyjs2" program exists and is in $PATH for
# minification to work.

TEMPDIR=`mktemp -d`
YEMPDIR="$TEMPDIR/Ymacs"
mkdir $YEMPDIR;

cd ..
cp -r src $YEMPDIR
cp -r test $YEMPDIR

cd "$YEMPDIR/src/js"
JSFILES=`cat loadfiles.txt`
rm loadfiles.txt

mkdir ../js-minified
uglifyjs $JSFILES -cm -o ../js-minified/ymacs-min.js

cd $TEMPDIR
tar zcf ymacs.tar.gz Ymacs
mv ymacs.tar.gz /tmp
rm -rf $TEMPDIR
