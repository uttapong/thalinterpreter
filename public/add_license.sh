#!/bin/bash

value=cat filelist.txt
echo $value
for file in $value
do

    echo "$file"

done
