



import React from 'react'
import { Image , TouchableOpacity , AsyncStorage , NetInfo , Dimensions} from 'react-native';
import {  Card, Container, Spinner , CardItem, Thumbnail, Text, Left , Body , Button , Icon, Content  , List, ListItem,   Right} from 'native-base'
import { baseurl , endurl } from '../../../baseurl'
import { ThemeContext } from '../../../GlobalContext'
import { FileSystem } from 'expo'
import Dialog from 'react-native-dialog'
const { Permissions } = Expo;

export default class PdfComponent extends React.Component {
    state = {
        object : {} , 
        loading : false,
        total_data_to_loaded : 100,
        data_loaded : 0,
        offline : false,
        message : '',
        pdf_available : false,
        offline_pdfs : [],
        pdf_downloading : false
    }


    handleBack = () => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                alert("No Internet Connection")
            } else {
                this.props.goBack()
            }
        });
    }
    
    

    handleOpen = (pdf) => {
        alert(`This Pdf File Is Located In Downloads Folder with File Name ${pdf.english_name}`)
        // this.props.stackNavigatorRef.navigate('PDFVIEW' , { pdf : pdf})
    }

    componentDidMount = async () =>  {
       
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        if(connectionInfo.type === 'none'){
            this.setState({ offline : true , loading : true})
            AsyncStorage.getItem('PDFS')
            .then((data) => { if(data === null){ alert("No Pdf Available") ; this.setState({ message : 'No Pdf Downloads Are Available...' , loading : false}) } else {
                this.setState({ offline_pdfs : JSON.parse(data) , loading : false})}})
        } else {
            this.setState({ loading : true })  
            fetch(`${baseurl}pdf/get/${this.props.sub_category_id}/${endurl}`)
            .then((res) => res.json())
            .then((data) => {
                if(data.length === 0){
                    alert("Sorry...\nPdf Not Available")
                    this.props.goBack()
                } else { this.setState({ object : data[0] , loading : false}) 
            
                AsyncStorage.getItem('PDFS')
                    .then((folder) => {
                        if(folder !== null){
                            let pdf_downloaded = JSON.parse(folder).filter((item) => {
                                return ( item.sub_category_id === this.props.sub_category_id)
                            })
                            if(pdf_downloaded.length === 0){
                                this.setState({ pdf_available : false})
                            } else {
                                let newObject = Object.assign(this.state.object, { fileUri : pdf_downloaded[0].fileUri })
                                this.setState({ pdf_available : true , object : newObject })
                            }
                        }  else {
                        this.setState({ pdf_available : false})
                        }
               })
            }
            })
            .catch((err) => {console.log(err)})
        }
      });
    }

    handleDownload = async () => {
        const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if(status === 'granted'){
            this.setState({ pdf_downloading : true })
            let uri = `${baseurl}uploads/pdfs/${this.state.object.filename}`
            let fileUri = "file:///storage/emulated/0/Download/" + `AAA ${this.state.object.english_name}.pdf`
            download = FileSystem.createDownloadResumable(uri, fileUri, {}, (downloaded) => {
                this.setState({ total_data_to_loaded : downloaded.totalBytesExpectedToWrite, data_loaded : downloaded.totalBytesWritten })
                console.log(parseInt((this.state.data_loaded/this.state.total_data_to_loaded)) * 100)
            }, null)
            let response
            response = await download.downloadAsync();
            if(response.status === 200){
                let folder = await AsyncStorage.getItem('PDFS');
                if(folder === null){
                    let array = []
                    array.push({ ...this.state.object , fileUri : fileUri })
                    await AsyncStorage.setItem('PDFS' , JSON.stringify(array))
                    alert("Download Completed ....")
                    this.setState({ pdf_available : true })
                } else {
                    let array = JSON.parse(folder)
                    array.push({ ...this.state.object , fileUri : fileUri })
                    await AsyncStorage.setItem('PDFS' , JSON.stringify(array))
                    alert("Download Completed ....")
                    this.setState({ pdf_available : true })
                }
            } else {
                alert("Server Error ...")
            }   
            this.setState({ pdf_downloading : false })
        } else {
            const { status , permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status === 'granted'){
                            this.setState({ pdf_downloading : true })
                            let uri = `${baseurl}uploads/pdfs/${this.state.object.filename}`
                            let fileUri = "file:///storage/emulated/0/Download/" + `AAA ${this.state.object.english_name}.pdf`
                            download = FileSystem.createDownloadResumable(uri, fileUri, {}, (downloaded) => {
                                this.setState({ total_data_to_loaded : downloaded.totalBytesExpectedToWrite, data_loaded : downloaded.totalBytesWritten })
                            }, null)
                            let response
                            response = await download.downloadAsync();
                            if(response.status === 200){
                                let folder = await AsyncStorage.getItem('PDFS');
                                if(folder === null){
                                    let array = []
                                    array.push({ ...this.state.object , fileUri : fileUri })
                                    await AsyncStorage.setItem('PDFS' , JSON.stringify(array))
                                    alert("Download Completed ....")
                                    this.setState({ pdf_available : true })
                                } else {
                                    let array = JSON.parse(folder)
                                    array.push({ ...this.state.object , fileUri : fileUri })
                                    await AsyncStorage.setItem('PDFS' , JSON.stringify(array))
                                    alert("Download Completed ....")
                                    this.setState({ pdf_available : true })
                                }
                            } else {
                                alert("Server Error ...")
                            }   
                            this.setState({ pdf_downloading : false })
            } else {
                alert("Sorry You Need To Allow the Storage  Permissions For Downloading")
            }
        }  
    }

    render(){
        const barWidth = Dimensions.get('screen').width - 30;
        if(this.state.offline === true){
            return  (
                <ThemeContext.Consumer>
                    {(theme) => { return(
                                <Container style = {{ backgroundColor : theme.background}}>
                                <TouchableOpacity style = {{ paddingLeft : '10%' ,paddingBottom : '3%' , paddingTop : '3%' }} onPress = {() => this.handleBack()}>
                                    <Icon name = 'arrow-back' style = {{color : theme.text_color , alignSelf : 'flex-start'}} />
                                </TouchableOpacity>
                                <Content>
                                <List>
                                    {this.state.message === '' ? 
                                    (this.state.offline_pdfs.map((pdf,index) => {
                                        return(
                                        <TouchableOpacity key = {index}>
                                            <Card>
                                                <ListItem thumbnail>
                                                    <Left>
                                                        <Thumbnail square source = {require('../../../assets/pdf.jpg')} />
                                                    </Left>
                                                    <Body>
                                                        <Text>{pdf.english_name}</Text>
                                                    </Body>
                                                    <Right>
                                                        <Button transparent onPress = {() => {this.handleOpen(pdf)}}>
                                                            <Text>Open Pdf</Text>
                                                        </Button>
                                                    </Right>
                                                </ListItem>
                                            </Card>
                                        </TouchableOpacity>
                                        )
                                    }))
                                    : <Text style = {{ color : theme.text_color , paddingLeft : '5%' }}>No Pdf Downloads Available</Text>}
                                </List>
                                </Content>
                            </Container>
                        ) 
                    }}   
                </ThemeContext.Consumer>
            )
        }
        else if(this.state.loading === true){
            return  (
                <ThemeContext.Consumer>
                    {(theme) => {return(<Spinner color = {theme.spinner_color} />)}}   
                </ThemeContext.Consumer>
                )
        } else if(this.state.offline === false){
        return(
            <ThemeContext.Consumer>
            {(theme) => {return(
            <Container style = {{ backgroundColor : theme.background}}>
                <TouchableOpacity style = {{ paddingLeft : '10%' ,paddingBottom : '3%' , paddingTop : '3%' }} onPress = {() => this.props.goBack()}>
                    <Icon name = 'arrow-back' style = {{color : theme.text_color , alignSelf : 'flex-start'}} />
                </TouchableOpacity>
                <Card>
                    <CardItem>
                        <Left>
                            <Thumbnail source={{uri: 'https://scontent.fbho1-1.fna.fbcdn.net/v/t1.0-9/31939617_625223027816553_3358383972697505792_n.jpg?_nc_cat=106&_nc_ht=scontent.fbho1-1.fna&oh=b82993ec6f7c850bd8ef1b8b51b9289a&oe=5D247810'}} />
                                <Body>
                                    <Text>{this.state.object.english_name}</Text>
                                    <Text note>Pdf Worksheets</Text>
                                </Body>
                        </Left>
                    </CardItem>
                    <CardItem cardBody>
                        <Image source={{uri: `${baseurl}uploads/sub_category/${this.state.object.logo}`}} style={{height: 200, width: null, flex: 1}}/>
                    </CardItem>
                    <CardItem>
                        {this.state.pdf_available === true ? <Button onPress = {() => {console.log(this.state.object) ; this.handleOpen(this.state.object)}}><Text>Open Pdf</Text></Button> : <Button onPress = {() => this.handleDownload()}><Text>Download</Text></Button>}
                    </CardItem>
                </Card>
                <Dialog.Container visible = {this.state.pdf_downloading} >
                    <Text>Downloading  {`${Math.floor(((this.state.data_loaded / this.state.total_data_to_loaded))*100)}`}% </Text>
                    <Spinner color = 'blue' />  
                </Dialog.Container>
            </Container>

            )}}   
            </ThemeContext.Consumer>
        )
        }
        else{
            return  (
                <ThemeContext.Consumer>
                    {(theme) => {return(<Spinner color = {theme.spinner_color} />)}}   
                </ThemeContext.Consumer>
                )
        }
    }
}



{/* <PDFReader
                  source={{ uri: "file:///storage/emulated/0/Download/0a72715dc7469f96fd827da35a2e51891550603116406.pdf" }}
                /> */}

{/* <ProgressBarAnimated
            width={barWidth}
            value={this.state.progressWithOnComplete}
            onComplete={() => {
              Alert.alert('Hey!', 'onComplete event fired!');
            }}
          />                 */}