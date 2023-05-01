#!/usr/bin/env node

import os from 'node:os';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { program } from 'commander';
import { dig, search, detail, getNetAssetValue, getAnnualReturns } from '../index.js';

const exportAsCSV = async function (filename, data) {
    const folder = path.join(os.homedir(), 'Documents', 'Fund-digger');
    const filepath = path.join(folder, `${filename}.csv`);
    const content = '\uFEFF' + data.map(row => row.join()).join('\n');

    await mkdir(folder, { recursive: true });
    await writeFile(filepath, content);
}

program.name('fund')
    .version('1.0.0')
    .usage('[command] [options]')
    .hook('preAction', (program, command) => {
        console.time(command.name());
    })
    .hook('postAction', (program, command) => {
        console.timeEnd(command.name());
    });

program.command('dig')
    .description('fund search and dig for details')
    .argument('<keyword>', 'fund name keyword')
    .option('-i, --include <tags...>', 'only include funds that match the specified tags', [])
    .option('-e, --exclude <tags...>', 'exclude funds that match the specified tags', [])
    .option('-m, --morningstar', 'from the built-in Morningstar picks library')
    .action(async (keyword, options) => {
        const hook = function ({ index, total, code, name }) {
            const progress = `${index + 1}`.padStart(`${total}`.length, '0');
            console.log(`${progress}/${total} ${code}:${name} done`);
        };
        const result = await dig(keyword, { ...options, hook });

        if (result.length) {
            const filename = [keyword, ...options.include].join('-');
            await exportAsCSV(filename, result);
        }
    });

program.command('search')
    .description('search funds by keyword')
    .argument('<keyword>', 'fund name keyword')
    .option('-i, --include <tags...>', 'only include funds that match the specified tags', [])
    .option('-e, --exclude <tags...>', 'exclude funds that match the specified tags', [])
    .option('-m, --morningstar', 'from the built-in Morningstar picks library')
    .action(async (keyword, options) => {
        const result = await search(keyword, options);
        const output = [
            `${result.length} funds searched:`,
            ...result.map(({ code, name }) => [code, name].join('\t'))
        ];
        console.log(output.join('\n'));
    });

program.command('detail')
    .description('get fund details')
    .argument('<code>', 'fund code (6 digits)')
    .action(async (code) => {
        const result = await detail(code);
        console.log(JSON.stringify(result, null, 4));
    });

program.command('nav')
    .description('get historical fund net asset value')
    .argument('<code>', 'fund code (6 digits)')
    .option('-s, --start <date>', 'start date in format: yyyy-mm-dd')
    .option('-e, --end <date>', 'end date in format: yyyy-mm-dd')
    .option('-i, --interval <value>', 'interval frequency: month or year')
    .option('-c, --cumulative', 'show cumulative net asset value')
    .option('-r, --reverse', 'reverse the order of results')
    .action(async (code, options) => {
        const result = await getNetAssetValue(code, options);
        console.log(result.map(item => item.join('\t')).join('\n'));
    });

program.command('returns')
    .description('get historical fund annual returns')
    .argument('<code>', 'fund code (6 digits)')
    .option('-r, --reverse', 'reverse the order of results')
    .action(async (code, options) => {
        const result = await getAnnualReturns(code, options);
        console.log(result.map(item => item.join('\t')).join('\n'));
    });

program.parse();
