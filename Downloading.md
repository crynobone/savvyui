# Downloading Savvy.UI #
Our download package not only allow you to use Savvy.UI but at the same time give you the permission to modify the core of Savvy.UI. We at Savvy.UI Development Team allow you to modify any of the script found in Savvy.UI where you see fit, for more detail on this please read [Custom Build Your Savvy.UI](CustomBuild.md).
## Download Via Package ##
Savvy.UI's latest package (in .zip) can be downloaded from [Downloads](http://code.google.com/p/savvyui/downloads/list) tab (latest marked as **featured**).

## Export Via SVN Trunk ##
You can also get a latest copy from our repository via this command:
```
svn export http://savvyui.googlecode.com/svn/trunk/ <your_folder_name> 
```

# In The Package #
For most user, our download package may seem a bit crowded compare to any other JavaScript Framework. However there no need to panic, out of the box you need to copy:
| Folder | Description | Type |
|:-------|:------------|:-----|
| `/css/` | Contain all Styling for Savvy.UI Module | Folder |
| `/lib/savvyui.js` | Uncompressed Savvy.UI for development | JavaScript File |
| `/lib/savvyui.min.js` | Minified Savvy.UI for production | JavaScript File |
| `/lib/savvyui.pack.js` | Packed Savvy.UI using Edward Dean's Packer | JavaScript File |

If you don't have a copy of jQuery, it available from `lib/jquery/` folder in three [Compression Format](CompressionFormat.md) (jQuery version 1.2.6).