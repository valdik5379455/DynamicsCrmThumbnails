/*global $,Vue,Xrm*/
(function () {
    'use strict';

    // super thin wrapper for Web API
    var webApi = (function () {
            /**
             * @description Performs a Web API query.
             * @param {String} query Query to execute
             * @returns {Promise<Array>} asdasd
             */
            function retrieve(query) { // callers of this API have to encode URI components themselves!
                var deferred = $.Deferred();

                $.ajax(Xrm.Page.context.getClientUrl() + '/api/data/v8.0/' + query, {
                    headers: {
                        'Accept': 'application/json',
                        'OData-MaxVersion': '4.0',
                        'OData-Version': '4.0'
                    }
                }).done(function (result) {
                    if (result['@odata.context'].match(/\$entity$/)) {
                        return deferred.resolve(result);
                    }
                    return deferred.resolve(result.value);
                }).fail(function (error) {
                    return deferred.reject(error);
                });

                return deferred.promise();
            }

            function deleteRecord(query) {
                return $.ajax(Xrm.Page.context.getClientUrl() + '/api/data/v8.0/' + query, {
                    headers: {
                        'Accept': 'application/json',
                        'OData-MaxVersion': '4.0',
                        'OData-Version': '4.0'
                    },
                    method: 'DELETE'
                });
            }

            return {
                retrieve: retrieve,
                delete: deleteRecord
            };
        }()),
        loaderSrc = 'img/loader.gif';

    function loadNoteImage(note) {
        webApi.retrieve('annotations(' + note.annotationid + ')?$select=documentbody').done(function (loadedNote) {
            note.loaded = true;
            note.src = 'data:image/jpeg;base64,' + loadedNote.documentbody;
        });
    }

    function loadImages(objectId) {
        var data = [],
            deferred = $.Deferred();

        webApi.retrieve('annotations?$filter=_objectid_value eq 1EEBB448-4707-E711-80F9-5065F38BF4A1 and mimetype eq \'image/jpeg\'&$select=filename,notetext')
            .done(function (notes) {
                if (!notes) {
                    return;
                }

                notes.forEach(function (note) {
                    // set image source to loader by default
                    note.loaded = false;
                    note.src = loaderSrc;
                    data.push(note);
                });

                deferred.resolve(data);
                notes.forEach(loadNoteImage);
            });

        return deferred.promise();
    }


    $(function () {
        var viewerData = {
                images: [],
                preview: {
                    visible: false,
                    src: ''
                }
            },
            viewer = new Vue({
                el: '#viewer',
                data: viewerData,
                methods: {
                    previewImage: function (img) {
                        if (!img.loaded) {
                            return;
                        }
                        viewerData.preview = {
                            visible: true,
                            src: img.src
                        };
                    },
                    deleteImage: function () {
                        var selectedImages = viewerData.images.filter(function (img) {
                            return img.selected;
                        });

                        if (selectedImages.length === 0) {
                            alert('Please select at least one image to delete.');
                            return;
                        } else if (!confirm('Are you sure you want to delete selected images?')) {
                            return;
                        }

                        selectedImages.forEach(function (img) {
                            img.loaded = false;
                            img.src = loaderSrc;
                            webApi.delete('annotations(' + img.annotationid + ')')
                                .done(function () {
                                    // remove image from image list
                                    var i = viewerData.images.indexOf(img);
                                    if (i !== -1) {
                                        viewerData.images.splice(i, 1);
                                    }
                                });
                        });
                    },
                    closePreview: function () {
                        this.preview.visible = false;
                    }
                }
            }),
            queryParams = Xrm.Page.context.getQueryStringParameters(),
            objectId;

        if (!queryParams) {
            alert('Please set record id \'Data\' query string parameter to display images');
            return;
        }

        objectId = queryParams.Data.replace(/[{}]/g, '');

        loadImages(objectId)
            .then(function (images) {
                viewerData.images = images;
            })
            .fail(function (error) {
                alert(error);
            });
    })
}())