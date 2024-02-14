const commands = {
    'list': ['l', 'list', '-l'],
    'rand': ['r', 'rand', '-r']
};

const check_for_command = (r_args: ( ) => string[]): keyof typeof commands | null => {
    const args = r_args();
    
    for (const key in commands) {
        if (Object.prototype.hasOwnProperty.call(commands, key)) {
            const aliases = (commands as { [key: string]: string[] })[key];
            for (const arg of args) {
                if (!aliases.includes(arg)) return null;
                return key as keyof typeof commands;
            }
        }
    }
    
    return null; // No matching command found
}

type sound_schema = {
    ACR_ID  : string,
    Title   : string,
    Artists : string,
    Time    : string,
    Source_URL: string,
    Detail_URL: string,       
}

export {
    commands,
    check_for_command,
};

export type {
    sound_schema
};