# A simple web crawler that locates a user-selected element on a web site with changing information

It is built on top of [jsdom](https://github.com/jsdom/jsdom).
Process has following steps:
1. Load origin file, get target element from it.
2. Grab relevant data related to this element
3. Load changed file
4. Use data of target element. Move from the most relevant item of it to the least relevant trying to get element from changed file.

Algorithm is rather demo than a real crowler. It is based on idea attributes, properties of element have different level of uniqueness. In current case id is considered the most unique one. Text content follows then. Weight (power) of significant properties is described as a relevance map (see corresponded service). You can find other relevant properties are atributes "onclick" and "href". Of course it's not a common case, but it works well taking into account given samples. The bottom line of the implemented is to satisfy examples and to keep some distance away from hardcode. Set of important attributes can be easily changed and extend as well as power (relevance) of items can be changed. Of course it requires some changes on code, but not a lot of them.    

Limitations of algorithm are tag of target element from origin file matters. Considered it is not changed across all modifications of html page. 

**Advantages of algorithm** are elements that are not available for user (that have "display: none") will be ignored when changed file is being parsed despite how relevant they are.

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