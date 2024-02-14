import { open } from 'https://deno.land/x/open@v0.0.6/index.ts'
import { type sound_schema } from './exports.ts'

// Function to implement navigation and selection through console
const console_navigation_impl = async (
    array_to_navigate: sound_schema[], 
    items_per_page = 10, cursor_position: [number, number] = [1, items_per_page]
): Promise<undefined> => {
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

const pick_random_audio_impl = async ( parsed_csv_file: sound_schema[] ): Promise<never> => {
    // We clear the console because of deno warnings
    console.clear();
    console.clear();
    console.clear();
    
    // Generating a random song and opening its YouTube search
    const schema_menu_list = parsed_csv_file.map(schema =>
        `${schema.Title} - ${schema.Artists}`
    );

    const len : number = Math.floor(Math.random() * schema_menu_list.length);
    const item: string = schema_menu_list[len];
    
    console.log(`%c» %c[${len + 1}] %c"%c${item}%c" %c✔`, `color: magenta; font-weight: regular`, `color: gray; font-weight: regular`, `color: gray; font-weight: regular`, `color: cyan; font-weight: regular`, `color: gray; font-weight: regular`, `color: green; font-weight: regular`);

    // Defining the url of the random song to be url-safe
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(item)}`;
    // Openning the url in the default browser & exiting the application.
    return await open(url).then(() => {
        Deno.exit();
    });
}

export {
    console_navigation_impl,
    pick_random_audio_impl
}