import React from 'react';
import {Mine,Flag,Open,Close,Empty} from '../constants/constants'

class Cell extends React.Component {
    render() {
        let square;
        if (this.props.super) {
            if (this.props.value === Mine) {
                if (this.props.state === Flag)
                    square = <div className="square square-flag square-super">
                        <button className="square square-button square-flag square-super" onClick={this.props.onClick}><i
                            className="material-icons">my_location</i></button>
                    </div>;
                else
                    square = <div className="square square-mine square-super">
                        <button className="square square-button square-mine square-super" onClick={this.props.onClick}><i
                            className="material-icons">my_location</i></button>
                    </div>;
            }
            else if (this.props.state === Open)
                square = <div className="square square-number">
                    <button className="square square-button square-number"
                            onClick={this.props.onClick}>{this.props.value}</button>
                </div>;
            else if (this.props.state === Flag)
                square = <div className="square square-flag square-super">
                    <button className="square square-button square-flag square-super"
                            onClick={this.props.onClick}>{this.props.value}</button>
                </div>;
            else
                square = <div className="square square-close square-super">
                    <button className="square square-button square-close square-super"
                            onClick={this.props.onClick}>{this.props.value}</button>
                </div>;
        }
        else {
            if (this.props.state === Close)
                square = <div className="square square-close">
                    <button className="square square-button square-close" onClick={this.props.onClick}></button>
                </div>;
            else if (this.props.state === Flag)
                square = <div className="square square-flag">
                    <button className="square square-button square-flag" onClick={this.props.onClick}><i
                        className="material-icons">flag</i></button>
                </div>;
            else {
                if (this.props.value === Mine)
                    if (this.props.winStatus)
                        square = <div className="square square-flag">
                            <button className="square square-button square-flag" onClick={this.props.onClick}><i
                                className="material-icons">my_location</i></button>
                        </div>;
                    else
                        square = <div className="square square-mine">
                            <button className="square square-button square-mine" onClick={this.props.onClick}><i
                                className="material-icons">my_location</i></button>
                        </div>;

                else
                    square = <div className="square square-number">
                        <button className="square square-button square-number"
                                onClick={this.props.onClick}>{this.props.value}</button>
                    </div>;
            }
        }
        return (square);
    }
}

export default Cell;