
import auth from '../oauth2.keys.json';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route} from "react-router-dom";
import jwt from 'jsonwebtoken';
import { Nav } from './components/nav.js'
import { UploadYoutube } from './components/YoutubeUpload.js'
import { Upload } from './components/VideoUpload.js'
import { Results } from './components/Results.js'
import { GetChannelData } from './components/channelData.js'


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false
        }
    }
    getUrl() {
        let url = window.location.href
        const urlPath = url.replace(/^.+5000\//ig, ""); 
        let path = urlPath ? '/'+urlPath : '/'
        return path
    }
    showLogin(){
        let path = this.getUrl()
        return path === '/' ? 'block' : 'none'
    }
    showDropDown() {
        let path = this.getUrl()
        return path === '/' ? 'none' : 'block'
    }
    render () {
        console.log(this.getUrl() )       
        return (
    
            <Router>
                <Nav showLogin={this.showLogin()}
                    showDropDown={this.showDropDown()} 
                    getUrl={this.getUrl()}
               />

               {/* <Results /> */}
                <Route path='/upload' component={Upload} />
                {/* <Route path={'/upload-youtube'}
                render={() => 
                    <div>
                        <UploadYoutube />
                    </div>
                } /> */}
                {/* <Route path="/edit/:id" component={EditExercise} />
                <Route path="/contact" component={Contact} />
                <Route path="/user" component={CreateUser} /> */}
            </Router>
        );
    }
};



ReactDOM.render(<App />, document.getElementById('app'));




