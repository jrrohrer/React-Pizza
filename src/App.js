import React, { Component, Fragment } from 'react';
import Header from './components/Header'
import PizzaForm from './components/PizzaForm'
import PizzaList from './containers/PizzaList'

class App extends Component {
  state = {
    pizzas: [],
    selectedPizza: []
  }

  componentDidMount() {
    fetch('http://localhost:3000/pizzas')
      .then(response => response.json())
      .then(pizzas => this.setState({ pizzas: pizzas}))
  } 

  handleEditClick = (pizzaToEdit) => {
    this.setState({ selectedPizza: pizzaToEdit})
  }

  changeHandler = (event) => {
    this.setState({
      selectedPizza: {
        ...this.state.selectedPizza, 
        [event.target.name]: event.target.value
      }
    })
  }

  handleRadio = () => {
    this.setState({ 
      selectedPizza: {
        ...this.state.selectedPizza,
        vegetarian: !this.state.selectedPizza.vegetarian
      }
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      pizzas: this.state.pizzas.map(pizza => pizza.id === this.state.selectedPizza.id ? this.state.selectedPizza : pizza)
    })

    fetch(`http://localhost:3000/pizzas/${this.state.selectedPizza.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(this.state.selectedPizza)
    })
  }

  render() {
    return (
      <Fragment>
        <Header/>
        { Object.keys(this.state.selectedPizza).length > 0 ? (
          <PizzaForm 
            selectedPizza={this.state.selectedPizza} 
            handleRadio={this.handleRadio}
            changeHandler={this.changeHandler}
            handleSubmit={this.handleSubmit}
          />
        ) : null }
        <PizzaList pizzas={this.state.pizzas} handleEditClick={this.handleEditClick} />
      </Fragment>
    );
  }
}

export default App;
