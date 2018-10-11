[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/codingyu.laravel-goto-view.svg)](https://marketplace.visualstudio.com/items?itemName=codingyu.laravel-goto-view) [![Installs](https://vsmarketplacebadge.apphb.com/installs/codingyu.laravel-goto-view.svg)](https://marketplace.visualstudio.com/items?itemName=codingyu.laravel-goto-view)
# How to use
![How to use](images/use.gif)
# Settings
## `laravel_goto_view.folders`
Search according to the configured path
```
"laravel_goto_view.folders": {
    "default" : "/resources/views",
    "theme_xxx": "/resources/views/theme_xxx"
}
```
## `laravel_goto_view.extensions`
Search views according to the configured extensions
```
"laravel_goto_view.extensions": {
    "default" : ".blade.php",
    "inky": ".inky.php"
}
```
## `laravel_goto_view.quickJump`
Use 'Ctrl' or 'Alt' + click, jump to the first match file.
## `laravel_goto_view.folderTip`
Display the path name of the configuration
