import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
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

  const [premierNumber, setPremierNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
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
  return (
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
        error={error ? "error" : ""}
        identifiant="secondNumber"
        title="Second Number"
        value={secondNumber}
        onChange={(event) => handleSaisieNumber(event, setSecondNumber)}
      />
      <br/>
      <MyButton titre='+' onClick={() => setOperator('+')} />
      <MyButton titre='-' onClick={() => setOperator('-')}/>
      <MyButton titre='*' onClick={() => setOperator('*')}/>
      <MyButton titre='/' onClick={() => setOperator('/')}/>
      <p>
        Result: {calculate(premierNumber, secondNumber, operator)}
      </p>
    </form>
  );
};

const CalculatricePage = () => {
  return (
    <>
      <h1> Bonjour Calculatrice </h1>
      <Calculatrice />
    </>
  );
};
export default function App() {
  return <CalculatricePage />;
}

