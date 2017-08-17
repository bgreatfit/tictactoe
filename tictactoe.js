{
//build a tic tac toe board
    const ai = {
        memory: new Map(),
        play(board) {
            const moves = board.squares.filter(square => square.state === game.states.EMPTY);
            moves[Math.floor(Math.random()*moves.length)].computerClick();
        }
    }
    const game = {
        boards: [],
        states: {
            EMPTY: 2,
            O: 0,
            X: 1
        },
        containerDefaults: {
            width: '100%',
            height: '100%',
            minHeight: '100%',
            margin: 0,
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignContent: 'space-around',
            alignItems: 'center'
        },
        init() {
            document.body.parentNode.style.height = '100%';
            Object.assign(document.body.style, this.containerDefaults);
            this.boards.push(this.createBoard());
        },
        createBoard(container) {

            let view = document.createElement('canvas');
            Object.assign(view.style, {
                width: '300px',
                height: '300px',
                display: 'flex'
            });
            view.setAttribute('width', '300');
            view.setAttribute('height', '300');
            container ? container.appendChild(view) : document.body.appendChild(view);

            let board = {
                game: null,
                ctx: null,
                locked: false,
                squares: [],
                player: this.states.X,
                reset() {
                    this.ctx = this.view.getContext('2d');
                    this.ctx.fillStyle = '#000';
                    this.ctx.fillRect(0, 0, 300, 300);
                    this.squares.map(square => {
                        const board = square.board;
                        const hover = square.hover;
                        const locked = square.locked;
                        const x = square.left;
                        const y = square.top;
                        const ctx = board.ctx;

                        let shrink = hover && !locked ? 2 : 0;
                        ctx.fillStyle = `rgba(255, ${hover && !locked ? 168 : 255}, 255, .15)`;
                        ctx.fillRect(x + shrink, y + shrink, 96 - (shrink * 2), 96 - (shrink * 2));
                        if(hover || locked) {
                            ctx.strokeStyle = `rgba(255, ${hover ? 255 : 168}, 255, ${locked ? 1 : .75})`;
                            ctx.lineWidth = 5;
                            ctx.beginPath();
                            if(square.state === board.game.states.O) {
                                ctx.arc(y + 48, x + 48, 36, 0, 2 * Math.PI);
                            } else {
                                ctx.moveTo(x + 14, y + 14);
                                ctx.lineTo(x + 82, y + 82);
                                ctx.moveTo(x + 14, y + 82);
                                ctx.lineTo(x + 82, y + 14);
                            }
                            board.ctx.stroke();
                        }
                    });
                    if(this.locked) {
                        this.ctx.fillStyle = 'rgba(255, 255, 255, .4)';
                        this.ctx.fillRect(0, 0, 300, 300);
                    }
                },
                init() {
                    this.squares = Array.from(Array(9), function (x, n) {
                        let square = {
                            index: n,
                            state: this.game.states.EMPTY,
                            top: (Math.floor(n / 3) * 100) + 2,
                            left: (Math.floor(n % 3) * 100) + 2,
                            hover: false,
                            locked: false,
                            click() {
                                if(!this.locked) {
                                    this.locked = true;
                                    this.state = this.board.player.state;
                                    ai.play(this.board);
                                    this.board.locked = true;
                                    let div = document.createElement('div');
                                    Object.assign(div.style, this.board.game.containerDefaults);
                                    div.style.height = 'auto';
                                    div.style.minHeight = 'auto';
                                    document.body.appendChild(div);
                                    //for(let i = 0; i < 2; i++){
                                        const newBoard = this.board.game.createBoard(div);
                                        newBoard.squares = this.board.squares.map(square => {
                                            let newSqaure = Object.assign({}, square);
                                            newSqaure.board = newBoard;
                                            return newSqaure;
                                        });
                                        this.board.game.boards.push(newBoard);
                                    //}
                                }
                                this.board.reset();
                            },
                            off() {
                                this.hover = false;
                            },
                            on()  {
                                this.hover = true;
                            },
                            computerClick() {
                                this.locked = true;
                                this.state = this.board.player.state || game.states.O;
                                this.board.reset();
                            }
                        };
                        square.board = this;
                        return square;
                    }.bind(this));
                    this.reset();
                }
            };
            Object.defineProperty(board, 'view', {
                value: view,
                writable: false
            });
            board.game = this;
            view.addEventListener('click', function (e) {
                if(!board.locked){
                    const col = Math.floor((e.pageX - this.view.offsetLeft) / 100);
                    const row = Math.floor((e.pageY - this.view.offsetTop) / 100);
                    this.squares[col + (row * 3)].click();
                }
            }.bind(board));
            view.addEventListener('mousemove', function (e) {
                if(!board.locked) {
                    e.stopPropagation();
                    const col = Math.floor((e.pageX - this.view.offsetLeft) / 100);
                    const row = Math.floor((e.pageY - this.view.offsetTop) / 100);
                    this.squares.map(square => square.off());
                    this.squares[col + (row * 3)].on();
                    this.reset();
                }
            }.bind(board));
            document.body.addEventListener('mousemove', function (e) {
                this.squares.map(square => square.off());
                this.reset();
            }.bind(board));
            board.init();

            return board;
        }
    };

    //rules
    //legal moves
    //turn control
    //alternating players
    //end game

    //board state

//build a genetic ai

    //make two choices
    //two highest value choices
    //add randomness
    //state snapshots
    //remember state values
    //recall state values

//build ai interfact for board

    //read state
    //make move

    game.init();
}