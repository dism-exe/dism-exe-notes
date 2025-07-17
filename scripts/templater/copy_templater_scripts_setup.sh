#!/bin/sh

# Get the full path to the directory of the script
script_dir="$(cd "$(dirname "$0")" && pwd)"

# Check if the first argument is a valid directory
if [ -z "$1" ]; then
  echo "Error: No vault directory path provided."
  echo "Usage: $0 <vault_directory_path>"
  exit 1
fi

if [ ! -d "$1" ]; then
  echo "'$1' is not a valid directory."
  exit 1
fi

vault_directory_path="$(realpath -s "$1")"
templater_path="$vault_directory_path/scripts/templater"

if [ ! -d "$templater_path" ]; then
    echo "Creating $templater_path"
    mkdir -p "$templater_path"
fi

rm -vf "$templater_path/"*.hpp
rm -vf "$templater_path/"*.js
rm -vf "$templater_path/"*.ts
rm -vf "$templater_path/"*.preproc
rm -vf "$templater_path/"*.md
rm -vf "$templater_path/"*.sh
rm -rvf "$templater_path/commands"

mkdir "$templater_path/commands"
cp -v "$script_dir/"*.hpp     "$templater_path"
cp -v "$script_dir/"*.js      "$templater_path"
cp -v "$script_dir/"*.preproc "$templater_path"
cp -v "$script_dir/"*.md      "$templater_path"
cp -v "$script_dir/commands/"*.md "$templater_path/commands"
cp -v "$script_dir/"*.sh      "$templater_path"
