import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
const HOST = "http://localhost:8080"

let fileName = null;

const indexCode = [
    'import dotenv from "dotenv"\n',
    'dotenv.config()\n',
    '\n',
    'import mongoose from "mongoose";\n',
    'mongoose.connect(process.env.DB as string)\n',
    '\n',
    'const port = process.env.PORT\n',
    '\n',
    'import express, {Request, Response} from "express";\n',
    'const app = express()\n',
    '\n',
    'app.listen(port,()=>console.log(`Server running on ${port}`))\n',
    '\n',
    'app.use(express.urlencoded({extended: false}))\n',
    'app.use(express.json())\n',
    'app.use((req: Request, res: Response)=>{ res.send("Your router goes here") })\n'
];


const packageJsonArray = [
    '{',
    `  "name": "${fileName}",`,
    '  "version": "1.0.0",',
    '  "main": "index.js",',
    '  "scripts": {',
    '    "test": "echo \\"Error: no test specified\\" && exit 1",',
    '    "start": "nodemon --exec ts-node src/index.ts"',
    '  },',
    '  "keywords": [],',
    '  "author": "",',
    '  "license": "ISC",',
    '  "description": "",',
    '  "devDependencies": {',
    '    "@types/cors": "^2.8.17",',
    '    "@types/express": "^5.0.0",',
    '    "@types/morgan": "^1.9.9",',
    '    "@types/node": "^22.13.1",',
    '    "nodemon": "^3.1.9",',
    '    "ts-node": "^10.9.2",',
    '    "typescript": "^5.7.3"',
    '  },',
    '  "dependencies": {',
    '    "@aws-sdk/s3-request-presigner": "^3.750.0",',
    '    "axios": "^1.7.9",',
    '    "dotenv": "^16.4.7",',
    '    "express": "^4.21.2",',
    '    "mongoose": "^8.10.0",',
    '    "uuid": "^11.0.5"',
    '  }',
    '}'
];

const tsconfigArray = [
    '{',
    '  "compilerOptions": {',
    '    "target": "ES2020",',
    '    "module": "CommonJS",',
    '    "strict": true,',
    '    "esModuleInterop": true,',
    '    "skipLibCheck": true,',
    '    "forceConsistentCasingInFileNames": true,',
    '    "strictPropertyInitialization": false,',
    '    "experimentalDecorators": true,',
    '    "emitDecoratorMetadata": true,',
    '    "outDir": "./dist"',
    '  },',
    '  "include": ["src"],',
    '  "exclude": ["node_modules"]',
    '}'
];
const nodemonConfigArray = [
    '{',
    '  "watch": ["src"],',
    '  "ext": "ts",',
    '  "exec": "ts-node src/index.ts"',
    '}'
];


const app = async () => {
    const root = process.cwd()
    const argv = process.argv.slice(2)

    if (argv.length !== 1) {
        const title = chalk.bgRed.white.bold(' ERROR ')
        const message = chalk.red(`Invalid flag - ${chalk.yellow(argv.slice(1).join(' '))}`)
        console.error(title, message)
        return
    }

    const serviceName = argv[0]

    const regExp = /^[a-z]+(-[a-z]+)?$/

    if (!regExp.test(serviceName)) {
        const title = chalk.bgRed.white.bold(' ERROR ')
        const message = chalk.red(`Service name contains only lowercase letter or hyphen between words - ${chalk.yellow(argv.slice(1).join(' '))}`)
        console.error(title, message)
        return
    }

    const { port } = await inquirer.prompt([{
        type: 'input',
        name: 'port',
        message: 'Enter service port\n'
    }])

    const folderPath = path.join(root, 'services', serviceName)
    const isFolderExist = fs.existsSync(folderPath)

    if (isFolderExist) {
        const title = chalk.bgRed.white.bold(' ERROR ')
        const message = chalk.red(`Service already exist - ${chalk.yellow(serviceName)}`)
        console.error(title, message)
        return
    }
    fileName = serviceName.split("-")[0];

    try {

        const srcFolderPath = path.join(folderPath, 'src');
        const fileMappings = {
            'index.ts': indexCode.join(""),
            [`${fileName}.routes.ts`]: "",
            [`${fileName}.controller.ts`]: "",
            [`${fileName}.model.ts`]: "",
            [`${fileName}.interface.ts`]: "",
            [`${fileName}.enum.ts`]: "",
            [`${fileName}.dto.ts`]: "",
            [`${fileName}.service.ts`]: "",
            [`${fileName}.middleware.ts`]: "",
        };

        fs.mkdirSync(folderPath, { recursive: true });
        fs.mkdirSync(srcFolderPath);

        for (const [file, content] of Object.entries(fileMappings)) {
            const filePath = path.join(srcFolderPath, file);
            fs.writeFileSync(filePath, content, "utf-8");
        }

        fs.writeFileSync(path.join(folderPath, 'package.json'), packageJsonArray.join(""), 'utf-8');

        fs.writeFileSync(path.join(folderPath, 'nodemon.json'), nodemonConfigArray.join('\n'), 'utf-8');

        const envArray = [
            `PORT=${port}`,
            `HOST=http://localhost:8080`,
            `SERVER_SECRET=5eb1961fb03a7e66b6dbe8c9697b7392192fc1a4f3f0bf644fb6ce3982169d21`
        ];

        const envPath = path.join(folderPath, '.env');
        fs.writeFileSync(envPath, envArray.join('\n'), 'utf-8');

        const title = chalk.bgGreen.white.bold(' SUCCESS ')
        const message = chalk.yellow(`${serviceName} is created !`)
        console.log(title, message)
        return
    }
    catch (err: any) {
        const title = chalk.bgRed.white.bold(' ERROR ')
        const message = chalk.red(`Failed to create service - ${chalk.yellow(err.message)}`)
        console.error(title, message)
    }
}

app()