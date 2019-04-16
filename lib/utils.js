const fs = require('fs')
const cliProgress = require('cli-progress')
const camelCase = require('camel-case')

module.exports = {
	convertCSVToJSON,
	allPromisesProgress,
	promisesProgress,
	writeFileAsync,
	readFileAsync
}

async function writeFileAsync(file, data, options) {
	return new Promise((resolve, reject) => 
		fs.writeFile(file, data, options, error => error ? reject(error) : resolve())
	)
}

async function readFileAsync(file, options) {
	return new Promise((resolve, reject) => 
		fs.writeFile(file, options, (error, data) => error ? reject(error) : resolve(data))
	)
}


async function allPromisesProgress(description, promises) {
    return Promise.all(promisesProgress(description, promises))
}

function promisesProgress(description, promises) {
    
    description = description || 'Processed items:'
    
    const bar = new cliProgress.Bar(
		{
			format: `${description} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`
		}, 
		cliProgress.Presets.shades_classic
	)
    
    bar.start(promises.length, 0)
    
    let complete = 0

    return promises.map(async p => {
		await p
		bar.update(++complete)
        if (complete >= bar.getTotal()) {
            bar.stop()
        }
        return p
    })
}

function convertCSVToJSON(source, splitPattern = ",") {
	const result = []
	const lines = source.split(/\r?\n/m)
	const headers = lines[0]
		.split(splitPattern)
		.map(x => x.trim())
		.map(camelCase)

	for(const line of lines.slice(1)) {
		if (!line.trim()) {
			continue
		}
		const values = line.split(splitPattern)
		const keyValues = {}
		headers.forEach((header, i) => 
			keyValues[header] = (values[i] || '').trim()
		)
		result.push(keyValues)
	}
	return result
}
