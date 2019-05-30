import React from 'react'
import {  View , WebView , StyleSheet , StatusBar , Platform , TouchableOpacity } from 'react-native'
import PDFReader from 'rn-pdf-reader-js';
import { Container , Header , Left , Body , Icon , Text } from 'native-base'
import { Constants } from 'expo';
import { GlobalContext , ThemeContext } from '../../../GlobalContext'
export default class PDFVIEW extends React.Component {
    state = {}
    static navigationOptions = {
        header : null
    }
    render(){
        const pdf = this.props.navigation.getParam('pdf');
        return(
            <ThemeContext.Consumer>
                {(theme) => { return (
                    <Container style={{flex: 1, backgroundColor : theme.background}} >
                        <Header style={[styles.androidHeader  , { backgroundColor: theme.header_background_color }]}>
                            <Left>
                                <TouchableOpacity onPress = {() => this.props.navigation.goBack()}> 
                                  <Icon name='arrow-back' style = {{ color : 'white' , paddingLeft : "20%"}}  />
                                </TouchableOpacity>
                            </Left>
                            <Body style = {{ flex : 3, justifyContent : 'center' , alignItems : 'center'}} >
                                <Text style = {{ color : 'white' , fontSize : 19 }}>{pdf.english_name}</Text>
                            </Body>
                        </Header>
                        <PDFReader source = {{ uri : pdf.fileUri }}
                        /> 
                    </Container>
                )}}
            </ThemeContext.Consumer>
        )
    }
}



//   <WebView
//           bounces={false}
//           scrollEnabled={true} 
//           source={{ uri: 'https://www.htmlpublish.com/newTestDocStorage/DocStorage/1062954978/bcl_1062954978.htm' }} />

const styles = StyleSheet.create({
    androidHeader: {
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight,
            }
        })
    },
   androidHeaderTitle: {
        ...Platform.select({
            android: {
                alignItems: 'flex-end'
            }
        })
   }
});﻿
