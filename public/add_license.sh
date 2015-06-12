#!/bin/bash

for entry in 'modules'/*
do
  if [ -f "$entry" ];then
    echo "$entry"
  else
    for file in "$entry"/*
    do
      if [ -f "$file" ];then
      echo "$file"
    fi
    done
  fi
done
