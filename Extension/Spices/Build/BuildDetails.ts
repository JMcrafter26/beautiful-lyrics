// System Imports
import { join } from "jsr:@std/path@0.223.0"

// Spicetify Imports
import { GetSpicetifyExtensionsDirectory } from "../Spicetify/Terminal.ts"

// Attempt to grab our build.json
const buildJSON = JSON.parse(await Deno.readTextFile("./build.json"))

// Start exporting/validating our properties
export const BuildName: string = buildJSON.Name
if (BuildName.match(/^[\w_-]+$/) === null) {
	throw new Error(`Invalid Build-Name (${BuildName})`)
}
export const SpicetifyEntryPoint: string = `${BuildName}.mjs`
// Resolve gracefully when spicetify is not installed (e.g. CI/build-only environments)
export const SpicetifyEntryPointPath: string = await (
	GetSpicetifyExtensionsDirectory()
	.catch(() => "/tmp")
	.then(dir => join(dir, SpicetifyEntryPoint))
)

export const BuildVersion: string = buildJSON.Version
if (BuildVersion.match(/^\d+\.\d+\.\d+$/) === null) {
	throw new Error(`Invalid Build-Version (${BuildVersion})`)
}

export const BuildReleaseLocation: (
	{
		Type: "GitHub",
		User: string,
		Repository: string
	}
	| {
		Type: "Hosted",
		Url: string,
		VersionCheckUrl: string
	}
) = buildJSON.ReleaseLocation