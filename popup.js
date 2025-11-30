// popup display code
const popupTigger = document.querySelector(".search_mobile_wrapper");
const popBoxOne = document.querySelector(".search_mobile_popup");
const crossPopup = popBoxOne.querySelector(".msp_header_icon");

popupTigger.addEventListener("click", function(){
   popBoxOne.style.display="block";
   document.querySelector("body").style.overflow = "hidden";
})

crossPopup.addEventListener("click", function(){
   popBoxOne.style.display = "none";
   document.querySelector("body").style.overflow = "auto";
})

  
  
  // Select all tab buttons and content boxes
  const tabItems = document.querySelectorAll(".ms_tab_item");
  const tabContents = document.querySelectorAll(".ms_tab_cnt_item");

  tabItems.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-item"); // example: mstaboneway

      // Remove active from all tabs
      tabItems.forEach(item => item.classList.remove("active"));

      // Remove active from all tab contents
      tabContents.forEach(content => content.classList.remove("active"));

      // Add active to clicked tab
      tab.classList.add("active");

      // Add active to matching content tab
      document.getElementById(targetId).classList.add("active");
    });
  });


//filling data from session storage
const getsessionDateSM = sessionStorage.getItem("storeData");
const getstoredDataSM = JSON.parse(getsessionDateSM);

if (!getstoredDataSM) {
  window.location.href = `/`;
}

// Set active tab based on session storage way
if (getstoredDataSM.way === "one way") {
  tabItems.forEach(item => item.classList.remove("active"));
  tabContents.forEach(content => content.classList.remove("active"));
  document.querySelector('[data-item="mstaboneway"]').classList.add("active");
  document.getElementById("mstaboneway").classList.add("active");
} else if (getstoredDataSM.way === "round trip") {
  tabItems.forEach(item => item.classList.remove("active"));
  tabContents.forEach(content => content.classList.remove("active"));
  document.querySelector('[data-item="mstabroundtrip"]').classList.add("active");
  document.getElementById("mstabroundtrip").classList.add("active");
} else if (getstoredDataSM.way === "multi-city") {
  tabItems.forEach(item => item.classList.remove("active"));
  tabContents.forEach(content => content.classList.remove("active"));
  document.querySelector('[data-item="mstabmulticity"]').classList.add("active");
  document.getElementById("mstabmulticity").classList.add("active");
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

// for one way
const owFromAirpName = document.querySelector(".owfaname");
const owFromAirpId = document.querySelector(".owfaid");
const owToAirpName = document.querySelector(".owtaname");
const owToAirpId = document.querySelector(".owtaid");
const owFormatedDate = document.querySelector(".owdateformated");
const owDateAsText = document.querySelector(".owdateastext");
const owPax = document.querySelector(".owpax");

function fillInputOneWay() {
  if (getstoredDataSM.formIdInput) {
    owFromAirpName.innerHTML = `${getstoredDataSM.formIdInput} <span>(${getstoredDataSM.fromShortName})</span>`;
  }
  if (getstoredDataSM.toIdInput) {
    owToAirpName.innerHTML = `${getstoredDataSM.toIdInput} <span>(${getstoredDataSM.toShortName})</span>`;
  }

  if (getstoredDataSM.fromId) {
    owFromAirpId.textContent = getstoredDataSM.fromId;
  }

  if (getstoredDataSM.toId) {
    owToAirpId.textContent = getstoredDataSM.toId;
  }
  if (getstoredDataSM.dateAsText) {
    owDateAsText.textContent = getstoredDataSM.dateAsText;
  }

  if (getstoredDataSM.dateAsText) {
    owFormatedDate.textContent = formatDate(getstoredDataSM.dateAsText);
  }

  if (getstoredDataSM.pax) {
    owPax.textContent = `${getstoredDataSM.pax} passenger`;
  }
}

// for round trip
const rtFromAirpName = document.querySelector(".rwfaname");
const rtFromAirpId = document.querySelector(".rwfaid");
const rtToAirpName = document.querySelector(".rwtaname");
const rtToAirpId = document.querySelector(".rwtaid");
const rtFormatedDate = document.querySelector(".rwdateformated");
const rtDateAsText = document.querySelector(".rwdateastext");
const rtReturnDate = document.querySelector(".rwreturndate");
const rtPax = document.querySelector(".rwpax");

function fillInputRound() {
  if (getstoredDataSM.formIdInput) {
    rtFromAirpName.innerHTML = `${getstoredDataSM.formIdInput} <span>(${getstoredDataSM.fromShortName})</span>`;
  }
  if (getstoredDataSM.toIdInput) {
    rtToAirpName.innerHTML = `${getstoredDataSM.toIdInput} <span>(${getstoredDataSM.toShortName})</span>`;
  }

  if (getstoredDataSM.fromId) {
    rtFromAirpId.textContent = getstoredDataSM.fromId;
  }

  if (getstoredDataSM.toId) {
    rtToAirpId.textContent = getstoredDataSM.toId;
  }
  if (getstoredDataSM.dateAsText) {
    rtDateAsText.textContent = getstoredDataSM.dateAsText;
  }

  if (getstoredDataSM.dateAsText) {
    rtReturnDate.textContent = getstoredDataSM.returnDateAsText;
  }

  if (getstoredDataSM.dateAsText) {
    rtFormatedDate.textContent = `${formatDate(
      getstoredDataSM.dateAsText
    )} - ${formatDate(getstoredDataSM.returnDateAsText)}`;
  }

  if (getstoredDataSM.pax) {
    rtPax.textContent = `${getstoredDataSM.pax} passenger`;
  }
}


// for multicity
if (getstoredDataSM.way === "multi-city") {   
  for (let i = 0; i < getstoredDataSM.fromId.length; i++) {
    document.querySelector(".multicity_box").innerHTML += `
      <div class="multicity_wrapping" data-from-storage="true" data-flight-index="${i}">
         <div class="flight_heading">
            <img
               src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6929904e2a85631be7392ee2_ms_cross.png"
               alt="cross_icon"
               class="remove-flight"
            />
            <p>Flight ${i + 1}</p>
         </div>
         <div class="mspop_cnt_box">
            <p>From</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269ccb9fc2ec39c70ca_plan_icon1.png"
                  alt="icon"
                  />
               </div>
               <p class="mcfaname">${getstoredDataSM.formIdInput[i]} <span>(${getstoredDataSM.fromShortName[i]})</span></p>
               <p class="mcfaid">${getstoredDataSM.fromId[i]}</p>
            </div>
         </div>
         <div class="mspop_cnt_box">
            <p>To <img src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269992d97759a2c5742_dblarrow.png" alt="" /></p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/692992693227baee55527900_plan_icon2.png"
                  alt="icon"
                  />
               </div>
               <p class="mctaname">${getstoredDataSM.toIdInput[i]} <span>(${getstoredDataSM.toShortName[i]})</span></p>
               <p class="mctaid">${getstoredDataSM.toId[i]}</p>
            </div>
         </div>
         <div class="mspop_cnt_box">
            <p>Date</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299366e47ff54456ae3b44_datems.png"
                  alt="icon"
                  />
               </div>
               <p class="mcdateformated">${formatDate(
                 getstoredDataSM.dateAsText[i]
               )}</p>
               <p class="mcdateastext">${getstoredDataSM.dateAsText[i]}</p>
            </div>
         </div>
         <div class="mspop_cnt_box">
            <p>pax</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6929936640fd29b7b68bea70_paxms.png"
                  alt="icon"
                  />
               </div>
               <p class="mcpax">${getstoredDataSM.pax[i]}</p>
            </div>
         </div>
      </div>
    `;
  }
}

const multicityPreDefine = document.querySelector(".multicity_predefine");
if (getstoredDataSM.way === "multi-city") {
  multicityPreDefine.style.display = "none";
} else {
  multicityPreDefine.style.display = "block";
}

if (getstoredDataSM.way === "one way") {
  fillInputOneWay();
}

if (getstoredDataSM.way === "round trip") {
  fillInputRound();
}

// Add another flight functionality
const addNewBtn = document.querySelector(".addnew");
if (addNewBtn) {
  addNewBtn.addEventListener("click", () => {
    const multicityBox = document.querySelector(".multicity_box");
    const currentFlights = multicityBox.querySelectorAll(".multicity_wrapping");
    
    if (currentFlights.length >= 10) {
      alert("You can not add more flights");
      return;
    }
    
    const nextFlightNumber = currentFlights.length + 1;

    const newFlightBlock = `
      <div class="multicity_wrapping" data-from-storage="false">
         <div class="flight_heading">
            <img
               src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6929904e2a85631be7392ee2_ms_cross.png"
               alt="cross_icon"
               class="remove-flight"
            />
            <p>Flight ${nextFlightNumber}</p>
         </div>
         <div class="mspop_cnt_box">
            <p>From</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269ccb9fc2ec39c70ca_plan_icon1.png"
                  alt="icon"
                  />
               </div>
               <p class="mcfaname">Select airport</p>
               <p class="mcfaid"></p>
            </div>
         </div>
         <div class="mspop_cnt_box">
            <p>To <img src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269992d97759a2c5742_dblarrow.png" alt="" /></p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/692992693227baee55527900_plan_icon2.png"
                  alt="icon"
                  />
               </div>
               <p class="mctaname">Select airport</p>
               <p class="mctaid"></p>
            </div>
         </div>
         <div class="mspop_cnt_box">
            <p>Date</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299366e47ff54456ae3b44_datems.png"
                  alt="icon"
                  />
               </div>
               <p class="mcdateformated">Select date</p>
               <p class="mcdateastext"></p>
            </div>
         </div>
         <div class="mspop_cnt_box">
            <p>pax</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6929936640fd29b7b68bea70_paxms.png"
                  alt="icon"
                  />
               </div>
               <p class="mcpax">Passanger</p>
            </div>
         </div>
      </div>
    `;

    multicityBox.insertAdjacentHTML("beforeend", newFlightBlock);
  });
}

// Remove flight functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-flight")) {
    const flightBlock = e.target.closest(".multicity_wrapping");
    const isFromStorage = flightBlock.getAttribute("data-from-storage") === "true";
    const flightIndex = parseInt(flightBlock.getAttribute("data-flight-index"));

    if (isFromStorage && !isNaN(flightIndex)) {
      // Remove from session storage
      const sessionData = sessionStorage.getItem("storeData");
      const storedData = JSON.parse(sessionData);

      if (storedData.way === "multi-city") {
        storedData.fromId.splice(flightIndex, 1);
        storedData.toId.splice(flightIndex, 1);
        storedData.formIdInput.splice(flightIndex, 1);
        storedData.toIdInput.splice(flightIndex, 1);
        storedData.dateAsText.splice(flightIndex, 1);
        storedData.pax.splice(flightIndex, 1);

        sessionStorage.setItem("storeData", JSON.stringify(storedData));
      }
    }

    // Remove from DOM
    flightBlock.remove();

    // Update flight numbers
    const multicityBox = document.querySelector(".multicity_box");
    const allFlights = multicityBox.querySelectorAll(".multicity_wrapping");
    allFlights.forEach((flight, index) => {
      const flightHeading = flight.querySelector(".flight_heading p");
      flightHeading.textContent = `Flight ${index + 1}`;
      
      // Update data-flight-index for storage-based flights
      if (flight.getAttribute("data-from-storage") === "true") {
        flight.setAttribute("data-flight-index", index);
      }
    });
  }
});

// Algolia Search Implementation
const searchClient = algoliasearch(
  "ZSPO7HB4MN",
  "2a3621a18dca4f1fb757e9ddaea72440"
);
const index = searchClient.initIndex("Airports");

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const handleInput = debounce(function (event) {
  const input = event.target;
  if (!input.classList.contains("algolio_input")) return;
  const query = input.value.trim();
  const eminputBlock = input.closest(".eminputblock");
  const resultsContainer = eminputBlock.querySelector(".search-results");
  if (!resultsContainer) {
    console.warn("No .search-results container found for the input.");
    return;
  }

  if (query.length === 0) {
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none";
    return;
  }

  // Perform Algolia search
  index
    .search(query)
    .then(({ hits }) => {
      if (hits.length > 0) {
        resultsContainer.innerHTML = hits
          .map(
            (hit) =>
              `<div class="port" tabindex="0">
            <div class="emfieldnamewrapper">
              <img
                src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6739f54808efbe5ead7a23c1_Screenshot_1-removebg-preview.avif"
                alt="Location Icon"
              />
              <p class="emfieldname">${escapeHTML(hit["All Fields"])}</p>
              <p class="uniqueid">${escapeHTML(hit["unique id"])}</p>
              <p class="shortcode">${
                hit["ICAO Code"]
                  ? escapeHTML(hit["ICAO Code"])
                  : hit["IATA Code"]
                  ? escapeHTML(hit["IATA Code"])
                  : hit["FAA Code"]
                  ? escapeHTML(hit["FAA Code"])
                  : ""
              }</p>
              <p class="cityname">${escapeHTML(hit["AirportCity"])}</p>
            </div>
          </div>`
          )
          .join("");
        resultsContainer.style.display = "block";
      } else {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        resultsContainer.style.display = "block";
      }
    })
    .catch((err) => {
      console.error("Algolia search error:", err);
      resultsContainer.innerHTML = "<p>Error fetching results.</p>";
      resultsContainer.style.display = "block";
    });
}, 300);

// Function to handle click events on search results
function handleClick(event) {
  const portElement = event.target.closest(".port");
  if (portElement) {
    const emfieldname = portElement.querySelector(".emfieldname").textContent;
    const uniqueid = portElement.querySelector(".uniqueid").textContent;
    const shortcode = portElement.querySelector(".shortcode").textContent;
    const citycode = portElement.querySelector(".cityname").textContent;

    // Find the corresponding input and .portid
    const eminputBlock = portElement.closest(".eminputblock");
    const input = eminputBlock.querySelector(".algolio_input");
    const portidElement = eminputBlock.querySelector(".portid");
    const shortElement = eminputBlock.querySelector(".airportshort");
    const airportCityName = eminputBlock.querySelector(".airportcity");
    input.value = emfieldname;
    portidElement.textContent = uniqueid;
    shortElement.textContent = shortcode;
    airportCityName.textContent = citycode;
    const resultsContainer = eminputBlock.querySelector(".search-results");
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none";
  }
}

// Function to attach event listeners to a given .algolio_wrapper
function attachListeners(algolioWrapper) {
  algolioWrapper.addEventListener("input", handleInput);
  algolioWrapper.addEventListener("click", handleClick);

  algolioWrapper.addEventListener("focusout", function (event) {
    setTimeout(() => {
      const relatedTarget = event.relatedTarget;

      if (!relatedTarget || !algolioWrapper.contains(relatedTarget)) {
        const allResults = algolioWrapper.querySelectorAll(".search-results");
        allResults.forEach((resultsContainer) => {
          resultsContainer.innerHTML = "";
          resultsContainer.style.display = "none";
        });
      }
    }, 100);
  });
}

// Select all existing .algolio_wrapper elements and attach listeners
const algolioWrappers = document.querySelectorAll(".algolio_wrapper");
algolioWrappers.forEach(attachListeners);

// Hide search results when clicking outside any .algolio_wrapper
document.addEventListener("click", function (event) {
  algolioWrappers.forEach((algolioWrapper) => {
    const isClickInside = algolioWrapper.contains(event.target);

    if (!isClickInside) {
      const allResults = algolioWrapper.querySelectorAll(".search-results");
      allResults.forEach((resultsContainer) => {
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "none";
      });
    }
  });
});


