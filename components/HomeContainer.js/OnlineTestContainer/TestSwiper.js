import React from 'react'
import { View , StyleSheet , Platform , StatusBar , TouchableOpacity , ScrollView , Image, AsyncStorage, BackHandler, Alert } from 'react-native'

import { Grid , Row , Col, Card , CardItem , Body , Left , Right ,Container, Header, Content, Text, Spinner , Icon , Button , Thumbnail } from 'native-base'

import { ThemeContext } from '../../../GlobalContext'
import BottomToolBar from './BottomToolBar'
import { baseurl, endurl, file_base_url } from '../../../baseurl';
import GestureRecognizer  from 'react-native-swipe-gestures';
import DemoChart from '../../DemoChart';
const Entities = require('html-entities').XmlEntities;
 
const entities = new Entities();

import * as Animatable from 'react-native-animatable'

class TestResult extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            correct : [],
            incorrect : [],
            unattempt : [],
            total : 0,
            postingResult : false
        }
    }
    componentDidMount = async () => {
        this.setState({ postingResult : true})
        let array = this.props.test_question_array
        let incorrect = array.filter((item) => {
            return (parseInt(item.attempted_index) !== 0 && parseInt(item.attempted_index) !== parseInt(item.correct_option_index))
        })
        let correct = array.filter((item) => {
            return (parseInt(item.attempted_index) !== 0 && parseInt(item.attempted_index) === parseInt(item.correct_option_index))
        })
        let unattempt = array.filter((item) => {
            return (parseInt(item.attempted_index) === 0)
        })
        let total = incorrect.length + correct.length + unattempt.length
        this.setState({ correct : correct , incorrect : incorrect , unattempt : unattempt , total : total})
        let data = {...this.props.test_info , 
                    student_id : JSON.parse(await AsyncStorage.getItem('student'))._id , 
                    result : parseFloat((correct.length/total) * 100).toFixed(2)
                }
        fetch(`${baseurl}tests/submit_test/${endurl}`,{
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((data) => {console.log(data); this.setState({ postingResult : false})})
        .catch((err) => {console.log(err) ; alert("Technical Error") ; this.setState({ postingResult : false})} )
    }
    render(){
      if(this.state.postingResult === true ){
          return(
              <ThemeContext.Consumer>
                  {(theme) => { return(
                      <Container style = {{ backgroundColor : theme.background}}>
                        <Header style={[styles.androidHeader  , { backgroundColor: theme.header_background_color }]}>
                            <Body style = {{ flex : 3, justifyContent : 'center' , alignItems : 'center'}} >
                                <Text style = {{ color : 'white' , fontSize : 19 }}>Test Results</Text>
                            </Body>
                        </Header>
                        <Spinner color = {theme.spinner_color} />
                        <Text>Evaluating Test</Text>
                      </Container>
                  )}}
              </ThemeContext.Consumer>
          )
      }
      return(
        <ThemeContext.Consumer>  
            {(theme) => { return(
                <Container style = {{ backgroundColor : theme.background}}>
                    <Header style={[styles.androidHeader  , { backgroundColor: theme.header_background_color }]}>
                        <Body style = {{ flex : 3, justifyContent : 'center' , alignItems : 'center'}} >
                            <Text style = {{ color : 'white' , fontSize : 19 }}>Test Results</Text>
                        </Body>
                    </Header>

                        <Row style = {{ height : '45%' , paddingBottom : '0%'}}>
                            <Col><Container style = {{ backgroundColor : theme.background}} ><DemoChart test_question_array = {this.props.test_question_array} /></Container></Col>
                            <Col style = {{ paddingTop : '8%'}}>
                               <Row>
                                   <Col>
                                       <Button style = {{ backgroundColor : 'green' , width : '40%' , height : '7%' , margin : '10%' }}></Button>
                                   </Col>
                                   <Col>
                                       <Text  style = {{ color : theme.text_color }} >Correct</Text>
                                   </Col>
                                </Row>
                                <Row>
                                   <Col>
                                       <Button style = {{ backgroundColor : 'red' , width : '40%' , height : '7%' , margin : '10%' }}></Button>
                                   </Col>
                                   <Col>
                                       <Text  style = {{ color : theme.text_color }} >Incorrect</Text>
                                   </Col>
                                </Row>
                                <Row>
                                   <Col>
                                       <Button style = {{ backgroundColor : 'yellow' , width : '40%' , height : '7%' , margin : '10%' }}></Button>
                                   </Col>
                                   <Col >
                                       <Text  style = {{ color : theme.text_color}} >Skipped</Text>
                                   </Col>
                                </Row>
                               <Row></Row>
                               <Row></Row>
                            </Col>
                        </Row>
                        <Row style = {{ height : '45%'}}>
                           <Col>
                                <Container style = {{  paddingLeft : '10%' , paddingBottom : '5%', backgroundColor : theme.background}}>
                                   <Row>
                                       <Col><Text style = {{color : theme.text_color}}>Total Questions : </Text></Col>
                                       <Col><Text style = {{color : theme.text_color}}>{this.state.total}</Text></Col>
                                   </Row>
                                   <Row>
                                       <Col><Text style = {{color : theme.text_color}}>Correct : </Text></Col>
                                       <Col><Text style = {{color : theme.text_color}}>{this.state.correct.length + ` (${parseFloat((this.state.correct.length/this.state.total) * 100).toFixed(2)  } %)`}</Text></Col>
                                   </Row>
                                   <Row>
                                       <Col><Text style = {{color : theme.text_color}}>Incorrect : </Text></Col>
                                       <Col><Text style = {{color : theme.text_color}}>{this.state.incorrect.length + ` (${parseFloat((this.state.incorrect.length/this.state.total) * 100).toFixed(2)  } %)`}</Text></Col>
                                   </Row>
                                   <Row>
                                       <Col><Text style = {{color : theme.text_color}}>Not Attempted : </Text></Col>
                                       <Col><Text style = {{color : theme.text_color}}>{this.state.unattempt.length + ` (${parseFloat((this.state.unattempt.length/this.state.total) * 100).toFixed(2)  } %)`}</Text></Col>
                                   </Row>
                                   <Row>
                                       <Col><Text style = {{color : theme.text_color}}>Result : </Text></Col>
                                       <Col><Text style = {{color : theme.text_color}}>{parseFloat((this.state.correct.length/this.state.total) * 100).toFixed(2) + ` %`}</Text></Col>
                                   </Row>
                                </Container>
                            </Col>
                        </Row>
                </Container>
            )}}
        </ThemeContext.Consumer>  
      )
    }
}



class Timer extends React.Component{
    constructor(props){
        super(props)
            this.state = {
                "seconds" : 0,
                "time_allowed" : '',
            }
        
    }

    returnTimeTaken = () => {
        return this.state.seconds
    }

    tick = () => {
        this.setState(state => ({
          seconds: state.seconds + 1
        }));
    }

    componentDidMount = async () => {
        this.setState(({ time_allowed : this.props.time_allowed  }))
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render(){
        const theme = this.props.theme
        if(this.state.seconds === this.state.time_allowed){
            clearInterval(this.interval)
            alert("Time Up")
            this.props.finishTest()
        }
        return <Text style = {{ color : theme.text_color }}> {parseInt(this.state.seconds / 3600).toString().padStart(2, '0')} : {parseInt(parseInt(this.state.seconds / 60)%60).toString().padStart(2, '0')} : {(this.state.seconds % 60).toString().padStart(2, '0')} </Text>
    }
}


class Question extends React.Component {
    state = {
       color_object : {
        correct_dynamic_color : '',
        correct_dynamic_color_2 : '',
       } , 
       clicked : false , 
       test_options : []
    }


    componentDidMount() {}
    
    componentDidUpdate(){}

    handleCorrect = (attempted_index) => {
        this.props.handleAttempt(this.props.index,attempted_index)
        let newObject = Object.assign(this.state.color_object , {
            correct_dynamic_color : 'green',
            correct_dynamic_color_2 : 'green',
        })
        this.setState({ color_object : newObject , clicked : true})
    }


    handleInCorrect = (attempted_index) => {
        this.props.handleAttempt(this.props.index,attempted_index)
        let newObject = Object.assign(this.state.color_object , {
            correct_dynamic_color : 'green',
            correct_dynamic_color_2 : 'green',
        })
        this.setState({ color_object : newObject , clicked : true})
    } 

    handleSwip = (direction, state) => {
        let newObject = Object.assign(this.state.color_object , {
            correct_dynamic_color : '',
            correct_dynamic_color_2 : '',
        })
        this.setState({ color_object : newObject , clicked : false})
        this.props.handleSwip(direction, state)
    }

    render(){
        const test_question = this.props.test_question
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        let text = this.props.language === 'english' ? test_question.english_text : test_question.hindi_text
        return(
            <ThemeContext.Consumer>
            {(theme) => { return(
                <GestureRecognizer
                  onSwipe={(direction, state) => {this.handleSwip(direction, state)}}
                  config={config}
                  style = {{ height : this.props.height}}
                >
                    <ScrollView  style = {{ padding : '5%', backgroundColor : theme.background , borderColor : theme.outline_color , borderWidth : 1, borderRadius : 5 }}>
                        <View>
                            <Text style = {{ color : theme.text_color , fontSize : 20}}>
                                Q {this.props.index + 1} . {entities.decode(test_question.english_text)}{`\n`}{`\n`}{entities.decode(test_question.hindi_text)}
                            </Text>
                        </View>  
                        { test_question.pic === null ? <></> : 
                         
                         <Image
                           style={{
                             flex: 1,
                             resizeMode: 'contain',
                             aspectRatio: 4.5
                           }}
                           source={{ uri : file_base_url + '/questions/' + test_question.pic }}
                         />
                       
                        
                    }
                        <View
                        style={{
                            paddingTop : '6%',
                            width : "100%",
                            borderBottomColor: theme.text_color,
                            borderBottomWidth: 1,
                        }}
                        />
                        <View style = {{ flex : 1 , paddingTop : '10%' , paddingBottom : '10%'}}>
                            {   test_question.test_options.map(( test_option , index ) => {return(
                                <Option clicked = {this.state.clicked} index = {index} key = {test_option.option_id} 
                                outline_color = {theme.outline_color} option = {test_option} 
                                test_question = {test_question} color_object = {this.state.color_object} 
                                handleCorrect = {this.handleCorrect} handleInCorrect = {this.handleInCorrect}  />
                            )})}
                        </View>
                    </ScrollView>
              </GestureRecognizer>
            )}}
        </ThemeContext.Consumer> 
        // <Image source = {require ('../../../assets/pdf.jpg')} />
        )
    }
}

class Option extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            wrong_dynamic_color : '',
            wrong_dynamic_color_2 : ''
        }
    }
    componentDidMount(){
        this.setState({wrong_dynamic_color : this.props.outline_color })
    }

    render(){
        const { outline_color , option , test_question , index} = this.props;
        if(this.props.test_question.is_attempted !== true){
            return(
                <Button large disabled = {this.props.clicked} bordered block style = {[{ borderColor : (index === parseInt(test_question.correct_option_index) - 1 ? (this.props.color_object.correct_dynamic_color === '' ? this.props.outline_color : this.props.color_object.correct_dynamic_color) : this.state.wrong_dynamic_color) ,
                    backgroundColor : (index === parseInt(test_question.correct_option_index) - 1 ? this.props.color_object.correct_dynamic_color_2 : this.state.wrong_dynamic_color_2 )}]} 
                    onPress = {() => {if(index === (parseInt(test_question.correct_option_index) - 1)) {this.props.handleCorrect(parseInt(this.props.index) + 1)} 
                else{this.setState({ wrong_dynamic_color : 'red' , wrong_dynamic_color_2 : 'red'}); this.props.handleInCorrect(parseInt(this.props.index) + 1)}}} >
                    <Text uppercase = {false} style = {{ color : outline_color }}> {index + 1 } . {entities.decode(option.option_english_text)} </Text>
                </Button>
            )
        }else {
            let borderColor = '' , backgroundColor = ''
            if(index === parseInt(test_question.correct_option_index) - 1){
                borderColor = 'green'
                backgroundColor = 'green'
            }else if(index === parseInt(test_question.attempted_index) - 1){
                if(parseInt(test_question.attempted_index) === parseInt(test_question.correct_option_index)){
                    borderColor = 'green'
                    backgroundColor = 'green'
                } else {
                    borderColor = 'red'
                    backgroundColor = 'red'
                }
            } else {
                   borderColor = 'white'
            }
             
            return(
                <Button large disabled = {true} bordered block style = {[{ borderColor : borderColor ,
                     backgroundColor : backgroundColor }]}  >
                    <Text uppercase = {false} style = {{ color : outline_color }}> {index + 1 } . {entities.decode(option.option_english_text)} </Text>
                </Button>
            )
        }
    }
}

export default class TestSwiper extends React.Component {
    static navigationOptions = {
        header : null
    }
    constructor(props){
        super(props);
        this.child = React.createRef();
        this.state = {
            "test_questions": [],
            "test_questions_loading" : true,
            "test_question_array" : [],
            "current_index" : 1,
            "time_taken" : 0,
            "time_allowed" : '',
            current_index : 1,
            "test_finished" : false,
            present_selected_language : ''
        }
    }

    

    handleAttempt = (index,attempted_index) => {
        let test_question_array = JSON.parse(JSON.stringify(this.state.test_question_array))
        test_question_array[index] = Object.assign(test_question_array[index] , { is_attempted : true , attempted_index : attempted_index})
        this.setState({ test_question_array : test_question_array})
    }

    

    handleSwip = async (direction, state) => {
        if(direction === 'SWIPE_LEFT'){
            if(!(this.state.current_index === this.state.test_question_array.length)){
                this.setState(state => ({ current_index : state.current_index + 1}))
               
            }
        } else if(direction === 'SWIPE_RIGHT'){
            if(!(this.state.current_index === 1)){
                this.setState(state => ({ current_index : state.current_index - 1}))
            }
        }
    }

    makeSwiper = (current_index) => {
        if(this.state.test_question_array.length === 0){
            return <></>
        } else {
            let height = parseInt(this.state.current_index) === parseInt(this.state.test_question_array.length ) ? '65%' : '73%'
            return <Question language = {this.state.present_selected_language} height = {height} handleAttempt = {this.handleAttempt} handleSwip = {this.handleSwip} index = {current_index - 1} test_question = {this.state.test_question_array[current_index - 1]}  />
        }
    }

    componentDidMount  = async () =>  {
        let language = null
        let test = this.props.navigation.getParam('test');
        try{
            language = await AsyncStorage.getItem('language');
        }catch(err){
            console.log(err)
        }
        this.setState({ present_selected_language : language });
        this.setState(({ time_allowed : test.test_allowed_time_in_seconds}))
        fetch(`${baseurl}tests/fetch_test_questions_by_test_id/${test._id}/${endurl}`)
        .then((res) => res.json())
        .then((data) => {
            if(data.length !== 0){
                this.setState({ test_questions : data})
                ///////////////// For Formatiing Data /////////////////////////////
                let test_questions = data
                let test_question_array = []
                let test_question = {test_options : []}
                test_question_counter = 0
                previous_test_question_id = null
                for( let i  = 0 ; i <= test_questions.length ; i++){
                    if(i === test_questions.length){
                        test_question_array.push(test_question)
                        test_question_counter ++;
                        break;
                    }
                    if(previous_test_question_id !== test_questions[i].test_question_id){
                        if( i !== 0){
                            test_question_array.push(test_question)
                            test_question_counter ++;
                        }
                        test_question = {test_options : []}
                        previous_test_question_id = test_questions[i].test_question_id
                        test_question.test_question_id = test_questions[i].test_question_id
                        test_question.english_text = test_questions[i].english_text
                        test_question.hindi_text = test_questions[i].hindi_text
                        test_question.correct_option_index = test_questions[i].correct_option_index
                        test_question.pic = test_questions[i].pic
                        test_question.is_attempted = false
                        test_question.attempted_index = 0
                        test_question.test_options.push({ option_id : test_questions[i].option_id , option_english_text : test_questions[i].option_english_text , option_hindi_text : test_questions[i].option_hindi_text })
                    } else {
                        test_question.test_options.push({ option_id : test_questions[i].option_id , option_english_text : test_questions[i].option_english_text , option_hindi_text : test_questions[i].option_hindi_text })
                    }
                }
                this.setState({ test_question_array : test_question_array , test_questions_loading : false})
               ///////////////// For Formatiing Data /////////////////////////////

            } else {
                alert("Test Is Not Set . Please Contact To Institution")
            }
        })
        .catch((err) => { console.log(err) ; alert("Technical Error")})
        BackHandler.addEventListener('hardwareBackPress', this.handle_time_problem);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handle_time_problem);
    }


    handle_time_problem = () => {
        if(this.state.test_finished === true){
            let refresh_list = this.props.navigation.getParam('refresh_list');
            refresh_list();
            return false;
        } else {
            Alert.alert(
                'Alert',
                'You are not allowed to leave test....',
                [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: true },
            );
            return true 
        }
    }
    
    
    componentDidUpdate() {}
    
    finishTest = async () => {
        if(this.child.current.returnTimeTaken() < (0.75 * this.state.time_allowed)){
            alert("You Cannot Submit Test Before 3/4th of total time ")
        } else {
            alert("Test Finished")
            await this.setState({ test_finished : true , time_taken : this.child.current.returnTimeTaken()})
        }
        
    }

    render() {
        let test = this.props.navigation.getParam('test');
        if(this.state.test_finished === true){
            let test_info = {
                test_id : test._id,
                time_taken : this.state.time_taken
            }
            return <TestResult test_info = {test_info} test_question_array = {this.state.test_question_array} />
        }
        if(this.state.time_allowed === this.state.seconds){
            this.finishTest()
            return <></>
        }
        if(this.state.test_questions_loading === true){
            return ( 
                <ThemeContext.Consumer>
                {( theme ) => {return(
                <Container style = {{ backgroundColor : theme.background}}>
                <Header style={[styles.androidHeader , { backgroundColor: theme.header_background_color }]}>
                    <Left>
                        <TouchableOpacity onPress = {() => this.handle_time_problem()} hitSlop = {{top: 20, bottom: 20, left: 30, right: 30}}> 
                           <Icon name='arrow-back' style = {{ color : 'white' , paddingLeft : "20%"}}  />
                        </TouchableOpacity>
                    </Left>
                    <Body style = {{ flex : 3, justifyContent : 'center' , alignItems : 'center'}} >
                        <Text style = {{ color : 'white' , fontSize : 19 , paddingLeft : '26%'}}>Online Test</Text>
                    </Body>
                    <Right>
                          
                    </Right>
                </Header>
                <Spinner color = {theme.spinner_color} />
            </Container>
            )}}    
            </ThemeContext.Consumer>
            )
        }
        return (
            <ThemeContext.Consumer>
            {( theme ) => {return(
            <Container style = {{ backgroundColor : theme.background ,  flex:1, flexDirection: 'column' ,justifyContent: 'space-between'}}>
                <Header style={[styles.androidHeader  , { backgroundColor: theme.header_background_color }]}>
                    <Left>
                        <TouchableOpacity onPress = {() => this.handle_time_problem()}> 
                        <Icon name='arrow-back' style = {{ color : 'white' , paddingLeft : "20%"}}  />
                        </TouchableOpacity>
                    </Left>
                    <Body style = {{ flex : 3, justifyContent : 'center' , alignItems : 'center'}} >
                        <Text style = {{ color : 'white' , fontSize : 19 , paddingLeft : '26%'}}>Online Test</Text>
                    </Body>
                    <Right>
                          
                    </Right>
                </Header> 
                <View style = {{ backgroundColor : theme.background  , justifyContent : 'space-between'  , flexDirection : 'row' , paddingTop : '0%'    }}>
                    <Text style = {{ color : theme.text_color , justifyContent : 'flex-start'}}> Q.No {this.state.current_index} / {this.state.test_question_array.length} </Text>
                    <Timer finishTest = {this.finishTest} ref={this.child} timeTaken = {this.timeTaken} theme = {theme} time_allowed = {parseInt(test.test_allowed_time_in_seconds)} />
                </View> 
                {/* <Image source = {require ('../../../assets/pdf.jpg')} /> */}
                {this.makeSwiper(this.state.current_index)}
                {parseInt(this.state.current_index) === parseInt(this.state.test_question_array.length ) ?
                     <Animatable.View  animation = "zoomIn" iterationCount = {1} >
                        <Button style = {{ width : '100%' , justifyContent: 'center' , alignItems : 'center' , backgroundColor : theme.name === "dark" ? "white" : "blue" }} onPress = {() => this.finishTest()} ><Text style = {{color : theme.name === "dark" ? "#000000" : "white"}} >Finish Test</Text></Button>
                    </Animatable.View> :
                     <></>}
                <BottomToolBar toolbar_background_color = {theme.header_background_color} /> 
            </Container>
            )}}    
            </ThemeContext.Consumer>
        )
    }
}

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

//image_size = 384 * 90


