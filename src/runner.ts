// Importing necessary modules and types from local files and external dependencies
import { r_args } from './arg_handler.ts';
import { check_for_command, commands, type sound_schema } from './exports.ts'

import * as path from "https://deno.land/std@0.215.0/path/mod.ts"
import open from 'npm:open'
import csv_converter from 'npm:csvtojson'

// Function to execute the main program
const run = () => {
    // Checking for command-line arguments and parsing the command
    const get_command = check_for_command(r_args);
    parse_command(get_command ? get_command : 'rand');
}

// Default path for the CSV file
const default_csv_file_path: string = path.join(import.meta.dirname || '', '/mexport.csv');

// Function to parse CSV file into JSON format
const parse_csv_file = (file_path: string = default_csv_file_path) => csv_converter().fromFile(file_path);

// Function to remove duplicates from an array of sound_schema objects based on Detail_URL
const rem_dupl_from_json_array = (json_array: sound_schema[]) => json_array.filter((obj, index, self) =>
    index === self.findIndex((t) =>
        t.Detail_URL == obj.Detail_URL
    )
);

// Function to implement navigation and selection through console
const console_navigation_impl = async (array_to_navigate: sound_schema[]) => {
    // Constants for pagination and cursor control
    const items_per_page = 10;
    const cursor_position = [1, items_per_page];
    const schema_menu_list = array_to_navigate.map(schema =>
        `${schema.Title} - ${schema.Artists}`
    );

    // Function to print the current selection and navigation instructions
    const print_selection = () => {
        console.clear();
        console.log(`%cUse the arrow keys to navigate: %c↓ ↑ → ←`, `color: cyan; font-weight: bold`, `color: white; font-weight: bold`);
        console.log(`%cSelect a sound/song 🎧🎸 %c:`, `color: magenta; font-weight: bold`, `color: white; font-weight: bold`)
        console.log();

        const current_c = (cursor_position[1] / 10 - 1) * 10;
        const spliced_schema = [...schema_menu_list].slice(current_c, current_c + items_per_page);

        spliced_schema.forEach((item, len) => {
            const length: number = (len + 1) + cursor_position[1] - items_per_page;

            if (cursor_position[0] != len + 1)
                console.log(`${length}. %c"%c${item}%c"`, `color: white; font-weight: regular`, `color: cyan; font-weight: regular`, `color: white; font-weight: regular`)
            else
                console.log(`%c» %c[${length}] %c"%c${item}%c"`, `color: magenta; font-weight: regular`, `color: gray; font-weight: regular`, `color: gray; font-weight: regular`, `color: cyan; font-weight: regular`, `color: gray; font-weight: regular`)
        });
    }

    // Initial print of selection
    print_selection();

    const stdin = Deno.stdin;

    if (stdin.isTerminal())
        stdin.setRaw(true);

    // Listening for user input
    for await (const data of stdin.readable) {
        if (data[0] === 0x03) // Ctrl+C
            return Deno.exit();

        if (data[0] === 13)
        {
            const len : number = (cursor_position[0] - 1) + cursor_position[1] - items_per_page;
            const item: string = schema_menu_list[len];

            console.log(`%c» %c[${len + 1}] %c"%c${item}%c" %c✔`, `color: magenta; font-weight: regular`, `color: gray; font-weight: regular`, `color: gray; font-weight: regular`, `color: cyan; font-weight: regular`, `color: gray; font-weight: regular`, `color: green; font-weight: regular`);
            return await open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(
                    schema_menu_list[(cursor_position[0] - 1) + cursor_position[1] - items_per_page]
                )}`
            ).then(() => Deno.exit())
        }

        // Handling arrow key inputs
        switch (data[2]) {
            case 65:
                // UP ARROW
                if (cursor_position[1] - 1 <= schema_menu_list.length && cursor_position[1] >= items_per_page) {
                    if (cursor_position[0] == 1) {
                        if (cursor_position[1] != items_per_page || cursor_position[1] - 1 == schema_menu_list.length) cursor_position[1] -= items_per_page;
                        cursor_position[0] = items_per_page
                    }
                    else {
                        cursor_position[0]--
                    }
                    print_selection();
                }
                break;

            case 66:
                // DOWN ARROW
                if (cursor_position[1] - 1 <= schema_menu_list.length) {
                    cursor_position[0]++;
                    if (cursor_position[0] > items_per_page) {
                        cursor_position[1] += items_per_page;
                        cursor_position[0] = 1;
                    }
                    print_selection();
                }
                break;
        }
    }
};

// Function to parse commands and execute corresponding actions
const parse_command = async (command: keyof typeof commands) => {
    // Parsing CSV file and removing duplicates
    const parsed_csv_file = rem_dupl_from_json_array(await parse_csv_file());
    switch (command) {
        case 'list':
            // Executing console navigation for the 'list' command
            console_navigation_impl(parsed_csv_file);
            break;

        case 'rand':
        {
            // Generating a random song and opening its YouTube search
            const schema_menu_list = parsed_csv_file.map(schema =>
                `${schema.Title} - ${schema.Artists}`
            );
            const len : number = Math.floor(Math.random() * schema_menu_list.length);
            const item: string = schema_menu_list[len];
            
            console.log(`%c» %c[${len + 1}] %c"%c${item}%c" %c✔`, `color: magenta; font-weight: regular`, `color: gray; font-weight: regular`, `color: gray; font-weight: regular`, `color: cyan; font-weight: regular`, `color: gray; font-weight: regular`, `color: green; font-weight: regular`);
            const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(item)}`;
            await open(url).then(() => {
                Deno.exit();
            });
            
            break;
        }
    }
}

// Exporting functions for external use
export {
    run,
    parse_command
};
