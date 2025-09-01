#!/bin/bash

files=$(find ./files -type f | sed -e 's/^\.\/files\/\(.*\)$/    "\1",/')
echo "export const files = [" > ./js/modules/file_list.mjs
echo "$files" >> ./js/modules/file_list.mjs
echo "];" >> ./js/modules/file_list.mjs
