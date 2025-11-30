const flightData = JSON.parse(sessionStorage.getItem("storeData") || "{}");

// Helper function to format date
function formatDate(dateString) {
  // Parse the date string directly without timezone conversion
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Helper function to create a flight card
function createFlightCard(fromName, toName, date, passengers) {
  return `
          <div class="flight_card">
      <div class="flight_card_left">
        <p>${fromName.toUpperCase()} - ${toName.toUpperCase()}</p>
        <div class="flight_card_left_cnt">
          <div class="fcl_date">
            <div class="fcl_date_icon">
              <img
                src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69297cf8959d73a72ae7e1c6_icon.png"
                alt=""
              />
            </div>
            <div class="fcl_date_text">
              <p>${formatDate(date)}</p>
            </div>
          </div>
          <div class="fcl_pax">
            <div class="fcl_pax_icon">
              <img
                src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69297d656f3f170c84ba8db2_pax.png"
                alt=""
              />
            </div>
            <div class="fcl_pax_number">
              <p>${passengers}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flight_card_right">
        <img
          src="https://cdn.prod.website-files.com/6713759f858863c516dbaa19/69297db62af820959f72a1ed_filtetr.png"
          alt=""
        />
      </div>
    </div>       
        `;
  
}

// Check if data is array (multi-city) or single trip
const isMultiCity = Array.isArray(flightData.fromShortName);
const container = document.getElementById("flightContainer");

if (isMultiCity) {
  // Handle multi-city data (arrays) - show only last flight
  const lastIndex = flightData.fromShortName.length - 1;
  const fromName = flightData.fromShortName[lastIndex];
  const toName = flightData.toShortName[lastIndex];
  const date = flightData.dateAsText[lastIndex];
  const passengers = flightData.pax[lastIndex];

  container.innerHTML = createFlightCard(fromName, toName, date, passengers);
} else {
  // Handle single trip data
  if (flightData.fromShortName && flightData.toShortName) {
    const cardHTML = createFlightCard(
      flightData.fromShortName,
      flightData.toShortName,
      flightData.dateAsText,
      flightData.pax || "0"
    );
    container.innerHTML = cardHTML;
  }
}
