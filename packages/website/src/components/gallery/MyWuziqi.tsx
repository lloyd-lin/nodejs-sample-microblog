// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';

// 五子棋  棋盘，落子（是否结束）
// 初始化棋盘

const playerDesc = {
  white: 2,
  black: 1
}
class ClassWuziqi {
  constructor(size) {
    // 建立二维数组棋盘
    this.size = size;
    this.player = playerDesc.white// 'black: 1,white: 2'
    this.init();
  }

  init () {
    this.map = new Array(this.size).fill([]);
    for(let row = 0; row < this.size; row ++) {
      this.map[row] = new Array(this.size).fill(0)
    }
  }
  getMap() {
    return this.map;
  }

  step(color, x, y) {
    this.map[x][y] = color;
  }

  process(x, y) {
    console.log(`当前是${this.player}下棋`)
    if (!this.canProcess(x,y)) {
      throw new Error('当前格子已经有棋')
    }
    if (this.player === playerDesc.white) {
      // 白方
      this.step(this.player, x, y)
      this.player = playerDesc.black
    } else {
       this.step(this.player, x, y)
       this.player = playerDesc.white
    }
  }

  canProcess(x,y) {
    return this.map[x][y] === 0;
  }

  currentResult(){
    // []
  }
}

const wuziqi = new ClassWuziqi(10);
wuziqi.process(0,0)
wuziqi.process(0,1)

console.log(wuziqi.getMap())

const MyWuziqi = (props) => {
  const size = props.size;
  const sWidth = 20;
  const sHeight = 20;
  return (<div style={
      {
        width: sWidth * size,
        height: sHeight * size,
        backgroundColor: 'gray',
      }
    } >
      123
    </div>)
}

export default MyWuziqi;