# frozen-lake
A Q-Learning algorithm tested with the game frozen lake.

## Tecnologies
This project was implemented with **javascript** using **nodejs** and **electron**.

## How it works 
This game is the same as gym.openai [FrozenLake-v0](https://gym.openai.com/envs/FrozenLake-v0/)
![game screen](https://github.com/Taiguz/frozen-lake/blob/master/game-capture.png "game capture")

In this game the agent must travel through the lettes in order to reach the goal **'G'** and get a reward of **one point**, otherwise no reward is given.

It can choose from four actions to execute on the environment, which are: go left, go right, go up and go down.

Letter 'S' is the starting position which is safe to be, the 'F' is a frozen surface which is also safe.

If the agent finds a **'H'**, hole, it will fall, ending the game and starting another episode. 

Because the surface of the lake is frozen, the agent **have a chance to slip** and go to a position it didn't want to go.

## Results 
With the parameters used on the project a Q-Table was obtained.
![game screen](https://github.com/Taiguz/frozen-lake/blob/master/final-q-table.png "q-table")

This is the final Q-Table that represents the experiences the agent had during the training phase.

Each column is a **probability** for the agent to take **that action** (go left, go right, go up and go down) on **that state**, based on the rewards it can get immediately and in the future. As [Bellman's equation](https://en.wikipedia.org/wiki/Bellman_equation) says.

And each line is a state from the environment. For example 'S' is the starting state, state zero on the table. The agent has the probability of 72% to go down at that state. It learned at the training that going that way it's the best for **maximizing** rewards. Since the state five is a "H", hole, there's no chances to take any actions on that state. This is because the agent didn't experience nothing after that, for the reason that the game ends if he fall down on a hole. So every hole will be filled with zeros which are the starting chances.

It was taken an average of rewards every thousand episodes.

![averages](https://github.com/Taiguz/frozen-lake/blob/master/average-rewards.png "agent averages")

It can be noticed that at the beginning of the training the agent would **reach the goal just 21% of the time**.

But at the end it would successfully **reach the goal 83% of the time**.

## How to test
You will need to have nodejs installed on your system. Then you can just run: 

`npm install && npm start`

## References 
I used [DeepLizard's series](https://deeplizard.com/learn/playlist/PLZbbT5o_s2xoWNVdDudn51XM8lOuZ_Njv) as a reference to complete this project.
