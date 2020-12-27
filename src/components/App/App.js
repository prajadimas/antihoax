import React, { Component } from 'react'
import { withAlert } from 'react-alert'
import socketIOClient from 'socket.io-client'
import axios from 'axios'
import './App.css'

import Header from '../Header/Header'
// import Tweet from '../Tweet/Tweet'

export class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tweets: [],
      text: ''
    }
  }

  componentDidMount () {
    const socket = socketIOClient('http://localhost:8558/')

    /* socket.on('connect', () => {
      socket.on('newTweet', (tweet) => {
        this.setState(prevState => ({
          tweets: [...prevState.tweets, tweet]
        }))
      })
      socket.on('searchTerm', (term) => {
        this.setState({ term })
        document.getElementById('searchInput').value = ''
        this.props.alert.show('Tracking term was updated!')
      })
    })
    socket.on('disconnect', () => {
      socket.off('newTweet')
      socket.removeAllListeners('newTweet')
    }) */
  }

  analyzeText = (text) => {
    axios.post('/api/analyzer', {
      text: text
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render () {
    let tweets = this.state.tweets.reverse()
    /* let tweetCards = tweets.map((tweet) => {
      return <Tweet key={tweet.id} tweet={tweet} />
    }) */
    return (
      <div className='app-container'>
        <Header text={this.state.text} analyzeText={this.analyzeText}/>
        /* <div className='tweets-container'>
          {tweetCards}
        </div> */
      </div>
    )
  }
}

export default withAlert(App)
