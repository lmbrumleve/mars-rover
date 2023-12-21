import Rover from "./rover.js";
import Message from './message.js';
import Command from './command.js';
import Coordinates from "./coordinates.js";


window.addEventListener("load", function() {
    alert("Welcome to the Mars Rover Simulation experience! Use the RIMFAX tool to search for water on Mars. Good luck!")

//VARIABLES
    const coordinateStatus = document.getElementById("coordinateStatus");
    // const roverXposition = document.getElementById("roverXposition");
    // const roverYposition = document.getElementById("roverYposition");
    const solarChargingButton = document.getElementById("solarCharging");
    const hillClimbingButton = document.getElementById("hillClimbing");
    const rimfaxButton = document.getElementById("rimfax");
    const abortMissionButton = document.getElementById("missionAbort");
    const upButton = document.getElementById("up");
    const downButton = document.getElementById("down");
    const rightButton = document.getElementById("right");
    const leftButton = document.getElementById("left");
    // const roverImage = document.getElementById("rover");
    const waterImage = document.getElementById("water");
    const waterFoundImage = document.getElementById("waterFound");
    const grid = document.getElementById("grid");

    const waterX = Math.ceil((Math.random()*420)/10)*10 //waterX and waterY are random coordinates determined upon initial loading of the page.
    const waterY = Math.ceil((Math.random()*250)/10)*10 //(waterX, waterY) represents the location of water on Mars.

    let gridDivs = ""; //to be used with createGridDivs() 
    let logCoordinatesSearched = []; //An array that will hold all of the coordinates that have already been searched for water. To be used with logSearchStatus().


//Initialize the rover: 
    let marsRover = new Rover(0, 0, "NORMAL", 110);
    console.log(marsRover)

//FUNCTIONS
function status(data) {//status(data) can be used to update the HTML with the current data.
        const markup = 
        `<h3>ROVER STATUS:</h3>
        <table border-spacing="10px">
            <tr>
                <td>Coordinates: (${data.Xposition}m, ${data.Yposition}m)</td>
            </tr>
            <tr>
                <td>Mode: ${data.mode}</td>
            </tr>
            <tr>
                <td>Generator Watts: ${data.generatorWatts}W</td>
            </tr>
        </table>`;

        return markup;
    }
    
coordinateStatus.innerHTML = status(marsRover); //Call status(marsRover) to update the HTML with current rover status.

function createGridDivs() { //Creates 25*42= 1,050 divs with id's to track coordinates already searched for water.
        for (let j=250; j>=0; j-=10){
            for(let i=0; i<=420; i+=10) {
                gridDivs += `<div id = x${i}y${j}></div>`; 
            }
        }
        console.log(gridDivs);

        return gridDivs;
    }

grid.innerHTML = createGridDivs(); //Create the grid divs for the map log

function logSearchStatus(data) { //Changes the background color to red for each div id that matches the coordinates.
        for (let i=0; i<data.length; i++){
            let redGrid = document.getElementById(`x${data[i].xCoordinate}y${data[i].yCoordinate}`);
            redGrid.style.backgroundColor = "red";
            console.log(redGrid)
        }
        }

function arrowButtonsAccountForHillClimbing(data) {
        if (data.mode === "HILL_CLIMBING") {
            let commands = [new Command ('MODE_CHANGE', 'HILL_CLIMBING')];
            let messageForRover = new Message('Hill climbing mode.', commands);
            data.receiveMessage(messageForRover);
            if (data.mode === "LOW_POWER") {
                alert("Low power. Exiting hill climbing mode.")
                coordinateStatus.innerHTML = status(data);
                hillClimbingButton.innerHTML = "Hill Climbing"
                hillClimbingButton.style.backgroundColor = "#5c94ce"
            }
        }
    }

function arrowButtonsAccountForRIMFAX(data) {
        if(data.tool === "RIMFAX") {
            // alert("Searching for water...")
            if ((data.Xposition === waterX) && (data.Yposition === waterY)) {
                alert("Success! You've found water on Mars!")
                rimfaxButton.innerHTML = "RIMFAX"
                rimfaxButton.style.backgroundColor = "#5c94ce"
                waterImage.style.visibility = "hidden"
                waterFoundImage.style.visibility = "visible"
                //Turns the map back to grey when water is found.
                document.getElementById(`x250y130`).innerHTML = `<img src = "./images/Water_Found_Icon.png" id ="waterFound" style = "visibility:visible"/>`
                for (let i=0; i<logCoordinatesSearched.length; i++){
                    let greyGrid = document.getElementById(`x${logCoordinatesSearched[i].xCoordinate}y${logCoordinatesSearched[i].yCoordinate}`);
                    greyGrid.style.backgroundColor = "lightgrey";
                }

            } else {
                //Push current coordinate to the coordinatesSearched array and turn the coordinate red on the map.
                let coordinatesSearched = new Coordinates (data.Xposition, data.Yposition); 
                logCoordinatesSearched.push(coordinatesSearched); 
                console.log(logCoordinatesSearched);
                logSearchStatus(logCoordinatesSearched); 
            }
        }
    }

//BUTTON EVENT LISTENERS
    solarChargingButton.addEventListener("click", function() { 
        if (abortMissionButton.innerHTML !== "Mission Aborted" &&
        waterFoundImage.style.visibility !== "visible") {//button cannot be clicked if mission is aborted or water is found.

            alert("Solar charging: +25W.");

            if((marsRover.mode === "HILL_CLIMBING")) {
            //If in hill climbing mode already, this charges the rover, and puts it back to Hill Climbing mode.
                let commands = [new Command ('MODE_CHANGE', 'SOLAR_CHARGING'), new Command('MODE_CHANGE', 'HILL_CLIMBING')];
                let messageForRover = new Message('Rover charged.', commands);
                marsRover.receiveMessage(messageForRover);
                marsRover.generatorWatts += 10; //HILL_CLIMBING mode automatically subtracts 10W which in this case is not needed.
                coordinateStatus.innerHTML = status(marsRover); //Update the HTML with the current rover status.
                console.log(marsRover);

            } else {
            //Otherwise, Solar Charging will execute by adding 25W to generatorWatts and then change the mode back to normal.
            let commands = [new Command('MODE_CHANGE', 'SOLAR_CHARGING'), new Command ('MODE_CHANGE', 'NORMAL')];
            let messageForRover = new Message('Solar charging: +25W.', commands);
            marsRover.receiveMessage(messageForRover);
            coordinateStatus.innerHTML = status(marsRover); //Update the HTML with current rover status.

            };
        };
    });

    hillClimbingButton.addEventListener("click", function () {
    if (abortMissionButton.innerHTML !== "Mission Aborted" &&
    waterFoundImage.style.visibility !== "visible") {//button cannot be clicked if mission is aborted or water is found.

        if(marsRover.mode === "HILL_CLIMBING"){ 
            //When already in HILL_CLIMBING mode, this button will switch the rover back to normal mode.
            alert("Switching to Normal mode.")
            marsRover.mode = "NORMAL"
            coordinateStatus.innerHTML = status(marsRover); //Updates the HTML with current rover status.
            hillClimbingButton.innerHTML = "Hill Climbing" //Changes button text
            hillClimbingButton.style.backgroundColor = "#5c94ce" //Changes button color

        } else {
            alert("Switching to Hill Climbing mode.")
            //This button will switch the rover mode to HILL_CLIMBING
            marsRover.mode = "HILL_CLIMBING"
            coordinateStatus.innerHTML = status(marsRover); //Updates the HTML with current rover status
            hillClimbingButton.innerHTML = "End Climbing";//Changes button text
            hillClimbingButton.style.backgroundColor = "red"//Changes button color
        };
    };
    });

    rimfaxButton.addEventListener("click", function () {
    if (abortMissionButton.innerHTML !== "Mission Aborted" &&
    waterFoundImage.style.visibility !== "visible") {//button cannot be clicked if mission is aborted or water is found.

        if(marsRover.tool === "RIMFAX"){
            
            //If RIMFAX is in use, terminate use.
            alert("Search for water terminated.")
            let commands = [new Command ("USE_TOOL", "none")];
            let messageForRover = new Message('Searching for water.', commands);
            marsRover.receiveMessage(messageForRover);

            //Hide water searching icon
            waterImage.style.visibility = "hidden"

            //Change RIMFAX button
            rimfaxButton.innerHTML = "RIMFAX"
            rimfaxButton.style.backgroundColor = "#5c94ce";

        } else {
            //Use RIMFAX to search for water.
            alert("Searching for water...")
            let commands = [new Command ("USE_TOOL", "RIMFAX")];
            let messageForRover = new Message('Searching for water.', commands);
            marsRover.receiveMessage(messageForRover);

            //Update RIMFAX button
            rimfaxButton.innerHTML = "End RIMFAX"
            rimfaxButton.style.backgroundColor = "red"        

            //Make water searching icon visible
            waterImage.style.visibility = "visible"

            //Print the coordinates where water can be found to the console.
            console.log(`(${waterX}, ${waterY})`);

            //Push current coordinate to the coordinatesSearched array and turn the coordinate red on the map.
            let coordinatesSearched = new Coordinates (marsRover.Xposition, marsRover.Yposition);
            logCoordinatesSearched.push(coordinatesSearched);
            console.log(logCoordinatesSearched);
            logSearchStatus(logCoordinatesSearched);
        
            if ((marsRover.Xposition === waterX) && (marsRover.Yposition === waterY)) {
                alert("Success! You've found water on Mars!")
                rimfaxButton.innerHTML = "RIMFAX"
                rimfaxButton.style.backgroundColor = "#5c94ce"
                waterImage.style.visibility = "hidden"
                waterFoundImage.style.visibility = "visible"

                //Turns the map grey again if water is found, and adds water_found icon
                document.getElementById(`x250y130`).innerHTML = `<img src = "./images/Water_Found_Icon.png" id ="waterFound" style = "visibility:visible"/>`
                for (let i=0; i<logCoordinatesSearched.length; i++){
                    let greyGrid = document.getElementById(`x${logCoordinatesSearched[i].xCoordinate}y${logCoordinatesSearched[i].yCoordinate}`);
                    greyGrid.style.backgroundColor = "lightgrey";
                }
            }    
        }

    }
    }) 
    
    abortMissionButton.addEventListener("click", function () {
        if (abortMissionButton.innerHTML !== "Mission Aborted" &&
        waterFoundImage.style.visibility !== "visible") {//button cannot be clicked if mission is aborted or water is found.        if(confirm("Confirm that you want to abort the mission.")) { 
            //Change Abort Mission Button
            abortMissionButton.innerHTML = "Mission Aborted"
            abortMissionButton.style.backgroundColor = "red"

            //Change other buttons back to normal
            hillClimbingButton.innerHTML = "Hill Climbing" 
            hillClimbingButton.style.backgroundColor = "#5c94ce" 
            rimfaxButton.innerHTML = "RIMFAX"
            rimfaxButton.style.backgroundColor = "#5c94ce"
            waterImage.style.visibility = "hidden"

            //Update rover status section to reflect the mission has been aborted.
            coordinateStatus.innerHTML = `❌ Mission aborted ❌`;
            // coordinateStatus.style.color = "red"
            // coordinateStatus.style.fontSize = "40px"

            //Move Rover image to (0, 0)
            rover.style.bottom = "0px"
            rover.style.left = "0px"

            //Update rover coordinates to (0, 0)
            marsRover.Yposition = 0;
            marsRover.Xposition = 0;

        };
    });
    
    upButton.addEventListener("click", function() {

        if ((marsRover.Yposition < 250) && //button cannot be clicked if Ycoordinate exceeds 250 
        (abortMissionButton.innerHTML !== "Mission Aborted") && //button cannot be clicked if mission is aborted
        (waterFoundImage.style.visibility !== "visible")) {//button cannot be clicked if water is found.

            //Update rover Y-coordinate
            let commands = [new Command ("MOVE_Y", 10)];
            let messageForRover = new Message('Move rover.', commands);
            marsRover.receiveMessage(messageForRover);
            console.log(marsRover);

            //Account for hill climbing mode
            arrowButtonsAccountForHillClimbing(marsRover);
            
            //Account for RIMFAX
            arrowButtonsAccountForRIMFAX(marsRover);

            console.log(marsRover)

            //Move rover image on screen
            rover.style.bottom = marsRover.Yposition + "px";
            
            //Show updated status on the status bar
            coordinateStatus.innerHTML = status(marsRover);
        }
    
    })
    
    downButton.addEventListener("click", function() {
        if ((marsRover.Yposition > 0) && //button cannot be clicked if Ycoordinate is 0 or less
        (abortMissionButton.innerHTML !== "Mission Aborted") && //button cannot be clicked if mission is aborted
        (waterFoundImage.style.visibility !== "visible")) {//button cannot be clicked if water is found.

            //Update rover Y-coordinate
            let commands = [new Command ("MOVE_Y", -10),];
            let messageForRover = new Message('Move rover then check status.', commands);
            marsRover.receiveMessage(messageForRover);
            console.log(marsRover);

            //Account for hill climbing mode
            arrowButtonsAccountForHillClimbing(marsRover);

            //Account for RIMFAX
            arrowButtonsAccountForRIMFAX(marsRover);
            
            //Move rover image on screen
            rover.style.bottom = marsRover.Yposition + "px";

            //Show updated status on the status bar
            coordinateStatus.innerHTML = status(marsRover);
        } 
    })
    
    leftButton.addEventListener("click", function() {

        if((marsRover.Xposition > 0) && //button cannot be clicked if Xcoordinate 0 or less
        (abortMissionButton.innerHTML !== "Mission Aborted") && //button cannot be clicked if mission is aborted
        (waterFoundImage.style.visibility !== "visible")) {//button cannot be clicked if water is found.

            //Update rover X-coordinate
            let commands = [new Command ("MOVE_X", -10),];
            let messageForRover = new Message('Move rover then check status.', commands);
            marsRover.receiveMessage(messageForRover);
            console.log(marsRover);

            //Account for hill climbing mode
            arrowButtonsAccountForHillClimbing(marsRover);

            //Account for RIMFAX
            arrowButtonsAccountForRIMFAX(marsRover);

            //Move rover image on screen
            rover.style.left = marsRover.Xposition + "px";

            //Show updated status on the status bar
            coordinateStatus.innerHTML = status(marsRover);
        }
    })
    
    rightButton.addEventListener("click", function() {

        if((marsRover.Xposition < 420) && //button cannot be clicked if Xcoordinate exceeds 420
        (abortMissionButton.innerHTML !== "Mission Aborted") && //button cannot be clicked if mission is aborted
        (waterFoundImage.style.visibility !== "visible")) {//button cannot be clicked if water is found.

            //Update rover X-coordinate
            let commands = [new Command ("MOVE_X", 10),];
            let messageForRover = new Message('Move rover then check status.', commands);
            marsRover.receiveMessage(messageForRover);
            console.log(marsRover);

            //Account for hill climbing mode
            arrowButtonsAccountForHillClimbing(marsRover);

            //Account for RIMFAX
            arrowButtonsAccountForRIMFAX(marsRover);

            //Move rover image on screen
            rover.style.left = marsRover.Xposition + "px";

            //Show updated status on the status bar
            coordinateStatus.innerHTML = status(marsRover);
        }
    })
    
    });
    