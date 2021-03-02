// fork the navigator.battery object depending on what prefix the viewing browser uses
var battery = navigator.battery;
//|| navigator.mozBattery || navigator.webkitBattery;

// grab the elements we need, and put them in variables
var indicator1 = document.getElementById('indicator1');
var indicator2 = document.getElementById('indicator2');
var batteryCharge = document.getElementById('battery-charge');
var batteryTop = document.getElementById('battery-top');
var chargeIcon = document.getElementById('battery-charging');
var batteryCharged = document.getElementById('battery-charged');
var batteryDischarged = document.getElementById('battery-discharged');

// Flag to check if battery charged/not charged has already been notified once
// 0 for first time of notification, 1 means "charged" has already been notified,
// 1 means "not charged" has already been notified
// This is set to the opposite after each notification, so that you don't keep
// getting repeat notifications about the same charge state.
var chargingState = 0;

function updateBatteryStatus() {
  // battery.level can be used to give us a percentage of bettery charge to report to 
  // the app's user
  var percentage = Math.round(battery.level * 100);
  indicator1.innerHTML = "Battery charge at " + percentage + "%";
  batteryCharge.style.width = percentage + '%';
  batteryCharged.innerHTML = (battery.chargingTime == "Infinity")? "Infinity" : parseInt(battery.chargingTime / 60, 10);
  batteryDischarged.innerHTML = (battery.dischargingTime == "Infinity")? "Infinity" : parseInt(battery.dischargingTime / 60, 10);
  
  if(percentage >= 99) {
    // report that the battery is fully charged, more or less ;-)
    batteryTop.style.backgroundColor = 'limegreen';
    batteryCharge.style.backgroundColor = 'limegreen';

    createNotification("Device battery fully charged.");
  }
  
  if(battery.charging) {
  // If the battery is charging  
    if(chargingState == 1 || chargingState == 0) {
    // and if our chargingState flag is equal to 0 or 1

      // alter the styling to show the battery charging
      batteryTop.style.backgroundColor = 'gold';
      batteryCharge.style.backgroundColor = 'gold';
      indicator2.innerHTML = "Battery is charging"; 
      chargeIcon.style.visibility = 'visible';

      // notify the user with a custom notification
      createNotification("Device battery now charging.");
      
      // flip the chargingState flag to 2 
      chargingState = 2;
    }
  } else if(!battery.charging) {
  // If the battery is NOT charging
    if(chargingState == 2 || chargingState == 0) {
    // and if our chargingState flag is equal to 0 or 2

      // alter the styling to show the battery NOT charging
      batteryTop.style.backgroundColor = '#eee';
      batteryCharge.style.backgroundColor = '#eee';
      indicator2.innerHTML = "Battery not charging";
      chargeIcon.style.visibility = 'hidden';

      // notify the user with a custom notification
      createNotification("Device battery is not charging.");
      
      // flip the chargingState flag to 1
      chargingState = 1;
    }
  }
}



// Event handler to check whether the battery has started charging or stopped charging
battery.addEventListener("chargingchange", updateBatteryStatus, false);
// Event handler to check whether the battery charge level has changed
battery.addEventListener("levelchange", updateBatteryStatus, false);
battery.addEventListener("chargingtimechange", updateBatteryStatus, false);
battery.addEventListener("dischargingtimechange", updateBatteryStatus, false);

// run the central function once when the app is first loaded
updateBatteryStatus();