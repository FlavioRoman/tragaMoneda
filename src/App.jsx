import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { GiLever } from "react-icons/gi";
import { BiReset } from "react-icons/bi";
import { motion } from "framer-motion";
import { container, element } from "./utils/animation";
import { items } from "./utils/items";
import { disabled, enabled } from "./utils/styles";

function App() {
  const [doors, setDoors] = useState([]);
  const [state, setState] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    init();
  }, []);

  function init(firstInit = true, enabled = false, groups = 1, duration = 1) {
    const doorElements = Array.from(document.querySelectorAll(".door"));
    const updatedDoors = doorElements.map((door) => {
      if (firstInit) {
        door.dataset.spinned = "0";
      } else if (door.dataset.spinned === "1") {
        return door;
      }

      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);
      const pool = ["❓"];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            door.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        door.clientHeight * (pool.length - 1)
      }px)`;
      door.replaceChild(boxesClone, boxes);

      return door;
    });

    setDoors(updatedDoors);
    setIsSpinning(false);
    setState(enabled);
  }

  async function spin() {
    setIsSpinning(true);
    init(false, true, 1, 2);

    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  return (
    <div id="app">
      <h1>TRAGA MONEDA</h1>
      <motion.section variants={container} initial="hidden" animate="visible">
        {/* {winner ? <Confetti /> : ""} */}
        <div className="doors">
          <div className="door">
            <div className="boxes"></div>
          </div>

          <div className="door">
            <div className="boxes"></div>
          </div>

          <div className="door">
            <div className="boxes"></div>
          </div>
        </div>

        <div className="buttons">
          <motion.button
            id="spinner"
            onClick={() => spin()}
            disabled={state}
            variants={element}
            style={state ? enabled : disabled}
          >
            <GiLever size={30} color="#fff" />
          </motion.button>
          <motion.button
            id="reseter"
            onClick={() => init()}
            disabled={isSpinning}
            variants={element}
          >
            <BiReset size={30} color="#fff" />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}

export default App;
