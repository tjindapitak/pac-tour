# Pacman tour

Game engine will inject `grid`

`grid` is 2-dimensional number array
with value describe below

```
enum CellEnum {
  WALL = 1,
  EMPTY = 2,
  PALLET = 3,
  CRYSTAL = 4,
  PLAYER_A = 5,
  PLAYER_B = 6,
}
```

your program should have a return statement with possible values "UP", "DOWN", "LEFT", "RIGHT"


## code example
1. example 1: I'm right
```js
return "RIGHT";
```

2. example 2: I go freely
```js
function getRandomDirection() {
  const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
  const randomIndex = Math.floor(Math.random() * directions.length);
  return directions[randomIndex];
}

return getRandomDirection();
```

## How to Run locally
server
1. go inside /server
2. `npm i`
3. `npm run start`


client
1. go inside /client
2. `npm i`
3. `npm  run start`
