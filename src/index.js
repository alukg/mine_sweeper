import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './index.css';
import './startButton.css'
import './inputStyle.css'
import './classie.js'
import superman_icon from './icons/Superman.png';
import flag_icon from './icons/flag.png';
import stopwatch_icon from './icons/stopwatch.png';

function Square(props) {
    let square;
    if(props.super){
        if (props.value === "m") {
            if(props.state === "f")
                square = <div className="square square-flag square-super">
                    <button className="square square-button square-flag square-super" onClick={props.onClick}><i
                        className="material-icons">my_location</i></button>
                </div>;
            else
                square = <div className="square square-mine square-super">
                    <button className="square square-button square-mine square-super" onClick={props.onClick}><i
                        className="material-icons">my_location</i></button>
                </div>;
        }
        else if (props.state === "o")
            square = <div className="square square-number">
                <button className="square square-button square-number"
                        onClick={props.onClick}>{props.value}</button>
            </div>;
        else if (props.state === "f")
            square = <div className="square square-flag square-super">
                <button className="square square-button square-flag square-super" onClick={props.onClick}>{props.value}</button>
            </div>;
        else
            square = <div className="square square-close square-super">
                <button className="square square-button square-close square-super" onClick={props.onClick}>{props.value}</button>
            </div>;
    }
    else {
        if (props.state === "c")
            square = <div className="square square-close">
                <button className="square square-button square-close" onClick={props.onClick}></button>
            </div>;
        else if (props.state === "f")
            square = <div className="square square-flag">
                <button className="square square-button square-flag" onClick={props.onClick}><i
                    className="material-icons">flag</i></button>
            </div>;
        else {
            if (props.value === "m")
                if(props.winStatus)
                    square = <div className="square square-flag">
                        <button className="square square-button square-flag" onClick={props.onClick}><i
                            className="material-icons">my_location</i></button>
                    </div>;
                else
                    square = <div className="square square-mine">
                        <button className="square square-button square-mine" onClick={props.onClick}><i
                            className="material-icons">my_location</i></button>
                    </div>;

            else
                square = <div className="square square-number">
                    <button className="square square-button square-number"
                            onClick={props.onClick}>{props.value}</button>
                </div>;
        }
    }
    return (square);
}

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            win: false,
            superMode: false,
            mines: 0,
            height: 0,
            width: 0,
            matrix: [],
            states: [],
            flags: null
        };
    }

    componentDidMount(){
        this.startNewGame(this.props.data);
        $(".game-info").insertAfter( $( "#headline" ) );
    }

    componentDidUpdate(){
        $(".game-info").insertAfter( $( "#headline" ) );
    }

    startNewGame(data){
        let height = data[0];
        let width = data[1];
        this.closeCells = height*width;
        let newMatrix = [];
        for (let i=0;i<height;i++){
            newMatrix.push([]);
        }
        for(let i=0;i<height;i++) // rows
            for(let j=0;j<width;j++) // columns
                newMatrix[i].push(" ");

        let states = [];
        for (let i=0;i<height;i++){
            states.push([]);
        }
        for(let i=0;i<height;i++) // rows
            for(let j=0;j<width;j++) // columns
                states[i].push("c");

        let arr = Array.apply(null, {length: height*width}).map(Function.call, Number);
        arr.sort( function() { return 0.5 - Math.random() } );
        for(let i=0;i<data[2];i++) {
            newMatrix[Math.floor(arr[i] / width)][arr[i] % width] = "m";
        }

        let count;
        for(let i=0;i<height;i++) { // rows
            for(let j=0;j<width;j++) { // columns
                count = 0;
                if (newMatrix[i][j] !== "m") {
                    if (i+1 < height && newMatrix[i+1][j] === "m")
                        count++;
                    if (i-1 >= 0 && newMatrix[i-1][j] === "m")
                        count++;
                    if (j+1 < width && newMatrix[i][j+1] === "m")
                        count++;
                    if (j-1 >= 0 && newMatrix[i][j-1] === "m")
                        count++;
                    if (i+1 < height && j+1 < width && newMatrix[i+1][j+1] === "m")
                        count++;
                    if (i+1 < height && j-1 >=0 && newMatrix[i+1][j-1] === "m")
                        count++;
                    if (i-1 >= 0 && j+1 < width && newMatrix[i-1][j+1] === "m")
                        count++;
                    if (i-1 >= 0 && j-1 >=0 && newMatrix[i-1][j-1] === "m")
                        count++;
                    if(count !== 0)
                        newMatrix[i][j] = count;
                }
            }
        }
        $(function(){
            if($(".super-mode").hasClass("on"))
                $(".super-mode").removeClass("on").addClass("off");
        });
        this.setState({
            win: false,
            superMode: false,
            mines: data[2],
            flags: 0,
            height: height,
            width: width,
            matrix: newMatrix,
            states: states
        });
        this.timer.stopTimer();
        this.timer.startTimer();
    }

    handleClick(e,row,column) {
        if (this.state.states[row][column] === "c" || this.state.states[row][column] === "f") {
            if (e.shiftKey) {
                const states = this.state.states.slice();
                let flags = this.state.flags;
                if (this.state.states[row][column] === "f") {
                    states[row][column] = "c";
                    flags--;
                }
                else {
                    states[row][column] = "f";
                    flags++;
                    if (this.state.mines == this.closeCells && flags == this.state.mines) {
                        for (let i = 0; i < this.state.height; i++) // rows
                            for (let j = 0; j < this.state.width; j++) // columns
                                states[i][j] = "o";
                        $(function(){
                            if($(".super-mode").hasClass("on"))
                                $(".super-mode").removeClass("on").addClass("off");
                        });
                        this.timer.stopTimer();
                        this.setState({
                            superMode: false,
                            states: states,
                            flags: flags,
                            win: true
                        });
                        return;
                    }
                }
                this.setState({
                    states: states,
                    flags: flags
                });
            }
            else {
                if (this.state.states[row][column] === "c") { // if the cell is closed
                    const states = this.state.states.slice();
                    if (this.state.matrix[row][column] === "m") { // if push on mine cell
                        for (let i = 0; i < this.state.height; i++) // rows
                            for (let j = 0; j < this.state.width; j++) // columns
                                states[i][j] = "o";
                        $(function(){
                            if($(".super-mode").hasClass("on"))
                                $(".super-mode").removeClass("on").addClass("off");
                        });
                        this.timer.stopTimer();
                        this.setState({
                            states: states,
                            superMode: false
                        });
                    }
                    else { // if push on non mine cell
                        this.openCells(states, row, column);
                        if (this.state.mines == this.closeCells && this.state.flags == this.state.mines) {
                            for (let i = 0; i < this.state.height; i++) // rows
                                for (let j = 0; j < this.state.width; j++) // columns
                                    states[i][j] = "o";
                            $(function(){
                                if($(".super-mode").hasClass("on"))
                                    $(".super-mode").removeClass("on").addClass("off");
                            });
                            this.timer.stopTimer();
                            this.setState({
                                superMode: false,
                                states: states,
                                win: true
                            });
                            return;
                        }
                        this.setState({
                            states: states,
                        });
                    }
                }
            }
        }
    }

    openCells(arr,row,column) {
        if (this.state.matrix[row][column] === " "){
            let height = this.state.height;
            let width = this.state.width;
            let visited = [];
            for (let i=0;i<this.state.height;i++){
                visited.push([]);
            }
            for(let i=0;i<this.state.height;i++) // rows
                for(let j=0;j<this.state.width;j++) // columns
                    visited[i].push(false);

            // Create a queue for BFS
            let queue = [];

            // Mark the current node as visited and enqueue it
            arr[row][column] = "o";
            this.closeCells--;
            visited[row][column] = true;
            queue.push([row,column]);

            while(queue.length !== 0)
            {
                // Dequeue a vertex from queue and print it
                let s = queue.shift();

                // Get all adjacent vertices of the dequeued vertex s
                // If a adjacent has not been visited, then mark it visited
                // and enqueue it

                for(let i=s[0]-1;i<=s[0]+1;i++) {
                    for(let j=s[1]-1;j<=s[1]+1;j++) {
                        if (i >= 0 && i < height && j >= 0 && j < width) {
                            if (!visited[i][j]) {
                                visited[i][j] = true;
                                if (arr[i][j] === "c" && this.state.matrix[i][j] !== "m") {
                                    arr[i][j] = "o";
                                    this.closeCells--;
                                    if (this.state.matrix[i][j] === " ")
                                        queue.push([i, j]);
                                }
                            }
                        }
                    }
                }
            }
        }
        else{
            arr[row][column] = "o";
            this.closeCells--;
        }
    }

    renderSquare(row,column) {
        return (
            <Square
                winStatus={this.state.win}
                super={this.state.superMode}
                state={this.state.states[row][column]}
                value={this.state.matrix[row][column]}
                onClick={(e) => this.handleClick(e,row,column)}
            />
        );
    }

    superMode(){
        let superMode = !this.state.superMode;
        this.setState({
            superMode: superMode,
        });
    }

    render() {
        let rows = this.state.matrix.map(function (item, i){
            let entry = item.map(function (element, j) {
                return (
                    <td key={j}> {this.renderSquare(i,j)} </td>
                );
            },this);
            return (
                <tr className="board-row" key={i}> {entry} </tr>
            );
        },this);

        return (
            <div className="game-board">
                <div className="game-info">
                    <span><img className="info-icon" src={stopwatch_icon}></img>  </span><Timer ref={(input) => { this.timer = input; }}/>
                    <span><img className="info-icon" src={flag_icon}></img>  {this.state.flags} / {this.state.mines}</span>
                </div>
                <table className="matrix">
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

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

class Timer extends React.Component {
    constructor() {
        super();
        this.state = {
            secondsElapsed: 0,
            minutesElapsed: 0,
        };
        this.tick = this.tick.bind(this);
    }

    tick() {
        if (this.state.secondsElapsed === 59) {
            this.setState({minutesElapsed: this.state.minutesElapsed + 1});
            this.setState({secondsElapsed: 0});
        }
        else
            this.setState({secondsElapsed: this.state.secondsElapsed + 1});
    }
    startTimer() {
        this.setState({secondsElapsed: 0});
        this.setState({minutesElapsed: 0});
        this.interval = setInterval(this.tick, 1000);
    }
    stopTimer() {
        clearInterval(this.interval);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <span id="timer">{this.state.minutesElapsed}:{("00"+this.state.secondsElapsed).substr(-2)}</span>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

$(".centerMe").click(function(){
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
$(".centerMe").on('mouseout', function(){
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