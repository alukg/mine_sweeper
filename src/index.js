import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'lodash/isEqual';

import InputBox from './components/InputBox';
import Board from './components/Board';

import './index.css';
import './css/startButton.css'
import './css/inputStyle.css'
import superman_icon from './images/Superman.png';

class Game extends React.Component {
    constructor() {
        super();
        this.data = [10,10,10]; //height,width,mines
    }

    handleChangeValue(evt,num) {
        if(evt.target.value<=300 && evt.target.value>=0) {
            const data = this.data.slice();
            data[num] = evt.target.value;
            this.data = data;
        }
    }

    renderInputBox(num,name) {
        return (
            <InputBox
                name={name} onChange={(evt) => this.handleChangeValue(evt,num)}
            />
        );
    }

    render() {
        return (
            <div className="game">
                <div className="headline">
                    <span id="headline">Mine Sweeper</span>
                    <div className="game-settings">
                        <div>
                            <button className='centerMe' onClick={() => {
                                if($(".centerMe").hasClass("done"))
                                    this.board.startNewGame(this.data);
                            }}>
                                <div className='text'>
                                    <span>New Game</span>
                                </div>
                                <div className='icon'>
                                    <i className="material-icons fa fa-start">replay</i>
                                    <i className="material-icons fa fa-question">error_outline</i>
                                    <i className="material-icons fa fa-check">done</i>
                                </div>
                            </button>
                        </div>
                        <div className="box">{this.renderInputBox(2,"Mines")}</div>
                        <div className="box">{this.renderInputBox(1,"Width")}</div>
                        <div className="box">{this.renderInputBox(0,"Height")}</div>
                        <input type="image" src={superman_icon} name="super-mode" className="super-mode off" onClick={() => { this.board.superMode(); }}/>
                    </div>
                </div>
                <Board ref={(input) => { this.board = input; }} data={this.data}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

let $startButton = $(".centerMe");

$startButton.click(function(){
    if($(this).hasClass("confirm")){
        $(this).addClass("done");
        $(".centerMe span").text("Starting");
        setTimeout(function(){
            $(".centerMe").removeClass("confirm").removeClass("done");
            $(".centerMe span").text("New Game");
        }, 1200);
    } else if(!$(this).hasClass("done")) {
        $(this).addClass("confirm");
        $(".centerMe span").text("Are you sure?");
    }
});

// Reset
$startButton.on('mouseout', function(){
    if($(this).hasClass("confirm")){
        setTimeout(function(){
            $(".centerMe").removeClass("confirm").removeClass("done");
            $(".centerMe span").text("New Game");
        }, 3000);
    }
});

$(".super-mode").click(function () {
    if($(this).hasClass("off"))
        $(this).removeClass("off").addClass("on");
    else
        $(this).removeClass("on").addClass("off");
});