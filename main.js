// If you are already viewing the slideshow for one breed, but then switch to another breed, you want to delete or cancel the timer that runs every 3 seconds for old slideshow.

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

// Build the select dropdown menu. Use join() to get rid of unwanted commas. "this" on line 23 is pointing to the <select> ele.

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
  let currentPosition = 0; // keeps track of which photo to be on 
  clearInterval(timer); // cancel existing interval
  clearTimeout(deleteFirstPhotoDelay); // cancel existing timeout

  if (images.length > 1) {
    document.getElementById("slideshow").innerHTML = `
    <div class="slide" style="background-image: url('${images[0]}') "></div>
    <div class="slide" style="background-image: url('${images[1]}') "></div>
    `
    // Lines 48-49: when you first load a breed of dog, two imgs are going to be added to the page. 3 seconds later, a third img will be added (3 total slide divs). Write a CSS selector that says the second to last slide div should be the one that's visible. Then every 3 seconds, a new photo should be added to the end of the collection and remove the oldest photo.

    // advance the counter by 2 images since we have already loaded 2 images.

    currentPosition += 2

    // if there are just 2 photos for a breed, loop back to the first image.

    if (images.length === 2) {
      currentPosition = 0;
    }
    // set a timer to load a new photo every 3 seconds.
    timer = setInterval(nextSlide, 3000)

    // else if there is only 1 image for a breed, display that img. Need to keep empty div on line 72 in order for our CSS rule (second to last div to show) to still work.

  } else {
    document.getElementById("slideshow").innerHTML = `
    <div class="slide" style="background-image: url('${images[0]}') "></div>
    <div class="slide"></div>
    `
  }
  // create function inside createSlideshow in order to access currentPosition variable.

  function nextSlide() {

    // since we just want to modify "slideshow" by adding to the end of it (lines 52-53), use insertAdjacentHTML rather than innerHTML.

    document.getElementById("slideshow").insertAdjacentHTML("beforeend", `<div class="slide" style="background-image: url('${images[currentPosition]}') "></div>`)

    // remove oldest photo after 1 second. querySelector just removes the first instance of the selected element.

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

