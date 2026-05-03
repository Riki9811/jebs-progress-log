import { deepFreeze } from '../freeze.js'

// 17 corpi celesti vanilla di Kerbal Space Program. Le mod (Outer Planets, RSS) sono fuori scope.
// I biomi sono id grezzi così come appaiono negli scienceId del save; il displayName per la UI
// è generato al volo da prettyBiomeName quando serve (camelCase → "Title Case").
export const CELESTIAL_BODIES: readonly CelestialBody[] = deepFreeze([
	{
		name: 'Sun',
		displayName: 'Kerbol',
		isLandable: false,
		hasAtmosphere: true,
		hasWater: false,
		biomes: [],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-Orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' }
		],
		ROCScience: []
	},
	{
		name: 'Moho',
		displayName: 'Moho',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: [
			'NorthPole',
			'NorthernSinkholeRidge',
			'NorthernSinkhole',
			'Highlands',
			'Midlands',
			'MinorCraters',
			'CentralLowlands',
			'WesternLowlands',
			'SouthWesternLowlands',
			'SouthEasternLowlands',
			'Canyon',
			'SouthPole'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_MohoStone', displayName: 'Moho Stone' },
			{ name: 'ROCScience_MohoWrinkleRidge', displayName: 'Wrinkle Ridge' }
		]
	},
	{
		name: 'Eve',
		displayName: 'Eve',
		isLandable: true,
		hasAtmosphere: true,
		hasWater: true,
		biomes: [
			'Poles',
			'Lowlands',
			'Midlands',
			'Highlands',
			'Foothills',
			'Peaks',
			'ImpactEjecta',
			'Craters',
			'ExplodiumSea',
			'AkatsukiLake',
			'Shallows',
			'CraterLake',
			'WesternSea',
			'Olympus',
			'EasternSea'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'Flew', displayName: 'Flight' },
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_EveVolcanicRock', displayName: 'Volcanic Rock' },
			{ name: 'ROCScience_EvePancakeDome', displayName: 'Pancake Dome' },
			{ name: 'ROCScience_EveBasaltFormation', displayName: 'Basalt Formation' }
		]
	},
	{
		name: 'Gilly',
		displayName: 'Gilly',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: ['Lowlands', 'Midlands', 'Highlands'],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [{ name: 'ROCScience_GillyRidgeline', displayName: 'Gilly Ridgeline' }]
	},
	{
		name: 'Kerbin',
		displayName: 'Kerbin',
		isLandable: true,
		hasAtmosphere: true,
		hasWater: true,
		biomes: [
			'IceCaps',
			'NorthernIceShelf',
			'SouthernIceShelf',
			'Tundra',
			'Highlands',
			'Mountains',
			'Grasslands',
			'Deserts',
			'Badlands',
			'Shores',
			'Water'
		],
		specialBiomes: [
			'Baikerbanur',
			'BaikerbanurLaunchPad',
			'IslandAirfield',
			'WoomerangLaunchSite',
			'DesertLaunchSite',
			'DesertAirfield',
			'KSC',
			'Administration',
			'AstronautComplex',
			'Crawlerway',
			'FlagPole',
			'LaunchPad',
			'MissionControl',
			'R&D',
			'R&DCentralBuilding',
			'R&DCornerLab',
			'R&DMainBuilding',
			'R&DObservatory',
			'R&DSideLab',
			'R&DSmallLab',
			'R&DTanks',
			'R&DWindTunnel',
			'Runway',
			'SPH',
			'SPHMainBuilding',
			'SPHRoundTank',
			'SPHTanks',
			'SPHWaterTower',
			'TrackingStation',
			'TrackingStationDishEast',
			'TrackingStationDishNorth',
			'TrackingStationDishSouth',
			'TrackingStationHub',
			'VAB',
			'VABMainBuilding',
			'VABPodMemorial',
			'VABRoundTank',
			'VABSouthComplex',
			'VABTanks'
		],
		recovery: [
			{ name: 'Flew', displayName: 'Flight' },
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' }
		],
		ROCScience: [
			{ name: 'ROCScience_KerbinGiantQuartz', displayName: 'Giant Quartz' },
			{ name: 'ROCScience_KerbinBaobabTree', displayName: 'Baobab Tree' }
		]
	},
	{
		name: 'Mun',
		displayName: 'Mun',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: [
			'Poles',
			'PolarLowlands',
			'Highlands',
			'Midlands',
			'Lowlands',
			'MidlandCraters',
			'HighlandCraters',
			'Canyons',
			'EastFarsideCrater',
			'FarsideCrater',
			'PolarCrater',
			'SouthwestCrater',
			'NorthwestCrater',
			'EastCrater',
			'TwinCraters',
			'FarsideBasin',
			'NortheastBasin'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_MunStone', displayName: 'Mun Stone' },
			{ name: 'ROCScience_MunCrater', displayName: 'Mun Crater' },
			{ name: 'ROCScience_MunLargeCrater', displayName: 'Mun Large Crater' }
		]
	},
	{
		name: 'Minmus',
		displayName: 'Minmus',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: [
			'Poles',
			'Lowlands',
			'Midlands',
			'Highlands',
			'Slopes',
			'Flats',
			'LesserFlats',
			'GreatFlats',
			'GreaterFlats'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_MinmusGreenSandstone', displayName: 'Green Sandstone' },
			{ name: 'ROCScience_MinmusOlivineFormation', displayName: 'Olivine Formation' }
		]
	},
	{
		name: 'Duna',
		displayName: 'Duna',
		isLandable: true,
		hasAtmosphere: true,
		hasWater: false,
		biomes: [
			'Poles',
			'PolarHighlands',
			'PolarCraters',
			'Highlands',
			'Midlands',
			'Lowlands',
			'Craters',
			'MidlandSea',
			'NortheastBasin',
			'SouthernBasin',
			'NorthernShelf',
			'MidlandCanyon',
			'EasternCanyon',
			'WesternCanyon'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'Flew', displayName: 'Flight' },
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_DunaBlueberries', displayName: 'Blueberries' },
			{ name: 'ROCScience_DunaStone', displayName: 'Duna Stone' },
			{ name: 'ROCScience_DunaMeteorite', displayName: 'Duna Meteorite' },
			{ name: 'ROCScience_DunaDune', displayName: 'Duna Dune' }
		]
	},
	{
		name: 'Ike',
		displayName: 'Ike',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: [
			'PolarLowlands',
			'Midlands',
			'Lowlands',
			'EasternMountainRidge',
			'WesternMountainRidge',
			'CentralMountainRange',
			'SouthEasternMountainRange',
			'SouthPole'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [{ name: 'ROCScience_DunaEjectaOnIke', displayName: 'Duna Ejecta' }]
	},
	{
		name: 'Dres',
		displayName: 'Dres',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: ['Poles', 'Highlands', 'Midlands', 'Ridges', 'Lowlands', 'ImpactCraters', 'ImpactEjecta', 'Canyons'],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_DresMeteorite', displayName: 'Dres Meteorite' },
			{ name: 'ROCScience_DresCrater', displayName: 'Dres Crater' }
		]
	},
	{
		name: 'Jool',
		displayName: 'Jool',
		isLandable: false,
		hasAtmosphere: true,
		hasWater: false,
		biomes: [],
		specialBiomes: [],
		recovery: [
			{ name: 'Flew', displayName: 'Flight' },
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' }
		],
		ROCScience: []
	},
	{
		name: 'Laythe',
		displayName: 'Laythe',
		isLandable: true,
		hasAtmosphere: true,
		hasWater: true,
		biomes: [
			'Poles',
			'Shores',
			'Dunes',
			'CrescentBay',
			'TheSagenSea',
			'CraterIsland',
			'Shallows',
			'CraterBay',
			'DegrasseSea',
			'Peaks'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'Flew', displayName: 'Flight' },
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_LaytheStone', displayName: 'Laythe Stone' },
			{ name: 'ROCScience_LaytheGeyser', displayName: 'Laythe Geyser' },
			{ name: 'ROCScience_LaytheBoulder', displayName: 'Laythe Boulder' }
		]
	},
	{
		name: 'Vall',
		displayName: 'Vall',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: [
			'Poles',
			'Highlands',
			'Midlands',
			'Lowlands',
			'Mountains',
			'NortheastBasin',
			'NorthwestBasin',
			'SouthernBasin',
			'SouthernValleys'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_VallIceChunk', displayName: 'Vall Ice Chunk' },
			{ name: 'ROCScience_VallStone', displayName: 'Vall Stone' },
			{ name: 'ROCScience_VallCryovolcano', displayName: 'Cryovolcano' }
		]
	},
	{
		name: 'Tylo',
		displayName: 'Tylo',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: [
			'Highlands',
			'Midlands',
			'Lowlands',
			'Mara',
			'MinorCraters',
			'GagarinCrater',
			'GrissomCrater',
			'GalileioCrater',
			'TychoCrater'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_TyloLightStone', displayName: 'Tylo Light Stone' },
			{ name: 'ROCScience_TyloDarkBoulder', displayName: 'Tylo Dark Boulder' },
			{ name: 'ROCScience_TyloCheckerboard', displayName: 'Tylo Checkerboard' }
		]
	},
	{
		name: 'Bop',
		displayName: 'Bop',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: ['Poles', 'Slopes', 'Peaks', 'Valley', 'Ridges'],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [{ name: 'ROCScience_BopGravelPile', displayName: 'Gravel Pile' }]
	},
	{
		name: 'Pol',
		displayName: 'Pol',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: ['Poles', 'Lowlands', 'Midlands', 'Highlands'],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [{ name: 'ROCScience_PolYellowStones', displayName: 'Yellow Stones' }]
	},
	{
		name: 'Eeloo',
		displayName: 'Eeloo',
		isLandable: true,
		hasAtmosphere: false,
		hasWater: false,
		biomes: [
			'Poles',
			'NorthernGlaciers',
			'Midlands',
			'Lowlands',
			'IceCanyons',
			'Highlands',
			'Craters',
			'Fragipan',
			'BabbagePatch',
			'SouthernGlaciers',
			'MuGlacier'
		],
		specialBiomes: [],
		recovery: [
			{ name: 'SubOrbited', displayName: 'Sub-orbit' },
			{ name: 'Orbited', displayName: 'Orbit' },
			{ name: 'FlewBy', displayName: 'Fly-by' },
			{ name: 'Surfaced', displayName: 'Landed' }
		],
		ROCScience: [
			{ name: 'ROCScience_EelooIceChunk', displayName: 'Eeloo Ice Chunk' },
			{ name: 'ROCScience_EelooBrownBoulder', displayName: 'Eeloo Brown Boulder' },
			{ name: 'ROCScience_EelooBerg', displayName: 'Eeloo Berg' }
		]
	}
])

export const BODY_NAMES: readonly string[] = CELESTIAL_BODIES.map((b) => b.name)

export function findBody(name: string): CelestialBody | undefined {
	return CELESTIAL_BODIES.find((b) => b.name === name)
}

// camelCase → "Title Case", usato come fallback dalla UI quando un biome non ha display custom.
export function prettyBiomeName(rawId: string): string {
	return rawId.replace(/([a-z])([A-Z])/g, '$1 $2')
}
