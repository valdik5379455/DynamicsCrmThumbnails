CRM Thumbnails
==============

CRM Thumbnails is an image viewer for Dynamics CRM. It loads images from Note records attached to a specified CRM record and displays them as thumbnails. 

Notes on Account record in CRM
![Thumbnails screenshot](docs/crmaccount.png?raw=true)

Displayed as thumbnails
![Thumbnails screenshot](docs/thumbs.png?raw=true)

Clicking thumbnail displays an image preview
![Thumbnails screenshot](docs/preview.jpg?raw=true)

## How to use

1. Upload viewer.html and all files from js, css and img folders as web resources into CRM.
2. Open viewer.html web resource with data argument set to record id. For Example:

   `viewer.html?Data=%7b1EEBB448-4266-E711-80F9-5065F38BF4A1%7d`

## TODO list

Currently, this is only a quick and dirty sample project. Later, I plan to clean up the code and implement following:

* Enable embedding into CRM form, use 'id' query parameter.
* More actions on the toolbar: upload file, download multiple files, add note/comment etc.
* Upload files via drag-and-drop. move notes from one record to another via drag-and-drop.
* Multi-record view: display note images across multiple records (maybe defined by query?).
* Configuration: MIME types to load, which actions to display, ordering of images.
* Display note title and note text. 
* Option to switch to old OData service for compatibility with older (< CRM 2015) systems. 
* Add options to localize labels based on user UI language.