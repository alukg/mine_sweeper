import React from 'react';

class InputBox extends React.Component{
    constructor() {
        super();
        this.state = {
            val: 10
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
        if(value<=300 && value>=0) {
            this.setState({
                val: value
            });
        }
    }
}

export default InputBox;