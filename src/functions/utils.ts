import chalk from "chalk";

export { log };

function log(arg: string) {
  const timeDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  console.log(chalk.cyan(`[${timeDate}] `) + chalk.whiteBright(`${arg}`));
}
