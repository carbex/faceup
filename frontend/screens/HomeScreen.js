import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen(props) {

    const [pseudo, setPseudo] = useState('');

    return (
        <ImageBackground source={require('../assets/home.jpg')} style={styles.image}>  
                
            <Input
                containerStyle = {{marginBottom: 25, width: '70%'}}
                leftIcon={ <AntDesign name="user" size={24} color="#11946A" />}
                onChangeText={(value) => setPseudo(value)}
                value={pseudo}            
            />            
            
            <Button 
                buttonStyle={{backgroundColor: '#11946A'}}
                title=" Go to Gallery"
                type='solid'
                onPress={() => {props.navigation.navigate('TabNavigator', {screen: 'Gallery'})}}
            /> 
        
        </ImageBackground>
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


 