/* eslint-disable radix */
import { LightningElement } from "lwc";

export default class Calculator extends LightningElement {
  numberOne = "";
  numberTwo = "";
  result = 0;

  changeHandler(event) {
    // let name = event.target.name;
    // let value = event.target.value;
    let { name, value } = event.target;
    if (name === "number1") {
      this.numberOne = value;
    } else if (name === "number2") {
      this.numberTwo = value;
    }
  }

  calculateInputs(event) {
    let label = event.target.label;
    if (label === "Add") {
      this.result = parseInt(this.numberOne) + parseInt(this.numberTwo);
    } else if (label === "Substract") {
      this.result = parseInt(this.numberOne) - parseInt(this.numberTwo);
    } else if (label === "Multiply") {
      this.result = parseInt(this.numberOne) * parseInt(this.numberTwo);
    } else if (label === "Divide") {
      this.result = parseInt(this.numberOne) / parseInt(this.numberTwo);
    }

    this.numberOne = "";

    this.numberTwo = "";
  }
}