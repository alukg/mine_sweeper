import React from 'react';
import $ from 'jquery';

import Timer from './Timer';
import Cell from './Cell';
import {Mine,Flag,Open,Close,Empty} from '../constants/constants'

import flag_icon from '../images/flag.png';
import stopwatch_icon from '../images/stopwatch.png';

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
                newMatrix[i].push(Empty);

        let states = [];
        for (let i=0;i<height;i++){
            states.push([]);
        }
        for(let i=0;i<height;i++) // rows
            for(let j=0;j<width;j++) // columns
                states[i].push(Close);

        let arr = Array.apply(null, {length: height*width}).map(Function.call, Number);
        arr.sort( function() { return 0.5 - Math.random() } );
        for(let i=0;i<data[2];i++) {
            newMatrix[Math.floor(arr[i] / width)][arr[i] % width] = Mine;
        }

        let count;
        for(let i=0;i<height;i++) { // rows
            for(let j=0;j<width;j++) { // columns
                count = 0;
                if (newMatrix[i][j] !== Mine) {
                    if (i+1 < height && newMatrix[i+1][j] === Mine)
                        count++;
                    if (i-1 >= 0 && newMatrix[i-1][j] === Mine)
                        count++;
                    if (j+1 < width && newMatrix[i][j+1] === Mine)
                        count++;
                    if (j-1 >= 0 && newMatrix[i][j-1] === Mine)
                        count++;
                    if (i+1 < height && j+1 < width && newMatrix[i+1][j+1] === Mine)
                        count++;
                    if (i+1 < height && j-1 >=0 && newMatrix[i+1][j-1] === Mine)
                        count++;
                    if (i-1 >= 0 && j+1 < width && newMatrix[i-1][j+1] === Mine)
                        count++;
                    if (i-1 >= 0 && j-1 >=0 && newMatrix[i-1][j-1] === Mine)
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
        if (this.state.states[row][column] === Close || this.state.states[row][column] === Flag) {
            if (e.shiftKey) {
                const states = this.state.states.slice();
                let flags = this.state.flags;
                if (this.state.states[row][column] === Flag) {
                    states[row][column] = Close;
                    flags--;
                }
                else {
                    states[row][column] = Flag;
                    if(flags == this.state.mines) {
                        alert("You have reached the maximum number of flags.");
                        return;
                    }
                    flags++;
                    if (this.state.mines == this.closeCells && flags == this.state.mines) {
                        for (let i = 0; i < this.state.height; i++) // rows
                            for (let j = 0; j < this.state.width; j++) // columns
                                states[i][j] = Open;
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
                if (this.state.states[row][column] === Close) { // if the cell is closed
                    const states = this.state.states.slice();
                    if (this.state.matrix[row][column] === Mine) { // if push on mine cell
                        for (let i = 0; i < this.state.height; i++) // rows
                            for (let j = 0; j < this.state.width; j++) // columns
                                states[i][j] = Open;
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
                                    states[i][j] = Open;
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

            // Create a queue for BFS
            let queue = [];

            // Mark the current node as visited and enqueue it
            arr[row][column] = Open;
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
                                if (arr[i][j] === Close && this.state.matrix[i][j] !== Mine) {
                                    arr[i][j] = Open;
                                    this.closeCells--;
                                    if (this.state.matrix[i][j] === Empty)
                                        queue.push([i, j]);
                                }
                            }
                        }
                    }
                }
            }
        }
        else{
            arr[row][column] = Open;
            this.closeCells--;
        }
    }

    renderCell(row, column) {
        return (
            <Cell
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

export default Board;