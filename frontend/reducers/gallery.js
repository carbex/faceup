export default function(videoGallery = [], action) {
    if(action.type == 'saveImgInfo') {
        var newVideoGallery = [...videoGallery, action.imgInfo]
        return newVideoGallery
     } else {
        return videoGallery;
    }

}