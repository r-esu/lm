// Importing necessary modules and types from local files and external dependencies
import { r_args } from './arg_handler.ts';
import { console_navigation_impl, pick_random_audio_impl } from './impl.ts';
import { check_for_command, supported_arguments, type sound_schema } from './exports.ts'

import * as path from "https://deno.land/std@0.215.0/path/mod.ts"
import csv_converter from 'npm:csvtojson'

// Function to execute the main program
const run = async (): Promise<void> => {
    // Checking for command-line arguments and parsing the command
    const get_command = check_for_command(r_args);
    await parse_command(get_command ? get_command : 'rand');
}

// Default path for the CSV file
const default_csv_file_path: string = path.join(import.meta.dirname || '', '/mexport.csv');

// Function to parse CSV file into JSON format
const parse_csv_file = (file_path: string = default_csv_file_path) => csv_converter().fromFile(file_path);

// Function to remove duplicates from an array of sound_schema objects based on Detail_URL
const rem_dupl_from_json_array = (json_array: sound_schema[]) => json_array.filter((obj, index, self) =>
    index === self.findIndex((t) =>
        t.Title == obj.Title &&
        t.Artists == obj.Artists
    )
);

// Function to parse commands and execute corresponding actions
const parse_command = async (command: keyof typeof supported_arguments): Promise<void> => {
    // Parsing CSV file and removing duplicates
    const parsed_csv_file = rem_dupl_from_json_array(await parse_csv_file());
    switch (command) {
        case 'list':
            // Executing console navigation for the 'list' command
            console_navigation_impl(parsed_csv_file);
            break;

        case 'rand':
        {
            // Executing random sound/music pick for the 'rand' command
            pick_random_audio_impl(parsed_csv_file);
            break;
        }
    }
}

// Exporting functions for external use
export {
    run,
    parse_command
};
