import React from 'react';

import {isEqual} from "lodash";
import {Max_Mines, Max_Width_Height} from "../constants/constants";

class InputBox extends React.Component{
    constructor(props) {
        super();
        this.state = {
            val: 15,
            num: props.num
        };
    }

    render() {
        return (
            <span className="input input--isao">
                <input className="input__field input__field--isao inputBox" type="text" id="input-38" value={this.state.val} onChange={evt => {this.props.onChange(evt); this.handleChangeValue(evt);}}/>
                <label className="input__label input__label--isao" data-content={this.props.name}>
                    <span className="input__label-content input__label-content--isao">{this.props.name}</span>
                </label>
            </span>
        );
    }

    handleChangeValue(evt) {
        let value = evt.target.value;
        if(isEqual(this.state.num,2)){
            if(value <= Max_Mines && value >= 0) {
                this.setState({
                    val: value
                });
            }
        }else {
            if (value <= Max_Width_Height && value >= 0) {
                this.setState({
                    val: value
                });
            }
        }
    }
}

export default InputBox;