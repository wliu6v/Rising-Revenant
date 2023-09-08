import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import worldTileset from "../assets/tilesets/world.png";
import { TileAnimations, Tileset } from "../artTypes/world";
import { Sprites, Assets, Maps, Scenes } from "./constants";

const ANIMATION_INTERVAL = 200;

export const phaserConfig = {
    sceneConfig: {
        [Scenes.Main]: defineSceneConfig({

            assets: {
                [Assets.CastleHealthyAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleHealthyAsset,
                    path: "src/assets/castleHealthy.png",
                },
                [Assets.MapPicture]: {
                    type: AssetType.Image,
                    key: Assets.MapPicture,
                    path: "src/assets/mapReve.png",
                }
            },
            maps: {
            },
            sprites: {
                [Sprites.Castle]: {
                    assetKey: Assets.CastleHealthyAsset,
                },
                [Sprites.Map]: {
                    assetKey: Assets.MapPicture,
                },
            },
            animations: [
                
            ],
            tilesets: {
                
            },
        }),
    },
    scale: defineScaleConfig({
        parent: "phaser-game",
        zoom: 1,
        mode: Phaser.Scale.NONE,
    }),
    // cameraConfig: defineCameraConfig({
    //     pinchSpeed: 1,
    //     wheelSpeed: 1,
    //     maxZoom: 3,
    //     minZoom: 1,
    // }),

    cullingChunkSize: 16 * 16,
};
