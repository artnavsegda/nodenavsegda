// Unit: Workshop

function workshopLightMenu(minilist)
{
   this.Show_page = function(){
      IR.ShowPopup("workshopLightMenu", 2001);
   };
   this.Close_page = function(){};
   var roomPage = IR.CreateItem(IR.ITEM_POPUP, "workshopLightMenu", 0, 0, 640, 1136);
   roomPage.GetState(0).Color = backgroundColor;
   var roomFancyHeader = new LightsPageHeader(roomPage, "Свет", 0, 0, 640, 73, minilist, this);
   
   FancyHeader(roomPage, "МАСТЕРСКАЯ", 0, 73, 640, 73);
   
   var lightTileContainer = new TileContainer(roomPage, "Мастерская", 0, 146, 640, 1063);
    [
        {n: "Лампа L14.1", s: "[Light][1st_level]Lamp[L14-1]"},
        {n: "Лампа L14.2", s: "[Light][1st_level]Lamp[L14-2]"},
        {n: "Бра L14.3", s: "[Light][1st_level]Bra[L14-3]"},
        {n: "Бра L14.4", s: "[Light][1st_level]Bra[L14-4]"},
    ].forEach(function(element) {
        lightTileContainer.add({
            name: element.n,
            stateID: element.s,
            icon: 'a', 
            onRelease: function() {
                Pulse(element.s + "[Toggle]")
            },
            onLongPress: function(){
                tileModal({
                    title: element.n,
                    levelIn: element.s + "[Level]", 
                    levelOut: element.s + "[Level]",
                });
            }
         });
    });
}