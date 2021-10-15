import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import noteService from './services/notes'
import loginService from './services/login' 



//RENDERING A COLLECTION + GETTING FORM INPUT + FILTERING COLLECTION TO BE DISPLAYED----------------------------------------------------------------------------
//DEFINGING AN ARRAY FOR RENDERING A COLLECTION

//Following array definition was before we fetch the data from JSON server
// const notes1 = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     date: '2019-05-30T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     date: '2019-05-30T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 

  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  //we can have multiple effet hooks
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])



  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  // //Event Handler for button to add note
  // const addNote = (event) => {
  //   event.preventDefault() //prevents the default action of submitting a form. The default action would, among other things, cause the page to reload.
  //   console.log('button clicked', event.target)
  //   const noteObject = {
  //     content: newNote,
  //     date: new Date().toISOString(),
  //     important: Math.random() < 0.5,
  //     //id: notes.length + 1,    not adding id since id will be automatically populated when the object is added to json server
  //   }
    
  //   noteService
  //     .create(noteObject)
  //       .then(returnedNote => {
  //       setNotes(notes.concat(returnedNote))
  //       setNewNote('')
  //     })

  //   //following 2 lines of code is to add the user entered string to the notes array defined above. replaced it by updating the data in json server
  //   // setNotes(notes.concat(response.data))
  //   // setNewNote('')
  // }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
    .update(id, changedNote)
      .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })    
  }

  //funstion to handle controlled component (user input box)
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 

      noteService.setToken(user.token)
      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in</p>
        {noteForm()}
      </div>
      }

      
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
            <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      
    </div>
  )
}

//PASSING EVENT HANDLERS TO CHILD---------------------------------------------------------------------------------------------------------------------------

// This is the right place to define a component
const Button6 = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Display6 = props => <div>{props.value}</div>

const App6 = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    setValue(newValue)
  }

  // Do not define components inside another component
  //const Display = props => <div>{props.value}</div>

  return (
    <div>
      <Display6 value={value} />
      <Button6 handleClick={() => setToValue(1000)} text="thousand" />
      <Button6 handleClick={() => setToValue(0)} text="reset" />
      <Button6 handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}

//FUNCTIONS THAT RETURN A FUNCTION----------------
const App5 = () => {
  const [value, setValue] = useState(10)
  
  //following function returns a func. hence this func is called using () in onClick
  const setToValue = (newValue) => () => {
    setValue(newValue)
  }
  
  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}


//ARRAY AS STATE------------
const App4 = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
    </div>
  )
}


//EVEN HANDLING. INLINE LISTENER-------------
const App3 = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display3 counter={counter}/>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}> 
        zero
      </button>
    </div>
  )
}

const Display3 = (props) => {

  const [ counter2, setCounter2 ] = useState(0)
  return (<>
    <div>{props.counter}</div>
    <div> nested counter: {counter2}
    <button onClick={() => {setCounter2(counter2+1)}}>
        plus(nested)
      </button>
      <button onClick={() => {setCounter2(0)}}> 
        zero(nested)
      </button>
    </div>
    </>
  )
}


//EVENT HANDLING FUNCTION----------------
const App2 = () => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    setCounter(counter+1)
  }

  const handleClick2 = () => {
    setCounter(0)
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
      <button onClick={handleClick2}>
        reser
      </button>
    </div>
  )
}


const Hello = ({ name, age }) => {
  
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}

const App1 = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}


//---------------------------------

export default App