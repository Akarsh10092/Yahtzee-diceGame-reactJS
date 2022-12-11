import React, { Component } from "react";
import "./Die.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix
} from "@fortawesome/free-solid-svg-icons";

class Die extends Component {
  static defaultProps = {
    numberWords:[faDiceOne,faDiceTwo,faDiceThree,faDiceFour,faDiceFive,faDiceSix],
    val:5
  }
  constructor(props){
    super(props);
this.handleClick=this.handleClick.bind(this);
  }
  handleClick(){
    this.props.handleClick(this.props.idx);
  }
 
  render() {
   let classes = "Die ";
   if(this.props.locked) classes +="Die-locked";
   if(this.props.rolling) classes+="Die-rolling";

    return (      
      <FontAwesomeIcon
      icon={this.props.numberWords[this.props.val-1]}
       className={classes}
        onClick={this.handleClick}
        size={"5x"}
        >
          </FontAwesomeIcon>
    );
  }
}

export default Die;
