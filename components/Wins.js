import React from 'react'
import { View , Text , StyleSheet} from 'react-native'
import {GlobalContext}  from '../GlobalContext'
import Swiper from 'react-native-swiper'

export default class ___ extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        return(
            <Swiper style={styles.wrapper} showsButtons={false} showsPagination = {false} loop = {false}>
                <View style={styles.slide1}>
                  <Text style={styles.text}>Hello Swiper</Text>
                </View>
                <View style={styles.slide2}>
                  <Text style={styles.text}>Beautiful</Text>
                </View>
                <View style={styles.slide3}>
                  <Text style={styles.text}>And simple</Text>
                </View>
           </Swiper>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9',
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    }
})




