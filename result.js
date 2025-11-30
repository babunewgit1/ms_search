// select dom element for One way trip
const addWay = document.querySelector(".sa_way_name");
const flightWay = document.querySelectorAll(".sa_way_name_list");
const formIdInput = document.querySelector("input.onewayform");
const toIdInput = document.querySelector(".onewayto");
const fromId = document.querySelector(".onewayformid");
const toId = document.querySelector(".onewaytoid");
const dateAsText = document.querySelector(".onewaydate");
const pax = document.querySelector(".onewaypax");
const searchBox = document.querySelectorAll(".sa_way_search");
const drpDownCollection = document.querySelectorAll(".from_cl_wrapper");

// getting data form session storage
const getsessionDate = sessionStorage.getItem("storeData");
const getstoredData = JSON.parse(getsessionDate);

if (!getstoredData) {
  window.location.href = `/`;
}

// show which way had selected by user
function dropdownList() {
  document.querySelector(".sa_way").addEventListener("click", () => {
    const dropdown = document.querySelector(".sa_way_dropdown");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  });
  addWay.textContent = getstoredData.way;
  flightWay.forEach((flightList) => {
    flightList.addEventListener("click", () => {
      addWay.textContent = flightList.textContent;
      flightList.parentElement.style.display = "none";
    });
  });
}

dropdownList();

// making tab
flightWay.forEach((item) => {
  item.addEventListener("click", () => {
    drpDownCollection.forEach((clItem) => {
      clItem.style.display = "none";
    });

    const wayFlightAttr = item.getAttribute("way");
    searchBox.forEach((search) => {
      const searchAttr = search.getAttribute("id");

      if (wayFlightAttr === searchAttr) {
        search.classList.add("active_way");
      } else {
        search.classList.remove("active_way");
      }
    });
  });
});

//active tab with session storage
if (getstoredData.way === "one way") {
  searchBox.forEach((item) => {
    item.classList.remove("active_way");
    document.getElementById("oneway").classList.add("active_way");
  });
} else if (getstoredData.way === "round trip") {
  searchBox.forEach((item) => {
    item.classList.remove("active_way");
    document.getElementById("twoway").classList.add("active_way");
  });
} else if (getstoredData.way === "multi-city") {
  searchBox.forEach((item) => {
    item.classList.remove("active_way");
    document.getElementById("threeway").classList.add("active_way");
  });
} else {
  console.log("something error");
}

//fill input with session storage data for one way

function fillInputOneWay() {
  if (getstoredData.formIdInput) {
    formIdInput.value = getstoredData.formIdInput;
  }
  if (getstoredData.toIdInput) {
    toIdInput.value = getstoredData.toIdInput;
  }

  if (getstoredData.fromId) {
    fromId.textContent = getstoredData.fromId;
  }

  if (getstoredData.toId) {
    toId.textContent = getstoredData.toId;
  }
  if (getstoredData.dateAsText) {
    dateAsText.value = getstoredData.dateAsText;
  }

  if (getstoredData.pax) {
    pax.value = getstoredData.pax;
  }
}

//fill input with session storage data for roundTrip
const roundFrom = document.querySelector(".rfrom");
const roundTo = document.querySelector(".rto");
const roundDepDate = document.querySelector(".rdepdate");
const roundRetDate = document.querySelector(".rretdate");
const roundPax = document.querySelector(".rpax");
const roundFromId = document.querySelector(".roundfromid");
const roundToTd = document.querySelector(".roundtoid");

function fillInputRound() {
  if (getstoredData.formIdInput) {
    roundFrom.value = getstoredData.formIdInput;
  }
  if (getstoredData.toIdInput) {
    roundTo.value = getstoredData.toIdInput;
  }

  if (getstoredData.fromId) {
    roundFromId.textContent = getstoredData.fromId;
  }

  if (getstoredData.toId) {
    roundToTd.textContent = getstoredData.toId;
  }
  if (getstoredData.dateAsText) {
    roundDepDate.value = getstoredData.dateAsText;
  }
  if (getstoredData.returnDateAsText) {
    roundRetDate.value = getstoredData.returnDateAsText;
  }
  if (getstoredData.pax) {
    roundPax.value = getstoredData.pax;
  }
}

// fill input for multi-city;

if (getstoredData.way === "multi-city") {
  for (let i = 0; i < getstoredData.fromId.length; i++) {
    document.querySelector(".multicity_data").innerHTML += `
    <div class="emform">
          <div class="eminputblock">
          <label>From</label>
            <div class="eminput_field">
              <input
                class="algolio_input multicityform"
                type="text"
                value="${getstoredData.formIdInput[i]}"
              />
              <p class="portid multicityformid">${getstoredData.fromId[i]}</p>
              <img
                src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6730586b420dae5eaf21e2eb_gps.png"
                alt="GPS Icon"
                style="cursor: pointer;"
              />
            </div>
          </div>
          <div class="eminputblock">
          <label>To</label>
            <div class="eminput_field">
              <input
                class="algolio_input multicityto"
                type="text"
                value="${getstoredData.toIdInput[i]}"
              />
              <p class="portid multicitytoid">${getstoredData.toId[i]}</p>
              <img
                src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/6730586b420dae5eaf21e2eb_gps.png"
                alt="GPS Icon"
                style="cursor: pointer;"
              />
            </div>
          </div>
          <div class="eminputblock">
          <label>Date</label>
            <div class="eminput_field">
              <input class="multicitydate" type="date" value="${getstoredData.dateAsText[i]}" />
            </div>
          </div>
          <div class="eminputblock">
          <label>PAX</label>
            <div class="eminput_field">
              <div class="empax_wrapper">
                <div class="empax_minus">-</div>
                <input class="expaxinput multicitypax" type="text" value="${getstoredData.pax[i]}"  readonly />
                <div class="empax_plus">+</div>
              </div>
            </div>
          </div>
        </div>
    `;
  }
}

// reset multi_city data which is generated form session storage
const resetBtn = document.querySelector(".reset");
const removeData = document.querySelector(".multicity_data");
const multiCityFormElement = document.querySelector(".mcity_none");
if (getstoredData.way === "multi-city") {
  multiCityFormElement.style.display = "none";
} else {
  multiCityFormElement.style.display = "block";
  resetBtn.style.display = "none";
}

resetBtn.addEventListener("click", function () {
  removeData.remove();
  resetBtn.style.display = "none";
  multiCityFormElement.style.display = "block";
});

if (getstoredData.way === "one way") {
  fillInputOneWay();
}

if (getstoredData.way === "round trip") {
  fillInputRound();
}

// send data to session storage
// ✅ Helper function for consistent and Safari-safe timestamp
function getUnixTimestamp(dateStr, timeStr = "00:00:00") {
  const isoString = `${dateStr}T${timeStr}`;
  const date = new Date(isoString);
  return Math.floor(date.getTime());
}

const oneWaySubmit = document.querySelector(".onewaysubmit");
const roundTripSubmit = document.querySelector(".roundtrip");
const multiCitySubmit = document.querySelector(".multicity_submit");

// ✅ One Way Submission
oneWaySubmit.addEventListener("click", function () {
  const formIdInput = document.querySelector("input.onewayform").value;
  const toIdInput = document.querySelector("input.onewayto").value;
  const fromId = document.querySelector(".onewayformid").textContent;
  const toId = document.querySelector(".onewaytoid").textContent;
  const dateAsText = document.querySelector(".onewaydate").value;
  const timeAsText = "00:00:00";
  const pax = document.querySelector(".onewaypax").value;
  const appDate = dateAsText;

  const timeStamp = getUnixTimestamp(dateAsText, timeAsText);

  if (fromId && toId && dateAsText && pax && formIdInput && toIdInput) {
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
    };

    sessionStorage.setItem("storeData", JSON.stringify(storeData));
    window.location.href = `/aircraft`;
  } else {
    alert("Please fill up the form properly");
  }
});

// ✅ Round Trip Submission
roundTripSubmit.addEventListener("click", function () {
  const formIdInput = document.querySelector(".rfrom").value;
  const toIdInput = document.querySelector(".rto").value;

  const fromInputReturn = document.querySelector(".rto").value;
  const toInputReturn = document.querySelector(".rfrom").value;

  const fromId = document.querySelector(".roundfromid").textContent;
  const toId = document.querySelector(".roundtoid").textContent;

  const returnFromId = document.querySelector(".roundtoid").textContent;
  const returnToId = document.querySelector(".roundfromid").textContent;

  const dateAsText = document.querySelector(".rdepdate").value;
  const returnDateAsText = document.querySelector(".rretdate").value;

  const timeAsText = "00:00:00";
  const timeAsTextReturn = "00:00:00";

  const pax = document.querySelector(".rpax").value;
  const paxReturn = pax;

  const appDate = dateAsText;
  const appDateReturn = returnDateAsText;

  const timeStamp = getUnixTimestamp(dateAsText, timeAsText);
  const timeStampReturn = getUnixTimestamp(returnDateAsText, timeAsTextReturn);

  if (formIdInput && toIdInput && dateAsText && returnDateAsText && pax) {
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
    };

    sessionStorage.setItem("storeData", JSON.stringify(storeData));
    window.location.href = `/aircraft`;
  } else {
    alert("Please fill up the form properly");
  }
});

// ✅ Multi-City Submission
multiCitySubmit.addEventListener("click", function () {
  const multiFormPort = document.querySelectorAll(".multicityform");
  const multiToPort = document.querySelectorAll(".multicityto");
  const multiFormId = document.querySelectorAll(".multicityformid");
  const multiToId = document.querySelectorAll(".multicitytoid");
  const multiDateAsText = document.querySelectorAll(".multicitydate");
  const multiPax = document.querySelectorAll(".multicitypax");
  const timeAsText = "00:00:00";

  let multiUnixTime = [];
  let checkFormPort = true,
    checkToPort = true,
    checkFormId = true,
    checkToId = true;
  let checkDate = true,
    checkPax = true;

  let storeFormPort = [],
    storeToPort = [],
    storeFormId = [],
    storeToId = [];
  let storeDate = [],
    storeAppDate = [],
    storeTime = [],
    storePax = [];

  multiDateAsText.forEach((item) => {
    if (item.value) {
      storeDate.push(item.value);
      storeAppDate.push(item.value);
      storeTime.push("00:00:00");
      multiUnixTime.push(getUnixTimestamp(item.value, timeAsText));
    } else {
      checkDate = false;
    }
  });

  multiFormPort.forEach((item) => {
    if (item.value) storeFormPort.push(item.value);
    else checkFormPort = false;
  });

  multiToPort.forEach((item) => {
    if (item.value) storeToPort.push(item.value);
    else checkToPort = false;
  });

  multiFormId.forEach((item) => {
    if (item.textContent) storeFormId.push(item.textContent);
    else checkFormId = false;
  });

  multiToId.forEach((item) => {
    if (item.textContent) storeToId.push(item.textContent);
    else checkToId = false;
  });

  multiPax.forEach((item) => {
    if (item.value) storePax.push(item.value);
    else checkPax = false;
  });

  if (
    checkFormPort &&
    checkToPort &&
    checkFormId &&
    checkToId &&
    checkDate &&
    checkPax
  ) {
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
    };

    sessionStorage.setItem("storeData", JSON.stringify(storeData));
    window.location.href = `/aircraft`;
  } else {
    alert("Please fill up the form properly.");
  }
});

// grid view and list view functionality
const gridView = document.querySelector(".grid_view");
const listView = document.querySelector(".list_view");
const contentWrapper = document.querySelector(".sr_main_right");
const gridAndListView = document.querySelectorAll(".sr_exp_icon_box ");

gridView.addEventListener("click", function () {
  contentWrapper.classList.add("changeview");
  contentWrapper.classList.remove("listview");
});
listView.addEventListener("click", function () {
  contentWrapper.classList.remove("changeview");
  contentWrapper.classList.add("listview");
});

gridAndListView.forEach((view) => {
  view.addEventListener("click", function () {
    gridAndListView.forEach((item) => {
      item.classList.remove("activeview");
    });
    view.classList.add("activeview");
  });
});

// code for broker mode
const brokerModeRadio = document.querySelector(".broker_mode_radio");
const glView = document.querySelector(".sr_exp_right");
const requestBroker = document.querySelector(".request_br_mode");
const brokerChange = document.querySelector(".item_reslt_wrapper");
const mainChanger = document.querySelector(".sr_main_right");

brokerModeRadio.addEventListener("click", function () {
  glView.classList.toggle("hide_view");
  requestBroker.classList.toggle("showbroker");
  brokerChange.classList.toggle("broker_change");
  mainChanger.classList.remove("changeview");
  mainChanger.classList.add("listview");
  document.querySelector(".grid_view").classList.remove("activeview");
  document.querySelector(".list_view ").classList.add("activeview");
  sessionStorage.removeItem("checkedItems");
});

// filter in mobile design
document.querySelector(".new_filter").addEventListener("click", function () {
  document
    .querySelector(".sr_filter_block")
    .classList.add("active_mobile_filter");
  document.querySelector("body").classList.add("overflowfilter");
});

document.querySelector(".cross_img").addEventListener("click", function () {
  document
    .querySelector(".sr_filter_block")
    .classList.remove("active_mobile_filter");
  document.querySelector("body").classList.remove("overflowfilter");
});
