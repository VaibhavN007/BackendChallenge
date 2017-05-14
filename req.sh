#!bin/bash
for i in `seq 1 $1`;
do
        curl -s localhost:3000/process/$i &
done