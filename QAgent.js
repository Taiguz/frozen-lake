module.exports = class QAgent {

    constructor(environment) {
        this.environment = environment
        this.numberEpisodes = 10000
        this.maximumStepsPerEpisode = 100

        //learning rate Alfa and discount rate Upsilon
        this.learningRate = 0.1
        this.discountRate = 0.99

        //Exploration x Exploitation
        this.explorationRate = 1
        this.maxExplorationRate = 1
        this.minExplorationRate = 0.01
        this.explorationDecayRate = 0.001
        this.rewardsFromAllEpisodes = []
        this.createQTable()
    }
    createQTable() {
        //Constructing Q-Table
        const actionSpaceSize = this.environment.actionSpace.number
        const stateSpaceSize = this.environment.observationSpace.number
        this.qTable = new Array(stateSpaceSize).fill(0).map(element => new Array(actionSpaceSize).fill(0))
        console.log('\nQ-Table:\n')
        console.dir(this.qTable, { depth: 5 })
    }
    train() {
        for (let episode = 0; episode < this.numberEpisodes; episode++) {
            let state = 0
            state = this.environment.reset()
            let rewardsCurrentEpisode = 0

            for (let step = 0; step < this.maximumStepsPerEpisode; step++) {
                let action
                if (Math.random() > this.explorationRate) {//Exploit
                    //Exploit the environment choosing the
                    //action with the highest q-value on q-table for the current state
                    action = this.qTable[state].indexOf(Math.max(...this.qTable[state]))
                }
                else {//Explore
                    //Explore the environment sampleing an action randomly
                    action = this.environment.actionSpace.sample()
                }
                const [newState, reward, done] = this.environment.step(action)

                //Updating the q-table
                this.qTable[state][action] = this.qTable[state][action] *
                    (1 - this.learningRate) + this.learningRate * (reward + this.discountRate * Math.max(...this.qTable[newState]))
                state = newState
                rewardsCurrentEpisode += reward

                //If the environment says the episode ended stop the steps 
                if (done)
                    break
            }

            //Exploration rate decay
            this.explorationRate = this.minExplorationRate +
                (this.maxExplorationRate - this.minExplorationRate) * Math.exp(-this.explorationDecayRate * episode)

            //Adding reward 
            this.rewardsFromAllEpisodes.push(rewardsCurrentEpisode)
        }
        this.calculateTrainAverages()
    }
    calculateTrainAverages() {
        //Calculating the reward average per thousand episode 
        let thousandAverages = []
        let sum
        for (let rewardThousandIndex = 0; rewardThousandIndex < this.rewardsFromAllEpisodes.length; rewardThousandIndex += 1000) {
            sum = 0
            for (let rewardIndex = rewardThousandIndex; rewardIndex < rewardThousandIndex + 1000; rewardIndex++) {
                sum += this.rewardsFromAllEpisodes[rewardIndex]
            }
            thousandAverages.push(sum / 1000)
        }
        console.log('\nAverage rewards per thousand episodes:\n')
        console.log(thousandAverages.map((average, index) => `${index * 1000}: ${average}`).join('\n'))

        //Printing update q-table
        console.log('\nUpdated Q-Table:\n')
        console.dir(this.qTable, { depth: 5 })
    }
    async play(timeIntervalBetweenActions = 500, maxEpisodes = 100, maxSteps = 100, fullExploit = true) {
        this.environment.canRender = true
        for (let episode = 0; episode < maxEpisodes; episode++) {
            console.log(`Episode ${episode}`)
            let state = 0
            state = this.environment.reset()
            await new Promise(resolve => {
                setTimeout(resolve, timeIntervalBetweenActions)
            })
            let rewardsCurrentEpisode = 0

            for (let step = 0; step < maxSteps; step++) {
                let action
                if (fullExploit) {
                    action = this.qTable[state].indexOf(Math.max(...this.qTable[state]))
                } else {
                    if (Math.random() > this.explorationRate) {//Exploit
                        //Exploit the environment choosing the
                        //action with the highest q-value on q-table for the current state
                        action = this.qTable[state].indexOf(Math.max(...this.qTable[state]))
                    }
                    else {//Explore
                        //Explore the environment sampleing an action randomly
                        action = this.environment.actionSpace.sample()
                    }
                }
                const [newState, reward, done] = this.environment.step(action, episode)
                await new Promise(resolve => {
                    const inteval = done ? timeIntervalBetweenActions + 400 : timeIntervalBetweenActions
                    setTimeout(resolve, inteval)
                })
                //Updating the q-table
                this.qTable[state][action] = this.qTable[state][action] *
                    (1 - this.learningRate) + this.learningRate * (reward + this.discountRate * Math.max(...this.qTable[newState]))
                state = newState
                rewardsCurrentEpisode += reward

                //If the environment says the episode ended stop the steps 
                if (done)
                    break
            }

            //Exploration rate decay
            if (!fullExploit) {
                this.explorationRate = this.minExplorationRate +
                    (this.maxExplorationRate - this.minExplorationRate) * Math.exp(-this.explorationDecayRate * episode)
            }
            //Adding reward 
            this.rewardsFromAllEpisodes.push(rewardsCurrentEpisode)
        }
    }
}