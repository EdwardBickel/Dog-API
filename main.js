let timer;
let deleteFirstPhotoDelay;

// Fetches the dog breed list
async function start() {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all")
    const data = await response.json()
    createBreedList(data.message) // 'message' is what contains the dog breeds. Property name of the API data.
  } catch (e) {
    console.log("There was a problem fetching the breed list.")
  }
}

start()

// Build the select dropdown menu. Use join() to get rid of unwanted commas.
function createBreedList(breedList) {
  document.getElementById("breed").innerHTML = `
  <select onchange="loadByBreed(this.value)"> 
      <option>Choose a dog breed</option>
      ${Object.keys(breedList).map(function(breed) {
    return `<option>${breed}</option>`
  }).join('')} 
    </select>
  `
}

// Load images data
async function loadByBreed(breed) {
  if (breed !== "Choose a dog breed") {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`)
    const data = await response.json()
    createSlideshow(data.message)
  }
}

// Create HTML for the empty slideshow div
function createSlideshow(images) {
  let currentPosition = 0; 
  clearInterval(timer); 
  clearTimeout(deleteFirstPhotoDelay);
  if (images.length > 1) {
    document.getElementById("slideshow").innerHTML = `
    <div class="slide" style="background-image: url('${images[0]}') "></div>
    <div class="slide" style="background-image: url('${images[1]}') "></div>
    `
    currentPosition += 2
    
    if (images.length === 2) {
      currentPosition = 0;
    }
    timer = setInterval(nextSlide, 3000)

  } else {
    document.getElementById("slideshow").innerHTML = `
    <div class="slide" style="background-image: url('${images[0]}') "></div>
    <div class="slide"></div>
    `
  }
  // create function inside createSlideshow in order to access currentPosition variable.
  function nextSlide() {
    document.getElementById("slideshow").insertAdjacentHTML("beforeend", `<div class="slide" style="background-image: url('${images[currentPosition]}') "></div>`)

    deleteFirstPhotoDelay = setTimeout(function () {
      document.querySelector(".slide").remove
    }, 1000)

    // If we have gone thru all the photos, go back to the first photo. Otherwise, move onto the next img.
    if (currentPosition + 1 >= images.length) {
      currentPosition = 0
    } else {
      currentPosition++;
    }
  }
}

