import React, { createContext, useContext, useEffect, useState } from "react";
import { TextField, Button, Grid, CircularProgress } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import "./styles.css";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import thunk from "redux-thunk";
import { MyLocation } from "@material-ui/icons";
import { calculate } from "./api/MathApi";
import {BrowserRouter, Route, Switch, Link} from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const MyTextField = ({ identifiant, title, value, onChange, ...rest }) => {
  return (
    <TextField
      id={identifiant}
      label={title}
      variant="outlined"
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

const MyButton = ({titre, onClick }) => {
  return (
  <Button variant="contained" color="primary" onClick={onClick}>
    {titre}
  </Button>)
}

const Calculatrice = () => {
  const classes = useStyles()
  const [ historiqueList ,setHistoriqueList] = useContext(CalculatriceContext)
  const [premierNumber, setPremierNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const [operator, setOperator] = useState('');

  const dispatch = useDispatch()
  const handleSaisieNumber = (event, setter) => {
    event.preventDefault();
    if (isNaN(event.target.value)) setError(true);
    else {
      setter(event.target.value);
      setError(false)
    }
  };

  const calculate = (n, m, operator) => {
   
    switch(operator){
      case '+':
        return +n + +m;
      case '-':
        return n - m;
      case '*':
        return +n * +m;
      case '/':
        return +n / +m;
      default:
        return NaN;
    }
    
  }

  const calculateExpression = () => `${premierNumber}%2B${secondNumber}`

  /*useEffect(() => {
     const fetchData = async () =>   {
        const response = await fetch("https://api.mathjs.org/v4/?expr="+calculateExpression());
        const data = await response.json();
        setResult(data);
      }
      fetchData();
  }, [operator])
*/

  const handleClick = (operator) => {
   const result = calculate(premierNumber, secondNumber, operator)
    setOperator(operator)
    setResult(result)
    const element = {
      id: Math.random(),
      premier: premierNumber,
      second: secondNumber,
      operator,
      result
    };
    dispatch(addHistoriqueActionCreator( {...element} ))

    dispatch(validatorThunkActionCreator({...element}))
  }
  return (
    <>
    <h1> React Calculatrice </h1>

    <form className = {classes.root}>
      <MyTextField
        error={error}
        identifiant="premierNumber"
        title="First Number"
        value={premierNumber}
        onChange={(event) => handleSaisieNumber(event, setPremierNumber)}
      />
      <br />
      <MyTextField
        error={error}
        identifiant="secondNumber"
        title="Second Number"
        value={secondNumber}
        onChange={(event) => handleSaisieNumber(event, setSecondNumber)}
      />
      <br/>
      <MyButton titre='+' onClick={() => handleClick('+')} />
      <MyButton titre='-' onClick={() => handleClick('-')}/>
      <MyButton titre='*' onClick={() => handleClick('*')}/>
      <MyButton titre='/' onClick={() => handleClick('/')}/>
      <p>
        Result: {result}
      </p>
    </form>
    </>
  );
};

const Historique = () => {
  const store = useStore();
  console.log(store.getState())
  const historiqueList = useSelector((state) => state.historiqueState)
  const afficherItem = (item) => `${item.premier} ${item.operator} ${item.second} = ${item.result}` 
  
  return (
    <>
      <h1> Votre Historique </h1>
      {historiqueList.map(item => (
      <div key={item.id}>
      {afficherItem(item)} <MyIcon isValid={item.isValid} /> 
      </div>))}
    </>
  )
}

const MyIcon = ({isValid}) => {
  if(isValid === undefined) return <CircularProgress />;
  return isValid ? <CheckIcon /> : <CloseIcon />;
}
const initialState = {
  historiqueState : [],
  validatoreState : {}
}
const CalculatriceContext = createContext([]);

const historiqueReducer = (prevState = initialState, action) => {
  console.log( prevState);

  if(action.type ===  'ADD_HISTORIQUE'){
    console.log(action)
    const newState =  prevState.concat(action.payload)
    return newState
  } else if (action.type === 'VALIDATE_OPERATION'){
    /*callApiValidate(action.payload).then(

    ).then (data => {
      if(data === action.payload.result){
        prevState.map(item => item.id === action.payload.id ? {...item, isValid: true}: item)
      }
    })*/  
    console.log(action);
    console.log( prevState);
    
    return prevState.map(item =>  item.id === action.payload.id ? action.payload : item) ;
    
     
    
  }
  else {
    return prevState;
  }
}

const callApiValidator = async () => {
  try {
  const response = await calculate(2,3,'+')
  return response.data
  } catch (error){
    console.log("error: " + error);
  }
}
const validatorReducer = (prevState = initialState, action) => {
  
    return prevState;
}


const validatorThunkActionCreator = (element) => {
  return async (dispatch, getState) => {
    const data = await callApiValidator();
    console.log("data", data)
    element.isValid = (data === element.result)
    console.log (element.isValid)
    dispatch(validateResultActionCreator(element))
  }

}

const rootReducer = combineReducers({
  historiqueState: historiqueReducer,
  validatoreState: validatorReducer
})


const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
const addHistoriqueActionCreator = (historique) =>(
  {
    type: 'ADD_HISTORIQUE',
    payload: historique
  }
)

const validateResultActionCreator = (historique) => (
  {
    type: 'VALIDATE_OPERATION',
    payload: historique
  }
)

const CalculatricePage = () => {

    

  return (
    <Provider store={store}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
        <Calculatrice  />
        </Grid>
        <Grid item xs={6}>
        <Historique />
        </Grid>
      </Grid>
    </Provider>
  );
};
const NavBar = () => {
  return (
    <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/calculatrice">Calculatrice</Link>
            </li>
            <li>
              <Link to="/historique">Historique</Link>
            </li>
          </ul>
        </nav>
        </div>
  )
}
const Bonjour =() => <h1> Bonjour </h1>;
const NotFoundPage = () => <h1> Path not found </h1>; 
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <div>
        <NavBar />

        <Switch>
          <Route path="/" exact={true}>
            <Bonjour />
          </Route>
          <Route path="/calculatrice" exact={true} >
            <Calculatrice />
          </Route>
          <Route path ="/historique" exact={true} >
            <Historique />
          </Route>
          
        </Switch>
        </div>
      </BrowserRouter>

    </Provider>
  );
}

