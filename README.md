# LM

LM is a lightweight tool built on Deno and TypeScript designed to parse a structured `.csv` file to represent a list of sounds or music. With LM, you can easily choose & pick your favourite sounds/music by cli and pick a random one from the list with simple commands.

### Showcase :-
![lm-showcase](/readme-assets/lm-example.gif)

## Installation
1. Ensure you have Deno installed: [Deno Installation Guide](https://docs.deno.com/runtime/manual/getting_started/installation) 

2. Clone the repo: ```bash 
git clone https://github.com/h-ec/lm```

3. Then run one of the commands below using your prefered package manager

### Deno:
```bash
deno run build:cos
```
OR
```bash
deno compile -A --output ./build/lm.(Executable file format (default is .exe)) ./src/index.ts
```

### Bun:
```bash
bun run build:cos
```
### Npm:
```bash
npm run build:cos
```

### Yarn:
```bash
yarn build:cos
```

### Pnpm:
```bash
pnpm run build:cos
```

## Usage
### Command Line Interface (CLI)
#### Display the List of Sounds/Music

To display the list of sounds/music, use one of the following commands:

```bash
lm -l|l|list
```

#### Display the List Sorted from newest to oldest (If there's a Time field in csv) of Sounds/Music

To display the list of sounds/music sorted, use one of the following commands:

```bash
lm -sl|sl|slist
```


#### Pick a Random Sound/Music

To pick a random sound/music from the list, use one of the following commands:

```bash
lm -r|r|rand
```


### CSV File Structure

LM expects a `.csv` file with the following structure:

```Copy code
Title,Artists
Example title,Maybe an artist
```

Ensure your `.csv` file adheres to this structure for LM to parse it correctly.
## License

LM is licensed under the Apache License 2.0. See the [LICENSE](https://www.apache.org/licenses/LICENSE-2.0.txt)  file for details.
## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Please ensure that any contributions adhere to our [Code of Conduct](https://www.apache.org/foundation/policies/conduct) .
## Acknowledgements

LM is built with Deno and TypeScript, leveraging the power of these technologies to provide a lightweight and efficient tool.
## Contact

For any inquiries or support, feel free to contact @h.ec (Discord)

**Note:**  This project is still under development. Feedback and contributions are highly appreciated!