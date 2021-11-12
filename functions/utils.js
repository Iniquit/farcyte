import chalk from 'chalk';

export { log };

 function log(arg) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const timeDate = new Date().toLocaleDateString('en-US', options);

    console.log(chalk.cyan(`[${timeDate}] `) + chalk.whiteBright(`${arg}`));
}