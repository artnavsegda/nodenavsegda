let i = 0;
let x = 100;

let list = [
  "[Light][Garage]Ceiling[L0-1]",
  "[Light][Corridor]Ceiling[L0-2]",
  "[Light][Boiler]Ceiling[L0-3]",
  "[Light][Technical_room]Ceiling[L0-4]",
  "[Light][Stairs]Bra[Ll1]",
  "[Light][Stairs]Bra[Ll2]",
  "[Light][Hallway]Ceiling[L1-1]",
  "[Light][Hall]Ceiling[L2-1]",
  "[Light][Hall]Bra[L2-1/1]",
  "[Light][Hall]LED[L2-2]",
  "[Light][Hall]Ceiling[L2-3]",
  "[Light][Hall]LED[L2-4/1]",
  "[Light][Hall]LED[L2-4/2]",
  "[Light][Hall]Lamp[L2-5]",
  "[Light][Hall]LED[L2-6]",
  "[Light][Living_room]Luster[L3-1]",
  "[Light][Living_room]LED[L3-2]",
  "[Light][Living_room]LED[L3-3]",
  "[Light][Living_room]LED[L3-4]",
  "[Light][Kitchen]Luster[L4-1]",
  "[Light][Kitchen]Built-in[L4-2]",
  "[Light][Kitchen]LED[L4-2/1]",
  "[Light][Kitchen]Built-in[L4-3]",
  "[Light][Bathroom]Bra[L5-1]",
  "[Light][Bathroom]Luster[L5-2]",
  "[Light][Bedroom]Luster[L6-1]",
  "[Light][Bedroom]LED[L6-3]",
  "[Light][Bedroom]Bra[L6-5]",
  "[Light][Bedroom]LED[L6-6]",
  "[Light][Bedroom]Bra[L6-7]",
  "[Light][Bedroom]Bra[L6-8]",
  "[Light][Bedroom]Outlet[L6-9]",
  "[Light][Bedroom]Outlet[L6-10]",
  "[Light][Kids_room]Ceiling[L7-1]",
  "[Light][Kids_room]Ceiling[L7-2]",
  "[Light][Kids_room]Bra[L7-3]",
  "[Light][Kids_room]Bra[L7-4]",
  "[Light][Kids_room]Ceiling[L7-5]",
  "[Light][Kids_room]Ceiling[L7-6]",
  "[Light][Kids_room]Bra[L7-7]",
  "[Light][Kids_room]Bra[L7-8]",
  "[Light][Bedroom_bathroom]Ceiling[L8-1]",
  "[Light][Bedroom_bathroom]Mirror[L8-2]",
  "[Light][Kids_room_bathroom]Ceiling[L9-1]",
  "[Light][Kids_room_bathroom]Mirror[L9-2]",
  "[Light][Hall]Bra[L10-1]",
  "[Light][Hall]Ceiling[L10-2]",
  "[Light][Cabinet]Ceiling[L11-1]",
  "[Light][Cabinet]Ceiling[L11-2]",
  "[Light][Cabinet]Bra[L11-3]",
  "[Light][Cabinet]LED[L11-4]",
  "[Light][Cabinet]Luster[Ll3]",
  "[Light][Hall]Bra[L12-1]",
  "[Light][Bathroom]Lamp[L13-1]",
  "[Light][Bathroom]Bra_mirror[L13-2]",
  "[Light][Bathroom][L13-3]",
  "[Light][Bathroom]LED[L13-4]",
  "[Light][1st_level]Lamp[L14-1]",
  "[Light][1st_level]Lamp[L14-2]",
  "[Light][1st_level]Bra[L14-3]",
  "[Light][1st_level]Bra[L14-4]",
  "[Light][Balcony]Lamp[L15-1]"
]

let list2 = list.map((element) => {
  i++;
/*   return         {
    "type": "Lightbulb",
    "uniqueId": element,
    "displayName": "Template",
    "setOn": i,
    "setOff": i + 100,
    "getOn": i
  } */
  return [ element + "[On]", i]
})

let list3 = list.map((element) => {
  x++;
  return [ element + "[Off]", x]
})

console.log(JSON.stringify(list2))

console.log("====================")

console.log(JSON.stringify(list3))