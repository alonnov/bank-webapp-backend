import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { getOpenApiSpec } from './swagger'

const spec = getOpenApiSpec()

// Save YAML
const outYaml = path.join(__dirname, '../swagger/swagger.yaml')
fs.writeFileSync(outYaml, YAML.stringify(spec))
console.log(`Swagger YAML written to ${outYaml}`)
