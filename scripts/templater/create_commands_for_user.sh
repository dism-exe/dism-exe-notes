#!/bin/bash

# Provide the user name both as it appears in UI and used in folder structure

script_dir=$(dirname "$(readlink -f "$0")")

user_ui="$1"
user="$2"

pushd $script_dir

cat <<EOF > "./commands/$user_ui Open Timeline Log.md"
<%*
await tp.user.open_timeline_log(tp, "$user");
%>
EOF

cat <<EOF > "./commands/$user_ui Start Log.md"
<%*
await tp.user.start_log(tp, "$user");
%>
EOF

cat <<EOF > "./commands/$user_ui Stop Log.md"
<%*
await tp.user.stop_log(tp, "$user");
%>
EOF

cat <<EOF > "./commands/$user_ui Summarize Time Logs.md"
<%*
await tp.user.summarize_time_logs(tp, "$user");
%>
EOF

mkdir -p "./data/$user/"

popd
