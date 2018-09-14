#! /bin/sh

mkdir temp \
&& cd temp \
&& git clone https://github.com/GabrielBottari/log2990.git --mirror \
&& cd log2990.git \
&& git remote add school https://githost.gi.polymtl.ca/git/log2990-01 \
&& git push school --mirror \
&& cd ..\\.. \
&& rm -rf temp