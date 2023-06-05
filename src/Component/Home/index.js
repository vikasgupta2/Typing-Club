import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import Character from '../Character'
import './index.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';



const characters ='asdfjk dfjk flak flask as l;as dfjk flask as dfjk las l;as dfjk l;as dfjk l;as dfjk l;as l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk flask as dfjk las dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk l;as dfjk dfjk l;as dfjk dfjk l;as dfjk l;as dfjk l;as dfjk;'


class Home extends Component {
  constructor(){
    super();
    this.state = { defaultCharacters: characters,
      defaultCharactersLength: 0,
      userInput: '',
      activeCharIndex: 0,
      isTimerRunning: false,
      timeElapsedInSeconds: 0,
      correctCharArr: [],
      correctCharCount: 0,
      ncpm: 0,
      keyPressedCount:0,
      accuracy: 0,
      isPauseButtonClicked:false, 
    }
  }

  componentDidMount(){
    const {defaultCharacters} = this.state
    this.setState({defaultCharactersLength: defaultCharacters.length})
    document.getElementById("pauseResumeBtn").classList.add("disabled-btn")
    document.getElementById("pauseResumeBtn").setAttribute("disabled","enabled")
    document.getElementById("resultBtn").setAttribute("disabled","enabled")
    document.getElementById("restartBtn").setAttribute("disabled","enabled")
  }

  onStartTimer = () => {
    this.timeInterval = setInterval(()=>{
      this.setState(prevState => ({
      timeElapsedInSeconds: prevState.timeElapsedInSeconds + 1,
      }))
      const {timeElapsedInSeconds} = this.state
      if(timeElapsedInSeconds===300){     
        // after 5 min result will automattically appear
        this.result()
      }
    }, 1000)

    this.setState({isTimerRunning: true})
    document.getElementById("inputText").removeAttribute("disabled")
    document.getElementById("pauseResumeBtn").removeAttribute("disabled")
    document.getElementById("pauseResumeBtn").classList.remove("disabled-btn")
    document.getElementById("resultBtn").removeAttribute("disabled")
    document.getElementById("resultBtn").classList.remove("disabled-btn")
    document.getElementById("restartBtn").removeAttribute("disabled")
    document.getElementById("restartBtn").classList.remove("disabled-btn")
    document.getElementById("customInputBtn").setAttribute("disabled","enabled")
    document.getElementById("generateRandomChar").setAttribute("disabled","enabled")
    document.getElementById("startBtn").classList.add("disabled-btn")
    document.getElementById("customInputBtn").classList.add("disabled-btn")
    document.getElementById("generateRandomChar").classList.add("disabled-btn")
    
    document.getElementById('inputText').focus()
  }

  onPauseTimer = () => {
    const {timeElapsedInSeconds} = this.state
    this.setState({isTimerRunning: true, timeElapsedInSeconds, isPauseButtonClicked: true})
    clearInterval(this.timeInterval)
    document.getElementById("inputText").setAttribute("disabled","disabled")
  }

  onResumeTimer = () => {
    this.timeInterval = setInterval(()=>{
      this.setState(prevState => ({
      timeElapsedInSeconds: prevState.timeElapsedInSeconds + 1,
      }))
    }, 1000)
    this.setState({isTimerRunning: true, isPauseButtonClicked: false})
    document.getElementById("inputText").removeAttribute("disabled")
    document.getElementById("inputText").focus()
  }

  onRestartBtn = () =>{
    this.refresh()
  }

  onResultBtn = () => {
    setTimeout(()=>{
      const {ncpm, accuracy,correctCharCount,activeCharIndex, keyPressedCount, defaultCharactersLength} = this.state
      const result = `You typed ${correctCharCount} correct character out of total ${defaultCharactersLength} character in ${this.renderMinutes()} min ${this.renderSeconds()} sec.`
      document.getElementById("resultText").textContent = result
      document.getElementById("ncpm").textContent = ncpm
      document.getElementById("totalNumberOfKey").textContent = keyPressedCount
      document.getElementById("keyPressedText").textContent = activeCharIndex
      document.getElementById("correctCharacterText").textContent = correctCharCount
      document.getElementById("accuracyText").textContent = accuracy
      document.getElementById("typingContainer").classList.add("hideContainer")
      document.getElementById("resultContainer").classList.remove("hideContainer")
    },500)
    
  }

  renderSeconds = () => {
    const {timeElapsedInSeconds} = this.state
    const seconds = Math.floor(timeElapsedInSeconds % 60)

    if (seconds < 10) {
      return `0${seconds}`
    }
    return seconds
  }

  renderMinutes = () => {
    const {timeElapsedInSeconds} = this.state
    const minutes = Math.floor(timeElapsedInSeconds / 60)

    if (minutes < 10) {
      return `0${minutes}`
    }
    return minutes
  }

  onChangeInput = (event) => {
    const userInput = event.target.value
    const {defaultCharacters, defaultCharactersLength, activeCharIndex} = this.state
    this.setState({userInput, defaultCharactersLength: defaultCharacters.length})
    const defaultCharactersLastChar = defaultCharacters[activeCharIndex]
    let userInputLastChar;
    if(userInput.length===1){
      userInputLastChar=userInput.slice(0)
    }else{
      const userInputChar = userInput.slice(0, userInput.length)
      userInputLastChar = userInputChar.slice(-1)
    }

    if(userInputLastChar===defaultCharactersLastChar){
      this.setState(prevState => ({
        correctCharArr: [...prevState.correctCharArr,true]
      }), function() {
        this.calculatePerformance();
     })
    }else{
      this.setState(prevState => ({
        correctCharArr: [...prevState.correctCharArr,false]
      }), function() {
        this.calculatePerformance();
     })
    }

    this.setState(prevState => ({
      activeCharIndex: prevState.activeCharIndex + 1,
    }))  


    if(defaultCharactersLength===userInput.length){
      this.onResultBtn()
    }

  }


  calculatePerformance = () => {
    setInterval(()=>{
      const {correctCharArr, defaultCharactersLength,timeElapsedInSeconds} = this.state
      const correctCharArrHavingTrue = correctCharArr.filter((eachBoolean)=>eachBoolean===true)
      const correctCharCount = correctCharArrHavingTrue.length
      const WrongCharCount = defaultCharactersLength-correctCharCount
      const keyPressedCount = correctCharCount + WrongCharCount
      const gcpm = (keyPressedCount/(timeElapsedInSeconds/60)).toFixed(2)
      const ncpm = (correctCharCount/(timeElapsedInSeconds/60)).toFixed(2)
      const accuracy = (ncpm*100/gcpm).toFixed(2)
      this.setState({accuracy,keyPressedCount, ncpm,correctCharCount,defaultCharactersLength})
    },1000)
  }


  onClickInputText = () => {
    const {isTimerRunning} = this.state
    if(!isTimerRunning){
      alert("Please click on start button to start typing...")
      document.getElementById("inputText").setAttribute("disabled","disabled")
    }
  }


  generateRandomCharacters= () => {
    let randomCharacters = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 700; i++ ) {
      randomCharacters += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.setState({defaultCharacters: randomCharacters, activeCharIndex:0, correctCharArr:[], isTimerRunning: false, timeElapsedInSeconds:0})
    document.getElementById("inputText").value=""
  }

  refresh = () => {
    window.location.reload()
  }


  render() {
    let {defaultCharacters} = this.state;
    defaultCharacters = defaultCharacters.split('');
    const {isTimerRunning, activeCharIndex,correctCharCount, correctCharArr, accuracy, ncpm, isPauseButtonClicked} = this.state;
    const timerTime = `${this.renderMinutes()}:${this.renderSeconds()}`
    return (
      <>
      <div className="desktop-container">
        <div className='logo-container'>
          <img src='https://res.cloudinary.com/db76nylxq/image/upload/v1685858717/typingclub_logo_g63o6r.png' className='logo-img' alt='logo'/>
          <h1 className="logo-heading">Typing Club</h1>
        </div>
        
        <div className="typing-container" id="typingContainer">
          <p className="default-text">
            {defaultCharacters.map((character, index) =><Character
                key={uuidv4()}
                character={character}
                activeChar={index === activeCharIndex}
                previousChar = {correctCharArr[index]}
              />
            )}
          </p>
          <div className='custom-random-btn-container'>
          <Popup
            trigger={<button className="blue-btn" id='customInputBtn'> Custom Input </button>}
            modal
            >
          {close => (
            <div className="popup-container modal">
                <textarea className='custom-input' rows={6} id="customInput" placeholder='Please enter min 10 and max 5000 Character or Copy/Paste'/>
                <div className='setCustom-cancel-btn'>
                <button
                  className="set-custom-cancel-btn"
                  onClick={() => {
                    const customInputText = document.getElementById("customInput").value
                    
                    if(customInputText.length>10 && customInputText.length<5000){
                      this.setState({defaultCharacters: customInputText})
                    }
                    document.getElementById("inputText").value = ""
                    close();
                  }}
                >
                  Set Custom Input
                </button>
                <button type='button' className='set-custom-cancel-btn' onClick={close}>Cancel</button>
                </div>
              </div>
          )}
          </Popup>
          <button type='button' className='blue-btn' id='generateRandomChar' onClick={this.generateRandomCharacters}>Generate Random Characters</button>
          </div>
          <div className='input-container'>
          <label htmlFor="inputText" className="input-text-label">
            Enter Character
          </label>
          <textarea
            type="text"
            className="input-text"
            id="inputText"
            maxLength={this.state.defaultCharactersLength}
            onChange={this.onChangeInput}
            onClick={this.onClickInputText}
            placeholder='Click on start button to start typing...'
          />
          </div>
          <div className='start-stop-result-btn-container'>
            <button type="button" className="start-btn btn" id="startBtn" onClick={this.onStartTimer} disabled={isTimerRunning}>
              start
            </button>
            {isPauseButtonClicked ? <button type='button' className='resume-btn btn' id="pauseResumeBtn" onClick={this.onResumeTimer}>Resume</button>
            : <button type='button' className='pause-btn btn' id="pauseResumeBtn" onClick={this.onPauseTimer}>Pause</button>  
            }
            <button type='button' className='restart-btn btn disabled-btn' id="restartBtn" onClick={this.onRestartBtn}>Restart</button>
            <button type='button' className='result-btn btn disabled-btn' id="resultBtn" onClick={this.onResultBtn}>Result</button>


          </div>
          <div className="performance-container">
            <div className='performance-sub-container'>
              <div className='performance-result'>
              <img src="https://res.cloudinary.com/db76nylxq/image/upload/v1685653224/timer_icon_farhbl.png" alt="timer"/>
              <p className='performance-count'>{timerTime}</p>
            </div>
            <hr className='horizontal-line'/>
            <p className='performance-text'>Timer</p>
            </div>
            <div className='performance-sub-container'>
              <div className='performance-result'>
              <img src="https://res.cloudinary.com/db76nylxq/image/upload/v1685870582/Pngtree_green_correct_icon_5986819_2_s11vvk.png" alt="correct-key-icon"/>
              <p className='performance-count'>{correctCharCount}</p>
            </div>
            <hr className='horizontal-line'/>
            <p className='performance-text'>Correct Key</p>
            </div>
            <div className='performance-sub-container'>
              <div className='performance-result'>
              <img src="https://res.cloudinary.com/db76nylxq/image/upload/v1685871140/icons8-bill-20_ccjzdp.png" alt="key-pressed-icon"/>
              <p className='performance-count'>{activeCharIndex}</p>
            </div>
            <hr className='horizontal-line'/>
            <p className='performance-text'>Key Pressed</p>
            </div>
            <div className='performance-sub-container'>
              <div className='performance-result'>
              <img src="https://res.cloudinary.com/db76nylxq/image/upload/v1685665066/speedometer_qzb4ml.png" alt="ncpm"/>
              <p className='performance-count'>{ncpm}</p>
            </div>
            <hr className='horizontal-line'/>
            <p className='performance-text'>CPM</p>
            </div>
            <div className='performance-sub-container'>
              <div className='performance-result'>
              <img src="https://res.cloudinary.com/db76nylxq/image/upload/v1685664717/accurate_1_ae6oci.png" alt="accuracy"/>
              <p className='performance-count'>{accuracy}</p>
            </div>
            <hr className='horizontal-line'/>
            <p className='performance-text'>Accuracy</p>
            </div>
          
          </div>
        </div>
        
        <div id="resultContainer" className='hideContainer result-container'>
          <h2 className='result-heading'>Overall Performance</h2>
          <p id="resultText"></p>
          <div className='result-data-container'>
          <p className='result-data-text'>Total Number of Keys : <span className='highlight-text' id="totalNumberOfKey"></span>  Character</p>
          <p className='result-data-text'>Total key pressed : <span className='highlight-text' id="keyPressedText"></span>  Character</p>
          <p className='result-data-text'>Correct Character Pressed : <span className='highlight-text' id="correctCharacterText"></span> Character</p>
          <p className='result-data-text'>Character Per Minute[CPM] : <span className='highlight-text' id="ncpm"></span> CPM</p>
          <p className='result-data-text'>Accuracy : <span className='highlight-text' id="accuracyText"></span>%</p>
          </div>
          <p className='thank-you-text'>Thanks for using Typing Club.</p>
          <button className='back-btn btn' onClick={this.refresh}>Back</button>
        </div>
      </div>
      
      <div className='mobile-container'>
        <div className='logo-container'>
          <img src='https://res.cloudinary.com/db76nylxq/image/upload/v1685858717/typingclub_logo_g63o6r.png' className='logo-img' alt='logo'/>
          <h1 className="logo-heading">Typing Club</h1>
        </div>
        <div className='mobile-text-container'>
          <p className='mobile-msg-text'>Please use Laptop or Computer for using Typing Club.</p>
          <p className='mobile-thank-text'>Thank you</p>
        </div>
      </div>
      </>
    )
  }
}

export default Home

