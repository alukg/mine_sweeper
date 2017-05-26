import React from 'react';
import $ from 'jquery';

import {isEqual} from "lodash";

import Timer from './Timer';
import Cell from './Cell';
import {Mine, Flag, Open, Close, Empty, Flags_Alert} from '../constants/constants'

import flag_icon from '../images/flag.png';
import stopwatch_icon from '../images/stopwatch.png';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            win: false,
            superMode: false,
            mines: 0,
            height: 0,
            width: 0,
            matrix: [],
            position: [],
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
        let mines = data[2];
        this.closeCells = height * width;

        let newMatrix = [];
        let position = [];
        for (let i = 0; i < height; i++) {
            newMatrix.push([]);
            position.push([]);
        }

        for (let i = 0; i < height; i++) // rows
            for (let j = 0; j < width; j++) { // columns
                newMatrix[i].push(Empty);
                position[i].push(Close);
            }


        let arr = Array.apply(null, {length: height * width}).map(Function.call, Number);
        arr.sort(function () {
            return 0.5 - Math.random()
        });
        for (let i = 0; i < mines; i++)
            newMatrix[Math.floor(arr[i] / width)][arr[i] % width] = Mine;

        let count;
        for (let i = 0; i < height; i++) { // rows
            for (let j = 0; j < width; j++) { // columns
                count = 0;
                if (newMatrix[i][j] !== Mine) {
                    for (let row = i - 1; row <= i + 1; row++)
                        for (let col = j - 1; col <= j + 1; col++)
                            if ((row !== i || col !== j) && row < height && col < width && row >= 0 && col >= 0 && newMatrix[row][col] === Mine)
                                count++;
                    if (count !== 0)
                        newMatrix[i][j] = count;
                }
            }
        }
        $(function () {
            if ($(".super-mode").hasClass("on"))
                $(".super-mode").removeClass("on").addClass("off");
        });
        this.setState({
            win: false,
            superMode: false,
            mines: mines,
            flags: 0,
            height: height,
            width: width,
            matrix: newMatrix,
            position: position
        });
        this.timer.stopTimer();
        this.timer.startTimer();
    }

    handleClick(e,row,column) {
        if (this.state.position[row][column] !== Open) {
            if (e.shiftKey) {
                const states = this.state.position.slice();
                let flags = this.state.flags;
                if (this.state.position[row][column] === Flag) {
                    states[row][column] = Close;
                    flags--;
                }
                else {
                    if(isEqual(flags,this.state.mines)) {
                        alert(Flags_Alert);
                    }
                    else {
                        flags++;
                        states[row][column] = Flag;
                    }
                }
                if(!this.checkIfWin(states,flags)) {
                    this.setState({
                        position: states,
                        flags: flags
                    });
                }
            }
            else {
                if (this.state.position[row][column] === Close) { // if the cell is closed
                    const position = this.state.position.slice();
                    if (this.state.matrix[row][column] === Mine) { // if a mine cell clicked
                        for (let i = 0; i < this.state.height; i++) // rows
                            for (let j = 0; j < this.state.width; j++) // columns
                                position[i][j] = Open;
                        $(function(){
                            if($(".super-mode").hasClass("on"))
                                $(".super-mode").removeClass("on").addClass("off");
                        });
                        this.timer.stopTimer();
                        this.setState({
                            position: position,
                            superMode: false
                        });
                    }
                    else { // if non mine cell clicked
                        this.openCells(position, row, column);
                        if(!this.checkIfWin(position,this.state.flags)) {
                            this.setState({
                                position: position,
                            });
                        }
                    }
                }
            }
        }
    }

    /* check if won the game:
     * if we have flags just and on all the mines and all other cells is open */
    checkIfWin(position, flags){
        if (isEqual(this.state.mines,this.closeCells) && isEqual(flags,this.state.mines)) {
            for (let i = 0; i < this.state.height; i++) // rows
                for (let j = 0; j < this.state.width; j++) // columns
                    position[i][j] = Open; // open all the cells
            $(function(){ // turn off the super mode
                if($(".super-mode").hasClass("on"))
                    $(".super-mode").removeClass("on").addClass("off");
            });
            this.timer.stopTimer();
            this.setState({
                superMode: false, // turn off the super mode
                position: position,
                flags: flags,
                win: true
            });
            return true;
        }
        return false;
    }

    /* BFS scan of the matrix to open all the linked cells */
    openCells(arr,row,column) {
        if (this.state.matrix[row][column] === Empty){
            let height = this.state.height;
            let width = this.state.width;
            let visited = [];
            for (let i=0;i<this.state.height;i++){
                visited.push([]);
            }
            for(let i=0;i<this.state.height;i++) // rows
                for(let j=0;j<this.state.width;j++) // columns
                    visited[i].push(false);

            // create a queue for BFS
            let queue = [];

            // open that cell
            arr[row][column] = Open;
            this.closeCells--;

            // mark the current cell as visited and enqueue it
            visited[row][column] = true;
            queue.push([row,column]);

            while(queue.length !== 0)
            {
                // dequeue a cell from queue
                let s = queue.shift();

                // check all the linked cell around the cell if they open
                for(let i=s[0]-1;i<=s[0]+1;i++) {
                    for(let j=s[1]-1;j<=s[1]+1;j++) {
                        if (i >= 0 && i < height && j >= 0 && j < width) { // if that coordinate is in the matrix
                            if (!visited[i][j]) { // If not visited yet
                                visited[i][j] = true;
                                if (arr[i][j] === Close && this.state.matrix[i][j] !== Mine) { // check if is a number or either empty cell
                                    arr[i][j] = Open;
                                    this.closeCells--;
                                    if (this.state.matrix[i][j] === Empty) // if empty push to queue to check his linked cells
                                        queue.push([i, j]);
                                }
                            }
                        }
                    }
                }
            }
        }
        else{ // if it's a number cell
            arr[row][column] = Open;
            this.closeCells--;
        }
    }

    renderCell(row, column) {
        return (
            <Cell
                winStatus={this.state.win}
                super={this.state.superMode}
                position={this.state.position[row][column]}
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
                    <td key={j}> {this.renderCell(i,j)} </td>
                );
            },this);
            return (
                <tr className="board-row" key={i}> {entry} </tr>
            );
        },this);

        return (
            <div className="game-board">
                <div className="game-info">
                    <span><img className="info-icon" src={stopwatch_icon}/>  </span><Timer ref={(input) => { this.timer = input; }}/>
                    <span><img className="info-icon" src={flag_icon}/>  {this.state.flags} / {this.state.mines}</span>
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

export default Board;