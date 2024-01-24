import {Command} from 'commander'

const program = new Command()

program
    .option('-d', 'Variables para debug', false)
    .option('-p, --persistence <type>', 'Tipo de persistencia: file o mongo')

program.parse()

export const opts = program.opts()

console.log('Options: ', program.opts())