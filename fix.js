//fix.js
document.addEventListener("DOMContentLoaded", function () {
  function initializePaxBlock(empaxWrapper) {
    const minusBtn = empaxWrapper.querySelector(".empax_minus");
    const plusBtn = empaxWrapper.querySelector(".empax_plus");
    const input = empaxWrapper.querySelector(".expaxinput");
    if (
      !input.value ||
      isNaN(parseInt(input.value, 10)) ||
      parseInt(input.value, 10) < 0
    ) {
      input.value = "0";
    }
    if (parseInt(input.value, 10) <= 0) {
      minusBtn.classList.add("disabled");
    } else {
      minusBtn.classList.remove("disabled");
    }
    plusBtn.addEventListener("click", function () {
      let currentValue = parseInt(input.value, 10) || 0;
      currentValue += 1;
      input.value = currentValue;
      if (currentValue > 0) {
        minusBtn.classList.remove("disabled");
      }
    });
    minusBtn.addEventListener("click", function () {
      let currentValue = parseInt(input.value, 10) || 0;
      if (currentValue > 0) {
        currentValue -= 1;
        input.value = currentValue;
        if (currentValue <= 0) {
          minusBtn.classList.add("disabled");
        }
      }
    });
  }

  const empaxWrappers = document.querySelectorAll(".empax_wrapper");
  empaxWrappers.forEach(function (wrapper) {
    initializePaxBlock(wrapper);
  });
  const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            const newWrappers = node.querySelectorAll(".empax_wrapper");
            newWrappers.forEach(function (newWrapper) {
              initializePaxBlock(newWrapper);
            });
            if (node.classList.contains("empax_wrapper")) {
              initializePaxBlock(node);
            }
          }
        });
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

document.addEventListener("DOMContentLoaded", function () {
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
                  <p class="short-name">${escapeHTML(
                    hit["AirportNameShort"]
                  )}</p>
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
  }, 300); // 300ms debounce delay

  // Function to handle click events on search results
  function handleClick(event) {
    const portElement = event.target.closest(".port");
    if (portElement) {
      const emfieldname = portElement.querySelector(".emfieldname").textContent;
      const uniqueid = portElement.querySelector(".uniqueid").textContent;
      const shortname = portElement.querySelector(".short-name").textContent;

      // Find the corresponding input and .portid
      const eminputBlock = portElement.closest(".eminputblock");
      const input = eminputBlock.querySelector(".algolio_input");
      const portidElement = eminputBlock.querySelector(".portid");
      const shortNameElement = eminputBlock.querySelector(".shortairportcode");
      input.value = emfieldname;
      portidElement.textContent = uniqueid;
       shortNameElement.textContent = shortname;
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

  // Handle adding new forms dynamically
  let numForms;
  document
    .querySelector(".emsubmit.add-search-input")
    .addEventListener("click", function () {
      const algolioWrapper = document.querySelector(".algolio_wrapper");
      numForms = algolioWrapper.querySelectorAll(".algolio_length").length;

      if (numForms > 9) {
        this.classList.add("noentry");
        this.querySelector("span").textContent = "You can not add more than 10";
      } else {
        const newFormNumber = numForms + 1;
        const newForm = document.createElement("form");
        newForm.className = "algolio_length";
        newForm.setAttribute("autocomplete", "off");
        newForm.innerHTML = `<div class="emform generated">
          <div class="eminputblock">
            <label>From</label>
            <div class="eminput_field">
              <input
                class="algolio_input multicityform"
                type="text"
              />
              <p class="portid multicityformid"></p>
              <img
                src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6730586b420dae5eaf21e2eb_gps.png"
                alt="GPS Icon"
              />
            </div>
            <div class="search-results"></div>
          </div>
          <div class="eminputblock">
            <label>To</label>
            <div class="eminput_field">
              <input
                class="algolio_input multicityto"
                type="text"
              />
              <p class="portid multicitytoid"></p>
              <img
                src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6730586b420dae5eaf21e2eb_gps.png"
                alt="GPS Icon"
              />
            </div>
            <div class="search-results"></div>
          </div>
          <div class="eminputblock">
            <label>Date</label>
            <div class="eminput_field">
              <input class="multicitydate" type="date" />
            </div>
          </div>
          <div class="eminputblock">
            <label>PAX</label>
            <div class="eminput_field">
              <div class="empax_wrapper">
                <div class="empax_minus">-</div>
                <input class="expaxinput multicitypax" type="text" value="1" readonly />
                <div class="empax_plus">+</div>
              </div>
            </div>
          </div>
          <div class="remove"><img src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6766e051a4e47b7d94159c59_x-square.svg" alt="" /></div>
        </div>`;
        algolioWrapper.appendChild(newForm);
        console.log(`Added new form number ${newFormNumber}`);
        attachListeners(newForm.closest(".algolio_wrapper"));
      }
    });

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

  // Observe DOM for dynamically added .algolio_wrapper elements and attach listeners
  const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const newWrappers = node.querySelectorAll(".algolio_wrapper");
            newWrappers.forEach((wrapper) => {
              attachListeners(wrapper);
            });
            if (node.classList.contains("algolio_wrapper")) {
              attachListeners(node);
            }
          }
        });
      }
    }
  });

  document
    .querySelector(".removeadded")
    .addEventListener("click", function (e) {
      const removeBtn = e.target.closest(".remove");
      if (removeBtn) {
        if (numForms <= 10) {
          document
            .querySelector(".add-search-input")
            .classList.remove("noentry");
          document.querySelector(".add-search-input span").textContent =
            "ADD LEG";
        }
        const emform = removeBtn.closest(".algolio_length");
        if (emform) {
          emform.remove();
        }
      }
    });

  observer.observe(document.body, { childList: true, subtree: true });
});
