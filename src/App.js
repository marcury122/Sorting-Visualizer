import React, { useState, useEffect, useCallback } from "react";
import "./styles.css"; // Import the styles.css file for styling the sorting visualizer

const generateRandomArray = (size, min, max) => {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const bubbleSort = async (arr, setArray) => {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        setArray([...arr]);
        await sleep(10); // Adjust the speed of visualization here (in milliseconds)
      }
    }
  }
};

const heapify = async (arr, n, i, setArray) => {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    swap(arr, i, largest);
    setArray([...arr]);
    await sleep(10);
    await heapify(arr, n, largest, setArray);
  }
};

const heapSort = async (arr, setArray) => {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i, setArray);
  }

  for (let i = n - 1; i >= 0; i--) {
    swap(arr, 0, i);
    setArray([...arr]);
    await sleep(10);
    await heapify(arr, i, 0, setArray);
  }
};

const merge = async (arr, l, m, r, setArray) => {
  const n1 = m - l + 1;
  const n2 = r - m;
  const left = new Array(n1);
  const right = new Array(n2);

  for (let i = 0; i < n1; i++) left[i] = arr[l + i];
  for (let j = 0; j < n2; j++) right[j] = arr[m + 1 + j];

  let i = 0;
  let j = 0;
  let k = l;

  while (i < n1 && j < n2) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    setArray([...arr]);
    await sleep(10);
    k++;
  }

  while (i < n1) {
    arr[k] = left[i];
    setArray([...arr]);
    await sleep(10);
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = right[j];
    setArray([...arr]);
    await sleep(10);
    j++;
    k++;
  }
};

const mergeSortHelper = async (arr, l, r, setArray) => {
  if (l >= r) return;

  const m = Math.floor((l + r) / 2);
  await mergeSortHelper(arr, l, m, setArray);
  await mergeSortHelper(arr, m + 1, r, setArray);
  await merge(arr, l, m, r, setArray);
};

const mergeSort = async (arr, setArray) => {
  const len = arr.length;
  await mergeSortHelper(arr, 0, len - 1, setArray);
};

const partition = async (arr, low, high, setArray) => {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
      setArray([...arr]);
      await sleep(10);
    }
  }

  swap(arr, i + 1, high);
  setArray([...arr]);
  await sleep(10);
  return i + 1;
};

const quickSortHelper = async (arr, low, high, setArray) => {
  if (low < high) {
    const pi = await partition(arr, low, high, setArray);

    await quickSortHelper(arr, low, pi - 1, setArray);
    await quickSortHelper(arr, pi + 1, high, setArray);
  }
};

const quickSort = async (arr, setArray) => {
  const len = arr.length;
  await quickSortHelper(arr, 0, len - 1, setArray);
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(100);
  const [barsBeingSwapped, setBarsBeingSwapped] = useState([]);

  const resetArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize, 5, 500);
    setArray(newArray);
  }, [arraySize]);

  useEffect(() => {
    resetArray();
  }, [resetArray]);

  const handleArraySizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setArraySize(newSize);
  };

  const swap = (arr, i, j) => {
    // Helper function to swap two elements in the array
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  const handleBubbleSort = async () => {
    setIsSorting(true);
    await bubbleSort([...array], setArray);
    setIsSorting(false);
  };

  const handleHeapSort = async () => {
    setIsSorting(true);
    await heapSort([...array], setArray);
    setIsSorting(false);
  };

  const handleMergeSort = async () => {
    setIsSorting(true);
    await mergeSort([...array], setArray);
    setIsSorting(false);
  };

  const handleQuickSort = async () => {
    setIsSorting(true);
    await quickSort([...array], setArray);
    setIsSorting(false);
  };

  const animateSwap = (i, j) => {
    setBarsBeingSwapped([i, j]);
    setTimeout(() => {
      setBarsBeingSwapped([]); // Reset the barsBeingSwapped after a short delay
    }, 300);
  };

  return (
    <div className="sorting-visualizer">
      <header className="header">
        <h1>
          <a href="http://localhost:3000">Sorting Visualizer</a>
        </h1>
        {/* <h1>Sorting Visualizer</h1> */}
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <button onClick={resetArray} disabled={isSorting}>
                  Generate New Array
                </button>
                <button onClick={handleBubbleSort} disabled={isSorting}>
                  Bubble Sort
                </button>
                <button onClick={handleHeapSort} disabled={isSorting}>
                  Heap Sort
                </button>
                <button onClick={handleMergeSort} disabled={isSorting}>
                  Merge Sort
                </button>
                <button onClick={handleQuickSort} disabled={isSorting}>
                  Quick Sort
                </button>
                <div className="array-size-control">
                  <label htmlFor="array-size">Array Size:</label>
                  <input
                    type="range"
                    id="array-size"
                    min="5"
                    max="200"
                    value={arraySize}
                    onChange={handleArraySizeChange}
                    disabled={isSorting}
                  />
                  <span>{arraySize}</span>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              height: `${value}px`,
              backgroundColor: isSorting
                ? barsBeingSwapped.includes(idx)
                  ? "purple"
                  : "#0074D9"
                : "#0074D9",
              marginLeft: idx === 0 ? "0" : "1px",
            }}
          ></div>
        ))}  
      </div>
    </div>
  );
};

export default SortingVisualizer;


