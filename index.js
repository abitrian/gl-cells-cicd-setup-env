const core = require('@actions/core');
const github = require('@actions/github');
const shell = require('shelljs');
const winston = require('winston');
const exec = require('@actions/exec');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});

try {

    // `configure-npm` 'Flag to configure npm'
    const configureNpm = core.getInput('configure-npm');
    const repositoryNpm = core.getInput('repository-npm');
    const configureBower = core.getInput('configure-bower');
    const repositoryBower = core.getInput('repository-bower');
    const configureGradle = core.getInput('configure-gradle');
    const repositoryGradle = core.getInput('repository-gradle');
    const artifactoryUser = core.getInput('artifactory-user');
    const artifactoryPass = core.getInput('artifactory-password');

    let TOKEN = '';

    // Create a variable to store the output
    let myOutput = '';
    let myError = '';

    // Capture the output of the command
    const options = {};

    options.listeners = {
        stdout: (data) => {
            myOutput += data.toString();
        },
        stderr: (data) => {
            myError += data.toString();
        }
    };

    logger.info(`configureNpm :: ${configureNpm}`);
    logger.info(`repositoryNpm :: ${repositoryNpm}`);
    logger.info(`configureBower :: ${configureBower}`);
    logger.info(`repositoryBower :: ${repositoryBower}`);
    logger.info(`configureGradle :: ${configureGradle}`);
    logger.info(`repositoryGradle :: ${repositoryGradle}`);

    if (configureNpm) {
        logger.info('Set up Artifactory registry');
        exec.exec(`npm config set registry https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/${repositoryNpm};`);
        //exec.exec("cat ~/.npmrc");

        logger.info('Generate token for Artifactory');
        /*shell.exec(`TOKEN=$(curl -s -u${{artifactoryUser}}:${{artifactoryPass}} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth)`);
        shell.exec("cat ~/.npmrc");*/
        // Run the shell command
        exec.exec(`curl -s -u${artifactoryUser}:${artifactoryPass} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth`, undefined, options);

        // Print the captured output
        core.info(`Output: ${myOutput}`);
        core.info(`Error: ${myError}`);

        TOKEN = myOutput;
        
        /*
        exec.exec(`curl -s -u${{ artifactoryUser }}:${{ artifactoryPass }} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth`, (error, stdout, stderr) => {
            logger.info("STDOUT:", stdout, ", STDERR:", stderr);
            TOKEN = stdout;
        });
        */

        logger.info('Store token for Artifactory');
        exec.exec(`echo //artifactory.globaldevtools.bbva.com/artifactory/api/npm/:${TOKEN} >> ~/.npmrc`);
        //shell.exec("cat ~/.npmrc");
    }

} catch (error) {
    core.setFailed(error.message);
}