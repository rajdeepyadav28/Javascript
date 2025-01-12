let array = [];
let stepCount = 0;

// Complexity data for sorting algorithms
const complexities = {
    "selection": { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    "bubble": { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    "insertion": { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    "merge": { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    "quick": { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    "shell": { best: "O(n log n)", average: "O(n(log n)²)", worst: "O(n²)", space: "O(1)" },
    "heap": { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" }
};

function generateArray() {
    const arraySize = document.getElementById('array-size').value;
    const arrayElements = document.getElementById('array-elements').value.split(',').map(Number);

    if (arrayElements.length !== Number(arraySize)) {
        alert("Array size does not match the number of elements.");
        return;
    }

    array = arrayElements;
    stepCount = 0;
    document.getElementById('visualizer').innerHTML = '';
    document.getElementById('step-counter').innerText = 'Steps: 0';
    document.documentElement.style.setProperty('--array-size', arraySize);

    array.forEach(value => {
        const bar = document.createElement('div');
        const label = document.createElement('div');

        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
        label.innerText = value;
        label.classList.add('bar-label');

        bar.appendChild(label);
        document.getElementById('visualizer').appendChild(bar);
    });
    displayComplexity();
}

async function startSort() {
    const algorithm = document.getElementById('sort-type').value;
    displayComplexity();

    switch (algorithm) {
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'bubble':
            await bubbleSort();
            break;
        case 'merge':
            await mergeSort(0, array.length - 1);
            break;
        case 'quick':
            await quickSort(0, array.length - 1);
            break;
        case 'shell':
            await shellSort();
            break;
        case 'heap':
            await heapSort();
            break;
    }
}

// Selection sort algorithm with visualization
async function selectionSort() {
    let n = array.length;
    for (let i = 0; i < n; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            await updateVisualizer();
        }
    }
}


// Bubble sort algorithm with visualization
async function bubbleSort() {
    let n = array.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapped = true;
                await updateVisualizer();
            }
        }
        if (!swapped) break; // If no swaps were made, the array is already sorted
    }
}


// Insertion sort algorithm with visualization
async function insertionSort() {
    let n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
            await updateVisualizer();
        }
        array[j + 1] = key;
        await updateVisualizer();
    }
}


// Merge sort algorithm with visualization
async function mergeSort(l, r) {
    if (l >= r) return;

    let mid = Math.floor((l + r) / 2);
    await mergeSort(l, mid);
    await mergeSort(mid + 1, r);
    await merge(l, mid, r);
}

async function merge(l, mid, r) {
    let n1 = mid - l + 1;
    let n2 = r - mid;

    let left = new Array(n1);
    let right = new Array(n2);

    for (let i = 0; i < n1; i++) left[i] = array[l + i];
    for (let i = 0; i < n2; i++) right[i] = array[mid + 1 + i];

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        k++;
        await updateVisualizer();
    }

    while (i < n1) {
        array[k] = left[i];
        i++;
        k++;
        await updateVisualizer();
    }

    while (j < n2) {
        array[k] = right[j];
        j++;
        k++;
        await updateVisualizer();
    }
}

// Quick Sort Implementation
async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);

        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = (low - 1);

    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            await updateVisualizer();
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    await updateVisualizer();
    return (i + 1);
}

// Shell Sort Implementation
async function shellSort() {
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap];
            }
            array[j] = temp;
            await updateVisualizer();
        }
    }
}

// Heap Sort Implementation
async function heapSort() {
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        await updateVisualizer();
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        await updateVisualizer();
        await heapify(n, largest);
    }
}

function updateVisualizer() {
    return new Promise(resolve => {
        const bars = document.getElementsByClassName('bar');
        array.forEach((value, index) => {
            bars[index].style.height = `${value * 3}px`;
            bars[index].querySelector('.bar-label').innerText = value;
        });
        stepCount++;
        document.getElementById('step-counter').innerText = `Steps: ${stepCount}`;
        setTimeout(resolve, document.getElementById('speed').value);
    });
}

function displayComplexity() {
    const algorithm = document.getElementById('sort-type').value;
    const complexity = complexities[algorithm];

    document.getElementById('best-case').innerText = complexity.best;
    document.getElementById('average-case').innerText = complexity.average;
    document.getElementById('worst-case').innerText = complexity.worst;
    document.getElementById('space-complexity').innerText = complexity.space;
}

function reset() {
    array = [];
    document.getElementById('visualizer').innerHTML = '';
    document.getElementById('step-counter').innerText = 'Steps: 0';
    document.getElementById('array-elements').value = '';
    document.getElementById('array-size').value = 10;
}