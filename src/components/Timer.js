import React from 'react';

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

export default Timer;