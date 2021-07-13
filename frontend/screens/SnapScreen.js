import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, Overlay } from 'react-native-elements';

import { Ionicons } from '@expo/vector-icons';

import { Camera } from 'expo-camera'
import { Audio } from "expo-av";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useIsFocused } from '@react-navigation/native';

import { connect } from 'react-redux';

function SnapScreen(props) {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)

    var cameraRef = useRef(null);

    const isFocused = useIsFocused()
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null);

  const generateThumbnail = async (videoSource) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync( videoSource,
        {
          time: 15000,
        }
      );
      setImage(uri);
      console.log('URI video thumbnail', uri)
    } catch (e) {
      console.warn(e);
    }
  };


    const toggleOverlay = () => {
        setVisible(!visible);
    }

    const recordVideo = async () => {
        if (cameraRef) {
            try {
                const videoRecordPromise = cameraRef.recordAsync();
                if (videoRecordPromise) {                  
                    const data = await videoRecordPromise;
                    const source = data.uri;
                    if (source) {
                        console.log("video source", source);
                        generateThumbnail(source);
                        var dataVideo = new FormData()
                        dataVideo.append('video', {
                            uri: source,
                            type: 'video/quicktime',
                            name: 'user_video.mov'
                        })
                        
                        var rawResponse = await fetch('http://192.168.1.31:3000/upload-video', {

                        // var rawResponse = await fetch('http://172.17.1.83:3000/upload-video', {
                            method: 'POST',
                            body: dataVideo
                        })
                        var response = await rawResponse.json()
                        props.addToStoreVideoGallery(response.resultCloudinary)                       
                    }
                }
            } catch (error) {
                console.warn(error);
            }
        }
    };

    const stopVideoRecording = async () => {
        if (cameraRef) {
            await cameraRef.stopRecording();
        }
    };

    useEffect(() => {
        if (loading) {
            async function takePicture() {
                const options = { quality: 0.7, base64: true, exif: true, skipProcessing: true }
                const photo = await cameraRef.takePictureAsync(options);
                const source = photo.uri
                if (source) {
                    var data = new FormData()
                    data.append('avatar', {
                        uri: source,
                        type: 'image/jpeg',
                        name: 'user_avatar.jpg'
                    })
                    var rawResponse = await fetch('http://192.168.1.31:3000/upload-image', {

                    // var rawResponse = await fetch('http://172.17.1.83:3000/upload-image', {
                        method: 'POST',
                        body: data
                    })
                    var response = await rawResponse.json()
                    props.addToStoreGallery(response.resultCloudinary, response.resultVision)
                }
                setVisible(false)
                setLoading(false)
            }
            setTimeout(() => { takePicture() }, 100) // Attention ! Mauvaise pratique !!!! A ne pas faire !!!
        }
    }, [loading])

    // Permissions

    useEffect(() => {

        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        (async () => {
            const { status } = await Audio.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

    }, []);

    var camera
    if (isFocused) {
        camera = <Camera style={{ flex: 1, justifyContent: 'flex-end' }} type={type} flashMode={flashMode} ref={ref => (cameraRef = ref)}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    iconPosition='top'
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={<Ionicons name="camera-reverse-outline" size={20} color="white" />}
                    title=""
                    onPress={() => {
                        setType(
                            type == Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                        );
                    }}
                />
                <Button
                    // style={{borderStyle: 'none'}}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    loading={loading}
                    icon={<Ionicons name="radio-button-on-outline" size={80} color="white" />}
                    title=""
                    // disabled={!isCameraReady}
                    onLongPress={recordVideo}
                    onPressOut={stopVideoRecording}
                    onPress={() => {
                        setVisible(true)
                        setLoading(true)
                    }}
                />
                <Button
                    iconPosition='top'
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={<Ionicons name="flash-outline" size={20} color="white" />}
                    title=''
                    onPress={() => {
                        setFlashMode(
                            flashMode == Camera.Constants.FlashMode.off
                                ? Camera.Constants.FlashMode.torch
                                : Camera.Constants.FlashMode.off
                        );
                    }}
                />
            </View>
            
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <Text>Loading...</Text>
            </Overlay>
        </Camera>
    }

    if (hasPermission) {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                {camera}               
            </View>
        )
    }
    else {
        return <View style={{ flex: 1 }} />;
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center'
    }
});

function mapDispatchToProps(dispatch) {
    return {
        addToStoreGallery: function (imgInfo, userInfo) {
            dispatch({ type: 'saveImgInfo', imgInfo, userInfo })
        },
        addToStoreVideoGallery: function (vidInfo) {
            dispatch({ type: 'saveVidInfo', vidInfo })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SnapScreen)
