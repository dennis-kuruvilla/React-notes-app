import React, { useState } from 'react'


//PASSING EVENT HANDLERS TO CHILD------------------------

// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Display = props => <div>{props.value}</div>

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    setValue(newValue)
  }

  // Do not define components inside another component
  //const Display = props => <div>{props.value}</div>

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
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