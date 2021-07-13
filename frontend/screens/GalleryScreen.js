import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, ListItem, Button, Icon, Badge } from 'react-native-elements'

import { Ionicons } from '@expo/vector-icons';

import { connect } from 'react-redux';

function GalleryScreen(props) {

    // console.log('props.gallery', props.gallery[0].faceAttributes)

    let cardList = props.gallery.map((img, i) => {
        return (
            <Card key={i} style={{ flex: 1 }}>
                <Card.Image source={{ uri: img.url }} style={{ marginBottom: 10, height: 250 }} />
                <Badge status="success" value={img.faceAttributes ? img.faceAttributes.gender : 'Indéterminé'} badgeStyle={{ padding: 10, margin: 4 }}></Badge>
                <Badge status="success" value={img.faceAttributes ? img.faceAttributes.age : 'Indéterminé'} badgeStyle={{ padding: 10, margin: 4 }}></Badge>
                <Badge status="success" value={img.faceAttributes ? (img.faceAttributes.facialHair.moustache >= 0.8 ? 'Moustachu' : (img.faceAttributes.facialHair.beard === 0.8 ? 'Barbu' : 'Glabre')) : 'Indéterminé'} badgeStyle={{ padding: 10, margin: 4 }}></Badge>
                <Badge status="success" value={img.faceAttributes ? (img.faceAttributes.emotion.anger >= 0.8 ? 'En colère' : (img.faceAttributes.emotion.contempt >= 0.8 ? 'Content' : (img.faceAttributes.emotion.disgust >= 0.8 ? 'Dégouté' : (img.faceAttributes.emotion.fear >= 0.8 ? 'Apeuré' : (img.faceAttributes.emotion.happiness >= 0.8 ? 'Joyeux' : (img.faceAttributes.emotion.neutral >= 0.8 ? 'Neutre' : (img.faceAttributes.emotion.sadness >= 0.8 ? 'Malheureux' : (img.faceAttributes.emotion.surprise >= 0.8 ? 'Surpris' : 'Indéfini')))))))) : 'Indéterminé'} badgeStyle={{ padding: 10, margin: 4 }}></Badge>
                <Badge status="success" value={img.faceAttributes ? (img.faceAttributes.hair.bald >= 0.8 ? 'Chauve' : (img.faceAttributes.hair.invisible === true ? 'Cheveux non visibles' : (img.faceAttributes.hair.hairColor ? img.faceAttributes.hair.hairColor[0].color : 'Indéterminé'))) : 'Indéterminé'} badgeStyle={{ padding: 10, margin: 4 }}></Badge>
            </Card>
        )
    })


    return (
        <View style={{ flex: 1, marginTop: 50 }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>Alex's gallery</Text>
            <ScrollView>
                {cardList}
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center'
    }
});

function mapStateToProps(state) {
    return {
        gallery: state.gallery
    }
}

export default connect(
    mapStateToProps,
    null
)(GalleryScreen)


