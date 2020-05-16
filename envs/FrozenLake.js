module.exports = class FrozenLake {

    constructor(element) {
        document.title = 'Frozen Lake'
        this.environment = element
        this.canRender = false
        this.startingState = 0
        this.state = 0
        this.slideChance = 0.2
        this.actionSpace = {
            number: 4,
            sample: this.sample
        }
        this.observationSpace = {
            number: 16
        }
        this.rendered = false
        this.actionsName = ['left', 'right', 'up', 'down']
        this.actionsFunctions = this.createActionsTransitions()
        this.states = this.create()

    }
    render(floor, done, action, slipped, episode) {
        if (!this.rendered) {
            const matrix = this.states
                .map(vertical => `<line>${vertical
                    .map(horizontal => `<cell>${horizontal}</cell>`).join('')}</line>`).join('')
            this.container = document.createElement('container')
            this.info = document.createElement('info')
            this.container.innerHTML = matrix
            this.environment.append(this.container, this.info)
            this.rendered = true
        }
        const { vertical, horizontal } = this.getMatrixFromState()
        const selected = this.environment.querySelector('.selected')
        if (selected)
            selected.classList.remove('selected')
        this.container.children[vertical].children[horizontal].classList.add('selected')
        if (done) {
            this.info.innerHTML = `The episode ended!\n${floor == 'H' ? `<span class="red">Agent fell on a hole</span>` :
                '<span class="green">Agent won the game</span>'}`
        } else {
            this.info.innerHTML = `Episode ${episode}:
             ${slipped !== false ? `Agent wanted to go <span class="green">${this.actionsName[action]}</span> but got <span class="red">${this.actionsName[slipped]}</span>`
                    : `Agent took ${this.actionsName[action]}`
                } `
        }
    }
    reset() {
        this.state = this.startingState
        if (this.canRender) {
            const { vertical, horizontal } = this.getMatrixFromState()
            const selected = this.environment.querySelector('.selected')
            if (selected)
                selected.classList.remove('selected')
            if (this.container) {
                this.container.children[vertical].children[horizontal].classList.add('selected')
                this.info.innerHTML = `Game started`
            }
        }
        return this.state
    }
    create() {
        return [
            ['S', 'F', 'F', 'F'],
            ['F', 'H', 'F', 'H'],
            ['F', 'F', 'F', 'H'],
            ['H', 'F', 'F', 'G']
        ]
    }
    getMatrixFromState() {
        return {
            vertical: Math.floor(this.state / 4),
            horizontal: this.state % 4
        }
    }
    setStateFromMatrix(matrixIndexes) {
        const { vertical, horizontal } = matrixIndexes
        this.state = (vertical * 4) + horizontal

    }
    createActionsTransitions() {
        //Actions
        const left = () => {
            let { vertical, horizontal } = this.getMatrixFromState()
            if ((horizontal - 1) > 0)
                horizontal--
            this.setStateFromMatrix({ vertical, horizontal })
        }
        const right = () => {
            let { vertical, horizontal } = this.getMatrixFromState()
            if ((horizontal + 1) < 4)
                horizontal++
            this.setStateFromMatrix({ vertical, horizontal })
        }
        const up = () => {
            let { vertical, horizontal } = this.getMatrixFromState()
            if ((vertical - 1) > 0)
                vertical--
            this.setStateFromMatrix({ vertical, horizontal })
        }
        const down = () => {
            let { vertical, horizontal } = this.getMatrixFromState()
            if ((vertical + 1) < 4)
                vertical++
            this.setStateFromMatrix({ vertical, horizontal })
        }
        return [left, right, up, down]
    }
    step(action, episode) {
        let slipped = false
        //Chance for the agent to go the wrong way in case of sliding
        if (Math.random() > this.slideChance)
            this.actionsFunctions[action]()
        else {
            slipped = Math.floor(Math.random() * 3)
            // while (slipped == action)
            //     slipped = Math.floor(Math.random() * 3)
            this.actionsFunctions[slipped]()//Slide
        }

        let reward = 0
        let done = false
        const { vertical, horizontal } = this.getMatrixFromState()
        const floor = this.states[vertical][horizontal]
        if (floor == 'G') {
            done = true
            reward = 1
        }
        else if (floor == 'H')
            done = true
        if (this.canRender)
            this.render(floor, done, action, slipped, episode)
        return [this.state, reward, done]

    }
    sample() {
        return Math.floor(Math.random() * Math.floor(this.number))
    }

}
// SFFF       (S: starting point, safe)
// FHFH       (F: frozen surface, safe)
// FFFH       (H: hole, fall to your doom)
// HFFG       (G: goal, where the frisbee is located)

