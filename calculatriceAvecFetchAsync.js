
import React, { createContext, useContext, useEffect, useState } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import "./styles.css";


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

  useEffect(() => {
      fetch("https://api.mathjs.org/v4/?expr="+calculateExpression())
      .then(response => response.json())
      .then(data => setResult(data))
  }, [operator])

  const handleClick = (operator) => {
    const element = {
      id: historiqueList.length,
      premier: premierNumber,
      second: secondNumber,
      operator: operator,
      result: calculate(premierNumber, secondNumber, operator)
    }
    setHistoriqueList(historiqueList.concat(element))
    setOperator(operator)

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
  
  const [historiqueList ,  ] = useContext(CalculatriceContext);
  const afficherItem = (item) => `${item.premier} ${item.operator} ${item.second} = ${item.result}` 
  
  return (
    <>
      <h1> Votre Historique </h1>
      {historiqueList.map(item => (<div key={item.id}>{afficherItem(item)} </div>))}
    </>
  )
}

const CalculatriceContext = createContext();

const CalculatricePage = () => {

  const [historiqueList, setHistoriqueList] = useState([])
    

  return (
    <CalculatriceContext.Provider value={[historiqueList, setHistoriqueList]}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
        <Calculatrice  />
        </Grid>
        <Grid item xs={6}>
        <Historique />
        </Grid>
      </Grid>
    </CalculatriceContext.Provider>
  );
};
export default function App() {
  return <CalculatricePage />;
}
