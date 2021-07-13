export default function(gallery = [], action) {
    if(action.type == 'saveVidInfo') {
        var newGallery = [...gallery, action.vidInfo]
        return newGallery
     } else {
        return gallery;
    }

}