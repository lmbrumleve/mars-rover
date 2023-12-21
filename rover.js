import Message from './message.js'
import Command from './command.js'


export default class Rover {
   constructor(Xposition = 0, Yposition = 0, mode = "NORMAL", generatorWatts = 110, tool = "none") {
      this.Xposition = Xposition;
      this.Yposition = Yposition;
      this.mode = mode;
      this.generatorWatts = generatorWatts;
      this.tool = tool;
   }

   receiveMessage(message) {
      //message is a Message(name, commands) object. 
      //commands is a Command(commandType, value) object.
      
      let results = [];

      for (let i=0; i < message.commands.length; i++) {
         let completeObject = { 
            completed: true
         }
         let messageCommands = message.commands[i]

//MODE_CHANGE Command
         if (messageCommands.commandType === "MODE_CHANGE") {
            if (messageCommands.value === "NORMAL" || 
            messageCommands.value === "LOW_POWER") {
               this["mode"] = messageCommands.value; //Changes the rover mode appropriately.
               
            } else if (messageCommands.value === "SOLAR_CHARGING") { //This mode adds 25W to generatorWatts, up to 110W.
               if (this["generatorWatts"] <= 110 && this["generatorWatts"] > 85) {
                  this["mode"] = messageCommands.value; 
                  this["generatorWatts"] = 110; //The max generatorWatts is 110.

               } else if (this["generatorWatts"] <= 85) {
                  this["mode"] = messageCommands.value; 
                  this["generatorWatts"] += 25; 
               } 

            } else if (messageCommands.value === "HILL_CLIMBING") { //This mode causes the rover to lose 10W each time a MOVE command is called.
               if(this["generatorWatts"] >= 10) {
                  this["mode"] = messageCommands.value; 
                  this["generatorWatts"] -= 10;
                  if (this["generatorWatts"] < 10) { //Triggers LOW_POWER mode if generatorWatts goes below 10W after 10W is subtracted for Hill Climbing.
                     this["mode"] = "LOW_POWER";
                  }

               } else if (this["generatorWatts"] < 10) {  //Rover will remain in LOW_POWER mode (not HILL_CLIMBING) if generatorWatts is below 10W.
                  this["mode"] = "LOW_POWER"; 
               }

            } else {
               completeObject["completed"] = false; //If one of the above specified modes is not utilized, the rover will not complete the action.
             }
            results.push(completeObject);

//USE_TOOL Command
         } else if (messageCommands.commandType === "USE_TOOL") {
            this["tool"] = messageCommands.value; //Changes the tool to RIMFAX (Rover Imager for Mars' Subsurface Exploration)
            results.push(completeObject);

//MOVE_X Command
         } else if (messageCommands.commandType === "MOVE_X") { //Moves the rover the specified value on the X-axis.
            if (this.mode === "LOW_POWER") { //Does not allow rover to be moved while in LOW_POWER mode.
               completeObject["completed"] = false;
            } else if (this.mode === "HILL_CLIMBING") { 
               //HILL_CLIMBING mode will move the rover the specified value (accounted for here) while subtracting 10W (accounted for in HILL_CLIMBING).
               this["Xposition"] += messageCommands.value; //Moves the rover the specified value.
               // this["generatorWatts"] -= 10;
                  if (this["generatorWatts"] < 10) { //Puts rover into LOW_POWER if generatorWatts falls below 10W.
                  this["mode"] = "LOW_POWER";
                  }
            } else {
            this["Xposition"] += messageCommands.value; //Moves the rover the specified value.
            this["generatorWatts"] -= 2.5; //Each move costs 2.5W.
               if (this["generatorWatts"] < 10) { //Puts rover into LOW_POWER if generatorWatts falls below 10W.
               this["mode"] = "LOW_POWER";
               }
            }
            results.push(completeObject);

//MOVE_Y Command
         } else if (messageCommands.commandType === "MOVE_Y") {//Moves the rover the specified value on the Y-axis.
            if (this.mode === "LOW_POWER") { //Does not allow rover to be moved while in LOW_POWER mode.
               completeObject["completed"] = false;
            } else if (this.mode === "HILL_CLIMBING") {
            //HILL_CLIMBING mode will move the rover the specified value (accounted for here) while subtracting 10W (accounted for in HILL_CLIMBING).
               this["Yposition"] += messageCommands.value; //Moves the rover the specified value.
               // this["generatorWatts"] -= 10;
                  if (this["generatorWatts"] < 10) {//Puts rover into LOW_POWER if generatorWatts falls below 10W.
                  this["mode"] = "LOW_POWER";
                  }            
            } else {
            this["Yposition"] += messageCommands.value; //Moves the rover the specified value.
            this["generatorWatts"] -= 2.5; //Each move costs 2.5W.
               if (this["generatorWatts"] < 10) {//Puts rover into LOW_POWER if generatorWatts falls below 10W.
               this["mode"] = "LOW_POWER";
               }
            }
            results.push(completeObject);

//STATUS_CHECK Command
         } else if (messageCommands.commandType === "STATUS_CHECK") { //Prints the current rover object to the console.
            completeObject["roverStatus"] = {
               Xposition: this.Xposition,
               Yposition: this.Yposition,
               mode: this.mode,
               generatorWatts: this.generatorWatts,
               tool: this.tool
            } 
            results.push(completeObject); 

//Other commands are not allowed.
         } else {
            completeObject["completed"] = false;
            results.push(completeObject);
         }
     
      }

      let response = {
         message: message.name,
         results: results
      }

      return response; 
//response is an object containing two keys: one is the message and one is an array of objects stating if the 
//command was completed, and the rover status will be placed here as well for STATUS_CHECK.

   }

};

//Code Review 
let rover = new Rover();    // Passes 100 as the rover's Xposition.

// //Check initial rover status.
// let commands = [new Command("STATUS_CHECK")];
// let messageForRover = new Message('Check rover status.', commands);
// let response = rover.receiveMessage(messageForRover);

// // console.log(response);
// console.log(response.results[0]["roverStatus"]["Xposition"]);

//Move rover, check status again.
// let commands = [
//    new Command ("MOVE", 200), 
//    new Command ("STATUS_CHECK")
// ];
// let messageForRover = new Message('Move rover then check status.', commands);
// let response = rover.receiveMessage(messageForRover);

// console.log(response.results);

//Change mode to low power, check status.
// let commands = [
//    new Command('MODE_CHANGE', 'LOW_POWER'), 
//    new Command('STATUS_CHECK')
// ];
// let messageForRover = new Message('Mode change to low power, check status.', commands);
// let response = rover.receiveMessage(messageForRover);

// console.log(response.results);

//Change mode to low power, move rover, check status. 
//Change mode to normal, move rover, check status.
// let commands = [
//    new Command('MODE_CHANGE', 'LOW_POWER'), 
//    new Command("MOVE", 200), 
//    new Command('STATUS_CHECK'),
//    new Command('MODE_CHANGE', 'NORMAL'), 
//    new Command("MOVE", 200), 
//    new Command('STATUS_CHECK')];
// let messageForRover = new Message('Mode change to low power, move rover, check status. Change mode to normal, move rover, check status.', commands);
// let response = rover.receiveMessage(messageForRover);

// console.log(response.results);

// Student grader test case.
// Move rover, status check. Mode change to low power, move rover, status check.
   //  let commands = [
   //     new Command('MOVE', 4321),
   //     new Command('STATUS_CHECK'),
   //     new Command('MODE_CHANGE', 'LOW_POWER'),
   //     new Command('MOVE', 3579),
   //     new Command('STATUS_CHECK')
   //  ];
   //  let message = new Message('TA power', commands);
   //  let response = rover.receiveMessage(message);

   //  console.log(response.results)

//Change mode to solar charging, check status.
// let commands = [
//    new Command('MODE_CHANGE', 'SOLAR_CHARGING'), 
//    new Command('STATUS_CHECK')
// ];
// let messageForRover = new Message('Mode change to solar charging, check status.', commands);
// let response = rover.receiveMessage(messageForRover);

// console.log(response.results);

//Change mode to hill climbing, check status.
// let commands = [
//    new Command ('MODE_CHANGE', 'SOLAR_CHARGING'),
//    new Command('STATUS_CHECK'),
//    new Command('MODE_CHANGE', 'HILL_CLIMBING'), 
//    new Command('STATUS_CHECK')
// ];
// let messageForRover = new Message('Change to hill climbing mode, check status.', commands);
// let response = rover.receiveMessage(messageForRover);

// console.log(response.results);

//Use RIMFAX tool
let commands = [new Command ("USE_TOOL"), new Command ("MOVE_Y", 10), new Command ("STATUS_CHECK")];
let messageForRover = new Message('Searching for water.', commands);
let response = rover.receiveMessage(messageForRover);

console.log(response);
