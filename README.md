# Mars Rover

# LaunchCode Portion
This project started as an assignment that I completed for LaunchCode. At the end of the LaunchCode portion of the assignment, this was a Mars Rover simulation with the following features: 

-COMMANDS
- [X] MOVE: moves the rover to the specified value.
- [X] MODE_CHANGE: changes the rover to the specified mode.
- [X] STATUS_CHECK: prints the rover position, mode, & generator watts to the console.

-MODES
- [X] LOW_POWER: the rover cannot be moved in this state.
- [X] NORMAL

# Independent Portion
I added more to the project for this portfolio, including a web interface. I made several buttons, modes, and tools which are integrated together to interact with the changing coordinates, generator watts, and modes of the rover. Previously it only moved along one axis, now it can move along (x, y) coordinates.

## (x, y) Coordinates

   A user can click the arrow buttons to move the rover along the X- or Y-axis. There is a dashboard at the top that displays the status of the rover, which includes the X- and Y- coordinates, the rover's mode, and the remaining generator watts.

## Hill Climbing Mode

   I also made it so that each time the rover is moved, it will lose 2.5W. I added a hill-climbing mode for when the rover is on rough terrain. When this mode is turned on, the rover loses 10W each time it is moved. When the rover's generator watts reach a level that is below 10W, it will automatically be put into low power mode. In low power mode, the rover cannot be moved until it charges to above 10W again. 

## Solar Charging Mode

   I added a solar charging mode to increase the generator watts by 25W, and this can be utilized as many times as needed in succession. The max generator watts for the         rover is 110W. It cannot be charged above 110W.

## Searching for Water (RIMFAX) Tool + Mini-Map Tracking

   As the user moves the rover using the arrow buttons, the interface shows the rover moving along the surface of Mars. It also shows the rover's position on the mini-map in the top corner of the page. 
      
   I also gave the rover a Radar Imager for Mars' Subsurface Exploration (RIMFAX) tool as well. This tool has the ability to detect water under the surface of Mars. When the RIMFAX tool is turned on, the user gets a notification that the rover is searching for water. Then, for each coordinate that the rover visits in RIMFAX mode, the mini-map marks where the rover has been. If no water is discovered, the coordinate on the mini-map will turn red. If water is discovered, the user is notified that water was found and the mini-map updates with an icon indicating water has been found. 
      
   For the purposes of this project, I designed it so that water is only at a particular (x, y) coordinate that is randomly generated upon loading the page. The coordinate location that water can be found at is printed to the console when the RIMFAX button is clicked.

## Abort Mission

   Finally, there is also an abort mission button, which does just what it says it does. 

## Potential Next Steps

- [ ] Make the webpage responsive 
- [ ] Define areas on the map where hill-climbing mode is necessary in order to move
- [ ] Make multiple coordinates or areas where water can be found, and then allow the rover to keep searching once water is found
- [ ] When the rover reaches the edge of the map, move the map to the next set of coordinates. Let this be represented using this style of moving between screens: https://www.youtube.com/watch?v=dYItW0T5vuY

