# A simple web crawler that locates a user-selected element on a web site with changing information

It is built on top of [jsdom](https://github.com/jsdom/jsdom).

#### To start:

_npm install_

then

_node run index.js "origin_file_path" "other_file_path" {--id="id_of_target_element"}_

(_id_ is an optional parameter. If it is omitted default value "make-everything-ok-button" will be used)

or use predefined commands to work with files from "pages" directory:

- _npm run crowl-1_
- _npm run crowl-2_
- _npm run crowl-3_
- _npm run crowl-4_

If element is found in changed file you will have its xpath in console message.