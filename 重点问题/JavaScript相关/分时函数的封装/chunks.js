const btn = document.querySelector(".btn");
const datas = new Array(100000).fill(0).map((_, i) => i);
btn.onclick = () => {
  // 不适用分时函数执行的时候会卡死
  // for (const i of datas) {
  //   const div = document.createElement("div");
  //   div.innerText = i;
  //   document.body.appendChild(div);
  // }
  const taskHandler = (data, index) => {
    const div = document.createElement("div");
    div.innerText = data;
    document.body.appendChild(div);
  };
  const scheduler = (task) => {
    setTimeout(() => {
      const now = performance.now();
      task(()=> performance.now() - now <= 10);
    }, 1000);
  };
  // 分时调用方法一，使用调度器的方式进行执行的判断
  // performChunk(datas, taskHandler, scheduler);
  // 分时调用方法二， 使用默认的调度器，简化调用
  browserPerformChunk(datas, taskHandler)
};

function performChunk(datas, taskHandler, scheduler) {
  // datas 可能不是一个数组，就是一个需要执行的次数number，需要参数归一化
  if(typeof datas === 'number') {
    datas = {
      length: datas,
    }
  }
  if (datas.length === 0) {
    return;
  }
  let i = 0;
  // 开启下一个分片的执行
  function _run() {
    if (i >= datas.length) {
      return;
    }
    // 一个渲染帧中，空闲的开启分片的执行
    scheduler((goOn) => {
      // 当渲染帧中，空闲时间大于0，并且还有数据，就执行。浏览器的渲染帧间隔通常为 16.6 毫秒，这相当于每秒 60 帧（60 FPS）
      while (goOn() && i < datas.length) {
        taskHandler(datas[i], i);
        i++;
      }
      // 此次分片执行完毕，开启下一个分片的执行
      _run();
    });
  }
  _run();
}

// 浏览器中实现，使用requestIdleCallback
function browserPerformChunk(datas, taskHandler) {
  const scheduler = (task) => {
    requestIdleCallback((idle) => {
      task(()=> idle.timeRemaining())
    })
  };
  performChunk(datas, taskHandler, scheduler)
}


// 浏览器空闲渲染帧执行回调
// const btn = document.querySelector(".btn");
// const datas = new Array(100000).fill(0).map((_, i) => i);
// btn.onclick = () => {
//   // 不适用分时函数执行的时候会卡死
//   // for (const i of datas) {
//   //   const div = document.createElement("div");
//   //   div.innerText = i;
//   //   document.body.appendChild(div);
//   // }
//   const taskHandler = (data, index) => {
//     const div = document.createElement("div");
//     div.innerText = data;
//     document.body.appendChild(div);
//   };
//   performChunk(datas, taskHandler);
// };

// function performChunk(datas, taskHandler) {
//   if (datas.length === 0) {
//     return;
//   }
//   let i = 0;
//   // 开启下一个分片的执行
//   function _run() {
//     if (i >= datas.length) {
//       return;
//     }
//     // 一个渲染帧中，空闲的开启分片的执行
//     requestIdleCallback((idle) => {
//       // 当渲染帧中，空闲时间大于0，并且还有数据，就执行
//       while (idle.timeRemaining() > 0 && i < datas.length) {
//         taskHandler(datas[i], i);
//         i++;
//       }
//       // 此次分片执行完毕，开启下一个分片的执行
//       _run();
//     });
//   }
//   _run();
// }
