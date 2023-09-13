import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  getComponentValue,
  EntityIndex
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets } from "../constants";
import { gameEvents,circleEvents } from "./eventSystems/eventEmitter";



export const spawnOutposts = (layer: PhaserLayer) => {
  let entities: EntityIndex[] = []; // this will need to be changed

  const {
    world,
    scenes: {
      Main: { objectPool },
    },
    networkLayer: {
      components: {
        Position,
        Defence,
        WorldEvent,
        ClientClickPosition,
        ClientCameraPosition
      },
    },
  } = layer;

  // start system called on the instantiation of an outpost
  defineEnterSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {
    const outpostObj = objectPool.get(entity, "Sprite");

    if (!entities.includes(entity)) {
      entities.push(entity);
    }

    outpostObj.setComponent({
      id: "texture",
      once: (sprite) => {
        sprite.setTexture(Assets.CastleHealthyAsset); // Assuming "outpost" is the key for the outpost texture.
        sprite.scale = 0.25;
      },
    });
  });



  defineSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {
        const position = getComponentValueStrict(Position, entity);

        const player = objectPool.get(entity, "Sprite")

        player.setComponent({
            id: 'position',
            once: (sprite) => {
                sprite.setPosition(position?.x, position?.y);
            }
        })

    });





  //comp for the center of the camera could be user here for effects, this is optional fully but is wrong anyway
  //   defineSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {});

  defineSystem(world, [Has(WorldEvent), Has(Position)], ({ entity }) => {
    // const playerObj = objectPool.get(entity, "Sprite");
    
    const dataEvent = getComponentValue(WorldEvent, entity);
    let radius = dataEvent?.radius  || 0 ;

    if (radius === 0) {return;}

    const dataEventPosition = getComponentValue(Position, entity);
    let positionX = dataEventPosition?.x  || 0;
    let positionY = dataEventPosition?.y  || 0;

    console.log("should spawn circle");

    const worldEvent = getComponentValueStrict(WorldEvent, entity);
    const positionEvent = getComponentValueStrict(Position, entity);

    // emits the event to the be received
    circleEvents.emit("spawnCircle",positionEvent.x,positionEvent.y,worldEvent.radius,worldEvent.radius);

    
    for (let index = 0; index < entities.length; index++) {
      const entityId = entities[index];
      const playerObj = objectPool.get(entityId, "Sprite");

      // let change : boolean = false;

      playerObj.setComponent({
        id: "texture",
        once: (sprite) => {
            
          const spriteCenterX = sprite.x + (sprite.width * sprite.scale) / 2;
          const spriteCenterY = sprite.y + (sprite.height * sprite.scale) / 2;
          
          const distance = Math.sqrt(
            (spriteCenterX - positionX) ** 2 + (spriteCenterY - positionY) ** 2
          );

          if (distance <= radius) {
            sprite.setTexture(Assets.CastleDamagedAsset);
          } else {
            sprite.setTexture(Assets.CastleHealthyAsset); 
          }
        },
      });

    }
  });


  // click checks for the ui tooltip
  defineSystem(
    world,
    [Has(ClientClickPosition), Has(ClientCameraPosition)],
    ({ entity }) => {

      if (entities.length === 0) {
        return;
      }

      const positionClick = getComponentValueStrict(ClientClickPosition, entity);
      const positionCenterCam = getComponentValueStrict(ClientCameraPosition, entity);
      
      let positionX = positionClick.xFromMiddle + positionCenterCam.x;
      let positionY = positionClick.yFromMiddle + positionCenterCam.y;

      let foundEntity: EntityIndex | null = null; // To store the found entity

      for (let index = 0; index < entities.length; index++) {
        const element = entities[index];
        const playerObj = objectPool.get(element, "Sprite");


        // this should no be like this 
        playerObj.setComponent({
          id: "texture",
          once: (sprite) => {
            const minX = sprite.x;
            const minY = sprite.y;

            const maxX = minX + sprite.width * sprite.scale;
            const maxY = minY + sprite.height * sprite.scale;
            if (
              positionX >= minX &&
              positionX <= maxX &&
              positionY >= minY &&
              positionY <= maxY
            ) {
              foundEntity = element;
              //console.log("this has dected an enitty ")
            }
          },
        });

        if (foundEntity) {
          break;
        }
      }

      if (foundEntity) {
        gameEvents.emit("spawnTooltip", positionClick.xFromOrigin, positionClick.yFromOrigin, foundEntity);
      }
    }
  );
};
