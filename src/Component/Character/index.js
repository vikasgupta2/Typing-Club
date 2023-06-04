import './index.css'

const Character = props => {
    const {character, activeChar, previousChar} = props
    if (previousChar===true) {
      return <span className="correct">{character}</span>
    }

    if (previousChar===false) {
      return <span className="incorrect">{character}</span>
    }
    if (activeChar){
      return <span className="active">{character}</span>
    }
    return <span>{character}</span>
    
  }
  export default Character