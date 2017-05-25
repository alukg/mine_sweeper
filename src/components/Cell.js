import React from 'react';
import {Mine,Flag,Open,Close} from '../constants/constants'

import {isEqual} from "lodash";

import flag_icon from '../images/flag.png';
import sea_mine from '../images/sea_mine.png';

class Cell extends React.Component {
    render() {
        let divClassName = "square";
        let value;
        if (this.props.super) { // if i'm on super mode
            if (isEqual(this.props.value,Mine)) {
                value = <img className="info-cell-icon" src={sea_mine}/>;
                if (isEqual(this.props.position,Flag))
                    divClassName += " square-flag";
                else
                    divClassName += " square-mine";
                divClassName += " square-super";
            }
            else {
                value = this.props.value;
                if (isEqual(this.props.position, Open))
                    divClassName += " square-number";
                else if (isEqual(this.props.position, Flag))
                    divClassName += " square-flag square-super";
                else
                    divClassName += " square-close square-super";
            }
        }
        else {
            if (isEqual(this.props.position,Close))
                divClassName += " square-close";
            else if (isEqual(this.props.position,Flag)) {
                divClassName += " square-flag";
                value = <img className="info-cell-icon" src={flag_icon}/>;
            }
            else {
                if (isEqual(this.props.value,Mine)) {
                    value = <img className="info-cell-icon" src={sea_mine}/>;
                    if (this.props.winStatus)
                        divClassName += " square-flag";
                    else
                        divClassName += " square-mine";
                }
                else {
                    value = this.props.value;
                    divClassName += " square-number";
                }

            }
        }

        let buttonClassName = divClassName + " square-button";
        let square = <div className={divClassName}>
                        <button className={buttonClassName}
                        onClick={this.props.onClick}>{value}</button>
                    </div>;

        return (square);
    }
}

export default Cell;