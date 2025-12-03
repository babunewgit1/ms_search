// algolio search
// Wait for DOM to be ready
      document.addEventListener("DOMContentLoaded", function () {
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
          if (!input.classList.contains("algolio_input_from") && !input.classList.contains("algolio_input_to")) return;
          const query = input.value.trim();
          const algolioWrapper = input.closest(".algolio_wrapper");
          
          // Determine which results container to use
          let resultsContainer;
          if (input.classList.contains("algolio_input_from")) {
            resultsContainer = document.querySelector(".pop_search-results_from");
          } else if (input.classList.contains("algolio_input_to")) {
            resultsContainer = document.querySelector(".pop_search-results_to");
          }
          
          if (!resultsContainer) return;

          if (query.length === 0) {
            resultsContainer.innerHTML = "";
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
                  <div class="from_pop_result_block">
                    <div class="form_pop_left">
                     <img
                      src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269ccb9fc2ec39c70ca_plan_icon1.png"
                      alt="Location Icon"
                    />
                    <p class="emfieldname">${escapeHTML(hit["All Fields"])}</p>
                    </div>
                    <div class="form_pop_right">
                      <p class="uniqueid">${escapeHTML(hit["unique id"])}</p>
                      <p class="shortcode">${escapeHTML(
                        hit["AirportNameShort"]
                      )}</p>
                    </div>
                  </div>
                </div>`
                  )
                  .join("");
              } else {
                resultsContainer.innerHTML = "<p>No results found.</p>";
              }
            })
            .catch((err) => {
              console.error("Algolia search error:", err);
              resultsContainer.innerHTML = "<p>Error fetching results.</p>";
            });
        }, 300);

        // Function to handle click events on search results
        function handleClick(event) {
          const portElement = event.target.closest(".port");
          if (portElement) {
            const emfieldnameEl = portElement.querySelector(".emfieldname");
            const uniqueidEl = portElement.querySelector(".uniqueid");
            const shortcodeEl = portElement.querySelector(".shortcode");

            // If any required element is missing, this might be a result from another script (like fix.js)
            // So we simply return and let the other script handle it.
            if (!emfieldnameEl || !uniqueidEl || !shortcodeEl) return;

            const emfieldname = `<span class="light_font">${emfieldnameEl.textContent}</span> <span>(${shortcodeEl.textContent})</span>`;
            const uniqueid = uniqueidEl.textContent;
            const shortcode = shortcodeEl.textContent;

            // Fill data based on which modal is open
            if (window.currentClickedPopup) {
              const nameElement = window.currentClickedPopup.querySelector(".fromairportname, .toairportname");
              const idElement = window.currentClickedPopup.querySelector(".fromairportid, .toairportid");
              const shortcodeElement = window.currentClickedPopup.querySelector(".fromairportshortcode, .toairportshortcode");

              if (nameElement) nameElement.innerHTML = emfieldname;
              if (idElement) idElement.textContent = uniqueid;
              if (shortcodeElement) shortcodeElement.textContent = shortcode;
            }

            // Reset input value, clear results, and hide the appropriate modal
            const fromPopup = document.querySelector(".from_popup");
            const toPopup = document.querySelector(".to_popup");
            
            if (fromPopup && fromPopup.style.display === "block") {
              const fromInput = document.querySelector(".algolio_input_from");
              const fromResults = document.querySelector(".pop_search-results_from");
              if (fromInput) fromInput.value = "";
              if (fromResults) fromResults.innerHTML = "";
              fromPopup.style.display = "none";
            } else if (toPopup && toPopup.style.display === "block") {
              const toInput = document.querySelector(".algolio_input_to");
              const toResults = document.querySelector(".pop_search-results_to");
              if (toInput) toInput.value = "";
              if (toResults) toResults.innerHTML = "";
              toPopup.style.display = "none";
            }
          }
        }

        // Function to attach event listeners to a given .algolio_wrapper
        function attachListeners(algolioWrapper) {
          algolioWrapper.addEventListener("input", handleInput);
          algolioWrapper.addEventListener("focusout", function (event) {
            setTimeout(() => {
              const relatedTarget = event.relatedTarget;

              if (!relatedTarget || !algolioWrapper.contains(relatedTarget)) {
                const allResults =
                  algolioWrapper.querySelectorAll(".search-results");
                allResults.forEach((resultsContainer) => {
                  resultsContainer.innerHTML = "";
                });
              }
            }, 100);
          });
        }

        // Select all existing .algolio_wrapper elements and attach listeners
        const algolioWrappers = document.querySelectorAll(".algolio_wrapper");
        algolioWrappers.forEach(attachListeners);

        // Add click listener to the search results container (outside algolio_wrapper)
        document.addEventListener("click", handleClick);

        // Hide search results when clicking outside
        document.addEventListener("click", function (event) {
          const resultsContainer = document.querySelector(
            ".pop_search-results"
          );
          const algolioInput = document.querySelector(".algolio_input");

          // Check if click is outside both input and results
          if (resultsContainer && algolioInput) {
            const isClickInside =
              resultsContainer.contains(event.target) ||
              algolioInput.contains(event.target) ||
              event.target.classList.contains("algolio_input");

            if (!isClickInside) {
              resultsContainer.innerHTML = "";
            }
          }
        });

        // Show from_popup when clicking on .frompopup (using event delegation)
        document.addEventListener("click", function(e) {
          const frompopup = e.target.closest(".frompopup");
          if (frompopup) {
            window.currentClickedPopup = frompopup;
            document.querySelector(".from_popup").style.display = "block";

            // Manage nearby checkbox injection
            const isMultiCity = document.getElementById("mstabmulticity").classList.contains("active");
            const fromInputBox = document.querySelector(".from_input_box");
            const existingCheckbox = document.querySelector(".from_near_checkbox");

            if (!isMultiCity) {
                if (!existingCheckbox && fromInputBox) {
                    const checkboxHTML = `
                        <div class="from_near_checkbox">
                          <p>Include Nearby Airports</p>
                          <div class="toggle-switcher-container">
                            <label class="toggle-switcher">
                              <input type="checkbox" />
                              <span class="slider"></span>
                            </label>
                          </div>
                        </div>`;
                    fromInputBox.insertAdjacentHTML('afterend', checkboxHTML);
                }
            } else {
                if (existingCheckbox) {
                    existingCheckbox.remove();
                }
            }

            // Clear the search input
            const algolioInput = document.querySelector(".algolio_input_from");
            if (algolioInput) algolioInput.value = "";
          }
        });

        // Show to_popup when clicking on .topopup (using event delegation)
        document.addEventListener("click", function(e) {
          const topopup = e.target.closest(".topopup");
          if (topopup) {
            window.currentClickedPopup = topopup;
            document.querySelector(".to_popup").style.display = "block";

            // Manage nearby checkbox injection
            const isMultiCity = document.getElementById("mstabmulticity").classList.contains("active");
            const toInputBox = document.querySelector(".to_input_box");
            const existingCheckbox = document.querySelector(".to_near_checkbox");

            if (!isMultiCity) {
                if (!existingCheckbox && toInputBox) {
                    const checkboxHTML = `
                        <div class="to_near_checkbox">
                          <p>Include Nearby Airports</p>
                          <div class="toggle-switcher-container">
                            <label class="toggle-switcher">
                              <input type="checkbox" />
                              <span class="slider"></span>
                            </label>
                          </div>
                        </div>`;
                    toInputBox.insertAdjacentHTML('afterend', checkboxHTML);
                }
            } else {
                if (existingCheckbox) {
                    existingCheckbox.remove();
                }
            }

            // Clear the search input
            const algolioInput = document.querySelector(".algolio_input_to");
            if (algolioInput) algolioInput.value = "";
          }
        });

        // Show date_popup when clicking on .datepopup (using event delegation)
        document.addEventListener("click", function(e) {
          const datepopup = e.target.closest(".datepopup");
          if (datepopup) {
            window.currentClickedPopup = datepopup;
            document.querySelector(".date_popup").style.display = "block";
          }
        });

        // Hide from_popup when clicking the close icon
        document
          .querySelector(".from_popup_header .msp_header_icon")
          .addEventListener("click", function () {
            document.querySelector(".from_popup").style.display = "none";
          });

        // Hide to_popup when clicking the close icon
        document
          .querySelector(".to_popup_header .msp_header_icon")
          .addEventListener("click", function () {
            document.querySelector(".to_popup").style.display = "none";
          });

        // Hide date_popup when clicking the close icon
        document
          .querySelector(".date_popup_header .msp_header_icon")
          .addEventListener("click", function () {
            document.querySelector(".date_popup").style.display = "none";
          });
      }); // End DOMContentLoaded


// popup display code
const popupTigger = document.querySelector(".search_mobile_wrapper");
const popBoxOne = document.querySelector(".search_mobile_popup");

if (popupTigger && popBoxOne) {
  const crossPopup = popBoxOne.querySelector(".msp_header_icon");

  popupTigger.addEventListener("click", function(){
     popBoxOne.style.display="block";
     document.querySelector("body").style.overflow = "hidden";
  })

  if (crossPopup) {
    crossPopup.addEventListener("click", function(){
       popBoxOne.style.display = "none";
       document.querySelector("body").style.overflow = "auto";
    })
  }
}

  
  
  // Select all tab buttons and content boxes
  const tabItems = document.querySelectorAll(".ms_tab_item");
  const tabContents = document.querySelectorAll(".ms_tab_cnt_item");

  tabItems.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-item");

      // Remove active from all tabs
      tabItems.forEach(item => item.classList.remove("active"));

      // Remove active from all tab contents
      tabContents.forEach(content => content.classList.remove("active"));

      // Add active to clicked tab
      tab.classList.add("active");

      // Add active to matching content tab
      document.getElementById(targetId).classList.add("active");

      // Reset PAX counters to 0 when switching tabs
      document.querySelectorAll(".pax_count").forEach(span => {
        span.textContent = "0";
      });
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
const owFromAirpShortName = document.querySelector(".owfashort");
const owToAirpShortName = document.querySelector(".owtashort ");

function fillInputOneWay() {
  if (getstoredDataSM.formIdInput) {
    owFromAirpName.innerHTML = `<span class="light_font">${getstoredDataSM.formIdInput}</span> <span>(${getstoredDataSM.fromShortName})</span>`;
  }
  if (getstoredDataSM.toIdInput) {
    owToAirpName.innerHTML = `<span class="light_font">${getstoredDataSM.toIdInput}</span> <span>(${getstoredDataSM.toShortName})</span>`;
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

  if (getstoredDataSM.fromShortName) {
    owFromAirpShortName.textContent = getstoredDataSM.fromShortName;
  }

  if (getstoredDataSM.toShortName) {
    owToAirpShortName.textContent = getstoredDataSM.toShortName;
  }

  if (getstoredDataSM.pax) {
    owPax.innerHTML = `<span class="paxcount">${getstoredDataSM.pax}</span> ${
      parseInt(getstoredDataSM.pax) > 1 ? "Passengers" : "Passenger"
    }`;
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
const rwFromAirpShortName = document.querySelector(".rwfashort");
const rwToAirpShortName = document.querySelector(".rwtashort");

function fillInputRound() {
  if (getstoredDataSM.formIdInput) {
    rtFromAirpName.innerHTML = `<span class="light_font">${getstoredDataSM.formIdInput}</span> <span>(${getstoredDataSM.fromShortName})</span>`;
  }
  if (getstoredDataSM.toIdInput) {
    rtToAirpName.innerHTML = `<span class="light_font">${getstoredDataSM.toIdInput}</span> <span>(${getstoredDataSM.toShortName})</span>`;
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

  if (getstoredDataSM.fromShortName) {
    rwFromAirpShortName.textContent = getstoredDataSM.fromShortName;
  }

  if (getstoredDataSM.toShortName) {
    rwToAirpShortName.textContent = getstoredDataSM.toShortName;
  }

  if (getstoredDataSM.dateAsText) {
    rtFormatedDate.textContent = `${formatDate(
      getstoredDataSM.dateAsText
    )} - ${formatDate(getstoredDataSM.returnDateAsText)}`;
  }

  if (getstoredDataSM.pax) {
    rtPax.innerHTML = `<span class="paxcount">${
      getstoredDataSM.pax
    }</span> ${parseInt(getstoredDataSM.pax) > 1 ? "Passengers" : "Passenger"}`;
  }
}


// for multicity
if (getstoredDataSM.way === "multi-city") {
  const isAnyArrayEmpty = 
    (getstoredDataSM.fromId && getstoredDataSM.fromId.length === 0) ||
    (getstoredDataSM.toId && getstoredDataSM.toId.length === 0) ||
    (getstoredDataSM.formIdInput && getstoredDataSM.formIdInput.length === 0) ||
    (getstoredDataSM.toIdInput && getstoredDataSM.toIdInput.length === 0) ||
    (getstoredDataSM.fromShortName && getstoredDataSM.fromShortName.length === 0) ||
    (getstoredDataSM.toShortName && getstoredDataSM.toShortName.length === 0) ||
    (getstoredDataSM.dateAsText && getstoredDataSM.dateAsText.length === 0) ||
    (getstoredDataSM.pax && getstoredDataSM.pax.length === 0);

  if (isAnyArrayEmpty) {
    const searchWrapper = document.querySelector(".search_mobile_wrapper");
    if (searchWrapper) {
      searchWrapper.innerHTML = "<p>Please add new flight and search</p>";
    }
  }
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
         <div class="mspop_cnt_box frompopup">
            <p>From</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269ccb9fc2ec39c70ca_plan_icon1.png"
                  alt="icon"
                  />
               </div>
               <p class="mcfaname fromairportname"><span class="light_font">${
                 getstoredDataSM.formIdInput[i]
               }</span> <span>(${getstoredDataSM.fromShortName[i]})</span></p>
               <p class="mcfaid fromairportid">${getstoredDataSM.fromId[i]}</p>
               <p class="mcfashort fromairportshortcode">${
                 getstoredDataSM.fromShortName[i]
               }</p>
            </div>
         </div>
         <div class="mspop_cnt_box topopup">
            <p>To <img src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269992d97759a2c5742_dblarrow.png" alt="" /></p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/692992693227baee55527900_plan_icon2.png"
                  alt="icon"
                  />
               </div>
               <p class="mctaname toairportname"> <span class="light_font">${
                 getstoredDataSM.toIdInput[i]
               } </span> <span>(${getstoredDataSM.toShortName[i]})</span></p>
               <p class="mctaid toairportid">${getstoredDataSM.toId[i]}</p>
               <p class="mctashort toairportshortcode">${
                 getstoredDataSM.toShortName[i]
               }</p>
            </div>
         </div>
         <div class="mspop_cnt_box datepopup">
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
               <p class="mcpax"><span class="paxcount">${
                 getstoredDataSM.pax[i]
               }</span> ${
      parseInt(getstoredDataSM.pax[i]) > 1 ? "Passengers" : "Passenger"
    }</p>
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
    const predefineBlock = document.querySelector(".multicity_predefine");
    const isPredefineVisible = predefineBlock && predefineBlock.style.display !== "none";
    
    if (currentFlights.length >= 10) {
      alert("You can not add more flights");
      return;
    }
    
    // Calculate next flight number based on existing flights
    let nextFlightNumber;
    if (currentFlights.length > 0) {
      // Find the highest flight number from existing flights
      const flightNumbers = Array.from(currentFlights).map(flight => {
        const flightText = flight.querySelector('.flight_heading p').textContent;
        const match = flightText.match(/Flight (\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      nextFlightNumber = Math.max(...flightNumbers) + 1;
    } else {
      // If no .multicity_wrapping exists, check if predefined Flight 1 is visible
      // If visible, next is Flight 2; if hidden (cleared), start from Flight 1
      nextFlightNumber = isPredefineVisible ? 2 : 1;
    }

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
         <div class="mspop_cnt_box frompopup">
            <p>From</p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269ccb9fc2ec39c70ca_plan_icon1.png"
                  alt="icon"
                  />
               </div>
               <p class="mcfaname fromairportname">Select airport</p>
               <p class="mcfaid fromairportid"></p>
               <p class="mcfashort fromairportshortcode"></p>
            </div>
         </div>
         <div class="mspop_cnt_box topopup">
            <p>To <img src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69299269992d97759a2c5742_dblarrow.png" alt="" /></p>
            <div class="mspop_cnt_item">
               <div class="mspop_cnt_item_icon">
                  <img
                  src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/692992693227baee55527900_plan_icon2.png"
                  alt="icon"
                  />
               </div>
               <p class="mctaname toairportname">Select airport</p>
               <p class="mctaid toairportid"></p>
               <p class="mctashort toairportshortcode"></p>
            </div>
         </div>
         <div class="mspop_cnt_box datepopup">
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
        storedData.fromShortName.splice(flightIndex, 1);
        storedData.toShortName.splice(flightIndex, 1);
        storedData.dateAsText.splice(flightIndex, 1);
        storedData.pax.splice(flightIndex, 1);

        sessionStorage.setItem("storeData", JSON.stringify(storedData));

        const isAnyArrayEmpty = 
          (storedData.fromId && storedData.fromId.length === 0) ||
          (storedData.toId && storedData.toId.length === 0) ||
          (storedData.formIdInput && storedData.formIdInput.length === 0) ||
          (storedData.toIdInput && storedData.toIdInput.length === 0) ||
          (storedData.fromShortName && storedData.fromShortName.length === 0) ||
          (storedData.toShortName && storedData.toShortName.length === 0) ||
          (storedData.dateAsText && storedData.dateAsText.length === 0) ||
          (storedData.pax && storedData.pax.length === 0);

        if (isAnyArrayEmpty) {
          const searchWrapper = document.querySelector(".search_mobile_wrapper");
          if (searchWrapper) {
            searchWrapper.innerHTML = "<p>Please add new flight and search</p>";
          }
        }
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

// Calendar Implementation
document.addEventListener("DOMContentLoaded", function () {
  const daysTag = document.querySelector(".days-grid");
  const currentDateText = document.querySelector("#current-month-year");
  const prevNextIcon = document.querySelectorAll(".month-nav button");
  const displayDateText = document.getElementById("display-date-text");
  const saveBtn = document.querySelector(".save-btn");

  let date = new Date();
  let currYear = date.getFullYear();
  let currMonth = date.getMonth();
  
  // Selection state
  let startDate = null; // { day, month, year }
  let endDate = null;   // { day, month, year }
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to compare dates
  const isSameDate = (d1, d2) => d1 && d2 && d1.day === d2.day && d1.month === d2.month && d1.year === d2.year;
  const isBefore = (d1, d2) => {
    if (d1.year !== d2.year) return d1.year < d2.year;
    if (d1.month !== d2.month) return d1.month < d2.month;
    return d1.day < d2.day;
  };
  const isAfter = (d1, d2) => isBefore(d2, d1);
  
  const getSelectionMode = () => {
    // Check tab button
    const activeTab = document.querySelector(".ms_tab_item.active");
    if (activeTab && activeTab.getAttribute("data-item") === "mstabroundtrip") {
      return "range";
    }
    // Check tab content (fallback)
    const roundTripContent = document.getElementById("mstabroundtrip");
    if (roundTripContent && roundTripContent.classList.contains("active")) {
        return "range";
    }
    return "single";
  };

  const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();

    let liTag = "";

    // Current Month days
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Previous Month padding
    const prevMonthYear = currMonth === 0 ? currYear - 1 : currYear;
    const prevMonth = currMonth === 0 ? 11 : currMonth - 1;

    for (let i = firstDayofMonth; i > 0; i--) {
      const day = lastDayofLastMonth - i + 1;
      const dateToCheck = new Date(prevMonthYear, prevMonth, day);
      const isPast = dateToCheck < today;
      
      let className = "prev-month-day";
      let clickEvent = "";
      
      if (isPast) {
        className += " disabled";
      } else {
        const currentDayObj = { day: day, month: prevMonth, year: prevMonthYear };
        
        if (isSameDate(currentDayObj, startDate)) {
          className += " active";
          if (endDate) className += " range-start";
        } else if (isSameDate(currentDayObj, endDate)) {
          className += " active range-end";
        } else if (startDate && endDate && isAfter(currentDayObj, startDate) && isBefore(currentDayObj, endDate)) {
          className += " in-range";
        }
        
        clickEvent = `data-day="${day}" data-month="${prevMonth}" data-year="${prevMonthYear}"`;
      }
      
      liTag += `<li class="${className}" ${clickEvent}>${day}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      const dateToCheck = new Date(currYear, currMonth, i);
      const isPast = dateToCheck < today;
      
      let className = "";
      let clickEvent = "";
      
      const currentDayObj = { day: i, month: currMonth, year: currYear };

      if (isPast) {
        className = "disabled";
      } else {
        // Determine classes based on selection
        if (isSameDate(currentDayObj, startDate)) {
          className += " active";
          if (endDate) className += " range-start";
        } else if (isSameDate(currentDayObj, endDate)) {
          className += " active range-end";
        } else if (startDate && endDate && isAfter(currentDayObj, startDate) && isBefore(currentDayObj, endDate)) {
          className += " in-range";
        }
        
        clickEvent = `data-day="${i}" data-month="${currMonth}" data-year="${currYear}"`;
      }

      liTag += `<li class="${className}" ${clickEvent}>${i}</li>`;
    }

    // Next Month padding
    const nextMonth = currMonth === 11 ? 0 : currMonth + 1;
    const nextMonthYear = currMonth === 11 ? currYear + 1 : currYear;

    for (let i = lastDayofMonth; i < 6; i++) {
      const day = i - lastDayofMonth + 1;
      const dateToCheck = new Date(nextMonthYear, nextMonth, day);
      const isPast = dateToCheck < today;
      
      let className = "next-month-day";
      let clickEvent = "";
      
      const currentDayObj = { day: day, month: nextMonth, year: nextMonthYear };

      if (isPast) {
        className = "disabled";
      } else {
         if (isSameDate(currentDayObj, startDate)) {
          className += " active";
          if (endDate) className += " range-start";
        } else if (isSameDate(currentDayObj, endDate)) {
          className += " active range-end";
        } else if (startDate && endDate && isAfter(currentDayObj, startDate) && isBefore(currentDayObj, endDate)) {
          className += " in-range";
        }
        
        clickEvent = `data-day="${day}" data-month="${nextMonth}" data-year="${nextMonthYear}"`;
      }

      liTag += `<li class="${className}" ${clickEvent}>${day}</li>`;
    }

    currentDateText.innerText = `${months[currMonth].toUpperCase()}, ${currYear}`;
    daysTag.innerHTML = liTag;
    
    // Attach click listeners to new elements
    document.querySelectorAll(".days-grid li:not(.inactive):not(.disabled)").forEach(li => {
      li.addEventListener("click", () => {
        const d = parseInt(li.getAttribute("data-day"));
        const m = parseInt(li.getAttribute("data-month"));
        const y = parseInt(li.getAttribute("data-year"));
        handleDateClick(d, m, y);
      });
    });
    
    updateDisplay();
  };

  const handleDateClick = (day, month, year) => {
    const clickedDate = { day, month, year };
    const mode = getSelectionMode();

    if (mode === "single") {
      startDate = clickedDate;
      endDate = null;
    } else {
      // Range mode
      if (!startDate || (startDate && endDate)) {
        // Start new range
        startDate = clickedDate;
        endDate = null;
      } else {
        // Completing a range
        if (isBefore(clickedDate, startDate)) {
          // Clicked before start, so it becomes new start
          startDate = clickedDate;
        } else if (isSameDate(clickedDate, startDate)) {
            // Clicked same date, do nothing or toggle? Let's keep it as start
        } else {
          endDate = clickedDate;
        }
      }
    }
    renderCalendar();
  };

  const updateDisplay = () => {
    const returnDateDisplay = document.querySelector(".return-date-display");
    const displayReturnDateText = document.getElementById("display-return-date-text");
    const mode = getSelectionMode();

    if (mode === "range") {
        if (returnDateDisplay) {
            returnDateDisplay.style.display = "block";
            // Ensure it's visible even if inline style says none
            returnDateDisplay.style.removeProperty("display");
            returnDateDisplay.style.display = "block"; 
        }
    } else {
        if (returnDateDisplay) returnDateDisplay.style.display = "none";
    }

    const formatDate = (d) => {
      const dateObj = new Date(d.year, d.month, d.day);
      return dateObj.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    };

    if (!startDate) {
      displayDateText.innerText = "Select a date";
      if (displayReturnDateText) displayReturnDateText.innerText = "Select a date";
      return;
    }

    displayDateText.innerText = formatDate(startDate);

    if (endDate) {
      if (displayReturnDateText) displayReturnDateText.innerText = formatDate(endDate);
    } else {
      if (displayReturnDateText) displayReturnDateText.innerText = "Select a date";
    }
  };

  prevNextIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      currMonth = icon.id === "prev-btn" ? currMonth - 1 : currMonth + 1;

      if (currMonth < 0 || currMonth > 11) {
        currYear = icon.id === "prev-btn" ? currYear - 1 : currYear + 1;
        currMonth = currMonth < 0 ? 11 : 0;
      }
      renderCalendar();
    });
  });

  // Initial render
  renderCalendar();
  
  // Handle Save
  saveBtn.addEventListener("click", () => {
    if (!startDate) return;
    
    const formatDateStr = (d) => {
        const dateObj = new Date(d.year, d.month, d.day);
        return dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    };

    const formatDateText = (d) => {
        const dateObj = new Date(d.year, d.month, d.day);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (window.currentClickedPopup) {
        const container = window.currentClickedPopup;
        
        // One Way / Multi-city
        const dateFormatted = container.querySelector(".owdateformated, .mcdateformated");
        const dateAsText = container.querySelector(".owdateastext, .mcdateastext");
        
        // Round Trip
        const rwDateFormatted = container.querySelector(".rwdateformated");
        const rwDateAsText = container.querySelector(".rwdateastext");
        const rwReturnDate = container.querySelector(".rwreturndate");
        
        if (getSelectionMode() === "range") {
            if (rwDateFormatted) {
                if (endDate) {
                    rwDateFormatted.textContent = `${formatDateStr(startDate)} - ${formatDateStr(endDate)}`;
                } else {
                    rwDateFormatted.textContent = formatDateStr(startDate);
                }
            }
            if (rwDateAsText) rwDateAsText.textContent = formatDateText(startDate);
            if (rwReturnDate && endDate) rwReturnDate.textContent = formatDateText(endDate);
        } else {
            if (dateFormatted) dateFormatted.textContent = formatDateStr(startDate);
            if (dateAsText) dateAsText.textContent = formatDateText(startDate);
            
            // Also handle round trip if it was somehow in single mode or just updating start
             if (rwDateFormatted) rwDateFormatted.textContent = formatDateStr(startDate);
             if (rwDateAsText) rwDateAsText.textContent = formatDateText(startDate);
        }
    }
    
    document.querySelector(".date_popup").style.display = "none";
  });
  
  // Reset calendar when opening popup
  document.addEventListener("click", function(e) {
      if (e.target.closest(".datepopup")) {
          // Reset to current date
          const now = new Date();
          startDate = { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
          endDate = null;
          
          // Reset view to current month
          currMonth = now.getMonth();
          currYear = now.getFullYear();
          
          renderCalendar();
      }
  });
});

// PAX Popup Logic
(function() {
    const paxPopup = document.querySelector(".pax_popup");
    const paxPopupClose = document.querySelector(".pax_popup_header .msp_header_icon");
    const savePaxBtn = document.querySelector(".save-pax-btn");
    let currentPaxElement = null;

    // Open PAX Popup (Event Delegation)
    document.addEventListener("click", function(e) {
       // Check if the clicked element is inside a pax container
       const paxItem = e.target.closest(".mspop_cnt_item");
       
       if (paxItem) {
           const paxTextElement = paxItem.querySelector(".owpax, .rwpax, .mcpax");
           
           if (paxTextElement) {
               currentPaxElement = paxTextElement;
               
               if (paxPopup) paxPopup.style.display = "block";
           }
       }
    });

    // Close PAX Popup
    if (paxPopupClose) {
        paxPopupClose.addEventListener("click", function() {
            if (paxPopup) paxPopup.style.display = "none";
        });
    }

    // Handle Counters
    const counters = document.querySelectorAll(".pax_counter");
    counters.forEach(counter => {
        const minusBtn = counter.querySelector(".pax_minus");
        const plusBtn = counter.querySelector(".pax_plus");
        const countSpan = counter.querySelector(".pax_count");

        minusBtn.addEventListener("click", function() {
            let count = parseInt(countSpan.textContent);
            if (count > 0) {
                count--;
                countSpan.textContent = count;
            }
        });

        plusBtn.addEventListener("click", function() {
            let count = parseInt(countSpan.textContent);
            count++;
            countSpan.textContent = count;
        });
    });

    // Save Passengers
    if (savePaxBtn) {
        savePaxBtn.addEventListener("click", function() {
            let totalPax = 0;
            
            document.querySelectorAll(".pax_count").forEach(span => {
                const count = parseInt(span.textContent);
                totalPax += count;
            });

            if (totalPax === 0) {
                alert("add atletast 1 passenger");
                return;
            }

            if (currentPaxElement) {
                let text = `<span class="paxcount">${totalPax}</span> ${
                  totalPax > 1 ? "Passengers" : "Passenger"
                }`;
                currentPaxElement.innerHTML = text;
            }

            if (paxPopup) paxPopup.style.display = "none";
        });
    }
})();


// update session storage and display new search result
// ✅ One Way Submission
document
  .querySelector(".oneway_search_btn")
  .addEventListener("click", function () {
    const formIdInput = document.querySelector(
      ".owfaname span.light_font"
    ).textContent;
    const toIdInput = document.querySelector(".owtaname span.light_font").textContent;
    const fromId = document.querySelector(".owfaid").textContent;
    const toId = document.querySelector(".owtaid").textContent;
    const dateAsText = document.querySelector(".owdateastext").textContent;
    const timeAsText = "00:00:00";
    const pax = document.querySelector("#mstaboneway .paxcount").textContent;
    const appDate = dateAsText;
    const fromShortName = document.querySelector(".owfashort").textContent;
    const toShortName = document.querySelector(".owtashort").textContent;
    const timeStamp = getUnixTimestamp(dateAsText, timeAsText);

    console.log("way :", "one way");
    console.log("formIdInput :", formIdInput);
    console.log("toIdInput :", toIdInput);
    console.log("fromId :", fromId);
    console.log("toId :", toId);
    console.log("dateAsText :", dateAsText);
    console.log("timeAsText :", timeAsText);
    console.log("pax :", pax);
    console.log("appDate :", appDate);
    console.log("timeStamp :", timeStamp);
    console.log("fromShortName :", fromShortName);
    console.log("toShortName :", toShortName);

    if (
      fromId &&
      toId &&
      dateAsText &&
      pax &&
      formIdInput &&
      toIdInput &&
      fromShortName &&
      toShortName
    ) {
      const storeData = {
        way: "one way",
        fromId,
        toId,
        dateAsText,
        timeAsText,
        pax,
        appDate,
        timeStamp,
        formIdInput,
        toIdInput,
        fromShortName,
        toShortName,
      };

      sessionStorage.setItem("storeData", JSON.stringify(storeData));
      // window.location.href = `/aircraft`;
    } else {
      alert("Please fill up the form properly");
    }
  });


  // ✅ Round Trip Submission
document
  .querySelector(".round_search_btn")
  .addEventListener("click", function () {
    const formIdInput = document.querySelector(".rwfaname span.light_font").textContent;
    const toIdInput = document.querySelector(
      ".rwtaname span.light_font"
    ).textContent;

    const fromInputReturn = document.querySelector(
      ".rwtaname span.light_font"
    ).textContent;
    const toInputReturn = document.querySelector(
      ".rwfaname span.light_font"
    ).textContent;

    const fromId = document.querySelector(".rwfaid").textContent;
    const toId = document.querySelector(".rwtaid").textContent;

    const returnFromId = document.querySelector(".rwtaid").textContent;
    const returnToId = document.querySelector(".rwfaid").textContent;

    const dateAsText = document.querySelector(".rwdateastext").textContent;
    const returnDateAsText = document.querySelector(".rwreturndate").textContent;

    const timeAsText = "00:00:00";
    const timeAsTextReturn = "00:00:00";

    const pax = document.querySelector("#mstabroundtrip .paxcount").textContent;
    const paxReturn = pax;

    const appDate = dateAsText;
    const appDateReturn = returnDateAsText;

    const timeStamp = getUnixTimestamp(dateAsText, timeAsText);
    const timeStampReturn = getUnixTimestamp(
      returnDateAsText,
      timeAsTextReturn
    );

    const fromShortName = document.querySelector(".rwfashort").textContent;
    const toShortName = document.querySelector(".rwtashort").textContent;

    console.log("way :", "round trip");
    console.log("formIdInput :", formIdInput);
    console.log("toIdInput :", toIdInput);
    console.log("fromInputReturn :", fromInputReturn);
    console.log("toInputReturn :", toInputReturn);
    console.log("fromId :", fromId);
    console.log("toId :", toId);
    console.log("returnFromId :", returnFromId);
    console.log("returnToId :", returnToId);
    console.log("dateAsText :", dateAsText);
    console.log("returnDateAsText :", returnDateAsText);
    console.log("timeAsText :", timeAsText);
    console.log("timeAsTextReturn :", timeAsTextReturn);
    console.log("pax :", pax);
    console.log("paxReturn :", paxReturn);
    console.log("appDate :", appDate);
    console.log("appDateReturn :", appDateReturn);
    console.log("timeStamp :", timeStamp);
    console.log("timeStampReturn :", timeStampReturn);
    console.log("fromShortName :", fromShortName);
    console.log("toShortName :", toShortName);

    if (
      formIdInput &&
      toIdInput &&
      dateAsText &&
      returnDateAsText &&
      pax &&
      fromShortName &&
      toShortName
    ) {
      const storeData = {
        way: "round trip",
        formIdInput,
        toIdInput,
        fromInputReturn,
        toInputReturn,
        fromId,
        toId,
        returnFromId,
        returnToId,
        dateAsText,
        returnDateAsText,
        timeAsText,
        timeAsTextReturn,
        pax,
        paxReturn,
        appDate,
        appDateReturn,
        timeStamp,
        timeStampReturn,
        fromShortName,
        toShortName,
      };

      sessionStorage.setItem("storeData", JSON.stringify(storeData));
      // window.location.href = `/aircraft`;
    } else {
      alert("Please fill up the form properly");
    }
  });


// ✅ Multi-City Submission
document
  .querySelector(".multicity_search_btn")
  .addEventListener("click", function () {
    const containers = [];
    const predefine = document.querySelector(".multicity_predefine");
    if (predefine && predefine.offsetParent !== null) {
        containers.push(predefine);
    }
    document.querySelectorAll(".multicity_wrapping").forEach(el => containers.push(el));

    let storeFormPort = [],
      storeToPort = [],
      storeFormId = [],
      storeToId = [];
    let storeDate = [],
      storeAppDate = [],
      storeTime = [],
      storePax = [];
    let storeFromShortName = [],
      storeToShortName = [];
    let multiUnixTime = [];
    
    let isValid = true;
    const timeAsText = "00:00:00";

    containers.forEach((container) => {
        const fromPort = container.querySelector(".mcfaname span.light_font")?.textContent;
        const toPort = container.querySelector(".mctaname span.light_font")?.textContent;
        const fromId = container.querySelector(".mcfaid")?.textContent;
        const toId = container.querySelector(".mctaid")?.textContent;
        const dateText = container.querySelector(".mcdateastext")?.textContent;
        const pax = container.querySelector(".paxcount")?.textContent;
        const fromShort = container.querySelector(".mcfashort")?.textContent;
        const toShort = container.querySelector(".mctashort")?.textContent;

        if (fromPort && toPort && fromId && toId && dateText && pax && fromShort && toShort) {
            storeFormPort.push(fromPort);
            storeToPort.push(toPort);
            storeFormId.push(fromId);
            storeToId.push(toId);
            storeDate.push(dateText);
            storeAppDate.push(dateText);
            storeTime.push(timeAsText);
            storePax.push(pax);
            storeFromShortName.push(fromShort);
            storeToShortName.push(toShort);
            multiUnixTime.push(getUnixTimestamp(dateText, timeAsText));
        } else {
            isValid = false;
        }
    });

    console.log("way :", "multi-city");
    console.log("fromId :", storeFormId);
    console.log("toId :", storeToId);
    console.log("dateAsText :", storeDate);
    console.log("timeAsText :", storeTime);
    console.log("pax :", storePax);
    console.log("appDate :", storeAppDate);
    console.log("timeStamp :", multiUnixTime);
    console.log("formIdInput :", storeFormPort);
    console.log("toIdInput :", storeToPort);
    console.log("fromShortName :", storeFromShortName);
    console.log("toShortName :", storeToShortName);

    if (isValid && containers.length > 0) {
      const storeData = {
        way: "multi-city",
        fromId: storeFormId,
        toId: storeToId,
        dateAsText: storeDate,
        timeAsText: storeTime,
        pax: storePax,
        appDate: storeAppDate,
        timeStamp: multiUnixTime,
        formIdInput: storeFormPort,
        toIdInput: storeToPort,
        fromShortName: storeFromShortName,
        toShortName: storeToShortName,
      };

      sessionStorage.setItem("storeData", JSON.stringify(storeData));
      // window.location.href = `/aircraft`;
    } else {
      alert("Please fill up the form properly.");
    }
  });
