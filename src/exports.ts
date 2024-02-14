// Command arguments
const supported_arguments = {
    'list'          : ['l' , 'list' , '-l'  ],
    'slist'         : ['sl', 'slist', '-sl' ],
    'rand'          : ['r' , 'rand' , '-r'  ]
};

const check_for_command = (r_args: ( ) => string[]): keyof typeof supported_arguments | null => {
    const args = r_args();
    
    // We check if the command contains any of the supported_arguments and we return the name of the argument
    for (const key in supported_arguments) {
        if (Object.prototype.hasOwnProperty.call(supported_arguments, key)) {
            const aliases = (supported_arguments as { [key: string]: string[] })[key];
            for (const arg of args) {
                if (aliases.includes(arg))
                    return key as keyof typeof supported_arguments;
            }
        }
    }
    
    return null; // No matching command found
}

// A sound_schema to make sure the project is type safe
type sound_schema = {
    ACR_ID  ?: string,
    Title    : string,
    Artists  : string,
    Time    ?: string,
    Source_URL?: string,
    Detail_URL?: string,       
}

export {
    supported_arguments,
    check_for_command,
};

export type {
    sound_schema
};